import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(currentFile), "../..");
const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function collectFiles(directory, extension) {
  const absolute = path.join(root, directory);
  if (!fs.existsSync(absolute)) return [];

  return fs.readdirSync(absolute, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(extension))
    .map(entry => path.join(entry.parentPath, entry.name));
}

function resolveLocalization(object, dottedKey) {
  return dottedKey.split(".").reduce(
    (value, segment) => value?.[segment],
    object
  );
}

function inspectTemplateRoots(source) {
  const voidElements = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  const html = source.replace(/<!--[\s\S]*?-->/g, "");
  const tokens = html.matchAll(/<\/?([A-Za-z][\w:-]*)\b[^>]*>/g);
  let depth = 0;
  let roots = 0;

  for (const match of tokens) {
    const token = match[0];
    const tag = match[1].toLowerCase();

    if (token.startsWith("</")) {
      depth -= 1;
      if (depth < 0) return { roots, balanced: false };
      continue;
    }

    const selfClosing = token.endsWith("/>") || voidElements.has(tag);
    if (depth === 0) roots += 1;
    if (!selfClosing) depth += 1;
  }

  return { roots, balanced: depth === 0 };
}

const manifest = JSON.parse(read("system.json"));
const french = JSON.parse(read("lang/fr.json"));

check(manifest.id === "interface", "system.json: id doit être « interface ».");
check(manifest.type === "system", "system.json: type doit être « system ».");
check(manifest.version === "0.1.0", "system.json: version doit être « 0.1.0 ».");
check(
  manifest.compatibility?.minimum === "14"
    && manifest.compatibility?.verified === "14"
    && manifest.compatibility?.maximum === "14",
  "system.json: compatibilité attendue minimum/verified/maximum = 14."
);
check(
  Object.keys(manifest.documentTypes?.Actor ?? {}).join(",") === "character",
  "system.json: Actor.type unique attendu « character »."
);
check(
  Object.keys(manifest.documentTypes?.Item ?? {}).join(",") === "equipment",
  "system.json: Item.type unique attendu « equipment »."
);
check(
  manifest.documentTypes.Actor.character.htmlFields?.includes("identity.notes"),
  "system.json: identity.notes doit être déclaré comme champ HTML Actor."
);
check(
  manifest.documentTypes.Item.equipment.htmlFields?.includes("description"),
  "system.json: description doit être déclaré comme champ HTML Item."
);

for (const declaredPath of [
  ...(manifest.esmodules ?? []),
  ...(manifest.styles ?? []),
  ...(manifest.languages ?? []).map(language => language.path)
]) {
  check(exists(declaredPath), `Chemin déclaré absent : ${declaredPath}`);
}

const moduleFiles = collectFiles("scripts", ".mjs");
for (const testFile of collectFiles("tests/static", ".mjs")) {
  execFileSync(process.execPath, ["--check", testFile], { stdio: "pipe" });
}

const unitTestFiles = collectFiles("tests/unit", ".test.mjs");
for (const testFile of unitTestFiles) {
  execFileSync(process.execPath, ["--check", testFile], { stdio: "pipe" });
  execFileSync(process.execPath, [testFile], { stdio: "pipe" });
  check(true, `Test unitaire exécuté : ${path.relative(root, testFile)}`);
}

