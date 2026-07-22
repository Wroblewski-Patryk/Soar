# LUC-1662 Evidence

- Issue: [LUC-1662](/LUC/issues/LUC-1662)
- Date: 2026-07-22
- Agent lane: Documentation Steward
- Scope: ingest the exact dynamic bot runtime redirect proof for
  `apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx`
  (`route:page-tsx:52de535d03`) using the existing `LUC-1659` browser packet.
- Boundary: docs/state/index refresh only; no runtime code change, deploy,
  push, restart, production auth, or live mutation.

## Implemented and verified

- Added the exact source-to-doc relation for
  `apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx` to
  `docs/modules/web-bots.md`.
- Added the exact source-to-test relation for
  `apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx` and
  `apps/web/src/app/dashboard/bots/[id]/runtime/page.test.tsx`.
- Updated the runtime node metadata in
  `docs/architecture/nodes/SOAR-PAGE-BOT-RUNTIME.md` to reflect the fresh
  July 22 redirect proof and the `redirects_to` relation to preview.
- Added the scoped scanner override entry for the exact runtime redirect
  proof, reusing the existing `LUC-1659` packet evidence.
- Rebuilt architecture awareness, reran app completion, and applied project
  truth in sequence.
- Verified the exact runtime route is no longer the target gap; the remaining
  runtime helper row is the separate legacy `/dashboard/bots/runtime`
  surface.

## Validation

- `pnpm --filter web exec vitest run src/app/dashboard/bots/[id]/runtime/page.test.tsx --reporter=verbose`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Readback

- Exact route proof source item: `route:page-tsx:52de535d03`
- Exact route file: `apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx`
- Focused test file: `apps/web/src/app/dashboard/bots/[id]/runtime/page.test.tsx`
- Remaining indexed runtime helper row after ingest:
  `apps/web/src/app/dashboard/bots/runtime/page.tsx`

## Conclusion

- This heartbeat ingested the exact runtime redirect proof into canonical
  docs/state inputs and left the legacy helper route as the separate remaining
  gap.
