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

const expectedPacks = [
  {
    name: "objects",
    label: "Objets",
    path: "packs/objects",
    type: "Item",
    system: "interface",
    banner: "systems/interface/assets/banners/banniere_item.webp"
  },
  {
    name: "weapons",
    label: "Armes",
    path: "packs/weapons",
    type: "Item",
    system: "interface",
    banner: "systems/interface/assets/banners/banniere_armes.webp"
  }
];

check(
  manifest.packs === undefined
    || JSON.stringify(manifest.packs) === JSON.stringify(expectedPacks),
  "system.json: si les packs sont activés, Objets et Armes doivent conserver leurs identifiants, titres, chemins et bannières validés."
);

for (const pack of expectedPacks) {
  check(
    exists(pack.banner.replace("systems/interface/", "")),
    `Bannière de compendium absente : ${pack.banner}`
  );
}

check(
  read(".gitattributes").includes("packs/** binary"),
  ".gitattributes doit protéger les fichiers LevelDB contre les conversions de fin de ligne."
);

const packsEnabled = manifest.packs !== undefined;

if (packsEnabled) {
  execFileSync(
    process.execPath,
    [path.join(root, "tools/build-compendiums.mjs")],
    { stdio: "pipe" }
  );
  check(true, "Reconstruction et vérification des packs LevelDB.");

  for (const pack of expectedPacks) {
    check(exists(pack.path), `Pack compilé absent après reconstruction : ${pack.path}`);
  }
} else {
  check(true, "Compendiums désactivés dans system.json : reconstruction LevelDB reportée à leur réactivation.");
}

function readPackSources(packName) {
  return collectFiles(path.join("packs-src", packName), ".json")
    .map(file => JSON.parse(fs.readFileSync(file, "utf8")));
}

const weaponSources = readPackSources("weapons");
const objectSources = readPackSources("objects");
const weaponFolders = weaponSources.filter(document => document._key?.startsWith("!folders!"));
const objectFolders = objectSources.filter(document => document._key?.startsWith("!folders!"));
const weaponItems = weaponSources.filter(document => document._key?.startsWith("!items!"));
const objectItems = objectSources.filter(document => document._key?.startsWith("!items!"));

check(
  weaponItems.length === 42 && weaponFolders.length === 3,
  "Le pack Armes doit contenir 42 Items et 3 dossiers."
);
check(
  objectItems.length === 60 && objectFolders.length === 8,
  "Le pack Objets doit contenir 60 Items et 8 dossiers."
);

check(
  JSON.stringify(weaponFolders.map(folder => folder.name).sort()) === JSON.stringify([
    "ARMES ANCIENNES",
    "ARMES FUTURISTES",
    "ARMES MODERNES"
  ].sort()),
  "Les dossiers du pack Armes sont incohérents."
);
check(
  JSON.stringify(objectFolders.map(folder => folder.name).sort()) === JSON.stringify([
    "EXPLORATION, ORIENTATION",
    "CAMPEMENT ET SURVIE",
    "OUTILS",
    "SOINS ET PROTECTION",
    "COMMUNICATION",
    "INVESTIGATION",
    "INFILTRATION",
    "ÉQUIPEMENT TECHNIQUE"
  ].sort()),
  "Les dossiers du pack Objets sont incohérents."
);

const allCompendiumItems = [...weaponItems, ...objectItems];
check(
  new Set(allCompendiumItems.map(item => item._id)).size === 102,
  "Les 102 Items de compendium doivent posséder des identifiants uniques."
);
check(
  new Set(allCompendiumItems.map(item => item.img)).size === 102,
  "Chaque entrée de compendium doit utiliser une icône dédiée."
);

