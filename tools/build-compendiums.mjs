import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BLOCK_SIZE = 32768;
const HEADER_SIZE = 7;
const RECORD = Object.freeze({ FULL: 1, FIRST: 2, MIDDLE: 3, LAST: 4 });
const PACKS = Object.freeze(["weapons", "objects"]);

function buildCrc32cTable() {
  const table = new Uint32Array(256);
  const polynomial = 0x82f63b78;
  for (let i = 0; i < 256; i += 1) {
    let crc = i;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? polynomial : 0);
    }
    table[i] = crc >>> 0;
  }
  return table;
}

const CRC32C_TABLE = buildCrc32cTable();

function crc32c(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC32C_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function maskCrc32c(crc) {
  return ((((crc >>> 15) | (crc << 17)) >>> 0) + 0xa282ead8) >>> 0;
}

function encodeVarint(value) {
  let current = BigInt(value);
  const bytes = [];
  while (current >= 0x80n) {
    bytes.push(Number((current & 0x7fn) | 0x80n));
    current >>= 7n;
  }
  bytes.push(Number(current));
  return Buffer.from(bytes);
}

function decodeVarint(buffer, offset) {
  let value = 0n;
  let shift = 0n;
  let cursor = offset;
  while (cursor < buffer.length && shift <= 63n) {
    const byte = BigInt(buffer[cursor]);
    cursor += 1;
    value |= (byte & 0x7fn) << shift;
    if ((byte & 0x80n) === 0n) return { value, offset: cursor };
    shift += 7n;
  }
  throw new Error(`Varint invalide à l’octet ${offset}.`);
}

function lengthPrefixed(buffer) {
  return Buffer.concat([encodeVarint(buffer.length), buffer]);
}

function encodeLogRecord(data) {
  const chunks = [];
  let offset = 0;
  let blockOffset = 0;
  let begin = true;

  do {
    const leftover = BLOCK_SIZE - blockOffset;
    if (leftover < HEADER_SIZE) {
      chunks.push(Buffer.alloc(leftover));
      blockOffset = 0;
    }

    const available = BLOCK_SIZE - blockOffset - HEADER_SIZE;
    const fragmentLength = Math.min(data.length - offset, available);
    const end = offset + fragmentLength === data.length;
    let type;
    if (begin && end) type = RECORD.FULL;
    else if (begin) type = RECORD.FIRST;
    else if (end) type = RECORD.LAST;
    else type = RECORD.MIDDLE;

    const fragment = data.subarray(offset, offset + fragmentLength);
    const checksumInput = Buffer.concat([Buffer.from([type]), fragment]);
    const header = Buffer.alloc(HEADER_SIZE);
    header.writeUInt32LE(maskCrc32c(crc32c(checksumInput)), 0);
    header.writeUInt16LE(fragmentLength, 4);
    header.writeUInt8(type, 6);
    chunks.push(header, fragment);

    offset += fragmentLength;
    blockOffset += HEADER_SIZE + fragmentLength;
    begin = false;
  } while (offset < data.length);

  return Buffer.concat(chunks);
}

function encodeVersionEdit() {
  const comparator = Buffer.from("leveldb.BytewiseComparator", "utf8");
  return Buffer.concat([
    encodeVarint(1),
    lengthPrefixed(comparator),
    encodeVarint(2),
    encodeVarint(0),
    encodeVarint(3),
    encodeVarint(2),
    encodeVarint(4),
    encodeVarint(0)
  ]);
}

function encodeWriteBatch(entries) {
  const header = Buffer.alloc(12);
  header.writeBigUInt64LE(1n, 0);
  header.writeUInt32LE(entries.length, 8);

  const operations = [];
  for (const [key, value] of entries) {
    const keyBuffer = Buffer.from(key, "utf8");
    const valueBuffer = Buffer.from(JSON.stringify(value), "utf8");
    operations.push(
      Buffer.from([1]),
      lengthPrefixed(keyBuffer),
      lengthPrefixed(valueBuffer)
    );
  }
  return Buffer.concat([header, ...operations]);
}

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(target);
      return entry.isFile() && entry.name.endsWith(".json") ? [target] : [];
    });
}

function readSources(packName) {
  const sourceDirectory = path.join(ROOT, "packs-src", packName);
  const entries = sourceFiles(sourceDirectory).map(file => {
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    const key = document._key;
    if (typeof key !== "string" || !/^!(folders|items)![A-Za-z0-9]{16}$/.test(key)) {
      throw new Error(`Clé absente ou invalide dans ${path.relative(ROOT, file)}.`);
    }
    if (key.startsWith("!items!")) {
      const description = document.system?.description;
      if (typeof description !== "string" || !description.trim()) {
        throw new Error(`Description absente dans ${path.relative(ROOT, file)}.`);
      }
      if (/[<>]/.test(description)) {
        throw new Error(`Balise HTML interdite dans la description de ${path.relative(ROOT, file)}.`);
      }
    }
    delete document._key;
    return [key, document];
  });
  entries.sort(([a], [b]) => a.localeCompare(b, "en"));
  const keys = new Set(entries.map(([key]) => key));
  if (keys.size !== entries.length) {
    throw new Error(`Clé dupliquée dans packs-src/${packName}.`);
  }
  return entries;
}

