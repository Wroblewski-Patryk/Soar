# Task

## Header
- ID: LUC-45-B
- Title: [Soar][LUC-45] Ops stack rollout and smoke gate
- Task Type: release
- Current Stage: blocked
- Status: BLOCKED
- Owner: Ops/Release Engineer
- Depends on: LUC-45 controller packet
- Priority: P0

## Context
One-stack Coolify migration is implemented locally but not fully proven on temp domains.

## Goal
Produce safe rollout evidence for the parallel stack before any cutover decision.

## Scope
- `docker-compose.coolify.yml`
- Coolify parallel stack deployment and smoke evidence
- Rollback/cutover readiness packet

## Required Output
- Temp-domain deploy evidence for API/Web/build-info/workers.
- Rollback posture and cutover recommendation.

## Validation
- Public and temp-domain smoke checks.
- Worker stability/readiness checks.
- No secret disclosure in artifacts.

## Acceptance Criteria
- [ ] Parallel stack deploy succeeds with expected candidate SHA.
- [ ] Smoke evidence passes for API/Web/build-info/workers.
- [ ] Rollback path is explicit and validated as deploy-safe.

## 2026-05-25 Heartbeat Checkpoint (Ops)
- Stage moved to: verification (local pre-deploy gate).
- Validation evidence (no deploy mutation):
  - `corepack pnpm run docker:coolify:config` PASS
    - confirms API liveness healthcheck uses `/health` and keeps `/ready` for smoke.
  - `corepack pnpm run ops:coolify-stack:env-check:example` PASS
    - required present `16/16`, redacted output only.
  - `corepack pnpm run quality:guardrails` PASS
    - repository + deployment guardrails clean.
- Evidence status:
  - implemented and verified (local pre-deploy safety gate): liveness fix + config/env guardrails.
  - blocked by external action (temp-domain deployment execution in Coolify):
    - owner: Ops Release Lead with Coolify operator access
    - unblock action: deploy parallel compose stack on temp domains for expected SHA, then run API/Web/build-info/worker smoke and attach artifacts.

## Current Disposition
- Status: BLOCKED (external deploy-control context required for temp-domain rollout proof).

## 2026-05-25 Board Alignment
- Source: board comment `52cc5e8a-ba50-47b5-8116-b64807c9645b`.
- Confirmed lane state: blocked on external Coolify/operator temp-domain rollout access.
- Unblock owner: `local-board` + assigned Coolify operator with secure deploy access.
- Required unblock action:
  - execute controlled parallel stack deploy on temp domains for expected candidate SHA,
  - capture smoke evidence (`API /health`, `API /ready`, `Web /`, `build-info`, worker readiness),
  - attach artifacts to this lane for cutover recommendation.

## 2026-05-25 Operator Runbook
- Runbook owner: Coolify operator approved for Soar project scope and temp-domain access.
- Minimal operator sequence:
  - verify `.env` for temp-domain stack from the approved template and inject expected `SOURCE_COMMIT`,
  - deploy one-stack Compose application as a temporary parallel service set,
  - wait for API/Web/container readiness and record timestamps,
  - run smoke against temp domain:
    - `curl -fsS <temp-api>/health`
    - `curl -fsS <temp-api>/ready`
    - `curl -fsS <temp-web>/`
    - `curl -fsS <temp-web>/api/build-info`
  - run worker readiness check on all four workers (`workers-market-data`, `workers-market-stream`, `workers-backtest`, `workers-execution`) and record one stable timestamped proof packet.
- Required evidence artifacts for close:
  - temp-domain smoke log (`API /health`, `API /ready`, `Web /`, `build-info`)
  - worker readiness list with one worker instance per role and stable tag.
- Cutover constraint:
  - do not stop old six-production applications until temp-stack evidence is recorded and reviewed in `LUC-47`.

