import { renderAgentsMd } from "./formats/agentsMd";
import { renderClaudeSkill } from "./formats/claudeSkill";
import { renderCodexSkill } from "./formats/codexSkill";
import { renderCursorRule } from "./formats/cursorRule";
import { renderGeminiContext } from "./formats/geminiContext";
import { getTemplateById } from "./templates";
import type {
  AgentSkillManifest,
  GeneratedSkillPackage,
  SkillDefinition,
  SkillFormat,
  SkillGenerationInput,
  SkillPackageFile
} from "./types";

const defaultFormats: SkillFormat[] = ["agents", "codex", "claude", "cursor", "gemini", "example", "readme", "manifest"];

export function slugifySkillName(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "custom-skill";
}

function titleize(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ensureSentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Helps AI coding agents execute a reusable workflow with consistent quality.";
  }

  return /[.!?。！？]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function mergeTemplate(template: SkillDefinition, input: SkillGenerationInput): SkillDefinition {
  const explicitName = input.name?.trim();
  const slug = slugifySkillName(explicitName ?? template.slug);
  const shouldUseTemplateName = !explicitName || slug === template.slug;

  return {
    ...template,
    name: shouldUseTemplateName ? template.name : titleize(slug),
    slug,
    description: input.description?.trim() ? ensureSentence(input.description) : template.description
  };
}

export function normalizeSkillInput(input: SkillGenerationInput): SkillDefinition {
  const template = input.templateId ? getTemplateById(input.templateId) : input.name ? getTemplateById(slugifySkillName(input.name)) : undefined;

  if (template) {
    return mergeTemplate(template, input);
  }

  const slug = slugifySkillName(input.name ?? input.description.slice(0, 52));
  const name = titleize(slug);
  const description = ensureSentence(input.description);

  return {
    name,
    slug,
    description,
    useCases: [
      `Turning a rough prompt or SOP into a reusable ${name} skill for AI coding agents.`,
      "Standardizing repeated agent work so outputs are easier to review and improve.",
      "Sharing a clear workflow across Claude Code, Codex, Cursor, Gemini CLI, and similar tools."
    ],
    triggers: [
      `The user asks for help with: ${description}`,
      "The task would benefit from a repeatable workflow, quality bar, and output contract.",
      "The agent needs to transform loose requirements into structured execution steps."
    ],
    inputFormat: [
      "Goal or job-to-be-done.",
      "Context, audience, constraints, and source material.",
      "Preferred output format and examples when available.",
      "Safety, privacy, or tooling boundaries."
    ],
    outputFormat: [
      "A short interpretation of the user's goal.",
      "A structured plan or artifact matching the requested workflow.",
      "Checks for quality, safety, and completeness.",
      "Next actions or handoff notes when useful."
    ],
    steps: [
      "Clarify the user's goal, success criteria, and constraints.",
      "Identify the required inputs and ask only for missing information that blocks progress.",
      "Execute the workflow in focused steps, keeping intermediate reasoning concise.",
      "Validate the output against the quality standards and safety notes.",
      "Return the final artifact in the requested format with any important caveats."
    ],
    qualityStandards: [
      "The output is specific to the user's context rather than generic advice.",
      "The workflow is repeatable and clear enough for another agent to follow.",
      "Assumptions, risks, and limitations are named when they affect the result.",
      "The final answer is concise, structured, and directly usable.",
      "Safety and privacy constraints are checked before delivery."
    ],
    forbidden: [
      "Do not invent facts, credentials, user history, or external results.",
      "Do not run destructive commands or execute untrusted install scripts.",
      "Do not read or expose private environment files, credentials, tokens, or private keys.",
      "Do not produce vague filler when concrete steps or artifacts are needed."
    ],
    safetyNotes: [
      "Treat secrets, tokens, private keys, credentials, and environment files as sensitive.",
      "Avoid collecting personal data unless it is required and explicitly provided by the user.",
      "Escalate uncertainty in legal, medical, financial, security, or high-impact decisions."
    ],
    examplePrompt: `Create a ${slug} skill for AI coding agents. It should help with ${description}`
  };
}

function renderExamplePrompt(skill: SkillDefinition): string {
  return `# Example Prompt

${skill.examplePrompt}

## Context

- Target agent tools: Claude Code, Codex, Cursor, Gemini CLI
- Desired output: reusable skill package
- Quality bar: clear triggers, execution steps, output contract, safety notes, and examples
`;
}

function renderPackageReadme(skill: SkillDefinition): string {
  return `# ${skill.name}

${skill.description}

## What This Package Contains

- \`AGENTS.md\` for generic AI coding agents.
- \`.codex/skills/${skill.slug}/SKILL.md\` for Codex.
- \`.claude/skills/${skill.slug}/SKILL.md\` for Claude Code.
- \`.cursor/rules/${skill.slug}.mdc\` for Cursor.
- \`.gemini/${skill.slug}.md\` for Gemini CLI context.
- \`examples/prompt.md\` with a ready-to-use prompt.
- \`agent-skill.json\` with package metadata for registries and tooling.

## Suggested Use

Copy the relevant file or folder into the corresponding AI coding tool configuration location, then adapt the details to your team or project.

## Safety

Review generated instructions before use. Do not include secrets, credentials, private keys, or private environment files in a skill.
`;
}

function inferSafetyLevel(skill: SkillDefinition): string {
  const combined = [
    skill.description,
    ...skill.steps,
    ...skill.forbidden,
    ...skill.safetyNotes,
    ...skill.qualityStandards
  ].join(" ");

  if (/(credential|token|private key|secret|destructive|security|privacy|medical|financial|legal)/i.test(combined)) {
    return "review_required";
  }

  return "standard";
}

function renderManifest(skill: SkillDefinition, files: SkillPackageFile[]): string {
  const manifestPath = "agent-skill.json";
  const manifest: AgentSkillManifest = {
    name: skill.slug,
    description: skill.description,
    version: "0.1.0",
    targets: ["codex", "claude-code", "cursor", "gemini-cli"],
    safetyLevel: inferSafetyLevel(skill),
    createdAt: new Date().toISOString(),
    files: [...files.map((file) => file.path), manifestPath]
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

export function generateSkillPackage(input: SkillGenerationInput): GeneratedSkillPackage {
  const skill = normalizeSkillInput(input);
  const formats = input.formats?.length ? input.formats : defaultFormats;
  const files: SkillPackageFile[] = [];

  if (formats.includes("agents")) {
    files.push({ path: "AGENTS.md", content: renderAgentsMd(skill) });
  }

  if (formats.includes("codex")) {
    files.push({ path: `.codex/skills/${skill.slug}/SKILL.md`, content: renderCodexSkill(skill) });
  }

  if (formats.includes("claude")) {
    files.push({ path: `.claude/skills/${skill.slug}/SKILL.md`, content: renderClaudeSkill(skill) });
  }

  if (formats.includes("cursor")) {
    files.push({ path: `.cursor/rules/${skill.slug}.mdc`, content: renderCursorRule(skill) });
  }

  if (formats.includes("gemini")) {
    files.push({ path: `.gemini/${skill.slug}.md`, content: renderGeminiContext(skill) });
  }

  if (formats.includes("example")) {
    files.push({ path: "examples/prompt.md", content: renderExamplePrompt(skill) });
  }

  if (formats.includes("readme")) {
    files.push({ path: "README.md", content: renderPackageReadme(skill) });
  }

  if (formats.includes("manifest")) {
    files.push({ path: "agent-skill.json", content: renderManifest(skill, files) });
  }

  return { skill, files };
}
