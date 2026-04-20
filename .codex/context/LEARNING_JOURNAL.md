# LEARNING_JOURNAL

Purpose: keep a compact memory of recurring execution pitfalls and verified fixes for this repository.

## Update Rules
- Add or update an entry when a failure pattern is reproducible or documented.
- Prefer updating an existing entry over creating duplicates.
- Keep entries in English and free of secrets.
- Apply the new guardrail in the same task where the learning is captured.

## Entry Template
```markdown
### YYYY-MM-DD - Short Title
- Context:
- Symptom:
- Root cause:
- Guardrail:
- Preferred pattern:
- Avoid:
- Evidence:
```

## Entries

### 2026-04-12 - PowerShell command chaining compatibility
- Context: running multi-step commands in Windows shell workflows.
- Symptom: command chains using `&&` fail in environments pinned to Windows PowerShell 5.1.
- Root cause: pipeline chain operators (`&&`, `||`) are available in PowerShell 7+, not in Windows PowerShell 5.1.
- Guardrail: use sequential commands with explicit exit-code checks for compatibility.
- Preferred pattern:
```powershell
pnpm lint
if ($LASTEXITCODE -eq 0) { pnpm test }
if ($LASTEXITCODE -eq 0) { pnpm -r build }
```
- Avoid: `pnpm lint && pnpm test && pnpm -r build`
- Evidence:
  - https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipeline_chain_operators?view=powershell-7.5
  - Team-reported failure pattern in this repository workflow on Windows.

### 2026-04-15 - ripgrep access denied in this workspace
- Context: repository exploration on Windows PowerShell in Codex desktop environment.
- Symptom: `rg --files <path>` fails with `Program 'rg.exe' failed to run: Access denied`.
- Root cause: environment-level execution restriction for `rg.exe` in this session.
- Guardrail: fallback to PowerShell-native discovery commands when `rg` is unavailable or blocked.
- Preferred pattern:
```powershell
Get-ChildItem -Recurse -File <path> | ForEach-Object { $_.FullName }
```
- Avoid: retry loops with `rg` after first deterministic `Access denied` failure.
- Evidence:
  - Observed on 2026-04-15 while inspecting `apps/web/src/features/*` directories in this repository.
  - Reconfirmed on 2026-04-16 while triaging `apps/api/src/modules/engine/*` and `apps/api/src/modules/market-stream/*`; `Select-String` fallback worked without retries.

### 2026-04-15 - PowerShell 5.1 UTC timestamp compatibility
- Context: generating timestamped evidence artifact names in Windows PowerShell shell scripts.
- Symptom: `Get-Date -AsUTC` fails with parameter binding error in this environment.
- Root cause: `-AsUTC` is not available in Windows PowerShell 5.1.
- Guardrail: use explicit conversion with `.ToUniversalTime()` when building UTC file-name timestamps.
- Preferred pattern:
```powershell
$ts = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH-mm-ss-fffZ')
```
- Avoid: `Get-Date -AsUTC -Format ...`
- Evidence:
  - Observed on 2026-04-15 while generating `docs/operations/_artifacts-docs-parity-*.json` in this repository.

### 2026-04-16 - Long soak load-test summary overflow
- Context: running 30-minute load soak via `apps/api/scripts/load-test.mjs`.
- Symptom: process exits with `RangeError: Maximum call stack size exceeded` at summary stage (`Math.min(...result.latenciesMs)` / `Math.max(...result.latenciesMs)`).
- Root cause: spread operator over very large latency arrays exceeds call stack for long/high-throughput runs.
- Guardrail: for 30-minute soak evidence, always persist pre/post `/metrics` snapshots and raw load output; treat script summary as optional unless load-test implementation is hardened.
- Preferred pattern:
```powershell
# capture pre/post metrics + raw runner output as primary evidence
# do not rely only on load-test JSON summary for long windows
```
- Avoid: using spread (`Math.min(...arr)`, `Math.max(...arr)`) over unbounded large arrays in long-duration load runners.
- Evidence:
  - Observed on 2026-04-16 in `docs/operations/_artifacts-cpdb24-soak-2026-04-16T02-03-29-605Z.json` (`RangeError` in `apps/api/scripts/load-test.mjs`).

