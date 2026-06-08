# Release Checklist

Use this checklist before publishing Agent Skill Studio to GitHub or npm.

## Local Acceptance

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm agent-skill-studio templates
pnpm agent-skill-studio generate --name frontend-taste --description "Make landing pages visually polished"
pnpm agent-skill-studio lint ./generated/.claude/skills/frontend-taste/SKILL.md
pnpm dev
```

## GitHub Publish Steps

```bash
git init
git add .
git commit -m "Initial Agent Skill Studio release"
git branch -M main
git remote add origin https://github.com/yeb07011/agent-skill-studio.git
git push -u origin main
```

After pushing, update these placeholders:

- `package.json` repository URL
- `package.json` bugs URL
- `package.json` homepage
- README badges pointing to `yeb07011/agent-skill-studio`

## Repo Description

Turn prompts and SOPs into reusable AI agent skills for Claude Code, Codex, Cursor, and Gemini CLI.

## Recommended Topics

```text
ai-agent
agent-skills
claude-code
codex
cursor
gemini-cli
prompt-engineering
developer-tools
typescript
llm
ai-tools
open-source
```

## Social Preview

Suggested image text:

```text
Agent Skill Studio
Generate, lint, and export reusable AI agent skills
Claude Code · Codex · Cursor · Gemini CLI
```

## First Release Title

```text
v0.1.0 - Generate, lint, and export AI agent skills
```

## First Release Notes

Agent Skill Studio v0.1.0 is the first public MVP.

Highlights:

- Generate reusable skill packages from prompts, SOPs, and workflow notes
- Export files for Claude Code, Codex, Cursor, Gemini CLI, and generic agents
- Safe skill linting for missing structure, dangerous commands, network risk, deletion risk, and secret leakage
- Local Web UI built with Vite + React
- TypeScript CLI and shared core package
- Six built-in templates
- Export manifest via agent-skill.json

Try it:

```bash
pnpm install
pnpm agent-skill-studio generate --name frontend-taste --description "Make landing pages visually polished"
pnpm agent-skill-studio lint ./generated/.claude/skills/frontend-taste/SKILL.md
pnpm dev
```

## Launch Post

```text
I just released Agent Skill Studio.

It turns prompts, SOPs, and workflow notes into reusable AI agent skills for Claude Code, Codex, Cursor, and Gemini CLI.

What it does:
- generate target-specific skill files
- lint skills for structure and safety
- export agent-skill.json for sharing
- run locally with CLI + Web UI

The goal: make agent workflows reusable, inspectable, and safer to share.

Repo: https://github.com/yeb07011/agent-skill-studio
```