## 2026-05-25 Reopen Checkpoint (read-only Coolify audit)
- Trigger: board comment `8c222a6c-2982-4f88-b192-bf0080405c62` (credentials configured, read-only first).
- Credentials posture (names only): `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_LOGIN_EMAIL`, `COOLIFY_SOAR_*`, `VPS_*` are present in shell.
- Workspace/project inventory (Coolify API, read-only):
  - projects found: `5`
  - Soar project found: `name=Soar`, `uuid=ogy0ozce7lub39mnwjwb4lwe`
  - Soar environment found: `name=production`, `uuid=pqshrhj4dqgvzgrl0gfvuhn8`
  - applications found: `13` (includes `soar-api`, `soar-web`, and four workers)
  - services found: `1`
  - databases found: `2` (`redis`, `postgresql-*`)
- Current deploy/commit state (read-only):
  - Coolify application details expose `git_commit_sha=HEAD` for Soar apps/workers, so commit truth is not directly usable from these fields.
  - Public Web build-info returns:
    - `gitSha=4c16305c97566b7680f4feb041601af2af0a0d31`
    - `gitRef=main`
    - `metadataSource=github-branch`
    - `buildId=lOTfRqJhr4dtG9nX50WDf`
- Public smoke (read-only) via `curl`:
  - `https://api.soar.luckysparrow.ch/health` -> `200`
  - `https://api.soar.luckysparrow.ch/ready` -> `200`
  - `https://soar.luckysparrow.ch/` -> `200`
- Rollback notes:
  - canonical path remains `docs/operations/deployment-rollback-playbook.md`
  - no deploy mutation, restart, rollback, or env write was executed in this checkpoint.
- New blockers discovered:
  - configured `COOLIFY_SOAR_PROJECT_ID` format does not match endpoint expectation (`/projects/{uuid}/environments` succeeds with project UUID, not the previous ID hint path).
  - configured `COOLIFY_SOAR_APP_ID` / `COOLIFY_SOAR_API_APP_ID` / `COOLIFY_SOAR_WEB_APP_ID` do not match current API `applications` UUIDs (`0` matches), so deployment targeting variables must be refreshed before safe temp-domain execution.
  - lane acceptance criteria are still open because temp-domain parallel stack proof (`API/ready/Web/build-info/workers`) is not yet attached.

## 2026-05-25 Final Read-Only Recheck (post-open)
- Verified live Coolify schema details from read-only API inventory:
  - Soar project UUID: `ogy0ozce7lub39mnwjwb4lwe`
  - Soar production environment name: `production`
  - Soar production environment id: `6`
  - Soar service set in environment `6` (repo `Wroblewski-Patryk/Soar`, branch `main`, status `running:unknown`):
    - `soar-api` -> `k126p7vqxs5cly2zc4y4g4rq`
    - `soar-web` -> `ato4fqkncd6t38wzlle2m0rv`
    - `workers-market-data` -> `sj0bh3pirqq1jf41bijaf77y`
    - `workers-market-stream` -> `d2oo1wwy8i55q27e5mdky0i4`
    - `workers-backtest` -> `gktawk85w6826z2bs8z123mz`
    - `workers-execution` -> `s2qz86w8c9hc5anajdtl5d8r`
- Cross-checked temp marker candidates:
  - no resource/app entries with `temp` keyword or obvious temp-domain FQDN were detected in names/FQDNs for Soar services during this read-only sweep.
- Open block remains:
  - temp-domain deploy is still not executed, so required evidence for `API /health`, `API /ready`, `Web /`, `build-info`, and worker readiness at expected SHA is still pending.
- Unblock action for the operator:
  - refresh Coolify environment bindings to the IDs above and execute the parallel temp-stack deploy using the normal one-stack runbook, then attach smoke logs plus worker readiness proof.

## 2026-05-26 Continuation Checkpoint (adapter-failure triage)
- Trigger: continuation run failed before heartbeat logic with adapter error:
  - `EEXIST: file already exists, symlink C:\Users\wrobl\.codex\auth.json -> ...\codex-home\auth.json`
- Local runtime verification (no secret output):
  - source auth file exists: `C:\Users\wrobl\.codex\auth.json`
  - target runtime auth file exists: `...\companies\f13051a7...\codex-home\auth.json`
  - target is a regular file (not a symlink), which explains `EEXIST` on symlink creation.
