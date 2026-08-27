# V1 RC External Gates Status

Generated at (UTC): 2026-05-25T00:00:00.000Z
Expected SHA: `287e77a1ef6aa79396cb485dafcf8d17a0fce033`

Source artifact: `history\operations\_artifacts-slo-window-2026-05-25T02-54-16-690Z.json`
Observation window:
- started: 2026-05-25T02:24:44.897Z
- ended: 2026-05-25T02:54:16.689Z

## Gate Status Snapshot
- Gate 1 (Backup snapshot + restore validation): PASS
- Gate 2 (Queue-lag baseline review): OPEN
- Gate 3 (Incident contacts + escalation confirmation): PASS
- Gate 4 (Formal RC sign-offs): PASS

## Backup/Restore Evidence
- Latest local artifact: `history\operations\_artifacts-db-restore-check-2026-05-25T01-18-21-188Z.txt`
- Latest local result: PASS
- Runbook source: `docs\operations\v1-rc-external-gates-runbook.md`
- Gate 1 runbook evidence complete: yes
- Production validation: recorded

## Incident Readiness Evidence
- Runbook source: `docs\operations\v1-rc-external-gates-runbook.md`
- Gate 3 evidence complete: yes

## Formal Sign-Off Evidence
- Sign-off source: `docs\operations\v1-rc-signoff-record.md`
- Gate 4 approved status found: yes

## Derived Metrics (from SLO artifact)
- source type: slo_observation
- evidence environment: production
- production evidence present: yes
- /ready availability: 66.67%
- /workers/ready availability: 69.44%
- API 5xx ratio: 0.00%
- execution queue lag p95: 0
- execution queue lag max: 0
- execution queue lag thresholds (p95/max): n/a/n/a
- exchange order attempts delta: 0
- exchange order failures delta: 0
- exchange order failure ratio: n/a

## Suggested Checklist Updates
- Runtime and Operations Gates:
  - Production SLO metrics reviewed and within baseline -> OPEN
- Exit Evidence Workpack:
  - ops(slo): define SLO targets and collect production observation window evidence -> OPEN

## Manual Follow-ups (Required)
1. Complete Gate 2 queue-lag baseline review from fresh SLO artifacts and regenerate `v1-rc-external-gates-status.md`.
2. Reflect current gate states in `docs/operations/v1-release-candidate-checklist.md` after updating evidence/sign-offs.
