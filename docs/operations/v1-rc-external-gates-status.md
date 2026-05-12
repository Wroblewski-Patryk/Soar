# V1 RC External Gates Status

Generated at (UTC): 2026-05-12T06:55:32.908Z

Source artifact: `docs\operations\v1-slo-window-report-7d-2026-05-12T06-55-18-900Z.json`
Observation window:
- started: n/a
- ended: n/a

## Gate Status Snapshot
- Gate 1 (Backup snapshot + restore validation): PASS
- Gate 2 (Queue-lag baseline review): PASS
- Gate 3 (Incident contacts + escalation confirmation): PASS
- Gate 4 (Formal RC sign-offs): OPEN

## Backup/Restore Evidence
- Latest local artifact: `docs\operations\_artifacts-db-restore-check-2026-05-02T17-49-41-000Z.txt`
- Latest local result: PASS
- Runbook source: `docs\operations\v1-rc-external-gates-runbook.md`
- Gate 1 runbook evidence complete: yes
- Production validation: recorded

## Incident Readiness Evidence
- Runbook source: `docs\operations\v1-rc-external-gates-runbook.md`
- Gate 3 evidence complete: yes

## Formal Sign-Off Evidence
- Sign-off source: `docs\operations\v1-rc-signoff-record.md`
- Gate 4 approved status found: no

## Derived Metrics (from SLO artifact)
- source type: slo_window_report
- evidence environment: production
- production evidence present: yes
- /ready availability: 75.00%
- /workers/ready availability: 50.00%
- API 5xx ratio: 0.00%
- execution queue lag p95: 0
- execution queue lag max: 0
- execution queue lag thresholds (p95/max): 10/20
- exchange order attempts delta: n/a
- exchange order failures delta: n/a
- exchange order failure ratio: n/a

## Suggested Checklist Updates
- Runtime and Operations Gates:
  - Queue lag metrics reviewed and within baseline -> PASS
- Exit Evidence Workpack:
  - ops(slo): define SLO targets and collect production observation window evidence -> OPEN

## Manual Follow-ups (Required)
1. Complete sign-offs in `docs/operations/v1-rc-signoff-record.md` for Gate 4.
2. Reflect current gate states in `docs/operations/v1-release-candidate-checklist.md` after updating evidence/sign-offs.
