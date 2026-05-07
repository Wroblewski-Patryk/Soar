# Regression Log

Last updated: 2026-05-07

## Open Regressions

No open regression was identified in the agent operating system slice.

## Fixed Or Prevented In This Slice

- 2026-05-07: Ran production V1 release-gate classifier in dry-run mode and
  preserved stale evidence blockers as release state. This prevents treating
  old 2026-05-02 RC/backup/rollback artifacts as fresh V1 evidence.
- 2026-05-07: Refreshed activation audit and activation plan as current
  `NO-GO` artifacts, then reran the V1 gate dry-run to confirm those families
  are fresh while protected evidence remains blocked.
- 2026-05-07: Monitored production web build-info freshness after the collector
  hardening push. Latest pushed `main` is `21bb52f1...`, while production
  still reported `6bf5de83...` after the first canonical wait. A later
  canonical wait passed for `21bb52f1...`, so the deploy-lag monitor is closed
  for the code/tooling commit.
- 2026-05-07: Prevented a false-positive `LIVEIMPORT-03` release evidence
  path in `ops:liveimport:readback`; the collector now fails closed when no
  RUNNING runtime session produced a positions payload. Validation: local
  no-running-session harness exits non-zero with the expected error.
- Added durable anti-regression instructions in
  `.agents/core/anti-regression.md`.
- Added quality gate mapping in `.agents/core/quality-gates.md`.
- Added continuation state files so future short-nudge runs do not depend on
  hidden chat memory.

## Monitoring Rules

Future agents must append an entry here when:

- a regression is found but not fixed in the same iteration
- a regression is fixed and needs traceability
- a quality gate is skipped or blocked
- a test gap is intentionally deferred

## Entry Template

```markdown
### YYYY-MM-DD - Short title
- Status: open | fixed | monitoring
- Severity: P0 | P1 | P2
- Surface:
- Symptom:
- Root cause:
- Fix or mitigation:
- Validation:
- Follow-up:
```
