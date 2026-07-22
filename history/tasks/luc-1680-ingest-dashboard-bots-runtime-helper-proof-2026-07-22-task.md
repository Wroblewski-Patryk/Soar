# Task

## Header
- ID: LUC-1680
- Title: Ingest dashboard bots runtime helper proof
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: LUC-1679
- Priority: high
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1680
- Mission Status: VERIFIED

## Context
The fresh `LUC-1679` browser packet already proved the exact dashboard bots
runtime helper route `apps/web/src/app/dashboard/bots/runtime/page.tsx`
(`route:page-tsx:02f88c4a44`). Generated truth still classified this route as
`needs_browser_review` because the canonical docs-memory inputs were missing
the direct doc relation, direct test relation, and scoped proof override for
the helper route shell.

## Goal
Ingest the exact dashboard bots runtime helper proof into canonical docs and
generated-truth inputs so the route no longer appears as a browser-review gap.

## Constraints
- Local-only docs/state/index refresh; no runtime code, deploy, or production
  mutation.
- Reuse the existing `LUC-1679` proof packet and focused route test.
- Keep the helper proof bound to
  `apps/web/src/app/dashboard/bots/runtime/page.tsx`; do not conflate it with
  the canonical bots list page proof.
- No workaround entries, duplicate route logic, or broad generator churn
  beyond the required refresh chain.

## Definition of Done
- [x] Exact runtime helper route proof consumed by route doc/test relations and
      a scoped proof override.
- [x] Canonical generators rerun in dependency order.
- [x] Durable task/evidence/state packet records the exact-route result and
      residual.

## Forbidden
- Runtime code changes.
- Production auth/session work.
- Unrelated dashboard or bots-cluster repair work.

## Validation Evidence
- `corepack pnpm --filter web exec vitest run src/app/dashboard/bots/runtime/page.test.tsx --reporter=verbose`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Result Report
- The exact runtime helper route `route:page-tsx:02f88c4a44` is ingested
  through route doc/test links and the scoped proof override.
- The focused runtime-helper page test remained green. The first generator pass
  exposed the known stale-readback pitfall caused by parallel downstream
  refreshes, so `app-completion` and `project-truth --apply` were rerun
  serially to complete the canonical sequence.
- Generated truth no longer needs to keep
  `apps/web/src/app/dashboard/bots/runtime/page.tsx` in the dashboard
  `needs_browser_review` backlog; the next generated first gap is now
  `apps/web/src/app/dashboard/logs/page.tsx`
  (`route:page-tsx:5dc8509354`).