for (const item of weaponItems) {
  check(
    item.type === "equipment"
      && item.system?.category === "weapon"
      && item.system?.quantity === 1
      && typeof item.system?.damage?.formula === "string"
      && item.system.damage.formula.length > 0,
    `Arme invalide dans le pack : ${item.name}.`
  );
}
for (const item of objectItems) {
  check(
    item.type === "equipment"
      && item.system?.category === "ordinary"
      && item.system?.quantity === 1
      && item.system?.damage?.formula === "",
    `Objet invalide dans le pack : ${item.name}.`
  );
}
for (const item of allCompendiumItems) {
  const imagePath = item.img?.replace("systems/interface/", "");
  check(
    imagePath && exists(imagePath),
    `Image de compendium absente pour ${item.name} : ${item.img}.`
  );
  check(
    typeof item.system?.description === "string"
      && item.system.description.trim().length > 0
      && !/[<>]/.test(item.system.description),
    `La description doit être un texte brut non vide pour ${item.name}.`
  );
}

const heavyMachineGun = weaponItems.find(item => item.name === "Mitrailleuse lourde");
check(
  heavyMachineGun?.system?.damage?.formula === "3D6+1"
    && !weaponItems.some(item => item.name === "Mitrailleuse légère"),
  "La décision utilisateur « Mitrailleuse lourde » avec la formule 3D6+1 doit être conservée."
);

if (packsEnabled) {
  for (const packName of ["objects", "weapons"]) {
    for (const file of ["CURRENT", "LOCK", "MANIFEST-000001", "000002.log"]) {
      check(exists(path.join("packs", packName, file)), `Fichier LevelDB absent : packs/${packName}/${file}`);
    }
  }
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
  constantsModule.DEFAULT_IMAGES?.ACTOR
    === "systems/interface/assets/actor/avatar-default.webp",
  "Le portrait Actor par défaut doit pointer vers l’asset WebP fourni."
);
check(
  constantsModule.DEFAULT_IMAGES?.EQUIPMENT?.ordinary
    === "systems/interface/assets/items/item_default.webp"
    && constantsModule.DEFAULT_IMAGES?.EQUIPMENT?.weapon
      === "systems/interface/assets/items/weapon_default.webp",
  "Les images d’équipement par défaut doivent distinguer objet et arme."
);
for (const assetPath of [
  constantsModule.DEFAULT_IMAGES.ACTOR,
  ...Object.values(constantsModule.DEFAULT_IMAGES.EQUIPMENT)
]) {
  check(
    assetPath.startsWith("systems/interface/")
      && exists(assetPath.replace("systems/interface/", "")),
    `Asset par défaut absent du package : ${assetPath}`
  );
}
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
  },
  {
    application: "scripts/applications/character-creation-application.mjs",
    template: "templates/actor/character-creation.hbs",
    selector: ".interface-character-creation__body"
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
const characterCreationApplication = read(
  "scripts/applications/character-creation-application.mjs"
);
const equipmentApplication = read("scripts/applications/equipment-sheet.mjs");
const equipmentTemplate = read("templates/item/equipment-sheet.hbs");
const characterTemplate = read("templates/actor/character-sheet.hbs");
const characterCreationTemplate = read(
  "templates/actor/character-creation.hbs"
);

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
  "talents",
  "combat",
  "weapons",
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
  characterTemplate.includes("interface-state-label")
    && characterTemplate.includes("woundState.label")
    && characterTemplate.includes("stressState.label"),
  "Les bulles de niveau doivent être remplacées par les libellés narratifs Blessures/Stress."
);
check(
  !characterTemplate.includes("interface-state-track")
    && !characterApplication.includes("buildStateTrack"),
  "L’ancien affichage en six bulles de niveau doit être absent."
);
for (const color of [
  "#7A7F87",
  "#718F78",
  "#B39A45",
  "#C97932",
  "#B84A3A",
  "#762F3A"
]) {
  check(
    characterApplication.includes(color),
    `Couleur d’état absente du contexte de fiche : ${color}.`
  );
}
for (const key of [
  "INTERFACE.State.Wounds.Indemne",
  "INTERFACE.State.Wounds.Touche",
  "INTERFACE.State.Wounds.Meurtri",
  "INTERFACE.State.Wounds.Blesse",
  "INTERFACE.State.Wounds.Brisse",
  "INTERFACE.State.Wounds.Critique",
  "INTERFACE.State.Stress.Stable",
  "INTERFACE.State.Stress.Tendu",
  "INTERFACE.State.Stress.Eprouve",
  "INTERFACE.State.Stress.Ebranle",
  "INTERFACE.State.Stress.Submerge",
  "INTERFACE.State.Stress.Rupture"
]) {
  check(
    typeof resolveLocalization(french, key) === "string",
    `Clé française d’état absente : ${key}.`
  );
}
check(
  read("styles/interface.css").includes(".interface .interface-state-label")
    && read("styles/interface.css").includes(".interface .interface-state-label strong")
    && read("styles/interface.css").includes("var(--interface-state-color)"),
  "Le libellé d’état doit rester lisible et coloré selon son palier."
);
check(
  !characterTemplate.includes("interface-state-band__dev")
    && !characterTemplate.includes('data-section="development"')
    && !characterTemplate.includes("INTERFACE.Development.Temporary"),
  "Les informations temporaires de développement doivent être retirées de la fiche."
);
check(
  characterTemplate.includes("interface-autosave"),
  "La fiche Actor doit indiquer que l’enregistrement automatique est actif."
);
check(
  read("templates/item/equipment-sheet.hbs").includes("interface-autosave"),
  "La fiche Item doit indiquer que l’enregistrement automatique est actif."
);


