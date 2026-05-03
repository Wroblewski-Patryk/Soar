# Repository Bootstrap Usage

This repository uses local, manual bootstrap artifacts.

## Flow
1. Start from this repository bootstrap package.
2. Rename the folder.
3. Open the new project in Codex.
4. Tailor docs/plans/context through AI-guided setup.

## Why Manual Mode
- Fast setup for early-stage projects.
- Full flexibility per project without template update tooling.
- Easy human review of every initial decision.

## Guardrails
- Keep this repository docs as the canonical baseline.
- Do not skip bootstrap checklist.
- Keep changes small and auditable in each new repo.
- Keep subagent rules aligned with `docs/governance/subagent-delegation-policy.md`.


## Existing Repository Adoption

For an established project, use `docs/governance/existing-project-adoption-playbook.md` instead of treating the template as a clean-room bootstrap. Preserve current project truth, install the minimum agent context first, and turn mismatches into tracked tasks.

Run `docs/governance/agent-readiness-checklist.md` before allowing autonomous implementation loops.
