# Task

## Header
- ID: LUC-6461
- Title: Close release source/build provenance from dirty divergent main
- Task Type: release-source-control
- Current Stage: verification
- Status: BLOCKED / DIRTY_DIVERGENT_MAIN / NOT_RELEASE_SOURCE / PRODUCTION_WEB_503
- Owner: CTO
- Parent: [LUC-6459](/LUC/issues/LUC-6459)
- Priority: P0
- Mission ID: LUC-6461-RELEASE-SOURCE-BUILD-PROVENANCE-DIRTY-DIVERGENT-MAIN-2026-06-30
- Mission Status: VERIFIED_BLOCKED

## Context
[LUC-6459](/LUC/issues/LUC-6459) found the shared Soar checkout dirty and
divergent. This release-source task classifies the current source state, binds
it to build/provenance evidence where available, and records whether it can be
used for any release claim.

## Goal
Determine whether `C:/Personal/Projekty/Aplikacje/Soar` can serve as a
release source, identify coherent source-control paths, and record commit,
push, deploy, and residual-risk posture.

## Constraints
- No push.
- No deploy.
- No restart.
- No production mutation.
- No secret, account, payment, exchange, order, position, subscription, or
  live-trading mutation.
- Do not revert or overwrite unrelated dirty workspace files.

## Definition Of Done
- Source snapshot recorded.
- Dirty/untracked state classified.
- Remote/source ancestry recorded.
- Smallest safe provenance checks executed.
- Push/deploy posture and next owner recorded.

## Forbidden
- Force-pushing or merging divergent `main`.
- Deploying from the dirty shared checkout.
- Treating local dirty state or unverified generated evidence as release
  source.

## Source Snapshot
- Repository: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `dedb0e532defe0afddf12c5a5d130295a72af660`
- Local HEAD commit date: `2026-06-30 01:22:04 +0200`
- Local HEAD subject: `docs: record LUC-6309 architecture baseline evidence`
- Remote `origin/main`: `c357d957741f56835f27a1fc3a948dad43a91036`
- Remote commit date: `2026-06-29 01:01:51 +0200`
- Remote subject: `Fix production auth logout proof`
- Merge base: `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`
- Divergence after read-only fetch: `origin/main...HEAD = 3 behind / 21 ahead`
- Ancestry:
  - `origin/main` is not an ancestor of local `HEAD`.
  - local `HEAD` is not an ancestor of `origin/main`.

## Dirty Workspace Classification
- `git status --short --branch` remains
  `main...origin/main [ahead 21, behind 3]`.
- Porcelain count: `368` dirty rows.
- Tracked dirty files: `38`.
- Untracked files: `330`.
- Dirty row grouping:
  - `.agents`: `6`
  - `.codex`: `3`
  - `apps/api`: `2`
  - `apps/web`: `6`
  - `docs`: `23`
  - `history/artifacts`: `67`
  - `history/evidence`: `123`
  - `history/tasks`: `136`
  - `scripts`: `2`
- Uncommitted tracked diff size:
  `38 files changed, 62220 insertions(+), 54364 deletions(-)`.

## Committed Divergence Classification
- `origin/main..HEAD` contains `21` local-only commits.
- Committed diff from `origin/main..HEAD`: `276` files.
- Committed diff grouping:
  - `.agents`: `5`
  - `.codex`: `3`
  - `apps/api`: `20`
  - `apps/web`: `5`
  - `docs`: `47`
  - `history/artifacts`: `14`
  - `history/evidence`: `76`
  - `history/tasks`: `89`
  - `other`: `3`
  - `scripts`: `14`
- Committed diff size:
  `276 files changed, 280734 insertions(+), 206863 deletions(-)`.
- The local-only commits are not one coherent release bundle. They mix Stripe
  webhook runtime work, API/runtime tests, Web build metadata, architecture
  graph/documentation refreshes, historical evidence, source-control packets,
  production health packets, protected-input checks, and status ledgers.