- Impact on lane:
  - failure is platform bootstrap/runtime behavior and occurred before any deploy/smoke execution for `LUC-47`.
  - no new deployment mutation was performed in this checkpoint.
- Lane disposition after triage:
  - remains `BLOCKED` for the original external deploy-evidence gap (temp-domain rollout + smoke packet still missing).

## 2026-05-26 Continuation Checkpoint (read-only Coolify audit + public smoke)
- Trigger: resumed after board comment `8c222a6c-2982-4f88-b192-bf0080405c62` and adapter bootstrap unblock attempts.
- Coolify API inventory read-only (token present in env, values redacted):
  - API base: `https://vps.luckysparrow.ch`
  - projects discovered: `5` (`Soar` project UUID: `ogy0ozce7lub39mnwjwb4lwe`)
  - Soar production environment: `name=production`, `uuid=pqshrhj4dqgvzgrl0gfvuhn8`, `id=6`
  - Soar services discovered in env 6:
    - `soar-api`
    - `soar-web`
    - `workers-market-data`
    - `workers-market-stream`
    - `workers-backtest`
    - `workers-execution`
  - No `temp-*` resource entries were detected in Coolify resource inventory for Soar in this sweep.
  - Note: resource status values are `running:unknown` and should be treated as read-only inventory metadata.
- Public smoke checks captured (public routes, no auth secrets used):
  - `https://api.soar.luckysparrow.ch/health` -> `200`
  - `https://api.soar.luckysparrow.ch/ready` -> `200`
  - `https://soar.luckysparrow.ch/` -> `200`
  - `https://soar.luckysparrow.ch/api/build-info` -> `200`
    - `gitSha`: `4c16305c97566b7680f4feb041601af2af0a0d31`
    - `gitRef`: `main`
    - `metadataSource`: `github-branch`
  - `https://api.soar.luckysparrow.ch/workers/health` -> `401` (auth required)
  - `https://api.soar.luckysparrow.ch/workers/ready` -> `401` (auth required)
- Temp-domain deploy evidence status:
  - still pending; no temporary parallel stack smoke artifacts (`temp-api`, `temp-web`) could be produced in this checkpoint.
- Runtime blockers / follow-up for operator handoff:
  - continue blocked until controlled parallel deploy to temp domains executes and produces artifacts for:
    - `temp-api` `/health`, `/ready`
    - `temp-web` `/` and `/api/build-info`
    - worker readiness for the four workers
  - refresh Coolify IDs in local stack env bindings to verified UUIDs before operator start:
    - soar-api/application id `3`
    - soar-web/application id `4`
    - workers IDs: `6`, `7`, `8`, `9`

## 2026-05-26 Continuation Checkpoint (adapter lock triage: os error 32)
- Trigger: run `179d2fa7-c191-404e-851f-5684dd41246a` failed with
  `Proces nie może uzyskać dostępu do pliku, ponieważ jest on używany przez inny proces. (os error 32)`.
- Runtime triage findings (no secrets printed):
  - `C:\Users\wrobl\.codex\auth.json` exists, regular file (`Archive`), size `4940`.
  - `...\companies\f13051a7...\codex-home\auth.json` exists, regular file (`Archive`), size `4940`.
  - high process concurrency detected in runtime session (`codex`, `node`, `node_repl` families active in parallel), consistent with file-lock contention during adapter bootstrap.
- Interpretation:
  - failure occurred in runtime adapter bootstrap path, before issue implementation logic.
  - this is environment/process contention, not a Soar deploy/runtime regression.
- Unblock owner/action:
  - owner: local runtime/operator owner (`local-board` with host process control).
  - action: clear stale parallel Codex/Paperclip runtime processes that may hold `auth.json`, then rerun `LUC-47` heartbeat.
  - after rerun success, proceed with the existing `LUC-47` critical path: temp-domain parallel deploy + smoke evidence packet (`API/Web/build-info/workers`).
