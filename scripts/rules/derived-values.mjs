import {
  CREATION_RECOMMENDATIONS,
  DERIVED_SCORE_DEFINITIONS,
  SKILLS,
  TALENTS
} from "../constants.mjs";

export const MAX_DERIVED_SCORE = 99;

const SKILL_KEYS = new Set(SKILLS.map(skill => skill.key));
const TALENT_KEYS = new Set(TALENTS.map(talent => talent.key));

function numericValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function average(record, keys) {
  if (keys.length === 0) return 0;

  return keys.reduce(
    (total, key) => total + numericValue(record?.[key]),
    0
  ) / keys.length;
}

export function calculateStateLevel(value) {
  const normalized = Math.max(0, numericValue(value));
  return normalized === 0 ? 0 : Math.ceil(normalized / 3);
}

export function calculateStatePenalty({
  wounds,
  stress,
  coefficient
}) {
  const woundsLevel = calculateStateLevel(wounds);
  const stressLevel = calculateStateLevel(stress);
  const normalizedCoefficient = Math.max(0, numericValue(coefficient));

  return {
    levels: {
      wounds: woundsLevel,
      stress: stressLevel
    },
    penalty: (woundsLevel + stressLevel) * normalizedCoefficient
  };
}

export function calculateDerivedScore({
  skills,
  talents,
  skillKeys,
  talentKeys
}) {
  const raw = average(skills, skillKeys) + average(talents, talentKeys);
  return Math.min(MAX_DERIVED_SCORE, Math.floor(raw));
}

export function calculateFixedDerivedScores({ skills, talents }) {
  return Object.fromEntries(
    Object.entries(DERIVED_SCORE_DEFINITIONS).map(([key, definition]) => [
      key,
      calculateDerivedScore({
        skills,
        talents,
        skillKeys: definition.skills,
        talentKeys: definition.talents
      })
    ])
  );
}

export function validateCustomDerivedConfiguration(configuration) {
  const enabled = configuration?.enabled === true;
  const name = String(configuration?.name ?? "").trim();
  const skills = Array.isArray(configuration?.skills)
    ? [...configuration.skills]
    : [];
  const talents = Array.isArray(configuration?.talents)
    ? [...configuration.talents]
    : [];

  if (!enabled) {
    return {
      enabled: false,
      valid: false,
      name,
      skills,
      talents,
      reason: "disabled"
    };
  }

  const valid = name.length > 0
    && skills.length === 2
    && new Set(skills).size === 2
    && talents.length === 6
    && new Set(talents).size === 6
    && skills.every(key => SKILL_KEYS.has(key))
    && talents.every(key => TALENT_KEYS.has(key));

  return {
    enabled,
    valid,
    name,
    skills,
    talents,
    reason: valid ? null : "invalid"
  };
}

export function calculateCustomDerivedScore({
  skills,
  talents,
  configuration
}) {
  const validated = validateCustomDerivedConfiguration(configuration);
  if (!validated.valid) return null;

  return calculateDerivedScore({
    skills,
    talents,
    skillKeys: validated.skills,
    talentKeys: validated.talents
  });
}

export function calculateCreationDiagnostics({ skills, talents }) {
  const skillValues = SKILLS
    .map(skill => numericValue(skills?.[skill.key]))
    .sort((a, b) => a - b);
  const recommendedSkillValues = [...CREATION_RECOMMENDATIONS.skills];
  const skillDistributionRecommended = skillValues.length
      === recommendedSkillValues.length
    && skillValues.every(
      (value, index) => value === recommendedSkillValues[index]
    );

  const talentTotal = TALENTS.reduce(
    (total, talent) => total + numericValue(talents?.[talent.key]),
    0
  );
  const talentTotalRecommended =
    talentTotal === CREATION_RECOMMENDATIONS.talentTotal;

  const warnings = [];
  if (!skillDistributionRecommended) warnings.push("skills");
  if (talentTotal < CREATION_RECOMMENDATIONS.talentTotal) {
    warnings.push("talents-under");
  }
  if (talentTotal > CREATION_RECOMMENDATIONS.talentTotal) {
    warnings.push("talents-over");
  }

  return {
    skillValues,
    skillDistributionRecommended,
    talentTotal,
    talentTotalRecommended,
    warnings
  };
}

export function calculateInitiativeBonus(distance) {
  return Math.round(numericValue(distance) / 10);
}

export function buildCharacterDerivedData({
  skills,
  talents,
  wounds,
  stress,
  statePenaltyCoefficient,
  customDerived
}) {
  const state = calculateStatePenalty({
    wounds,
    stress,
    coefficient: statePenaltyCoefficient
  });
  const fixedScores = calculateFixedDerivedScores({ skills, talents });
  const customScore = calculateCustomDerivedScore({
    skills,
    talents,
    configuration: customDerived
  });

  return {
    levels: state.levels,
    statePenalty: state.penalty,
    scores: {
      ...fixedScores,
      custom: customScore
    },
    initiativeBonus: calculateInitiativeBonus(fixedScores.distance),
    creation: calculateCreationDiagnostics({ skills, talents })
  };
}