### 2026-04-16 - API e2e shared-db concurrency collision
- Context: running multiple API e2e files in one `vitest` invocation against the shared local test database.
- Symptom: suites that pass individually fail in batch with FK cleanup errors (for example `BacktestRun_userId_fkey` during `wallets.crud.e2e` teardown).
- Root cause: file-level parallel execution causes cleanup order races between suites that mutate overlapping relational tables.
- Guardrail: run DB-mutating API e2e suites sequentially per file for planning/QA evidence runs unless an isolated database per worker is configured.
- Preferred pattern:
```powershell
pnpm --filter api test -- src/modules/strategies/strategies.e2e.test.ts
if ($LASTEXITCODE -eq 0) { pnpm --filter api test -- src/modules/wallets/wallets.crud.e2e.test.ts }
if ($LASTEXITCODE -eq 0) { pnpm --filter api test -- src/modules/bots/bots.wallet-contract.e2e.test.ts }
```
- Avoid: bundling several DB-mutating e2e files into a single `vitest` call in this environment.
- Evidence:
  - Reproduced on 2026-04-16 while executing WLT-23 QA pack; grouped run failed with FK cleanup collisions, sequential per-file execution passed.

### 2026-04-17 - Coolify secret-env mount requires Dockerfile syntax 1.10
- Context: Docker builds on Coolify with "Use Docker Build Secrets" enabled.
- Symptom: deployment fails early during Dockerfile parse/solve with errors like `unexpected key 'env' in 'env=COOLIFY_URL'`, often before app build steps run.
- Root cause: Coolify injects `RUN --mount=type=secret,...,env=...` options that are not supported by Dockerfile frontend `1.7`.
- Guardrail: keep all deploy Dockerfiles on `# syntax=docker/dockerfile:1.10` (or newer) when builds can receive Coolify secret mounts.
- Preferred pattern:
```Dockerfile
# syntax=docker/dockerfile:1.10
FROM node:20-bookworm-slim
```
- Avoid: mixing Coolify build-secret injection with Dockerfile frontend `1.7`.
- Evidence:
  - Local reproduction on 2026-04-17: minimal Dockerfile with `1.7` + `--mount=type=secret,env=...` failed with `unexpected key 'env'`; same file with `1.10` succeeded.
  - Applied across `apps/api/Dockerfile*` and `apps/web/Dockerfile` in this repository.

### 2026-04-17 - SCOPE LOCK, SMALL COMMITS, GROUP-END PUSH
- Context: UI/task execution in planning waves.
- Symptom: unnecessary rework caused by changing UI detail (footer language-switcher flags) without explicit request and by oversized multi-topic commits.
- Root cause: assumption-driven change beyond requested scope + bundling too many concerns in one commit.
- Guardrail:
  - `IF NOT EXPLICITLY REQUESTED, DO NOT CHANGE IT.`
  - `ONE TASK GROUP -> SMALL SCOPE-LOCKED COMMITS -> PUSH AFTER LAST COMMIT IN THAT GROUP.`
- Preferred pattern:
```text
SCOPE LOCK: implement only explicitly requested behavior.
If unsure, leave existing UI/UX unchanged.
Bridge/add-on changes are allowed only when required by failing tests/build/contracts for the requested feature.
Prefer smaller, single-purpose commits over large mixed commits.
After completing the full planned group: push immediately after the final commit.
```
- Avoid: "cleanup" or visual tweaks not listed in task acceptance criteria.
- Evidence:
  - User-reported rework caused by unnecessary footer language-switcher flag change (2026-04-17).
  - User feedback that large, multi-thread commits increase drift risk and rework (2026-04-17).

