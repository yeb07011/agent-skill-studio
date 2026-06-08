import type { SkillDefinition } from "../types";
import { renderStandardSections } from "./shared";

export function renderCursorRule(skill: SkillDefinition): string {
  return `---
description: ${skill.description}
globs:
  - "**/*"
alwaysApply: false
---

# ${skill.name}

${renderStandardSections(skill)}
## Cursor Rule Guidance

Apply this rule when the user's active task matches the trigger conditions. Keep generated code consistent with the current repository and explain only the decisions that help the user continue.
`;
}