for (const moduleFile of moduleFiles) {
  execFileSync(process.execPath, ["--check", moduleFile], { stdio: "pipe" });

  const source = fs.readFileSync(moduleFile, "utf8");
  const imports = source.matchAll(
    /(?:import|export)\s+(?:[^"'()]*?\s+from\s+)?["'](\.[^"']+)["']/g
  );

  for (const match of imports) {
    const target = path.resolve(path.dirname(moduleFile), match[1]);
    check(
      fs.existsSync(target),
      `Import relatif introuvable dans ${path.relative(root, moduleFile)} : ${match[1]}`
    );
  }
}

const constantsModule = await import(
  `${pathToFileURL(path.join(root, "scripts/constants.mjs")).href}?check=${Date.now()}`
);

check(constantsModule.SYSTEM_ID === "interface", "Constante SYSTEM_ID incohérente.");
check(constantsModule.PACKAGE_VERSION === "0.1.0", "Constante PACKAGE_VERSION incohérente.");
check(constantsModule.SCHEMA_VERSION === 1, "Version du premier schéma attendue : 1.");
check(constantsModule.SKILLS.length === 6, "Six Compétences sont attendues.");
check(constantsModule.TALENTS.length === 18, "Dix-huit Talents sont attendus.");
check(
  new Set(constantsModule.SKILLS.map(entry => entry.key)).size === 6,
  "Les clés de Compétences doivent être uniques."
);
check(
  new Set(constantsModule.TALENTS.map(entry => entry.key)).size === 18,
  "Les clés de Talents doivent être uniques."
);
check(
  JSON.stringify(Object.values(constantsModule.EQUIPMENT_CATEGORIES))
    === JSON.stringify(["ordinary", "weapon"]),
  "Catégories d’équipement attendues : ordinary et weapon."
);
check(
  Object.keys(constantsModule.DERIVED_SCORE_DEFINITIONS).join(",")
    === "melee,distance,verbal",
  "Trois valeurs dérivées fixes sont attendues."
);
for (const [key, definition] of Object.entries(
  constantsModule.DERIVED_SCORE_DEFINITIONS
)) {
  check(
    definition.skills.length === 2,
    `La valeur dérivée ${key} doit associer deux Compétences.`
  );
  check(
    definition.talents.length === 6,
    `La valeur dérivée ${key} doit associer six Talents.`
  );
  check(
    new Set(definition.skills).size === 2
      && new Set(definition.talents).size === 6,
    `Les associations de ${key} doivent être uniques.`
  );
}
check(
  JSON.stringify(constantsModule.CREATION_RECOMMENDATIONS.skills)
    === JSON.stringify([20, 30, 30, 40, 40, 50]),
  "Répartition de Compétences recommandée incohérente."
);
check(
  constantsModule.CREATION_RECOMMENDATIONS.talentTotal === 100,
  "Total de Talents recommandé incohérent."
);

check(
  JSON.stringify(constantsModule.SKILLS.map(({ key, tone }) => [key, tone]))
    === JSON.stringify([
      ["carrure", "corps"],
      ["agilite", "corps"],
      ["perception", "ame"],
      ["mental", "ame"],
      ["intellect", "esprit"],
      ["charisme", "esprit"]
    ]),
  "Les couleurs visuelles des Compétences doivent suivre les trois groupes validés."
);
check(
  constantsModule.TALENT_GROUPS.every(
    group => group.talents.length === 3
      && ["corps", "ame", "esprit"].includes(group.tone)
  ),
  "Chaque groupe de Talents doit conserver la couleur de sa Compétence."
);
check(
  JSON.stringify(
    Object.values(constantsModule.DERIVED_SCORE_DEFINITIONS).map(
      definition => definition.tone
    )
  ) === JSON.stringify(["corps", "ame", "esprit"]),
  "Les valeurs dérivées doivent reprendre les trois groupes visuels."
);

const characterModel = read("scripts/data/character-data.mjs");
check(
  /makeNumberSchema\(SKILLS,\s*\{\s*max:\s*100\s*\}\)/.test(characterModel),
  "Le modèle Actor doit borner les Compétences à 100."
);
check(
  /makeNumberSchema\(TALENTS,\s*\{\s*max:\s*30\s*\}\)/.test(characterModel),
  "Le modèle Actor doit borner les Talents à 30."
);
check(
  /min:\s*0/.test(characterModel),
  "Le modèle Actor doit appliquer un minimum de 0."
);
check(
  /derived:\s*new fields\.ObjectField\([\s\S]*?persisted:\s*false/.test(
    characterModel
  ),
  "Les données dérivées doivent être déclarées non persistées."
);
check(
  /prepareDerivedData\(\)/.test(characterModel)
    && /buildCharacterDerivedData/.test(characterModel),
  "Le TypeDataModel Actor doit préparer les données dérivées."
);

const equipmentModel = read("scripts/data/equipment-data.mjs");
check(
  /min:\s*1,\s*initial:\s*1/.test(equipmentModel),
  "La quantité d’équipement doit avoir un minimum et un défaut de 1."
);
check(
  /choices:\s*Object\.values\(EQUIPMENT_CATEGORIES\)/.test(equipmentModel),
  "Le modèle Item doit restreindre les catégories validées."
);

const scrollableParts = [
  {
    application: "scripts/applications/character-sheet.mjs",
    template: "templates/actor/character-sheet.hbs",
    selector: ".interface-sheet__body"
  },
  {
    application: "scripts/applications/equipment-sheet.mjs",
    template: "templates/item/equipment-sheet.hbs",
    selector: ".interface-sheet__body"
  },
  {
    application: "scripts/applications/interface-settings-application.mjs",
    template: "templates/settings/interface-settings.hbs",
    selector: ".interface-settings__body"
  }
];

for (const { application, template, selector } of scrollableParts) {
  const applicationSource = read(application);
  const templateSource = read(template);
  const selectorPattern = new RegExp(
    `scrollable:\\s*\\[["']${selector.replace(".", "\\.")}["']\\]`
  );
  check(
    selectorPattern.test(applicationSource),
    `${application}: la zone défilable doit être déclarée dans PARTS.`
  );
  check(
    templateSource.includes(`class="${selector.slice(1)}`),
    `${template}: le sélecteur défilable déclaré doit exister.`
  );
}


const characterApplication = read("scripts/applications/character-sheet.mjs");
const equipmentApplication = read("scripts/applications/equipment-sheet.mjs");
const characterTemplate = read("templates/actor/character-sheet.hbs");

check(
  /submitOnChange:\s*true/.test(characterApplication),
  "La fiche Actor doit enregistrer automatiquement les changements."
);
check(
  /submitOnChange:\s*true/.test(equipmentApplication),
  "La fiche Item doit enregistrer automatiquement les changements."
);
check(
  /async _postRender\(/.test(characterApplication)
    && /details\[data-section\]/.test(characterApplication)
    && /sectionState/.test(characterApplication),
  "La fiche Actor doit préserver l’état des sections repliables pendant les rerendus."
);

for (const section of [
  "development",
  "talents",
  "combat",
  "specializations",
  "inventory",
  "notes"
]) {
  check(
    characterTemplate.includes(`data-section="${section}"`),
    `Section repliable absente de la fiche Actor : ${section}.`
  );
}

check(
  characterTemplate.includes("system.progression.gauge"),
  "Le contrôle de jauge XP doit être présent."
);
check(
  characterTemplate.includes("system.progression.{{../key}}.{{key}}"),
  "Les neuf cases de progression doivent utiliser les clés de groupe préparées."
);
for (const key of ["skillGains", "talentGains", "specializationGains"]) {
  check(
    characterApplication.includes(`"${key}"`),
    `Groupe de progression absent du contexte : ${key}.`
  );
}

check(
  characterTemplate.includes("interface-state-band")
    && characterTemplate.includes("derived.initiativeBonus"),
  "Le bandeau noir doit regrouper les états et l’initiative."
);
check(
  characterTemplate.includes("interface-state-band__dev")
    && characterTemplate.includes("INTERFACE.Development.Temporary"),
  "Les informations temporaires de développement doivent être identifiées."
);
check(
  characterTemplate.includes("interface-autosave"),
  "La fiche Actor doit indiquer que l’enregistrement automatique est actif."
);
check(
  read("templates/item/equipment-sheet.hbs").includes("interface-autosave"),
  "La fiche Item doit indiquer que l’enregistrement automatique est actif."
);

const runtimeText = [
  ...moduleFiles.map(file => fs.readFileSync(file, "utf8")),
  read("system.json")
].join("\n");

check(!/\bsocket\b/i.test(runtimeText), "Aucun socket ne doit être ajouté en Tranche 2.");
check(!/dice\s*so\s*nice|dice-so-nice/i.test(runtimeText), "Dice So Nice ne doit pas être requis.");
check(!/roll20/i.test(runtimeText), "Aucun code ou import Roll20 ne doit être ajouté.");
check(!/"relationships"\s*:/.test(runtimeText), "Aucune dépendance de package ne doit être déclarée.");

const localizationKeys = new Set();
for (const relativePath of [
  ...collectFiles("templates", ".hbs").map(file => path.relative(root, file)),
  ...moduleFiles.map(file => path.relative(root, file))
]) {
  const source = read(relativePath);
  for (const match of source.matchAll(
    /(?:localize|format)\(\s*["']([^"']+)["']|{{localize\s+["']([^"']+)["']}}/g
  )) {
    localizationKeys.add(match[1] ?? match[2]);
  }
}

for (const key of localizationKeys) {
  check(
    resolveLocalization(french, key) !== undefined,
    `Clé française absente : ${key}`
  );
}

for (const template of collectFiles("templates", ".hbs")) {
  const source = fs.readFileSync(template, "utf8");
  const relativeTemplate = path.relative(root, template);
  const opens = (source.match(/{{#(?:if|each|unless|with)\b/g) ?? []).length;
  const closes = (source.match(/{{\/(?:if|each|unless|with)}}/g) ?? []).length;
  check(
    opens === closes,
    `Blocs Handlebars déséquilibrés : ${relativeTemplate}`
  );

  const rootInspection = inspectTemplateRoots(source);
  check(
    rootInspection.roots === 1 && rootInspection.balanced,
    `Le template doit produire un unique élément HTML racine : ${relativeTemplate}`
  );
}

try {
  execFileSync(
    process.execPath,
    [path.join(root, "tests/static/smoke-import.mjs")],
    { stdio: "pipe" }
  );
  check(true, "Chargement isolé du point d’entrée.");
} catch (error) {
  check(false, `Échec du chargement isolé : ${error.stderr?.toString() ?? error.message}`);
}

if (failures.length > 0) {
  console.error(`ÉCHEC — ${failures.length} problème(s) sur ${checks} contrôles.`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`OK — ${checks} contrôles hors Foundry réussis.`);
console.log(`Modules JavaScript vérifiés : ${moduleFiles.length}.`);
console.log(`Tests unitaires exécutés : ${unitTestFiles.length}.`);
console.log("Chargement isolé et enregistrements init simulés : OK.");
console.log("Validation réelle dans Foundry VTT non effectuée par ce script.");