### 2026-04-17 - PLANNING SOURCE-OF-TRUTH CROSS-CHECK
- Context: answering "what is planned next" in a repository with both canonical queues and historical checklists/templates.
- Symptom: assistant reports "nothing planned" from canonical queue, while other docs still contain unchecked boxes; later tasks are rediscovered and cause context churn.
- Root cause: no explicit two-tier planning read (active canonical queue vs non-canonical/historical docs) before status response.
- Guardrail:
  - `BEFORE SAYING "NO TASKS PLANNED", RUN TWO-TIER CHECK:`
  - `TIER 1 (ACTIVE): canonical planning files only.`
  - `TIER 2 (BACKGROUND): all docs unchecked items, explicitly labeled as historical/template/non-active when applicable.`
- Preferred pattern:
```text
When user asks "what is planned":
1) Report ACTIVE queue from canonical files.
2) Separately report any non-canonical open checklists as "background/historical".
3) If mismatch exists, propose sync/archival update to avoid future drift.
```
- Avoid: collapsing all unchecked boxes into one queue or ignoring non-canonical unchecked docs entirely.
- Evidence:
  - Observed mismatch on 2026-04-17: canonical planning files had 0 open tasks while legacy docs still had many unchecked checklists (including EXCTX/VPS readiness artifacts).

### 2026-04-17 - Planning must activate executable NOW queue
- Context: user asks for a large implementation plan and expects executor to start immediately with `start` intent.
- Symptom: executor reports "nothing to do" even when a detailed plan document exists.
- Root cause: plan was documented, but canonical execution queue (`mvp-next-commits.md`) and fallback source (`mvp-execution-plan.md`) were not populated with active unchecked task commits.
- Guardrail: every new wave plan must be followed in the same turn by queue activation in canonical planning files.
- Preferred pattern:
```text
1) Write detailed wave plan file.
2) Promote first 3-5 concrete commit tasks to `NOW`.
3) Place next slice in `NEXT`, remaining slice in `PIPELINE`.
4) Mirror unchecked tasks in `mvp-execution-plan.md` so automatic refill works.
5) Add grouped batch map (A/B/C/...) for executor clarity.
```
- Avoid: leaving `NOW/NEXT/PIPELINE` as `none` after publishing a new plan.
- Evidence:
  - 2026-04-17 user report: executor had no actionable tasks despite existing UXR plan.

### 2026-04-18 - Next.js typecheck depends on fresh `.next/types` snapshot
- Context: running `pnpm --filter web run typecheck` during closure packs.
- Symptom: `tsc --noEmit` fails with many `TS6053` missing files under `apps/web/.next/types/app/...` despite unchanged route files.
- Root cause: web tsconfig includes `.next/types/**/*.ts`; if a prior `next build` fails before finishing type generation (for example lint error), cached `.next/types` can become stale/incomplete.
- Guardrail: in closure/CI-like verification, run `pnpm --filter web run build` (or `next typegen`) before final standalone `typecheck` when route tree changed or after interrupted builds.
- Preferred pattern:
```powershell
pnpm --filter web run build
if ($LASTEXITCODE -eq 0) { pnpm --filter web run typecheck }
```
- Important: do not run `web build` and `web typecheck` in parallel in this repo;
  parallel execution can race on `.next/types` generation and cause false `TS6053`.
- Canonical command shortcut added on 2026-04-18:
  - `pnpm run web:verify:build-typecheck`
  - prefer this over manual two-step command invocation in closure packs.
- Avoid: treating missing `.next/types` errors as app-code regressions before refreshing Next.js generated types.
- Evidence:
  - Observed on 2026-04-18 during `L10NQ-D-18`: `typecheck` failed with missing `.next/types/app/...`; after fixing build blocker and running `next build`, `typecheck` passed.

