# Task

## Header
- ID: LUC-1662
- Title: Ingest exact dynamic bot-runtime redirect proof
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: LUC-1659
- Priority: P1
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1662
- Mission Status: VERIFIED

## Context
The fresh `LUC-1659` browser packet already proved the exact dynamic runtime
route `apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx`
(`route:page-tsx:52de535d03`) redirects from
`/dashboard/bots/luc-2188-bot/runtime` to
`/dashboard/bots/luc-2188-bot/preview`. The local source file and focused test
also match that redirect contract.

## Goal
Ingest the exact runtime redirect proof into the canonical docs/architecture
inputs so generated truth no longer treats the exact route as needing review.

## Scope
- Add the direct source-to-doc and source-to-test relations for the exact
  runtime route.
- Refresh the runtime node metadata to reflect the July 22 proof.
- Run architecture awareness, app completion, and project truth strictly in
  sequence.
- Record the exact route as verified and leave any unrelated legacy runtime
  helper gap separate.

## Constraints
- Local-only docs/state/index work; no runtime code, deploy, or production
  mutation.
- Reuse existing proof systems and the existing `LUC-1659` browser packet.
- No workaround entries or duplicate runtime implementations.

## Definition of Done
- [x] Exact route proof consumed by scanner overrides and module metadata.
- [x] Canonical generators rerun in dependency order.
- [x] Durable issue packet records the exact-route result and residual.

## Validation Evidence
- `pnpm --filter web exec vitest run src/app/dashboard/bots/[id]/runtime/page.test.tsx --reporter=verbose`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Result Report
- The exact runtime route `route:page-tsx:52de535d03` is ingested through the
  route doc/test links, runtime node metadata, and scanner override proof.
- The focused runtime test passed and the generators reran in the required
  sequence.
- Generated truth now routes the remaining bot-runtime work to the legacy
  `/dashboard/bots/runtime` helper row, while the exact `[id]/runtime` route
  is no longer the target gap.
