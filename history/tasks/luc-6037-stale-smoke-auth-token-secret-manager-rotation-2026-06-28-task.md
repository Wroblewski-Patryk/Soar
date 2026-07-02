# Task

## Header
- ID: LUC-6037
- Title: Execute stale SMOKE_AUTH_TOKEN secret-manager rotation from LUC-5869
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: DRE
- Links: [LUC-5869](/LUC/issues/LUC-5869), [LUC-6024](/LUC/issues/LUC-6024)
- Priority: Critical
- Module Confidence Rows: production protected smoke, runner auth binding
- Requirement Rows: protected smoke uses valid auth path
- Quality Scenario Rows: fail-closed security, release verification reliability
- Risk Rows: stale smoke token
- Iteration: 2026-06-28 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6037-STALE-SMOKE-AUTH-TOKEN-SECRET-MANAGER-ROTATION-2026-06-28
- Mission Status: DONE

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is skipped.
- [x] Exactly one priority task is selected from the scoped wake.
- [x] Affected module confidence, requirement, quality, and risk rows were
      identified.
- [x] The task remains inside the DRE deployment/reliability lane.

## Mission Block
- Mission objective: pick up the stale `SMOKE_AUTH_TOKEN` cleanup represented
  by [LUC-5869](/LUC/issues/LUC-5869), verify binding state without exposing
  values, and rotate/remove the binding if the DRE runner has approved
  secret-manager authority.
- Release objective advanced: protected production smoke reliability.
- Included slices: wake acknowledgement, Paperclip issue context readback,
  no-value runner env presence check, Paperclip secret metadata route check,
  current-binding production smoke, fresh-login production smoke, evidence
  packet, final Paperclip disposition.
- Explicit exclusions: secret value readback, deploy, push, restart, rollback
  execution, DB/Redis mutation, production account mutation, exchange mutation,
  order, position, subscription/payment mutation, or live-trading action.
- Stop condition: post-mutation current-binding protected smoke passes or a new
  first-class owner-path blocker is identified.

## Context

[LUC-6037](/LUC/issues/LUC-6037) was created because [LUC-5869](/LUC/issues/LUC-5869)
remained assigned to a paused owner and direct reassignment attempts from
[LUC-6024](/LUC/issues/LUC-6024) failed across authorization boundaries. The
requested DRE action is to execute the stale smoke-token removal/rotation work
or produce an explicit owner-path blocker.

## Goal

Remove or rotate the stale `SMOKE_AUTH_TOKEN` runner binding through approved
secret management, or block with precise evidence and owner action.

## Constraints
- Use only approved secret-management paths.
- Do not print, store, or infer secret values.
- Do not mutate production runtime, accounts, exchange state, or live trading.
- Do not treat process-local token clearing as central rotation.

## Definition of Done
- [x] Runner binding state checked without exposing values.
- [x] Secret-manager access checked without exposing values.
- [x] Current-binding smoke behavior verified.
- [x] Fresh-login fallback behavior verified.
- [x] Final issue disposition names the closure proof and residual risk.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- secret values in repo files, logs, comments, or artifacts

## Validation Evidence
- Environment name presence:
  - `SMOKE_AUTH_TOKEN=PRESENT(len=36)`
  - `SMOKE_AUTH_EMAIL=PRESENT(len=26)`
  - `SMOKE_AUTH_PASSWORD=PRESENT(len=9)`
- Secret manager:
  - `paperclipai secrets declarations --company-id <company>` could not run
    because `paperclipai` is not on PATH.
  - `GET /api/companies/{companyId}/secrets -> 403`.
- Current-binding smoke:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  - Result: public API/Web rows passed; protected `API /workers/ready -> 401`.
- Fresh-login smoke after process-local token clear:
  - `$env:SMOKE_AUTH_TOKEN=''; pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  - Result: all rows passed, including protected `API /workers/ready -> 200`.
- Child owner-path closure:
  - [LUC-6065](/LUC/issues/LUC-6065) completed owner routing.
  - [LUC-6066](/LUC/issues/LUC-6066) removed the central
    `SMOKE_AUTH_TOKEN` binding from affected Paperclip agent configs without
    exposing values.
- Post-mutation runner presence:
  - `SMOKE_AUTH_TOKEN=ABSENT`
  - `SMOKE_AUTH_EMAIL=PRESENT(len=26)`
  - `SMOKE_AUTH_PASSWORD=PRESENT(len=9)`
- Post-mutation current-binding smoke:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  - Result: all rows passed, including protected `API /workers/ready -> 200`.

## Result Report

- Task summary: DRE initially verified the stale token binding and fail-closed
  behavior, then after [LUC-6065](/LUC/issues/LUC-6065) /
  [LUC-6066](/LUC/issues/LUC-6066) completed the owner-path mutation, verified
  the resumed current-binding protected smoke passes through fresh-login auth.
- Files changed:
  - `history/evidence/luc-6037-stale-smoke-auth-token-secret-manager-rotation-2026-06-28.md`
  - `history/tasks/luc-6037-stale-smoke-auth-token-secret-manager-rotation-2026-06-28-task.md`
- How tested: no-value env presence check, Paperclip secret metadata route
  check, pre-mutation current-binding production smoke, fresh-login production
  smoke, child owner-path readback summary, and post-mutation current-binding
  production smoke.
- What is incomplete: no issue-local work remains for [LUC-6037](/LUC/issues/LUC-6037).
- Next owner/action: no direct follow-up on this issue. Release controllers
  should continue treating broader protected-input, build provenance, and
  host-level proof gates as separate lanes.
- Deployment impact: none; no push, deploy, restart, rollback, or env mutation
  was performed.
- Source-control closure: not committed; shared Soar workspace is already
  dirty/divergent with unrelated work (`main...origin/main` ahead/behind), and
  this heartbeat produced evidence only.
