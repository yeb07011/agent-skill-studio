# Skill Format

Agent Skill Studio converts a plain-language prompt, SOP, or workflow into a portable agent skill package.

## Package Layout

```text
generated/
  AGENTS.md
  agent-skill.json
  .codex/skills/<skill-name>/SKILL.md
  .claude/skills/<skill-name>/SKILL.md
  .cursor/rules/<skill-name>.mdc
  .gemini/<skill-name>.md
  examples/prompt.md
  README.md
```

## Required Sections

Every generated skill should include:

- Skill name
- Goal
- Use cases
- Trigger conditions
- Input format
- Output format
- Execution steps
- Quality standards or success criteria
- Human review guidance
- Forbidden actions
- Safety notes
- Example prompt

## Target Files

| Target | File |
| --- | --- |
| Generic agents | `AGENTS.md` |
| Codex | `.codex/skills/<skill-name>/SKILL.md` |
| Claude Code | `.claude/skills/<skill-name>/SKILL.md` |
| Cursor | `.cursor/rules/<skill-name>.mdc` |
| Gemini CLI | `.gemini/<skill-name>.md` |

## Manifest

`agent-skill.json` is designed for registries, marketplaces, package previews, and future import/export tools.

```json
{
  "name": "frontend-taste",
  "description": "Make landing pages visually polished.",
  "version": "0.1.0",
  "targets": ["codex", "claude-code", "cursor", "gemini-cli"],
  "safetyLevel": "review_required",
  "createdAt": "2026-06-08T00:00:00.000Z",
  "files": [
    "AGENTS.md",
    ".codex/skills/frontend-taste/SKILL.md",
    ".claude/skills/frontend-taste/SKILL.md",
    ".cursor/rules/frontend-taste.mdc",
    ".gemini/frontend-taste.md",
    "examples/prompt.md",
    "README.md",
    "agent-skill.json"
  ]
}
```

## Design Principles

- Make triggers explicit so the agent knows when to apply the skill.
- Make outputs predictable so humans can review quickly.
- Include quality standards so the agent can self-check.
- Include forbidden actions and safety notes so the package is safe to share.
- Keep the format readable as plain Markdown.