function compilePack(packName) {
  const entries = readSources(packName);
  const destination = path.join(ROOT, "packs", packName);
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(destination, { recursive: true });

  fs.writeFileSync(path.join(destination, "CURRENT"), "MANIFEST-000001\n");
  fs.writeFileSync(path.join(destination, "LOCK"), "");
  fs.writeFileSync(
    path.join(destination, "MANIFEST-000001"),
    encodeLogRecord(encodeVersionEdit())
  );
  fs.writeFileSync(
    path.join(destination, "000002.log"),
    encodeLogRecord(encodeWriteBatch(entries))
  );

  return entries.length;
}

function readPhysicalRecords(file) {
  const buffer = fs.readFileSync(file);
  const logical = [];
  let fragments = [];
  let position = 0;

  while (position < buffer.length) {
    const blockOffset = position % BLOCK_SIZE;
    const remaining = BLOCK_SIZE - blockOffset;
    if (remaining < HEADER_SIZE) {
      position += remaining;
      continue;
    }
    if (position + HEADER_SIZE > buffer.length) break;

    const checksum = buffer.readUInt32LE(position);
    const length = buffer.readUInt16LE(position + 4);
    const type = buffer.readUInt8(position + 6);
    if (checksum === 0 && length === 0 && type === 0) {
      position += remaining;
      continue;
    }
    const start = position + HEADER_SIZE;
    const end = start + length;
    if (end > buffer.length || length > remaining - HEADER_SIZE) {
      throw new Error(`Fragment LevelDB invalide dans ${file}.`);
    }
    const fragment = buffer.subarray(start, end);
    const expected = maskCrc32c(crc32c(Buffer.concat([Buffer.from([type]), fragment])));
    if (checksum !== expected) throw new Error(`CRC LevelDB invalide dans ${file}.`);

    if (type === RECORD.FULL) logical.push(fragment);
    else if (type === RECORD.FIRST) fragments = [fragment];
    else if (type === RECORD.MIDDLE) fragments.push(fragment);
    else if (type === RECORD.LAST) {
      fragments.push(fragment);
      logical.push(Buffer.concat(fragments));
      fragments = [];
    } else {
      throw new Error(`Type de fragment LevelDB inconnu : ${type}.`);
    }
    position = end;
  }
  if (fragments.length) throw new Error(`Enregistrement LevelDB incomplet dans ${file}.`);
  return logical;
}

function parseWriteBatch(buffer) {
  if (buffer.length < 12) throw new Error("WriteBatch trop court.");
  const sequence = buffer.readBigUInt64LE(0);
  const count = buffer.readUInt32LE(8);
  const entries = [];
  let offset = 12;
  for (let index = 0; index < count; index += 1) {
    const type = buffer[offset];
    offset += 1;
    if (type !== 1) throw new Error(`Opération LevelDB non prise en charge : ${type}.`);

    const keyLength = decodeVarint(buffer, offset);
    offset = keyLength.offset;
    const keyEnd = offset + Number(keyLength.value);
    const key = buffer.subarray(offset, keyEnd).toString("utf8");
    offset = keyEnd;

    const valueLength = decodeVarint(buffer, offset);
    offset = valueLength.offset;
    const valueEnd = offset + Number(valueLength.value);
    const value = JSON.parse(buffer.subarray(offset, valueEnd).toString("utf8"));
    offset = valueEnd;
    entries.push([key, value]);
  }
  if (offset !== buffer.length) throw new Error("Octets excédentaires dans le WriteBatch.");
  return { sequence, entries };
}

function verifyPack(packName) {
  const directory = path.join(ROOT, "packs", packName);
  const current = fs.readFileSync(path.join(directory, "CURRENT"), "utf8");
  if (current !== "MANIFEST-000001\n") throw new Error(`CURRENT invalide pour ${packName}.`);

  const manifestRecords = readPhysicalRecords(path.join(directory, "MANIFEST-000001"));
  if (manifestRecords.length !== 1) throw new Error(`MANIFEST invalide pour ${packName}.`);

  const logRecords = readPhysicalRecords(path.join(directory, "000002.log"));
  if (logRecords.length !== 1) throw new Error(`Journal invalide pour ${packName}.`);
  const { sequence, entries } = parseWriteBatch(logRecords[0]);
  if (sequence !== 1n) throw new Error(`Séquence initiale invalide pour ${packName}.`);

  const source = readSources(packName);
  if (entries.length !== source.length) {
    throw new Error(`Nombre d’entrées incohérent pour ${packName}.`);
  }
  for (let index = 0; index < entries.length; index += 1) {
    if (entries[index][0] !== source[index][0]) {
      throw new Error(`Clé compilée incohérente pour ${packName}.`);
    }
    if (JSON.stringify(entries[index][1]) !== JSON.stringify(source[index][1])) {
      throw new Error(`Valeur compilée incohérente pour ${packName}.`);
    }
  }

  return {
    total: entries.length,
    folders: entries.filter(([key]) => key.startsWith("!folders!")).length,
    items: entries.filter(([key]) => key.startsWith("!items!")).length
  };
}

if (crc32c(Buffer.from("123456789")) !== 0xe3069283) {
  throw new Error("Auto-test CRC32C échoué.");
}

for (const pack of PACKS) {
  const total = compilePack(pack);
  const result = verifyPack(pack);
  console.log(
    `${pack}: ${result.items} Items, ${result.folders} dossiers, ${total} entrées compilées.`
  );
}
