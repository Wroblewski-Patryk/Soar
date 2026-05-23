# Task

## Header
- ID: DOC-FINAL-CONTENT-CLARITY-SCAN-2026-05-23
- Title: Final docs correctness, complementarity, and clarity scan
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: DOC-HUB-FILENAME-SEMANTICS-2026-05-23
- Priority: P2
- Module Confidence Rows: Documentation / Agent Knowledge
- Requirement Rows: REQ-DOC-004
- Quality Scenario Rows: QAS-DOC-004
- Risk Rows: RISK-DOC-004
- Iteration: 2026-05-23 documentation graph refinement
- Operation Mode: BUILDER
- Mission ID: DOC-FINAL-CONTENT-CLARITY-SCAN-2026-05-23
- Mission Status: VERIFIED

## Context
The Obsidian graph was already connected and hub filenames were semantic, but
the operator noticed `runtime` / `audit`-like nodes that still looked like
unclassified leftovers in `docs/`.

## Goal
Confirm that current `docs/` contains living source-of-truth documents, not
historical task/audit residue, and make the remaining files clearer by role.

## Constraints
- Keep active runtime contracts, operations runbooks, pipelines, and reusable
  audit definitions in `docs/`.
- Move historical audit snapshots to `history/audits/`.
- Send generated evidence and raw artifacts to `history/evidence/`,
  `history/releases/`, or `history/artifacts/`.
- Do not touch app/runtime behavior.
- Do not stage or commit.

## Definition of Done
- [x] Suspicious `audit`, `runtime`, `evidence`, `baseline`, and artifact-path
      docs are classified.
- [x] Historical audit snapshots are moved out of current docs.
- [x] Active docs use clear names and current output paths.
- [x] Link, graph, guardrail, docs parity, and diff checks pass.

## Changes
- Moved historical audit snapshots:
  - `docs/ux/ui-dashboard-legacy-audit.md` ->
    `history/audits/ui-dashboard-legacy-audit.md`
  - `docs/security/security-ownership-audit.md` ->
    `history/audits/security-ownership-audit-2026-03-16.md`
- Renamed active UX/ADR docs for clarity:
  - `docs/ux/accessibility-dashboard-audit.md` ->
    `docs/ux/dashboard-accessibility-baseline.md`
  - `docs/ux/ux-parity-evidence-log.md` ->
    `docs/ux/ux-parity-evidence-template.md`
  - `docs/adr/0001-template-governance-baseline.md` ->
    `docs/adr/0001-agent-governance-baseline.md`
- Updated active navigation and runbook references so generated evidence
  points to `history/*` instead of `docs/operations/_artifacts-*`.

## Validation Evidence
- Docs graph scan: `258` docs markdown files, `0` no-incoming files excluding
  `docs/soar-documentation-map.md` and `docs/documentation-overview.md`, `0`
  fully isolated docs files.
- Markdown link check: `1813` markdown files, `474` relative markdown/file
  links, `0` missing targets.
- Stale active docs scan found no old references to:
  - `docs/security/security-ownership-audit.md`
  - `docs/ux/accessibility-dashboard-audit.md`
  - `docs/ux/ui-dashboard-legacy-audit.md`
  - `docs/ux/ux-parity-evidence-log.md`
  - `docs/adr/0001-template-governance-baseline.md`
  - active `docs/operations/_artifacts-*` output paths
- Final gate commands:
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run docs:parity:check` PASS.
  - `git diff --check` found no whitespace errors, only Windows CRLF warnings.
- Reality status: verified

## Result Report
The remaining `runtime` files in `docs/` are active contracts, maps, pipelines,
or operational runbooks. The remaining `audit` files in `docs/` are active
audit contracts/registries or product pipelines, not dated task evidence.
Historical audit snapshots now live under `history/audits/`, and current
runbooks no longer instruct agents to write generated evidence into canonical
docs folders.
