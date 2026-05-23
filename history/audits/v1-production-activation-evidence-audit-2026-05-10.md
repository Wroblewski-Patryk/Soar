# V1 Production Activation Evidence Audit (2026-05-10)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public Web build-info SHA:
  `74752f025ef49bf5026ec92e056f59947e00a18f`
- Current no-secret final preflight:
  `history/releases/v1-final-preflight-1609929e-2026-05-10.md`
- Public/unauthenticated production UI access audit:
  `history/plans/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`

## Evidence Reviewed
- Public build-info for
  `74752f025ef49bf5026ec92e056f59947e00a18f`: PASS on production.
- Public deploy smoke without workers: PASS (`API /health`, API `/ready`, and
  Web `/`) after the 2026-05-10 RC blocked-evidence refresh deploy.
- V1 final no-secret preflight:
  `history/releases/v1-final-preflight-1609929e-2026-05-10.md`.
- RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.
- Previous production restore drill:
  `history/evidence/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`.
- Previous production rollback proof:
  `history/evidence/v1-rollback-proof-prod-2026-05-08T15-30-28-231Z.md`.

## Findings
- Production public health and readiness are currently healthy.
- Production Web build-info exposes the current source-of-truth synchronization
  batch: `74752f025ef49bf5026ec92e056f59947e00a18f`.
- The current no-secret final preflight reports release status `BLOCKED`.
- Required 2026-05-10 production release evidence is still incomplete:
  - authenticated `LIVEIMPORT-03` runtime readback is missing
  - live-import auth is missing
  - rollback guard auth is missing
  - production DB restore context is missing for a fresh restore refresh
  - RC external gates status is fresh for 2026-05-10 but failed/open
  - RC sign-off record is fresh for 2026-05-10 but not approved
  - RC checklist is fresh for 2026-05-10 but not all gates pass
  - backup/restore drill evidence is stale for 2026-05-10
  - rollback proof pack is stale for 2026-05-10
- Public smoke and no-auth route checks are useful readiness signals, but they
  are not final production approval.

## Result
- Status: **NO-GO**
- Required follow-up:
  - capture authenticated `LIVEIMPORT-03` runtime readback evidence
  - refresh production backup/restore drill evidence
  - refresh production rollback proof evidence
  - refresh RC gates, checklist, and sign-off after protected evidence is fresh
  - run the production release gate without `--dry-run`
