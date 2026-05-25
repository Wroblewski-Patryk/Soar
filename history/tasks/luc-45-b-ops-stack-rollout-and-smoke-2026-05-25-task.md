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
