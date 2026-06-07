# LUC-2587 Autonomous Idle And Map Drift Sweep

## Header
- ID: LUC-2587
- Title: Autonomous idle and map drift sweep
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Priority: P1
- Mission ID: LUC-2587-AUTONOMOUS-IDLE-MAP-DRIFT-SWEEP-2026-06-07
- Mission Status: VERIFIED

## Context
Paperclip assigned [LUC-2587](/LUC/issues/LUC-2587) as a documentation and
idle-state sweep for Soar. The wake payload had no new comments
(`fallbackFetchNeeded=false`, comments `0/0`), and checkout was already claimed
by the harness, so no duplicate checkout was attempted.

## Goal
Determine whether Soar can move toward monitoring-only mode or remains in
active repair/verification, then record the map/readiness drift and current
owner path without mutating product code, production, credentials, deploy,
runtime, exchange state, database state, or live-trading state.

## Scope
- Reviewed Paperclip heartbeat context for [LUC-2587](/LUC/issues/LUC-2587).
- Reviewed Soar source-of-truth state: `.agents/state/active-mission.md`,
  `.agents/state/next-steps.md`, `.agents/state/module-confidence-ledger.md`,
  `.agents/state/requirements-verification-matrix.md`,
  `.codex/context/TASK_BOARD.md`, `docs/documentation-map.md`, and
  `docs/status/known-state-readiness.md`.
- Reviewed current generated architecture-awareness status in
  `docs/status/architecture-awareness-report.md`.
- Queried the Paperclip Soar issue queue read-only for non-terminal statuses.
- Checked whether `pnpm softwarehouse:control-tick` and
  `scripts/run-live-run-janitor.mjs` are available in this checkout.

## Implementation Plan
1. Consume inline wake payload first and avoid thread refetch because no comment
   batch or fallback fetch was required.
2. Compare current generated architecture and source-of-truth readiness docs.
3. Read back open Soar issue posture from Paperclip.
4. Record a bounded source-of-truth update and issue disposition.

## Acceptance Criteria
- The issue has a clear idle/monitoring disposition.
- Drift findings are evidence-backed with paths and commands.
- No duplicate specialist lane is opened when existing owner/blocker paths are
  already present.
- No protected or production action is performed.

## Verification Evidence
- Paperclip heartbeat-context readback succeeded for
  [LUC-2587](/LUC/issues/LUC-2587): status `in_progress`, no comments, no
  first-class blockers, parent [LUC-12](/LUC/issues/LUC-12) remains blocked.
- `pnpm softwarehouse:control-tick` failed because the script is not exposed in
  this checkout (`ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL`, command not found). This
  matches earlier documented tooling drift.
- `scripts/run-live-run-janitor.mjs` is missing in this checkout.
- Current architecture-awareness report is fresh at
  `2026-06-06T22:16:06.802Z`: `14712` entities, `23382` relations,
  `0` ownerless entities, `0` disconnected entities, `733` actionable
  missing-test links, and `0` actionable missing-doc links.
- `docs/status/known-state-readiness.md` was stale before this update: it was
  last updated `2026-05-26` and still cited old graph metrics plus the older
  `LUC-181` production gate.
- Paperclip queue readback returned `96` non-terminal Soar issues:
  `91` blocked, `3` in_progress, `2` in_review, and `0` todo.
- Live/in-review paths exist:
  [LUC-2588](/LUC/issues/LUC-2588) V1 audit-to-completion controller,
  [LUC-2587](/LUC/issues/LUC-2587) this sweep,
  [LUC-2580](/LUC/issues/LUC-2580) still reads `in_progress` in Paperclip
  despite local evidence indicating completion, [LUC-2558](/LUC/issues/LUC-2558)
  Coolify read-only access gate, and [LUC-1397](/LUC/issues/LUC-1397)
  owner-login verification path.
- Main protected blocker families remain first-class:
  [LUC-2505](/LUC/issues/LUC-2505) smoke auth binding,
  [LUC-241](/LUC/issues/LUC-241) workers/ready smoke principal permissions,
  [LUC-2372](/LUC/issues/LUC-2372) protected runtime worker SLO proof inputs,
  and [LUC-2558](/LUC/issues/LUC-2558) Coolify read-only production status
  access binding.

## Result Report
- Task summary: Soar is not idle and should not move to monitoring-only mode.
  It remains in active repair/verification with protected/operator gate hold
  and safe non-production docs/architecture evidence work allowed.
- Files changed: this task packet and `docs/status/known-state-readiness.md`.
- How tested: read-only Paperclip queue/API checks, source-of-truth file
  inspection, generated architecture report inspection, and tooling presence
  checks.
- What is incomplete: protected browser, worker readiness, SLO/release, Coolify
  access, and owner-login proof remain blocked or in review through existing
  Paperclip owner lanes.
- Next steps: keep PM/TSA on [LUC-2588](/LUC/issues/LUC-2588), keep
  Security/Ops gate ownership on [LUC-2505](/LUC/issues/LUC-2505) and
  [LUC-2372](/LUC/issues/LUC-2372), and status-sync
  [LUC-2580](/LUC/issues/LUC-2580) if its Paperclip state remains
  `in_progress` after the prior successful run.
- Decisions made: no new child issue was created because the queue already has
  explicit owner lanes and zero `todo` items.

## Boundaries
- No product code, runtime behavior, deploy, push, restart, rollback,
  env/account, secret, protected-smoke, exchange, database, or live-trading
  mutation occurred.
