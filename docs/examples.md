# Examples

## Generate A Frontend Skill

```bash
pnpm agent-skill-studio generate \
  --name frontend-taste \
  --description "Make landing pages visually polished"
```

This writes:

```text
generated/
  AGENTS.md
  agent-skill.json
  .codex/skills/frontend-taste/SKILL.md
  .claude/skills/frontend-taste/SKILL.md
  .cursor/rules/frontend-taste.mdc
  .gemini/frontend-taste.md
  examples/prompt.md
  README.md
```

## Lint A Skill

```bash
pnpm agent-skill-studio lint ./generated/.claude/skills/frontend-taste/SKILL.md
```

Example result:

```json
{
  "score": 100,
  "level": "excellent",
  "issues": [
    {
      "severity": "info",
      "message": "No major structure or safety issues found.",
      "suggestion": "Review the skill against your actual workflow before sharing it."
    }
  ]
}
```

## Use A Built-In Template

```bash
pnpm agent-skill-studio generate --template code-review
```

## Browse Templates

```bash
pnpm agent-skill-studio templates
```

See [examples/gallery.md](../examples/gallery.md) for the complete template gallery.
