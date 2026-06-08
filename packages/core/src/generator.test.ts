import { describe, expect, it } from "vitest";
import { generateSkillPackage } from "./generator";

describe("generateSkillPackage", () => {
  it("generates every supported agent format", () => {
    const result = generateSkillPackage({
      name: "frontend-taste",
      description: "Make landing pages visually polished"
    });

    expect(result.skill.slug).toBe("frontend-taste");
    expect(result.files.map((file) => file.path)).toEqual([
      "AGENTS.md",
      ".codex/skills/frontend-taste/SKILL.md",
      ".claude/skills/frontend-taste/SKILL.md",
      ".cursor/rules/frontend-taste.mdc",
      ".gemini/frontend-taste.md",
      "examples/prompt.md",
      "README.md",
      "agent-skill.json"
    ]);
    expect(result.files[0]?.content).toContain("Trigger Conditions");
    expect(result.files[1]?.content).toContain("Safety Notes");
    expect(result.files.find((file) => file.path === "agent-skill.json")?.content).toContain("\"targets\"");
  });

  it("uses built-in templates when templateId is provided", () => {
    const result = generateSkillPackage({
      templateId: "code-review",
      description: "Review pull requests for production risks"
    });

    expect(result.skill.slug).toBe("code-review");
    expect(result.skill.triggers.join(" ")).toContain("PR review");
  });
});
