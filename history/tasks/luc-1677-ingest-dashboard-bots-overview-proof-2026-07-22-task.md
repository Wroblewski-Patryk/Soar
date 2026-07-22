# Task

## Header
- ID: LUC-1677
- Title: Ingest dashboard bots overview proof
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: LUC-1676
- Priority: high
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1677
- Mission Status: VERIFIED

## Context
The fresh `LUC-1676` browser packet already proved the exact dashboard bots
overview route `apps/web/src/app/dashboard/bots/page.tsx`
(`route:page-tsx:0101cdb776`). Generated truth still classified this route as
`needs_browser_review` because the canonical docs-memory inputs were missing
the direct doc relation, direct test relation, and scoped proof override for
the exact route shell.

## Goal
Ingest the exact dashboard bots overview proof into canonical docs and
generated-truth inputs so the route no longer appears as a browser-review gap.

## Constraints
- Local-only docs/state/index refresh; no runtime code, deploy, or production
  mutation.
- Reuse the existing `LUC-1676` proof packet and focused route test.
- Keep the authenticated success row distinct from the paired unauthenticated
  fail-closed guardrail row.
- No workaround entries, duplicate route logic, or broad generator churn
  beyond the required refresh chain.

## Definition of Done
- [x] Exact bots list route proof consumed by direct doc/test relations and a
      scoped proof override.
- [x] Canonical generators rerun in dependency order.
- [x] Durable task/evidence/state packet records the exact-route result and
      residual.

## Forbidden
- Runtime code changes.
- Production auth/session work.
- Unrelated dashboard or bots-cluster repair work.

## Validation Evidence
- `corepack pnpm --filter web exec vitest run src/app/dashboard/bots/page.test.tsx --reporter=verbose`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Result Report
- The exact bots list route `route:page-tsx:0101cdb776` is ingested through
  route doc/test links and the scoped proof override.
- The focused bots-list page test remained green and the generator chain reran
  in the required sequence.
- Generated truth no longer needs to keep
  `apps/web/src/app/dashboard/bots/page.tsx` in the dashboard
  `needs_browser_review` backlog; the next remaining dashboard gaps advance to
  other routes.
