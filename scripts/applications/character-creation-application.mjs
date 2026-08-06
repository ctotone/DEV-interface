import {
  ACTOR_TYPES,
  CREATION_RECOMMENDATIONS,
  DERIVED_SCORE_DEFINITIONS,
  FLAG_KEYS,
  SKILLS,
  SYSTEM_ID,
  TALENT_GROUPS,
  TALENTS
} from "../constants.mjs";
import {
  assignSkillToken,
  buildSkillTokens,
  reconcileSkillTokenAssignments,
  releaseSkillToken
} from "../rules/character-creation.mjs";
import {
  calculateCreationDiagnostics,
  calculateFixedDerivedScores
} from "../rules/derived-values.mjs";

const {
  ApplicationV2,
  DialogV2,
  HandlebarsApplicationMixin
} = foundry.applications.api;
const { FilePicker } = foundry.applications.apps;

const DRAG_TYPE = "application/x-interface-skill-token";
const SKILL_KEYS = new Set(SKILLS.map(skill => skill.key));
const TALENT_KEYS = new Set(TALENTS.map(talent => talent.key));
const OPEN_APPLICATIONS = new Map();

function applicationKey(actor) {
  return String(actor?.uuid ?? actor?.id ?? "");
}

function numericFormValue(form, name) {
  const value = Number.parseInt(
    String(form.elements.namedItem(name)?.value ?? ""),
    10
  );
  return Number.isInteger(value) ? value : 0;
}

function textFormValue(form, name) {
  return String(form.elements.namedItem(name)?.value ?? "").trim();
}

function setText(element, value) {
  if (element) element.textContent = String(value);
}

function setFormValue(form, name, value) {
  const input = form.elements.namedItem(name);
  if (input) input.value = String(value);
}

function localizeSkill(skillKey) {
  const skill = SKILLS.find(entry => entry.key === skillKey);
  return skill ? game.i18n.localize(skill.label) : skillKey;
}

function buildInitialRecord(entries, source = {}) {
  return Object.fromEntries(entries.map(({ key }) => [
    key,
    Number.isInteger(Number(source?.[key])) ? Number(source[key]) : 0
  ]));
}

function actorSystemObject(actor) {
  if (typeof actor?.system?.toObject === "function") {
    return actor.system.toObject();
  }
  return structuredClone(actor?.system ?? {});
}

function creationWarningMessage(code, diagnostics) {
  switch (code) {
    case "skills":
      return game.i18n.format(
        "INTERFACE.CreationAssistant.WarningSkills",
        { values: diagnostics.skillValues.join(" / ") }
      );
    case "talents-under":
      return game.i18n.format(
        "INTERFACE.CreationAssistant.WarningTalentsUnder",
        {
          total: diagnostics.talentTotal,
          remaining:
            CREATION_RECOMMENDATIONS.talentTotal - diagnostics.talentTotal
        }
      );
    case "talents-over":
      return game.i18n.format(
        "INTERFACE.CreationAssistant.WarningTalentsOver",
        {
          total: diagnostics.talentTotal,
          excess:
            diagnostics.talentTotal - CREATION_RECOMMENDATIONS.talentTotal
        }
      );
    default:
      return code;
  }
}

function validateRanges({ skills, talents }) {
  for (const [key, value] of Object.entries(skills)) {
    if (!SKILL_KEYS.has(key) || !Number.isInteger(value) || value < 0 || value > 100) {
      return game.i18n.format(
        "INTERFACE.CreationAssistant.InvalidSkill",
        { skill: localizeSkill(key) }
      );
    }
  }

  for (const [key, value] of Object.entries(talents)) {
    const talent = TALENTS.find(entry => entry.key === key);
    if (!TALENT_KEYS.has(key) || !Number.isInteger(value) || value < 0 || value > 30) {
      return game.i18n.format(
        "INTERFACE.CreationAssistant.InvalidTalent",
        {
          talent: talent ? game.i18n.localize(talent.label) : key
        }
      );
    }
  }

  return null;
}