### 2026-04-18 - Sandbox `spawn EPERM` for `next build` / `vitest` requires escalation
- Context: running web validation commands in Codex desktop `workspace-write` sandbox.
- Symptom: `next build` and `vitest` fail early with `Error: spawn EPERM` (esbuild/child-process startup), and follow-up checks (`tsc`) can fail from stale/missing `.next/types`.
- Root cause: sandbox process-spawn restriction for toolchain subprocesses in this environment.
- Guardrail: if build/test commands fail with `spawn EPERM`, rerun those exact commands with `require_escalated`; then rerun `tsc --noEmit` after successful `next build`.
- Preferred pattern:
```text
1) Run next build (if EPERM -> rerun with escalation).
2) Run focused vitest pack (if EPERM -> rerun with escalation).
3) Run tsc --noEmit after build to validate `.next/types`.
```
- Avoid: treating `spawn EPERM` as application-code failure or closing a QA task before retrying with escalation.
- Evidence:
  - Observed on 2026-04-18 during `UXR-E-12` closure pack; non-escalated `next/vitest` failed with `spawn EPERM`, escalated reruns passed (`next build` PASS, focused Vitest pack `30/30` PASS).

### 2026-04-18 - API e2e requires active Docker Engine / local Postgres
- Context: running focused API e2e regression for bots runtime scope (`BRS-A`) in local Codex desktop environment.
- Symptom: e2e run fails at setup (`prisma.log.deleteMany`) with `Can't reach database server at localhost:5432`; `docker compose up -d postgres` also fails with missing `dockerDesktopLinuxEngine` pipe.
- Root cause: Docker Desktop engine is not running/available in the session, so local Postgres container cannot be started.
- Guardrail: before DB-backed API e2e runs, verify Docker engine availability and `localhost:5432` reachability; if unavailable, mark validation as environment-blocked and run non-DB gates (`typecheck`, guardrails) until DB runtime is restored.
- Preferred pattern:
```powershell
docker --version
docker compose version
docker compose up -d postgres
pnpm --filter api run typecheck
pnpm run quality:guardrails
```
- Avoid: repeatedly rerunning DB-backed e2e tests before engine health is restored.
- Evidence:
  - Observed on 2026-04-18 during `BRS-02..BRS-04` validation (`bots.e2e.test.ts` targeted run).

### 2026-04-19 - Domain drift in ops smoke targets after brand-domain switch
- Context: running `OPV-01` stage/prod deployment rehearsal and smoke checks.
- Symptom: smoke checks fail with `fetch failed` when targeting legacy domains (`cryptosparrow.luckysparrow.ch`, `api.cryptosparrow.luckysparrow.ch`), while current production Soar domains pass.
- Root cause: operations docs/context still referenced legacy hostnames after deployment traffic/domain switched to `soar.luckysparrow.ch` + `api.soar.luckysparrow.ch`.
- Guardrail: before rehearsal/smoke, resolve DNS for target domains and prefer canonical active production domains from latest evidence docs; if DNS is missing, record explicit external blocker instead of retry loops.
- Preferred pattern:
```powershell
Resolve-DnsName api.soar.luckysparrow.ch
Resolve-DnsName soar.luckysparrow.ch
$env:SMOKE_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:SMOKE_WEB_BASE_URL='https://soar.luckysparrow.ch'
node scripts/deploySmokeCheck.mjs --no-workers
```
- Avoid: assuming older domain contracts in smoke/release docs remain valid after brand/domain migration.
- Evidence:
  - 2026-04-19 `OPV-01` evidence pack: production smoke PASS on Soar domains, stage smoke blocked due missing stage DNS records for `stage-soar`/`stage-api.soar`.

### 2026-04-19 - RC gate status can appear stale without fresh window-report rebuild
- Context: refreshing OPV production release evidence (`OPV-03`) after collecting a new SLO observation artifact.
- Symptom: `ops:rc:gates:status` still showed old `PASS` state until rolling window reports were regenerated.
- Root cause: gate-status builder prefers latest `v1-slo-window-report-*.json` over raw `_artifacts-slo-window-*.json`; if only raw SLO is new, status can be computed from an older window report.
- Guardrail: after `ops:slo:collect`, always regenerate window reports (`7d`, `30d`) before running `ops:rc:gates:status`, or explicitly pass `--input` to the intended fresh artifact.
- Preferred pattern:
```powershell
pnpm run ops:slo:collect -- --base-url https://api.soar.luckysparrow.ch --environment production
pnpm run ops:slo:window-report -- --window-days 7
pnpm run ops:slo:window-report -- --window-days 30
pnpm run ops:rc:gates:status
```
- Avoid: treating the first post-collect gate snapshot as final when window reports were not rebuilt.
- Evidence:
  - Observed on 2026-04-19 during OPV-03 refresh. Fresh window rebuild changed snapshot from stale `PASS` to current `Gate 2 = OPEN` and `RC status = BLOCKED`.

