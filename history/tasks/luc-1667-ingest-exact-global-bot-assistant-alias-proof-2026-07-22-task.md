# Task

## Header
- ID: LUC-1667
- Title: Ingest exact global bot assistant alias proof
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: LUC-1665
- Priority: P1
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1667
- Mission Status: VERIFIED

## Context
The fresh `LUC-1665` browser packet already proved the exact global assistant
alias route `apps/web/src/app/dashboard/bots/assistant/page.tsx`
(`route:page-tsx:66a0b683f3`) redirects from `/dashboard/bots/assistant` to
`/dashboard/bots`. Generated truth still treated this alias route as needing
browser review because the direct doc/test relations and scoped proof override
were missing from the canonical docs-memory inputs.

## Goal
Ingest the exact global bot assistant alias proof into the canonical
docs/architecture inputs so generated truth no longer treats the alias route as
needing review.

## Constraints
- Local-only docs/state/index work; no runtime code, deploy, or production
  mutation.
- Reuse the existing `LUC-1665` proof packet and existing route-shell test.
- No workaround entries, duplicate route logic, or broad generator churn beyond
  the required refresh chain.

## Definition of Done
- [x] Exact alias route proof consumed by scanner overrides and direct
      doc/test relations.
- [x] Canonical generators rerun in dependency order.
- [x] Durable issue packet records the exact-route result and residual.

## Forbidden
- Runtime code changes.
- Production auth/session work.
- Unrelated bots-cluster repair work.

## Validation Evidence
- `pnpm --filter web exec vitest run src/app/dashboard/bots/assistant/page.test.tsx --reporter=verbose`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Result Report
- The exact global assistant alias route `route:page-tsx:66a0b683f3` is
  ingested through the route doc/test links and the scoped proof override.
- The focused alias-route test passed and the generators reran in the required
  sequence.
- Generated truth no longer treats `apps/web/src/app/dashboard/bots/assistant/page.tsx`
  as the first dashboard bots review gap; the remaining first bot-related gap
  advances to the separate legacy runtime helper route.
