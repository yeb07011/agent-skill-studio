import type { SkillDefinition } from "../types";
import { renderStandardSections } from "./shared";

export function renderCodexSkill(skill: SkillDefinition): string {
  return `# ${skill.name}

Use this skill inside Codex when the task matches the trigger conditions below.

${renderStandardSections(skill)}
## Codex Guidance

- Prefer making concrete changes or producing the requested artifact when the user asks for implementation.
- Keep edits scoped to the user's goal and the surrounding project conventions.
- Verify the result when a local check is available.
`;
}