async function confirmCreationWarnings(diagnostics) {
  const messages = diagnostics.warnings.map(
    code => creationWarningMessage(code, diagnostics)
  );

  return DialogV2.wait({
    classes: ["interface", "interface-creation-warning-dialog"],
    window: {
      title: game.i18n.localize(
        "INTERFACE.CreationAssistant.WarningTitle"
      )
    },
    content: `
      <div class="interface-creation-warning">
        <p>${game.i18n.localize(
          "INTERFACE.CreationAssistant.WarningIntro"
        )}</p>
        <ul>${messages.map(message => `<li>${message}</li>`).join("")}</ul>
      </div>
    `,
    buttons: [
      {
        action: "back",
        label: game.i18n.localize(
          "INTERFACE.CreationAssistant.Back"
        ),
        default: true,
        callback: () => false
      },
      {
        action: "confirm",
        label: game.i18n.localize(
          "INTERFACE.CreationAssistant.Confirm"
        ),
        callback: () => true
      }
    ],
    rejectClose: false,
    modal: true
  });
}

async function choosePortraitAction() {
  const picker = new FilePicker({
    type: "image",
    current: this.portrait,
    callback: path => this.setPortrait(path)
  });
  return picker.render({ force: true });
}

async function submitCreation(event, form) {
  if (this.creationRunning) return;

  const snapshot = this.readSnapshot(form);
  if (!snapshot.name) {
    ui.notifications.error(
      game.i18n.localize("INTERFACE.CreationAssistant.NameRequired")
    );
    form.elements.namedItem("name")?.focus();
    return;
  }

  const rangeError = validateRanges(snapshot);
  if (rangeError) {
    ui.notifications.error(rangeError);
    return;
  }

  const diagnostics = calculateCreationDiagnostics(snapshot);
  if (diagnostics.warnings.length > 0) {
    const confirmed = await confirmCreationWarnings(diagnostics);
    if (confirmed !== true) return;
  }

  this.creationRunning = true;
  this.element?.classList.add("is-creating");
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  try {
    await this.persistSnapshot(snapshot);
    await this.actor.unsetFlag(
      SYSTEM_ID,
      FLAG_KEYS.CREATION_PENDING
    );
    this.creationCompleted = true;
  } catch (error) {
    console.error(
      "D100 Interface | Échec de finalisation du personnage",
      error
    );
    ui.notifications.error(
      game.i18n.format("INTERFACE.CreationAssistant.CreateError", {
        message: error?.message ?? String(error)
      })
    );
    this.creationRunning = false;
    this.element?.classList.remove("is-creating");
    if (submitButton?.isConnected) submitButton.disabled = false;
    return;
  }

  await this.close();

  try {
    const sheet = this.actor.sheet;
    if (sheet) {
      await sheet.render({
        ...this.renderOptions,
        force: true
      });
    }
  } catch (error) {
    console.error(
      "D100 Interface | Personnage finalisé mais ouverture de fiche impossible",
      error
    );
    ui.notifications.warn(
      game.i18n.format("INTERFACE.CreationAssistant.OpenSheetError", {
        message: error?.message ?? String(error)
      })
    );
  } finally {
    this.creationRunning = false;
  }
}

