# V1 Production Activation And Evidence Plan (2026-05-02)

## Context
- V1 uses production only. Stage remains explicitly deferred to V2.
- User confirmed the single-person approval model for Engineering, Product, Operations, and Owner sign-off.
- Coolify production resources were verified in the Root Team under the Soar project.

## Goal
Close the remaining production evidence gap for V1 by refreshing production restore evidence, protected production post-deploy smoke evidence, runtime freshness, rollback guard, and release-gate readiness without creating stage requirements.

## Scope
- Production DB restore drill against the Coolify Postgres container.
- Production web/API smoke against `https://soar.luckysparrow.ch` and `https://api.soar.luckysparrow.ch`.
- Protected OPS route verification for `/workers/health`, `/workers/runtime-freshness`, and `/alerts`.
- Release gate rerun with `--environment prod` and no `--dry-run`.

## Implementation Plan
1. Confirm Coolify project/team and production resource identifiers.
2. Execute restore drill inside the production Postgres container using a temporary restore database and cleanup.
3. Generate rollback proof and protected runtime evidence with an existing production admin identity.
4. Run the production release gate without `--dry-run`.
5. Redact short-lived auth material from artifacts and keep only command shape plus result evidence.
6. Update release closure, task board, and project state with exact production evidence paths.

## Acceptance Criteria
- Production restore drill artifact is fresh for 2026-05-02 and reports `PASS`.
- Production rollback proof artifact is fresh for 2026-05-02 and reports `PASS`.
- Production release gate is rerun after all evidence families are fresh.
- No stage evidence is required for V1.
- No production secrets or generated tokens are committed.

## Definition Of Done
- `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-local-quality` returns `ready`.
- `pnpm run quality:guardrails` passes after documentation and script updates.
- Release closure and source-of-truth context identify the remaining status accurately.

## Result Report
- Completed. The first non-dry-run production release gate executed all runtime steps successfully but returned `not_ready` due only to stale activation audit/plan artifacts. After this plan and the matching evidence audit were refreshed, the final non-dry-run production release gate passed with readiness `ready`.
- Final evidence: `history/releases/v1-release-gate-prod-2026-05-02T17-56-17-239Z.md`.
