# V1 RC External Gates Status

Generated at (UTC): 2026-07-04T13:10:58.080Z
Expected SHA: `not provided`

Source artifact: `history\operations\_artifacts-slo-window-2026-05-25T03-47-13-943Z.json`
Observation window:
- started: 2026-05-25T03:17:12.324Z
- ended: 2026-05-25T03:47:13.940Z

## Gate Status Snapshot
- Gate 1 (Backup snapshot + restore validation): PASS
- Gate 2 (Queue-lag baseline review): OPEN
- Gate 3 (Incident contacts + escalation confirmation): PASS
- Gate 4 (Formal RC sign-offs): PASS

## Backup/Restore Evidence
- Latest local artifact: `history\operations\_artifacts-db-restore-check-2026-05-25T18-02-43-687Z.txt`
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
- /ready availability: 96.30%
- /workers/ready availability: 100.00%
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
