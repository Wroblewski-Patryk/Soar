# Mobile Module: Bootstrap Scaffold

Updated: 2026-07-10

## Scope
- Source path: `apps/mobile`
- Status: scaffold-only (`out_of_scope_for_v1`)

## Current Responsibility
- Keeps the native/mobile lane explicitly non-production until activation.
- Documents that no runtime/mobile feature claims are allowed yet.

## Public Interface
- No production routes, screens, or runtime integrations.
- Placeholder scripts only:
  - `pnpm --filter @cryptosparrow/mobile run dev`
  - `pnpm --filter @cryptosparrow/mobile run build`
  - `pnpm --filter @cryptosparrow/mobile run test`

Each script currently prints deferred-scaffold messages by design.

## Dependencies
- `docs/planning/mobile-parity-contract.md`
- `apps/mobile/README.md`
- `apps/mobile/package.json`

## Verification
- File-level inspection confirms only:
  - `apps/mobile/package.json`
  - `apps/mobile/README.md`
  - `apps/mobile/src/.gitkeep`
- 2026-07-10 `LUC-253` readback reconfirmed this scaffold-only inventory and
  kept native/mobile runtime claims out of scope.

## Known Gaps
- No Expo Router app shell.
- No mobile screens/components/state flows.
- No native build/test pipeline.
- No mobile-specific API contract extensions.

## Activation Gate
Before mobile implementation starts, convert scaffold scripts and docs into real
native build/test contracts in the same lane.

Activation requires a Product/CTO-approved mobile issue whose scope includes
non-scaffold native runtime behavior in `apps/mobile`. Until that exists, this
module is not a V1 implementation gap.
