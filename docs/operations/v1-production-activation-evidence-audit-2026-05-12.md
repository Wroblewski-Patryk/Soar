# V1 Production Activation Evidence Audit (2026-05-12)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public Web build-info SHA:
  `00169d7fdc3aff8317759137b05594b20e773c8e`
- Current production read-only proof:
  `docs/planning/v1-operations-production-readonly-proof-task-2026-05-12.md`
- Current production restore drill proof:
  `docs/operations/v1-restore-drill-prod-2026-05-12T15-21-38Z.md`

## Evidence Reviewed
- Public production deploy smoke without workers: PASS (`API /health`, API
  `/ready`, and Web `/`).
- Public production build-info: PASS, deployed Web SHA
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- VPS Docker read-only inventory: production API, Web, four workers, Redis, and
  Postgres containers are running.
- Stage public smoke: FAIL with `503` on API health, API ready, and Web `/`.
- Production release gate read-only run:
  `docs/operations/v1-release-gate-prod-2026-05-12Tprod-readonly.md`.
- Production backup/restore drill:
  `docs/operations/v1-restore-drill-prod-2026-05-12T15-21-38Z.md`.
- Production release gate restore-refresh dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-12Trestore-refresh-dry-run.md`.
- RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.
- Previous production rollback proof:
  `docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md`.

## Findings
- Production public health and readiness are currently healthy.
- Production Web build-info exposes deployed SHA
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Production service topology is running on VPS, including API, Web, workers,
  Redis, and Postgres.
- Production backup/restore drill evidence is fresh and PASS for 2026-05-12.
- Stage public target is unavailable with `503`; this does not approve or block
  production-only V1 by itself, but it remains an environment-health risk.
- Required 2026-05-12 production release evidence is still incomplete:
  - authenticated/protected worker smoke requires approved app/operator auth
  - authenticated `LIVEIMPORT-03` runtime readback is missing
  - rollback proof pack is stale for 2026-05-12
  - RC external gates status is fresh but failed/open because Gate 4 is not
    approved
  - RC sign-off record is stale and not approved for 2026-05-12
  - RC checklist is fresh but not all gates pass
- Public smoke, VPS container inventory, and fresh restore drill evidence are
  useful readiness signals, but they are not final production approval.

## Result
- Status: **NO-GO**
- Required follow-up:
  - provide approved production app/operator auth for protected ops endpoints
  - capture authenticated `LIVEIMPORT-03` runtime readback evidence
  - refresh production rollback proof evidence to PASS
  - refresh RC Gate 4, checklist, and sign-off after protected evidence is fresh
  - run the production release gate without `--dry-run` and without skipping
    required protected gates