### 2026-04-19 - Queue drift from duplicated historical phase tasks
- Context: active queue reopened `POS-37..POS-42` even though the same tasks were already marked completed in earlier canonical phase history.
- Symptom: executor receives already-delivered tasks as READY/NOW, causing repeated planning cycles and unnecessary token/work spend.
- Root cause: queue section (`NOW/NEXT` and late `Phase POS` block) was not reconciled against earlier completed phase log entries before activation.
- Guardrail: before activating or executing a queued task, cross-check task IDs against prior completed phase sections in `mvp-execution-plan.md`; if completed, close as queue-drift with verification evidence instead of re-implementing.
- Preferred pattern:
```text
1) Detect duplicate task IDs across plan phases.
2) Validate behavior with focused tests for the duplicated scope.
3) Publish closure evidence (verification + references).
4) Sync queue/board/state so duplicated tasks are marked closed.
```
- Avoid: reopening historical tasks into `NOW` without an explicit regression/new-scope reason.
- Evidence:
  - Observed on 2026-04-19 while reconciling `POS-A/POS-B` (`POS-37..POS-42`) queue state.

### 2026-04-19 - Gate status follow-ups must be state-derived, not static
- Context: RC external-gates status output used by operators during release closure.
- Symptom: generated status report always listed all manual follow-ups, including already-completed Gate 1/3 evidence.
- Root cause: follow-up section was hardcoded and not derived from current gate state.
- Guardrail: status/report scripts must generate operator follow-ups from computed gate outcomes to avoid stale or misleading required actions.
- Preferred pattern:
```text
1) Compute gate states.
2) Build follow-up list only for unresolved gates.
3) Always append checklist-sync reminder as the final step.
```
- Avoid: static "required actions" sections that ignore already-closed gates.
- Evidence:
  - Observed and fixed on 2026-04-19 in `scripts/buildRcExternalGateStatus.mjs` (`OPV-05`).

### 2026-04-19 - Private OPS auth layer can mask Gate2 probes as 401
- Context: production RC Gate2 pipeline against protected OPS endpoints (`/workers/*`, `/alerts`, `/metrics`).
- Symptom: stage smoke passes but Gate2 remains `OPEN`; probes return `401` and queue/5xx metrics become `n/a` even with valid app token flow.
- Root cause: production path can require layered auth (for example gateway basic auth or custom header) in addition to API session auth; scripts sent only bearer/cookie token.
- Guardrail: when running OPS/Gate pipelines on private routes, support and pass the additional auth layer together with app token auth.
- Preferred pattern:
```text
pnpm run ops:rc:gates:prod-pipeline -- --base-url https://<target-api> --auth-token <ADMIN_JWT> --ops-basic-user <user> --ops-basic-password <pass>
# or
pnpm run ops:rc:gates:prod-pipeline -- --base-url https://<target-api> --auth-token <ADMIN_JWT> --ops-auth-header-name <header> --ops-auth-header-value <value>
```
- Avoid: assuming `--auth-token` (or auto-login) alone is sufficient for all production OPS endpoints.
- Evidence:
  - 2026-04-19 report: stage `PASS`, prod Gate2 `FAIL/OPEN`, `/workers/*` + `/alerts` + `/metrics` returned `401`.

