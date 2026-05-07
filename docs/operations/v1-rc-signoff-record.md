# V1 RC Sign-Off Record

Release target: `v1.0.0`  
Date (UTC): `2026-05-07T17:59:59.307Z`

## Gate Evidence References
- RC checklist: `docs/operations/v1-release-candidate-checklist.md`
- External gates runbook: `docs/operations/v1-rc-external-gates-runbook.md`
- External gates status source: `docs\operations\v1-rc-external-gates-status.md`

## Sign-Offs
- Engineering sign-off:
  - Name:
  - UTC timestamp:
  - Notes:
- Product sign-off:
  - Name:
  - UTC timestamp:
  - Notes:
- Operations sign-off:
  - Name:
  - UTC timestamp:
  - Notes:

## RC Ownership
- RC owner with rollback authority:
  - Name:
  - Contact:
  - UTC assignment timestamp:

## Gate Snapshot at Sign-Off Build
- Gate statuses found: 4
- Gate values: PASS, OPEN, PASS, OPEN
- Gates 1-3 pass: no

## Final Decision
- RC status: `BLOCKED`
- Blocking reasons (if any): missing gate pass and/or required approvers
- Follow-up actions:
  - If BLOCKED: complete open gates and rerun `pnpm run ops:rc:signoff:build`.
  - If APPROVED: copy this record into release notes and finalize launch trigger.
