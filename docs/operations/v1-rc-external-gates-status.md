# V1 RC External Gates Status

Generated at (UTC): 2026-05-21T00:00:00.000Z

Source artifact: `docs\operations\v1-slo-window-report-7d-2026-05-21T15-28-58-352Z.json`
Observation window:
- started: n/a
- ended: n/a

## Gate Status Snapshot
- Gate 1 (Backup snapshot + restore validation): OPEN
- Gate 2 (Queue-lag baseline review): FAIL
- Gate 3 (Incident contacts + escalation confirmation): PASS
- Gate 4 (Formal RC sign-offs): PASS

## Backup/Restore Evidence
- Latest local artifact: `docs\operations\_artifacts-db-restore-check-2026-05-19T01-30-47-200Z.txt`
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

## Current Truth Overlay (2026-05-21)
- This generated file previously labelled Gate 2 as `PASS` from queue-lag-only
  review, but the current production SLO artifact is overall `FAIL`.
- Current Gate 2 blocker: `/workers/ready` availability `0.00%` and API 5xx
  ratio `16.67%`.
- Root cause indicated by the SLO artifact: deployed worker topology is
  `inline` with `DEPLOYED_INLINE_MODE`, while V1 expects the canonical
  split-worker contract.
- Current Gate 1 blocker: same-day production restore drill has not been run
  from VPS/Coolify Docker context for this candidate.

## Derived Metrics (from SLO artifact)
- source type: slo_window_report
- evidence environment: production
- production evidence present: yes
- /ready availability: 100.00%
- /workers/ready availability: 0.00%
- API 5xx ratio: 16.67%
- execution queue lag p95: 0
- execution queue lag max: 0
- execution queue lag thresholds (p95/max): 10/20
- exchange order attempts delta: n/a
- exchange order failures delta: n/a
- exchange order failure ratio: n/a

## Suggested Checklist Updates
- Runtime and Operations Gates:
  - Queue lag metrics reviewed and within baseline -> PASS
  - Worker readiness and API 5xx SLO -> FAIL
- Exit Evidence Workpack:
  - ops(slo): define SLO targets and collect production observation window evidence -> FAIL

## Manual Follow-ups (Required)
1. Reflect current gate states in `docs/operations/v1-release-candidate-checklist.md` after updating evidence/sign-offs.
