import { CREATION_RECOMMENDATIONS, SKILLS } from "../constants.mjs";

function numericValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function buildSkillTokens(
  values = CREATION_RECOMMENDATIONS.skills
) {
  return values.map((value, index) => Object.freeze({
    id: `skill-token-${index + 1}`,
    value
  }));
}

export function reconcileSkillTokenAssignments({
  tokens = buildSkillTokens(),
  skillValues = {},
  previousAssignments = {}
} = {}) {
  const assignments = {};
  const assignedSkills = new Set();
  const validSkillKeys = new Set(SKILLS.map(skill => skill.key));

  for (const token of tokens) {
    const skillKey = previousAssignments[token.id];
    if (!validSkillKeys.has(skillKey) || assignedSkills.has(skillKey)) continue;
    if (numericValue(skillValues[skillKey]) !== token.value) continue;

    assignments[token.id] = skillKey;
    assignedSkills.add(skillKey);
  }

  for (const skill of SKILLS) {
    if (assignedSkills.has(skill.key)) continue;
    const value = numericValue(skillValues[skill.key]);
    const token = tokens.find(candidate => (
      candidate.value === value && !assignments[candidate.id]
    ));
    if (!token) continue;

    assignments[token.id] = skill.key;
    assignedSkills.add(skill.key);
  }

  return Object.freeze({ ...assignments });
}

export function assignSkillToken({
  tokens = buildSkillTokens(),
  skillValues = {},
  assignments = {},
  tokenId,
  skillKey
} = {}) {
  const token = tokens.find(candidate => candidate.id === tokenId);
  if (!token || !SKILLS.some(skill => skill.key === skillKey)) {
    return {
      skillValues: Object.freeze({ ...skillValues }),
      assignments: reconcileSkillTokenAssignments({
        tokens,
        skillValues,
        previousAssignments: assignments
      })
    };
  }

  const nextSkillValues = { ...skillValues };
  const previousSkill = assignments[tokenId];
  if (previousSkill && previousSkill !== skillKey) {
    nextSkillValues[previousSkill] = 0;
  }

  nextSkillValues[skillKey] = token.value;
  const preferredAssignments = Object.fromEntries(
    Object.entries(assignments).filter(([, assignedSkill]) => (
      assignedSkill !== skillKey
    ))
  );
  preferredAssignments[tokenId] = skillKey;

  return {
    skillValues: Object.freeze(nextSkillValues),
    assignments: reconcileSkillTokenAssignments({
      tokens,
      skillValues: nextSkillValues,
      previousAssignments: preferredAssignments
    })
  };
}

export function releaseSkillToken({
  tokens = buildSkillTokens(),
  skillValues = {},
  assignments = {},
  tokenId
} = {}) {
  const nextSkillValues = { ...skillValues };
  const skillKey = assignments[tokenId];
  if (skillKey) nextSkillValues[skillKey] = 0;

  const preferredAssignments = { ...assignments };
  delete preferredAssignments[tokenId];

  return {
    skillValues: Object.freeze(nextSkillValues),
    assignments: reconcileSkillTokenAssignments({
      tokens,
      skillValues: nextSkillValues,
      previousAssignments: preferredAssignments
    })
  };
}
