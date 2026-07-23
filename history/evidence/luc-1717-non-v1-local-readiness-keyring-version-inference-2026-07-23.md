# LUC-1717 Evidence

Date: 2026-07-23

## Scope
Repair the local readiness path so a valid single-version non-`v1` keyring does not get rewritten to `v1` during backend/dev startup, without changing the production API readiness contract.

## Files Changed
- `scripts/dev-backend.mjs`
- `scripts/dev-backend.test.mjs`

## Verification
- `node --test scripts/dev-backend.test.mjs`
  - Result: pass, 14 tests passed

## Behavioral Outcome
- If `API_KEY_ENCRYPTION_KEYS` contains one strong versioned entry such as `v3:...` and `API_KEY_ENCRYPTION_ACTIVE_VERSION` is absent, the local dev helper now infers `v3` instead of forcing `v1`.
- Production API readiness remains unchanged and still requires an active version compatible with the keyring.
- Multi-version local keyrings still require an explicit active version to avoid ambiguous inference.

## Residual Risk
- `apps/api/src/utils/crypto.ts` and critical readiness both retain their existing production contract; only the local dev launcher infers a single unambiguous version and injects it into the child process.
