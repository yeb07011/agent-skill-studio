export type SkillFormat =
  | "agents"
  | "codex"
  | "claude"
  | "cursor"
  | "gemini"
  | "example"
  | "readme"
  | "manifest";

export interface SkillGenerationInput {
  name?: string;
  description: string;
  templateId?: string;
  formats?: SkillFormat[];
}

export interface SkillDefinition {
  name: string;
  slug: string;
  description: string;
  useCases: string[];
  triggers: string[];
  inputFormat: string[];
  outputFormat: string[];
  steps: string[];
  qualityStandards: string[];
  forbidden: string[];
  safetyNotes: string[];
  examplePrompt: string;
}

export interface SkillPackageFile {
  path: string;
  content: string;
}

export interface AgentSkillManifest {
  name: string;
  description: string;
  version: string;
  targets: ["codex", "claude-code", "cursor", "gemini-cli"];
  safetyLevel: string;
  createdAt: string;
  files: string[];
}

export interface GeneratedSkillPackage {
  skill: SkillDefinition;
  files: SkillPackageFile[];
}

export interface SkillTemplate extends SkillDefinition {
  templateId: string;
}

export interface LlmProvider {
  id: string;
  generateSkill(input: SkillGenerationInput): Promise<SkillDefinition>;
}

export type SkillLintLevel = "excellent" | "good" | "needs_improvement" | "risky";

export interface SkillLintIssue {
  severity: "info" | "warning" | "danger";
  message: string;
  suggestion: string;
}

export interface SkillLintResult {
  score: number;
  level: SkillLintLevel;
  issues: SkillLintIssue[];
}
