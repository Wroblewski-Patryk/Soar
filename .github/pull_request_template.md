## Summary
- Scope:
- Risk level: Low / Medium / High

## Automated Checks
- [ ] `pnpm run quality:guardrails`
- [ ] `pnpm run lint`
- [ ] `pnpm run typecheck`
- [ ] `pnpm --filter api run test -- --run`
- [ ] `pnpm --filter web run test -- --run`
- [ ] `pnpm run build`
- Commands run:
  -
- Results:
  -

## Manual Smoke
- [ ] Authenticated dashboard path checked if UI or auth behavior changed
- [ ] Runtime or worker-sensitive path checked if execution behavior changed
- [ ] `pnpm i18n:audit:route-reachable:web` run if routes or copy changed
- [ ] deploy or rollback smoke reviewed if deployment behavior changed
- [ ] If this was a canonical-visual UI task, browser screenshots were compared
  to the approved reference and remaining mismatches were documented

Flows executed:
-

## Evidence Links
- Artifact folder or location:
- Screenshots:
- Canonical comparison notes:
- Logs:

## Context Updated
- [ ] `.codex/context/TASK_BOARD.md`
- [ ] `.codex/context/PROJECT_STATE.md`
- [ ] `.codex/context/LEARNING_JOURNAL.md` when needed
- [ ] `docs/` updated where relevant

## Rollback Plan
-

## Production Hardening Checklist

- [ ] `DEFINITION_OF_DONE.md` satisfied.
- [ ] `INTEGRATION_CHECKLIST.md` satisfied where applicable.
- [ ] `NO_TEMPORARY_SOLUTIONS.md` satisfied.
- [ ] `DEPLOYMENT_GATE.md` reviewed for release/deploy impact.
- [ ] No mock, placeholder, fake, or temporary path remains.
- [ ] Feature uses real data/API/service paths.
- [ ] Feature works after refresh, reload, or restart where applicable.
- [ ] Result report includes what was done, files changed, how tested, what is incomplete, next steps, and decisions made.

## AI Safety Checklist

- [ ] Not applicable.
- [ ] `AI_TESTING_PROTOCOL.md` scenarios executed.
- [ ] Prompt injection checks passed.
- [ ] Data leakage checks passed.
- [ ] Unauthorized access checks passed.
- [ ] AI red-team findings resolved or explicitly accepted.
