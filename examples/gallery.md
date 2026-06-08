# Template Gallery

This gallery shows the six built-in templates that ship with Agent Skill Studio. Each example can be generated locally with the CLI or selected in the Web UI.

## 1. frontend-taste

```bash
pnpm agent-skill-studio generate --template frontend-taste
```

Example input:

```text
Create a frontend-taste skill for AI coding agents that helps them build polished SaaS landing pages with strong layout, typography, responsive behavior, and visual QA.
```

Generated skill focus:

- Use when the user asks for polished frontend pages, landing pages, dashboards, or app screens.
- Require clear hierarchy, responsive layout, visual QA, accessibility checks, and real usable UI.
- Forbid generic decorative gradients, placeholder-heavy UI, text overflow, and ignoring existing design systems.
- Require human review before applying high-impact changes or publishing external-facing content.

## 2. code-review

```bash
pnpm agent-skill-studio generate --template code-review
```

Example input:

```text
Create a code-review skill for AI coding agents that reviews pull requests for correctness, security, regressions, and missing tests, with findings first.
```

Generated skill focus:

- Use when the user asks for review, PR review, code audit, or merge risk assessment.
- Output findings first, ordered by severity, with file and line references.
- Check correctness, permissions, data flow, error paths, security, and test coverage.
- Forbid style-only nitpicks presented as defects and leaking secrets found in code.

## 3. product-manager-interview

```bash
pnpm agent-skill-studio generate --template product-manager-interview
```

Example input:

```text
Create a PM interview skill that helps candidates practice product sense, execution, metrics, and behavioral answers with structured feedback.
```

Generated skill focus:

- Use for PM interview prep, mock interviews, product sense, strategy, metrics, and behavioral coaching.
- Structure answers around users, goals, constraints, tradeoffs, risks, and success metrics.
- Provide sample answers, interviewer follow-ups, and focused improvement notes.
- Forbid fabricating personal work history or private company interview rubrics.

## 4. ai-evaluation

```bash
pnpm agent-skill-studio generate --template ai-evaluation
```

Example input:

```text
Create an AI evaluation skill that designs rubrics, task sets, regression tests, and launch recommendations for LLM agent workflows.
```

Generated skill focus:

- Use for evaluating models, prompts, agents, tools, RAG systems, and workflow automations.
- Define the decision the eval must support before designing tasks.
- Include representative cases, edge cases, adversarial cases, and regression checks.
- Separate quality, safety, latency, cost, reliability, and launch risk.

## 5. github-trending-research

```bash
pnpm agent-skill-studio generate --template github-trending-research
```

Example input:

```text
Create a GitHub trending research skill that analyzes popular open source AI agent projects and outputs a sourced technical report.
```

Generated skill focus:

- Use for open source scouting, trending repo analysis, star growth reports, and technical comparisons.
- Collect primary-source signals from README, releases, issues, docs, examples, and repository metadata.
- Compare projects by usefulness, architecture, activity, adoption signals, risks, and caveats.
- Forbid inventing stats, relying only on stars, or copying long README passages.

## 6. xiaohongshu-content-agent

```bash
pnpm agent-skill-studio generate --template xiaohongshu-content-agent
```

Example input:

```text
Create a Xiaohongshu content agent skill that helps plan topics, draft native posts, improve hooks, and review performance learnings.
```

Generated skill focus:

- Use for Xiaohongshu topic planning, hooks, captions, content calendars, post drafts, and retrospectives.
- Generate topic angles with audience pain points, titles, visual notes, hashtags, and calls to action.
- Review authenticity, platform fit, regulated claims, and performance learnings.
- Forbid fake personal experiences, deceptive engagement bait, guaranteed growth claims, and private screenshots.

## Shared Output

Every template generates:

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