- Lane disposition:
  - remains `BLOCKED` until runtime lock contention is removed and temp-domain deploy evidence is attached.

## 2026-05-26 Continuation Checkpoint (operator packet validation against current deployed SHA)
- Action executed:
  - `corepack pnpm run ops:operator-unblock:check -- --expected-sha 4c16305c97566b7680f4feb041601af2af0a0d31 --json`
- Result:
  - `FAIL` (validator exit code `1`), with explicit target mismatch:
    - packet target SHA: `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`
    - expected SHA (current public build-info): `4c16305c97566b7680f4feb041601af2af0a0d31`
  - packet path: `history/artifacts/v1-operator-unblock-packet-380308d1-2026-05-24.json`
- Interpretation:
  - operator packet is structurally valid but stale for the currently deployed candidate.
  - this blocks a clean, SHA-accurate temp-domain rollout evidence chain.
- Required unblock action update:
  - regenerate/update operator unblock packet to current expected SHA before running temp-domain rollout smoke and attaching final `LUC-47` evidence.

## 2026-05-26 Board Comment Alignment (return lane to TODO for scheduled release flow)
- Source: board comment `b91443af-019a-40a7-9b23-e55bbcb05dc2`.
- Decision applied:
  - do not keep `LUC-47` in stale `in_progress`/retry loop while no live deploy run is active.
  - return lane to `TODO` and resume via scheduled release process (Coolify operator path).
- Ready-to-resume checklist for next active run:
  - clear runtime bootstrap/process lock contention for adapter startup (`os error 32` family),
  - refresh operator unblock packet SHA to current expected candidate SHA,
  - execute temp-domain parallel deploy and capture smoke packet (`API/Web/build-info/workers`),
  - attach rollback posture and cutover recommendation evidence.
- Lane disposition after this alignment:
  - `TODO` (queued for scheduled release execution path), not closed.
- Scheduled release execution aid (prepared in this heartbeat):
  - `history/evidence/luc-47-scheduled-release-smoke-checklist-2026-05-26.md`

## 2026-05-26 Janitor Alignment (comment 7c6d36a9-9d1d-466c-a9fd-617f7664df59)
- Trigger: board flagged stale `in_progress` without active live run.
- Decision in this heartbeat:
  - lane is moved from passive `TODO/in_progress` drift to explicit `BLOCKED` until next scheduled operator run is actively started.
- Durable evidence classification:
  - `implemented but not verified` for rollout closure scope:
    - checklist prepared and linked,
    - read-only inventory and public smoke captured,
    - no temp-domain parallel deploy evidence attached yet.
- Concrete unblock owner/action:
  - owner: `local-board` + scheduled Coolify operator.
  - action:
    1. start scheduled live release run for `LUC-47`,
    2. refresh operator packet SHA to current candidate SHA,
    3. execute temp-domain parallel deploy,
    4. attach smoke and worker-readiness evidence packet,
    5. publish rollback posture + cutover recommendation.
- Commit/push/deploy state for this heartbeat:
  - commit: no
  - push: no
  - deploy: no

## 2026-05-26 Ops Lead Narrow Resume (comment ad04cc28-a139-4931-88c1-2bae5b16293e)
- Scope executed: read-only topology + smoke disposition for SHA `3fedb7a9170097b40accb6ccea1915064f383f11`.
- Coolify topology reachability:
  - Soar project reachable: `id=5`, `uuid=ogy0ozce7lub39mnwjwb4lwe`.
  - Production environment reachable: `id=6`, `uuid=pqshrhj4dqgvzgrl0gfvuhn8`.
  - Soar resources visible in env `6`: `soar-api`, `soar-web`, `workers-market-data`, `workers-market-stream`, `workers-backtest`, `workers-execution`.
- Runtime/resource status snapshot (read-only):
  - `soar-api`: `running:unknown`
  - `soar-web`: `running:unknown`
  - `workers-market-data`: `running:unknown`
  - `workers-backtest`: `running:unknown`
  - `workers-execution`: `running:unknown`
  - `workers-market-stream`: `exited:unhealthy`
  - no temp-domain/parallel-stack resource detected in this sweep.
