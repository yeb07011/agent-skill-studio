import type { SkillDefinition } from "../types";
import { renderStandardSections } from "./shared";

export function renderClaudeSkill(skill: SkillDefinition): string {
  return `---
name: ${skill.slug}
description: ${skill.description}
---

# ${skill.name}

${renderStandardSections(skill)}
## Claude Code Guidance

Use this skill when the user's request matches the trigger conditions. Keep the response grounded in the files and context the user has provided, and ask for missing details only when they block a useful result.
`;
}
