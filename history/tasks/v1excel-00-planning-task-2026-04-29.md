# Task

## Header
- ID: V1EXCEL-00
- Title: Publish full V1 excellence and production-confidence packet
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: closure of `V1TRUTH-A`
- Priority: P0

## Context
The repository now records the final `LIVE` money-path engineering wave as
closed, but the project completion rules still require fresh manual,
integration, deployment, smoke, rollback, and sign-off evidence before V1 can
be called fully excellent and operationally trustworthy for real money.

## Goal
Publish one canonical packet describing everything still missing between
"engineering scope implemented" and "V1 works fully excellently with fresh
production confidence evidence".

## Deliverable For This Stage
A planning packet that:
- separates closed implementation from missing evidence,
- freezes the remaining gap categories,
- defines the execution order for local/manual/stage/prod confidence closure,
- keeps `BOTMULTI-A` deferred outside this packet.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Canonical packet published under `docs/planning/`
- [x] Remaining work is grouped by evidence and confidence category
- [x] Deferred post-`V1` architecture scope stays outside this packet
- [x] Validation evidence for planning-stage changes is recorded

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `pnpm run quality:guardrails`
- Manual checks:
  - reviewed `DEFINITION_OF_DONE.md`
  - reviewed `INTEGRATION_CHECKLIST.md`
  - reviewed `DEPLOYMENT_GATE.md`
  - reviewed `v1-production-activation-contract.md`
  - reviewed current `V1TRUTH-A` closure evidence
- Screenshots/logs: not applicable
- High-risk checks:
  - separated completed engineering work from still-missing operational proof

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none in this planning slice

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This packet intentionally treats "fully excellent V1" as stricter than "all
known repository bugs are fixed". The remaining work is mostly fresh evidence,
manual matrix execution, and final production confidence closure.

## Production-Grade Required Contract

### Goal
Create one canonical plan for the final confidence gap between code-complete
`V1` and operator-trustworthy `LIVE` readiness.

### Scope
- planning docs
- queue/context sync
- no runtime code in this stage

### Implementation Plan
1. Review current closure waves and activation contracts.
2. Classify remaining work into evidence/confidence categories.
3. Publish the execution packet.
4. Sync queue/context.
5. Run guardrails.

### Acceptance Criteria
- The packet lists all remaining non-deferred V1 confidence gaps.
- It distinguishes closed engineering scope from missing evidence.
- It defines a deterministic execution order for the follow-up wave.
- It leaves multi-strategy bot work deferred outside this packet.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: not applicable
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: repository guardrails

## Result Report

- Task summary: published the full V1 excellence/confidence gap packet
- Files changed: planning packet only
- How tested: `pnpm run quality:guardrails`
- What is incomplete: audit, manual matrix, local confidence repair or classification,
  fresh stage/prod evidence, final go/no-go
- Next steps: execute `V1EXCEL-01..08`
- Decisions made:
  - treat `V1TRUTH-A` as engineering-closed
  - treat fresh operational evidence as still required
  - keep `BOTMULTI-A` outside this packet
