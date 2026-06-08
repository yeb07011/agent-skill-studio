import type { SkillDefinition } from "../types";

export function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function numberedList(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

export function renderStandardSections(skill: SkillDefinition): string {
  return `## Goal

${skill.description}

## Use Cases

${bulletList(skill.useCases)}

## Trigger Conditions

${bulletList(skill.triggers)}

## Input Format

${bulletList(skill.inputFormat)}

## Output Format

${bulletList(skill.outputFormat)}

## Execution Steps

${numberedList(skill.steps)}

## Quality Standards

${bulletList(skill.qualityStandards)}

## Human Review

- Ask for human review before applying high-impact changes, publishing external-facing content, or using private data.
- Ask for explicit user approval before irreversible actions, destructive commands, credential handling, or network operations.

## Forbidden

${bulletList(skill.forbidden)}

## Safety Notes

${bulletList(skill.safetyNotes)}

## Example Prompt

${skill.examplePrompt}
`;
}