- Public smoke for candidate SHA:
  - `https://api.soar.luckysparrow.ch/health` -> `200`
  - `https://api.soar.luckysparrow.ch/ready` -> `200`
  - `https://soar.luckysparrow.ch/` -> `200`
  - `https://soar.luckysparrow.ch/api/build-info` -> `200`, `gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`.
- Honest disposition for this heartbeat:
  - `BLOCKED` for lane closure:
    - acceptance criteria still unmet (no temp-domain parallel deploy smoke packet),
    - worker fleet is not fully healthy (`workers-market-stream` unhealthy).
- Unblock owner/action (unchanged ownership, updated facts):
  - owner: scheduled Coolify operator + local-board release control.
  - action: perform scheduled temp-domain parallel deploy run, recover/verify `workers-market-stream` readiness, and attach full temp-domain smoke/readiness packet for SHA `3fed...`.
- Commit/push/deploy state in this heartbeat:
  - commit: no
  - push: no
  - deploy: no

## 2026-05-26 Resume Delta Checkpoint (comment 50cee746-3dd0-4ac3-959f-cf26b72fab79)
- Trigger: board resumed lane after local Codex auth repair with request to stay narrow and leave evidence.
- Action executed in this heartbeat:
  - refreshed no-secret protected-input readiness artifact for current public build-info SHA:
    - `history/artifacts/v1-protected-input-readiness-4c16305c-2026-05-26.json`
    - `history/evidence/v1-protected-input-readiness-4c16305c-2026-05-26.md`
  - created current no-secret operator unblock packet bound to the same SHA:
    - `history/artifacts/v1-operator-unblock-packet-4c16305c-2026-05-26.json`
  - validated packet with strict SHA check:
    - `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-4c16305c-2026-05-26.json --expected-sha 4c16305c97566b7680f4feb041601af2af0a0d31 --json`
    - result: `PASS`
- Scope guard:
  - no deploy mutation, no env write, no rollback action, no secret disclosure.
- Remaining blocker (unchanged lane-critical):
  - temp-domain parallel deploy smoke evidence is still missing for:
    - `temp-api /health`, `temp-api /ready`
    - `temp-web /`, `temp-web /api/build-info` (SHA match)
    - worker readiness for four worker services.
- Unblock owner/action:
  - owner: scheduled Coolify operator + `local-board`.
  - action: run temp-domain deploy and attach smoke/readiness packet to close `LUC-47`.
- Lane disposition after this checkpoint:
  - `BLOCKED` (ready packet prepared; deploy-side evidence still pending).

## 2026-05-26 Continuation Checkpoint (adapter EEXIST re-triage + liveness recheck)
- Trigger: continuation wake reported adapter failure:
  - `EEXIST: file already exists, symlink C:\Users\wrobl\.codex\auth.json -> ...\codex-home\auth.json`.
- Runtime re-triage (no secret values):
  - source auth path exists and is a regular file:
    - `C:\Users\wrobl\.codex\auth.json` (`Attributes=Archive`, `LinkType=<empty>`, size `4941`).
  - runtime target auth path exists and is also a regular file:
    - `...\companies\f13051a7...\codex-home\auth.json` (`Attributes=Archive`, `LinkType=<empty>`, size `4941`).
  - result confirms symlink bootstrap collision (`EEXIST`) because destination is not a symlink slot.
  - process inventory shows high `Codex/codex` concurrency in the same host session, increasing bootstrap contention risk.
- Public liveness recheck:
  - `https://soar.luckysparrow.ch/api/build-info` -> `200`
  - observed `gitSha`: `4c16305c97566b7680f4feb041601af2af0a0d31` (unchanged in this checkpoint).
- Scope guard:
  - no deploy mutation, no env mutation, no rollback run, no secret output.
