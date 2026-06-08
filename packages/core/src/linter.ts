import type { SkillLintIssue, SkillLintLevel, SkillLintResult } from "./types";

interface RequirementCheck {
  id: string;
  message: string;
  suggestion: string;
  pattern: RegExp;
}

const requirementChecks: RequirementCheck[] = [
  {
    id: "goal",
    message: "Missing a clear goal or purpose section.",
    suggestion: "Add a Goal section that states what the skill helps the agent accomplish.",
    pattern: /(goal|purpose|objective|定位|目标|目的)/i
  },
  {
    id: "trigger",
    message: "Missing trigger conditions.",
    suggestion: "Add Trigger Conditions that explain when the agent should use this skill.",
    pattern: /(trigger|when to use|use when|触发|使用条件|适用场景)/i
  },
  {
    id: "input",
    message: "Missing input format.",
    suggestion: "Add an Input Format section listing what the user or agent should provide.",
    pattern: /(input format|inputs?|输入格式|输入)/i
  },
  {
    id: "output",
    message: "Missing output format.",
    suggestion: "Add an Output Format section so the result has a predictable shape.",
    pattern: /(output format|outputs?|输出格式|输出)/i
  },
  {
    id: "steps",
    message: "Missing execution steps.",
    suggestion: "Add ordered Execution Steps that the agent can follow consistently.",
    pattern: /(execution steps|steps|workflow|process|执行步骤|步骤|流程)/i
  },
  {
    id: "forbidden",
    message: "Missing forbidden actions or constraints.",
    suggestion: "Add a Forbidden section that names what the agent must avoid.",
    pattern: /(forbidden|constraints|do not|don't|禁止|不要|约束)/i
  },
  {
    id: "safety",
    message: "Missing safety constraints.",
    suggestion: "Add Safety Notes covering secrets, privacy, destructive commands, and high-impact risks.",
    pattern: /(safety|security|privacy|安全|隐私|风险)/i
  },
  {
    id: "success-criteria",
    message: "Missing success criteria or quality standards.",
    suggestion: "Add Success Criteria or Quality Standards so the agent can judge whether the work is done.",
    pattern: /(success criteria|quality standards|acceptance criteria|done when|成功标准|质量标准|验收标准)/i
  },
  {
    id: "human-review",
    message: "Missing a human review or approval step.",
    suggestion: "Add a Human Review step for high-impact changes, destructive actions, external publishing, or private data.",
    pattern: /(human review|manual review|review before|user approval|explicit approval|人工|人工审核|人为审核|复核)/i
  }
];

const dangerousPatterns = [
  { pattern: /\brm\s+-rf\b/i, label: "file deletion risk: rm -rf" },
  { pattern: /\bcurl\b[^\n|]*\|\s*(sh|bash)\b/i, label: "network command risk: curl piped into a shell" },
  { pattern: /\bwget\b[^\n|]*\|\s*(sh|bash)\b/i, label: "network command risk: wget piped into a shell" },
  {
    pattern: /(read|cat|print|open|upload|send|exfiltrate).{0,80}(\.env|id_rsa|id_ed25519|ssh key|private key|token|secret|api[_-]?key)/i,
    label: "secret exfiltration risk: instruction to read or upload sensitive local secrets"
  },
  {
    pattern: /(autonomously|without asking|without approval|no approval|auto-approve|automatically execute|run commands automatically)/i,
    label: "unsafe autonomous execution"
  }
];

const secretPatterns = [
  { pattern: /\bOPENAI_API_KEY\b/, label: "OPENAI_API_KEY reference" },
  { pattern: /\bGITHUB_TOKEN\b/, label: "GITHUB_TOKEN reference" },
  { pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, label: "private key material" },
  { pattern: /\b(?:api[_-]?key|access[_-]?token|secret[_-]?key)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{16,}/i, label: "possible hard-coded secret" }
];

const networkCommandPattern = /\b(curl|wget|scp|rsync|ftp|sftp)\b/i;
const vagueObjectivePattern =
  /(goal|purpose|objective|目标|目的)\s*:?\s*(do things|help with stuff|make it better|improve things|general help|anything|whatever|随便|做事情|优化一下)/i;
const negationPattern = /(do not|don't|never|avoid|must not|forbidden|禁止|不要|不得|避免|切勿)/i;

function addIssue(issues: SkillLintIssue[], severity: SkillLintIssue["severity"], message: string, suggestion: string): void {
  issues.push({ severity, message, suggestion });
}

function lineIsProtective(line: string): boolean {
  return negationPattern.test(line);
}

function textLength(content: string): number {
  return content.replace(/\s+/g, "").length;
}

function getLevel(score: number, issues: SkillLintIssue[]): SkillLintLevel {
  if (issues.some((issue) => issue.severity === "danger")) {
    return "risky";
  }

  if (score >= 90) {
    return "excellent";
  }

  if (score >= 75) {
    return "good";
  }

  return "needs_improvement";
}

export function lintSkillContent(content: string): SkillLintResult {
  const issues: SkillLintIssue[] = [];
  let penalty = 0;
  const normalized = content.trim();

  if (!normalized) {
    return {
      score: 0,
      level: "risky",
      issues: [
        {
          severity: "danger",
          message: "Skill content is empty.",
          suggestion: "Add a complete skill with goal, triggers, inputs, outputs, steps, constraints, and safety notes."
        }
      ]
    };
  }

  for (const check of requirementChecks) {
    if (!check.pattern.test(normalized)) {
      penalty += 10;
      addIssue(issues, "warning", check.message, check.suggestion);
    }
  }

  if (textLength(normalized) < 700) {
    penalty += 15;
    addIssue(
      issues,
      "warning",
      "Skill content is too short to guide an agent reliably.",
      "Expand the skill with concrete triggers, step-by-step behavior, examples, and quality checks."
    );
  }

  if (/(todo|tbd|something|anything|various|stuff|etc\.|随便|等等|泛泛)/i.test(normalized)) {
    penalty += 8;
    addIssue(
      issues,
      "info",
      "Skill content contains vague placeholder language.",
      "Replace placeholders with concrete instructions, examples, or decision criteria."
    );
  }

  if (vagueObjectivePattern.test(normalized)) {
    penalty += 12;
    addIssue(
      issues,
      "warning",
      "Vague objective detected.",
      "Rewrite the goal with the concrete user outcome, target workflow, and success criteria."
    );
  }

  const lines = normalized.split(/\r?\n/);

  for (const line of lines) {
    if (networkCommandPattern.test(line) && !lineIsProtective(line)) {
      penalty += 12;
      addIssue(
        issues,
        "warning",
        "Network command risk detected.",
        "Avoid network commands in agent instructions unless they require explicit user approval and name the destination."
      );
    }

    for (const dangerous of dangerousPatterns) {
      if (dangerous.pattern.test(line) && !lineIsProtective(line)) {
        penalty += 30;
        addIssue(
          issues,
          "danger",
          `Potentially dangerous instruction detected: ${dangerous.label}.`,
          "Remove the instruction or rewrite it as an explicit prohibition with safe alternatives."
        );
      }
    }

    for (const secret of secretPatterns) {
      if (secret.pattern.test(line) && !lineIsProtective(line)) {
        penalty += 25;
        addIssue(
          issues,
          "danger",
          `Potential secret leakage risk detected: ${secret.label}.`,
          "Remove secret-like values and replace them with placeholders or a warning not to expose credentials."
        );
      }
    }
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));

  if (issues.length === 0) {
    addIssue(
      issues,
      "info",
      "No major structure or safety issues found.",
      "Review the skill against your actual workflow before sharing it."
    );
  }

  return {
    score,
    level: getLevel(score, issues),
    issues
  };
}