check(
  characterTemplate.includes("interface-identity-grid")
    && characterTemplate.includes("interface-identity__portrait")
    && characterTemplate.includes('data-action="choosePortrait"')
    && characterTemplate.indexOf("interface-identity__portrait")
      < characterTemplate.indexOf("interface-identity__main")
    && characterTemplate.indexOf("interface-identity__main")
      < characterTemplate.indexOf("interface-identity__age"),
  "La fiche Actor doit reprendre l’identité Portrait / Nom-Profession / Âge."
);
check(
  characterApplication.includes("new FilePicker")
    && characterApplication.includes('current: this.actor.img')
    && characterApplication.includes('this.actor.update({ img: path })'),
  "Le portrait de la fiche Actor doit être modifiable via le FilePicker."
);
check(
  read("scripts/documents/interface-actor.mjs").includes("DEFAULT_IMAGES.ACTOR")
    && read("scripts/documents/interface-actor.mjs").includes(
      'img: String(data.img ?? "").trim() || DEFAULT_IMAGES.ACTOR'
    ),
  "Un nouvel Actor character doit recevoir le portrait WebP par défaut."
);
check(
  characterApplication.includes("DEFAULT_IMAGES.EQUIPMENT[category]")
    && characterApplication.includes("img: DEFAULT_IMAGES.EQUIPMENT[category]"),
  "Un nouvel objet ou une nouvelle arme doit recevoir son image WebP par défaut."
);
check(
  equipmentApplication.includes("chooseImageAction")
    && equipmentApplication.includes("new FilePicker")
    && equipmentApplication.includes("this.item.update({ img: path })")
    && equipmentTemplate.includes('data-action="chooseImage"')
    && equipmentTemplate.includes('src="{{image}}"'),
  "La fiche Item doit afficher et permettre de modifier l’image de l’équipement."
);
check(
  (characterTemplate.match(/<img src="{{img}}" alt="{{name}}">/g) ?? []).length === 2,
  "Les sections Armes et Inventaire doivent afficher la vignette de chaque Item."
);
check(
  !characterApplication.includes("acknowledgeCreationWarnings")
    && !characterTemplate.includes("acknowledgeCreationWarnings")
    && !characterTemplate.includes("creation.showWarnings"),
  "Les avertissements de création doivent être retirés de la fiche courante."
);