- Updated unblock owner/action:
  - owner: `local-board` (runtime host control) + scheduled Coolify operator.
  - action:
    1. clear stale Codex runtime process fan-out / auth-file contention on host,
    2. rerun issue heartbeat after clean bootstrap,
    3. execute temp-domain parallel deploy and attach required smoke packet (`temp-api/temp-web/workers`).
- Lane disposition:
  - `BLOCKED` (first-class blocker is runtime bootstrap collision + still-missing temp-domain deploy evidence).

## 2026-05-26 Successful Run Handoff (finish_successful_run_handoff)
- Trigger: successful continuation run requested explicit handoff closure for this heartbeat.
- Durable handoff packet:
  - `history/evidence/luc-47-successful-run-handoff-2026-05-26.md`
- Handoff confirms:
  - prior adapter-failure triage and SHA-aligned no-secret operator artifacts are complete,
  - lane acceptance criteria remain open only on temp-domain deploy smoke/readiness evidence,
  - unblock owner/action remains explicit (`local-board` + scheduled Coolify operator).
- Lane disposition for this heartbeat:
  - `BLOCKED` (deploy-evidence gate not yet satisfied).

## 2026-05-26 Capacity-Controlled Resume Checkpoint (comment ea128e1d-3334-403c-bde5-48b214e9ac64)
- Trigger: board reopened lane with capacity governor instruction (narrow lane only, no sibling-run fan-out).
- Capacity/scope compliance in this heartbeat:
  - executed only `LUC-47` lane checks,
  - no child/sibling lane spawn/resume actions,
  - no deploy mutation and no secret disclosure.
- Fresh no-secret verification evidence:
  - `GET https://api.soar.luckysparrow.ch/health` -> `200`, payload `status=ok`.
  - `GET https://api.soar.luckysparrow.ch/ready` -> `200`, payload `status=ready`.
  - `GET https://soar.luckysparrow.ch/api/build-info` -> `200`,
    `gitSha=4c16305c97566b7680f4feb041601af2af0a0d31`.
  - `GET https://api.soar.luckysparrow.ch/workers/ready` -> `401` (auth-gated worker proof).
  - `ops:operator-unblock:check` for packet
    `history/artifacts/v1-operator-unblock-packet-4c16305c-2026-05-26.json`
    with expected SHA `4c16305c97566b7680f4feb041601af2af0a0d31` -> `PASS`.
- Exact blocker remains:
  - missing temp-domain parallel-stack evidence required by acceptance criteria:
    - `temp-api /health`, `temp-api /ready`,
    - `temp-web /`, `temp-web /api/build-info` with SHA match,
    - four-worker readiness packet.
- Unblock owner/action/evidence needed:
  - owner: `local-board` + scheduled Coolify operator.
  - action:
    1. execute temp-domain parallel deploy under scheduled release control,
    2. collect and attach temp smoke + worker readiness artifacts,
    3. publish rollback posture and cutover recommendation tied to same SHA.
  - evidence needed: redacted command/output packet for all endpoints above.
- Lane disposition for this heartbeat:
  - `BLOCKED` (first-class blocker is still missing temp-domain deploy evidence).

## 2026-05-26 Successful-Run Handoff Cleanup (finish_successful_run_handoff)
- Trigger: continuation summary still carried stale generic text (`inspect failed run`) despite successful lane checkpoint.
- Cleanup decision:
  - authoritative next action for `LUC-47` remains deploy-evidence execution only (not generic failure triage).
- Exact next action:
  1. scheduled Coolify temp-domain parallel deploy for expected SHA `4c16305c97566b7680f4feb041601af2af0a0d31`,
  2. attach required smoke/readiness artifacts (`temp-api`, `temp-web`, four workers),
  3. attach rollback posture + cutover recommendation tied to the same SHA.
- Lane disposition:
  - `BLOCKED` until those acceptance artifacts are attached.