## Build / Production Provenance
- Public API health check:
  `https://api.soar.luckysparrow.ch/health` returned `status=ok`,
  `service=api`, timestamp `2026-06-30T19:55:30.668Z`.
- Public Web build-info:
  `https://soar.luckysparrow.ch/api/build-info` returned HTTP `503`.
- Current production build SHA cannot be read from Web build-info in this
  heartbeat because the Web route is unavailable.
- This matches current production incident evidence from [LUC-6439](/LUC/issues/LUC-6439),
  [LUC-6445](/LUC/issues/LUC-6445), and related checks: Web and workers
  readiness are failing with `503`.

## Verification Evidence
- `git fetch origin main --prune`: PASS, read-only.
- `git status --short --branch`: PASS, classified as dirty/divergent.
- `git rev-parse HEAD`: PASS.
- `git rev-parse origin/main`: PASS.
- `git merge-base HEAD origin/main`: PASS.
- `git rev-list --left-right --count origin/main...HEAD`: PASS (`3 21`).
- `git diff --check`: PASS for whitespace-error exit; produced CRLF
  conversion warnings only.
- `git diff --stat --shortstat`: PASS.
- `git diff --stat --shortstat origin/main..HEAD`: PASS.
- `Invoke-RestMethod https://api.soar.luckysparrow.ch/health`: PASS.
- `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info`: FAIL with
  HTTP `503`.

## Source-Control Closure Recommendation
- This shared checkout is not a release source.
- Do not push `main` from this shared checkout.
- Do not deploy from this shared checkout.
- Do not claim production build provenance from this checkout while Web
  build-info returns `503`.
- Preserve prior clean source path evidence:
  `C:/Personal/Projekty/Aplikacje/Soar-luc6125-clean-ref`,
  branch `luc-6125-clean-source-ref`, head
  `c357d957741f56835f27a1fc3a948dad43a91036`, remains the clean local
  source-ref evidence for the prior auth repair path.
- Any new release candidate must be built in an isolated clean worktree from
  current `origin/main`, then cherry-pick or merge only explicitly approved,
  validated commit bundles.

## Result Report
- Task summary:
  [LUC-6461](/LUC/issues/LUC-6461) closes as a CTO source-control
  classification packet, not as release-ready provenance.
- Files changed by this task:
  `history/tasks/luc-6461-release-source-build-provenance-dirty-divergent-main-2026-06-30-task.md`.
- Commit SHA:
  not committed; the workspace is intentionally dirty/divergent and this task
  must not stage unrelated user/agent work.
- Push status:
  blocked / prohibited from shared `main`.
- Deploy impact:
  none; no deploy, restart, rollback, or production mutation performed.
- Residual risk:
  production Web build-info is unavailable with HTTP `503`, and shared `main`
  contains unreviewed mixed runtime/docs/evidence state.
- Next owner/action:
  Delivery/Ops or release-source owner should create or reuse an isolated clean
  release-candidate worktree from `origin/main`, select explicit validated
  commit bundles, and rerun source/build provenance after [LUC-6331](/LUC/issues/LUC-6331)
  restores Web/build-info availability.

## 2026-07-01 Local Repair / Source-Control Lane Refresh

### Wake Comment Acknowledgement
- Wake comment:
  `softwarehouse-local-repair-lane-starter:v1`.
- How it changed action:
  the lane is authorized for local source-control closure and a local commit
  when evidence supports closure, but push, deploy, restart, production
  mutation, protected smoke/live account mutation, and secret disclosure remain
  forbidden.
- Current disposition:
  blocked, not done. The checkout still contains product-code, docs, evidence,
  context, generated graph, and agent-state dirt across multiple owner lanes.

### Current Source Snapshot
- Repository: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- Local HEAD commit date: `2026-07-01 01:46:42 +0200`
- Local HEAD subject: `docs: record Coolify read-only status access proof`
- Remote `origin/main`: `c357d957741f56835f27a1fc3a948dad43a91036`
- Remote commit date: `2026-06-29 01:01:51 +0200`
- Remote subject: `Fix production auth logout proof`
- Merge base: `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`
- Divergence:
  `origin/main...HEAD = 3 behind / 22 ahead`

