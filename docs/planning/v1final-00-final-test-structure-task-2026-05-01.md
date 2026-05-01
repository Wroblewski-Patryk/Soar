# Task

## Header
- ID: V1FINAL-00
- Title: Freeze final V1 test structure after DOGE runtime hardening
- Task Type: release
- Current Stage: planning
- Status: DONE
- Owner: Ops/Release
- Depends on: V1DOGE-02, V1EXCEL-04, V1EXCEL-05
- Priority: P0

## Context
The latest local runtime hardening (`577c45a8`) has been pushed to `main`, but
production build-info still reports `c081f224`. Stage remains unavailable with
`503 no available server`. V1 must therefore continue as an evidence and
deployment-freshness problem, not as an ungrounded declaration of completion.

2026-05-01 follow-up recheck: production still reports `c081f224`, current
`main` head is `fba29a96`, and no current `Promote PROD` workflow run exists
for `577c45a8`/`fba29a96`. The blocker is an operational production deploy
trigger, not a new code task.

## Goal
Create one final V1 test structure that defines exactly what must be executed
after the latest runtime hardening reaches production.

## Success Signal
- User or operator problem: V1 keeps feeling close but not finally provable.
- Expected product or reliability outcome: final V1 verification has a clear gate order and cannot accidentally pass on stale deployed code.
- How success will be observed: production deploy freshness, DOGE runtime regression, V1EXCEL production evidence, manual matrix, and GO/NO-GO each have explicit pass/fail criteria.
- Post-launch learning needed: yes

## Deliverable For This Stage
Planning artifact:

- `docs/operations/v1-final-test-structure-2026-05-01.md`

## Scope
- Audit active queue:
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `.codex/context/PROJECT_STATE.md`
- Run executable public target checks:
  - production public smoke
  - production build-info
  - stage public smoke
- Publish final V1 gate structure.

## Implementation Plan
1. Check repository branch/status and active planning queues.
2. Run production public smoke and build-info freshness check.
3. Run stage public smoke to re-check the known blocker.
4. Compare deployed SHA to local `main` head.
5. Publish a gate-ordered final V1 test structure with pass/fail criteria.
6. Sync queue/context docs.

## Acceptance Criteria
- [x] The artifact states whether production currently contains `V1DOGE-02`.
- [x] The artifact records current stage status.
- [x] The artifact defines the DOGE post-deploy verification gate.
- [x] The artifact defines the remaining V1EXCEL production/manual/GO-NO-GO gates.
- [x] No final V1 completion is claimed without deploy freshness evidence.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` was reviewed for completion standards.
- [x] `DEPLOYMENT_GATE.md` was reviewed for release blockers.
- [x] Executable public checks were run and recorded.
- [x] Docs/context were updated.
- [x] No code or runtime behavior was changed.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- declaring V1 done from stale production SHA
- treating stage `503` as a product-code pass
- writing secrets or session tokens to artifacts
- replacing manual LIVE exchange-authority evidence with local tests

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS
  - `pnpm run ops:deploy:smoke -- --api-base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers` -> FAIL with `503`
- Manual checks:
  - production build-info reports `c081f224134fedb65de2ecad716274b92593c373`
  - local/repository head is `fba29a96`
  - latest `Promote PROD` workflow run is old (`0f122ed4`, 2026-04-25) and failed
- Screenshots/logs: command summaries captured in the operations artifact.
- High-risk checks: deployment freshness gate blocks DOGE post-deploy claims.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `docs/operations/deployment-rollback-playbook.md`
  - `DEPLOYMENT_GATE.md`
  - `DEFINITION_OF_DONE.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: final V1 test structure now references existing smoke/runtime/rollback commands.
- Rollback note: not applicable for planning-only artifact.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: release owner and LIVE trading operator
- Existing workaround or pain: V1 confidence is close but split across many evidence files.
- Smallest useful slice: one final test structure and deploy-freshness gate.
- Success metric or signal: next agent/operator can execute gates in order without guessing.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: yes

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable for planning-only artifact
- Critical user journey: final V1 release verification
- SLI: deploy freshness and runtime health evidence completeness
- SLO: no V1 GO without current SHA evidence
- Error budget posture: burning until final evidence closes
- Health/readiness check: production public smoke PASS; stage public smoke FAIL
- Logs, dashboard, or alert route: existing runtime freshness and rollback guard commands
- Smoke command or manual smoke: listed in operations artifact
- Rollback or disable path: existing rollback playbook

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for planning-only artifact
- Data classification: deployment and runtime evidence metadata
- Trust boundaries: public target checks only in this stage
- Permission or ownership checks: protected checks intentionally deferred until deploy freshness and auth context
- Abuse cases: accidentally claiming V1 on stale code
- Secret handling: no secrets used or recorded
- Security tests or scans: not applicable
- Fail-closed behavior: final V1 remains blocked until freshness/manual evidence gates pass
- Residual risk: production still needs deploy of `577c45a8`; stage still unavailable

## Result Report
- Task summary: froze a final V1 test structure after auditing active queues and target freshness.
- Files changed:
  - `docs/operations/v1-final-test-structure-2026-05-01.md`
  - queue/context files
- How tested: production public smoke PASS, production build-info checked, stage public smoke FAIL with known `503`.
- What is incomplete: production deploy trigger for `fba29a96` or later, post-deploy DOGE verification, stage restore, manual LIVE matrix, restore drill, RC rebuild, final GO/NO-GO.
- Next steps: deploy `fba29a96` or later to production, then execute Gate 0 and Gate 1 from the final test structure.
- Decisions made: V1 cannot be closed until deployed SHA includes the latest DOGE runtime hardening.