## 2026-05-26 Issue-Status-Changed Checkpoint
- Trigger: wake reason `issue_status_changed`; lane remained active without new scope expansion.
- Fresh no-secret evidence refresh:
  - `GET https://api.soar.luckysparrow.ch/health` -> `200` (`status=ok`).
  - `GET https://api.soar.luckysparrow.ch/ready` -> `200` (`status=ready`).
  - `GET https://soar.luckysparrow.ch/api/build-info` -> `200`,
    `gitSha=4c16305c97566b7680f4feb041601af2af0a0d31`.
  - `ops:operator-unblock:check` for packet
    `history/artifacts/v1-operator-unblock-packet-4c16305c-2026-05-26.json`
    with expected SHA `4c16305c97566b7680f4feb041601af2af0a0d31` -> `PASS`.
- Scope guard:
  - no deploy mutation, no env mutation, no secret disclosure.
- Authoritative next action remains unchanged:
  1. scheduled temp-domain parallel deploy,
  2. attach acceptance smoke/readiness artifacts (`temp-api`, `temp-web`, four workers),
  3. attach rollback posture + cutover recommendation bound to same SHA.
- Lane disposition:
  - `BLOCKED` (missing temp-domain evidence packet is still the only closure blocker).

## 2026-05-26 Finish-Successful-Run Handoff Sync
- Trigger: successful run handoff requested with no new scope.
- Sync result:
  - kept lane continuation fail-closed on the same single blocker,
  - reaffirmed that stale generic instruction (`inspect failed run`) is non-authoritative for this lane unless a new failure occurs.
- Authoritative next action (unchanged):
  1. scheduled temp-domain parallel deploy,
  2. attach required temp smoke/readiness packet (`temp-api`, `temp-web`, four workers),
  3. attach rollback/cutover note bound to SHA `4c16305c97566b7680f4feb041601af2af0a0d31`.
- Lane disposition:
  - `BLOCKED`.

## 2026-05-26 Reopen Via Comment (77fa3521-4b63-4597-958a-7174fe327f7a)
- Trigger: board asked to resume narrow ops temp-domain evidence lane and verify whether evidence can be produced safely from configured Coolify access.
- Safety/access verification in this shell:
  - Coolify access env names are not present (`COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_*` missing), so no read-only Coolify API verification or temp deploy execution is possible from this run.
  - No production mutation was performed.
- Fresh no-secret runtime readback:
  - `GET https://api.soar.luckysparrow.ch/health` -> `200`.
  - `GET https://api.soar.luckysparrow.ch/ready` -> `200`.
  - `GET https://soar.luckysparrow.ch/api/build-info` -> `200` with new SHA:
    `3fedb7a9170097b40accb6ccea1915064f383f11`.
- Durable prep update completed for the new deployed SHA:
  - generated:
    - `history/artifacts/v1-protected-input-readiness-3fedb7a9-2026-05-26.json`
    - `history/evidence/v1-protected-input-readiness-3fedb7a9-2026-05-26.md`
    - `history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json`
  - validated:
    - `ops:operator-unblock:check --packet ...3fedb7a9-2026-05-26.json --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --json` -> `PASS`.
- Exact blocker / owner / action / evidence needed:
  - blocker:
    - missing Coolify credentials/access in current run context,
    - temp-domain deploy evidence packet still missing (`temp-api`, `temp-web`, four-worker readiness).
  - owner:
    - `local-board` + scheduled Coolify operator.
  - action:
    1. provide/confirm approved Coolify operator access for this lane execution context,
    2. run scheduled temp-domain parallel deploy for SHA `3fedb7a9170097b40accb6ccea1915064f383f11`,
    3. attach redacted smoke/readiness outputs and rollback/cutover note.
  - evidence needed:
    - `temp-api /health`, `temp-api /ready`,
    - `temp-web /`, `temp-web /api/build-info` (SHA match),
    - four-worker readiness packet,
    - rollback posture and cutover recommendation.
- Lane disposition:
  - `BLOCKED`.

