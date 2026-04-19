# V1 RC External Gates Status

Generated at (UTC): 2026-04-19T01:43:33.262Z

Source artifact: `docs\operations\v1-slo-window-report-7d-2026-04-19T01-36-24-775Z.json`
Observation window:
- started: n/a
- ended: n/a

## Gate Status Snapshot
- Gate 1 (Backup snapshot + restore validation): PASS
- Gate 2 (Queue-lag baseline review): OPEN
- Gate 3 (Incident contacts + escalation confirmation): PASS
- Gate 4 (Formal RC sign-offs): OPEN

## Backup/Restore Evidence
- Latest local artifact: `docs\operations\_artifacts-db-restore-check-2026-04-09T19-32-32-792Z.txt`
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
- /ready availability: 100.00%
- /workers/ready availability: 0.00%
- API 5xx ratio: n/a
- execution queue lag p95: n/a
- execution queue lag max: n/a
- execution queue lag thresholds (p95/max): 10/20
- exchange order attempts delta: n/a
- exchange order failures delta: n/a
- exchange order failure ratio: n/a

## Suggested Checklist Updates
- Runtime and Operations Gates:
  - Queue lag metrics reviewed and within baseline -> OPEN
- Exit Evidence Workpack:
  - ops(slo): define SLO targets and collect production observation window evidence -> OPEN

## Manual Follow-ups (Required)
1. Fill backup/restore evidence in `docs/operations/v1-rc-external-gates-runbook.md`.
2. Fill on-call/escalation confirmation in runbook.
3. Complete sign-offs in `docs/operations/v1-rc-signoff-record.md`.
4. Reflect final gate states in `docs/operations/v1-release-candidate-checklist.md`.