### 2026-04-19 - Enforce pnpm lockfile in repo config for frozen-lockfile builds
- Context: Coolify/CI Docker install step uses `pnpm install --frozen-lockfile`.
- Symptom: install can fail unless command is forced with `--config.lockfile=true`.
- Root cause: repository `.npmrc` lacked explicit pnpm `lockfile=true` safeguard in environments with config drift.
- Guardrail: keep `lockfile=true` in repository `.npmrc` so frozen-lockfile behavior is deterministic across local/CI/Coolify.
- Preferred pattern:
```text
.npmrc:
package-lock=false
lockfile=true
```
- Avoid: relying on per-command `--config.lockfile=true` overrides as the only protection in deployment pipelines.
- Evidence:
  - 2026-04-19 operator report: `pnpm install --frozen-lockfile` failed, while `pnpm install --frozen-lockfile --config.lockfile=true` passed.

### 2026-04-19 - External RC result must trigger immediate canonical docs sync
- Context: OPV/RC evidence is sometimes produced by a separate VPS operator/agent run and then pasted back into this thread.
- Symptom: canonical queue/context/docs can keep stale `OPEN/BLOCKED` gate text after final RC pass, causing drift and repeated "what is still blocked?" confusion.
- Root cause: external evidence update arrived after local doc updates, but no immediate mandatory resync step was executed.
- Guardrail: when external run evidence is received, perform a same-turn canonical sync of `PROJECT_STATE`, `TASK_BOARD`, `mvp-next-commits`, `mvp-execution-plan`, and current RC docs (`v1-rc-external-gates-status`, `v1-rc-signoff-record`, checklist if needed) before continuing feature work.
- Preferred pattern:
```text
1) Treat external evidence payload as latest source-of-truth.
2) Update canonical queue/context + RC operation docs in one tiny docs commit.
3) Run guardrails.
4) Continue normal execution queue only after sync commit is merged/pushed.
```
- Avoid: leaving known stale gate state (`G2/G4 OPEN`) in canonical docs after receiving final PASS evidence.
- Evidence:
  - 2026-04-19 handoff where final RC snapshot was `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS` but local canonical docs still reflected an earlier `OPEN/BLOCKED` snapshot until synced.

### 2026-04-19 - API e2e cleanup order must include runtime dedupe/session tables
- Context: running full `pnpm --filter api run test -- --run` after SOPR closure.
- Symptom: suites passing in isolation failed in full run with FK teardown errors (`RuntimeExecutionDedupe_userId_fkey`, `BotRuntimeSession_botId_fkey`).
- Root cause: several e2e `beforeEach` cleanups deleted `user`/`bot` rows before cleaning `runtimeExecutionDedupe` and `botRuntime*` tables.
- Guardrail: in API e2e teardown, always delete `runtimeExecutionDedupe`, `botRuntimeEvent`, `botRuntimeSymbolStat`, and `botRuntimeSession` before `bot.deleteMany()`/`user.deleteMany()`.
- Preferred pattern:
```powershell
await prisma.runtimeExecutionDedupe.deleteMany();
await prisma.botRuntimeEvent.deleteMany();
await prisma.botRuntimeSymbolStat.deleteMany();
await prisma.botRuntimeSession.deleteMany();
await prisma.bot.deleteMany();
await prisma.user.deleteMany();
```
- Avoid: deleting `bot` or `user` first in suites that can inherit runtime artifacts from other files.
- Evidence:
  - 2026-04-19 full API suite failures in `auth.e2e.test.ts` and `profile/basic.e2e.test.ts` before cleanup-order fix.
  - Full rerun PASS after applying the same cleanup guardrail to `auth`, `profile/basic`, `preTrade`, `marketStream.routes`, and `positions-live-status` suites.

### 2026-04-20 - Guardrails enforce per-file test-size budgets
- Context: closing MURC wave with added e2e scenarios in `apps/api/src/modules/bots/bots.e2e.test.ts`.
- Symptom: `pnpm run quality:guardrails` failed with `Source file size budget exceeded` (`bots.e2e.test.ts: 91131 bytes`, budget `88000`).
- Root cause: adding multiple new contract tests to an already large e2e file breached repository per-file size budget.
- Guardrail: when adding new e2e coverage to near-budget files, move new scenarios into a dedicated sibling test file instead of growing existing monolith tests.
- Preferred pattern:
```text
1) Keep legacy large suite stable.
2) Add new scenario family in `*.e2e.test.ts` sibling file with shared helpers.
3) Rerun guardrails before final commit.
```
- Avoid: appending several long scenarios into a file already close to guardrail threshold.
- Evidence:
  - 2026-04-20 MURC closure: moved market-universe parity scenarios from `bots.e2e.test.ts` into `bots.market-universe-contract.e2e.test.ts`; guardrails PASS afterward.

