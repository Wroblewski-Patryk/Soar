# V1 Production Activation Evidence Audit (2026-05-24)

## Context

- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Candidate SHA:
  `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`.
- Public Web build-info: PASS for the candidate SHA.
- Public no-worker smoke: PASS for API `/health`, API `/ready`, and Web `/`.
- Current final preflight:
  `history/releases/v1-preflight-production-activation-status-gate-2026-05-24.md`.
- Current production protected proof: not refreshed for the candidate because
  approved app auth, rollback guard auth, and production DB restore context are
  not present in this local environment.

## Evidence Reviewed

- Public production build-info: PASS, deployed Web SHA
  `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`.
- Public production smoke: PASS for API `/health`, API `/ready`, and Web `/`.
- Release/preflight tooling: PASS for active operations docs-root resolution
  and activation status fail-closed semantics.
- RC external gates current docs: STALE for 2026-05-23.
- RC sign-off record: STALE for 2026-05-23.
- RC checklist verification block: STALE for 2026-05-23.
- `LIVEIMPORT-03` runtime readback: MISSING for 2026-05-24.
- Production UI clickthrough: MISSING for 2026-05-24.
- Production DB restore drill: MISSING for 2026-05-24.
- Rollback proof pack: MISSING for 2026-05-24.

## Findings

- The public production deployment is fresh for the current candidate.
- The current candidate cannot be marked activation-ready without protected
  read-only production proof.
- Previous 2026-05-23 activation evidence was tied to an older deployed SHA and
  must not be reused as candidate readiness for `380308d1`.
- The release gate now correctly requires this activation audit to report
  `READY` or `PASS`; this audit intentionally reports `BLOCKED`.

## Result

- Status: **BLOCKED**
- Satisfied for 2026-05-24:
  - public production build-info readback
  - public production no-worker smoke
  - release/preflight tooling safety checks
- Remaining blockers:
  - approved production app auth for dashboard/admin UI clickthrough
  - approved read-only production runtime auth for `LIVEIMPORT-03`
  - approved rollback guard auth/context
  - production DB restore context
  - refreshed RC status/sign-off/checklist for the current candidate
  - refreshed backup/restore and rollback proof for the current candidate
