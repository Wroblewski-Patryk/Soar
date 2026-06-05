# Task

## Header
- ID: LUC-2155
- Title: Repair documentation-links ingestion for actionable missing docs
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Depends on: [LUC-2151](/LUC/issues/LUC-2151)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph, API bots, API engine, release-audit-tooling
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation traceability
- Risk Rows: scanner stale-report risk
- Iteration: 2026-06-05
- Operation Mode: BUILDER
- Mission ID: LUC-2155-DOCUMENTATION-LINK-INGESTION-2026-06-05
- Mission Status: VERIFIED

## Context
[LUC-2155](/LUC/issues/LUC-2155) was created after the architecture-awareness report generated `2026-06-05T09:10:34.335Z` still listed script/tooling rows as actionable missing doc links even though those paths had direct entries in `docs/architecture/relations/documentation-links.csv`.

## Goal
Repair or verify the scanner ingestion path for curated documentation links and close the current actionable samples with evidence.

## Scope
- `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs`
- `docs/architecture/relations/documentation-links.csv`
- `docs/modules/api-bots.md`
- `docs/modules/api-engine.md`
- `docs/graphs/architecture-awareness.json`
- `docs/graphs/architecture-awareness.csv`
- `docs/graphs/architecture-health.json`
- `docs/graphs/architecture-proof-register.csv`
- `docs/status/architecture-awareness-report.md`
- `docs/status/architecture-dependency-report.md`
- `docs/status/architecture-ownership-report.md`
- `docs/status/task-synchronization-report.md`

## Implementation Plan
1. Confirm whether the current `documentation-links.csv` rows ingest into `documents` relations.
2. Add a retry wrapper to the architecture-awareness export writes so Windows `UNKNOWN`/busy write failures do not leave Markdown reports stale after JSON refresh.
3. Classify the two model-level rows named in the issue against existing backend module docs.
4. Regenerate the architecture-awareness exports and restore the curated architecture graph export.
5. Verify sample `documents` relations, graph drift, docs parity, and diff hygiene.

## Acceptance Criteria
- Before/after actionable missing docs count is recorded.
- `scripts/collectSloEvidence.mjs`, `scripts/compareReusableAuditManifests.mjs`, `scripts/deploySmokeCheck.mjs`, `scripts/dev-backend.mjs`, and `scripts/runProdUiModuleClickthroughAudit.mjs` have `documents` relations in `docs/graphs/architecture-awareness.json`.
- `apps/api/src/modules/bots/bots.errors.ts#BotDomainError` and `apps/api/src/modules/engine/orderTypes.types.ts` are classified against existing backend module docs and no longer appear in top missing doc rows.
- No runtime, deploy, protected account, secret, exchange, or live-trading mutation occurs.

## Definition of Done
- [x] Scanner exports regenerated successfully.
- [x] Actionable missing docs count improved from `148` to `108`.
- [x] Target samples have direct `documents` relations.
- [x] Relevant documentation source truth updated.
- [x] Validation commands passed.

## Validation Evidence
- Initial report source: `docs/status/architecture-awareness-report.md` generated `2026-06-05T09:10:34.335Z`, actionable missing docs `148`.
- First scanner readback after current CSV ingestion: JSON/health generated `2026-06-05T10:00:00.169Z`, actionable missing docs `110`; five script samples each had `documents=1`.
- Final scanner refresh: generated `2026-06-05T10:06:31.635Z`, entities `14258`, relations `22125`, actionable missing docs `108`.
- Sample readback:
  - `scripts/collectSloEvidence.mjs`: `documents=1`, absent from top report.
  - `scripts/compareReusableAuditManifests.mjs`: `documents=1`, absent from top report.
  - `scripts/deploySmokeCheck.mjs`: `documents=1`, absent from top report.
  - `scripts/dev-backend.mjs`: `documents=1`, absent from top report.
  - `scripts/runProdUiModuleClickthroughAudit.mjs`: `documents=1`, absent from top report.
  - `apps/api/src/modules/bots/bots.errors.ts#BotDomainError`: `documents=1`, absent from top report.
  - `apps/api/src/modules/engine/orderTypes.types.ts`: `documents=1`, absent from top report.
- `node --check C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs`: PASS.
- `pnpm run architecture:graph:generate`: PASS (`651` nodes / `842` relations / `27` chains).
- `pnpm run architecture:graph:drift:strict`: PASS (`822/822`, `0` missing).
- `pnpm run docs:parity:check`: PASS (`API: 22/22`, `Web: 16/16`, `Routes: 37/37`).
- `git diff --check`: PASS with CRLF warnings only.
- `git -C C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse diff --check -- scripts/build-architecture-awareness-index.mjs`: PASS with CRLF warning only.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-evidence-graph-system.md`, `docs/architecture/relations/documentation-links.csv`, `docs/status/architecture-awareness-report.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no architecture mismatch; stale/export write risk discovered in the external scanner.
- Decision required from user: no.
- Follow-up architecture doc updates: none beyond module doc classification and regenerated exports.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the scanner retry helper and the two doc-link rows if this docs-only repair must be backed out.

## Result Report
- Task summary: documentation-link ingestion was verified and export durability improved; current actionable missing docs are reduced from `148` to `108`.
- Files changed: external scanner write retry, Soar doc-link CSV, API bots/engine module docs, generated architecture-awareness exports, and this task artifact.
- How tested: scanner refresh, sample graph readback, graph generate, strict graph drift, docs parity, diff checks.
- What is incomplete: remaining actionable missing docs are backend model rows for later Docs/Backend classification, not part of this issue.
- Next steps: route any remaining model-family doc-link backlog as a separate backend/docs child issue if current release planning wants further reduction.