### 2026-04-20 - Web dashboard regressions must use split test files near budget limit
- Context: closing DAWR web regression wave for dashboard wallet/sidebar.
- Symptom: `pnpm run quality:guardrails` failed on web side with `HomeLiveWidgets.test.tsx` over size budget (`99474` > `95000`).
- Root cause: appending one more long integration scenario to an already near-limit dashboard widget test file.
- Guardrail: when `HomeLiveWidgets.test.tsx` (or similar high-traffic UI test files) is close to budget, place new scenario families in dedicated sibling files (for example `HomeLiveWidgets.aggregate-wallet.test.tsx`) instead of extending the monolith.
- Preferred pattern:
```text
1) Keep legacy wide integration suite stable.
2) Add new scenario contract in a focused sibling test file.
3) Run targeted web tests + guardrails before commit.
```
- Avoid: adding large fixture-heavy regressions directly into near-limit dashboard test monoliths.
- Evidence:
  - 2026-04-20 DAWR closure: moved aggregate-success LIVE wallet regression from `HomeLiveWidgets.test.tsx` to `HomeLiveWidgets.aggregate-wallet.test.tsx`; guardrails PASS afterward.

### 2026-04-20 - Canonical planning closure must be mirrored in `mvp-execution-plan`
- Context: checking "what is planned next" after `DASHR` was already closed in queue/context docs.
- Symptom: `mvp-next-commits` and `TASK_BOARD` showed `DASHR` closed, but `mvp-execution-plan` still had `DASHR-01..DASHR-11` unchecked, causing false "pending group" signals.
- Root cause: closure sync missed one canonical planning file update in a previous wave.
- Guardrail: every group closure must include a same-turn parity pass across all four canonical files: `mvp-next-commits`, `mvp-execution-plan`, `TASK_BOARD`, `PROJECT_STATE`.
- Preferred pattern:
```text
After closing a wave:
1) Mark tasks done in queue (`mvp-next-commits`).
2) Mirror checkbox/phase status in `mvp-execution-plan`.
3) Sync `TASK_BOARD` done state.
4) Add `PROJECT_STATE` progress note.
5) Run `pnpm run quality:guardrails`.
```
- Avoid: leaving any canonical planning file with stale unchecked tasks for already-closed waves.
- Evidence:
  - 2026-04-20: `DASHR-01..DASHR-11` remained unchecked only in `mvp-execution-plan.md` until parity-sync fix.

### 2026-04-20 - Web deploy gate requires `next build` even for test-only web changes
- Context: Coolify production deploy for commit `b345a009` failed after docs/planning sync because recent web test files still contained lint-invalid `any` casts.
- Symptom: Docker build failed at `pnpm --filter web build` with `@typescript-eslint/no-explicit-any` in test files.
- Root cause: local closure pack for prior wave did not include rerun at the exact commit being deployed; test-only web changes still participate in Next.js lint/type gate during build.
- Guardrail: if any file under `apps/web/**` changed (including `*.test.tsx`), run local `pnpm --filter web run build` before push/deploy.
- Preferred pattern:
```text
1) Edit web files.
2) Run `pnpm --filter web run build`.
3) Only then commit/push for deploy.
```
- Avoid: assuming test-only edits are excluded from production build lint gates.
- Evidence:
  - 2026-04-20 Coolify log: `HomeLiveWidgets.aggregate-wallet.test.tsx` and `RuntimeSidebarSection.test.tsx` failed build on `no-explicit-any`; local web build PASS after replacing casts.
