# Task

## Header
- ID: LUC-2163
- Title: Normalize remaining backend model missing-doc links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Priority: P1
- Mission ID: LUC-2163-BACKEND-MODEL-DOC-LINK-NORMALIZATION-2026-06-05
- Mission Status: VERIFIED

## Context
[LUC-2163](/LUC/issues/LUC-2163) was assigned as a Docs Memory architecture-repair heartbeat. The current `docs/status/architecture-awareness-report.md` top actionable missing-doc samples were model entities after [LUC-2155](/LUC/issues/LUC-2155) fixed documentation-link ingestion and reduced actionable missing docs to 108.

## Goal
Normalize direct documentation ownership for the remaining backend model-family missing-doc samples without creating duplicate module docs or touching runtime behavior.

## Scope
- `docs/architecture/relations/documentation-links.csv`
- `docs/modules/api-engine.md`
- `docs/modules/api-exchange.md`
- `docs/modules/api-orders.md`
- `docs/modules/api-positions.md`
- `docs/modules/api-profile.md`
- `docs/modules/api-subscriptions.md`
- `docs/operations/service-reliability-and-observability.md`
- `docs/pipelines/deployment-readiness.md`
- Web/script type rows that were in the same report sample: `docs/modules/web-bots.md`, `docs/modules/web-icons.md`, `docs/modules/web-profile.md`

## Implementation Plan
1. Read the scoped wake payload and Docs Memory role.
2. Review the current architecture-awareness missing-doc samples and owner docs.
3. Add direct `documentation-links.csv` rows to canonical owner docs.
4. Add concise owner-doc classification tables where the type/model ownership was not already explicit.
5. Verify relation ingestion and graph/doc parity with focused docs commands.

## Acceptance Criteria
- Current top missing-doc model sample paths have direct documentation relations.
- Owner docs record classification and expected proof boundaries.
- No runtime/product/deploy/protected/secret/exchange/live-trading action is performed.
- Focused documentation/architecture verification passes or records an explicit blocker.

## Definition of Done
- Implemented and verified: direct doc links were added for the current report model sample family.
- Implemented and verified: owner docs classify the linked model/type surfaces.
- Implemented and verified: focused architecture/doc checks were run and recorded.

## Forbidden
- New architecture subsystem or duplicate module docs.
- Runtime behavior changes.
- Protected production smoke, deployment, restart, rollback, env/database mutation, account mutation, secret disclosure, exchange mutation, or live-trading action.

## Validation Evidence
- Tests:
  - Direct relation readback: PASS (`22` normalized relation rows present and unique).
  - `pnpm run architecture:graph:generate`: PASS (`651` nodes / `842` relations / `27` chains).
  - `pnpm run architecture:graph:drift:strict`: PASS (`822/822` covered, `0` missing).
  - `pnpm run docs:parity:check`: PASS (`API 22/22`, `Web 16/16`, `Routes 37/37`).
  - `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`: PASS (`14272` entities / `22205` relations).
  - Targeted `git diff --check`: PASS with CRLF warnings only.
- Manual checks:
  - Refreshed `docs/status/architecture-awareness-report.md` generated `2026-06-05T10:29:09.030Z`.
  - Actionable missing docs improved from `108` to `74`.
  - Prior backend model sample family no longer appears in top actionable missing-doc rows.
- High-risk checks: not applicable; docs-only task.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/graphs/architecture-health.json`, `docs/architecture/relations/documentation-links.csv`, module owner docs.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated architecture-awareness exports were refreshed by project scripts, not hand-edited.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: docs-only CSV/doc changes can be reverted directly.
- Observability or alerting impact: none.

## Result Report
- Task summary: normalized the current backend model-family missing-doc relation backlog to canonical owner docs.
- Files changed: documentation relation CSV, API/Web/Ops/Pipeline docs, this task artifact.
- How tested: focused graph/doc commands, architecture-awareness exporter refresh, targeted diff check, and direct relation readback.
- What is incomplete: no runtime proof was attempted or needed; remaining architecture-awareness rows outside this normalized sample family remain future backlog.
- Next steps: close [LUC-2163](/LUC/issues/LUC-2163) as done after issue update.
