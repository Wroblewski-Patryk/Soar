# Task

## Header
- ID: LUC-1674
- Title: Ingest exact bot new alias proof
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: LUC-1673
- Priority: P1
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1674
- Mission Status: VERIFIED

## Context
The fresh `LUC-1673` browser packet already proved the exact bot new alias route
`apps/web/src/app/dashboard/bots/new/page.tsx`
(`route:page-tsx:35ab7a2ecb`) redirects from `/dashboard/bots/new` to the
canonical bot create route `/dashboard/bots/create`. Generated truth still
treated this route as needing browser review because the direct doc/test
relations and scoped proof override were missing from the canonical
docs-memory inputs.

## Goal
Ingest the exact bot new alias proof into the canonical docs/architecture
inputs so generated truth no longer treats the route as needing review.

## Constraints
- Local-only docs/state/index work; no runtime code, deploy, or production
  mutation.
- Reuse the existing `LUC-1673` proof packet and existing route-shell test.
- Keep the alias proof bound to `apps/web/src/app/dashboard/bots/new/page.tsx`;
  do not conflate it with the canonical create-page source item.
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
- `pnpm --filter web exec vitest run src/app/dashboard/bots/new/page.test.tsx --reporter=verbose`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Result Report
- The exact bot new alias route `route:page-tsx:35ab7a2ecb` is ingested through
  the route doc/test links and the scoped proof override.
- The focused alias-route test passed and the generators reran in the required
  sequence.
- Generated truth no longer treats `apps/web/src/app/dashboard/bots/new/page.tsx`
  as a dashboard bots review gap; the next bot-related generated row advances
  away from this alias route.
