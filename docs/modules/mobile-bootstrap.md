# Mobile Module: Bootstrap Scaffold

Updated: 2026-05-28

## Scope
- Source path: `apps/mobile`
- Status: scaffold-only (implementation deferred)

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

## Known Gaps
- No Expo Router app shell.
- No mobile screens/components/state flows.
- No native build/test pipeline.
- No mobile-specific API contract extensions.

## Activation Gate
Before mobile implementation starts, convert scaffold scripts and docs into real
native build/test contracts in the same lane.
