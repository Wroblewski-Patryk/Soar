# Regression Log

Last updated: 2026-05-07

## Open Regressions

No open regression was identified in the agent operating system slice.

## Fixed Or Prevented In This Slice

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