for (const requiredFile of [
  "scripts/applications/character-creation-application.mjs",
  "scripts/rules/character-creation.mjs",
  "templates/actor/character-creation.hbs",
  "tests/unit/character-creation.test.mjs"
]) {
  check(exists(requiredFile), `Composant de création absent : ${requiredFile}`);
}
check(
  /static async createDialog\(/.test(read("scripts/documents/interface-actor.mjs"))
    && /this\.create\(actorData/.test(
      read("scripts/documents/interface-actor.mjs")
    )
    && /FLAG_KEYS\.CREATION_PENDING/.test(
      read("scripts/documents/interface-actor.mjs")
    )
    && /InterfaceCharacterCreationApplication\.openForActor/.test(
      read("scripts/documents/interface-actor.mjs")
    ),
  "La création d’un Actor character doit créer immédiatement un Actor en attente et ouvrir l’assistant."
);
check(
  characterApplication.includes("FLAG_KEYS.CREATION_PENDING")
    && characterApplication.includes(
      "InterfaceCharacterCreationApplication.openForActor"
    )
    && characterCreationApplication.includes("actor.unsetFlag")
    && characterCreationApplication.includes("saveDraft"),
  "Un Actor en attente doit rouvrir l’assistant, sauvegarder son brouillon et retirer le flag à la validation."
);
check(
  characterCreationApplication.includes("calculateFixedDerivedScores")
    && characterCreationApplication.includes("calculateCreationDiagnostics")
    && characterCreationApplication.includes("refreshLiveValues"),
  "L’assistant doit recalculer en direct les dérivés et les pools."
);
check(
  characterCreationApplication.includes("new FilePicker")
    && characterCreationApplication.includes("this.portrait")
    && characterCreationApplication.includes("img: this.portrait")
    && characterCreationApplication.includes("queueActorUpdate"),
  "Le portrait doit être appliqué immédiatement à l’Actor en attente."
);
check(
  characterCreationApplication.includes('addEventListener("dragstart"')
    && characterCreationApplication.includes('addEventListener("dragover"')
    && characterCreationApplication.includes('addEventListener("drop"')
    && characterCreationApplication.includes("assignSkillToken")
    && characterCreationApplication.includes("releaseSkillToken"),
  "Les jetons de Compétences doivent être glissables, réattribuables et libérables."
);
check(
  characterCreationTemplate.includes("interface-creation-columns")
    && characterCreationTemplate.includes("repeat(6")
      === false
    && characterCreationTemplate.includes('name="skills.{{skill}}"')
    && characterCreationTemplate.includes('name="talents.{{key}}"'),
  "Le template doit aligner les six Compétences et leurs trois Talents."
);
check(
  characterCreationTemplate.indexOf("interface-creation-derived")
    < characterCreationTemplate.indexOf("interface-creation-specializations")
    && characterCreationTemplate.indexOf("interface-creation-specializations")
      < characterCreationTemplate.indexOf("interface-creation-final"),
  "Le bloc Spécialisations doit se trouver entre les dérivés et la zone finale."
);
check(
  characterCreationTemplate.includes("data-recap-token-count")
    && characterCreationTemplate.includes("data-recap-talent-total")
    && characterCreationTemplate.includes("data-recap-talent-remaining")
    && characterCreationTemplate.includes("data-talent-block-total")
    && characterCreationApplication.includes("data-talent-block-total")
    && characterCreationTemplate.includes('type="submit"'),
  "Le total de Talents, le récapitulatif et le bouton de création doivent être présents."
);
check(
  characterCreationApplication.includes("DialogV2.wait")
    && characterCreationApplication.includes(
      "INTERFACE.CreationAssistant.Confirm"
    )
    && characterCreationApplication.includes(
      "INTERFACE.CreationAssistant.Back"
    ),
  "Les écarts de création doivent proposer Revenir en arrière ou Valider quand même."
);
check(
  read("styles/interface.css").includes(
    "grid-template-columns: repeat(3, 10rem)"
  )
    && read("styles/interface.css").includes("justify-content: center")
    && read("styles/interface.css").includes("width: 10rem"),
  "Les trois cartes dérivées doivent avoir la même dimension et être centrées."
);

const actorDocument = read("scripts/documents/interface-actor.mjs");
const d100Service = read("scripts/services/d100-roll-service.mjs");
const d100Engine = read("scripts/rules/d100/resolve-d100.mjs");
const d100Destiny = read("scripts/rules/d100/resolve-destiny.mjs");
const d100Selection = read("scripts/rules/d100/select-raw.mjs");
const d100UnitTests = read("tests/unit/d100-engine.test.mjs");

for (const requiredFile of [
  "scripts/rules/d100/constants.mjs",
  "scripts/rules/d100/qualify-natural.mjs",
  "scripts/rules/d100/qualify-final.mjs",
  "scripts/rules/d100/select-raw.mjs",
  "scripts/rules/d100/resolve-destiny.mjs",
  "scripts/rules/d100/compute-margin.mjs",
  "scripts/rules/d100/resolve-d100.mjs",
  "scripts/services/d100-roll-service.mjs",
  "tests/unit/d100-engine.test.mjs"
]) {
  check(exists(requiredFile), `Composant D100 absent : ${requiredFile}`);
}

check(
  /rollStandardD100/.test(actorDocument)
    && /rollDerivedD100/.test(actorDocument),
  "L’Actor doit exposer les deux adaptateurs de jet D100."
);
for (const action of ["rollSkill", "rollTalent", "rollDerived"]) {
  check(
    characterApplication.includes(`${action}:`),
    `Action D100 interne absente de la fiche Actor : ${action}.`
  );
}
check(
  !characterApplication.includes("setRollMode:")
    && !characterTemplate.includes("interface-roll-mode")
    && !characterTemplate.includes('data-action="setRollMode"'),
  "Le bandeau permanent de mode de jet doit être absent de la fiche Actor."
);
check(
  !characterTemplate.includes('data-action="rollSkill"')
    && characterTemplate.includes('data-action="rollTalent"')
    && characterTemplate.includes('data-action="rollDerived"')
    && characterTemplate.includes("interface-skill__label"),
  "Les Compétences doivent être statiques tandis que Talents et dérivés restent déclencheurs de jets."
);
check(
  /data-action="rollTalent"[\s\S]*?tabindex="-1"/.test(characterTemplate),
  "Les boutons de jet de Talent doivent être retirés de la tabulation pour enchaîner directement les champs numériques."
);
check(
  read("styles/interface.css").includes(".interface .interface-derived-grid {")
    && read("styles/interface.css").includes("display: flex")
    && read("styles/interface.css").includes("flex-wrap: wrap")
    && read("styles/interface.css").includes("justify-content: center")
    && read("styles/interface.css").includes("flex: 0 0 10rem")
    && read("styles/interface.css").includes("width: 10rem")
    && read("styles/interface.css").includes("min-height: 4.8rem"),
  "Les cartes de Combat de la fiche Actor doivent être homogènes, centrées et non étirées."
);

check(
  !/<summary>[\s\S]*?INTERFACE\.Section\.Talents[\s\S]*?creation\.talentTotal[\s\S]*?<\/summary>/.test(
    characterTemplate
  )
    && read("styles/interface.css").includes("margin-bottom: 0.12rem")
    && read("styles/interface.css").includes("min-height: 1.7rem"),
  "Le titre Talents ne doit plus afficher le contrôle 100/100 et les groupes doivent rester compacts."
);
check(
  characterTemplate.includes('data-section="weapons"')
    && characterTemplate.includes('data-action="createEquipment"')
    && characterTemplate.includes('title="{{localize "INTERFACE.Inventory.AddWeapon"}}"')
    && characterTemplate.indexOf('data-section="weapons"')
      > characterTemplate.indexOf('data-section="combat"'),
  "Les Armes doivent disposer d’une section autonome repliable avec un petit bouton d’ajout."
);
check(
  characterTemplate.includes('data-action="chooseEquipmentCategory"')
    && characterApplication.includes("chooseEquipmentCategoryAction")
    && characterApplication.includes("INTERFACE.Inventory.AddPrompt")
    && characterApplication.includes("EQUIPMENT_CATEGORIES.ORDINARY")
    && characterApplication.includes("EQUIPMENT_CATEGORIES.WEAPON"),
  "Le bouton compact de l’Inventaire doit proposer le choix entre objet ordinaire et arme."
);
check(
  characterApplication.includes(
    "const inventory = embeddedEquipment.filter(item => !item.isWeapon)"
  )
    && characterApplication.includes("hasInventory: inventory.length > 0")
    && !characterTemplate.includes("{{inventory.length}}"),
  "L’Inventaire doit afficher uniquement les objets ordinaires, sans compteur dans son titre."
);
check(
  !characterTemplate.includes("INTERFACE.Specializations.Hint")
    && !characterTemplate.includes("INTERFACE.Notes.Hint"),
  "Les textes d’aide des sections Spécialisations et Notes doivent être absents de la fiche."
);
check(
  read("styles/interface.css").includes("calc(1rem + 10px)")
    && read("styles/interface.css").includes(".interface .interface-fold__add"),
  "La fiche Actor doit conserver une marge intérieure globale renforcée et des boutons d’ajout compacts."
);
check(
  characterApplication.includes("skillValue: system.skills[group.skill]")
    && characterTemplate.includes("{{skillValue}}"),
  "Chaque groupe de Talents doit rappeler la valeur de sa Compétence."
);
check(
  !characterTemplate.includes('<small>{{localize "INTERFACE.Section.Derived"}}</small>'),
  "Le sous-titre « Valeurs dérivées » doit être absent du bloc Combat."
);
check(
  characterApplication.includes("deleteEmbeddedItemAction")
    && characterApplication.includes("DialogV2.confirm")
    && characterApplication.includes("await item.delete()")
    && characterTemplate.includes('data-action="deleteEmbeddedItem"')
    && characterTemplate.includes("interface-item-row__delete"),
  "Les armes et objets doivent pouvoir être supprimés après confirmation."
);
check(
  !characterTemplate.includes("INTERFACE.Inventory.DropHint"),
  "Le texte d’aide au glisser-déposer doit être absent de l’Inventaire."
);
check(
  characterTemplate.includes("interface-identity-field--age")
    && read("styles/interface.css").includes(
      "grid-template-columns: 10rem minmax(0, 1fr) 10rem"
    ),
  "Le bloc Identité doit suivre la disposition Portrait / Nom-Profession / Âge."
);
check(
  characterTemplate.includes("interface-state-band__resource--wounds")
    && characterTemplate.includes("interface-state-band__resource--stress")
    && characterTemplate.includes("INTERFACE.State.Label")
    && read("styles/interface.css").includes("border-inline: 2px solid"),
  "Le bandeau Blessures / Initiative / Stress doit suivre la disposition validée."
);
check(
  !fs.existsSync(path.join(root, "assets/items/item_default.png"))
    && !fs.existsSync(path.join(root, "assets/items/weapon_default.png"))
    && fs.existsSync(path.join(root, "assets/items/item_default.webp"))
    && fs.existsSync(path.join(root, "assets/items/weapon_default.webp")),
  "Les assets d’équipement doivent conserver uniquement les WebP."
);

check(
  characterApplication.includes("DialogV2.input")
    && characterApplication.includes("requestRollOptions")
    && characterApplication.includes('name="mode"')
    && characterApplication.includes('type="radio"')
    && characterApplication.includes("interface-preroll-mode__option--disadvantage")
    && characterApplication.includes("interface-preroll-mode__option--normal")
    && characterApplication.includes("interface-preroll-mode__option--advantage")
    && characterApplication.includes("checked")
    && !characterApplication.includes('<select name="mode">')
    && characterApplication.includes('name="modifier"')
    && characterApplication.includes("INTERFACE.D100.PreRoll.Roll"),
  "La fenêtre pré-lancer doit proposer une réglette trois positions, le bonus/malus et le lancement."
);

check(
  characterApplication.includes("activatePreRollModeSlider")
    && characterApplication.includes("data-interface-mode-slider")
    && characterApplication.includes("render: activatePreRollModeSlider")
    && characterApplication.includes('addEventListener("pointerdown"')
    && characterApplication.includes('addEventListener("pointermove"')
    && characterApplication.includes('addEventListener("pointerup"')
    && characterApplication.includes("setPointerCapture")
    && characterApplication.includes("releasePointerCapture")
    && characterApplication.includes('style.setProperty(')
    && characterApplication.includes('style.removeProperty("--interface-slider-position")')
    && characterApplication.includes("Math.round(ratio * (PRE_ROLL_MODE_ORDER.length - 1))"),
  "La réglette pré-lancer doit être réellement déplaçable à la souris entre les trois positions."
);

check(
  characterApplication.includes("const readOnly = !canUpdateActor(this)")
    && characterApplication.includes('addEventListener("drop", blockDocumentInteraction, true)'),
  "La vue observateur doit être calculée localement et bloquer le glisser-déposer."
);
for (const readOnlyClass of [
  "interface-character--read-only",
  "interface-readonly-field",
  "interface-skill__value",
  "interface-talent__value",
  "interface-resource__readonly",
  "interface-readonly-text",
  "interface-progression__readonly-dot",
  "interface-item-row__name--readonly"
]) {
  check(
    characterTemplate.includes(readOnlyClass),
    `Élément de lecture seule absent de la fiche Actor : ${readOnlyClass}.`
  );
}
check(
  characterTemplate.includes("{{#if editable}}\n  <footer class=\"interface-sheet__footer\">"),
  "Le pied de fiche interactif doit être absent pour un observateur."
);
check(
  read("styles/interface.css").includes(
    "Vue observateur : lecture seule locale"
  )
    && read("styles/interface.css").includes(
      ".interface .interface-character--read-only details > summary"
    ),
  "La vue observateur doit rester plate sauf pour les sections repliables."
);
check(
  /new Roll\(formula\)/.test(d100Service)
    && /mode === D100_MODES\.NORMAL \? "1d100" : "2d100"/.test(d100Service),
  "L’adaptateur Foundry doit utiliser 1d100 ou 2d100 selon le mode."
);
check(
  /modifier = 0/.test(d100Service)
    && /baseThreshold - statePenalty \+ situationalModifier/.test(d100Service)
    && /threshold:\s*\{[\s\S]*modifier: situationalModifier/.test(d100Service),
  "Le bonus/malus pré-lancer doit modifier temporairement le seuil sans clamp."
);
check(
  /extractNaturalValues\(roll\)/.test(d100Service)
    && /roll\.dice/.test(d100Service),
  "Les résultats naturels doivent être extraits des termes du Roll Foundry."
);
check(
  d100Service.indexOf("await actor.update") < d100Service.indexOf(
    "await publishDevelopmentRoll"
  ),
  "L’écriture du Destin doit précéder la publication du message."
);
check(
  /ACTIVE_ACTOR_ROLLS/.test(d100Service),
  "Le service doit empêcher deux jets locaux simultanés sur le même Actor."
);
const publicSummarySource = d100Service.slice(
  d100Service.indexOf("function publicSummaryHtml"),
  d100Service.indexOf("async function publishDevelopmentRoll")
);
for (const secretName of ["secretRoll", "triggerChance", "criticalMinimum", "eligible"]) {
  check(
    !publicSummarySource.includes(secretName),
    `La projection publique ne doit pas contenir le secret « ${secretName} ».`
  );
}
check(
  !/flags\s*:/.test(d100Service),
  "La carte technique ne doit pas placer de diagnostic secret dans des flags publics."
);
check(
  /structuredClone/.test(d100Engine)
    && /deepFreeze/.test(d100Engine),
  "Le moteur D100 doit protéger l’entrée et retourner un résultat immutable."
);
check(
  /finalThreshold <= 5/.test(d100Destiny)
    && /rawQualification\.automatic/.test(d100Destiny),
  "Le Destin doit respecter le seuil <= 5 et les échecs automatiques."
);
check(
  /candidate\.rank - current\.rank/.test(d100Selection)
    && /candidate\.value < current\.value/.test(d100Selection)
    && /candidate\.value > current\.value/.test(d100Selection),
  "La sélection avantage/désavantage doit suivre la qualité puis le départage numérique."
);
for (let index = 1; index <= 20; index += 1) {
  const scenario = `T${String(index).padStart(2, "0")}`;
  check(
    d100UnitTests.includes(scenario),
    `Scénario fonctionnel absent des tests unitaires : ${scenario}.`
  );
}
check(
  read("templates/settings/interface-settings.hbs").includes(
    "INTERFACE.Settings.DestinyInactiveWarning"
  )
    && resolveLocalization(
      french,
      "INTERFACE.Settings.DestinyInactiveWarning"
    )?.includes("actif"),
  "Le menu des settings doit indiquer que le moteur de Destin est actif."
);

for (const key of [
  "INTERFACE.D100.Quality.Success",
  "INTERFACE.D100.Quality.Failure",
  "INTERFACE.D100.Quality.AutomaticSuccess",
  "INTERFACE.D100.Quality.AutomaticFailure",
  "INTERFACE.D100.Quality.AutomaticCriticalSuccess",
  "INTERFACE.D100.Quality.AutomaticCriticalFailure",
  "INTERFACE.D100.Quality.CriticalSuccess",
  "INTERFACE.D100.Quality.CriticalFailure",
  "INTERFACE.D100.Quality.SuperCriticalSuccess",
  "INTERFACE.D100.Quality.SuperCriticalFailure"
]) {
  check(
    resolveLocalization(french, key) !== undefined,
    `Libellé français D100 absent : ${key}.`
  );
}


for (const key of [
  "INTERFACE.D100.PreRoll.Title",
  "INTERFACE.D100.PreRoll.Mode",
  "INTERFACE.D100.PreRoll.ModeHint",
  "INTERFACE.D100.PreRoll.Modifier",
  "INTERFACE.D100.PreRoll.ModifierHint",
  "INTERFACE.D100.PreRoll.Roll",
  "INTERFACE.D100.PreRoll.InvalidModifier"
]) {
  check(
    resolveLocalization(french, key) !== undefined,
    `Libellé français de pré-lancer absent : ${key}.`
  );
}
check(
  read("styles/interface.css").includes("interface-preroll-dialog")
    && read("styles/interface.css").includes("interface-preroll__field")
    && read("styles/interface.css").includes("interface-preroll-mode")
    && read("styles/interface.css").includes("interface-preroll-mode__rail")
    && read("styles/interface.css").includes("interface-preroll-mode__thumb")
    && read("styles/interface.css").includes("--interface-slider-position")
    && read("styles/interface.css").includes("cursor: grab")
    && read("styles/interface.css").includes("touch-action: none")
    && read("styles/interface.css").includes(":has("),
  "La fenêtre pré-lancer doit disposer d’un style compact dédié et d’une réglette déplaçable."
);

const runtimeText = [
  ...moduleFiles.map(file => fs.readFileSync(file, "utf8")),
  read("system.json")
].join("\n");

check(!/\bsocket\b/i.test(runtimeText), "Aucun socket ne doit être ajouté en Tranche 3.");
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
