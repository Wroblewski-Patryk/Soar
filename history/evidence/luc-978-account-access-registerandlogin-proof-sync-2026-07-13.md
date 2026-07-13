# LUC-978 Account Access registerAndLogin Proof Sync

Date: 2026-07-13
Owner: 09 QVE (QA & Verification Engineer)
Issue: [LUC-978](/LUC/issues/LUC-978)

## Scope

Close the stale Account access `implemented_needs_proof` row for
`apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin` by proving
whether the shared bots auth bootstrap helper already has executable coverage
and syncing that proof into the canonical status pipeline.

## Readback

- `apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin` is a shared
  e2e helper that performs the real `/auth/register` call, upgrades the user
  to `PROFESSIONAL`, and returns the authenticated agent reused by protected
  bot scenarios.
- `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts` already
  executes that helper across duplicate-active and live-overlap guarded flows.
- Before this heartbeat, the helper was documented through
  [LUC-975](/LUC/issues/LUC-975) but still classified as
  `implemented_needs_proof` because no verified entity override promoted the
  executed helper into canonical proof status.

## Implemented and verified

- Added a scoped `entityOverrides` `verified` entry for
  `apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin` in
  `docs/architecture/scanner-overrides.json`.
- Reused the existing duplicate-guard e2e suite as the smallest sufficient
  executable proof rather than introducing a duplicate test lane.
- Refreshed architecture-awareness, app-completion, and project-truth
  sequentially so the generated truth reflects the verified helper state.

## Validation

- `corepack pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts --run --reporter=dot --test-timeout 30000`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "apps/api/src/modules/bots/bots\\.e2e\\.shared\\.ts#registerAndLogin|Account access: registerAndLogin has app-completion risk implemented_needs_proof" docs/status docs/graphs/architecture-awareness.json -S`

## Result

`LUC-978` is a stale proof-sync gap, not a missing test implementation. The
shared bots `registerAndLogin` helper was already exercised by focused
duplicate-guard e2e coverage; the missing piece was canonical verified status.
After refresh, generated truth no longer routes
`apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin` as the first
Account access proof gap.

## Remaining

- No additional QA proof work remains for the scoped shared helper.
- After refresh, the overall Account access `firstGap` advances to the separate
  docs-owned `createBotWithRuntimeSession` row, while the Account access
  `implementedNeedsProof` count drops from `114` to `113`.
- Separate `registerAndLogin` helper rows in other modules remain independent
  follow-up issues.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, protected
account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, or LIVE trading
action occurred.
