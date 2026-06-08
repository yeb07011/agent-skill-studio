#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateSkillPackage, lintSkillContent, listTemplates } from "@agent-skill-studio/core";
import type { GeneratedSkillPackage } from "@agent-skill-studio/core";

interface ParsedArgs {
  command?: string;
  positionals: string[];
  flags: Record<string, string | boolean>;
}

const generatedDir = "generated";

function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];

    if (token?.startsWith("--")) {
      const [rawKey, inlineValue] = token.slice(2).split("=", 2);
      const next = rest[index + 1];

      if (inlineValue !== undefined) {
        flags[rawKey] = inlineValue;
      } else if (next && !next.startsWith("--")) {
        flags[rawKey] = next;
        index += 1;
      } else {
        flags[rawKey] = true;
      }
    } else if (token) {
      positionals.push(token);
    }
  }

  return { command, positionals, flags };
}

function getStringFlag(flags: ParsedArgs["flags"], name: string): string | undefined {
  const value = flags[name];
  return typeof value === "string" ? value : undefined;
}

function printHelp(): void {
  console.log(`Agent Skill Studio

Usage:
  pnpm agent-skill-studio init
  pnpm agent-skill-studio generate --name frontend-taste --description "Make landing pages visually polished"
  pnpm agent-skill-studio lint ./generated/.claude/skills/frontend-taste/SKILL.md
  pnpm agent-skill-studio templates

Options:
  --name <name>              Skill name or slug.
  --description <text>       Natural language skill description.
  --template <id>            Built-in template id.
  --output <dir>             Output directory. Defaults to generated.
  --json                     Print machine-readable JSON where supported.
`);
}

async function writePackage(outputDir: string, result: GeneratedSkillPackage): Promise<void> {
  for (const file of result.files) {
    const targetPath = path.join(outputDir, file.path);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, file.content, "utf8");
  }
}

async function initProject(outputDir = generatedDir): Promise<void> {
  await mkdir(outputDir, { recursive: true });
  await mkdir("examples", { recursive: true });
  const readmePath = path.join(outputDir, "README.md");
  await writeFile(
    readmePath,
    `# Generated Skills

Agent Skill Studio writes generated skill packages here by default.

Try:

\`\`\`bash
pnpm agent-skill-studio generate --name frontend-taste --description "Make landing pages visually polished"
\`\`\`
`,
    "utf8"
  );

  console.log(`Initialized Agent Skill Studio folders at ${outputDir}/`);
}

function printTemplates(asJson: boolean): void {
  const templates = listTemplates().map((template) => ({
    id: template.templateId,
    name: template.name,
    description: template.description
  }));

  if (asJson) {
    console.log(JSON.stringify(templates, null, 2));
    return;
  }

  for (const template of templates) {
    console.log(`${template.id.padEnd(30)} ${template.description}`);
  }
}

async function generateCommand(args: ParsedArgs): Promise<void> {
  const name = getStringFlag(args.flags, "name");
  const description = getStringFlag(args.flags, "description");
  const templateId = getStringFlag(args.flags, "template") ?? name;
  const outputDir = getStringFlag(args.flags, "output") ?? generatedDir;
  const matchedTemplate = listTemplates().find((template) => template.templateId === templateId || template.slug === templateId);
  const finalDescription = description ?? matchedTemplate?.description;

  if (!finalDescription) {
    throw new Error("Missing --description. You can also pass --template <id> to use a built-in template.");
  }

  const result = generateSkillPackage({
    name,
    description: finalDescription,
    templateId: matchedTemplate?.templateId
  });

  await writePackage(outputDir, result);

  console.log(`Generated skill package: ${result.skill.slug}`);
  console.log(`Output directory: ${outputDir}/`);
  for (const file of result.files) {
    console.log(`- ${path.join(outputDir, file.path)}`);
  }
}

async function lintCommand(args: ParsedArgs): Promise<void> {
  const target = args.positionals[0];

  if (!target) {
    throw new Error("Missing skill file path. Example: pnpm agent-skill-studio lint ./generated/.claude/skills/frontend-taste/SKILL.md");
  }

  const content = await readFile(target, "utf8");
  const result = lintSkillContent(content);
  console.log(JSON.stringify(result, null, 2));
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  switch (args.command) {
    case undefined:
    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;
    case "init":
      await initProject(getStringFlag(args.flags, "output") ?? generatedDir);
      break;
    case "generate":
      await generateCommand(args);
      break;
    case "lint":
      await lintCommand(args);
      break;
    case "templates":
      printTemplates(Boolean(args.flags.json));
      break;
    default:
      throw new Error(`Unknown command: ${args.command}`);
  }
}

const isCli = process.argv[1] === fileURLToPath(import.meta.url);

if (isCli) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exitCode = 1;
  });
}
