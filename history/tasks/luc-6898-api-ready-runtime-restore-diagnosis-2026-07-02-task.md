# Task - LUC-6898 API Ready Runtime Restore Diagnosis

## Header

- ID: LUC-6898
- Title: Restore production runtime for API `/ready` 503
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: DRE
- Depends on: Resolved child [LUC-6901](/LUC/issues/LUC-6901)
- Priority: P0
- Mission ID: LUC-6898-API-READY-RUNTIME-RESTORE-2026-07-02
- Mission Status: VERIFIED / DONE

## Context

[LUC-6898](/LUC/issues/LUC-6898) was dispatched from the project truth runtime
index because `https://api.soar.luckysparrow.ch/ready` returned `503`. This
heartbeat was scoped to DRE read-only diagnosis and recovery routing.

## Goal

Identify the current production readiness failure and leave an executable
recovery path with evidence, without mutating production without permit.

## Scope

- Public API/Web smoke against production URLs.
- Protected readiness attempt using existing protected env names only.
- Read-only Coolify API status checks.
- Source inspection of readiness and rate-limit behavior.
- Evidence and state records only.

## Implementation Plan

1. Read [LUC-6898](/LUC/issues/LUC-6898) heartbeat context.
2. Probe public API/Web readiness.
3. Run the existing deploy smoke script with `--no-workers`.
4. Attempt protected readiness details without printing secret values.
5. Inspect source contracts for `/ready` and rate limiting.
6. Probe Coolify read-only endpoints.
7. Record evidence and route the recovery owner path.

## Acceptance Criteria

- Current public API/Web route status is recorded.
- `/ready` failure is tied to approved readiness code paths.
- Provider/Coolify readback status is recorded.
- No production mutation occurs without permit.
- Next owner/action is explicit.

## Definition of Done

- Evidence packet exists.
- Paperclip issue receives a durable disposition.
- Any required follow-up issue exists or the issue is blocked on a named owner.

## Validation Evidence

- `GET https://api.soar.luckysparrow.ch/health` -> `200`.
- Initial `GET https://api.soar.luckysparrow.ch/ready` -> `503`.
- `GET https://soar.luckysparrow.ch/` -> `200`.
- `GET https://soar.luckysparrow.ch/api/build-info` -> `200`, SHA
  `c357d957741f56835f27a1fc3a948dad43a91036`.
- `corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  -> `FAIL`, only API `/ready` failed.
- Admin login with protected env names -> `503`, values redacted.
- Coolify read-only endpoints -> `500`.
- Closure `corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  -> `PASS`: API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info` all returned `200`.
- Closure manual `GET https://api.soar.luckysparrow.ch/ready` -> `200`,
  body `{"status":"ready","service":"api"}`.
- Closure manual `GET https://soar.luckysparrow.ch/api/build-info` -> `200`,
  SHA `c357d957741f56835f27a1fc3a948dad43a91036`, `gitRef=main`.

## Deployment / Ops Evidence

- Deploy impact: resolved; production readiness is restored.
- Env or secret changes: none.
- Health-check impact: API `/health` and `/ready` both pass at closure.
- Smoke steps updated: no; existing smoke correctly detects the failure.
- Rollback note: no rollback executed by DRE.
- Observability impact: public route smoke is restored; earlier Coolify API
  `500` resource/log readback limitation remains historical evidence from the
  diagnosis heartbeat.

## Result Report

- Task summary: Initial diagnosis found API process alive but public readiness
  failing, with Redis dependency failure as the strongest read-only signal and
  Coolify readback unavailable. After [LUC-6901](/LUC/issues/LUC-6901), DRE
  reran parent closure smoke and confirmed production API `/ready` is restored.
- Files changed:
  - `history/evidence/luc-6898-api-ready-runtime-restore-diagnosis-2026-07-02.md`
  - `history/tasks/luc-6898-api-ready-runtime-restore-diagnosis-2026-07-02-task.md`
- How tested: production HTTP probes, deploy smoke, protected readiness attempt,
  Coolify read-only probes, source contract inspection, then closure deploy
  smoke after the recovery child.
- What is incomplete: protected `/ready/details`, runtime freshness, rollback
  guard, authenticated acceptance, and resource inventory were not rerun in
  this DRE closure heartbeat because the parent dispatch gap was the public
  API `/ready` 503 and the smallest sufficient public smoke now passes.
- Next steps: no remaining action on [LUC-6898](/LUC/issues/LUC-6898).
  Broader protected acceptance and resource inventory remain separate release
  gates if required by V1 readiness.

## Forbidden

- Secret disclosure.
- Live trading/account mutation.
- Production restart, deploy, rollback, DNS edit, or provider mutation without
  explicit permit.
- Push from dirty/divergent checkout.
