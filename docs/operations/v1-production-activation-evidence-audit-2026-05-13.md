# V1 Production Activation Evidence Audit (2026-05-13)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public Web build-info SHA:
  `00169d7fdc3aff8317759137b05594b20e773c8e`
- Current final preflight:
  `docs/operations/v1-final-preflight-00169d7f-2026-05-13.md`
- Current operator packet:
  `docs/operations/v1-operator-unblock-packet-00169d7f-2026-05-13.md`
- Current protected input readiness:
  `docs/operations/v1-protected-input-readiness-00169d7f-2026-05-13.md`
- Current production UI audit:
  `docs/operations/prod-ui-module-clickthrough-00169d7f-2026-05-13.md`

## Evidence Reviewed
- Public production build-info: PASS, deployed Web SHA
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Current final preflight: `blocked` with build-info and public smoke `PASS`.
- Current protected input readiness: no matching protected input names are
  present in the Codex shell; no secret values were printed or stored.
- Current production UI clickthrough: fresh `BLOCKED_AUTH`; public routes pass
  and dashboard/admin/legacy protected routes fail closed to `/auth/login`.
- Generated V1 state for 2026-05-13: `NO-GO`, with `PASS_LOCAL:20`,
  `BLOCKED_AUTH:1`, static findings `3`, implementation `86.8%`, evidence
  coverage `61.3%`, and release readiness `42.4%`.
- Previous production restore drill:
  `docs/operations/v1-restore-drill-prod-2026-05-12T15-21-38Z.md`.
- Previous production rollback proof:
  `docs/operations/v1-rollback-proof-prod-2026-05-12T00-00-00-000Z.md`.
- RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.

## Findings
- Production Web build-info exposes the deployed SHA
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Public API/Web smoke is healthy in the current final preflight.
- Protected production evidence cannot be collected in this Codex shell because
  required protected input names are absent.
- Production UI protected route behavior is fail-closed, but the clickthrough
  is not accepted V1 evidence until approved dashboard/admin auth produces a
  `PASS` artifact.
- Required 2026-05-13 production release evidence is incomplete:
  - authenticated/protected worker smoke requires approved app/operator auth
  - authenticated `LIVEIMPORT-03` runtime readback is missing
  - production DB restore evidence is stale for 2026-05-13
  - rollback proof pack is stale for 2026-05-13
  - RC external gates status is stale for 2026-05-13
  - RC sign-off record is stale and not approved for 2026-05-13
  - RC checklist is stale for 2026-05-13
- Public smoke, build-info, and current no-secret blocker evidence are useful
  readiness signals, but they are not final production approval.

## Result
- Status: **NO-GO**
- Required follow-up:
  - provide approved production app/operator auth for protected ops endpoints
  - provide approved production dashboard/admin auth for UI clickthrough
  - provide approved production DB restore context
  - capture authenticated `LIVEIMPORT-03` runtime readback evidence
  - refresh production DB restore evidence for the current evidence date
  - refresh production rollback proof evidence to PASS
  - refresh RC Gate 4, checklist, and sign-off after protected evidence is fresh
  - run the production release gate without `--dry-run` and without skipping
    required protected gates