## 2026-05-26 Assigned Heartbeat Checkpoint (issue_assigned)
- Trigger: explicit assigned wake for `LUC-47` with instruction to take concrete action and leave durable disposition.
- Actions executed (no deploy mutation):
  - Public smoke recheck:
    - `https://api.soar.luckysparrow.ch/health` -> `200`
    - `https://api.soar.luckysparrow.ch/ready` -> `200`
    - `https://soar.luckysparrow.ch/` -> `200`
    - `https://soar.luckysparrow.ch/api/build-info` -> `200`, `gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`
  - Packet gate recheck (explicit packet path, expected SHA bound):
    - `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --json`
    - result: `PASS`
  - Coolify read-only inventory check (token/env present, secrets redacted):
    - `applications=13`, `services=1`
    - Soar resources visible: `soar-api`, `soar-web`, four workers
    - no temp-domain/parallel-stack resource was visible in current inventory (`name/fqdn` sweep)
- Evidence status:
  - `implemented and verified` for no-secret public runtime and packet integrity checks.
  - `blocked by error/state` for closure acceptance: required temp-domain rollout evidence still cannot be attached because a temp parallel stack target is not visible in the current Coolify inventory.
- First-class blocker (unchanged acceptance blocker, now with fresh proof):
  - Missing temp-domain evidence packet:
    - `temp-api /health`, `temp-api /ready`
    - `temp-web /`, `temp-web /api/build-info` (SHA-matched)
    - readiness proof for four workers on temp stack
- Unblock owner/action:
  - owner: scheduled Coolify operator + local board release controller.
  - action:
    1. create or expose the temp-domain parallel stack resource in Coolify,
    2. execute deploy for SHA `3fedb7a9170097b40accb6ccea1915064f383f11`,
    3. attach full temp smoke/readiness evidence packet and rollback/cutover note.
- Commit/push/deploy in this heartbeat:
  - commit: no
  - push: no
  - deploy: no
- Lane disposition:
  - `BLOCKED`.

## 2026-05-26 Continuation Delta (finish_successful_run_handoff)
- Trigger: handoff wake with no new board input and no new operator artifact.
- No-change reconciliation completed:
  - expected public SHA remains `3fedb7a9170097b40accb6ccea1915064f383f11`,
  - temp-domain parallel stack evidence packet remains missing,
  - last read-only Coolify snapshot still includes `workers-market-stream=exited:unhealthy`.
- Risk status:
  - unchanged from previous checkpoint; no new mitigations were executed in this heartbeat.
- Commit/push/deploy in this heartbeat:
  - commit: no
  - push: no
  - deploy: no
- Lane disposition:
  - `BLOCKED` (unchanged).

## 2026-05-26 Source-Scoped Recovery Action
- Trigger: wake reason `source_scoped_recovery_action` while lane status is blocked.
- Concrete checks executed (no deploy mutation):
  - `GET https://api.soar.luckysparrow.ch/health` -> `200` (`status=ok`).
  - `GET https://api.soar.luckysparrow.ch/ready` -> `200` (`status=ready`).
  - `GET https://soar.luckysparrow.ch/api/build-info` -> `200`,
    `gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`.
  - `GET https://api.soar.luckysparrow.ch/workers/health` -> `401` (auth-gated).
  - `ops:operator-unblock:check --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --json` -> `PASS`.
- Result:
  - no-secret runtime/packet readiness remains valid for the expected SHA.
  - acceptance closure evidence for temp-domain parallel stack is still missing.
- Exact blocker / owner / action:
  - blocker:
    - missing temp-domain smoke/readiness packet (`temp-api`, `temp-web`, four workers),
    - unresolved worker fleet health signal in prior read-only Coolify inventory (`workers-market-stream=exited:unhealthy`).
  - owner:
    - scheduled Coolify operator + local-board release controller.
  - action:
    1. create/expose temp-domain parallel stack target in Coolify,
    2. deploy expected SHA `3fedb7a9170097b40accb6ccea1915064f383f11`,
    3. attach redacted temp smoke/readiness outputs and rollback/cutover note.
- Commit/push/deploy in this heartbeat:
  - commit: no
  - push: no
  - deploy: no
- Lane disposition:
  - `BLOCKED`.