export class InterfaceCharacterCreationApplication
  extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "interface-character-creation",
    classes: ["interface", "interface-character-creation"],
    tag: "form",
    position: {
      width: 1180,
      height: 900
    },
    window: {
      title: "INTERFACE.CreationAssistant.Title",
      icon: "fa-solid fa-user-plus",
      resizable: true
    },
    actions: {
      choosePortrait: choosePortraitAction
    },
    form: {
      closeOnSubmit: false,
      handler: submitCreation
    }
  };

  static PARTS = {
    form: {
      template:
        "systems/interface/templates/actor/character-creation.hbs",
      scrollable: [".interface-character-creation__body"]
    }
  };

  static async openForActor({
    actor,
    renderOptions = {}
  } = {}) {
    if (!actor) {
      throw new Error("Actor requis pour ouvrir l’assistant de création.");
    }
    if (!actor.canUserModify?.(game.user, "update")) return null;

    const key = applicationKey(actor);
    const existing = OPEN_APPLICATIONS.get(key);
    if (existing) {
      existing.bringToFront?.();
      return existing;
    }

    const application = new this({
      actor,
      renderOptions
    });
    OPEN_APPLICATIONS.set(key, application);

    try {
      await application.render({
        ...renderOptions,
        force: true
      });
      return application;
    } catch (error) {
      if (OPEN_APPLICATIONS.get(key) === application) {
        OPEN_APPLICATIONS.delete(key);
      }
      throw error;
    }
  }

  constructor({
    actor,
    renderOptions = {}
  } = {}) {
    super();

    if (!actor) {
      throw new Error("Actor requis pour l’assistant de création.");
    }

    this.actor = actor;
    this.renderOptions = { ...renderOptions };
    this.skillTokens = buildSkillTokens();
    this.skillTokenAssignments = {};
    this.activeTokenId = null;
    this.creationRunning = false;
    this.creationCompleted = false;
    this.closing = false;
    this.portrait = String(actor.img ?? "");
    this.saveQueue = Promise.resolve();
  }

  async close(options = {}) {
    if (this.closing) return super.close(options);
    this.closing = true;

    try {
      if (!this.creationCompleted && this.form) {
        await this.saveDraft({ notify: true });
      }
    } finally {
      const key = applicationKey(this.actor);
      if (OPEN_APPLICATIONS.get(key) === this) {
        OPEN_APPLICATIONS.delete(key);
      }
    }

    return super.close(options);
  }

  async setPortrait(path) {
    this.portrait = String(path ?? "");
    const input = this.form?.elements.namedItem("img");
    if (input) input.value = this.portrait;

    const image = this.element?.querySelector(
      ".interface-identity__portrait img"
    );
    if (image) image.src = this.portrait;

    try {
      await this.queueActorUpdate({ img: this.portrait });
    } catch (error) {
      console.error(
        "D100 Interface | Échec d’enregistrement du portrait de création",
        error
      );
      ui.notifications.error(
        game.i18n.format("INTERFACE.CreationAssistant.CreateError", {
          message: error?.message ?? String(error)
        })
      );
    }
  }

  readSnapshot(form = this.form) {
    const skills = Object.fromEntries(SKILLS.map(skill => [
      skill.key,
      numericFormValue(form, `skills.${skill.key}`)
    ]));
    const talents = Object.fromEntries(TALENTS.map(talent => [
      talent.key,
      numericFormValue(form, `talents.${talent.key}`)
    ]));

    return {
      name: textFormValue(form, "name"),
      age: textFormValue(form, "age"),
      profession: textFormValue(form, "profession"),
      specializations: String(
        form.elements.namedItem("specializations")?.value ?? ""
      ).trim(),
      skills,
      talents
    };
  }

  buildActorUpdate(snapshot) {
    const update = {
      name: snapshot.name,
      img: this.portrait,
      "system.identity.age": snapshot.age,
      "system.identity.profession": snapshot.profession,
      "system.identity.specializations": snapshot.specializations
    };

    for (const [key, value] of Object.entries(snapshot.skills)) {
      update[`system.skills.${key}`] = value;
    }
    for (const [key, value] of Object.entries(snapshot.talents)) {
      update[`system.talents.${key}`] = value;
    }

    return update;
  }

  queueActorUpdate(update) {
    const operation = this.saveQueue
      .catch(() => undefined)
      .then(() => this.actor.update(update));
    this.saveQueue = operation;
    return operation;
  }

  persistSnapshot(snapshot) {
    return this.queueActorUpdate(this.buildActorUpdate(snapshot));
  }

  async saveDraft({ notify = false } = {}) {
    const snapshot = this.readSnapshot();
    const rangeError = validateRanges(snapshot);
    if (rangeError) {
      if (notify) ui.notifications.error(rangeError);
      return false;
    }

    try {
      await this.persistSnapshot(snapshot);
      return true;
    } catch (error) {
      console.error(
        "D100 Interface | Échec d’enregistrement de la création en attente",
        error
      );
      if (notify) {
        ui.notifications.error(
          game.i18n.format("INTERFACE.CreationAssistant.CreateError", {
            message: error?.message ?? String(error)
          })
        );
      }
      return false;
    }
  }

  refreshLiveValues() {
    const form = this.form;
    if (!form) return;

    const snapshot = this.readSnapshot(form);
    const derived = calculateFixedDerivedScores(snapshot);
    const diagnostics = calculateCreationDiagnostics(snapshot);

    for (const [key, value] of Object.entries(derived)) {
      setText(
        this.element.querySelector(`[data-derived-value="${key}"]`),
        value
      );
    }

    this.skillTokenAssignments = reconcileSkillTokenAssignments({
      tokens: this.skillTokens,
      skillValues: snapshot.skills,
      previousAssignments: this.skillTokenAssignments
    });

    for (const token of this.skillTokens) {
      const element = this.element.querySelector(
        `[data-skill-token-id="${token.id}"]`
      );
      if (!element) continue;

      const skillKey = this.skillTokenAssignments[token.id];
      const consumed = Boolean(skillKey);
      element.classList.toggle("is-consumed", consumed);
      element.dataset.assignedSkill = skillKey ?? "";
      element.setAttribute("aria-pressed", String(consumed));
      element.title = consumed
        ? game.i18n.format(
          "INTERFACE.CreationAssistant.TokenAssigned",
          { skill: localizeSkill(skillKey) }
        )
        : game.i18n.localize(
          "INTERFACE.CreationAssistant.TokenAvailable"
        );
    }

    for (const skill of SKILLS) {
      const token = this.skillTokens.find(candidate => (
        this.skillTokenAssignments[candidate.id] === skill.key
      ));
      const badge = this.element.querySelector(
        `[data-assigned-token-for="${skill.key}"]`
      );
      if (!badge) continue;

      badge.textContent = token ? String(token.value) : "";
      badge.classList.toggle("is-empty", !token);
      badge.setAttribute("aria-hidden", String(!token));
    }

    const assignedCount = Object.keys(this.skillTokenAssignments).length;
    const remaining = CREATION_RECOMMENDATIONS.talentTotal
      - diagnostics.talentTotal;

    setText(
      this.element.querySelector("[data-recap-token-count]"),
      `${assignedCount} / ${this.skillTokens.length}`
    );
    setText(
      this.element.querySelector("[data-recap-skill-values]"),
      diagnostics.skillValues.join(" / ")
    );
    setText(
      this.element.querySelector("[data-recap-talent-total]"),
      `${diagnostics.talentTotal} / ${CREATION_RECOMMENDATIONS.talentTotal}`
    );
    setText(
      this.element.querySelector("[data-talent-block-total]"),
      `${diagnostics.talentTotal} / ${CREATION_RECOMMENDATIONS.talentTotal}`
    );
    setText(
      this.element.querySelector("[data-recap-talent-remaining]"),
      remaining
    );

    const recap = this.element.querySelector(
      ".interface-creation-recap"
    );
    recap?.classList.toggle(
      "has-warning",
      diagnostics.warnings.length > 0
    );
    this.element.querySelector(
      "[data-recap-talent-remaining]"
    )?.classList.toggle("is-negative", remaining < 0);
    this.element.querySelector(
      "[data-talent-block-total]"
    )?.classList.toggle("is-negative", remaining < 0);
  }

  assignToken(tokenId, skillKey) {
    const form = this.form;
    if (!form) return;

    const snapshot = this.readSnapshot(form);
    const result = assignSkillToken({
      tokens: this.skillTokens,
      skillValues: snapshot.skills,
      assignments: this.skillTokenAssignments,
      tokenId,
      skillKey
    });

    for (const [key, value] of Object.entries(result.skillValues)) {
      setFormValue(form, `skills.${key}`, value);
    }
    this.skillTokenAssignments = { ...result.assignments };
    this.refreshLiveValues();
    void this.saveDraft();
  }

  releaseToken(tokenId) {
    const form = this.form;
    if (!form) return;

    const snapshot = this.readSnapshot(form);
    const result = releaseSkillToken({
      tokens: this.skillTokens,
      skillValues: snapshot.skills,
      assignments: this.skillTokenAssignments,
      tokenId
    });

    for (const [key, value] of Object.entries(result.skillValues)) {
      setFormValue(form, `skills.${key}`, value);
    }
    this.skillTokenAssignments = { ...result.assignments };
    this.refreshLiveValues();
    void this.saveDraft();
  }

  activateTokenDragAndDrop() {
    const tokenElements = this.element.querySelectorAll(
      "[data-skill-token-id]"
    );
    const dropZones = this.element.querySelectorAll(
      "[data-skill-drop]"
    );
    const bank = this.element.querySelector("[data-token-bank]");

    for (const token of tokenElements) {
      token.addEventListener("dragstart", event => {
        this.activeTokenId = token.dataset.skillTokenId;
        token.classList.add("is-dragging");
        event.dataTransfer?.setData(DRAG_TYPE, this.activeTokenId);
        if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
      });
      token.addEventListener("dragend", () => {
        token.classList.remove("is-dragging");
        this.activeTokenId = null;
        for (const zone of dropZones) zone.classList.remove("is-drag-over");
        bank?.classList.remove("is-drag-over");
      });
    }

    for (const zone of dropZones) {
      zone.addEventListener("dragover", event => {
        event.preventDefault();
        zone.classList.add("is-drag-over");
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
      });
      zone.addEventListener("dragleave", event => {
        if (!zone.contains(event.relatedTarget)) {
          zone.classList.remove("is-drag-over");
        }
      });
      zone.addEventListener("drop", event => {
        event.preventDefault();
        zone.classList.remove("is-drag-over");
        const tokenId = event.dataTransfer?.getData(DRAG_TYPE)
          || this.activeTokenId;
        if (tokenId) this.assignToken(tokenId, zone.dataset.skillDrop);
      });
    }

    bank?.addEventListener("dragover", event => {
      event.preventDefault();
      bank.classList.add("is-drag-over");
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    });
    bank?.addEventListener("dragleave", event => {
      if (!bank.contains(event.relatedTarget)) {
        bank.classList.remove("is-drag-over");
      }
    });
    bank?.addEventListener("drop", event => {
      event.preventDefault();
      bank.classList.remove("is-drag-over");
      const tokenId = event.dataTransfer?.getData(DRAG_TYPE)
        || this.activeTokenId;
      if (tokenId) this.releaseToken(tokenId);
    });
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const system = actorSystemObject(this.actor);
    const skills = buildInitialRecord(SKILLS, system.skills);
    const talents = buildInitialRecord(TALENTS, system.talents);

    return {
      ...context,
      identity: {
        name: String(this.actor.name ?? ""),
        age: String(system.identity?.age ?? ""),
        profession: String(system.identity?.profession ?? ""),
        specializations: String(
          system.identity?.specializations ?? ""
        ),
        portrait: this.portrait
      },
      groups: TALENT_GROUPS.map(group => ({
        ...group,
        skillValue: skills[group.skill],
        talents: group.talents.map(talent => ({
          ...talent,
          value: talents[talent.key]
        }))
      })),
      tokens: this.skillTokens,
      recommendedSkills: CREATION_RECOMMENDATIONS.skills.join(" / "),
      talentRecommendation: CREATION_RECOMMENDATIONS.talentTotal,
      derivedScores: Object.entries(DERIVED_SCORE_DEFINITIONS).map(
        ([key, definition]) => ({
          key,
          label: definition.label,
          tone: definition.tone,
          value: 0
        })
      )
    };
  }

  async _postRender(context, options) {
    await super._postRender(context, options);

    const form = this.form;
    for (const input of form.querySelectorAll(
      'input[name^="skills."], input[name^="talents."]'
    )) {
      input.addEventListener("input", () => this.refreshLiveValues());
      input.addEventListener("change", () => {
        this.refreshLiveValues();
        void this.saveDraft();
      });
    }

    for (const field of form.querySelectorAll(
      'input[name="name"], input[name="age"], input[name="profession"], textarea[name="specializations"]'
    )) {
      field.addEventListener("change", () => {
        void this.saveDraft();
      });
    }

    this.activateTokenDragAndDrop();
    this.refreshLiveValues();
  }
}
