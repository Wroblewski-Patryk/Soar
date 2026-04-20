# Modules Documentation

Use one file per module in this folder.

## Role of This Folder
`docs/modules/` explains:
- where the code lives,
- which API routes or UI surfaces a module owns,
- which dependencies it uses,
- which tests verify it.

It does not replace `docs/architecture/` as the canonical source of runtime behavior.

## Canonical File
- `system-modules.md` contains the repository-wide module map.

## Coverage Audits
- `documentation-coverage-audit-2026-04-12.md` records the latest code-vs-docs parity check and guardrail.

## Coverage Index
- `module-doc-status-index.md` tracks deep-dive status for each active API and web module.

## Deep-Dive Template
- `module-deep-dive-template.md` is the canonical template for new module documentation.
- Every new deep-dive should be created from this template and keep the full mandatory checklist.
