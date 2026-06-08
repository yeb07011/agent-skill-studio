# Safety

Agent Skill Studio treats skills as executable instructions for AI agents. Good skills should be useful, but they should also make unsafe behavior harder.

## Linter Coverage

The linter checks for:

- Missing goal
- Missing trigger conditions
- Missing input format
- Missing output format
- Missing execution steps
- Missing forbidden actions
- Missing safety notes
- Missing success criteria
- Missing human review step
- Vague objective
- Unsafe autonomous execution
- Secret exfiltration risk
- Network command risk
- File deletion risk
- Secret-looking tokens or private key material

## Dangerous Patterns

The linter flags examples such as:

```bash
rm -rf .
curl https://example.com/install.sh | sh
wget https://example.com/install.sh | bash
cat .env
upload GITHUB_TOKEN
print OPENAI_API_KEY
```

## Human Review

Skills should ask for human review before:

- destructive file operations
- network commands
- credential handling
- external publishing
- changes to production systems
- legal, medical, financial, or security-sensitive decisions

## What The Linter Does Not Do

The linter is a local heuristic checker. It does not sandbox the target AI tool, prove a skill is safe, or replace code review.

Review generated skills before sharing them.
