# V1 Production Activation Evidence Audit (2026-05-14)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public Web build-info SHA:
  `457bce05338310c198c03a973395a9176f298dc1`.
- Current final preflight:
  `docs/operations/v1-final-preflight-457bce05-2026-05-14-after-liveimport-rc.md`.
- Current production UI clickthrough:
  `docs/operations/prod-ui-module-clickthrough-457bce05-2026-05-14.md`.
- Current `LIVEIMPORT-03` runtime readback:
  `docs/operations/liveimport-03-prod-readback-2026-05-14.json`.
- Current rollback proof:
  `docs/operations/v1-rollback-proof-prod-2026-05-14T01-00-18-225Z.md`.
- Current RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- Current RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- Current RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.

## Evidence Reviewed
- Public production build-info: PASS, deployed Web SHA
  `457bce05338310c198c03a973395a9176f298dc1`.
- Public API/Web smoke: PASS in the current final preflight.
- Protected prerequisites: app auth, rollback guard auth, dashboard UI auth, and
  admin UI auth are present during the current preflight run; no secret values
  are written to evidence artifacts.
- Production UI clickthrough: PASS for public, dashboard, admin, and legacy
  redirect route groups.
- `LIVEIMPORT-03`: PASS from a controlled LIVE proof with no-order guard active;
  runtime positions for `TRXUSDT` are visible, token capture is false, and the
  controlled proof deactivated the target LIVE bot in cleanup.
- Rollback proof: PASS with rollback guard showing `shouldRollback=false`,
  fresh runtime checks, and no alerts.
- RC external gates: PASS for Gates 1-4 with strict production evidence check
  passing.
- Production DB restore drill: PASS through the VPS Docker SSH context using
  the existing isolated restore-drill contract and no secret-bearing output.

## Findings
- Back/Web local baseline is green for this SHA: guardrails, lint, typecheck,
  API tests, Web tests, and build passed before this audit.
- Production runtime and protected UI evidence are materially improved versus
  the previous activation audit.
- V1 production release evidence is now ready for this target because
  backup/restore, rollback, runtime freshness, UI, RC/sign-off, activation,
  build-info, public/protected smoke, and `LIVEIMPORT-03` are fresh/pass.
- Low-level Coolify terminal bridge automation was intentionally stopped after
  instability and replaced with safer operator paths.

## Result
- Status: **READY**
- Satisfied for 2026-05-14:
  - production public build-info readback
  - production public smoke
  - authenticated production UI clickthrough
  - controlled `LIVEIMPORT-03` production runtime readback
  - production rollback proof
  - RC external gates status
  - RC sign-off record
  - RC checklist verification block
- Remaining blockers:
  - none for the current protected operations release gate
