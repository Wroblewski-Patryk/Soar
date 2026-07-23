# LUC-1717 Evidence

Date: 2026-07-23

## Scope
Repair the local readiness path so a valid single-version non-`v1` keyring does not get rewritten to `v1` during backend/dev startup, while leaving the production API readiness contract unchanged.

## Files Changed
- `scripts/dev-backend.mjs`
- `scripts/dev-backend.test.mjs`

## Verification
- `node --test scripts/dev-backend.test.mjs`
  - Result: pass, 14 tests passed
- `git diff -- apps/api/src/config/criticalSecretsReadiness.ts apps/api/src/config/criticalSecretsReadiness.test.ts`
  - Result: no remaining diff after scope correction

## Behavioral Outcome
- If `API_KEY_ENCRYPTION_KEYS` contains one strong versioned entry such as `v3:...` and `API_KEY_ENCRYPTION_ACTIVE_VERSION` is absent, the local dev helper now infers `v3` instead of forcing `v1`.
- Production API readiness remains unchanged and still requires an explicit active version compatible with the keyring.
- Multi-version local keyrings still require an explicit active version to avoid ambiguous inference.

## Residual Risk
- The local dev helper still refuses ambiguous multi-version inference; only the single-version non-`v1` case is auto-filled.
- `apps/api/src/utils/crypto.ts` and critical readiness both retain their existing production contract; only the local dev launcher infers a single unambiguous version and injects it into the child process.