### Current Dirty Workspace Classification
- `git status --short --branch`:
  `main...origin/main [ahead 22, behind 3]`
- Porcelain rows: `416`
- Tracked dirty files: `41`
- Untracked files: `375`
- Dirty row grouping:
  - `.agents`: `7`
  - `.codex`: `3`
  - `apps`: `9`
  - `docs`: `23`
  - `history`: `372`
  - `scripts`: `2`
- Uncommitted tracked diff size:
  `41 files changed, 64429 insertions(+), 54367 deletions(-)`

### Affected Capability / Chain / Files
- Release source/build provenance chain:
  source tree -> git ancestry -> local validation -> production build-info.
- Runtime provenance remains blocked because public Web
  `/api/build-info` is known unavailable with HTTP `503` from current
  production watch packets, and [LUC-6331](/LUC/issues/LUC-6331) remains the
  first-class Web/backtest-worker restoration blocker.
- Product-code dirty paths still present and not owned by this SPM lane:
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
  - `apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx`
  - `apps/web/src/app/dashboard/page.tsx`
  - `apps/web/src/context/AuthContext.test.tsx`
  - `apps/web/src/context/AuthContext.tsx`
  - `apps/web/src/features/admin/layout/AdminLayoutShell.test.tsx`
  - `apps/web/src/features/admin/layout/AdminLayoutShell.tsx`
  - `apps/web/src/features/backtest/components/BacktestsList.test.tsx`
  - `apps/api/src/modules/architectureBaselineProof.test.ts`
- Script dirty paths still present:
  - `scripts/checkProtectedInputReadiness.mjs`
  - `scripts/checkProtectedInputReadiness.test.mjs`

### Validation Evidence
- `git status --short --branch`:
  PASS, classified as dirty/divergent.
- `git rev-parse HEAD`:
  PASS, `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`.
- `git rev-parse origin/main`:
  PASS, `c357d957741f56835f27a1fc3a948dad43a91036`.
- `git merge-base HEAD origin/main`:
  PASS, `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`.
- `git rev-list --left-right --count origin/main...HEAD`:
  PASS, `3 22`.
- `git diff --check`:
  PASS for whitespace-error exit; output contains CRLF conversion warnings
  only.
- `pnpm exec vitest run scripts/checkProtectedInputReadiness.test.mjs`:
  TIMED OUT after `120s`; wrong runner for this Node test file in this scope.
- `pnpm run ops:protected-inputs:check:test`:
  PASS, `7/7` Node tests, duration `2308.2288ms`.

### Commit / No-Commit Decision
- Decision:
  no local commit from this SPM heartbeat.
- Reason:
  affected repo remains dirty with product-code and generated/docs/evidence
  ownership mixed across already routed lanes. A docs-only commit for this
  packet would not close release provenance and would add another local-only
  commit on a divergent shared `main` without reducing the blocker.
- Push status:
  blocked / forbidden.
- Deploy impact:
  none; no push, deploy, restart, rollback, production mutation, protected
  smoke, secret/account readback, exchange/payment action, order, position,
  subscription mutation, or live-trading action occurred.

### Remaining Dirty Paths / Ownership
- Remaining dirty path families:
  `.agents/*`, `.codex/*`, `apps/api/*`, `apps/web/*`, `docs/*`,
  `history/*`, and `scripts/*`.
- Product-code classification owner path:
  [LUC-6518](/LUC/issues/LUC-6518) already classified the product-code dirty
  lane and should remain the reference for commit splitting.
- Runtime provenance unblock owner:
  Ops Release Lead / board-approved Coolify mutation owner on
  [LUC-6331](/LUC/issues/LUC-6331) must restore `soar-web` and
  `workers-backtest`, then DRE/QVE rerun build-info, deploy smoke,
  workers readiness, runtime freshness, rollback guard, and authenticated
  acceptance.
