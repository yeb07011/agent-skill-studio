import { useMemo, useState } from "react";
import {
  generateSkillPackage,
  lintSkillContent,
  listTemplates,
  type GeneratedSkillPackage,
  type SkillLintResult,
  type SkillPackageFile
} from "@agent-skill-studio/core";

function findDefaultPreviewFile(files: SkillPackageFile[]): string {
  return files.find((file) => file.path.includes(".claude/skills"))?.path ?? files[0]?.path ?? "";
}

function levelLabel(level: SkillLintResult["level"]): string {
  switch (level) {
    case "excellent":
      return "Excellent";
    case "good":
      return "Good";
    case "needs_improvement":
      return "Needs improvement";
    case "risky":
      return "Risky";
  }
}

const templates = listTemplates();

export function App() {
  const [skillName, setSkillName] = useState("frontend-taste");
  const [description, setDescription] = useState("Make landing pages visually polished");
  const [selectedTemplate, setSelectedTemplate] = useState("frontend-taste");
  const [generated, setGenerated] = useState<GeneratedSkillPackage>(() =>
    generateSkillPackage({
      name: "frontend-taste",
      description: "Make landing pages visually polished",
      templateId: "frontend-taste"
    })
  );
  const [selectedPath, setSelectedPath] = useState(() => findDefaultPreviewFile(generated.files));
  const [lintResult, setLintResult] = useState<SkillLintResult>(() => {
    const file = generated.files.find((item) => item.path === selectedPath) ?? generated.files[0];
    return lintSkillContent(file?.content ?? "");
  });
  const [copyStatus, setCopyStatus] = useState("Copy");

  const selectedFile = useMemo(
    () => generated.files.find((file) => file.path === selectedPath) ?? generated.files[0],
    [generated.files, selectedPath]
  );

  function selectTemplate(templateId: string) {
    const template = templates.find((item) => item.templateId === templateId);
    if (!template) {
      return;
    }

    setSelectedTemplate(templateId);
    setSkillName(template.slug);
    setDescription(template.description);
  }

  function handleGenerate() {
    const next = generateSkillPackage({
      name: skillName,
      description,
      templateId: selectedTemplate
    });
    const previewPath = findDefaultPreviewFile(next.files);
    setGenerated(next);
    setSelectedPath(previewPath);
    const previewFile = next.files.find((file) => file.path === previewPath) ?? next.files[0];
    setLintResult(lintSkillContent(previewFile?.content ?? ""));
    setCopyStatus("Copy");
  }

  function handleLint() {
    setLintResult(lintSkillContent(selectedFile?.content ?? ""));
  }

  async function handleCopy() {
    if (!selectedFile) {
      return;
    }

    await navigator.clipboard.writeText(selectedFile.content);
    setCopyStatus("Copied");
    window.setTimeout(() => setCopyStatus("Copy"), 1200);
  }

  return (
    <main className="app-shell">
      <header className="hero-header">
        <div>
          <p className="eyebrow">Open source agent tooling</p>
          <h1>Agent Skill Studio</h1>
          <p className="subtitle">
            Turn prompts, SOPs, and workflow notes into portable skills for Claude Code, Codex, Cursor,
            Gemini CLI, and the next wave of AI coding tools.
          </p>
        </div>
        <div className="hero-metrics">
          <span>6 templates</span>
          <span>4 targets</span>
          <span>local-first</span>
        </div>
      </header>

      <section className="studio-layout">
        <section className="control-column" aria-label="Skill controls">
          <div className="builder-panel">
            <div className="panel-heading">
              <div>
                <h2>Skill Builder</h2>
                <p>{generated.skill.slug}</p>
              </div>
            </div>
            <label htmlFor="skill-name">
              Skill name
              <input id="skill-name" value={skillName} onChange={(event) => setSkillName(event.target.value)} />
            </label>
            <label htmlFor="skill-description">
              Description
              <textarea
                id="skill-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={7}
              />
            </label>
            <div className="action-row">
              <button className="primary-button" onClick={handleGenerate} type="button">
                Generate
              </button>
              <button className="secondary-button" onClick={handleLint} type="button">
                Lint
              </button>
            </div>
          </div>

          <div className="lint-card" data-level={lintResult.level}>
            <div>
              <span className="lint-label">Lint score</span>
              <strong>{lintResult.score}</strong>
              <small>{levelLabel(lintResult.level)}</small>
            </div>
            <ul>
              {lintResult.issues.slice(0, 4).map((issue, index) => (
                <li key={`${issue.message}-${index}`}>
                  <b>{issue.severity}</b>
                  <span>{issue.message}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="template-panel">
            <div className="panel-heading">
              <div>
                <h2>Templates</h2>
                <p>Start from a proven workflow</p>
              </div>
              <span>{templates.length}</span>
            </div>
            <div className="template-grid" role="list">
              {templates.map((template) => (
                <button
                  className="template-card"
                  data-active={selectedTemplate === template.templateId}
                  key={template.templateId}
                  onClick={() => selectTemplate(template.templateId)}
                  type="button"
                >
                  <strong>{template.templateId}</strong>
                  <span>{template.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="preview-column" aria-label="Generated package preview">
          <div className="preview-toolbar">
            <div>
              <p className="eyebrow">Generated package</p>
              <h2>{selectedFile?.path}</h2>
            </div>
            <button className="copy-button" onClick={handleCopy} type="button">
              {copyStatus}
            </button>
          </div>
          <div className="file-tabs" aria-label="Generated files">
            {generated.files.map((file) => (
              <button
                data-active={selectedPath === file.path}
                key={file.path}
                onClick={() => setSelectedPath(file.path)}
                title={file.path}
                type="button"
              >
                {file.path}
              </button>
            ))}
          </div>
          <pre className="preview-code">{selectedFile?.content}</pre>
        </section>
      </section>
    </main>
  );
}
