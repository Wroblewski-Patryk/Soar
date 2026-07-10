# Mobile Modules Index

Updated: 2026-07-10

## Purpose
This index tracks `docs/modules/mobile-*.md` files so mobile documentation can
grow without drifting from registry/state files.

## Current Mobile Docs
- `mobile-bootstrap.md` - scaffold-only native/mobile scope and activation gate.

## Latest Readback
- 2026-07-10 `LUC-253`: confirmed the current mobile docs/index baseline is
  already present for scaffold-only scope. `apps/mobile` still contains only
  `package.json`, `README.md`, and `src/.gitkeep`; no additional
  non-scaffold `mobile-*.md` deep-dive is warranted until the `DEC-ARB-002`
  activation trigger is met.

## V1 Traceability Classification
- V1 status: `out_of_scope_for_v1`.
- Current seed: documentation-only scaffold map for `apps/mobile`.
- Not active for V1: native routes/screens, Expo Router app shell,
  independent mobile API contracts, mobile production runtime, mobile CI
  release gate, and native trading workflows.
- Responsive Web mobile proof belongs to Web/UX evidence and must not be
  counted as native/mobile parity.

## Usage Rule
When mobile implementation starts, add new `mobile-*.md` files and update in
the same task:
- `docs/modules/module-doc-status-index.md`
- `docs/modules/module-registry.md`
- `.agents/state/module-confidence-ledger.md` (`SOAR-MOBILE-001`)