- Release-source next owner:
  CTO/Delivery release-source owner should split coherent validated commit
  bundles in an isolated clean worktree from `origin/main`, not from this dirty
  shared checkout.

### Regression Risk / Follow-Up Gaps
- Risk:
  high release-provenance risk if any release claim uses this checkout, because
  it is behind remote, ahead locally, dirty, and cannot be matched to a live
  Web build-info SHA.
- Follow-up gap:
  production build SHA remains unreadable until [LUC-6331](/LUC/issues/LUC-6331)
  resolves.
- Follow-up gap:
  dirty product-code/script changes need coherent owner commits or explicit
  discard/defer decisions before a release source can be prepared.

## 2026-07-02 SPM Blocked-Disposition Refresh

### Wake Status Acknowledgement
- Wake reason:
  `issue_status_changed`.
- Current issue status on wake:
  `in_progress`.
- How it changed action:
  the latest continuation summary already classified [LUC-6461](/LUC/issues/LUC-6461)
  as blocked, but the issue was woken as `in_progress`; this heartbeat refreshed
  the local source snapshot and returns the issue to a first-class blocked
  disposition instead of starting unrelated release work.

### Current Source Snapshot
- Repository:
  `C:/Personal/Projekty/Aplikacje/Soar`
- Branch:
  `main`
- Local HEAD:
  `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- Local HEAD commit date:
  `2026-07-01 01:46:42 +0200`
- Local HEAD subject:
  `docs: record Coolify read-only status access proof`
- Remote `origin/main`:
  `c357d957741f56835f27a1fc3a948dad43a91036`
- Remote commit date:
  `2026-06-29 01:01:51 +0200`
- Remote subject:
  `Fix production auth logout proof`
- Merge base:
  `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`
- Divergence:
  `origin/main...HEAD = 3 behind / 22 ahead`

### Dirty Workspace Classification
- `git status --short --branch`:
  `main...origin/main [ahead 22, behind 3]`
- Porcelain rows:
  `517`
- Tracked dirty files:
  `44`
- Untracked files:
  `473`
- Dirty row grouping:
  - `.agents`: `7`
  - `.codex`: `3`
  - `apps`: `9`
  - `docs`: `27`
  - `history`: `469`
  - `scripts`: `2`
- Uncommitted tracked diff size:
  `44 files changed, 96318 insertions(+), 72904 deletions(-)`
- Product-code dirty paths remain present under `apps/api` and `apps/web`.
  This checkout is still not a release source.

### Validation Evidence
- `git status --short --branch`:
  PASS, classified as dirty/divergent.
- `git rev-parse HEAD`:
  PASS, `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`.
- `git rev-parse origin/main`:
  PASS, `c357d957741f56835f27a1fc3a948dad43a91036`.
- `git merge-base HEAD origin/main`:
  PASS, `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`.
- `git rev-list --left-right --count origin/main...HEAD`:
  PASS, `3 22`.
- `git diff --check`:
  PASS for whitespace-error exit; output contains CRLF conversion warnings
  only.
- `pnpm run ops:protected-inputs:check:test`:
  PASS, `7/7` Node tests.

### Disposition
- Result:
  blocked, not release-ready.
- Commit SHA:
  not committed; this heartbeat only refreshed a provenance packet inside a
  repo that remains mixed dirty/divergent, and a docs-only commit would not
  close source/build provenance.
- Push status:
  blocked / forbidden from shared dirty/divergent `main`.
- Deploy impact:
  none; no push, deploy, restart, rollback, production mutation, protected
  smoke, secret/account readback, exchange/payment action, order, position,
  subscription mutation, or live-trading action occurred.
- First-class blocker:
  [LUC-6331](/LUC/issues/LUC-6331) must restore `soar-web` and
  `workers-backtest` so build-info and runtime readiness can be rechecked.
- Next owner/action:
  CTO/Delivery release-source owner should prepare any next release candidate
  in an isolated clean worktree from `origin/main`, then select only explicit,
  reviewed, validated commit bundles after [LUC-6331](/LUC/issues/LUC-6331)
  restores Web/build-info availability.
