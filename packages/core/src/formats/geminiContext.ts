import type { SkillDefinition } from "../types";
import { renderStandardSections } from "./shared";

export function renderGeminiContext(skill: SkillDefinition): string {
  return `# Gemini Context: ${skill.name}

${renderStandardSections(skill)}
## Gemini CLI Guidance

When this context is loaded, follow the execution steps, produce the requested output format, and check the forbidden and safety sections before responding.
`;
}
