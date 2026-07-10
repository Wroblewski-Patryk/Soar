# LUC-254 ARB-003 Web Tests Table Expansion Evidence

## Scope
- Issue: [LUC-254](/LUC/issues/LUC-254)
- Capability chain: Web module deep dives -> shared Web helpers/UI shell -> icon lookup consumer evidence.
- Files reviewed/changed:
  - `docs/modules/web-shared.md`
  - `docs/modules/web-icons.md`

## Result
- `web-shared` no longer relies on inferred architecture-awareness wording for shared UI/i18n/lib/support surfaces. It now lists exact grouped `Tests` tables with concrete file paths and levels.
- `web-icons` keeps its consumer-driven status explicit and names the exact consumer test table as current evidence, with a follow-up rule for future hook/cache behavior.
- No product code, runtime behavior, generated index, push, deploy, production restart, protected smoke, secret/account readback, DB/Redis mutation, exchange/payment/subscription mutation, order, position, or live-trading action occurred.

## Validation
- `Test-Path` path-existence check for all newly or newly-emphasized documented test files: PASS (`40` files).
- `git diff --check`: PASS.

## Regression Risk
- Low. Documentation-only change.
- Main residual risk is scanner relation drift: exact tests exist locally, but architecture-awareness direct relation generation may still require future relation CSV or scanner updates for count reduction.

## Follow-Up Gaps
- Add a dedicated `apps/web/src/features/icons/*.test.*` unit test if icon hook deduplication, cancellation, or cache behavior changes.
- Treat future shared UI/lib/i18n behavior changes as requiring the listed exact test suites to be updated in the same task.
