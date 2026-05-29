- `LUC-668 [Soar][Source Control Closure]` recovery wake (`issue_reopened_via_comment`) executed on 2026-05-29 and is `done`.
  Wake comment `d0dce46b-66c4-42a6-8f54-93b4b9a91982` was acknowledged first and confirmed this was a missing-final-disposition recovery only.
  Concrete action:
  - revalidated local closure evidence anchor (`git status --short` clean, HEAD `f4898a2d1540dc091c4b1dc370bd56b49f63c85e`),
  - confirmed no additional local dirty-state scope remained in this sidecar lane,
  - preserved parent `LUC-402` blocker chain ownership (`LUC-405` + protected-gate downstream lanes) without mutation.

- `LUC-668 [Soar][Source Control Closure]` continuation wake (`issue_commented`) executed on 2026-05-29 and is `done`.
  Wake comment `ef3ba029-add4-487b-8c0c-739a548733d1` was acknowledged first and constrained the lane to local source-control closure only.
  Concrete action:
  - refreshed dirty-state evidence and reclassified current dirty set,
  - confirmed docs/history/evidence/context-only scope with zero runtime/product code impact,
  - ran targeted redaction scan over dirty files (no secret values found),
  - completed one local source-control closure commit for the full docs/evidence/state dirty set.
  Residual risk unchanged: parent `LUC-402` protected delivery remains dependency-blocked outside this sidecar lane.

- `LUC-668 [Soar][Source Control Closure] Classify and close local dirty state for LUC-402` heartbeat executed on 2026-05-29 and is `done`.
  Inline wake payload was acknowledged first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action:
  - captured local dirty-state evidence (`git status --short`, `git diff --name-only`, `git diff --cached --name-only`),
  - classified current dirty set as non-runtime (`state/control=2`, `task-evidence=1`, `release-artifact-evidence=2`, `runtime/product code=0`),
  - published closure disposition (`commit=not committed`, `push=not needed`, `deploy impact=none`).
  Evidence:
  `history/tasks/luc-668-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-660 [Soar][Source Control Closure]` continuation heartbeat (`issue_commented`) executed on 2026-05-29 and is `done`.
  Wake comment `e32e1895-c2f3-49cd-b823-305b53087e50` was acknowledged first from inline payload (`fallbackFetchNeeded=false`).
  Concrete action:
  - reran local closure checks (`git status --short`, `git diff --name-only`, `git diff --cached --name-only`),
  - reconfirmed dirty scope is docs/state/release/task evidence only (`state/control=2`, `release-evidence=2`, `task-evidence=2`, `runtime/product code=0`),
  - closed docs-only cross-issue dirty set with one operational evidence commit for `LUC-660`, `LUC-657`, `LUC-405`.
  Disposition:
  - commit: `committed`
  - push: `not needed`
  - deploy impact: `none`
  Evidence:
  `history/tasks/luc-660-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-660 [Soar][Source Control Closure] Classify and close local dirty state for LUC-402` heartbeat executed on 2026-05-29 and is `done`.
  Inline wake payload was acknowledged first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action:
  - reran local dirty-state verification (`git status --short`, `git diff --name-only`),
  - classified current dirty set as state/release/task evidence only (`state/control=2`, `release-evidence=2`, `task-evidence=1`, `runtime/product code=0`),
  - published closure disposition (`commit=not committed`, `push=not needed`, `deploy impact=none`).
  Evidence:
  `history/tasks/luc-660-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.
- `LUC-657 [Soar][ARB-006][Security]` source-scoped recovery heartbeat executed on 2026-05-29 and is `done`.
  Inline wake payload was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Continuation action:
  - reconfirmed Security lane remains approval-only (no deploy/runtime mutation),
  - reconfirmed prior approval evidence remains valid without policy delta for read-only protected readiness class,
  - preserved exact unblock trigger for parent `LUC-405`:
    1. Auth credential owner provides fresh valid artifact matching approved class.
    2. Ops Release Lead runs one canonical-host protected recheck for `GET /workers/ready` and publishes redaction-safe proof.
  Evidence:
  `.codex/context/TASK_BOARD.md`,
  `history/tasks/luc-657-arb-006-security-approve-read-only-principal-session-2026-05-29-task.md`.

- `LUC-657 [Soar][ARB-006][Security]` heartbeat executed on 2026-05-29 and is `done`.
  Inline wake payload was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Security-lane output:
  - approved read-only principal/session **class** for protected `GET /workers/ready` with constraints:
    API-authenticated session, `ADMIN` role, ops-network boundary, read-only readiness use only;
  - published explicit rejection criteria (invalid/expired/unaccepted artifact, non-admin/non-ops path, scope widening);
  - confirmed redaction posture (no secret values in files/comments/artifacts/logs).
  Remaining blocker is operational, not policy: a fresh valid approved artifact still must be provided and proven via one canonical-host protected recheck.
  Evidence:
  `history/releases/luc-657-arb-006-security-approval-read-only-principal-session-2026-05-29.md`,
  `history/releases/luc-405-arb-006-window-input-readiness-signoff-2026-05-28.md`,
  `history/tasks/luc-657-arb-006-security-approve-read-only-principal-session-2026-05-29-task.md`.

- `LUC-386 [Soar][ARB-002]` source-scoped recovery heartbeat executed on 2026-05-29 and is `done`.
  Inline wake payload was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Consistency reconciliation in this heartbeat:
  - wake metadata flagged `blocked`,
  - local scope and canonical records confirm prior closure for scaffold-only mobile docs/registry work,
  - reopen remains fail-closed behind `DEC-ARB-002` (Product/CTO-approved mobile runtime activation).
  Final disposition: `done` (no valid unblock action in current gate state).
  Evidence:
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.

- `LUC-644 [Soar][Source Control Closure]` source-scoped recovery heartbeat executed on 2026-05-29 and remains `done`.
  Inline wake payload was consumed first (`fallbackFetchNeeded=false`, comments `0/0`).
  Consistency resolution in this heartbeat:
  - wake metadata flagged the issue as `blocked`,
  - continuation summary and local closure evidence confirm closed state.
  Revalidation:
  - `git status --short` -> clean,
  - `git log --oneline -n 5` -> confirms closure lineage includes `2bc01123`, `7d21146f`, `3a61a0c1`.
  Final disposition: `done` (no reopen trigger detected).
  Evidence:
  `history/tasks/luc-644-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-644 [Soar][Source Control Closure]` continuation heartbeat (`finish_successful_run_handoff`) executed on 2026-05-29 and remains `done`.
  Inline wake payload consumed first (`fallbackFetchNeeded=false`, comments `0/0`).
  Concrete action:
  - revalidated clean local worktree (`git status --short`),
  - confirmed closure lineage in local git history (`git log --oneline -n 3`),
  - verified latest continuation commit scope (`git show --name-only -n 1 7d21146f`) is evidence/state-only.
  Closure disposition unchanged:
  - commit closure already recorded (`2bc01123`, `7d21146f`)
  - push: `not performed`
  - deploy impact: `none`
  Evidence:
  `history/tasks/luc-644-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-644 [Soar][Source Control Closure]` continuation heartbeat (`issue_continuation_needed`) executed on 2026-05-29 and remains `done`.
  Inline wake payload was consumed first (`fallbackFetchNeeded=false`, comments `0/0`).
  Concrete action:
  - revalidated local post-closure source-control state (`git status --short`, `git diff --name-only`) -> clean,
  - reconciled continuation-summary touched-routes drift with current worktree,
  - rechecked closure commit scope via `git show --name-only -n 1 2bc01123` (docs/state/evidence only).
  Scope reconciliation:
  - no local dirty/runtime entries for `server/workers/frontend`, `.github/workflows/ci.yml`,
    `scripts/build-architecture-awareness-index.mjs`, `scripts/check-two-project-readiness.mjs`,
    `scripts/run-live-run-janitor.mjs`.
  Closure disposition remains:
  - commit: `already closed` (`2bc01123`)
  - push: `not performed`
  - deploy impact: `none`
  Evidence:
  `history/tasks/luc-644-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-644 [Soar][Source Control Closure] Classify and close local dirty state for LUC-402` heartbeat executed on 2026-05-29 and is `done`.
  Inline wake payload was acknowledged first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action:
  - reran dirty-state verification (`git status --short`, `git diff --name-only`),
  - confirmed current dirty set is state/control + task-evidence only (`state/control=4`, `task-evidence=2`, `runtime/product code=0`),
  - published source-control closure disposition (`commit=not committed`, `push=not needed`, `deploy impact=none`).
  Evidence:
  `history/tasks/luc-644-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-636 [Soar][Source Control Closure]` continuation heartbeat (`finish_successful_run_handoff`, post-issue-assigned reconciliation) executed on 2026-05-29 and is `done`.
  Inline wake payload was acknowledged first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: reran local dirty-state verification and reconciled continuation-summary touched-routes drift against current local scope.
  Revalidation result:
  - dirty classification unchanged (`state/control=4`, `task-evidence=2`, `runtime/product code=0`),
  - no local dirty/runtime entries for `server/workers/frontend`, `.github/workflows/ci.yml`, `scripts/build-architecture-awareness-index.mjs`, `scripts/check-two-project-readiness.mjs`, `scripts/run-live-run-janitor.mjs`,
  - closure disposition remains `commit=not committed`, `push=not needed`, `deploy impact=none`.
  Evidence:
  `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-636 [Soar][Source Control Closure]` continuation heartbeat (`issue_assigned`, `softwarehouse-local-repair-lane-starter:v1`) executed on 2026-05-29 and is `done`.
  Wake comment `21cae26c-1515-4ea8-85f7-686eb6fffb2b` was acknowledged first from inline payload (`fallbackFetchNeeded=false`).
  Comment impact: keep lane restricted to local source-control closure while `LUC-402` protected delivery remains fail-closed.
  Revalidation result:
  - dirty classification unchanged (`state/control=4`, `task-evidence=2`, `runtime/product code=0`),
  - closure disposition remains `commit=not committed`, `push=not needed`, `deploy impact=none`.
  Evidence:
  `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-636 [Soar][Source Control Closure]` continuation heartbeat (`finish_successful_run_handoff`) executed on 2026-05-29 and remains `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: reran local dirty-state verification and reconciled continuation-summary touched-scope drift for this issue.
  Scope reconciliation:
  - no `server/workers/frontend` change in `LUC-636` lane,
  - no `.github/workflows/ci.yml` change in `LUC-636` lane,
  - lane remains state/evidence-only (`state/control=4`, `task-evidence=2`, `runtime/product code=0`).
  Closure disposition remains `commit=not committed`, `push=not needed`, `deploy impact=none`.
  Evidence:
  `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-636 [Soar][Source Control Closure]` continuation heartbeat (`issue_commented`) executed on 2026-05-29 and is `done`.
  Wake comment `d0f0eb04-06bd-4fd0-bf36-1a8f3fcb7bc4` was acknowledged first from inline payload (`fallbackFetchNeeded=false`).
  Comment impact: keep the lane limited to local dirty-state closure while `LUC-402` remains dependency-blocked on protected gates.
  Revalidation result:
  - dirty classification remains non-runtime (`state/control=4`, `task-evidence=2`, `runtime/product code=0`),
  - closure disposition stays `commit=not committed`, `push=not needed`, `deploy impact=none`.
  Evidence:
  `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-636 [Soar][Source Control Closure] Classify and close local dirty state for LUC-402` heartbeat executed on 2026-05-29 and is `done`.
  Inline wake payload was acknowledged first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action:
  - classified current local dirty state for `LUC-402` sidecar continuity,
  - inspected dirty tracked diffs and confirmed drift is docs/state/task-evidence only (`state/control=4`, `task-evidence=1`, `runtime/product code=0`),
  - published explicit closure disposition (`commit=not committed`, `push=not needed`, `deploy impact=none`).
  Residual risk:
  1. Existing dirty state remains and should be intentionally closed by owner of `LUC-633` artifacts before release mutation work.
  2. Parent protected-delivery flow for `LUC-402` remains blocked on protected-input owners and child execution issuance.
  Evidence:
  `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-633 [Soar][Gate] source_scoped_recovery_action reconciliation` heartbeat executed on 2026-05-29 and is `done`.
  Inline wake payload was acknowledged first (`fallbackFetchNeeded=false`, comments `0/0`).
  Reconciliation result: canonical decision and gate artifacts were already consistent (`DEC-ARB-002`, `ARB-002=done_gated`, explicit reopen trigger), so no additional mutation was required.

- `LUC-633 [Soar][Gate] Decide mobile lane activation trigger for ARB-002 doc registry work` heartbeat executed on 2026-05-29 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  PM coordination published a durable decision gate for ARB-002 reopen routing:
  - added `DEC-ARB-002` in `.agents/state/decision-register.md`,
  - updated `history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md` so `ARB-002` is `done_gated` with `decision_gate`.
  Reopen trigger is explicit and fail-closed; both conditions are required:
  1. Product/CTO-approved mobile issue enters `in_progress` with Frontend/Mobile owner.
  2. The issue includes non-scaffold runtime scope in `apps/mobile` (not docs/index/scaffold-only edits).
  Evidence:
  `history/tasks/luc-633-mobile-lane-activation-trigger-2026-05-29-task.md`.

- `LUC-583 [Soar][Architecture Planning]` continuation heartbeat (`finish_successful_run_handoff`) executed on 2026-05-29 and remains `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: revalidated artifact/state linkage and reconciled continuation-summary touched-scope drift; `LUC-583` scope is planning/state only and does not include `server/workers/frontend` or `.github/workflows/ci.yml`.
  Verification:
  - `git status --short`
  - `rg -n "LUC-583|server/workers/frontend|\\.github/workflows/ci.yml|finish_successful_run_handoff" .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md history/tasks/luc-583-architecture-docs-executable-repair-backlog-2026-05-29-task.md`

- `LUC-583 [Soar][Architecture Planning] Convert architecture docs into executable repair backlog` heartbeat executed on 2026-05-29 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  PM coordination refreshed executable backlog control truth at
  `history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md`:
  - reconciled canonical backlog (`LUC-384`) and prior execution/control maps (`LUC-408`, `LUC-508`) with latest ARB lane outcomes,
  - preserved fail-closed blocker truth: `ARB-001` (`LUC-385`) and `ARB-006` (`LUC-402`) remain the only open blockers,
  - kept specialist execution delegated; this lane is planning/state only.
  Evidence:
  `history/tasks/luc-583-architecture-docs-executable-repair-backlog-2026-05-29-task.md`.

- `LUC-508 [Soar][Architecture Planning]` continuation heartbeat (`finish_successful_run_handoff`) executed on 2026-05-28 and remains `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: revalidated artifact/state linkage and reconciled continuation-summary touched-scope drift; `LUC-508` scope is planning/state only and does not include `server/workers/frontend` or `.github/workflows/ci.yml`.
  Verification:
  - `git status --short`
  - `rg -n "LUC-508|server/workers/frontend|\\.github/workflows/ci.yml|finish_successful_run_handoff" .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md history/tasks/luc-508-architecture-docs-executable-repair-backlog-2026-05-28-task.md`

- `LUC-508 [Soar][Architecture Planning] Convert architecture docs into executable repair backlog` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  PM coordination refreshed executable backlog control truth at
  `history/plans/luc-508-architecture-repair-backlog-control-map-2026-05-28.md`:
  - reconciled canonical backlog (`LUC-384`) and execution baseline (`LUC-408`) with latest ARB lane outcomes,
  - confirmed `ARB-007` closure (`LUC-403`) and preserved fail-closed blockers for `ARB-001` and `ARB-006`,
  - kept specialist implementation delegated; this lane is planning/state only.
  Evidence:
  `history/tasks/luc-508-architecture-docs-executable-repair-backlog-2026-05-28-task.md`.

- `LUC-403 [Soar][ARB-007]` handoff closure heartbeat (`finish_successful_run_handoff`) executed on 2026-05-28 and remains `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: revalidated guard-note coverage and project/task state linkage; no blocker or scope drift detected.

- `LUC-403 [Soar][ARB-007]` continuation reconciliation completed on 2026-05-28: finish/handoff and continuation wakes confirmed no additional implementation required; scope is docs/governance memory only with explicit guard-note coverage and evidence logged in `TASK_BOARD`.

- `LUC-403 [Soar][ARB-007]` completed on 2026-05-28 (`done`): high-traffic documentation entrypoints now carry explicit guard text `history is evidence, not active owner` to reduce owner-state confusion between current docs/state and historical evidence. Updated files: `README.md`, `docs/documentation-overview.md`, `docs/soar-documentation-map.md`, `docs/maps/documentation-maps.md`.

- `LUC-408 [Soar][Architecture Planning]` continuation heartbeat (`finish_successful_run_handoff`) executed on 2026-05-28 and remains `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: artifact-link reconciliation confirmed LUC-408 execution map/task packet remain present and authoritative; no new blocker/comment delta arrived in this wake.
  Result: no status drift; lane stays closed as planning-complete.

- `LUC-408 [Soar][Architecture Planning] Convert architecture docs into executable repair backlog` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  PM coordination published an execution-ready ARB map at
  `history/plans/luc-408-architecture-repair-backlog-execution-map-2026-05-28.md`:
  - every backlog row `ARB-001..ARB-008` is now mapped to a concrete execution lane/status/owner action,
  - blocked rows keep first-class blocker classes (`decision_gate`, `protected_input_gate`),
  - remaining low-coupling execution work was narrowed to `LUC-403` for `ARB-007`; that lane is now completed and recorded above.
  Scope remained planning/state only (no code/runtime/deploy mutation).
  Evidence:
  `history/tasks/luc-408-architecture-docs-executable-repair-backlog-2026-05-28-task.md`.

- `LUC-402 [Soar][ARB-006]` heartbeat executed on 2026-05-28 and is `blocked`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments
  `0/0`, latest comment id `unknown`).
  Ops coordination converted ARB-006 high proof gaps into a dated execution
  register:
  - created `history/plans/luc-402-arb-006-evidence-task-register-2026-05-28.md`,
  - mapped critical high-gap chains from
    `docs/status/function-journey-index.md` into `ARB6-EV-001..008`,
  - each row now has owner, target date, evidence class (`public`/`protected`),
    verification contract, and first-class blocker.
  Backlog sync:
  - `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`
    updated `ARB-006` status to
    `execution_register_ready_blocked_on_inputs`.
  Unblock owner/action:
  1. Delivery/PM creates and assigns child execution issues from
     `ARB6-EV-001..008`.
  2. Security/Test credential owner provides approved protected
     principal/session artifacts.
  3. Ops runs one bounded protected evidence checkpoint per ready child task.
  Evidence:
  `history/plans/luc-402-arb-006-evidence-task-register-2026-05-28.md`.

- `LUC-402 [Soar][ARB-006]` issue_commented heartbeat executed on 2026-05-28 and remains `blocked`.
  Inline comment `f032103a-df8a-4d18-944d-eadd1e635452` (`softwarehouse-local-repair-lane-starter:v1`) was acknowledged first and treated as a local source-control closure lane, not a protected-deliverable unblock.
  Concrete action: published local-lane closure evidence packet with affected capability/chains/files, validation command results, residual risk, and explicit commit/no-commit decision.
  Validation in lane scope:
  - `git status --short`
  - `rg -n "LUC-402|ARB-006|local repair|source-control" .agents/state/active-mission.md .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md`
  Commit/push/deploy outcome: `not committed` / `not needed` / deploy impact `none`.
  Blocker contract unchanged: parent remains fail-closed on `LUC-405` protected window + input-readiness owners/actions before any protected evidence execution or unblock publication.
  Evidence:
  `history/tasks/luc-402-arb-006-local-repair-source-control-lane-2026-05-28-task.md`.

- `LUC-404 [Soar][ARB-008]` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments
  `0/0`, latest comment id `unknown`).
  QA lane added focused regression hardening for exchange capability contracts:
  - asserted fail-closed execution unsupported error details for exact
    `(exchange, marketType, operation)` tuples in
    `exchangeExecutionCapabilityContract.service.test.ts`,
  - added `exchangeCapabilityContract.regression.test.ts` that scans
    `apps/api/src/modules` and fails if CCXT-specific types
    (`CcxtFuturesOrderFill`, `CcxtWalletCashflowHistoryEntry`) or
    `exchange/ccxtFuturesConnector.types` imports appear outside
    `modules/exchange`.
  Verification:
  - focused vitest pack (`exchangeExecutionCapabilityContract`,
    `exchangeAuthenticatedReadContract`, `exchangeCapabilityContract.regression`)
    => `6/6 PASS`.
  - focused downstream regression pack (`orders.exchangeEvents.helpers`,
    `walletCashflowClassifier.service`) => `27/27 PASS`.
  - `pnpm --filter api run typecheck` => `PASS`.
  Contract diff review confirms tuple contract and neutral type boundary remain
  intact (`supportsExchangeExecutionCapability(exchange, marketType, operation)`
  is canonical; `orders/wallets` consume neutral aliases from
  `exchangeData.types`).
  Evidence:
  `history/tasks/luc-404-arb-008-exchange-capability-regression-suite-2026-05-28-task.md`.

- `LUC-388 [Soar][ARB-004]` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments
  `0/0`, latest comment id `unknown`).
  UX/docs lane replaced unresolved template placeholders in
  `docs/ux/ui-scorecard.md` with explicit defer metadata (`owner/date/reason`)
  for `Strongest Areas`, `Weakest Areas`, and `Required Fixes Before Approval`.
  Verification: `rg -n "\\bTBD\\b" docs/ux/ui-scorecard.md` returned no matches.
  Evidence:
  `history/tasks/luc-388-arb-004-ui-scorecard-tbd-metrics-2026-05-28-task.md`.

- `LUC-385-ARB-001-SECURITY-GATE-2026-05-28` is verified locally for the Security lane. The assistant orchestrator now fail-closes `LIVE` mode by default (`live_mode_disabled_fail_closed`) unless `ASSISTANT_HOTPATH_LIVE_ENABLED=true`, and sanitizes user-controlled trace metadata (`requestId`, `botId`, `botMarketGroupId`, `symbol`, `role`) before trace writes. Focused proof: `pnpm --filter api exec vitest run src/modules/engine/assistantOrchestrator.service.test.ts --reporter=basic` (`7/7`). This does not activate deferred ARB-001 hot-path scope; Product/CTO activation decision plus persisted DB trace integration and red-team packet remain open.
- `LUC-389 [Soar][ARB-005]` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  QA verification confirmed mandatory enforcement for `docs:parity:endpoints:api` and `i18n:audit:route-reachable:web` in CI guardrails and reusable-audit checklist validators.
  Focused verification results:
  - validator tests (`checkAuditRemediationPlan`, `checkFullReusableAuditHandoff`, `checkReusableAuditRerunPlaybook`, `checkReusableAuditToolingIndex`) => `39/39 PASS`
  - `pnpm run docs:parity:endpoints:api` => `PASS` (`Endpoints 109`, `documented 109`, `gaps 0`)
  - `pnpm run i18n:audit:route-reachable:web` => `PASS` (`findings=0`)
  Evidence:
  `history/tasks/luc-389-pipeline-hook-checklist-enforcement-2026-05-28-task.md`.
- `LUC-175 [Soar][LUC-103-P6] Source-control queue executor gate` heartbeat
  executed on 2026-05-28 (`issue_commented`) and remains `blocked`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`,
  comments `1/1`, latest comment id
  `7cb0c750-35fb-4f43-bd63-40c3683ee573`).
  Comment was bookkeeping-only: live-run janitor synced issue status to
  `in_progress` for active-run counting; no product/deploy/runtime mutation.
  Concrete action: reconciled janitor status-sync note in canonical gate files
  and revalidated no new `LUC-47` blocker-closure evidence in this wake scope.
  Result: queue executor gate remains fail-closed with capacity governor
  preserved (`one live lane`).
  Unblock owner/action unchanged:
  `LUC-47` (`Ops Release Lead` + host operator) must attach temp-domain
  expected-SHA deploy smoke/readiness + worker readiness evidence + rollback
  note.
  Evidence:
  `history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md`.

- `LUC-175 [Soar][LUC-103-P6] Source-control queue executor gate` heartbeat
  executed on 2026-05-28 (`issue_assignment_recovery`) and remains `blocked`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`,
  comments `0/0`, latest comment id `unknown`).
  Concrete action: fail-closed source-control gate revalidation across canonical
  state files plus blocker-evidence reference sweep for `LUC-47`.
  Result: no new blocker-closure evidence landed in this wake scope and queue
  executor routing remains unchanged with capacity governor preserved (`one live
  lane`).
  Unblock owner/action unchanged:
  `LUC-47` (`Ops Release Lead` + host operator) must attach temp-domain
  expected-SHA deploy smoke/readiness + worker readiness evidence + rollback
  note.
  Evidence:
  `history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md`.

- `LUC-175 [Soar][LUC-103-P6] Source-control queue executor gate` continuation
  heartbeat executed on 2026-05-28 (`issue_continuation_needed`) and remains
  `blocked`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`,
  comments `0/0`, latest comment id `unknown`).
  Concrete action: `LUC-103` controller input checkpoint confirmed canonical
  `manifest v4` + `cookbook v4` are present and still authoritative execution
  inputs, while no new owner-scoped closure/no-commit artifact landed for this
  gate path in the wake scope.
  Capacity governor remains unchanged (`one live lane`), with no queue
  widening, push, or deploy mutation.
  Unblock owner/action unchanged:
  `LUC-47` (`Ops Release Lead` + host operator) must attach temp-domain
  expected-SHA deploy smoke/readiness + worker readiness evidence + rollback
  note.
  Evidence:
  `history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md`.

- `LUC-390 [Soar][Infra Gate] Diagnose production DNS/network failure for LUC-241` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`), then a concrete production DNS/network diagnosis was executed.
  Root-cause was narrowed to hostname targeting drift rather than infrastructure outage:
  `soar-api.luckysparrow.ch` and `soar-web.luckysparrow.ch` returned DNS NXDOMAIN, while canonical production domains (`api.soar.luckysparrow.ch`, `soar.luckysparrow.ch`, `vps.luckysparrow.ch`) resolved to `141.227.149.67`, passed TCP checks, and returned healthy public HTTP responses.
  Canonical deploy smoke confirmed the same: public checks pass; only protected `API /workers/ready` remains `401`.
  Effect: infra-network blocker for `LUC-241` is cleared when canonical targets are used; the remaining blocker is auth/permission for protected worker readiness proof.
  Evidence:
  `history/artifacts/luc-390-dns-network-diagnostic-2026-05-28.json`,
  `history/tasks/luc-390-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-28-task.md`.

- `LUC-386 [Soar][ARB-002] Add docs/modules/mobile-*.md index + module registry rows once mobile lane is active` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: published scaffold-phase mobile module docs/index and integrated mobile rows into canonical module registries and drift tracking.
  Files added: `docs/modules/mobile-module-index.md`, `docs/modules/mobile-bootstrap.md`.
  Files updated: `docs/modules/module-registry.md`, `docs/modules/module-doc-status-index.md`, `docs/modules/system-modules.md`, `docs/modules/README.md`, `docs/analysis/documentation-drift.md`, `.codex/context/TASK_BOARD.md`.
  Verification: `rg -n "mobile-module-index|mobile-bootstrap|Mobile Module Registry|Mobile Surface" docs/modules docs/analysis/documentation-drift.md`.
  Evidence:
  `history/tasks/luc-386-mobile-module-registry-index-2026-05-28-task.md`.

- `LUC-384 [Soar][Architecture Planning] Convert architecture docs into executable repair backlog` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: transformed architecture/documentation findings into a delegation-ready repair backlog (`ARB-001..ARB-008`) with owner lanes, severity, executable fix slices, verification contracts, and dependency classes.
  Scope remained planning/docs-state only (no code/runtime/deploy mutation).
  Evidence:
  `history/tasks/luc-384-architecture-docs-to-repair-backlog-2026-05-28-task.md`.

- `LUC-376 [Soar][Gate Hold] Read-only source-control classification for docs/state/evidence drift` heartbeat executed on 2026-05-27 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: read-only classification of current worktree drift.
  Classification outcome: `state=4`, `docs=3`, `evidence=2`, `runtime/product code=0`.
  Scope remained queue-hygiene/docs-state-evidence only (no runtime/deploy mutation).
  Evidence:
  `history/tasks/luc-376-read-only-source-control-classification-docs-state-evidence-drift-2026-05-27-task.md`.
- `LUC-285 source_scoped_recovery_action heartbeat (2026-05-27)` executed as a
  bounded non-production parity checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`,
  latest comment id `unknown`); no new unblock evidence or scope delta arrived.
  Concrete action: rechecked drift across task board, project state, system
  health, active mission, and V1 gap-register lineage.
  Result: no blocker-routing drift; unblock owner/action remains `LUC-47`
  (`Ops Release Lead` + host operator) with required temp-domain expected-SHA
  smoke/readiness + worker readiness + rollback note.
  Scope remained docs/state/architecture-status only (no code/runtime/deploy
  mutation).
  Evidence:
  `history/tasks/luc-285-safe-lane-non-production-architecture-status-refresh-2026-05-27-source-scoped-recovery-task.md`.

- `LUC-285 issue_continuation_needed heartbeat (2026-05-27)` executed as a
  bounded non-production parity checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`);
  no new unblock evidence or comment-scoped delta arrived.
  Concrete action: rechecked drift across task board, project state, system
  health, active mission, and V1 gap-register lineage.
  Result: no blocker-routing drift; unblock owner/action remains `LUC-47`
  (`Ops Release Lead` + host operator) with required temp-domain expected-SHA
  smoke/readiness + worker readiness + rollback note.
  Scope remained docs/state/architecture-status only (no code/runtime/deploy
  mutation).
  Evidence:
  `history/tasks/luc-285-safe-lane-non-production-architecture-status-refresh-2026-05-27-continuation-task.md`.

- `LUC-285 [Soar][Safe Lane] Non-production architecture/status refresh while
  gate is blocked` heartbeat executed on 2026-05-27 with concrete
  docs-memory/state synchronization and remains `blocked`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`,
  comments `0/0`, latest comment id `unknown`); no new unblock evidence or
  comment-scoped delta arrived.
  Non-production parity refresh completed:
  V1 gap register lineage includes `LUC-285`, and board/state routing is
  synchronized with unchanged first-class blocker truth.
  Scope remained docs/state/architecture-status only (no code/runtime/deploy
  mutation).
  Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness +
  worker readiness evidence + rollback note.
  Evidence:
  `history/tasks/luc-285-safe-lane-non-production-architecture-status-refresh-2026-05-27-task.md`.

- `LUC-263 process_lost_retry heartbeat (2026-05-27)` executed a concrete PM
  no-stall reconciliation and remains `blocked`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`,
  comments `0/0`, latest comment id `unknown`); no new unblock artifact
  arrived in this heartbeat.
  Scope remained coordination-only and fail-closed with no code/runtime/deploy
  mutation.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness +
  worker readiness evidence + rollback note.
  Evidence:
  `history/tasks/luc-263-no-stall-queue-expeditor-2026-05-27-task.md`.

- `LUC-251 issue_reopened_via_comment heartbeat (2026-05-27)` consumed one
  pending comment (`1/1`) and reconciled board routing as duplicate closure.
  Comment `086a98cf-cf89-4142-8cc4-eeb0110c3240` explicitly cancels `LUC-251`
  as a duplicate sibling of canonical PM no-stall lane `LUC-244`; this lane is
  now execution-closed and should not be resumed.
  Scope remained coordination-only (no code/runtime/deploy mutation).
  Disposition for this heartbeat: `done` (duplicate-cancelled, routed to `LUC-244`).
  Evidence:
  `history/tasks/luc-251-no-stall-queue-expeditor-2026-05-27-task.md`.
- `LUC-251 assigned heartbeat (2026-05-27)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`);
  no new blocker-closure evidence arrived in this heartbeat.
  Scope remained coordination-only and fail-closed (no code/runtime/deploy
  mutation).
  Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-251-no-stall-queue-expeditor-2026-05-27-task.md`.
- `LUC-251 finish_successful_run_handoff heartbeat (2026-05-27)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Inline wake carried no unblock delta (`fallbackFetchNeeded=false`,
  comments `0/0`), so blocker contract is unchanged.
  Unblock owner/action remains `LUC-47` (`Ops Release Lead` + host operator):
  temp-domain expected-SHA smoke/readiness + worker readiness + rollback note.
  Evidence:
  `history/tasks/luc-251-no-stall-queue-expeditor-2026-05-27-task.md`.

- `LUC-246 [Soar] Gap register and repair lane refresh` completed as a
  delivery-coordination checkpoint on 2026-05-27.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments
  `0/0`); no new comment-scope unblock evidence arrived.
  The canonical V1 gap register was refreshed with unchanged blocker truth:
  `GAP-L45-002` remains blocked under `LUC-47` with protected worker-readiness
  auth-path evidence required for closure, and `GAP-L45-005` evidence lineage
  now includes `LUC-246` for docs/state parity continuity.
  Scope remained source-of-truth synchronization only (no code/runtime/deploy
  mutation). Evidence:
  `history/tasks/luc-246-gap-register-and-repair-lane-refresh-2026-05-27-task.md`.
  Continuation `issue_continuation_needed` (`0/0` comments) found no
  blocker-routing drift and no scope delta; disposition remains `done`.
  Continuation `finish_successful_run_handoff` (`0/0` comments) found no
  blocker-routing drift and no scope delta; disposition remains `done`.
  Continuation `source_scoped_recovery_action` (`0/0` comments) found no
  blocker-routing drift, no unblock evidence delta, and no scope delta;
  disposition remains `done`.
- `LUC-241 [Soar][LUC-99-B] Unblock workers/ready smoke principal permissions`
  heartbeat executed on 2026-05-27 with concrete read-only verification and
  remains `blocked`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments
  `0/0`).
  Production full smoke on expected SHA
  `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` passed public checks
  (`/health`, `/ready`, web `/`, build-info SHA) and failed only on protected
  `API /workers/ready -> 401`.
  Auth-path probe narrowed the blocker: configured smoke login principal
  (`SMOKE_AUTH_EMAIL`/`SMOKE_AUTH_PASSWORD`) returned `400` on `POST /auth/login`
  and produced no session token in this runner.
  Scope remained verification-only with no deploy/runtime mutation.
  Unblock owner/action: Soar API auth credential owner + Security/Test
  permission owner must provide approved read-only principal/session path that
  both authenticates and is authorized for `GET /workers/ready`, then Ops
  reruns one full smoke with worker probe and publishes parent closure packet.
  Evidence:
  `history/tasks/luc-241-unblock-workers-ready-smoke-principal-permissions-2026-05-27-task.md`.
- `LUC-241 finish_successful_run_handoff continuation (2026-05-27)` executed a
  concrete protected-proof recheck and remains `blocked`.
  New artifact signal in this run: `SMOKE_AUTH_TOKEN` is present, but full
  production smoke still fails only on `API /workers/ready -> 401` while public
  checks stay green.
  Direct token probe shows the provided principal is not valid for current API
  session/auth validation:
  `GET /auth/me -> 401 (Session expired)`,
  `GET /workers/health -> 401 (Invalid token)`,
  `GET /workers/ready -> 401 (Invalid token)`.
  Unblock owner/action unchanged: Soar API auth credential owner + Security/Test
  permission owner must provide/refresh an approved read-only principal/session
  path that both authenticates and is authorized for protected worker readiness
  proof, then Ops reruns one worker-included smoke.
- `LUC-241 issue_assigned continuation (2026-05-27)` consumed pending comment
  `f38ed02c-300f-4d13-8012-46528c87634e` and executed the requested narrow
  read-only verification lane.
  Production full smoke on expected SHA
  `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` again passed public checks and
  failed protected `API /workers/ready -> 401`.
  Direct token probe remained unauthorized:
  `GET /auth/me -> 401`,
  `GET /workers/health -> 401`,
  `GET /workers/ready -> 401`.
  Disposition remains `blocked`; unblock owner/action unchanged:
  Soar API auth credential owner + Security/Test permission owner must
  refresh/rotate an approved read-only principal/session path that both
  authenticates and is authorized for `GET /workers/ready`, then Ops reruns one
  worker-included smoke and publishes parent closure packet only if proof
  passes.
- `LUC-241 issue_continuation_needed continuation (2026-05-27)` executed one
  additional read-only smoke/auth recheck and remains `blocked`.
  Full smoke stayed fail-closed on the same protected endpoint:
  public checks `PASS`, `API /workers/ready -> 401`.
  Auth artifact detail was tightened: `SMOKE_AUTH_TOKEN` is present but is not
  JWT-shaped (`length=36`, `parts=1`), and protected probes still fail
  (`GET /auth/me -> 401`, `GET /workers/ready -> 401`).
  Unblock owner/action unchanged: Soar API auth credential owner +
  Security/Test permission owner must provide/rotate a valid approved read-only
  principal/session artifact that satisfies protected API auth contract, then
  Ops reruns one worker-included smoke.
- `LUC-241 issue_reopened_via_comment continuation (2026-05-27)` consumed board
  comment `5e3f1b49-782a-438b-bc58-ac3dc6f9fc15` and performed explicit
  fail-closed status synchronization only.
  Per comment instruction, this lane remains `blocked` and no further reruns
  are executed until a new valid approved read-only principal/session path is
  provided by credential owner.
  Resume condition is unchanged: new credential artifact first, then one
  worker-included smoke recheck.
- `LUC-241 issue_continuation_needed continuation (2026-05-27)` executed a
  status-hold checkpoint with no new comment delta and no new unblock artifact
  class.
  Concrete action was limited to credential-artifact presence verification only;
  no smoke/probe reruns were executed per active fail-closed instruction.
  Lane remains `blocked` with unchanged resume gate: valid approved read-only
  principal/session artifact first, then one worker-included smoke recheck.
- `LUC-235 assigned heartbeat (2026-05-27)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`);
  no new blocker-closure evidence arrived in this heartbeat.
  Scope remained coordination-only and fail-closed (no code/runtime/deploy
  mutation).
  Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-235-no-stall-queue-expeditor-2026-05-27-task.md`.
- `LUC-233 [Soar] Gap register and repair lane refresh` completed as a
  delivery-coordination checkpoint on 2026-05-27.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments
  `0/0`); no new comment-scope unblock evidence arrived.
  The canonical V1 gap register was refreshed with unchanged blocker truth:
  `GAP-L45-002` remains blocked under `LUC-47` with protected worker-readiness
  auth-path evidence required for closure, and `GAP-L45-005` evidence lineage
  now includes `LUC-233` for docs/state parity continuity.
  Scope remained source-of-truth synchronization only (no code/runtime/deploy
  mutation). Evidence:
  `history/tasks/luc-233-gap-register-and-repair-lane-refresh-2026-05-27-task.md`.
  Continuation `finish_successful_run_handoff` (`0/0` comments) found no
  blocker-routing drift; disposition remains `done`.
- `LUC-230 assigned heartbeat (2026-05-27)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`);
  no new blocker-closure evidence arrived in this heartbeat.
  Scope remained coordination-only and fail-closed (no code/runtime/deploy
  mutation).
  Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-230-no-stall-queue-expeditor-2026-05-27-task.md`.
- `LUC-230 issue_continuation_needed heartbeat (2026-05-27)` was reconciled
  from inline wake payload first (`fallbackFetchNeeded=false`, comments `0/0`)
  and remains `blocked`.
  No new blocker-closure evidence arrived; scope stayed coordination-only and
  fail-closed (no code/runtime/deploy mutation).
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-230-no-stall-queue-expeditor-2026-05-27-task.md`.
- `LUC-227 assigned heartbeat (2026-05-27)` completed a bounded docs-memory
  autonomous idle and map-drift sweep with disposition `done`.
  Inline wake scope was consumed first; no comment delta was present.
  Concrete rechecks were executed: idle-lane fail-closed clauses in active
  state docs, current `apps/web/src/app/**/page.tsx` route inventory, and
  canonical parity against
  `docs/architecture/reference/dashboard-route-map.md`.
  Result: no idle-lane contract drift and no route-family drift (`37`
  current `page.tsx` routes across `public/dashboard/admin/offline` families).
  Scope remained docs/state parity only (no code/runtime/deploy mutation).
  Evidence:
  `history/tasks/luc-227-autonomous-idle-and-map-drift-sweep-2026-05-27-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled from inline
  payload first (`fallbackFetchNeeded=false`, comments `0/0`); no new drift or
  blocker delta arrived and disposition remains `done`.
- `LUC-228 assigned heartbeat (2026-05-27)` executed a concrete V1
  audit-to-completion controller checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`);
  no new blocker-closure evidence arrived in this heartbeat.
  Scope remained coordination-only and fail-closed (no code/runtime/deploy
  mutation).
  Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-228-v1-audit-to-completion-controller-2026-05-27-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled from inline
  payload first (`fallbackFetchNeeded=false`, comments `0/0`); no new
  blocker-closure evidence arrived and disposition remains `blocked` with
  unchanged unblock owner/action.
- `LUC-221 assigned heartbeat (2026-05-27)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`);
  no new blocker-closure evidence arrived in this heartbeat.
  Scope remained coordination-only and fail-closed (no code/runtime/deploy
  mutation).
  Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-221-no-stall-queue-expeditor-2026-05-27-task.md`.
- `LUC-216 [Soar] Gap register and repair lane refresh` completed as a
  delivery-coordination checkpoint. The canonical V1 gap register was
  synchronized with current blocker truth: `GAP-L45-002` remains blocked under
  `LUC-47` and now explicitly requires protected worker-readiness auth-path
  evidence in closure routing; `GAP-L45-005` evidence now includes `LUC-216`
  for docs/state parity tracking. This was a source-of-truth refresh only
  (no code/deploy/runtime mutation). Evidence:
  `history/tasks/luc-216-gap-register-and-repair-lane-refresh-2026-05-26-task.md`.
  Finish-handoff continuation (`0/0` pending comments) confirmed no drift from
  refreshed blocker routing; disposition remains `done`.
- `COOLIFY-AUTO-DEPLOY-WORKER-RECOVERY-2026-05-26` completed as a bounded
  Ops/Release repair for the operator-reported Coolify push-deploy drift.
  The Soar project was found under the `LuckySparrow` team. `Auto Deploy` was
  disabled on all six Soar Applications and has now been enabled and saved for
  `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, and `workers-market-stream`. `workers-market-stream`
  was recovered with successful deployment `gqpmafky0oe2jr3rszkov2is` on
  production SHA `3fedb7a9170097b40accb6ccea1915064f383f11`; all Soar
  resources now read back as running. Public no-worker production smoke passed
  on the same SHA. This restores deploy automation and worker liveness, but
  does not replace protected worker-token readiness, authenticated app
  journeys, release signoff, SLO/RC, restore/rollback, or LIVE mutation
  approval gates. Local `HEAD` remains `38` commits ahead of `origin/main`, so
  Coolify cannot deploy those local commits until a coherent push occurs.
  Evidence:
  `history/tasks/coolify-auto-deploy-and-worker-recovery-2026-05-26-task.md`,
  `history/evidence/coolify-auto-deploy-and-worker-recovery-2026-05-26.md`.
  Push-test closure: `6f9ea8d21b1dc6aadf8e34a13be33931b9859f7e` proved
  GitHub-to-Coolify deployment rows appeared for all six Applications, then the
  fanout exposed host disk exhaustion, Coolify Redis `MISCONF`, production
  Postgres recovery pressure, and Coolify SSH directory permission failure.
  Host disk was reclaimed without deleting data volumes, Coolify/Postgres/Redis
  recovered, Docker image hardening was pushed in
  `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`, and all six Soar Applications
  now run that SHA. Final public no-worker smoke passed on `71b8d503...`; disk
  readback was `18G` available / `76%` used. V1 remains not fully release-ready
  because protected worker-token/authenticated/SLO/restore-rollback gates are
  still separate.
- `LUC-179 finish_successful_run_handoff heartbeat (2026-05-26)` was
  reconciled as an ops verification-only recheck and remains `blocked`.
  No pending human unblock input was present (`0/0`).
  Fresh checks in this heartbeat confirm unchanged state:
  production expected-SHA smoke `PASS`, temp-domain smoke `FAIL` (`fetch
  failed`), SHA-bound operator packet check `PASS`.
  No production mutation was executed.
  Unblock owner/action remains unchanged: Coolify operator + release
  controller must accept the `NO_TEMP_STACK` packet or restore temp-stack
  acceptance evidence path.
- `LUC-179 assigned heartbeat (2026-05-26)` executed the required ops closure
  move for `LUC-178` and remains `blocked`.
  Concrete action was executed in the same heartbeat: production expected-SHA
  smoke rerun is `PASS`, temp-domain smoke rerun is `FAIL` (`fetch failed`),
  protected-input readiness is `BLOCKED` (`0` matching names), and read-only
  Coolify snapshot reports `TEMP_MATCHES=0` with no direct
  `workers-market-stream` app match in current applications readback.
  A durable no-temp-stack decision packet was published:
  `history/evidence/luc-178-no-temp-stack-decision-packet-2026-05-26.md`.
  Unblock owner/action: Coolify operator + release controller must either
  accept this no-temp-stack packet for downstream parent closure routing or
  restore temp-stack path and attach full temp acceptance evidence.
  Evidence:
  `history/tasks/luc-179-coolify-worker-recovery-or-no-temp-stack-decision-2026-05-26-task.md`,
  `history/evidence/luc-179-coolify-worker-recovery-or-no-temp-stack-decision-2026-05-26.md`.
- `LUC-175 finish_successful_run_handoff heartbeat (2026-05-26)` was
  reconciled as a status-only source-control queue-gate checkpoint and remains
  `blocked`.
  Wake payload introduced no pending human unblock input (`0/0`) and no new
  blocker-closure evidence.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this continuation heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md`.
- `LUC-175 assigned heartbeat (2026-05-26)` executed a source-control queue
  executor gate checkpoint and remains `blocked`.
  Scope stayed delivery-lead coordination only with fail-closed status posture.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md`.
- `LUC-174 finish_successful_run_handoff heartbeat (2026-05-26)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Wake payload introduced no pending human unblock input (`0/0`) and no new
  blocker-closure evidence.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this continuation heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-174-no-stall-queue-expeditor-2026-05-26-task.md`.
- `LUC-174 source_scoped_recovery_action heartbeat (2026-05-26)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Inline wake payload introduced no pending human unblock input (`0/0`) and no
  new blocker-closure evidence.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this continuation heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-174-no-stall-queue-expeditor-2026-05-26-task.md`.
- `LUC-174 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-174-no-stall-queue-expeditor-2026-05-26-task.md`.
- `LUC-219 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
- Scope remained coordination-only and fail-closed against parent `LUC-45`;
  no code/runtime/deploy mutation was performed.
- Unblock owner/action unchanged:
  `LUC-47` (`Ops Release Lead` + host operator) must attach temp-domain
  expected-SHA deploy smoke/readiness and worker readiness evidence with
  rollback note.
- Evidence:
  `history/tasks/luc-219-no-stall-queue-expeditor-2026-05-26-task.md`.
- `LUC-219 continuation heartbeat (2026-05-26)` reconciled from inline wake
  payload first (`issue_continuation_needed`, `fallbackFetchNeeded=false`,
  pending comments `0/0`).
- No new blocker-closure evidence arrived; disposition remains fail-closed
  `blocked` with unchanged unblock owner/action on `LUC-47`.
- `LUC-219 source_scoped_recovery_action heartbeat (2026-05-26)` was
  reconciled from inline wake payload first (`fallbackFetchNeeded=false`,
  pending comments `0/0`) and remains `blocked`.
- Latest status was acknowledged before generic exploration; no new unblock
  artifact arrived.
- Scope remained PM coordination-only and fail-closed (no code/runtime/deploy
  mutation).
- Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA smoke/readiness packet,
  worker readiness evidence, and rollback note.
- `LUC-171 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-169` provenance packet closure.
  Scope was strict to `2` artifacts:
  `history/tasks/luc-169-luc-166-provenance-packet-closure-2026-05-26-task.md`
  and
  `history/evidence/luc-169-luc-166-provenance-packet-closure-2026-05-26.md`.
  Verification results: presence PASS (`2/2`), SHA256 provenance recorded for
  both files, and scoped credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-171-luc-169-provenance-packet-closure-2026-05-26-task.md`,
  `history/evidence/luc-171-luc-169-provenance-packet-closure-2026-05-26.md`.
- `LUC-170 finish_successful_run_handoff heartbeat (2026-05-26)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Wake payload introduced no pending human unblock input (`0/0`) and no new
  blocker-closure evidence.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this continuation heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-170-no-stall-queue-expeditor-2026-05-26-task.md`.
- `LUC-170 source_scoped_recovery_action heartbeat (2026-05-26)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Inline wake payload introduced no pending human unblock input (`0/0`) and no
  new blocker-closure evidence.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this continuation heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-170-no-stall-queue-expeditor-2026-05-26-task.md`.
- `LUC-170 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-170-no-stall-queue-expeditor-2026-05-26-task.md`.
- `LUC-169 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-166` provenance packet closure.
  Scope was strict to `2` artifacts:
  `history/tasks/luc-166-luc-164-provenance-packet-closure-2026-05-26-task.md`
  and
  `history/evidence/luc-166-luc-164-provenance-packet-closure-2026-05-26.md`.
  Verification results: presence PASS (`2/2`), SHA256 provenance recorded for
  both files, and scoped credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-169-luc-166-provenance-packet-closure-2026-05-26-task.md`,
  `history/evidence/luc-169-luc-166-provenance-packet-closure-2026-05-26.md`.
- `LUC-166 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-164` provenance packet closure.
  Scope was strict to `2` artifacts:
  `history/tasks/luc-164-luc-160-provenance-packet-closure-2026-05-26-task.md`
  and
  `history/evidence/luc-164-luc-160-provenance-packet-closure-2026-05-26.md`.
  Verification results: presence PASS (`2/2`), SHA256 provenance recorded for
  both files, and scoped credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-166-luc-164-provenance-packet-closure-2026-05-26-task.md`,
  `history/evidence/luc-166-luc-164-provenance-packet-closure-2026-05-26.md`.

- `LUC-167 finish_successful_run_handoff heartbeat (2026-05-26)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Wake payload introduced no pending human unblock input (`0/0`) and no new
  blocker-closure evidence.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this continuation heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-167-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-167 source_scoped_recovery_action heartbeat (2026-05-26)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Inline wake payload introduced no pending human unblock input (`0/0`) and no
  new blocker-closure evidence.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this continuation heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-167-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-165 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-165-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no
  pending human unblock input (`0/0`) and no new blocker-closure evidence;
  disposition remains unchanged.
  Continuation wake `process_lost_retry` was reconciled with no pending human
  unblock input (`0/0`) and no new blocker-closure evidence; disposition
  remains unchanged.
  Continuation wake `source_scoped_recovery_action` was reconciled with no
  pending human unblock input (`0/0`) and no new blocker-closure evidence;
  disposition remains unchanged.

- `LUC-164 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-160` provenance packet closure.
  Scope was strict to `2` artifacts:
  `history/tasks/luc-160-luc-158-provenance-packet-closure-2026-05-26-task.md`
  and
  `history/evidence/luc-160-luc-158-provenance-packet-closure-2026-05-26.md`.
  Verification results: presence PASS (`2/2`), SHA256 provenance recorded for
  both files, and scoped credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-164-luc-160-provenance-packet-closure-2026-05-26-task.md`,
  `history/evidence/luc-164-luc-160-provenance-packet-closure-2026-05-26.md`.

- `LUC-162 assigned heartbeat (2026-05-26)` completed as `done` for blocked
  lane normalization across active PM/Delivery controller state.
  Scope remained coordination/architecture-governance only with no
  deploy/runtime/product mutation.
  The canonical fail-closed model is now explicit in project state:
  parent bridge `LUC-45` is `blocked` on one first-class blocker (`LUC-47`),
  with named unblock owner/action (`Ops Release Lead` + host operator ->
  temp-domain expected-SHA deploy smoke/readiness + worker readiness +
  rollback note).
  Idle-lane rule is now explicit: keep lanes `blocked`/`todo` when idle and use
  `in_progress` only during live execution.
  Evidence:
  `history/tasks/luc-162-normalize-blocked-lanes-first-class-blockers-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no
  pending human input (`0/0`) and no new blocker-closure evidence; disposition
  remains `done`.
  Continuation wake `source_scoped_recovery_action` was reconciled from inline
  wake payload first (no fallback thread fetch) with no pending comments
  (`0/0`), no new blocker-closure evidence, and no blocker-contract drift;
  disposition remains `done`.
  Continuation wake `issue_reopened_via_comment` was reconciled from board
  comment `b6bfe304-ab6d-4beb-ae6e-a6f1898e0efd` (janitor moved lane to `todo`
  due to reported missing blocked dependency).
  Re-check confirmed canonical dependency contract is explicit in source-of-
  truth (`LUC-45` blocked by `LUC-47`) with unchanged unblock owner/action, so
  Continuation wake `finish_successful_run_handoff` reconciled after the
  reopen-cycle closure with no pending comments (`0/0`), no new
  blocker-closure evidence, and no blocker-contract drift; disposition
  remains `done`.
  Continuation wake `source_scoped_recovery_action` reconciled as status-only
  with no pending comments (`0/0`), no new blocker-closure evidence, and no
  blocker-contract drift; disposition remains `done`.
- `LUC-160 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-158` provenance packet closure.
  Scope was strict to `2` artifacts:
  `history/tasks/luc-158-luc-153-coolify-health-evidence-closure-2026-05-26-task.md`
  and
  `history/evidence/luc-158-luc-153-coolify-health-evidence-closure-2026-05-26.md`.
  Verification results: presence PASS (`2/2`), SHA256 provenance recorded for
  both files, and scoped credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-160-luc-158-provenance-packet-closure-2026-05-26-task.md`,
  `history/evidence/luc-160-luc-158-provenance-packet-closure-2026-05-26.md`.

- `LUC-159 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-159-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-158 assigned heartbeat (2026-05-26)` completed as `done` for
  LUC-153 Coolify health evidence closure.
  Scope was strict to `2` LUC-153 artifacts:
  `history/tasks/luc-153-coolify-production-deploy-health-sweep-2026-05-26-task.md`
  and
  `history/evidence/luc-153-coolify-production-health-sweep-2026-05-26.md`.
  Verification results: presence PASS (`2/2`), SHA256 provenance recorded for
  both files, and scoped credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-158-luc-153-coolify-health-evidence-closure-2026-05-26-task.md`,
  `history/evidence/luc-158-luc-153-coolify-health-evidence-closure-2026-05-26.md`.

- `LUC-156 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-156-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no
  pending human unblock input (`0/0`) and no new blocker-closure evidence;
  disposition remains unchanged.

- `LUC-152 assigned heartbeat (2026-05-26)` completed as `done` for latest
  closure provenance packets (`LUC-103-P5S`).
  Scope was strict to three latest closure task packets:
  `history/tasks/luc-151-v1-audit-to-completion-controller-2026-05-26-task.md`,
  `history/tasks/luc-148-no-stall-queue-expeditor-2026-05-26-task.md`,
  and
  `history/tasks/luc-147-history-plans-closure-bundle-2026-05-26-task.md`.
  Verification results: presence PASS (`3/3`), SHA256 provenance recorded for
  all scoped files, and credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-152-latest-closure-provenance-packets-2026-05-26-task.md`,
  `history/evidence/luc-152-latest-closure-provenance-packets-2026-05-26.md`.

- `LUC-151 assigned heartbeat (2026-05-26)` executed a concrete controller
  reconciliation for V1 audit-to-completion scope and remains `blocked`.
  Scope stayed coordination-only and fail-closed against the parent release
  controller. No commit/push/deploy/runtime mutation was performed in this
  lane. Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` +
  host operator) must publish expected-SHA temp-domain deploy smoke/readiness
  with worker readiness evidence and rollback note.
  Evidence:
  `history/tasks/luc-151-v1-audit-to-completion-controller-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no
  pending human unblock input (`0/0`) and no new blocker-closure evidence;
  disposition remains unchanged.
  Continuation wake `source_scoped_recovery_action` was reconciled as
  status-only with no pending human unblock input (`0/0`) and no new
  blocker-closure evidence; capacity governor remains preserved and
  disposition stays unchanged.

- `LUC-148 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-148-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no
  pending human unblock input (`0/0`) and no new blocker-closure evidence;
  disposition remains unchanged.
  Continuation wake `source_scoped_recovery_action` was reconciled as
  status-only with no pending human unblock input (`0/0`) and no new
  blocker-closure evidence; capacity governor remains preserved and
  disposition stays unchanged.

- `LUC-146 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-146-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no
  pending human unblock input (`0/0`) and no new blocker-closure evidence;
  disposition remains unchanged.

- `LUC-145 assigned heartbeat (2026-05-26)` completed as `done` for recent
  closure provenance packets (`LUC-103-P5R`).
  Scope was strict to three recent closure task packets:
  `history/tasks/luc-141-no-stall-queue-expeditor-2026-05-26-task.md`,
  `history/tasks/luc-142-history-evidence-closure-bundle-2026-05-26-task.md`,
  and
  `history/tasks/luc-143-no-stall-queue-expeditor-2026-05-26-task.md`.
  Verification results: presence PASS (`3/3`), SHA256 provenance recorded for
  all scoped files, and credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-145-recent-closure-provenance-packets-2026-05-26-task.md`,
  `history/evidence/luc-145-recent-closure-provenance-packets-2026-05-26.md`.

- `LUC-143 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-143-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no new
  unblock input and no new blocker-closure evidence; disposition remains
  unchanged.

- `LUC-142 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-103-NO-LUC-B` history evidence closure bundle.
  Scope was strict to `NO_LUC.history-evidence` artifacts:
  `history/evidence/prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26.md`,
  `history/evidence/v1-protected-input-readiness-3fedb7a9-2026-05-26.md`,
  and
  `history/evidence/v1-protected-input-readiness-4c16305c-2026-05-26.md`.
  Verification results: presence PASS (`3/3`), markdown H1 sanity PASS
  (`3/3`), SHA256 provenance recorded for all files, and scoped
  credential-value pattern scan PASS (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane edits were performed.
  Evidence:
  `history/tasks/luc-142-history-evidence-closure-bundle-2026-05-26-task.md`,
  `history/evidence/luc-142-history-evidence-closure-bundle-2026-05-26.md`.

- `LUC-141 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-141-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no new
  unblock input and no new blocker-closure evidence; disposition remains
  unchanged.

- `LUC-141 source_scoped_recovery_action heartbeat (2026-05-26)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Wake payload introduced no pending human unblock input (`0/0`) and no new
  blocker-closure evidence.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this recovery heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-141-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-140 assigned heartbeat (2026-05-26)` completed as `done` for
  closure-lane provenance packets (`LUC-103-P5Q`).
  Scope was strict to five closure-lane evidence packets:
  `history/evidence/luc-130-luc-88-productivity-review-evidence-closure-2026-05-26.md`,
  `history/evidence/luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26.md`,
  `history/evidence/luc-132-luc-19-runtime-readiness-task-closure-2026-05-26.md`,
  `history/evidence/luc-135-source-control-closure-artifacts-lane-2026-05-26.md`,
  and
  `history/evidence/luc-137-docs-operations-closure-bundle-2026-05-26.md`.
  Verification results: presence PASS (`5/5`), SHA256 provenance recorded for
  all scoped files, and credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane implementation edits were
  performed.
  Evidence:
  `history/tasks/luc-140-closure-lane-provenance-packets-2026-05-26-task.md`,
  `history/evidence/luc-140-closure-lane-provenance-packets-2026-05-26.md`.

- `LUC-138 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-138-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no new
  unblock input and no new blocker-closure evidence; disposition remains
  unchanged.

- `LUC-137 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-103-NO-LUC-A` docs operations closure bundle.
  Scope was strict to `NO_LUC.docs-operations` artifacts:
  `docs/operations/_artifacts-prod-ui-module-clickthrough-2026-05-26.json`,
  `docs/operations/prod-ui-module-clickthrough-2026-05-26.md`,
  `docs/operations/api-endpoint-docs-parity-2026-05-26/api-endpoint-docs-parity-2026-05-26.json`,
  and
  `docs/operations/api-endpoint-docs-parity-2026-05-26/api-endpoint-docs-parity-2026-05-26.md`.
  Verification results: presence PASS (`4/4`), JSON parse sanity PASS (`2/2`),
  markdown H1 sanity PASS (`2/2`), SHA256 provenance recorded for all files,
  and scoped credential-value pattern scan PASS (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane edits were performed.
  Evidence:
  `history/tasks/luc-137-docs-operations-closure-bundle-2026-05-26-task.md`,
  `history/evidence/luc-137-docs-operations-closure-bundle-2026-05-26.md`.

- `LUC-136 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-136-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no new
  unblock input and no new blocker-closure evidence; disposition remains
  unchanged.

- `LUC-136 source_scoped_recovery_action heartbeat (2026-05-26)` was reconciled
  as a status-only PM no-stall checkpoint and remains `blocked`.
  Wake payload introduced no pending human comment (`0/0`) and no new unblock
  evidence packet.
  Capacity governor remained preserved: no wake/reassign/reopen/new lane action
  was executed in this recovery heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-136-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-135 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-103-P5P` (source-control closure artifacts lane).
  Scope was strict to the `LUC-103` closure artifact bundle:
  `history/artifacts/luc-103-no-luc-path-owner-split-2026-05-26.md`,
  `history/artifacts/luc-103-p5-owner-manifest-2026-05-26.json`,
  `history/artifacts/luc-103-priority-closure-pack-2026-05-26.md`,
  `history/artifacts/luc-103-remaining-closure-queue-2026-05-26.json`,
  and
  `history/tasks/luc-103-source-control-closure-2026-05-26-task.md`.
  Verification results: presence PASS (`5/5`), markdown H1 sanity PASS
  (`3/3`), JSON parse sanity PASS (`2/2`), SHA256 provenance recorded for all
  files, and scoped credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane edits were performed.
  Evidence:
  `history/tasks/luc-135-source-control-closure-artifacts-lane-2026-05-26-task.md`,
  `history/evidence/luc-135-source-control-closure-artifacts-lane-2026-05-26.md`.

- `LUC-133 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-133-no-stall-queue-expeditor-2026-05-26-task.md`.
  Continuation wake `finish_successful_run_handoff` was reconciled with no new
  unblock input and no new blocker-closure evidence; disposition remains
  unchanged.

- `LUC-132 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-103-P5O` (`LUC-19` runtime-readiness task closure).
  Scope was strict to existing `LUC-19` runtime-readiness task artifacts:
  `history/tasks/luc-19-runtime-known-state-2026-05-25-task.md`,
  `history/tasks/luc-19-runtime-readiness-refresh-2026-05-26-task.md`,
  `history/tasks/luc-19-worker-proof-auth-gate-2026-05-26-task.md`,
  and
  `history/tasks/luc-19-protected-input-readiness-refresh-2026-05-26-task.md`.
  Verification results: presence PASS (`4/4`), markdown H1 sanity PASS,
  SHA256 provenance recorded for all four files, and scoped credential-value
  pattern scan PASS (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane edits were performed.
  Evidence:
  `history/tasks/luc-132-luc-19-runtime-readiness-task-closure-2026-05-26-task.md`,
  `history/evidence/luc-132-luc-19-runtime-readiness-task-closure-2026-05-26.md`.

- `LUC-131 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-103-P5N` (`LUC-86` latest health-sweep task closure).
  Scope was strict to latest LUC-86 health-sweep artifacts:
  `history/tasks/luc-86-coolify-production-deploy-health-sweep-2026-05-26-task.md`
  and
  `history/evidence/luc-86-coolify-production-health-sweep-2026-05-26-final.md`.
  Verification results: presence PASS (`2/2`), markdown H1 sanity PASS,
  SHA256 provenance recorded for both files, and scoped credential-value
  pattern scan PASS (`NO_CREDENTIAL_VALUES`).
  No deploy/runtime mutation and no cross-lane edits were performed.
  Evidence:
  `history/tasks/luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26-task.md`,
  `history/evidence/luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26.md`.

- `LUC-129 issue_commented heartbeat (2026-05-26)` executed a concrete PM
  no-stall reconciliation checkpoint and remains `blocked`.
  Latest wake comment (`fe88ade7-6522-4cd2-8ad3-61e7055f3b56`) introduced no
  new human unblock input; scope stayed coordination-only and fail-closed
  against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-129-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-129 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-129-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-128 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-45` docs/state parity closure (`LUC-103-P5L`).
  Scope was source-of-truth reconciliation only (no runtime/deploy/code-path
  mutation). Stale lane posture in
  `history/tasks/luc-45-e-docs-state-parity-sync-2026-05-25-task.md` was
  corrected from `IN_PROGRESS` to fail-closed `BLOCKED`, aligned with existing
  controller sequencing constraints.
  Parent controller truth is unchanged: `LUC-45` remains blocked and must
  continue in strict order `A+B -> C -> D -> E` before docs lane execution.
  Evidence:
  `history/tasks/luc-128-luc-45-v1-controller-docs-closure-2026-05-26-task.md`.

- `LUC-126 finish_successful_run_handoff (2026-05-26)` executed a concrete
  Delivery controller reconciliation checkpoint and remains `blocked`.
  Scope stayed planning/integration-only and fail-closed (no feature/runtime
  implementation, no deploy mutation, no secret/account handling).
  Parent blocker topology in this heartbeat remains unchanged:
  - `LUC-47` (Ops Release Lead + host operator) must publish expected-SHA
    temp-domain deploy/smoke/readiness packet with worker readiness and
    rollback note.
  Capacity governor remained preserved (`<=5` active live runs); no new lane
  creation was performed.
  Evidence:
  `history/tasks/luc-126-v1-audit-to-completion-controller-2026-05-26-task.md`.

- `LUC-126 source_scoped_recovery_action (2026-05-26)` was reconciled as a
  second fail-closed controller checkpoint with unchanged blocker topology.
  No new closure packet was attached, no stale `in_progress` drift was
  detected, and no new lane was created.
  Disposition remains `blocked` with unchanged unblock owner/action:
  `LUC-47` (Ops Release Lead + host operator) must deliver expected-SHA
  temp-domain deploy/smoke/readiness evidence with worker readiness and
  rollback note.
  Evidence:
  `history/tasks/luc-126-v1-audit-to-completion-controller-2026-05-26-task.md`.

- `LUC-125 assigned heartbeat (2026-05-26)` completed as `done` for
  QA source-of-truth closure of `LUC-49` UI-state browser-proof matrix status.
  Scope was documentation/state reconciliation only (no runtime/deploy/code-path
  mutation): protected proof objective for `/dashboard`, `/dashboard/bots*`,
  and `/admin/*` was already PASS-evidenced on 2026-05-26, but stale status
  fields still reported `blocked`. This heartbeat aligned the canonical status
  wording in:
  - `history/tasks/luc-49-ui-state-browser-proof-matrix-2026-05-25-task.md`
  - `docs/analysis/luc-49-ui-state-browser-proof-matrix-2026-05-25.md`
  - `.codex/context/TASK_BOARD.md`
  Disposition is `done` for the protected packet closure objective.
  Residual follow-up remains explicit: route-cluster `loading/empty/error`
  artifact expansion stays in separate frontend+QA scope and is not an open
  blocker for `LUC-49` objective closure in this lane.
  Evidence:
  `history/tasks/luc-125-luc-49-ui-state-browser-proof-matrix-closure-2026-05-26-task.md`.

- `LUC-122 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Continuation wake `finish_successful_run_handoff` was reconciled with no new
  blocker-closure evidence; disposition remains unchanged.
  Continuation wake `source_scoped_recovery_action` was reconciled with no new
  blocker-closure evidence and no stale `in_progress` drift; disposition
  remains unchanged.
  Evidence:
  `history/tasks/luc-122-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-119 assigned heartbeat (2026-05-26)` executed concrete Ops release-permit
  evidence closure for `LUC-98` and remains `blocked`.
  Scope was strict to allowed operations only (`read/restart/read`) on
  `workers-market-stream` plus packet consistency verification.
  Validation results:
  - `ops:operator-unblock:check` against
    `history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json`
    -> `PASS`
  - Coolify pre-state for `workers-market-stream`
    (`d2oo1wwy8i55q27e5mdky0i4`) = `exited:unhealthy`
  - restart API accepted (`Deployment already queued for this commit.`)
  - post-action polling (`6` checks / `60s`) remained `exited:unhealthy`
  No deploy mutation, push, or secret disclosure was performed in this lane.
  Unblock owner/action: Ops Release Lead + Coolify operator + local-board
  release controller must clear deployment queue/crash-loop cause, recover
  worker health with proof, then publish temp-domain expected-SHA acceptance
  packet with rollback note.
  Evidence:
  `history/tasks/luc-119-luc-98-release-permit-evidence-closure-2026-05-26-task.md`.

- `LUC-118 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-103-P5F` (`LUC-107` Ops evidence closure).
  Scope was strict to the `LUC-107` bundle only:
  `history/evidence/luc-107-coolify-production-health-sweep-2026-05-26.md`,
  `history/evidence/luc-107-finish-successful-run-handoff-2026-05-26.md`,
  `history/evidence/luc-107-source-scoped-recovery-action-2026-05-26.md`,
  and
  `history/tasks/luc-107-coolify-production-deploy-health-sweep-2026-05-26-task.md`.
  Verification results: presence check PASS (`ALL_PRESENT`), markdown H1
  sanity PASS (`HEADERS_OK`), scoped credential-value pattern scan PASS
  (`NO_CREDENTIAL_VALUES`), lane-scope status check PASS.
  No deploy/runtime mutation and no cross-lane edits were performed.
  Evidence:
  `history/tasks/luc-118-luc-107-coolify-health-evidence-closure-2026-05-26-task.md`.

- `LUC-116 finish_successful_run_handoff wake (2026-05-26)` executed a concrete
  PM no-stall queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-116-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-114 assigned heartbeat (2026-05-26)` completed as `done` for
  QA repeatable smoke evidence closure in `LUC-103` partition `P5C`.
  Repeatable smoke runner was executed with fresh date pin:
  - `pnpm run qa:smoke-e2e:repeatable -- --checks web --today 2026-05-26` -> PASS
  - `pnpm run qa:smoke-e2e:repeatable -- --checks api --today 2026-05-26` -> PASS
  Durable outputs:
  `history/artifacts/qa-repeatable-smoke-e2e-2026-05-26.json`,
  `history/evidence/qa-repeatable-smoke-e2e-2026-05-26.md`,
  and task packet
  `history/tasks/luc-114-qa-repeatable-smoke-evidence-closure-2026-05-26-task.md`.
  Scope stayed QA verification only (no runtime/deploy mutation).

- `LUC-113 assigned heartbeat (2026-05-26)` completed as `done` for
  docs-analysis provenance closure within `LUC-103` (`P5B` subset only).
  Durable provenance register with per-file owner attribution and explicit
  commit/no-commit decision is published in
  `docs/analysis/luc-113-docs-analysis-provenance-closure-2026-05-26.md`.
  Scope excluded runtime/code-path/deploy mutation.
  Evidence:
  `history/tasks/luc-113-docs-analysis-provenance-closure-2026-05-26-task.md`.

- `LUC-112 assigned heartbeat (2026-05-26)` completed as `done` for
  architecture-awareness docs graph closure.
  Scope was architecture documentation parity only; no runtime/deploy/code-path
  mutation was performed.
  Updated architecture graph contract exports in
  `docs/architecture/architecture-evidence-graph-system.md` to explicitly
  include:
  `docs/graphs/architecture-awareness.json`,
  `docs/graphs/architecture-awareness.csv`,
  `docs/graphs/architecture-graph.mmd`,
  `docs/status/architecture-awareness-report.md`.
  Validation passed:
  `pnpm run architecture:graph:drift:strict` => `809/809` covered, `0` missing.
  Evidence:
  `history/tasks/luc-112-architecture-awareness-docs-graph-closure-2026-05-26-task.md`.

- `LUC-110 assigned heartbeat (2026-05-26)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Scope stayed coordination-only and fail-closed against parent `LUC-45`.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must publish temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Continuation wake `finish_successful_run_handoff` was reconciled with no new
  blocker-closure evidence; disposition remains unchanged.
  Evidence:
  `history/tasks/luc-110-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-109 assigned heartbeat (2026-05-26)` executed concrete PM-only provenance closure checkpoint and remains `blocked`.
  Scope was explicitly bounded to `LUC-103` partition `P4-state-ledgers` (`6` tracked state/context files) with fail-closed exclusion of `P5-history-docs-bundle`. No commit/push/deploy/runtime mutation was performed in this lane. Unblock owner/action: Engineering Delivery Lead must finalize owner-scoped close/no-commit disposition for the `P4` bundle, then lane owners close `P5` and rerun final `LUC-103` closure.
  Evidence:
  `history/tasks/luc-103-source-control-closure-2026-05-26-task.md`.

## Current Candidate Deployment Status

- `LUC-70 [Soar][PM] No-stall queue expeditor` is closed as a completed
  queue-motion checkpoint. Published
  `history/tasks/luc-70-no-stall-queue-expeditor-2026-05-25-task.md`.
  Scope is PM coordination only (no product/runtime implementation in this
  lane). Critical unblock ownership is explicit and unchanged:
  `LUC-46` owns deterministic backend/runtime final-candle closure evidence,
  `LUC-47` owns one-stack temp-domain expected-SHA deploy smoke evidence, and
  `LUC-45` remains the integration parent with strict sequence
  `A+B -> C -> D -> E`. `LUC-48` may continue readiness-evidence prep but
  cannot close polish readiness ahead of protected/browser freshness and `A/B`
  closure. Continuation run `a103996a-f1fc-4be6-afb6-ed849ec77435` did not
  attach fresh blocker closure evidence from `LUC-46` or `LUC-47`.
  Board closeout comment `a8021860-4b8a-4a5b-942d-32aa18547bdd` marks this
  individual routine issue `done` to avoid stale duplicate supervision state.
  Ongoing supervision remains in the active 30-minute PM routine with live
  continuation gate `LUC-46 + LUC-47 -> LUC-45-C`.

- `LUC-69 [Soar][Ops Smoke] Verify Coolify read-only secret access` is
  verified with fresh read-only evidence. Published
  `history/tasks/luc-69-ops-smoke-verify-coolify-read-only-secret-access-2026-05-25-task.md`.
  Ops probe confirms secret-based Coolify API access is valid for read-only
  inventory endpoints in this session (`/api/v1/applications` => `200`, array `13`;
  `/api/v1/resources` => `200`, array `17`) with no secret values recorded.
  App-specific verification is also confirmed for discovered Soar entries:
  `k126p7vqxs5cly2zc4y4g4rq` (`soar-api`) and
  `ato4fqkncd6t38wzlle2m0rv` (`soar-web`) both return `200`.
  Remaining action is to refresh the active `COOLIFY_SOAR_APP_ID` binding to one of
  these valid IDs for consistent automation.
  Board closeout confirms this refresh is out-of-scope for `LUC-69` smoke and must
  run as a separate ops configuration follow-up issue.

- `LUC-64 [Soar] Dashboard strategy-signal truth vs execution outcome repair`
  is closed as `done` with integrated child-lane evidence and docs/state
  parity reconciliation. Published
  `history/tasks/luc-64-dashboard-strategy-signal-truth-vs-execution-outcome-repair-2026-05-25-task.md`.
  Child-lane integration truth:
  - `LUC-64-A` complete with evidence in
    `history/tasks/dashboard-runtime-signal-condition-active-2026-05-25-task.md`.
  - `LUC-64-C` complete with evidence in
    `history/tasks/luc-67-qa-verify-matched-strategy-signal-blocked-execution-reason-2026-05-25-task.md`.
  - `LUC-64-B` complete with backend payload-semantics proof:
    `history/tasks/luc-64-b-backend-runtime-signal-payload-separation-proof-2026-05-26-task.md`
  - Proof confirms matched strategy-condition fields stay separated from
    execution outcome fields in runtime payloads.
  - `LUC-64-D` docs/state parity closure is recorded in:
    `history/tasks/luc-127-luc-64-backend-runtime-signal-docs-closure-2026-05-26-task.md`.
  Board stale-parent cleanup (`c7df4d14-c3e6-47d7-8a30-3f89e26bab5f`) requires
  non-live status for stale runs; later parity reconciliation closes this item.
  Continuation incident on 2026-05-26:
  run `1e1d5591-bbb4-4257-bce6-d1507dd10b6a` failed with
  `codex_transient_upstream` (model usage limit). This does not change product
  evidence or scope.
  Board model-cleanup comment (`bf496bbc-6469-4872-acbf-fd30cb9228c0`) confirms
  stale `in_progress` without a live run must be cleared.

- `LUC-63 [Soar][PM] No-stall queue expeditor` is now active as the
  queue-motion control checkpoint for this heartbeat. Published
  `history/tasks/luc-63-no-stall-queue-expeditor-2026-05-25-task.md`.
  Scope is PM coordination only (no product/runtime code changes). No-stall
  routing is explicit: `LUC-46` owns backend runtime Gate.io final-candle
  closure proof, `LUC-47` owns temp-domain one-stack expected-SHA deploy smoke
  proof, and `LUC-45` remains the integration parent with strict order
  `A+B -> C -> D -> E`. `LUC-48-A/browser-proof` (previously `LUC-49`) may continue matrix prep in parallel but
  cannot close polish readiness until protected/browser freshness and
  QA/Security follow-up evidence are attached. Both owners now have explicit wake
  requests logged in `LUC-63`. Current disposition: `done` for issue scope after board inbox cleanup. Ongoing no-stall supervision moved to the active 30-minute PM routine, so this issue is intentionally closed to avoid stale queue state.

- `DASH-RUNTIME-SIGNAL-CONDITION-ACTIVE-2026-05-25` is verified locally for the
  Paperclip Dashboard signal repair lane. Dashboard Home signal cards now derive
  condition-active LONG/SHORT presentation and the signal header count from
  explicit backend condition-line matches (`lastSignalConditionLines[].matched
  === true`) instead of accepted execution state only. Runtime market-state
  badges and `lastSignalMessage`/`lastSignalReason` remain separate, so an open
  position or pre-trade block can stay visible without hiding the satisfied
  strategy condition. Evidence:
  `history/tasks/dashboard-runtime-signal-condition-active-2026-05-25-task.md`;
  focused Web tests `9/9`, Web typecheck, Web lint, and diff check passed.
  No production deploy or authenticated browser proof was run in this lane.

- `LUC-62 [Soar][PM] V1 project control and lane supervision` is closed as
  `done` for checkpoint scope after board inbox cleanup comment
  `baf923dc-8805-4b70-94a6-4d9ba7cfb30e` (2026-05-25). This issue delivered
  the PM supervision packet and alignment update, then intentionally handed
  ongoing supervision to the 30-minute no-stall routine and active controller
  lanes.
  Published
  `history/tasks/luc-62-v1-project-control-and-lane-supervision-2026-05-25-task.md`
  with explicit lane supervision truth and gate order. Current PM posture:
  `LUC-45` controller remains the integration parent; `LUC-46` and `LUC-47`
  remain required upstream execution lanes; `LUC-48` and `LUC-48-A/browser-proof`
  remain blocked on protected/browser proof freshness and shared web regression
  isolation.
  This lane introduces no product/runtime code changes and only updates
  coordination truth to keep ownership and next gates explicit.

- `LUC-47 [Soar][LUC-45-B] Ops stack rollout and smoke gate` is partially
  verified and currently blocked by external deploy-control context.
  Local pre-deploy safety gate is green after the API liveness correction:
  `corepack pnpm run docker:coolify:config` PASS (API healthcheck `/health`,
  `/ready` preserved for smoke), `corepack pnpm run
  ops:coolify-stack:env-check:example` PASS (`16/16` required names present,
  redacted output), and `corepack pnpm run quality:guardrails` PASS. Remaining
  lane objective needs a temp-domain Coolify parallel-stack deploy for the
  expected SHA plus API/Web/build-info/worker smoke artifacts before any
  cutover recommendation.
  Fresh read-only audit added definitive Coolify identifiers:
  - project `Soar` UUID: `ogy0ozce7lub39mnwjwb4lwe`
  - production environment id: `6`
  - applications/workers in env `6`:
    `soar-api`=`k126p7vqxs5cly2zc4y4g4rq`,
    `soar-web`=`ato4fqkncd6t38wzlle2m0rv`,
    `workers-market-data`=`sj0bh3pirqq1jf41bijaf77y`,
    `workers-market-stream`=`d2oo1wwy8i55q27e5mdky0i4`,
    `workers-backtest`=`gktawk85w6826z2bs8z123mz`,
    `workers-execution`=`s2qz86w8c9hc5anajdtl5d8r`.
  Continuation run on 2026-05-26 failed before lane execution with adapter
  bootstrap `EEXIST` during auth symlink creation. Local verification confirms
  source and runtime-target auth files exist and target is a regular file, so
  this is runtime bootstrap conflict, not a Soar deploy/smoke result.

- `LUC-45 [Soar] V1 audit-to-completion controller` is implemented and
  verified for delivery-control scope. Published
  `history/tasks/luc-45-v1-audit-to-completion-controller-2026-05-25-task.md`
  as the active V1 controller packet with one accountable owner per lane and
  strict gate order across unresolved blocker families:
  `A backend runtime/API stability`, `B ops stack rollout`, `C QA repeatable
  journey proof`, `D security boundary read-only proof`, and
  `E docs/state parity sync`. Current status: controller is ready; lane
  execution evidence is still pending and required before any V1 readiness
  closure claim.
  2026-05-25 kickoff continuation adds the execution-level handoff artifacts:
  V1 gap register (`history/plans/luc-45-v1-gap-register-2026-05-25.md`),
  V1 evidence ledger (`history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md`),
  and child lane packets `LUC-45-A..E` for Backend, Ops, QA, Security, and
  Docs/State owners. This heartbeat still does not claim feature-level closure;
  it enables immediate specialist execution with explicit owners and proofs.
  2026-05-25 bridge handoff packet is also available at
  `history/evidence/luc-45-v1-bridge-handoff-to-project-agent-2026-05-25.md`
  and defines execution order, dependencies, and handoff continuation text.
  Board comment `eb5b100d-73c6-451c-8ff1-9c8d6411f3b4` confirms that the first
  parallel controller lanes are delegated as real child issues:
  `LUC-46` (maps to `LUC-45-A`) and `LUC-47` (maps to `LUC-45-B`).
  Controller integration remains in `LUC-45` and continues with `C -> D -> E`
  after outputs from `LUC-46/LUC-47`.
  Inbox cleanup comment `de3056a9-9afa-420c-b290-5819460308c8` upgrades parent
  posture from passive `in_progress` to explicit controller `blocked` until
  `LUC-46` and `LUC-47` publish unblock evidence. Unblock owners/actions:
  Backend API Engineer closes runtime/API stability evidence in `LUC-46`; Ops
  Release Lead closes rollout/smoke evidence in `LUC-47`.

- `LUC-48 [Soar][Docs] Autonomous map inventory and UI polish readiness gate`
  now includes a cross-layer readiness matrix and currently requires protected/auth
  money-flow proof, backend/runtime stability, one-stack Coolify evidence, and
  browser proof artifacts from child issue `LUC-48-A/browser-proof`
  (currently represented in existing `LUC-49` child artifacts) for front-end state
  matrix before full polish-readiness closure.
  Published `history/tasks/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25-task.md`
  and source artifact
  `docs/analysis/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25.md`.
  Added follow-up artifact:
  `history/plans/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25-full.md`.
  Local evidence now includes route inventory checks and UI polish state matrix.
  Current status: source-of-truth alignment is `implemented`; polish-readiness is
  `blocked` until route-surface and protected/browser state verification from child
  issue `LUC-48-A/browser-proof` is refreshed with authenticated/protected UI proof
  and external temp-domain deploy evidence is attached. Active map/index drift routine
  remains active while blocked to keep source-of-truth docs synchronized.
  `LUC-48-A/browser-proof` (represented via existing `LUC-49` artifacts) now
  published a dedicated frontend UI-state browser-proof artifact:
  `docs/analysis/luc-49-ui-state-browser-proof-matrix-2026-05-25.md` and task
  packet `history/tasks/luc-49-ui-state-browser-proof-matrix-2026-05-25-task.md`.
  The matrix adds route-cluster `loading/empty/error/success` evidence status
  with explicit freshness gaps. A focused verification checkpoint is now
  green after test-mode stabilization in auth/SW tests, but route-state artifact
  gaps keep lane status `implemented and blocked`.
  Deficiency routing now explicitly covers required owner lanes:
  Frontend, UX, Backend, QA, Product.
  2026-05-25 stale-state cleanup comment
  (`125fed04-69c5-4195-a5a3-51975ea90447`) confirms this lane must remain
  blocked until fresh protected browser-proof artifacts are attached for:
  dashboard/bots/admin and wallet/market/strategy/backtest/report/log/profile
  route surfaces with `loading/empty/error` state evidence.
  2026-05-25 model cleanup comment
  (`07273b4a-1f02-4268-94f1-21194961db52`) further confirms stale passive
  `in_progress` is invalid for this lane. Status remains `blocked` until
  either fresh protected UI/browser-proof matrix evidence is attached or a
  narrower repair lane is created with explicit owner/action.
  Blocked lanes for V1 polish completion:
  - Frontend (`LUC-48-A/browser-proof`) - refreshes for dashboard/bots/admin and remaining money-flow routes.
  - QA (`LUC-45-C`) - attach route-level protected-state proof artifacts for remaining surfaces.
  - Security/Ops/Auth (`LUC-45-D`) - provide protected auth-state context and boundary proof for sensitive routes.
  - Backend/API (`LUC-46`) - clears runtime/backtests blockers preventing confident state proof in protected surfaces.

- `LUC-40 [Soar][Data] Persistence and integrity known-state` is partially verified for the data-persistence lane. Published `history/tasks/luc-40-data-persistence-known-state-2026-05-25-task.md` with schema/migration integrity evidence and explicit unknowns. Verified: `corepack pnpm --filter api exec prisma validate` PASS, `corepack pnpm --filter api exec prisma migrate status --schema prisma/schema.prisma` PASS (`55` migrations, DB schema up to date), and `corepack pnpm run ops:db:backup-restore:check-local` PASS (`history/operations/v1-db-restore-check-2026-05-25T18-02-43-687Z.md`). Blocked by error for broader module proof in this heartbeat: focused API pack timed out after `124054ms`.

- `LUC-43 [Soar][Test Automation] Repeatable smoke and e2e checks` is
  implemented and partially verified for QA automation scope. Added
  `scripts/runQaRepeatableSmokeE2e.mjs` and root script
  `pnpm run qa:smoke-e2e:repeatable` to execute repeatable smoke/e2e packs
  (`web`, `api`, `backtests`) with deterministic exit status and durable
  artifacts in `history/artifacts/qa-repeatable-smoke-e2e-<date>.json` plus
  `history/evidence/qa-repeatable-smoke-e2e-<date>.md`. Focused local proof
  passed for `--checks web` on 2026-05-25. Full `api/backtests` run remains
  pending and is expected to capture known `backtests.e2e` failures until
  repair work lands.

- `LUC-38 [Soar][Frontend] View map and browser workflow ownership` is
  implemented and verified for documentation/state scope. Added a durable
  frontend route-to-view ownership map and browser workflow contract in
  `docs/status/view-map-browser-workflow-ownership.md`, linked from
  `docs/documentation-map.md`, with task evidence at
  `history/tasks/luc-38-frontend-view-map-browser-workflow-ownership-2026-05-25-task.md`.
  Source inputs were the canonical dashboard route map and current
  `apps/web/src/app/**/page.tsx` inventory. No backend/API/runtime behavior
  changed.
  Liveness continuation added explicit primary route/view/client-API mapping
  plus regression status: no frontend regression reproduction attached to this
  issue, protected-route browser proof remains auth-gated, and current
  backtests smoke instability is tracked as backend/api-owned.

- `LUC-37 [Soar][Delivery] Engineering breakdown and integration map` is
  implemented and verified for planning/integration scope. A durable delivery
  packet was published at
  `history/tasks/luc-37-engineering-breakdown-and-integration-map-2026-05-25-task.md`
  with single-owner lane decomposition (`LUC-37-A..E`), explicit dependency
  chain, verification expectations, and integration gate ownership. Current
  status: decomposition is ready; child lanes are created for delegated execution:
  `LUC-37-A`, `LUC-37-B`, `LUC-37-C`, `LUC-37-D`, and `LUC-37-E`.
  Execution proof remains pending in those lanes. Board cleanup and hierarchy
  migration comments on 2026-05-25 confirmed parent-lane closure so this broad
  coordination issue does not reopen while specialist lanes own implementation.

- `LUC-18-QA-REGRESSION-SMOKE-BASELINE-2026-05-25` is partially verified.
  First runnable QA baseline was executed and documented in
  `history/tasks/luc-18-qa-regression-smoke-baseline-2026-05-25.md`.
  Implemented and verified: `quality:guardrails`, `lint`, `typecheck`, and
  `test:go-live:web` (`18/18`). Blocked by error: `test:go-live:api` fails in
  `src/modules/backtests/backtests.e2e.test.ts` with one assertion failure
  (`expected 0 to be greater than 0` at line `768`) and one timeout (`5000ms`
  at line `837`), with reconciliation stderr indicating exchange snapshot fetch
  failure. Current QA release posture: web smoke gate is green; API critical
  smoke remains red until backtests reconciliation instability is repaired.

- `LUC-24-ADAPTER-SMOKE-SYMLINK-PERMISSION-2026-05-25` is resolved and
  verified by board runtime evidence. Initial local reproduction confirmed the
  Windows symlink privilege failure (`Administrator privilege required for this
  operation`) and established this as runtime/harness behavior, not Soar app
  code. Board closure then verified runtime fallback deployment:
  `node scripts/doctor-luckysparrow-softwarehouse.mjs` reports `overall: pass`,
  `8/8` LuckySparrow agents pass adapter probes, and Windows auth/skill
  bootstrap no-link/copy fallbacks are active. Evidence:
  `history/tasks/luc-24-paperclip-agent-execution-smoke-test-2026-05-25-task.md`.

- `LUC-15` setup scope is closed as `done` by board decision
  `c7fefae8-ea2c-48b4-a480-0ff5d7980993`.
  Source-of-truth closure artifact:
  `history/tasks/luc-15-live-project-status-and-decision-dashboard-2026-05-25-task.md`.
  Ongoing Soar takeover execution continues in dedicated child lane issues
  (Product, CTO, QA, Ops, Docs, UX, Implementation) and portfolio baseline
  `LUC-12`.

- `LUC-22-FIRST-SAFE-REPAIR-LANE-2026-05-25` is implemented and verified for
  local heartbeat-unblock evidence. The previously failed heartbeat ended with
  Windows `EPERM` on auth symlink creation into Paperclip runtime
  `codex-home`. Local verification confirms both auth files exist and are
  hash-identical (`SHA256`:
  `1B87C869E3101DD3C690DC9800E9DA4D1B6F7B44424A9004EBE2B99F9B3B82CD`)
  between `C:\Users\wrobl\.codex\auth.json` and the runtime target
  `...\codex-home\auth.json`. Durable evidence is captured in
  `history/tasks/luc-22-first-safe-repair-lane-2026-05-25-task.md`. This
  checkpoint confirms local auth-target parity but does not itself prove a full
  external harness adapter rerun. Board follow-up on 2026-05-25 explicitly
  cancels the legacy broad implementation lane and supersedes it with
  `LUC-37` Delivery plus specialist lanes; this `LUC-22` row is historical
  evidence only.

- `LUC-17-ARCHITECTURE-FUNCTION-CHAIN-KNOWN-STATE-2026-05-25` is verified for
  the CTO architecture lane. Published
  `history/audits/cto-architecture-known-state-2026-05-25.md` with a
  code-backed Soar module map (`apps/api`, `apps/web`, `libs/shared`,
  `scripts`), key function-chain references from graph exports, doc trust
  classification (accurate/stale/missing), and the minimum architecture index
  required before safe non-trivial coding. Current posture: structural
  traceability is implemented and verified locally; many high-risk protected
  user actions remain local-only proof and still require protected production
  evidence.

- `LUC-39-BACKEND-API-SERVICE-BOUNDARY-KNOWN-STATE-2026-05-25` is implemented
  and verified for the backend API lane. Published
  `history/tasks/luc-39-backend-api-service-boundary-known-state-2026-05-25.md`
  with an evidence-backed API/service boundary inventory from current source:
  `20` route files, `18` controllers, `118` services, `49` API e2e tests, and
  `169` test files under `apps/api/src/modules`. Route ownership map now
  explicitly lists all current backend route modules and ties them to generated
  architecture indexes (`function-journey-index`, `user-action-index`) for
  route/controller/service/data/test/doc traceability. Current risk posture:
  structural gaps are `0` at index level, while protected/money/live proof
  gaps remain high and are intentionally outside this documentation-only slice.

- `LUC-19-RUNTIME-KNOWN-STATE-2026-05-25` is partially verified for the ops
  runtime/deploy lane. Runtime truth was re-baselined from canonical
  deployment docs, env templates, compose manifests, and package scripts.
  No-secret checks passed: `pnpm run docker:coolify:config` and
  `pnpm run ops:coolify-stack:env-check:example` (`required present: 16/16`).
  Current matrix: local dev and local Docker parity are implemented and
  verified; stage is intentionally parked (present in docs, behavior unknown);
  production single-stack topology is implemented but not yet verified by a
  fresh temp-domain stack redeploy after API liveness-gate correction.
  Evidence: `history/tasks/luc-19-runtime-known-state-2026-05-25-task.md`.

- `COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25` is implemented locally and
  in controlled production rollout after VPS restart. The new
  `docker-compose.coolify.yml` defines one Coolify Service Stack for Soar app
  processes (`api`, `web`, and four split workers) while keeping existing
  production Postgres/Redis external for the first cutover. `.env.coolify.example`
  documents the required Coolify variables without secrets, including exact
  `SOURCE_COMMIT`, service FQDNs, existing DB/Redis URLs, versioned encryption
  keys, worker topology, and memory guardrails. The no-secret
  `ops:coolify-stack:env-check` preflight now rejects missing values,
  placeholders, invalid SHA/URL/secret/keyring shapes, and prints only
  variable names. `docker-compose.coolify.shared-api-image.yml` is documented
  as a later queue-reduction experiment, not the first cutover path. Operations
  docs now describe parallel-stack cutover and rollback. Local proof passed
  `docker:coolify:config`, `docker:coolify:shared-api:config`,
  `ops:coolify-stack:env-check:test`, `ops:coolify-stack:env-check:example`,
  expected placeholder-fail strict env check, architecture graph generation,
  strict graph drift (`806/806`, `0` missing), and `quality:guardrails`.
  After Coolify became reachable, a parallel Docker Compose Application was
  created with old six-Application auto-deploy disabled and production
  public `/health` plus `/ready` staying `200`. The first parallel stack deploy
  built API/Web successfully but failed during compose startup because API
  Docker health used `/ready`, causing Web/workers to wait on a readiness gate.
  The parallel stack was stopped, old production remained healthy, and the
  manifest now uses `/health` for API liveness while keeping `/ready` as the
  required post-deploy smoke. Validation for this liveness fix passed
  `docker:coolify:config`, `ops:coolify-stack:env-check:test`,
  `ops:coolify-stack:env-check:example`, and `quality:guardrails`. Next action
  is a controlled redeploy to temp stack domains, then smoke
  API/Web/build-info/workers before detaching or stopping the old six
  Applications. No DB migration or LIVE exchange mutation was performed.

- `FUNCTION-JOURNEY-EVIDENCE-INDEX-2026-05-25` is verified locally. Soar now
  has generated route/function/API/user-action evidence indexes layered on the
  architecture graph: `function-chain-evidence-index.csv`,
  `web-journey-index.csv`, `api-surface-evidence-index.csv`,
  `user-action-index.csv`, JSON graph outputs, status Markdown summaries, and
  dated artifacts. Current generated result: `27` function chains, `36` web
  journeys/pages, `96` API surfaces, `39` user actions, `0` critical
  structural/action gaps, `28` high function/API proof gaps, and `37` high
  user-action proof gaps. `pnpm run architecture:journey:triage -- --query
  SOAR-UI-MANUAL-ORDER-SUBMIT` now traces a UI action to `/dashboard`,
  `SOAR-API-ORDER-OPEN`, manual-order chains, backend services, DB models,
  tests, docs, and proof gaps. This helps prevent repeated "something is
  broken" rediscovery by making each missing proof boundary visible before
  repair work starts. It does not change production `NO-GO` status while
  VPS/SLO evidence is blocked.

- `PROD-RUNTIME-AGGREGATE-SLO-BLOCKER-2026-05-25` is deployed and blocked on
  VPS reachability. Production candidate `24e9d3b8d51b4b4c4f1b25cad920096f2223b0ec`
  gained fresh protected read-only evidence on 2026-05-25: DB restore drill
  PASS, rollback proof PASS, LIVEIMPORT-03 with `--symbols auto` PASS,
  production UI module clickthrough PASS, auth-session browser proof PASS, and
  security/exchange proof PASS. The later 30-minute RC/SLO pipeline failed
  availability and API 5xx targets; production logs showed API heap
  out-of-memory restarts and repeated 500s on the runtime monitoring aggregate
  endpoint. The local code fix limits aggregate per-session concurrency and
  skips failed per-session rows instead of failing the whole aggregate. Local
  validation passed focused aggregate concurrency `1/1`, aggregate e2e `18/18`,
  API typecheck, repository lint, architecture graph generation, and
  `quality:guardrails`. Commit `287e77a1ef6aa79396cb485dafcf8d17a0fce033`
  reached public build-info and public no-worker smoke passed. The post-deploy
  SLO window recorded `0` API 5xx delta and `2.59ms` average duration, but
  overall status remained `FAIL` because late probes returned `fetch failed`.
  Follow-up network checks showed `141.227.149.67` unreachable on SSH `22` and
  HTTPS `443` for API/Web/Coolify. Production remains `NO-GO` until VPS
  reachability returns and a fresh SLO/RC observation passes. No LIVE
  exchange-side mutation was performed.

- `GATEIO-LIVE-RECONCILIATION-SCOPE-2026-05-24` is deployed and protected
  read-only verified for Gate.io import visibility. Commit
  `24e9d3b8d51b4b4c4f1b25cad920096f2223b0ec` includes `GATEIO` in the default
  external-position reconciliation synced-key query and adds a DB-backed
  regression proving a Gate.io LIVE FUTURES key enters that scope. Local
  validation passed focused position reconciliation tests (`32/32`), API
  typecheck, repository lint, `quality:guardrails`, and strict graph drift
  (`796/796`, `0` missing). Coolify API deployment was recovered by cancelling
  two stale API jobs and forcing one fresh API deploy; public API `/health`,
  API `/ready`, and Web build-info then passed on `24e9d3b8`. App-internal
  orphan repair saw one Gate.io open position and created `BNBUSDT` as
  `BOT_MANAGED`, `IN_SYNC`, and `CONFIRMED`. `LIVEIMPORT-03` read-only proof
  passed for Gate.io with `BNBUSDT` visible as `EXCHANGE_SYNC`,
  `OWNED_AND_MANAGED`, and `actionable: true` in
  `history/artifacts/liveimport-03-prod-readback-24e9d3b8-2026-05-24.json`.
  Binance runtime readback currently has no open runtime payload in that
  artifact. No LIVE exchange-side order, cancel, close, or position mutation
  was performed.

- `PROD-PROTECTED-PROOF-REFRESH-24E9D3B8-2026-05-24` is partially verified.
  Production UI module clickthrough passed for `24e9d3b8` and wrote
  `history/plans/prod-ui-module-clickthrough-z24e9d3b8-2026-05-24.md` plus
  `history/artifacts/prod-ui-module-clickthrough-z24e9d3b8-2026-05-24.json`.
  Production auth-session browser proof passed after a transient logout `502`
  was disproved by a direct API login/logout/me check; evidence:
  `history/evidence/prod-auth-session-browser-proof-24e9d3b8-2026-05-24.md`.
  Production security/exchange proof passed:
  `history/evidence/prod-security-exchange-proof-24e9d3b8-2026-05-24.md`.
  Production rollback proof passed with split-worker topology healthy,
  `shouldRollback=false`, and runtime freshness checks passing:
  `history/evidence/v1-rollback-proof-prod-2026-05-24T00-00-00-000Z.md`.
  Rerun preflight
  `history/releases/v1-preflight-production-24e9d3b8-2026-05-24-rerun.md`
  now marks LIVEIMPORT-03 and production UI clickthrough as fresh. It remains
  blocked on production DB restore context, stale RC status/sign-off/checklist,
  stale backup/restore drill, and activation audit/plan staying failed until
  the release gate is genuinely ready. No LIVE exchange-side mutation was
  performed.

- `PROD-UI-LEGACY-DASHBOARD-REDIRECTS-2026-05-24` is deployed and verified for
  the production Web route blocker found during protected UI proof. Commit
  `0b7eb4c6e0767ce1d51b3ff68f0229f899781d31` restores authenticated legacy
  redirects for `/dashboard/exchanges`, `/dashboard/orders`, and
  `/dashboard/positions`. Web build-info reached the new SHA after one
  transient `502` during deploy; public deploy smoke passes; production UI
  clickthrough passes at
  `history/plans/prod-ui-module-clickthrough-0b7eb4c6-2026-05-24.md`; and
  auth-session browser proof passes at
  `history/evidence/prod-auth-session-browser-proof-0b7eb4c6-2026-05-24.md`.
  Production security/exchange proof is partial at
  `history/evidence/prod-security-exchange-proof-0b7eb4c6-2026-05-24.md`
  because `/ops/readiness/details` requires separate ops auth and returned
  `401`; app-auth security checks, API-key redaction, Binance catalog, and
  Gate.io futures catalog passed. No LIVE exchange mutation was performed.

- `LOCAL-DOCKER-COOLIFY-PARITY-2026-05-24` is verified locally. The repo now
  exposes Docker app-stack commands that reuse `docker-compose.vps.yml` for
  the Coolify split-service topology, with `.env.docker.example` as the
  local-only env template. Validation passed: package JSON parse, compose
  render, Docker build for API/Web/four worker images, short local
  app-container run with API `/health` `200`, API `/ready` `200`, Web `/`
  `200`, `quality:guardrails`, strict architecture graph drift (`796/796`,
  `0` missing), and `git diff --check` with line-ending warnings only. The
  app/worker containers started for proof were stopped and removed; existing
  local Postgres/Redis containers were left running. No production secret,
  Coolify deployment, push, or LIVE exchange mutation was performed.

- `API-LOCAL-REGRESSION-SWEEP-2026-05-24` is verified locally. The backend
  regression sweep fixed dynamic-stop display truth for imported LIVE
  positions with stale runtime state, lifecycle close parity for `TSL`, reports
  cross-mode trade counting, orders LIVE entitlement-aware contract tests,
  runtime-flow polling, wallet/manual-order cleanup, and AI protocol artifact
  path resolution. Focused regression proof passed (`14` files / `107` tests),
  full API Vitest passed after a clean local DB reset in one-worker mode, API
  typecheck passed, repository lint passed, full workspace build passed,
  quality guardrails passed, strict architecture graph drift passed with
  `796/796` covered and `0` missing, and `git diff --check` found no
  whitespace errors beyond LF/CRLF warnings. This improves local backend
  confidence but does not change the current V1 `NO-GO` status for protected
  production proof.

- `LOCAL-INTEGRITY-BUILD-SWEEP-2026-05-24` is verified locally. Full API/Web
  typecheck passed, docs parity passed with API `22/22`, Web `16/16`, and
  Routes `37/37`, reusable audit/operator aggregate validation passed, and the
  full workspace build passed for the mobile scaffold placeholder, API `tsc`,
  and Web production `next build`. This strengthens local confidence after
  the current release-tooling, graph, source-of-truth, and Dashboard updates,
  but does not replace protected production evidence.

- `WEB-DASHBOARD-SELECTED-BOT-LOAD-DEPS-2026-05-24` is verified locally. The
  only current repository lint warning was a React hook dependency drift in
  Dashboard Home. The final fix keeps `load` stable and reads selected-bot
  state through a synchronized ref, avoiding selection-triggered reload
  regressions. Focused Dashboard hook tests passed (`4/4`), focused Dashboard
  regression tests passed (`26/26`), full Web tests passed (`150` files / `534`
  tests), Web lint passed with no warnings/errors, Web typecheck passed,
  repository lint passed with no warnings/errors, guardrails passed, and strict
  architecture graph drift passed with `796/796` covered and `0` missing. This
  does not change the current V1 `NO-GO` status for protected production proof.

- `PROD-FRESH-DEPLOY-380308D1-2026-05-24` is partially verified for public
  no-secret production freshness. The stale build-info blocker is resolved:
  `soar-web`, `soar-api`, `workers-market-data`, `workers-market-stream`,
  `workers-backtest`, and `workers-execution` were deployed through the
  existing Coolify queue to
  `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`. Public Web build-info returns
  that SHA with `metadataSource=github-branch` and build id
  `nIAcUSY1pT2mPzUoi4OyK`; public no-worker smoke passes API `/health`, API
  `/ready`, and Web `/`. The deploy required one committed API build fix:
  `fix(api): pass exchange pnl into runtime dca fraction`. No LIVE exchange
  mutation, protected app auth proof, or production DB restore drill was run.
  No-secret V1 preflight rerun writes
  `history/artifacts/v1-preflight-production-fresh-deploy-rerun-2026-05-24.json`
  and
  `history/releases/v1-preflight-production-fresh-deploy-rerun-2026-05-24.md`;
  it now passes build-info and public smoke, and remains BLOCKED only on
  protected auth/context and release evidence gates.

- `RELEASE-PREFLIGHT-ACTIVE-DOCS-ROOT-2026-05-24` is implemented and partially
  verified for release tooling correctness. V1 release/preflight and RC helper
  scripts now resolve the active operations docs root after the documentation
  migration. The rerun production preflight passes build-info and public smoke,
  reports RC current docs as stale for 2026-05-23 instead of missing, and still
  blocks on protected auth/context plus true missing/stale release evidence.
  Validation passed `node --check` on touched scripts and
  `node --test scripts/runV1ReleaseGate.test.mjs scripts/runV1FinalPreflight.test.mjs`
  (`27/27`).

- `RELEASE-GATE-ACTIVATION-STATUS-HARDENING-2026-05-24` is implemented and
  partially verified for release safety. Activation audit and activation plan
  artifacts must now contain explicit `Status: **READY**` or `Status: **PASS**`
  before the release gate accepts them. Regression tests passed `28/28`, and
  the current production preflight still blocks on true missing/stale evidence
  instead of accepting dated placeholders.

- `RELEASE-GATE-HISTORY-EVIDENCE-RESOLVER-2026-05-24` is implemented and
  partially verified. Release evidence readiness now searches canonical
  `history/audits`, `history/plans`, `history/artifacts`, and
  `history/evidence` buckets for the appropriate evidence families. The
  current production preflight now classifies the 2026-05-24 activation audit
  and plan as `FAILED` because they truthfully report `BLOCKED`, and it
  classifies previous protected evidence as `STALE` instead of `MISSING`.

- `RELEASE-PREFLIGHT-REMEDIATION-HINTS-2026-05-24` is implemented and
  partially verified. The final preflight now prints next actions for every
  current protected prerequisite and evidence blocker, including stale
  liveimport/UI/restore/rollback artifacts and failed activation audit/plan,
  without exposing secret values.

- `RELEASE-GATE-EXPECTED-SHA-EVIDENCE-BINDING-2026-05-24` is implemented and
  partially verified. Candidate evidence that carries deployment identity
  (activation audit, activation plan, LIVEIMPORT readback, production UI
  clickthrough) must now include the expected SHA when the gate is run with
  `--expected-sha`. Current rerun preflight for `380308d1` passes build-info
  and public smoke and remains blocked only on protected prerequisites plus
  stale/failed release evidence.

- `RELEASE-GATE-RESTORE-ROLLBACK-SHA-BINDING-2026-05-24` is implemented and
  partially verified. Future restore drill and rollback proof artifacts now
  carry optional expected SHA metadata and are written to the canonical
  evidence/artifact buckets consumed by the release gate. The release gate now
  rejects fresh restore/rollback proof that does not reference the expected
  deployment SHA when one is supplied.

- `RELEASE-GATE-RC-SHA-BINDING-2026-05-24` is implemented and partially
  verified. RC external gate status, RC sign-off, and RC checklist artifacts
  now support expected SHA metadata, and release evidence readiness rejects
  fresh RC docs that are not tied to the expected deployment SHA.

- `RELEASE-OPERATOR-UNBLOCK-PACKET-380308D1-2026-05-24` is partially verified
  as the current no-secret protected-proof handoff. The protected input
  readiness sweep for
  `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1` found `0` matching protected
  input names in this shell and wrote current JSON/Markdown evidence. The
  operator unblock packet for the same SHA validates successfully and keeps V1
  at `NO-GO` until protected inputs, production restore context,
  `LIVEIMPORT-03`, rollback proof, production UI clickthrough, Gate 2 SLO
  evidence, and Gate 4/RC approval are refreshed for the deployed target.

- `OPERATOR-UNBLOCK-READINESS-CONSISTENCY-2026-05-24` is locally verified.
  The operator unblock validator now cross-checks the packet's protected-input
  readiness summary against the referenced readiness JSON. It fails on
  mismatched SHA, status, count, or unreadable readiness JSON, preventing a
  hand-edited packet from drifting away from its no-secret source evidence.

- `REUSABLE-AUDIT-HISTORY-PATH-RESOLVER-2026-05-24` is locally verified. The
  reusable-audit checkers now match the current repository layout: `history/*`
  evidence paths are repository-owned paths where relevant, and logical
  `docs/*` references resolve through `Soar - docs` when the physical `docs`
  root is absent through the shared `scripts/resolveRepositoryPath.mjs`
  helper. The full `audit:manifest:verify` aggregate passes again.

- `OPERATOR-UNBLOCK-DEFAULT-CURRENT-PACKET-2026-05-24` is locally verified.
  `ops:operator-unblock:check` now selects the latest dated operator unblock
  packet from `history/artifacts` by default, so aggregate validation checks
  the current `380308d1` packet unless a historical packet is explicitly
  requested.

- `V1-PREFLIGHT-RELEASE-GATE-GRAPH-REFRESH-2026-05-24` is partially verified
  and correctly `NO-GO`. A fresh no-secret preflight for
  `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1` passes build-info and public
  smoke, then blocks on missing protected auth/context and failed/stale release
  evidence. The V1 final preflight and release gate runners are now graph
  nodes linked into the release audit tooling chain. Validation passed:
  `architecture:graph:generate` `643` nodes / `798` relations / `27` chains;
  strict graph drift `796/796` covered / `0` missing; focused release/operator
  tests `40/40`; operator unblock check PASS with `NO-GO`.

- `V1-PROTECTED-INPUT-READINESS-REFRESH-380308D1-2026-05-24` is blocked as
  expected. The no-secret protected input readiness sweep was refreshed against
  the latest preflight timestamp `2026-05-24T16:46:29.583Z` and still found
  `0` matching protected input names. The current operator unblock packet
  validates against the refreshed readiness JSON and remains `NO-GO`.

- `ARCH-GRAPH-STRICT-GUARDRAIL-2026-05-24` is verified locally for graph
  enforcement. `pnpm run quality:guardrails` now runs the architecture graph
  drift audit in strict fail-on-drift mode, so future representative source,
  test, docs, config, or pipeline paths must be referenced by graph CSV records
  before guardrails can pass. Validation passed: `pnpm run
  architecture:graph:drift:strict` reported `796/796` covered and `0`
  missing; `node --test scripts/repoGuardrails.test.mjs` passed `9/9`;
  `pnpm run architecture:graph:generate` reported `643` nodes, `798`
  relations, and `27` chains; `pnpm run quality:guardrails` passed with
  `Architecture graph drift: OK`; `pnpm run docs:parity:check` passed. This
  is traceability enforcement only, not fresh runtime journey or production
  proof.

- `ARCH-GRAPH-FULL-DRIFT-CLOSURE-2026-05-24` is verified locally for graph
  traceability. The architecture evidence graph now covers the current
  representative inventory across source, tests, documentation, config, and
  pipeline paths. `pnpm run architecture:graph:generate` passes with `643`
  nodes, `798` relations, and `27` chains. `pnpm run
  architecture:graph:drift` passes with `796/796` covered and `0` missing.
  This is graph/documentation proof only; it does not replace fresh runtime
  journey proof, protected production proof, external security review, or live
  exchange-side mutation approval.

- `ARCH-EVIDENCE-GRAPH-SYSTEM-2026-05-24` is partially verified for the
  foundation slice. Soar now has the
  first foundation for an Obsidian-first architecture evidence graph: CSV node
  registries, relation records, function-chain records, generated Markdown
  nodes, generated graph exports, and a status report. `pnpm run
  architecture:graph:generate` passed with `45` nodes, `24` relations, and
  `4` chains; `pnpm run quality:guardrails` and
  `pnpm run docs:parity:check` also passed. This is documentation/tooling only
  and does not change runtime behavior, deployment, production data, or LIVE
  exchange mutation. It is a seed, not full repository backfill; unmapped code
  is not graph-verified.

- `ARCH-GRAPH-MANUAL-ORDER-BACKFILL-2026-05-24` is partially verified for the
  P0 graph-backfill slice. Manual order execution now has a detailed graph
  chain across Dashboard UI, Web API service, orders API routes, controller,
  DTO schemas, orders service, manual-context service, quantity rules,
  pre-trade, exchange boundary, execution orchestration, lifecycle, exchange
  events, `OrderFill`, tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `67` nodes, `51` relations, and
  `5` chains; guardrails and docs parity pass. This did not change runtime
  behavior or authorize LIVE mutation.

- `ARCH-GRAPH-POSITIONS-BACKFILL-2026-05-24` is verified for the next P0
  graph-backfill slice. Positions core now has a detailed graph chain across
  legacy route, Dashboard/runtime UI, Web positions service, Positions API
  routes, controller, DTO, service, exchange snapshot normalization, LIVE
  reconciliation, `Position`/`Order`/`Trade`, tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `93` nodes, `80` relations, and
  `6` chains. This is graph traceability proof only; it did not change runtime
  behavior, run production clickthrough, or authorize LIVE mutation.

- `ARCH-GRAPH-BOT-RUNTIME-BACKFILL-2026-05-24` is verified for the next P0
  graph-backfill slice. Bot Runtime monitoring now has a detailed graph chain
  across bot runtime routes, monitoring UI, Web bots service, runtime
  aggregate/session/symbol-stat/position/trade/close API routes, controller,
  DTO, aggregate/read/command services, runtime/trading DB models, tests, and
  docs. `pnpm run architecture:graph:generate` now passes with `115` nodes,
  `103` relations, and `7` chains. This is graph traceability proof only; it
  did not change runtime behavior, run authenticated production readback, or
  authorize LIVE mutation.

- `ARCH-GRAPH-EXCHANGE-ADAPTER-BACKFILL-2026-05-24` is verified for the next
  P0 graph-backfill slice. Exchange Adapter now has a detailed graph chain
  across broad and exact capability contracts, authenticated/public read
  boundaries, adapter boundary, connector factory, CCXT futures connector, live
  order adapter, fee reconciliation, symbol rules, market catalog, API-key
  probe client, consumers, tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `142` nodes, `129` relations,
  and `8` chains. This is graph traceability proof only; it did not change
  exchange behavior, run production mutation proof, or authorize LIVE mutation.

- `ARCH-GRAPH-WALLETS-BACKFILL-2026-05-24` is verified for the next P0
  graph-backfill slice. Wallets now has a detailed graph chain across wallet
  root/list/create/edit/preview routes, wallet table/form/preview components,
  Web wallet service, wallet API routes, controller, DTO schemas, wallet
  service, exchange capability/authenticated-read/adapter-boundary links,
  ledger/cashflow services, Wallet/Bot/Position/Order data dependencies,
  focused API/Web/ledger tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `176` nodes, `177` relations,
  and `9` chains. This is graph traceability proof only; it did not change
  wallet runtime behavior, run authenticated browser proof, or authorize LIVE
  mutation/readback.

- `ARCH-GRAPH-PROFILE-API-KEYS-BACKFILL-2026-05-24` is verified for the next
  P0 graph-backfill slice. Profile API Keys now has a detailed graph chain
  across profile API-key UI, Web service, API routes, controller, DTO schemas,
  encrypted storage, connection probes, exchange probe client boundary, API-key
  and log DB models, Wallets/Bot Runtime consumers, focused API/Web/probe
  tests, and docs. `pnpm run architecture:graph:generate` now passes with
  `202` nodes, `212` relations, and `10` chains. This is graph traceability
  proof only; it did not change credential runtime behavior, run authenticated
  browser proof, or run secret-bearing production probe proof.

- `ARCH-GRAPH-BOT-SETUP-BACKFILL-2026-05-24` is verified for the next P0
  graph-backfill slice. Bot Setup now has a detailed graph chain across
  bot list/create/edit routes, list/form components, Web bots service, bot
  lifecycle API routes, controller, DTO schemas, context validation,
  activation policy, canonical update scope, market-group/strategy-link
  topology services, Bot/Wallet/API-key/Strategy/MarketUniverse/
  BotMarketGroup/MarketGroupStrategyLink DB dependencies, focused API/Web
  tests, and docs. `pnpm run architecture:graph:generate` now passes with
  `229` nodes, `251` relations, and `11` chains. This is graph traceability
  proof only; it did not change bot runtime behavior, run authenticated browser
  proof, or authorize LIVE activation.

- `ARCH-GRAPH-STRATEGIES-BACKFILL-2026-05-24` is verified for the next
  graph-backfill slice. Strategies now has a detailed graph chain across
  strategy list/create/edit routes, list/form/preset components, Web
  strategies service, form mapping, presets, indicator catalog, strategy API
  routes, controller, DTO/config validation, strategy service, Strategy/Bot/
  MarketGroupStrategyLink DB guards, Bot Setup and Bot Runtime consumers,
  focused API/Web/indicator/utility tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `261` nodes, `293` relations,
  and `12` chains. This is graph traceability proof only; it did not change
  strategy runtime behavior, run authenticated browser proof, or run
  production strategy mutation proof.

- `ARCH-GRAPH-MARKETS-BACKFILL-2026-05-24` is verified for the next
  graph-backfill slice. Markets now has a detailed graph chain across market
  universe list/create/edit routes, table/form/multiselect components, Web
  markets service, frontend helper utilities, catalog endpoint, API routes,
  controller, DTOs, markets service, exchange-catalog/symbol resolver,
  MarketUniverse/SymbolGroup/Bot/BotMarketGroup DB guards, Bot Setup and Bot
  Runtime consumers, focused API/Web tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `286` nodes, `329` relations,
  and `13` chains. This is graph traceability proof only; it did not change
  market runtime behavior, run authenticated browser proof, or run production
  market mutation proof.

- `ARCH-GRAPH-BACKTESTS-BACKFILL-2026-05-24` is verified for the next
  graph-backfill slice. Backtests now has a detailed graph chain across
  backtest list/create/detail routes, list/create/details components, Web
  backtests service, details view-model/presenter utilities, backtest API
  routes, controller, DTOs, backtests service, range resolver, run queue/job,
  data gateway, replay core, fill model, report lifecycle, immutable
  strategy/market snapshot resolver, BacktestRun/BacktestTrade/
  BacktestReport DB models, focused API/replay/Web tests, and docs.
  `pnpm run architecture:graph:generate` now passes with `324` nodes, `371`
  relations, and `14` chains. This is graph traceability proof only; it did
  not change backtest runtime behavior, run authenticated browser proof, or
  run heavy replay performance proof.

- `ARCH-GRAPH-REPORTS-BACKFILL-2026-05-24` is verified for the next
  graph-backfill slice. Reports now has a detailed graph chain across the
  reports dashboard route, `PerformanceReportsView`, Web reports service, Web
  backtests service, cross-mode reports API route, controller, backend reports
  service, mode aggregation utility, BacktestReport/BacktestTrade/Trade/Bot
  read models, focused API/Web tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `336` nodes, `396` relations,
  and `15` chains. This is graph traceability proof only; it did not change
  reports runtime behavior, run authenticated browser proof, or run production
  report readback.

- `ARCH-GRAPH-LOGS-AUDIT-BACKFILL-2026-05-24` is verified for the next
  graph-backfill slice. Logs/Audit Trail now has a detailed graph chain across
  the logs dashboard route, `AuditTrailView`, Web logs service, logs API route,
  controller, query schema, backend logs service, `Log` read model, API-key and
  Bot Setup audit-event producer links, focused API/Web tests, and docs.
  `pnpm run architecture:graph:generate` now passes with `349` nodes, `413`
  relations, and `16` chains. This is graph traceability proof only; it did
  not change logs runtime behavior, run authenticated browser proof, or run
  production action-produced readback.

- `ARCH-GRAPH-SUBSCRIPTIONS-ADMIN-BACKFILL-2026-05-24` is verified for the
  next graph-backfill slice. Subscriptions/Admin now has a detailed graph
  chain across admin subscription/user routes, admin layout, profile
  subscription UI, frontend admin/profile services, admin users and plan API
  routes, profile subscription/checkout routes, controllers, DTO schemas,
  subscription services, entitlement guard, checkout intent persistence,
  SubscriptionPlan/UserSubscription/PaymentIntent/User models, focused
  API/entitlement/Web tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `387` nodes, `463` relations,
  and `17` chains. This is graph traceability proof only; it did not change
  subscription/admin runtime behavior, run authenticated browser proof, or run
  production admin mutation proof.

- `ARCH-GRAPH-AI-ASSISTANT-FOUNDATION-BACKFILL-2026-05-24` is verified for
  the next graph-backfill slice. AI Assistant foundation now has a detailed
  graph chain across bot assistant routes, `BotsAssistantTab`, assistant
  controller hook, Web bot service, assistant config/subagent/dry-run API
  routes, bots controller validation, `BotAssistantService`,
  `AssistantOrchestrator`, BotAssistantConfig/BotSubagentConfig/Bot models,
  assistant API/orchestrator/Web/protocol tests, assistant runtime docs,
  AI testing protocol, AI integration docs, red-team agent, and red-team
  prompt. `pnpm run architecture:graph:generate` now passes with `411` nodes,
  `499` relations, and `18` chains. This is graph traceability proof only; it
  did not change assistant runtime behavior, run authenticated browser proof,
  run a production assistant readback, or approve hot-path AI trading.

- `ARCH-GRAPH-DRIFT-DETECTION-2026-05-24` is verified for the next graph
  tooling slice. `pnpm run architecture:graph:drift` now inventories
  representative route/service/test/page/component/doc/config/pipeline files
  and compares them with file paths referenced by architecture graph CSV
  records. Latest result after Auth Session deep backfill: `796`
  inventoried files, `534` covered by graph CSV path references, and `262`
  missing;
  `apiRoutes` is `22/22` covered and `configAndPipelines` is `9/9` covered. Outputs are
  `docs/status/architecture-graph-drift.md` and
  `history/artifacts/architecture-graph-drift-2026-05-24.json`. This is
  informational until full repository graph backfill is complete.

- `ARCH-GRAPH-OPS-CONFIG-PIPELINE-BACKFILL-2026-05-24` is verified for the
  next graph-backfill slice. Operations config and pipeline now has a graph
  chain across root package scripts, pnpm workspace, API/Web/Mobile/Shared
  package manifests, local and VPS compose topology, GitHub CI workflow,
  repository guardrails, and local/testing/deployment docs. Graph tooling now
  resolves the active documentation root when the workspace uses `Soar - docs`
  instead of a physical `docs` directory. `pnpm run architecture:graph:generate`
  now passes with `426` nodes, `519` relations, and `19` chains. This is graph
  traceability proof only; it does not replace remote CI run status, protected
  production deployment proof, or a repository decision about the documentation
  directory name.

- `ARCH-GRAPH-API-SUPPORT-ROUTES-BACKFILL-2026-05-24` is verified for the
  next graph-backfill slice. API support routes now have a graph chain across
  the root API router, dashboard aggregate router, admin aggregate router,
  icons lookup route/controller/service/schema, market-stream SSE route and
  fanout/service boundary, profile basic routes/controller/schema/service,
  profile security routes/controller/schema/service, avatar upload route and
  processing boundary, User model dependency, focused API tests, and module
  docs. `pnpm run architecture:graph:generate` now passes with `461` nodes,
  `559` relations, and `20` chains. `pnpm run architecture:graph:drift` now
  reports `apiRoutes` at `22/22` with total coverage `425/796` and `371`
  remaining gaps. This is graph traceability proof only; it did not change API
  runtime behavior or run a fresh authenticated browser journey.

- `ARCH-GRAPH-RUNTIME-SUPPORT-SERVICES-BACKFILL-2026-05-24` is verified for
  the next graph-backfill slice. Runtime support services now have a graph
  chain across bot ownership, API-key resolution, LIVE consent, read
  projections, response mapping, portfolio history, runtime DCA display,
  imported/external position ownership, market truth/fallbacks, signal display,
  strategy context parsing, symbol universe resolution, trade lifecycle,
  paper lifecycle/runtime, position management, pre-trade risk, rule
  evaluation, runtime capital context, focused tests, DB dependencies, and
  docs. `pnpm run architecture:graph:generate` now passes with `500` nodes,
  `577` relations, and `21` chains. `pnpm run architecture:graph:drift` now
  reports total coverage `466/796` and `330` remaining gaps. This is graph
  traceability proof only; it did not run fresh runtime journeys or protected
  LIVE actions.

- `ARCH-GRAPH-API-PLATFORM-SAFETY-BACKFILL-2026-05-24` is verified for the
  next graph-backfill slice. API platform safety now has a graph chain across
  critical secrets readiness, proxy trust, runtime execution config, env
  loading, auth/rate-limit/request-logger/ops-network/trusted-origin
  middleware, error handling, shared errors, HTTP error mapping, logger,
  symbols, focused config/middleware/lib tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `520` nodes, `597` relations,
  and `22` chains. `pnpm run architecture:graph:drift` now reports total
  coverage `478/796` and `318` remaining gaps. This is graph traceability
  proof only; it did not run a fresh adversarial security review.

- `ARCH-GRAPH-WEB-RUNTIME-SURFACES-BACKFILL-2026-05-24` is verified for the
  next graph-backfill slice. Web runtime surfaces now have graph records across
  Dashboard Home runtime sidebar, onboarding, signals, derivations, UI helpers,
  trade metadata, formatters, Bots monitoring tabs, monitoring sections,
  protection cells, attribution pills, future signals, portfolio history,
  label/formatter helpers, Web runtime API service links, focused tests, and
  module docs. `pnpm run architecture:graph:generate` now passes with `543`
  nodes, `624` relations, and `23` chains. `pnpm run architecture:graph:drift`
  now reports total coverage `510/796` and `286` remaining gaps. This is graph
  traceability proof only; it did not run a fresh browser journey proof.

- `ARCH-GRAPH-AUTH-SESSION-DEEP-BACKFILL-2026-05-24` is verified for the next
  graph-backfill slice. Auth Session now has graph records across public auth
  pages, login/register forms, password visibility control, auth hooks, Web
  auth service, AuthContext, API register/login/me/logout routes, auth
  controller, auth service, cookie/JWT/error/session-token helpers, auth types,
  User model, Web/API auth tests, and auth module docs. `pnpm run
  architecture:graph:generate` now passes with `573` nodes, `659` relations,
  and `24` chains. `pnpm run architecture:graph:drift` now reports total
  coverage `534/796` and `262` remaining gaps. This is graph traceability
  proof only; it did not run fresh production auth browser proof.

- `SOAR-FULL-READINESS-COORDINATION-2026-05-23` is active. The operator asked
  the coordinator to drive Soar toward fully correct operation. Current
  evidence-backed truth after the 2026-05-24 cleanup: local `HEAD` and
  `origin/main` both point at
  `52be8b614d2da9ec05d368ac4fbd05f3ec8f8332` with `HEAD...origin/main` at
  `0 0`. Public production is not currently verified: `curl` to Web
  build-info, API `/health`, and API `/ready` timed out with `Failed to
  connect` during validation. Local validation passed repository
  guardrails, docs parity, typecheck, and the focused runtime automation
  exchange-PnL/service/DCA parity pack (`3` files / `41` tests). Transient
  auth/browser artifacts under `.tmp/` and `tmp/` were removed, and these
  folders are now ignored. Follow-up infrastructure diagnostics show DNS still
  points Web/API/VPS hostnames to `141.227.149.67`, but TCP fails on ports
  `80`, `443`, and `22`, Jina reports `ERR_ADDRESS_UNREACHABLE`, and SSH to
  configured VPS users times out; no OVH/Coolify/VPS control token is available
  locally. The remaining high-risk readiness gap is infrastructure
  reachability plus real user journey evidence: restore VPS/provider/Coolify
  access first, then run authenticated app readbacks for the reported broken
  flows.
  Any LIVE exchange mutation proof still requires proper auth/context and
  explicit operator approval for live-money actions.

- `RUNTIME-DCA-EXCHANGE-PNL-THRESHOLD-2026-05-23` is locally verified. After
  the operator reported that the second DCA threshold at `50%` did not fire
  while the dashboard row showed loss past the threshold, runtime automation
  now uses exchange `unrealizedPnl / marginUsed` as PnL threshold truth for
  `EXCHANGE_SYNC` positions when available. Lifecycle mark price remains the
  order execution price. Regression coverage proves a short `SOLUSDT` row with
  about `-62.5%` exchange PnL, `currentAdds=1`, and DCA levels `-25%` /
  `-50%` submits DCA level index `1` even when a newer ticker price would
  model a smaller local drawdown. Validation passed: runtime automation
  exchange-PnL/service tests `38/38`, position-management/DCA parity tests
  `27/27`, API typecheck, repository guardrails, docs parity, and diff check.
  No production auth, LIVE bot activation, order, position, or exchange
  mutation was used. Evidence:
  `history/tasks/runtime-dca-exchange-pnl-threshold-2026-05-23-task.md`.

- `PROJECT-ORGANIZATION-PRECOMMIT-POLISH-2026-05-23` is verified. Final
  pre-commit organization polish aligned root and policy entrypoints with the
  new documentation model: `README.md` points to the current docs map,
  documentation overview, and history overview; `apps/mobile` is described as
  scaffold-only; repository structure policy lists the real docs categories;
  `.gitignore` now routes the rotating RC evidence artifact ignore rule to
  `history/artifacts/`. Current proof: markdown link check `1816` files /
  `482` relative or file links / `0` missing targets; docs graph scan `258`
  docs markdown files / `0` no-incoming files excluding root semantic hubs /
  `0` isolated docs files; stale old docs artifact/index path scan clean;
  repository guardrails PASS; docs parity PASS; diff check found no whitespace
  errors, only Windows LF/CRLF warnings. Evidence/task:
  `history/tasks/project-organization-precommit-polish-2026-05-23-task.md`.

- `DOC-USABILITY-ROUTING-IMPROVEMENT-2026-05-23` is verified. After the docs
  graph and content cleanup, the documentation system now routes work more
  directly: `docs/soar-documentation-map.md` has decision-oriented work
  routes, `docs/maps/agent-work-map.md` names current-source/evidence/status
  rules, `docs/CONTRIBUTING-DOCS.md` defines the usefulness standard, and
  repository policy/inventory/drift records now consistently route historical
  proof and raw generated output to `history/*`. Current proof: markdown link
  check `1814` files / `482` relative or file links / `0` missing targets;
  docs graph scan `258` docs markdown files / `0` no-incoming files excluding
  root semantic hubs / `0` isolated docs files; repository guardrails PASS;
  docs parity PASS; diff check found no whitespace errors, only Windows
  LF/CRLF warnings. Evidence/task:
  `history/tasks/doc-usability-routing-improvement-2026-05-23-task.md`.

- `DOC-FINAL-CONTENT-CLARITY-SCAN-2026-05-23` is verified. The last content scan classified `runtime` and `audit`-like docs by
  role: active runtime contracts, runbooks, and reusable audit registry remain
  in `docs/`; historical UI/security audit snapshots moved to
  `history/audits`; active UX files now use baseline/template names; ADR 0001
  now records Soar agent governance instead of a generic template baseline;
  active runbooks now direct generated evidence to `history/artifacts`,
  `history/evidence`, or `history/releases`. Current graph/link proof:
  `258` docs markdown files, `0` no-incoming files excluding root semantic
  hubs, `0` fully isolated files; markdown link check `1813` files / `474`
  relative targets / `0` missing targets. Evidence/task:
  `history/tasks/doc-final-content-clarity-scan-2026-05-23-task.md`.

- `DOC-HUB-FILENAME-SEMANTICS-2026-05-23` is verified. Current docs and
  history area hubs have been renamed away from generic `README.md` and
  `index.md` filenames so Obsidian graph nodes expose area names such as
  `soar-documentation-map.md`, `architecture-documentation.md`,
  `module-registry.md`, `operations-documentation.md`, and
  `history-overview.md`. This preserves the local-cluster model from
  `DOC-LOCAL-INDEX-COHESION-2026-05-23` while improving hover readability for
  humans and routing clarity for agents. Validation passed: no `README.md` or
  `index.md` files remain under `docs/` or `history/`; docs graph scan shows
  `260` docs markdown files, `0` no-incoming files excluding root semantic
  hubs, and `0` fully isolated files; markdown link check covered `1812`
  markdown files, `476` relative targets, and `0` missing targets; repository
  guardrails and docs parity passed; `git diff --check` found no whitespace
  errors, only Windows CRLF warnings. Evidence/task:
  `history/tasks/doc-hub-filename-semantics-2026-05-23-task.md`.

- `DOC-LOCAL-INDEX-COHESION-2026-05-23` is verified. Current docs files are
  connected through nearest semantic area hubs rather than one global hub:
  product, security, UX, governance, analysis, modules, architecture
  reference/archive, operations, planning, contracts, flows, testing, and root
  docs navigation are covered. The scan improved from
  `200` no-incoming docs files and `193` fully isolated docs files to `0`
  no-incoming docs files excluding `docs/soar-documentation-map.md` and
  `docs/documentation-overview.md`, and `0` fully isolated docs files.
  Validation passed: markdown link check
  `1811` docs/history/agent markdown files with `0` missing targets,
  `pnpm run quality:guardrails`, `pnpm run docs:parity:check`, and
  `git diff --check` with CRLF warnings only.
  This is docs/content only: no runtime behavior, deployment, production data,
  or LIVE exchange mutation is involved. Evidence/task:
  `history/tasks/doc-local-index-cohesion-2026-05-23-task.md`.

- `DOC-CONTENT-GRAPH-HYGIENE-2026-05-23` is verified. The `docs/` Obsidian
  graph should now be less hub-heavy without losing current documentation
  navigation: `docs/soar-documentation-map.md` and `docs/maps/*` keep markdown links only for
  high-signal routes, while secondary references are plain code paths for
  agent readability without extra graph edges. Link-density scan changed the
  broad hub profile from `docs/soar-documentation-map.md` `48` links and maps at `13-22` links
  to top docs hub `10`, `docs/soar-documentation-map.md` `6`, and docs maps `4-6`. Validation
  passed: markdown link check covered `1805` docs/history/agent markdown files
  with `0` missing targets, `pnpm run quality:guardrails` passed, and
  `pnpm run docs:parity:check` passed. This is docs/content only: no runtime
  behavior, deployment, production data, or LIVE exchange mutation is involved.
  Evidence/task:
  `history/tasks/doc-content-graph-hygiene-2026-05-23-task.md`.

- `DOC-KNOWLEDGE-TAXONOMY-REFINEMENT-2026-05-23` is verified. The repository
  history archive is now refined into semantic folders:
  `history/tasks`, `history/plans`, `history/audits`, `history/evidence`,
  `history/releases`, and `history/artifacts`. This keeps `docs/` for current
  canonical documentation, `docs/planning` for active/durable plans, and
  `docs/operations` for living runbooks/status procedures. Validation passed:
  old taxonomy path scan `0`, markdown link check `1804` files / `0` missing
  targets, dated markdown scan under `docs/` returned no files, `pnpm run
  quality:guardrails` passed, and `pnpm run docs:parity:check` passed. This is
  docs/tooling only: no runtime behavior, deployment, production data, or LIVE
  exchange mutation is involved. Evidence/task:
  `history/tasks/doc-knowledge-taxonomy-refinement-2026-05-23-task.md`.

- `DOC-KNOWLEDGE-SYSTEM-RESTRUCTURE-2026-05-23` is verified. The repository
  now separates current documentation from historical work records: completed
  task contracts and dated/generated proof live in `history/`, while `docs/`
  is kept for canonical product, architecture, module, operations, UX,
  governance, and navigation maps. Validation passed: exact moved-path scan
  found `0` stale old paths, markdown relative-link check covered `1732`
  docs/history files with `0` missing targets, `pnpm run quality:guardrails`
  passed, and `pnpm run docs:parity:check` passed. This is docs/tooling only:
  no runtime behavior, deployment, production data, or LIVE exchange mutation
  is involved. Evidence/task:
  `history/tasks/doc-knowledge-system-restructure-2026-05-23-task.md`.

- `WEB-DASHBOARD-DCA-PROTECTION-TRUTH-PARITY-2026-05-23` is locally verified.
  Dashboard Home no longer reconstructs TTP protection from frontend-only
  `trailingTakeProfitLevels` fallback after the backend suppresses dynamic TTP
  behind DCA gates. The Web TTP display resolver now ignores local fallback
  fields as protection truth while preserving API-provided backend/prospective
  TTP. Validation passed: focused Web runtime table/view-model pack `45/45`,
  Web typecheck, repository guardrails, and `git diff --check`. No production
  auth or live exchange mutation was used. Evidence:
  `history/audits/web-dashboard-dca-protection-truth-parity-2026-05-23-task.md`.

- `LIVE-EXCHANGE-EXECUTION-PARITY-2026-05-23` is locally verified for the
  exchange-rule repair and partially production-verified by public deploy
  evidence. Protected production LIVE readback and any new mutation are still
  intentionally blocked until transient Soar app auth and/or fresh operator
  approval are available. The Gate.io ADAUSDT failure was not a simple Binance
  notional leak. Local investigation found a real exchange-adapter gap:
  Gate.io CCXT returns spot and swap markets whose symbols/ids both normalize
  to `ADAUSDT`, so generic symbol resolution could select the spot market for
  a futures/swap context. The fix now prefers configured market type, filters
  market maps by market type, carries `contractSize` through symbol rules,
  computes manual/pretrade notional as `quantity * markPrice * contractSize`,
  and sizes runtime LIVE derivative orders with contract size before
  orchestration and wallet funds checks. Read-only probe after the fix showed
  Gate.io ADAUSDT swap `minAmount=1`, `contractSize=10`, mark about `0.2421`,
  so the smallest honest ADAUSDT Gate.io position was about `2.421 USDT`; the
  previous `<=1 USDT` cap is impossible for that contract. Validation passed:
  focused API tests `9` files / `129` tests, API typecheck, repository
  guardrails, and diff check. Commit
  `9d1a83875767cd0227be9e2a899b2170a74034cf` is now deployed on public
  production after approved Coolify manual redeploy/force-start for
  `soar-web`, `soar-api`, and `workers-execution`; Web build-info reports
  `9d1a8387` on `main` with `metadataSource=github-branch` and build id
  `1tCeTjS9PmOJLsdQ6fVIG`, and public smoke passes API `/health`, API
  `/ready`, and Web `/`. This is not an authenticated manual/bot readback:
  the current shell still has no Soar app password, token, session cookie, API
  key secret, or private ops auth env var. No new production LIVE mutation was
  performed after the fix. Follow-up docs/state commit
  `a0e4f117ec9ecec770518ff186cc7f5ec087b76e` is also deployed after a manual
  Coolify `Force Start` for the queued `soar-web` deployment; current public
  Web build-info reports `a0e4f117` on `main` with
  `metadataSource=github-branch` and build id `AnqfCfwjz3KEHQ-_bouFD`, and
  public no-worker smoke still passes API `/health`, API `/ready`, and Web
  `/`. The submitted-close dedupe plus Gate.io manual-context proof commit
  `314e90cedf1cd0cc32699f47fb87d0bd08838146` is also deployed after Coolify
  queue recovery for `soar-web`, `soar-api`, and split worker resources; Web
  build-info reports `314e90ce` with `metadataSource=github-branch`, build id
  `7ysWp6y0xFAxM53oPR98y`, and public smoke passes API `/health`, API
  `/ready`, and Web `/`. Additional DB-backed proof now covers the
  manual-order context route and service for Gate.io futures: with mocked exchange rules
  `minAmount=1`, `minNotional=5`, `amountPrecision=1`, `contractSize=10`,
  mark price `0.25`, leverage `5`, and requested `quantity=4`, both service
  and route proof return `minExecutableQty=2`, estimated notional `10 USDT`,
  and estimated margin `2 USDT`. The broader focused pack also fixed a LIVE
  close lifecycle truth bug: reused submitted close dedupe now remains
  `submitted` instead of claiming `closed` before exchange/fill completion.
  Evidence:
  `history/audits/live-exchange-execution-parity-2026-05-23-task.md`.

- `RUNTIME-DCA-PROTECTION-DISPLAY-PARITY-2026-05-23` is locally verified.
  The operator reported Binance dashboard drift where a strategy with three
  DCA levels showed TSL after DCA count `2`, and `SOLUSDT` showed TSL while
  the table still showed DCA count `0`. The fix applies the same side-aware
  DCA protection contract to the Positions API read-model: TTP display waits
  for profit-side DCA levels to be satisfied, and TSL display waits for
  loss-side DCA levels to be satisfied. Exchange-confirmed DCA fill sync also
  persists `executedDcaLevelIndices` from the runtime dedupe fingerprint so
  runtime state does not rely only on a count. Validation passed: Positions
  serialization/read-model tests `32/32`, exchange-event DB-backed tests
  `19/19` after `pnpm run go-live:infra:up`, runtime position-management and
  automation tests `62/62`, and API typecheck. No production LIVE mutation was
  performed. Evidence:
  `history/audits/runtime-dca-protection-display-parity-2026-05-23-task.md`.

- `GATEIO-LIVE-MANUAL-ORDER-ADA-SHORT-2026-05-23` is verified fail-closed.
  The operator approved a real LIVE manual ADAUSDT short with position value
  not greater than 1 USDT. Manual context returned mark price about `0.2422`,
  so the attempted `SELL MARKET` quantity `4` had estimated notional
  `0.9688` USDT. The Gate.io bot was temporarily activated with
  `liveOptIn=true` and `consentTextVersion=mvp-v1`, then
  `POST /dashboard/orders/open` returned `400 LIVE_PRETRADE_NOTIONAL_BELOW_MIN`.
  No larger retry was made because that would exceed the approved cap. The bot
  was immediately deactivated again and final readback shows
  `isActive=false`, `liveOptIn=false`, `consentTextVersion=null`; there are no
  open ADAUSDT orders for the Gate.io bot and no Gate.io ADAUSDT position was
  created by this attempt. Evidence:
  `history/tasks/gateio-live-manual-order-ada-short-2026-05-23-task.md`.

- `GATEIO-LIVE-BOT-CONTEXT-REPAIR-2026-05-23` is verified for the
  operator-requested production configuration repair. The reported bot-create
  blocker was caused by `Main gateio` being saved as
  `BINANCE / FUTURES / USDT` while the selected wallet `Gate.io` was
  `LIVE / GATEIO / FUTURES / USDT`; this correctly triggered the
  wallet-market context mismatch guard. The Gate.io stored API key read-only
  probe passed for futures, Gate.io futures catalog read returned data, the
  `Main gateio` market universe was updated to `GATEIO / FUTURES / USDT`, and
  inactive bot `Gate.io RSI 20/80`
  (`ff5ed1a5-eda3-4efc-a5ad-3ba3db2be0b1`) was created using wallet
  `076fe127-1287-4f0c-9cc3-149b6f7af3ae`, market universe
  `1ec7933b-abdf-4343-be5f-d50f06b1252a`, and strategy
  `3264841b-1efa-4a70-a8e9-b6cfa9ec1384`. The bot remains
  `isActive=false` and `liveOptIn=false`; no LIVE activation, exchange order,
  position mutation, or raw secret persistence occurred. Evidence:
  `history/tasks/gateio-live-bot-context-repair-2026-05-23-task.md`.

- `PROTECTED-APP-TEST-CREDENTIAL-AVAILABILITY-2026-05-23` records a new
  operator-confirmed protected test context: the Soar production application
  account `wroblewskipatryk@gmail.com` on `https://soar.luckysparrow.ch` has
  an API key configured and may be used for authenticated app/API-key testing.
  No password, API key secret, token, cookie, or private header is stored in
  repository artifacts. This supersedes the earlier "only Coolify credential
  available" blocker for planning purposes, but authenticated smoke is still
  not claimed until the secret is supplied transiently and the smoke run
  passes. Evidence:
  `history/tasks/protected-app-test-credential-availability-2026-05-23-task.md`.

- `DATA-MODEL-ISOLATED-DB-PROOF-2026-05-23` is locally verified. After local
  Postgres/Redis were unavailable and Laragon was found running without
  PostgreSQL, Docker Desktop was started and `pnpm run go-live:infra:up`
  brought up `soar-postgres-1` and `soar-redis-1`. `pnpm run
  audit:data:db-isolated` passed with Prisma schema validation, migration
  status, full reset/replay of `55` migrations, wallets `24/24`, backtests
  `15/15`, and runtime repository `2/2`. `pnpm run
  ops:db:backup-restore:check-local` passed and wrote
  `history/evidence/v1-db-restore-check-2026-05-23T13-05-22-623Z.md`.
  Production migration status and production backup/restore freshness remain a
  separate protected ops gate. The docs/state commit for this proof was pushed
  and production Web build-info later exposed
  `069aa36f4918cbf4ed062f50425288dff30a2b89` on `main` with
  `metadataSource=github-branch` and build id `orQiE9zTo_TVTcAoXpzI6`; public
  smoke passed for API `/health`, API `/ready`, and Web `/`. Evidence:
  `history/evidence/data-model-isolated-db-proof-2026-05-23-task.md`.

- `WEB-BUILD-INFO-RUNTIME-FALLBACK-2026-05-23` is verified and deployed for
  code commit `f822adef3381cd74412d6ee248a84298b9ac04be`. It repaired a
  deploy-proof regression where production Web build `ownhF2rz9PTbbfD7bjapg`
  returned `gitSha: null` and `metadataSource: unknown` after manual Coolify
  deployment of `49a59b69`. `/api/build-info` is now dynamic, includes a
  no-store runtime GitHub `main` fallback when file/env metadata is missing,
  and build-time GitHub metadata resolution retries transient Coolify network
  failures. Production validation passed after manual Coolify queue cleanup and
  `soar-web` trigger: build-info converged to `f822adef`, and public smoke
  passed API `/health`, API `/ready`, and Web `/`. Authenticated app smoke and
  protected `/workers/ready` are not claimed without valid Soar app
  credentials. Evidence/task:
  `history/evidence/web-build-info-runtime-fallback-2026-05-23-task.md`.

- `DEPLOY-BUILD-INFO-FRESHNESS-GATE-HARDENING-2026-05-23` is locally verified.
  The deploy freshness wait script no longer accepts a matching SHA by itself:
  it logs and validates `metadataSource` plus `buildId`, accepts build-time
  metadata sources by default, rejects runtime fallback sources such as
  `github-branch-runtime`, and rejects non-real production build ids. Focused
  node coverage proves the pass and false-positive fail cases. The latest
  verified production response before this record for
  `dd3191d73944f534800659b2dfd0bf5e0bd8b52f` passes the stricter gate with
  `metadataSource=github-branch` and build id `PrpSx-bTjsSwKw5bQemwh`; public
  smoke also passes. Evidence:
  `history/evidence/deploy-build-info-freshness-gate-hardening-2026-05-23-task.md`.

- `AI-ASSISTANT-FOUNDATION-PROTOCOL-HARNESS-2026-05-23` is locally verified.
  The current assistant architecture remains foundation/dry-run only under
  `DEC-AUD-002`; no BACKTEST/PAPER/LIVE hot-path assistant call is claimed.
  Added reproducible `AI_TESTING_PROTOCOL.md` scenario coverage for the
  accepted foundation scope, with deterministic tests for forbidden actions,
  mandates, trace sanitization, and edge confidence handling. Validation
  passed: protocol harness `3/3`, assistant orchestrator foundation `6/6`,
  and Web assistant routes `3/3`. Evidence:
  `history/tasks/ai-assistant-foundation-protocol-harness-2026-05-23-task.md`
  and
  `history/plans/ai-assistant-foundation-protocol-report-2026-05-23.md`.

- `V1-PROTECTED-APP-PROOF-B1BA69ED-2026-05-23` is the current protected
  production release-gate truth, and
  follow-up docs/state sync commits are required to prove the pushed `HEAD`
  through public Web build-info plus public deploy smoke after each push. The
  `b1ba69ed` release
  proof passed build-info, deploy smoke, authenticated `/workers/ready`,
  split-worker topology, production DB restore drill, rollback proof,
  production UI clickthrough, RC Gates 1-4, sign-off, and SLO
  health/readiness/5xx/queue-lag objectives. `LIVEIMPORT-03` passes by
  read-only auto-discovering the real open runtime symbols `SOLUSDT` and
  `BNBUSDT`; both readbacks are `EXCHANGE_SYNC`, `BOT_MANAGED`,
  `OWNED_AND_MANAGED`, and `IN_SYNC`. Final preflight has no blockers and the
  full non-dry-run production release gate is `ready`. Follow-up deploys first
  required manually forcing queued Coolify `soar-web` deployments; the latest
  verified public production checkpoint before this record is
  `dd3191d73944f534800659b2dfd0bf5e0bd8b52f`. Production Web build-info
  reports that SHA on `main` with `metadataSource=github-branch` and build id
  `PrpSx-bTjsSwKw5bQemwh`, and public deploy smoke passes for API `/health`,
  API `/ready`, and Web `/`. Earlier Coolify deploys had accumulated stale
  queued/in-progress worker/API deployments and required manual `soar-web`
  recovery; future docs-only or code commits must repeat the same build-info
  plus public-smoke proof for the pushed `HEAD`. Authenticated
  deploy smoke is not claimed for the latest docs/state sync because the
  available Coolify credential is not a valid Soar application password for
  `ai@luckysparrow.ch` (`401 Invalid email or password`).
  Evidence:
  `history/audits/v1-production-activation-evidence-audit-2026-05-23.md`,
  `history/plans/v1-production-activation-and-evidence-plan-2026-05-23.md`,
  `history/artifacts/liveimport-03-prod-readback-2026-05-23.json`,
  `history/releases/v1-final-preflight-b1ba69ed-2026-05-23-after-liveimport.md`,
  and
  `history/releases/v1-release-gate-prod-b1ba69ed-2026-05-23-after-liveimport.md`.
  No production LIVE order, position, exchange mutation, or bot activation
  change was performed by this proof or deploy follow-up.

- `ARCH-RUNTIME-P1-006-BACKTEST-MULTI-STRATEGY-MERGE-2026-05-23` is locally
  verified as the next architecture-code audit repair. Complete immutable
  multi-strategy backtest snapshots now replay through the same runtime
  weighted/exit-priority signal merge contract, keep ambiguous link-only
  snapshots fail-closed, persist the winning primary strategy on backtest
  trades, and expose merge diagnostics in report/timeline payloads. Local
  validation passed: runtime merge + backtest contract/job pack `24/24`,
  replay/kernel parity pack `34/34`, and API typecheck. Evidence:
  `history/audits/architecture-code-runtime-audit-2026-05-22-task.md`.

- `BACKTEST-NON-BINANCE-ORDER-BOOK-FAIL-CLOSED-2026-05-23` is locally
  verified. Non-Binance FUTURES backtests that use `ORDER_BOOK_*` strategy
  indicators now fail closed when supplemental data contains no historical
  order-book points, preserving explicit parity diagnostics instead of
  simulating against silent empty order-book history. This does not synthesize
  historical order-book data and does not claim real non-Binance historical
  order-book support. Validation passed: focused backtest pack `47/47` and
  API typecheck. Evidence:
  `history/tasks/backtest-non-binance-order-book-fail-closed-2026-05-23-task.md`.

- `RUNTIME-EXECUTION-DEDUPE-OBSERVABILITY-2026-05-23` is locally verified.
  Runtime execution dedupe now records `hit`, `miss`, `inflight`, and `retry`
  outcomes through the existing metrics store and exposes them in `/metrics`
  with per-command buckets plus retry error-class buckets. Validation passed:
  runtime dedupe service tests `13/13`, API typecheck, and `/metrics` route
  tests `5/5` after repo Postgres/Redis were started with
  `pnpm run go-live:infra:up`. Evidence:
  `history/tasks/runtime-execution-dedupe-observability-2026-05-23-task.md`.

- `REPO-SOT-CLEANUP-2026-05-23` is verified locally after the operator noticed
  duplicate architecture-looking folders. Current governance confirms
  `docs/architecture/` is canonical, while root `architecture/` and related
  root template folders from 2026-05-03 are obsolete competing scaffolding.
  The cleanup removes only those tracked template files and preserves
  referenced evidence by moving it under `docs/operations/`. It also fixes a
  P2 frontend legacy redirect drift for `/dashboard/orders` and
  `/dashboard/positions`, routing them to the matching Dashboard Home runtime
  tabs instead of the bot list. Validation passed: focused web
  route/middleware tests `7/7`, web typecheck, web build, docs parity,
  repository guardrails, and `git diff --check`. Follow-up production proof is
  superseded by later public checkpoints; the current verified public
  checkpoint before this record is
  `dd3191d73944f534800659b2dfd0bf5e0bd8b52f`, with public `/api/build-info`
  and no-worker smoke passing. Evidence:
  `history/tasks/repo-source-truth-cleanup-2026-05-23-task.md`.

- `WEB-PUBLIC-STATIC-READBACK-2026-05-22` is a public web deploy-proof repair
  after production probes showed the static root was externally reachable while
  dynamic public routes such as `/auth/login`, `/auth/register`, and
  `/api/build-info` were not locally reachable. These public proof routes now
  use static prerendering (`force-static`, no revalidation), and
  `/api/build-info` no longer forces per-request time data. Local validation
  passed: targeted auth cache contract `2/2`, `web build` with Next route
  output showing all three routes as `Static`, `web typecheck`,
  `quality:guardrails`, `git diff --check`, and production-mode local HTTP
  smoke returning `200` for `/auth/login`, `/auth/register`, and
  `/api/build-info`. Commit `1b351a51` was pushed to `main`; its production
  readback blocker is historical and superseded by later public readbacks.
  Current production Web build-info responds with
  `dd3191d73944f534800659b2dfd0bf5e0bd8b52f` on `main`, and public smoke
  passes for API `/health`, API `/ready`, and Web `/`. Evidence:
  `history/plans/deploy-freshness-1b351a51-2026-05-22.md`.

- `ARCH-RUNTIME-P1-002-004-MONEY-PATH-2026-05-22` is a local runtime/order
  repair from the architecture-code audit. Account updates now require source
  API-key identity and fail closed when the source is absent; runtime LIVE
  open/close/DCA paths now propagate deterministic dedupe-derived
  `clientOrderId` through exchange submission; and zero-quantity account
  updates mark positions as `DRIFT`/`RECOVERING` instead of closing without
  fill truth. Focused validation: exchange-event tests passed (`21/21`),
  exchange boundary/orders tests passed (`51/51`), runtime
  orchestrator/automation tests passed (`55/55`), and API typecheck passed.

- `ARCH-RUNTIME-P1-010-011-WORKERS-QUEUE-HEARTBEAT-2026-05-22` is a local
  OPS/WORKERS repair for the remaining durable queue and heartbeat findings
  from the runtime architecture audit. Split backtest ownership now stores run
  ids in Redis and `workers-backtest` consumes the existing backtest job from
  that durable queue; local inline execution remains explicit. Backtest retry
  now skips terminal runs and clears stale run-owned trades before retrying an
  active run. Worker bootstrap writes per-family Redis heartbeats, and
  `/workers/ready` requires fresh heartbeat proof for all required split-worker
  families. Focused validation: queue/job/heartbeat/ownership tests passed
  (`17/17`), workers health/readiness route tests passed (`7/7`), API
  typecheck passed, and `git diff --check` passed with line-ending warnings
  only. Evidence:
  `history/tasks/arch-runtime-p1-010-011-workers-queue-heartbeat-2026-05-22-task.md`.

- `ARCH-CODE-RUNTIME-AUDIT-2026-05-22` is the follow-up architecture-vs-code
  audit requested after the DCA close-gate repair. Four read-only lanes
  checked runtime lifecycle, orders/exchange fill authority, backtest/report
  parity, and ops/deploy topology against `docs/architecture`. Confirmed P0
  code drift was found and repaired: stale unproven runtime execution
  dedupe no longer resets to `execute`, and LIVE `FILLED` responses without
  exchange fill quantity no longer synthesize a local full fill or lifecycle
  mutation. LIVE lifecycle also no longer uses request price as fill price. A
  second safe-local pass fixed imported LIVE dynamic stop display fallback,
  backtest closed-candle windowing, reports settled-trade aggregation,
  deploy smoke worker readiness, VPS split-worker compose defaults, API DB
  readiness, and rollback worker-readiness proof. Validation passed: focused
  API pack `88/88`, readiness/backtest/report pack `20/20`, script syntax
  checks, and VPS compose config with required env. Laragon was running at
  `C:\laragon\laragon.exe`, but local Postgres required repo
  `go-live:infra:up`; that pitfall is recorded in the learning journal.
  Remaining open audit findings are tracked in
  `history/audits/architecture-code-runtime-audit-2026-05-22-task.md`.

- `RUNTIME-ARCHITECTURE-DCA-TP-PARITY-2026-05-22` is a local runtime
  architecture parity checkpoint after operator feedback that bot lifecycle
  functions still do not match the architecture docs. Review of the DCA-first
  lifecycle contracts found confirmed implementation drift in close gating:
  basic `TP` could bypass pending profit-side DCA levels, and `SL`/`TSL`
  used an all-DCA gate instead of matching only pending loss-side DCA.
  Runtime position management now uses side-specific gates: `TP`/`TTP`
  wait on remaining profit-side DCA, while `SL`/`TSL` wait on remaining
  loss-side DCA. Backtest replay / interleaved portfolio helpers use the
  same side-specific close blocking. Validation passed: focused combined
  runtime/backtest pack `104/104`, SL/TSL correction pack `71/71`, API
  typecheck, repository guardrails, and diff check with line-ending warnings
  only.
  Production `soar.luckysparrow.ch` and `api.soar.luckysparrow.ch` probes
  timed out from this shell during the checkpoint; that is tracked as a
  separate ops/deploy blocker, not local code evidence. Evidence:
  `history/audits/runtime-architecture-dca-tp-parity-2026-05-22-task.md`.

- `LIVE-DCA-SUBMITTED-FILL-GATE-2026-05-22` is an emergency live-trading
  safety fix for runtime DCA. Operator feedback showed that DCA could be
  treated as progressed even when the LIVE exchange order had only been
  submitted and no fill was confirmed, which could allow stop/TSL protection
  to proceed from false DCA state. Runtime position automation now fails
  closed after submitted-only DCA: it restores the previous runtime state,
  does not emit `DCA_EXECUTED`, does not increment DCA stats, and returns
  before same-tick close protection. Exchange fill handling remains the
  authority that advances DCA state after a confirmed fill. Local validation:
  focused runtime automation tests passed (`37/37`) and API typecheck passed.
  Evidence:
  `history/tasks/live-dca-submitted-fill-gate-2026-05-22-task.md`.

- `V1-LOGIN-API-STARTUP-HOTFIX-2026-05-22` is closed as an emergency
  production availability hotfix after pushing `beae3ada` to `main`.
  Production Web initially reported `beae3ada`, while
  `https://api.soar.luckysparrow.ch` returned `503` for `/health`, `/ready`,
  and `/build-info`, making login unavailable. Local reproduction confirmed
  the API startup guard failed when production had legacy
  `API_KEY_ENCRYPTION` material but not the newer `API_KEY_ENCRYPTION_KEYS`
  keyring. The code hotfix allows startup with a strong legacy fallback, and
  the Coolify `soar-api` production environment was then repaired with
  generated high-entropy `JWT_SECRET`, `API_KEY_ENCRYPTION_KEYS`, and
  `API_KEY_ENCRYPTION_ACTIVE_VERSION=v1` values. Production evidence after
  redeploy: Web build-info reports `7fe389cb4ed3914b2e3aafac0832bcfca7da44b5`,
  public API `/health` returns `200`, public API `/ready` returns `200`, and
  `POST /auth/login` from the Web origin reaches the API and returns an
  expected invalid-credentials response with CORS for
  `https://soar.luckysparrow.ch`. Local validation: focused readiness tests
  `17/17`, typecheck, API build, VPS compose config, legacy-startup check,
  guardrails, and guardrail tests.

- `V1-PROTECTED-APP-PROOF-ATTEMPT-DD1A1FAF-2026-05-21` advanced the current
  protected `AUD-19` blocker from generic missing app auth to specific fresh
  proof facts for deployed `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`.
  Operator packet validation passed and production build-info still reports
  `dd1a1faf` on `main`. Protected production UI clickthrough passed for
  public, dashboard, and admin coverage. Rollback proof passed with
  `shouldRollback=false`, runtime freshness `PASS`, and no alerts.
  `LIVEIMPORT-03` reached an authenticated RUNNING Binance FUTURES LIVE
  session, but remains fail-closed because there are no open runtime positions
  or open orders to prove; the visible runtime data is closed historical
  `BNBUSDT` / `XRPUSDT` only. The controlled proof runner failed safely before
  mutation because the target LIVE bot is already active. Gate 4 sign-off is
  approved. Fresh 30-minute production SLO is `FAIL`: `/workers/ready`
  availability is `0%`, API 5xx ratio is `16.6667%`, and the artifact reports
  deployed `inline` worker topology (`DEPLOYED_INLINE_MODE`) rather than the
  canonical split-worker contract. V1 remains `NO-GO` pending split-worker
  topology repair/verification, a safe open runtime readback payload,
  production DB restore evidence, and the final non-dry-run release gate.
  Evidence:
  `history/evidence/v1-protected-app-proof-attempt-dd1a1faf-2026-05-21-task.md`,
  `history/plans/prod-ui-module-clickthrough-dd1a1faf-2026-05-21.md`,
  `history/evidence/v1-rollback-proof-prod-2026-05-21T00-00-00-000Z.md`,
  `history/artifacts/liveimport-03-prod-readback-dd1a1faf-2026-05-21.json`,
  `history/evidence/v1-slo-observation-2026-05-21T15-28-20-108Z.md`, and
  `docs/operations/v1-rc-signoff-record.md`.

- `SUPPLY-CHAIN-SAST-OPS-AUDIT-2026-05-21` is a completed local defensive
  Ops/Supply-Chain/SAST checkpoint. It checked dependency/supply-chain hygiene,
  Docker/compose, env templates, secret handling, logging artifacts,
  CI/scripts, SSRF/egress surfaces, file upload/static assets, and production
  readiness gates against NIST SSDF, CISA Secure by Design, and OWASP
  cheat-sheet expectations. Confirmed local fix: protected ops/release proof
  scripts reject secret-bearing CLI flags and require existing env-var secret
  families; root `.gitignore` and repository guardrails now block tracked
  runtime `.env` files outside redacted examples and block reintroduced
  secret-bearing ops-script argv parsers. Validation passed: guardrail tests
  `9/9`, repository guardrails, production dependency audit, VPS/local compose
  config, API/Web typecheck, script syntax checks, manual secret-argv
  fail-closed checks, and diff check with line-ending warnings only. No
  production command, protected proof, real secret use, or LIVE exchange
  mutation was run. Evidence:
  `history/audits/supply-chain-sast-ops-audit-2026-05-21-task.md`.

- `BACKEND-PERMISSION-ISOLATION-REVIEW-2026-05-21` is a completed local
  defensive backend security checkpoint. It reviewed auth/session middleware,
  admin guards, API-key ownership, representative user-scoped reads/writes,
  request DTO allowlists, and denial tests against architecture and OWASP
  defensive guidance. Confirmed and fixed one API-key create allowlist defect:
  API-key controllers now pass parsed DTO payloads, and service create data is
  explicit rather than raw-body spread. A DB-backed regression proves
  request-supplied `id`, `userId`, `lastUsed`, `createdAt`, and `updatedAt`
  are not persisted. Validation passed: API-key e2e `18/18`,
  auth/admin/API-key pack `34/34`, isolation/reports/wallets pack `28/28`,
  and API typecheck. No production access, external probing, credential
  discovery, or LIVE exchange mutation was performed. Evidence:
  `history/tasks/backend-permission-isolation-review-2026-05-21-task.md`.

- `FRONTEND-SECURITY-UX-OWASP-SWEEP-2026-05-21` is a completed local
  Frontend Security/UX checkpoint. It verified Web auth bootstrap, protected
  data flash prevention, admin gating, CSP/header assumptions, browser storage
  usage, CSRF-sensitive UI call shape, clickjacking/HSTS assumptions, and
  money-action confirmations. Confirmed fixes landed only in Web: API-key
  response normalization now drops unmasked returned credential values, and
  profile/API-key axios error presentation uses the shared redaction resolver
  in production-sensitive paths. Validation passed: focused Web profile/error
  tests (`4` files / `28` tests), broader Web auth/admin/header/money pack
  (`7` files / `23` tests), Web typecheck, and `git diff --check` with
  line-ending warnings only. No backend changes, production commands, or
  LIVE exchange mutation were run. Evidence:
  `history/tasks/frontend-security-ux-owasp-sweep-2026-05-21-task.md`.

- `MONEY-FLOW-SECURITY-CANCEL-ENTITLEMENT-2026-05-21` is a current
  Security/Money-Flow checkpoint. It found and fixed a confirmed local P1
  fail-closed gap: exchange-backed LIVE order cancel checked ownership and
  `riskAck`, but did not re-check the user's current `liveTrading` entitlement
  before the exchange cancel boundary. This could affect both manual cancel
  and runtime stale-order lifetime cancel after subscription downgrade. The
  cancel path now calls `assertSubscriptionAllowsLiveTrading(userId)` before
  adapter invocation and before local status mutation. Focused DB-backed tests
  were added for allowed entitlement and downgraded FREE fail-closed behavior.
  Validation passed: API typecheck and repository guardrails. The focused DB
  test was attempted but blocked before assertions because local Postgres
  `localhost:5432` and local Docker were unavailable in this session. No
  production commands, no protected proof, and no real LIVE exchange mutation
  were run.
  Evidence:
  `history/tasks/money-flow-security-cancel-entitlement-2026-05-21-task.md`.

- `SECURITY-RED-TEAM-HARDENING-2026-05-21` is the latest local security
  hardening sweep. The coordinator reran the security agents after the first
  background set was closed, then integrated completed second-round reports
  across Auth, Secrets/Ops, Trading/Money Safety, and Frontend Security. Fixed:
  stale admin tokens after demotion by sourcing auth context from the database
  and incrementing `sessionVersion` on role changes; auth IP rate limiting;
  fail-closed production ops private-network defaults; weak/placeholder secret
  readiness and unsafe VPS compose defaults; API-key lifecycle audit logs;
  sensitive URL/query/error metadata redaction; runtime close `riskAck`
  defaulting false; execution-time LIVE entitlement checks; Gate.io swap
  reduce-only/hedge/leverage handling; unknown LIVE status mapping to `OPEN`;
  min-notional price-truth fail-closed behavior; stricter production CSP;
  safer production UI error redaction; and known Next.js / `ws` production
  dependency vulnerabilities. Validation passed: production dependency audit
  with no known vulnerabilities, guardrails, API/Web typecheck, production
  build, focused API/Web security regression packs, DB-backed e2e reruns, and
  exchange/order/runtime focused packs. This is local security evidence, not a
  claim that the system is uncrackable; protected `AUD-19`, external
  penetration/VPS configuration review, and explicit LIVE exchange-side
  mutation proof remain separate gates.
  Evidence: `history/tasks/security-red-team-hardening-2026-05-21-task.md`.

- `SECURITY-RED-TEAM-HARDENING-2026-05-21` continuation closed the residual
  local security queue with three coordinated lanes. Frontend Security fixed
  auth-confirmed Dashboard runtime loading, Admin shell role-gate clarity, and
  API-key response typing/normalization. Backend Security added DB-backed LIVE
  entitlement downgrade proof and fixed order/runtime-close entitlement errors
  to return `403` instead of a generic server error. Ops/Security fixed the P1
  stage-rehearsal secret argv/artifact leak, hardened `.env.vps.example`,
  added non-root API/Web/worker runtime Docker images with guardrail coverage,
  added production HSTS, and narrowed local compose datastore ports to
  `127.0.0.1`. Validation passed: script/guardrail tests, Web `151` files /
  `530` tests, API focused `17` + `38` tests, API/Web typecheck, i18n audit
  `0`, production dependency audit, VPS compose config, build, guardrails, and
  diff check. Cleanup evidence: local DB/Redis stopped, no Soar containers,
  and no `chrome-headless-shell` rows. Remaining gates are external/protected:
  penetration/VPS review, protected `AUD-19`, and explicit LIVE exchange-side
  mutation proof.

- `LOCAL-CERTAINTY-CLOSURE-2026-05-21` is the latest local confidence sweep.
  With three agent lanes and coordinator integration, it closed the remaining
  locally executable P2 queue: Reports now has immutable `Trade.executionMode`
  snapshots and snapshot-first PAPER/LIVE aggregation; bot preview/assistant
  routes use localized breadcrumbs; Profile Basic is safer on mobile; Admin
  Subscriptions uses shared loading/error states; Wallet PAPER reset uses the
  shared confirmation modal; Dashboard Home tests reflect the runtime
  confirmation gate. Validation passed: Prisma generate/reset/validate/status,
  focused Reports tests (`2` files / `5` tests), API typecheck, focused Web
  tests (`6` files / `22` tests and `2` files / `31` tests), Web typecheck,
  guardrails, docs parity, route i18n audit (`0` findings), lint, build, full
  Web Vitest (`149` files / `522` tests), full API Vitest in one-worker fork
  mode, go-live smoke (`45` API tests, `18` Web tests), and `git diff --check`.
  Protected production `AUD-19` remains the only release-readiness blocker and
  requires approved protected inputs.

- `REST-IMPLEMENTATION-SWEEP-2026-05-21` checked the remaining local
  implementation with Frontend/UX, Backend/Runtime, and QA/Regression lanes.
  Confirmed and fixed: Dashboard Home LIVE manual order/cancel/close now
  require explicit operator confirmation before `riskAck: true`; Web runtime
  close/cancel service wrappers no longer default to `{ riskAck: true }`; API
  LIVE manual runtime close fails closed when no trusted close reference price
  is available instead of using `entryPrice`; Admin Users role/plan mutations
  now require confirmation. Validation passed: focused Web tests (`4` files /
  `14` tests), focused API tests (`4` files / `99` tests), Web typecheck, and
  API typecheck. Remaining gaps are tracked as follow-ups, not hidden DONE:
  protected `AUD-19`, Reports execution-mode snapshot migration, Admin
  ViewState polish, bot preview/assistant i18n drift, wallet reset modal
  consistency, profile mobile layout polish, native mobile deferred scope, and
  assistant hot-path orchestration deferred scope.

- `FRONTEND-ENGINE-UX-DCA-SWEEP-2026-05-21` responded to the operator's
  frontend UX concern and DCA/TSL/TTP ordering concern with three subagent
  lanes. Confirmed and fixed: backtest replay and interleaved portfolio
  simulation could close by `TTP` while affordable profit-side DCA levels were
  still pending; both now use the same DCA-first close guard. Runtime/PAPER
  core already had the profit-side DCA/TTP guard. Frontend fixes: bots
  monitoring avoids aggregate-mode first-open double-fetch, Dashboard Home has
  regression coverage for rendering runtime widgets during auth bootstrap, and
  Reports now loads completed runs and cross-mode performance in parallel with
  per-run partial degradation. Validation passed: focused API tests (`4` files
  / `99` tests), focused Web tests (`3` files / `22` tests), API typecheck,
  Web typecheck, and repository guardrails.

- `DASHBOARD-POST-LOGIN-PERF-2026-05-21` responds to the operator-reported
  slow post-login Dashboard Home load. The dashboard route no longer blocks
  the first runtime widgets mount behind client `/auth/me`; unauthenticated and
  expired sessions still fail closed through middleware and API 401 handling.
  Dashboard Home runtime bootstrap now starts per-bot runtime graph loading in
  parallel with session loading instead of waiting for sessions first. Focused
  Web proof passed (`useHomeLiveWidgetsController.test.tsx` and
  `dashboard.a11y.smoke.test.tsx`, `6` tests), Web typecheck passed, and local
  browser validation on seeded data rendered `/dashboard` with no console
  warnings/errors, heading visible in about `560 ms`, and runtime content ready
  in about `1.1 s`.

- `V1-GAP-HUNT-2026-05-21` continued the broad function/user-path verification
  with three agent lanes for Backend/API, Frontend/UX, and Ops/Security.
  Confirmed fixes: production UX proof now fails closed on runtime exceptions
  and console error/warning events instead of reporting PASS with a warning; the
  Reports module now has DB-backed route e2e proof for unauthenticated rejection
  and authenticated user scoping of cross-mode performance. Validation passed:
  `node --check scripts/runProdUxA11yMobileProof.mjs`, API typecheck, focused
  Reports API tests (`2` files / `4` tests), `docs:parity:endpoints:api`,
  route-reachable i18n audit, and `audit:manifest:verify`. Remaining gaps are
  unchanged in kind: protected `AUD-19`, LIVE exchange-side mutation, assistant
  hot-path orchestration, native mobile, and current production authenticated
  clickthrough require protected inputs or explicit scope decisions.

- `V1-FUNCTION-ARCHITECTURE-VERIFICATION-2026-05-20` is the latest local
  function/architecture sweep. Parallel agent lanes found no confirmed local
  frontend defect and no runtime architecture mismatch requiring product
  decision. Confirmed fixes: API package `start` is now production-safe and
  guarded against destructive reset/seed regression; wallet unsupported
  exchange-capability test now expects `marketType` in the exact capability
  error details; module docs now reflect Gate.io exact operation support and
  assistant foundation/dry-run scope; `SOAR-OPERATIONS-001` is `PARTIAL /
  Medium` because current local gates are fresh but protected `AUD-19`
  production evidence is still absent. Validation passed: guardrails, docs
  parity, guardrail regression tests, endpoint parity, `audit:manifest:verify`,
  lint, typecheck, build, full Web tests, full API Vitest in a controlled
  one-worker local-infra window, i18n route audit, sequential
  `audit:data:db-isolated`, and go-live smoke. Evidence:
  `history/tasks/v1-function-architecture-verification-2026-05-20-task.md`.

- `REQUIREMENTS-DELIVERY-MAP-AUDIT-2026-05-19` is the latest `AUD-02` evidence.
  It also refreshed `AUD-00` generated evidence for 2026-05-19: project index
  passed with V1 statuses `PASS:21` and tests indexed `335`, and static scan
  passed with findings `0`. Follow-up refreshed `.agents/state/delivery-map.md`,
  restored risk-ID uniqueness by renumbering the audit-process row to
  `RISK-036`, and synchronized continuation state with the final rollup and
  fresh generated audit evidence. `AUD-02` is current for source-of-truth
  alignment after follow-up; production-boundary rows remain intentionally
  partial where fresh production proof was not run. Evidence:
  `history/audits/requirements-delivery-map-audit-2026-05-19.md`,
  `history/artifacts/requirements-delivery-map-audit-2026-05-19.json`,
  `history/plans/project-index-2026-05-19.md`, and
  `history/audits/v1-static-issue-scan-2026-05-19.md`.

- `FULL-REUSABLE-AUDIT-ROLLUP-2026-05-19` is the current `AUD-00` through
  `AUD-23` rollup. It records current local evidence, historical production
  evidence, deferred mobile scope, and explicit exclusions for production
  mutation, LIVE order/cancel/close, exchange-side mutation, and existing
  production data mutation. `AUD-01` and `AUD-20` are current after accepted
  decisions; `AUD-19` remains the next production-readiness gate before any new
  production readiness claim.
  Evidence: `history/audits/full-reusable-audit-rollup-2026-05-19.md` and
  `history/artifacts/full-reusable-audit-rollup-2026-05-19.json`.

- `AUDIT-DECISION-PACKET-2026-05-19` records accepted audit decisions:
  `DEC-AUD-001` sets current exchange implementation scope to Binance + Gate.io,
  not Binance-only; `DEC-AUD-002` sets current assistant truth to
  foundation/dry-run and defers hot-path orchestration. No runtime behavior or
  production/LIVE/exchange mutation changed. Evidence:
  `history/audits/audit-decision-packet-2026-05-19.md`,
  `history/artifacts/audit-decision-packet-2026-05-19.json`, and
  `history/audits/audit-decision-packet-2026-05-19-task.md`.

- `AUDIT-DECISION-REPAIR-PLAYBOOKS-2026-05-19` remains as historical
  option-specific repair guidance for the now-accepted audit decisions. It did
  not change runtime behavior; it lists files, steps, validation gates, and
  stop conditions that were used to apply `DEC-AUD-001` and `DEC-AUD-002`.
  Evidence:
  `history/audits/audit-decision-repair-playbooks-2026-05-19.md`,
  `history/artifacts/audit-decision-repair-playbooks-2026-05-19.json`, and
  `history/audits/audit-decision-repair-playbooks-2026-05-19-task.md`.

- `FULL-REUSABLE-AUDIT-HANDOFF-2026-05-19` is the resume packet for the full
  reusable audit mission. It summarizes current source-of-truth files,
  validation, resolved decisions, residual risks, and next-task instructions.
  Evidence:
  `history/audits/full-reusable-audit-handoff-2026-05-19.md`,
  `history/artifacts/full-reusable-audit-handoff-2026-05-19.json`, and
  `history/audits/full-reusable-audit-handoff-2026-05-19-task.md`.

- `REUSABLE-AUDIT-ARTIFACT-MANIFEST-2026-05-19` maps `AUD-00` through
  `AUD-23` to current reports, JSON artifacts, task records, resolved decisions,
  and safety boundaries for future reruns. Evidence:
  `history/audits/reusable-audit-artifact-manifest-2026-05-19.md`,
  `history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json`, and
  `history/audits/reusable-audit-artifact-manifest-2026-05-19-task.md`.

- `V1-OPERATOR-UNBLOCK-TOOLING-INDEX-SYNC-2026-05-20` adds the current
  operator unblock packet validator to the reusable audit tooling index and
  primary `audit:manifest:verify` bundle. The reusable tooling index now
  reports `21/21` tools and the manifest bundle runs both
  `ops:operator-unblock:check:test` and the current packet validation. This is
  still no-secret tooling evidence; final V1 readiness remains blocked until
  protected same-date release evidence exists. Evidence:
  `history/audits/reusable-audit-tooling-index-2026-05-19.md`,
  `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`, and
  `history/releases/v1-operator-unblock-tooling-index-sync-2026-05-20-task.md`.

- `V1-AGENT-BLOCKER-SWEEP-DD1A1FAF-2026-05-20` is the latest coordinator
  verdict after the user explicitly requested parallel agents. Ops/Release and
  Planning/Queue lanes independently confirmed there is no remaining
  meaningful non-secret deployment task. Production build-info still reports
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` on `main`, the operator packet
  validator passes, and the rerun protected-input sweep still finds `0`
  matching protected input names. Evidence:
  `history/tasks/v1-agent-blocker-sweep-dd1a1faf-2026-05-20-task.md`,
  `history/evidence/v1-protected-input-readiness-dd1a1faf-2026-05-20-rerun.md`,
  and
  `history/artifacts/v1-protected-input-readiness-dd1a1faf-2026-05-20-rerun.json`.

- `V1-PROTECTED-RELEASE-UNBLOCK-HEARTBEAT-2026-05-20` is active as automation
  `v1-protected-release-unblock-check` every 30 minutes. Its instruction is to
  avoid more preparatory tooling while protected inputs are absent, and to
  execute the current operator packet only after approved protected inputs are
  present. Latest manual setup evidence still reports `0` matching protected
  input names, production build-info on `dd1a1faf` / `main`, and operator
  packet validation PASS. Evidence:
  `history/evidence/v1-protected-input-readiness-dd1a1faf-2026-05-20-latest.md`
  and
  `history/artifacts/v1-protected-input-readiness-dd1a1faf-2026-05-20-latest.json`.

- `I18N-COPY-REACHABILITY-AUDIT-2026-05-19` is the latest `AUD-22` evidence.
  Route-reachable i18n audit passed with findings `0`, localCopy `0`,
  fallbackPl `0`, and hardcoded `0`. Focused Web i18n pack passed (`8` files /
  `26` tests). Repository language policy remains English artifacts plus
  user-language communication. Evidence:
  `history/audits/i18n-copy-reachability-audit-2026-05-19.md`,
  `history/artifacts/i18n-copy-reachability-audit-2026-05-19.json`, and
  `history/audits/i18n-copy-reachability-audit-2026-05-19-task.md`.

- `MOBILE-CROSS-PLATFORM-SCOPE-AUDIT-2026-05-19` is the latest `AUD-21`
  evidence. Mobile remains scaffold-only: `apps/mobile` contains only package,
  README, and placeholder source files; mobile build/test scripts intentionally
  print deferred scaffold messages; `apps/mobile/README.md` and
  `docs/planning/mobile-parity-contract.md` state no production mobile runtime
  and no independent mobile backend contracts. Responsive Web mobile evidence
  remains under `AUD-05`, not native app parity. Evidence:
  `history/audits/mobile-cross-platform-scope-audit-2026-05-19.md`,
  `history/artifacts/mobile-cross-platform-scope-audit-2026-05-19.json`, and
  `history/audits/mobile-cross-platform-scope-audit-2026-05-19-task.md`.

- `OPERATIONS-RELEASE-DEPLOYMENT-AUDIT-2026-05-19` is the latest local
  `AUD-19` evidence. Local release-safety proof is current: typecheck, lint,
  build, go-live smoke, and local DB backup/restore check passed. Go-live
  smoke covered API (`4` files / `45` tests) and Web (`3` files / `18` tests).
  The local backup/restore check requires a running local Postgres container;
  the first no-infra run failed with that precondition, then passed after
  `go-live:infra:up` and produced
  `history/evidence/v1-db-restore-check-2026-05-19T01-30-47-200Z.md`. Local
  Postgres/Redis were stopped after the proof. No production deploy,
  production database mutation, production journey, LIVE mutation,
  exchange-side mutation, or existing production data mutation was performed.
  Evidence:
  `history/audits/operations-release-deployment-audit-2026-05-19.md`,
  `history/artifacts/operations-release-deployment-audit-2026-05-19.json`, and
  `history/audits/operations-release-deployment-audit-2026-05-19-task.md`.

- `POST-PUSH-BUILD-INFO-READBACK-36FF999D-2026-05-19` is the latest read-only
  production freshness check after pushing the audit/decision-sync commit.
  Public production smoke passed for the currently deployed service, but
  `/api/build-info` remained on
  `1586f59261cef94d7c513d71bbfcfb697d11ca59` with `gitRef: main`, not pushed
  commit `36ff999d`. Do not claim `36ff999d` is deployed or production-ready
  from this readback. No production mutation, database mutation, journey
  mutation, LIVE order/cancel/close, or exchange-side mutation was performed.
  Evidence:
  `history/evidence/post-push-build-info-readback-36ff999d-2026-05-19.md`,
  `history/artifacts/post-push-build-info-readback-36ff999d-2026-05-19.json`,
  and
  `history/evidence/post-push-build-info-readback-36ff999d-2026-05-19-task.md`.

- `MAIN-PROMOTION-BUILD-INFO-DD1A1FAF-2026-05-19` is the latest public deploy
  freshness checkpoint. It confirmed production tracks `main`, fast-forwarded
  `origin/main` from `1586f59261cef94d7c513d71bbfcfb697d11ca59` to
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`, waited until production
  build-info exposed `dd1a1faf`, and reran public no-worker deploy smoke
  successfully. No production data mutation, LIVE order/cancel/close,
  exchange-side mutation, existing production data mutation, or protected
  authenticated journey was performed. Full protected `AUD-19` release
  readiness still requires protected runtime, rollback, backup/restore, and
  sign-off evidence. Evidence:
  `history/evidence/main-promotion-build-info-dd1a1faf-2026-05-19.md`,
  `history/artifacts/main-promotion-build-info-dd1a1faf-2026-05-19.json`, and
  `history/evidence/main-promotion-build-info-dd1a1faf-2026-05-19-task.md`.

- `V1-PROTECTED-PREFLIGHT-DD1A1FAF-2026-05-20` is the latest no-secret
  protected release-gate classifier for deployed `dd1a1faf`. It passed
  production build-info for `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` and
  public API/Web smoke, then blocked on missing liveimport auth, rollback guard
  auth, production dashboard/admin UI auth, production DB restore context, and
  stale required protected release evidence for evidence date `2026-05-20`.
  The paired protected-input readiness sweep found `0` matching protected input
  names in this shell. No secret values were printed or stored; no production
  mutation, LIVE order/cancel/close, exchange-side mutation, runtime code
  change, or existing production data mutation was performed. Evidence:
  `history/releases/v1-final-preflight-dd1a1faf-2026-05-20.md`,
  `history/artifacts/_artifacts-v1-final-preflight-dd1a1faf-2026-05-20.json`,
  `history/evidence/v1-protected-input-readiness-dd1a1faf-2026-05-20.md`,
  `history/artifacts/v1-protected-input-readiness-dd1a1faf-2026-05-20.json`, and
  `history/tasks/v1-protected-preflight-dd1a1faf-2026-05-20-task.md`.

- `V1-OPERATOR-UNBLOCK-PACKET-DD1A1FAF-2026-05-20` is the current no-secret
  operator handoff for completing protected `AUD-19` evidence on the deployed
  `dd1a1faf` target. It points to the 2026-05-20 preflight and protected-input
  readiness reports, lists required auth/context and sign-off inputs, orders
  the remaining restore, liveimport, rollback, Gate2, Gate4, UI, final gate,
  and generated-state refresh steps, and records fail-closed stop conditions.
  It is not release approval. Evidence:
  `history/releases/v1-operator-unblock-packet-dd1a1faf-2026-05-20.md`,
  `history/artifacts/v1-operator-unblock-packet-dd1a1faf-2026-05-20.json`, and
  `history/releases/v1-operator-unblock-packet-dd1a1faf-2026-05-20-task.md`.

- `V1-OPERATOR-UNBLOCK-PACKET-CHECK-COMMAND-2026-05-20` makes the current
  no-secret operator packet machine-checkable. The new
  `corepack pnpm run ops:operator-unblock:check` command validates target SHA,
  evidence paths, protected input family names, remaining proof steps,
  forbidden boundaries, protected input readiness, and final acceptance rule.
  Focused tests passed and the current packet check passed for deployed
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`. Evidence:
  `scripts/checkOperatorUnblockPacket.mjs`,
  `scripts/checkOperatorUnblockPacket.test.mjs`, and
  `history/releases/v1-operator-unblock-packet-check-command-2026-05-20-task.md`.

- `PROTECTED-PREFLIGHT-DD1A1FAF-2026-05-19` is the prior no-secret protected
  release-gate classifier for deployed `dd1a1faf`. It passed build-info and
  public smoke, then blocked on missing liveimport auth, rollback guard auth,
  production dashboard/admin UI auth, production DB restore context, and stale
  2026-05-14 protected release evidence. This is expected without approved
  protected inputs and does not mutate production data, LIVE orders, exchange
  state, or existing production data. Evidence:
  `history/releases/v1-final-preflight-dd1a1faf-2026-05-19-noauth.md`,
  `history/artifacts/_artifacts-v1-final-preflight-dd1a1faf-2026-05-19-noauth.json`,
  and `history/tasks/protected-preflight-dd1a1faf-2026-05-19-task.md`.

- `RC-EVIDENCE-BLOCKED-DD1A1FAF-2026-05-19` is the latest no-secret RC packet
  for the deployed `dd1a1faf` target. It intentionally avoids overwriting the
  historical 2026-05-14 canonical PASS artifacts and records the current
  dated state as Gate 1 `PASS`, Gate 2 `OPEN`, Gate 3 `PASS`, Gate 4 `OPEN`,
  with strict RC evidence check failing on missing Gate 2 PASS and missing
  Gate 4 approver/owner fields. No production mutation, LIVE mutation,
  exchange-side mutation, protected authenticated journey, or fabricated
  approval was performed. Evidence:
  `history/releases/v1-rc-external-gates-status-dd1a1faf-2026-05-19-blocked.md`,
  `history/releases/v1-rc-signoff-record-dd1a1faf-2026-05-19-blocked.md`,
  `history/releases/v1-release-candidate-checklist-dd1a1faf-2026-05-19-blocked.md`,
  `history/artifacts/_artifacts-rc-evidence-check-dd1a1faf-2026-05-19-blocked.json`,
  and `history/releases/rc-evidence-blocked-dd1a1faf-2026-05-19-task.md`.

- `V1-OPERATOR-UNBLOCK-PACKET-DD1A1FAF-2026-05-19` is the current no-secret
  operator handoff for completing protected `AUD-19` evidence on the deployed
  `dd1a1faf` target. It confirms production build-info still points to
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`, lists required auth/context and
  sign-off inputs, orders the remaining restore, liveimport, rollback, Gate2,
  Gate4, UI, final gate, and generated-state refresh steps, and records
  fail-closed stop conditions. It is not release approval. Evidence:
  `history/releases/v1-operator-unblock-packet-dd1a1faf-2026-05-19.md`,
  `history/artifacts/v1-operator-unblock-packet-dd1a1faf-2026-05-19.json`, and
  `history/releases/v1-operator-unblock-packet-dd1a1faf-2026-05-19-task.md`.

- `V1-PROTECTED-INPUT-READINESS-DD1A1FAF-2026-05-19` is the latest names-only
  protected-input sweep for the current Codex shell. It found `0` matching
  protected input names and therefore confirms the protected `AUD-19` path is
  still blocked in this environment. No secret values were printed, copied, or
  stored. Evidence:
  `history/evidence/v1-protected-input-readiness-dd1a1faf-2026-05-19.md`,
  `history/artifacts/v1-protected-input-readiness-dd1a1faf-2026-05-19.json`, and
  `history/evidence/v1-protected-input-readiness-dd1a1faf-2026-05-19-task.md`.

- `PROTECTED-INPUT-READINESS-COMMAND-2026-05-19` adds reusable no-secret
  tooling for future protected-input sweeps:
  `corepack pnpm run ops:protected-inputs:check`. The command checks env names
  only, writes optional JSON/Markdown output, and has regression coverage for
  not leaking secret-like values. Evidence:
  `scripts/checkProtectedInputReadiness.mjs`,
  `scripts/checkProtectedInputReadiness.test.mjs`, and
  `history/evidence/protected-input-readiness-command-2026-05-19-task.md`.

- `AUDIT-REMEDIATION-PLAN-CHECK-2026-05-19` adds a machine-readable audit
  remediation master plan and validator:
  `corepack pnpm run audit:remediation-plan:check`. The check verifies phases
  `P0..P6`, work packages `WP-01..WP-08`, the current `AUD-19` blocker,
  closure commands, and safety boundaries; it is included in
  `audit:manifest:verify`. Evidence:
  `history/artifacts/audit-remediation-master-plan-2026-05-19.json`,
  `scripts/checkAuditRemediationPlan.mjs`,
  `scripts/checkAuditRemediationPlan.test.mjs`, and
  `history/audits/audit-remediation-plan-check-2026-05-19-task.md`.
  Follow-up `AUDIT-REMEDIATION-PLAN-REFERENCE-CHECK-2026-05-19` hardened the
  same validator to verify `sourceMarkdown` and `primaryEvidence` paths. The
  current check reports `7` references checked and `0` missing references.
  Evidence:
  `history/audits/audit-remediation-plan-reference-check-2026-05-19-task.md`.
  Follow-up
  `AUDIT-RERUN-PLAYBOOK-REMEDIATION-CLOSURE-SYNC-2026-05-19` updated the
  reusable audit rerun playbook and validator so rerun closure explicitly
  requires `audit:manifest:verify`, `audit:remediation-plan:check`, docs
  parity, guardrails, and diff check. Evidence:
  `history/audits/audit-rerun-playbook-remediation-closure-sync-2026-05-19-task.md`.
  Follow-up
  `AUDIT-TOOLING-INDEX-CLOSURE-COMMAND-CHECK-2026-05-19` hardened the tooling
  index validator so it fails if those same required closure commands are
  removed from the reusable tooling index. Evidence:
  `history/audits/audit-tooling-index-closure-command-check-2026-05-19-task.md`.
  Follow-up `AUDIT-HANDOFF-CHECK-COMMAND-2026-05-19` added
  `corepack pnpm run audit:handoff:check` and included it in
  `audit:manifest:verify`, making the full reusable audit handoff
  machine-checkable for source paths, residual risks, forbidden boundaries,
  validation checks, and fail-closed booleans. Evidence:
  `history/audits/audit-handoff-check-command-2026-05-19-task.md`.
  Follow-up `AUDIT-TOOLING-INDEX-PACKAGE-SCRIPT-CHECK-2026-05-19` hardened
  `audit:tooling-index:check` so `corepack pnpm run` commands in the reusable
  tooling index must exist in `package.json`. Evidence:
  `history/audits/audit-tooling-index-package-script-check-2026-05-19-task.md`.
  Follow-up `AUDIT-MANIFEST-SUMMARY-METADATA-CHECK-2026-05-19` hardened
  `audit:manifest:check` so declared summary counts and path metadata must
  match actual audit rows and collected paths. Evidence:
  `history/audits/audit-manifest-summary-metadata-check-2026-05-19-task.md`.
  Follow-up `AUDIT-ROLLUP-CHECK-COMMAND-2026-05-19` added
  `corepack pnpm run audit:rollup:check` and included it in
  `audit:manifest:verify`, making the full reusable audit rollup checkable for
  audit coverage, summary counts, source paths, repair queue, and safety
  booleans. Evidence:
  `history/audits/audit-rollup-check-command-2026-05-19-task.md`.
  Follow-up `AUDIT-MANIFEST-COMPARE-STATUS-BUCKET-CHECK-2026-05-19` aligned
  `audit:manifest:compare` with manifest and rollup validators by ranking only
  leading status buckets; hybrid current/deferred wording no longer produces a
  false regression. Evidence:
  `history/audits/audit-manifest-compare-status-bucket-check-2026-05-19-task.md`.
  Follow-up `AUDIT-MANIFEST-COMPARE-JSON-OUTPUT-2026-05-19` added
  `--json-output <path>` to `audit:manifest:compare`, so future reruns can
  persist machine-readable comparison reports instead of relying on copied
  terminal output. Evidence:
  `history/audits/audit-manifest-compare-json-output-2026-05-19-task.md`.
  Follow-up
  `AUDIT-RERUN-PLAYBOOK-COMPARE-JSON-OUTPUT-SYNC-2026-05-19` updated the
  reusable audit rerun playbook and validator so `compareJson` must use
  `--json-output` and produce a dated persisted comparison artifact. Evidence:
  `history/audits/audit-rerun-playbook-compare-json-output-sync-2026-05-19-task.md`.
  Follow-up `AUDIT-TOOLING-INDEX-MARKDOWN-JSON-PARITY-2026-05-19` hardened
  `audit:tooling-index:check` so the companion Markdown tooling table must
  list every JSON tool ID when the Markdown file is available. Evidence:
  `history/audits/audit-tooling-index-markdown-json-parity-2026-05-19-task.md`.
  Follow-up `AUDIT-MANIFEST-MARKDOWN-SUMMARY-PARITY-2026-05-19` hardened
  `audit:manifest:check` so the companion Markdown current-summary counts
  must match the JSON manifest summary when the Markdown file is available.
  Evidence:
  `history/audits/audit-manifest-markdown-summary-parity-2026-05-19-task.md`.
  Follow-up `AUDIT-ROLLUP-MARKDOWN-AUDIT-ID-PARITY-2026-05-19` hardened
  `audit:rollup:check` so the companion Markdown result table must list every
  JSON audit ID when the Markdown file is available. Evidence:
  `history/audits/audit-rollup-markdown-audit-id-parity-2026-05-19-task.md`.
  Follow-up `AUDIT-ROLLUP-MARKDOWN-SUMMARY-PARITY-2026-05-19` added checked
  summary counts to the rollup Markdown and hardened `audit:rollup:check` so
  those counts must match the JSON rollup summary. Evidence:
  `history/audits/audit-rollup-markdown-summary-parity-2026-05-19-task.md`.
  Follow-up `AUDIT-HANDOFF-ROLLUP-SUMMARY-PARITY-2026-05-19` added
  `rollupJson` to the handoff source chain and hardened `audit:handoff:check`
  so handoff `rollupSummary` keys and values must match the referenced rollup
  JSON. Evidence:
  `history/audits/audit-handoff-rollup-summary-parity-2026-05-19-task.md`.
  Follow-up `AUDIT-RERUN-PLAYBOOK-BASELINE-PATH-CHECK-2026-05-19` added
  `baseline.rollupJson` to the rerun playbook and hardened
  `audit:rerun-playbook:check` so baseline manifest and rollup paths must be
  complete and resolvable. Evidence:
  `history/audits/audit-rerun-playbook-baseline-path-check-2026-05-19-task.md`.
  Follow-up `AUDIT-REMEDIATION-PLAN-SELF-CHECK-CLOSURE-2026-05-19` hardened
  `audit:remediation-plan:check` so remediation closure must include the
  remediation-plan self-check command. Evidence:
  `history/audits/audit-remediation-plan-self-check-closure-2026-05-19-task.md`.
  Follow-up `AUDIT-TOOLING-INDEX-CLEANUP-CHECK-COMMAND-2026-05-19` hardened
  `audit:tooling-index:check` so cleanup checks must include
  `chrome-headless-shell`, `Get-NetTCPConnection`, and `docker compose ps`.
  Evidence:
  `history/audits/audit-tooling-index-cleanup-check-command-2026-05-19-task.md`.
  Follow-up `AUDIT-RERUN-PLAYBOOK-CLEANUP-CHECK-COMMAND-2026-05-19` hardened
  `audit:rerun-playbook:check` so rerun playbook cleanup checks must include
  those same local cleanup commands. Evidence:
  `history/audits/audit-rerun-playbook-cleanup-check-command-2026-05-19-task.md`.
  Follow-up `AUDIT-HANDOFF-SELF-CHECK-VALIDATION-2026-05-19` hardened
  `audit:handoff:check` so handoff `latestValidation` must include the
  handoff self-check command. Evidence:
  `history/audits/audit-handoff-self-check-validation-2026-05-19-task.md`.
  Follow-up `AUDIT-RERUN-PLAYBOOK-SELF-CHECK-CLOSURE-2026-05-19` hardened
  `audit:rerun-playbook:check` so rerun playbook closure must include the
  rerun-playbook self-check command. Evidence:
  `history/audits/audit-rerun-playbook-self-check-closure-2026-05-19-task.md`.
  Follow-up `AUDIT-TOOLING-INDEX-SELF-CHECK-CLOSURE-2026-05-19` hardened
  `audit:tooling-index:check` so tooling index closure must include the
  tooling-index self-check command. Evidence:
  `history/audits/audit-tooling-index-self-check-closure-2026-05-19-task.md`.
  Follow-up `AUDIT-REMEDIATION-PLAN-CLEANUP-CHECK-COMMAND-2026-05-19`
  hardened `audit:remediation-plan:check` so remediation cleanup checks must
  include `chrome-headless-shell`, `Get-NetTCPConnection`, and
  `docker compose ps`. Evidence:
  `history/audits/audit-remediation-plan-cleanup-check-command-2026-05-19-task.md`.
  Follow-up `AUDIT-HANDOFF-CLEANUP-VALIDATION-COMMAND-2026-05-19` hardened
  `audit:handoff:check` so handoff `latestValidation` must include cleanup
  evidence for headless browser processes, local DB/Redis listeners, and Docker
  compose services. Evidence:
  `history/audits/audit-handoff-cleanup-validation-command-2026-05-19-task.md`.
  Follow-up `AUDIT-HANDOFF-TOOLING-INDEX-SOURCE-CHECK-2026-05-19` hardened
  `audit:handoff:check` so the handoff source chain must include reusable
  tooling-index Markdown and JSON paths. Evidence:
  `history/audits/audit-handoff-tooling-index-source-check-2026-05-19-task.md`.
  Follow-up `AUDIT-HANDOFF-SELF-SOURCE-CHECK-2026-05-19` hardened
  `audit:handoff:check` so the handoff source chain must include the handoff
  Markdown and JSON self-source paths. Evidence:
  `history/audits/audit-handoff-self-source-check-2026-05-19-task.md`.
  Follow-up `AUDIT-MANIFEST-SOURCE-CHAIN-KEY-CHECK-2026-05-19` hardened
  `audit:manifest:check` so the reusable audit manifest must include all
  required source-chain keys before path validation can pass. Evidence:
  `history/audits/audit-manifest-source-chain-key-check-2026-05-19-task.md`.
  Follow-up `AUDIT-MANIFEST-SOURCE-CHAIN-PATH-CHECK-2026-05-19` hardened
  `audit:manifest:check` so required source-chain values must be repository
  paths, not empty strings or external URLs. Evidence:
  `history/audits/audit-manifest-source-chain-path-check-2026-05-19-task.md`.
  Follow-up `AUDIT-MANIFEST-SOURCE-CHAIN-EXACT-KEY-CHECK-2026-05-19` hardened
  `audit:manifest:check` so unexpected source-chain keys fail validation.
  Evidence:
  `history/audits/audit-manifest-source-chain-exact-key-check-2026-05-19-task.md`.
  Follow-up `AUDIT-MANIFEST-SAFETY-BOUNDARY-CHECK-2026-05-19` hardened
  `audit:manifest:check` so manifest safety-boundary booleans must remain
  fail-closed. Evidence:
  `history/audits/audit-manifest-safety-boundary-check-2026-05-19-task.md`.
  Follow-up `AUDIT-RERUN-PLAYBOOK-BASELINE-PATH-VALUE-CHECK-2026-05-19`
  hardened `audit:rerun-playbook:check` so required baseline values must be
  repository paths, not empty strings or external URLs. Evidence:
  `history/audits/audit-rerun-playbook-baseline-path-value-check-2026-05-19-task.md`.

- `DATA-MODEL-MIGRATIONS-AUDIT-2026-05-19` is the latest `AUD-07` evidence.
  Local schema and migration proof is current: Prisma schema validation passed,
  local migration status reported `54` migrations and schema up to date, full
  local migration replay applied all `54` migrations, schema diff generation
  passed, and isolated representative DB-backed tests passed for wallets (`1`
  file / `24` tests), backtests (`1` file / `15` tests), and runtime repository
  behavior (`1` file / `2` tests). Follow-up
  `corepack pnpm run audit:data:db-isolated` passed and now provides the
  canonical sequential reset-and-run path for representative DB-backed audit
  packs. The shared-DB parallel issue remains a run-policy pitfall, not a
  failed migration replay. Local Postgres/Redis were stopped after the proof.
  No production database, production journey, LIVE mutation, exchange-side
  mutation, or existing production data mutation was performed.
  Evidence: `history/audits/data-model-migrations-audit-2026-05-19.md`,
  `history/artifacts/data-model-migrations-audit-2026-05-19.json`, and
  `history/audits/data-model-migrations-audit-2026-05-19-task.md`.

- `WORKERS-RUNTIME-OPERATIONS-AUDIT-2026-05-19` is the latest `AUD-08`
  evidence. Local worker/runtime operations proof is current: the focused API
  worker/runtime pack passed (`17` files / `85` tests). Coverage includes
  worker ownership/topology, protected worker health/readiness, runtime
  freshness pass/fail/skip behavior, global `/ready` diagnostics,
  market-stream source config, subscriptions, fanout and routes, exchange
  polling, Binance stream parsing, queue tuning, backtest job persistence,
  execution orchestration, and PAPER runtime-flow telemetry. Expected stderr
  appeared only in the intentional Redis-startup retry test. Local
  Postgres/Redis were stopped after the DB-backed proof. No production
  journey, LIVE mutation, exchange-side mutation, or existing production data
  mutation was performed. Evidence:
  `history/audits/workers-runtime-operations-audit-2026-05-19.md`,
  `history/artifacts/workers-runtime-operations-audit-2026-05-19.json`, and
  `history/audits/workers-runtime-operations-audit-2026-05-19-task.md`.

- `ADMIN-SUBSCRIPTIONS-ENTITLEMENTS-AUDIT-2026-05-19` is the latest `AUD-18`
  evidence. Local admin/subscriptions proof is current: focused Web admin and
  profile subscription tests passed (`4` files / `9` tests), and DB-backed API
  admin/subscriptions/entitlements tests passed (`5` files / `25` tests).
  Coverage includes admin-only access, user listing with subscription metadata,
  role/plan updates, self-demotion prevention, plan/entitlement validation,
  profile subscription readback, bot limit and LIVE trading gates, and Web
  admin/profile subscription states. Local Postgres/Redis were stopped after
  the DB-backed proof. No production journey, LIVE mutation, exchange-side
  mutation, existing production data mutation, or production entitlement
  mutation was performed. Evidence:
  `history/audits/admin-subscriptions-entitlements-audit-2026-05-19.md`,
  `history/artifacts/admin-subscriptions-entitlements-audit-2026-05-19.json`,
  and
  `history/audits/admin-subscriptions-entitlements-audit-2026-05-19-task.md`.

- `LOGS-AUDIT-TRAIL-AUDIT-2026-05-19` is the latest `AUD-17` evidence. Local
  logs/audit-trail proof is current: focused Web logs/audit tests passed (`2`
  files / `3` tests), and DB-backed API logs/pagination tests passed (`2`
  files / `5` tests). Coverage includes authenticated reads, owner scoping,
  source/actor/severity filters, pagination defaults/bounds, action-produced
  event visibility, metadata trace text rendering, and Web logs route states.
  Local Postgres/Redis were stopped after the DB-backed proof. No production
  journey, LIVE mutation, exchange-side mutation, or existing production data
  mutation was performed. Evidence:
  `history/audits/logs-audit-trail-audit-2026-05-19.md`,
  `history/artifacts/logs-audit-trail-audit-2026-05-19.json`, and
  `history/audits/logs-audit-trail-audit-2026-05-19-task.md`.

- `BACKTESTS-REPORTS-AUDIT-2026-05-19` is the latest `AUD-16` evidence. Local
  backtests/reports proof is current: focused Web backtest/report UI tests
  passed (`15` files / `37` tests), and DB-backed API backtests/reports tests
  passed (`13` files / `114` tests). Coverage includes run lifecycle,
  ownership, explicit range validation, queue/job/replay, fill model, data
  gateway, runtime-kernel parity, immutable snapshot behavior,
  pending/degraded report lifecycle, trades/report/timeline reads, cross-mode
  aggregation, and Web route/detail/report states. Local Postgres/Redis were
  stopped after the DB-backed proof. No production journey, LIVE mutation,
  exchange-side mutation, or existing production data mutation was performed.
  Evidence: `history/audits/backtests-reports-audit-2026-05-19.md`,
  `history/artifacts/backtests-reports-audit-2026-05-19.json`, and
  `history/audits/backtests-reports-audit-2026-05-19-task.md`.

- `MARKETS-STRATEGIES-CONFIGURATION-AUDIT-2026-05-19` is the latest `AUD-15`
  evidence. Local markets/strategies configuration proof is current: focused
  Web market/strategy UI tests passed (`19` files / `60` tests), and
  DB-backed API markets/strategies tests passed (`4` files / `35` tests).
  Coverage includes market-universe composition, catalog behavior, market and
  strategy CRUD, ownership, active-bot guards, strategy import/export/config
  validation, inactive-bot edit allowance, active-bot lock UI, and indicator
  registry/presentation parity. Local Postgres/Redis were stopped after the
  DB-backed proof. No production journey, LIVE mutation, exchange-side
  mutation, or existing production data mutation was performed. Evidence:
  `history/audits/markets-strategies-configuration-audit-2026-05-19.md`,
  `history/artifacts/markets-strategies-configuration-audit-2026-05-19.json`,
  and
  `history/audits/markets-strategies-configuration-audit-2026-05-19-task.md`.

- `WALLETS-CAPITAL-LEDGER-AUDIT-2026-05-19` is the latest `AUD-14`
  evidence. Local wallets/capital-ledger proof is current: focused Web wallet
  and ledger UI tests passed (`10` files / `23` tests), and DB-backed API
  wallets/capital tests passed (`7` files / `84` tests). Coverage includes
  wallet CRUD, ownership, PAPER/LIVE validation, API-key binding, balance
  preview, active-bot edit/delete/reset guards, paper reset checkpoint,
  wallet-first bot contract, runtime capital source truth, cashflow/equity
  ledger states, and partial/unavailable ledger UI. Local Postgres/Redis were
  stopped after the DB-backed proof. No production journey, LIVE mutation,
  exchange-side mutation, or existing production data mutation was performed.
  Evidence: `history/audits/wallets-capital-ledger-audit-2026-05-19.md`,
  `history/artifacts/wallets-capital-ledger-audit-2026-05-19.json`, and
  `history/audits/wallets-capital-ledger-audit-2026-05-19-task.md`.

- `POSITIONS-RECONCILIATION-AUDIT-2026-05-19` is the latest `AUD-13`
  evidence. Local positions/reconciliation proof is current: focused Web
  runtime-position tests passed (`6` files / `46` tests), and DB-backed API
  positions/reconciliation tests passed (`11` files / `68` tests). Coverage
  includes list/read ownership, live-status, exchange snapshot selection,
  normalization and fail-closed behavior, takeover/rebind, orphan repair,
  imported history hydration, reconciliation diagnostics, runtime position
  derivations, and close-state UI. Expected stderr appeared only in tests that
  intentionally simulate ambiguous/unowned/missing-entry and snapshot-failure
  diagnostics. Local Postgres/Redis were stopped after the DB-backed proof. No
  production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `history/audits/positions-reconciliation-audit-2026-05-19.md`,
  `history/artifacts/positions-reconciliation-audit-2026-05-19.json`, and
  `history/audits/positions-reconciliation-audit-2026-05-19-task.md`.

- `ORDERS-MANUAL-TRADING-AUDIT-2026-05-19` is the latest `AUD-12` evidence.
  Local orders/manual trading proof is current: focused Web manual/open-order
  tests passed (`8` files / `46` tests), and DB-backed API order lifecycle
  tests passed (`10` files / `121` tests). Coverage includes manual-order
  context and selected-bot scope, PAPER lifecycle, ownership isolation,
  active-only filtering, fills, fees, exchange events, fail-closed
  exchange-backed cancel boundary, LIVE risk guards, quantity/position scope,
  and Dashboard Home manual/open-order action states. Local Postgres/Redis were
  stopped after the DB-backed proof. No production journey, LIVE mutation,
  exchange-side mutation, or existing production data mutation was performed.
  Evidence: `history/audits/orders-manual-trading-audit-2026-05-19.md`,
  `history/artifacts/orders-manual-trading-audit-2026-05-19.json`, and
  `history/audits/orders-manual-trading-audit-2026-05-19-task.md`.

- `ENGINE-TRADING-DECISION-FLOW-AUDIT-2026-05-19` is the latest `AUD-11`
  evidence. Local engine/trading flow is current: focused engine service/unit
  tests passed (`15` files / `173` tests), and DB-backed engine e2e/smoke
  tests passed (`4` files / `13` tests). Coverage includes deterministic
  signal merge, runtime decision engine, final-candle flow, signal loop and
  supervisor, pre-trade/risk, execution orchestration, dedupe, exchange order
  guard, PAPER/LIVE parity, market-data gateway, position automation, PAPER
  runtime lifecycle, and owned imported-position execution. Expected stderr
  appeared only in tests that intentionally simulate failover/fail-closed
  paths. Local Postgres/Redis were stopped after the DB-backed proof. No
  production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `history/audits/engine-trading-decision-flow-audit-2026-05-19.md`,
  `history/artifacts/engine-trading-decision-flow-audit-2026-05-19.json`, and
  `history/audits/engine-trading-decision-flow-audit-2026-05-19-task.md`.

- `BOTS-RUNTIME-TRUTH-AUDIT-2026-05-19` is the latest `AUD-10` evidence.
  Local bot/runtime truth is current: focused Web bot/dashboard runtime tests
  passed (`8` files / `61` tests), and DB-backed API bot/runtime tests passed
  (`10` files / `88` tests). Coverage includes bot CRUD/ownership,
  wallet-first writes, duplicate and entitlement guards, selected-bot runtime
  scope, monitoring aggregate truth, runtime history parity, takeover
  visibility, LIVE/PAPER isolation, and delete cleanup. Local Postgres/Redis
  were stopped after the DB-backed proof. No production journey, LIVE mutation,
  exchange-side mutation, or existing production data mutation was performed.
  Evidence: `history/audits/bots-runtime-truth-audit-2026-05-19.md`,
  `history/artifacts/bots-runtime-truth-audit-2026-05-19.json`, and
  `history/audits/bots-runtime-truth-audit-2026-05-19-task.md`.

- `SECURITY-PRIVACY-AUDIT-2026-05-19` is the latest `AUD-06` evidence.
  Local security/privacy proof is current: focused auth/middleware/header API
  tests passed (`9` files / `32` tests), DB-backed auth/profile/API-key/
  isolation/abuse tests passed (`7` files / `47` tests), focused Web
  auth/profile/API-key tests passed (`7` files / `28` tests), and the public
  auth cache contract passed (`1` file / `2` tests). Local Postgres/Redis were
  started only for DB-backed tests and then stopped. No production journey,
  LIVE mutation, exchange-side mutation, existing production data mutation, or
  raw-secret artifact was produced. Evidence:
  `history/audits/security-privacy-audit-2026-05-19.md`,
  `history/artifacts/security-privacy-audit-2026-05-19.json`, and
  `history/audits/security-privacy-audit-2026-05-19-task.md`.

- `ARCHITECTURE-EXCHANGE-SCOPE-WORDING-AUDIT-2026-05-19` is the latest
  `AUD-01`/`AUD-ARCH-001` evidence. `DEC-AUD-001` accepts Binance + Gate.io as
  current implementation scope, not Binance-only, while keeping production/live
  readiness evidence-bound by exact exchange, market type, and operation.
  Evidence:
  `history/audits/architecture-exchange-scope-wording-audit-2026-05-19.md`,
  `history/artifacts/architecture-exchange-scope-wording-audit-2026-05-19.json`,
  and
  `history/audits/architecture-exchange-scope-wording-audit-2026-05-19-task.md`.

- `EXCHANGE-CAPABILITY-TRUTH-AUDIT-2026-05-19` is the latest `AUD-09`
  evidence after exact matrix repair. API exchange capability/registry/boundary
  tests passed (`4` files / `21` tests), focused exact contract tests passed
  (`2` files / `4` tests), and API typecheck passed after execution,
  authenticated-read, boundary, wallet preview, and positions snapshot
  consumers were updated to use `(exchange, marketType, operation)`. Web
  exchange capability tests passed (`2` files / `3` tests). SDK/REST ownership
  remains inside exchange-owned boundaries. `AUD-EXCH-007` is also closed:
  non-exchange orders/wallet consumers now use neutral exchange-owned type
  aliases, with focused orders/wallet classifier tests passing (`2` files /
  `41` tests). Evidence:
  `history/audits/exchange-capability-truth-audit-2026-05-19.md`,
  `history/artifacts/exchange-capability-truth-audit-2026-05-19.json`, and
  `history/audits/exchange-capability-truth-audit-2026-05-19-task.md`.

- `AI-ASSISTANT-RUNTIME-TRUTH-AUDIT-2026-05-19` is the latest `AUD-20`
  evidence. The deterministic assistant foundation is locally proven:
  assistant orchestrator tests passed (`2` files / `6` tests), focused Web
  assistant route tests passed (`2` files / `3` tests), and bot assistant
  config/dry-run e2e passed after local Postgres/Redis startup (`1` file /
  `3` tests). The stronger architecture claim remains unproven: no audited
  BACKTEST/PAPER/LIVE hot-path runtime call site to
  `orchestrateAssistantDecision` was found, and no full
  `AI_TESTING_PROTOCOL.md` multi-turn red-team report exists. Local infra was
  stopped after the e2e proof. Evidence:
  `history/audits/ai-assistant-runtime-truth-audit-2026-05-19.md`,
  `history/artifacts/ai-assistant-runtime-truth-audit-2026-05-19.json`, and
  `history/audits/ai-assistant-runtime-truth-audit-2026-05-19-task.md`.

- `API-ENDPOINT-DOCS-PARITY-AUDIT-2026-05-19` is the latest `AUD-03`/`AUD-23`
  audit evidence. A reusable command now exists:
  `pnpm run docs:parity:endpoints:api`. Current endpoint-level result is
  `PASS`: `109` Express endpoints detected, `109` documented by route mention
  in `docs/modules/api-*.md`, and `0` gaps after adding root/ops endpoint docs
  plus missing route mentions for bots, orders, positions, and wallets.
  Existing module-level docs parity still passes (`API 22/22`, `Web 16/16`,
  `Routes 38/38`). Evidence:
  `history/audits/api-endpoint-docs-parity-2026-05-19/api-endpoint-docs-parity-2026-05-19.md`
  and `history/audits/api-endpoint-docs-parity-audit-2026-05-19-task.md`.

- `AUTHENTICATED-ROUTE-STATE-AUDIT-2026-05-19` is the latest Web/UX audit
  evidence. Local API/Web were started against seeded admin data, Browser login
  reached `/dashboard`, and the route-state audit passed for canonical
  public/auth/dashboard/admin plus legacy routes. Result: `53` route checks,
  `53` PASS, `0` CHECK, `0` console warning/error routes, and `6`
  screenshots. This promotes `AUD-04` and local `AUD-05` from partial to
  current local evidence. It is not production proof and did not run LIVE
  mutation, exchange-side mutation, or existing production data mutation.
  Evidence: `history/audits/audit-baseline-2026-05-19.md`,
  `history/audits/route-state-audit-2026-05-19/route-state-audit-2026-05-19.md`,
  and `history/audits/authenticated-route-state-audit-2026-05-19-task.md`.

- `FULL-LAYERED-AUDIT-RUN-2026-05-18` is the latest broad local audit run.
  It extends the reusable audit registry baseline with current local evidence:
  project index PASS (`PASS:21`, tests indexed `335`), static scan PASS (`0`
  findings), guardrails PASS, docs parity PASS, typecheck PASS, lint PASS,
  build PASS, full Web Vitest PASS (`149` files / `514` tests),
  route-reachable i18n PASS (`0` findings), focused API layer packs PASS, full
  API Vitest PASS after local Postgres/Redis were available, go-live smoke PASS
  (API `45/45`, Web `18/18`), and representative Browser route-state proof for
  `/`, `/auth/login`, and unauthenticated `/dashboard` redirect on desktop and
  mobile with `0` console warnings/errors. This is local audit confidence and
  representative route proof, not production proof, LIVE mutation proof, or an
  authenticated all-route browser/screenshot audit. Evidence:
  `history/audits/audit-baseline-2026-05-18.md` and
  `history/audits/full-layered-audit-run-2026-05-18-task.md`.

- `REUSABLE-AUDIT-REGISTRY-2026-05-18` is the current reusable audit system.
  It defines stable `AUD-00` through `AUD-23` audit families across backend,
  Web, UX/UI, workers, security, exchange, bots, engine/runtime, orders,
  positions, wallets, markets, strategies, backtests, reports, logs, admin,
  operations, AI assistant, mobile, i18n, docs, and traceability. The current
  baseline is `history/audits/audit-baseline-2026-05-18.md`: today-run project
  index passed with `PASS:21` and `335` indexed tests, and static scan passed
  with `0` findings. Guardrails, docs parity, typecheck, lint, and build also
  passed. This is an audit-system baseline, not a production proof or code
  behavior change. Evidence:
  `docs/analysis/reusable-audit-registry.md` and
  `history/audits/reusable-audit-registry-2026-05-18-task.md`.

- `PROJECT-ARCHITECTURE-CODE-DISCREPANCY-AUDIT-2026-05-17` is the current
  architecture-vs-code discrepancy baseline. It found no route inventory drift
  for dashboard routes and no static-scan findings after a sequential index/
  scan refresh. Inspected protected API diagnostics, worker topology, bot active
  market-scope constraints, Prisma lifecycle shape, and exchange SDK ownership
  broadly fit architecture. Open drift is now explicit: assistant architecture
  overstates hot-path BACKTEST/PAPER/LIVE integration; exchange capability
  services are not yet fully keyed by `(exchange, marketType, operation)`; and
  older architecture overview/domain wording still implies Binance-only or
  single-exchange-family baseline despite current Binance/Gate.io code and
  reference docs. Evidence:
  `history/audits/architecture-code-discrepancy-audit-2026-05-17.md` and
  `history/audits/project-architecture-code-discrepancy-audit-2026-05-17-task.md`.

- `PROJECT-COMPLETE-ANALYSIS-INDEX-2026-05-14` is now the broader audit map
  for the user's request to analyze everything. It classifies Web/API local
  proof, Web route inventory, API route inventory, mobile scaffold, assistant/
  AI runtime, every-route browser-state coverage, every-endpoint ledgering,
  LIVE mutation, Gate.io/second-LIVE production shape, and existing production
  data mutation. Key readback: no `.skip(` or `.only(` markers were found in
  the active scan; no active implementation `TODO/FIXME/HACK` markers were
  found outside the scanner's own rule definitions; mobile is intentionally
  scaffold-only; assistant runtime has deterministic local safety tests but no
  complete `AI_TESTING_PROTOCOL.md` multi-turn red-team report. Evidence:
  `history/plans/project-complete-analysis-index-2026-05-14.md`.

- `PROJECT-FULL-SCAN-BASELINE-2026-05-14` is verified as the current
  repository-wide local audit baseline for this audit/indexing thread.
  Generated project index and static scan artifacts were written to
  `history/audits/project-full-scan-index-2026-05-14.md` /
  `.json` and `history/audits/project-full-static-scan-2026-05-14.md` /
  `.json`. Results: V1 matrix `PASS:21`, static findings `0`, tests indexed
  `335`, guardrails PASS, typecheck PASS, lint PASS, full Web Vitest PASS
  (`149` files / `514` tests), full API Vitest PASS, build PASS, and
  go-live smoke PASS (API `45/45`, Web `18/18`). This baseline does not claim
  unsafe LIVE mutation, exchange-side mutation, existing production data
  mutation, broader Gate.io/second-LIVE production shape, or manual browser
  state coverage for every route. Evidence:
  `history/audits/project-full-scan-baseline-2026-05-14-task.md`.

- `POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14` is verified locally. New
  backtest runs now persist immutable creation-time strategy and
  market-universe context snapshots in `seedConfig.contextSnapshot`; backtest
  list/timeline/replay paths prefer snapshot strategy truth before mutable
  strategy records; strategy and market-universe deletion now fail closed with
  `409` while owned backtest history references those records. Focused API e2e
  passed for backtests, strategies, and markets (`44/44`). No deploy,
  production mutation, LIVE order/cancel/close, or exchange-side mutation was
  performed. Evidence:
  `history/tasks/post-v1-strategy-snapshot-history-2026-05-14-task.md`.

- `POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14` is verified locally.
  The suspected inactive PAPER strategy edit path now has direct Web/API
  evidence: the Web edit page submits the loaded form when the backend allows
  the inactive linked-bot update path, and it renders a targeted active-bot
  lock with bot-settings navigation when the backend blocks active linked bots.
  Focused validation passed: Web edit page `3/3`, Web strategies suite `14`
  files / `48` tests, and API strategies e2e `11/11`. No deploy, production
  mutation, LIVE order/cancel/close, or exchange-side mutation was performed.
  Evidence:
  `history/evidence/post-v1-inactive-paper-strategy-edit-proof-2026-05-14-task.md`.

- `POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14` is verified locally. The API
  icon resolver now uses one curated asset catalog to derive both preferred
  CoinGecko IDs and curated icon URLs, avoiding repeated one-symbol patches.
  Focused icon e2e proof passes (`6/6`), including a common trading basket
  outage scenario where CoinGecko returns `503` and `BTC`, `ETH`, `BNB`,
  `SOL`, `XRP`, `DOGE`, `ADA`, `TRX`, `DOT`, `LTC`, `AVAX`, `LINK`, `BCH`,
  `XLM`, `ATOM`, `UNI`, `ETC`, `FIL`, `AAVE`, `ALGO`, `VET`, `ICP`, `MATIC`,
  `ZEC`, `SAND`, and `MANA` resolve to curated icons instead of placeholders.
  No deploy, production mutation, LIVE order/cancel/close, or exchange-side
  mutation was performed. Evidence:
  `history/tasks/post-v1-crypto-icon-consistency-2026-05-14-task.md`.

- `V1-POST-V1-LEDGER-RECONCILIATION-2026-05-14` is verified. Stale module
  confidence, requirements, quality, and risk rows were reconciled with
  accepted production fixture/UI evidence. Current module confidence is
  `VERIFIED:22`, `PARTIAL:0`, `IMPLEMENTED_NOT_VERIFIED:0`, `BROKEN:0`,
  `BLOCKED:0`; current risk count is `closed:18`, `mitigating:8`. No deploy or
  production mutation was performed. LIVE order/cancel/close, unsafe LIVE
  position mutation, existing-data mutation, and broader Gate.io/second-LIVE
  proof remain outside the verified V1 boundary unless separately approved.
  Evidence:
  `history/audits/v1-post-v1-ledger-reconciliation-2026-05-14-task.md`.

- `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14` is verified locally.
  Bot deletion now removes bot-owned runtime/trading artifacts in one
  transaction while preserving the strategy, and PAPER wallet reset now fails
  closed with `409` while an active bot uses the wallet. No production data,
  LIVE order/cancel/close, or exchange-side mutation was performed. Validation:
  API typecheck PASS, Bots delete cleanup e2e `1/1` PASS, Bots e2e `26/26`
  PASS, Wallets e2e `24/24` PASS, build PASS. The fix is deployed as
  `1586f59261cef94d7c513d71bbfcfb697d11ca59`; build-info wait passed on
  attempt 22, and public deploy smoke passed for API `/health`, API `/ready`,
  and Web `/`.
  Evidence:
  `history/tasks/v1-post-v1-wallet-bot-cleanup-hardening-2026-05-14-task.md`.

- `V1-POST-V1-DASHBOARD-RUNTIME-LEDGER-CLOSURE-2026-05-14` is verified.
  Existing local rendered/browser proof plus production route/runtime readbacks
  close stale `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001` `PARTIAL` rows
  for the approved non-Gate.io V1/post-V1 target scope. `RISK-002` and
  `RISK-003` are closed. Its original count readback is superseded by the later
  ledger reconciliation: current module confidence is `VERIFIED:22` and
  `PARTIAL:0`; current risk count is `closed:18` and `mitigating:8`.
  Gate.io/second-LIVE production shape and LIVE mutation proof remain separate.
  Evidence:
  `history/audits/v1-post-v1-dashboard-runtime-ledger-closure-2026-05-14-task.md`.

- `V1-POST-V1-AUTH-DEPLOY-RERUN-2026-05-14` is verified. The auth stale-token
  replay gap found on deployed `2fc90a08` is fixed and deployed as
  `84711599`. Production build-info matched after wait attempt 32, and
  production auth browser/API proof passed: no-session redirect, valid-session
  dashboard render, invalid-token `session=expired` redirect, logout `200`,
  stale pre-logout token `/auth/me` `401`, and post-logout dashboard redirect.
  `SOAR-AUTH-001` is now `VERIFIED`, and `RISK-004` is `closed`. Evidence:
  `history/tasks/v1-post-v1-auth-deploy-rerun-2026-05-14-task.md` and
  `history/evidence/prod-auth-session-browser-proof-84711599-2026-05-14.md`.

- `V1-100-PERCENT-TRUTH-AUDIT-2026-05-14` is verified. The precise answer to
  the user's "is it 100%?" question is split by scope: tracked V1 release
  acceptance is `YES` (`GO`, `PASS:21`, static findings `0`, implementation/
  evidence/release readiness `100%`, no next work order), while absolute
  whole-app/every-function/every-live-action proof remains `NO` only because
  LIVE order submit/cancel/position close, exchange-side mutation,
  existing-data mutation, and broader 2x LIVE including Gate.io production proof
  were intentionally not performed. Its stale `PARTIAL:7` wording is superseded
  by the later ledger reconciliation. Evidence:
  `history/audits/v1-100-percent-truth-audit-2026-05-14-task.md` and
  `history/audits/v1-100-percent-truth-audit-2026-05-14.md`.

- `V1-POST-V1-RELEASE-CONFIDENCE-ROW-CLOSURE-2026-05-14` is verified. The
  obsolete `SOAR-REL-001` row has been closed as `VERIFIED` because the final
  V1 evidence pack now provides the module-by-module proof map it previously
  said was missing. This removes the last `IMPLEMENTED_NOT_VERIFIED`
  module-confidence row without changing product behavior or promoting the
  remaining `PARTIAL` rows. Evidence:
  `history/tasks/v1-post-v1-release-confidence-row-closure-2026-05-14-task.md`.

- `V1-FINAL-EVIDENCE-CONSISTENCY-READBACK-2026-05-14` is verified. Final
  generated JSON artifacts and Markdown markers are internally consistent:
  scorecard `GO`, implementation/evidence/readiness `100%`, `PASS:21`, blocked
  modules `none`, concrete non-proof gaps `0`, no next work order, master
  ledger `GO`, static scan findings `0`, and project-index V1 PASS rows `21`.
  No deploy or production mutation was performed. Evidence:
  `history/evidence/v1-final-evidence-consistency-readback-2026-05-14-task.md`.

- `V1-ACTIVE-QUEUE-CLOSURE-AUDIT-2026-05-14` is verified. Active V1
  continuation sources contain no open V1 completion work: canonical final
  evidence files exist, active `.agents/state/next-steps.md` above the
  historical superseded section has no current NO-GO/BLOCKED completion signal,
  final scorecard readback is `GO` / `100%` / blocked modules `none`, and
  active task-board/next-commits unchecked-row scan found no open V1 completion
  row. Evidence:
  `history/audits/v1-active-queue-closure-audit-2026-05-14-task.md`.

- `V1-CURRENT-GO-LIVE-SMOKE-2026-05-14` is verified. Current worktree go-live
  smoke passed when DB-backed packs were run sequentially:
  `pnpm run test:go-live:web` PASS (`18/18`),
  `pnpm run test:go-live:api` PASS (`44/44`), and
  `pnpm run test:go-live:smoke` PASS (API `44/44`, Web `18/18`). The initial
  parallel attempt produced false failures from shared DB cleanup interference,
  and that pitfall is recorded in `.codex/context/LEARNING_JOURNAL.md`. No
  deploy or production mutation was performed. Evidence:
  `history/evidence/v1-current-go-live-smoke-2026-05-14-task.md`.

- `V1-CURRENT-WORKTREE-FULL-REGRESSION-2026-05-14` is verified. Current full
  local regression passed after final V1 evidence, handoff, inventory, and
  sanity updates: `pnpm run lint`, full Web Vitest (`149` files / `512`
  tests), and full API Vitest. This is local regression confidence only; no
  deploy or production mutation was performed. Evidence:
  `history/tasks/v1-current-worktree-full-regression-2026-05-14-task.md`.

- `V1-CURRENT-WORKTREE-SANITY-2026-05-14` is verified. Current worktree sanity
  passed after final V1 evidence, handoff, and inventory updates:
  `pnpm run typecheck`, `pnpm run build`, and `pnpm run quality:guardrails`.
  This is local code/build confidence only; no deploy or production mutation
  was performed. Evidence:
  `history/tasks/v1-current-worktree-sanity-2026-05-14-task.md`.

- `V1-FINAL-EVIDENCE-INVENTORY-2026-05-14` is verified. The final V1 evidence
  inventory is published at
  `history/audits/v1-final-evidence-inventory-2026-05-14.md`. It identifies
  the canonical final proof pack, records the LIVE mutation approval boundary,
  and documents safe version-control handling for the large proof-artifact
  working tree. Evidence:
  `history/audits/v1-final-evidence-inventory-2026-05-14-task.md`.

- `V1-FINAL-HANDOFF-PACKET-2026-05-14` is verified. The final V1 handoff packet
  is published at `history/audits/v1-final-handoff-packet-2026-05-14.md` and
  records the active source of truth, final evidence links, validations,
  residual risks, LIVE mutation approval boundary, and resume instructions for
  future sessions. Evidence:
  `history/audits/v1-final-handoff-packet-2026-05-14-task.md`.

- `V1-POST-RELEASE-FRESHNESS-MEMORY-SYNC-2026-05-14` is verified. The active
  continuation memory now treats the final scorecard as the current V1 truth:
  `GO`, `PASS:21`, static findings `0`, implementation `100%`, evidence
  `100%`, and release readiness `100%`. Superseded older `NO-GO`, `BLOCKED`,
  protected-auth, Docker, and preactivation entries in `.agents/state/next-steps.md`
  are explicitly retained as historical evidence rather than current next
  actions. Evidence:
  `history/tasks/v1-post-release-freshness-memory-sync-2026-05-14-task.md`.

- `V1-PRODUCTION-UX-A11Y-MOBILE-PROOF-2FC90A08-2026-05-14` is verified for
  the current deployed build `2fc90a0810032f2fedb744d69505a3bd55a23779`.
  Production route/module audit passed, and production CDP browser proof passed
  for desktop Dashboard, Wallets, Bots, Profile, and mobile Dashboard with
  screenshots, mobile menu click, keyboard focus, no framework overlay, and no
  horizontal overflow. Evidence:
  `history/evidence/v1-production-ux-a11y-mobile-proof-2fc90a08-2026-05-14-task.md`,
  `history/plans/prod-ui-module-clickthrough-2fc90a08-2026-05-14.md`, and
  `history/evidence/prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14.md`.

- `V1-PRODUCTION-POSITIONS-PROOF-2FC90A08-2026-05-14` is verified for the
  current deployed build `2fc90a0810032f2fedb744d69505a3bd55a23779`.
  Production-safe proof passed for Positions: unauthenticated fail-closed
  access, active PAPER runtime candidate selection, PAPER-only position
  open/read, management-mode update/restore, manual TP/SL update, live-status
  read, takeover-status read, exchange-snapshot boundary, runtime close
  fail-closed without `riskAck`, runtime close with `riskAck`, closed position
  readback, and OPEN-list cleanup. The proof did not submit LIVE orders, cancel
  LIVE orders, mutate LIVE positions, mutate exchange state, or persist raw
  credentials in artifacts. Evidence:
  `history/evidence/v1-production-positions-proof-2fc90a08-2026-05-14-task.md`
  and `history/evidence/prod-positions-proof-2fc90a08-2026-05-14.md`.

- `V1-PRODUCTION-SECURITY-EXCHANGE-PROOF-2FC90A08-2026-05-14` is verified for
  the current deployed build `2fc90a0810032f2fedb744d69505a3bd55a23779`.
  Production-safe proof passed for Security/Privacy and Exchange Adapter:
  security headers, public readiness, unauthenticated protected/ops/metrics
  fail-closed checks, authenticated no-store profile read, API-key list
  redaction, untrusted Origin controlled `403`, unsupported exchange probe
  fail-closed behavior, Binance futures catalog read-only data, Gate.io futures
  catalog canonical symbols, and authenticated readiness details. The proof did
  not submit LIVE orders, cancel LIVE orders, close positions, mutate exchange
  state, mutate positions, or persist raw credentials in artifacts. Evidence:
  `history/evidence/v1-production-security-exchange-proof-2fc90a08-2026-05-14-task.md`
  and `history/evidence/prod-security-exchange-proof-2fc90a08-2026-05-14.md`.

- `V1-PRODUCTION-FIXTURE-PAPER-ORDER-PROOF-457BCE05-2026-05-14` is the
  current continuation checkpoint for the user's "100%" request. The accepted
  limited fixture boundary allowed only disposable `Codex V1 Proof <timestamp>`
  resources, cleanup verification, redacted artifacts, PAPER-only
  money-adjacent actions, and no LIVE exchange mutation. The production proof
  passed for deployed `457bce05` and covered Profile, Profile API Keys,
  Wallets, Markets, Strategies, Bots, Manual Orders, Orders, Backtests,
  Reports, Logs/Audit Trail, and Exchange Adapter probe fail-closed behavior.
  The Manual Orders/Orders slice used a disposable PAPER limit order, proved
  readback, proved cancel fail-closed without `riskAck`, canceled it with
  `riskAck`, and left the terminal canceled order only as audit/history. The
  Backtests/Reports slice created a disposable backtest run, proved run,
  report, trades, and timeline readback, then deleted the run in cleanup.
  Evidence:
  `history/evidence/v1-production-fixture-backtests-reports-proof-457bce05-2026-05-14-task.md`,
  `history/evidence/v1-production-fixture-paper-order-proof-457bce05-2026-05-14-task.md`,
  `history/evidence/v1-production-fixture-low-risk-action-proof-457bce05-2026-05-14-task.md`,
  and `history/evidence/prod-fixture-action-proof-457bce05-2026-05-14.md`.

- Fresh V1 completion scorecard:
  `history/releases/v1-completion-scorecard-2026-05-14-final.md` now reflects
  `PASS:21`, static findings `0`, implementation estimate `100%`, evidence
  coverage `100%`, release readiness `100%`, and status `GO`.

- `V1-BACK-WEB-FULL-LOCAL-BASELINE-457BCE05-2026-05-14` refreshed broad local
  API/Web confidence after the protected ops work. Repository guardrails,
  API/Web typecheck, full Web Vitest (`149` files / `512` tests), full API
  Vitest, lint, production build, and `git diff --check` all passed
  (`git diff --check` produced line-ending warnings only). Evidence:
  `history/audits/v1-back-web-full-local-baseline-457bce05-2026-05-14-task.md`.
  This is code-level confidence, not a replacement for production-only release
  evidence.

- `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14` advanced from missing-auth
  blocked to verified protected operations release evidence for the latest
  deployed candidate. Production build-info matches
  `457bce05338310c198c03a973395a9176f298dc1`, public API/Web smoke passes,
  approved temporary Soar admin auth unlocked protected runtime routes, direct
  runtime freshness passed, rollback proof passed with `shouldRollback=false`
  and no alerts, and authenticated production UI clickthrough passed for
  public, dashboard, admin, and legacy redirect routes. Controlled
  no-order-guard `LIVEIMPORT-03` readback then passed for the target bot's
  runtime-visible `TRXUSDT` symbol; the guarded runner deactivated the LIVE bot
  afterward. Activation audit/plan, RC external gates, RC sign-off, RC
  checklist, rollback proof, UI clickthrough, LIVEIMPORT, public smoke,
  protected smoke, runtime freshness, rollback guard, production
  backup/restore drill, final preflight, and the full non-dry-run release gate
  are now fresh/pass for 2026-05-14. The earlier local Docker failure was
  resolved by using the safer VPS Docker SSH path (`DOCKER_HOST=ssh://codex-vps`)
  with the existing restore-drill contract.
  Evidence:
  `history/tasks/v1-protected-ops-gate-457bce05-2026-05-14-task.md`,
  `history/releases/v1-final-preflight-457bce05-2026-05-14-ready.md`,
  `history/evidence/v1-rollback-proof-prod-2026-05-14T01-00-18-225Z.md`,
  `history/plans/prod-ui-module-clickthrough-457bce05-2026-05-14.md`,
  `history/artifacts/liveimport-03-prod-readback-2026-05-14.json`,
  `history/evidence/v1-restore-drill-prod-2026-05-14T00-00-00-000Z.md`, and
  `history/releases/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md`.
  Next action: keep the normal regression loop green and treat new work as
  follow-up, not as a blocker for this V1 release gate.

- `V1-CURRENT-MAIN-PROMOTION-DEPLOY-LAG-457BCE05-2026-05-14` is superseded by
  deploy freshness evidence. The latest verified local candidate is on remote
  Git: branch `origin/codex/v1-proof-and-ops-evidence` is pushed and
  `origin/main` points to `457bce05338310c198c03a973395a9176f298dc1`.
  Production build-info now reports `457bce05`, and public production smoke
  passes for that deployed surface. The later protected ops gate superseded the
  initial protected-auth `401` checks; protected runtime freshness, rollback
  guard, UI clickthrough, restore drill, final preflight, and full release gate
  are fresh/pass for 2026-05-14.
  Evidence:
  `history/tasks/v1-current-main-promotion-deploy-lag-457bce05-2026-05-14-task.md`,
  `history/plans/deploy-lag-457bce05-2026-05-14.md`,
  `history/plans/deploy-freshness-457bce05-2026-05-14.md`, and
  `history/tasks/v1-protected-ops-gate-457bce05-2026-05-14-task.md`.

- `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-00169D7F-2026-05-13` is now
  closed for the current production non-Gate.io simultaneous runtime scope
  after the `457bce05` deploy. Focused API LIVE/PAPER tests passed (`25/25`)
  and focused Web Dashboard selected-bot/runtime tests passed (`24/24`).
  Controlled no-order-guard production proof activated the existing Binance
  LIVE bot only for the observation window, verified `LIVEIMPORT-03` for
  `TRXUSDT`, captured a simultaneous read-only runtime snapshot where the
  Binance LIVE bot and both Binance PAPER bots were RUNNING, then deactivated
  the LIVE bot. Post-cleanup readback confirmed the Binance LIVE bot was
  inactive again while both PAPER bots remained healthy. Evidence:
  `history/evidence/v1-live-paper-simultaneous-runtime-proof-refresh-457bce05-2026-05-14-task.md`,
  `history/artifacts/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`,
  `history/evidence/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`,
  and
  `history/evidence/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`.
  Gate.io/second-LIVE production shape remains unavailable/deferred rather
  than hidden.

## 2026-05-13 Current-Day V1 Blocker Refresh

- `V1-RUNTIME-NON-BINANCE-DERIVATIVES-ADAPTER-2026-05-13` moved runtime
  non-Binance derivative supplemental fallbacks onto the Exchange public
  market-data adapter. Runtime symbol-stats reads and the live signal
  market-data gateway now use exchange-owned funding-rate history,
  open-interest history, and order-book snapshot boundaries for non-Binance
  exchanges where supported, while keeping Binance REST behavior scoped to
  Binance. Derivative fallback caches are exchange-scoped. Evidence:
  `history/tasks/v1-runtime-non-binance-derivatives-adapter-2026-05-13-task.md`;
  focused runtime tests passed (`26/26`), API typecheck passed, and guardrails
  passed.

- `V1-NON-BINANCE-BACKTEST-DERIVATIVES-ADAPTER-2026-05-13` moved
  non-Binance futures backtest supplemental funding-rate and open-interest
  history onto the Exchange public market-data adapter where the CCXT connector
  supports those methods. Exchange public market-data now exposes adapter
  boundaries for funding history, open-interest history, and order-book
  snapshots, and the CCXT connector normalizes those payloads. Backtest
  order-book history remains intentionally empty for non-Binance because a
  current order-book snapshot would be misleading historical input. Evidence:
  `history/tasks/v1-non-binance-backtest-derivatives-adapter-2026-05-13-task.md`;
  focused API tests passed (`26/26`) and API typecheck passed.

- `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` closed the next
  adapter/UI parity gap after the candle audit. Generic runtime ticker fallback
  prices now use the Exchange public market-data boundary for Binance and
  non-Binance exchanges, and runtime position reads request fallback ticker
  prices for the actual bot exchange instead of Binance only. Backtest details
  now expose the resolved `exchange / marketType / baseCurrency` in the header
  instead of leaving it only inside raw seed JSON. Evidence:
  `history/tasks/v1-runtime-ticker-and-backtest-venue-ui-2026-05-13-task.md`;
  focused runtime tests passed (`36/36`), focused Backtest details Web test
  passed (`4/4`), API typecheck passed, and Web typecheck passed.

- `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` extended the
  Binance/Gate.io adapter audit from runtime warmup into the backtest and bot
  fallback surfaces. Backtest candle loading and bot runtime fallback candles
  now route through the Exchange module public market-data boundary with exact
  exchange context. Backtest jobs and timelines preserve the resolved exchange
  context, timeline responses expose `exchange`, and Web backtest timeline
  types now include backend parity/order-book fields. `MarketCandleCache`
  uniqueness and indexes now include `source`, preventing cross-exchange cache
  collisions. Binance-only supplemental derivative fallbacks remain
  Binance-scoped and fail closed for non-Binance exchanges. Evidence:
  `history/audits/v1-bot-backtest-exchange-adapter-audit-2026-05-13-task.md`;
  focused bot/backtest tests passed (`56/56`), API typecheck passed, and Web
  typecheck passed. This is local adapter-boundary proof, not production LIVE
  trading proof.

- `V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13` corrected a runtime
  architecture mismatch found during the Binance/Gate.io adapter review.
  Runtime candle warmup and indicator recovery now use the Exchange module's
  public market-data boundary instead of a direct Binance REST call from
  Engine. Runtime candle and derivative stores are exchange-scoped, strategy
  evaluation receives the bot exchange context, and lifecycle/symbol-stats
  read fallbacks no longer risk mixing Binance and Gate.io series for the same
  symbol. Binance-only derivative fallbacks remain Binance-only and fail
  closed for non-Binance exchanges. Evidence:
  `history/tasks/v1-runtime-exchange-adapter-boundary-2026-05-13-task.md`;
  focused runtime/decision-loop tests passed (`55/55`), exchange/stream/
  fallback/read-model tests passed (`12/12`), API typecheck passed, and
  guardrails passed. This is local adapter-boundary verification; production
  multi-bot/live runtime proof remains a separate partial evidence lane.

- `V1-NON-GATEIO-RUNTIME-AND-APP-PROOF-00169D7F-2026-05-13` verified the
  current non-Gate.io slice after the user deferred Gate.io. Result:
  `PARTIAL_BINANCE_LIVE_INACTIVE`. Authenticated read-only production readback
  confirms both active Binance PAPER bots are currently RUNNING and expose
  fresh monitoring data through runtime sessions, symbol stats, positions,
  trades, and aggregate endpoints. The Binance LIVE bot exists and has
  live opt-in enabled, but it is currently inactive with no RUNNING session;
  no activation, order, close-position command, production write, or exchange
  mutation was attempted. Local gates passed: focused Web runtime tests
  (`41/41`), focused API runtime/monitoring tests (`47/47` and `29/29`),
  typecheck, build, guardrails, `test:go-live:web`, `test:go-live:api`, and
  `test:go-live:smoke`. Evidence:
  `history/evidence/prod-non-gateio-runtime-readback-00169d7f-2026-05-13.md`
  and
  `history/evidence/v1-non-gateio-runtime-and-app-proof-00169d7f-2026-05-13-task.md`.

- `V1-PRODUCTION-RUNTIME-INVENTORY-00169D7F-2026-05-13` captured
  authenticated read-only production bot/runtime inventory for the approved
  account. Result: `PARTIAL`. Production currently has 3 visible bots:
  2 PAPER bots, both active, and 1 LIVE Binance futures bot, inactive. Latest
  PAPER sessions are `RUNNING` with fresh heartbeats; the LIVE bot's latest
  sessions are `CANCELED`. This means the local 2x PAPER + Binance LIVE +
  Gate.io LIVE proof shape is not present in production yet: blockers are
  fewer than two active LIVE bots and no visible LIVE Gate.io bot. Evidence:
  `history/audits/prod-runtime-inventory-00169d7f-2026-05-13.md`.

- `V1-PRODUCTION-UI-CLICKTHROUGH-REFRESH-00169D7F-2026-05-13` refreshed
  authenticated production UI module route evidence for deployed
  `00169d7fdc3aff8317759137b05594b20e773c8e`. Result: `PASS`; public
  routes `PASS:4`, dashboard routes `PASS:18`, admin routes `PASS:3`,
  legacy redirects `PASS:3`, blockers `none`. Artifact inspection found no
  raw credentials, tokens, cookies, or private headers; the only match for the
  secret scan was the safety-note word `passwords`. Evidence:
  `history/plans/prod-ui-module-clickthrough-00169d7f-2026-05-13-enum-followup.md`.
  This proves protected route/module reachability, not every per-module
  create/edit/delete/action journey.

- `V1-WEB-BACKEND-PARITY-MONITORING-PROPS-2026-05-13` removed the remaining
  local Bots Monitoring prop duplications for runtime fee/capital enum
  domains by reusing shared Web runtime aliases. Evidence: focused
  `BotsManagement` test passed (`14/14`), Web typecheck passed, local
  duplicate-union scan returned no matches, and repository guardrails passed.

- `V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13` tightened Web runtime
  enum contracts to backend schema truth: runtime trade `feeSource`,
  `origin`, and `managementMode` now use strict backend-compatible Web aliases;
  position/open-order/capital-source types reuse the same enum domains; stale
  Web fixtures using impossible backend values (`SIMULATED`, `PAPER_RUNTIME`,
  `BOT`, `MANUAL`, `SIGNAL`) were normalized to backend-valid payloads.
  Evidence: focused Web runtime tests passed (`5` files, `47` tests), Web
  typecheck passed, stale-value scan returned no matches, and repository
  guardrails passed.

- `V1-WEB-BACKEND-PARITY-RUNTIME-ORIGIN-2026-05-13` closed another
  Dashboard/Bot Runtime Web/API contract drift: backend runtime position
  `origin=USER` is now represented in the Web type and Dashboard Home maps it
  to the existing Manual source label in the edit-position context, while
  legacy `MANUAL` fixture compatibility remains. Evidence: focused Web test
  passed (`HomeLiveWidgets.runtime-origin.test.tsx`, `3/3`) and Web typecheck
  passed.

- `V1-WEB-BACKEND-PARITY-DASHBOARD-2026-05-13` closed a concrete
  Dashboard/Bots Monitoring Web/API contract drift: runtime trades now allow
  backend-truth nullable `orderId`, `positionId`, and `strategyId`; Bots
  Monitoring renders missing runtime relationship IDs as `-` instead of
  assuming string IDs; runtime positions summary types and empty aggregate
  payloads now carry `openPositionQty`. Evidence: Web focused tests passed
  (`2` files, `17` tests), API runtime monitoring aggregate e2e passed
  (`18/18`), API typecheck passed, and Web typecheck passed.

- User concern captured as the next proof task:
  `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-00169D7F-2026-05-13`. The current
  V1 production target gate proves the Operations release lane, not a blanket
  claim that simultaneous LIVE and PAPER bots are fully proven across every
  runtime/UI/action path. The next proof must verify mode isolation,
  selected-bot scoping, LIVE imported-position isolation, PAPER runtime
  independence, and PAPER/LIVE parity where only the execution adapter differs.
- Checkpoint 1 for that proof is verified locally: Gate.io runtime fallback
  market data now uses the exchange-owned public market-data boundary instead
  of Binance REST, Binance-only derivative fallbacks remain Binance-only, and
  active LIVE symbol overlap is scoped by exact `(exchange, marketType)`.
  DB-backed e2e now proves the requested shape: two active PAPER bots plus one
  Binance LIVE bot and one Gate.io LIVE bot, with selected runtime position
  reads isolated by mode, wallet, API key, exchange, and market type. Focused
  typecheck, fallback unit tests, duplicate guard e2e, runtime PnL parity e2e,
  and Dashboard Home Web tests passed. A focused rendered Web regression also
  proves the dashboard selector exposes all four bots and re-scopes wallet and
  runtime rows when switching between PAPER, Binance LIVE, and Gate.io LIVE.
- 2026-05-14 refresh after deployed `457bce05`: production build-info passed
  for `457bce05`; the focused API LIVE/PAPER isolation pack passed (`5`
  files, `25/25` tests); the focused Web Dashboard selected-bot/runtime pack
  passed (`2` files, `24/24` tests). Evidence:
  `history/evidence/v1-live-paper-simultaneous-runtime-proof-refresh-457bce05-2026-05-14-task.md`.
  Status remains `PARTIAL` until protected production runtime/action evidence
  and the requested production 2x PAPER + 2x LIVE shape exist.

- `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13` closed the current V1
  production target evidence lane for deployed
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Controlled `LIVEIMPORT-03` passed for the target bot's real managed symbol
  `TRXUSDT`: runtime readback showed a RUNNING session and one open
  `EXCHANGE_SYNC` / `BOT_MANAGED` / `OWNED_AND_MANAGED` position with
  `syncState=IN_SYNC`, `continuityState=CONFIRMED`, and `actionable=true`.
  Cleanup deactivated the bot and no orders were placed.
- Final preflight now has no blockers and all required evidence families are
  fresh for 2026-05-13.
- The full release gate passed repository guardrails, typecheck, and build,
  then stopped only because local `test:go-live:smoke` requires Docker Desktop,
  which is unavailable in this workstation environment.
- The production target-only V1 gate passed with `Readiness: ready`: build-info
  freshness, post-deploy smoke, runtime freshness, and rollback guard all
  passed against production.
- Evidence:
  `history/releases/v1-target-release-gate-pass-00169d7f-2026-05-13-task.md`,
  `history/artifacts/liveimport-03-prod-readback-2026-05-13.json`,
  `history/releases/v1-final-preflight-00169d7f-2026-05-13.md`,
  `history/releases/v1-release-gate-prod-2026-05-13Tfinal-v1-gate.md`, and
  `history/releases/v1-release-gate-prod-2026-05-13Ttarget-only-v1-gate.md`.

- `V1-CONTROLLED-LIVE-PROOF-ATTEMPT-00169D7F-2026-05-13` ran after explicit
  user live-risk approval. The first attempt exposed a runner defect: partial
  bot `PUT` updates could clear `liveOptIn`/import flags through API defaults.
  Production bot configuration was restored immediately to inactive
  LIVE/import-capable state.
- `scripts/runControlledLiveSessionProof.mjs` now preserves the target bot's
  LIVE consent/import fields when toggling `isActive` and requires a consent
  text version before activation.
- The corrected controlled proof started a RUNNING session and cleaned up by
  deactivating the bot. The final accepted proof used `TRXUSDT`, the real
  runtime-visible managed symbol for the target bot, and passed
  `LIVEIMPORT-03`.
- Evidence:
  `history/evidence/v1-controlled-live-proof-attempt-00169d7f-2026-05-13-task.md`,
  `history/artifacts/liveimport-03-prod-readback-2026-05-13.json`, and
  `history/releases/v1-final-preflight-00169d7f-2026-05-13.md`.

- `V1-CONTROLLED-LIVE-PROOF-PREACTIVATION-00169D7F-2026-05-13` ran the
  controlled LIVE proof runner only through dry-run and preactivation checks.
- The runner confirmed build-info matches `00169d7f`, the no-order guard is
  fully active (`globalKillSwitch=true`, `emergencyStop=true`, `active=true`),
  and the target redacted LIVE Binance futures bot is inactive with
  `liveOptIn=true` and `manageExternalPositions=true`.
- The runner stopped before activation because `--i-understand-live-risk` was
  not provided. No LIVE bot was activated and no order action was attempted.
  V1 remains `NO-GO` pending explicit live-risk approval for the controlled
  proof run or a product decision to change the V1 acceptance contract.
- Evidence:
  `history/evidence/v1-controlled-live-proof-preactivation-00169d7f-2026-05-13-task.md`.

- `V1-PROD-RESTORE-AND-LIVEIMPORT-TRUTH-00169D7F-2026-05-13` refreshed the
  production backup/restore drill through the Coolify PostgreSQL resource
  terminal and normalized LIVEIMPORT evidence naming for final-gate discovery.
- Restore drill is fresh `PASS` for 2026-05-13 with isolated restore database
  creation, aggregate validation, restore DB drop, backup removal, and zero
  leftover restore databases or dumps.
- LIVEIMPORT now has a canonical current artifact and is correctly classified
  as `failed`, not missing: auth works and one LIVE Binance futures bot exists,
  but there is no running session (`NO_RUNNING_SESSION`), so runtime readback
  cannot be accepted.
- Final preflight now has exactly one blocker:
  `evidence:liveImportReadback:failed`. V1 remains `NO-GO`.
- Evidence:
  `history/tasks/v1-prod-restore-and-liveimport-truth-00169d7f-2026-05-13-task.md`,
  `history/evidence/v1-restore-drill-prod-2026-05-13T17-41-29Z.md`,
  `history/artifacts/liveimport-03-prod-readback-2026-05-13.json`, and
  `history/releases/v1-final-preflight-00169d7f-2026-05-13.md`.

- `V1-PROTECTED-PROOF-REDUCTION-00169D7F-2026-05-13` used the
  user-approved production application credentials only in the local execution
  environment to reduce protected V1 blockers without committing secrets.
- Authenticated production UI module clickthrough is now fresh `PASS`
  (`public:4`, `dashboard:18`, `admin:3`, `legacy:3`), and production rollback
  proof is fresh `PASS` with `shouldRollback:false`, runtime freshness `PASS`,
  and zero alerts.
- LIVEIMPORT readback authentication now passes and finds one LIVE Binance
  futures bot, but it fails closed because that bot has no running session
  (`NO_RUNNING_SESSION`), so `LIVEIMPORT-03` is still not verified.
- Final preflight is still `blocked`, but the blocker set is reduced to:
  missing production DB restore context, missing LIVEIMPORT runtime readback,
  and stale backup/restore drill evidence.
- Evidence:
  `history/evidence/v1-protected-proof-reduction-00169d7f-2026-05-13-task.md`,
  `history/plans/prod-ui-module-clickthrough-00169d7f-2026-05-13.md`,
  `history/evidence/v1-rollback-proof-prod-2026-05-13T00-00-00-000Z.md`,
  `history/artifacts/liveimport-03-prod-readback-00169d7f-2026-05-13.json`,
  and `history/releases/v1-final-preflight-00169d7f-2026-05-13.md`.

- `V1-GATE4-PATRYK-SIGNOFF-2026-05-13` applied the user's instruction to use
  `Patryk` for the required Gate 4 approver/owner fields. RC sign-off now
  reports `APPROVED`, and final preflight reports RC external gates, RC
  sign-off, and RC checklist as fresh.
- Remaining final preflight blockers are technical protected proof only:
  missing `LIVEIMPORT_READBACK_*`, missing `ROLLBACK_GUARD_*`, missing
  `PROD_UI_AUDIT_*`, missing production DB restore context, missing
  `LIVEIMPORT-03`, failed authenticated production UI clickthrough, stale DB
  restore evidence, and stale rollback proof.

- `V1-GENERATED-STATE-REFRESH-AFTER-RC-ACTIVATION-2026-05-13` reran the V1
  generated-state chain after activation and RC artifact refresh.
- Generated state remains unchanged and `NO-GO`: `PASS_LOCAL:20`,
  `BLOCKED_AUTH:1`, static findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard
  `86.8%` implementation, `61.3%` evidence coverage, and `42.4%` release
  readiness.

- `V1-RC-CURRENT-BLOCKED-REFRESH-2026-05-13` refreshed RC external gates,
  sign-off, and checklist artifacts for 2026-05-13.
- Final preflight now classifies RC evidence as current `failed`/`BLOCKED`
  rather than stale: Gate 4 approver fields are still missing, so no approval
  was fabricated and V1 remains `NO-GO`.

- `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-13` refreshed production
  activation audit and activation evidence plan artifacts for the current
  evidence date.
- Activation audit/plan are now fresh for 2026-05-13 and explicitly
  `NO-GO`. Refreshed final preflight removed the activation stale blockers but
  remains `blocked` on missing protected auth, missing production DB restore
  context, stale RC/backup-restore/rollback evidence, missing `LIVEIMPORT-03`,
  and failed authenticated production UI clickthrough.
- Evidence:
  `history/audits/v1-production-activation-evidence-audit-2026-05-13.md`,
  `history/plans/v1-production-activation-and-evidence-plan-2026-05-13.md`,
  `history/releases/v1-release-gate-prod-2026-05-13Tactivation-refresh-dry-run.md`,
  and `history/tasks/v1-production-activation-refresh-2026-05-13-task.md`.

- `V1-GENERATED-STATE-REFRESH-AFTER-OPERATOR-PACKET-00169D7F-2026-05-13`
  reran the V1 generated-state chain after publishing the current-day operator
  packet.
- Generated state remains unchanged and `NO-GO`: `PASS_LOCAL:20`,
  `BLOCKED_AUTH:1`, static findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard
  `86.8%` implementation, `61.3%` evidence coverage, and `42.4%` release
  readiness.

- `V1-OPERATOR-PACKET-CURRENT-DAY-REFRESH-00169D7F-2026-05-13` published a
  current no-secret operator unblock packet for the 2026-05-13 evidence set.
- Packet:
  `history/releases/v1-operator-unblock-packet-00169d7f-2026-05-13.md`.
- The packet references the current final preflight, protected input readiness,
  and production UI audit artifacts, lists the required protected inputs and
  Gate 4 approver fields, and keeps V1 explicitly `NO-GO` until the final
  release gate returns `ready`.

- `V1-GENERATED-STATE-REFRESH-AFTER-CURRENT-DAY-BLOCKER-00169D7F-2026-05-13`
  refreshed the V1 project index, static issue scan, master ledger, and
  completion scorecard after current-day blocker evidence.
- Generated state remains `NO-GO`: `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static
  findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard `86.8%` implementation,
  `61.3%` evidence coverage, and `42.4%` release readiness.
- Evidence:
  `history/tasks/v1-generated-state-refresh-after-current-day-blocker-00169d7f-2026-05-13-task.md`,
  `history/plans/project-index-2026-05-13.md`,
  `history/audits/v1-static-issue-scan-2026-05-13.md`,
  `history/audits/v1-master-state-ledger-2026-05-13.md`, and
  `history/releases/v1-completion-scorecard-2026-05-13.md`.

- `V1-CURRENT-DAY-BLOCKER-REFRESH-00169D7F-2026-05-13` refreshed current-day
  no-secret V1 blocker evidence for deployed build-info
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Production build-info matched and final preflight public smoke passed, but
  the 2026-05-13 final preflight remains `blocked` on missing protected
  inputs (`LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
  `PROD_UI_AUDIT_*`, production DB restore context), stale daily release
  artifacts, missing `LIVEIMPORT-03`, current failed production UI
  clickthrough, and stale rollback proof.
- The current protected input readiness sweep found no matching protected input
  environment variable names in the Codex shell and stored no secret values.
- The current production UI audit is fresh `BLOCKED_AUTH`: public routes pass,
  dashboard/admin/legacy protected routes fail closed to `/auth/login`, and
  this is not V1 acceptance evidence. V1 remains `NO-GO`.
- Evidence:
  `history/tasks/v1-current-day-blocker-refresh-00169d7f-2026-05-13-task.md`,
  `history/releases/v1-final-preflight-00169d7f-2026-05-13.md`,
  `history/plans/prod-ui-module-clickthrough-00169d7f-2026-05-13.md`, and
  `history/evidence/v1-protected-input-readiness-00169d7f-2026-05-13.md`.

## 2026-05-12 Production Activation Refresh

- `V1-GENERATED-STATE-REFRESH-AFTER-QUEUE-HYGIENE-00169D7F-2026-05-12`
  refreshed the V1 project index, static scan, master ledger, and completion
  scorecard after stale queue-marker supersessions.
- Generated state remains `NO-GO`: `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static
  findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard `86.8%` implementation,
  `61.3%` evidence coverage, and `42.4%` release readiness. Static scan now
  reports `2 protected/auth queue blockers remain open`, matching
  `CONTROLLED-LIVE-SESSION-PROOF` and `LIVEIMPORT-03`.

- `PROD-UI-AUDIT-PLAN-SUPERSEDE-00169D7F-2026-05-12` closed the historical
  unchecked `PROD-UI-AUDIT-PLAN-2026-05-08` queue item as superseded by the
  current V1 release-gate UI evidence lane: `ops:ui:prod-clickthrough` with
  approved `PROD_UI_AUDIT_*` dashboard/admin auth.
- This is not production UI verification; the final gate still requires a
  fresh PASS `prod-ui-module-clickthrough-*` artifact. V1 remains `NO-GO`.

- `BOTMULTI-09-CONTAINMENT-SUPERSEDE-00169D7F-2026-05-12` closed the
  historical unchecked `BOTMULTI-09` production promotion marker as contained
  in the deployed V1 line and superseded by the shared protected runtime
  readback/final gate lane.
- This is not production runtime verification; `LIVEIMPORT-03` and the final
  release gate remain the required protected proof. V1 remains `NO-GO`.

- `V1-PROTECTED-ACCESS-READINESS-SUPERSEDE-00169D7F-2026-05-12` closed the
  historical unchecked `V1-PROTECTED-ACCESS-READINESS-2026-05-09` queue item
  as superseded by the current `00169d7f` operator packet and protected input
  readiness sweep.
- This is queue hygiene only: protected evidence remains blocked, and V1
  remains `NO-GO`.

- `V1-PROTECTED-INPUT-READINESS-CURRENT-SWEEP-00169D7F-2026-05-12`
  refreshed the no-secret protected input readiness sweep in the current Codex
  shell.
- No matching environment variable names were present for
  `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, `PROD_UI_AUDIT_*`,
  `PROD_UI_*`, `SOAR_PROD_*`, production DB check, RC, or Gate families. No
  secret values were printed or stored. V1 remains `NO-GO` until approved
  protected auth and real Gate 4 approver inputs are available.

- `V1-PROD-UI-CURRENT-BLOCKED-REFRESH-00169D7F-2026-05-12` captured a current
  no-auth production UI clickthrough audit for deployed
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- The audit is fresh `BLOCKED_AUTH`: build-info matched, public routes passed,
  and dashboard/admin/legacy protected routes failed closed to `/auth/login`
  without storing secrets or protected payloads. This is useful blocker truth,
  not V1 acceptance evidence.
- The V1 release gate now prioritizes matched artifact evidence date before
  filename fallback, preventing older lexically later SHA UI artifacts from
  hiding current evidence. Refreshed preflight now reports
  `prodUiClickthrough:failed` for the current 2026-05-12 artifact. V1 remains
  `NO-GO`.

- `V1-OPERATOR-PACKET-UI-ADMIN-AUTH-SYNC-2026-05-12` aligned the active V1
  operator packet with final preflight: the default production UI clickthrough
  requires both dashboard `PROD_UI_AUDIT_AUTH_*` and admin
  `PROD_UI_AUDIT_ADMIN_*` auth because admin routes are included by the runner.
- This is a docs-only correction; V1 remains `NO-GO`.

- `V1-GENERATED-STATE-REFRESH-AFTER-UI-GATE-2026-05-12` refreshed the V1
  project index, static scan, master ledger, and completion scorecard after
  production UI evidence hardening.
- Generated state remains unchanged in release substance: `PASS_LOCAL:20`,
  `BLOCKED_AUTH:1`, static findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard
  `86.8%` implementation, `61.3%` evidence coverage, and `42.4%` release
  readiness. V1 remains `NO-GO`.

- `V1-RELEASE-GATE-PROD-UI-EVIDENCE-HARDENING-2026-05-12` updated the final
  V1 release gate so production readiness now requires a fresh PASS
  `prod-ui-module-clickthrough-*` artifact for authenticated Bots UI coverage.
- Final preflight now reports missing `PROD_UI_AUDIT_*` dashboard/admin auth as
  protected prerequisites and maps missing/failed UI clickthrough evidence to
  the existing `ops:ui:prod-clickthrough` command. V1 remains `NO-GO` until
  approved protected inputs produce fresh PASS artifacts and the final gate is
  rerun.
- Refreshed no-secret preflight for deployed
  `00169d7fdc3aff8317759137b05594b20e773c8e` is blocked with build-info and
  public smoke `PASS`, production DB restore context satisfied,
  current `prodUiClickthrough:failed`, missing `PROD_UI_AUDIT_*`
  dashboard/admin auth,
  missing `LIVEIMPORT_READBACK_*`, missing `ROLLBACK_GUARD_*`, failed RC
  artifacts, missing `LIVEIMPORT-03`, and failed rollback proof.

- `V1-PROD-UI-INPUT-UNBLOCK-SYNC-00169D7F-2026-05-12` synchronized the
  current V1 operator unblock packet with the remaining P1 Bots production-safe
  clickthrough blocker.
- The packet now lists `PROD_UI_AUDIT_*` auth inputs, includes the
  `ops:ui:prod-clickthrough` command before the final release gate, and states
  that public route reachability or unauthenticated redirects do not satisfy V1
  UI evidence. V1 remains `NO-GO` until approved UI audit auth produces a PASS
  artifact plus the protected Operations evidence and final gate are ready.

- `V1-PROTECTED-QUEUE-DEDUPE-2026-05-12` updated V1 static scan reporting so
  protected/auth queue blockers are deduped by task text across `TASK_BOARD`
  and `mvp-next-commits`.
- The scan still reports `3` findings (`P0:1`, `P1:1`, `P2:1`), but the P2
  blocker now reflects `5` unique protected/auth tasks instead of `10`
  duplicated queue markers. V1 remains `NO-GO`.

- `V1-CAPABILITY-GATE-SCAN-CLASSIFICATION-2026-05-12` updated the V1 static
  scan so contract-approved exchange capability gates are no longer counted as
  unresolved findings.
- Refreshed static scan findings dropped from `32` to `3`
  (`P0:1`, `P1:1`, `P2:1`). Remaining findings are the real release blockers:
  Operations `BLOCKED_AUTH`, Bots production-safe clickthrough, and protected
  queue blockers. The `source-capability-gate` category is gone. V1 remains
  `NO-GO`.

- `V1-MANUAL-PAYMENT-METADATA-CLEANUP-2026-05-12` removed ambiguous
  `placeholder` wording from manual payment provider metadata without changing
  checkout behavior.
- Focused subscription checkout proof passed (`8/8`). Refreshed V1 static scan
  findings dropped from `33` to `32` (`P0:1`, `P1:1`, `P2:30`), and the
  `source-marker` category is gone. V1 remains `NO-GO` on protected production
  proof and Operations `BLOCKED_AUTH`.

- `V1-QUEUE-NONE-MARKER-CLEANUP-2026-05-12` removed false unchecked
  `(none)` placeholders from `TASK_BOARD` section headings and refreshed the
  V1 generator chain.
- Static scan findings dropped from `34` to `33` (`P0:1`, `P1:1`, `P2:31`);
  the master ledger no longer reports the `toCleanPlanning` queue-hygiene
  bucket. V1 remains `NO-GO` because Operations is still `BLOCKED_AUTH` and
  production-safe proof requires approved protected inputs.

- `V1-CURRENT-STATE-DRIFT-CLEANUP-2026-05-12` refreshed the V1 generator
  chain after the protected-input checkpoint and cleaned active current-state
  wording that still described the final non-dry-run gate as not run or
  rollback proof as stale.
- Refreshed generated state remains unchanged in substance: project index
  reports `PASS_LOCAL:20` and `BLOCKED_AUTH:1`; static scan reports `34`
  findings (`P0:1`, `P1:1`, `P2:32`); the master ledger remains `NO-GO`;
  the scorecard remains `86.8%` implementation, `61.3%` evidence coverage,
  and `42.4%` release readiness.
- Current truth: the final non-dry-run gate has run and stopped `not_ready`;
  rollback proof is fresh but failed on protected `401`; V1 remains `NO-GO`.

- `V1-PROTECTED-INPUT-READINESS-REFRESH-00169D7F-2026-05-12` refreshed the
  no-secret protected input readiness state for the current Codex execution
  session.
- Readiness artifact:
  `history/evidence/v1-protected-input-readiness-00169d7f-2026-05-12.md`.
- The environment-name sweep checked only names matching
  `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, `PROD_UI_*`, and
  `SOAR_PROD_*`; no matching names were present and no secret values were
  printed or persisted.
- The operator packet now reflects the latest truth: the final production
  release gate has already run without dry-run and stopped `not_ready` on
  protected `/workers/health` `401`. V1 remains `NO-GO`; execute the operator
  packet only after approved protected auth and real Gate 4 approver fields are
  available.

- `V1-RELEASE-GATE-NONDRYRUN-BLOCKED-2026-05-12` ran the production release
  gate without `--dry-run` and with local quality skipped.
- Artifact:
  `history/releases/v1-release-gate-prod-2026-05-12Tnon-dry-run-blocked.md`.
- Build-info freshness passed for
  `00169d7fdc3aff8317759137b05594b20e773c8e`. Public API `/health`, API
  `/ready`, and Web `/` passed inside deploy smoke, but deploy smoke failed on
  protected `/workers/health` with `401`.
- V1 remains `NO-GO`: the non-dry-run gate readiness is `not_ready`.

- `V1-OPERATOR-UNBLOCK-PACKET-00169D7F-2026-05-12` published the current
  no-secret operator unblock packet for deployed build-info
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Packet:
  `history/releases/v1-operator-unblock-packet-00169d7f-2026-05-12.md`.
- The packet lists the exact protected inputs and command order for
  `LIVEIMPORT-03`, rollback proof PASS, RC Gate 4/sign-off/checklist refresh,
  and the final non-dry-run release gate. It does not approve V1.

- `V1-FINAL-PREFLIGHT-CURRENT-2026-05-12` refreshed the final no-secret
  production preflight for deployed build-info
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Preflight artifact:
  `history/releases/v1-final-preflight-00169d7f-2026-05-12.md`.
- Build-info and public smoke passed. Preflight remains `blocked` on missing
  `LIVEIMPORT_READBACK_*`, missing `ROLLBACK_GUARD_*`, failed RC external
  gates/sign-off/checklist, missing `LIVEIMPORT-03`, and failed rollback
  proof.
- V1 remains `NO-GO`; no deploy, sign-off, rollback, or live-money action was
  executed.

- `V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-12` refreshed production
  rollback proof evidence to current-date fail-closed truth.
- Rollback proof artifact
  `history/evidence/v1-rollback-proof-prod-2026-05-12T00-00-00-000Z.md`
  reports `Status: **FAIL**` with `shouldRollback: true` because protected
  runtime freshness and alerts endpoints returned `401`.
- Release gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-12Trollback-refresh-dry-run.md`
  now classifies rollback proof as `failed` rather than stale.
- V1 remains `NO-GO`: protected rollback auth, Gate 4 approvers, LIVEIMPORT-03
  production readback, and a final non-dry-run gate result of `ready` are still
  missing.

- `V1-RC-BLOCKED-REFRESH-2026-05-12` refreshed RC external gates status,
  RC sign-off, and release-candidate checklist to current-date blocked truth.
- Release gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-12Trc-blocked-refresh-dry-run.md`
  now classifies RC external gates, RC sign-off, and RC checklist as `failed`
  rather than stale.
- V1 remains `NO-GO`: Gate 4 approver fields are missing, LIVEIMPORT-03
  production readback is missing, rollback proof is fresh but failed on
  protected `401`, and approved protected prod ops auth is still needed.

- `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-12` refreshed activation audit and
  activation execution plan artifacts to current-date `NO-GO` truth.
- New artifacts:
  `history/audits/v1-production-activation-evidence-audit-2026-05-12.md` and
  `history/plans/v1-production-activation-and-evidence-plan-2026-05-12.md`.
- Release gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-12Tactivation-refresh-dry-run.md`
  now classifies activation evidence audit and activation execution plan as
  `fresh` for 2026-05-12.
- V1 remains `NO-GO`: RC Gate 4/sign-off is not approved, LIVEIMPORT-03
  production readback is missing, rollback proof is fresh but failed on
  protected `401`, and approved protected prod ops auth is still needed.

## 2026-05-12 Production Restore Drill Refresh

- `V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12` refreshed the production
  backup/restore drill evidence to current-date `PASS`.
- Production Postgres container `x11cfnz1dd9x0yzccftqzcoe` was backed up with a
  compressed dump, restored into isolated database
  `postgres_restore_check_20260512152138`, validated with aggregate table
  counts, then cleaned up.
- Validation counts: `Bot=6`, `Log=52740`, `Order=3981`, `Position=4787`,
  `User=4`.
- Cleanup proof returned `LEFTOVER_RESTORE_DATABASES=0` and
  `LEFTOVER_BACKUPS=0`.
- Evidence:
  `history/evidence/v1-restore-drill-prod-2026-05-12T15-21-38Z.md` and
  `history/artifacts/_artifacts-restore-drill-prod-coolify-2026-05-12T15-21-38Z.json`.
- Release gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-12Trestore-refresh-dry-run.md`
  now classifies backup/restore drill evidence as `fresh` for 2026-05-12.
- V1 remains `NO-GO`: activation audit/plan are fresh `NO-GO`, RC sign-off is
  blocked, RC Gate 4/checklist are failed, LIVEIMPORT-03 production readback is
  missing, and rollback proof is fresh but failed on protected `401`.

## 2026-05-12 Operations Production Read-Only Proof

- `V1-OPERATIONS-PROD-READONLY-PROOF-2026-05-12` collected safe read-only
  production/stage Operations evidence without deploy, rollback execution,
  restore execution, database mutation, app-data mutation, token minting, JWT
  signing, live bot activation, or secret output.
- Production public no-worker deploy smoke passed for
  `https://api.soar.luckysparrow.ch` and `https://soar.luckysparrow.ch`.
  Public production `build-info`, `/health`, and `/ready` returned `200`;
  deployed web SHA is `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Stage public smoke failed with `503` for API health, API ready, and web `/`.
- VPS Docker read-only inventory shows Soar production API, Web, four workers,
  Redis, and Postgres containers running. API/Web/workers are `Up 42 hours`;
  Redis/Postgres are `Up 5 days (healthy)`.
- Production V1 release gate report
  `history/releases/v1-release-gate-prod-2026-05-12Tprod-readonly.md` is
  `not_ready`: activation audit/plan, RC sign-off, backup/restore drill, and
  rollback proof are stale for 2026-05-12; RC external gates/checklist are
  fresh but failed because Gate 4 is not approved; LIVEIMPORT-03 production
  readback is missing; full post-deploy smoke stops at protected
  `/workers/health` with `401` because approved app/operator auth is missing.
- Operations remains `BLOCKED_AUTH`; public production health is not enough for
  V1 release approval.

## 2026-05-12 Operations Local Proof

- `V1-OPERATIONS-LOCAL-PROOF-2026-05-12` partially proves local Operations
  scripts but does not unblock V1 release approval.
- Local rollback proof passed with `shouldRollback:false`, runtime freshness
  `PASS`, and no alerts.
- Short local SLO evidence and a 7-day SLO window report were generated.
- Local RC gate pipeline produced Gate 1/2/3 `PASS`; Gate 4 remains blocked
  because final Engineering/Product/Operations/RC-owner sign-off is missing.
- Local V1 release gate passed deploy smoke, runtime freshness, and rollback
  guard with local quality/build intentionally skipped for this release-safety
  probe.
- Local LIVEIMPORT-03 readback authenticated and did not capture the token, but
  failed because no LIVE bots/running import sessions existed (`botsChecked:0`).
- Operations remains `BLOCKED_AUTH` for V1 release approval until approved
  stage/prod credentials, production/stage rollback proof, backup/restore
  evidence, Gate 4 sign-off, production-safe SLO/release gate, and a safe
  LIVE/import readback fixture are provided.

## 2026-05-12 Subscriptions/Admin Local Proof

- `V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12` moves
  Subscriptions/Admin to `PASS_LOCAL` in the V1 product action matrix.
- API Subscriptions/Admin proof passed (`3` files, `18` tests), covering
  unauthenticated and non-admin rejection, admin subscription plan catalog,
  price/entitlement update validation, invalid entitlement rejection, admin
  user list with active subscription metadata, role/plan updates, self-
  demotion blocking, and profile subscription readback.
- Web Admin/Profile Subscription proof passed (`3` files, `7` tests),
  covering admin subscriptions loaded/error/edit states, admin users loaded/
  error/role-toggle/plan-assignment states, and profile subscription panel
  retry behavior.
- Local protected admin route audit passed with a throwaway admin. Edge/CDP
  browser proof rendered `/admin/subscriptions` and `/admin/users` with no
  framework overlay; screenshots and JSON artifacts are in
  `C:\tmp\soar-v1-admin-proof`.
- Remaining proof: production admin clickthrough with approved non-destructive
  data and entitlement checks. Operations is now the remaining blocked V1 row
  before release-readiness work can move beyond local proof.
- Refreshed V1 reports after Subscriptions/Admin: `PASS_LOCAL:20`,
  `BLOCKED_AUTH:1`; static scan findings `41` (`P0:1`, `P1:8`, `P2:32`);
  master ledger `NO-GO` with `doneLocalNeedsProdProof:20`, `blocked:1`;
  scorecard `NO-GO`, implementation estimate `86.8%`, evidence coverage
  `61.3%`, release readiness `42.4%`.

## 2026-05-12 Subscriptions Focused Test Gap Closure

- `V1-SUBSCRIPTIONS-FOCUSED-TESTS-2026-05-12` adds direct focused coverage in
  `apps/api/src/modules/subscriptions/subscriptionEntitlements.service.test.ts`
  for invalid entitlement fallback and FREE-plan LIVE trading fail-closed
  behavior.
- Validation passed: focused Vitest (`2/2`), API typecheck, V1
  project-index/static-scan/master-ledger/scorecard refresh, repository
  guardrails, and diff check.
- The 2026-05-12 static scan no longer reports
  `API_MODULE_NO_TESTS_SUBSCRIPTIONS`; findings are now `41`
  (`P0:1`, `P1:8`, `P2:32`) and the scorecard keeps V1 at `NO-GO`.

## 2026-05-12 Web Orders/Positions Doc Truth

- `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12` aligns
  `docs/modules/web-orders.md` and `docs/modules/web-positions.md` with the
  canonical route map: `/dashboard/orders` and `/dashboard/positions` remain
  legacy redirects to Bot Runtime, while runtime Orders/Positions UX is owned
  by Dashboard Home and Bot Runtime.
- Validation passed: middleware redirect tests (`3/3`), V1
  project-index/static-scan/master-ledger/scorecard refresh, repository
  guardrails, and diff check.
- The 2026-05-12 static scan no longer reports the two web Orders/Positions
  documented-placeholder gaps; findings are now `39`
  (`P0:1`, `P1:6`, `P2:32`) and the scorecard keeps V1 at `NO-GO`.

## 2026-05-12 API Subscriptions Doc Truth

- `V1-API-SUBSCRIPTIONS-DOC-TRUTH-2026-05-12` aligns
  `docs/modules/api-subscriptions.md` with the current V1 billing boundary:
  checkout intent creation and admin/profile subscription state are in scope,
  while provider webhook reconciliation remains future billing lifecycle
  scope.
- Validation passed: V1 project-index/static-scan/master-ledger/scorecard
  refresh, repository guardrails, and diff check.
- The 2026-05-12 static scan no longer reports
  `DOC_PLACEHOLDER_DOCS_MODULES_API_SUBSCRIPTIONS_MD`; findings are now `38`
  (`P0:1`, `P1:6`, `P2:31`) and the scorecard keeps V1 at `NO-GO`.

## 2026-05-12 Static Scan Legacy Route Classification

- `V1-STATIC-SCAN-LEGACY-ROUTE-CLASSIFICATION-2026-05-12` updates
  `scripts/runV1StaticIssueScan.mjs` so approved `/dashboard/orders` and
  `/dashboard/positions` legacy redirects plus runtime-owned Orders/Positions
  web feature shells are not reported as missing route/page implementation.
- Validation passed: `node --check scripts/runV1StaticIssueScan.mjs`, V1
  project-index/static-scan/master-ledger/scorecard refresh, repository
  guardrails, and diff check.
- The 2026-05-12 static scan now reports `34` findings
  (`P0:1`, `P1:2`, `P2:31`), with concrete non-proof gaps reduced to `1`.
  V1 remains `NO-GO`; Operations protected evidence remains the P0 blocker.

## 2026-05-12 Static Scan Queue Blocker Classification

- `V1-STATIC-SCAN-QUEUE-BLOCKER-CLASSIFICATION-2026-05-12` updates
  `scripts/runV1StaticIssueScan.mjs` so known protected/auth queue blockers
  remain open but are classified as `queue-blocked` instead of unclassified
  local queue drift.
- Validation passed: `node --check scripts/runV1StaticIssueScan.mjs`, V1
  project-index/static-scan/master-ledger/scorecard refresh, repository
  guardrails, and diff check.
- The 2026-05-12 static scan now reports `34` findings
  (`P0:1`, `P1:1`, `P2:32`), and `concreteNonProofGaps` is `0`.
  V1 remains `NO-GO`; Operations protected evidence remains the P0 blocker.

## 2026-05-11 Workers Local Proof

- `V1-WORKERS-LOCAL-PROOF-2026-05-11` moves Workers to `PASS_LOCAL` in the V1
  product action matrix.
- API Workers/stream/runtime proof passed (`18` files, `88` tests), covering
  worker ownership/topology, market-stream source config, subscriptions,
  fanout retry, market-stream route contracts/e2e, Exchange polling source/
  fanout, Binance stream parsing, protected worker health/readiness, runtime
  freshness pass/fail/skip behavior, protected `/ready` diagnostics, PAPER
  runtime-flow worker telemetry, execution orchestrator behavior/import
  cleanup, execution adapter parity, backtest run job persistence, and queue
  tuning.
- Fixed worker-adjacent e2e isolation so runtime sessions, symbol stats,
  signals, backtest runs, and market candle cache do not leak into later
  focused worker/runtime tests.
- Refreshed V1 reports after Security/Privacy: `PASS_LOCAL:18`,
  `UNVERIFIED:1`, `BLOCKED_AUTH:2`; implementation estimate `82.1%`,
  evidence coverage `55.3%`, release readiness `38.3%`. V1 remains `NO-GO`.
- Remaining proof: production-safe protected worker/process proof for deployed
  health/readiness/freshness, queue/process lifecycle, and observability.

## 2026-05-11 Security/Privacy Local Proof

- `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11` moves Security/Privacy to
  `PASS_LOCAL` in the V1 product action matrix.
- API Security/Privacy proof passed (`23` files, `111` tests), covering
  headers/cache, alerts/metrics admin access, `/ready` secret/runtime
  diagnostics, API error redaction, crypto keyring and legacy decrypt behavior,
  rate-limit degradation, ops-network/trusted-origin/auth middleware, critical
  secret readiness, Auth lifecycle/JWT/cookie/error contracts, cross-module
  data isolation, Profile API-key ownership/secret handling/probes, Profile
  password/account deletion, stage abuse throttling, and authenticated position
  snapshots.
- Web Auth/Profile proof passed (`13` files, `48` tests), covering middleware,
  AuthContext, login/register forms/hooks/types, public auth cache contract,
  profile page, API-key form/list, security form, and basic profile form.
- Tightened test env restoration for JWT rotation and API-key encryption
  keyring variables so focused security packs do not leak invalid env between
  files.
- Remaining proof: production-safe protected security proof and external/
  independent security review.

## 2026-05-12 UX/A11y/Mobile Local Proof

- `V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11` moves UX/A11y/Mobile to
  `PASS_LOCAL` in the V1 product action matrix.
- Focused Web UX/a11y/state tests passed (`25` files, `126` tests), covering
  shared view states, data tables/tabs, form primitives and invalid-field
  focus, dashboard/page title accessibility, responsive header/footer,
  Dashboard Home states, Bots, Wallets, Markets, Strategies, Backtests,
  Reports, Logs, Auth, Profile, and route locale smoke.
- Local authenticated route/clickthrough audit passed.
- Edge/CDP proof captured desktop Dashboard empty/onboarding, desktop Wallets
  empty state, mobile Dashboard, and mobile menu screenshots. Mobile menu
  focus/click interaction worked, no framework overlay was detected, and CDP
  console/exception proof returned `0` events.
- Remaining proof: production browser clickthrough and external accessibility
  review.

## 2026-05-11 Backtests Local Proof

- `V1-BACKTESTS-LOCAL-PROOF-2026-05-11` moves Backtests to `PASS_LOCAL` in the
  V1 product action matrix.
- API Backtests proof passed (`12` files, `110` tests), covering auth/
  ownership, create/list/get/delete, explicit range validation, enriched list
  fields, pending report lifecycle, strategy-to-backtest-to-paper/live critical
  flow, paper/live parity with reconciliation, venue consistency, market-
  universe symbol formula, empty-symbol fail-closed behavior, 3-symbol paper
  alignment, failed parity diagnostics, queue/job persistence, replay core,
  runtime kernel parity, contract remediation, data gateway, fill model, range
  service, and indicator timeline series.
- Web Backtests proof passed (`13` files, `32` tests), covering list/create/
  detail route shells, create form, run details, list view, runs table actions,
  core-data hook, view-models, non-overlapping trade segments, pair metrics,
  and timeline overlays.
- Remaining proof: production-safe Backtests browser clickthrough for create/
  delete/details/report/timeline on approved representative RSI strategy and
  market data.

## 2026-05-11 Reports Local Proof

- `V1-REPORTS-LOCAL-PROOF-2026-05-11` moves Reports to `PASS_LOCAL` in the V1
  product action matrix.
- API Reports proof passed (`1` file, `2` tests), covering weighted BACKTEST
  report aggregation and PAPER trade aggregation.
- Web Reports proof passed (`3` files, `5` tests), covering `/dashboard/reports`
  route shell, empty state, aggregated cards/tables, and route-reachable locale
  copy.
- Remaining proof: production-safe Reports browser clickthrough on approved
  representative data. Export/download is outside the current implemented
  Reports surface.

## 2026-05-11 Logs/Audit Trail Local Proof

- `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11` moves Logs/Audit Trail to
  `PASS_LOCAL` in the V1 product action matrix.
- API Logs proof passed (`2` files, `5` tests), covering unauthenticated
  rejection, owner-only log reads, source/actor/severity filters, bot action-
  produced audit event visibility, and pagination defaults/bounds.
- Web Logs proof passed (`3` files, `4` tests), covering `/dashboard/logs`
  route shell, empty/loaded states, severity filter request payload, metadata
  trace rendering, and route-reachable locale copy.
- Remaining proof: production-safe Logs/Audit Trail browser clickthrough on
  approved representative data.

## 2026-05-11 Exchange Adapter Local Proof

- `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11` moves Exchange Adapter to
  `PASS_LOCAL` in the V1 product action matrix.
- Fixed Gate.io public catalog symbol normalization so generic adapter ids
  such as `BTC_USDT` are emitted as canonical Soar symbols such as `BTCUSDT`.
- API Exchange proof passed (`19` files, `93` tests), covering probes,
  capability contracts, public/authenticated reads, connector factory/registry,
  live adapter retry/fill/fee boundaries, symbol rules, metadata, snapshot
  normalization, and runtime exchange order guards.
- Web Exchanges/Profile API-key proof passed (`5` files, `17` tests), covering
  capability gating, redirect/integration, API-key connection tests, stored-key
  tests, and delete risk confirmation.
- Remaining proof: production-safe exchange-boundary proof with approved real
  credentials or read-only operations. Real live mutation remains blocked-risk
  without an explicit safe plan.

## 2026-05-08 UX/UI Feedback Memory Autonomy
- 2026-05-08 `UX-UI-MEMORY-AUTONOMY-2026-05-08` made UX/UI feedback capture
  autonomous for future agents by extending the existing user feedback loop,
  design memory, and screen quality checklist. Future UX/UI tasks must classify
  user guidance as reusable rule, visual direction, anti-pattern,
  screen-specific feedback, open decision, or recurring agent mistake; store it
  in the matching source of truth; and review design memory before
  implementation. Evidence:
  `history/tasks/ux-ui-memory-autonomy-process-task-2026-05-08.md`.

## 2026-05-08 V1 Paper/Live Backend Runtime Parity
- 2026-05-11 `V1-ORDERS-LOCAL-PROOF-2026-05-11` closes the local Orders proof
  gap. API Orders tests passed (`10` files, `121` tests), covering active
  order filtering, PAPER/LIVE open contracts, missing price truth rejection,
  same-symbol add/reverse conflict handling, canonical bot context, LIVE
  pretrade/risk guards, exchange ids/status/fills/fees, execution error
  propagation, manual context rules, close attribution, stale/open exchange-
  backed cancel and close fail-closed behavior, API list/get ownership,
  exchange event open/close/DCA/account-update lifecycle, partial/underfilled/
  capped fill progress, fee pending/backfill, live fill resolution, quantity
  rules, position scope, and live cancel boundary. Web Orders tests passed
  (`2` files, `3` tests), covering source labels, active open-order cancel
  action, and terminal order read-only behavior. Orders is now `PASS_LOCAL`;
  production-safe browser clickthrough remains open and live mutation remains
  blocked-risk without explicit safe plan.
- 2026-05-11 `V1-POSITIONS-LOCAL-PROOF-2026-05-11` closes the local Positions
  proof gap. API Positions tests passed (`12` files, `90` tests), covering
  list/read ownership, symbol filter normalization, stale local exclusion,
  live status scoping, exchange snapshot selection/fail-closed behavior,
  authenticated snapshots, takeover classification/rebind, orphan repair,
  imported lifecycle history, reconciliation diagnostics, manual TP/SL safety,
  management-mode guards, runtime visibility, close flows, external DCA
  separation, and carryover open orders. Web Positions tests passed (`3`
  files, `10` tests), covering runtime PnL derivations/fallbacks and ignored/
  closed/pending close UI states. Positions is now `PASS_LOCAL`; production-
  safe browser clickthrough remains open and LIVE mutation remains blocked-risk
  without explicit safe plan.
- 2026-05-11 `V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11` closes the local
  Manual Orders proof gap. API Manual Orders tests passed (`7` files,
  `75` tests), covering manual context, PAPER market truth, open/cancel/close
  endpoints, order/position ownership, selected-bot write/read scope, quantity
  rules, position scope, LIVE risk guards, exchange-backed fail-closed cancel
  behavior, live fill resolution, and live cancel boundary. Web Manual Orders
  tests passed (`6` files, `20` tests), covering Dashboard Home submit,
  validation, context/venue/scope semantics, open-order source labels,
  open-order cancel actions, and submitted/waiting/ready/imported/position-
  opened/blocked action states. Manual Orders is now `PASS_LOCAL`; production-
  safe browser clickthrough remains open and LIVE order actions remain blocked-
  risk without explicit safe plan.
- 2026-05-11 `V1-STRATEGIES-LOCAL-PROOF-2026-05-11` closes the local
  Strategies proof gap. API Strategies tests passed (`3` files, `17` tests),
  covering authenticated CRUD, export/import package contracts, advanced TSL
  valid/invalid validation, invalid import rejection, cross-user get/update/
  delete isolation, active-bot update/delete blocking, inactive bot update
  allowance, DCA reachability validation, and indicator catalog service
  behavior. Web Strategies tests passed (`14` files, `46` tests), covering
  list clone naming/create payload, create/edit/detail route shells, form
  validation and tab flow, zero lifetime, advanced TSL and reordered DCA
  validation, unreachable DCA blocking, preset utilities, indicator section
  behavior, form mapping, numeric normalization, close validation, indicator
  presentation, and taxonomy. Strategies is now `PASS_LOCAL`; production-safe
  browser clickthrough and representative runtime/backtest compatibility proof
  remain open.
- 2026-05-11 `V1-MARKETS-LOCAL-PROOF-2026-05-11` closes the local Markets
  proof gap. API Markets e2e passed (`17/17`), covering authenticated CRUD,
  normalization, canonical symbol composition, linked symbol-group sync, empty
  symbol set handling, Binance/Gate.io catalog reads, placeholder exchange
  persistence, explicit not-implemented catalog response, active bot update/
  delete blocking, inactive PAPER/LIVE bot edits, deactivation-through-bot-API
  edits, stale legacy link ignore, active primary bot drift blocking, and
  cross-user isolation. Web Markets tests passed (`5` files, `12` tests),
  covering form preview parity, saved volume filter, whitelist/blacklist
  composition, catalog-hidden whitelist selection, empty preview submit, edit-
  mode saved selections, placeholder exchange submit, validation helper, table
  clone payload, and route shells. Markets is now `PASS_LOCAL`; production-
  safe browser clickthrough remains open.
- 2026-05-11 `V1-WALLETS-LOCAL-PROOF-2026-05-11` closes the local Wallets
  proof gap. API Wallets tests passed (`4` files, `43` tests), covering CRUD
  normalization, ownership isolation, active-bot edit/delete guards, LIVE
  api-key/allocation validation, exchange mismatch rejection, Gate.io PAPER/
  LIVE support, preview allocation modes, unsupported placeholder preview
  fail-closed behavior, Gate.io stored-key preview, paper reset guards, reset
  checkpoint preservation, cashflow classification, and wallet open-PnL
  scoping. Web Wallets tests passed (`9` files, `22` tests), covering list/
  empty/create routes, inline API-key state, clone payload, create/edit form
  validation, mode-specific fields, LIVE preview, metadata options, Gate.io
  PAPER submit, paper reset success/error states, preview summary/timeline/
  cashflow, partial ledger, and unavailable ledger fail-closed state. Wallets
  is now `PASS_LOCAL`; production-safe browser clickthrough remains open.
- 2026-05-11 `V1-PROFILE-LOCAL-PROOF-2026-05-11` closes the local Profile
  basic/security proof gap. API Profile basic/security e2e passed (`2` files,
  `7` tests), covering self-delete route behavior, legacy delete rejection,
  valid timezone persistence, invalid timezone rejection, unauthenticated
  security access rejection, valid-current-password change, weak/invalid
  password rejection, old-login failure/new-login success, and password-
  confirmed account deletion. Focused Web Profile tests passed (`2` files,
  `5` tests), covering basic profile save success/error toasts, timezone
  preference payload, password mismatch short-circuit, and successful password
  change payload/feedback. Profile is now `PASS_LOCAL`; production-safe
  browser clickthrough remains open.
- 2026-05-11 `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11` closes the local
  Profile API Keys proof gap. API key e2e and exchange probe service tests
  passed (`2` files, `25` tests), covering encrypted storage, masked
  responses, owner-only lifecycle actions, Binance/Gate.io provided and stored
  probes, no persistence of provided test credentials, audit metadata without
  raw secrets, placeholder probe fail-closed behavior, and bad-key/futures-
  missing rejection. Web tests passed (`2` files, `13` tests), covering
  connection-test-before-save, stored-key test action, probe support status,
  placeholder exchange save behavior, and delete risk confirmation. Profile
  API Keys is now `PASS_LOCAL`; production-safe browser clickthrough and audit-
  log visibility remain open.
- 2026-05-11 `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11` closes the local
  Auth session lifecycle proof gap. API Auth e2e passed (`11/11`) and proves
  registration/login cookie TTLs, logout cookie clearing plus subsequent
  `/auth/me` 401, deleted-user session expiry, expired JWT cookie clearing with
  session-expired message, and duplicate token precedence. Focused Web Auth
  tests passed (`5` files, `17` tests) and prove AuthProvider bootstrap,
  logout redirect, session-expired warning cleanup, API interceptor redirect,
  middleware cookie gate, login form states, and login hook fail-closed
  missing-session-refresh behavior. Auth is now `PASS_LOCAL`; production-safe
  browser clickthrough remains open.
- 2026-05-11 `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11` closes the
  local worker telemetry/live-loop proof gap for Bot Runtime. Focused
  `runtime-flow.e2e.test.ts` evidence now proves a real `RuntimeSignalLoop`
  PAPER lifecycle creates a `RUNNING` session, writes at least three runtime
  events, tracks `BTCUSDT` symbol stats with long and exit counters, closes the
  runtime position, and reads the same telemetry through authenticated runtime
  session list, detail, symbol-stats, and aggregate APIs. Bot Runtime is now
  `PASS_LOCAL` in the product action matrix, but `SOAR-BOT-RUNTIME-001`
  remains `PARTIAL`, not `VERIFIED`, until production-safe/non-local
  clickthrough is complete.
- 2026-05-11 `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11` extends
  the approved PAPER snapshot import with a deterministic local completed
  runtime session. API readbacks prove `RUNNING,COMPLETED` session list truth,
  one completed session with one event and three symbol-stat rows, zero open
  completed positions, and aggregate metadata `sessionsCount: 2`. Authenticated
  browser proof filters the canonical Bot Runtime route to `COMPLETED` and
  renders PAPER completed-session state with `0 open`, the three symbols, and
  wallet totals. Worker telemetry is now covered by
  `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`; production-safe/non-local
  clickthrough is still open.
- 2026-05-11 `V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11` adds
  local authenticated browser evidence for the canonical Bot Runtime monitoring
  route. The approved PAPER snapshot import created a representative running
  session for bot `2009f226-28ed-4231-878b-350d27057b5f`; API readbacks for
  runtime sessions, aggregate, positions, symbol stats, and trades returned
  `200`, with one PAPER `RUNNING` session and `openCount: 3`. Authenticated
  Playwright fallback proof rendered `/dashboard/bots/.../preview` on
  desktop/tablet/mobile with bot `asd`, status `RUNNING`, mode `PAPER`,
  `BTCUSDT`/`BNBUSDT`/`ETHUSDT`, wallet KPI text, safe view switch, no console
  issues, and legacy runtime redirects to preview. `SOAR-BOT-RUNTIME-001`
  remains `PARTIAL`, not `VERIFIED`; the stopped/completed gap is now covered
  by `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`, while production-
  safe/non-local proof remains open.
- 2026-05-11 `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11`
  upgrades the existing PAPER snapshot import so local representative data
  drives the runtime APIs Dashboard Home actually consumes. The importer now
  creates deterministic PAPER wallet/session/stat/event fixture data for the
  imported active bot. API readback proves `/runtime-sessions` `RUNNING`,
  session positions `openCount: 3`, and aggregate `openCount: 3`. Authenticated
  browser fallback proof renders `/dashboard` on desktop/tablet/mobile with
  status `RUNNING`, rows for `BTCUSDT`, `BNBUSDT`, `ETHUSDT`, portfolio
  `10,000.00 USDT`, free funds `7,000.00 USDT`, and `Orders` tab interaction.
  `SOAR-DASHBOARD-001` remains `PARTIAL`, not `VERIFIED`, until production-safe
  clickthrough/non-local proof is captured.
- 2026-05-11 `V1-DASHBOARD-HOME-ACTIVE-RUNTIME-BROWSER-PROOF-2026-05-11`
  adds partial local browser evidence for Dashboard Home on the approved PAPER
  runtime snapshot. Snapshot import succeeded for 1 active PAPER bot and 3
  open position fixture rows; local API `/health` and Web `/auth/login`
  returned `200`; authenticated Playwright fallback proof rendered `/dashboard`
  on desktop `1280x720`, tablet `768x1024`, and mobile `390x844` with bot
  `asd`, PAPER mode, `BTCUSDT`/`BNBUSDT`/`ETHUSDT`, market/strategy context,
  wallet baseline `10,000.00`, no framework overlay, no console errors, and
  `Orders` tab interaction. This is not full V1 verification: Dashboard Home
  reports `NO_SESSION`, the table shows `No open positions`, and
  `/runtime-sessions` returns `[]` despite the imported position rows. Evidence:
  `history/evidence/v1-dashboard-home-active-runtime-browser-proof-task-2026-05-11.md`.
- 2026-05-11 `V1-DASHBOARD-HOME-BROWSER-PROOF-2026-05-11` adds local
  authenticated browser evidence for Dashboard Home empty/onboarding state.
  The proof used local API/Web, a throwaway `/auth/register` session, desktop
  `1280x720`, mobile `390x844`, keyboard focus on `Open wallets`, framework
  overlay check, and console health. A shared `ThemeSwitcher` hydration-noise
  console error was fixed before final proof. Validation passed: targeted Web
  Vitest (`4` files, `36` tests), Web typecheck, and repository guardrails.
  `SOAR-DASHBOARD-001` remains
  `PARTIAL`, not `VERIFIED`, because active selected-bot runtime browser proof
  on representative data, tablet/touch proof, and production-safe clickthrough
  are still open. Evidence:
  `history/evidence/v1-dashboard-home-browser-proof-task-2026-05-11.md`.
- 2026-05-11 `V1-DASHBOARD-HOME-SELECTED-BOT-RENDERED-AUDIT-2026-05-11`
  adds rendered Dashboard Home evidence for loading state, retryable error
  state, selected-bot switching across two active PAPER bots, selected wallet
  KPI recalculation, open-orders tab data, trade-history tab data, and stale
  previous-bot row suppression. Validation passed: focused Dashboard pack
  (`3` files, `35` tests), Web typecheck,
  repository guardrails, and diff check. `SOAR-DASHBOARD-001` is `PARTIAL`,
  not `VERIFIED`, until browser responsive/keyboard proof and production-safe
  clickthrough are captured. Evidence:
  `history/audits/v1-dashboard-home-selected-bot-rendered-audit-task-2026-05-11.md`.
- 2026-05-11 `BOT-DELETE-ACTIVE-PAPER-2026-05-11` addresses the fresh
  `SOAR-BOTS-001` P0 delete-bot report for the local UI controller path.
  Active PAPER bot deletion no longer shows the LIVE-risk confirmation, while
  LIVE or live-opt-in bots remain guarded. Validation passed: Web Vitest
  (`147` files, `501` tests), API Bots e2e (`27/27`) with explicit local
  `DATABASE_URL`, Web typecheck, repository guardrails, and diff check.
  Module confidence is `PARTIAL`, not `VERIFIED`, until a production-safe
  browser clickthrough on representative data confirms the operator-reported
  failure is gone. Evidence:
  `history/tasks/bot-delete-active-paper-confirmation-task-2026-05-11.md`.
- 2026-05-11 `V1-COMPLETION-SCORECARD-2026-05-11` adds a weighted progress
  model above the master state ledger. Future status answers should separate
  implementation estimate from proof and release readiness. Current derived
  result: V1 remains `NO-GO`; implementation estimate is `77%`, evidence
  coverage is `47.8%`, and release readiness is `33.1%`. All 13 P0 modules are
  still not release-ready, with `Subscriptions/Admin` and `Operations`
  blocked. Evidence:
  `history/releases/v1-completion-scorecard-task-2026-05-11.md` and
  `history/releases/v1-completion-scorecard-2026-05-11.md`.
- 2026-05-10 `V1-MASTER-STATE-LEDGER-2026-05-10` adds the consolidated
  continuation ledger for V1. Future broad audit/repair work must start from
  `history/audits/v1-master-state-ledger-2026-05-10.md` instead of memory or
  older partial reports. The ledger combines the project index and static scan,
  keeps V1 at `NO-GO`, and classifies work into buckets:
  `toProve: 3` modules, `blocked: 2`, and
  `doneLocalNeedsProdProof: 16`. It also carries 46 findings
  (`P0: 4`, `P1: 10`, `P2: 32`) with concrete non-proof gaps separated from
  missing-evidence rows. Evidence:
  `history/audits/v1-master-state-ledger-task-2026-05-10.md` and
  `history/audits/v1-master-state-ledger-2026-05-10.md`.
- 2026-05-10 `PROJECT-INDEXING-BASELINE-2026-05-10` adds a local no-network
  project index generator for V1 continuation. `pnpm run ops:project:index`
  maps the V1 module action matrix to API modules, Web features, routes,
  workers, package scripts, test inventory, architecture sources, and open
  queue markers. The current generated report confirms the action matrix is
  still `NO-GO`: `PASS_LOCAL: 16`, `UNVERIFIED: 3`, `BLOCKED_AUTH: 2`.
  Evidence:
  `history/audits/project-indexing-baseline-task-2026-05-10.md` and
  `history/plans/project-index-2026-05-10.md`.
- 2026-05-10 `PROJECT-INDEX-V1-CROSSWALK-2026-05-10` extends the project
  index with a prioritized V1 audit work map for all 21 module action rows.
  Each row now points to likely API modules, Web features, routes, workers,
  scripts, candidate tests, risk class, and next proof. Dashboard Home is the
  first priority and Bot Runtime is second. Evidence:
  `history/tasks/project-index-v1-crosswalk-task-2026-05-10.md` and
  `history/plans/project-index-2026-05-10.md`.
- 2026-05-10 `V1-STATIC-ISSUE-SCAN-2026-05-10` adds `ops:project:scan` and
  publishes a static inconsistency scan on top of the project index. Current
  scan finds 46 items: `P0: 4`, `P1: 10`, `P2: 32`. The strongest concrete
  non-proof surface gaps are empty Web `orders`, missing `/dashboard/orders`
  and `/dashboard/positions` route pages, no focused Web `positions` tests,
  no focused API `subscriptions` tests, placeholder docs for Web orders/
  positions, and open queue markers that need classification. Evidence:
  `history/audits/v1-static-issue-scan-task-2026-05-10.md` and
  `history/audits/v1-static-issue-scan-2026-05-10.md`.
- 2026-05-10 `V1-DASHBOARD-HOME-RENDERED-RUNTIME-AUDIT-2026-05-10` adds the
  first rendered Dashboard Home bridge for the operator-reported TTP issue.
  A dedicated small `HomeLiveWidgets.runtime-table-audit.test.tsx` file renders
  the real Dashboard component through existing service boundaries and proves
  that a negative-PnL open position keeps the TTP column visible while hiding
  prospective TTP label/value. The broader Dashboard Home row remains
  `PARTIAL_LOCAL`, not full PASS.
- 2026-05-10 `V1-DASHBOARD-RUNTIME-TABLE-ACTION-AUDIT-2026-05-10` closes the
  local Dashboard runtime table presenter/action slice after the operator
  challenged earlier overstated readiness. The focused Web presenter suite now
  covers local open-order cancel, terminal order read-only behavior,
  exchange-backed cancel blocked display, negative PnL/error styling,
  prospective TTP hidden at zero/negative live PnL, backend/runtime TTP
  precedence over fallback and TSL, TSL-only display, and non-actionable
  open-position edit/close buttons. Dashboard Home and Bot Runtime are only
  `PARTIAL_LOCAL` in the product action matrix; rendered component/browser
  audit and production-safe clickthrough remain open before V1 can be called
  ready.
- 2026-05-10 `V1-BOTS-ACTION-AUDIT-2026-05-10` closes the first module-level
  action audit slice for Bots on safe local fixtures. The Web Bots list now has
  regression coverage for delete success and delete failure UI behavior. The
  API Bots e2e pack passes end-to-end for CRUD, delete cleanup, runtime close,
  ownership isolation, market groups, strategy links, LIVE opt-in guards,
  duplicate active guards, and runtime monitoring. Bots e2e reset now clears
  runtime ticker store state so hidden in-memory market data cannot leak
  between action tests. This is local action evidence; production-safe Bots
  clickthrough remains a separate non-destructive proof lane.
- 2026-05-10 `V1-PRODUCT-ACTION-AUDIT-P0-2026-05-10` corrects the V1
  readiness posture after operator-reported production UI/action failures.
  Previous reports are now classified as deploy/route/local-contract evidence,
  not proof that every UI action works on representative data. This slice fixes
  two confirmed P0 regressions: bot deletion now explicitly clears
  `RuntimeExecutionDedupe.botId` before deleting the bot, and Dashboard/runtime
  prospective TTP display is suppressed when live PnL is not positive. It also
  adds `history/audits/v1-product-action-audit-matrix-2026-05-10.md`, which is
  the active source of truth for remaining action-level V1 audit work. V1 is
  `NO-GO` until the matrix is executed or every blocker is explicitly accepted
  with a safe operator plan.
- 2026-05-10 `V1-FINAL-PREFLIGHT-1E11F8DE-2026-05-10` refreshed the no-secret
  final V1 preflight for deployed
  `1e11f8de4a3daaa313894a9ccf989237a3e65e5a`. Build-info and public API/Web
  smoke pass, and production DB restore context is satisfied by fresh restore
  evidence. V1 remains `BLOCKED` only on protected/formal release evidence:
  missing `LIVEIMPORT-03`, failed rollback proof, missing liveimport/rollback
  auth, and failed RC gates/sign-off/checklist. Evidence:
  `history/releases/v1-final-preflight-1e11f8de-2026-05-10.md`.
- 2026-05-10 `DEPLOY-SMOKE-SKIP-WORKERS-ALIAS-2026-05-10` improves deployment
  verification tooling by accepting `--skip-workers` as an alias for
  `--no-workers` in `scripts/deploySmokeCheck.mjs`. This closes a recurring
  false-alarm path where public smoke accidentally checked protected
  `/workers/health` and saw the expected unauthenticated `401`. Default
  worker checks remain enabled unless skipped explicitly.
- 2026-05-10 `CONTROLLED-LIVE-PROOF-RUNNER-2026-05-10` adds the guarded
  operator command `pnpm run ops:live:controlled-proof` for the remaining
  controlled LIVE runtime-session proof. The command checks build-info,
  requires protected no-order guard diagnostics to be fully active, refuses an
  already-active LIVE bot, runs `LIVEIMPORT-03`, and deactivates in cleanup.
  It defaults to no activation unless the operator supplies
  `--i-understand-live-risk`; actual LIVE activation remains blocked on
  explicit approval.
- 2026-05-10 `LIVE-RUNTIME-SAFETY-READINESS-DIAGNOSTICS-2026-05-10` adds
  protected `/ready/details` visibility for the LIVE no-order guard. Admin/ops
  diagnostics now expose only non-secret booleans under
  `runtimeSafety.liveNoOrderGuard`, including derived `active`, while public
  `/ready` remains minimal. This gives operators a process-level confirmation
  step before controlled LIVE session proof. Production build-info reached
  `b139152672aa9f6b0e26f1cab5ba0203beb54741`, public/protected smoke passed,
  and protected `/ready/details` confirmed `active=true`; evidence:
  `history/plans/live-runtime-no-order-guard-prod-b1391526-2026-05-10.md`.
- 2026-05-10 `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10` plans the remaining
  guarded LIVE proof. Preactivation `LIVEIMPORT-03` against `b1391526`
  confirmed one LIVE Binance Futures bot and expected `NO_RUNNING_SESSION`.
  Actual LIVE activation/readback/deactivation is blocked on explicit operator
  approval for the money-impacting observation window. Evidence:
  `history/evidence/controlled-live-session-proof-task-2026-05-10.md` and
  `history/artifacts/_artifacts-liveimport-readback-preactivation-b1391526-2026-05-10.json`.
- 2026-05-10 `LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10` adds optional
  environment-controlled LIVE runtime no-order guards. When
  `RUNTIME_LIVE_GLOBAL_KILL_SWITCH` or `RUNTIME_LIVE_EMERGENCY_STOP` is true,
  final-candle LIVE decisions pass the flag into pre-trade and block before
  signal creation/order orchestration. Defaults are off, so production behavior
  is unchanged until an operator sets the flags. Production build-info now
  exposes `f00080842ea59289e8d683ac298939a23b522e67`, public API/Web smoke
  passes, and Coolify shows the Soar services running after the queued deploy
  completed.
- 2026-05-10 production rerun on deployed
  `8cd5c1b3f38b9594a9caf15d4b434c853a66fdfe` confirms the stored Binance key
  now validates successfully on production with `ok: true`, `code: OK`,
  `permissions.spot: true`, and `permissions.futures: true`. Public smoke also
  passes. `LIVEIMPORT-03` remains blocked fail-closed because the configured
  LIVE bot has no running runtime session. Evidence:
  `history/evidence/prod-api-runtime-readiness-8cd5c1b3-2026-05-10.md`.
- 2026-05-10 `FUTURES-ONLY-APIKEY-ACCEPTANCE-2026-05-10` changed API-key probe
  success semantics so any validated actionable scope is accepted while
  preserving per-scope permission booleans. This means a Binance Futures-only
  key can return `ok: true`, `code: OK`, `permissions.futures: true`, and
  `permissions.spot: false`. The profile UI copy now clarifies Spot & Margin
  permission is only for Spot bots. Production must rerun the stored-key test
  after deployment.
- 2026-05-10 `BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10` corrected
  the Binance Futures API-key probe path after the operator challenged the
  production probe interpretation. The old `spot: true`, `futures: false`
  output is now treated as ambiguous, not authoritative. Locally, API-key
  probing now runs Spot and Futures independently and sends explicit Binance
  Futures balance params through the exchange-owned probe client surface. The
  next production step is deployment plus rerun of the stored key test before
  using the result as live readiness evidence.
- 2026-05-10 `PROD-API-RUNTIME-READINESS-F3CB9A24-2026-05-10` captured
  authenticated read-only production API and live-runtime readiness evidence
  for deployed `f3cb9a24c4c891479d5466a5abae4100ddda5ca8`. Dashboard/admin
  API modules are reachable, Gate.io Futures catalog is reachable, and the
  configured LIVE bot exists but is inactive. V1 remains `NO-GO` for LIVE
  Binance Futures because the stored Binance key probe fails Futures
  permission/readiness (`spot: true`, `futures: false`) and `LIVEIMPORT-03`
  wrote fail-closed `NO_RUNNING_SESSION` evidence. Evidence:
  `history/audits/prod-api-runtime-readiness-audit-f3cb9a24-task-2026-05-10.md`
  and `history/evidence/prod-api-runtime-readiness-f3cb9a24-2026-05-10.md`.
- 2026-05-10 `PROD-UI-AUTH-CLICKTHROUGH-39A52703-2026-05-10` captured
  authenticated/admin production UI route/module reachability evidence for
  deployed `39a5270322a7d1c302cd5a711484af35f4d6be08`. Public routes passed
  `4/4`, dashboard routes passed `18/18`, admin routes passed `3/3`, and
  legacy redirects passed `3/3`. The runner and route map now align with the
  documented top-level bot helper redirects. Evidence:
  `history/tasks/prod-ui-auth-clickthrough-39a52703-task-2026-05-10.md` and
  `history/plans/prod-ui-module-clickthrough-39a52703-2026-05-10.md`.
- 2026-05-10 `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10` resolved the local
  architecture findings from the V1 architecture function audit. API-key probe
  CCXT client construction now lives behind
  `apps/api/src/modules/exchange/exchangeApiKeyProbeClient.service.ts`, while
  `profile/apiKey` consumes the exchange-owned factory and keeps profile
  orchestration/error mapping. Gate.io docs drift in
  `docs/architecture/04_runtime-contexts.md` and `docs/modules/api-exchange.md`
  is refreshed. Evidence:
  `history/tasks/v1-architecture-boundary-cleanup-task-2026-05-10.md` and
  `history/audits/v1-architecture-function-audit-2026-05-10.md`.
- 2026-05-10 `V1-ARCH-FUNCTION-AUDIT-2026-05-10` audited current V1 function
  areas against architecture from architecture, backend, API, frontend,
  exchange, runtime parity, security, UI, and ops perspectives. Result before
  remediation: mostly aligned, with one P1 exchange-boundary mismatch in the
  profile API-key probe and two P2 Gate.io docs drifts. Those local findings
  are resolved by `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10`; remaining V1 blockers
  are protected production proof and formal approvals. Evidence:
  `history/audits/v1-architecture-function-audit-task-2026-05-10.md` and
  `history/audits/v1-architecture-function-audit-2026-05-10.md`.
- 2026-05-10 `V1-FUNCTION-COVERAGE-AUDIT-2026-05-10` published a
  function/module-oriented V1 audit across architecture, UI routes, API
  routers, module inventory, test inventory, final preflight, and production UI
  clickthrough evidence. The audit conclusion is `NO-GO`: Soar V1 has broad
  implementation and local coverage, and no broad missing module implementation
  was found for the current V1 scope, but protected production proof and formal
  release approval remain open. Remaining blockers are `LIVEIMPORT-03`
  protected readback, rollback proof PASS, authenticated/admin UI clickthrough,
  authenticated Gate 2 SLO, RC approval/sign-off/checklist, and final
  non-dry-run release gate. Evidence:
  `history/audits/v1-function-coverage-audit-task-2026-05-10.md` and
  `history/audits/v1-function-coverage-audit-2026-05-10.md`.
- 2026-05-10 `OPEN-PROTECTED-BACKLOG-DYNAMIC-TARGET-SYNC-2026-05-10` aligned
  the remaining open protected backlog entries (`V1-PROTECTED-ACCESS`,
  `LIVEIMPORT-03`, and `BOTMULTI-09`) with the dynamic production
  `/api/build-info` target selection used by the final blocker pack. This is a
  docs-only handoff cleanup; protected evidence and approvals remain open.
  Evidence:
  `history/tasks/open-protected-backlog-dynamic-target-sync-task-2026-05-10.md`.
- 2026-05-10 `V1-FINAL-PREFLIGHT-82205329-2026-05-10` refreshed current
  production final no-secret preflight for deployed build-info
  `8220532920e484da9ddaa021ac64b5de4cc5e6e1`. Build-info and public API/Web
  smoke pass, production DB restore context is satisfied by fresh evidence,
  activation artifacts are fresh, and V1 remains blocked only on protected or
  formal evidence: liveimport auth/readback, rollback guard auth/proof PASS,
  RC gate/sign-off/checklist approval, and authenticated/admin UI proof.
  Evidence:
  `history/releases/v1-final-preflight-82205329-task-2026-05-10.md`,
  `history/artifacts/_artifacts-v1-final-preflight-82205329-2026-05-10.json`,
  and `history/releases/v1-final-preflight-82205329-2026-05-10.md`.
- 2026-05-10 `V1-OPERATOR-ARTIFACT-NAMING-2026-05-10` updated final V1
  operator commands so preflight, `LIVEIMPORT-03`, UI clickthrough, and final
  release-gate artifacts include the deployed build-info short SHA plus
  evidence date. This is docs-only traceability hardening; protected V1
  blockers remain unchanged. Evidence:
  `history/tasks/v1-operator-artifact-naming-task-2026-05-10.md`.
- 2026-05-10 `V1-NEXT-STEPS-DYNAMIC-SHA-CLEANUP-2026-05-10` removed stale
  static SHA defaults from the lower V1 continuation backlog. Future protected
  evidence instructions now consistently derive `$expectedSha` from production
  `/api/build-info`, with optional intended-SHA comparison only when an
  operator deliberately promotes one exact runtime candidate. Evidence:
  `history/tasks/v1-next-steps-dynamic-sha-cleanup-task-2026-05-10.md`.
- 2026-05-10 `PROD-UI-PUBLIC-CLICKTHROUGH-88313309-2026-05-10` refreshed
  no-auth production UI route/module evidence for deployed build-info
  `88313309200d35275ba6c0d3465c5045c4b6d99e`. The audit reports public routes
  PASS and all dashboard/admin/legacy protected routes `BLOCKED_AUTH` with
  `/auth/login` redirects. This keeps the UI evidence current while preserving
  the blocker: full V1 UI clickthrough still requires valid production
  dashboard/admin auth and representative data. Evidence:
  `history/tasks/prod-ui-public-clickthrough-88313309-task-2026-05-10.md`,
  `history/artifacts/_artifacts-prod-ui-module-clickthrough-88313309-2026-05-10.json`,
  and `history/plans/prod-ui-module-clickthrough-88313309-2026-05-10.md`.
- 2026-05-10 `V1-CURRENT-RELEASE-GATE-DRY-RUN-2026-05-10` captured a current
  production V1 release-gate dry-run for deployed build-info
  `8f8630b0ad5abd690409d6173c9b247b95948138`. The gate classifier reports
  `not_ready`: activation audit, activation plan, and backup/restore drill are
  fresh, while RC external gates, RC sign-off, RC checklist, `LIVEIMPORT-03`,
  rollback proof PASS, and non-dry-run final gate execution remain blockers.
  Evidence:
  `history/releases/v1-current-release-gate-dry-run-task-2026-05-10.md`,
  `history/artifacts/_artifacts-v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.json`,
  and
  `history/releases/v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.md`.
- 2026-05-10 `V1-OPERATOR-RUNBOOK-DYNAMIC-SHA-2026-05-10` updated final V1
  operator runbooks to derive `$expectedSha` from production
  `https://soar.luckysparrow.ch/api/build-info` at the start of the protected
  evidence run. The runbooks still support an explicit intended runtime
  candidate comparison, and still warn that build-info deploy freshness is not
  `LIVEIMPORT-03`, rollback, RC, or authenticated UI proof. Evidence:
  `history/tasks/v1-operator-runbook-dynamic-sha-task-2026-05-10.md`,
  `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`, and
  `history/releases/v1-operator-unblock-checklist-2026-05-10.md`.
- 2026-05-10 `V1-SLO-GATE2-NOAUTH-PROBE-2026-05-10` ran a one-minute
  unauthenticated production SLO collector against deployed
  `8c85279d13ca56421b09a5c4cd613535a81ef76d`. The collector generated
  no-secret blocker evidence, not Gate 2 approval: `/health` was 100%,
  `/ready` was 50% in the short window, protected worker/metrics/alerts
  endpoints returned `401 Missing token`, and queue/API/live-order metrics were
  `NO_DATA`. A follow-up public smoke passed for `/health`, `/ready`, and Web
  `/`. Gate 2 remains blocked until an operator runs the authenticated
  30-minute production SLO flow. Evidence:
  `history/evidence/v1-slo-gate2-noauth-probe-task-2026-05-10.md`,
  `history/evidence/v1-slo-gate2-noauth-probe-2026-05-10.md`, and
  `history/evidence/v1-slo-observation-2026-05-10T05-09-56-366Z.md`.
- 2026-05-10 `V1-OPERATOR-RUNBOOK-CURRENT-SHA-SYNC-2026-05-10` synchronized
  the final blocker execution pack and operator unblock checklist after the
  audit batch deployed. The latest verified deployed audit SHA is
  `5515f2105d52f25a0d875cbd0b55860a00b4da32`; runbooks now tell operators to
  use that SHA, or a later build-info-proven docs-only SHA if one has already
  deployed, before running protected evidence. This is a runbook sync only and
  does not close protected V1 blockers. Evidence:
  `history/tasks/v1-operator-runbook-current-sha-sync-task-2026-05-10.md`,
  `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`, and
  `history/releases/v1-operator-unblock-checklist-2026-05-10.md`.
- 2026-05-10 `V1-COVERAGE-CONFIDENCE-AUDIT-2026-05-10` published a current
  evidence-backed answer to the user's "what is missing before 100%" question.
  Current deployed/audited SHA is
  `fd8da90bd77c2ddbed800eabd98479c1bd113ac4`. Final preflight reports
  build-info PASS and public smoke PASS, but remains `BLOCKED` on liveimport
  auth, rollback guard auth, failed RC evidence, missing `LIVEIMPORT-03`
  readback, and failed rollback proof. Production UI module clickthrough
  reports public routes PASS and dashboard/admin/legacy protected routes
  `BLOCKED_AUTH`. The audit conclusion is that the remaining V1 work is narrow
  and evidence-driven, not a broad implementation rewrite: protected runtime
  readback, rollback proof PASS, authenticated/admin UI clickthrough, and RC
  approval/gates. Evidence:
  `history/audits/v1-coverage-confidence-audit-task-2026-05-10.md`,
  `history/audits/v1-coverage-confidence-audit-2026-05-10.md`,
  `history/releases/v1-final-preflight-fd8da90b-2026-05-10.md`, and
  `history/plans/prod-ui-module-clickthrough-fd8da90b-2026-05-10.md`.
- 2026-05-10 `PROD-UI-MODULE-CLICKTHROUGH-RUNNER-2026-05-10` added the
  canonical `ops:ui:prod-clickthrough` production UI module audit runner and
  captured current no-auth evidence for deployed
  `84e7c0e012a571f18396556a97198dbed08aba7c`. Build-info matches, public
  routes PASS, and dashboard/admin/legacy protected routes are
  `BLOCKED_AUTH`. The runner supports dashboard/admin auth via
  `PROD_UI_AUDIT_*` inputs and records no tokens, cookies, private headers, or
  protected payloads. Authenticated/admin UI clickthrough remains blocked until
  valid production app/admin access and representative data are available.
  Evidence:
  `history/tasks/prod-ui-module-clickthrough-runner-task-2026-05-10.md` and
  `history/plans/prod-ui-module-clickthrough-84e7c0e0-2026-05-10.md`.
- 2026-05-10 `V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-10` refreshed
  rollback-proof evidence for the active evidence date. The no-auth production
  proof failed closed on protected `401` responses for runtime freshness and
  alerts, so it is current `FAIL` evidence, not release approval. Follow-up
  final preflight for deployed
  `8df3260b8453be0a39dfa75ce2be281d6571c4de` reports build-info PASS, public
  smoke PASS, production DB restore context satisfied, backup/restore fresh,
  and rollback proof fresh but failed. V1 remains `BLOCKED / NO-GO` on
  liveimport auth/readback, rollback guard auth/proof PASS, RC approval/gates,
  and authenticated/admin production UI clickthrough. Evidence:
  `history/evidence/v1-rollback-proof-blocked-refresh-task-2026-05-10.md`,
  `history/evidence/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md`, and
  `history/releases/v1-final-preflight-8df3260b-2026-05-10.md`.
- 2026-05-10 `V1-PROD-RESTORE-DRILL-REFRESH-2026-05-10` captured fresh PASS
  production restore-drill evidence through the approved Coolify terminal for
  deployed `969df7c8f268146ecff3efb9de2fe1841ac8bc75`. The isolated contract
  created a backup dump, restored it into a temporary database, validated
  aggregate counts, dropped the restore database, removed the dump, and
  verified zero leftovers. Follow-up final preflight now reports production DB
  restore context satisfied and backup/restore drill evidence fresh for
  2026-05-10. V1 remains `BLOCKED / NO-GO` on liveimport auth/readback,
  rollback guard auth/proof, RC approval/gates, and authenticated/admin
  production UI clickthrough. Evidence:
  `history/evidence/v1-prod-restore-drill-refresh-task-2026-05-10.md`,
  `history/evidence/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`, and
  `history/releases/v1-final-preflight-969df7c8-2026-05-10.md`.
- 2026-05-10 `V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10` recovered the
  production Coolify queue after old Soar deployments remained queued. Stale
  `soar-api` jobs targeting older SHAs were cancelled, one fresh `soar-api`
  redeploy finished on
  `33a2ebc468be3dbfab7c784f375672ebead5ae16`, Web build-info and public
  API/Web smoke pass, and the Coolify queue is empty. The matching final
  no-secret preflight remains `BLOCKED / NO-GO` only on protected/formal
  release evidence. Evidence:
  `history/tasks/v1-coolify-deploy-queue-recovery-task-2026-05-10.md`,
  `history/plans/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md`, and
  `history/releases/v1-final-preflight-33a2ebc4-2026-05-10.md`.
- 2026-05-10 `V1-DEPLOY-CONTROL-READINESS-2026-05-10` confirmed production
  deployment is manual Coolify/operator controlled. The repository has CI
  checks only and no approved no-secret production deploy trigger; webhook/API
  credentials remain operator-held secrets. Evidence:
  `history/evidence/v1-deploy-control-readiness-2026-05-10.md`.
- 2026-05-10 `DEPLOY-LAG-E70F5CF6-2026-05-10` records that pushed commit
  `e70f5cf6229d6fc4d26ea0342b81baab80851800` did not reach production
  build-info during two bounded wait windows. Production still reports
  `40e9b3c35c96d4acced73bbab980039f9e6b6a22`; public smoke passes. Evidence:
  `history/plans/deploy-lag-e70f5cf6-2026-05-10.md`.
- 2026-05-10 `V1-PROTECTED-INPUTS-READINESS-2026-05-10` confirmed that the
  current session does not have the protected env families needed for
  `LIVEIMPORT-03`, rollback proof, or production DB restore context.
  Privileged VPS/Docker inspection was rejected by the escalation reviewer and
  was not retried. V1 remains `BLOCKED / NO-GO` until approved operator inputs
  or explicit production infrastructure authorization are available. Evidence:
  `history/evidence/v1-protected-inputs-readiness-2026-05-10.md`.
- 2026-05-10 `V1-FINAL-PREFLIGHT-CURRENT-9D28F682` captured final no-secret
  preflight for currently deployed
  `9d28f682f23dc176dbbad790bea8ddf213c8ac01`. Build-info and public smoke
  pass, activation artifacts are fresh, RC artifacts are fresh but failed, and
  V1 remains `BLOCKED / NO-GO` on protected/formal evidence. Evidence:
  `history/releases/v1-final-preflight-current-9d28f682-task-2026-05-10.md` and
  `history/releases/v1-final-preflight-9d28f682-2026-05-10.md`.
- 2026-05-10 `V1-OPERATOR-UNBLOCK-CHECKLIST-2026-05-10` published the exact
  no-secret operator inputs and command order required to close remaining V1
  blockers. The checklist and final blocker execution pack now target deployed
  `822d92fc02067fa122e735ab6cc2783e438dc458`; current preflight build-info and
  public smoke pass, while V1 remains `BLOCKED / NO-GO` on protected/formal
  evidence. Evidence:
  `history/releases/v1-operator-unblock-checklist-2026-05-10.md` and
  `history/releases/v1-final-preflight-822d92fc-2026-05-10.md`.
- 2026-05-10 `V1-PROD-ACTIVATION-REFRESH-2026-05-10` published fresh
  production activation plan and activation evidence audit artifacts as
  explicit `NO-GO` for deployed
  `74752f025ef49bf5026ec92e056f59947e00a18f`. Follow-up no-secret final
  preflight reports activation plan/audit fresh, build-info/public smoke PASS,
  and V1 still `BLOCKED` on protected/formal evidence: liveimport auth/readback,
  rollback guard auth, production DB restore context, failed RC evidence,
  stale backup/restore drill, and stale rollback proof. Evidence:
  `history/tasks/v1-production-activation-refresh-2026-05-10-task.md` and
  `history/releases/v1-final-preflight-74752f02-2026-05-10.md`.
- 2026-05-10 `V1-RC-BLOCKED-REFRESH-2026-05-10` refreshed RC external gates,
  RC sign-off, and the RC checklist to 2026-05-10 as current blocked evidence.
  Final preflight for deployed
  `1609929ed3b98c2b794d8a0b48ff0f39c16cd75f` reports build-info/public smoke
  PASS, RC evidence fresh but `failed`, and V1 still `BLOCKED` on protected
  and formal evidence: liveimport auth/readback, rollback guard auth,
  production DB restore context, stale activation audit/plan, stale
  backup/restore drill, stale rollback proof, Gate 2 SLO evidence, and real RC
  approvers. Evidence:
  `history/releases/v1-rc-blocked-evidence-refresh-task-2026-05-10.md` and
  `history/releases/v1-final-preflight-1609929e-2026-05-10.md`.
- 2026-05-10 `DEPLOY-FRESHNESS-9C125683-2026-05-10` proves production Web
  build-info now exposes `9c12568379ee77cda9c9e9df39879e141b5615fb`, a pushed
  batch that includes `b414e523` live order cancel boundary support. Public
  API/Web smoke passes. The no-secret final V1 preflight public checks pass
  and remains correctly `BLOCKED` on protected/formal evidence: liveimport
  auth, rollback guard auth, production DB restore context, current
  activation/RC evidence, `LIVEIMPORT-03` runtime readback, backup/restore
  drill, rollback proof, and authenticated/admin UI clickthrough. Evidence:
  `history/tasks/deploy-freshness-9c125683-task-2026-05-10.md`,
  `history/plans/deploy-freshness-9c125683-2026-05-10.md`, and
  `history/releases/v1-final-preflight-9c125683-2026-05-10.md`.
- 2026-05-10 `EXCHANGE2-31-LIVE-ORDER-CANCEL-BOUNDARY-2026-05-10` adds
  canonical exchange-side live order cancel support for Binance and Gate.io.
  The order cancel route now calls the existing exchange adapter boundary and
  authenticated connector before local order state is mutated for
  exchange-backed rows. Contextless exchange-backed rows remain fail-closed.
  No real live-money cancel action is performed. Focused exchange tests,
  focused orders cancel tests, API typecheck, guardrails, docs parity, and diff
  check passed. Production freshness is now proven by
  `DEPLOY-FRESHNESS-9C125683`; the earlier deploy-lag artifact is superseded.
  Evidence:
  `history/tasks/exchange2-31-live-order-cancel-boundary-task-2026-05-10.md`
  and `history/plans/deploy-freshness-9c125683-2026-05-10.md`.
- 2026-05-10 `EXCHANGE2-30-GATEIO-LIVE-ORDER-SUBMIT-2026-05-10` enables
  Gate.io live order submit through the canonical orders/exchange boundary and
  enables Gate.io shared `LIVE_EXECUTION` compatibility gating. Scope is
  limited to live submit; exchange-side cancel remains unsupported and no real
  live-money action is performed. Focused exchange tests, wallet e2e, Web
  capability test, API typecheck, Web typecheck, production build-info for
  `04a4204ca9090586d49ae77b0dd8c1be048d7bdf`, and public deploy smoke passed.
  The no-secret final V1 preflight public checks passed and remains correctly
  blocked on protected/formal evidence. Evidence:
  `history/tasks/exchange2-30-gateio-live-order-submit-task-2026-05-10.md` and
  `history/plans/deploy-freshness-04a4204c-2026-05-10.md`.
- 2026-05-09 `EXCHANGE2-29-GATEIO-WALLET-CASHFLOW-HISTORY-2026-05-09`
  enabled Gate.io wallet cashflow history through the existing exchange
  adapter boundary. Scope is limited to `WALLET_CASHFLOW_HISTORY`; Gate.io live
  submit and exchange-side cancel remain unsupported. Focused exchange/wallet
  cashflow tests, API typecheck, guardrails, docs parity, and diff check passed.
  Production build-info reached
  `8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`; public deploy smoke passes.
  Evidence:
  `history/tasks/exchange2-29-gateio-wallet-cashflow-history-task-2026-05-09.md`
  and `history/plans/deploy-freshness-8ea7f33b-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-28-GATEIO-TRADE-HISTORY-SNAPSHOT-2026-05-09` enabled
  Gate.io trade-history snapshot through the existing authenticated-read
  boundary. Scope is limited to `TRADE_HISTORY_SNAPSHOT`; Gate.io wallet
  cashflow history, live submit, and exchange-side cancel remain unsupported.
  Focused exchange tests, authenticated snapshot service test, API typecheck,
  guardrails, docs parity, and diff check passed. Production build-info reached
  `432f768701300c7ba600fa7633532c0cc9ef4b96`; public deploy smoke passes.
  Evidence:
  `history/tasks/exchange2-28-gateio-trade-history-snapshot-task-2026-05-09.md`
  and `history/plans/deploy-freshness-432f7687-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-27-GATEIO-OPEN-ORDERS-SNAPSHOT-2026-05-09` enabled
  Gate.io open-orders snapshot through the existing authenticated-read
  boundary. Scope is limited to `OPEN_ORDERS_SNAPSHOT`; Gate.io trade-history,
  live submit, and exchange-side cancel remain unsupported. Focused exchange
  tests, authenticated snapshot service test, API typecheck, guardrails, docs
  parity, and diff check passed. Production build-info reached
  `214a9c034d38ab8670fd4b43d0f8ed692d78d90c`; public deploy smoke passes.
  Evidence:
  `history/tasks/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md`
  and `history/plans/deploy-freshness-214a9c03-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-26-GATEIO-POSITIONS-SNAPSHOT-2026-05-09` enabled
  Gate.io positions snapshot through the existing authenticated-read boundary.
  Scope is limited to `POSITIONS_SNAPSHOT`; Gate.io open-orders, trade-history,
  live submit, and exchange-side cancel remain unsupported. Focused exchange
  tests, positions e2e, authenticated snapshot service tests, API typecheck,
  guardrails, docs parity, and diff check passed. Production build-info reached
  `4c7548acc74295f27676c1f00d79dbf58b873942`; public deploy smoke passes.
  Evidence:
  `history/tasks/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md`
  and `history/plans/deploy-freshness-4c7548ac-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-25-GATEIO-BALANCE-PREVIEW-2026-05-09` enabled Gate.io
  wallet balance preview through the existing authenticated-read boundary.
  Scope is limited to `BALANCE_PREVIEW`; Gate.io positions/open-orders,
  trade-history, live submit, and exchange-side cancel remain unsupported.
  Focused exchange tests, wallet e2e, API typecheck, guardrails, docs parity,
  and diff check passed. Production build-info reached
  `15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd`; public deploy smoke passes.
  Evidence:
  `history/tasks/exchange2-25-gateio-balance-preview-task-2026-05-09.md` and
  `history/plans/deploy-freshness-15dfacb9-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-24-GATEIO-API-KEY-PROBE-2026-05-09` enabled Gate.io
  API-key connection testing through a shared exchange-aware profile probe
  service. Scope is limited to `API_KEY_PROBE`; Gate.io balance preview,
  positions/open-orders, trade-history, live submit, and exchange-side cancel
  remain unsupported until exact operation adapters are implemented and
  verified. Focused API/Web tests, API/Web typechecks, guardrails, docs parity,
  and diff check passed. Production build-info reached
  `e76e08a1a20b12abaeabf4edc44a38ba37619005`; public deploy smoke passes.
  Evidence:
  `history/tasks/exchange2-24-gateio-api-key-probe-task-2026-05-09.md` and
  `history/plans/deploy-freshness-e76e08a1-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-1DC55D96-2026-05-09` verified that the Gate.io
  PAPER pricing enablement batch is production-current at
  `1dc55d9623bab11dacb5b9f8ce9634778c139249`. Public API/Web smoke passes,
  and the no-secret final V1 preflight reports build-info/public smoke PASS
  while remaining correctly `BLOCKED` on protected/formal V1 evidence.
  Evidence:
  `history/tasks/deploy-freshness-1dc55d96-task-2026-05-09.md` and
  `history/plans/deploy-freshness-1dc55d96-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-23-GATEIO-PAPER-PRICING-ENABLE-2026-05-09` enabled
  Gate.io public PAPER pricing through the existing shared capability
  contract. Gate.io PAPER wallet create/update and PAPER bot activation now
  use the normal API/UI paths. The slice intentionally does not enable Gate.io
  `LIVE_EXECUTION`, `API_KEY_PROBE`, authenticated reads, live submit, or
  exchange-side cancel. Focused validation passed for Web
  exchange/wallet/bot UI, API runtime loop, API wallet create/update, focused
  API bot Gate.io/placeholder gating, API/Web typecheck, guardrails, docs
  parity, and diff check. Evidence:
  `history/tasks/exchange2-23-gateio-paper-pricing-enable-task-2026-05-09.md`.
- 2026-05-09 `V1-COMPLETION-GAP-AUDIT-2026-05-09` produced a concise
  completion gap report for the user's "what is still missing before 100%"
  question. The report classifies remaining work as protected production
  evidence, authenticated UI clickthrough, Gate.io paper/live implementation,
  and product/UX confidence gaps. Evidence:
  `history/plans/v1-completion-gap-report-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-E8CD748E-2026-05-09` verified that the
  docs/evidence batch ending at
  `e8cd748e80b8693087e01beb21b0085ace747c49` is production-current. Public
  API/Web smoke passes, and the no-secret final V1 preflight reports
  build-info/public smoke PASS while remaining correctly `BLOCKED` on
  protected/formal V1 evidence. Evidence:
  `history/tasks/deploy-freshness-e8cd748e-task-2026-05-09.md`.
- 2026-05-09 `CURRENT-PROD-BUILDINFO-745B5F5A-SYNC-2026-05-09` synchronized
  active source-of-truth files after public UI evidence showed latest observed
  production build-info at
  `745b5f5a45eab3f86b02e023479c8358f760bbf6`. This newer SHA is
  docs/evidence only over the protected runtime/preflight baseline
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`; protected V1 and Gate.io
  paper/live/authenticated blockers remain open. Evidence:
  `history/evidence/current-production-build-info-745b5f5a-sync-task-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-30B027B7-2026-05-09` verified that the
  protected-backlog sync batch ending at
  `30b027b78544f76b5b638851e8e27c98f6d22ab5` is production-current. Public
  API/Web smoke passes, and the no-secret final V1 preflight reports
  build-info/public smoke PASS while remaining correctly `BLOCKED` on
  protected/formal V1 evidence. Evidence:
  `history/tasks/deploy-freshness-30b027b7-task-2026-05-09.md`.
- 2026-05-09 `PROD-UI-PUBLIC-ACCESS-REFRESH-745B5F5A-2026-05-09` refreshed
  public/unauthenticated production UI access evidence for deployed
  `745b5f5a45eab3f86b02e023479c8358f760bbf6`. Public routes return HTTP 200
  and unauthenticated dashboard/admin routes redirect to `/auth/login`.
  Full authenticated/admin module clickthrough remains blocked on valid
  production app access. Evidence:
  `history/tasks/prod-ui-public-access-refresh-745b5f5a-task-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-BA3D852D-2026-05-09` verified that the
  docs/status sync batch ending at
  `ba3d852d5126b625a8cf702ab647d5c644d86f9c` is production-current. Public
  API/Web smoke passes, and the no-secret final V1 preflight reports
  build-info/public smoke PASS while remaining correctly `BLOCKED` on
  protected/formal V1 evidence. Evidence:
  `history/tasks/deploy-freshness-ba3d852d-task-2026-05-09.md`.
- 2026-05-09 `OPEN-PROTECTED-BACKLOG-BA3D852D-SYNC-2026-05-09` retargeted the
  active protected V1 backlog and final blocker pack to deployed
  `ba3d852d5126b625a8cf702ab647d5c644d86f9c` without closing protected
  evidence. `LIVEIMPORT-03`, rollback proof, restore proof, RC approval, and
  authenticated/admin UI audit remain blocked on operator inputs. Evidence:
  `history/tasks/open-protected-backlog-ba3d852d-sync-task-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-010B4F8B-2026-05-09` verified that the
  three-commit Gate.io source batch ending at
  `010b4f8b6abfaf4c24d26550eb4761215d119f21` is production-current. Public
  API/Web smoke passes, and the no-secret final V1 preflight reports
  build-info/public smoke PASS while remaining correctly `BLOCKED` on
  protected/formal V1 evidence. Evidence:
  `history/tasks/deploy-freshness-010b4f8b-task-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-22-GATEIO-PUBLIC-SYMBOL-RULES-2026-05-09` decoupled
  public symbol-rule resolution from live execution support. Gate.io public
  symbol rules now resolve through the existing `MARKET_CATALOG`/market-map
  boundary, while unsupported exchanges without market catalog still return
  `null` without market loads. Gate.io paper pricing, authenticated reads,
  live submit, and cancel remain unsupported. Evidence:
  `history/tasks/exchange2-22-gateio-public-symbol-rules-task-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-21-GATEIO-MARKET-STREAM-SOURCE-SMOKE-2026-05-09`
  added a public-read-only Gate.io market-stream source smoke and captured
  real `GATEIO/FUTURES/BTCUSDT` ticker plus final `1m` candle events emitted
  by `ExchangePublicPollingMarketStreamWorker`. Evidence explicitly states no
  credentials, exchange writes, live orders, or paper pricing enablement.
  Gate.io `PAPER_PRICING_FEED`, authenticated reads, live submit, and cancel
  remain unsupported until exact support and deployment/protected evidence
  exist. Evidence:
  `history/evidence/gateio-market-stream-source-smoke-2026-05-09.md`.
- 2026-05-09 `DEPLOY-LAG-D355DF93-FOLLOW-UP-2026-05-09` recorded that the
  pushed operator handoff/source-of-truth commit
  `d355df93107f4d7ff9d6231107528295cbc873c2` was not production-current during
  the bounded follow-up wait, which remained on
  `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`. A later build-info wait showed
  production advanced beyond this historical lag. Evidence:
  `history/tasks/deploy-lag-d355df93-follow-up-task-2026-05-09.md`.
- 2026-05-09 `DASH-RUNTIME-CURRENT-AGGREGATE-2026-05-09` tightened the
  dashboard runtime aggregate read model. Current-state dashboard fields now
  prefer the freshest `RUNNING` session row when one exists, covering open
  positions, open orders, dynamic-stop visibility, unrealized PnL, open counts,
  and capital summary while preserving historical projection for closed
  positions and trades. Focused validation passed (`runtimeSessionPositionsRead`
  helper tests 18/18, API typecheck, repository guardrails). Evidence:
  `history/tasks/dashboard-runtime-current-state-aggregate-task-2026-05-09.md`.
- 2026-05-09 `DASH-RUNTIME-WIDGET-AGGREGATE-CURRENT-RENDER-2026-05-09`
  added focused Web coverage proving `HomeLiveWidgets` renders aggregate
  current open-position rows for a running bot while completed-session history
  remains visible in the history tab. Focused validation passed
  (`HomeLiveWidgets.aggregate-history.test.tsx` 3/3, broader dashboard-home
  focused pack 41/41, Web typecheck, repository guardrails). Evidence:
  `history/tasks/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-3C5DA343-2026-05-09` pushed the accumulated
  dashboard runtime aggregate batch and verified production freshness. Web
  build-info reached `3c5da34371e22aecb1a7aff0a185018870d35cec` on attempt
  25, and safe public smoke passed for API `/health`, API `/ready`, and Web
  `/`. The deploy batch includes the dashboard current aggregate read-model fix
  and Web rendering regression. No-secret final preflight for this SHA reports
  build-info and public smoke PASS, with V1 still BLOCKED on protected auth,
  production DB restore context, RC approval, missing `LIVEIMPORT-03`, stale
  restore evidence, and stale rollback proof. Evidence:
  `history/plans/deploy-freshness-3c5da343-2026-05-09.md`.
- 2026-05-09 `PROD-UI-PUBLIC-ACCESS-REFRESH-3C5DA343-2026-05-09` refreshed
  public/unauthenticated production UI evidence for the currently deployed
  dashboard runtime aggregate batch. Web build-info matches
  `3c5da34371e22aecb1a7aff0a185018870d35cec`, API `/health` and `/ready`
  returned HTTP 200, public Web routes returned HTTP 200, and
  unauthenticated dashboard/admin routes returned HTTP 307 to `/auth/login`.
  This remains public-only evidence; authenticated/admin module clickthrough
  still requires valid production app access. Evidence:
  `history/plans/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`.
- 2026-05-09 `CURRENT-EXECUTABLE-V1-BOUNDARY-3C5DA343-2026-05-09` clarified
  active continuation state after the `3c5da343` public/no-secret evidence.
  Future V1 work should start from the protected blocker boundary: collect
  authenticated/admin production app access, live-import auth, rollback auth,
  production DB/Coolify context for current-date restore evidence, and real RC
  approval identities. Public health/build-info, public UI access, and local
  regression suites must not be treated as completion evidence for protected
  runtime/readiness tasks. Evidence:
  `history/tasks/current-executable-v1-boundary-3c5da343-task-2026-05-09.md`.
- 2026-05-09 `V1-PROTECTED-OPERATOR-HANDOFF-3C5DA343-2026-05-09` published a
  concise no-secret operator handoff for the remaining V1 protected blockers.
  It lists required input names, command order, acceptance criteria, and
  evidence that must not be accepted as protected proof. V1 remains `BLOCKED`
  until those protected commands are executed from an approved operator
  context. Evidence:
  `history/audits/v1-protected-operator-handoff-3c5da343-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-4EE1672E-2026-05-09` pushed the accumulated
  docs/evidence handoff batch and verified production freshness. Web build-info
  reached `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f` on attempt 20, public
  API/Web smoke passed, and no-secret final V1 preflight for this SHA reports
  build-info/public smoke PASS with V1 still `BLOCKED` on protected auth,
  production DB restore context, failed RC evidence, missing `LIVEIMPORT-03`,
  stale restore evidence, and stale rollback proof. Protected final blocker
  commands now use `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f` as the
  production build-info expected SHA. Evidence:
  `history/plans/deploy-freshness-4ee1672e-2026-05-09.md`.
- 2026-05-09 `PROD-UI-PUBLIC-ACCESS-REFRESH-4EE1672E-2026-05-09` refreshed
  public/unauthenticated production UI evidence for the currently deployed
  docs/evidence handoff batch. Web build-info matches
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, API `/health` and `/ready`
  returned HTTP 200, public Web routes returned HTTP 200, and
  unauthenticated dashboard/admin routes returned HTTP 307 to `/auth/login`.
  This remains public-only evidence; authenticated/admin module clickthrough
  still requires valid production app access. Evidence:
  `history/plans/prod-ui-public-access-clickthrough-4ee1672e-2026-05-09.md`.
- 2026-05-09 `BOTMULTI-09-CURRENT-PRODUCTION-CONTAINMENT-2026-05-09`
  reconciled the open BOTMULTI release blocker with current production
  build-info. `git merge-base --is-ancestor` confirms original BOTMULTI
  candidate `f3aaa3dca6cf4d4b199372563886165638391a77` is contained in current
  production candidate `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`. BOTMULTI
  remains open because authenticated/protected runtime readback and broader V1
  release gate evidence are still required. Evidence:
  `history/tasks/botmulti-09-current-production-containment-task-2026-05-09.md`.
- 2026-05-09 `LIVEIMPORT-03-CURRENT-PRODUCTION-TARGET-SYNC-2026-05-09`
  reconciled the open live-import readback blocker with current production
  build-info. Active queue/state now targets deployed
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f` and keeps stale candidate
  `39146d2e` rejected. `LIVEIMPORT-03` remains open because authenticated
  read-only runtime positions readback and redacted evidence for the reported
  LIVE ETH/DOGE rows are still missing. Evidence:
  `history/tasks/liveimport-03-current-production-target-sync-task-2026-05-09.md`.
- 2026-05-09 `V1-NEXT-STEPS-PROTECTED-SHA-SYNC-2026-05-09` corrected the
  active `.agents/state/next-steps.md` backlog so protected readback and final
  release-gate instructions use build-info-proven
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f` instead of local `HEAD`.
  Future protected evidence may target a newer SHA only after production
  build-info proves that intended code/tooling candidate is deployed. Evidence:
  `history/tasks/v1-next-steps-protected-sha-sync-task-2026-05-09.md`.
- 2026-05-09 `CURRENT-FOCUS-4EE1672E-SYNC-2026-05-09` updated the active
  delivery-stage summary in `.agents/state/current-focus.md` so the first
  continuation view now points to current production
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, current public/no-secret
  evidence, and the protected preflight command for that SHA. Historical notes
  remain intact. Evidence:
  `history/tasks/current-focus-4ee1672e-sync-task-2026-05-09.md`.
- 2026-05-09 `MVP-EXECUTION-PLAN-4EE1672E-PROGRESS-SYNC-2026-05-09`
  prepended the latest `4ee1672e` continuation/protected-readiness syncs to
  the SYSFINAL progress log so `docs/planning/mvp-execution-plan.md` no longer
  opens with stale `4792fbca` as the newest release-evidence state. Evidence:
  `history/tasks/mvp-execution-plan-4ee1672e-progress-sync-task-2026-05-09.md`.
- 2026-05-09 `SYSTEM-HEALTH-4EE1672E-TOPLINE-SYNC-2026-05-09` prepended the
  current production health snapshot in `.agents/state/system-health.md`.
  Future continuation runs now see deployed
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, public/no-secret PASS evidence,
  `LIVEIMPORT-03` target sync, and the protected V1 blockers before historical
  rollout notes. Evidence:
  `history/evidence/system-health-4ee1672e-topline-sync-task-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-55469CDC-2026-05-09` pushed the 10-commit
  source-of-truth synchronization batch and verified production freshness. Web
  build-info reached `55469cdc2ad888b822c8cdbd86660c4ed5166e1c` on attempt
  21, public API/Web smoke passed, and no-secret final V1 preflight for this
  SHA reports build-info/public smoke PASS with V1 still `BLOCKED` on
  protected auth, production DB restore context, failed RC evidence, missing
  `LIVEIMPORT-03`, stale restore evidence, and stale rollback proof. Evidence:
  `history/plans/deploy-freshness-55469cdc-2026-05-09.md`.
- 2026-05-09 `V1-PROTECTED-OPERATOR-DOCS-55469CDC-SYNC-2026-05-09` retargeted
  the active protected-access readiness, production activation, activation
  audit, and operator handoff docs to current production build-info
  `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`. This does not close protected
  V1 evidence; it keeps the operator commands aligned with deployed
  build-info. Evidence:
  `history/tasks/v1-protected-operator-docs-55469cdc-sync-task-2026-05-09.md`.
- 2026-05-09 `MVP-EXECUTION-PLAN-55469CDC-PROGRESS-SYNC-2026-05-09`
  prepended the latest `55469cdc` deploy/protected-operator-doc syncs to the
  SYSFINAL progress log so `docs/planning/mvp-execution-plan.md` opens with
  current production truth while preserving historical `4ee1672e` entries.
  Evidence:
  `history/tasks/mvp-execution-plan-55469cdc-progress-sync-task-2026-05-09.md`.
- 2026-05-09 `PROD-UI-PUBLIC-ACCESS-REFRESH-55469CDC-2026-05-09` refreshed
  public/unauthenticated production UI evidence for deployed
  `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`. Build-info matches the
  expected SHA, API `/health` and `/ready` returned HTTP 200, public Web
  routes returned HTTP 200, and unauthenticated dashboard/admin routes returned
  HTTP 307 to `/auth/login`. Full authenticated/admin module clickthrough
  remains blocked on valid production app access. Evidence:
  `history/plans/prod-ui-public-access-clickthrough-55469cdc-2026-05-09.md`.
- 2026-05-09 `PROD-UI-AUDIT-CURRENT-BLOCKER-SYNC-55469CDC-2026-05-09`
  synced the full production UI module clickthrough audit plan with current
  deployed build-info `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`. The stale
  deploy/build-info blocker is no longer current; the full audit remains open
  and blocked on authenticated/admin production app access, representative
  production test data, and explicit operator approval before any live-money or
  destructive action. Evidence:
  `history/audits/prod-ui-audit-current-blocker-sync-55469cdc-task-2026-05-09.md`.
- 2026-05-09 `OPEN-PROTECTED-BACKLOG-55469CDC-SYNC-2026-05-09` synced the open
  protected backlog targets to current production build-info
  `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`. `V1-PROTECTED-ACCESS-READINESS`,
  `LIVEIMPORT-03`, and `BOTMULTI-09` remain blocked on authenticated/operator
  evidence; this only prevents stale `4ee1672e` targeting after production
  advanced. Evidence:
  `history/tasks/open-protected-backlog-55469cdc-sync-task-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-6C54BB5D-2026-05-09` pushed the six-commit
  protected-backlog/source-of-truth sync batch and verified production
  freshness. Web build-info reached
  `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`, public API/Web smoke passed,
  and no-secret final V1 preflight for this SHA reports build-info/public
  smoke PASS with V1 still `BLOCKED` on protected auth, production DB restore
  context, failed RC evidence, missing `LIVEIMPORT-03`, stale restore
  evidence, and stale rollback proof. Evidence:
  `history/plans/deploy-freshness-6c54bb5d-2026-05-09.md`.
- 2026-05-09 `PROD-UI-PUBLIC-ACCESS-REFRESH-6C54BB5D-2026-05-09` refreshed
  public/unauthenticated production UI evidence for deployed
  `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`. Build-info matches the
  expected SHA, API `/health` and `/ready` returned HTTP 200, public Web
  routes returned HTTP 200, and unauthenticated dashboard/admin routes returned
  HTTP 307 to `/auth/login`. Full authenticated/admin module clickthrough
  remains blocked on valid production app access. Evidence:
  `history/plans/prod-ui-public-access-clickthrough-6c54bb5d-2026-05-09.md`.
- 2026-05-09 `OPERATOR-PROTECTED-PACK-6C54BB5D-SYNC-2026-05-09` retargeted
  active protected operator commands, activation plan, activation evidence
  audit, and known-issue state to production build-info
  `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`. This does not close protected
  evidence; V1 remains blocked on operator auth/context, RC approval,
  `LIVEIMPORT-03`, restore proof, rollback proof, and authenticated/admin UI
  access. Evidence:
  `history/tasks/operator-protected-pack-6c54bb5d-sync-task-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-C50E1E7C-2026-05-09` verified production
  freshness for the protected operator pack/source-of-truth sync batch. Web
  build-info reached `c50e1e7cf1e37d9c799031cacbb30a834f57e81d` on attempt
  27, public API/Web smoke passed, and no-secret final V1 preflight for this
  SHA reports build-info/public smoke PASS with V1 still `BLOCKED` on
  protected auth, production DB restore context, failed RC evidence, missing
  `LIVEIMPORT-03`, stale restore evidence, and stale rollback proof. Evidence:
  `history/plans/deploy-freshness-c50e1e7c-2026-05-09.md`.
- 2026-05-09 `PROD-UI-PUBLIC-ACCESS-REFRESH-C50E1E7C-2026-05-09` refreshed
  public/unauthenticated production UI evidence for deployed
  `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`. Build-info matches the
  expected SHA, API `/health` and `/ready` returned HTTP 200, public Web
  routes returned HTTP 200, and unauthenticated dashboard/admin routes returned
  HTTP 307 to `/auth/login`. Full authenticated/admin module clickthrough
  remains blocked on valid production app access. Evidence:
  `history/plans/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`.
- 2026-05-09 `DEPLOY-LAG-1F1D9C12-2026-05-09` recorded that the pushed
  two-commit docs/evidence batch ending at
  `1f1d9c12e0cc99884eced81546802a261b0925e9` did not reach production within
  the accepted 900-second build-info wait or two additional 300-second
  follow-up waits, then a later 180-second follow-up wait. Production remained on
  `c50e1e7cf1e37d9c799031cacbb30a834f57e81d` during that historical window.
  Later production build-info advanced beyond the lag and now reports
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`, so this is no longer an active
  deploy-freshness blocker. The deploy-lag artifact includes an operator
  handoff and non-accepted evidence list to avoid empty retrigger commits.
  Diff scope confirmed pushed `1f1d9c12` had no `apps`, `packages`, `prisma`,
  or `scripts` changes over then-deployed `c50e1e7c`. Evidence:
  `history/plans/deploy-lag-1f1d9c12-2026-05-09.md`.
- 2026-05-09 `EXCHANGE2-20` reconciled the second-exchange plan with the
  deployed Gate.io foundation. The plan is now complete as a planning artifact
  and records the exact current support boundary: Gate.io public catalog and
  public `FUTURES`/swap market-data foundation are implemented; Gate.io
  `PAPER_PRICING_FEED`, authenticated reads, `LIVE_ORDER_SUBMIT`, and
  `LIVE_ORDER_CANCEL` remain unsupported until exact adapter support and
  evidence exist. Evidence:
  `history/tasks/exchange2-20-plan-reconciliation-task-2026-05-09.md`.
- 2026-05-08 `EXCHANGE2-LIVE-READINESS-PLAN-2026-05-08` published
  `history/evidence/second-exchange-live-readiness-plan-2026-05-08.md`, a staged
  plan for adding one selected second exchange through existing exchange
  adapter boundaries after current V1 LIVE readiness blockers are closed. The
  user selected `GATEIO` as the target exchange. The plan records that
  implementation remains blocked until market type, first live scope, and
  exchange-side cancel requirement are explicitly selected. It preserves the
  architecture rule that new exchange support must be explicit by operation
  family and must fail closed when unsupported.
- 2026-05-08 `EXCHANGE2-01` started the Gate.io adapter line by registering
  `GATEIO` as a recognized fail-closed exchange placeholder in Prisma/shared
  exchange catalogs and exact operation matrices. All Gate.io execution/read
  capabilities remain disabled until operation-specific adapters and evidence
  are implemented. Evidence:
  `history/tasks/exchange2-01-gateio-fail-closed-placeholder-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-02` enabled Gate.io public market catalog support
  through the existing exchange adapter boundary while keeping Gate.io paper
  pricing, authenticated reads, LIVE submit, and cancel disabled. The catalog
  service now labels Gate.io as `GATEIO_PUBLIC` and fails closed instead of
  returning sample markets when the Gate.io public adapter fails outside test
  mode. Evidence:
  `history/tasks/exchange2-02-gateio-public-market-catalog-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-03` started the Gate.io paper-runtime foundation by
  widening canonical runtime market events to carry registered exchanges
  instead of a Binance-only event type. Binance stream normalization remains
  Binance-only, and Gate.io paper/live/authenticated capabilities remain
  disabled until a real Gate.io market-data source is implemented and verified.
  Evidence:
  `history/tasks/exchange2-03-runtime-market-event-exchange-boundary-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-04` added the Gate.io public market-data reader
  foundation through the existing exchange adapter boundary. Gate.io app
  `FUTURES` resolves to CCXT `swap` for perpetual futures, while paper/live and
  authenticated capabilities remain disabled until runtime publication and
  evidence are complete. Evidence:
  `history/tasks/exchange2-04-gateio-public-market-data-reader-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-05` added an opt-in Gate.io market-stream polling
  worker. `MARKET_STREAM_EXCHANGE=GATEIO` reads public ticker/candle data
  through `exchangePublicMarketData.service.ts` and publishes canonical
  `MarketStreamEvent` payloads with `exchange: GATEIO`; Binance websocket
  ingestion remains the default. Gate.io paper/live/authenticated capabilities
  remain disabled until runtime evidence supports enabling `PAPER_PRICING_FEED`.
  Evidence:
  `history/tasks/exchange2-05-gateio-market-stream-polling-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-06` added runtime regression coverage proving Gate.io
  ticker events and final-candle fallback ticker events preserve exact
  `exchange: GATEIO` and market-type context for runtime automation. Gate.io
  `PAPER_PRICING_FEED` remains disabled until deployed source evidence is
  available. Evidence:
  `history/tasks/exchange2-06-gateio-runtime-consumption-regression-task-2026-05-08.md`.
  Post-push production freshness wait for `5517f027` timed out after ten HTTP
  200 polls over 300 seconds; public API/Web smoke still passed, but
  build-info remained on `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`.
- 2026-05-08 `EXCHANGE2-07` added a focused mocked Redis fanout regression for
  the Gate.io market-stream source. The test drives
  `ExchangePublicPollingMarketStreamWorker` with mocked public ticker/candle
  data, routes events through `publishMarketStreamEvent`, and verifies
  `subscribeMarketStreamEvents` receives canonical ticker and final-candle
  payloads with exact `exchange: GATEIO` and `marketType: FUTURES` context.
  Gate.io `PAPER_PRICING_FEED`, authenticated reads, LIVE submit, and cancel
  remain disabled. The task commit `4ef3ec58` was pushed; post-push public
  smoke passed, but build-info remained on
  `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` after a 120-second wait.
  Follow-up build-info reached
  `36ac02696ac0ce22a6b8bab545fcfb741125ea4b`, which includes the fanout
  regression and deploy-lag state update; public API/Web smoke passed.
- 2026-05-08 `EXCHANGE2-08` captured real public Gate.io market-data smoke
  through the exchange-owned public adapter path. `GATEIO/FUTURES/BTCUSDT`
  ticker and `1m` candles returned valid public data using
  `exchangePublicMarketData.service.ts`; no secrets, authenticated reads,
  exchange writes, live orders, or production mutations were used. Gate.io
  `PAPER_PRICING_FEED`, authenticated reads, LIVE submit, and cancel remain
  disabled until target worker/source evidence and exact operation support are
  complete. Evidence:
  `history/evidence/gateio-public-market-data-smoke-2026-05-08.md`.
  The evidence commit `d4bdc7f0dc5358d20edab45c15ec7623e18610f0` was pushed;
  public API/Web smoke passed afterward, but build-info remained on
  `36ac02696ac0ce22a6b8bab545fcfb741125ea4b` after a 120-second wait.
- 2026-05-08 `EXCHANGE2-09` locked market-stream worker source selection with
  a pure config resolver and focused regression tests. Binance remains the
  default worker source, Gate.io polling is selected only by
  `MARKET_STREAM_EXCHANGE=GATEIO`, and unsupported/invalid env values fall
  back to safe defaults. This strengthens the Gate.io rollout boundary without
  enabling `PAPER_PRICING_FEED`, authenticated reads, LIVE submit, or cancel.
  Evidence:
  `history/tasks/exchange2-09-gateio-market-stream-worker-config-task-2026-05-08.md`.
  Follow-up production build-info reached
  `9382d9317a5ae82d404559398922a253bef9e697`, and public API/Web smoke
  passed.
- 2026-05-08 `EXCHANGE2-10` locked Gate.io Web capability gating against the
  shared exchange capability matrix. `GATEIO` is visible in Web exchange
  options and supports only `MARKET_CATALOG`; `PAPER_PRICING_FEED`,
  `LIVE_EXECUTION`, and `API_KEY_PROBE` remain blocked, and unknown/nullish
  exchanges fail closed. Evidence:
  `history/tasks/exchange2-10-gateio-web-capability-gating-task-2026-05-08.md`.
  The task commit `21ec8efa01ec14ae7fd2c039ac4f9884a2564f65` was pushed;
  public API/Web smoke passed afterward, but build-info remained on
  `9382d9317a5ae82d404559398922a253bef9e697` after a 120-second wait.
- 2026-05-08 `EXCHANGE2-11` locked product-facing Gate.io setup gates in Web
  wallet and bot forms. Gate.io PAPER wallet submit stays blocked while
  `PAPER_PRICING_FEED` is unsupported, and Gate.io bot activation keeps the
  Active toggle disabled. Evidence:
  `history/tasks/exchange2-11-gateio-wallet-bot-ui-gating-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-12` locked the direct API wallet create boundary for
  Gate.io. A DB-backed wallet e2e regression now proves Gate.io PAPER wallet
  creation returns `EXCHANGE_NOT_IMPLEMENTED` for `PAPER_PRICING_FEED` and
  leaves no wallet persisted for the user. Gate.io paper/live/authenticated
  capabilities remain disabled. Evidence:
  `history/tasks/exchange2-12-gateio-api-wallet-fail-closed-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-13` locked the direct API wallet update boundary for
  Gate.io. A wallet CRUD regression now proves an existing Binance PAPER wallet
  cannot be updated to `GATEIO` while `PAPER_PRICING_FEED` is unsupported, and
  the persisted wallet remains unchanged after rejection. Evidence:
  `history/tasks/exchange2-13-gateio-api-wallet-update-fail-closed-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-14` locked the stored API-key probe boundary for
  Gate.io. A profile API-key e2e regression now proves stored Gate.io
  placeholder credentials can exist, but
  `POST /dashboard/profile/apiKeys/:id/test` fails closed with
  `EXCHANGE_NOT_IMPLEMENTED` for `API_KEY_PROBE` and writes no connection-test
  audit log. Evidence:
  `history/tasks/exchange2-14-gateio-stored-api-key-probe-fail-closed-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-15` locked the wallet balance preview boundary for
  stored Gate.io API keys. A wallet e2e regression now proves stored Gate.io
  placeholder credentials cannot be used for balance preview while
  `BALANCE_PREVIEW` authenticated reads are unsupported, and the key remains
  unused after rejection. Evidence:
  `history/tasks/exchange2-15-gateio-wallet-balance-preview-fail-closed-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-16` locked the explicit positions snapshot boundary
  for stored Gate.io API keys. The positions service now enforces the existing
  adapter capability guard before test fixture output or connector reads, the
  route returns HTTP 501 with unsupported capability details, and DB-backed
  e2e coverage proves the Gate.io key remains unused after rejection. Evidence:
  `history/tasks/exchange2-16-gateio-positions-snapshot-fail-closed-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-17` locked open-orders and trade-history snapshot
  boundaries for stored Gate.io API keys. Both internal reconciliation
  snapshot paths now enforce the existing adapter capability guard before test
  fixture output or connector reads, preserve unsupported capability errors,
  and DB-backed service coverage proves `lastUsed` remains unchanged after
  rejection. Evidence:
  `history/tasks/exchange2-17-gateio-reconciliation-snapshots-fail-closed-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-18` locked the Gate.io live order submit boundary.
  Focused exchange boundary coverage proves `LIVE_ORDER_SUBMIT` for `GATEIO`
  fails closed with unsupported capability details before credential
  resolution, connector construction, pretrade guards, leverage convergence, or
  live order adapter creation. Evidence:
  `history/tasks/exchange2-18-gateio-live-submit-boundary-task-2026-05-08.md`.
- 2026-05-08 `EXCHANGE2-19` locked the exchange-backed cancel route boundary.
  API route coverage proves `POST /dashboard/orders/:id/cancel` returns HTTP
  501 with `LIVE_ORDER_CANCEL_UNSUPPORTED` for persisted exchange-backed open
  orders, leaves the order open with `canceledAt=null`, and writes no
  misleading cancellation audit log. Gate.io and all other exchange-side cancel
  capabilities remain disabled until a canonical adapter operation is
  implemented. Evidence:
  `history/tasks/exchange2-19-exchange-backed-cancel-route-fail-closed-task-2026-05-08.md`.
- 2026-05-08 `DEPLOY-FRESHNESS-90CD07D6-2026-05-08` verified the pushed Gate.io
  fail-closed batch on production. Web build-info now exposes
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`, and public API/Web smoke passed.
  Evidence:
  `history/plans/deploy-freshness-90cd07d6-2026-05-08.md`.
- 2026-05-08 `V1-FINAL-PREFLIGHT-NODE-DEPLOY-CHECKS-2026-05-08` made final V1
  preflight deploy checks independent of global `pnpm` PATH drift by spawning
  bundled Node scripts directly for build-info and public smoke. The refreshed
  no-secret preflight for deployed `90cd07d6` reports build-info PASS and
  public smoke PASS, then remains correctly BLOCKED on protected live-import
  auth/readback, rollback auth/proof, and RC Gate 4 approval evidence.
  Evidence:
  `history/releases/v1-final-preflight-90cd07d6-2026-05-08.md`.
- 2026-05-08 `PROD-UI-AUDIT-PLAN-2026-05-08` prepared the production UI module
  clickthrough audit plan requested by the user. The plan covers all canonical
  public, dashboard, admin, and legacy redirect routes, module-level functions,
  responsive breakpoints, accessibility checks, console/network evidence, and
  architecture-alignment reporting. Actual execution remains blocked until
  latest `main` is deployed through build-info and authenticated/admin
  production app access is available. Evidence plan:
  `history/audits/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`.
- 2026-05-08 `PROD-UI-PUBLIC-ACCESS-CLICKTHROUGH-2026-05-08` captured the
  public/unauthenticated production UI audit slice. API `/health` and `/ready`
  passed, public Web routes `/`, `/auth/login`, `/auth/register`, `/offline`,
  and `/api/build-info` returned HTTP 200, and protected dashboard/admin routes
  failed closed with HTTP 307 redirects to `/auth/login`. Build-info remains
  stale at `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` versus expected
  `373a0ceb`, so authenticated module clickthrough and latest-main production
  validation remain blocked. Evidence:
  `history/plans/prod-ui-public-access-clickthrough-2026-05-08.md`.
  The evidence commit `d55a86007b80733d67e793c261a5208c6734ab79` was pushed;
  post-push public deploy smoke passed, but build-info still remained on
  `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` after a 120-second wait.
- 2026-05-09 `PROD-UI-PUBLIC-ACCESS-REFRESH-90CD07D6-2026-05-09` refreshed
  that public/unauthenticated evidence after the Gate.io fail-closed batch was
  deployed. Web build-info now matches
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`, API `/health` and `/ready`
  returned HTTP 200, public Web routes returned HTTP 200, and
  unauthenticated dashboard/admin routes returned HTTP 307 to `/auth/login`.
  This remains public-only evidence; authenticated/admin module clickthrough
  still requires valid production app access. Evidence:
  `history/plans/prod-ui-public-access-clickthrough-90cd07d6-2026-05-09.md`.
- 2026-05-09 `V1-FINAL-PREFLIGHT-REFRESH-90CD07D6-2026-05-09` refreshed the
  no-secret final V1 preflight for deployed
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`. Build-info and public API/Web
  smoke passed. V1 remains `BLOCKED` because live-import auth, rollback auth,
  production DB restore context, `LIVEIMPORT-03`, and current 2026-05-09
  release evidence are missing or stale. Evidence:
  `history/releases/v1-final-preflight-90cd07d6-2026-05-09.md`.
- 2026-05-09 `V1-PROD-ACTIVATION-REFRESH-2026-05-09` added current
  production activation plan and activation evidence audit artifacts as
  explicit `NO-GO`. Later 2026-05-09 sync retargeted those operator-facing
  artifacts to current production build-info
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`. Follow-up no-secret preflight
  reports activation audit and activation execution plan as `fresh` for
  2026-05-09; remaining blockers are protected auth, production DB restore
  context, RC failed/open evidence, missing `LIVEIMPORT-03`, and rollback
  proof. Evidence:
  `history/plans/v1-production-activation-and-evidence-plan-2026-05-09.md`
  and `history/audits/v1-production-activation-evidence-audit-2026-05-09.md`.
- 2026-05-09 `V1-RC-BLOCKED-REFRESH-2026-05-09` refreshed RC external gates
  status, RC sign-off, and RC checklist as current blocked evidence. The RC
  tooling now supports `--today <yyyy-mm-dd>` so evidence can target the
  operator's release date across local/UTC boundaries. Follow-up preflight now
  reports RC evidence as fresh `failed`, not stale; V1 remains blocked on
  protected auth, DB restore context, `LIVEIMPORT-03`, recovery proof, and RC
  approval. Evidence:
  `history/releases/v1-rc-blocked-evidence-refresh-task-2026-05-09.md`.
- 2026-05-09 `V1-ROLLBACK-PROOF-DATE-OVERRIDE-2026-05-09` added
  `--today <yyyy-mm-dd>` to the rollback proof generator so future production
  rollback proof artifacts can target the active evidence date. The actual
  rollback proof remains blocked; a sandboxed no-auth attempt could not reach
  production or write an artifact and was not accepted as evidence. Evidence:
  `history/evidence/v1-rollback-proof-date-override-task-2026-05-09.md`.
- 2026-05-09 `V1-RESTORE-DRILL-DATE-OVERRIDE-2026-05-09` added
  `--today <yyyy-mm-dd>` to the restore drill evidence wrapper so future
  production DB/Coolify restore drill artifacts can target the active evidence
  date. The actual restore drill remains blocked until approved production
  DB/Coolify context is available. Evidence:
  `history/evidence/v1-restore-drill-date-override-task-2026-05-09.md`.
- 2026-05-09 `V1-FINAL-BLOCKER-PACK-DATE-OVERRIDES-2026-05-09` synchronized
  the final blocker execution pack with the date-aware release tooling. The
  operator pack now defines one `$releaseDate` and passes it to supported
  preflight, restore drill, rollback proof, RC status/sign-off, checklist
  sync, and final release gate commands. This did not create or accept
  production evidence; V1 remains blocked until protected auth and DB/Coolify
  context are available. Evidence:
  `history/tasks/v1-final-blocker-pack-date-overrides-task-2026-05-09.md`.
- 2026-05-09 `DEPLOY-FRESHNESS-4792FBCA-2026-05-09` pushed the current V1
  release-evidence batch and verified production freshness. Web build-info
  reached `4792fbca9ab3ca44d08c312f219f70d648707886` on attempt 14, and safe
  public smoke passed for API `/health`, API `/ready`, and Web `/`. This is
  deploy freshness evidence only; protected runtime/readback, restore drill,
  rollback proof, RC approval, and authenticated UI clickthrough remain open.
  Evidence:
  `history/plans/deploy-freshness-4792fbca-2026-05-09.md`.
- 2026-05-09 `V1-FINAL-PREFLIGHT-4792FBCA-2026-05-09` generated fresh
  no-secret final V1 preflight artifacts for deployed `4792fbca`. Build-info
  and public API/Web smoke pass; V1 remains `BLOCKED` on missing live-import
  auth, rollback auth, production DB restore context, failed RC external
  gates/sign-off/checklist evidence, missing `LIVEIMPORT-03`, and stale
  backup/restore plus rollback proof evidence for the 2026-05-09 evidence
  date. Evidence:
  `history/releases/v1-final-preflight-4792fbca-2026-05-09.md`.
- 2026-05-09 `V1-FINAL-BLOCKER-PACK-CANDIDATE-SHA-SYNC-2026-05-09` updated
  the final blocker execution pack so protected evidence commands target the
  verified deployed code/tooling candidate
  `4792fbca9ab3ca44d08c312f219f70d648707886`. The pack now explicitly warns
  not to use local evidence-only `HEAD` as the protected evidence candidate
  until production build-info proves that SHA is deployed. Evidence:
  `history/tasks/v1-final-blocker-pack-candidate-sha-sync-task-2026-05-09.md`.
- 2026-05-09 `V1-CONTINUATION-EXPECTED-SHA-SNIPPETS-2026-05-09` aligned
  active continuation snippets with that same deployed candidate. Build-info
  wait and `LIVEIMPORT-03` examples now use explicit `$expectedSha =
  4792fbca...` and date-aware output paths instead of local evidence-only
  `HEAD`. Evidence:
  `history/tasks/v1-continuation-expected-sha-snippets-task-2026-05-09.md`.
- 2026-05-09 `V1-PROTECTED-ACCESS-READINESS-2026-05-09` confirmed the current
  shell is still missing required protected inputs. Names-only checks found no
  live-import auth, rollback auth, or production DB/Coolify restore context
  env names. 2026-05-09 refresh: the readiness artifact now targets current
  production build-info `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`. Final V1
  evidence remains blocked until those inputs, RC approval identities, and
  authenticated/admin UI access are supplied. Evidence:
  `history/evidence/v1-protected-access-readiness-2026-05-09.md`.
- 2026-05-08 `V1-CURRENT-PREFLIGHT-STATUS-SNAPSHOT-2026-05-08` published the
  current no-secret final V1 preflight JSON/Markdown snapshot for deployed SHA
  `052df82244ea0f81e8611ff8bb2b677db115bd19`. The snapshot reports build-info
  PASS, public smoke PASS, production DB restore context SATISFIED, and current
  blockers limited to live-import auth/readback, rollback guard auth/proof, and
  RC Gate 4 approval evidence. Artifacts:
  `history/artifacts/_artifacts-v1-final-preflight-current.json` and
  `history/releases/v1-final-preflight-current.md`.
- 2026-05-08 `V1-FINAL-BLOCKER-PACK-RESTORE-STATE-SYNC-2026-05-08`
  synchronized the final blocker pack and active continuation state after
  deployed commit `721fe8482922835a9419f0e529baeef4ff6a74c9` confirmed
  build-info PASS, public smoke PASS, and production DB restore context
  SATISFIED by fresh backup/restore drill evidence. Current V1 blockers are
  now limited to live-import auth/readback, rollback guard auth/proof, and RC
  Gate 4 approval evidence.
- 2026-05-08 `V1-PROTECTED-AUTH-CONTEXT-SWEEP-2026-05-08` classified the
  remaining protected auth context after the production restore drill. The
  approved API runtime env-name sweep recorded only variable names and found
  no `LIVEIMPORT_READBACK_*` or `ROLLBACK_GUARD_*` auth env names. A rollback
  proof rerun failed closed on protected `401` responses and generated current
  failed evidence:
  `history/evidence/v1-rollback-proof-prod-2026-05-08T15-30-28-231Z.md`.
  `ops:release:v1:preflight` now derives prerequisite blockers after release
  evidence evaluation, so fresh `backupRestoreDrill` evidence satisfies the
  production DB restore context prerequisite without treating missing DB envs
  as a blocker. Raw prerequisite env evaluation remains fail-closed. Current
  preflight still blocks on live-import auth, rollback auth, failed RC Gate 4
  approval evidence, missing `LIVEIMPORT-03`, and failed rollback proof.
- 2026-05-08 `V1-PROD-RESTORE-DRILL-COOLIFY-TERMINAL-2026-05-08` completed
  the production backup/restore drill through approved Coolify terminal access
  against Postgres container `x11cfnz1dd9x0yzccftqzcoe`. The corrected
  `set -eu` run created a compressed backup, created and restored into
  `postgres_restore_check_20260508151624`, validated key table counts, dropped
  the restore DB, removed the backup dump, and returned `RESULT: PASS`.
  Cleanup verification returned `0` matching restore databases and no
  `/tmp/postgres_backup_*.dump` files. Evidence:
  `history/evidence/v1-restore-drill-prod-2026-05-08T15-16-24Z.md` and
  `history/artifacts/_artifacts-restore-drill-prod-coolify-2026-05-08T15-16-24Z.json`.
  Final V1 preflight now reports backup/restore drill evidence as fresh; V1
  remains blocked on live-import auth/readback, rollback auth/proof, and RC
  Gate 4 approval.
- 2026-05-08 `V1-PROTECTED-EVIDENCE-COOLIFY-CONTEXT-2026-05-08` used the
  approved Coolify operator path after latest `main` reached production
  build-info `e6e7d4a044ce80279c542412a91bae4a6a012392`. Public API/Web
  smoke passed. Coolify confirms the production Postgres container name is
  `x11cfnz1dd9x0yzccftqzcoe`, but local Docker cannot see that remote
  container, so the existing Docker-based restore drill cannot produce honest
  production PASS evidence from this workstation. Generated no-secret status
  reports:
  `history/artifacts/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
  and
  `history/releases/v1-final-preflight-2026-05-08-protected-context.md`.
  V1 remains blocked on protected Soar app auth, rollback auth, production DB
  execution context/env handoff, and real RC Gate 4 approver identities.
- 2026-05-08 `V1-FINAL-PREFLIGHT-MARKDOWN-REPORT-2026-05-08` added optional
  `--markdown-output <path>` support to `ops:release:v1:preflight`. The
  Markdown report is generated from the same no-secret preflight report object
  as JSON and summarizes context, public checks, protected prerequisites,
  release evidence, blockers, blocker details, and next actions. It is
  operator-readable status handoff material only, not final V1 release
  evidence.
- 2026-05-08 `V1-FINAL-PREFLIGHT-BLOCKER-DETAILS-2026-05-08` added
  structured no-secret `blockerDetails` metadata to the final V1 preflight
  JSON report. The report still keeps raw blocker keys and remediation hints,
  and now also exposes category, severity, protected-input requirement,
  final-evidence requirement, required capability tags, and remediation
  availability for later Web/operator status rendering without parsing blocker
  strings or duplicating release blocker classification.
- 2026-05-08 `V1-FINAL-PREFLIGHT-REMEDIATION-HINTS-2026-05-08` added
  no-secret remediation hints to final V1 preflight CLI/JSON output. Known
  blockers now point to the approved final blocker commands for build-info,
  public smoke, live-import readback, production restore drill, rollback proof,
  RC sign-off, gate refresh, and checklist sync without printing secret values
  or adding bypass paths.
- 2026-05-08 `V1-FINAL-PREFLIGHT-PUBLIC-SMOKE-2026-05-08` extended
  `ops:release:v1:preflight` with the existing public deploy smoke command
  (`--no-workers`) so the safe first operator command now verifies both
  deployed build-info and public API/Web reachability before reporting
  protected blockers. Current no-auth preflight reports build-info PASS and
  public smoke PASS, then blocks on missing production auth/DB/approval and
  evidence inputs.
- 2026-05-08 `V1-FINAL-PREFLIGHT-JSON-REPORT-2026-05-08` added optional
  `--json-output <path>` support to `ops:release:v1:preflight`. The report is
  a no-secret machine-readable status snapshot for later Web/operator
  visualization: it contains deploy freshness state, prerequisite readiness,
  release evidence states, and blockers, but not secret values and not final
  release evidence. A local no-auth run against a temporary JSON path produced
  `status=blocked`; the generated file was not committed because it is a
  point-in-time status snapshot.
- 2026-05-08 `V1-FINAL-PREFLIGHT-REGRESSION-TESTS-2026-05-08` added focused
  automated coverage for the final V1 preflight command. The tests lock
  fail-closed behavior when production auth/DB envs are absent, accept complete
  token or email/password alternatives, require complete production DB restore
  env families, keep optional OPS layers separate, and verify the build-info
  wait can be skipped in local unit tests. The CLI no-auth preflight still
  exits `1` and creates no protected `LIVEIMPORT-03` artifact.
- 2026-05-08 `V1-FINAL-PREFLIGHT-COMMAND-2026-05-08` added
  `pnpm run ops:release:v1:preflight`, a read-only final V1 operator preflight
  that verifies current `HEAD` through web build-info, reports missing
  prerequisite env names, and classifies current release evidence blockers
  through the existing release-gate evidence model. In the current shell the
  command passes build-info, exits non-zero on missing protected
  `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, and production DB restore env
  names plus current RC/live-import/restore/rollback evidence blockers, and
  creates no protected production evidence artifacts.
- 2026-05-08 `V1-RELEASE-GATE-RC-APPROVAL-EVIDENCE-2026-05-08` aligned the
  final production release gate with the real RC approval requirement.
  `ops:release:v1:gate` now requires RC external gates to show all four gates
  `PASS`, the sign-off record to report `RC status: APPROVED`, and the RC
  checklist to show `G4=PASS`. The dry-run
  `history/releases/v1-release-gate-prod-2026-05-08Trc-approval-required-dry-run.md`
  reports `not_ready` with RC external gates, RC sign-off, and RC checklist as
  failed while current Gate 4 remains open/blocked. No fake approver names,
  protected production credentials, exchange writes, DB writes, live-money
  actions, or destructive operations were used. The task commit was deployed
  and production build-info reached
  `1100b7fb232ce6195b24522a6a11559fe9fb8634`; public deploy smoke passed.
  Future protected evidence collection should still verify the currently
  checked-out `HEAD` with build-info first rather than relying on a hardcoded
  historical SHA.
- 2026-05-08 `V1-RELEASE-GATE-BUILD-INFO-FRESHNESS-2026-05-08` added deployed
  SHA freshness enforcement to the final V1 release gate. The gate now accepts
  `--expected-sha` / `RELEASE_GATE_EXPECTED_SHA` and, when provided, runs the
  existing `ops:deploy:wait-web-build-info` step before deploy smoke. The
  final blocker pack now passes `git rev-parse HEAD` into the release gate.
  The dry-run
  `history/releases/v1-release-gate-prod-2026-05-08Tbuild-info-required-dry-run.md`
  shows the planned build-info freshness gate and remains `not_ready` for the
  existing protected evidence blockers.
- 2026-05-08 `V1-RELEASE-GATE-LIVEIMPORT-EVIDENCE-2026-05-08` aligned the
  final production release gate with the active `LIVEIMPORT-03` blocker.
  `ops:release:v1:gate` now requires
  `history/artifacts/liveimport-03-prod-readback-YYYY-MM-DD.json` in production
  and validates that it contains runtime readback visibility with no missing
  expected symbols. The refreshed dry-run
  `history/releases/v1-release-gate-prod-2026-05-08Tliveimport-required-dry-run.md`
  reports `not_ready` with `evidence:liveImportReadback:missing`, plus the
  existing failed recovery proof and dry-run blockers. No protected production
  credentials, exchange writes, DB writes, live-money actions, or destructive
  operations were used.
- 2026-05-08 `V1-RELEASE-GATE-CURRENT-DRY-RUN-2026-05-08` refreshed the
  production V1 release-gate dry-run after production build-info advanced to
  `3f065ac5c24ff159f97a94a0bc98948a1739eadf`. The report
  `history/releases/v1-release-gate-prod-2026-05-08Tcurrent-deployed-head-dry-run.md`
  remains `not_ready`: activation and RC evidence families are fresh, while
  backup/restore drill and rollback proof are fresh but failed, and dry-run
  mode still blocks final approval. No protected production credentials,
  exchange writes, DB writes, live-money actions, or destructive operations
  were used.
- 2026-05-08 `V1-RC-SIGNOFF-PREFLIGHT-HARDENING-2026-05-08` clarified Gate 4
  sign-off blocker output in the existing `ops:rc:signoff:build` script.
  Blocked builds now print the exact missing required fields:
  Engineering, Product, Operations, and RC owner names. Missing
  `--owner-contact` is reported as recommended rollback-authority handoff
  metadata without changing approved-status logic. No runtime, API, DB, Web,
  exchange, deploy, or live-money behavior changed. Actual Gate 4 approval
  still requires real approver identities.
- 2026-05-08 `V1-RECOVERY-PROOF-PREFLIGHT-HARDENING-2026-05-08` clarified
  production restore drill and rollback proof prerequisite handoff in existing
  ops scripts and the final blocker pack. Restore help and missing-container
  failures now name accepted production DB env choices (`PROD_DB_CHECK_*` or
  `PRODUCTION_DB_CHECK_*`). Rollback proof help names base URL, token or
  email/password auth choices, and optional OPS basic/header envs. No
  runtime, API, DB, Web, exchange, deploy, or live-money behavior changed.
  Restore drill and rollback proof still require approved production access
  before they can become PASS evidence.
- 2026-05-08 `V1-LIVEIMPORT-AUTH-PREFLIGHT-HARDENING-2026-05-08` clarified
  the existing `ops:liveimport:readback` fail-closed missing-auth path. It now
  names the accepted auth variable choices without printing secret values:
  `LIVEIMPORT_READBACK_AUTH_TOKEN`, or `LIVEIMPORT_READBACK_AUTH_EMAIL` plus
  `LIVEIMPORT_READBACK_AUTH_PASSWORD`, with optional private OPS basic/header
  envs when applicable. The no-auth validation exits non-zero and creates no
  readback artifact. No runtime, API, DB, Web, exchange, deploy, or live-money
  behavior changed. `LIVEIMPORT-03` remains open until protected runtime
  positions payloads are captured with approved production auth.
- 2026-05-08 `V1-DEPLOY-FRESHNESS-STATE-SYNC-2026-05-08` synchronized the
  active final blocker state to production build-info SHA
  `0a2e2353177c15d4a4934c03837835785e01d710`. This SHA contains the backend
  PAPER/LIVE parity runtime fix, release blocker evidence alignment, and
  deploy-wait coordination docs. Public deploy smoke passed after the
  build-info wait. No runtime, API, DB, Web, exchange, or live-money behavior
  changed. `LIVEIMPORT-03`, production restore drill, rollback proof, and Gate
  4 sign-off remain blocked by protected auth/access and approval inputs.
- 2026-05-08 `V1-PAPER-LIVE-BACKEND-RUNTIME-PARITY-2026-05-08` fixed a
  backend runtime parity boundary leak in `executionOrchestrator.service`.
  Close-settlement entry-fee aggregation now goes through
  `RuntimeTradeGateway.sumEntryFees` instead of calling Prisma directly from
  the shared orchestration path. The real default gateway remains Prisma-backed,
  but injected PAPER/LIVE parity and crash-retry gateways are now fully
  authoritative without requiring a database connection. Validation PASS:
  focused engine parity/crash pack (`4/4` files, `26/26` tests), API
  typecheck, repository guardrails, sequential DB-backed runtime/order/
  exchange/import/readback packs, and the full local API suite with test-only
  API-key encryption env. API build and workspace build also pass. The first
  DB-backed attempt exposed an environment false blocker: `desktop-linux`
  Docker context returned pipe `500`, while the `default` Docker context plus
  local `localhost:5432`/`6379` ports were reachable. Sequential reruns
  passed, so no local backend runtime assertion failure remains in this slice.
  Candidate commit: current task commit.
  The task commit was pushed to `origin/main`; a 900-second public production
  build-info wait still saw `4f6832d6d94d0d9e86a2504b4a00fe177a1c6c44`, while
  public deploy smoke without workers passed for `API /health`, `API /ready`,
  and `WEB /`. Coolify/manual deployment is still required before production
  readback can prove this fix.
  Follow-up production build-info then advanced to
  `da1e52cfec0b70e5a94e59d75fe702a55c348d74`, which contains the runtime fix;
  public deploy smoke without workers passed again. The later docs-only state
  commit had not deployed after a 300-second wait. A read-only
  `LIVEIMPORT-03` collector attempt against deployed `da1e52cf...` failed
  closed with missing production auth, and a names-only env scan found only
  `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`.
  The refreshed production release-gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-08T05-27-38-139Z.md` reports
  `not_ready`: 2026-05-07 activation, RC, backup/restore, and rollback
  artifacts are stale for 2026-05-08, dry-run mode cannot approve production,
  runtime freshness fails closed on protected `401`, and rollback guard reports
  `shouldRollback=true` only because protected freshness/alerts endpoints are
  `401` without auth.
  The final refreshed 2026-05-08 dry-run
  `history/releases/v1-release-gate-prod-2026-05-08T05-36-43-320Z.md` keeps
  readiness `not_ready`: activation and RC artifacts are fresh, while
  backup/restore is fresh but failed due to missing production DB/Coolify
  access, and rollback proof is fresh but failed on protected `401` responses.
  Follow-up public build-info saw production at
  `e6ccbedaa1d0074d5dc335935bb6b51a9bb1e387` while latest `main` was
  `d1755b45fc5a6fa901b86519366188efe743a05a`; public smoke still passed.
  `LIVEIMPORT-03` readback against deployed `e6ccbeda...` failed closed with
  missing auth, and the latest dry-run
  `history/releases/v1-release-gate-prod-2026-05-08T05-43-51-157Z.md` remains
  `not_ready`.
  The active final blocker pack now uses `git rev-parse HEAD` plus the web
  build-info wait command as the deploy freshness source for `LIVEIMPORT-03`
  readback commands.
  RC preflight narrowed RC blockers to Gate 4 only: Engineering, Product,
  Operations, and RC owner identities are missing, and final status remains
  `BLOCKED`. Gates 1, 2, and 3 are `PASS`.
  Evidence:
  `history/audits/v1-paper-live-backend-runtime-parity-task-2026-05-08.md`.

## 2026-05-07 V1 Final Blocker Execution Pack
- 2026-05-07 `V1-LIVE-IMPORT-STATUS-ISOLATION-2026-05-07` fixed the
  authenticated `/dashboard/positions/live-status` route so live-import
  reconciliation diagnostics are scoped to the requesting user. The route now
  filters `lastPositionDiagnostics` by `req.user.id` and recomputes
  `lastDiagnosticSummary` and `openPositionsSeen` from that filtered payload,
  preventing cross-user diagnostic leakage and operator-truth pollution.
  Validation PASS: pre-fix e2e regression failed as expected; post-fix
  focused e2e `3/3`, import diagnostics/service pack `35/35`, API typecheck,
  repository guardrails, docs parity, and diff check. Evidence:
  `history/tasks/v1-live-import-status-isolation-task-2026-05-07.md`.
- 2026-05-07 `V1-DASHBOARD-CRYPTO-ICONS-REGRESSION-2026-05-07` restored
  dashboard crypto icon recovery in the shared Web `AssetSymbol` renderer.
  The component now clears stale image-load failure state when the normalized
  symbol or icon URL changes, so asynchronous icon lookup and reused table rows
  can recover from fallback letters to real asset icons. Validation PASS:
  pre-fix regression failed as expected, post-fix component test `4/4`,
  focused dashboard widget pack `25/25`, Web typecheck, Web lint, repository
  guardrails, docs parity, and diff check. Evidence:
  `history/tasks/v1-dashboard-crypto-icons-regression-task-2026-05-07.md`.
- 2026-05-07 `V1-PROD-GITHUB-ACTIONS-REGRESSION-CLEANUP-2026-05-07` removed
  the invalid GitHub Actions production promotion/rollback path after operator
  correction. Deleted `.github/workflows/promote-prod.yml`,
  `.github/workflows/prod-rollback.yml`, and the local `ops:prod:promote`
  helper. Active deployment state now points to Coolify/manual operator deploy
  plus repository-local verification gates. Evidence:
  `history/tasks/v1-prod-github-actions-regression-cleanup-task-2026-05-07.md`.
- 2026-05-07 `V1-FINAL-BLOCKER-PREREQ-RECHECK-2026-05-07` rechecked the
  current environment after the final blocker pack. Public production
  build-info matches `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, but a
  names-only env scan found only `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`, not the
  required Soar production auth/access variables. A no-auth
  `ops:liveimport:readback` attempt failed closed before protected runtime
  readback, and the refreshed release-gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-07T18-20-30-000Z.md`
  remains `not_ready`. Evidence:
  `history/tasks/v1-final-blocker-prerequisite-recheck-task-2026-05-07.md`.
- 2026-05-07 `V1-FINAL-BLOCKER-PACK-2026-05-07` published
  `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`, a single
  operator-oriented command sequence for the remaining V1 blockers. It names
  required auth/access, current production SHA
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, `LIVEIMPORT-03` readback,
  production restore drill, rollback proof, RC gates/sign-off, and final
  non-dry-run release gate requirements. It does not approve V1. Evidence:
  `history/tasks/v1-final-blocker-execution-pack-task-2026-05-07.md`.

## 2026-05-07 V1 Continuation State Sync
- 2026-05-07 `V1-CONTINUATION-STATE-SYNC-2026-05-07` synchronized the
  continuation state after the recovery-proof blocker refresh. The canonical
  `LIVEIMPORT-03` command now targets production build-info SHA
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`. System health now distinguishes
  the pushed/deployed code-tooling SHA from local docs/evidence-only commits
  that are intentionally unpushed. Evidence:
  `history/tasks/v1-continuation-state-sync-task-2026-05-07.md`.

## 2026-05-07 V1 Production Recovery Proof Blocked Refresh
- 2026-05-07 `V1-PROD-RECOVERY-PROOF-BLOCKED-REFRESH-2026-05-07` refreshed
  production backup/restore and rollback proof blockers as current failed
  evidence. Rollback proof was executed through the existing script and failed
  closed because protected runtime freshness and alerts endpoints returned
  `401`. Restore drill was not executed because this shell lacks production
  database/Coolify access; the fresh artifact records that blocker. Follow-up
  release-gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-07T18-04-30-000Z.md`
  now classifies backup/restore drill and rollback proof as `FAILED`, not
  `stale`. Evidence:
  `history/evidence/v1-prod-recovery-proof-blocked-refresh-task-2026-05-07.md`.

## 2026-05-07 V1 RC Blocked Evidence Refresh
- 2026-05-07 `V1-RC-BLOCKED-REFRESH-2026-05-07` refreshed RC external gates
  status, RC sign-off, and RC checklist as current blocked/open evidence.
  Current snapshot is `G1=PASS`, `G2=OPEN`, `G3=PASS`, `G4=OPEN`; sign-off
  final decision is `BLOCKED`. Follow-up release-gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-07T18-00-30-000Z.md` now
  classifies activation plan/audit, RC status, RC sign-off, and RC checklist
  as `fresh`. V1 remains `not_ready` because backup/restore drill evidence,
  rollback proof pack, dry-run mode, and authenticated `LIVEIMPORT-03`
  readback remain unresolved. Evidence:
  `history/releases/v1-rc-blocked-evidence-refresh-task-2026-05-07.md`.

## 2026-05-07 V1 Production Activation Refresh
- 2026-05-07 `V1-PROD-ACTIVATION-REFRESH-2026-05-07` created fresh production
  activation plan and activation evidence audit artifacts for 2026-05-07 with
  explicit `NO-GO` status. Follow-up release-gate dry-run
  `history/releases/v1-release-gate-prod-2026-05-07T17-56-30-000Z.md`
  confirms activation audit and activation plan are now `fresh`; remaining
  release-gate blockers are stale RC external gates status, RC sign-off, RC
  checklist, backup/restore drill evidence, rollback proof pack, and dry-run
  mode. Authenticated `LIVEIMPORT-03` readback remains separately required.
  Evidence:
  `history/tasks/v1-production-activation-plan-refresh-task-2026-05-07.md`.

## 2026-05-07 V1 Production Release Gate Dry Run
- 2026-05-07 `V1-PROD-GATE-DRY-RUN-2026-05-07` ran the existing
  `ops:release:v1:gate` script in production dry-run mode with protected
  execution steps skipped. Generated artifacts:
  `history/releases/v1-release-gate-prod-2026-05-07T17-51-30-000Z.md` and
  `history/artifacts/_artifacts-v1-release-gate-prod-2026-05-07T17-51-30-000Z.json`.
  Readiness is `not_ready`: activation audit, activation plan, RC external
  gates status, RC sign-off, RC checklist, backup/restore drill evidence, and
  rollback proof pack are stale, and dry-run mode correctly blocks final
  production approval. No protected OPS, exchange, or live-money path was
  called. Evidence:
  `history/releases/v1-prod-release-gate-dry-run-task-2026-05-07.md`.

## 2026-05-07 Production Build-Info Lag After Collector Hardening
- 2026-05-07 `PROD-BUILDINFO-LAG-2026-05-07` rechecked public production
  freshness after `origin/main` advanced to
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`. The canonical build-info wait
  timed out after six HTTP 200 polls; production web still reported
  `6bf5de83b8ed285410ecc10ecc50a2567ac68ee1`. Public API `/health` returned
  `status=ok` and `/ready` returned `status=ready`. No runtime, API, DB,
  exchange, deployment, or live-money behavior changed. `LIVEIMPORT-03` remains
  blocked by missing authenticated read-only production runtime evidence. A
  later canonical wait passed on attempt 1 for
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, so production now exposes the
  collector hardening code/tooling commit. Evidence:
  `history/evidence/prod-build-info-lag-after-collector-hardening-task-2026-05-07.md`.

## 2026-05-07 LIVEIMPORT-03 Readback Collector
- 2026-05-07 `LIVEIMPORT-03-COLLECTOR-HARDENING-2026-05-07` hardened the
  read-only collector so a discovered LIVE bot with no RUNNING session cannot
  produce a false-positive release artifact. The collector now summarizes
  bots with runtime readback, bots without a running session, and unique
  visible symbols, then fails closed if no runtime positions payload was
  collected or if expected symbols are absent from collected readback.
  Validation PASS: syntax check, help, dry-run, missing-auth fail-closed, and
  a local no-running-session harness. Authenticated `LIVEIMPORT-03` production
  evidence remains blocked until read-only auth is available. Evidence:
  `history/evidence/liveimport-03-readback-collector-hardening-task-2026-05-07.md`.
- 2026-05-07 `LIVEIMPORT-03-COLLECTOR-2026-05-07` added
  `ops:liveimport:readback`, a read-only, redacted production runtime evidence
  collector for the active `LIVEIMPORT-03` blocker. It reuses existing ops auth
  helpers, can verify production web build-info against an expected SHA,
  discovers LIVE bots and latest RUNNING runtime sessions or accepts explicit
  bot/session ids, and reads protected runtime positions for
  `ETHUSDT,DOGEUSDT` by default. The output redacts ids and records only the
  required runtime truth: symbol visibility, management/ownership state,
  sync/continuity/takeover state, strategy/TTP/DCA context presence, and
  actionable state. Validation PASS: help, dry-run, and missing-auth
  fail-closed paths. Actual `LIVEIMPORT-03` evidence remains blocked until
  production read-only auth is available. The collector/docs commit was pushed
  to `origin/main` at `6bf5de83a482eda08543138d8518e0aa23ccb3c6`; production
  build-info still reports `1f816362c93e117e47cfe52a35e0fec93bd0b37d`, which
  already contains the required runtime fixes, so the remaining blocker is auth
  rather than runtime deploy freshness. Evidence:
  `history/evidence/liveimport-03-readback-collector-task-2026-05-07.md`.

## 2026-05-07 Production Promotion Prerequisite Sweep
- 2026-05-07 `PROD-PROMOTE-PREQ-2026-05-07` captured the post-push production
  blocker. Local `main` and `origin/main` are synchronized at
  `1f816362c93e117e47cfe52a35e0fec93bd0b37d`. Public production web
  build-info initially still reported
  `834f83711ba11288829746338d1097abb6bf1c44`, and the canonical build-info
  wait command timed out after six HTTP 200 polls with the old SHA. A later
  rerun passed on attempt 1 with production build-info reporting
  `1f816362c93e117e47cfe52a35e0fec93bd0b37d`; public API `/health`, API
  `/ready`, and web `/auth/login` are healthy. No runtime, API, DB, Web,
  deployment, exchange, or live-money behavior changed. `LIVEIMPORT-03`
  remains blocked only by authenticated read-only production runtime access.
  Evidence:
  `history/tasks/prod-promotion-prerequisite-sweep-task-2026-05-07.md`.

## 2026-05-07 Planning Status Sweep After Local Audit Gates
- 2026-05-07 `PLAN-SWEEP-2026-05-07` synchronized active planning after
  `LIVEIMPORT-03` remained blocked by missing production read-only auth. The
  top `mvp-execution-plan.md` progress log now records the local audit closure
  through `FULLARCH-FIX-11` and the production-readback prerequisite sweep.
  No runtime, API, DB, Web, deployment, exchange, or live-money behavior
  changed. Evidence:
  `history/audits/planning-status-sweep-after-local-audit-gates-task-2026-05-07.md`.

## 2026-05-07 LIVEIMPORT-03 Production Readback Prerequisite Sweep
- 2026-05-07 `LIVEIMPORT-03-PREQ-2026-05-07` rechecked production readback
  prerequisites after the local audit gates closed through `FULLARCH-FIX-11`.
  A names-only environment scan returned only `FIGMA_OAUTH_TOKEN` and
  `STITCH_API_KEY`; no production admin token, operator login, ops basic auth,
  bearer/session cookie, or Soar production auth variable name is present in
  this shell. No secret values, production writes, exchange writes, deploys, or
  live-money actions were used. `LIVEIMPORT-03` remains open for authenticated
  read-only redacted ETH/DOGE runtime positions evidence. Evidence:
  `history/evidence/liveimport-03-production-readback-prerequisite-sweep-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-11 Wallet Market Bot Topology Gate
- 2026-05-07 `FULLARCH-FIX-11` closed focused local API+Web evidence for
  wallet/capital handling, market universe scope, bot create/edit/list
  behavior, single active bot market scope, multi-strategy links, subscription
  entitlements, and the UI forms/tables that configure those contracts. This
  validates the supporting ownership/topology path required before imported
  exchange positions can become selected-bot managed. No code, schema,
  deployment, exchange, or live-money behavior changed. Validation PASS: API
  pack (`11/11` files, `80/80` tests) and Web pack (`21/21` files, `49/49`
  tests). Evidence:
  `history/tasks/fullarch-fix-11-wallet-market-bot-topology-gate-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-05 API Single Active Bot Scope
- 2026-05-07 `FULLARCH-FIX-05` closed the API e2e failures exposed after the
  Web harness fix. Bot market-group writes now preflight the approved
  one-enabled-`ACTIVE`-market-scope-per-bot invariant and return a controlled
  `409` (`bot already has an active market group`) instead of leaking a Prisma
  `500`. Stale API e2e fixtures were aligned to the post-V1 topology:
  one active bot market scope with multiple ordered strategy links. Manual
  order fixtures now include wallet proof for exchange-synced LIVE open orders
  and clean backtest rows before deleting users. Validation PASS: focused API
  blocker pack (`6/6` files, `59/59` tests), API typecheck, root workspace
  tests (`api 174/174 files, 1163/1163 tests; web 145/145 files, 482/482
  tests`), lint, guardrails, docs parity, and diff check. Evidence:
  `history/tasks/fullarch-fix-05-api-single-active-bot-scope-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-06 Binance Futures Snapshot Normalization
- 2026-05-07 `FULLARCH-FIX-06` closed the remaining local live-import audit
  coverage gap for Binance futures position snapshots. The exchange snapshot
  normalizer now converts signed `positionAmt` into positive `contracts`,
  derives one-way `LONG`/`SHORT` from `positionSide=BOTH` plus amount sign, and
  preserves explicit adapter `position.side` as highest-priority truth. This
  keeps signed exchange quantities from leaking into reconciliation and
  ownership/readback classification. Validation PASS: pre-fix normalizer
  regression failed as expected (`3 failed`), normalizer suite (`5/5`),
  focused import/reconciliation/takeover pack (`42/42`), and API typecheck.
  Evidence:
  `history/tasks/fullarch-fix-06-binance-futures-position-normalization-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-07 Runtime Repair Closure Validation
- 2026-05-07 `FULLARCH-FIX-07` closed the local post-repair runtime validation
  follow-up from the full architecture audit. The focused sequential pack
  covered runtime signal merge/final-candle/loop, pre-trade and risk gates,
  execution orchestration, exchange events, order and position lifecycle,
  imported-position DCA visibility, takeover readback, and runtime position
  automation. No code, schema, UI, deployment, or live-money behavior changed.
  Validation PASS: `16/16` files and `240/240` tests. Evidence:
  `history/tasks/fullarch-fix-07-runtime-repair-closure-validation-task-2026-05-07.md`.

## 2026-05-07 Full Architecture Audit Repair Queue Sync
- 2026-05-07 `FULLARCH-AUDIT-SYNC-2026-05-07` synchronized the original full
  architecture conformance audit report after the local repair chain closed.
  The audit now points to the actual completed local evidence tasks
  `FULLARCH-FIX-01..07` and leaves authenticated `LIVEIMPORT-03` production
  readback, then `BOTMULTI-09`, as the remaining release evidence sequence.
  No code, schema, UI, deployment, or live-money behavior changed. Evidence:
  `history/audits/fullarch-audit-repair-queue-sync-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-08 Security And Isolation Release Gate
- 2026-05-07 `FULLARCH-FIX-08` closed the local security/isolation release-gate
  evidence requested by the full architecture audit. The focused sequential
  API pack covered rate limiting, auth/session, trusted origin, security
  headers, API-key ownership/encryption, profile security, subscription/admin
  authorization, upload, bot entitlements, and cross-module user-data
  isolation. No code, schema, UI, deployment, or live-money behavior changed.
  Validation PASS: `18/18` files and `87/87` tests with test-only API-key
  encryption env. Evidence:
  `history/releases/fullarch-fix-08-security-isolation-release-gate-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-09 Strategy Backtest Reports Logs Gate
- 2026-05-07 `FULLARCH-FIX-09` closed focused local API+Web evidence for
  strategy/indicator parity, backtest execution and replay, reports, and
  logs/audit trail after the Web navigation mock harness repair. No code,
  schema, deployment, or live-money behavior changed. Validation PASS: API pack
  (`12/12` files, `92/92` tests) and Web pack (`21/21` files, `49/49` tests).
  Evidence:
  `history/tasks/fullarch-fix-09-strategy-backtest-reports-logs-gate-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-10 Market Stream Dashboard Monitoring Gate
- 2026-05-07 `FULLARCH-FIX-10` closed focused local API+Web evidence for
  market stream ingestion/fanout/route contracts and dashboard/bot monitoring
  surfaces after the Web navigation mock harness repair. No code, schema,
  deployment, or live-money behavior changed. Validation PASS: API pack
  (`9/9` files, `63/63` tests) and Web pack (`19/19` files, `79/79` tests).
  Evidence:
  `history/evidence/fullarch-fix-10-market-dashboard-monitoring-gate-task-2026-05-07.md`.

## 2026-05-07 Safe Environment Scan Guardrail
- 2026-05-07 `AOS-STATE-ENV-2026-05-07` captured a secret-safe continuation
  guardrail after the production-readback prerequisite recheck: environment
  scans for auth or production access must print variable names only and must
  not project values by default. This is docs/context only and does not close
  `LIVEIMPORT-03`; authenticated read-only production runtime readback remains
  the next required evidence task. Validation PASS: names-only env scan,
  repository guardrails, and diff check. Evidence:
  `history/audits/aos-state-env-scan-secret-safety-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-04 Web Navigation Mock Harness
- 2026-05-07 `FULLARCH-FIX-04` repaired broad Web test harness drift after
  the full architecture audit found local `next/navigation` mocks shadowing
  the global Vitest setup without `usePathname`. Local route, redirect, form,
  table, and safety-bar tests that mock `next/navigation` now expose the
  pathname contract required by `I18nProvider`. No production Web, API, DB,
  exchange, deployment, or live-money behavior changed. Validation PASS:
  focused route/form harness pack (`13/13` files, `22/22` tests), full Web
  test suite (`145/145` files, `482/482` tests), Web typecheck, and local mock
  scan. Root `pnpm run test -- --run` now gets past Web but still fails in API
  e2e suites around bot market-group creation/unique `botId` constraints,
  manual LIVE exchange-synced open-order visibility, and stale DB cleanup FK
  residue; this is the next local blocker before root-suite closure. Evidence:
  `history/tasks/fullarch-fix-04-web-navigation-mock-harness-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-03 Reconciliation Diagnostics
- 2026-05-07 `FULLARCH-FIX-03` added structured per-symbol diagnostics to live
  position reconciliation. Each reconciled snapshot row can now report outcome,
  ownership status, management mode, sync state, continuity state, projected
  bot/wallet/strategy ids, bot visibility, and reason. The reconciliation loop
  stores the last run diagnostics and summary on status, while preserving
  `openPositionsSeen` compatibility. No ownership, actionability, exchange,
  schema, Web, or live-money behavior changed. Validation PASS: focused
  diagnostics/import/ownership/takeover pack (`47/47`) and API typecheck.
  Evidence:
  `history/tasks/fullarch-fix-03-reconciliation-diagnostics-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-02 Six-Position Import Regression
- 2026-05-07 `FULLARCH-FIX-02` added the missing DB-backed vertical
  regression for the reported one-of-six import class. The test creates one
  active opted-in LIVE bot with a canonical six-symbol market scope, mocks six
  exchange positions, runs `reconcileExternalPositionsFromExchange` through
  default DB-backed reconciliation deps and the real ownership resolver, then
  proves all six positions are persisted as `BOT_MANAGED`, `IN_SYNC`,
  `CONFIRMED` and all six symbols are returned by selected-bot runtime
  positions readback. Validation PASS: runtime takeover e2e (`5/5`), focused
  import/ownership/takeover pack (`46/46`), API typecheck, repository
  guardrails. Evidence:
  `history/evidence/fullarch-fix-02-six-position-import-readback-regression-task-2026-05-07.md`.

## 2026-05-07 FULLARCH-FIX-01 Recovered Import Visibility
- 2026-05-07 `FULLARCH-FIX-01` restored runtime readback visibility for
  recovered imported LIVE positions. `listBotRuntimeSessionPositions` now
  includes the narrow open-position state
  `origin=EXCHANGE_SYNC + continuityState=RECOVERED_UNACTIONABLE +
  syncState=DRIFT` alongside normal `IN_SYNC` open positions. Actionability
  remains fail-closed because serialization still requires
  `continuityState=CONFIRMED` plus bot and strategy context. Validation PASS:
  focused runtime takeover e2e (`4/4`), focused import/ownership/takeover pack
  (`45/45`), API typecheck, and repository guardrails. Evidence:
  `history/tasks/fullarch-fix-01-recovered-imported-position-visibility-task-2026-05-07.md`.

## 2026-05-07 Full Architecture Conformance Audit
- 2026-05-07 `FULLARCH-AUDIT-2026-05-07` completed a full V1 function-family
  audit against product and architecture truth. The audit mapped auth,
  profile/API keys, wallets/capital, markets/symbol scopes, strategies,
  bot topology, runtime signal/pre-trade, order and position lifecycle,
  live import/takeover, exchange adapters, market stream, backtests, reports,
  logs, dashboard/bot monitoring, i18n/UI states, admin/subscription scope,
  assistant runtime, security/isolation, deployment/workers, and mobile
  scaffold status. Root typecheck and lint passed. Full test command failed
  with two classified issue groups: a confirmed API runtime takeover
  visibility regression for recovered imported LIVE positions, and broad Web
  test harness drift because `I18nProvider` uses `usePathname` while many
  tests mock `next/navigation` without it. Next repair order is
  `FULLARCH-FIX-01` recovered-position visibility, six-position import
  regression, per-symbol diagnostics, Web navigation mock repair, then
  protected production readback. Evidence:
  `history/audits/full-architecture-conformance-audit-task-2026-05-07.md`.

## 2026-05-07 Live Import Runtime Architecture Audit
- 2026-05-07 `LIVEIMPORT-AUDIT-2026-05-07` reviewed exchange-position import
  and bot runtime readback against canonical architecture after an operator
  reported that only one of six exchange positions imports into the bot.
  Analysis found one confirmed contract regression: recovered imported LIVE
  positions with `continuityState=RECOVERED_UNACTIONABLE` and
  `syncState=DRIFT` are currently filtered out of the bot runtime positions
  endpoint even though the architecture requires them to remain visible and
  non-actionable. The most likely root cause for the one-of-six symptom remains
  exact ownership/symbol-scope classification: only symbols that match the
  active bot's canonical `apiKeyId + marketType + symbol` scope can become
  bot-managed. Focused API tests produced `44 passed, 1 failed`, with the
  failure matching the recovered-position visibility mismatch. Next repair
  slice: restore recovered-position visibility without making it actionable,
  add a six-position DB-backed import/readback regression, then add
  per-symbol reconciliation diagnostics. Evidence:
  `history/audits/live-import-runtime-architecture-audit-task-2026-05-07.md`.

## 2026-05-07 Continuation State Sync
- 2026-05-07 `AOS-STATE-2026-05-07` synchronized `.agents/state/*` after a
  short continuation nudge. Canonical planning and task board scans show the
  first open task is `LIVEIMPORT-03`, but the current shell has no production
  admin token, operator login, ops basic auth, or ops header environment
  variables, so authenticated ETH/DOGE production runtime readback cannot be
  completed in this session. Future continuations should resume that read-only
  evidence task when credentials are available; public health/build-info checks
  and local regression packs do not close the remaining production readback
  gap. Evidence:
  `history/evidence/agent-state-production-readback-sync-task-2026-05-07.md`.

## 2026-05-07 Agent Operating System Foundation
- 2026-05-07 `AOS-2026-05-07` established the durable agent operating system
  requested for autonomous continuation. New `.agents/core` files define the
  operating system, 15-step execution loop, anti-regression system, and
  quality gates. New `.agents/state` files capture current focus, known
  issues, regression log, system health, and next steps so future short-nudge
  runs can continue from repository state instead of hidden chat context.
  Agent-readable `docs/flows`, `docs/contracts`, and `docs/testing` indexes
  were added while preserving `docs/architecture/`, `docs/pipelines/`, and
  `docs/engineering/testing.md` as canonical truth. Evidence:
  `history/tasks/agent-operating-system-task-2026-05-07.md`.

## 2026-05-07 V1 Runtime UI Hardening
- 2026-05-07 Dashboard Home open-order status hardening slice `V1UI-41` is
  closed on `main`. BUILDER-mode review found that the Dashboard Home
  open-order table used the shared known-status suffix mapper, but unsupported
  future backend status strings fell through as raw table text. Dashboard Home
  now fails closed to the existing compact unknown display for unsupported
  open-order status values while preserving known route-owned labels and
  adding no new dashboard labels, badges, or status markers. Validation PASS:
  focused Dashboard Home table presenter test (`17/17`), Web typecheck, root
  API+Web typecheck, Web lint, repository guardrails, route-reachable i18n
  audit (`findings=0`), full workspace build, `git diff --check`, and
  authenticated rendered `/dashboard` smoke with no framework overlay or
  post-auth console errors. Browser plugin validation was attempted first but
  local `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
  rendered validation used bundled Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-41-open-order-status-fail-closed-task-2026-05-07.md`.

## 2026-05-03 V1 Prod-Only Release Scope Update
- 2026-05-07 production Redis AOF recovery completed in Coolify. Production
  API `/health` stayed `200`, but `/ready` returned `503` while Redis was in
  `Restarting (unhealthy)` with over 670 restarts. Redis logs showed a bad
  incremental AOF file (`appendonly.aof.5.incr.aof`). Recovery stopped the
  crash-looping Redis container, created a Redis volume backup, ran
  `redis-check-aof --fix`, restarted Redis, and confirmed Redis
  `Running (healthy)`, API `/ready` `200`, API `/health` `200`, and web
  `/auth/login` `200`. Evidence:
  `history/plans/redis-aof-recovery-2026-05-07.md`.
- 2026-05-07 unknown runtime signal label hardening slice `V1UI-40` is closed
  on `main`. TESTER-mode review found that `V1UI-39` had shared runtime signal
  label suffix semantics, but unknown future backend strings were not
  explicitly represented in the resolver input contract or component
  regressions. Shared Dashboard/Bots runtime signal label resolvers now
  tolerate unknown backend strings and fail closed to unresolved suffixes.
  Focused Dashboard Home and Bots Monitoring tests prove unexpected market
  state and context source values render existing unresolved labels instead of
  raw backend strings or invented semantics. No backend, database, exchange
  execution, displayed copy, or styling behavior changed. Validation PASS:
  focused suffix/Dashboard/Bots tests (`10/10`), Web typecheck, Web lint,
  repository guardrails, route-reachable i18n audit (`findings=0`),
  `git diff --check`, full workspace build, and authenticated rendered
  `/dashboard` smoke after dev-server restart with no visible framework
  overlay, console warnings/errors, page errors, or 5xx responses. Browser
  plugin validation was attempted first but local `node_repl` resolved Node
  `v22.13.0` while requiring `>=22.22.0`, so rendered validation used bundled
  Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-40-runtime-signal-label-unknown-values-task-2026-05-07.md`.
- 2026-05-07 shared runtime signal label suffix slice `V1UI-39` is closed on
  `main`. ARCHITECT-mode review found that Dashboard Home and Bots Monitoring
  both render backend runtime signal context source and market state values,
  but kept separate enum-to-label branching that could drift. Web now resolves
  those backend values through shared suffix helpers while Dashboard Home keeps
  `dashboard.home.runtime.*` labels and Bots Monitoring keeps
  `dashboard.bots.monitoring.*` labels. No backend, database, exchange
  execution, displayed copy, or styling behavior changed. Validation PASS:
  focused suffix/Dashboard/Bots tests (`8/8`), route-reachable i18n audit
  (`findings=0`), Web typecheck, Web lint, repository guardrails,
  `git diff --check`, full workspace build, and authenticated rendered
  `/dashboard` smoke after dev-server restart with no visible framework
  overlay, console warnings/errors, page errors, or 5xx responses. Browser
  plugin validation was attempted first but local `node_repl` resolved Node
  `v22.13.0` while requiring `>=22.22.0`, so rendered validation used bundled
  Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-39-shared-runtime-signal-label-suffixes-task-2026-05-07.md`.
- 2026-05-07 Dashboard Home session failure detail slice `V1UI-38` is closed
  on `main`. BUILDER-mode review found that runtime session read models
  already expose `errorMessage` and `stopReason`, but Dashboard Home only
  rendered a generic inactive-session warning. Dashboard Home now renders that
  backend detail inside the existing warning using message-first, stop-reason
  fallback precedence and keeps the warning generic when both fields are
  absent. Validation PASS: focused RuntimeSidebarSection tests (`13/13`),
  route-reachable i18n audit (`findings=0`), Web typecheck, Web lint,
  repository guardrails, `git diff --check`, full workspace build, and
  authenticated rendered `/dashboard` smoke after dev-server restart with no
  visible framework overlay, console warnings/errors, page errors, or 5xx
  responses. Browser plugin validation was attempted first but local
  `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
  rendered validation used bundled Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-38-dashboard-session-failure-detail-task-2026-05-07.md`.
- 2026-05-07 Dashboard Home runtime market state badge slice `V1UI-37` is
  closed on `main`. BUILDER-mode review found that the operator surface
  architecture requires runtime market surfaces to distinguish open-position,
  accepted-signal, evaluated/no-trade, configured-only snapshot, and
  unresolved states. Dashboard Home signal cards now render a compact badge
  from the backend `runtimeMarketState` field using route-owned
  `dashboard.home.runtime.marketState*` labels, while keeping existing context
  source, score, detail, and condition rendering intact. Validation PASS:
  focused RuntimeSignalsSection tests (`5/5`), route-reachable i18n audit
  (`findings=0`), Web typecheck, Web lint, repository guardrails,
  `git diff --check`, full workspace build, and authenticated rendered
  `/dashboard` smoke after dev-server restart with no visible framework
  overlay, console warnings/errors, page errors, or 5xx responses. Browser
  plugin validation was attempted first but local `node_repl` resolved Node
  `v22.13.0` while requiring `>=22.22.0`, so rendered validation used bundled
  Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-37-dashboard-signal-market-state-badge-task-2026-05-07.md`.
- 2026-05-07 German-Swiss exchange order ID i18n parity slice `V1UI-36` is
  closed on `main`. ARCHITECT-mode review found that runtime order surfaces
  already render backend `exchangeOrderId` in Dashboard Home and Bots
  Monitoring, and EN/PL/PT namespaces already had the matching labels, but
  `de-CH` was missing `dashboard.home.runtime.exchangeOrderId` and
  `dashboard.bots.monitoring.table.exchangeOrderId`. The German-Swiss
  namespaces now include both labels as `Exchange-ID`, restoring full
  supported-locale key parity for the exchange order identifier. Validation
  PASS: focused i18n parity tests (`9/9`), route-reachable i18n audit
  (`findings=0`), Web typecheck, Web lint, repository guardrails,
  `git diff --check`, and full workspace build. Evidence:
  `history/audits/v1ui-36-de-ch-exchange-order-id-i18n-parity-task-2026-05-07.md`.
- 2026-05-07 Dashboard Home signal runtime detail slice `V1UI-35` is closed
  on `main`. TESTER-mode review found that API runtime symbol stats and Web
  types already expose `lastSignalMessage` and `lastSignalReason`, and Bots
  Monitoring already renders those fields as runtime detail, but the primary
  Dashboard Home signal cards hid them. Dashboard Home now renders backend
  runtime detail using message-first, reason-second precedence and renders no
  invented fallback when both fields are absent. Validation PASS: focused
  RuntimeSignalsSection tests (`4/4`), route-reachable i18n audit
  (`findings=0`), Web typecheck, Web lint, repository guardrails,
  `git diff --check`, full workspace build, and authenticated rendered
  `/dashboard` smoke after dev-server restart with no visible framework
  overlay, console warnings/errors, page errors, or 5xx responses. Browser
  plugin validation was attempted first but local `node_repl` resolved Node
  `v22.13.0` while requiring `>=22.22.0`, so rendered validation used bundled
  Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-35-dashboard-signal-runtime-detail-task-2026-05-07.md`.
- 2026-05-07 Dashboard Home signal score summary slice `V1UI-34` is closed on
  `main`. BUILDER-mode review found that API runtime symbol stats already
  expose `lastSignalScoreSummary.longScore/shortScore`, and Web types include
  the field, but the primary dashboard signal cards did not render it.
  Dashboard Home now renders the backend LONG/SHORT score summary when present
  and renders no score row when the backend summary is absent, avoiding
  invented fallback scores. Validation PASS: focused RuntimeSignalsSection
  tests (`3/3`), route-reachable i18n audit (`findings=0`), Web typecheck,
  Web lint, repository guardrails, `git diff --check`, full workspace build,
  and authenticated rendered `/dashboard` smoke with reload and account-menu
  interaction with no visible framework overlay, console errors, page errors,
  or 5xx responses. Browser plugin validation was attempted first but local
  `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
  rendered validation used bundled Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-34-dashboard-signal-score-summary-task-2026-05-07.md`.
- 2026-05-07 shared mark-price source suffix slice `V1UI-33` is closed on
  `main`. ARCHITECT-mode review found that V1UI-32 correctly restored
  Dashboard Home route-owned copy, but left the mark-price source kind switch
  duplicated between Dashboard Home and the Bots runtime presenter utility.
  The runtime source-kind suffix mapping now lives in the shared open-position
  derivation utility; Bots still prefixes it through
  `dashboard.bots.monitoring.*`, and Dashboard Home still prefixes it through
  `dashboard.home.runtime.*`. Backend runtime data handling and displayed copy
  are unchanged. Validation PASS: focused Dashboard Home presenter tests
  (`16/16`), focused runtime open-position derivation tests (`4/4`), Web
  typecheck, Web lint, repository guardrails, `git diff --check`, full
  workspace build, and authenticated rendered `/dashboard` smoke with reload
  and CTA interaction with no visible framework overlay, console errors, page
  errors, or 5xx responses. Browser plugin validation was attempted first but
  local `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
  rendered validation used bundled Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-33-shared-mark-price-source-suffix-task-2026-05-07.md`.
- 2026-05-07 dashboard-home route-owned copy closure slice `V1UI-32` is
  closed on `main`. BUILDER-mode review found remaining `/dashboard` runtime
  presentation copy still resolving from `dashboard.bots.*` for placeholder
  badge/hint, strategy labels, and mark-price source labels. Dashboard Home
  now owns those labels under `dashboard.home.runtime.*` in all supported
  locales, while shared Bots mark-price semantics remain unchanged for Bots
  surfaces and backend runtime data mapping is unchanged. Validation PASS:
  focused Dashboard Home presenter/sidebar tests (`25/25`), route-reachable
  i18n audit (`findings=0`), Web typecheck, Web lint, repository guardrails,
  `git diff --check`, full workspace build, and authenticated rendered
  `/dashboard` smoke with no console errors or page errors. Browser plugin
  validation was attempted first but local `node_repl` resolved Node
  `v22.13.0` while requiring `>=22.22.0`, so rendered validation used bundled
  Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-32-dashboard-home-route-owned-copy-closure-task-2026-05-07.md`.
- 2026-05-07 dashboard-home route-owned runtime labels slice `V1UI-31` is
  closed on `main`. BUILDER-mode review found that Dashboard Home
  runtime/history presentation still reused `dashboard.bots.monitoring.*`
  translation keys for closed-position entry/exit columns and the
  advanced-options label even though `/dashboard` owns its route presentation.
  Dashboard Home now resolves those labels from `dashboard.home.runtime.*` in
  all supported locales, keeping backend runtime data mapping unchanged while
  removing cross-route copy coupling. Validation PASS: focused runtime table
  presenter tests (`15/15`), route-reachable i18n audit (`findings=0`), Web
  typecheck, Web lint, repository guardrails, `git diff --check`, full
  workspace build, and authenticated rendered `/dashboard` smoke with no
  console errors or page errors. Browser plugin validation was attempted first
  but local `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`,
  so rendered validation used bundled Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-31-dashboard-home-route-owned-runtime-labels-task-2026-05-07.md`.
- 2026-05-07 auth pre-hydration fail-closed slice `V1UI-30` is closed on
  `main`. TESTER-mode rendered smoke found that a very early auth form submit
  could fall through to native browser behavior before hydration and place
  credentials in the URL query string. Login/Register now render native
  `method=post` forms with disabled fieldsets before hydration, enable controls
  only after the client is ready, and use document navigation after successful
  session confirmation so `/dashboard` starts from a stable authenticated
  document boundary. Success auth toasts were removed from the redirect path;
  error toasts and inline errors remain intact. Validation PASS: focused Web
  auth/navigation tests (`19/19`), Web typecheck, Web lint, route-reachable
  i18n audit (`findings=0`), repository guardrails, `git diff --check`, full
  workspace build, and rendered auth smoke covering SSR `/auth/register` and
  `/auth/login` plus desktop register and mobile login flows to `/dashboard`
  with no credential URL leak and no relevant console/page/5xx errors. Browser
  plugin validation was attempted first but local `node_repl` resolved Node
  `v22.13.0` while requiring `>=22.22.0`, so smoke used bundled Codex Node plus
  Playwright. Evidence:
  `history/tasks/v1ui-30-auth-form-prehydration-fail-closed-task-2026-05-07.md`
  and `history/artifacts/_artifacts-v1ui30-auth-smoke/report.json`.
- 2026-05-07 exchange-backed order cancel fail-closed slice `V1UI-29` is
  closed on `main`. BUILDER-mode review found that the exchange
  capability boundary keeps `LIVE_ORDER_CANCEL` unsupported while Dashboard
  Home still showed a local cancel action for open orders carrying
  `exchangeOrderId`, and direct API cancel could mark those rows locally
  canceled. API order cancel now fails closed with an explicit unsupported
  cancel error for exchange-backed rows, API order close refuses to mark them
  filled locally, and Dashboard Home renders an unsupported-cancel action
  state instead of a cancel button. Focused API orders tests passed (`38/38`)
  and focused Web runtime table presenter tests passed (`15/15`), as did API
  typecheck, Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, full workspace build, and
  authenticated rendered `/dashboard` smoke on desktop and mobile with no
  console errors, page errors, or 5xx responses. Browser plugin validation was
  attempted first but local `node_repl` resolved Node `v22.13.0` while
  requiring `>=22.22.0`, so the smoke used bundled Codex Node plus Playwright.
  Evidence:
  `history/tasks/v1ui-29-exchange-backed-order-cancel-fail-closed-task-2026-05-07.md`.
- 2026-05-07 dashboard manual-order blocked-reason state slice `V1UI-28` is
  closed on `main`. BUILDER-mode review found that `UOLF` required manual
  order `blocked reason` visibility, but failed
  `POST /dashboard/orders/open` submissions only surfaced the backend/API
  reason in a transient toast. Dashboard Home now persists the resolved submit
  error in the manual-order controller, renders it as the blocked action state
  in the runtime sidebar, applies error tone to that state, and clears stale
  blocked truth when the operator edits the next draft. Focused Web tests
  passed (`25/25`), as did Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, full workspace build, and
  authenticated rendered `/dashboard` smoke on desktop and mobile with no
  console warnings, console errors, or page errors. Evidence:
  `history/tasks/v1ui-28-manual-order-blocked-reason-state-task-2026-05-07.md`.
- 2026-05-07 dashboard manual-order exchange-id state slice `V1UI-27` is
  closed on `main`. ARCHITECT-mode review found that
  `POST /dashboard/orders/open` already returns `exchangeOrderId` for LIVE
  exchange-backed orders, but the Web manual-order response type and lifecycle
  panel hid it. Dashboard Home now types the field, shows Exchange ID in the
  action-state block when present, and maps `OPEN + exchange id` to the
  existing imported-open-order lifecycle copy. Focused manual-order/sidebar
  tests passed (`20/20`), as did Web typecheck, Web lint, route-reachable i18n
  audit (`findings=0`), repository guardrails, full workspace build, and
  authenticated rendered `/dashboard` smoke on desktop and mobile with no
  console warnings, console errors, or page errors. Evidence:
  `history/tasks/v1ui-27-manual-order-exchange-id-state-task-2026-05-07.md`.
- 2026-05-07 dashboard open-order exchange-id parity slice `V1UI-26` is
  closed on `main`. BUILDER-mode review found that runtime open-order API
  reads already carry backend `exchangeOrderId` for LIVE and exchange-synced
  rows, but Dashboard Home and Bot Monitoring did not type or render it. Web
  now adds an Exchange ID column to both Open Orders surfaces and renders `-`
  when the backend value is absent. Focused Web regressions passed (`28/28`),
  as did Web typecheck, Web lint, route-reachable i18n audit (`findings=0`),
  repository guardrails, full workspace build, and authenticated rendered
  `/dashboard` smoke on desktop and mobile with no console warnings, console
  errors, or page errors. Evidence:
  `history/audits/v1ui-26-open-order-exchange-id-parity-task-2026-05-07.md`.
- 2026-05-07 dashboard submitted manual-order state slice `V1UI-25` is closed
  on `main`. TESTER-mode review found that `UOLF` listed
  `order submitted` as an operator-facing lifecycle state, but Dashboard Home
  showed only the disabled `Opening...` button while
  `POST /dashboard/orders/open` was in flight. The manual-order panel now
  renders the localized submitted action state during the unresolved request,
  without a synthetic order id, and still replaces it with response-derived
  waiting/fill/position state when the API resolves. Focused
  manual-order/sidebar tests passed (`19/19`), as did Web typecheck, Web lint,
  route-reachable i18n audit (`findings=0`), repository guardrails, full
  workspace build, and authenticated rendered `/dashboard` smoke on desktop and
  mobile with no console warnings, console errors, or page errors. Evidence:
  `history/tasks/v1ui-25-dashboard-manual-order-submitted-state-task-2026-05-07.md`.
- 2026-05-07 dashboard open-position fee parity slice `V1UI-24` is closed on
  `main`. ARCHITECT-mode review found that bot monitoring already
  rendered backend `feesPaid` for open positions while Dashboard Home omitted
  that same money-impacting selected-bot payload field. Dashboard Home Open
  Positions now renders `feesPaid` with the existing runtime fee label and
  amount formatter, keeping open-position fee truth visible on the primary
  dashboard before closure. Focused runtime table presenter test passed
  (`14/14`), as did Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, full workspace build, and
  authenticated rendered `/dashboard` smoke on desktop and mobile with no
  console warnings, console errors, or page errors. Evidence:
  `history/audits/v1ui-24-dashboard-open-position-fee-parity-task-2026-05-07.md`.
- 2026-05-07 dashboard manual-order lifecycle state slice `V1UI-23` is closed
  on `main`. BUILDER-mode review found that `UOLF` requires manual-order
  operator-facing states to reflect lifecycle truth from
  `POST /dashboard/orders/open`, but the Web controller discarded the returned
  order after submit and relied on a success toast only. Dashboard Home now
  types and retains the manual-order response, maps `status` plus optional
  `positionId` into existing localized lifecycle labels, and renders an
  `aria-live` action-state block in the manual-order sidebar. Stale response
  truth clears when the operator edits the next manual-order inputs. Focused
  manual-order, hook, and sidebar tests passed (`22/22`), as did Web
  typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository
  guardrails, full workspace build, and authenticated rendered `/dashboard`
  smoke on desktop and mobile with no console warnings, console errors, or
  page errors. Evidence:
  `history/tasks/v1ui-23-dashboard-manual-order-lifecycle-state-task-2026-05-07.md`.
- 2026-05-07 dashboard signal context source parity slice `V1UI-22` is
  closed on `main`. BUILDER-mode review found that `SOPR` requires
  Dashboard Home signal cards to expose deterministic context-source tags, but
  the primary signal-card UI did not show them while bot monitoring did. The
  shared Web runtime market-state helper also recognized legacy
  `latest_decision` but not current `latest_signal` as evaluated context.
  Dashboard Home signal cards now render localized source badges and
  `latest_signal` classifies as evaluated runtime context. Focused helper and
  signal-card tests passed (`8/8`), broader Dashboard Home and preview parity
  tests passed (`22/22`), as did Web typecheck, Web lint, route-reachable i18n
  audit (`findings=0`), repository guardrails, full workspace build, and
  authenticated rendered `/dashboard` smoke on desktop and mobile with no
  console warnings, console errors, or page errors. Evidence:
  `history/audits/v1ui-22-dashboard-signal-source-parity-task-2026-05-07.md`.
- 2026-05-07 dashboard aggregate wallet strict-capital slice `V1UI-21` is
  closed on `main`. ARCHITECT-mode review found that the shared Web runtime
  capital helper allowed compatibility fields such as `accountBalance` and
  `availableBalance` to participate in all wallet reads, which is valid for
  non-aggregate fallback paths but can mask missing aggregate
  `referenceBalance/freeCash` under `DAWR`. Dashboard Home now uses strict
  aggregate capital helpers for selected `AGGREGATE` snapshots, while keeping
  compatibility capital fallback available for non-aggregate/session fallback
  reads. Focused helper, aggregate wallet, and sidebar tests passed (`13/13`);
  broader Dashboard Home regression passed (`20/20`), as did Web typecheck,
  Web lint, route-reachable i18n audit (`findings=0`), repository guardrails,
  full workspace build, and authenticated rendered `/dashboard` smoke on
  desktop and mobile with no console warnings, console errors, or page errors.
  Evidence:
  `history/tasks/v1ui-21-dashboard-aggregate-wallet-strict-capital-task-2026-05-07.md`.
- 2026-05-07 dashboard closed-position history table slice `V1UI-20` is
  closed on `main`. TESTER-mode review found that `DAGG` promised two
  `/dashboard` history tables, but Web rendered only trade history while
  `positions.historyItems` stayed hidden. Dashboard Home now renders aggregate
  closed positions above trade history, preserving selected-bot scope and
  exposing backend duration, DCA, fees paid, close reason, close initiator, and
  realized PnL. Validation PASS: focused presenter plus aggregate-history
  tests (`16/16`), broader Dashboard Home plus sidebar regressions (`28/28`),
  Web typecheck, Web lint, route-reachable i18n audit (`findings=0`),
  repository guardrails, full workspace build, and authenticated rendered
  `/dashboard` smoke with no console warnings, console errors, or page errors.
  Evidence:
  `history/tasks/v1ui-20-dashboard-closed-history-table-task-2026-05-07.md`.
- 2026-05-07 dashboard closed-position close-reason slice `V1UI-19` is closed
  on `main`. Dashboard home Closed Positions history now renders
  backend `closeReason` with the same shared close-reason label suffix and
  pill semantics used by bot monitoring, while missing values still render
  `-`. Focused shared formatter plus dashboard presenter tests passed
  (`22/22`), dashboard widget plus bot monitoring regressions passed
  (`33/33`), Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, full workspace build, and
  authenticated rendered `/dashboard` smoke passed with no console warnings,
  console errors, or page errors. Evidence:
  `history/tasks/v1ui-19-dashboard-history-close-reason-task-2026-05-07.md`.
- 2026-05-07 dashboard trade-fee parity slice `V1UI-18` is closed on `main`.
  Dashboard home Trade History now renders backend `fee` amount plus
  `feeSource`, `feePending`, and `feeCurrency` metadata via a shared Web
  runtime formatter also used by bot monitoring. This keeps estimated,
  exchange-final, and pending fee truth visible on the primary runtime
  surface. Validation PASS: focused shared formatter plus dashboard presenter
  tests (`20/20`), dashboard widget regression pack (`20/20`), Web typecheck,
  Web lint, route-reachable i18n audit (`findings=0`), repository guardrails,
  full workspace build, and authenticated rendered `/dashboard` smoke with no
  console or page errors. Browser plugin bootstrap was attempted first but
  local `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
  rendered validation used bundled Codex Node plus Playwright. Evidence:
  `history/audits/v1ui-18-dashboard-trade-fee-parity-task-2026-05-07.md`.
- 2026-05-07 dashboard open-position entry/quantity slice `V1UI-17` is
  closed on `main`. Dashboard home Open Positions now renders backend
  `quantity` and `entryPrice` beside existing margin/PnL/mark/DCA/protection
  fields, matching bot monitoring and keeping position size plus entry truth
  visible on the primary runtime surface. Validation PASS: focused Web
  presenter test (`11/11`), dashboard widget regression pack (`20/20`), Web
  typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository
  guardrails, full workspace build, and authenticated rendered `/dashboard`
  smoke with no post-auth console errors. Browser plugin was not exposed by
  tool discovery in this session, so the rendered smoke used bundled Codex
  Node plus Playwright. Evidence:
  `history/tasks/v1ui-17-dashboard-open-position-entry-quantity-task-2026-05-07.md`.
- 2026-05-07 dashboard open-order execution terms slice `V1UI-16` is closed
  on `main`. Dashboard home Open Orders now renders backend `type` and
  `stopPrice` beside existing price/fill fields, matching bot monitoring and
  keeping conditional execution terms visible on the primary runtime surface.
  Validation PASS: focused Web presenter test (`10/10`), dashboard open-order
  regression tests (`3/3`), Web typecheck, Web lint, route-reachable i18n
  audit (`findings=0`), repository guardrails, full workspace build, and
  authenticated rendered `/dashboard` smoke with no post-auth console errors.
  Browser plugin was not exposed by tool discovery in this session, so the
  rendered smoke used bundled Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-16-dashboard-open-order-execution-terms-task-2026-05-07.md`.
- 2026-05-07 dashboard open-order filled quantity slice `V1UI-15` is closed
  on `main`. Dashboard home Open Orders now renders backend `filledQuantity`
  beside total `quantity`, matching bot monitoring and keeping partial-fill
  progress visible on the primary runtime surface. Validation PASS: focused
  Web presenter test (`10/10`), dashboard open-order regression tests
  (`3/3`), Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, full workspace build, and
  authenticated rendered `/dashboard` smoke with no post-auth console errors.
  Browser plugin was not exposed by tool discovery in this session, so the
  rendered smoke used bundled Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-15-dashboard-open-order-fill-quantity-task-2026-05-07.md`.
- 2026-05-07 runtime open-order status label slice `V1UI-14` is closed on
  `main`. Dashboard home and bot monitoring now share
  `runtimeOpenOrderStatusLabelSuffix`, while bot monitoring renders route-owned
  lifecycle labels for backend open-order statuses such as `OPEN`/`PENDING`
  as waiting for fill. Unknown statuses remain raw and visible. Validation
  PASS: focused Web runtime formatter/dashboard/bot monitoring tests
  (`29/29`), Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, Web build, and authenticated rendered
  `/dashboard/bots` route smoke with no console errors. Browser plugin was not
  callable in this session, so the smoke used bundled Codex Node plus
  Playwright. Evidence:
  `history/tasks/v1ui-14-runtime-open-order-status-label-task-2026-05-07.md`.
- 2026-05-07 bot monitoring open-order source label slice `V1UI-13` is closed
  on `main`. Bot monitoring now renders backend open-order `origin` truth as
  route-owned `Origin` labels, and dashboard home shares the same runtime
  order-source label suffix helper so `USER`/`MANUAL`, `BOT`, and
  imported/unknown origins cannot drift across runtime order surfaces.
  Validation PASS: focused Web runtime formatter/dashboard/bot monitoring
  tests (`28/28`), Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, Web build, and authenticated rendered
  `/dashboard/bots` route smoke with no console errors. Browser plugin tool
  discovery returned no callable browser tool in this session, so the smoke
  used bundled Codex Node plus Playwright. Evidence:
  `history/tasks/v1ui-13-bot-open-orders-source-label-task-2026-05-07.md`.
- 2026-05-07 runtime continuity label helper slice `V1UI-12` is closed on
  `main`. Dashboard home and bot monitoring now derive backend
  `continuityState` label semantics from shared
  `runtimeContinuityLabelSuffix`, preserving route-owned i18n namespaces while
  preventing diagnostic drift between primary and detailed runtime surfaces.
  Validation PASS: focused Web runtime formatter/dashboard/bot monitoring
  tests (`27/27`), Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, Web build, and authenticated rendered
  `/dashboard/bots` smoke with no console errors. Browser plugin validation was
  blocked by local `node_repl` resolving Node `v22.13.0` while requiring
  `>= v22.22.0`, so the smoke used bundled Codex Node plus Playwright.
  Evidence:
  `history/tasks/v1ui-12-runtime-continuity-label-helper-task-2026-05-07.md`.
- 2026-05-07 dashboard position modal provenance slice `V1UI-11` is closed on
  `main`. The `/dashboard` position edit modal now repeats noteworthy backend
  provenance from `origin`, `syncState`, and `takeoverStatus`, so
  exchange-adopted/imported context is visible at the action/edit decision
  point as well as in the open-position table. Web also now reuses one shared
  provenance label suffix helper across dashboard and bot monitoring
  presenters. Validation PASS: focused Web runtime/dashboard/bot monitoring
  tests (`46/46`), Web typecheck, Web lint, route-reachable i18n audit
  (`findings=0`), repository guardrails, Web build, and authenticated rendered
  `/dashboard` smoke with no console errors. Browser plugin validation was
  blocked by local `node_repl` resolving Node `v22.13.0` while requiring
  `>= v22.22.0`, so the smoke used bundled Codex Node plus Playwright.
  Evidence:
  `history/tasks/v1ui-11-dashboard-position-modal-provenance-task-2026-05-07.md`.
- 2026-05-07 runtime position provenance label slice `V1UI-10` is closed on
  `main`. Web now maps backend `origin`, `syncState`, and `takeoverStatus`
  fields into explicit open-position provenance labels in both `/dashboard`
  and `/dashboard/bots`, so imported/adopted exchange-sync rows, drift, and
  orphan states no longer look like ordinary bot-managed runtime rows.
  Validation PASS: focused Web runtime/dashboard/bot monitoring tests
  (`25/25`), Web typecheck, route-reachable i18n audit (`findings=0`), Web
  lint, repository guardrails, Web build, and authenticated rendered
  `/dashboard` plus `/dashboard/bots` smoke with no console errors. Browser
  plugin validation was blocked by local `node_repl` resolving Node `v22.13.0`
  while requiring `>= v22.22.0`, so the smoke used bundled Codex Node plus
  Playwright. Evidence:
  `history/tasks/v1ui-10-runtime-position-provenance-label-task-2026-05-07.md`.
- 2026-05-07 runtime TTP source parity slice `V1UI-09` is closed locally on
  branch `codex/v1-app-function-check`. API runtime position reads now expose
  additive `dynamicTtpStopLossSource` metadata (`runtime_state` or
  `strategy_fallback`), and Web maps strategy fallback to a prospective
  protection label in both `/dashboard` and `/dashboard/bots` monitoring.
  Validation PASS: focused API serialization tests (`8/8`), focused Web
  runtime/dashboard/bot monitoring tests (`32/32`), API typecheck, Web
  typecheck, route-reachable i18n audit (`findings=0`), Web lint, repository
  guardrails, Web build, and authenticated rendered `/dashboard/bots` smoke
  with no console errors. Browser plugin validation was blocked by local
  `node_repl` resolving Node `v22.13.0` while requiring `>= v22.22.0`, so the
  smoke used bundled Codex Node plus Playwright. Evidence:
  `history/audits/v1ui-09-runtime-ttp-source-parity-task-2026-05-07.md`.
- 2026-05-07 dashboard prospective protection Web parity slice `V1UI-08` is
  closed locally on branch `codex/v1-app-function-check`. `/dashboard`
  open-position TTP cells now label config-derived fallback protection as
  prospective while keeping backend dynamic TTP as the primary unlabeled
  runtime stop truth. Validation PASS: focused dashboard runtime derivation and
  table presenter tests (`13/13`), Web typecheck, route-reachable i18n audit
  (`findings=0`), Web lint, repository guardrails, Web build, diff check, and
  authenticated rendered `/dashboard` smoke with no console errors. Browser
  plugin validation was blocked by local `node_repl` resolving Node `v22.13.0`
  while requiring `>= v22.22.0`, so the smoke used bundled Codex Node plus
  Playwright. Evidence:
  `history/tasks/v1ui-08-dashboard-prospective-protection-label-task-2026-05-07.md`.
- 2026-05-07 dashboard home actionability status Web parity slice `V1UI-07`
  is closed locally on branch `codex/v1-app-function-check`. `/dashboard`
  open-position status cells now render backend `actionable=false` and
  `strategyAutomationContextResolved=false` detail labels below the existing
  continuity badge, keeping the primary operator surface aligned with bot
  monitoring fail-closed diagnostics. Validation PASS: focused dashboard
  presenter test (`6/6`), dashboard integration test (`20/20`), Web
  typecheck, Web lint, Web build, route-reachable i18n audit (`findings=0`),
  repository guardrails, diff check, and authenticated rendered `/dashboard`
  smoke with no console errors. Browser plugin validation was blocked by local
  `node_repl` resolving Node `v22.13.0` while requiring `>= v22.22.0`, so the
  smoke used bundled Codex Node plus Playwright. Evidence:
  `history/audits/v1ui-07-dashboard-home-actionability-status-parity-task-2026-05-07.md`.
- 2026-05-07 bot monitoring continuity/actionability Web parity slice
  `V1UI-06` is closed locally on branch `codex/v1-app-function-check`.
  `/dashboard/bots` monitoring open-position rows now render backend
  `continuityState`, `actionable`, and
  `strategyAutomationContextResolved` truth, so recovered non-actionable and
  unresolved strategy-context rows are explicit instead of looking normal.
  Validation PASS: focused `BotsManagement.test.tsx` (`13/13`), Web
  typecheck, Web lint, Web build, route-reachable i18n audit (`findings=0`),
  repository guardrails, diff check, and authenticated rendered smoke for
  `/dashboard/bots` with no console errors. Browser plugin validation was
  blocked by local `node_repl` resolving Node `v22.13.0` while requiring
  `>= v22.22.0`, so the smoke used bundled Codex Node plus Playwright.
  Evidence:
  `history/audits/v1ui-06-bot-monitoring-continuity-state-web-parity-task-2026-05-07.md`.
- 2026-05-07 bot monitoring close-attribution Web parity slice `V1UI-05` is
  closed locally on branch `codex/v1-app-function-check`. `/dashboard/bots`
  monitoring history now renders backend `closeReason` and `closeInitiator`
  truth for closed positions and close trades, using bot-route i18n keys and
  shared runtime attribution tone helpers. Validation PASS: focused
  `BotsManagement.test.tsx` (`13/13`), Web typecheck, Web lint, Web build,
  route-reachable i18n audit (`findings=0`), repository guardrails, and diff
  check. Evidence:
  `history/audits/v1ui-05-bot-monitoring-close-attribution-web-parity-task-2026-05-07.md`.
- 2026-05-07 runtime mark-price source Web parity slice `V1UI-04` is closed
  locally on branch `codex/v1-app-function-check`. Web now carries
  `liveMarkPriceSource` through the shared open-position derivation and renders
  compact source labels beside mark prices in both `/dashboard` open positions
  and `/dashboard/bots` monitoring, preserving stream-first mark-price
  enrichment while exposing backend `markPriceSource` truth when API mark price
  is used. Validation PASS: focused Web runtime tests (`26/26`), Web
  typecheck, API typecheck, Web lint, production Web build, route-reachable
  i18n audit (`findings=0`), guardrails, and diff check. Local Postgres was
  healthy and the pending migration
  `20260503013000_enforce_single_active_bot_market_group` was applied; API
  rendered smoke is blocked by local `.env` missing
  `API_KEY_ENCRYPTION_KEYS`. Evidence:
  `history/audits/v1ui-04-runtime-mark-price-source-web-parity-task-2026-05-07.md`.
- 2026-05-07 public access header/i18n route slice `V1UI-03` is closed locally
  on branch `codex/v1-app-function-check`. Public header auth CTAs now render
  only after auth loading resolves with no user, preventing logged-out
  login/register CTAs from flashing while session truth is unknown. Route
  translations now use the current Next pathname during render, eliminating
  public-to-auth client navigation i18n missing-key warnings seen when clicking
  Login from `/`. Validation PASS: focused header/i18n tests (`7/7`), Web
  typecheck, lint, production build, local desktop/mobile rendered smoke,
  route-reachable i18n audit (`findings=0`), guardrails, and diff check.
  Evidence:
  `history/tasks/v1ui-03-public-access-header-route-contract-task-2026-05-07.md`.
- 2026-05-07 auth register UI/i18n slice `V1UI-02` is closed locally on branch
  `codex/v1-app-function-check`. Registration failures now persist inline in
  the form with `role="alert"` while preserving existing toast feedback and
  auth behavior. `I18nProvider` now seeds route-scoped dictionaries from
  Next's `usePathname`, removing first-render auth namespace warning noise seen
  in rendered `/auth/register` smoke. Validation PASS: focused i18n/register
  tests (`13/13`), Web typecheck, local desktop/mobile rendered smoke,
  route-reachable i18n audit (`findings=0`), guardrails, and diff check.
  Evidence:
  `history/tasks/v1ui-02-auth-register-error-i18n-task-2026-05-07.md`.
- 2026-05-07 auth login UI accessibility slice `V1UI-01` is closed locally on
  branch `codex/v1-app-function-check`. Rendered public/protected route smoke
  confirmed unauthenticated `/dashboard` redirects to `/auth/login`, and the
  login fail state now announces the inline server error with `role="alert"`
  while preserving the existing visual alert styling and auth behavior. Browser
  plugin validation was blocked by an old Node REPL runtime, so the rendered
  smoke used bundled Codex Node `v24.14.0` plus bundled Playwright without
  changing project dependencies. Validation PASS: focused LoginForm tests
  (`4/4`), Web typecheck, local desktop/mobile rendered smoke, guardrails, and
  diff check. Evidence:
  `history/tasks/v1ui-01-auth-login-error-alert-task-2026-05-07.md`.
- 2026-05-07 release-gate plan summary fix `V1GATE-04` is closed locally on
  branch `codex/v1-app-function-check`. `scripts/runV1ReleaseGate.mjs` now
  reports `goLiveSmoke: skipped` whenever `--skip-local-quality` is used,
  matching the actual step plan because go-live smoke is nested under local
  quality execution. Added focused regression coverage. Production dry-run
  artifacts were regenerated with readiness `not_ready`; current blockers
  remain stale activation, RC, restore, and rollback evidence plus the broader
  stage/protected/manual/live-money gates. Validation PASS: release-gate tests
  (`8/8`). Evidence:
  `history/releases/v1gate-04-release-gate-plan-summary-task-2026-05-07.md`.
- 2026-05-07 deploy freshness ledger sync `V1GATE-03` is closed locally on
  branch `codex/v1-app-function-check`. Re-read production public
  `/api/build-info` and confirmed `gitSha=6a7c9889d24a55c870b32aa10cb284ede6db1c59`,
  `gitRef=main`, matching `origin/main`. `OPS-DEPLOY-001` in the V1 function
  coverage matrix now references the current `V1GATE-02` public target refresh
  instead of the older 2026-05-01 SHA. This does not close restore, stage,
  GO/NO-GO, protected/manual, or live-money evidence blockers. Evidence:
  `history/audits/v1gate-03-deploy-ledger-refresh-task-2026-05-07.md`.
- 2026-05-07 V1 manual evidence route sync `V1MANUAL-01` is closed locally on
  branch `codex/v1-app-function-check`. The V1 orders/positions evidence rows
  now distinguish authenticated API `/dashboard/orders*` and
  `/dashboard/positions*` read-only proof from web legacy redirect proof,
  matching the canonical dashboard route map. Added a focused web middleware
  regression for `/dashboard/orders -> /dashboard/bots/runtime?legacy=orders`,
  `/dashboard/positions -> /dashboard/bots/runtime?legacy=positions`, and
  unauthenticated fail-closed redirect to `/auth/login`. Validation PASS:
  focused middleware test (`3/3`). Evidence:
  `history/evidence/v1manual-web-legacy-route-evidence-sync-task-2026-05-07.md`.
- 2026-05-07 paper-safe close evidence slice `V1MONEY-02` is closed locally on
  branch `codex/v1-app-function-check`. Focused API close validation passed
  (`45/45`) across runtime position automation, lifecycle close parity, paper
  lifecycle, and dynamic stop operator truth. Evidence now maps TP, SL, TTP,
  TSL, DCA-first, and DCA-exhausted rows to covered local behavior and remaining
  production/paper-sample proof. No live-money mutations were run. Evidence:
  `history/evidence/v1money-paper-safe-close-evidence-task-2026-05-07.md`.
- 2026-05-07 futures market-data source field slice `MARKETDATA-FUT-01` is
  closed locally on branch `codex/v1-app-function-check`. Runtime position
  rows now include additive `markPriceSource` metadata beside `markPrice`, with
  source labels for runtime symbol stats, runtime ticker, fallback ticker,
  exchange-unrealized-PnL derived price, runtime candidate, and unavailable
  states. Existing numeric price helper remains compatible. Validation PASS:
  focused runtime lifecycle/position PnL tests (`8/8`), API typecheck, Web
  typecheck, guardrails, and diff check. Evidence:
  `history/tasks/marketdata-fut-runtime-mark-price-source-task-2026-05-07.md`.
- 2026-05-07 V1 money-engine scenario matrix `V1MONEY-01` is closed locally on
  branch `codex/v1-app-function-check`. A TESTER-mode local/paper-safe matrix
  now routes `V1MONEY-A` rows through local, paper-safe, read-only production,
  or explicit operator/live-money evidence paths. Focused API money-engine
  validation passed (`49/49`) across order types, pre-trade allow/block/audit,
  position/order lifetime, strategy lifetime policy, lifecycle mark-price, and
  close parity. This does not close production-only TP/SL/TSL/live-close rows;
  it defines the next safe evidence path. Evidence:
  `history/audits/v1money-local-paper-safe-matrix-task-2026-05-07.md`.
- 2026-05-07 stale imported-position release candidate triage `LIVEIMPORT-03A`
  is closed locally on branch `codex/v1-app-function-check`. The old
  `LIVEIMPORT-03` promotion candidate `39146d2e` is not an ancestor of deployed
  production `6a7c9889` and is not patch-equivalent to deployed `main`, while a
  focused current-main imported-position/runtime strategy regression pack passed
  (`51/51`). `LIVEIMPORT-03` remains open only for authenticated ETH/DOGE
  production readback on current `main`; do not promote stale `39146d2e`.
  BOTMULTI stale build-info blocker text was also refreshed because production
  now contains `f3aaa3d`. Evidence:
  `history/tasks/liveimport-03-current-main-candidate-triage-task-2026-05-07.md`.
- 2026-05-07 public target refresh `V1GATE-02` is closed locally on branch
  `codex/v1-app-function-check`. Production public API/Web smoke is healthy and
  build-info reports `gitSha=6a7c9889d24a55c870b32aa10cb284ede6db1c59`,
  matching `origin/main`. Unauthenticated `/dashboard` redirects fail-closed to
  `/auth/login`, and the post-deploy smoke checklist now names `/auth/login` as
  the canonical login page. Stage remains blocked (`503` on
  `stage-api.soar.luckysparrow.ch` and `stage.soar.luckysparrow.ch`; DNS miss on
  `stage-soar.luckysparrow.ch`). V1 is still not GO because restore drill,
  stage restoration or waiver, sign-off, protected/manual matrix, and
  live-money proof rows remain open. Evidence:
  `history/tasks/v1gate-02-public-target-refresh-task-2026-05-07.md`.
- 2026-05-06 local main app-function sweep `APPCHECK-01` is closed locally on
  branch `codex/v1-app-function-check` after `codex/v1-pmplc-hardening` was
  fast-forward merged into `main` and pushed at `6a7c9889`. Validation PASS:
  repository guardrails, API typecheck, Web typecheck, lint, focused
  runtime/order API pack (`90/90`), focused dashboard/strategy Web pack
  (`32/32`), and full workspace build. No executable local regression was
  isolated in this sweep. Evidence:
  `history/tasks/app-function-check-main-sweep-task-2026-05-06.md`.
- 2026-05-06 imported closed-position aggregate PnL slice `PMPLC-45` is closed
  locally. Runtime aggregate positions now include imported `ORPHAN_LOCAL` /
  `EXTERNAL_CLOSE_CONFIRMED` closed positions in closed-position realized PnL,
  while stale open orphans remain excluded. Runtime history also keeps
  carry-over bot-managed `OPEN` trades and legacy wallet-scoped imported DCA
  continuity visible without broadening the primary aggregate ownership filter.
  Validation PASS: pre-fix aggregate regression failed as expected
  (`realizedPnl=0` received vs `37.5` expected), focused aggregate regression,
  focused external-close history regression, runtime/portfolio pack (`51/51`),
  helper unit suite (`16/16`), API typecheck, repository guardrails, and lint.
  Evidence:
  `history/tasks/runtime-aggregate-imported-closed-position-pnl-task-2026-05-06.md`.
- 2026-05-06 PMPLC queue sync slice `PMPLC-46` is closed locally. Canonical
  PMPLC planning truth no longer lists `PMPLC-45` as a queued follow-up after
  it was implemented and pushed. Runtime/order discovery pack remained green
  (`64/64` plus exchange-event pack `46/46`) before the docs-only sync, so no
  new executable money-runtime regression was isolated in this iteration.
  Evidence:
  `history/tasks/pmplc-queue-sync-task-2026-05-06.md`.
- 2026-05-06 portfolio history pending-fee completeness slice `PMPLC-44` is
  closed locally. Portfolio history now marks LIVE history as `PARTIAL` with
  `FEE_RECONCILIATION_PENDING` when any scoped trade in the history window has
  `feePending=true`, so provisional fee-adjusted PnL is not presented as fully
  complete. Validation PASS: pre-fix e2e regression failed as expected
  (`completeness=COMPLETE` received vs `PARTIAL` expected), focused
  regression, portfolio-history e2e (`4/4`), API typecheck, repository
  guardrails, and lint. Evidence:
  `history/tasks/portfolio-history-pending-fee-completeness-task-2026-05-06.md`.
- 2026-05-06 incomplete partial fee backfill pending slice `PMPLC-43` is
  closed locally. Exchange-event fee finality now refuses to treat a filled
  order's existing exchange fee as settled while another known `OrderFill`
  still has missing fee truth, and lifecycle trade fee backfill now preserves
  the computed pending decision instead of unconditionally clearing pending.
  Validation PASS: pre-fix DB-backed regression failed as expected
  (`Order.feePending=false` received vs `true` expected), focused regression,
  helper suite (`24/24`), DB-backed exchange-event suite (`21/21`), dedicated
  fee-backfill suite (`1/1`), focused runtime/order suites (`105/105`), API
  typecheck, repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-partial-backfill-still-pending-task-2026-05-06.md`.
- 2026-05-06 close PnL fee backfill slice `PMPLC-42` is closed locally.
  Exchange-event fee backfill now refreshes close lifecycle `Trade.realizedPnl`
  and linked `Position.realizedPnl` after a delayed missing partial close fee
  settles aggregate exchange fee truth, preventing closed-position PnL from
  remaining overstated after fee reconciliation. Validation PASS: pre-fix
  DB-backed regression failed as expected (`8.8` close PnL received vs `8.7`
  expected), focused regression, helper suite (`24/24`), DB-backed
  exchange-event suite (`21/21`), focused runtime/order suites (`104/104`),
  API typecheck, repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-close-pnl-fee-backfill-task-2026-05-06.md`.
- 2026-05-06 missing partial exchange fee backfill slice `PMPLC-41` is closed
  locally. Fee backfill propagation now updates unresolved lifecycle trades by
  `orderId` when the aggregate exchange fee becomes complete, so order,
  `OrderFill`, and lifecycle `Trade` fee truth settle together after a delayed
  partial-fill fee arrives. Validation PASS: pre-fix DB-backed regression
  failed as expected (`0.02` lifecycle fee received vs `0.03` expected),
  helper suite (`24/24`), DB-backed exchange-event suite (`20/20`), focused
  runtime/order suites (`103/103`), API typecheck, repository guardrails, lint,
  and diff check. Evidence:
  `history/tasks/position-management-exchange-missing-partial-fee-backfill-task-2026-05-06.md`.
- 2026-05-06 missing partial exchange fee pending slice `PMPLC-40` is closed
  locally. Exchange-event reconciliation now refuses to clear pending from a
  terminal current-fill exact fee while any earlier `OrderFill` for the order
  still has missing fee truth, preserving final fee-total visibility without
  downgrading the current exact fee. Validation PASS: pre-fix DB-backed
  regression failed as expected (`feePending=false` received vs `true`
  expected), helper suite (`24/24`), DB-backed exchange-event suite (`19/19`),
  focused runtime/order suites (`102/102`), API typecheck, repository
  guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-missing-partial-fee-pending-task-2026-05-06.md`.
- 2026-05-06 final exchange fee pending slice `PMPLC-39` is closed locally.
  Exchange-event reconciliation now treats an existing exact exchange fee as
  final settled truth only when the order was already terminal `FILLED` before
  the incoming event, so a terminal fill without fee after a partial exact fee
  cannot falsely clear reconciliation pending. Validation PASS: pre-fix
  DB-backed regression failed as expected (`feePending=false` received vs
  `true` expected), helper suite (`24/24`), DB-backed exchange-event suite
  (`18/18`), focused runtime/order suites (`101/101`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-final-fee-pending-task-2026-05-06.md`.
- 2026-05-06 partial exchange fee pending slice `PMPLC-38` is closed locally.
  Exchange fee-pending decisions now require terminal `FILLED` status before
  accepted or settled exact exchange fee truth clears final reconciliation
  pending, so non-terminal partial fills can persist exact current-fill fee
  truth without falsely appearing final. Validation PASS: pre-fix helper and
  DB-backed regressions failed as expected (`feePending=false` received vs
  `true` expected), helper suite (`24/24`), DB-backed exchange-event suite
  (`17/17`), focused runtime/order suites (`100/100`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-partial-fee-pending-task-2026-05-06.md`.
- 2026-05-06 settled exchange fee pending recovery slice `PMPLC-37` is closed
  locally. Exchange fee-pending decisions now give already-settled exact
  `EXCHANGE_FILL` fee truth precedence over local `feePending=true` drift, so
  exact fee availability reliably clears pending reconciliation state.
  Validation PASS: pre-fix helper regression failed as expected
  (`feePending=true` received vs `false` expected), DB-backed exchange-event
  suite (`16/16`), focused runtime/order suites (`98/98`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-settled-fee-pending-recovery-task-2026-05-06.md`.
- 2026-05-06 exchange fee pending helper slice `PMPLC-36` is closed locally.
  Exchange fee-pending decisions now live in the pure
  `orders.exchangeEvents.helpers` boundary with no-DB coverage for accepted
  exact fee, rejected raw event fee, existing pending preservation, and
  already-settled exact fee cases, while DB-backed PMPLC-34/35 behavior remains
  unchanged. Validation PASS: helper suite (`22/22`), DB-backed exchange-event
  suite (`15/15`), focused runtime/order suites (`96/96`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-fee-pending-helper-task-2026-05-06.md`.
- 2026-05-06 stale rejected exchange fee pending recovery slice `PMPLC-35` is
  closed locally. Exchange order-trade event handling now bases pending
  recovery on accepted fee truth rather than raw event fee and restores
  `feePending=true` on unresolved estimated lifecycle trades for the order, so
  rejected stale unknown `exchangeTradeId` fees cannot hide reconciliation
  drift. Validation PASS: pre-fix DB-backed regression failed as expected
  (`feePending=false` received vs `true` expected), DB-backed exchange-event
  suite (`15/15`), focused runtime/order suites (`92/92`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-stale-fee-pending-recovery-task-2026-05-06.md`.
- 2026-05-06 stale unknown exchange fee pending guard slice `PMPLC-34` is
  closed locally. Exchange order-trade event handling now clears
  `feePending` from finite event fee only when that fee is actually accepted by
  the fee refresh/backfill decision, so a rejected stale unknown
  `exchangeTradeId` cannot hide unresolved LIVE fee reconciliation. Validation
  PASS: pre-fix DB-backed regression failed as expected (`feePending=false`
  received vs `true` expected), DB-backed exchange-event suite (`14/14`),
  focused runtime/order suites (`91/91`), API typecheck, repository
  guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-stale-fee-pending-guard-task-2026-05-06.md`.
- 2026-05-06 exchange fee refresh helper slice `PMPLC-33` is closed locally.
  Exchange fee refresh/backfill decisions now live in the pure
  `orders.exchangeEvents.helpers` boundary with no-DB coverage for normal
  refresh, known-fill missing-fee backfill, stale unknown-fill blocking, and
  already-settled fill fee cases, while DB-backed PMPLC-31/32 behavior remains
  unchanged. Validation PASS: helper suite (`18/18`), DB-backed exchange-event
  suite (`13/13`), focused runtime/order suites (`90/90`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-fee-refresh-helper-task-2026-05-06.md`.
- 2026-05-06 stale terminal exchange fee guard slice `PMPLC-32` is closed
  locally. Exchange order-trade event handling now keeps fee-only refreshes
  limited to known `OrderFill` rows with missing fee truth, so a stale
  terminal event with an unknown `exchangeTradeId`, no local fill progress, and
  finite fee cannot inflate settled `Order.fee`. Validation PASS: pre-fix
  DB-backed regression failed as expected (`0.13` received vs `0.04`
  expected), DB-backed exchange-event suite (`13/13`), focused runtime/order
  suites (`86/86`), API typecheck, repository guardrails, lint, and diff
  check. Evidence:
  `history/tasks/position-management-exchange-stale-fee-event-guard-task-2026-05-06.md`.
- 2026-05-06 exchange fill fee backfill slice `PMPLC-31` is closed locally.
  Exchange order-trade event handling now treats a later finite exchange fee
  for an already recorded `exchangeTradeId` as a monotonic fee-truth upgrade,
  backfilling `Order.fee`, `OrderFill.feeCost`, and unresolved lifecycle
  `Trade.fee` without duplicating fill/trade rows or reapplying terminal
  lifecycle. Validation PASS: focused DB-backed regression, DB-backed
  exchange-event suite (`12/12`), focused runtime/order suites (`85/85`), API
  typecheck, repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-fill-fee-backfill-task-2026-05-06.md`.
- 2026-05-06 exchange fill fee aggregation slice `PMPLC-30` is closed
  locally. Exchange order-trade event handling now aggregates accepted
  per-fill `OrderFill.feeCost` values across partial and final fills, adding
  the current event fee only when its `exchangeTradeId` is not already
  recorded, so `Order.fee` and lifecycle `Trade.fee` represent total exchange
  fee truth instead of the latest fill fee. Validation PASS: pre-fix DB-backed
  regression failed as expected (`0.02` received vs `0.03` expected),
  DB-backed exchange-event suite (`11/11`), focused runtime/order suites
  (`84/84`), API typecheck, repository guardrails, lint, and diff check.
  Evidence:
  `history/tasks/position-management-exchange-fill-fee-aggregation-task-2026-05-06.md`.
- 2026-05-06 exchange fee pending recovery slice `PMPLC-29` is closed
  locally. Exchange order-trade event handling now restores `feePending=true`
  for filled LIVE orders and generated lifecycle trades when fee truth remains
  unresolved (`feeSource=ESTIMATED`, no finite fee, and no finite event fee),
  even if the local row previously drifted to `feePending=false`. Validation
  PASS: pre-fix DB-backed regression failed as expected, DB-backed
  exchange-event suite (`10/10`), focused runtime/order suites (`83/83`), API
  typecheck, repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-fee-pending-recovery-task-2026-05-06.md`.
- 2026-05-06 exchange fee pending truth slice `PMPLC-28` is closed locally.
  Exchange order-trade event handling now keeps `feePending=true` on filled
  LIVE orders and generated lifecycle trades when the exchange event confirms
  fill quantity but provides no finite fee truth, preserving operator-visible
  reconciliation state instead of hiding missing fees as settled. Validation
  PASS: pre-fix DB-backed regression failed as expected, DB-backed
  exchange-event suite (`10/10`), focused runtime/order suites (`83/83`), API
  typecheck, repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-fee-pending-truth-task-2026-05-06.md`.
- 2026-05-06 exchange recordable fill details slice `PMPLC-27` is closed
  locally. Exchange order-trade event handling now resolves recordable fill
  quantity and proportional fee through one private decision helper, keeping
  order-fill quantity and fee parity centralized without behavior changes.
  Validation PASS: local Postgres availability check, DB-backed exchange-event
  suite (`9/9`), focused runtime/order suites (`82/82`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-recordable-fill-details-task-2026-05-06.md`.
- 2026-05-06 exchange fill fee cap slice `PMPLC-26` is closed locally.
  Exchange order-trade event handling now scales finite event fee by accepted
  local last-fill quantity when exchange `lastFilledQuantity` is capped, so
  order, order-fill, and trade fee truth stays proportional to accepted local
  quantity under over-reported fills. Validation PASS: DB-backed
  exchange-event suite (`9/9`), focused runtime/order suites (`82/82`), API
  typecheck, repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-fill-fee-cap-task-2026-05-06.md`.
- 2026-05-06 exchange order-fill row quantity cap slice `PMPLC-25` is closed
  locally. Exchange order-trade event handling now records `OrderFill.quantity`
  from accepted local fill progress instead of raw exchange `lastFilledQuantity`,
  so over-reported last-fill events cannot inflate child fill rows above the
  locally capped order, trade, or position quantity. Validation PASS:
  DB-backed exchange-event suite (`9/9`), focused runtime/order suites
  (`82/82`), API typecheck, repository guardrails, lint, and diff check.
  Evidence:
  `history/tasks/position-management-exchange-orderfill-quantity-cap-task-2026-05-06.md`.
- 2026-05-06 exchange fill quantity normalizer slice `PMPLC-24` is closed
  locally. Exchange fill progress now uses one private quantity normalizer for
  both existing local fill progress and incoming exchange cumulative fill
  quantity, keeping local order-quantity caps centralized without behavior
  changes. Validation PASS: helper plus DB-backed exchange-event suite
  (`22/22`), focused runtime/order suites (`81/81`), API typecheck, repository
  guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-fill-quantity-normalizer-task-2026-05-06.md`.
- 2026-05-06 exchange existing fill cap slice `PMPLC-23` is closed locally.
  Exchange fill progress now caps both incoming cumulative fill quantity and
  previously persisted local filled quantity to the local order quantity when
  requested quantity truth is available, preventing inherited over-reported
  fill progress from inflating lifecycle truth. Validation PASS: no-DB helper
  regression (`14/14`), DB-backed exchange-event suite (`8/8`), focused
  runtime/order suites (`81/81`), API typecheck, repository guardrails, lint,
  and diff check. Evidence:
  `history/tasks/position-management-exchange-existing-fill-cap-task-2026-05-06.md`.
- 2026-05-06 exchange-event known underfill guard slice `PMPLC-22` is closed
  locally. Exchange order-trade event reconciliation now passes local requested
  order quantity into the fill-progress helper, caps over-reported cumulative
  fill quantity to local order truth, and keeps known below-request `FILLED`
  events as `PARTIALLY_FILLED` without applying filled lifecycle. Validation
  PASS: no-DB helper regression (`13/13`), focused runtime/order suites
  (`72/72`), API typecheck, repository guardrails, lint, and diff check.
  Evidence:
  `history/tasks/position-management-exchange-event-underfilled-entry-task-2026-05-06.md`.
- 2026-05-06 exchange persisted status helper refactor slice `PMPLC-21` is
  closed locally. Exchange fill progress now resolves persisted order status
  through an explicit pure decision helper instead of nested inline branching,
  keeping terminal-filled, malformed-filled, stale-open, partial-progress, and
  terminal-cancel semantics visible and no-DB testable without behavior
  changes. Validation PASS: no-DB helper regression (`11/11`), focused
  runtime/order suites (`70/70`), API typecheck, repository guardrails, lint,
  and diff check. Evidence:
  `history/tasks/position-management-exchange-fill-status-helper-refactor-task-2026-05-06.md`.
- 2026-05-06 exchange `FILLED` without quantity fail-closed slice `PMPLC-20`
  is closed locally. Exchange fill progress now refuses to terminalize
  non-terminal local orders when a `FILLED` event arrives without positive
  cumulative fill quantity, preserving `OPEN` or `PARTIALLY_FILLED` truth and
  skipping lifecycle/detail refresh until quantity truth is present. Validation
  PASS: no-DB helper regression (`10/10`), focused runtime/order suites
  (`69/69`), API typecheck, repository guardrails, lint, and diff check.
  Evidence:
  `history/tasks/position-management-exchange-filled-without-quantity-task-2026-05-06.md`.
- 2026-05-06 exchange partial status monotonicity slice `PMPLC-19` is closed
  locally. Exchange fill progress now preserves `PARTIALLY_FILLED` when stale
  `OPEN` events arrive after local partial progress, preventing known partial
  execution from being hidden as a plain open order. Validation PASS: no-DB
  helper regression (`8/8`), focused runtime/order suites (`67/67`), API
  typecheck, repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-exchange-partial-status-monotonicity-task-2026-05-06.md`.
- 2026-05-06 exchange fill helper boundary slice `PMPLC-18` is closed locally.
  Pure exchange close-fill completeness and fill-progress/idempotency decisions
  now live in `orders.exchangeEvents.helpers.ts`, while the DB-backed exchange
  event service imports them. The no-DB helper regression now imports only the
  pure helper module, reducing coupling to Prisma/runtime orchestration without
  behavior changes. Validation PASS: no-DB helper regression (`6/6`), focused
  runtime/order suites (`65/65`), API typecheck, repository guardrails, lint,
  and diff check. Evidence:
  `history/tasks/position-management-exchange-fill-helper-boundary-task-2026-05-06.md`.
- 2026-05-06 terminal exchange fill-detail idempotency slice `PMPLC-17` is
  closed locally. Exchange order-trade updates now refresh terminal fill
  details only before completion or when cumulative fill progress advances, so
  stale or duplicate events for already-`FILLED` orders cannot rewrite average
  fill price, filled timestamp, fee, fee currency, or exchange trade id while
  still preserving monotonic fill quantity. Validation PASS: no-DB exchange
  fill-progress helper regression (`6/6`), focused runtime/order suites
  (`65/65`), API typecheck, repository guardrails, lint, and diff check.
  DB-backed exchange-event lifecycle suites remain pending because local
  Postgres at `localhost:5432` is unavailable. Evidence:
  `history/tasks/position-management-exchange-terminal-fill-details-idempotency-task-2026-05-06.md`.
- 2026-05-06 exchange filled-event idempotency slice `PMPLC-16` is closed
  locally. Exchange order-trade fill progress now stays monotonic and
  already-`FILLED` local orders do not reapply position lifecycle when a
  duplicate or stale exchange `FILLED` event arrives, preventing double-add or
  double-close exposure drift. Validation PASS: no-DB exchange fill-progress
  helper regression (`5/5`), focused runtime/order suites (`64/64`), API
  typecheck, repository guardrails, lint, and diff check. DB-backed
  exchange-event lifecycle suites remain pending because local Postgres at
  `localhost:5432` is unavailable. Evidence:
  `history/tasks/position-management-exchange-filled-event-idempotency-task-2026-05-06.md`.
- 2026-05-06 LIVE entry lifecycle gate regression slice `PMPLC-15` is closed
  locally. Open-order persistence and immediate lifecycle decisions now share a
  pure helper that keeps underfilled LIVE entry orders `PARTIALLY_FILLED`,
  persists the confirmed exchange fill quantity, and blocks immediate position
  lifecycle until a complete fill is resolved, while preserving PAPER and
  no-fill-row LIVE compatibility. Validation PASS: no-DB lifecycle gate
  regression (`5/5`), focused runtime/order suites (`61/61`), API typecheck,
  repository guardrails, lint, and diff check. DB-backed order lifecycle suites
  remain pending because local Postgres at `localhost:5432` is unavailable.
  Evidence:
  `history/tasks/position-management-live-entry-lifecycle-gate-task-2026-05-06.md`.
- 2026-05-06 LIVE entry underfill safety slice `PMPLC-14` is closed locally.
  LIVE order creation now derives persisted status and filled quantity from
  exchange fill rows when available, persists below-request `FILLED` responses
  as `PARTIALLY_FILLED`, and skips immediate position lifecycle until the fill
  is complete, preventing local position quantity inflation. Validation PASS:
  no-DB live fill resolver and focused runtime/order suites (`58/58`), API
  typecheck, repository guardrails, lint, and diff check. DB-backed order
  lifecycle suites remain pending because local Postgres at `localhost:5432`
  is unavailable. Evidence:
  `history/tasks/position-management-live-entry-underfill-task-2026-05-06.md`.
- 2026-05-06 exchange-event underfilled close safety slice `PMPLC-13` is
  closed locally. Exchange order-trade close reconciliation now returns before
  full local close settlement when cumulative close fill quantity is below the
  local open position quantity, preventing local `CLOSED` state and close trade
  creation while residual exposure may remain. Validation PASS: no-DB exchange
  helper and focused runtime suites (`56/56`), API typecheck, repository
  guardrails, lint, and diff check. Full DB-backed exchange-events suite remains
  pending because local Postgres at `localhost:5432` is unavailable. Evidence:
  `history/tasks/position-management-exchange-event-underfilled-close-task-2026-05-06.md`.
- 2026-05-06 underfilled runtime close safety slice `PMPLC-12` is closed
  locally. Runtime close orchestration now keeps an underfilled close
  confirmation in submitted/waiting state when the reported filled quantity is
  below local open position quantity, preventing local `CLOSED` state and close
  trade creation while residual exposure may remain. Validation PASS: focused
  runtime orchestrator suite (`18/18`), focused runtime orchestrator/automation
  suites (`54/54`), API typecheck, repository guardrails, lint, and diff
  check. DB-backed exchange-events suite was blocked by unavailable local
  Postgres at `localhost:5432`. Evidence:
  `history/tasks/position-management-underfilled-close-fail-closed-task-2026-05-06.md`.
- 2026-05-06 LIVE free-balance cap slice `PMPLC-11` is closed locally. Runtime
  capital now preserves exchange account and free balances separately, keeps
  allocation/reference balance based on account total, caps LIVE free cash by
  exchange free balance when present, and records wallet snapshots with the
  actual free balance. Validation PASS: focused runtime capital suite
  (`18/18`), focused runtime DCA/position suites (`76/76`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-live-free-balance-cap-task-2026-05-06.md`.
- 2026-05-06 tracked replay balance reserve slice `PMPLC-10` is closed
  locally. Single-symbol replay now reserves entry margin, accumulates DCA
  margin in open position state, returns reserved margin during close/final
  settlement, and checks DCA affordability against remaining free cash.
  Validation PASS: focused backtest replay suite (`29/29`), focused
  backtest/runtime DCA suites (`61/61`), API typecheck, repository guardrails,
  lint, and diff check. Evidence:
  `history/tasks/position-management-replay-tracked-balance-reserve-task-2026-05-06.md`.
- 2026-05-06 DCA fill-price reserve accounting slice `PMPLC-09` is closed
  locally. Backtest replay now uses the selected DCA fill price for DCA event
  price, affordability checks, and interleaved portfolio reserved-margin
  accounting, preventing false cash exhaustion after wick-priced DCA fills.
  Validation PASS: focused contract remediation suite (`10/10`), focused
  backtest/runtime DCA suites (`60/60`), API typecheck, repository guardrails,
  lint, and diff check. Evidence:
  `history/tasks/position-management-portfolio-dca-fill-margin-task-2026-05-06.md`.
- 2026-05-06 portfolio final margin release slice `PMPLC-08` is closed
  locally. Interleaved portfolio simulation now removes positions closed in
  the final-candle loop from `openPositions`, so returned margin is not
  counted again in `finalBalance`. Validation PASS: focused contract
  remediation suite (`9/9`), focused backtest/runtime DCA suites (`59/59`),
  API typecheck, repository guardrails, lint, and diff check. Evidence:
  `history/tasks/position-management-portfolio-final-margin-release-task-2026-05-06.md`.
- 2026-05-06 selected DCA funds parity slice `PMPLC-07` is closed locally.
  Backtest replay and interleaved portfolio simulation now estimate DCA funds
  from the core-selected `dcaAddedQuantity` instead of guessing the multiplier
  from aggregate add count, preventing mixed-lane selected-level affordability
  drift. Validation PASS: focused backtest replay suite (`28/28`), focused
  backtest/runtime DCA suites (`50/50`), API typecheck, repository guardrails,
  lint, and diff check. Evidence:
  `history/tasks/position-management-backtest-selected-dca-funds-task-2026-05-06.md`.
- 2026-05-06 backtest DCA funds parity slice `PMPLC-06` is closed locally.
  Single-symbol replay now estimates the next DCA add margin against tracked
  wallet balance before mutating position state, skips unaffordable DCA events,
  and still releases close protection when DCA is funds-exhausted. Validation
  PASS: focused backtest replay suite (`27/27`), focused backtest/runtime DCA
  suites (`49/49`), API typecheck, repository guardrails, lint, and diff
  check. Evidence:
  `history/audits/position-management-backtest-dca-funds-parity-task-2026-05-06.md`.
- 2026-05-06 backtest mixed DCA lane parity slice `PMPLC-05` is closed
  locally. Backtest replay now chooses DCA probe prices from the candle extreme
  that matches the pending DCA lane direction, carries
  `executedDcaLevelIndices` across replay state, and interleaved portfolio
  simulation reuses the same resolver so adverse and favorable DCA lanes stay
  aligned with runtime. Validation PASS: focused backtest replay suite
  (`26/26`), focused backtest/runtime DCA suites (`48/48`), API typecheck,
  repository guardrails, lint, and diff check. Evidence:
  `history/audits/position-management-backtest-mixed-dca-parity-task-2026-05-06.md`.
- 2026-05-06 LIVE close order contract slice `PMPLC-04` is closed locally.
  Runtime close coverage now explicitly locks the current LIVE close payload as
  a runtime-owned reduce-only `MARKET` order and asserts no hidden `stopPrice`,
  `stopLoss`, or `takeProfit` fields are sent before the future exchange-backed
  protection-order vertical slice exists. Validation PASS: focused runtime
  orchestrator suite (`17/17`), API typecheck, repository guardrails, lint, and
  diff check. Evidence:
  `history/tasks/position-management-live-close-order-contract-task-2026-05-06.md`.
- 2026-05-06 basic TP/SL DCA reachability slice `PMPLC-03` is closed
  locally. Strategy create/update/import validation now rejects basic-mode
  configs where positive DCA levels sit above hard `TP` or negative DCA levels
  sit below hard `SL`, and the strategy form blocks the same invalid payload
  with localized validation feedback. Validation PASS: focused API strategy
  config validation suite (`5/5`), focused web strategy validation/form suite
  (`12/12`), API/web typecheck, route-reachable i18n audit, repository
  guardrails, lint, and diff review. Evidence:
  `history/tasks/position-management-basic-dca-reachability-task-2026-05-06.md`.
- 2026-05-06 mixed DCA lane runtime slice `PMPLC-02` is closed locally.
  Runtime position-management state now records executed DCA level indices so
  positive and negative DCA lanes can execute independently while `currentAdds`
  remains the compatibility count. Validation PASS: focused position
  management suite (`22/22`), runtime automation suite (`36/36`), runtime
  serialization suite (`8/8`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/tasks/position-management-dca-lane-state-task-2026-05-06.md`.
- 2026-05-06 PnL-based position management architecture contract
  `PMPLC-01` is closed locally. Added the canonical DCA/TP/SL/TTP/TSL
  lifecycle contract covering positive and negative DCA lanes, DCA-first
  close gating, basic-mode unreachable DCA warnings, advanced TTP/TSL
  activation-versus-trail semantics, unaffordable-DCA policy, live
  order/position reconciliation, and imported exchange-position adoption
  points. Validation PASS: repository guardrails and architecture diff review.
  Evidence:
  `history/tasks/position-management-pnl-lifecycle-contract-task-2026-05-06.md`.
- 2026-05-04 dynamic stop display precedence slice `RUNTIME-AUDIT-143` is
  closed locally. Resolver-level tests now lock TSL display only when TTP is
  inactive, backend TTP suppression of TSL, fallback TTP suppression of TSL,
  and backend TTP precedence over fallback TTP. Validation PASS: focused
  runtime derivations suite (`5/5`), web typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-143-dynamic-stop-display-contract-task-2026-05-04.md`.
- 2026-05-04 backend TTP precedence regression slice `RUNTIME-AUDIT-142` is
  closed locally. Runtime view-model coverage now proves backend dynamic TTP
  protection wins over fallback TTP display when both values exist. Validation
  PASS: focused runtime selection view-model suite (`9/9`), web typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-142-backend-ttp-precedence-regression-task-2026-05-04.md`.
- 2026-05-04 fallback TTP sticky-state scope slice `RUNTIME-AUDIT-141` is
  closed locally. Fallback TTP sticky favorable-move state is now keyed by bot
  id, runtime session id, and position id, with regression coverage preventing
  cross-runtime leakage. Validation PASS: focused runtime selection view-model
  suite (`8/8`), web typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-141-scope-fallback-ttp-sticky-state-task-2026-05-04.md`.
- 2026-05-04 fallback TTP disarm regression slice `RUNTIME-AUDIT-140` is
  closed locally. Selected runtime view-model coverage now proves fallback TTP
  protection clears when live PnL drops below the first trailing take-profit
  disarm floor, while planned TTP row truth can keep dynamic stop columns
  visible. Validation PASS: focused runtime selection view-model suite
  (`7/7`), web typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-140-fallback-ttp-disarm-regression-task-2026-05-04.md`.
- 2026-05-04 fallback TTP dashboard display slice `RUNTIME-AUDIT-139` is
  closed locally. Selected runtime open-position rows now compute fallback TTP
  protected percent from existing trailing take-profit levels and live PnL, and
  the TTP display resolver uses that fallback before backend dynamic stop price
  arrives. Validation PASS: focused runtime selection view-model suite
  (`6/6`), runtime table presenter suite, web typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-139-dashboard-fallback-ttp-display-task-2026-05-04.md`.
- 2026-05-04 manual total-pages visible-row clamp slice `RUNTIME-AUDIT-138`
  is closed locally. Manual pagination now preserves `totalPages=0` for empty
  tables only and reports at least one page when rows are visible, preventing
  `Page 1/0` summaries with rendered runtime rows. Validation PASS: focused
  `DataTable` suite (`9/9`), web typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-138-manual-total-pages-visible-rows-task-2026-05-04.md`.
- 2026-05-04 manual total display clamp slice `RUNTIME-AUDIT-137` is closed
  locally. Manual-pagination footer totals now clamp against visible rows even
  when callers provide only `totalRows` metadata and no `reportedTotalRows`.
  Validation PASS: focused `DataTable` suite (`8/8`), web typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-137-manual-total-display-clamp-task-2026-05-04.md`.
- 2026-05-04 manual reported table total clamp slice `RUNTIME-AUDIT-136` is
  closed locally. Manual pagination reported totals now clamp against visible
  rows as well as external metadata, so stale zero metadata cannot contradict
  rendered rows. Validation PASS: focused `DataTable` suite (`7/7`), web
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-136-manual-reported-table-total-clamp-task-2026-05-04.md`.
- 2026-05-04 reported table total clamp slice `RUNTIME-AUDIT-135` is closed
  locally. Display-only reported totals now remain at least the effective
  table row count, so a stale or inconsistent runtime counter cannot show
  `Rows: 0` while rows are visible. Validation PASS: focused `DataTable`
  suite (`6/6`), web typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-135-clamp-reported-table-totals-task-2026-05-04.md`.
- 2026-05-04 dashboard open-order icon symbol slice `RUNTIME-AUDIT-134` is
  closed locally. Runtime icon lookup now includes symbols that appear only in
  open orders, reusing the existing shared icon hook and resolver. Validation
  PASS: focused dashboard open-orders source suite (`1/1`), web typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-134-open-orders-icon-symbols-task-2026-05-04.md`.
- 2026-05-04 dashboard position/open-order row-total slice
  `RUNTIME-AUDIT-133` is closed locally. `DataTable` now supports
  display-only reported totals, and the runtime open-position/open-order
  tables pass API `openCount` and `openOrdersCount` without creating fake
  client-side pages. Validation PASS: focused `DataTable` suite (`5/5`),
  focused dashboard open-orders source suite (`1/1`), web typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-133-dashboard-position-row-totals-task-2026-05-04.md`.
- 2026-05-04 runtime trade-row selector slice `RUNTIME-AUDIT-132` is closed
  locally. Selected runtime trade-row resolution now lives in one helper with
  branch coverage for selected query precedence, matching snapshot fallback,
  and mismatched session blocking. Validation PASS: focused runtime selection
  view-model suite (`5/5`), focused dashboard component suite (`20/20`), web
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-132-runtime-trade-row-selector-task-2026-05-04.md`.
- 2026-05-04 snapshot trade rows fallback slice `RUNTIME-AUDIT-131` is closed
  locally. Runtime selected-data projection now falls back to matching
  `selected.trades.items` until the derived `selectedTrades` query projection
  is ready, while keeping query projection precedence and session-id guards.
  Validation PASS: focused runtime selection view-model suite (`2/2`), focused
  dashboard component suite (`20/20`), web typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-131-snapshot-trade-rows-fallback-task-2026-05-04.md`.
- 2026-05-04 empty manual pagination metadata slice `RUNTIME-AUDIT-130` is
  closed locally. `DataTable` manual pagination now preserves explicit
  external `totalPages=0` for empty runtime metadata while keeping page
  callbacks one-based, so empty dashboard trade history no longer gets
  normalized to a fake page count. Validation PASS: focused `DataTable` suite
  (`4/4`), focused dashboard component suite (`20/20`), web typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-130-manual-pagination-empty-meta-task-2026-05-04.md`.
- 2026-05-04 shared runtime trade metadata builder slice
  `RUNTIME-AUDIT-129` is closed locally. Runtime trade metadata construction
  now lives in one shared `home-live-widgets` helper used by both component
  fallback and aggregate controller paths, preserving empty `totalPages=0` and
  page clamping without duplicated formulas. Validation PASS: focused
  dashboard component suite (`20/20`), focused dashboard controller suite
  (`2/2`), web typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-129-shared-trade-meta-builder-task-2026-05-04.md`.
- 2026-05-04 dashboard fallback trade metadata slice `RUNTIME-AUDIT-128` is
  closed locally. The home runtime widget now builds fallback trade metadata
  with runtime API empty-state semantics, so empty local trade-history fallback
  reports `totalPages=0` and non-empty fallback pages are clamped to the local
  page range. Validation PASS: focused dashboard component suite (`20/20`),
  web typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-128-dashboard-trade-meta-fallback-task-2026-05-04.md`.
- 2026-05-04 dashboard aggregate trade total slice `RUNTIME-AUDIT-127` is
  closed locally. The main dashboard now preserves API aggregate
  `trades.total` before local trade filters or sort are applied, so the
  unfiltered trade-history count no longer collapses to the returned
  item-window length. Validation PASS: focused dashboard controller suite
  (`2/2`), web typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-127-dashboard-aggregate-trade-total-task-2026-05-04.md`.
- 2026-05-04 web empty aggregate trade meta fallback slice
  `RUNTIME-AUDIT-126` is closed locally. The web no-session aggregate fallback
  now reports `trades.meta.pageSize` from the requested `perSessionLimit`,
  matching the API empty aggregate contract while preserving zero totals and
  `hasNext=false`. Validation PASS: focused web aggregate service suite
  (`3/3`), web typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-126-web-empty-aggregate-trade-meta-task-2026-05-04.md`.
- 2026-05-04 runtime aggregate empty trade meta slice `RUNTIME-AUDIT-125` is
  closed locally. Empty aggregate trades now reuse the aggregate trade meta
  helper with the caller's `perSessionLimit`, so `meta.pageSize` matches the
  same contract as non-empty aggregate reads while `total=0`, `totalPages=0`,
  and `hasNext=false` remain unchanged. Validation PASS: focused runtime
  session position unit suite (`16/16`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-125-empty-aggregate-trade-meta-task-2026-05-04.md`.
- 2026-05-04 runtime aggregate trade meta page-size slice
  `RUNTIME-AUDIT-124` is closed locally. Aggregate trades `meta.pageSize` now
  reports the requested `perSessionLimit` instead of the deduped returned item
  count, while `hasNext` remains based on `totalTrades > returnedItems`.
  Validation PASS: focused runtime session position unit suite (`16/16`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-124-aggregate-trade-meta-page-size-task-2026-05-04.md`.
- 2026-05-04 runtime aggregate position source cleanup slice
  `RUNTIME-AUDIT-123` is closed locally. Removed the unused all-session
  `positionResponses` collection after current open rows, open orders, history
  rows, and display flags moved to their canonical current/projection sources.
  Validation PASS: focused runtime session position unit suite (`15/15`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-123-remove-stale-position-response-aggregate-task-2026-05-04.md`.
- 2026-05-04 runtime aggregate account-balance capital summary slice
  `RUNTIME-AUDIT-122` is closed locally. Aggregate capital summary selection
  now treats finite `accountBalance` as usable evidence, so
  account-balance-only latest snapshots are preserved instead of falling back
  to older/null capital summaries. Validation PASS: focused runtime session
  position unit suite (`15/15`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `history/audits/runtime-audit-122-aggregate-account-balance-summary-task-2026-05-04.md`.
- 2026-05-04 runtime aggregate dynamic-stop flag slice `RUNTIME-AUDIT-121` is
  closed locally. Aggregate `positions.showDynamicStopColumns` now comes from
  the freshest position response, matching current open position/open-order row
  projection and preventing stale older RUNNING snapshots from enabling unused
  dynamic-stop columns. Validation PASS: focused runtime session position unit
  suite (`14/14`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-121-aggregate-dynamic-stop-flag-task-2026-05-04.md`.
- 2026-05-04 runtime aggregate position item projection slice
  `RUNTIME-AUDIT-120` is closed locally. Aggregate current open position rows
  and open order rows now come from the freshest position response, while
  historical position rows use the latest-running projection rows, so stale
  older RUNNING snapshots no longer stay visible after counters move to the
  newer snapshot. Validation PASS: focused runtime session position unit suite
  (`13/13`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-120-aggregate-position-items-task-2026-05-04.md`.
- 2026-05-04 runtime aggregate trade item projection slice
  `RUNTIME-AUDIT-119` is closed locally. Aggregate trade table items now use
  the same latest-running projection rows as trade totals and fees, so stale
  older RUNNING session trade rows no longer remain visible after counters
  project to the newer RUNNING session. Validation PASS: focused runtime
  session position unit suite (`12/12`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-119-aggregate-running-trade-items-task-2026-05-04.md`.
- 2026-05-04 runtime aggregate symbols metadata slice `RUNTIME-AUDIT-118` is
  closed locally. Aggregate `symbolsTracked` now uses the same latest-running
  projection rows as duration and event metadata, so overlapping RUNNING
  sessions no longer inflate the aggregate header while completed/non-running
  rows still contribute normally. Validation PASS: focused runtime session
  position unit suite (`11/11`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `history/audits/runtime-audit-118-aggregate-running-symbols-task-2026-05-04.md`.
- 2026-05-04 runtime trades carry-over window slice `RUNTIME-AUDIT-117` is
  closed locally. Carry-over position trade reads now include normal in-window
  trades plus only persisted imported `OPEN` anchors outside the window, so
  pre-window DCA/CLOSE/fee rows no longer leak into current session trade
  history or fees. Validation PASS: focused runtime session position unit
  suite (`10/10`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-117-trades-carryover-window-task-2026-05-04.md`.
- 2026-05-04 LIVE imported symbol-stats open-position slice
  `RUNTIME-AUDIT-116` is closed locally. Runtime symbol-stats live
  open-position rows now include direct bot positions and owned LIVE imported
  positions via the existing external ownership index, including market-aware
  and legacy external IDs with wallet/null-wallet recovery scope. Validation
  PASS: focused runtime session position unit suite (`8/8`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-116-symbol-stats-live-imported-open-position-task-2026-05-04.md`.
- 2026-05-04 runtime symbol-stats carried open-position slice
  `RUNTIME-AUDIT-115` is closed locally. Runtime symbol-stats live
  open-position reads now include positions opened before session start when
  they remain active by the session window end, matching the session positions
  endpoint's carried-position semantics. Validation PASS: focused runtime
  session position unit suite (`6/6`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-115-symbol-stats-carried-open-position-task-2026-05-04.md`.
- 2026-05-04 runtime session closed-position window slice `RUNTIME-AUDIT-114`
  is closed locally. Closed-position history and fee aggregation now bound
  `closedAt` by both session start and resolved window end, so completed
  sessions cannot include later closes or fees. The slice also extracted two
  small pure helpers out of the runtime session position read monolith to keep
  repository guardrails green. Validation PASS: focused runtime session
  position unit suite (`5/5`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-114-session-closed-position-window-task-2026-05-04.md`.
- 2026-05-04 PAPER wallet realized-PnL slice `RUNTIME-AUDIT-113` is closed
  locally. Wallet performance summary and equity timeline now include realized
  PnL from closed `IN_SYNC` PAPER positions owned directly by the wallet or by
  bots using the wallet, while LIVE wallet realized PnL remains cashflow-based.
  Validation PASS: focused wallet service unit suite (`5/5`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-113-paper-wallet-realized-pnl-task-2026-05-04.md`.
- 2026-05-04 PAPER runtime trade fallback slice `RUNTIME-AUDIT-112` is closed
  locally. Runtime position trade reads now include botless wallet-scoped trade
  fallback only for LIVE recovery/import visibility, so PAPER bot dashboards
  no longer risk mixing unrelated botless wallet-scoped trades into bot-scoped
  position rows. Validation PASS: focused runtime positions read unit suite
  (`4/4`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-112-paper-runtime-trade-wallet-fallback-task-2026-05-04.md`.
- 2026-05-04 PAPER position test-contract slice `RUNTIME-AUDIT-111` is closed
  locally. DB-backed order tests now expect bot-created PAPER positions to
  persist with `Position.walletId=null`, while LIVE remains wallet-scoped,
  aligning the regression suite with the RUNTIME-AUDIT-108 bot-scoped
  persistence contract. Validation PASS: API typecheck, repository guardrails,
  lint, and diff review. Targeted DB-backed order tests were attempted but
  timed out locally after 120s because the local PostgreSQL-backed suite did
  not complete in this environment. Evidence:
  `history/audits/runtime-audit-111-paper-position-test-contract-task-2026-05-04.md`.
- 2026-05-04 PAPER manual-close wallet-backfill slice `RUNTIME-AUDIT-110`
  is closed locally. Manual dashboard close now backfills missing position
  `walletId` only in LIVE recovery paths, so PAPER bot-scoped positions remain
  in the `Position.walletId=null` persistence lane while close orchestration
  still receives wallet context from the bot. Validation PASS: focused runtime
  session position command suite (`11/11`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-110-paper-manual-close-wallet-backfill-task-2026-05-04.md`.
- 2026-05-04 PAPER wallet reset bot-position guard slice `RUNTIME-AUDIT-109`
  is closed locally. PAPER wallet reset now counts active `OPEN` + `IN_SYNC`
  positions directly assigned to the wallet and positions owned by bots that
  use the wallet, preserving fail-closed reset behavior after PAPER bot
  positions moved to bot-scoped persistence. Validation PASS: focused wallet
  service unit suite (`3/3`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-109-paper-reset-bot-position-scope-task-2026-05-04.md`.
- 2026-05-04 PAPER position DB-scope slice `RUNTIME-AUDIT-108` is closed
  locally. PAPER bot positions now persist with `Position.walletId=null`, so
  they use the existing bot-scoped DB uniqueness lane instead of colliding with
  wallet-scoped open-position uniqueness. Order/trade wallet attribution is
  preserved, runtime capital reads use bot scope for PAPER, and wallet open-PnL
  reads include PAPER bot positions through the existing bot-wallet relation.
  Validation PASS: focused unit pack (`23/23`), API typecheck, repository
  guardrails, lint, and diff review. DB-backed order-service regression remains
  locally blocked by unavailable PostgreSQL on `localhost:5432`. Evidence:
  `history/audits/runtime-audit-108-paper-position-db-scope-task-2026-05-04.md`.
- 2026-05-04 PAPER order fill bot-scope slice `RUNTIME-AUDIT-107` is closed
  locally. Order open-position scope is now mode-aware: PAPER orders with a
  bot id use bot scope even when a shared wallet id is present, while LIVE
  remains wallet-scoped. This prevents a PAPER fill from reusing or conflicting
  with another bot's same-symbol position on the same paper wallet, so the
  active bot gets its own dashboard-visible position. Validation PASS: focused
  order-scope unit suite (`2/2`), API typecheck, repository guardrails, lint,
  and diff review. A DB-backed order-service regression was added but local
  execution was blocked by unavailable PostgreSQL on `localhost:5432`.
  Evidence:
  `history/audits/runtime-audit-107-paper-order-fill-bot-scope-task-2026-05-04.md`.
- 2026-05-04 bot-open DCA display dedupe slice `RUNTIME-AUDIT-106` is closed
  locally. Runtime position reads now include `orderId` and infer DCA progress
  from unique entry lifecycle units, so duplicate same-order `OPEN` rows from
  bot runtime and exchange fill handling display DCA `0` until a real `DCA`
  row or runtime progress exists. Validation PASS: focused DCA count unit
  suite (`2/2`), API typecheck, repository guardrails, lint, and diff review.
  Integration e2e scenario was added but local execution was blocked by
  unavailable PostgreSQL on `localhost:5432`. Evidence:
  `history/audits/runtime-audit-106-bot-open-dca-display-dedupe-task-2026-05-04.md`.
- 2026-05-04 runtime owned imported count active-sync slice
  `RUNTIME-AUDIT-105` is closed locally. LIVE owned imported fallback
  open-position counts now require `syncState=IN_SYNC`, so stale
  `ORPHAN_LOCAL` imported rows cannot inflate bot open-position caps or block
  expected runtime opens after dashboard truth has already ignored them.
  Validation PASS: runtime signal-loop defaults suite (`10/10`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-105-runtime-external-count-sync-state-task-2026-05-04.md`.
- 2026-05-04 close mutation active-sync slice `RUNTIME-AUDIT-104` is closed
  locally. Manual order close and runtime execution default close mutations
  now require the linked position to be `OPEN` + `IN_SYNC`, so an
  `ORPHAN_LOCAL` stale row cannot be closed through a valid order or runtime
  EXIT path. Validation PASS: orders service suite (`35/35`), execution
  orchestrator suite (`17/17`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `history/audits/runtime-audit-104-close-position-mutation-sync-state-task-2026-05-04.md`.
- 2026-05-04 live reconciliation open-synced lookup slice
  `RUNTIME-AUDIT-103` is closed locally. Default open-synced position lookup
  and API-key stale-position scan now exclude `ORPHAN_LOCAL` rows while
  preserving recoverable `DRIFT`, so stale local imported rows no longer steal
  LIVE exchange updates or receive stale close handling after they leave active
  truth. Validation PASS: focused reconciliation suite (`31/31`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-103-reconciliation-open-synced-scope-task-2026-05-04.md`.
- 2026-05-04 runtime scan watchdog active-sync slice `RUNTIME-AUDIT-102` is
  closed locally. Default runtime scan watchdog target discovery now derives
  ticker targets only from `OPEN` + `IN_SYNC` supported position contexts, so
  stale local `ORPHAN_LOCAL` rows no longer create inferred watchdog ticker
  processing while explicit `RUNTIME_SCAN_SYMBOLS` remains operator-owned.
  Validation PASS: focused runtime scan suite (`6/6`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-102-runtime-scan-watchdog-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime position automation active-sync slice
  `RUNTIME-AUDIT-101` is closed locally. Ticker-driven runtime position
  automation now hydrates only `OPEN` + `IN_SYNC` bot-managed positions, so
  stale local `ORPHAN_LOCAL` rows cannot receive DCA, TP, TTP, SL, or TSL
  automation decisions while synced exchange-imported ownership hydration
  remains covered. Validation PASS: focused automation default-deps suite
  (`1/1`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-101-position-automation-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime position lifetime active-sync slice `RUNTIME-AUDIT-100`
  is closed locally. Runtime position lifetime scanning now selects only stale
  `OPEN` + `IN_SYNC` positions, so stale local `ORPHAN_LOCAL` rows cannot
  trigger automated close orchestration while synced stale positions still
  close through the canonical runtime path. Validation PASS: focused lifetime
  suite (`4/4`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-100-position-lifetime-sync-state-task-2026-05-04.md`.
- 2026-05-04 PAPER to LIVE switch active-position scope slice
  `RUNTIME-AUDIT-99` is closed locally. PAPER to LIVE mode switch guard now
  counts only `OPEN` + `IN_SYNC` `BOT_MANAGED` paper positions, so stale local
  `ORPHAN_LOCAL` rows no longer block a bot configuration switch while real
  active paper positions remain fail-closed. Validation PASS: focused bot e2e
  pack (`27/27`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-99-paper-live-switch-active-position-scope-task-2026-05-04.md`.
- 2026-05-04 immediate fill stale-position blocker slice `RUNTIME-AUDIT-98`
  is closed locally. Order fill lifecycle now repair-closes exact-scope
  `ORPHAN_LOCAL` open position blockers with `SYSTEM_REPAIR` /
  `REPAIR_ONLY_CLEANUP` before creating a fresh `IN_SYNC` position, so stale
  local rows no longer block PAPER/LIVE filled orders at the partial unique
  index layer. Validation PASS: orders service suite (`34/34`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-98-immediate-fill-stale-position-blocker-task-2026-05-04.md`.
- 2026-05-04 shared order open-position active-sync slice `RUNTIME-AUDIT-97`
  is closed locally. Shared order open-position scope and LIVE
  imported-position fallbacks now require `syncState=IN_SYNC`, so stale local
  or imported open rows no longer drive manual reverse-conflict checks or
  unlinked fill reusable-position lookup. Validation PASS: orders service
  suite (`33/33`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-97-open-position-scope-sync-state-task-2026-05-04.md`.
- 2026-05-04 LIVE linked-position fill lifecycle active-sync slice
  `RUNTIME-AUDIT-96` is closed locally. LIVE exchange order-trade fills now
  apply linked-position close/DCA lifecycle only when the linked position is
  `status=OPEN` and `syncState=IN_SYNC`, so stale local linked positions can no
  longer receive DCA/close position updates, DCA trades, or runtime DCA dedupe
  completion. Validation PASS: exchange-events suite (`7/7`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-96-linked-position-fill-sync-state-task-2026-05-04.md`.
- 2026-05-04 LIVE order-trade update synced-market scope slice
  `RUNTIME-AUDIT-95` is closed locally. Binance order-trade updates now resolve
  local orders only when `syncState=IN_SYNC` and the order belongs to the
  event's LIVE Binance market through wallet or bot scope, so stale
  same-exchange-id local rows cannot receive fills or steal lifecycle updates
  from the valid active order. Validation PASS: exchange-events suite (`6/6`),
  API typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-95-order-trade-update-order-scope-task-2026-05-04.md`.
- 2026-05-04 LIVE account-update active-sync slice `RUNTIME-AUDIT-94` is
  closed locally. Binance account-update scope resolution now requires
  `syncState=IN_SYNC` beside `status=OPEN`, so stale same-symbol local rows
  from another live bot/wallet scope cannot create false ambiguity or receive
  quantity, entry, PnL, or external-close updates. Validation PASS:
  exchange-events suite (`6/6`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `history/audits/runtime-audit-94-account-update-scope-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime execution dedupe success-by-order slice
  `RUNTIME-AUDIT-93` is closed locally. Runtime execution dedupe now marks
  success by `orderId` only when the linked order is `status=FILLED` and
  `syncState=IN_SYNC`, preventing stale local orders from completing runtime
  DCA dedupe or runtime DCA state after exchange-event handling. Validation
  PASS: runtime execution dedupe suite (`11/11`), exchange-events suite
  (`6/6`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-93-dedupe-success-order-state-task-2026-05-04.md`.
- 2026-05-04 runtime execution dedupe linked-order active-sync slice
  `RUNTIME-AUDIT-92` is closed locally. Runtime execution dedupe now reuses
  linked submitted/completed orders only when `syncState=IN_SYNC`; a linked
  `ORPHAN_LOCAL` order resets the dedupe row for a fresh execution attempt
  instead of blocking PAPER/LIVE execution as submitted or inflight.
  Validation PASS: runtime execution dedupe suite (`9/9`), execution
  orchestrator suite (`17/17`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-92-runtime-dedupe-linked-order-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime execution open-lookup active-sync slice
  `RUNTIME-AUDIT-91` is closed locally. Runtime execution open-position lookup
  now requires `syncState=IN_SYNC` for direct and LIVE imported fallback reads,
  so stale `ORPHAN_LOCAL` open rows no longer drive `already_open_same_side`,
  no-flip, or EXIT close decisions after dashboard/pre-trade/runtime loop has
  stopped treating them as active. Validation PASS: focused execution
  orchestrator suite (`17/17`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-91-execution-open-lookup-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime loop repository active-sync slice `RUNTIME-AUDIT-90` is
  closed locally. Runtime signal loop repository reads now require
  `syncState=IN_SYNC` when hydrating managed external open positions and
  counting bot-symbol open positions for caps, so stale `ORPHAN_LOCAL` open
  rows no longer inflate runtime cap or managed-import truth. Validation PASS:
  focused runtime repository/defaults pack (`12/12`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-90-runtime-loop-repository-sync-state-task-2026-05-04.md`.
- 2026-05-04 pre-trade active-sync open-guard slice `RUNTIME-AUDIT-89` is
  closed locally. Pre-trade user open-position counts, bot open-position
  counts, same-symbol checks, and LIVE imported fallback reads now require
  `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open cleanup rows no longer
  block PAPER/LIVE opens through caps or same-symbol guard while active rows
  remain blocking. Validation PASS: focused pre-trade e2e/unit pack
  (`25/25`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-89-pretrade-sync-state-open-guards-task-2026-05-04.md`.
- 2026-05-04 reconciliation owner cleanup market-scope slice
  `RUNTIME-AUDIT-88` is closed locally. Owner cleanup candidates for open
  synced orders and local managed positions are now seeded only from the
  reconciled canonical market prefix plus legacy unscoped ownership keys,
  excluding other canonical market prefixes on the same API key. This prevents
  a FUTURES reconciliation pass from checking or closing SPOT-only owner
  cleanup targets. Validation PASS: live position reconciliation suite
  (`30/30`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-88-reconciliation-owner-market-scope-task-2026-05-04.md`.
- 2026-05-04 reconciliation stale-position market-scope slice
  `RUNTIME-AUDIT-87` is closed locally. LIVE position reconciliation stale
  synced-position scans now receive the synced API-key market type and include
  only the current canonical market prefix plus legacy unscoped imported IDs,
  excluding other canonical market prefixes from missing/close cleanup. This
  prevents a FUTURES reconciliation pass from marking same-api-key SPOT rows
  stale. Validation PASS: live position reconciliation suite (`29/29`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-87-reconciliation-stale-scan-market-scope-task-2026-05-04.md`.
- 2026-05-04 wallet imported open-PnL market-scope slice `RUNTIME-AUDIT-86`
  is closed locally. Wallet performance summary and equity timeline now match
  botless LIVE imported open positions by canonical `apiKeyId:marketType:`
  external ID prefix instead of broad `apiKeyId:`, so a FUTURES wallet no
  longer includes SPOT open PnL from the same API key while same-market
  `IN_SYNC` imported PnL remains included. Validation PASS: wallets e2e
  (`20/20`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-86-wallet-open-pnl-market-scope-task-2026-05-04.md`.
- 2026-05-04 runtime closed-position history sync slice `RUNTIME-AUDIT-85`
  is closed locally. Runtime closed-position reads, portfolio close-point
  reads, and runtime paper capital open/closed position queries now require
  `syncState=IN_SYNC`, so scoped `ORPHAN_LOCAL` cleanup rows no longer inflate
  closed counts, realized PnL, portfolio CLOSE points, reference balance, or
  free cash. Validation PASS: portfolio-history e2e (`3/3`), runtime-scope
  e2e (`16/16`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-85-runtime-closed-positions-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime open-position active-sync slice `RUNTIME-AUDIT-84` is
  closed locally. Bot runtime session positions now require
  `syncState=IN_SYNC` for active open-position truth, including open-count,
  open quantity, unrealized PnL, margin/free-cash, fee aggregation, and
  continuity candidate reads, so stale scoped `ORPHAN_LOCAL` open rows no
  longer appear as live bot positions. Validation PASS: runtime-scope e2e
  (`16/16`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-84-runtime-open-positions-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime symbol live-row active-sync slice `RUNTIME-AUDIT-83`
  is closed locally. Runtime symbol live-row reads now require
  `syncState=IN_SYNC`, so scoped `ORPHAN_LOCAL` open-position rows no longer
  inflate symbol-stats open count, quantity, unrealized PnL, or derived market
  state while active synced rows remain included. Validation PASS:
  runtime-scope e2e (`15/15`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-83-symbol-live-rows-sync-state-task-2026-05-04.md`.
- 2026-05-04 wallet open-PnL active-sync slice `RUNTIME-AUDIT-82` is closed
  locally. Wallet current open-PnL aggregation now requires
  `syncState=IN_SYNC` in the shared helper used by performance summary and
  equity timeline, so same-API-key `ORPHAN_LOCAL` imported open-position rows
  no longer inflate wallet dashboard PnL while active imported `IN_SYNC` rows
  remain included. Validation PASS: wallets e2e (`20/20`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-82-wallet-open-pnl-sync-state-task-2026-05-04.md`.
- 2026-05-04 paper wallet reset open-position blocker slice
  `RUNTIME-AUDIT-81` is closed locally. Paper wallet reset now counts
  open-position blockers only when `syncState=IN_SYNC`, matching the existing
  open-order blocker and active position-list/runtime semantics, so stale
  `ORPHAN_LOCAL` open-position rows no longer deny reset. Validation PASS:
  wallets e2e (`20/20`), API typecheck, repository guardrails, lint, and diff
  review. Evidence:
  `history/audits/runtime-audit-81-wallet-reset-active-position-sync-state-task-2026-05-04.md`.
- 2026-05-04 legacy local-orphan repair exclusion slice `RUNTIME-AUDIT-80`
  is closed locally. Local legacy open-position repair now excludes
  `syncState=ORPHAN_LOCAL` from candidate scans and from both guarded repair
  update predicates, so a scope-matching local orphan cannot be rebound to a
  canonical bot or closed again by this repair path. Valid `IN_SYNC` legacy
  rebind, detached-blocker close, and exchange re-import behavior remain
  covered. Validation PASS: orphan-repair e2e (`1/1`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-80-orphan-repair-ignore-local-orphans-task-2026-05-04.md`.
- 2026-05-04 takeover local-orphan exclusion slice `RUNTIME-AUDIT-79` is
  closed locally. Takeover status and rebind candidate scans now exclude
  `syncState=ORPHAN_LOCAL`, and the rebind update predicate repeats the
  stale-local guard so a scope-matching local orphan cannot be shown as
  takeover-active or rebound back to `IN_SYNC`. `DRIFT` repair behavior remains
  intact. Validation PASS: takeover-status e2e (`6/6`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-79-takeover-ignore-local-orphans-task-2026-05-04.md`.
- 2026-05-04 position management-mode active-state slice `RUNTIME-AUDIT-78`
  is closed locally. Dashboard/API management-mode updates now require
  `status=OPEN` and `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL`
  open-position rows cannot be switched between `BOT_MANAGED` and
  `MANUAL_MANAGED` after active lists and runtime paths stop treating them as
  live. Validation PASS: positions service suite (`3/3`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-78-position-management-mode-active-state-task-2026-05-04.md`.
- 2026-05-04 position manual-update active-state slice `RUNTIME-AUDIT-77`
  is closed locally. Manual TP/SL updates now require `syncState=IN_SYNC` in
  addition to `status=OPEN`, and the mutation uses a guarded
  `updateMany` predicate so stale `ORPHAN_LOCAL` open-position rows cannot be
  changed after active list/runtime close paths stop treating them as active.
  Validation PASS: positions service suite (`2/2`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-77-position-manual-update-sync-state-task-2026-05-04.md`.
- 2026-05-04 positions list active-sync-state slice `RUNTIME-AUDIT-76` is
  closed locally. Generic dashboard positions list now requires
  `syncState=IN_SYNC` when filtering `status=OPEN`, so stale `ORPHAN_LOCAL`
  open-position rows no longer appear as active list truth while unfiltered
  history remains available for audit. Validation PASS: positions list e2e
  (`2/2`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-76-positions-list-active-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime manual close active-position slice `RUNTIME-AUDIT-75`
  is closed locally. Dashboard/runtime manual close-position command now
  requires `syncState=IN_SYNC` for the selected open position and for the
  ownership-claim update guard, so stale `ORPHAN_LOCAL` open-position rows are
  ignored as `no_open_position` before close orchestration. Validation PASS:
  runtime position command suite (`10/10`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-75-runtime-close-position-sync-state-task-2026-05-04.md`.
- 2026-05-04 manual order action active-sync-state slice `RUNTIME-AUDIT-74`
  is closed locally. Manual `cancelOrder` and `closeOrder` now require
  `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open-status rows cannot be
  canceled, filled, or used to close linked positions through direct API
  actions after runtime/dashboard has stopped treating them as active.
  Validation PASS: orders service suite (`31/31`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-74-order-actions-active-sync-state-task-2026-05-04.md`.
- 2026-05-04 orders list active-sync-state slice `RUNTIME-AUDIT-73` is closed
  locally. Dashboard/order list active-status queries now require
  `syncState=IN_SYNC` for `PENDING`, `OPEN`, and `PARTIALLY_FILLED`, so stale
  `ORPHAN_LOCAL` open-status rows no longer appear as active order-list truth
  while unfiltered history and terminal status filters remain available.
  Validation PASS: orders service suite (`29/29`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-73-orders-list-active-sync-state-task-2026-05-04.md`.
- 2026-05-04 runtime order lifetime active-sync-state slice
  `RUNTIME-AUDIT-72` is closed locally. Runtime order lifetime cancellation
  candidates now require `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL`
  open-status order rows no longer generate cancel attempts or dedupe noise
  while stale confirmed active rows remain cancelable. Validation PASS:
  runtime order lifetime suite (`5/5`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-72-order-lifetime-active-sync-state-task-2026-05-04.md`.
- 2026-05-04 paper wallet reset active-order blocker slice `RUNTIME-AUDIT-71`
  is closed locally. Paper wallet reset now counts active open-order blockers
  only when `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open-order rows no
  longer block reset after runtime/dashboard has stopped treating them as
  active. Active `IN_SYNC` open orders still block reset. Validation PASS:
  wallet e2e (`19/19`), API typecheck, repository guardrails, lint, and diff
  review. Evidence:
  `history/audits/runtime-audit-71-wallet-reset-active-order-sync-state-task-2026-05-04.md`.
- 2026-05-04 stale synced open-order visibility slice `RUNTIME-AUDIT-70` is
  closed locally. Runtime open-order reads now require `syncState=IN_SYNC`, so
  existing `ORPHAN_LOCAL` exchange-synced rows no longer inflate dashboard
  `openOrdersCount`; reconciliation stale-order marking now also moves stale
  synced orders to non-open `CANCELED`. Validation PASS: runtime-scope e2e
  (`15/15`), live reconciliation suite (`28/28`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-70-hide-stale-open-orders-task-2026-05-04.md`.
- 2026-05-04 LIVE open-order upsert owner-scope slice `RUNTIME-AUDIT-69` is
  closed locally. Exchange-synced open-order upsert now searches existing rows
  only within the same bot or same botless wallet context before updating or
  blocking, so an unrelated wallet-null/botless `exchangeOrderId` collision
  cannot steal the update or prevent the owning bot/wallet row from being
  created. Validation PASS: live reconciliation suite (`27/27`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-69-open-order-upsert-owner-scope-task-2026-05-04.md`.
- 2026-05-03 LIVE botless open-order wallet-proof slice
  `RUNTIME-AUDIT-68` is closed locally. Runtime session positions now require
  exact wallet proof before including botless LIVE `EXCHANGE_SYNC` open orders
  through the external-owned order fallback, so stale/global wallet-null rows
  cannot be counted on the dashboard only because they share an owned symbol.
  Bot-scoped wallet-null orders remain visible through the existing bot-scoped
  filter. Validation PASS: runtime-scope e2e (`14/14`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-68-live-open-order-wallet-proof-task-2026-05-03.md`.
- 2026-05-03 market-scoped imported external ID query-filter slice
  `RUNTIME-AUDIT-67` is closed locally. Market-known imported-position queries
  now filter canonical rows by `apiKey:marketType:` and legacy rows by
  `apiKey:symbol:` instead of broad `apiKey:` prefixes. This covers runtime
  dashboard position/trade reads, pre-trade guards, runtime loop open-count
  guards, execution no-flip reuse, and order conflict/fill reuse. Validation
  PASS: runtime loop defaults (`10/10`), live reconciliation (`26/26`),
  pre-trade service (`17/17`), orders service (`28/28`), runtime position
  command (`9/9`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-67-market-scoped-external-id-query-filters-task-2026-05-03.md`.
- 2026-05-03 external-ID market ownership read slice `RUNTIME-AUDIT-66` is
  closed locally. Takeover rebind/status, imported runtime ownership hydration,
  and runtime loop managed-external guards now parse canonical
  `apiKey:marketType:symbol:side` IDs and pass the parsed market type into
  ownership lookup instead of defaulting SPOT rows to FUTURES. Legacy
  `apiKey:symbol:side` fallback remains intact. Validation PASS: runtime loop
  defaults suite (`10/10`), live reconciliation suite (`26/26`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-66-parse-external-id-market-ownership-task-2026-05-03.md`.
- 2026-05-03 market-scoped imported external ID slice `RUNTIME-AUDIT-65` is
  closed locally. LIVE reconciliation now writes imported position external IDs
  as `apiKey:marketType:symbol:side` whenever the synced API-key work item
  carries market type, and helper parsing/stale-symbol extraction remain
  compatible with legacy `apiKey:symbol:side` rows. Reconciliation checks the
  legacy ID before creating a new row, so old imports can be upgraded to the
  canonical ID instead of duplicated. Validation PASS: live reconciliation
  suite (`26/26`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-65-market-scoped-external-position-id-task-2026-05-03.md`.
- 2026-05-03 external ownership market-type slice `RUNTIME-AUDIT-64` is closed
  locally. External takeover ownership now scopes by
  `apiKey + marketType + symbol`, with candidate market type resolved from
  wallet/bot/active market-group context and known market type propagated from
  reconciliation, runtime dashboard reads, pre-trade, order conflict/fill, and
  runtime loop call sites. Legacy callers without market type keep FUTURES
  semantics, and legacy injected ownership maps remain read-compatible.
  Validation PASS: ownership regression suite (`10/10`), live reconciliation
  suite (`25/25`), runtime loop defaults suite (`9/9`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-64-external-ownership-market-type-task-2026-05-03.md`.
- 2026-05-03 LIVE reconciliation market-type slice `RUNTIME-AUDIT-63` is
  closed locally. The exchange reconciliation worker now derives synced API-key
  work items from LIVE wallets and active LIVE bots, preserving one work item
  per required market type, and passes that market type into exchange position,
  open-order, trade-history, and owned automation snapshot paths. This removes
  the previous FUTURES-only snapshot assumption that could hide SPOT
  assigned-market manual positions from import. Validation PASS: live position
  reconciliation unit suite (`25/25`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-63-live-reconciliation-market-type-task-2026-05-03.md`.
- 2026-05-03 planned dynamic-stop API visibility slice `RUNTIME-AUDIT-62`
  is closed locally. Runtime session positions now expose
  `showDynamicStopColumns=true` when an open row has planned trailing
  take-profit or trailing stop levels before the dynamic stop is armed, keeping
  the API contract aligned with dashboard row truth and avoiding hidden pre-arm
  TTP/TSL management columns. Focused operator-truth tests were also adjusted
  to use symbols inside the assigned bot market group, matching production
  scoping rules. Validation PASS: dynamic-stop operator truth e2e (`3/3`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-62-planned-dynamic-stop-columns-task-2026-05-03.md`.
- 2026-05-03 dashboard dynamic-stop plan visibility slice
  `RUNTIME-AUDIT-61` is closed locally. Dashboard home and Bots monitoring now
  share `hasRuntimeDynamicStopRowTruth`, so TTP/TSL columns stay visible when
  an open row has dynamic stop prices, derived protected percentages, or
  planned trailing levels before arm. This prevents dashboard home from hiding
  pre-arm TTP/TSL plans that Bots monitoring already treats as row truth.
  Validation PASS: focused web regression pack (`33/33`), web typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-61-dashboard-dynamic-stop-plan-visibility-task-2026-05-03.md`.
- 2026-05-03 aggregate running session metadata overlap slice
  `RUNTIME-AUDIT-60` is closed locally. Runtime monitoring aggregate
  `sessionDetail.durationMs` and `sessionDetail.eventsCount` now sum all
  non-running historical session rows plus only the freshest RUNNING session
  projection, so overlapping running sessions no longer double-count active
  runtime duration or active event count. `sessionsCount` and `symbolsTracked`
  remain unchanged as diagnostic/configured-scope metadata. Validation PASS:
  aggregate e2e (`18/18`), runtime-scope e2e (`13/13`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-60-aggregate-running-session-metadata-overlap-task-2026-05-03.md`.
- 2026-05-03 aggregate running symbol-summary overlap slice
  `RUNTIME-AUDIT-59` is closed locally. Runtime monitoring aggregate
  symbol items and `symbolStats.summary` now sum all non-running historical
  session rows plus only the freshest RUNNING session projection, so
  overlapping running sessions no longer double-count market/signal counters,
  closed-trade counters, gross PnL, or symbol fees. Validation PASS: aggregate
  e2e (`17/17`), runtime-scope e2e (`13/13`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-59-aggregate-running-symbol-summary-overlap-task-2026-05-03.md`.
- 2026-05-03 aggregate running closed-position overlap slice
  `RUNTIME-AUDIT-58` is closed locally. Runtime monitoring aggregate
  closed-position counts, realized PnL, and position fees now sum all
  non-running historical session rows plus only the freshest RUNNING session
  projection, so overlapping running sessions no longer show one visible
  history row with doubled closed totals. Validation PASS: aggregate e2e
  (`16/16`), runtime-scope e2e (`13/13`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-58-aggregate-running-closed-position-overlap-task-2026-05-03.md`.
- 2026-05-03 aggregate symbol open-state overlap slice `RUNTIME-AUDIT-57`
  is closed locally. Runtime monitoring aggregate symbol items and summary now
  keep historical symbol counters summed while taking current open-position
  count, quantity, and unrealized PnL from the newest per-symbol snapshot, so
  overlapping RUNNING sessions no longer make market/signal summaries disagree
  with positions current-state truth. Validation PASS: aggregate e2e (`15/15`),
  runtime-scope e2e (`13/13`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-57-aggregate-symbol-open-overlap-task-2026-05-03.md`.
- 2026-05-03 aggregate running-trade overlap slice `RUNTIME-AUDIT-56` is
  closed locally. Runtime monitoring aggregate trade totals and fees now sum
  all non-running historical session totals plus only the freshest RUNNING
  session projection, so overlapping running sessions no longer show one
  visible trade row with doubled `trades.total` or fee summary. Validation
  PASS: aggregate e2e (`15/15`), runtime-scope e2e (`13/13`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-56-aggregate-running-trade-overlap-task-2026-05-03.md`.
- 2026-05-03 aggregate total-position overlap slice `RUNTIME-AUDIT-55` is
  closed locally. Runtime monitoring aggregate `positions.total` now derives
  from the final aggregate `openCount + closedCount` after current open-count
  composition, so overlapping running sessions cannot leave `total` higher
  than the displayed aggregate counts. Validation PASS: aggregate e2e
  (`14/14`), runtime-scope e2e (`13/13`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-55-aggregate-total-position-overlap-task-2026-05-03.md`.
- 2026-05-03 aggregate open-position overlap slice `RUNTIME-AUDIT-54` is
  closed locally. Runtime monitoring aggregate now treats current open-position
  count, open quantity, and unrealized PnL as freshest session current-state
  truth instead of summing overlapping session read models, so one open
  position does not appear as two positions or doubled unrealized PnL when two
  running sessions overlap. Validation PASS: overlapping-session aggregate e2e
  (`14/14`), runtime-scope e2e (`13/13`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-54-aggregate-open-position-overlap-task-2026-05-03.md`.
- 2026-05-03 portfolio close-point history limit slice `RUNTIME-AUDIT-53`
  is closed locally. Bot portfolio history now composes chart close points from
  full scoped closed-position DB truth instead of capped monitoring aggregate
  visible rows, so `points`, closed-position count, and realized PnL remain
  aligned when a bot has more than 500 closed positions. Validation PASS:
  501-close portfolio history e2e (`3/3`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-53-portfolio-history-close-points-limit-task-2026-05-03.md`.
- 2026-05-03 aggregate symbols-tracked limit slice `RUNTIME-AUDIT-52` is
  closed locally. Runtime monitoring aggregate `sessionDetail.symbolsTracked`
  now composes full session metadata instead of visible aggregate symbol rows,
  so `perSessionLimit` no longer makes dashboard aggregate metadata understate
  how many markets the bot tracked. Validation PASS: failing-then-passing
  `perSessionLimit=1` symbols-tracked regression, monitoring aggregate e2e
  (`13/13`), runtime-scope e2e (`13/13`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-52-aggregate-symbols-tracked-limit-task-2026-05-03.md`.
- 2026-05-03 aggregate symbol-stats summary limit slice `RUNTIME-AUDIT-51`
  is closed locally. Runtime monitoring aggregate now keeps visible
  `symbolStats.items` limited while composing `symbolStats.summary` and
  aggregate header signal counters from per-session summary truth, so
  `perSessionLimit` no longer hides assigned symbols from aggregate signal and
  PnL totals. Validation PASS: failing-then-passing `perSessionLimit=1`
  aggregate symbol-stats summary regression, monitoring aggregate e2e
  (`13/13`), runtime-scope e2e (`13/13`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-51-aggregate-symbol-stats-summary-limit-task-2026-05-03.md`.
- 2026-05-03 symbol-stats open-summary limit slice `RUNTIME-AUDIT-50` is
  closed locally. Runtime session symbol-stats now keep visible `items`
  limited while composing live open-position summary metrics from the full
  configured symbol scope, so dashboard market/signal summaries no longer hide
  open positions, quantities, or persisted unrealized PnL from assigned symbols
  outside the visible page. Validation PASS: failing-then-passing `limit=1`
  symbol-stats open summary regression, runtime-scope e2e (`13/13`),
  monitoring aggregate e2e (`12/12`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-50-symbol-stats-open-summary-limit-task-2026-05-03.md`.
- 2026-05-03 aggregate open-order count limit slice `RUNTIME-AUDIT-49` is
  closed locally. Runtime monitoring aggregate `positions.openOrdersCount`
  now composes full current-state session open-order count truth using the
  maximum session count instead of limited visible aggregate rows, so the
  dashboard count stays truthful when `perSessionLimit` hides older open
  orders without double-counting the same current open orders across multiple
  sessions. Validation PASS: failing-then-passing `perSessionLimit=1`
  aggregate open-order count regression, monitoring aggregate e2e (`12/12`),
  runtime-scope e2e (`12/12`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-49-aggregate-open-orders-count-limit-task-2026-05-03.md`.
- 2026-05-03 runtime open-order count limit slice `RUNTIME-AUDIT-48` is
  closed locally. Runtime session positions now return a full deduped
  `openOrdersCount` separately from limited visible `openOrders`, so dashboard
  open-order counts remain truthful when `limit` hides older scoped orders.
  Duplicate local/exchange open orders still dedupe through the existing
  preference rules. Validation PASS: failing-then-passing `limit=1`
  open-order count regression, runtime-scope e2e (`12/12`), monitoring
  aggregate e2e (`11/11`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-48-open-orders-count-limit-task-2026-05-03.md`.
- 2026-05-03 aggregate position-fee limit slice `RUNTIME-AUDIT-47` is
  closed locally. Runtime monitoring aggregate `positions.summary.feesPaid`
  now composes per-session positions summaries instead of limited visible
  aggregate rows, so aggregate positions/wallet fee totals remain truthful
  when `perSessionLimit` hides older positions. Visible rows remain limited.
  Validation PASS: failing-then-passing `perSessionLimit=1` aggregate
  position-fee regression, runtime-scope e2e (`12/12`), monitoring aggregate
  e2e (`11/11`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-47-aggregate-position-fees-limit-task-2026-05-03.md`.
- 2026-05-03 runtime unrealized-PnL limit slice `RUNTIME-AUDIT-46` is
  closed locally. Runtime session positions now aggregate scoped persisted
  open-position `unrealizedPnl`, and monitoring aggregate composes
  unrealized PnL from per-session position summaries instead of limited
  visible open rows. Dashboard PnL summaries now remain truthful when
  `limit` / `perSessionLimit` hides older open positions while visible rows
  keep their existing dynamic display behavior. Validation PASS:
  failing-then-passing `perSessionLimit=1` unrealized-PnL regression,
  runtime-scope e2e (`12/12`), monitoring aggregate e2e (`11/11`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-46-position-unrealized-pnl-limit-task-2026-05-03.md`.
- 2026-05-03 runtime position-fee limit slice `RUNTIME-AUDIT-45` is
  closed locally. Runtime session positions now aggregate direct trade fees
  through the full scoped position set instead of limited visible position
  rows, so dashboard `positions.summary.feesPaid` remains truthful when
  `limit` / `perSessionLimit` hides older positions. Visible `openItems` and
  `historyItems` remain limited. Validation PASS: failing-then-passing
  `limit=1` position-fee regression, runtime-scope e2e (`12/12`),
  monitoring aggregate e2e (`11/11`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-45-position-fees-limit-task-2026-05-03.md`.
- 2026-05-03 aggregate trade-fee limit slice `RUNTIME-AUDIT-44` is
  closed locally. Runtime session trades now expose unpaginated scoped
  `feesPaid`, and monitoring aggregate `sessionDetail.summary.feesPaid`
  composes those session fee totals instead of limited visible trade rows.
  Dashboard fee summaries now remain truthful when `perSessionLimit` hides
  older trades while visible trade rows remain limited. Validation PASS:
  failing-then-passing `perSessionLimit=1` trade-fee regression,
  runtime-scope e2e (`12/12`), monitoring aggregate e2e (`11/11`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-44-aggregate-trade-fees-limit-task-2026-05-03.md`.
- 2026-05-03 runtime free-cash hidden-margin slice `RUNTIME-AUDIT-43` is
  closed locally. Runtime session positions now use scoped persisted
  open-position `marginUsed` as the primary used-margin input for capital
  summary, so dashboard `positions.summary.freeCash` no longer overstates
  available cash when `limit` / `perSessionLimit` hides older open rows.
  Visible open rows remain limited, with visible-row modeled margin retained as
  fallback when no persisted margin exists. Validation PASS:
  failing-then-passing hidden-margin free-cash regression, runtime-scope e2e
  (`12/12`), monitoring aggregate e2e (`11/11`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-43-free-cash-open-margin-limit-task-2026-05-03.md`.
- 2026-05-03 aggregate open-position quantity limit slice
  `RUNTIME-AUDIT-42` is closed locally. Runtime session positions now expose
  scoped `summary.openPositionQty`, and monitoring aggregate
  `sessionDetail.summary.openPositionQty` composes that session truth instead
  of limited visible open rows. Dashboard open-position quantity now remains
  truthful when `perSessionLimit` hides older open positions while visible row
  lists remain limited. Validation PASS: failing-then-passing
  `perSessionLimit=1` open-quantity regression, runtime-scope e2e (`12/12`),
  monitoring aggregate e2e (`11/11`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-42-open-position-qty-limit-task-2026-05-03.md`.
- 2026-05-03 runtime position realized-PnL limit slice `RUNTIME-AUDIT-41`
  is closed locally. Runtime session positions now aggregate realized PnL from
  all scoped closed positions instead of only visible history rows, and
  monitoring aggregate summaries compose those session position summaries. This
  keeps dashboard realized PnL truthful when `limit` / `perSessionLimit` hides
  older closed positions while visible row lists remain limited. Validation
  PASS: failing-then-passing `limit=1` realized-PnL regression, runtime-scope
  e2e (`12/12`), monitoring aggregate e2e (`10/10`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-41-position-realized-pnl-limit-task-2026-05-03.md`.
- 2026-05-03 runtime position count limit slice `RUNTIME-AUDIT-40` is
  closed locally. Runtime session positions and monitoring aggregate position
  metadata now use true scoped open/closed position counts instead of limited
  visible row counts, so dashboard `positions.total`, `openCount`, and
  `closedCount` stay truthful when `limit` / `perSessionLimit` hides older
  rows. Visible `openItems` / `historyItems` remain limited. Validation PASS:
  failing-then-passing `limit=1` regression, runtime-scope e2e (`12/12`),
  monitoring aggregate e2e (`10/10`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-40-position-count-limit-task-2026-05-03.md`.
- 2026-05-03 aggregate trade-total limit slice `RUNTIME-AUDIT-39` is
  closed locally. Runtime monitoring aggregate `trades.total` and
  `trades.meta.total` now sum the true per-session trade totals instead of the
  limited visible aggregate row count, so dashboard trade activity counts stay
  truthful when `perSessionLimit` hides older rows. Visible `trades.items`
  remain limited, with pagination metadata exposing hidden rows via
  `hasNext`. Validation PASS: failing-then-passing `perSessionLimit=1`
  regression, full monitoring aggregate e2e (`10/10`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-39-aggregate-trade-total-limit-task-2026-05-03.md`.
- 2026-05-03 non-running aggregate end-time slice `RUNTIME-AUDIT-38`
  is closed locally. Runtime monitoring aggregate `sessionDetail.finishedAt`
  now uses the same non-running session window-end fallback as nested runtime
  reads (`finishedAt ?? lastHeartbeatAt ?? startedAt`), so failed/canceled
  aggregate metadata no longer shows `finishedAt: null` while positions/trades
  windows have a concrete end. RUNNING aggregate still reports
  `finishedAt: null`. Validation PASS: failing-then-passing failed-session
  end-time regression, full monitoring aggregate e2e (`9/9`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-38-aggregate-non-running-window-end-task-2026-05-03.md`.
- 2026-05-03 empty aggregate heartbeat slice `RUNTIME-AUDIT-37` is
  closed locally. Empty runtime monitoring aggregate payloads now return
  `sessionDetail.lastHeartbeatAt: null` when no runtime sessions exist, so the
  dashboard no longer receives a false fresh-heartbeat timestamp alongside
  `sessionsCount: 0`. Non-empty aggregate heartbeat behavior remains
  session-derived. Validation PASS: failing-then-passing empty aggregate
  heartbeat regression, full monitoring aggregate e2e (`8/8`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-37-empty-aggregate-heartbeat-task-2026-05-03.md`.
- 2026-05-03 aggregate header position-PnL parity slice
  `RUNTIME-AUDIT-36` is closed locally. Runtime monitoring aggregate header
  `sessionDetail.summary.realizedPnl` now reuses the scoped positions summary,
  so imported or externally closed positions with canonical position PnL but no
  local trade rows no longer disappear from the dashboard aggregate header.
  Trade-backed fee behavior is unchanged. Validation PASS:
  failing-then-passing imported closed position PnL regression, full monitoring
  aggregate e2e (`8/8`), runtime history parity e2e (`6/6`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-36-aggregate-position-summary-pnl-task-2026-05-03.md`.
- 2026-05-03 empty running aggregate timestamp slice `RUNTIME-AUDIT-35`
  is closed locally. Empty runtime monitoring aggregate payloads now set
  `sessionDetail.finishedAt: null` when the effective empty aggregate status is
  `RUNNING`, preventing dashboard metadata from saying an empty running view is
  already finished. Default empty completed metadata remains deterministic.
  Validation PASS: failing-then-passing empty `status=RUNNING` regression,
  full monitoring aggregate e2e (`7/7`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-35-empty-aggregate-running-finished-at-task-2026-05-03.md`.
- 2026-05-03 empty runtime monitoring aggregate mode slice
  `RUNTIME-AUDIT-34` is closed locally. Empty runtime monitoring aggregate
  payloads now preserve the selected bot's persisted mode instead of
  hardcoding `PAPER`, so LIVE bots without runtime sessions no longer render
  misleading paper-mode aggregate metadata. Non-empty aggregate mode
  resolution remains session-derived. Validation PASS: failing-then-passing
  LIVE empty aggregate mode regression, full monitoring aggregate e2e (`6/6`),
  API typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-34-empty-aggregate-mode-task-2026-05-03.md`.
- 2026-05-03 imported open trade anchor effective-strategy slice
  `RUNTIME-AUDIT-33` is closed locally. Runtime trade synthetic
  `position-open:*` anchors now resolve the single canonical strategy from
  active bot market-group links when an imported open position has
  `strategyId: null`, so dashboard runtime trades and aggregate telemetry keep
  strategy provenance aligned with the bot configuration. Ambiguous
  multi-strategy provenance remains unassigned. Validation PASS:
  failing-then-passing imported strategy-null open anchor regression, full
  runtime history parity e2e (`6/6`), runtime-scope e2e (`12/12`),
  runtime-strategy-context e2e (`5/5`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-33-trade-anchor-effective-strategy-task-2026-05-03.md`.
- 2026-05-03 runtime automation skip effective-strategy telemetry slice
  `RUNTIME-AUDIT-32` is closed locally. Runtime automation
  `PRETRADE_BLOCKED` skip telemetry now accepts the same effective strategy
  provenance used by lifecycle decisions, so imported or strategy-null LIVE
  positions with one canonical strategy link keep fail-closed dashboard event
  attribution aligned with their configured strategy. Ambiguous multi-strategy
  provenance remains unassigned. Validation PASS: failing-then-passing
  imported strategy-null skip telemetry regression, full runtime position
  automation service tests (`36/36`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-32-skip-telemetry-effective-strategy-task-2026-05-03.md`.
- 2026-05-03 DCA block effective-strategy telemetry slice
  `RUNTIME-AUDIT-31` is closed locally. Runtime DCA funds-exhausted
  `PRETRADE_BLOCKED` telemetry now uses the same effective strategy provenance
  resolved for lifecycle decisions, so imported or strategy-null bot positions
  with one canonical strategy link keep dashboard/runtime event attribution
  aligned with their configured strategy. Validation PASS:
  failing-then-passing imported strategy-null DCA block telemetry regression,
  full runtime position automation service tests (`35/35`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-31-dca-block-effective-strategy-telemetry-task-2026-05-03.md`.
- 2026-05-03 live reconciliation open-order protection slice
  `RUNTIME-AUDIT-30` is closed locally. Owned exchange open orders now protect
  both possible local position sides for the same symbol during stale local
  LIVE position reconciliation, so a pending same-symbol close/order lifecycle
  cannot let the bot close local state before the exchange order resolves.
  Unrelated stale local positions still close after the grace window.
  Validation PASS: failing-then-passing same-symbol open-order protection
  regression, full live reconciliation service tests (`24/24`), sequential
  runtime takeover e2e (`4/4`), sequential runtime-scope e2e (`12/12`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-30-live-reconcile-open-order-symbol-protection-task-2026-05-03.md`.
- 2026-05-03 runtime open-order dedupe limit slice `RUNTIME-AUDIT-29` is
  closed locally. Runtime session `openOrders` now read a bounded candidate set
  before exchange/local dedupe and apply the dashboard `limit` after dedupe, so
  duplicate rows sharing an `exchangeOrderId` cannot hide distinct open orders
  from the dashboard. Validation PASS: failing-then-passing `limit=2`
  duplicate-order regression, focused runtime-scope e2e (`12/12`), broader
  bots e2e (`26/26`), API typecheck, repository guardrails, lint, and diff
  review. Evidence:
  `history/audits/runtime-audit-29-runtime-open-orders-dedupe-limit-task-2026-05-03.md`.
- 2026-05-03 runtime positions open/history limit slice `RUNTIME-AUDIT-28`
  is closed locally. Runtime session positions now read open and closed
  bot-managed rows as separate scoped collections before serialization, so a
  newer history row cannot hide an older open position from the dashboard when
  the request uses a small `limit`. Validation PASS: failing-then-passing
  `limit=1` open/history regression, focused runtime-scope e2e (`11/11`),
  broader bots e2e (`26/26`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `history/audits/runtime-audit-28-runtime-positions-open-history-limit-task-2026-05-03.md`.
- 2026-05-03 runtime symbol-stats configured-limit slice `RUNTIME-AUDIT-27`
  is closed locally. Unfiltered selected-bot symbol-stats now select display
  rows from configured symbol order and then hydrate persisted stats for that
  exact symbol set, preventing top-PnL DB ordering from rendering a configured
  dashboard signal row with zero totals when its stat row exists. Explicit
  symbol filters and off-scope empty behavior remain unchanged. Validation
  PASS: failing-then-passing configured-order `limit=1` regression, focused
  bots e2e (`26/26`), broader runtime/read pack (`42/42`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-27-symbol-stats-configured-limit-task-2026-05-03.md`.
- 2026-05-03 runtime position symbol-level strategy display slice
  `RUNTIME-AUDIT-26` is closed locally. Runtime position reads now surface
  canonical symbol-level DCA/TTP/TSL display plans for strategy-null positions
  when active `BotMarketGroup` / `MarketGroupStrategyLink` scope resolves the
  selected symbol, while keeping `actionable` fail-closed without an
  executable strategy identity and preserving the stale legacy fallback guard.
  Validation PASS: failing-then-passing canonical strategy-null TTP regression
  and focused runtime strategy context e2e (`5/5`), broader bot runtime/read
  pack (`37/37`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-26-runtime-position-symbol-strategy-display-task-2026-05-03.md`.
- 2026-05-03 market universe input normalization slice `RUNTIME-AUDIT-25` is
  closed locally. Market universe create/update DTOs now normalize
  `baseCurrency`, `whitelist`, and `blacklist` at the API boundary, so
  dashboard/source-of-truth market scopes persist canonical uppercase values
  while preserving operator-provided first occurrence order for symbol lists.
  Validation PASS: failing-then-passing lowercase market universe regression,
  focused markets e2e (`16/16`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `history/audits/runtime-audit-25-market-universe-symbol-normalization-task-2026-05-03.md`.
- 2026-05-03 order list symbol normalization slice `RUNTIME-AUDIT-24` is
  closed locally. Dashboard order list `symbol` filters now normalize to
  uppercase at the DTO boundary, so operator/API requests such as
  `symbol=ethusdt` find owned persisted `ETHUSDT` orders instead of rendering
  an empty orders table. Validation PASS: failing-then-passing lowercase
  symbol filter regression, focused orders/positions read e2e (`21/21`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-24-order-list-symbol-normalization-task-2026-05-03.md`.
- 2026-05-03 position list symbol normalization slice `RUNTIME-AUDIT-23` is
  closed locally. Dashboard position list `symbol` filters now normalize to
  uppercase at the DTO boundary, so operator/API requests such as
  `symbol=ethusdt` find owned persisted `ETHUSDT` positions instead of
  rendering an empty positions table. Validation PASS: failing-then-passing
  lowercase symbol filter regression, focused positions list e2e, API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-23-position-list-symbol-normalization-task-2026-05-03.md`.
- 2026-05-03 wallet analytics date-range validation slice `RUNTIME-AUDIT-22`
  is closed locally. Wallet analytics `from` / `to` filters now fail closed at
  the DTO boundary when `from` is later than `to`, preventing misleading empty
  dashboard wallet analytics responses for invalid operator-supplied ranges.
  The service no longer needs a manual cashflow source cast because the query
  schema owns analytics filter typing. Validation PASS: failing-then-passing
  inverted date-range regression, focused wallets e2e (`18/18`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-22-wallet-analytics-date-range-task-2026-05-03.md`.
- 2026-05-03 wallet analytics source validation slice `RUNTIME-AUDIT-21` is
  closed locally. Wallet analytics `source` filters now validate against the
  canonical `WalletCashflowSource` enum at the DTO boundary, so invalid
  dashboard/URL filter values fail closed with `400` instead of reaching
  Prisma and returning `500`. Validation PASS: failing-then-passing invalid
  source regression, focused wallets e2e (`17/17`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-21-wallet-analytics-source-validation-task-2026-05-03.md`.
- 2026-05-03 wallet filtered timeline open-PnL slice `RUNTIME-AUDIT-20` is
  closed locally. Wallet equity timeline now attaches current owned-import
  open PnL only to the latest overall wallet snapshot point, not to the latest
  point of a filtered historical response. This keeps current wallet preview
  parity with performance summary without overstating past filtered timeline
  windows. Validation PASS: failing-then-passing filtered timeline regression,
  focused wallets e2e (`16/16`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `history/audits/runtime-audit-20-wallet-timeline-filtered-open-pnl-task-2026-05-03.md`.
- 2026-05-03 wallet equity timeline open-PnL slice `RUNTIME-AUDIT-19` is
  closed locally. Wallet equity timeline now reuses the selected wallet
  open-PnL scope for the latest point, so owned imported `LIVE` positions with
  `walletId=null` are reflected in current `botOpenPnl` / `botPnl` consistently
  with wallet performance summary. Earlier timeline points remain historical
  snapshot/cashflow points and do not receive current open PnL. Validation
  PASS: failing-then-passing wallet timeline regression, focused wallets e2e
  (`16/16`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-19-wallet-timeline-open-pnl-task-2026-05-03.md`.
- 2026-05-03 wallet owned-import open-PnL slice `RUNTIME-AUDIT-18` is closed
  locally. Wallet performance summary now includes selected `LIVE` wallet
  imported open positions with `walletId=null` when their `externalId` is
  owned by the wallet API key, while excluding other API keys and leaving
  balance snapshot, cashflow, and equity timeline contracts unchanged.
  Validation PASS: failing-then-passing wallet performance regression,
  focused wallets e2e (`15/15`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `history/audits/runtime-audit-18-wallet-owned-import-open-pnl-task-2026-05-03.md`.
- 2026-05-03 exchange-fill close fee attribution slice `RUNTIME-AUDIT-17` is
  closed locally. LIVE exchange order-trade close confirmation now aggregates
  entry-leg fees by the owned position lifecycle (`userId + positionId + entry
  side`) instead of mutable `botId` / `walletId` projections, matching the
  synchronous runtime orchestrator close contract. Imported or recovered LIVE
  positions with null identity projections now keep correct close PnL when the
  exchange fill confirms through a selected bot wallet. Validation PASS:
  focused exchange-events pack (`6/6`), broader orders/runtime PnL pack
  (`75/75`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `history/audits/runtime-audit-17-exchange-fill-close-fee-scope-task-2026-05-03.md`.
- 2026-05-03 selected LIVE bot open-order visibility slice
  `RUNTIME-AUDIT-16` is closed locally. Runtime positions dashboard reads now
  include direct selected-bot `BOT_MANAGED` open orders with legacy
  `walletId=null` rows in LIVE mode, matching the existing selected-bot
  compatibility scope for positions/trades while keeping `botId` ownership
  mandatory. Validation PASS: focused runtime takeover e2e (`4/4`), broader
  runtime positions/read pack (`33/33`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `history/audits/runtime-audit-16-live-open-order-wallet-null-task-2026-05-03.md`.
- 2026-05-03 runtime close fee attribution slice `RUNTIME-AUDIT-15` is
  closed locally. Runtime close realized-PnL now aggregates entry-leg fees by
  the owned position lifecycle (`userId + positionId + entry side`) instead of
  mutable `botId` / `walletId` projections. Imported or recovered LIVE
  positions with `botId=null` / `walletId=null` can now close through the
  selected bot wallet while still subtracting entry fees attached to the same
  position. Validation PASS: focused execution orchestrator pack (`17/17`),
  broader runtime/order/automation pack (`90/90`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `history/audits/runtime-audit-15-close-fee-position-scope-task-2026-05-03.md`.
- 2026-05-03 runtime EXIT owned-import lookup slice `RUNTIME-AUDIT-14` is
  closed locally. Runtime execution default open-position lookup now keeps the
  direct scoped query first, then resolves selected-bot owned `EXCHANGE_SYNC` /
  `BOT_MANAGED` imported open positions through wallet-first API-key ownership
  proof when the direct LIVE lookup misses. Legacy `walletId=null` imports can
  now be found for the same bot/wallet/symbol instead of producing incorrect
  `no_open_position`, while unowned imports remain invisible. Validation PASS:
  focused orchestrator pack (`18/18`), broader runtime/orders pack
  (`111/111`), typecheck, guardrails, lint, and diff check. Evidence:
  `history/audits/runtime-audit-14-exit-owned-import-lookup-task-2026-05-03.md`.
- 2026-05-03 filled LIVE order imported-position reuse slice
  `RUNTIME-AUDIT-13` is closed locally. Filled selected-bot `LIVE` orders now
  reuse same-side deterministically owned `EXCHANGE_SYNC` / `BOT_MANAGED`
  imported open positions when no direct scoped position exists, including
  legacy `botId=null/walletId=null` rows after ownership proof succeeds. The
  filled order and order fills attach to the imported position, quantity and
  weighted entry price update through existing fill math, and no duplicate
  open position is created. Validation PASS: focused orders pack (`28/28`),
  broader orders/e2e/pre-trade/final-candle/defaults pack (`90/90`),
  typecheck, guardrails, lint, and diff check. Evidence:
  `history/audits/runtime-audit-13-fill-lifecycle-owned-import-reuse-task-2026-05-03.md`.
- 2026-05-03 manual LIVE reverse-open imported-ownership slice
  `RUNTIME-AUDIT-12` is closed locally. Manual selected-bot `LIVE` opens now
  check deterministically owned exchange-synced `EXCHANGE_SYNC` /
  `BOT_MANAGED` imported open positions before exchange submission, including
  legacy imported rows persisted as `botId=null/walletId=null` after ownership
  proof succeeds. Opposite-side owned imports now fail closed with
  `OPEN_POSITION_SIDE_CONFLICT`; unowned, ambiguous, manual-only, or
  other-wallet imports remain non-blocking. Validation PASS: focused orders
  pack (`27/27`), broader orders/pre-trade/final-candle/defaults pack
  (`69/69`), typecheck, guardrails, lint, and diff check. Evidence:
  `history/audits/runtime-audit-12-live-manual-reverse-owned-import-task-2026-05-03.md`.
- 2026-05-03 final-candle external-position guard slice `RUNTIME-AUDIT-11`
  is closed locally. `EXTERNAL_POSITION_ALREADY_OPEN` runtime blocking now
  keys managed external positions by deterministic owner bot
  (`userId:botId:symbol`) instead of user-wide `userId:symbol`. Imported
  `botId=null` LIVE rows are owner-hydrated through the shared
  external-position ownership index, so one bot's exchange-synced position no
  longer blocks another bot's signal on the same symbol. Validation PASS:
  focused final-candle/defaults pack (`18/18`). Evidence:
  `history/audits/runtime-audit-11-final-candle-owned-external-bot-scope-task-2026-05-03.md`.
- 2026-05-03 pre-trade bot open-position cap slice `RUNTIME-AUDIT-10` is
  closed locally. `maxOpenPositionsPerBot` now counts direct selected-bot open
  positions plus deterministically owned LIVE `EXCHANGE_SYNC` / `BOT_MANAGED`
  imports for the same bot/wallet/API key. PAPER remains direct-bot scoped,
  and ambiguous/manual-only/unowned imports are not counted as bot exposure.
  Validation PASS: focused pre-trade pack (`24/24`). Evidence:
  `history/audits/runtime-audit-10-pretrade-bot-open-count-owned-imports-task-2026-05-03.md`.
- 2026-05-03 pre-trade bot-scoped symbol-uniqueness slice
  `RUNTIME-AUDIT-09` is closed locally. Pre-trade one-position-per-symbol
  checks now remain user-global only when no `botId` is provided; runtime bot
  decisions with `botId` check direct positions for that bot and owned LIVE
  exchange-synced imports for that bot/wallet. Another bot's open same-symbol
  position can no longer block a selected PAPER/LIVE bot from opening.
  Validation PASS: focused pre-trade pack (`23/23`), broader
  runtime/backtest decision pack (`88/88`), and API typecheck. Evidence:
  `history/audits/runtime-audit-09-pretrade-bot-scoped-symbol-uniqueness-task-2026-05-03.md`.
- 2026-05-03 external-position ownership catalog-scope slice
  `RUNTIME-AUDIT-08` is closed locally. External-position ownership proof now
  resolves active canonical bot market groups through the shared
  catalog-aware symbol resolver before building API-key+symbol ownership keys.
  Market-universe-backed groups with empty direct `symbols` but
  whitelist/filter catalog scope can now own and import all assigned exchange
  positions consistently with dashboard/runtime reads. Validation PASS:
  focused ownership regression (`9/9`), broader reconciliation/takeover pack
  (`41/41`), and API typecheck. Evidence:
  `history/audits/runtime-audit-08-external-position-ownership-catalog-scope-task-2026-05-03.md`.
- 2026-05-03 runtime position automation symbol-scope slice
  `RUNTIME-AUDIT-07` is closed locally. Runtime position automation now
  resolves an owned position's configured bot symbol scope from active
  canonical market assignment before strategy config loading, DCA funds
  checks, DCA execution, lifecycle price evaluation, or protection close
  orchestration. Stale directly owned positions outside the bot's active
  market scope are skipped with LIVE `PRETRADE_BLOCKED` telemetry reason
  `position_symbol_outside_configured_scope`. Validation PASS: focused
  automation/default-deps pack (`35/35`), broader close/ownership
  automation pack (`52/52`), and API typecheck. Evidence:
  `history/audits/runtime-audit-07-position-automation-canonical-symbol-scope-task-2026-05-03.md`.
- 2026-05-03 dashboard close command symbol-scope slice
  `RUNTIME-AUDIT-06` is closed locally. Dashboard runtime position close now
  resolves selected-bot configured symbols from active canonical market scope
  before ownership claim, strategy/wallet backfill, or close orchestration.
  Stale directly owned positions outside the bot's active market scope return
  the existing ignored `no_open_position` result instead of being closed.
  Validation PASS: focused close command regression (`9/9`) and broader
  close/runtime/imported-position pack (`74/74`). Evidence:
  `history/audits/runtime-audit-06-close-position-canonical-symbol-scope-task-2026-05-03.md`.
- 2026-05-03 selected-bot runtime row symbol-scope slice
  `RUNTIME-AUDIT-05` is closed locally. Runtime trade history and runtime
  positions now apply selected-bot active canonical configured symbols to
  filtered and unfiltered reads, reusing the shared catalog-aware resolver.
  Stale persisted `Trade.botId` and `Position.botId` rows for off-scope
  symbols can no longer appear in selected-bot dashboard history/open
  positions after market reassignment. Validation PASS: focused runtime-scope
  regression (`1/1`) and broader monitoring/positions pack (`57/57`).
  Evidence:
  `history/audits/runtime-audit-05-runtime-rows-canonical-symbol-scope-task-2026-05-03.md`.
- 2026-05-03 runtime trade-history symbol-scope slice
  `RUNTIME-AUDIT-04` is closed locally. Runtime trade history now resolves
  selected-bot configured symbols from active canonical `BotMarketGroup`
  scope through the shared catalog-aware resolver before honoring explicit
  `symbol` filters. Stale persisted `Trade.botId` rows for off-scope symbols
  can no longer appear in runtime trades or monitoring aggregate history after
  market reassignment. Validation PASS: focused runtime-scope regression
  (`1/1`) and broader monitoring pack (`45/45`). Evidence:
  `history/audits/runtime-audit-04-runtime-trades-canonical-symbol-scope-task-2026-05-03.md`.
- 2026-05-03 canonical update/symbol-filter scope slice
  `RUNTIME-AUDIT-03` is closed locally. Bot update defaults now treat an
  existing canonical market group with no enabled strategy links as
  non-actionable instead of falling back to disabled canonical links or direct
  legacy `Bot.strategyId`. Runtime symbol-stats now validates explicit
  `symbol` filters against the full selected-bot configured symbol scope
  before applying `limit`, preventing configured symbols later in the market
  list from disappearing in dashboard reads. Validation PASS: focused
  helper/reconciliation pack (`31/31`), focused monitoring filter e2e (`1/1`),
  and broader bot/runtime/position pack (`68/68`). Evidence:
  `history/audits/runtime-audit-03-canonical-update-and-symbol-filter-scope-task-2026-05-03.md`.
- 2026-05-03 manual-order canonical group fallback slice `ORDDRIFT-01` is
  closed locally. Manual-order strategy context now evaluates active canonical
  groups first and blocks direct/legacy strategy fallback whenever such groups
  exist but do not resolve the requested symbol. Stale direct bot strategy
  projections can no longer alter manual-order preview leverage, margin mode,
  or order type after canonical market reassignment. Validation PASS: focused
  orders service test (`26/26`) and broader orders/manual pack (`49/49`).
  Evidence:
  `history/tasks/orddrift-01-manual-context-canonical-group-no-direct-fallback-task-2026-05-03.md`.
- 2026-05-03 empty canonical strategy-link topology slice
  `RUNTIME-AUDIT-02` is closed locally. Runtime signal-loop topology and
  symbol-stats configured context now use direct legacy `Bot.strategyId` only
  when no active canonical market group exists. If an active canonical
  `BotMarketGroup` exists with no enabled `MarketGroupStrategyLink` rows,
  runtime context is non-actionable and dashboard configured strategy context
  remains empty. Validation PASS: focused defaults/symbol-stats tests
  (`11/11`) and broader runtime/symbol-stats pack (`78/78`). Evidence:
  `history/audits/runtime-audit-02-empty-canonical-strategy-links-task-2026-05-03.md`.
- 2026-05-03 symbol-stats filter scope slice `DASHDRIFT-05` is closed
  locally. Explicit `symbol` filters on runtime symbol-stats now intersect
  with the selected bot's active canonical configured symbols and return an
  empty zero-summary response when the requested symbol is outside scope.
  Stale persisted stats for old/off-scope markets can no longer appear through
  a direct symbol query. Validation PASS: focused runtime-scope e2e (`10/10`)
  and broader symbol-stats/market-universe/PnL pack (`25/25`). Evidence:
  `history/tasks/dashdrift-05-symbol-stats-filter-canonical-scope-task-2026-05-03.md`.
- 2026-05-03 symbol-level dynamic-stop plan slice `DASHDRIFT-04` is closed
  locally. Runtime TTP/TSL plan maps by symbol now keep active canonical
  `BotMarketGroup` / `MarketGroupStrategyLink` entries authoritative and let
  legacy `BotStrategy` rows fill only symbols without canonical entries. Stale
  legacy advanced-close rows can no longer overwrite canonical basic-close
  symbol plans. Validation PASS: focused runtime strategy-context e2e (`4/4`)
  and broader bot runtime/dynamic-stop pack (`40/40`). Evidence:
  `history/tasks/dashdrift-04-symbol-dynamic-stop-plans-canonical-task-2026-05-03.md`.
- 2026-05-03 dashboard dynamic-stop column slice `DASHDRIFT-03` is closed
  locally. Runtime position dashboard `showDynamicStopColumns` now evaluates
  active canonical `BotMarketGroup` / `MarketGroupStrategyLink` strategy
  configs when present, using legacy `BotStrategy` rows only as compatibility
  fallback when no canonical topology exists. Stale legacy advanced-close rows
  can no longer turn on TTP/TSL columns for a canonical basic-close bot view.
  Validation PASS: focused runtime strategy-context e2e (`3/3`) and broader
  bot runtime/dynamic-stop pack (`31/31`). Evidence:
  `history/tasks/dashdrift-03-dynamic-stop-columns-canonical-task-2026-05-03.md`.
- 2026-05-03 LIVE reconciliation continuity strategy slice `POSDRIFT-12` is
  closed locally. LIVE exchange reconciliation now resolves recovered/imported
  bot continuity strategy through active canonical `BotMarketGroup` and enabled
  `MarketGroupStrategyLink` rows before direct legacy `Bot.strategyId`. Stale
  direct strategy projection can no longer label imported/recovered LIVE
  exchange-synced rows when canonical topology exists. Validation PASS:
  focused reconciliation test (`23/23`) and wider
  position/reconciliation/automation pack (`29/29`). Evidence:
  `history/tasks/posdrift-12-live-continuity-canonical-strategy-task-2026-05-03.md`.
- 2026-05-03 bot update safety guard slice `BOTDRIFT-02` is closed locally.
  Bot activation/update duplicate guard and LIVE overlap guard now derive
  default target strategy/market scope from active canonical `BotMarketGroup`
  and enabled `MarketGroupStrategyLink` rows before direct legacy bot fields.
  Stale direct `Bot.strategyId` / `Bot.symbolGroupId` can no longer let update
  activation bypass canonical duplicate checks. Validation PASS: focused
  duplicate guard (`6/6`) and wider bot write/runtime pack (`43/43`).
  Evidence:
  `history/tasks/botdrift-02-bot-update-canonical-guard-task-2026-05-03.md`.
- 2026-05-03 bot read projection slice `BOTDRIFT-01` is closed locally.
  `GET /dashboard/bots` and `GET /dashboard/bots/:id` now overlay canonical
  primary `BotMarketGroup` / `MarketGroupStrategyLink` context onto response
  `strategyId`, `strategy`, `symbolGroupId`, and `symbolGroup` before direct
  legacy bot projections. Stale direct `Bot.strategyId` can no longer feed
  dashboard and bot-management read models when canonical topology exists.
  Validation PASS: bot runtime-scope e2e (`10/10`) and wider bot pack
  (`41/41`). Evidence:
  `history/tasks/botdrift-01-bot-read-projection-canonical-context-task-2026-05-03.md`.
- 2026-05-03 dashboard position-edit strategy display slice `DASHDRIFT-02`
  is closed locally. The position edit modal in `HomeLiveWidgets` now resolves
  strategy labels from selected bot `runtime-graph` market groups and strategy
  links before direct legacy `Bot.strategy`. Stale direct bot strategy
  projections can no longer override canonical runtime strategy display in
  that position-management modal. Validation PASS: focused HomeLiveWidgets
  regression (`18/18`). Evidence:
  `history/tasks/dashdrift-02-position-edit-strategy-display-task-2026-05-03.md`.
- 2026-05-03 legacy open-position repair slice `POSDRIFT-11` is closed
  locally. Local repair of open `BOT` / `USER` positions without `botId` now
  matches candidate bots through active canonical `BotMarketGroup.symbolGroup`
  symbols before direct legacy `Bot.symbolGroup`, and writes strategy
  provenance from existing position provenance or one enabled canonical
  `MarketGroupStrategyLink`. Stale direct bot market/strategy projections can
  no longer claim or mislabel repaired orphan rows when canonical groups exist.
  Validation PASS: focused position repair regression (`1/1`). Evidence:
  `history/tasks/posdrift-11-legacy-position-repair-canonical-scope-task-2026-05-03.md`.
- 2026-05-03 manual-order multi-strategy ambiguity slice `POSDRIFT-10` is
  closed locally. Manual-order strategy context now resolves a canonical
  strategy only when exactly one enabled strategy link matches the requested
  symbol. Matching canonical groups with multiple enabled strategies remain
  unresolved, so LIVE manual open fails closed with the existing
  `LIVE_MANUAL_SCOPE_UNRESOLVED` path instead of silently selecting the first
  link. Validation PASS: focused LIVE ambiguous manual-order regression.
  Evidence:
  `history/tasks/posdrift-10-manual-order-multistrategy-ambiguity-task-2026-05-03.md`.
- 2026-05-03 manual-order context venue slice `POSDRIFT-09` is closed locally.
  Manual-order context now resolves venue from active canonical
  `BotMarketGroup.symbolGroup.marketUniverse` before duplicated bot
  `exchange/marketType`, and uses that venue for connector selection, exchange
  metadata fallback, leverage, and margin-mode semantics. Stale direct bot
  projections can no longer make dashboard manual-order preview show `SPOT`
  semantics for a canonical `FUTURES` bot scope. Validation PASS: focused
  manual-order context tests (`5` tests). Evidence:
  `history/tasks/posdrift-09-manual-context-canonical-venue-task-2026-05-03.md`.
- 2026-05-03 wallet update market-scope slice `POSDRIFT-08` is closed locally.
  Existing-bot wallet update validation now checks active canonical
  `BotMarketGroup.symbolGroup.marketUniverse` scope before falling back to
  direct legacy `Bot.symbolGroup`. A stale direct bot market projection can no
  longer allow a wallet whose venue mismatches the bot's real assigned
  canonical market group. Validation PASS: focused bot context validation test
  (`2/2`). Evidence:
  `history/tasks/posdrift-08-wallet-update-canonical-market-scope-task-2026-05-03.md`.
- 2026-05-03 LIVE market-overlap guard slice `POSDRIFT-07` is closed locally.
  Active LIVE bot create/update validation now checks candidate bots through
  active canonical `BotMarketGroup.symbolGroup` symbols before falling back to
  direct legacy `Bot.symbolGroup`. Stale direct market projections can no
  longer let two active LIVE bots share a symbol in their real assigned
  canonical market scope, nor block from the wrong legacy scope. Validation
  PASS: focused duplicate guard e2e (`5/5`). Evidence:
  `history/tasks/posdrift-07-live-overlap-canonical-market-scope-task-2026-05-03.md`.
- 2026-05-03 runtime signal-loop venue drift slice `POSDRIFT-06` is closed
  locally. Runtime signal-loop inherited execution context now uses the shared
  canonical runtime venue resolver instead of a local
  `botMarketGroups[0] ?? bot.symbolGroup` expression. PAPER/LIVE open topology
  now fails closed when raw topology exposes multiple canonical venues and
  preserves direct `Bot.symbolGroup` fallback only through the shared legacy
  compatibility path. Validation PASS: focused runtime signal-loop defaults
  test (`6/6`). Evidence:
  `history/tasks/posdrift-06-runtime-signal-loop-canonical-venue-task-2026-05-03.md`.
- 2026-05-03 execution-venue drift slice `POSDRIFT-05` is closed locally.
  Pre-trade LIVE bot config, manual order open context, runtime position reads,
  and runtime position automation now resolve venue from active canonical
  `BotMarketGroup` market universe before direct legacy `Bot.symbolGroup`.
  This prevents stale direct bot market projections from blocking or routing
  TTP/DCA/close/manual-open behavior away from the bot's assigned canonical
  market scope after market changes. Validation PASS: focused
  runtime/order/position pack (`6` files / `74` tests). Evidence:
  `history/tasks/posdrift-05-canonical-execution-venue-task-2026-05-03.md`.
- 2026-05-03 runtime position read drift slice `POSDRIFT-04` is closed locally.
  Runtime position reads now resolve inherited execution venue from active
  canonical `BotMarketGroup` market universe when available, and use direct
  `Bot.symbolGroup` only as legacy fallback. Position protection/actionable
  display no longer falls back to direct `Bot.strategyId` when
  position/canonical strategy provenance is missing. This prevents stale direct
  venue from hiding dashboard positions and stale direct strategy projection
  from making protection display look actionable. Validation PASS: runtime
  strategy-context e2e (`2/2`), dynamic-stop/serialization/automation pack
  (`42/42`), runtime-scope/orders/market-universe pack (`34/34`), web
  history/manual pack (`13/13`), and API typecheck. Evidence:
  `history/tasks/posdrift-04-runtime-position-read-canonical-context-task-2026-05-03.md`.
- 2026-05-03 imported-position ownership scope slice `POSDRIFT-03` is closed
  locally. External-position ownership now builds bot symbol scope from active
  canonical `BotMarketGroup` rows when they exist, and uses direct legacy
  `Bot.symbolGroup` only as fallback for bots without active canonical groups.
  This prevents stale direct bot market projections from claiming/importing
  exchange positions outside the currently assigned markets while preserving
  canonical assigned-market imports. Validation PASS: focused ownership test
  (`8/8`), takeover and reconciliation pack (`34/34`),
  runtime-scope/market-universe/orders pack (`34/34`), and API typecheck.
  Evidence:
  `history/tasks/posdrift-03-import-ownership-canonical-market-scope-task-2026-05-03.md`.
- 2026-05-03 position-management drift slice `POSDRIFT-02` is closed locally.
  Dashboard manual close now loads active canonical bot market-group strategy
  links and recovers/persists `strategyId` for imported `EXCHANGE_SYNC`
  bot-managed positions when the selected bot has exactly one active canonical
  strategy. The recovered strategy is passed into runtime close orchestration,
  keeping close order/trade/history provenance aligned with runtime protection
  ownership. Multi-strategy missing provenance remains non-guessed. Validation
  PASS: focused command test (`8/8`), API order/position + dynamic-stop +
  automation pack (`62/62`), web manual close/history pack (`13/13`), and API
  typecheck. Evidence:
  `history/tasks/posdrift-02-manual-close-strategy-provenance-task-2026-05-03.md`.
- 2026-05-03 dashboard/manual-order runtime drift slice `POSDRIFT-01` is
  closed locally. Manual-order API context now resolves active canonical
  `BotMarketGroup` and enabled `MarketGroupStrategyLink` rows before direct
  legacy `Bot.strategy` / `Bot.symbolGroup` projections, and the dashboard
  manual-order hook uses active runtime graph groups for symbol options before
  fallback. This prevents stale direct bot projections or paused groups from
  steering PAPER/LIVE manual openings. Validation PASS: API focused
  manual-order test (`23/23`), web hook test (`3/3`), API
  positions/market-universe/runtime pack (`34/34`), and web manual-order widget
  pack (`13/13`). Evidence:
  `history/tasks/posdrift-01-manual-order-canonical-context-task-2026-05-03.md`.
- 2026-05-03 dashboard-wide runtime drift slice `DASHDRIFT-01` is closed
  locally. The dashboard sidebar now treats `runtime-graph` as the canonical
  source for selected bot market/strategy context before falling back to direct
  legacy `Bot.strategy` / `Bot.symbolGroup` projections, and the API
  `runtime-graph` payload now includes strategy `leverage` so the sidebar can
  explain the same strategy context runtime uses. Validation PASS: sidebar
  regression (`8/8`), runtime-scope API e2e (`10/10`), dashboard aggregate and
  runtime presenter tests (`11/11`), API aggregate/symbol-stats tests
  (`14/14`), API/web typechecks, repository guardrails, and docs parity.
  Evidence:
  `history/audits/dashdrift-01-dashboard-runtime-context-parity-task-2026-05-03.md`.
- 2026-05-03 operator-reported dashboard wallet balance slice
  `WALLETBAL-01` is closed locally. Runtime LIVE balance cache now preserves
  separate semantic fields for raw exchange `accountBalance` and allocated
  `referenceBalance`, so cache hits no longer collapse FIXED/PERCENT allocation
  values into the dashboard account-balance field. `freeCash` continues to use
  allocated trading capital. Validation PASS: focused runtime capital tests
  (`15/15`), monitoring aggregate plus wallet e2e tests (`19/19`), and API
  typecheck. Evidence:
  `history/tasks/walletbal-01-live-account-balance-cache-task-2026-05-03.md`.
- 2026-05-03 operator-reported PAPER signal parity slice `PAPERSIGNAL-01` is
  closed locally. Runtime symbol-stats read models now use active canonical
  `BotMarketGroup` and enabled `MarketGroupStrategyLink` rows as their
  configured market/strategy context before falling back to legacy
  `Bot.symbolGroup` / `Bot.strategy`. This aligns dashboard signal cards with
  the topology used by PAPER/LIVE final-candle execution and avoids stale
  legacy configured-context display after strategy or market changes.
  Validation PASS: focused symbol-stats/final-candle/paper-live tests
  (`18/18`), bot runtime scope/market-universe/dynamic-stop/runtime-loop tests
  (`60/60`), and API typecheck. Evidence:
  `history/audits/papersignal-01-canonical-symbol-stats-parity-task-2026-05-03.md`.
- 2026-05-03 operator-requested LIVE/PAPER runtime audit slice
  `RUNTIME-AUDIT-01` is closed locally. Runtime signal-loop open-position
  counting now follows the wallet-first imported-position ownership contract by
  resolving the effective LIVE API key from `wallet.apiKeyId` before legacy
  `Bot.apiKeyId`. This prevents wallet-first bots from undercounting imported
  `EXCHANGE_SYNC` LIVE positions in max-open/external-position guards when the
  legacy bot API-key projection is null. Validation PASS: focused
  runtime/defaults and ownership tests (`13/13`), runtime
  final-candle/live-reconciliation/dynamic-stop tests (`75/75`), paper-live
  equivalence (`2/2`), API typecheck, repository guardrails, and docs parity.
  Evidence:
  `history/audits/live-paper-runtime-prod-audit-wallet-first-count-task-2026-05-03.md`.
- 2026-05-03 operator-reported LIVE imported-position protection provenance
  follow-up `LIVEIMPORT-02` is closed locally. Owned `EXCHANGE_SYNC` LIVE
  positions that lack persisted `position.strategyId` can now recover the
  owning bot's single enabled canonical strategy link for TTP/DCA read-model
  display and runtime protection automation. Multi-strategy missing provenance
  remains fail-closed through the existing
  `multi_strategy_position_provenance_missing` skip telemetry. Public
  production `/health` and `/ready` are healthy, but production web build-info
  still reports deployed SHA `26962ea1dbb0981d3885779d01e58485d7e9fd6c`, so
  this local fix requires promotion before authenticated ETH/DOGE readback.
  Validation PASS: focused runtime automation tests (`33/33`), focused
  dynamic-stop operator truth e2e (`2/2`), API typecheck, and repository
  guardrails. Evidence:
  `history/tasks/live-import-single-strategy-provenance-task-2026-05-03.md`.
- 2026-05-03 operator-reported follow-up queue is active after
  `LIVEIMPORT-02`: `LIVEIMPORT-03` for production promotion and authenticated
  ETH/DOGE readback, `PAPERSIGNAL-01` for PAPER signal display-to-execution
  parity, and `WALLETBAL-01` for intermittent dashboard wallet account-balance
  display. These are separate one-task iterations; `BOTMULTI-09` remains
  blocked at manual production workflow dispatch.
- 2026-05-03 engineering documentation system-map foundation `DOCMAP-01` is
  closed locally. Existing architecture/module docs were preserved as the
  source of truth, while new traceability docs now connect product features to
  frontend routes, API routes, services/modules, Prisma models, workers,
  pipelines, tests, deployment docs, and known documentation drift. New
  entrypoints: `docs/soar-documentation-map.md`,
  `docs/analysis/documentation-inventory.md`,
  `docs/architecture/codebase-map.md`,
  `docs/architecture/traceability-matrix.md`, `docs/pipelines/pipeline-registry.md`,
  `docs/modules/module-registry.md`, `docs/analysis/documentation-drift.md`, and
  `docs/CONTRIBUTING-DOCS.md`. No runtime behavior changed. Evidence:
  `history/tasks/docmap-01-engineering-documentation-system-map-task-2026-05-03.md`.
- 2026-05-03 final system functionality remediation planning is queued as
  `SYSFINAL-2026-05-03`. The consolidated master plan is now the execution
  path for final confidence: first synchronize stale active planning truth,
  then build the current route/API/function inventory, run repository and
  production confidence gates, audit every current user-facing workflow, convert
  evidence-backed discrepancies into tiny `SYSFIX-*` tasks, and close with
  production smoke. Stage remains deferred to V2 by operator decision, and
  `BOTMULTI-*` stays deferred until the current V1 production system is fully
  re-audited. Plan:
  `history/plans/system-functionality-final-remediation-master-plan-2026-05-03.md`.
- 2026-05-03 `SYSFINAL-00` is closed. Active planning truth is synchronized
  before the final function audit: `RUNTIME-SIGNAL-VOTES-01` is no longer
  waiting for deploy smoke because production evidence confirmed API freshness
  on `26962ea1dbb0981d3885779d01e58485d7e9fd6c`, `/health=ok`,
  `/ready=ready`, active runtime session `RUNNING`, and concrete guardrail
  reasons instead of unexplained `matched=true` + `No votes` drift. Duplicate
  `V1BOT-SIGNALS-02` and older `V1FINAL/V1EXCEL` open-looking entries are
  historical/superseded carryover, not current V1 blockers. `SYSFINAL-01`
  is now the next executable task.
- 2026-05-03 `SYSFINAL-01` is closed locally. The current route/API/function
  inventory now maps V1 web route families and API families to backend owners,
  data sources, expected UI states, auth boundaries, validation methods,
  redirect-only compatibility routes, and explicit V2/deferred exclusions.
  Evidence:
  `history/audits/sysfinal-01-current-function-inventory-task-2026-05-03.md`.
  `SYSFINAL-02` is now the next executable task.
- 2026-05-03 `SYSFINAL-02` is closed locally. Repository baseline gates are
  green before product/security/runtime audits: guardrails, docs parity, lint,
  API+web typecheck, full API tests, full web tests (`141` files / `399`
  tests), and workspace build all passed. No `SYSFIX-*` task is required from
  the baseline. Evidence:
  `history/audits/sysfinal-02-repository-baseline-gates-task-2026-05-03.md`.
  `SYSFINAL-03` is now the next executable task.
- 2026-05-03 `SYSFINAL-03` is closed locally. Auth/session/security and
  permission surfaces are green across focused API and web verification:
  API security pack (`14` files / `75` tests), web auth/profile/admin pack
  (`8` files / `28` tests), `pnpm audit`, and repository guardrails all passed.
  No `SYSFIX-*` task is required. Evidence:
  `history/audits/sysfinal-03-auth-session-security-audit-task-2026-05-03.md`.
  `SYSFINAL-04` is now the next executable task.
- 2026-05-03 `SYSFINAL-04` is closed locally. Dashboard and bot runtime truth
  are green across focused API runtime/readiness tests, sequential DB-backed
  runtime e2e tests, and focused web runtime parity tests. Validation PASS:
  API runtime/readiness pack (`14` files / `113` tests), DB runtime e2e pack
  (`7` files / `33` tests), web runtime pack (`14` files / `59` tests), and
  repository guardrails. No `SYSFIX-*` task is required. Evidence:
  `history/audits/sysfinal-04-dashboard-bot-runtime-truth-audit-task-2026-05-03.md`.
  `SYSFINAL-05` is now the next executable task.
- 2026-05-03 `SYSFINAL-05` is closed locally. Order and position workflows are
  green across focused lifecycle/pre-trade tests, sequential DB-backed
  order/position e2e tests, and focused web manual-order/open-order/close
  tests. Validation PASS: lifecycle/pre-trade pack (`14` files / `116`
  tests), DB order/position e2e pack (`7` files / `42` tests), web trading
  workflow pack (`8` files / `24` tests), and repository guardrails. No
  `SYSFIX-*` task is required. Evidence:
  `history/audits/sysfinal-05-order-position-workflows-audit-task-2026-05-03.md`.
  `SYSFINAL-06` is now the next executable task.
- 2026-05-03 `SYSFINAL-06` is closed locally. Configuration workflows are green
  across focused API and web validation for API keys, wallets, markets,
  strategies, and bot wallet-first setup/runtime scope. Validation PASS: API
  config pack (`16` files / `130` tests), web config pack (`11` files / `52`
  tests), and repository guardrails. No `SYSFIX-*` task is required. Evidence:
  `history/audits/sysfinal-06-configuration-workflows-audit-task-2026-05-03.md`.
  `SYSFINAL-07` is now the next executable task.
- 2026-05-03 `SYSFINAL-07` is closed locally. Backtests, reports, logs,
  route-reachable i18n, and key UX/a11y/responsive coverage are green across
  focused API and web validation. Validation PASS: API backtest/report pack
  (`13` files / `94` tests), DB backtest/logs e2e pack (`2` files / `17`
  tests), web product/UX/i18n/a11y/responsive pack (`12` files / `33` tests),
  route-reachable i18n audit (`0` findings), and repository guardrails. No
  `SYSFIX-*` task is required. Evidence:
  `history/audits/sysfinal-07-backtests-reports-logs-i18n-ux-audit-task-2026-05-03.md`.
  `SYSFINAL-08` is now the next executable task.
- 2026-05-03 `SYSFINAL-08` is closed locally. Review of `SYSFINAL-02..07`
  found no confirmed discrepancies requiring implementation, so the current
  `SYSFIX-*` queue is intentionally empty. Evidence:
  `history/tasks/sysfinal-08-empty-sysfix-queue-task-2026-05-03.md`.
  `SYSFINAL-09` is now the next executable task.
- 2026-05-03 `SYSFINAL-09` is closed locally, completing
  `SYSFINAL-2026-05-03`. No `SYSFIX-*` implementation tasks were required.
  Final validation PASS: repository guardrails, docs parity, lint, typecheck,
  full API tests, full web tests (`141` files / `399` tests), and workspace
  build. Public production smoke PASS: API `/health=ok`, `/ready=ready`, web
  root `200`, login page `200`, web build-info reports deployed
  `main@26962ea1dbb0981d3885779d01e58485d7e9fd6c`, and protected
  `/dashboard/bots` without token returns `401 Missing token`. Authenticated
  production dashboard/runtime smoke was unavailable without credentials and is
  not claimed. Evidence:
  `history/evidence/sysfinal-09-final-regression-production-smoke-closure-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-A` is now active after `SYSFINAL-09` satisfied the
  stable post-V1 confidence prerequisite. `BOTMULTI-01` is closed locally:
  architecture now freezes the post-V1 target as `1 bot = 1 wallet + 1 active
  symbol-group market scope + N enabled strategies`, keeps multi-market-group
  bots out of scope, requires manual-order ambiguity to fail closed, requires
  runtime merge trace to preserve primary strategy provenance, and keeps
  DCA/TTP/SL/TSL ownership position-scoped. Evidence:
  `history/tasks/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-02` audit is closed. The inventory found canonical
  candidates (`BotMarketGroup`, `MarketGroupStrategyLink`, and the merge
  helper) plus migration debt across direct `Bot.strategyId` /
  `Bot.symbolGroupId`, legacy `BotStrategy`, create/update DTOs, runtime
  topology, final-candle strategy evaluation, manual-order context, read
  projections, and web bot form/list surfaces. The user selected lower numeric
  strategy-link priority as canonical, the runtime merge reference now states
  that `1` is higher priority than `100`, and focused merge tests lock exit
  and directional tie-break behavior. `BOTMULTI-03` is now the next executable
  task. Evidence:
  `history/audits/botmulti-02-legacy-compatibility-migration-audit-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-03` is closed. The canonical topology now has a
  database-level persistence boundary: migration
  `20260503013000_enforce_single_active_bot_market_group` fails closed if a bot
  already has multiple enabled `ACTIVE` `BotMarketGroup` rows, then creates the
  partial unique index `BotMarketGroup_one_active_scope_per_bot_idx` on
  `BotMarketGroup(botId)` for enabled `ACTIVE` rows. Prisma schema comments and
  architecture docs record that Prisma cannot express this partial index in the
  DSL, so the invariant is owned by manual migration SQL. `BOTMULTI-04` is now
  the next executable task. Evidence:
  `history/tasks/botmulti-03-canonical-topology-migration-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-04` is closed. Bot create/update API writes now accept
  optional ordered `strategies` payloads, validate duplicate/unknown/disabled
  primary strategy mixes fail-closed, persist multiple canonical
  `MarketGroupStrategyLink` rows under the single active `BotMarketGroup`, and
  keep `Bot.strategyId` as the primary compatibility projection without
  reviving legacy `BotStrategy` writes for multi-strategy payloads.
  `BOTMULTI-05` is now the next executable task. Evidence:
  `history/tasks/botmulti-04-api-write-multi-strategy-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-05` is closed. Runtime topology now loads the enabled
  canonical `MarketGroupStrategyLink` set under the one active
  `BotMarketGroup`, final-candle decision evaluates all interval-eligible
  strategies, and votes are merged through the existing deterministic runtime
  merge contract using link priority/weight. Direct `Bot.strategyId` remains a
  fallback only when no canonical enabled links exist. `BOTMULTI-06` is now the
  next executable task. Evidence:
  `history/tasks/botmulti-05-runtime-signal-merge-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-06` is closed. Runtime position automation now exposes
  the owning bot's enabled canonical strategy links and fails closed when a
  bot-managed position has no `position.strategyId` while multiple enabled
  links exist. This prevents fallback DCA/TTP/SL/TSL settings from acting on
  ambiguous multi-strategy position ownership, while reusing existing runtime
  skip telemetry. `BOTMULTI-07` is now the next executable task. Evidence:
  `history/tasks/botmulti-06-runtime-risk-lifecycle-ownership-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-07` is closed. Web bot create/edit now exposes primary
  strategy plus enabled additional strategies, submits canonical ordered
  `strategies[]` with primary-first priority, and prefills edit mode from
  runtime graph canonical strategy links when available. `BOTMULTI-08` is now
  the next executable task. Evidence:
  `history/tasks/botmulti-07-web-operator-multi-strategy-truth-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-08` is closed, completing the post-V1 BOTMULTI
  reintroduction wave locally. Closure validation PASS: API multi-strategy
  write and runtime topology/merge tests (`4` files / `51` tests), runtime
  lifecycle fail-closed tests (`31` tests), web bot form tests (`7` tests),
  API/web typecheck, route-reachable i18n audit (`0` findings), docs parity,
  and repository guardrails. No authenticated production smoke was claimed.
  Evidence:
  `history/tasks/botmulti-08-architecture-runtime-closure-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-09` production release is in progress by operator
  request. Migration behavior is confirmed to be automatic on API redeploy
  when `API_AUTO_MIGRATE` is not `false`: `apps/api/Dockerfile` starts
  `node scripts/start-with-migrate.mjs`, which runs `prisma migrate deploy`
  before API boot and fails closed if migration execution fails. Local
  pre-release build, repository guardrails, and docs parity PASS. Candidate
  `f3aaa3dca6cf4d4b199372563886165638391a77` is committed and pushed to
  `origin/main`. Production promotion is blocked at workflow dispatch from the
  current environment: no `gh` CLI, no deploy hook secret, and the available
  GitHub connector tools do not expose `workflow_dispatch`. Production
  build-info still reports previous deployed SHA
  `26962ea1dbb0981d3885779d01e58485d7e9fd6c`; manual `Promote PROD`
  workflow dispatch is required to redeploy and run the migration startup path.
  Evidence:
  `history/tasks/botmulti-09-production-deploy-task-2026-05-03.md`.
- 2026-05-03 operator-reported LIVE imported-position ownership slice
  `LIVEIMPORT-01` is closed locally. The external takeover ownership index now
  follows the wallet-first bot contract by resolving the canonical LIVE API key
  from the assigned wallet before falling back to legacy `Bot.apiKeyId`, and it
  includes active canonical `BotMarketGroup` scopes in addition to the legacy
  primary symbol group. `EXCHANGE_SYNC` positions on old and newly attached
  markets can now rebind by exact `apiKeyId:symbol` proof without symbol-only
  guessing, while `AMBIGUOUS`, `MANUAL_ONLY`, and `UNOWNED` outcomes remain
  fail-closed. Validation PASS: focused ownership/takeover tests (`14/14`), API
  typecheck, API build, and repository guardrails. Evidence:
  `history/tasks/live-import-ownership-wallet-scope-task-2026-05-03.md`.

## 2026-05-02 V1 Prod-Only Release Scope Update
- 2026-05-02 operator-reported LIVE ETHUSDT DCA-first protection hardening
  `ETHDCA-01` is closed locally. Runtime position automation now hydrates
  durable DCA progress from persisted `Trade` lifecycle rows before evaluating
  DCA-first protection closes, including current-position rows and same
  bot/wallet/strategy/symbol replacement lifecycles cut off by the latest
  opposite-side close. Volatile runtime state loss or rebase can no longer
  undercount executed adds when a pending affordable DCA level should still
  block `TSL` / `SL`. Runtime position serialization now renders finite
  negative trailing-loss `TSL` state instead of hiding an armed loss-side stop.
  Validation PASS: focused runtime automation and position
  serialization tests (`38/38`), API typecheck, API build, and repository
  guardrails.
  Evidence:
  `history/tasks/ethdca-01-live-dca-first-tsl-hardening-task-2026-05-02.md`.
- 2026-05-02 runtime signal vote recovery slice
  `RUNTIME-SIGNAL-VOTES-01` is closed with production verification. The
  final-candle runtime decision path now asks the engine
  market-data gateway for an indicator-ready candle series before strategy
  evaluation, so short runtime buffers can be topped up from the approved
  exchange-owned Binance public kline recovery path before a strategy vote is
  merged. Runtime candles remain authoritative on fallback overlap, the
  dashboard/read-model path reuses the same merge helper, and no pre-trade,
  wallet, max-position, exchange-min-order, or orchestrator guardrail was
  bypassed. Stale no-vote decisions no longer donate their `No votes` reason
  to recovered configured snapshots. A follow-up guardrail-visibility patch now
  includes latest `PRETRADE_BLOCKED` events in symbol-stats so matched
  conditions stopped by runtime guardrails show a concrete block reason instead
  of degrading to configured fallback. Production smoke confirmed API freshness
  on `26962ea1dbb0981d3885779d01e58485d7e9fd6c`, `/health=ok`,
  `/ready=ready`, active session `RUNNING`, and concrete guardrail reasons for
  matched rows instead of unexplained `No votes`. Validation PASS: focused runtime
  market-data/runtime loop/read model tests (`4` files / `56` tests), focused
  blocked-decision read-model tests (`2` files / `8` tests), API typecheck,
  API build, and repository guardrails. Evidence:
  `history/audits/runtime-signal-vote-recovery-audit-plan-2026-05-02.md`.
- 2026-05-02 operator-reported runtime signal vote audit queued
  `RUNTIME-SIGNAL-VOTES-01` as P0. Authenticated production read-only evidence
  showed active PAPER `Peper bot` rows with concrete matched RSI conditions but
  no accepted runtime signal: `DOGEUSDT` exposed `RSI(14) 78.6959 > 51` with
  `matched=true`, yet the same row reported `lastSignalDirection=null`,
  `lastSignalReason=No votes`, and `totalSignals=0`; session
  `122f6846-2f8c-4ee6-bfee-9d2621f29c96` had `eventsCount=213` and
  `lastSignalAt=null`. Local probing with 150 fresh Binance Futures
  `DOGEUSDT` `5m` candles and the same `RSI 45/55` strategy returned `LONG`,
  so the suspected root is parity drift between dashboard/read-model candle
  recovery and the actual final-candle runtime decision path. Plan:
  `history/audits/runtime-signal-vote-recovery-audit-plan-2026-05-02.md`.
- 2026-05-02 runtime signal and market-stream recovery slice
  `V1BOT-SIGNALS-02` is closed. Condition lines now expose canonical
  `matched=true|false|null` truth for operator display, Redis market-stream
  publisher failures retry instead of permanently dropping events, Binance
  USD-M Futures market streams use the routed `/market/ws` endpoint, and
  production readiness fails closed when required Redis is unreachable.
  Production Redis AOF recovery completed from a backed-up volume, and
  post-recovery authenticated SSE emitted real candle/ticker events. Validation
  PASS: focused market-stream/runtime read-model tests (`50/50`), focused
  Binance stream/fanout/subscription tests (`15/15`), readiness tests (`9/9`),
  API typecheck, web typecheck, API build, and repository guardrails. Evidence:
  `history/plans/v1bot-signals-runtime-truth-2026-05-02.md`.
- 2026-05-02 production dashboard signal recovery follow-up `DASHSIGNALS-02`
  is closed. The runtime symbol-stats read path now attempts indicator data
  recovery before emitting unavailable values: short in-memory candle histories
  are topped up from the approved fallback kline path, merged by `openTime`,
  and runtime candles remain authoritative on overlap. This means `n/a`
  remains only a final fail-closed display state when recovery still cannot
  produce a valid indicator value. No order execution, position automation, or
  trading mutation behavior changed. Validation PASS: focused backend signal
  recovery/read-model tests (`7/7`), API typecheck, repository guardrails, and
  API build. Production readback after deploy confirmed no raw `n/a`, no
  pending indicator labels, and concrete visible `RSI(14)` values for active
  dashboard signal cards. Evidence:
  `history/tasks/dashsignals-02-indicator-recovery-before-unavailable-task-2026-05-02.md`.
- 2026-05-02 production dashboard signal-card follow-up `DASHSIGNALS-01` is
  closed. Authenticated production evidence showed runtime condition cards
  rendering unavailable RSI operands as misleading expressions such as
  `n/a < 20` and `n/a > 80`. The fix keeps runtime fail-closed behavior while
  separating unavailable indicator input from normal false condition matches:
  unavailable operands are display-unknown, concrete snapshot values are
  preferred over stale latest-decision `n/a` payloads when available, and
  Dashboard Home / Bot Monitoring render localized pending-data text instead
  of raw `n/a` math. No order execution, position automation, persistence, or
  trading mutation behavior changed. Validation PASS: focused API
  signal/read-model tests (`5/5`), focused web dashboard/bot signal tests
  (`32/32`), API typecheck, web typecheck, repository guardrails, lint,
  route-reachable i18n audit, API build, and web build. Evidence:
  `history/tasks/dashsignals-01-indicator-value-pending-display-task-2026-05-02.md`.
- 2026-05-02 production dashboard display follow-up `DASHDISPLAY-01` is
  closed. Authenticated read-only review of
  `https://soar.luckysparrow.ch/dashboard` found two visible dashboard polish
  regressions plus one hidden DOM text leak: Manual Order `Min qty` and
  `Qty slider` could visually collide, long runtime History/trade pills could
  wrap into tall badges, and the hidden dashboard breadcrumb spacer exposed
  `__dashboard-spacer__` in rendered text. The fix is presentation-only and
  does not change trading/runtime/API behavior. Validation PASS: focused web
  dashboard/title pack (`29/29`), web typecheck, repository guardrails, and web
  build. Evidence:
  `history/tasks/dashdisplay-01-prod-dashboard-display-polish-task-2026-05-02.md`.
- Operator decision: V1 release evidence is production-only for now; a separate
  stage environment is deferred to V2 when a dedicated VPS is available.
- Stage absence is no longer a V1 blocker. Gate 4 signoff is approved with
  Patryk Wroblewski as Engineering, Product, Operations, and RC owner.
  Production restore evidence and non-dry-run production release/post-deploy
  smoke evidence are now fresh and passing.
- Dependency audit hardening closed in `V1SEC-01`; `pnpm audit` reports no
  known vulnerabilities after Next/Tailwind/Vitest toolchain updates and
  centralized patched transitive dependency overrides.
- 2026-05-02 final prod evidence: Coolify production DB restore drill PASS in
  Postgres container `x11cfnz1dd9x0yzccftqzcoe`; rollback proof PASS; final
  non-dry-run production release gate PASS with readiness `ready`. Evidence:
  `history/evidence/v1-restore-drill-prod-2026-05-02T17-49-41-000Z.md`,
  `history/evidence/v1-rollback-proof-prod-2026-05-02T17-54-13-498Z.md`, and
  `history/releases/v1-release-gate-prod-2026-05-02T17-56-17-239Z.md`.
- 2026-05-02 post-V1 quality follow-up: `AWESOME-01` is queued as the master
  product-quality audit program. It will verify every user-facing workflow,
  frontend-backend contract, runtime truth surface, data invariant, security
  boundary, UX state, and production-runtime check before any further polish
  fixes are planned. Master plan:
  `history/audits/awesome-audit-master-plan-2026-05-02.md`.
- 2026-05-02 post-V1 quality audit result: `AWESOME-01` completed with
  `history/audits/awesome-audit-execution-report-2026-05-02.md`. No
  user-facing product/runtime/security/production public-smoke blocker was
  found. The only QA reliability follow-up, `AWESOME-FIX-01`, is now closed:
  `apps/api/src/modules/positions/importedPositionHistoryHydrator.service.test.ts`
  cleanup removes dependent rows before users, restoring a clean focused test
  signal for imported position history hydration and a green full API suite.

## Product Snapshot
- Name: CryptoSparrow / Soar
- Goal: deliver a crypto-trading operations platform with backtest, paper, and
  live execution support, operator dashboards, and a path toward assistant or
  agent-driven workflows
- Commercial model: SaaS-style subscription product with staged entitlements
- Current phase: V1 production-only release evidence is `GO` as of
  `V1CLOSEOUT-11` on 2026-05-02. Stage is intentionally deferred to V2 by
  operator decision, and the older `V1FINAL-01` / `V1EXCEL` `NO-GO` wording is
  historical pre-closeout evidence rather than current release status. The
  current repository truth is that the
  deployed worker contract is frozen to `split`, runtime symbol scope and
  signal interval truth now fail closed and persist honestly, runtime
  freshness authority is scoped to active sessions, operator diagnostics are
  more explicit about degraded routing/runtime-input outcomes, and the
  approved singular bot architecture is now implemented as canonical
  production truth: `1 bot = 1 wallet + 1 symbol-group market scope + 1
  strategy`. Runtime and operator surfaces now consume inherited context from
  wallet, symbol-group market scope, and strategy modules instead of
  reconstructing canonical truth from legacy topology. The newest production
  hardening slices (`V1BOT-07B`, `V1BOT-09`, `V1DASH-A`, `V1BOTSURF-A`,
  `V1SURF-A`) additionally proved and fixed a critical PAPER capital-authority
  drift where wallet-scoped historical paper lifecycle rows could inflate the
  selected bot runtime capital and sizing; `LIVE` remains wallet-authoritative
  from authenticated exchange balance, while `PAPER` runtime/dashboard capital
  is now bot-scoped under the linked wallet. Manual-order execution is
  singular-context-aware for both backend context resolution and dashboard
  symbol sourcing, `PAPER` market orders can fill immediately without an
  explicit request price, selected-bot dashboard KPIs prefer authoritative
  runtime capital summary fields, and bot monitoring/list/detail surfaces
  expose the same runtime capital/state truth instead of mixing config
  baseline with active runtime semantics. `V1IND-A` is now also closed:
  architecture freezes one canonical indicator registry scope,
  strategy-builder metadata is served from that registry, runtime and operator
  signal surfaces reuse the shared indicator analysis kernel, and configured
  market snapshots no longer depend on the old subset formatter that emitted
  opaque `X` placeholders. Full web validation, build, and focused API parity
  packs are green for the indicator wave. `V1POSTBOT-A` is now also closed:
  the remaining red full-API cases were resolved by aligning stale
  `backtests/orders` e2e fixtures to the canonical singular bot contract,
  which restored full `api` suite parity for pre-trade expectations,
  deterministic selected-bot order ownership, carryover open orders, and
  `EXCHANGE_SYNC BOT_MANAGED` LIVE runtime position visibility/close flows.
  Fresh analysis on 2026-04-26, however, proved that the repository still has
  residual live-execution drift beyond the already closed `V1TAKE-A` packet:
  ownership truth still differs between reconciliation and runtime,
  imported-position entry truth can still degrade to `markPrice`, runtime close
  parity for owned imported `LIVE` positions is not yet stable in focused
  DB-backed tests, and Binance Futures lifecycle truth still relies mainly on
  REST snapshots instead of exchange-boundary event handling. That approved
  `V1LIVE-A` hardening wave is now fully closed: it kept `PAPER`
  exchange-free, kept all `LIVE` work inside the approved exchange boundary,
  forced adapter selection to follow the exact user/bot `exchange +
  marketType` settings, and closed the full path `signal -> order -> exchange
  update -> position -> takeover/runtime visibility` under one canonical
  contract. The first completed adapter family in that wave is `BINANCE +
  SPOT` and `BINANCE + FUTURES`; it is not a hidden default for all future
  live execution. The newest post-V1 production hotfix slice
  (`V1FIX-2026-04-26-A`) additionally recovers manual order open lifecycle
  truth when a same-symbol open position already exists: manual same-direction
  fills now update and link the existing open position instead of crashing on
  the historical partial unique open-position index, while reverse-direction
  opens fail closed with an explicit domain error instead of a raw `500`.
  The newest repository hardening slice (`V1FIX-2026-04-26-C`) closes one
  deeper canonical-scope gap discovered only after real-account browser
  verification on production: manual-order open-position conflict and reuse
  logic is now wallet- or bot-scoped instead of globally keyed by
  `userId + symbol`, and the DB uniqueness contract is migrated to the same
  scoped truth so `LIVE` and `PAPER` bots can hold the same symbol
  independently when they belong to different canonical wallets. The newest
  web-side production hardening slice (`V1LIVE-PROD-2026-04-26-A`) then proved
  the remaining real-account blocker was a stale manual-order UI context race,
  not a backend execution failure: after bot or symbol changes, the dashboard
  could still prioritize a previous-symbol `manualOrderContext` price and send
  the wrong submit price for the current symbol. `useManualOrderController`
  now trusts context price only when it matches the current `botId + symbol`
  selection, preserving the approved canonical architecture where one current
  selected bot and one current selected symbol define manual-order truth. The
  newest approved post-V1 hardening direction is no longer basic open/close
  execution correctness, but canonical close-attribution truth. A fresh audit
  on 2026-04-27 confirmed the repository can already close positions through
  app commands, bot lifecycle, exchange events, and reconciliation, yet still
  lacks one persisted, architecture-backed model for who or what initiated the
  close. The approved next wave `V1CLOSE-A` now freezes a two-dimensional close
  contract: `closeReason` remains the lifecycle reason, while a new canonical
  `closeInitiator` distinguishes `BOT_APP`, `USER_APP`, `USER_EXCHANGE`,
  `EXCHANGE`, and `SYSTEM_REPAIR` so operator history, repair flows, and
  exchange-manual-close detection stop guessing from orphan states and logs.
  That wave is now fully closed as well: persistence now carries canonical
  close attribution on `Position`, `Order`, and `Trade`, runtime/exchange/
  reconcile/repair write paths reuse one shared attribution mapper, and
  dashboard/runtime history surfaces render persisted close authorship instead
  of reconstructing it from `syncState` or audit logs.

## Product Decisions (Confirmed)
- 2026-05-02: closed `V1CLOSEOUT-08..10` from the V1 closeout audit
  remediation queue. RC artifacts now agree with blocked signoff truth:
  Gate 1, Gate 2, and Gate 3 are PASS, while Gate 4 is OPEN until final
  approver names and approval are present. Fresh closeout evidence records an
  explicit operational `NO-GO`: local restore drill PASS, stage/prod restore
  wrappers FAIL because target DB container env vars are unavailable in the
  current execution context, and stage/prod release gates remain dry-run
  `not_ready`. Exchange-boundary conformance for the audited surfaces is
  remediated by moving Binance public REST URL/fetch ownership and Binance
  API-key probe client bootstrap into `modules/exchange`; backtest, runtime
  fallback, runtime signal market-data, and profile API-key probe consumers now
  use exchange-owned seams. Evidence:
  `history/evidence/v1-closeout-evidence-refresh-2026-05-02.md`; focused
  exchange/backtest/runtime/profile tests PASS (`15/15`), runtime loop/pnl
  pack PASS (`45/45`), and API typecheck PASS. Remaining closeout work is
  `V1CLOSEOUT-11`: publish the final V1 go/no-go closure pack, currently
  expected to remain `NO-GO` unless missing Gate 4 approvals and stage/prod
  target evidence are provided.
- 2026-05-02: closed `V1CLOSEOUT-11` with final V1 closeout status `GO`.
  Repository validation is green after remediation (`quality:guardrails`,
  `docs:parity:check`, `lint`, `typecheck`, full API tests, full web tests,
  and `build` all PASS). Follow-up production evidence cleared the remaining
  V1 blockers: Gate 4 is approved, production restore drill is PASS, rollback
  proof is PASS, and the non-dry-run production release gate is `ready`. Stage
  is deferred to V2 by operator decision. Evidence:
  `history/plans/v1-final-go-no-go-closure-2026-05-02.md`.
- 2026-05-02: closed `V1CLOSEOUT-01..07` from the V1 closeout audit
  remediation queue. The API closeout packet is green again after aligning
  stale external-management fixtures to the canonical `Bot.manageExternalPositions`
  authority, fixing positive advanced TSL parser parity for backtests/runtime
  display, repairing runtime session trade scoping for direct bot trades and
  imported open anchors, and keeping pre-arm dynamic TSL display fail-closed.
  Docs parity now resolves the canonical dashboard route map under
  `docs/architecture/reference/dashboard-route-map.md` and includes the
  `web-shared` feature deep-dive. Evidence: `pnpm --filter api run typecheck`
  PASS; focused API closeout pack PASS (`8` files / `91` tests);
  `pnpm --filter api run test -- --run` PASS; `pnpm run docs:parity:check`
  PASS; `pnpm run quality:guardrails` PASS. Remaining closeout blockers start
  at `V1CLOSEOUT-08`: RC/release evidence, production restore drill, stage/prod
  evidence freshness, and exchange-boundary architecture remediation.
- 2026-05-02: queued `V1CLOSEOUT-AUDIT-A` after a full V1 closeout audit
  requested before implementation. The audit confirms V1 is not ready to close
  yet: full web tests, typecheck, build, guardrails, and route-reachable i18n
  are green, but docs parity fails on a stale dashboard route-map path and the
  API suite has focused-reproducible runtime/LIVE failures in wallets,
  lifecycle close parity, bots runtime monitoring, orders/positions
  exchange-sync visibility and close flow, and orphan repair rebinding. Release
  gates also remain blocked by stale activation evidence, failed production
  restore-drill wrapper configuration, stage target uncertainty, and RC
  signoff/checklist disagreement. Canonical remediation packet:
  `history/audits/v1closeout-audit-remediation-plan-2026-05-02.md`.
- 2026-05-02: closed `V1RUNTIME-TRUST-03`, implementing the two immediate
  follow-ups from `V1BOT-AUDIT-02`. Runtime Positions now passes valid
  fallback ticker prices into the existing preferred price resolver for
  open-position `markPrice` when runtime/stat price truth is missing, while
  preserving exchange-sync freshness precedence and leaving live close command
  semantics unchanged. Dashboard Home and Bot Monitoring now reset
  symbol-keyed stream prices on selected runtime context boundaries, and Bot
  Monitoring opens market SSE only for `RUNNING` runtime contexts. Validation
  PASS: focused API runtime PnL fallback test (`2/2`), focused web runtime
  tests (`7/7`), API typecheck/build, web typecheck/build, and repository
  guardrails. Evidence:
  `history/tasks/v1runtime-operator-trust-hardening-task-2026-05-02.md`.
- 2026-05-02: completed `V1BOT-AUDIT-02`, the second runtime/dashboard
  operator-trust audit after `V1SURF-02`. The top backend finding is that
  `runtimeSessionPositionsRead.service.ts` already fetches fallback ticker
  prices for symbols without runtime/stat price truth, but the open-position
  `markPrice` resolver still receives only `runtimeStatPriceBySymbol`
  candidates. The top web finding is that stream prices are now correctly
  highest precedence but their symbol-keyed maps are not reset on every
  selected runtime/status/filter context change, and Bot Monitoring stream
  eligibility is broader than Dashboard Home. Close/cancel command paths
  remain backend guarded with `riskAck` and ownership/actionability checks.
  `V1PRICE-04` and `V1SURF-03` are now queued as the next tiny hardening
  slices. Evidence:
  `history/audits/v1bot-runtime-operator-trust-audit-2026-05-02.md`.
- 2026-05-02: closed `V1SURF-02`, the implementation follow-up from
  `V1BOT-AUDIT-01`. Bot Monitoring and Dashboard Home now share one web
  runtime open-position derivation helper for stream-first `markPrice`, live
  PnL, margin percent, DCA, and `TTP`/`TSL` display. Dashboard summary KPIs now
  reuse the same selected-bot live unrealized value as the open-position table
  for `summary.unrealized`, `paperDelta`, `paperEquity`, and selected `net`.
  Validation PASS: focused web derivation/component tests (`9/9`), web
  typecheck, web build, and repository guardrails. Evidence:
  `history/tasks/v1surf-02-shared-runtime-position-derivation-task-2026-05-02.md`.
- 2026-05-02: completed `V1BOT-AUDIT-01`, a read-only consistency audit across
  bot runtime API truth, `Dashboard -> Bots -> Monitoring`, and
  `Dashboard Home -> Runtime`. The API runtime read-model shape is now
  internally aligned around the aggregate/session positions and symbol-stats
  contracts, including the shared exchange-sync price preference introduced by
  `V1DOGE-03`. The next code risk is frontend drift: Bot Monitoring and
  Dashboard Home still maintain separate live open-position derivations, and
  Dashboard summary KPIs can mix selected-bot stream PnL with snapshot PnL for
  paper delta/equity. `V1SURF-02` is now the next tiny READY slice to share the
  web derivation contract and lock parity with focused tests. Evidence:
  `history/audits/v1bot-runtime-dashboard-audit-2026-05-02.md`.
- 2026-05-02: closed `V1DOGE-03`, an operator-reported `LIVE DOGEUSDT SHORT`
  protection hotfix. The dashboard could show exchange-sync PnL already below
  the visible `TTP` protected floor while runtime automation still evaluated a
  stale runtime price candidate. The runtime close path now reuses the same
  runtime-versus-exchange-sync price preference contract as the dashboard read
  model: imported `LIVE EXCHANGE_SYNC` positions prefer exchange-derived price
  from fresh `unrealizedPnl` whenever reconciliation is newer than the runtime
  tick. Focused regression coverage proves DOGE `SHORT` closes through
  `closeByExitSignal` with `trailing_take_profit` under that freshness shape,
  and also locks `TP`, `SL`, and `TSL` on the same price-truth contract.
  A follow-up dashboard-home derivation fix restores live market-stream
  precedence over API snapshots for visible open-position PnL, so percentages
  refresh when market data arrives. Validation PASS: focused runtime
  regression, related runtime/read-model pack (`40/40`), API typecheck,
  focused web derivation test (`3/3`), web typecheck, web build, and
  guardrails. Production deploy/readback remains the next
  operational evidence step. Evidence:
  `history/tasks/v1doge-ttp-exchange-sync-price-task-2026-05-02.md`.
- 2026-05-02: closed `V1MARKET-03`, the remaining operator-reported market edit
  blocker for a `LIVE` bot-linked market universe. Production smoke with user
  approval proved that disabling `live` moved its canonical `ETH` market group
  to `PAUSED`, but editing `ETH` still failed because active `Peper bot` had a
  stale legacy `BotStrategy` row pointing at `ETH Group` while its current
  canonical market scope is `Meme coins`. The market universe active-use guard
  now follows singular bot truth and blocks only active current primary or
  canonical bot market scope; stale legacy `BotStrategy` links no longer block
  edits after the real linked bot is deactivated. Validation PASS: markets e2e
  (`15/15`), bots runtime-scope e2e (`10/10`), API typecheck, and repository
  guardrails. Post-deploy verification found that web build-info had advanced
  to `8a433e07` while the `soar-api` container was still serving `6bc7840a`;
  after redeploying `soar-api` to `8a433e07`, `/health` and `/ready` returned
  `200` and the approved `LIVE` smoke passed end-to-end: disable `live`, edit
  linked `ETH` by adding `BTCUSDT`, restore the original whitelist, and
  re-enable `live`, all `200 OK`. Final production state: `live.isActive=true`
  and `ETH` whitelist restored to `BNBUSDT,DOGEUSDT,ETHUSDT,XRPUSDT`.
  Evidence:
  `history/tasks/v1market-03-ignore-stale-legacy-market-guard-task-2026-05-02.md`.
- 2026-05-02: production Redis investigation for `V1BOT-SIGNALS-02` confirmed
  the Soar Redis resource in Coolify is `restarting:unhealthy` because Redis
  repeatedly fails to load a corrupted append-only increment file. This
  explains the post-deploy authenticated smoke blocker where login timed out or
  returned rate-limit degradation while public `/health` and `/ready` still
  looked green. API readiness now includes required Redis `PING` in production,
  and operations docs now include Redis AOF recovery plus Redis-aware
  post-deploy smoke criteria. The production Redis volume was backed up and
  repaired with `redis-check-aof --fix`; Redis returned to `running:healthy`,
  authenticated login passed, and production SSE emitted real Binance FUTURES
  ticker/candle events. Readiness hardening deploy/readback remains the final
  closure gate for `V1BOT-SIGNALS-02`.
- 2026-05-02: closed `V1MARKET-02`, an operator-reported follow-up to the
  deactivated-bot market edit fix. The market universe form no longer uses the
  volume-filtered automatic result as the source for whitelist/blacklist
  dropdown options. Manual selection now uses the full Binance catalog for the
  selected exchange, market type, and base currency, while the preview/result
  contract remains `(volume-filtered catalog U whitelist) - blacklist`.
  Market option checkboxes also expose symbol labels for accessible selection.
  Validation PASS: focused market form component test (`8/8`), web typecheck,
  web build, and repository guardrails. Evidence:
  `history/tasks/v1market-02-whitelist-catalog-selection-task-2026-05-02.md`.
- 2026-05-02: closed `V1MARKET-01`, an operator-reported market-edit
  regression after the earlier inactive-bot market sync fix. Deactivating a
  bot now also moves its enabled non-archived canonical market groups to
  `PAUSED`, and reactivating restores them to `ACTIVE`, so stale canonical
  group lifecycle state can no longer behave like a second active-bot guard
  against editing linked market universes. The existing inactive-bot runtime
  graph mapping behavior is preserved for bots that were created inactive and
  did not go through a deactivation transition. Validation PASS: focused
  markets e2e (`14/14`), bots runtime-scope e2e (`10/10`), bots duplicate
  guard e2e (`4/4`), API typecheck, and repository guardrails. Evidence:
  `history/tasks/v1market-01-deactivated-bot-market-edit-task-2026-05-02.md`.
- 2026-05-02: added `V1BOT-SIGNALS-02` after an operator-reported production
  concern that `Dashboard -> Markets / Signals` appeared to show satisfied
  conditions while the PAPER bot did not open positions. Authenticated
  production read-only evidence showed the current PAPER session was `RUNNING`
  but had only `eventsCount=1` and `symbolsTracked=0`; market-stream SSE also
  connected but emitted no sampled ticker/candle events during the smoke
  window. The dashboard condition payload now carries per-rule `matched`
  truth from the canonical runtime strategy evaluator, so configured fallback
  snapshots can distinguish `PASS`/`MISS` from accepted runtime signals. The
  market-stream Redis publisher also resets failed memoized connection state
  after connect/publish failures so a transient Redis startup miss cannot
  permanently mute market events until worker restart. Follow-up websocket
  smoke found the remaining production-equivalent blocker: Binance USD-M
  Futures no longer delivers regular market streams from legacy
  `wss://fstream.binance.com/ws`; the worker now uses the routed
  `wss://fstream.binance.com/market/ws` endpoint that emitted futures kline
  data in local vendor smoke. Validation so far: focused market-stream/runtime
  read-model tests (`50/50`), focused Binance stream/fanout/subscription tests
  (`15/15`), API typecheck, web typecheck, API build, and repository
  guardrails. Production SSE event smoke remains required after deploy.
  Evidence:
  `history/plans/v1bot-signals-runtime-truth-2026-05-02.md`.
- 2026-05-02: closed `V1BACKTEST-01`, an operator-reported production
  backtest investigation after recent PAPER/LIVE runtime changes. Safe
  production smoke reproduced a mode-specific data problem: `FUTURES` run
  `d92219d3-ae5a-480f-ae35-1293e87339bf` failed with
  `NO_CANDLES_AVAILABLE_FOR_SYMBOL` and `totalTrades=0`, while comparable
  `SPOT` run `553a5c1a-66a9-4c70-be20-6c044cb11010` completed with
  `totalTrades=2`. The backtest gateway now keeps `/fapi/v1/klines` as primary
  but retries Binance USD-M futures chunks through `/fapi/v1/continuousKlines`
  before classifying a futures symbol as candle-empty, preserving venue truth
  and avoiding hidden SPOT/FUTURES substitution. Commit review from the last
  three days found direct backtest impact in `a7c0a357` (TSL negative-start
  plus step semantics) and `fbeae8f0` (backtest e2e V1 alignment); stale replay
  test data was aligned to the new TSL contract. Validation PASS: backtest
  gateway test (`3/3`), replay core (`25/25`), backtests e2e (`14/14`), API
  typecheck, API build, and repository guardrails. Evidence:
  `history/tasks/v1backtest-01-futures-kline-fallback-task-2026-05-02.md`.
- 2026-05-02: closed `DPL-PROD-BUILDINFO-01`, a production promotion hardening
  fix after an observed Coolify push deploy lag required an empty retrigger
  commit. The canonical `Promote PROD` workflow now waits for public web
  `/api/build-info` to expose the promoted `github.sha` before runtime
  freshness gates run. Direct push-driven Coolify redeploys remain convenience
  behavior, not release evidence. Validation PASS: wait script help,
  production readback against active SHA, and repository guardrails. Evidence:
  `history/evidence/prod-web-build-info-gate-2026-05-02.md`.
- 2026-05-02: closed `V1BOT-CONDITIONS-01`, an operator-reported production
  dashboard/runtime read-model fix. After a stopped bot changes strategy and
  starts again, `Markets / Signals` no longer lets a superseded historical
  `SIGNAL_DECISION` payload dictate the displayed condition indicators; stale
  signal context now falls back to the current configured strategy until a
  fresh runtime decision exists. The related market-universe concern was
  regression-locked: inactive PAPER and LIVE bots both allow market edits and
  linked symbol-group sync. Production pre-smoke exposed an additional
  existing-older-strategy switch edge case; aggregate merge now keeps current
  configured fallback context ahead of superseded historical signal context
  when the restarted session has not emitted a fresh accepted signal yet.
  Production paper smoke also exposed the no-new-session-yet aggregate race;
  aggregate reads now prefer configured strategy display context, while
  session-specific reads preserve explicit runtime event attribution.
  Validation PASS: focused bots runtime-scope e2e (`10/10`), markets e2e
  (`13/13`), API typecheck, API build, and repository guardrails. Evidence:
  `history/plans/v1bot-conditions-market-sync-2026-05-02.md`.
- 2026-05-02: added `V1I18N-01`, a complete Swiss German/German Switzerland
  locale rollout using the standards-compliant `de-CH` locale code for the
  operator-requested `CH_BE` language. The shared web i18n contract now
  supports `de-CH` in locale storage, provider hydration, namespace registry,
  route loading, Intl formatting, security bootstrap allow-list, all namespace
  translation files, and the shared language switcher with a CH flag option.
  Existing stronger parity checks also exposed and fixed Portuguese
  dashboard-home namespace drift. Validation PASS: focused i18n/UI tests
  (`22/22`), web typecheck, web build, repository guardrails, and
  route-reachable i18n audit with `findings=0`. Evidence:
  `history/tasks/v1i18n-01-swiss-german-locale-task-2026-05-02.md`.
- 2026-05-01: fixed `V1UI-FLAG-01`, an operator-reported footer language
  switcher flag regression. Commit review from `2026-05-01 09:00` found no
  post-09:00 commit directly touching footer or language switcher ownership, so
  the existing shared `LanguageSwitcher` contract was preserved and hardened:
  GB/PL/PT flags now render as visual CSS flag badges instead of
  regional-indicator text, and both public and dashboard footer tests assert
  the active footer flag remains visible without text content.
  Validation PASS: focused footer/language switcher tests (`5/5`), web
  typecheck, web build, repository guardrails. Evidence:
  `history/tasks/v1ui-flag-01-footer-language-flags-regression-task-2026-05-01.md`.
- 2026-05-01: fixed `V1DCA-05` after authenticated production verification on
  deployed `15cddb5a` proved the remaining `ETHUSDT DCA=0` regression was a
  restarted-session read-model gap, not a missing migration. The current
  runtime session started at `2026-05-01T17:11:21.540Z`, while the continuing
  imported ETH lifecycle had DCA rows in the prior session at
  `2026-05-01T03:20:19.592Z` and `2026-05-01T13:13:43.493Z`. Runtime
  `Positions` now reconstructs open imported lifecycle DCA from the earlier of
  bot creation and session start, bridges through same-ownership historical
  position ids for legacy DCA rows that lost both bot and wallet refs, includes
  legacy `LIVE` bot-scoped `walletId=null` trades, and preserves close/reopen
  stale-DCA boundaries. Validation PASS: focused imported DCA API e2e (`6/6`),
  API typecheck, API build, repository guardrails, diff check. Evidence:
  `history/tasks/v1dca-05-restarted-session-imported-dca-read-model-task-2026-05-01.md`.
- 2026-05-01: fixed `V1DCA-04` after the operator confirmed ETH still showed
  `DCA=0` despite two real DCA adds after the web monitoring hotfix. The
  remaining issue was the API runtime positions read model: wallet-scoped
  imported/exchange-sync DCA trade rows with missing `botId` and/or
  `strategyId` were excluded from supplemental DCA continuity. The read model
  now includes those rows for owned external symbols and keeps the existing
  close/reopen boundary that prevents stale DCA from crossing into a fresh
  lifecycle. Validation PASS: focused imported DCA API e2e (`5/5`), API
  typecheck, API build, repository guardrails. Evidence:
  `history/tasks/v1dca-04-wallet-scoped-imported-dca-read-model-task-2026-05-01.md`.
- 2026-05-01: fixed `V1DCA-03`, an operator-reported dashboard regression after
  production deployed `fbeae8f08926bc838141d53397fc142f52945356`. The commit
  scan from 09:00 identified `fbeae8f0` as the only post-09:00 commit touching
  bot runtime/web monitoring. Its new portfolio-history refresh was coupled to
  the global monitoring error state; that optional panel now fails soft so it
  cannot mask valid runtime `Positions` DCA ladder content. Validation PASS:
  focused `BotsManagement` web test (`13/13`), web build, web typecheck,
  repository guardrails, production build-info on
  `19a62b8d20f7e14d2489bbd8a842ca9c0c558efb`, and public production deploy
  smoke. Evidence:
  `history/evidence/v1dca-03-monitoring-dca-visibility-regression-task-2026-05-01.md`.
- 2026-05-01: closed `BHIST-01` as the bot-scoped product follow-up after the
  wallet-ledger preview wave. Current repository truth now covers
  wallet-level performance summary, equity timeline, cashflow markers for LIVE
  wallets, and a selected-bot portfolio history surface that shows progress
  from active bot start to now with explicit `PAPER_RESET` and wallet-capital
  event markers. The implementation reuses wallet-ledger events for LIVE
  markers, reuses `paperResetAt` for PAPER checkpoint markers, and avoids a
  parallel accounting path. Evidence:
  `history/tasks/bhist-01-bot-portfolio-history-and-capital-events-task-2026-05-01.md`.
- 2026-05-01: introduced and expanded the V1 function coverage ledger so
  module-level confidence can be tracked without repeated ad-hoc retesting.
  The matrix records module, submodule, mode, layer, parent capability, child
  scenario, expected behavior, local evidence, production evidence, confidence,
  risk, priority, owner, next verification, and notes. The initial
  money-path/runtime/release-gate ledger had 33 rows; the second code-scan pass
  expanded it to 79 rows across the primary top-level API/web module surfaces.
  Current production status split: `PASS=17`, `PARTIAL=22`,
  `NEEDS_PROD_SAMPLE=9`, `NEEDS_PROD_UI_CHECK=12`, `NOT_VERIFIED=11`,
  `NOT_APPLICABLE=5`, `BLOCKED=2`, `FAIL=1`; priorities: `P0=45`,
  `P1=24`, `P2=10`. Evidence:
  `history/audits/v1cover-01-function-coverage-ledger-task-2026-05-01.md`,
  `history/audits/v1cover-02-code-scan-function-ledger-expansion-task-2026-05-01.md`,
  `history/audits/v1-function-coverage-audit-2026-05-01.md`,
  `history/artifacts/v1-function-coverage-matrix-2026-05-01.csv`.
- 2026-05-01: classified the expanded V1 function ledger by implementation
  readiness. Current split: `READY=22`,
  `IMPLEMENTED_NEEDS_EVIDENCE=43`, `IMPLEMENTED_NOT_VERIFIED=11`,
  `V1_BLOCKER=3`, `REQUIRES_IMPLEMENTATION_REVIEW=0`. The current repository
  truth is that the ledger does not expose a broad missing implementation
  area; remaining V1 closure should prioritize release-gate blockers,
  live-money production evidence, manual operator matrix execution, targeted
  UI/route smokes, and explicit launch-scope/defer decisions. Evidence:
  `history/evidence/v1cover-03-function-implementation-readiness-task-2026-05-01.md`,
  `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`.
- 2026-05-01: closed the remaining local `SUBS-ENTITLEMENTS-001` implementation
  slice through `V1SUBS-01`. LIVE bot create and `PAPER -> LIVE` mode switch
  now fail closed against the active subscription payload's
  `features.liveTrading` flag, using one shared subscription entitlement
  guard. Validation PASS: focused entitlement e2e (`5/5`), API typecheck, API
  build, repository guardrails. Evidence:
  `history/tasks/v1subs-01-live-entitlement-bot-write-guard-task-2026-05-01.md`.
- 2026-05-01: refreshed the local `V1UX` route-smoke evidence wave after
  earlier sandbox notes claimed focused Vitest was blocked. The App Router
  shell pack for profile, logs, exchanges redirect, wallet preview, reports,
  markets, strategies, backtests, bot preview, bot assistant, and route-locale
  smoke now passes locally (`18/18` files, `19/19` tests). Web typecheck, web
  build, and repository guardrails are also green. Evidence:
  `history/evidence/v1ux-01-operational-route-smoke-task-2026-05-01.md`,
  `history/evidence/v1ux-reports-01-route-shell-smoke-task-2026-05-01.md`,
  `history/evidence/v1ux-routes-02-canonical-crud-route-shell-smoke-task-2026-05-01.md`,
  `history/tasks/v1ux-bots-03-canonical-bot-preview-assistant-route-shell-task-2026-05-01.md`.
- 2026-05-01: promoted the function coverage/readiness ledger into a reusable
  project standard. Future projects can copy the standard column contract,
  status vocabulary, readiness buckets, task derivation rules, evidence quality
  rules, and release-gate rules from
  `docs/governance/function-coverage-ledger-standard.md` and
  `docs/governance/function-coverage-ledger-template.csv`. Soar's V1 matrix is
  now documented as a project-specific instance of that model. Evidence:
  `history/audits/v1cover-04-model-function-ledger-standard-task-2026-05-01.md`.
- 2026-05-01: executed `V1FINAL-01` after production deployed
  `6a8ded9333eabced5e8461362e9e9237a9bf4e4d` on `main`. Gate 0 is now green:
  public and authenticated production smoke passed, protected runtime freshness
  passed with `runningCount=4`, rollback guard returned
  `shouldRollback=false`, and rollback proof was regenerated. The active
  `LIVE` `DOGEUSDT` runtime row now reports `dcaCount=0`, `tradesCount=1`, and
  `strategyAutomationContextResolved=true`, confirming the stale-DCA
  close/reopen regression no longer appears on the fresh open lifecycle. Final
  V1 remains `NO-GO/BLOCKED`: release-gate classification still reports stale
  activation audit/plan from `2026-04-22`, production restore drill failed due
  missing production DB container configuration in this execution context, the
  sign-off record is blocked by empty approver fields, manual operator/live
  exchange matrix is not complete, and stage remains `503`. Evidence:
  `history/tasks/v1final-01-prod-gate-execution-task-2026-05-01.md`,
  `history/releases/v1-release-gate-prod-2026-05-01T02-44-00-227Z.md`.
- 2026-05-01: production deploy freshness advanced to the current local V1
  candidate `fbeae8f08926bc838141d53397fc142f52945356` on `main`. Public
  production smoke passed for API `/health`, API `/ready`, and web `/`. A fresh
  release-gate classification still reports `not_ready` because the activation
  audit and activation execution plan are stale, and the production
  backup/restore drill evidence remains failed. Stage still returns `503`, so
  this is a deploy-fresh production candidate, not a formal V1 GO. Evidence:
  `history/releases/v1-release-gate-prod-2026-05-01T18-20-00-000Z.md`.
- 2026-05-01: published `V1DOGE-01` after the operator reported a real-money
  `LIVE DOGEUSDT` loss close and stale DCA on the next same-symbol open row.
  Protected production inspection confirmed the incident close was app-side
  automation (`closeReason=TSL`, `closeInitiator=BOT_APP`, realized PnL
  `-0.3500250000000007`) and the subsequent fresh `DOGEUSDT` open row showed
  stale `dcaCount=2` / executed levels `[-20,-40]` from the previous lifecycle.
  The audit identified two P0 implementation targets before further live-money
  confidence claims: preserve strategy identity on bot-managed close
  orders/trades, and make same-symbol close/reopen DCA/protection continuity
  fail closed. Evidence:
  `history/audits/v1doge-live-close-and-reopen-audit-2026-05-01.md`.
- 2026-05-01: closed local implementation for `V1DOGE-02` after the DOGE audit.
  Runtime automated close now passes `strategyId` into the execution
  orchestrator, same-symbol runtime `Positions` continuity cuts stale DCA at
  close boundaries even when legacy close trades lack `strategyId`, and
  supplemental DCA remains scoped to the current bot/wallet/strategy/symbol
  lifecycle. DCA-first `SL/TSL` authority is now covered for affordable pending
  DCA versus explicitly exhausted DCA, and runtime telemetry records
  operator-visible DCA exhaustion plus close-decision snapshots. Validation
  PASS: focused runtime automation, position-management, imported DCA
  visibility, and futures market-data gateway packs. Task packet:
  `history/tasks/v1doge-02-runtime-close-reopen-hardening-task-2026-05-01.md`.
  Protected production verification is still required after deploy.
- 2026-05-01: published the final V1 test structure after rechecking active
  queues and target freshness. Production public smoke passes, but production
  build-info still reports `c081f224134fedb65de2ecad716274b92593c373` while
  repository head is now `fba29a96`, including DOGE runtime hardening commit
  `577c45a8`, so the latest hardening is not yet deployed and cannot be
  verified on production. Stage public smoke still fails with `503`. GitHub
  workflow recheck shows the latest `Promote PROD` run is old (`0f122ed4`,
  2026-04-25) and failed; no current production promotion run exists for
  `577c45a8`/`fba29a96`. The final structure now freezes gate order: deploy
  freshness, DOGE close/reopen runtime regression, production V1EXCEL evidence,
  manual operator matrix, and final GO/NO-GO. Evidence:
  `history/plans/v1-final-test-structure-2026-05-01.md`; task packet:
  `history/tasks/v1final-00-final-test-structure-task-2026-05-01.md`.
- 2026-05-01: closed `V1GATE-01` as a fresh public target preflight after
  production/stage state changed again. Production public smoke is green and
  build-info now reports
  `662ce9b48fac6a48963a62f8d3bc4ac2f645cac6`, which is an ancestor of local
  `HEAD` `ef37fca0c4a3c47605986a815b5323fd535a37fa`; production is still behind
  the newest local commits `ca430aa5`, `1e20b6df`, and `ef37fca0`. Stage public
  smoke remains blocked before auth with `503` for API `/health`, API `/ready`,
  and web `/`. Evidence:
  `history/tasks/v1gate-01-current-target-freshness-sync-task-2026-05-01.md`,
  `history/plans/v1gate-01-current-target-freshness-2026-05-01.md`.
- 2026-05-01: closed `V1SMOKE-01` during deploy preparation. The local
  umbrella go-live smoke path is green again after verified non-destructive
  repair of local Prisma migration-history drift and fixture updates for
  current V1 contracts. `backtests.e2e` now tests external-position management
  through bot-level authority and grants a live-trading subscription when
  exercising the LIVE activation path; `BotsManagement` smoke expectations now
  include the canonical `manageExternalPositions` payload; and
  `goLiveSmoke.mjs` now names the actual failed migration in recovery guidance.
  Validation PASS: focused backtests e2e (`14/14`), focused web smoke pack
  (`17/17`), portfolio-history web test (`1/1`), and full
  `pnpm run test:go-live:smoke` (API `38/38`, web `17/17`). Evidence:
  `history/evidence/v1smoke-01-go-live-smoke-recovery-task-2026-05-01.md`.
- 2026-04-30: `V1ROE-04` was explicitly blocked on protected production evidence rather than local implementation. The local `V1ROE`, `V1OWN`, and `V1AUTO` slices closed the known repository-side margin-basis, stale read-model, imported ownership, runtime-state rebase, and prospective imported automation hydration gaps. The remaining acceptance signal was authenticated deployed-candidate verification on the real `LIVE DOGEUSDT` flow, documented in `history/tasks/v1roe-04-production-verification-task-2026-04-30.md`; local tests alone could not close it.
  - 2026-04-30 partial production check: deployed web build-info now confirms `522e1d95` on `main`, public deploy smoke passes, and the remaining blocker is strictly protected auth for runtime evidence (`401 Missing token` on runtime freshness and dashboard runtime probes). Evidence: `history/plans/v1roe-04-prod-verification-partial-2026-04-30.md`.
- 2026-05-01: queue/context sync normalized `V1ROE-04` after the deploy freshness check. The stale duplicate `READY` wording in `.codex/context/TASK_BOARD.md` was removed, and the task stayed blocked until authenticated production evidence could be captured with a token, email/password smoke credentials, or an authenticated browser/session cookie. Canonical sync task: `history/tasks/docsync-2026-05-01-queue-auth-blocker-task.md`.
  - 2026-05-01 follow-up: the task was moved out of the `READY` section entirely and now appears only under `BLOCKED` in `.codex/context/TASK_BOARD.md`, preserving the fail-closed production-auth gate. Canonical follow-up sync task: `history/tasks/docsync-2026-05-01-ready-blocked-separation-task.md`.
  - 2026-05-01 follow-up: `docs/planning/mvp-next-commits.md` stated that no autonomous `NOW` implementation task was executable without protected production auth. This was a temporary fail-closed sync before the protected credentials became available. Canonical sync task: `history/tasks/docsync-2026-05-01-no-autonomous-now-task.md`.
  - 2026-05-01 follow-up: the legacy `BLOCKED` section in `docs/planning/mvp-next-commits.md` was synced from stale `none` to the same `V1ROE-04` protected-auth blocker. That entry is superseded by the later 2026-05-01 closure. Canonical sync task: `history/tasks/docsync-2026-05-01-mvp-blocked-section-task.md`.
- 2026-05-01: closed `V1ROE-04` with authenticated protected production evidence. Production build-info reports `e6bdcfda35698dbb29513490a953e15b9a2c0469` on `main`, public deploy smoke and protected runtime freshness pass, protected `DOGEUSDT` runtime truth is exchange-synced, confirmed, actionable, and strategy-context resolved, and headless dashboard proof confirms the `live` bot `Positions` row matches the protected API shape. Evidence: `history/plans/v1roe-04-prod-verification-closure-2026-05-01.md`. Remaining confidence work is the separate `V1EXCEL-03..06` authenticated manual/OPS evidence wave; `BOTMULTI-*` remains deferred until those gates are green.
- 2026-05-01: completed the production slice of `V1EXCEL-06` runtime observability. Authenticated `ops:deploy:runtime-freshness` passed on production, and authenticated `ops:deploy:rollback-guard` returned `shouldRollback=false`, no reasons, no alerts, and `runningCount=4`. Evidence: `history/plans/v1excel-runtime-observability-2026-04-29.md` and `history/tasks/v1excel-06-prod-runtime-observability-task-2026-05-01.md`. The broader `V1EXCEL` confidence wave remains open for manual matrix, stage evidence, broader prod release-gate evidence families, and stage runtime observability.
- 2026-05-01: refreshed `V1EXCEL-04` stage public smoke and found a new,
  earlier blocker than protected auth. Stage web/API currently return `503 no
  available server` for public health/ready/root and web build-info, so
  authenticated stage release gates cannot be meaningfully rerun until the
  Coolify stage services are restored or redeployed. Evidence:
  `history/plans/v1excel-04-stage-refresh-503-2026-05-01.md`.
  - 2026-05-01 follow-up: stage still returns `503 no available server`.
    Coolify web login works for the provided operator account, but the visible
    project/environment does not expose Soar resources and Coolify API resource
    reads return `401` without a bearer token. Automated restore/deploy remains
    blocked on proper Coolify resource/API access. Evidence:
    `history/plans/v1excel-04-stage-coolify-access-refresh-2026-05-01.md`.
  - 2026-05-02 supersession: stage refresh is deferred to V2 by operator
    decision in `V1CLOSEOUT-11` and is no longer a V1 production-only blocker.
- 2026-05-01: refreshed the executable production subset of `V1EXCEL-05`.
  Production public smoke, protected runtime freshness, and rollback guard are
  green on the current deployed runtime candidate: `shouldRollback=false`, no
  reasons, no alerts, `runningCount=4`. Production rollback-proof artifact is
  also PASS with secret-safe command recording. Evidence:
  `history/plans/v1excel-05-prod-refresh-2026-05-01.md`. Broader production
  release evidence remains open for restore drill, RC
  status/sign-off/checklist rebuild, and remaining manual matrix items.
  - 2026-05-02 supersession: production restore drill, rollback proof, Gate 4
    approval, and non-dry-run production release gate are fresh/pass in
    `V1CLOSEOUT-11`; this older production refresh blocker is no longer active.
- 2026-05-01: closed `V1DCA-01` for runtime `Positions` DCA visibility after
  exchange-sync position replacement. Protected production inspection showed
  the `LIVE` DOGEUSDT DCA fill existed as a persisted `BOT` `DCA` trade, but it
  remained linked to a superseded local `positionId` after the current
  `EXCHANGE_SYNC` open row was replaced, so the dashboard row rendered
  `dcaCount=0`. The runtime positions read model now combines direct
  position-linked trades with strictly scoped same-session DCA candidate trades
  and attaches only real persisted DCA rows that match
  bot/wallet/strategy/symbol/side/lifecycle window. Validation PASS: focused
  imported DCA visibility e2e, API typecheck, API build, repository guardrails.
  Post-deploy protected production verification also PASS on deployed commit
  `9460317c7d9409062ff2ddd284a179a60ac89f1a`: web build-info confirms `main`,
  public API health/ready pass, and the current protected DOGEUSDT `Positions`
  row reports `dcaCount=1`, `tradesCount=2`, and `lastTradeAt` from the real
  `BOT/DCA` trade despite the DCA trade remaining linked to the superseded
  `positionId`. Evidence:
  `history/plans/v1dca-01-prod-verification-2026-05-01.md`.
- 2026-05-01: closed `V1DCA-02` after the operator reported DOGEUSDT should
  have two DCA fills while `Positions` implied only one. Protected production
  inspection confirmed the active session summary and DOGEUSDT trade ledger
  had two real persisted `BOT/DCA` fills, both linked to superseded local
  `positionId` rows after consecutive exchange-sync replacements. Runtime
  positions read now derives supplemental DCA continuity from same-session
  persisted `OPEN/DCA/CLOSE` lifecycle rows and starts counting from the first
  same-identity open after the last exit instead of only the latest
  replacement row's `openedAt`. Focused regression now proves two replacement
  DCA fills render as `dcaCount=2` with two executed levels while unscoped DCA
  rows remain excluded. Validation PASS: focused imported DCA visibility e2e
  (`3/3`), lint, API typecheck, API build, repository guardrails. Task packet:
  `history/tasks/v1dca-02-multi-replacement-dca-count-task-2026-05-01.md`.
- 2026-04-30: closed `WLEDGER-07..09` as the wallet preview UI slice. Wallet list rows now have a shared preview table action that opens `/dashboard/wallets/:id/preview`, and that route renders ledger-backed wallet analytics: account/allocated balance, contributed capital, bot PnL, wallet delta, unclassified adjustment, equity timeline, and cashflow events. The UI keeps deposits/withdrawals separate from bot PnL, surfaces partial ledger completeness, and formats crypto amounts as number plus symbol instead of assuming ISO currency support.
- 2026-04-30: closed `WLEDGER-06` as the first wallet analytics read API. Dashboard wallet routes now expose performance summary, equity timeline, and cashflow events from persisted snapshots/events, including current balance, contributed capital, bot PnL fields, fees/funding, unclassified adjustment, wallet delta percent, timeline markers, and completeness state.
- 2026-04-30: closed `WLEDGER-05` as the first cashflow classification slice. Initial allocated LIVE wallet balance is now persisted as `INITIAL_BALANCE`, deterministic exchange-history entries can be mapped into deposit, withdrawal, transfer, fee, funding, realized-income, and unknown cashflow sources, and stable exchange event ids are upserted idempotently by `(walletId, exchangeEventId, source)`. Raw balance drift still does not become bot PnL.
- 2026-04-30: closed `WLEDGER-04` as the first ingestion slice for the future LIVE wallet ledger. LIVE wallet creation now records an initial `WalletBalanceSnapshot` from authenticated exchange balance preview, and runtime capital refresh records periodic wallet balance snapshots whenever it fetches fresh exchange balance outside the cache. This does not change runtime sizing authority; it only persists the balance evidence needed by later classification and read-model slices.
- 2026-04-30: closed `WLEDGER-03` as the exchange-boundary slice for future LIVE wallet ledger ingestion. The existing exchange execution/authenticated-read capability contract now includes `WALLET_CASHFLOW_HISTORY`, with Binance explicitly supported for V1 and unsupported exchanges failing closed. The canonical `exchangeAdapterBoundary` exposes wallet cashflow history reads, and the CCXT connector normalizes supported account-history methods (`fetchLedger`, `fetchDeposits`, `fetchWithdrawals`, `fetchTransactions`) into deterministic cashflow-history rows for later ingestion without bypassing the approved exchange boundary.
- 2026-04-30: closed `WLEDGER-02` as the DB persistence foundation for the future LIVE wallet ledger. Prisma now has `WalletBalanceSnapshot` and `WalletCashflowEvent` models with user/wallet ownership, exchange/market/base-currency context, balance and allocation snapshot fields, cashflow direction/source enums, deterministic exchange-event uniqueness, and optional links to position/order/trade lifecycle records. The equity timeline remains read-time derived until the API read model proves materialization is necessary.
- 2026-04-30: closed `WLEDGER-01` as the implementation-grade architecture contract for the future LIVE wallet ledger. The new `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md` freezes model semantics for balance snapshots, cashflow events, and equity points; event classification; completeness states (`COMPLETE`, `PARTIAL`, `UNAVAILABLE`); read-model formulas; API response requirements; dashboard behavior; and forbidden accounting shortcuts such as counting deposits as bot profit or withdrawals as bot loss. Exchange-access architecture now explicitly keeps future wallet cashflow history reads behind the canonical authenticated-read boundary.
- 2026-04-30: closed `WLEDGER-00` as the target contract for future LIVE wallet performance analytics. The accepted product/architecture direction is that wallet performance must separate user-contributed capital from bot-generated PnL: initial exchange balance and later deposits/inbound transfers increase contributed capital, withdrawals/outbound transfers decrease it, bot lifecycle results update bot PnL, and ambiguous exchange balance drift remains visible as unclassified adjustment instead of being silently counted as bot profit/loss. The implementation target is a wallet cashflow ledger plus equity timeline, documented in `docs/architecture/reference/wallet-source-of-truth-contract.md` and queued in `history/audits/live-wallet-cashflow-ledger-and-equity-timeline-plan-2026-04-30.md`.
- 2026-04-30: closed `UXFIX-2026-04-30-B` for dashboard wallet KPI data truth. `Delta from start` no longer stays blank for `LIVE` percent-allocation bots when runtime equity and net PnL are available; the web preserves PAPER and LIVE fixed-allocation baseline behavior, and derives the LIVE percent denominator from `runtime portfolio - selected net PnL` so the operator sees a session delta instead of `-`.
- 2026-04-30: closed `UXFIX-2026-04-30-A` for dashboard table action visual consistency. The runtime `Positions` table now reuses the shared `TableIconButtonAction` contract for row-level edit and close actions, keeping position-specific icons and behavior while matching the default table action sizing, tooltip wrapper, semantic tones, and hover treatment used by wallets and other dashboard tables.
- 2026-04-30: closed `V1SAFE-19` after fresh protected production observation on the live dashboard showed one narrower remaining operator-truth gap: imported managed `LIVE` positions could already expose truthful `PnL%`, strategy-level `TTP` configuration, and `showDynamicStopColumns=true`, yet still return `dynamicTtpStopLoss=null` once `PnL%` moved above the first `TTP` arm. The root cause was twofold inside the runtime read-model contract: serializer fallback treated any finite runtime `trailingTakeProfitHigh/Step` pair as authoritative even if it did not yield a valid positive trigger anymore, and positions-read preferred stale runtime state snapshots even when their canonical basis drifted away from the current imported `EXCHANGE_SYNC` position. Runtime read-model truth now treats runtime `TTP` state as authoritative only when it resolves to a valid positive trigger and otherwise falls back to strategy-level `TTP`; imported runtime display also ignores stale drifted basis state instead of letting it suppress visible protection.
- 2026-04-30: closed `V1SAFE-18` as the next live-history operator-truth slice. After `V1SAFE-17`, the remaining dashboard gap was that imported/open lifecycle rows still left the actor column empty because only close-side `closeInitiator` was rendered, and the additional `History - operational trade log` subheading added no meaning. The dashboard now exposes one `Opened / Closed by` actor column for trade history, using canonical `closeInitiator` for close rows and existing `origin` for open/imported rows, while the redundant subheading is removed.
- 2026-04-30: closed `V1SAFE-17` after a fresh operator question exposed one last history-semantics drift on the live dashboard. The repository intentionally reuses `POSITION_LIFETIME` as the action reason for imported `OPEN` lifecycle anchors, which is valid internally but misleading when the web renders the same copy used for true timeout closes. The dashboard trade-history reason badge now distinguishes `POSITION_LIFETIME + OPEN` as lifecycle-open context and keeps `Position lifetime` only for actual close-side rows, so operator history stays truthful without changing the approved backend/runtime contract.
- 2026-04-30: closed `V1SAFE-16` for strategy-edit active-bot lock clarity after operator feedback proved the guard itself was correct but the unlock path was still too ambiguous in practice. Strategy mutation remains blocked by canonical `bot.isActive` safety, not by transient runtime stop state, but strategy lock responses now carry blocking `botId + botName` and the web edit screen explicitly explains that stopping the runtime session is not enough, surfaces the blocking bot identity, and links directly to that bot's settings so operators can switch `Active` off before saving urgent strategy fixes such as lifecycle changes.
- 2026-04-30: closed `V1SAFE-15` for dynamic `TTP` operator truth after a fresh live-dashboard observation exposed one narrower residual surface drift. Backend/runtime close behavior could already honor `TTP`, but runtime position serialization still had one fallback path that derived displayed `TTP` from current favorable move rather than the canonical trailing anchor, so the table value could fall during a pullback even though `TTP/TSL` should only ever ratchet protection upward. The repository now prefers anchor-based `PnL fraction` fallback whenever runtime anchor state exists, preserving dynamic-stop column visibility without introducing display-only sticky state and keeping operator `TTP` truth monotonic with the real protected floor.
- 2026-04-30: closed `V1SAFE-14` for advanced `TSL` semantics after direct operator verification showed the previous fail-closed guard had frozen the wrong contract. The repository now treats advanced `TSL` as loss-side `start + step` truth, not as profit-side trailing retrace capped by the activation threshold: `percent` is the negative activation/start threshold and `arm` is the positive trailing step after activation. Web form validation/sanitization, API strategy validation, runtime parser, and backtest parser are now aligned to that contract, so `TSL percent=-20 / arm=10` is valid again and remains consistent across `LIVE`, `PAPER`, and `BACKTEST`.
- 2026-04-30: closed `V1SAFE-13` for the strategy-form threshold workflow. Strategy create/edit no longer relies on three duplicated append-only list editors for `TTP`, `TSL`, and advanced `DCA`. The repository now uses one shared sortable threshold editor with drag handle plus keyboard-accessible move controls, keeps stable local row identity in form state to avoid reorder/input drift, and strips those local ids before POST/PUT payload serialization so backend strategy config remains unchanged. This preserves the existing fail-closed backend validation while removing the operator need to rewrite entire ladders after adding a new earlier threshold.
- 2026-04-30: extended `V1SAFE-12` after the first web-only sanitize pass still left one practical edit trap. Besides sanitizing legacy invalid advanced `TTP/TSL` thresholds on DTO load, the strategy form pipeline now also starts from a valid default `TSL` threshold and strips any reintroduced legacy-invalid trailing thresholds from the submit payload itself before the request is sent. This keeps strategy edit resilient even when old invalid close thresholds survive in browser state or cached form state, while API/runtime validation still fail closed on any newly submitted invalid config.
- 2026-04-30: closed `V1SAFE-11` after protected production verification on `XRPUSDT` proved one remaining operator-visible trailing-close bug was actually a configuration-safety gap rather than just a table-rendering drift. The active `LIVE` row showed a sane positive `PnL%` but an impossible `TSL -292.81%`; backend inspection traced that value to an invalid advanced trailing-stop configuration where trailing retrace exceeded the arm/trigger threshold (`TSL arm=10`, `trail=-20`). The repository now fails closed at every layer for that class: strategy create/update/import rejects invalid `TTP/TSL` thresholds, the strategy form blocks those values before submit, runtime config parsing and runtime automation filter any legacy invalid thresholds out of execution, and runtime serialization no longer exposes trailing-stop trigger percent from negative trailing state. This keeps `LIVE`, `PAPER`, and `BACKTEST` on one shared protective-close contract instead of silently allowing non-protective thresholds.
- 2026-04-30: closed `V1HIST-10` as the next smallest canonical-ledger slice after `V1HIST-09` fixed only the operator surface. The repository no longer relies solely on runtime-only history anchors for fresh imported open lifecycles. `importedPositionHistoryHydrator` now persists one local `EXCHANGE_SYNC OPEN` anchor trade from canonical `Position` truth whenever authenticated exchange trade history cannot yet be reconstructed for an imported open row, and later canonical exchange-derived trades automatically replace that synthetic anchor instead of duplicating lifecycle rows. Runtime trade reads also classify persisted imported anchors as `POSITION_LIFETIME`, keeping dashboard/operator semantics aligned with the ledger instead of showing `SIGNAL_ENTRY` for externally imported lifecycles.
- 2026-04-30: closed `V1HIST-09` after a full protected production plus browser audit finally separated one remaining operator-history gap from the already fixed `Positions` and `Orders` truth. Fresh `LIVE` imported positions such as `BNBUSDT` and `XRPUSDT` were now rendering correctly in `Positions`, and `Orders` correctly showed no open orders, but the dashboard `History` tab still rendered only persisted trade rows, which meant fresh imported lifecycles with `tradesCount=0` stayed invisible even though canonical `Position` truth already carried valid `openedAt`, `entryPrice`, `quantity`, and ownership. The repository now emits one operational `OPEN` anchor row from canonical position truth whenever a scoped imported lifecycle has no local trade rows yet, reusing existing `POSITION_LIFETIME` semantics for the dashboard history feed instead of inventing exchange fills that do not exist locally.
- 2026-04-30: closed `V1HIST-08` after a second protected production audit on the same live bot separated one deeper imported-history root cause from the already closed dashboard-surface drift. Production runtime payloads for fresh imported `BNB/XRP/DOGE` open positions were now using sane `PnL` truth, but they still carried `tradesCount=0` and `firstTradeAt=null`, which meant imported opening-history hydration was still failing before UI ever had anything truthful to render. The strongest common seam was symbol contract mismatch at the authenticated exchange boundary: Soar asked trade-history reads with app-normalized ids like `XRPUSDT`, while the CCXT connector/test family already speaks unified exchange market symbols like `XRP/USDT:USDT`. `CcxtFuturesConnector` now resolves normalized symbol ids back to canonical CCXT market symbols before trade-history, order-read, ticker, open-order, and rules lookups, and focused regression coverage locks the raw-id to market-symbol mapping for imported trade-history fetches.
- 2026-04-30: closed `V1SURF-09` as the next operator-truth slice after fresh production dashboard notes on `BNB`, `DOGE`, and `XRP`. The repository previously had three surface drifts masquerading as one bug: imported/adopted `LIVE` positions could remain visible while their trade rows were still re-filtered by older bot-scoped ownership semantics, adopted imported rows were not hydrating exchange trade history on the update/reuse path even though the create path already did, and dashboard runtime derivations could recompute `PnL%` from stale stream/session prices even when the backend had fresher canonical `markPrice`, `unrealizedPnl`, and `unrealizedPnlPercent`. The repository now reads trades for already visible runtime positions by canonical `positionId`, hydrates imported exchange history on both create and adopt/update reconciliation paths, prefers backend PnL truth on the web, and keeps periodic dashboard polling alive even when SSE is nominally connected. This narrows the remaining operator closure work back to protected manual production verification instead of another obvious local dashboard-truth gap.
- 2026-04-30: closed `V1IMPORT-01` after protected production verification on the reported `BNBUSDT` gap finally separated import truth from dashboard truth. The exchange snapshot was already showing both `DOGEUSDT` and `BNBUSDT`, but runtime positions only exposed `DOGEUSDT` because an older open wallet-owned `BOT_MANAGED` local row for `BNBUSDT` still existed without `botId`, which meant reconciliation could neither reuse it nor lifecycle-replace it before the open-position uniqueness constraint blocked fresh import. The repository now treats wallet-owned botless local rows as valid local candidates inside owned `LIVE` reconciliation, allowing the existing lifecycle-replacement rules to close stale blockers or adopt a fresh local row under the canonical owner context. Reused local rows also receive canonical `externalId`, so upgrade from local `BOT/USER` truth to `EXCHANGE_SYNC` truth is no longer half-complete on later iterations.
- 2026-04-30: closed `V1TAKE-10` after the user approved a stricter ownership contract for imported `LIVE` exchange positions. The repository no longer treats `wallet.manageExternalPositions` as canonical runtime truth. Added `Bot.manageExternalPositions` with deterministic SQL backfill from linked wallets so current production bots keep their existing behavior, moved imported-position management authority into bot create/edit settings as one checkbox, removed the editable wallet-level toggle from operator UX, and rewired runtime ownership/takeover resolution to derive management truth from the bot-level flag plus bot symbol scope. Wallet and API-key management flags now remain compatibility-only metadata, not runtime authority.
- 2026-04-30: closed `V1AUTO-03` as the next operator-truth slice on imported managed positions. Runtime positions payload no longer assumes every lifecycle already has a canonical local `OPEN` trade before `DCA` can be shown. Imported managed rows now derive `dcaCount` from explicit `DCA` trades and runtime `currentAdds` before the older entry-leg-count fallback, so dashboard `DCA` visibility can stay truthful even while imported opening-history hydration still catches up.
- 2026-04-30: closed `V1AUTO-02` as the next smallest imported-automation parity slice after ownership and stale-state rebase were already green locally. `livePositionReconciliation` now wakes the canonical runtime automation engine prospectively when it creates or updates a canonically owned imported `LIVE` row with confirmed continuity and fresh positive `markPrice`, instead of waiting passively for a later ticker-path event. This stays aligned with `docs/architecture/reference/live-protection-state-parity-contract.md` because the repository still uses one runtime automation engine and only hydrates protection from the adoption point onward.
- 2026-04-30: closed `V1OWN-01` as the next smallest ownership-parity runtime slice after the latest protected production `DOGEUSDT` verification. Imported owned `EXCHANGE_SYNC` positions no longer depend solely on persisted `position.botId` to participate in runtime automation: default runtime-position lookup now reuses the canonical external-position ownership classifier to hydrate effective bot execution context for owned imported rows, and bot-scope open-position counting in the runtime signal loop now includes those owned imported `LIVE` rows as well. Closure evidence: `history/plans/v1own-imported-live-runtime-ownership-closure-2026-04-30.md`.
- 2026-04-30: closed `V1AUTO-A` as the next smallest runtime-continuity hardening slice after the latest protected production verification. `runtimePositionAutomation` now rebases imported `EXCHANGE_SYNC` state to canonical exchange-synced `quantity + entryPrice` truth whenever persisted runtime state drift is material, so stale `currentAdds`, quantity basis, or entry basis can no longer silently survive an in-place exchange-sync update on the same imported row. Closure evidence: `history/plans/v1auto-runtime-state-rebase-closure-2026-04-30.md`.
- 2026-04-30: published `V1AUTO-A` after protected production verification on the active `LIVE DOGEUSDT` flow narrowed the next likely code gap further. The stale runtime-price seam appears closed on production, but the imported `LIVE` row can still look unmanaged even while exchange-synced `markPrice`, `unrealizedPnl`, and `marginUsed` are fresh. The strongest remaining hypothesis is same-row continuity drift inside runtime automation itself: `runtimePositionStateStore` may still carry stale `currentAdds`, quantity basis, or entry basis when reconciliation updates an imported `EXCHANGE_SYNC` row in place. Canonical packet: `history/plans/v1auto-runtime-state-rebase-plan-2026-04-30.md`.
- 2026-04-30: closed the first implementation slice of `V1ROE-A` after the user approved canonical `LIVE` PnL truth alignment without splitting the lifecycle engine into a separate exchange-only semantics path. The repository now persists `Position.marginUsed` as exchange-synced margin basis, carries that truth through exchange snapshot normalization and reconciliation, and uses one shared `current position pnl fraction` contract for lifecycle decisions: `BACKTEST` and `PAPER` still derive modeled margin from entry/quantity/leverage, while `LIVE` now uses exchange-synced `marginUsed` whenever available and exposes the same basis to operator surfaces through runtime `marginUsed` and `unrealizedPnlPercent`. Fresh local validation is green; remaining closure is protected production/manual evidence on the affected `DOGEUSDT` flow plus the rest of `V1EXCEL-03`.
- 2026-04-30: a fresh protected production check after the `V1ROE-01` deploy attempt proved one narrower residual gap in the repository closure story. The authenticated `runtime-sessions/:sessionId/positions` response for the active `LIVE DOGEUSDT` session still returned the old payload shape without `marginUsed` or `unrealizedPnlPercent`, even though local code now exposes both fields. This means the fix itself is still locally green, but the repo lacked one explicit end-to-end contract lock at the runtime-positions API seam and production verification must now confirm both deploy freshness and exchange-aligned operator truth.
- 2026-04-30: closed `V1ROE-02` as the missing runtime-positions contract lock revealed by that protected prod check. The repository now has a focused e2e proof (`bots.runtime-pnl-parity.e2e.test.ts`) that a canonical `LIVE` runtime position with persisted `marginUsed` different from modeled margin still comes back from `runtime-sessions/:sessionId/positions` with the same `marginUsed`, truthful `unrealizedPnl`, and `unrealizedPnlPercent` computed from the persisted margin basis. This narrows the remaining closure risk away from local API regression and back onto deploy freshness plus real protected `DOGEUSDT` operator verification.
- 2026-04-30: the next protected production pass after `V1ROE-02` confirmed that deploy freshness is no longer the main blocker. The active `LIVE DOGEUSDT` row now exposes `marginUsed` and `unrealizedPnlPercent` on production, but the current basis still appears to follow `initialMargin`-style truth for isolated futures positions (`marginUsed≈0.769`, `unrealizedPnlPercent≈-27.83%`). That is still too weak to call exchange parity closed if the operator-visible Binance percent is lower because additional isolated margin was added. The next smallest code fix is therefore not another broad PnL rewrite, but a narrower isolated-margin normalization correction: prefer real `isolatedWallet` margin authority for `ISOLATED` `LIVE` positions while preserving the shared lifecycle engine.
- 2026-04-30: closed that isolated-margin correction as `V1ROE-03`. Exchange snapshot normalization now prefers `isolatedWallet` for `ISOLATED` futures positions before `isolatedMargin` and initial-margin fields, which should better match the real exchange operator truth when additional margin has been added to an open isolated position. Focused regression coverage now locks both sides of the rule: isolated positions use isolated-wallet truth, while non-isolated positions keep initial-margin precedence. The remaining closure risk is back on protected post-deploy verification of the real `DOGEUSDT` flow.
- 2026-04-30: another protected production audit narrowed `V1ROE-04` to one read-model freshness seam rather than a new exchange-normalization gap. Direct exchange snapshot and persisted `Position` truth for the active `LIVE DOGEUSDT` row were already fresh (`markPrice`, `unrealizedPnl`, `marginUsed`, `lastExchangeSyncAt`), but runtime session `positions` and `symbol-stats` could still recompute operator truth from an older `botRuntimeSymbolStat` / runtime ticker price. The repository now prefers fresher exchange-synced lifecycle truth for `EXCHANGE_SYNC OPEN` rows whenever runtime cache price is older than `lastExchangeSyncAt`, and focused e2e coverage locks both `runtime-sessions/:sessionId/positions` and `symbol-stats` against silently regressing to stale session price. Remaining closure is protected post-deploy verification on the affected `DOGEUSDT` flow.
- 2026-04-30: published `V1ROE-A` after a fresh protected production audit of the active `LIVE DOGEUSDT` flow. The repository now has explicit evidence that two different drifts were being conflated: current Soar `PnL %` semantics are still `unrealizedPnl / (entryNotional / leverage)` rather than exchange-style `ROE`, and imported/reopened `LIVE` automation still appears stale enough to miss `DCA/TTP` evaluation after reopen/import even under Soar's own current leveraged-move thresholds. The analysis packet intentionally stops before implementation because one explicit product/architecture decision is required first: keep lifecycle thresholds on leveraged move and align operator UI separately, or migrate lifecycle thresholds to exchange-ROE semantics. Canonical packet: `history/audits/v1roe-live-pnl-roe-and-runtime-automation-parity-plan-2026-04-30.md`.
- 2026-04-29: closed the first backend hydration slice of `V1HIST-A`. Soar no longer has to rely only on the weaker imported position snapshot timestamp for newly adopted exchange positions: the authenticated exchange boundary now exposes trade-history reads, imported lifecycle hydration reconstructs the current open lifecycle only when canonical fill truth is sufficient, imported `OPEN` / `DCA` / partial `CLOSE` trades are persisted without inventing fake fills, and `position.openedAt` is corrected to the first canonical fill when hydration succeeds. External-close ledger parity still remains open.
- 2026-04-29: closed the external-close ledger parity slice of `V1HIST-A`. Imported managed positions that disappear from exchange truth are no longer limited to row-level closure only when deterministic exchange trade history is available: reconciliation now backfills the final lifecycle window from canonical exchange trades, persists missing imported `CLOSE` trades with `USER_EXCHANGE` attribution, and updates `position.closedAt` to the last canonical close fill instead of trusting only the local reconciliation timestamp. The implementation stays fail-closed when exchange trade history is insufficient.
- 2026-04-29: closed the full `V1HIST-A` packet. The repository now has one coherent imported lifecycle history model for `V1`: imported opening history may be hydrated only from deterministic exchange trades, imported externally closed managed positions may backfill missing `CLOSE` trades and canonical `closedAt` from deterministic exchange trade history, runtime history keeps those closed positions visible, and dashboard history surfaces expose separate `openedAt` and `closedAt`. Closure evidence: `history/plans/v1hist-imported-exchange-lifecycle-history-closure-2026-04-29.md`.
- 2026-04-29: closed the first implementation slice of `V1HIST-A`. Operator-visible history for runtime positions now stops collapsing lifecycle time into one ambiguous field: dashboard history tables render separate `openedAt` and `closedAt` columns, and the repository now has focused API proof that a closed imported `EXCHANGE_SYNC BOT_MANAGED` position remains visible in `historyItems` with both timestamps preserved. The deeper imported opening-history hydration and external-close ledger parity remain open under the rest of `V1HIST-A`.
- 2026-04-29: published `V1HIST-A` after a focused audit of another `LIVE` completeness gap exposed by fresh operator notes. Current repository truth is that imported exchange positions can already be adopted into active bot-managed state and later stale-closed when exchange truth disappears, but imported lifecycle history is still not a fully closed vertical slice: the import path does not yet guarantee opening-history ledger parity, reconciliation-driven external close does not yet guarantee equivalent close-history truth, and dashboard history presentation still compresses lifecycle time too aggressively. Canonical packet: `history/plans/v1hist-imported-exchange-lifecycle-history-plan-2026-04-29.md`. The detailed operator scenario companion is `history/audits/v1live-mixed-origin-verification-matrix-2026-04-29.md`.
- 2026-04-29: closed the first implementation slice of `V1REOPEN-A` after the new `DOGEUSDT` live report. The repository now treats same-symbol reopen as a first-class lifecycle-truth problem instead of a display-only issue: `livePositionReconciliation` immediately retires stale opposite-side rows when a same-symbol replacement lifecycle appears, detects same-side lifecycle discontinuity from newer exchange open timestamps, and clears persisted runtime position state whenever reconciliation force-closes or supersedes a lifecycle. This is meant to stop two concrete regressions at once: wildly wrong operator-visible `PnL%` after close/reopen on the same market, and stale `TTP/DCA/TSL` runtime state bleeding into the new position.
- 2026-04-29: a deeper post-fix audit found one more plausible code-level `V1REOPEN` drift beyond lifecycle retirement itself. Dashboard `TTP/TSL` visibility is still gated by bot-level `showDynamicStopColumns`, which is derived from active advanced-close topology, not from actual reopened row truth. That means a reopened or recovered position may already carry real `dynamicTtpStopLoss` / `dynamicTslStopLoss`, but the operator table can still hide those columns if strategy-topology context is unresolved or temporarily degraded. This is now the strongest remaining candidate for `V1REOPEN-05/06`.
- 2026-04-29: closed `V1REOPEN-06`. Runtime operator truth now stays aligned across API and both web surfaces even when bot strategy topology drifts after a position lifecycle is already open or recovered: backend `showDynamicStopColumns` remains true whenever any open row carries real dynamic-stop truth, dashboard/runtime monitoring surfaces OR topology mode with row truth instead of treating `false` as absolute, and runtime serialization regained the missing bot-managed `TTP` fallback plus sticky post-pullback continuity from strategy levels and persisted `trailingLossLimitPercent`.
- 2026-04-29: closed the full `V1REOPEN-A` packet. Same-symbol `LIVE close -> reopen` is now treated as canonical lifecycle replacement end to end: stale old rows are retired during reconciliation, stale runtime protection state is cleared on lifecycle retirement, operator surfaces preserve row-level dynamic-stop truth after reopen, and focused runtime proof now locks that a reopened imported `LIVE` position still executes `TTP` correctly when all remaining `DCA` thresholds are loss-side only. Closure evidence: `history/plans/v1reopen-live-close-reopen-truth-closure-2026-04-29.md`.
- 2026-04-29: published `V1REOPEN-A` as a new narrow `LIVE` hardening packet after fresh real-account notes on `DOGEUSDT`. The repository had already closed the broad `V1TRUTH-A` wave, but this newly observed flow isolates a more specific regression class: `LIVE` manual close succeeds on the exchange, same-symbol reopen is adopted again, yet operator-visible `PnL%` becomes dramatically wrong and `TTP` behavior still looks contaminated. Current strongest hypothesis is stale lifecycle continuity across `close -> reopen` on the same symbol: reconciliation grace-window overlap or stale runtime protection state may let the old lifecycle row or its state bleed into the new one. Canonical packet: `history/plans/v1reopen-live-close-reopen-pnl-ttp-hardening-plan-2026-04-29.md`.
- 2026-04-29: published one practical final-mile unblock runbook for the remaining `V1EXCEL` external blockers. The repository still cannot clear those blockers autonomously without auth, but another operator or agent no longer needs to reconstruct the last-mile sequence from multiple docs: `history/plans/v1excel-final-unblock-runbook-2026-04-29.md` now freezes the exact order for manual matrix execution, stage/prod authenticated evidence refresh, RC rebuild, and the final `GO` decision gate.
- 2026-04-29: the first authenticated production operator pass for `V1EXCEL-03` is now recorded in `history/plans/v1excel-paper-operator-verification-2026-04-29.md`. Real Soar admin access became available during this session, which partially unblocked the manual matrix. Production `PAPER` same-side manual add on the active managed position behaved truthfully (`FILLED`, linked to the existing position, `openCount=1`, `openOrdersCount=0`, quantity increased correctly). The same pass exposed a new operator-visible drift: production `PAPER` manual close still returns `POSITION_CLOSE_PRICE_UNAVAILABLE` even when the runtime positions read path shows a valid `markPrice` for that open position. Remediation is now on `main`: the close command reuses both the approved `runtimeMarketDataFallback` seam and the same public exchange connector family already used by manual-order context, so command-side price resolution is no longer weaker by design than the operator-visible read path. Focused local validation is green, but fresh post-deploy production confirmation is still pending.
- 2026-04-29: reran the authenticated production `V1EXCEL-03` paper close path after deploy and confirmed that the previously failing `PAPER` manual-close drift is now resolved on the real protected API path. Closing the active managed position returned `200`, removed the row from `openItems`, preserved it in `historyItems` with `closeReason=MANUAL` and `closeInitiator=USER_APP`, and moved realized profit into runtime `freeCash`. This narrows the remaining manual-matrix gap away from `PAPER` close correctness and toward real-UI, `LIVE` exchange-authority, mixed-origin, and restart/recovery evidence.
- 2026-04-29: extended the same authenticated `V1EXCEL-03` production pass into the real dashboard UI. Browser automation against `https://soar.luckysparrow.ch/dashboard` proved that authenticated operator surfaces are aligned with the already confirmed `PAPER` API truth: switching the selected bot from `LIVE` to `PAPER` works, `Positions` shows no open positions after the close, wallet summary reflects `Delta from start 1.25% | 12.48 USDT` and `Portfolio 1,012.48 USDT`, and `History` shows the expected top row `Close / Manual / User in app` for `1000000MOGUSDT`. The remaining `V1EXCEL-03` gap is now narrower: browser-side trade-action clicks only if required, plus the still-missing `LIVE` exchange-authority, mixed-origin, and restart/recovery proofs.
- 2026-04-29: after pushing commit `4514894127ad07cbe95415043658e10b8c0cf75d` and letting production redeploy, fresh public prod smoke passed again on `https://api.soar.luckysparrow.ch` and `https://soar.luckysparrow.ch`. The blocker remained unchanged rather than mutating into a new prod regression: protected runtime freshness and rollback diagnostics are still auth-gated (`401`) without OPS/private-route credentials. Canonical post-deploy note: `history/plans/v1excel-prod-post-deploy-check-2026-04-29.md`.
- 2026-04-29: closed `V1EXCEL-08` as the canonical sync slice after the final confidence pass. Current repo truth is now frozen explicitly: the latest candidate remains `NO-GO` for an excellence-level real-money claim, not because of a newly confirmed implementation bug, but because the remaining completion contract is external-evidence only. `V1EXCEL-02` is green locally; `V1EXCEL-03..06` remain blocked by missing authenticated operator/exchange/OPS authority.
- 2026-04-29: closed `V1EXCEL-07` with a final `NO-GO` decision for candidate `51acd9c445227a3ca8cc8b781564d14b55fda43f`. Fresh local smoke is green, and public stage/prod smoke is green, but the repository's own rules still block a `GO` because the authenticated manual `PAPER/LIVE` matrix and protected stage/prod OPS evidence were not executed today. Canonical decision: `history/plans/v1excel-final-go-no-go-2026-04-29.md`.
- 2026-04-29: closed `V1EXCEL-02` by restoring a truthful local confidence path on this workstation. The local `P3009` blocker was not a new `V1` product bug but drifted Prisma migration history on a reused dev database; after non-destructive `migrate resolve` repair, `pnpm run test:go-live:smoke` passed end to end. Canonical closure: `history/plans/v1excel-local-confidence-path-closure-2026-04-29.md`.
- 2026-04-29: closed `V1EXCEL-01` by freezing the exact remaining post-`V1TRUTH` gap map against the repository's own completion and activation contracts. The canonical audit answer is now explicit: there is no open core implementation gap and no open architecture mismatch left for `V1`; what remains is confidence closure only. The missing categories are fresh manual verification of the newest `LIVE` candidate, honest local full-confidence reproducibility for the umbrella go-live path, fresh stage/prod activation evidence on the latest candidate, and one final operator-facing `GO / NO-GO` decision. Canonical audit: `history/audits/v1excel-gap-map-audit-2026-04-29.md`.
- 2026-04-29: published `V1EXCEL-A` as the next honest post-`V1TRUTH-A` packet. The repository no longer has an open architecture decision or a known code-level `LIVE` money-path drift in the canonical queue, but the project rules still require more than green tests before claiming a truly excellent `V1`: fresh manual verification, fresh stage/prod activation evidence, one honest local full-confidence path, and a final operator-facing `GO / NO-GO` decision on the current candidate. Canonical packet: `history/plans/v1excel-full-v1-excellence-and-confidence-plan-2026-04-29.md`.
- 2026-04-29: closed the full `V1TRUTH-A` wave. The final `LIVE exchange truth` hardening packet for `V1` is now complete across the four real-money drift classes behind the user's notes: dashboard futures manual-order leverage/margin parity, exchange-backed app-driven `LIVE` manual close, truthful pending external/manual exchange order versus open-position separation, and the final `DCA/TTP/TSL` nuance. The canonical protection rule is now explicit and shared across `BACKTEST`, `PAPER`, and `LIVE`: `SL` and `TSL` stay blocked while pending DCA remains financially possible, but `TTP` waits only for remaining profit-side DCA thresholds and may still close when all remaining DCA thresholds are loss-side only. Closure evidence: `history/plans/v1truth-live-exchange-truth-closure-2026-04-29.md`. Validation PASS: focused API closure pack (`99/99`), focused web closure pack (`15/15`), `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: started implementation of `V1TRUTH-A` with the highest-confidence user-reported drift first: dashboard manual-order futures sizing. The repository now treats `FUTURES` manual-order budget, slider max, budget-derived quantity, and submit-time affordability checks as leverage-aware required margin on the web side, matching the backend manual-order preview intent more closely while keeping `SPOT` semantics unchanged. Focused validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm --filter web run typecheck`.
- 2026-04-29: closed the next `V1TRUTH-A` API slice for app-driven `LIVE` manual close truth. The canonical runtime close path now keeps one approved exchange-backed authority: `executionOrchestrator` submits `LIVE` closes through the existing `openOrder -> exchangeAdapterBoundary -> live adapter` chain with explicit `reduceOnly` intent, live pretrade exposure guards no longer reject that reduce-only close case, and runtime session close no longer depends on an in-memory lifecycle price as hidden close authority. When runtime lifecycle price is temporarily unavailable in `LIVE`, the command degrades explicitly to persisted `entryPrice` as reference context while the actual exchange reduce-only market order remains the authority; `PAPER` continues to fail closed with `POSITION_CLOSE_PRICE_UNAVAILABLE` when no canonical close price exists. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: closed `V1TRUTH-05` by freezing the pending external order-versus-position baseline that motivated the user's live notes. The repository now has explicit e2e proof that one open `LIVE` position plus one pending external/manual exchange `DCA` order on the same symbol does not inflate the position in either runtime session positions or dashboard aggregate: `openCount` stays `1`, `openOrdersCount` stays `1`, the open position keeps its original quantity and entry notional, and the external order remains visible only in `openOrders` until exchange fill confirms it. This narrows the remaining user-visible drift under `V1TRUTH-06`: if inflation still appears in production, the bug is likely in a more specific reconcile/event/UI path than the canonical read-model baseline now proven green.
- 2026-04-29: closed `V1TRUTH-06` by fixing the strongest confirmed reconcile path that could still inflate operator-visible `LIVE` positions above the now-green pending-order baseline. `livePositionReconciliation` no longer creates a second imported `EXCHANGE_SYNC` open position when exchange snapshot truth arrives for a bot-owned `LIVE` position that already exists locally as an open `BOT`/`USER` managed row on the same canonical owner plus `symbol/side`. Instead, it reuses and upgrades the existing local row to exchange-confirmed truth, which keeps runtime positions and dashboard aggregate aligned to one open position identity while still showing pending exchange orders separately in `openOrders`. Validation PASS: focused `livePositionReconciliation.service.test.ts`, focused `orders-positions.e2e.test.ts`, focused manual-close/runtime/exchange packs, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: the user approved the staged post-analysis direction for the newly reported real-account drifts. The canonical plan is now: keep the approved singular bot architecture through one final `V1TRUTH-A` hardening wave, close truthful `LIVE` money-path behavior first (`manual order`, `manual close`, `order vs position truth`, final `DCA/TTP/TSL` semantics), and only after that stability is proven reopen architecture for multi-strategy-per-bot in the deferred `BOTMULTI-A` wave. Canonical packets: `history/plans/v1truth-live-exchange-truth-hardening-plan-2026-04-29.md` and `history/plans/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md`.
- 2026-04-29: published `V1TRUTH-A` as the next smallest architecture-aligned hardening wave after the fresh code-and-doc audit of the user's notes. The strongest remaining confirmed `LIVE` drifts are no longer broad exchange bring-up work but exact money-path truth gaps: leverage-aware futures manual-order sizing still lacks frontend/backend parity, app-driven manual close still depends too much on runtime-session context instead of one explicit exchange-backed authority, external/manual exchange pending orders still need one locked proof that they stay in `orders` until fill, and the exact final `DCA/TTP/TSL` rule still needs one explicit docs-plus-tests freeze.
- 2026-04-29: published `BOTMULTI-A` as a deferred post-`V1` roadmap only. It is intentionally not active while `V1TRUTH-A` is open. The deferred packet freezes prerequisites, architecture-first sequencing, and the expected execution outline for reintroducing `1 bot = 1 wallet + 1 symbol-group + N strategies` without mixing that architecture change into the final `LIVE` truth hardening wave.
- 2026-04-29: queued `V1MARK-A` as the next smallest `LIVE exchange` hardening wave after `V1COVER-A` closure. The strongest remaining confirmed money-path drift is now futures-specific lifecycle-price truth: runtime protection and position-lifetime automation already reuse one shared resolver seam, but that seam still resolves ticker `lastPrice` and recent candle close only because the Binance futures market-stream boundary does not ingest mark price yet. The next slice is intentionally narrow and architecture-aligned: extend the approved futures stream boundary to carry mark price, make the shared lifecycle-price resolver prefer it for `LIVE FUTURES`, keep explicit fallback for degraded and spot paths, and prove the behavior with focused stream/runtime regressions.
- 2026-04-29: closed `V1MARK-01` as the architecture-freeze slice of the new futures price-truth wave. `docs/architecture/reference/live-futures-lifecycle-price-contract.md` now freezes one canonical hierarchy for `LIVE FUTURES` runtime protection and lifetime automation: prefer stream `markPrice`, then ticker `lastPrice`, then latest positive recent candle close. `06_execution-lifecycle.md` and `reference/execution-lifecycle-parity-contract.md` now point to the same rule so runtime callers do not fork their own futures price authority.
- 2026-04-29: closed the full `V1MARK-A` wave. The approved Binance futures market-stream boundary now subscribes to and normalizes `markPriceUpdate` events, runtime ticker storage preserves futures `markPrice` alongside `lastPrice`, and the shared lifecycle-price resolver now prefers mark price for `LIVE FUTURES` while keeping explicit fallback to last price and recent candle close. Focused stream/runtime validations are green and closure evidence is published in `history/audits/v1mark-live-futures-mark-price-parity-closure-2026-04-29.md`.
- 2026-04-29: closed `V1COVER-01` as the first runtime-coverage hardening slice after `V1GUARD-A`. The repository still uses module-global runtime candle/ticker stores in the engine path, so broad regression proof can drift if files emit runtime events directly and do not clear those stores between tests. `runtime-flow.e2e.test.ts` and `runtimeSignalLoop.service.test.ts` now reset that shared state explicitly in `beforeEach`, and the focused combined pack for those files passes again when run together instead of inheriting stale series from a previous runtime test.
- 2026-04-29: closed `V1COVER-02` as the shared-helper and stale-proof cleanup slice of the new `LIVE` coverage wave. `bots.e2e.shared.ts` now deletes wallet-linked topology during shared runtime takeover cleanup, removing one deterministic FK-noise source from broad suite runs. The first takeover visibility regression was also realigned to the current architecture: overlapping active `LIVE` bots on the same symbol are intentionally blocked by the newer guard, so the valid remaining proof is now `LIVE` ownership visibility versus a same-symbol `PAPER` bot rather than a stale two-`LIVE` overlap scenario.
- 2026-04-29: closed the full `V1COVER-A` runtime-regression coverage wave. After removing shared runtime market-data leakage, restoring wallet cleanup in shared takeover helpers, and hardening the remaining `orders.service` LIVE fixture setup, the sequential broad runtime/order proof is green again under the current architecture. The remaining false-reds observed during the middle of the wave were classified as invalid parallel DB-backed evidence when separate Vitest processes hit the same local Postgres concurrently; no new runtime product drift survived once the harness was stabilized. Closure evidence: `history/plans/v1cover-live-runtime-regression-coverage-closure-2026-04-29.md`.
- 2026-04-29: published `V1COVER-A` as the next post-`V1GUARD` hardening wave. The focused `LIVE` protection fixes are now green, but broader runtime/order proof is still weakened by mixed regression noise: module-global runtime candle/ticker state is not reset consistently across runtime tests, shared e2e helpers still carry singular-bot cleanup drift around wallet-linked topology, and at least one broad `orders.service` proof still fails under Vitest even when the equivalent service path can succeed directly. The next execution wave therefore starts with regression-proof hardening first: remove shared-state leaks, repair helper cleanup truth, rerun the broad pack, and only then treat any surviving failures as real product drift for the `LIVE exchange` path.
- 2026-04-29: closed `GOLIVE-2026-04-29-A` as a tooling-only hardening slice after confirming the app-level go-live packs were already green. `scripts/goLiveSmoke.mjs` now reuses already-running reachable local Postgres/Redis when Compose cannot bind `5432/6379`, avoids tearing down infra it did not start, and reports local Prisma failed-migration state (`P3009`, currently `20260424094500_add_single_context_bot_refs`) explicitly enough that the next operator action is obvious. Validation PASS: `pnpm run test:go-live:api`, `pnpm run test:go-live:web`, `pnpm run quality:guardrails`; umbrella `pnpm run test:go-live:smoke` now reaches the real local migration blocker instead of failing earlier on port-collision noise.
- 2026-04-29: queued `GOLIVE-2026-04-29-A` as the next smallest quality slice after the final `LIVE` protection hardening wave. Canonical go-live API/web packs are green, but the umbrella wrapper `pnpm run test:go-live:smoke` still fails too early in the common local environment because it cannot reuse already-running Postgres/Redis and it surfaces local Prisma failed-migration state too opaquely. The next slice is tooling-only: harden the smoke wrapper and local-development guidance without weakening the migration or smoke contract.
- 2026-04-29: closed the full `V1GUARD-A` wave. The last confirmed repository-level `LIVE` protection drifts after `V1SAFE-A` are now closed without expanding the architecture surface: shared lifecycle logic now keeps `TTP` behind the canonical `DCA-first` guard, exchange-confirmed `LIVE DCA` fills now converge both runtime execution dedupe and persisted runtime position-state truth instead of leaving `currentAdds` stale after a submitted market add, and runtime protection evaluation now consumes one explicit lifecycle-price seam instead of hardcoding ticker `lastPrice` in the automation path. Closure evidence: `history/plans/v1guard-live-protection-final-closure-2026-04-29.md`. Validation PASS: focused `positionManagement`, focused `runtimePositionAutomation`, focused `orders.exchangeEvents`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: queued `V1GUARD-A` as the next narrow hardening wave after a fresh audit of the remaining money-impacting `LIVE` protection behavior. The strongest confirmed gaps are now three concrete drifts rather than a broad architecture rewrite: shared lifecycle logic still lets `TTP` bypass the mandatory `DCA-first` guard, async `LIVE DCA` fills can update canonical position truth without converging runtime management state in the same lifecycle, and runtime protection evaluation still consumes ticker `lastPrice` directly instead of one explicit lifecycle-price seam. Canonical packet: `history/plans/v1guard-live-protection-final-hardening-plan-2026-04-29.md`.
- 2026-04-28: closed `DOCSYNC-2026-04-28-E` as the final historical-status normalization slice. The remaining ambiguous planning headers using `PLANNED`, `planned`, or `Published` for already closed work were normalized, and `planning-catalog-index-2026-04-19.md` now records those source artifacts truthfully as historical implemented or superseded references. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-28: closed `DOCSYNC-2026-04-28-D` as the follow-up planning-catalog parity slice. `planning-catalog-index-2026-04-19.md` now reflects the post-2026-04-20 wave history, including newer `implemented` and `superseded` plan artifacts, and the stale `Status: queued` header in the already closed `UOLF` plan was corrected to match canonical closure truth. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-28: closed `DOCSYNC-2026-04-28-C` as a docs-only planning-parity slice. Several historical plan packets still advertised `Status: Active` even though canonical closure had already been recorded elsewhere. The sync corrected stale headers for `SCALE-A`, `V1FACT-A`, `V1TAKE-01`, `XADAPT-02`, and `XADAPT-06`, restoring trigger-intent trust without changing runtime or feature behavior. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-28: closed `QH-E2E-2026-04-28-A` as a pure quality/harness stabilization slice for the legacy `markets` and `wallets` CRUD e2e suites. The approved domain behavior from `UXSAFE-2026-04-28-A` remains unchanged; the fix was to remove local suite instability instead of weakening protections. `markets.e2e.test.ts` now runs deterministically with one-time cleanup plus unique per-test user identities, while `wallets.crud.e2e.test.ts` now uses unique per-test identities and a narrow shared bearer helper only for explicit multi-user ownership/list isolation scenarios. Validation PASS: full `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts`, full `pnpm --filter api exec vitest run src/modules/wallets/wallets.crud.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-28: refreshed the active queue after closing the production smoke/release work. No unresolved architecture decisions remain, and the next smallest V1-quality slice is now `QH-E2E-2026-04-28-A`: recover deterministic full green execution for the legacy `markets` and `wallets` CRUD e2e suites. This is explicitly a test/harness quality task, not a runtime-behavior relaxation, because the focused regressions added in `UXSAFE-2026-04-28-A` already proved the shipped domain fixes while the broader full-file suites still contain older local noise.
- 2026-04-28: closed `UXSAFE-2026-04-28-A` as a focused dashboard-management safety slice for `markets` and `wallets`. `MarketUniverse` edit/delete now follows the approved active-usage rule: linked inactive bots no longer block save, but active bot ownership still fails closed across direct primary bot context, canonical market-group links, and legacy bot-strategy scope. The same slice also hardens wallet deletion by detaching nullable historical `walletId` references from `Position`, `Order`, and `Trade` before deleting the wallet, preserving operator history and removing the raw internal-error path previously seen from wallet list delete. Validation PASS: focused `markets.e2e` active/inactive regressions, focused `wallets.crud.e2e` history-detach regression, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-28: closed the remaining operational step of `V1FIX-2026-04-26-B` by pushing `25276b475937d9dcf4af6337abf10185ec7dcd0c` to production and running an authenticated affected-account smoke on the live dashboard. Public prod baseline passed (`/health`, `/ready`, root, protected-route redirect, protected metrics denial), `GET /api/build-info` confirmed the exact deployed SHA, and the affected account now loads `/dashboard` with live runtime truth visible for the selected live bot, including the managed `DOGEUSDT SHORT` position and authenticated exchange-balance wallet context. Evidence: `history/evidence/v1fix-2026-04-26-b-prod-smoke-2026-04-28.md`.
- 2026-04-28: closed `BOTLIVE-2026-04-28-A` as a focused runtime-scope safety guard for the singular bot contract. Bot create/update now fails closed if a bot would become `LIVE + isActive + liveOptIn` while its selected market-group symbols overlap any symbol already covered by another active opted-in LIVE bot for the same user. The rule intentionally does not block `PAPER` versus `LIVE` overlap, and inactive/non-opted-in LIVE drafts remain allowed until they would become real active LIVE runtime scope. Conflict responses now persist exact blocking symbol and bot-name details so operators can remove the offending symbol from the market group instead of guessing why activation was denied. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-28: closed `V1RESTART-01` as the first implementation step of the new restart-continuity wave. Architecture now explicitly freezes one canonical `LIVE` restart and downtime continuity model: restart is not lifecycle close authority, one missing post-restart snapshot is not sufficient to close a previously open exchange position, supported exchange events outrank one weak startup snapshot, and recovered `LIVE` positions may become visible before they become actionable again. Canonical recovery requires deterministic restoration or preservation of `botId + walletId + strategyId`; visibility alone is no longer allowed to imply safe resumed DCA/TSL automation. Canonical artifacts: `docs/architecture/reference/live-position-restart-continuity-contract.md`, `docs/architecture/06_execution-lifecycle.md`, `docs/architecture/04_runtime-contexts.md`, and `docs/architecture/reference/position-lifecycle-parity-matrix.md`.
- 2026-04-28: closed the full `V1RESTART-A` implementation wave for restart-safe LIVE position continuity. `Position` persistence now carries explicit continuity truth (`continuityState`, `lastExchangeSeenAt`, `lastExchangeSyncAt`, `missingSince`, `missingSyncCount`) via migration `20260428113000_add_position_restart_continuity_state`; exchange-confirmed close paths mark `EXTERNAL_CLOSE_CONFIRMED`; `livePositionReconciliation.service.ts` now stages missing imported rows through `RECOVERING` before any external-close classification instead of closing after one weak pass; deterministically owned recovered imported rows now restore or preserve canonical `botId + walletId + strategyId` by reusing `bot.strategyId`; runtime automation and manual runtime close both stay fail-closed until continuity returns to `CONFIRMED`; runtime/read models now surface `continuityState` plus `actionable`; and dashboard runtime typing plus open-position presentation now show degraded recovered rows explicitly while disabling row actions until continuity is restored. Validation PASS: focused restart reconciliation tests, focused runtime automation tests, focused recovered-visibility e2e, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, and `pnpm run quality:guardrails`. Local schema validation note: Prisma `migrate deploy` remained blocked by the pre-existing failed local migration `20260424094500_add_single_context_bot_refs`, so this wave validated the new schema locally with `pnpm --filter api exec prisma db push` after generating the client.
- 2026-04-28: approved the highest-quality target direction for the newly reported LIVE restart-position continuity gap. The repository must not treat bot or worker restart as authority to close or de-own open exchange positions after one weak recovery pass. The next wave `V1RESTART-A` is now queued as a canonical continuity hardening packet: supported exchange events are the strongest restart-recovery evidence, REST reconciliation is recovery/confirmation rather than one-pass destructive authority, previously open LIVE positions must survive restart uncertainty through explicit continuity states, and recovered owned positions must restore canonical `botId + walletId + strategyId` context before DCA/TSL automation is considered safely resumed. Canonical artifact: `history/plans/v1restart-live-position-continuity-hardening-plan-2026-04-28.md`.
- 2026-04-29: published `V1PARITY-A` as the next canonical post-V1 hardening wave after a focused repository review of remaining implementation drift. The strongest confirmed issue behind the reported `PAPER DCA works / LIVE DCA does not` symptom is lifecycle parity, not one isolated UI defect: exchange-confirmed fills on existing LIVE positions do not fully reuse canonical add-update lifecycle authority, add-leg fills are still persisted as generic `OPEN` instead of explicit `DCA`, account-update reconciliation still scopes too broadly by `userId + symbol + side`, runtime read models can visually mask missing canonical `strategyId` through symbol-level fallback, and fail-closed runtime automation skips are still under-exposed to operator telemetry. Canonical packet: `history/audits/v1parity-live-runtime-lifecycle-parity-hardening-plan-2026-04-29.md`.
- 2026-04-29: closed `V1PARITY-01` as the contract-freeze slice for the new parity wave. Architecture now explicitly requires that confirmed LIVE add-fills on an existing `positionId` update canonical quantity and entry from fill truth instead of waiting for later account snapshots, that add-leg persistence preserves explicit `DCA` semantics, that `ACCOUNT_UPDATE` is confirmation/repair rather than broad rewrite authority across all `userId + symbol + side` rows, and that operator read models must not present symbol-level fallback as if missing canonical `position.strategyId` were still actionable runtime truth. Canonical artifact: `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`.
- 2026-04-29: closed the full `V1PARITY-A` wave. Existing-position LIVE fills now reuse canonical add-update lifecycle authority directly inside `orders.exchangeEvents.service.ts`, add-leg fills persist explicit `DCA` semantics, and `ACCOUNT_UPDATE` reconciliation is constrained to canonical owned LIVE candidates instead of global `userId + symbol + side` scope. Runtime session read models no longer surface DCA/TSL strategy plans through symbol fallback when canonical `position.strategyId` is unresolved, which keeps operator truth aligned with the fail-closed runtime engine. The same wave also adds operator-visible `PRETRADE_BLOCKED` telemetry for covered LIVE automation skip classes (`continuity_state_unconfirmed`, `canonical_execution_context_unresolved`, `live_opt_in_disabled`) instead of leaving those paths as console-only diagnostics. Closure evidence: `history/audits/v1parity-live-runtime-lifecycle-parity-closure-2026-04-29.md`. Validation PASS: focused `orders.exchangeEvents`, `runtimePositionAutomation`, `bots.runtime-strategy-context`, focused DCA ladder e2e, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: published `V1SAFE-A` as the next canonical hardening wave after fresh real-account reports around `LIVE` protection drift. The strongest confirmed repository gap is now narrower than the first `V1SAFE` draft implied: Soar still lacks one canonical `DCA/TTP/TSL` parity model for imported and recovered `LIVE` positions. Runtime trailing execution still depends on persisted management state, runtime read-models can still imply dynamic protection through fallback logic the engine cannot execute, and `DCA-first` close gating still lacks focused parity proof across `backtest`, `paper`, and `live` for the reported symptom class. The wave is therefore narrowed away from a broad exchange-native redesign and toward imported/recovered trailing-state hydration, operator/runtime protection-state honesty, and end-to-end `DCA/TTP/TSL` parity. Canonical packet: `history/plans/v1safe-live-protection-and-liquidation-safety-plan-2026-04-29.md`.
- 2026-04-29: closed the full `V1SAFE-A` wave. Architecture now explicitly freezes one canonical `LIVE` protection-state parity contract for imported and recovered positions: runtime protection state is the only execution truth for dynamic `TTP` / `TSL`, the repository must not retroactively invent unseen trailing history from one exchange snapshot, and prospective protection from the adoption point onward is allowed when owner, strategy, and execution context are canonical. Focused runtime coverage now proves imported `LIVE` positions can arm `TTP` prospectively and close on later retrace, API runtime-position serialization now derives `TTP` only from canonical trailing runtime state and `TSL` from canonical trailing-anchor truth, and dashboard-home plus bot-monitoring surfaces no longer overlay sticky display fallback that could imply stronger protection than the runtime engine can really execute. Closure evidence: `history/audits/v1safe-live-dca-ttp-tsl-parity-closure-2026-04-29.md`. Validation PASS: focused `runtimePositionAutomation`, focused `runtimePositionSerialization`, API/web typechecks, focused `HomeLiveWidgets`, focused `BotsManagement`, and repository guardrails.
- 2026-04-27: approved and normalized the canonical close-attribution model after a fresh audit of runtime close, exchange-event close, reconciliation disappearance, and repair-only cleanup semantics. The repository architecture now explicitly separates `closeReason` from `closeInitiator`; canonical V1 initiator scope is `BOT_APP`, `USER_APP`, `USER_EXCHANGE`, `EXCHANGE`, and `SYSTEM_REPAIR`. Reconcile-driven exchange disappearance without stronger exchange event proof is now planned to persist as `closeInitiator=USER_EXCHANGE` with `closeReason=EXTERNAL_SYNC_MISSING`, while repair-only orphan cleanup remains a distinct `SYSTEM_REPAIR` path. Canonical artifacts: `docs/architecture/reference/position-close-attribution-contract.md` and `history/plans/v1close-position-close-attribution-hardening-plan-2026-04-27.md`.
- 2026-04-27: closed `V1CLOSE-A` end to end. Prisma persistence now carries nullable `closeReason` and `closeInitiator` on `Position`, `Order`, and `Trade`; shared mapping lives in `apps/api/src/modules/positions/positionCloseAttribution.ts`; app-driven manual close persists `MANUAL + USER_APP`, bot lifecycle close persists canonical `BOT_APP` attribution, exchange confirmation preserves stronger existing attribution while still allowing liquidation refinement, reconcile disappearance persists `EXTERNAL_SYNC_MISSING + USER_EXCHANGE`, and orphan repair persists `SYSTEM_REPAIR + SYSTEM_REPAIR`. Runtime read models and dashboard aggregate history now expose close-attribution truth directly to operators. Validation PASS: focused API close-attribution pack, focused dashboard aggregate-history pack, repository typechecks, repository guardrails, and full workspace build.
- 2026-04-26: refined `V1LIVE-A` so it matches the approved exact exchange-context architecture. The frozen repository truth is now explicit: `PAPER` must remain exchange-free, `LIVE` must stay inside the approved exchange boundary, adapter selection must follow the exact user/bot `exchange + marketType` settings, unsupported exchange paths must fail closed instead of falling back to Binance, imported-position ownership must be decided by one canonical classifier reused across reconciliation/runtime/takeover flows, and imported live entry truth must not fall back to `markPrice`. The first adapter family to be completed in this wave is `BINANCE + SPOT` plus `BINANCE + FUTURES`, which serves as the template for future exchange adapters. Canonical artifacts: `history/plans/v1live-binance-execution-and-takeover-hardening-plan-2026-04-26.md` and `history/tasks/v1live-00-planning-task-2026-04-26.md`.
- 2026-04-26: closed `V1FIX-2026-04-26-A` after reproducing the production manual-order `500` directly in `soar-api`. The root cause was a real lifecycle gap, not a web issue: `applyOrderFillLifecycle()` still tried to create a second `OPEN` position for the same user and symbol even though the canonical lifecycle contract and production DB index still enforce one open position per symbol. Same-direction manual fills now reuse/update the existing position with weighted entry repricing, and reverse-direction opens fail closed with explicit `OPEN_POSITION_SIDE_CONFLICT` API semantics. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: queued and implemented the first closure slice of `V1FIX-2026-04-26-B` after browser-level production repro on the real user account exposed a deeper source of truth problem: authenticated Binance Futures snapshot still returns the real external position, but legacy local `OPEN` rows with `botId=null` were surviving from older topology waves and silently blocking both manual-order reuse and exchange takeover/runtime projection. The repository now has an explicit authenticated repair endpoint `POST /dashboard/positions/orphan-repair` that rebinds local open rows only when canonical bot proof exists, closes only fully detached local open orphans, then forces exchange reconciliation + takeover rebind so current exchange truth can re-enter the canonical runtime path. Validation PASS: `pnpm --filter api test -- --run src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`. Remaining work is operational: deploy to prod, run repair on the affected account, and re-check dashboard/manual-order/takeover behavior live.
- 2026-04-26: queued and implemented `V1FIX-2026-04-26-C` after post-repair real-account browser verification on prod exposed one more canonical-scope drift: manual open-order conflict detection and fill reuse still searched `OPEN` positions globally by `userId + symbol`, so a `LIVE` DOGE position on one wallet falsely blocked a `PAPER` DOGE manual order on another wallet. The repository now centralizes open-position scope resolution under wallet-first/bot-fallback semantics in `orders.positionScope.ts`, both manual pre-submit conflict checks and fill-lifecycle adoption reuse that same scope, and a new migration replaces the old global partial unique index with wallet-/bot-/unowned-scoped partial unique indexes. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`. Remaining work is operational: deploy to prod, rerun the dashboard manual-order flow on the affected account, and confirm the new wallet-scoped behavior live.
- 2026-04-26: the repository is now locally deploy-ready for the remaining `V1FIX-2026-04-26-B` production closure. The final backtests/release-readiness pass aligned wallet-first takeover fixtures with the live ownership contract, hardened slow 3-symbol parity report polling so the canonical diagnostics contract is awaited honestly in the go-live pack, and made backtest delete resilient to async worker/report races. Validation PASS: `pnpm --filter api exec vitest run src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtests.e2e.test.ts`, `pnpm run test:go-live:api`, `pnpm run typecheck`, `pnpm run quality:guardrails`, `pnpm run build`. The remaining work is now operational only: deploy the latest repository state plus the open scoped-uniqueness migration to production and rerun the affected real-account dashboard/takeover smoke.
- 2026-04-26: closed `V1LIVE-PROD-2026-04-26-A` after real-account production browser verification proved the last manual-order blocker on the dashboard was web-only stale symbol-context drift. `useManualOrderController.ts` now accepts manual-order context price only when it matches the current `selected.bot.id + manualOrderSymbol`, so the deployed dashboard no longer submits a current symbol with a previous-symbol price frozen from stale context.
- 2026-04-26: closed `V1LIVE-PROD-2026-04-26-B` after three real-account production verification loops on the affected live bot. The production API now normalizes/imports Binance Futures leverage truth from nested raw payload fields and derives it from notional-versus-margin when the explicit leverage field is absent, then rounds imported leverage before persistence so floating-point precision cannot degrade `15x` to `14x`. `livePositionReconciliation` also now treats open-orders snapshot failure as fail-soft for stale local managed LIVE cleanup, which allowed the historical phantom `BNBUSDT` row to be closed as `ORPHAN_LOCAL` on the real account while the active imported `DOGEUSDT` position persisted with truthful `leverage=15`. Post-deploy production evidence after authenticated repair: exchange snapshot returns `DOGEUSDT` with `leverage≈15`, runtime `openItems` contains only the real `DOGEUSDT` position at `15x`, and stale `BNBUSDT` moved to runtime history instead of remaining actionable.
- 2026-04-26: published `history/audits/v1live-post-fix-quality-audit-and-plan-2026-04-26.md` as the next post-hotfix audit baseline. The audit confirms the product is materially healthier on the verified production account, but the highest-value remaining quality work is still architectural rather than cosmetic: exact exchange-context truth, fail-closed imported entry truth, one ownership classifier across live-position surfaces, event-driven Binance lifecycle truth, and removal of legacy/fallback operator-surface seams after those contracts are proven.
- 2026-04-26: closed the first two execution packets inside `V1LIVE-A`. Exact exchange-context truth is now enforced in runtime watchdog and runtime position automation without hidden env-driven `BINANCE/FUTURES` defaults, live-order boundary submit now fails closed if the resolved API-key exchange drifts from the selected bot exchange, and imported LIVE reconciliation no longer falls back from missing `entryPrice` to `markPrice`. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed the imported-ownership/runtime parity packet inside `V1LIVE-A` (`V1LIVE-04/05/08/09`). The repository now has one canonical imported LIVE ownership classifier keyed by exact `apiKeyId + symbol` with explicit `OWNED | AMBIGUOUS | MANUAL_ONLY | UNOWNED` semantics, and that truth is reused by exchange reconciliation, takeover-status/rebind, runtime imported-position visibility, and runtime close authority. Focused regressions now prove shared-API-key symbol isolation, wallet-managed versus manual-only takeover truth, and exact runtime visibility/close claiming for imported `EXCHANGE_SYNC` rows. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed `V1LIVE-10` as the signal-driven `LIVE` regression lock before adapter-family completion. The repository now has focused coverage proving a runtime signal for a `LIVE` bot may remain explicitly `submitted` without fabricating `POSITION_OPENED` or degrading into `PRETRADE_BLOCKED`, while still forwarding exact canonical runtime context (`walletId`, `strategyId`, `strategyLeverage`, candle window, `mode`, and current mark price) into the orchestration boundary. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed `V1LIVE-11` as the first explicit Binance adapter-family completion slice. The repository no longer treats the first live adapter family as a generic futures-only path under exact-context APIs: `BINANCE + SPOT` now resolves through an explicit spot connector path, `BINANCE + FUTURES` through the futures path, and focused boundary tests now lock SPOT live submit separately from futures submit. The exchange module also now contains a boundary-ready `binanceUserDataStream.service.ts` plus normalized event types for exact listenKey lifecycle and supported Binance account/order websocket events across both SPOT and FUTURES, which sets up `V1LIVE-12` to wire event truth into canonical order/position lifecycle without creating a parallel execution system. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed `V1LIVE-12` as the first event-driven lifecycle slice for the supported Binance family. The repository now has one canonical apply seam for normalized Binance stream events: confirmed `ORDER_TRADE_UPDATE`/`executionReport` fills can update orders, create idempotent `orderFill` rows, materialize open positions through `applyOrderFillLifecycle()`, and close linked LIVE positions with realized-PnL/trade persistence on confirmed exit fills, while supported `ACCOUNT_UPDATE` payloads can refresh canonical open-position quantity, entry, and unrealized-PnL truth. This keeps the exchange event path inside the existing order/position lifecycle instead of spawning a sidecar execution system. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed `V1LIVE-13` by removing the last residual compatibility debt inside the wave instead of shipping around it. `RuntimeSidebarSection.tsx` no longer reads the legacy strategy fallback for canonical manual-order sidebar context, and the stale `orders-positions.e2e` LIVE imported-position fixtures now encode the exact ownership contract required by the current runtime classifier: `bot.apiKeyId + wallet.apiKeyId + externalId(apiKeyId:symbol:side)`. Focused validation PASS: `pnpm --filter api test -- --run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps EXCHANGE_SYNC BOT_MANAGED runtime positions visible for LIVE bot even when PAPER bot shares symbol|closes EXCHANGE_SYNC BOT_MANAGED runtime position selected from LIVE dashboard flow"`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`.
- 2026-04-26: closed `V1LIVE-14` and with it the full `V1LIVE-A` wave. Final focused closure evidence is green across exact exchange-context selection, imported-position ownership/runtime parity, signal-driven LIVE submit truth, Binance Spot/Futures adapter-family parity, normalized Binance event lifecycle application, manual LIVE runtime visibility, imported-position close authority, web runtime-sidebar cleanup, repository typecheck, and repository guardrails. The remaining open repository work is no longer inside `V1LIVE-A`; it has moved back to other operational or post-V1 hardening tracks.
- 2026-04-25: closed `V1COH-07` as the final manual-LIVE action-state semantics cleanup on dashboard-home. The runtime sidebar no longer mislabels a valid pre-submit manual `LIVE` context as `blocked`; it now exposes one explicit `ready` state, while `blocked` remains reserved for missing selected bot, unavailable exchange capability, unresolved symbol, or empty symbol scope. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`.
- 2026-04-25: closed `V1UX-01`, `V1UX-02`, and `V1UX-03` together as the selected-bot manual-order UX polish slice after fresh production feedback. The dashboard sidebar now auto-fills `Price` from the canonical market reference on first symbol hydrate, re-applies that reference when symbol context changes, adds a quote-budget input under the qty slider with wallet free-funds fail-closed behavior, and removes the summary/lifecycle/action-state helper noise so only `order type`, `margin mode`, and `leverage` remain in the static context block. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm --filter web run build`.
- 2026-04-25: closed `V1DEPLOY-2026-04-25-B` as the final deployed-commit proof hardening slice for `soar-web`. `GET /api/build-info` now falls back to runtime env commit/branch hints when file metadata is absent, `scripts/writeWebBuildMetadata.mjs` still prefers `SOURCE_COMMIT` / `SOURCE_BRANCH` during build, and the Coolify web-service runbook now freezes the required production wiring: declare `SOURCE_COMMIT=$SOURCE_COMMIT`, declare `SOURCE_BRANCH=$COOLIFY_BRANCH`, and enable `Include Source Commit in Build` for the web app. Validation PASS: `pnpm --filter web run build`, `docker build -f apps/web/Dockerfile -t soar-web-gitsha-fix .`.
- 2026-04-25: closed `V1DEPLOY-2026-04-25-A` as the production web-image parity fix after the deploy-truth hardening slice. The production `apps/web/Dockerfile` now copies the repository `scripts/` directory into the build stage, preserving the approved web build contract `node ../../scripts/writeWebBuildMetadata.mjs && next build` inside Coolify. Validation PASS: `pnpm --filter web run build`, `docker build -f apps/web/Dockerfile -t soar-web-localfix .`.
- 2026-04-25: closed `V1TAKE-09` as the wallet-single-switch UI cleanup
  slice. The web UI now exposes exactly one editable takeover-management
  switch on the wallet form, while the API key form no longer renders the
  legacy import/manage toggles or the derived bot-takeover helper list. To
  keep backend compatibility stable, API-key form submit remains explicit
  about `syncExternalPositions=true` and
  `manageExternalPositions=false`, but takeover-management editing is now
  wallet-only in the operator UI. Validation PASS:
  `pnpm --filter web exec vitest run src/features/profile/components/ApiKeyForm.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletsListTable.test.tsx`,
  `pnpm --filter web run typecheck`,
  `pnpm run quality:guardrails`.
- 2026-04-25: closed `V1READY-2026-04-25-C` as the residual deploy-truth and artifact-sync slice after final V1 approval. The web build now writes deploy-verifiable git metadata into `.next/BUILD_META.json`, `GET /api/build-info` can expose `gitSha`/`gitRef` for the deployed web target, `ops:rc:gates:summary` now makes stale evidence timing explicit instead of silently presenting old evidence as current, and the reusable architecture-V1 checklist no longer labels already-closed `V1COH-A`, `XADAPT-A`, or `V1READY-2026-04-25-A` work as active `PARTIAL` closures. Validation PASS: `pnpm run quality:guardrails`, `pnpm run typecheck`, `pnpm run build`, `pnpm run ops:rc:gates:summary`.
- 2026-04-25: closed `V1TAKE-08` and with it the full `V1TAKE-A` wave. Final
  closure evidence is green across takeover-status, reconciliation, runtime
  ownership/visibility, and manual-order API + dashboard truth. One local
  execution guardrail was confirmed during closure: DB-backed Vitest packs
  must run sequentially against the shared local Postgres instance to avoid
  cross-test interference. Validation PASS: the focused `V1TAKE-A` closure
  pack plus `api/web` typechecks and repository guardrails.
- 2026-04-25: closed `V1TAKE-06` and `V1TAKE-07` by hardening manual-order
  fill truth across both API and dashboard UI. `PAPER MARKET` opens now fail
  closed when canonical fill price cannot be proven, the API surfaces an
  explicit `PAPER_MARKET_PRICE_UNAVAILABLE` error, and the dashboard manual
  order controller blocks the same degraded submit path before calling the
  shared order endpoint. Validation PASS: `orders.service.test.ts`,
  `orders.manual-paper-market.e2e.test.ts`,
  `HomeLiveWidgets.manual-order.test.tsx`,
  `pnpm --filter api run typecheck`,
  `pnpm --filter web run typecheck`,
  `pnpm run quality:guardrails`.
- 2026-04-25: closed `V1TAKE-04` and `V1TAKE-05` by carrying the user-approved
  wallet-first takeover contract into runtime ownership resolution. Canonical
  bot runtime visibility for imported LIVE positions now excludes competing
  bots whose linked wallets disable external-position management, which
  prevents false ambiguity when symbol scope overlaps. Validation PASS:
  `runtimeExternalPositionOwner.service.test.ts`,
  `bots.runtime-takeover.e2e.test.ts`,
  `pnpm --filter api run typecheck`,
  `pnpm run quality:guardrails`.
- 2026-04-25: closed `V1TAKE-02` and `V1TAKE-03` under one user-approved
  wallet-first ownership decision for exchange takeover. Canonical management
  truth is now explicit: `wallet.manageExternalPositions` is the only
  management source of truth for takeover-related API behavior, while
  `apiKey.syncExternalPositions` remains the import toggle and API-key-level
  `manageExternalPositions` is compatibility-only metadata. The backend now
  ignores API-key management during reconciliation and fails closed in
  takeover-status reads when a stale `BOT_MANAGED` row is linked to a wallet
  that no longer allows external-position management. Validation PASS:
  `positions.takeover-status.e2e.test.ts`,
  `livePositionReconciliation.service.test.ts`,
  `pnpm --filter api run typecheck`,
  `pnpm run quality:guardrails`.
- 2026-04-25: closed `V1TAKE-01` by publishing the concrete investigation
  packet `history/audits/v1take-01-investigation-audit-2026-04-25.md` plus the
  task packet `history/audits/v1take-01-investigation-audit-task-2026-04-25.md`.
  The repository now has one explicit handoff for the next red-test slice:
  takeover authority is confirmed to drift between API-key and wallet flags,
  the supported import boundary remains intentionally `BINANCE + FUTURES`,
  imported position visibility still depends on deterministic `BOT_MANAGED`
  ownership proof, and the remaining manual-order issue is now narrowed to a
  watch item around UI estimation versus backend lifecycle truth. Focused
  takeover/manual-order DB-backed verification is green in the current local
  workspace.
- 2026-04-25: queued `V1TAKE-A` as the next post-V1 hardening wave after a
  fresh live-position/manual-order investigation driven by user-reported
  runtime symptoms. The confirmed findings are now explicit: takeover
  authority still drifts between API-key and wallet flags, supported import
  scope remains intentionally narrow (`BINANCE + FUTURES`), bot runtime
  visibility still depends on deterministic `BOT_MANAGED` ownership proof, and
  manual `PAPER/LIVE` open truth still needs one tighter API + web closure
  pack. Canonical artifacts:
  `history/plans/v1take-exchange-takeover-manual-order-closure-plan-2026-04-25.md`
  and `history/tasks/v1take-00-planning-task-2026-04-25.md`.
- 2026-04-25: local Docker validation for DB-backed API work is no longer
  engine-blocked in the current workspace. `docker info` now reports a healthy
  Docker Desktop server, compose start failed only because `localhost:5432`
  was already allocated by an existing local Postgres container, and focused
  DB-backed verification now passes again for
  `src/modules/positions/positions.takeover-status.e2e.test.ts`. The Docker
  recovery guardrail and port-collision handling were synced into
  `.codex/context/LEARNING_JOURNAL.md` and
  `docs/engineering/local-development.md`.
- 2026-04-25: published a reusable V1 architecture functionality checklist and
  verification loop. Canonical artifact:
  `history/plans/v1-architecture-functionality-regression-checklist-2026-04-25.md`.
  It maps architecture-defined V1 functions to current implementation status,
  automated test files, manual browser flows, and follow-up task families, so
  future weekly or post-deploy regression work can execute function-by-function
  without re-auditing the architecture set from scratch.
- 2026-04-25: queued `XADAPT-A` as the next post-`V1COH-A` engineering wave for exchange-boundary hardening. The approved direction is not to add a second exchange immediately, but to first freeze one truthful capability matrix for authenticated reads and write-side execution, classify residual Binance-specific assumptions behind generic-looking APIs, lock Binance against a focused adapter contract pack, and only then publish a staged next-exchange rollout packet.
- 2026-04-25: queued `V1COH-A` after a fresh residual execution audit driven by
  reported doubt around manual `LIVE` opens. The current highest-priority gap
  is now execution cohesion rather than a missing feature wave: manual `LIVE`
  write authorization still needs a stricter fail-closed contract for
  canonical symbol scope, inherited venue context, and submitted->reconciled
  operator truth across orders, exchange-synced open orders, and positions.
- 2026-04-25: closed `V1COH-01` and `V1COH-02` as the first residual execution
  cohesion hardening slice. Manual `LIVE` open now reuses inherited
  wallet+market-universe execution truth on the write path and rejects
  unresolved symbol scope with explicit domain errors instead of relying on
  duplicated bot snapshot venue fields. Focused `orders.service` and
  route-level regressions now lock both the fail-closed cases and valid scoped
  `LIVE` fixtures under the canonical singular bot contract.
- 2026-04-25: closed `V1COH-03` as the red runtime-truth lock for manual
  `LIVE MARKET` submitted->reconciled behavior. The repository now has one
  focused service regression proving a manual `LIVE` market open can remain
  `OPEN/submitted` with `waitingForFill=true` and no position when exchange
  placement returns no fill truth, and one route-level runtime regression that
  currently fails exactly on the next missing step: `EXCHANGE_SYNC` open-order
  visibility is not yet adopted into runtime reads before later
  `EXCHANGE_SYNC` position visibility. This makes `V1COH-04` the next smallest
  honest fix slice.
- 2026-04-25: closed `V1COH-04` by tightening runtime adoption for manual
  `LIVE` opens at the read-model boundary. Runtime session positions now apply
  the same symbol-ownership adoption rule to eligible `EXCHANGE_SYNC`
  open-order rows that was already used for external positions, and open-order
  presentation deduplicates manual-vs-synced rows by `exchangeOrderId` with
  preference for the exchange-synced record. The resulting runtime truth is
  now explicit and non-duplicative across the backend stages
  `submitted -> imported_open_order -> position_opened`, making the remaining
  gap primarily an operator-surface/web-state problem in `V1COH-05`.
- 2026-04-25: closed `V1COH-05` by exposing explicit manual `LIVE` action
  states on dashboard-home runtime surfaces. The manual-order sidebar now
  renders localized `submitted`, `waiting_for_fill`, `imported_open_order`,
  `position_opened`, and `blocked` states derived from the already-hardened
  runtime order and position truth, so operators no longer need to infer
  progress from generic fallback wording.
- 2026-04-25: closed `V1COH-06` with a focused closure pack across the touched
  backend and web surfaces. Manual `LIVE` execution cohesion is now backed by
  passing API regressions for submitted->imported order->position truth,
  passing dashboard/manual-order regressions for the explicit operator states,
  passing API and web typechecks, and a green repository guardrail pass after
  splitting oversized manual-order UI coverage into its own test file.
- 2026-04-25: queued `V1READY-2026-04-25-A` after a fresh V1 audit showed that
  the remaining gap to a clean V1 claim is no longer an engineering feature
  slice. The repository now needs one canonical reconciliation pass across
  `PROJECT_STATE.md`, the activation pack, the activation closure, the RC
  sign-off record, and the RC checklist/status artifacts so it can state
  honestly whether V1 is already achieved or still blocked only by explicit
  operator-owned sign-off steps.
- 2026-04-25: closed `V1READY-2026-04-25-A` as the final activation-truth
  reconciliation pass. The canonical answer is now fail-closed and explicit:
  V1 engineering scope is complete, but formal activation remains blocked by
  one inconsistent RC sign-off artifact rather than by missing product or
  runtime work. The next honest slice is `V1READY-2026-04-25-B`, an
  operator-owned rebuild of the RC sign-off artifact plus checklist/status
  resync before any final `READY` claim.
- 2026-04-25: closed `V1READY-2026-04-25-B` by rebuilding the RC sign-off
  artifact, refreshing RC external gate status, rebuilding sign-off once more
  so its own snapshot captured `G4=PASS`, and resyncing the RC checklist.
  Canonical V1 activation truth is now internally consistent again: activation
  pack, activation closure, RC gates status, RC checklist, RC sign-off record,
  and planning/context docs all agree that V1 is approved from the current
  repository evidence set.
- 2026-04-25: closed `XADAPT-01` as the contract-freeze slice for post-V1
  exchange hardening. Architecture docs now expose one explicit capability
  matrix across authenticated reads and write-side execution, so the repository
  no longer needs to infer write support from generic adapter naming or from
  broad `LIVE_EXECUTION` flags alone. Frozen V1 truth is Binance-only support
  for authenticated reads plus `LIVE_ORDER_SUBMIT`, while `LIVE_ORDER_CANCEL`
  remains explicitly unsupported until a canonical exchange-side cancel
  boundary exists.
- 2026-04-25: closed `XADAPT-02` as the assumption-classification slice for the
  adapter hardening wave. The repository now has one explicit audit packet that
  separates intentional Binance-only runtime scope from compatibility seams and
  from generic-looking drift risks. This gives `XADAPT-03` a concrete owner map
  for narrowing adapter boundaries without rediscovering support truth.
- 2026-04-25: closed `XADAPT-03` as the boundary-hardening slice for post-V1
  exchange work. The codebase now has one shared execution capability matrix
  covering authenticated reads, `LIVE_ORDER_SUBMIT`, and explicitly unsupported
  `LIVE_ORDER_CANCEL`, plus one feature-facing exchange adapter boundary for
  orders, positions, and wallets. Lower-level connector and CCXT seams remain
  internal infrastructure, while feature modules now consume the narrowed
  boundary instead of composing connector factory, authenticated-read support,
  and live-submit primitives directly.
- 2026-04-25: closed `XADAPT-04` as the focused Binance contract-lock slice.
  The exchange hardening wave now has dedicated tests for the shared execution
  capability matrix and the new feature-facing adapter boundary, proving
  Binance-only read/submit support, explicit `LIVE_ORDER_CANCEL` non-support,
  unsupported-exchange fail-closed behavior, and live-submit result
  normalization without relying on broad DB-backed e2e packs.
- 2026-04-25: closed `XADAPT-05` as the closure-validation slice for the
  exchange-hardening wave. Focused adapter-boundary, capability-matrix, and
  authenticated-read contract suites are green together with API typecheck and
  repository guardrails, and canonical queue/context state now points to
  `XADAPT-06` as the planning-only next step after Binance boundary closure.
- 2026-04-25: closed `XADAPT-06` as the final planning slice of the exchange
  hardening wave. The repository now has one explicit next-exchange readiness
  packet choosing `BYBIT` as the next target and freezing staged rollout order
  across `API_KEY_PROBE`, `BALANCE_PREVIEW`, `POSITIONS_SNAPSHOT`,
  `OPEN_ORDERS_SNAPSHOT`, and `LIVE_ORDER_SUBMIT`, while keeping reconciliation
  broadening and `LIVE_ORDER_CANCEL` explicitly out of scope.
- 2026-04-25: closed `V1REG-02` as the first automated architecture-V1 sweep.
  The reusable checklist now contains one dated execution log and per-function
  automated verdicts. Web suites and non-DB API suites are green across the
  touched V1 surface, while DB-backed API verification is currently blocked by
  unreachable local Postgres at `localhost:5432`; no new product regression was
  isolated in this automated slice.
- 2026-04-25: closed `V1REG-03` as the matching browser/manual sweep for the
  reusable V1 checklist. Local browser verification confirmed that the auth
  shell still renders correctly on desktop/tablet/mobile, unauthenticated
  protected-route navigation still redirects `/dashboard` back to
  `/auth/login`, and invalid sign-in remains explicit rather than silently
  succeeding. No new product-visible regression was isolated, but the broader
  authenticated browser pass remains infra-blocked locally because the API dev
  target fails closed on missing `API_KEY_ENCRYPTION_KEYS` and local
  Docker/Postgres were unavailable in this run.
- 2026-04-25: closed `V1REG-04` as the triage/classification slice for the
  reusable V1 verification loop. The current evidence set does not justify any
  new `V1REG-Fxx` product bugfix task: `F09`, `F10`, and `F12` remain covered
  by already-closed cohesion/adapter/surface waves with no new post-closure
  regression isolated, while the remaining non-green function verdicts are
  attributable to documented local infra blockers (`Docker Desktop` /
  `localhost:5432`) and local API critical-secret startup prerequisites.
- 2026-04-25: closed `V1REG-05` and with it the full `V1REG-A` wave. Closure
  rerun kept the web checklist pack green, kept the non-DB API checklist pack
  green, and reconfirmed that the remaining auth/API failures still stop at the
  same infra boundary (`prisma.log.deleteMany()` cannot reach
  `localhost:5432`). The repository now has a reusable architecture-based V1
  verification protocol with no active follow-up task until either local infra
  is restored for a fuller rerun or a real new product regression is observed.
- 2026-04-25: approved the next exchange/runtime architecture direction after a
  fresh audit. The target model is now explicit: all exchange-owned behavior
  must resolve from the exact `(exchange, marketType)` pair; `SPOT` and
  `FUTURES` must never mix prices, candles, indicators, or signal inputs; the
  scalable implementation model is a family of narrow adapters under one
  registry; and worker health/readiness should be aligned with the full
  deployed topology where needed. Published
  `history/plans/exchange-context-and-worker-topology-hardening-plan-2026-04-25.md`
  and queued `XVENUE-01..08`.
- 2026-04-25: closed `XVENUE-02` as the concrete code-audit slice for the new
  exchange-context wave. The repository now has one leak inventory in
  `history/audits/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md`
  confirming that direct exchange-specific behavior still exists outside
  `modules/exchange` across `markets`, `engine`, `bots`, `backtests`, and
  profile API-key probing, while worker health/readiness still models only part
  of the approved topology. No implementation claim changed in this slice; it
  simply freezes the migration map so `XVENUE-03` can define the exact
  capability-matrix evolution without guesswork.
- 2026-04-25: closed `XVENUE-03` as the capability-contract follow-up to the
  boundary leak audit. Canonical docs now distinguish compatibility-stage
  exchange-level flags from the target exact-stage
  `(exchange, marketType, operation)` matrix, and they explicitly forbid
  inferring support across operation families, market types, or exchanges. This
  means the upcoming registry refactor can move code toward exact venue truth
  without changing the honest support claims the repository makes today.
- 2026-04-25: closed `XVENUE-04` as the first code refactor under the new
  exact-context contract. The repository now has one canonical exchange adapter
  registry in `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.ts`
  keyed by exact `(exchange, marketType)` context, and the existing exchange
  public/account/execution entrypoints now resolve connector bootstrap through
  that registry instead of rebuilding it locally. This does not yet remove the
  direct Binance-shaped feature leaks in `markets` and `engine`; it prepares
  the safe seam for `XVENUE-05`.
- 2026-04-25: closed `XVENUE-05` as the first feature-module leak-removal
  slice. Market catalog bootstrap now lives in
  `apps/api/src/modules/exchange/exchangeMarketCatalog.service.ts`, and runtime
  live-balance reads in `runtimeCapitalContext.service.ts` now go through the
  canonical exchange balance boundary instead of building a local Binance CCXT
  client. The remaining next exchange-context hardening step is now explicit
  no-mixing parity coverage in `XVENUE-06`.
- 2026-04-25: closed `XVENUE-06` as the parity-lock follow-up for the new
  exact-context seams. The repository now has focused regression coverage
  proving that `BINANCE + SPOT` and `BINANCE + FUTURES` remain isolated in the
  registry and market-catalog paths, and that unsupported venue/context pairs
  stay fail-closed. The remaining active wave slice is now worker-topology
  truth alignment in `XVENUE-07`.
- 2026-04-25: closed `XVENUE-07` as the worker-topology truth slice of
  `XVENUE-A`. The repository now models `market-data`, `market-stream`,
  `backtest`, and `execution` through one shared worker-topology contract,
  `/workers/health` and `/workers/ready` distinguish explicit local/test inline
  support from deployed degraded inline or partial-split topology, and passive
  runtime-freshness skips are now limited to that explicit local/test inline
  mode. The remaining active wave slice is now `XVENUE-08`.
- 2026-04-25: closed `XVENUE-08` and with it the full `XVENUE-A` wave. A
  focused closure rerun confirmed that exact-context exchange seams,
  worker-topology truth, API typecheck, and repository guardrails all remain
  green together after the final worker-alignment slice, so there is no longer
  an active `XVENUE` item in the canonical queue.
- 2026-04-25: closed `DEPLOY-2026-04-25-B` as the validation-only follow-up to
  the same-day Coolify hotfix. Local `pnpm --filter web run build` now passes
  cleanly again, confirming the previously reported web deploy gate is no
  longer reproducible in the repository, and `quality:guardrails` remained
  green after closure sync.
- 2026-04-25: closed `PAPERPNL-02` as a test-only follow-up to
  `PAPERPNL-01`. The canonical `PAPER` `EXIT` lifecycle is now explicitly
  regression-locked for both profitable `LONG` and profitable `SHORT` closes,
  proving the same positive `realizedPnl` sign is persisted through both the
  closed-position payload and the close-trade payload in
  `executionOrchestrator`.
- 2026-04-25: Coolify deployment for web commit
  `0dd951d1696bd45ac11983c67e72213134a632d3` failed strictly at the web
  build gate, not at Docker or runtime startup. The blocking issues were one
  `no-explicit-any` violation in `HomeLiveWidgets.test-helpers.ts` and one
  redundant `useMemo` dependency warning in `WalletsListTable.tsx`; the
  follow-up hotfix restores the required `pnpm --filter web run build`
  contract for automatic redeploy.
- 2026-04-24: closed `PAPERPNL-01` after replacing the manual dashboard close
  fallback to `position.entryPrice` with one canonical runtime lifecycle
  mark-price resolver shared with automated runtime close logic. Manual close
  now fails closed with `POSITION_CLOSE_PRICE_UNAVAILABLE` when no ticker or
  recent runtime close can prove market truth, and focused regressions confirm
  profitable `PAPER` manual close now persists positive realized PnL through
  position, trade, runtime history, and capital summary reads.
- 2026-04-21: `docs/architecture/` is the canonical source of truth for how
  Soar works; resolved architecture decisions no longer live in
  `docs/planning/open-decisions.md`, and module deep-dives are implementation
  companions rather than primary behavior specs.
- 2026-04-22: future remediation tasks must be self-sufficient task packets
  with explicit scope, files, validation, non-goals, and docs-sync outputs;
  this is now frozen in
  `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`.
- 2026-04-22: `XLIFE-A` is closed; `PAPER` and `LIVE` now share one canonical
  execution lifecycle in the touched runtime scope, `LIVE` close is
  fail-closed until canonical fill truth exists, and runtime accounting uses
  fill truth over signal `markPrice`.
- 2026-04-22: `REVIEW-B` is closed; runtime DCA/add-leg execution now obeys
  canonical fill truth, submitted dedupe stays non-terminal until linked order
  outcome is known, generic exchange snapshots fail closed when ownership is
  ambiguous unless `apiKeyId` is explicit, and watchdog symbol scope is
  limited to explicit Binance-futures contexts.
- 2026-04-22: `REVIEW-C` is closed; runtime replay now restores completed DCA
  state from canonical persisted position truth, authenticated exchange
  snapshot failures normalize through one explicit operator error contract, and
  live reconciliation no longer synthesizes `CANCELED` when an order simply
  disappears from the exchange open-orders view.
- 2026-04-22: `RELEASE-HARDEN-A` is closed; V1 release execution now has one
  canonical operator-facing gate entrypoint (`ops:release:v1:gate`) over the
  existing quality, smoke, runtime-freshness, and rollback-guard checks.
- 2026-04-22: `SAFEV1-A` is closed; reconciliation entry truth, live capital
  truth, external ownership resolution, and rate-limit degraded-mode behavior
  are now covered by explicit fail-closed contracts and focused regression
  locks.
- 2026-04-22: `REVIEW-D` is queued; the next production-readiness closure wave
  is explicitly scoped to runtime `liveOptIn` admission truth, fail-closed
  handling for orphan bot-origin positions, canonical takeover-rebind
  ownership, and release-readiness truth for API-key encryption material.
- 2026-04-22: `REVIEW-D1` is closed; runtime signal topology now excludes
  `LIVE` bots unless `liveOptIn=true`, and runtime automation skips live
  positions whose owning bot is not opted in, keeping admission truth aligned
  across topology and execution-side candidate selection.
- 2026-04-22: `REVIEW-D2` is closed; orphan `origin='BOT'` positions without
  canonical bot ownership are now skipped before any manual runtime fallback
  context can apply, so bot-origin orphan state remains explicit and fail
  closed.
- 2026-04-22: `REVIEW-D3` is closed; takeover rebind no longer guesses owner
  for orphan `origin='BOT'` positions from the currently eligible LIVE bot set
  and instead keeps them unresolved unless explicit canonical ownership proof
  exists.
- 2026-04-22: `REVIEW-D4` is closed; release readiness now requires versioned
  `API_KEY_ENCRYPTION_KEYS`, while legacy `API_KEY_ENCRYPTION` remains
  compatibility-only for decrypting older payloads and is no longer sufficient
  for readiness or new encryption writes.
- 2026-04-22: `V1FACT-A` is queued; the next wave is explicitly scoped to V1
  production activation truth: release-gate freshness, stage/prod evidence
  separation, backup/restore and rollback proof, and final sign-off packaging.
- 2026-04-22: `V1FACT-A1` is closed; V1 activation now has one explicit
  freshness audit over release-gate, smoke, rollback, backup, and sign-off
  evidence, and the next active slice is stage-rehearsal and release-gate
  freshness hardening.
- 2026-04-22: `V1FACT-A2` is closed; V1 release gate now classifies evidence
  freshness explicitly by environment, stage rehearsal has one canonical
  entrypoint with reproducible artifacts, and stage dry-run evidence remains
  fail-closed and explicitly non-production until remote execution proof
  exists.
- 2026-04-22: the first authenticated stage rehearsal through Coolify
  `Root Team` access plus a dedicated stage OPS admin exposed a real blocker:
  `/workers/runtime-freshness` reported `FAIL` in `WORKER_MODE=inline`
  without active runtime demand even while `/workers/health`, `/workers/ready`,
  and `/alerts` were green.
- 2026-04-22: `V1FACT-07B` is closed; the inline runtime-freshness contract
  was aligned with real worker demand, SHA `49ea8e0c` was deployed, and the
  authenticated stage rehearsal now passes with fresh stage artifacts instead
  of remaining blocked on a false negative.
- 2026-04-22: `V1FACT-A3` is closed; prod release readiness now treats
  backup/restore drill and rollback proof as explicit evidence families in the
  V1 release gate, with canonical rollback-proof commands and fail-closed
  classification when either proof is stale or missing.
- 2026-04-22: `V1FACT-10` is closed; the final prod activation packet now
  exists in `history/releases/v1-production-activation-pack-2026-04-22.md`,
  and the residual blockers are narrowed to four explicit items: missing prod
  restore-drill proof, missing prod rollback-proof pack, open RC Gate 2, and
  missing named human approvers / rollback owner in the sign-off record.
- 2026-04-22: `V1FACT-11` is closed; `V1FACT-A` no longer has active executor
  tasks. The production-activation architecture is frozen, and the remaining
  state is `CLOSED_WITH_OPERATOR_BLOCKERS` rather than an open engineering
  wave.
- 2026-04-22: `V1FACT-A` is closed as a delivery wave. Further progress toward
  final V1 activation now depends on operator-owned prod evidence generation
  and named sign-off capture, not on additional planned engineering tasks.
- 2026-04-22: production web login regression was traced to missing
  `NEXT_PUBLIC_API_BASE_URL` behavior in the browser. A shared public API base
  resolver now infers canonical API hosts from Soar domain patterns so
  production/stage auth and dashboard API calls do not fall back to same-origin
  `405` requests when the public env is absent.
- 2026-04-22: prod activation follow-up closed `RC Gate 2` with fresh
  production SLO evidence and a real prod rollback-proof artifact, but the
  prod restore-drill proof still fails because the prod DB profile env triplet
  (`PROD_DB_CHECK_CONTAINER`, `PROD_DB_CHECK_USER`, `PROD_DB_CHECK_NAME`) is
  not configured for the scripted check.
- 2026-04-22: `scripts/runV1ReleaseGate.mjs` now validates PASS-state inside
  prod restore/rollback proof artifacts instead of accepting same-day files on
  freshness alone, preventing false-green release readiness when a proof file
  exists but reports `FAIL`.
- 2026-04-23: selected-bot dashboard runtime markets are now rendered against
  one explicit truth state contract. Runtime symbol stats distinguish
  `CONFIGURED_ONLY`, `EVALUATED_NO_TRADE`, `SIGNAL_ACTIVE`, `POSITION_OPEN`,
  and `UNRESOLVED`, so configured strategy fallback context remains visible as
  operator context without pretending accepted runtime signal truth.
- 2026-04-23: production runtime investigation uncovered a second concrete
  drift: `marketStream.worker` was deriving symbol subscriptions from
  whitelist-only universe logic instead of the canonical symbol-group resolver
  already used by runtime topology. The worker now reuses the canonical
  resolver, so catalog-backed and filter-backed market universes subscribe the
  same symbols that runtime and operator surfaces consider in-scope.
- 2026-04-23: post-deploy production verification exposed a third concrete
  runtime-stream drift for `BINANCE/FUTURES`: the market-stream worker still
  defaulted to Binance's spot websocket URL when no explicit
  `BINANCE_STREAM_URL` override was configured. This caused futures-only
  symbols to remain at `configured_fallback` while symbols listed on both spot
  and futures received real runtime decisions. The canonical default now
  follows runtime market type (`FUTURES` -> `wss://fstream.binance.com/ws`,
  `SPOT` -> `wss://stream.binance.com:9443/ws`).
- 2026-04-24: the approved target bot architecture is now a full singular
  runtime-context model rather than a compatibility cleanup. Canonical target:
  one bot links exactly one wallet, one symbol-group-derived market scope, and
  one strategy. The bot keeps activation/runtime identity only, while wallet
  owns execution/capital context, symbol group + market universe own venue and
  symbol scope, and strategy owns logic/risk settings. The execution queue for
  this migration is published as `V1BOT-01..11`.
- 2026-04-24: the first implementation slice of the single-context bot rewrite
  is now landed. `Bot` persists direct `strategyId` and `symbolGroupId`
  references, migration SQL backfills those refs from one unambiguous active
  canonical topology row (or one unambiguous legacy `BotStrategy` row when no
  canonical row exists), create/update commands write the direct refs, and
  bot list/get/runtime-graph reads expose the singular inherited bot context
  without relying on legacy graph reconstruction as the only truth.
- 2026-04-24: `V1BOT-06` is closed. Canonical runtime topology now resolves one
  direct bot runtime context (`symbolGroupId + strategyId`) instead of
  iterating over legacy `botMarketGroups/strategyLinks`, final-candle routing
  and execution run against that singular context, dynamic market-stream
  subscriptions read direct bot refs first, and the selected-bot runtime
  surfaces that show market/strategy context now prefer direct inherited bot
  data over legacy runtime-graph reconstruction.
- 2026-04-24: `V1BOT-07` is closed. Canonical runtime execution now derives
  mode, paper baseline, and LIVE credential ownership from wallet context and
  venue truth from the linked symbol-group market universe. Active runtime
  topology fails closed on wallet-vs-market-scope drift, pre-trade now reads
  inherited execution config instead of bot snapshot mode/marketType, runtime
  position automation uses inherited wallet/venue context for DCA/close
  actions, and canonical runtime capital no longer falls back to bot-owned
  paper/api-key execution truth.
- 2026-04-24: authenticated production verification for the new paper bot
  `dec24168-7bba-4c44-aac9-97b3c6c60ce1` confirmed the next V1 gap is now the
  manual-order path rather than general bot runtime health. `manual-context`
  can resolve singular strategy truth (for example `25x` leverage on
  `1000000BOBUSDT`), but `POST /dashboard/orders/open` for a paper `MARKET`
  order without an explicit request price still persisted `Order.status=OPEN`
  with `positionId=null`, leaving the selected-bot aggregate unchanged. The
  next queued recovery slice is `V1BOT-09`, covering singular manual-context
  resolution, immediate paper fill authority, and truthful dashboard manual
  action states for both `PAPER` and `LIVE`.
- 2026-04-24: `V1BOT-09`, `V1DASH-A`, `V1BOTSURF-A`, and `V1SURF-A` are now
  closed. Manual-order singular-context recovery, dashboard capital KPI
  hardening, bot-surface truth alignment, and shared operator-state alignment
  all passed focused validation, and the web now reuses one shared runtime
  capital/runtime-state presentation helper across selected-bot dashboard and
  bot monitoring/list surfaces.
- 2026-04-24: `V1BOT-A` is now fully closed. Bot create/edit flows use direct
  singular refs instead of runtime-graph fallback, canonical API/runtime paths
  no longer infer primary context from legacy multi-group/multi-strategy
  topology, and the migration closure pack passed across API e2e/runtime,
  focused web suites, typecheck, build, and repository guardrails. Legacy
  topology remains compatibility-only and is no longer part of canonical
  execution truth.
- 2026-04-24: published `V1IND-A` after a fresh end-to-end indicator and
  signal-surface audit. Builder-exposed indicators in
  `strategies/indicators.data.ts` largely match shared evaluator support in
  `strategyIndicatorKernel.ts`, but canonical repo truth is still split across
  architecture docs, builder metadata ownership, and operator signal-surface
  fallback analysis.
- 2026-04-24: `V1IND-A` is closed. One canonical indicator registry now drives
  builder metadata, runtime/backtest evaluator parity, and operator
  signal-surface analysis; configured market snapshots use the same shared
  indicator kernel as runtime/backtest decisions, and signal surfaces no longer
  emit the old subset-evaluator placeholder `X` when canonical market data
  exists.
- 2026-04-24: published `V1POSTBOT-A` after re-running full API validation for
  the post-`V1BOT` repository state. The remaining 7 red cases are clustered in
  `backtests/orders` suites and look like one singular-bot contract recovery
  wave rather than an indicator regression: older fixtures still create
  partially configured LIVE bots, one manual-order path still loses inherited
  `strategyId`, and runtime session positions still drift for carryover open
  orders plus `EXCHANGE_SYNC BOT_MANAGED` LIVE ownership.
- 2026-04-24: `V1POSTBOT-A` is closed. The remaining red full-API cases after
  `V1BOT-A` were resolved by aligning stale `backtests/orders` e2e fixtures to
  the canonical singular bot contract instead of keeping half-legacy bot
  setup. Full `pnpm --filter api run test -- --run` is green again with the
  required API-key encryption env.
- 2026-04-24: signal-surface semantic hardening is now also closed as a small
  post-`V1IND-A` follow-up. Dashboard-home and bot-monitoring surfaces now
  label `CONFIGURED_ONLY` / `configured_fallback` rows as closed-candle market
  snapshots instead of reading like accepted or evaluated runtime decisions,
  while still showing the same canonical condition lines for operator
  comparison.
- 2026-04-24: `V1SURF-05` is now closed. `dashboard-home` no longer rebuilds
  selected-bot runtime aggregate payloads in the browser when the aggregate
  endpoint fails; the controller keeps real session truth from
  `listBotRuntimeSessions`, clears aggregate data fail-closed, and exposes an
  explicit degraded selected-bot state instead of reconstructing symbol stats,
  positions, and trades from session endpoints.
- 2026-04-24: `V1SURF-06` is now closed. Dashboard runtime sidebar and
  manual-order estimate semantics now reuse inherited venue truth from the
  linked symbol-group market universe instead of duplicated bot snapshot
  `exchange/marketType` fields. Capability checks, placeholder venue labels,
  sidebar market context, and SPOT-vs-FUTURES fallback margin/leverage
  behavior now align on one shared `resolveBotVenueContext()` helper.
- 2026-04-24: `V1SURF-B` is now fully closed. Bot-monitoring quick-context
  cards and placeholder capability warnings now also resolve venue semantics
  from inherited bot context instead of duplicated bot snapshot fields, and
  the focused residual operator-surface closure pack passed across selected-bot
  dashboard aggregate fail-closed behavior, inherited dashboard venue truth,
  bot-monitoring inherited venue truth, and dashboard/preview parity views.
- 2026-04-24: a small UX/UI refinement slice is also closed for operator-facing
  density polish. Strategy tabs now render inside one cleaner content
  container instead of nested framed boxes, dashboard `Historia` keeps only the
  operational trade log, runtime market cards no longer surface the removed
  helper labels/counters (`Status`, `Source`, `Strategy`, `Decision`,
  `Pozycja otwarta`, `Oceniono/brak wejścia`), dashboard warning text is more
  readable, and wallet create/edit form now groups fields into denser rows
  with a button-style mode switcher.
- 2026-04-24: the next post-`V1IND-A` operator-truth follow-up is now active
  as `V1MON-A`. The first slice is already closed: bot monitoring no longer
  reconstructs aggregate runtime truth client-side when the backend aggregate
  endpoint fails, and instead relies on one canonical backend aggregate plus
  explicit degraded/error state in web.
- 2026-04-24: `V1MON-02` is now also closed. Bot list and bot management
  surfaces prefer inherited venue truth from `symbolGroup.marketUniverse` and
  derive displayed strategy position-limit context from linked strategy
  configuration, keeping legacy bot snapshot fields as compatibility-only
  fallback instead of the primary operator narrative.
- 2026-04-24: `V1MON-03` is now also closed. Bot monitoring future-signal
  rows expose the same semantics as dashboard-home: runtime state, context
  source, strategy context, decision detail, and canonical condition lines are
  operator-visible, while configured-only rows remain visibly degraded market
  snapshots rather than looking like accepted runtime signals.
- 2026-04-24: `V1MON-A` is now closed. Bot monitoring no longer reconstructs
  aggregate truth client-side, bot list/management prefer inherited venue and
  strategy context over duplicated bot snapshot fields, and bot-monitoring
  future-signal rows now match dashboard-home semantics under one focused
  closure pack.
- 2026-04-24: fresh repository-wide closure verification now passes again:
  full `api` suite (with required API-key encryption env), full `web` suite,
  `api` typecheck, `build`, and `quality:guardrails` are green. A fresh
  production API audit confirmed that runtime signal/operator truth is now
  materially healthy on both paper and live bots with numeric indicator values
  and wallet/strategy-sized paper positions. The final narrow backend/runtime
  follow-up is published as `V1FINAL-A`: aggregate session detail must not
  expose stale `finishedAt` while still `RUNNING`, and at least one legacy
  pre-fix paper manual `MARKET` order on production still requires explicit
  orphan-order recovery.
- 2026-04-24: `V1FINAL-01` is closed. Synthetic aggregate runtime session
  detail now keeps `finishedAt=null` whenever any aggregated session is still
  `RUNNING`, instead of mixing active state with stale completion metadata from
  older sessions.
- 2026-04-24: `V1LIFE-03` is closed. Runtime session watchdog now reuses one
  canonical stale-order service plus the existing `cancelOrder` command path to
  expire strategy-governed `PENDING` / `OPEN` / `PARTIALLY_FILLED` orders,
  guarded by runtime `CANCEL` dedupe under `reasonCode=stale_open` and
  fail-closed when strategy lifetime is disabled (`0` or invalid config).
- 2026-04-24: `V1LIFE-04` is closed. Runtime session watchdog now also enforces
  strategy-configured position lifetime through one canonical stale-position
  service, reusing the existing runtime EXIT lifecycle instead of a separate
  cleanup path. Close attempts prefer current ticker truth, fall back to the
  latest recent close for the bot strategy interval, and fail closed when no
  valid mark price can be proven.
- 2026-04-24: `V1LIFE-05` is closed. Dashboard `Orders` tab now exposes a
  final action column backed by the existing cancel-order endpoint, with
  explicit pending state and fail-closed visibility rules: only active
  open-order statuses render cancel affordance, while terminal rows stay
  read-only and table truth refreshes from the canonical selected-bot runtime
  snapshot after successful cancellation.
- 2026-04-24: `V1LIFE-A` is now closed. Strategy lifetime semantics are fully
  aligned end-to-end: `0` is an explicit `no time limit` contract in the
  strategy form and payload mapping, runtime now enforces stale-order and
  stale-position expiry through the existing canonical cancel/close lifecycles,
  and the dashboard `Orders` tab exposes a real cancel action over the same
  backend endpoint. Focused closure validation for the lifetime/order-control
  wave is green across web tests, API tests, typecheck, and repository
  guardrails.
- 2026-04-24: a fresh post-`V1LIFE-A` audit narrowed the remaining V1 risk to
  residual operator-surface truth drift rather than backend execution logic.
  The main concrete findings are: `dashboard-home` still reconstructs selected
  bot aggregate state in the browser when aggregate API fetch fails, and a few
  dashboard/bot-monitoring surfaces still read venue semantics from duplicated
  bot snapshot fields instead of inherited symbol-group market-universe truth.
  This follow-up is now tracked as `V1SURF-B`.
- 2026-04-24: published `V1LIFE-A` after a focused lifecycle audit covering
  strategy builder, runtime/order services, and dashboard open orders UI.
  Confirmed that strategy already stores `maxOrders`, `orderLifetime`,
  `orderUnit`, `maxPositions`, `positionLifetime`, and `positionUnit` inside
  `strategy.config.additional`, but canonical runtime enforcement currently
  only consumes `maxPositions`. No explicit runtime/manual-order enforcement
  path was found yet for order lifetime or position lifetime, and the dashboard
  open orders table still lacks an operator cancel action despite the existing
  backend `cancelOrder` endpoint. The queued wave closes those gaps under one
  contract, including `0 = no time limit` semantics in the strategy UI.
- 2026-04-24: `V1LIFE-01` is closed. Strategy form lifetime inputs now allow
  `0` for both order and position lifetime, helper copy explicitly documents
  `0 = no time limit`, and focused web regressions lock the submit payload to
  preserve zero values instead of coercing them away.
- 2026-04-24: `V1LIFE-02` is closed. API now exposes one canonical
  `strategyLifetimePolicy` resolver for both order and position lifecycle
  policies, sourced only from `strategy.config.additional`. The helper
  normalizes `orderLifetime/orderUnit` and `positionLifetime/positionUnit`,
  treats explicit `0`, missing, negative, non-finite, and unsupported-unit
  inputs as fail-closed disabled policies, and emits normalized `durationMs`
  output for downstream runtime/order consumers.
- 2026-04-24: `V1FINAL-02` is closed without new code. The known production
  orphan paper order was confirmed to be a historical pre-fix manual
  `PAPER MARKET` row persisted as `OPEN` with no fill/position. Recovery
  reused the canonical existing `cancelOrder` lifecycle path, and production
  paper aggregate now reports `openOrdersCount=0`.
- 2026-04-24: `V1FINAL-03` is closed. Focused backend runtime-closure
  validation passed again for aggregate monitoring truth, paper manual-order
  immediate fill, runtime flow parity, `api` typecheck, and repository
  guardrails. The only remaining blocker captured for the backend handoff is
  infra-only on this workstation: local `test:go-live:smoke` cannot bind
  `5432/6379` while another local docker stack is already occupying those
  ports.
- 2026-04-22: prod restore-drill proof now passes from a real Coolify terminal
  execution in the production postgres container
  (`x11cfnz1dd9x0yzccftqzcoe`), and the final non-dry-run prod release gate now
  passes end-to-end with fresh prod evidence.
- 2026-04-23: production auth follow-up confirmed the current API/browser login
  flow is healthy on a fresh session, and the remaining recurrence vector is
  stale cached public auth shells. Login and register pages now opt out of
  static revalidation so users fetch fresh auth clients after deploys.
- 2026-04-23: the remaining production login bounce was traced to a web-side
  `/auth/me` bootstrap loop. `AuthProvider` runs above route i18n providers, so
  `useOptionalI18n()` now memoizes its fallback translator to keep auth
  bootstrap dependencies stable and stop rate-limit-triggering session checks.
- 2026-04-23: web auth bootstrap now has a direct `AuthProvider` rerender
  regression test, so the `/auth/me` loop fix is locked both at the optional
  i18n helper level and at the provider bootstrap boundary itself.
- 2026-04-23: the shared web API interceptor now has direct regression coverage
  for protected-route `/auth/me` behavior, explicitly locking `401` redirect,
  non-redirect `429`, and repeated-backend-failure fallback semantics.
- 2026-04-23: the auth-focused web regression pack now runs under real auth
  route namespace context, removing a false-positive i18n warning and keeping
  the post-incident auth test signal clean.
- 2026-04-23: `AuthProvider` now has direct regression coverage for the
  explicit `session=expired` hint path, including one-time warning behavior and
  URL query cleanup after handling the expired-session notice.
- 2026-04-23: `AuthProvider` logout now also has direct regression coverage for
  posting `/auth/logout`, clearing local auth state, and redirecting back to
  the login screen.
- 2026-04-23: `useRegisterForm` now has the same direct regression coverage as
  `useLoginForm` for request failure, success redirect, and missing
  session-confirmation behavior after auth bootstrap.
- 2026-04-23: the shared auth navigation fallback helper now has direct
  regression coverage for one delayed retry on stuck auth routes, no retry
  after the browser already leaves the fallback prefix, and test-mode retry
  suppression so hook tests stay deterministic.
- 2026-04-23: the dashboard wallets list page test now renders under its real
  route context, removing avoidable i18n missing-namespace noise caused by
  rendering the dashboard view under `/`.
- 2026-04-23: active work has moved out of production-activation planning and
  into a new post-approval `V1CONF-A` confidence-hardening wave, focused on
  keeping repository truth aligned with the approved candidate and reducing
  false-negative noise in high-signal validation packs.
- 2026-04-23: high-signal dashboard table tests now render under their real
  dashboard route context (`/dashboard/bots`, `/dashboard/wallets`,
  `/dashboard/backtests`) so route-owned i18n namespaces are loaded
  intentionally instead of falling back through the default `/` route.
- 2026-04-23: web component tests now default-mock `profileBasicCache` in
  Vitest setup, so shared `DataTable` column-visibility hydration no longer
  issues unrelated `/dashboard/profile/basic` requests during ordinary
  rendering assertions.
- 2026-04-23: the full web confidence pack now passes with `web test`,
  `web typecheck`, and `quality:guardrails`; the remaining non-failing signal
  noise is narrowed to `I18nProvider`-driven `act(...)` warnings and a small
  set of route-namespace warning cases, which are now isolated as the next
  confidence follow-up instead of mixed into auth/dashboard table noise.
- 2026-04-23: `V1CONF-06` is closed; `I18nProvider` now lazily hydrates
  locale/timezone from storage without mount-time state churn, the route
  namespace registry explicitly maps `/dashboard/profile` to `auth`, the
  affected auth/profile/reports/backtests/dashboard suites render under their
  owned route context, and `BotsManagement` no longer depends on brittle
  fetch-order or uncontrolled rerender timing.
- 2026-04-23: `V1CONF-07` is closed; the remaining non-failing web warning
  noise was removed by aligning bots/markets/strategies route-aware tests with
  their dashboard routes and by adding settled render/teardown helpers for the
  dashboard-home widget suites, so the full web pack now runs green without
  the previous `stderr` act/i18n warning spill.
- 2026-04-23: authenticated production investigation confirmed that the active
  PAPER and LIVE bots for the primary operator account are heartbeat-healthy
  but currently produce `0` persisted runtime signals, positions, and trades.
  The operator-facing runtime monitoring surface can still show
  `configured_fallback` strategy context, which looks signal-like even when no
  canonical runtime signal row exists. This has been promoted into a dedicated
  `V1SIG-A` recovery wave focused on runtime delivery truth, operator
  diagnostics, and paper-reset capital parity.
- 2026-04-23: `V1SIG-A` is closed as a truth-and-diagnostics wave. Runtime now
  emits explicit `GROUP_MAX_OPEN_POSITIONS_REACHED` pre-trade telemetry, the
  monitoring read model separates `latest_signal`, `latest_decision`, and
  `configured_fallback`, web surfaces show fallback strategy context without
  claiming it as accepted signal truth, and paper reset capital parity remains
  locked to wallet `paperInitialBalance + post-reset realizedPnL`. The
  residual production finding is now narrower and more honest: the affected
  bots are currently reaching real `No votes` / `No trade decision after
  strategy merge` outcomes, not silently losing accepted signals on the paper
  or live adapter path.
- 2026-04-23: after local Docker-backed infra became available again, the
  remaining DB-backed runtime recovery evidence also passed: selected-bot
  symbol-stats scope, monitoring aggregate read-model truth, paper reset
  capital baseline, execution orchestrator close-path behavior, and
  `PAPER`/`LIVE` decision parity are now all covered by green focused API
  suites in addition to the earlier non-DB packs.
- 2026-04-23: wallet/runtime capital authority now has a dedicated follow-up
  planning wave `V1CAP-A`, covering two operator-critical cases that need
  explicit V1 closure: `PAPER` reset checkpoint semantics and `LIVE`
  post-loss/post-deposit exchange balance refresh behavior under wallet
  allocation modes. The intended rule is that `LIVE` capital truth remains
  exchange-authoritative and should reflect later deposits automatically,
  while `PAPER` reset must create a clean active-capital baseline without
  deleting history.
- 2026-04-23: `V1CAP-A` is closed. Wallet preview and runtime now reuse one
  shared capital-allocation helper, runtime monitoring summaries expose
  explicit capital-source/allocation/reset metadata, and wallet/runtime UI
  surfaces explain whether active capital comes from paper baseline, paper
  reset checkpoint, or authenticated live exchange balance under percent,
  fixed, or full-balance allocation.
- 2026-04-23: a fresh architecture-conformance review after `V1SIG-A` and
  `V1CAP-A` surfaced the next explicit V1 closure wave `V1ALIGN-A`. The
  repository now has one queued answer for worker ownership drift (`split` is
  the deployed target; `inline` is local/degraded-only) plus four executor
  slices for empty runtime symbol-scope fail-closed routing, truthful signal
  interval persistence, per-active-session freshness authority, and explicit
  no-route/runtime-input diagnostics.
- 2026-04-23: `V1ALIGN-01` is closed. Canonical architecture, local
  development, and Coolify deployment docs now all say the same thing: split
  workers are the healthy deployed topology for `STAGE` and `PROD`, while
  inline worker ownership is reserved for local/test use or explicit
  degraded-mode fallback and must not be presented as normal deployment parity.
- 2026-04-23: `V1ALIGN-02` is closed. Runtime routing no longer widens empty
  resolved symbol scope into wildcard `*`; empty market-group symbol sets stay
  fail closed, and the final-candle path emits explicit `SIGNAL_DECISION`
  telemetry with reason `EMPTY_SYMBOL_SCOPE` instead of silently routing all
  symbols.
- 2026-04-23: `V1ALIGN-03` is closed. Persisted runtime signals now carry the
  truthful normalized candle interval used by the decision path instead of a
  hardcoded `1m`, keeping `Signal.timeframe` aligned with the architecture's
  interval-window contract.
- 2026-04-23: `V1ALIGN-04` is closed. `/workers/runtime-freshness` now
  evaluates decision-activity truth per active runtime session, so one
  unrelated fresh signal can no longer mask starvation for the running bot the
  operator is actually watching.
- 2026-04-23: `V1ALIGN-05` is closed. Runtime diagnostics now make the empty
  symbol-scope route outcome explicit as operator-visible telemetry, reducing
  the remaining "nothing happened" ambiguity in the runtime path.
- 2026-04-23: `V1ALIGN-06` is closed. Focused runtime-alignment tests, API
  typecheck, repository guardrails, and the full API pack are green. Full API
  validation requires explicit test-only encryption env
  (`API_KEY_ENCRYPTION_KEYS`, `API_KEY_ENCRYPTION_ACTIVE_VERSION`), and local
  `test:go-live:smoke` remains workstation-blocked when Docker cannot bind
  `5432` because another Postgres container is already using that port.
- 2026-04-23: `V1ALIGN-A` is closed as a wave. Worker-ownership docs, runtime
  symbol scope, signal interval truth, freshness authority, and explicit
  degraded diagnostics are now aligned with the approved V1 architecture.
- 2026-04-22: `scripts/runV1ReleaseGate.mjs` now selects the latest same-day
  evidence artifact by full timestamp-bearing filename, preventing older
  same-day restore-drill failures from shadowing newer PASS artifacts.
- 2026-04-22: formal RC sign-off was recorded, but the later `2026-04-25`
  activation-truth reconciliation found the generated sign-off artifact to be
  internally inconsistent (`PASS, PASS, PASS, OPEN` plus `RC status:
  APPROVED`), so V1 must remain operator-blocked until the sign-off record is
  rebuilt and checklist/status are resynced from the corrected source.
- 2026-04-22: `SAFEV1-A1` is closed; exchange reconciliation now refuses to
  create or update open synced positions when canonical entry truth is missing,
  keeping incomplete exchange snapshots out of the local open-position model.
- 2026-04-22: `SAFEV1-A2` is closed; live runtime capital now resolves only
  canonical wallet-owned or bot-owned credentials, with missing live
  credential ownership staying fail closed instead of falling back to the
  latest user API key on the same exchange.
- 2026-04-22: `SAFEV1-A3` is closed; external exchange-position ownership now
  resolves through an explicit `OWNED/AMBIGUOUS` contract that prioritizes
  canonical market-group scope and keeps overlap fail closed for runtime
  management flows.
- 2026-04-22: `SAFEV1-A4` is closed; production rate limiting now uses an
  explicit degraded-state contract with fail-closed `503` behavior when Redis
  is unavailable, while local/dev fallback remains bounded and intentional.
- 2026-04-22: full `SCALE` wave (`SCALE-01..SCALE-17`) is closed, including
  exchange-access convergence, web container seam extraction, and closure
  evidence handoff for future agents.
- 2026-04-02: Coolify on VPS with explicit stage and prod split remains the
  default deployment topology.
- 2026-04-03: phased brand migration from `CryptoSparrow` to `Soar` is real,
  but deployment and domain safety are allowed to progress independently.
- 2026-04-12: docs parity is a formal delivery requirement for module, route,
  and IA changes.
- 2026-04-17: Portuguese rollout is locked to `pt-PT`; `pt-BR` is not part of
  the current localization wave.
- 2026-04-19: dashboard manual-order advanced UX wave (`UXR-H`) is closed
  end-to-end and execution focus moved to deployment-readiness follow-up.
- 2026-04-19: dashboard forms consistency refresh is reopened as `UXR-I`
  planner-approved wave (post-`UXR-F` residual parity closure).
- 2026-04-19: dashboard tables consistency refresh (`UXR-J`) is closed
  end-to-end (`UXR-J-01..UXR-J-08`) with shared table-action/dropdown contract
  parity restored.
- 2026-04-19: dashboard runtime parity recovery wave (`DASHR-A..DASHR-C`) is
  closed end-to-end (`DASHR-01..DASHR-11`) with selected-bot
  positions/history/signals parity restored and explicit signal-blocked
  diagnostics in runtime execution path.
- 2026-04-20: market-universe symbol-contract parity wave (`MURC-01..MURC-12`)
  is closed end-to-end with one canonical resolver contract across markets
  sync, runtime, backtests, manual-order context, and web preview/validation.
- 2026-04-20: wallets list api-key status and paper reset safety wave
  (`WAPR-01..WAPR-10`) is closed end-to-end with row-only wallets list
  contract (`no Details`), deterministic inline API key state, and fail-closed
  non-destructive paper reset semantics (`paperResetAt` checkpoint baseline).
- 2026-04-20: dashboard Open Orders source-column wave (`OOSC-01..OOSC-08`)
  is closed end-to-end with `Source` labels (`Manual/Bot/Imported`), explicit
  manual-order write origin (`USER`), and unchanged active-only order
  visibility in `/dashboard` Open Orders.
- 2026-04-20: product target for manual and bot entries is clarified for the
  next execution wave: exchange-native unified lifecycle
  (`order -> fill -> position`) supersedes the previously locked
  `manual-order order-only` target for future implementation, while keeping
  strict selected-bot scope and wallet-scoped exchange takeover as canonical
  safety constraints.
- 2026-04-21: fill-price integrity is mandatory for `UOLF` transition to
  `position opened`; unresolved fill price must remain in waiting lifecycle
  state (no zero-entry synthetic position fallback).

## Technical Baseline
- Backend: Node.js 20+, Express API, Prisma, TypeScript
- Frontend: Next.js 15, React 19, TypeScript
- Mobile: none in current repository scope; responsive web and PWA-first
- Database: PostgreSQL
- Infra: Docker Compose locally, Coolify-targeted VPS deployment
- Hosting target: Coolify on VPS with stage and production environments
- Deployment shape: split `web`, `api`, worker services, `postgres`, and
  `redis`
- Runtime services: API service, web app, worker services for market-data,
  market-stream, backtest, and execution
- Background jobs / workers:
  - `market-data`
  - `market-stream`
  - `backtest`
  - `execution`
- Persistent storage: PostgreSQL and Redis
- Health / readiness checks:
  - `/health`
  - `/ready`
  - `/metrics`
  - `/workers/health`
- Environment files:
  - `apps/api/.env`
  - `apps/web/.env.local`
  - `.env.vps.example`
- Observability: runtime logs, metrics, SLO evidence artifacts, release and
  smoke packs under `docs/operations/`
- MCP / external tools: Playwright and Stitch-related UX docs available locally

## Validation Commands
- Lint: `pnpm run lint`
- Typecheck: `pnpm run typecheck`
- Unit tests: `pnpm --filter api run test -- --run` and
  `pnpm --filter web run test -- --run`
- Integration tests: targeted API or web Vitest packs by module
- E2E / smoke: `pnpm run test:go-live:smoke`
- Other high-risk checks:
  - `pnpm run quality:guardrails`
  - `pnpm i18n:audit:route-reachable:web`
  - `pnpm run build`

## Deployment Contract
- Primary deploy path: Coolify-managed VPS deployment with explicit stage and
  prod promotion flow
- Coolify app/service layout:
  - stage: `stage-web`, `stage-api`, worker services, `stage-postgres`,
    `stage-redis`
  - prod: `web`, `api`, worker services, `postgres`, `redis`
- Dockerfiles / compose paths:
  - `apps/api/Dockerfile`
  - `apps/web/Dockerfile`
  - `apps/api/Dockerfile.worker.market-data`
  - `apps/api/Dockerfile.worker.market-stream`
  - `apps/api/Dockerfile.worker.backtest`
  - `apps/api/Dockerfile.worker.execution`
  - `docker-compose.yml`
  - `docker-compose.vps.yml`
- Required secrets:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `API_KEY_ENCRYPTION_KEYS`
  - `API_KEY_ENCRYPTION_ACTIVE_VERSION`
  - exchange and optional CoinGecko credentials where in scope
- Public URLs / ports:
  - local web `http://localhost:3002`
  - local api `http://localhost:3001`
  - production web `https://soar.luckysparrow.ch`
  - production api `https://api.soar.luckysparrow.ch`
- Backup / restore expectation: follow the backup verification and restore-drill
  runbooks and evidence pack process under `docs/operations/`
- Rollback trigger and method: stage-gate or post-deploy failure triggers
  rollback according to `docs/operations/deployment-rollback-playbook.md`

## Current Focus
- Main active objective: preserve the now-clean post-approval V1 validation
  signal, keep canonical queue/context docs honest after the closed
  `V1SIG-A`, `V1CAP-A`, `V1IND-A`, `V1POSTBOT-A`, `V1SURF-B`, and `V1LIFE-A`
  waves, and derive the next engineering slice only from a fresh
  architecture-fit audit instead of stale queued follow-ups.
- Top blockers:
  - there is currently no active engineering task in the canonical short
    queue, so the next execution slice must be derived from a fresh audit of
    the remaining repo truth instead of reusing already closed `V1SIG` or
    `V1CAP` tasks.
  - local `test:go-live:smoke` remains workstation-blocked on this machine
    when Docker cannot bind `5432/6379` because another local stack is already
    occupying those ports.
  - final V1 production activation remains operator-blocked by prod evidence
    generation and named sign-off capture, not by an open engineering wave.
- Success criteria for this phase:
  - preserve green `web test`, `web typecheck`, and `quality:guardrails`
    on `main`,
  - keep canonical queue/context docs synchronized so future execution nudges
    do not revive already closed `V1SIG` / `V1CAP` slices,
  - derive any next implementation task from current architecture and planning
    truth instead of stale follow-up text,
  - keep high-signal auth/dashboard confidence suites free of false route/i18n
    noise,
  - keep the broader web pack free of avoidable `stderr` warning spill without
    loosening runtime or auth contracts,
  - keep queue/context/docs synchronized after each confidence-hardening slice.
- execution slices remain scope-locked and documentation-synchronized.
- Next queued follow-up:
  - `(none currently queued in canonical NOW/NEXT/READY states)`
  - next implementation work must be derived fresh from
    `docs/planning/mvp-execution-plan.md` plus current architecture/context
    truth.

## Autonomous Iteration State
- Current iteration: 17
- Current operation mode: BUILDER
- Last completed iteration: 17
- Last completed task: V1UI-17 dashboard open-position entry/quantity parity
- Next required mode: ARCHITECT
## Recent Progress
- 2026-04-22: queued `SAFEV1-A` in
  `history/plans/safev1-a-live-paper-runtime-safety-plan-2026-04-22.md` after
  a fresh V1 review confirmed four remaining safety gaps: reconciliation can
  still persist zero-entry open positions, live capital context can still fall
  back to unrelated recent API keys on the same exchange, external-position
  ownership is still heuristic under overlapping symbol coverage, and
  production limiter behavior can silently degrade into local-only mode.
- 2026-04-22: closed `SAFEV1-A1` by hardening
  `livePositionReconciliation.service.ts` so incomplete exchange snapshots no
  longer create or refresh open synced positions with `entryPrice <= 0`, and
  added regression coverage for the missing-entry-truth case.
- 2026-04-22: closed `SAFEV1-A2` by hardening
  `runtimeCapitalContext.service.ts` so live reference balance and DCA
  affordability no longer fall back to unrelated recent user API keys on the
  same exchange, and added regressions for bot-scoped missing-credential
  fail-closed behavior.
- 2026-04-22: closed `SAFEV1-A3` by hardening
  `runtimeExternalPositionOwner.service.ts` to return explicit
  `OWNED/AMBIGUOUS` ownership truth, prioritizing canonical market-group scope
  over legacy-only symbol bridges, and by making manual runtime close refuse
  ambiguous exchange-synced positions.
- 2026-04-22: closed `SAFEV1-A4` by hardening `middleware/rateLimit.ts` so
  production requests fail closed with explicit degraded-state signaling when
  Redis is unavailable, while local/test fallback remains intentional and
  reconnect attempts no longer depend on a full process restart.
- 2026-04-22: closed `SAFEV1-A` end-to-end by passing the focused runtime
  safety closure pack, publishing
  `history/plans/safev1-a-live-paper-runtime-safety-closure-2026-04-22.md`,
  and synchronizing queue/context state to the closed wave.
- 2026-04-22: completed a new post-`SAFEV1-A` production review and queued
  `REVIEW-D` in
  `history/plans/review-d-live-opt-in-and-ownership-safety-plan-2026-04-22.md`
  after confirming four remaining truth gaps: non-opted-in live bots still
  enter runtime topology, orphan bot-origin positions can still inherit manual
  env-default automation context, takeover rebind can still assign orphan
  bot-origin positions without canonical proof, and readiness still treats
  legacy API-key encryption fallback as production-ready key material. Audit
  evidence published in
  `history/audits/review-d-live-opt-in-and-ownership-safety-audit-2026-04-22.md`.
- 2026-04-22: closed `REVIEW-D1` by hardening
  `runtimeSignalLoop.repository.ts` and `runtimeSignalLoopDefaults.ts` so
  non-opted-in `LIVE` bots never enter runtime topology, and by hardening
  `runtimePositionAutomation.service.ts` so live positions owned by
  non-opted-in bots are skipped before any strategy lookup or execution-side
  automation is attempted.
- 2026-04-22: closed `REVIEW-D2` by hardening
  `runtimePositionAutomation.service.ts` so orphan `origin='BOT'` positions
  with no canonical `botId` are skipped before any manual env-default
  mode/exchange/market fallback can apply, and added focused regression
  coverage for that fail-closed automation path.
- 2026-04-22: closed `REVIEW-D3` by hardening
  `positions.service.ts` so takeover rebind no longer assigns orphan
  `origin='BOT'` positions from the currently eligible LIVE bot set; bot-origin
  orphan positions now stay unresolved without explicit canonical ownership
  proof, while exchange-synced api-key-based rebind remains deterministic.
- 2026-04-22: closed `REVIEW-D4` by hardening
  `criticalSecretsReadiness.ts` and `crypto.ts` so readiness and new
  encryption writes require canonical versioned keyring material, while legacy
  `API_KEY_ENCRYPTION` remains decrypt-only compatibility support. Closure
  evidence published in
  `history/plans/review-d-live-opt-in-and-ownership-safety-closure-2026-04-22.md`.
- 2026-04-22: queued `V1FACT-A` in
  `history/plans/v1-production-activation-and-evidence-plan-2026-04-22.md`
  and froze the permanent activation rules in
  `docs/architecture/reference/v1-production-activation-contract.md` so future
  execution can convert the now-hardened V1 codebase into a fresh,
  operator-reviewable production activation packet instead of another ad hoc
  review cycle.
- 2026-04-22: closed `V1FACT-A1` by publishing
  `history/audits/v1-production-activation-evidence-audit-2026-04-22.md`,
  classifying current activation inputs into fresh/stale/missing buckets, and
  advancing canonical execution focus to release-gate freshness semantics and
  fresh stage rehearsal evidence.
- 2026-04-22: closed `V1FACT-A2` by hardening
  `scripts/runV1ReleaseGate.mjs` with explicit freshness classification and
  environment-scoped readiness semantics, adding canonical
  `ops:release:v1:stage-rehearsal`, fixing deploy smoke to keep API/web target
  URLs explicit, and publishing fresh stage artifacts
  (`v1-release-gate-stage-2026-04-22T17-53-09-987Z.md`,
  `v1-stage-rehearsal-2026-04-22T17-53-09-987Z.md`) with dry-run blockers kept
  explicit.
- 2026-04-22: closed `RELEASE-HARDEN-A` by adding the canonical release gate
  script `scripts/runV1ReleaseGate.mjs`, exposing `pnpm run ops:release:v1:gate`,
  publishing `docs/operations/v1-release-gate-runbook.md`, and aligning V1
  release/smoke docs to the same operator entrypoint.
- 2026-04-22: closed `REVIEW-C` end-to-end by deriving completed DCA replay
  state from canonical persisted position truth, normalizing authenticated
  exchange snapshot failures through one explicit operator error contract, and
  replacing synthetic stale-order cancelation with explicit unresolved
  reconciliation truth. Closure evidence published in
  `history/plans/review-c-runtime-state-and-reconciliation-closure-2026-04-22.md`.
- 2026-04-22: completed a new post-`REVIEW-B` runtime/exchange audit and
  queued `REVIEW-C` in
  `history/plans/review-c-runtime-state-and-reconciliation-closure-plan-2026-04-22.md`
  after confirming three remaining production truth gaps: completed DCA dedupe
  replay can still restore runtime state from synthetic math, exchange
  snapshot fetch failures are not guaranteed to normalize through the explicit
  operator error contract, and live reconciliation still treats disappearance
  from exchange open-orders as synthetic `CANCELED`. Audit evidence published
  in
  `history/audits/review-c-runtime-state-and-reconciliation-audit-2026-04-22.md`.
- 2026-04-22: closed `REVIEW-B` end-to-end by moving runtime DCA/add-leg
  execution onto canonical fill-result lifecycle, making submitted dedupe
  non-terminal until linked order truth is known, making generic exchange
  snapshots fail closed when multiple supported API keys exist unless
  `apiKeyId` is explicit, narrowing watchdog symbol selection to explicit
  Binance-futures scope, and publishing closure evidence in
  `history/plans/review-b-runtime-exchange-production-closure-2026-04-22.md`.
- 2026-04-22: completed a post-`XLIFE-A` runtime/exchange audit and published
  `history/audits/review-b-runtime-exchange-production-audit-2026-04-22.md`,
  then queued `REVIEW-B` in
  `history/evidence/review-b-runtime-exchange-production-readiness-plan-2026-04-22.md`
  to close the remaining risks around DCA canonical fill truth,
  submitted-dedupe non-terminality, ambiguous exchange snapshot ownership, and
  watchdog scope drift.
- 2026-04-22: closed `XLIFE-A` end-to-end by making LIVE close flow
  fail-closed until canonical fill truth exists, switching runtime trade and
  realized-PnL persistence to canonical fill price/quantity, persisting
  runtime-origin orders with `origin=BOT` so bot-opened positions retain bot
  ownership through the canonical order-fill-position lifecycle, keeping
  runtime automation alive during submitted close state, and publishing
  closure evidence in
  `history/audits/execution-lifecycle-parity-and-exchange-truth-closure-2026-04-22.md`.
- 2026-04-22: queued `XLIFE-A` in
  `history/audits/execution-lifecycle-parity-and-exchange-truth-plan-2026-04-22.md`
  and froze the permanent lifecycle rules in
  `docs/architecture/reference/execution-lifecycle-parity-contract.md` so
  future execution work is forced through one shared `order -> fill ->
  position` truth model for `PAPER` and `LIVE`, with explicit prohibition on
  local close-before-fill and on mark-price-based execution accounting.
- 2026-04-22: closed `TRUTH-A` end-to-end by removing LIVE order fallback to
  unrelated recent API keys, requiring canonical bot/wallet-bound key
  ownership for LIVE execution, adding explicit authenticated exchange-read
  support truth with fail-closed unsupported operations and truthful `source`
  derivation, fixing wallet preview double-decrypt drift, hardening
  runtime/dashboard guardrails to catch JSX prop literals and nullish fallback
  strings, migrating shared UI defaults (`ConfirmModal`, `DataTable`,
  `SearchableMultiSelect`) to canonical `public.sharedUi.*` copy, and
  publishing closure evidence in
  `history/plans/truth-a-live-safety-and-contract-truth-closure-2026-04-22.md`.
- 2026-04-22: queued `TRUTH-A` as the next structural hardening wave after
  `SCALE`, publishing
  `history/plans/truth-a-live-safety-and-contract-truth-plan-2026-04-22.md`
  and freezing permanent remediation rules in
  `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
  so future agents can execute the remaining review findings through one
  self-sufficient task packet family instead of rediscovering intent from
  scattered audit notes.
- 2026-04-22: closed `SCALE-16` + `SCALE-17`, finishing the full `SCALE`
  group. Executed focused dashboard/backtests seam regression pack
  (`31/31 PASS`) with `quality:guardrails`, `web build`, and `web typecheck`
  all green; published closure evidence in
  `history/evidence/scale-cd-closure-evidence-2026-04-22.md`; synchronized
  queue/context/planning docs and froze future-agent coding rules in
  `docs/architecture/reference/web-container-split-contract.md`.
- 2026-04-22: closed `SCALE-15` by extracting trades analytics from
  `BacktestRunDetails` into `useBacktestTradesAnalytics` (daily performance,
  timeline DCA linkage, trades rows, insights) and moving tab rendering
  ownership into `BacktestRunDetailsTabPanels` for `summary/markets/trades/raw`
  while keeping the route component as composition-only shell; focused backtest
  tests + `web typecheck` + `web build` passed.
- 2026-04-22: closed `SCALE-14` by extracting backtest timeline orchestration
  (chunk loading, cursor/cached merge, in-flight request locking, and
  parity-failed symbol handling) into `useBacktestTimelineOrchestration`,
  leaving `BacktestRunDetails` with tab composition and presenter wiring; `web
  typecheck`, focused backtest tests, and `web build` passed.
- 2026-04-22: closed `SCALE-13` by extracting runtime table presenter ownership
  (`runtimeDataTablePresenters.tsx`) and selected-bot sidebar presenter
  assembly (`runtimeSidebarPresenters.ts`) out of `HomeLiveWidgets`, keeping
  the container composition-focused; focused dashboard tests + `web typecheck`
  + `web build` passed.
- 2026-04-22: closed `SCALE-11` + `SCALE-12` by freezing one explicit web
  container split contract in
  `docs/architecture/reference/web-container-split-contract.md` and extracting
  manual-order controller ownership from `HomeLiveWidgets` into
  `useManualOrderController`; focused dashboard tests, `web typecheck`, and
  `web build` passed.
- 2026-04-22: closed `SCALE-B` (`SCALE-06..SCALE-10`) by auditing and removing
  duplicate API exchange/bootstrap paths, introducing canonical exchange
  boundaries (`exchangePublicRead.service.ts`,
  `exchangeAuthenticatedRead.service.ts`,
  `exchangeMetadataContract.service.ts`), rewiring symbol-rules/manual-context,
  positions snapshots, and wallet metadata/balance preview to those boundaries,
  and passing focused exchange regression + `api typecheck` + `api build` +
  `quality:guardrails`; evidence in
  `history/audits/scale-b-exchange-access-audit-2026-04-22.md`.
- 2026-04-22: closed `SCALE-A` (`SCALE-01..SCALE-05`) by finishing
  guardrail-truth audit and cleanup (`scripts/repoGuardrails.mjs` now keeps
  only active exceptions), refreshing the maintainability inventory with
  current hotspot line counts and historical closure notes, and freezing one
  canonical exchange access ownership matrix in
  `docs/architecture/reference/exchange-access-ownership-matrix.md` (linked
  from architecture/module docs). Canonical queue/context is now advanced to
  `SCALE-06..SCALE-10`.
- 2026-04-22: queued `SCALE-A` in
  `history/plans/scalability-anti-drift-foundation-plan-2026-04-22.md` and
  froze the permanent delivery rules in
  `docs/architecture/reference/scalability-anti-drift-delivery-contract.md` so
  future maintainability work is organized into self-sufficient task packets
  with explicit ownership, validations, and docs-sync outputs.
- 2026-04-21: queued `L10NQ-E` as the post-`CQLT` residual i18n cleanup wave
  in `history/plans/l10nq-e-residual-route-reachable-i18n-closure-plan-2026-04-21.md`,
  using the latest route-reachable audit baseline (`filesWithFindings=35`,
  `localCopy=28`, `fallbackPl=4`, `hardcodedUiCandidates=6`) and explicitly
  splitting upcoming work into audit-trust hardening, residual public/profile/
  backtests/shared migrations, and closure validation.
- 2026-04-21: closed `L10NQ-E` end-to-end by hardening route-reachable audit
  scoring to exclude translation infrastructure noise, migrating residual
  public/profile/wallets/markets/backtests/shared UI copy to canonical
  namespaces, replacing local backtest detail dictionaries with
  `dashboard.backtests.details.*` ownership, and passing closure gates with a
  final zero-debt audit result (`findings=0`, `localCopy=0`, `fallbackPl=0`,
  `hardcoded=0`).
- 2026-04-21: closed `CQLT-11` by adding canonical `dashboard.shared.*`
  translation keys, moving `AuthContext` logout/session-expired toasts to
  i18n-aware resolution through `useOptionalI18n`, and switching `handleError`
  to a shared translation-backed fallback with explicit caller override
  support.
- 2026-04-21: closed `CQLT-12..CQLT-14` by migrating profile, strategies, and
  wallet-form locale dictionaries into canonical `dashboard-shell`,
  `dashboard-strategies`, and `dashboard-wallets` namespaces, then removing the
  corresponding temporary copy/hardcoded-literal allowlist entries from
  `scripts/repoGuardrails.mjs` while keeping `quality:guardrails` green.
- 2026-04-21: split the blocked `CQLT-15` umbrella into `CQLT-15A..C` so the
  canonical queue now matches the real dependency order for target
  architecture: restore route-audit runtime first, add focused migrated-route
  i18n regression locks second, and only then run the route-reachable closure
  audit plus docs/context sync.
- 2026-04-21: closed `CQLT-15A..C` by restoring local workspace dependencies,
  adding focused i18n smoke/guardrail coverage for migrated
  profile/strategies/wallets routes, generating the route-reachable audit
  artifact under `docs/operations/`, and returning `web build`,
  `web typecheck`, and `quality:guardrails` to green for the CQLT-C slice.
- 2026-04-21: closed `CQLT-B` (`CQLT-06..CQLT-10`) by extending
- 2026-04-21: closed `CQLT-25..CQLT-29` by extracting orders manual-context /
  quantity-rule / lifecycle seams, bot wallet-context and strategy-drift
  helpers, backtest range + report-lifecycle helpers, centralizing
  exchange-connector bootstrap for orders, and adding focused non-DB API seam
  regressions while keeping `api build` and `quality:guardrails` green.
- 2026-04-21: closed `CQLT-30..CQLT-32` and `CQLT-34` by publishing fallback
  classification plus legacy-bridge freeze, removing hidden bot-update wallet
  fallback, and synchronizing canonical queue/context/planning docs to the
  post-API-decomposition state.
- 2026-04-21: `CQLT-33` is the remaining blocker for full CQLT closure in this
  workspace because Docker Desktop engine is unavailable and local Postgres
  could not be started for DB-backed API e2e suites.
- 2026-04-21: closed `CQLT-33` and therefore the full `CQLT` wave by running
  sequential DB-backed API closure suites for `orders`, `backtests`, and
  `bots`, then passing repository-wide `build`, `typecheck`,
  `quality:guardrails`, and refreshed route-reachable i18n audit; closure
  evidence was published in
  `history/plans/code-quality-maintainability-closure-2026-04-21.md`.
- 2026-04-21: closed `CQLT-B` (`CQLT-06..CQLT-10`) by extending
  `scripts/repoGuardrails.mjs` to block new production-local copy dictionaries,
  raw user-facing hardcoded UI literals, and non-allowlisted `1000`+ line
  monoliths; published the active exception policy in
  `docs/governance/code-quality-guardrails.md`; and added the
  duplicate-helper snapshot artifact
  `history/artifacts/_artifacts-cqlt-duplicate-helper-snapshot-2026-04-21.json`.
  - 2026-04-21: closed `CQLT-16` by extracting a canonical shared DCA ladder
    renderer in `apps/web/src/features/shared/dcaLadderCell.tsx`, rewiring
    dashboard home and bots monitoring to the same helper, adding focused
    regression coverage, and hardening `repoGuardrails` to tolerate
    tracked-but-deleted files during staged helper moves.
  - 2026-04-21: closed `CQLT-17` by extracting shared runtime monitoring
    formatters in `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`,
    rewiring dashboard and bots views to one compact-age plus
    session/side/lifecycle tone contract, and adding focused unit coverage for
    the extracted seam.
  - 2026-04-21: closed `CQLT-18` by adding shared async view-state helper
    `runAsyncWithViewState` in `apps/web/src/lib/async.ts`, rewiring scoped
    profile/strategies/wallet loads to the same `loading + error + retry`
    contract, extending async helper tests, and replacing API keys hard reload
    retry with local refresh.
  - 2026-04-21: closed `CQLT-19` by extending selected-bot dashboard vs preview
    parity tests with DCA ladder and runtime trade-label assertions, and by
    aligning bots preview DCA formatting with dashboard locale-aware rendering
    so the shared-helper extraction wave remains behaviorally consistent.
  - 2026-04-21: closed `CQLT-20` by extracting runtime input parsing,
    direction/action/reason pill helpers, and position-edit draft typing from
    `HomeLiveWidgets.tsx` into
    `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx`,
    reducing the dashboard container toward controller-owned orchestration
    without changing rendered behavior; focused dashboard-home regression
    suites, `web build`, and `quality:guardrails` stayed green for the slice.
  - 2026-04-21: closed `CQLT-21` by extracting deterministic backtest detail
    view-model helpers into
    `apps/web/src/features/backtest/utils/backtestRunDetailsViewModel.ts`,
    moving summary/timeline chart rendering into
    `apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx`,
    reducing `BacktestRunDetails.tsx` from 2037 to 1137 lines, and keeping
    focused backtests tests, `web build`, and `quality:guardrails` green.
  - 2026-04-21: closed `CQLT-22` by extracting `BotsAssistantTab` plus
    monitoring presentational sections into dedicated components under
    `apps/web/src/features/bots/components/` and `bots-management/`,
    reducing `BotsManagement.tsx` from 1093 to 826 lines and
    `BotsMonitoringTab.tsx` from 1078 to 890 lines while keeping focused bots
    tests, `web build`, and `quality:guardrails` green.
  - 2026-04-21: cleared the active web warning baseline before the remaining
    `CQLT` slices by fixing all current `react-hooks/exhaustive-deps` warnings
    in `AuthContext`, profile API-key/subscription surfaces, and
    `WalletCreateEditForm`; `pnpm --filter web run build` is warning-free
    again.
  - 2026-04-21: closed `CQLT-23` by extracting wallet form state helpers,
    metadata/preview/reset action helpers, and dedicated presentational
    sections under
    `apps/web/src/features/wallets/components/wallet-create-edit-form/`,
    reducing `WalletCreateEditForm.tsx` from 791 to 483 lines while keeping
    focused wallet create/edit/reset regressions green.
  - 2026-04-21: closed `CQLT-24` by running the focused decomposition
    regression pack across dashboard, preview parity, backtests, bots, and
    wallets (`46/46 PASS`) while `quality:guardrails` and `web build`
    remained green.
- 2026-04-21: closed `CQLT-A` (`CQLT-01..CQLT-05`) by publishing the active
  maintainability remediation contract in
  `docs/architecture/reference/maintainability-remediation-contract.md`,
  recording concrete web/API/monolith inventories in
  `history/audits/code-quality-maintainability-inventory-2026-04-21.md`, and
  freezing extraction-order ownership rules in the active CQLT plan before
  refactor work.
- 2026-04-21: closed `ARCCON` (`ARCCON-01..ARCCON-12`) end-to-end by removing
  hidden manual-order strategy fallback, enforcing wallet + market-universe
  precedence over duplicated bot venue fields, formalizing explicit worker
  ownership mode (`inline|worker`) for backtest/market-data in worker bootstrap
  and `/workers/health|ready`, hardening backtest report contract to explicit
  `runLifecycle` pending/degraded semantics, and removing `/dashboard/bots`
  namespace leakage into `dashboard.home.*`; closure validations PASS
  (`api focused tests`, `web focused bots tests`, `api/web typecheck`,
  `api/web build`, `quality:guardrails`).
- 2026-04-21: completed a repository-wide maintainability audit focused on
  hardcoded copy, oversized production modules, duplicated helpers, fallback
  drift, spread exchange bootstrap ownership, and recurring async boilerplate;
  queued `CQLT` (`CQLT-01..CQLT-34`) in
  `history/plans/code-quality-maintainability-remediation-plan-2026-04-21.md`
  so future cleanup starts with inventory + guardrails and only then moves
  into i18n extraction, shared-helper consolidation, monolith decomposition,
  and fallback/legacy hardening.
- 2026-04-21: completed a full architecture-vs-code audit across docs, Prisma
  model, API, workers, and web operator surfaces; queued `ARCCON`
  (`ARCCON-01..ARCCON-12`) in
  `history/plans/architecture-conformance-remediation-plan-2026-04-21.md` to
  close only confirmed drift: hidden manual-order strategy fallback, duplicated
  bot context ownership, live legacy `BotStrategy` compatibility paths,
  split-worker ownership mismatch for backtest/market-data, async backtest
  report contract ambiguity, and `/dashboard/bots` i18n namespace leakage.
- 2026-04-21: completed second-pass architecture cleanup by reducing
  `docs/architecture/` top-level to only the numbered canonical core plus
  `reference/` and `archive/`, moving active supporting contracts to
  `docs/architecture/reference/`, moving superseded/compatibility files to
  `docs/architecture/archive/`, updating repo-wide links and agent canonical
  doc entrypoints to the new structure, and deleting the local untracked
  `.tmp/` audit artifact folder.
- 2026-04-21: rebuilt the architecture documentation set into a numbered
  canonical reading order under `docs/architecture/`
  (`01_overview-and-principles` through
  `12_documentation-governance`), converted `system-architecture`,
  `database`, `trading-logic`, and `tech-stack` into compatibility stubs,
  normalized docs indexes to the new structure, slimmed
  `docs/planning/open-decisions.md` to unresolved-only usage, aligned product
  tier terminology to the canonical `FREE/ADVANCED/PROFESSIONAL` catalog, and
  archived non-canonical architecture closure/remediation snapshots under
  `docs/architecture/archive/`; agent-facing documentation workflow rules were
  also added under `.agents/workflows/documentation-governance.md` and wired
  into `.codex/agents/*` plus `.agents/prompts/product-docs.md`.
- 2026-04-21: closed `UOLF-HF-01` hotfix by enforcing positive fill-price
  integrity in order-fill-position lifecycle (no `entryPrice=0` position-open
  path), propagating runtime `markPrice` through MARKET open commands
  (`executionOrchestrator`, `runtimePositionAutomation`), adding dashboard
  manual-order MARKET price fallback to reference price, and validating with
  focused API/web tests + deploy gates (`api/web typecheck`, `api/web build`,
  `quality:guardrails`).
- 2026-04-20: completed `PLNC-D` parity sync by reconciling stale closed-wave
  drift in `docs/planning/mvp-execution-plan.md`; phases `DAWR`, `OOSC`,
  `BTCF`, and `UOLF` are now explicitly marked `Closed`, and
  `UOLF-02..UOLF-15` checkboxes are aligned with canonical closure state
  already present in queue/context docs.
- 2026-04-20: closed full `WAPR` wave (`WAPR-02..WAPR-10`) by implementing
  row-only wallets list UI (`no Details`) with deterministic inline `API key`
  state (`Connected`/`Not connected`), dedicated fail-closed
  `POST /dashboard/wallets/:id/reset-paper`, reset-aware paper-capital
  baseline via wallet checkpoint (`paperResetAt`), and paper-only wallet-edit
  reset action with deterministic loading/error/success UX; closure pack PASS
  (`pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts`,
  `pnpm --filter web run test -- --run src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx`,
  `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`,
  `pnpm run quality:guardrails`).
- 2026-04-20: completed `WAPR-01` by freezing canonical wallet-list + paper-reset safety contract in `open-decisions` and wallet module docs (`api-wallets`, `web-wallets`): list now has explicit `no Details` + inline `API key` column order/mapping contract, and paper reset is locked as dedicated fail-closed non-destructive command baseline (`POST /dashboard/wallets/:id/reset-paper`) with reset-checkpoint capital semantics.
- 2026-04-20: closed `UOLF` wave (`UOLF-02..UOLF-15`) end-to-end by shipping
  selected-bot manual-order scope regressions, canonical bot-context authority
  for order-open, shared order-fill-position lifecycle handling across
  runtime/manual paths, waiting-fill runtime semantics, dashboard lifecycle copy
  parity, and passing closure pack (`api UOLF matrix`, `HomeLiveWidgets +
  preview parity`, `api/web typecheck`, `build`, `quality:guardrails`,
  `test:go-live:smoke`).
- 2026-04-20: queued wallets list + paper reset safety wave (`WAPR-01..WAPR-10`)
  and published executor-ready plan
  `history/plans/wallets-list-paper-reset-safety-plan-2026-04-20.md`; queue
  adds wallet-list simplification (`remove Details`, inline `API key`
  connected-state column) plus dedicated non-destructive `PAPER` wallet reset
  with reset-aware capital baseline, fail-closed guards, and focused API/web
  validation requirements.
- 2026-04-20: completed `UOLF-01` by freezing unified lifecycle contract in
  canonical docs (`open-decisions`, `api-orders`, `api-bots`,
  `web-dashboard-home`), superseding `SOPR-C order-only` wording with one
  target lifecycle (`order -> fill -> position`) for manual and runtime
  entries, strict selected-bot scope, and wallet-scoped exchange takeover
  ownership expectations before implementation steps.
- 2026-04-20: queued unified order lifecycle and exchange-sync parity wave
  (`UOLF-01..UOLF-15`) and published executor-ready plan
  `history/plans/unified-order-lifecycle-and-exchange-sync-plan-2026-04-20.md`;
  queue promotes the clarified product target that manual dashboard orders and
  bot runtime signals must both follow one exchange-native lifecycle
  (`order -> fill -> position`), with `LIVE` fill authority delegated to the
  exchange and `PAPER` fill authority delegated to internal paper execution.
- 2026-04-20: closed full `BTCF` wave (`BTCF-02..BTCF-12`) end-to-end by
  delivering API list enrich contract (`strategyName`, `markets`,
  `initialBalance`), canonical web runs table columns, create-form explicit
  range controls with deterministic sync + slider bounds `250..10000`, API
  DTO + service/job/gateway explicit range flow (`startAt/endAt`) with
  backward-compatible fallback for legacy runs, docs/i18n parity sync, and
  closure validation pack (`api/web backtests tests`, `api/web typecheck`,
  `api/web build`, `quality:guardrails`, `i18n:audit:route-reachable:web`).
- 2026-04-20: completed `BTCF-01` by freezing canonical backtests
  list/create contract in `open-decisions` and module docs
  (`web-backtest`, `api-backtests`) with exact list columns
  (`Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`),
  explicit `startAt/endAt` range semantics, slider bounds (`250..10000`), and
  backward compatibility requirement for historical runs.
- 2026-04-20: queued backtests list/create time-window remediation wave
  (`BTCF-01..BTCF-12`) from module analysis and published executor-ready plan
  `history/plans/backtests-list-create-time-window-remediation-plan-2026-04-20.md`;
  queue promoted to active `NOW/NEXT/PIPELINE`.
- 2026-04-20: closed `PLNC-C` planning parity sweep (`PLNC-06..PLNC-08`) by
  synchronizing stale closed-wave statuses across planning plans (`UXR-I`,
  `DAGG`, `SBSC`, `UXR`, `POS`, `PLNC`, `V1/LBT`), aligning
  `mvp-execution-plan` phase headers to closed state, and updating
  `planning-catalog-index` classifications to current canonical closure.
- 2026-04-20: closed full `OOSC` wave (`OOSC-01..OOSC-08`) by shipping API
  origin plumbing (`origin=USER` write path + runtime open-order origin
  projection), dashboard Open Orders `Source` column with `Manual/Bot/Imported`
  mapping + `en/pl/pt` i18n coverage, and closure validation
  (`orders-positions.e2e`, `bots.monitoring-aggregate.e2e`,
  `HomeLiveWidgets.test`, `HomeLiveWidgets.open-orders-source.test`,
  `api/web typecheck`, `quality:guardrails`).
- 2026-04-20: closed `OOSC-01` by freezing canonical Open Orders `Source`
  mapping (`USER/BOT/EXCHANGE_SYNC/BACKTEST` -> `Manual/Bot/Imported`),
  explicit manual-order write-origin requirement (`origin=USER`), and unchanged
  active-only status scope (`PENDING`, `OPEN`, `PARTIALLY_FILLED`) in
  `open-decisions`, `api-orders`, and `web-dashboard-home`.
- 2026-04-20: queued executor-ready dashboard Open Orders source-column wave
  (`OOSC-01..OOSC-08`) and published plan
  `history/plans/dashboard-open-orders-source-column-plan-2026-04-20.md`;
  canonical queue/context updated in `mvp-next-commits` and `TASK_BOARD`.
- 2026-04-20: implemented wallet-scoped external-position takeover contract for
  LIVE bots by adding `Wallet.manageExternalPositions` (with migration backfill
  from legacy `ApiKey.manageExternalPositions`), updating runtime exchange
  reconciliation to resolve takeover ownership from wallet-bound bot context
  first (legacy fallback preserved), and extending wallet web form/contracts so
  operators can enable takeover where API key + execution context actually
  lives.
- 2026-04-20: fixed production deploy blocker for web image build by removing
  explicit-`any` lint violations in dashboard regression tests
  (`HomeLiveWidgets.aggregate-wallet.test.tsx`,
  `RuntimeSidebarSection.test.tsx`); local `pnpm --filter web run build` is
  PASS after fix.
- 2026-04-20: closed planning parity sync `PLNC-05` by reconciling stale
  unchecked `DASHR-01..DASHR-11` entries in
  `docs/planning/mvp-execution-plan.md` with already-closed canonical queue
  state (`mvp-next-commits`, `TASK_BOARD`); `DASHR` phase is now explicitly
  marked closed with completion log entries.
- 2026-04-20: closed `DAWR-B` and `DAWR-C` (`DAWR-04..DAWR-10`) end-to-end by
  adding aggregate-success LIVE wallet regression lock in
  `HomeLiveWidgets.aggregate-wallet.test.tsx`, adding dedicated sidebar `strategyId`
  null/mismatch edge regressions in `RuntimeSidebarSection.test.tsx`, tightening
  sidebar canonical-first fallback behavior, documenting strategy-drift
  audit/repair triage in ops/module docs, synchronizing canonical planning
  files, and completing closure pack (`api aggregate e2e`, targeted web tests,
  `api/web typecheck`, `quality:guardrails`).
- 2026-04-20: closed `DAWR-A` (`DAWR-01..DAWR-03`) by freezing aggregate
  wallet-summary/sidebar edge contract in canonical docs, adding aggregate API
  regression coverage for `positions.summary.referenceBalance/freeCash`, and
  extending aggregate projection with parity fields from latest session capital
  context (`null` in unresolved empty aggregate path); validation PASS:
  `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`,
  `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- 2026-04-20: queued dashboard aggregate wallet/strategy regression wave
  (`DAWR-01..DAWR-10`) from post-MURC analyzer report and published
  executor-ready plan
  `history/plans/dashboard-aggregate-wallet-strategy-regression-plan-2026-04-20.md`;
  queue promoted to active `NOW/NEXT/PIPELINE`.
- 2026-04-20: closed full `MURC` wave (`MURC-01..MURC-12`) end-to-end by
  introducing shared API symbol resolver contract
  (`final = unique(filter_result U whitelist) - blacklist`) and wiring markets
  sync, bot auto-group creation, runtime, backtests, and manual-order context
  to one parity path; aligned web markets preview/validation to accept valid
  empty sets and added regressions (API + web + cross-module parity smoke);
  completed closure pack (`pnpm --filter api run test -- --run`,
  `pnpm --filter web run test -- --run`, `pnpm --filter api run typecheck`,
  `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`).
- 2026-04-19: closed full `SOPR` wave (`SOPR-01..SOPR-12`) end-to-end by
  hardening selected-bot signal context source tags, locking
  `/dashboard` vs `/dashboard/bots/:id/preview` parity regressions for
  signals/positions/history, publishing SOPR parity evidence matrix, closing
  manual-order semantics as explicit `order-only` contract with audit-safe
  metadata, and completing closure validation pack (`api/web full tests`,
  `typecheck`, `lint`, `build`, `guardrails`, `route-reachable i18n audit`).
- 2026-04-19: hardened API e2e teardown stability for full-suite execution by
  adding deterministic cleanup order for `runtimeExecutionDedupe` and
  `botRuntime*` tables in affected suites (`auth`, `profile/basic`,
  `preTrade`, `market-stream`, `positions-live-status`) after recurring FK
  teardown collisions.
- 2026-04-19: closed `SOPR-01` by publishing consolidated selected-bot
  signals/open-runtime parity contract across canonical docs
  (`open-decisions`, `web-dashboard-home`, `api-bots`, `api-orders`), locking
  `DAGG`+`SBSC` prerequisites, latest-signal-first strategy precedence with
  explicit source-tag fallback semantics, no-open diagnostics visibility, and
  manual-order semantic baseline before `SOPR-09`.
- 2026-04-19: queued market-universe symbol-contract parity wave
  (`MURC-01..MURC-12`) from analyzer report and published executor-ready plan
  `history/audits/market-universe-symbol-contract-parity-plan-2026-04-19.md`;
  queue is intentionally placed after active `SOPR` to avoid disrupting
  current execution.
- 2026-04-19: closed full `SBSC` wave (`SBSC-01..SBSC-08`) end-to-end by
  freezing sidebar strategy source-of-truth contract, adding list/get vs
  runtime-graph parity regressions, making bot strategy projection
  canonical-first, adding deterministic drift audit + safe idempotent repair
  endpoints, extending web switch regression for `Market + Strategy` parity,
  and completing focused closure validation pack (`api bots.e2e +
  bots.runtime-scope.e2e`, `web HomeLiveWidgets`, `api/web typecheck`) with
  canonical queue/context synchronization.
- 2026-04-19: closed `DAGG-C` (`DAGG-09..DAGG-10`) end-to-end by adding
  explicit cross-route selected-bot parity regression
  (`HomeLiveWidgets.preview-parity.test.tsx`) and completing focused closure
  validation pack (`api aggregate e2e`, `web aggregate parity tests`,
  `api/web typecheck`, `web build`, `quality:guardrails`).
- 2026-04-19: completed `DAGG-09` by adding explicit cross-route web parity
  regression (`HomeLiveWidgets.preview-parity.test.tsx`) that validates
  selected-bot aggregate history/trade consistency between `/dashboard`
  (`HomeLiveWidgets`) and `/dashboard/bots/:id/preview` (`BotsManagement`
  monitoring route), including no cross-bot leakage assertions.
- 2026-04-19: closed `DAGG-A` and `DAGG-B` (`DAGG-01..DAGG-08`) by enforcing
  aggregate-first selected-bot dashboard runtime loading, aligning runtime
  view-model derivation to aggregate payload, adding dashboard history
  closed-positions table with selected-bot re-scope regressions, and hardening
  aggregate API determinism with mixed-session e2e coverage.
- 2026-04-19: queued signals/open-runtime parity wave (`SOPR-01..SOPR-12`)
  from analyst findings and published executor-ready plan
  `history/audits/signals-open-runtime-parity-plan-2026-04-19.md`; queue is
  dependency-locked behind `DAGG` then `SBSC`.
- 2026-04-19: queued sidebar strategy source-of-truth parity wave
  (`SBSC-01..SBSC-08`) from production/API analysis (`listBots.strategyId`
  projection drift vs `runtime-graph` primary strategy) and published executor
  plan `history/plans/dashboard-sidebar-strategy-contract-plan-2026-04-19.md`.
- 2026-04-19: queued `DAGG` aggregate-view parity wave (`DAGG-01..DAGG-10`)
  from production discrepancy analysis and published executor-ready plan
  `history/plans/dashboard-aggregate-selected-bot-view-plan-2026-04-19.md`;
  canonical queue/context updated to reflect aggregate-by-selected-bot product
  decision for dashboard tables.
- 2026-04-19: closed `DASHR-B` and `DASHR-C` end-to-end (`DASHR-05..DASHR-11`)
  by delivering selected-session history parity guards (api+web), strict
  selected-bot signal-scope regressions/fixes, explicit runtime
  `PRETRADE_BLOCKED` diagnostics for ignored condition-met flow, and full
  focused closure validation (`bots.e2e`, `bots.runtime-scope.e2e`,
  `runtimeSignalDecisionEngine`, `orders.service`, `runtime-history-parity`,
  `runtimeFinalCandleDecision`, `HomeLiveWidgets`, api/web typecheck, web
  build, guardrails).
- 2026-04-19: queued dashboard runtime data parity recovery wave (`DASHR-01..11`)
  from new operator report and published executor-ready plan
  `history/audits/dashboard-runtime-data-parity-recovery-plan-2026-04-19.md`;
  synchronized `mvp-next-commits`, `mvp-execution-plan`, and `TASK_BOARD`
  with strict scope lock for `/dashboard` runtime fixes only.
- 2026-04-19: closed `UXR-J` (`UXR-J-03..UXR-J-08`) end-to-end by removing
  columns-dropdown auto-close on checkbox toggles, enforcing icon-only columns
  trigger default with preserved a11y labels, adding shared DataTable/TableUi
  regression locks, aligning consuming table assertions in bots/backtests, and
  completing closure validation pack (`25/25 PASS`, `web typecheck PASS`,
  `web build PASS`) with canonical queue/context synchronization.
- 2026-04-19: RC external-gates and release-candidate closure were finalized
  from VPS private-route production pipeline evidence: stage domains are live
  (`stage.soar.luckysparrow.ch`, `stage-api.soar.luckysparrow.ch`), all RC
  gate checks passed, and final snapshot is `G1=PASS`, `G2=PASS`, `G3=PASS`,
  `G4=PASS` (`2026-04-19T15:13:58.943Z`).
- 2026-04-19: completed `UXR-J-02` by adding dedicated `module` action tone
  in shared `TableUi` and remapping `runtime` plus `preview` presets to the
  same module tone while preserving `clone` as neutral (distinct from system
  `edit`/`delete` tones).
- 2026-04-19: completed `UXR-J-01` by freezing shared table-system consistency
  contract across canonical docs (`open-decisions`, `web-dashboard-home`,
  `web-bots`) with explicit action-tone semantics, columns dropdown persistence
  behavior, and icon-only columns-trigger accessibility rules.
- 2026-04-19: completed `UXR-I-14` closure by running required PASS pack
  (`pnpm --filter web run typecheck`, `pnpm --filter web run build`,
  `pnpm run quality:guardrails`) and synchronizing canonical queue/context;
  `UXR-I` dashboard forms consistency wave is now fully closed.
- 2026-04-19: completed `UXR-I-13` by running focused regression suite for
  dashboard forms consistency wave (`33/33 PASS`) across wallets/markets/
  backtests/bots form modules, wallet and bot create/edit wrappers, and i18n
  namespace/translation registry checks.
- 2026-04-19: completed `UXR-I-12` by applying shared
  `FormMobileActionBar` contract to remaining long dashboard form wrappers
  (`strategies` create/edit and `backtests` create), and aligning page-title
  save actions to desktop-only visibility to keep one sticky mobile save path.
- 2026-04-19: completed `UXR-I-11` by introducing shared
  `ui/forms/validationFeedback` helpers (`toValidationSummaryErrors`,
  `focusFirstInvalidField`) and migrating scoped forms (`wallets`, `markets`,
  `backtests`, `strategies`, `bots`) to one first-invalid focus/scroll and
  validation summary/inline sync contract; added focused helper unit
  regression coverage.
- 2026-04-19: completed `UXR-I-10` by refactoring `BotCreateEditForm` from a
  dense single-card layout into clearer two-column section cards (`setup`,
  `market`, `strategy`) with shared `ui/forms` primitives, preserving domain
  safeguards (`wallet context match`, exchange capability, LIVE API-key gate,
  live confirmation) and updating focused bots-form regression assertions.
- 2026-04-19: completed `UXR-I-09` by preserving strategies tab flow and
  normalizing `close`/`additional` tab internals to shared `ui/forms`
  primitives (`FormSectionCard`, `FormGrid`, `RadioGroupField`, `NumberField`,
  `ToggleField`, `CompoundField`), while keeping strategy domain logic
  unchanged and adding focused tab-flow regression coverage in
  `StrategyForm.test.tsx`.
- 2026-04-19: hardened OPS/Gate tooling for production private-route auth by
  adding layered auth support (basic auth and custom header pass-through) to
  `ops:slo:collect`, `ops:rc:gates:*` pipeline wrapper, deploy smoke, runtime
  freshness check, and rollback guard scripts; updated RC external gates
  runbook with the new command variants. Added repository-level `lockfile=true`
  in `.npmrc` to keep `pnpm install --frozen-lockfile` deterministic in
  Coolify/CI environments.
- 2026-04-19: completed `UXR-I-08` by aligning `BacktestCreateForm` to the
  shared `FormPageShell` contract and removing feature-local outer shell
  wrappers while keeping payload behavior and focused backtests-form tests
  green.
- 2026-04-19: completed `UXR-I-07` by migrating `MarketUniverseForm` from
  local ad-hoc section wrappers to shared sectioned IA (`FormSectionCard` +
  `FormGrid`), keeping catalog/filter behavior intact and validating via
  focused market-form tests.
- 2026-04-19: completed `UXR-I-06` by closing wallets-form residual control
  parity with shared primitives (`RadioGroupField`, `SelectField`,
  `NumberField`) and refreshing focused wallet regression assertions for the
  updated LIVE/PAPER control semantics.
- 2026-04-19: completed `UXR-I-05` by unifying wallet/bot create-edit wrapper
  save-action behavior: desktop and mobile save buttons now mirror form
  `submitting` state (`disabled` + loading label), backed by newly localized
  `saving` keys in `dashboard-wallets` and `dashboard-bots.page`.
- 2026-04-19: completed `UXR-I-04` by expanding `i18n/guardrails.test.ts`
  coverage to full `UXR-I` wrapper route/component scope and tightening
  `scripts/repoGuardrails.mjs` so `FieldControls` imports are blocked outside
  same-feature ownership (or any non-feature file), preserving `ui/forms` as
  the canonical generic-control layer.
- 2026-04-19: completed `UXR-I-03` by normalizing shared `ui/forms` primitive
  API surface for migration safety (exported prop/type contracts in
  `FormAlert`, `FormField`, `FormFields`, `FormGrid`, `FormMobileActionBar`,
  `FormPageShell`, `FormSectionCard`, `FormValidationSummary`) without
  changing rendering/runtime behavior.
- 2026-04-19: completed `UXR-I-02` by publishing residual route/module
  forms-consistency gap inventory with markdown + JSON artifacts
  (`uxr-i-forms-gap-map-2026-04-19.md`,
  `_artifacts-uxr-i-forms-gap-map-2026-04-19.json`) to lock deterministic
  migration scope for `UXR-I` execution.
- 2026-04-19: completed `UXR-I-01` by freezing post-`UXR-F` dashboard forms
  consistency refresh boundaries in canonical docs (`open-decisions`,
  `web-dashboard-home`) with explicit route scope, `ui/forms-only` generic
  control source, wrapper i18n-copy contract, and standardized
  validation/submit invariants.
- 2026-04-19: activated planner brief
  `dashboard-tables-consistency-planner-brief-2026-04-19.md` into canonical
  queued wave `UXR-J` via
  `history/plans/uxr-j-dashboard-tables-consistency-refresh-plan-2026-04-19.md`,
  including grouped execution batches (`UXR-J-A..UXR-J-C`) and queue/context
  synchronization.
- 2026-04-19: activated planner brief
  `dashboard-forms-consistency-planner-brief-2026-04-19.md` into canonical
  queued wave `UXR-I` via
  `history/plans/uxr-i-dashboard-forms-consistency-refresh-plan-2026-04-19.md`,
  including grouped execution batches (`UXR-I-A..UXR-I-D`) and queue/context
  synchronization.
- 2026-04-19: completed `OPV-05` by making RC external-gates status manual
  follow-ups gate-aware in `scripts/buildRcExternalGateStatus.mjs`; generated
  status now lists only unresolved actions (`Gate2/Gate4` in current snapshot)
  instead of static all-gates reminders.
- 2026-04-19: closed `POS-A` and `POS-B` queue drift by verifying
  implementation-complete lifecycle parity scope with focused runtime/parity
  tests (`50/50 PASS`) and publishing closure evidence in
  `history/plans/pos-ab-closure-2026-04-19.md`.
- 2026-04-19: completed `OPV-04` by synchronizing OPV closure state across
  canonical queue/context and LBT/V1 planning docs, publishing
  `history/plans/opv-04-closure-sync-2026-04-19.md`; residual blockers from
  that sync were later resolved in the final RC closure run
  (`2026-04-19T15:13:58.943Z`).
- 2026-04-19: completed `OPV-03` by collecting fresh production SLO evidence,
  rebuilding rolling window reports, refreshing RC gate/checklist/sign-off
  artifacts, and publishing closure evidence in
  `history/releases/opv-03-rc-gates-refresh-2026-04-19.md`; the interim
  `G2/G4 OPEN` snapshot is superseded by final RC closure
  (`G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS`).
- 2026-04-19: completed `OPV-02` by verifying production takeover route
  availability (protected `401 Missing token` response, no `404`) and capturing
  OPS probe evidence in `history/plans/opv-02-prod-live-takeover-2026-04-19.md`;
  private-route admin-auth validation remains required for Gate 3 closure.
- 2026-04-19: completed `OPV-01` by running Dockerfile-first rehearsal builds
  for `api`, `web`, and all worker images (`PASS`) and capturing deployment
  evidence in `history/plans/opv-01-vps-rehearsal-2026-04-19.md` plus
  `_artifacts-opv-01-*` JSON/logs; production smoke on
  `api.soar.luckysparrow.ch` + `soar.luckysparrow.ch` passed; stage smoke is
  now also confirmed on `stage-api.soar.luckysparrow.ch` and
  `stage.soar.luckysparrow.ch`.
- 2026-04-19: closed `UXR-H` (`UXR-H-02..UXR-H-10`) end-to-end by delivering
  API manual-order context read contract + regression locks, web context/state
  integration, advanced runtime sidebar manual-order UX (`price`, market-fill,
  qty slider, side-aware summary, single-layer panel), EN/PL/PT i18n parity,
  and focused closure validation pack (`api/web tests`, `api/web typecheck`,
  `api/web build`, `quality:guardrails`).
- 2026-04-19: completed `UXR-H-01` by freezing dashboard manual-order advanced
  input/context contract across canonical decisions and module docs, including
  explicit unresolved `orderType -> MARKET` fallback and scope lock against
  TP/SL/reduce-only/TIF additions in this wave.
- 2026-04-19: completed `POS-36` by enforcing EXIT trace-only behavior in
  replay/interleaved backtest decision flow (`strategy_exit_trace_only`
  mismatch diagnostic), preserving lifecycle/final-candle close authority, and
  adding focused runtime final-candle EXIT trace-only regression lock.
- 2026-04-19: closed `ARC-E` (`ARC-19..ARC-20`) by tightening repository
  guardrails (source byte budgets + production line budgets) and publishing
  architecture maintainability closure snapshot in
  `docs/architecture/architecture-maintainability-closure-2026-04-19.md`.
- 2026-04-19: closed `ARC-C` (`ARC-11..ARC-13`) by introducing shared
  indicator kernel ownership (`strategyIndicatorKernel.ts`), rewiring runtime
  and backtest indicator projection/evaluation to the shared kernel path,
  extracting interleaved portfolio simulation ownership into
  `backtestPortfolioSimulation.service.ts`, and adding runtime-vs-backtest
  parity regression lock (`backtestRuntimeKernelParity.test.ts`).
- 2026-04-19: queued `UXR-H` manual-order advanced UX execution wave in
  `history/plans/uxr-h-dashboard-manual-order-advanced-plan-2026-04-19.md`
  with grouped tiny-commit batches (`UXR-H-A..UXR-H-C`) covering price input
  and market-price quick fill, minimum executable quantity constraints, slider
  row ergonomics, bot-context order metadata, side-aware cost/max summary, and
  focused closure validation requirements.
- 2026-04-19: closed `ARC-B` (`ARC-06..ARC-10`) end-to-end by extracting
  runtime trades/positions read seams, moving runtime close-position command
  ownership into command service boundaries, introducing API aggregate
  monitoring endpoint (`GET /dashboard/bots/:id/runtime-monitoring/aggregate`),
  and switching web aggregate monitoring to API-first with deterministic client
  fallback.
- 2026-04-19: completed `ARC-10` API+WEB monitoring contract lock with focused
  tests (`bots.monitoring-aggregate.e2e.test.ts`, `botsMonitoringAggregate.service.test.ts`)
  and deployment-facing validation pack (`api build`, `web build+typecheck`,
  `quality:guardrails`).
- 2026-04-19: completed `ARC-09` by implementing backend aggregate monitoring
  read-model service (`runtimeMonitoringAggregateRead.service.ts`) and
  controller/route exposure for web consumers.
- 2026-04-19: completed `ARC-08` by extracting runtime close-position command
  orchestration from read service into `runtimeSessionPositionCommand.service.ts`.
- 2026-04-19: completed `ARC-07` by extracting runtime trades/positions read
  ownership into dedicated repositories/services
  (`runtimeSessionTradesRead*`, `runtimeSessionPositionsRead*`).
- 2026-04-19: Completed `ARC-06` by extracting bots runtime session list/detail
  ownership into `runtimeSessionRead.service.ts` and symbol-stats read-model
  ownership into `runtimeSessionSymbolStatsRead.service.ts`, reducing
  `botsRuntimeRead.service.ts` to trades/positions/close responsibilities for
  the next ARC-B decomposition step.
- 2026-04-19: closed `ARC-D` (`ARC-14..ARC-18`) end-to-end: extracted
  `HomeLiveWidgets` onboarding/view-model seams, moved bots monitoring
  aggregation into dedicated service ownership, split DataTable
  column-visibility helper ownership, removed `BacktestRunDetails` locale
  branch literals, and added seam-focused regression locks.
- 2026-04-19: completed `ARC-18` regression closure pack with new focused tests
  (`runtimeOnboardingConfig.test.tsx`,
  `botsMonitoringAggregate.service.test.ts`,
  `useDataTableColumnVisibilityState.test.ts`) and validation
  (`pnpm --filter web run typecheck` + focused ARC-D pack => `37/37 PASS`).
- 2026-04-19: Completed `ARC-05` by splitting runtime regression ownership into
  seam-scoped suites (`runtimeSignalLoopSupervisor.test.ts`,
  `runtimeFinalCandleDecision.service.test.ts`) and locking the final-candle
  no-trade path with corrected null-direction fixture behavior.
- 2026-04-19: closed `ARC-A` (`ARC-01..ARC-05`) end-to-end and advanced
  canonical queue/context focus to `ARC-B`.
- 2026-04-19: Completed `ARC-04` by extracting the final-candle runtime
  decision/execution flow into `runtimeFinalCandleDecision.service.ts` and
  reducing `runtimeSignalLoop` to routing/delegation ownership.
- 2026-04-19: Completed `ARC-03` by extracting runtime supervisor/watchdog
  orchestration into `runtimeSignalLoopSupervisor.ts` and rewiring
  `runtimeSignalLoop` to callback-based supervisor ownership while preserving
  runtime-loop regression behavior.
- 2026-04-19: Completed `ARC-02` by extracting typed runtime execution config
  into `apps/api/src/config/runtimeExecution.ts` and wiring
  `runtimeSignalLoop`/`orders.service` to centralized config parsing with
  dedicated config tests (`runtimeExecution.test.ts`).
- 2026-04-19: Completed `ARC-01` by freezing runtime maintainability
  decomposition boundaries and anti-drift guardrails in
  `docs/architecture/runtime-critical-path-decomposition-contract.md` and
  linking the decision in `open-decisions` before code extraction starts.
- 2026-04-19: closed `PLNC-A` (`PLNC-01..PLNC-04`) by publishing deterministic
  planning classification index (`implemented/queued/external-blocked/superseded`),
  syncing stale planning status headers, adding canonical queue linkage in
  non-closed plans, and synchronizing closure state across canonical queue and
  context docs.
- 2026-04-18: closed `UXR-G` (`UXR-G-01..UXR-G-06`) end-to-end: manual-order
  section is now a peer block below wallet, wallet summary row order is
  `Allocation -> Delta -> Portfolio`, free-funds/in-positions split is `50/50`,
  and focused closure checks passed (`web dashboard-home tests`, `web typecheck`,
  `web build`).
- 2026-04-18: completed planning-catalog coverage audit and queued post-active
  execution waves (`PLNC`, `ARC`, `POS`, `OPV`) via
  `history/plans/planning-catalog-coverage-follow-up-plan-2026-04-18.md`,
  keeping active `BRS` queue unchanged.
- 2026-04-18: published maintainability audit report for planner handoff in `history/audits/architecture-maintainability-audit-2026-04-18.md`, refreshing monolith/hardcode hotspots, weak guardrails, and planner-ready refactor slices without changing the active `BRS` execution queue.
- 2026-04-17: closed `BTMM-C`, `L10NQ-A`, `L10NQ-B`, `L10NQ-C`, `UXR-D`,
  `DOCSYNC-A`, and `A11Y-A` waves with evidence-backed validation.
- 2026-04-18: closed `L10NQ-D-B` (`L10NQ-D-06..10`) and published follow-up
  planning for selector parity and dashboard form-system unification.
- 2026-04-18: closed `UXR-F-A` (`UXR-F-01..UXR-F-04`) by freezing Stage A
  migration boundaries, adding shared `ui/forms` core+field primitives with
  tests, and enforcing cross-feature generic form import guardrails.
- 2026-04-18: closed `UXR-F-B` (`UXR-F-05..UXR-F-08`) by unifying create/edit
  wrapper i18n shell copy and migrating wallets/markets/backtests create-edit
  forms to shared `ui/forms` primitives with focused regression evidence.
- 2026-04-18: closed `UXR-F-D` (`UXR-F-13..UXR-F-14`) with focused form/i18n
  regression pack (`33/33` tests PASS), final web `typecheck` + `build` PASS,
  and canonical queue/context synchronization with closure artifacts.
- 2026-04-18: executed derived tiny continuation task `QH-LINT-01` by removing
  four `no-unused-vars` warnings in dashboard/bots surfaces and revalidating
  web build/typecheck; this opened final warning debt cleanup slice.
- 2026-04-18: completed `QH-LINT-02` by resolving remaining
  `react-hooks/exhaustive-deps` warnings in
  `BacktestsRunsTable`/`WalletsListTable`; `web build` and `web typecheck` are
  now green without warning debt in this tracked closure scope.
- 2026-04-18: completed `QH-TSC-01` by adding canonical sequential web
  verification command (`pnpm run web:verify:build-typecheck`) and documenting
  it for closure packs to avoid manual command-order drift.
- 2026-04-18: activated `BRS` wave from canonical planning queue (`BRS-01..12`)
  and closed `BRS-01` decision gate: selected-bot runtime symbol scope is
  strict canonical by default (`ACTIVE + isEnabled` only, `PAUSED` excluded),
  with no symbol expansion from fallback paths.
- 2026-04-18: completed `BRS-A` implementation (`BRS-02..BRS-04`) by adding a
  dedicated selected-bot scope regression in bots API e2e suite and hardening
  runtime symbol scope to canonical `ACTIVE` groups only in repository/service
  layers (`botsRuntimeRead.repository.ts`, `runtimeStrategyDisplayBySymbol.service.ts`,
  `botsRuntimeRead.service.ts`); local available validations PASS
  (`api typecheck`, `quality:guardrails`).
- 2026-04-18: completed `BRS-B` implementation (`BRS-05..BRS-08`) by adding a
  canonical update-path regression, implementing transactional canonical
  `PUT /dashboard/bots/:id` mapping sync in `botsCommand.service.ts`,
  enforcing canonical-first strategy precedence in
  `runtimeSymbolStatsEnrichment.service.ts`, and publishing dedicated
  scope-regression tests in `bots.runtime-scope.e2e.test.ts`.
  Validation: `pnpm --filter api run typecheck` PASS,
  `pnpm run quality:guardrails` PASS,
  `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts`
  => `3/3 PASS`.
- 2026-04-18: queued post-`BRS` `UXR-G` dashboard runtime sidebar layout wave
  (manual-order section below wallet as peer block, wallet summary row order
  polish, and 50/50 free-funds/in-positions split) in
  `history/plans/uxr-g-dashboard-wallet-manual-order-layout-plan-2026-04-18.md`.
- 2026-04-18: refreshed the repo-specific agent workflow so the canonical queue,
  validation contract, deployment contract, and learning journal are aligned.

## Working Agreements
- Keep task board and project state synchronized.
- Keep planning docs synchronized with task board.
- Keep changes small and reversible.
- Validate touched areas before marking done.
- Keep repository artifacts in English.
- Communicate with users in their language.
- Delegate with explicit ownership and avoid overlapping subagent write scope.
- Treat the active chat as coordinator: subagent reports are evidence, not
  approval, and the coordinator owns integration, validation, learning capture,
  and final done-state.
- Use the default loop:
  `analyze -> select one task -> plan -> implement -> verify -> self-review -> sync knowledge`.
- Treat deployment docs and smoke checks as part of done-state for runtime
  changes.

## Recent Status

- 2026-05-24: Release/audit tooling was backfilled into the architecture
  evidence graph. New records cover the repository path resolver, operator
  unblock packet validator, reusable audit validators, aggregate tests,
  workflow, relations, and `CHAIN-RELEASE-AUDIT-TOOLING`.
  `architecture:graph:generate` passes with `641` nodes, `791` relations, and
  `27` chains; `architecture:graph:drift:strict` passes with `796/796`
  covered and `0` missing.
- 2026-05-23: Repository source-of-truth cleanup is committed on `main`.
  Obsolete root template scaffolds were removed, evidence was moved under
  canonical docs, and the Web legacy runtime route redirect drift was fixed.
- 2026-05-23: Coolify production `soar-web` manual redeploy reached commit
  `b68d3464`, but public `/api/build-info` returned `gitSha: null`. The local
  fix now writes Web build metadata to `.build-meta/BUILD_META.json` and passes
  Docker/Coolify `SOURCE_COMMIT` and `SOURCE_BRANCH` build args into the Web
  build; local Docker proof returns the expected Git SHA from
  `/api/build-info`.

## Canonical Context
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `.agents/state/active-mission.md`
- `.agents/state/responsibility-learning.md`
- `.agents/workflows/general.md`
- `.agents/workflows/subagent-orchestration.md`
- `.agents/workflows/responsibility-lanes.md`

## Canonical Docs
- `docs/documentation-overview.md`
- `docs/product/overview.md`
- `docs/product/product.md`
- `docs/architecture/architecture-documentation.md`
- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `docs/modules/system-modules.md`
- `docs/engineering/local-development.md`
- `docs/engineering/testing.md`
- `docs/planning/mvp-execution-plan.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/open-decisions.md`
- `docs/governance/working-agreements.md`
- `docs/governance/language-policy.md`
- `docs/governance/repository-structure-policy.md`
- `docs/governance/subagent-delegation-policy.md`
- `docs/operations/coolify-linux-vps-setup-guide.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/ux/ux-ui-mcp-collaboration.md`
- `docs/ux/dashboard-design-system.md`

## Optional Project Docs
- Add only if the repository truly needs them.
- Record their canonical paths here once they exist.



- 2026-05-26 stale-state cleanup applied to `LUC-45` controller operations from
  board comment `24f62373-1a53-444c-96d1-c88a9031bbb7`.
  `LUC-45` keeps strict `A+B -> C -> D -> E` integration order and remains
  `BLOCKED` until both upstream lanes close evidence contracts:
  `LUC-46` (backend/runtime) and `LUC-47` (ops/deploy).
  Active Delivery reconciliation routine is now explicit: every 2 hours,
  controller owner reconciles child blocker/evidence truth and creates a new
  child issue immediately when a newly discovered blocker cannot be owned by
  existing lanes.

## 2026-05-26 Delivery Reconciliation Pulse
- `LUC-45` remains explicitly `BLOCKED` in controller lane while `LUC-46` (backend/runtime) and `LUC-47` (ops/deploy) evidence remain open.
- 2-hour active Delivery routine continues to own reconciliation and blocker validation.
- No new unblock evidence payload arrived in this cycle; parent status remains stable fail-closed.

## 2026-05-26 Stale Parent Cleanup Update
- `LUC-45` parent controller remains `BLOCKED` and must not appear as passive `in_progress` without a live reconciliation run.
- Open blocker set now explicitly includes three proof lanes:
  - `LUC-46` backend/runtime proof,
  - `LUC-47` ops/deploy proof,
  - `LUC-48-A/browser-proof` frontend proof lane.
- Active V1 controller routine owns the next reconciliation pass and keeps fail-closed gate enforcement until all open proof lanes provide closure evidence.


- `LUC-115 assigned heartbeat (2026-05-26)` completed as `done` for
  `LUC-103-P5D` (`LUC-86` Ops evidence closure).
  Scope was strict to the `LUC-86` bundle only:
  `history/evidence/luc-86-*.md` plus
  `history/tasks/luc-86-coolify-production-deploy-health-sweep-2026-05-26-task.md`.
  Verification results: presence check PASS (`ALL_PRESENT`), markdown H1
  sanity PASS (`HEADERS_OK`), scoped credential-pattern scan PASS (no matches).
  No deploy/runtime mutation and no cross-lane edits were performed.
  Evidence:
  `history/tasks/luc-115-luc-86-ops-evidence-closure-2026-05-26-task.md`.

- `LUC-115` reopen via comment `8d6069de-2fc3-42fb-be12-793f80fd8c59`
  (2026-05-26) is reconciled and closed against committed bundle
  `14cfc384e3c10c550d82c68db903788a4039f76b`.
  Verified scope: `13` files (`11` LUC-86 evidence + `2` task files:
  `history/tasks/luc-86-coolify-production-deploy-health-sweep-2026-05-26-task.md`
  and `history/tasks/luc-115-luc-86-ops-evidence-closure-2026-05-26-task.md`).
  Validation parity confirmed with board note (H1 sanity pass, no secret values).
  No push/deploy mutation was performed.

- `LUC-121` frontend map inventory evidence closure (2026-05-26):
  protected/authenticated browser packet from `LUC-48-A/browser-proof` remains
  `PASS` for expected SHA `3fedb7a9170097b40accb6ccea1915064f383f11`, and
  docs-map readiness wording is synchronized to remove stale auth-blocker
  language. Remaining frontend closure scope is narrowed to explicit
  route-cluster `loading/empty/error` evidence (wallets/markets/strategies/
  backtests/reports/logs/profile + admin state-depth), not protected auth
  context availability.

- `LUC-130` (`[Soar][LUC-103-P5M] LUC-88 productivity review evidence closure`)
  completed on 2026-05-26 with CTO-scoped verification-only heartbeat.
  `LUC-88` source artifacts were presence/hash verified and closure evidence was
  published:
  `history/evidence/luc-130-luc-88-productivity-review-evidence-closure-2026-05-26.md`.
  No runtime/deploy mutation and no cross-lane implementation work occurred.
  Disposition: `done`.

- `LUC-147` (`[Soar][LUC-103-NO-LUC-C] History plans closure bundle`) completed on 2026-05-26 as a verification-only closure lane.
  Scoped `NO_LUC.history-plans` artifacts were verified with presence `8/8`, markdown H1 sanity `8/8`, SHA256 provenance capture, and scoped credential-pattern scan `NO_CREDENTIAL_VALUES`.
  No runtime/deploy mutation and no cross-lane implementation changes occurred.
  Evidence: `history/tasks/luc-147-history-plans-closure-bundle-2026-05-26-task.md` and
  `history/evidence/luc-147-history-plans-closure-bundle-2026-05-26.md`.










- `LUC-175 source_scoped_recovery_action heartbeat (2026-05-26)` was reconciled as a status-only source-control queue-gate checkpoint and remains `blocked`.
  Inline wake payload was used first (`fallback fetch: no`) and introduced no pending human unblock input (`0/0`) and no new blocker-closure evidence.
  Capacity governor remained preserved (`one live lane`): no wake/reassign/reopen/new lane action was executed in this continuation heartbeat.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host operator) must publish temp-domain expected-SHA deploy smoke/readiness and worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md`.

- `LUC-99 reopened-comment controlled restart (2026-05-26, Ops single lane)` executed a read-only root-blocker verification pass with no mutations.
  Blocker remains unchanged and explicit: `workers-market-stream` is still `exited:unhealthy`; matching worker deployment remains queued (`toi8dv1ls4oswrysgkfzxznb`, `commit=HEAD`); Coolify resource inventory shows `TEMP_MATCHES=0`; temp-domain expected-SHA smoke remains failed while prod expected-SHA smoke passes. LUC-99 stays `blocked` pending one operator-owned closure packet (worker recovery + temp acceptance, or explicit no-temp-stack decision).

- `LUC-99 source-scoped recovery recheck (2026-05-26)` completed with concrete evidence and remains `blocked`.
  Temp-domain expected-SHA smoke still fails (`fetch failed` on API/Web/build-info), while production control smoke remains `PASS`.
  Runtime Coolify auth bindings are still absent and protected-input readiness remains `BLOCKED` (`0` matches), so authenticated worker/temp-stack recovery cannot be executed in this runner.

- `LUC-99 child-completion integration (2026-05-26)` performed concrete parent reconciliation after child `LUC-178` completion.
  The temp-domain acceptance requirement is now satisfied by accepted explicit `NO_TEMP_STACK` decision.
  Lane remains `blocked` only on worker-side authenticated Coolify proof/recovery for `workers-market-stream`; this runner still lacks effective Coolify auth bindings, while production expected-SHA smoke remains `PASS` and protected-input readiness remains `BLOCKED` (`0` matches).

- `LUC-99 continuation recheck (2026-05-26)` completed with concrete evidence and remains `blocked`.
  No Coolify auth bindings are present in this runner; temp endpoints still fail (`fetch failed`) while production expected-SHA smoke stays `PASS`.
  Temp acceptance is already closed by `NO_TEMP_STACK` decision; remaining unresolved gate is authenticated worker-side closure evidence for `workers-market-stream`.

- `LUC-99 resume delta recheck (2026-05-26, source_scoped_recovery_action, Portfolio Director)` executed concrete verification and remains `blocked`.
  Runtime still has no effective Coolify bindings (`COOLIFY_BASE_URL=False`, `COOLIFY_TOKEN=False`, `COOLIFY_API_TOKEN=False`).
  Temp expected-SHA smoke remains `FAIL` (`fetch failed`) while production expected-SHA smoke remains `PASS`.
  In accepted issue scope, temp criterion remains satisfied through `NO_TEMP_STACK`; remaining unresolved closure item is worker-side authenticated Coolify proof/recovery for `workers-market-stream` (or deeper blocker packet).

- LUC-99 heartbeat recheck (2026-05-26, Ops Release Lead) executed concrete verification with restored env bindings and no deployment mutation.
  Presence-only runtime check is now positive (COOLIFY_BASE_URL, COOLIFY_TOKEN, COOLIFY_API_TOKEN), but acceptance remains blocked: protected-input readiness stays BLOCKED (0 matches), temp expected-SHA smoke remains FAIL (fetch failed), production expected-SHA smoke remains PASS.
  Effective closure path is unchanged: provide authenticated worker-side readiness/recovery proof for workers-market-stream (or deeper blocker packet) and close protected-input readiness gap for expected SHA.

- `LUC-99 resume heartbeat reconciliation (2026-05-26, Ops Release Lead)` completed with concrete read-only ops evidence and remains `blocked`.
  Runtime bindings are present in this runner, production expected-SHA smoke is `PASS`, and temp expected-SHA smoke remains `FAIL` (`fetch failed`).
  Coolify API snapshot confirms `workers-market-stream` (`d2oo1wwy8i55q27e5mdky0i4`) is still `exited:unhealthy` with `TEMP_MATCHES=0`; `/deployments` snapshot currently shows no worker-linked rows. Closure remains operator-owned: recover worker readiness or attach deeper blocker packet and close parent decision path.

- `LUC-99 continuation (2026-05-26, Ops Release Lead)` produced a first-class deeper blocker packet in read-only mode.
  In this runner, Coolify per-resource detail/log endpoints for the worker path returned `404`, while resource inventory remains accessible and still reports `workers-market-stream` as `exited:unhealthy`.
  Temp expected-SHA smoke remains `FAIL`, prod expected-SHA smoke remains `PASS`, and protected-input readiness moved to `PARTIAL` (9 matches) but remains incomplete for closure.
  Issue remains `blocked` pending operator-side runtime log/root-cause packet or successful worker recovery proof for parent issue closure.

- `LUC-99 source-scoped recovery recheck (2026-05-26)` remains `blocked` with fresh regression evidence.
  In this run, protected-input readiness returned to `BLOCKED` (`0` matches), replacing prior `PARTIAL` signal; Coolify auth bindings are absent and temp expected-SHA smoke still fails, while production expected-SHA smoke remains `PASS`.

- `LUC-181` root-cause packet heartbeat (2026-05-26) executed as verification-only Ops lane.
  Fresh evidence confirms the worker blocker is still active: `workers-market-stream` (`d2oo1wwy8i55q27e5mdky0i4`) remains `exited:unhealthy`; temp expected-SHA smoke still fails while production expected-SHA smoke passes.
  Deeper per-resource API log extraction remains unavailable from this runner (`/api/v1/resources/{uuid}` and `/api/v1/resources/{uuid}/logs` both return `404`), so closure requires operator-side log extraction from available Coolify-authenticated paths and either recovery proof or accepted deeper blocker decision.
  Evidence: `history/evidence/luc-181-workers-market-stream-operator-log-root-cause-packet-2026-05-26.md` and `history/tasks/luc-181-workers-market-stream-operator-log-root-cause-packet-2026-05-26-task.md`.

- `LUC-181` resume delta (2026-05-26) hardened the worker root-cause packet with direct Coolify application-log endpoint evidence.
  `GET /api/v1/applications/d2oo1wwy8i55q27e5mdky0i4/logs` now returns `400` with message `Application is not running.`, confirming a runtime-layer non-running state beyond inventory-level `exited:unhealthy`.
  Parent blocker evidence (`LUC-99`) was updated with this signal; release-controller decision remains required between accepting deeper blocker packet and requiring recovery proof.

- `LUC-181` disposition normalization heartbeat (2026-05-26, CTO) completed as status-governance sync only.
  No deploy/runtime mutation was performed. To keep fail-closed lane semantics,
  this issue is normalized to `blocked` (replacing passive `in_review` without a concrete reviewer path).
  Unblock owner/action is explicit and unchanged in substance:
  Coolify operator + release controller must attach one closure packet for this release cycle
  (authenticated worker logs/root-cause with recovery proof, or accepted deeper-blocker decision packet).
  Evidence:
  `history/tasks/luc-181-workers-market-stream-operator-log-root-cause-packet-2026-05-26-task.md`.

- `LUC-181` reopened-via-comment reconciliation (2026-05-26) acknowledged board note
  `f9537967-1075-4717-8c68-f194cc573da1` and confirmed control-plane/status
  parity with repository source-of-truth.
  Lane remains fail-closed `blocked`; no new unblock packet evidence was attached.
  No production/runtime mutation was performed in this heartbeat.

- `LUC-181` finish-handoff reconciliation (2026-05-26) completed as status-only checkpoint.
  Wake had no pending comments (`0/0`) and no new unblock evidence.
  Lane remains fail-closed `blocked` with unchanged unblock owner/action
  (Coolify operator + release controller; closure packet required).
  No production/runtime mutation was performed in this heartbeat.

- `LUC-181` source-scoped recovery reconciliation (2026-05-26) completed as status-only checkpoint.
  Inline wake payload was consumed first (`fallbackFetchNeeded=false`); pending comments remained `0/0` and no new unblock evidence was attached.
  Lane remains fail-closed `blocked` with unchanged unblock owner/action
  (Coolify operator + release controller; closure packet required).
  No production/runtime mutation was performed in this heartbeat.

- `LUC-181` reopened-comment delta (2026-05-26) advanced to explicit human decision gate.
  Board comment `a3df1eb9-be8d-40a8-a84f-1f10a30ab6e1` normalized operator routing through request-confirmation interaction
  `59c011b0-cc92-47b4-ae72-2a039556dd93` with two explicit branches:
  `accept` (narrow worker recovery/readiness lane) or `reject` (no production mutation, accept deeper blocker packet for this cycle).
  No production/runtime mutation was executed in this heartbeat.
  Current disposition for this heartbeat: `in_review` pending `local-board` decision on interaction `59c011b0-cc92-47b4-ae72-2a039556dd93`.

- `LUC-181` source-scoped recovery action reconciliation (2026-05-26) executed as a concrete status-governance checkpoint with no production mutation.
  Inline wake payload was consumed (`fallbackFetchNeeded=false`) and local artifacts were rescanned.
  No newer board-decision artifact than interaction `59c011b0-cc92-47b4-ae72-2a039556dd93` and no new operator worker log/recovery packet were found.
  Disposition for this heartbeat remains `in_review` with a real reviewer path (`local-board` via interaction `59c011b0-cc92-47b4-ae72-2a039556dd93`).
  Decision branches remain explicit: `accept` -> narrow worker recovery/readiness lane; `reject` -> no production mutation and accepted deeper blocker for this release cycle.

- LUC-199 assigned heartbeat (2026-05-26) executed a concrete PM no-stall queue-expeditor checkpoint and remains blocked.
  Latest wake payload was acknowledged first (fallbackFetchNeeded=false, pending comments 0/0); no new blocker-closure evidence arrived.
  Scope stayed coordination-only and fail-closed against parent LUC-45.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: LUC-47 (Ops Release Lead + host operator) must publish temp-domain expected-SHA deploy smoke/readiness and worker readiness evidence with rollback note.
  Evidence:
  history/tasks/luc-199-no-stall-queue-expeditor-2026-05-26-task.md.
- LUC-199 finish_successful_run_handoff heartbeat (2026-05-26) was reconciled as a status-only PM queue-expeditor continuation checkpoint.
  Inline wake payload was consumed first (fallbackFetchNeeded=false); pending comments remained 0/0 and no new blocker-closure evidence arrived.
  Scope remained coordination-only and fail-closed with no deploy/runtime/code mutation.
  Disposition remains blocked; unblock owner/action unchanged: LUC-47 (Ops Release Lead + host operator) must attach temp-domain expected-SHA smoke/readiness packet plus worker readiness and rollback note.
  Evidence:
  history/tasks/luc-199-no-stall-queue-expeditor-2026-05-26-task.md.

- LUC-199 issue_status_changed heartbeat (2026-05-26) was reconciled as a status-only PM queue-expeditor continuation checkpoint.
  Inline wake payload was consumed first (fallbackFetchNeeded=false); pending comments remained 0/0 and no new blocker-closure evidence arrived.
  Scope remained coordination-only and fail-closed with no deploy/runtime/code mutation.
  Disposition remains blocked; unblock owner/action unchanged: LUC-47 (Ops Release Lead + host operator) must attach temp-domain expected-SHA smoke/readiness packet plus worker readiness and rollback note.
  Evidence:
  history/tasks/luc-199-no-stall-queue-expeditor-2026-05-26-task.md.

- LUC-199 issue_continuation_needed heartbeat (2026-05-26) was reconciled as a status-only PM queue-expeditor continuation checkpoint.
  Inline wake payload was consumed first (fallbackFetchNeeded=false); pending comments remained 0/0 and no new blocker-closure evidence arrived.
  Scope remained coordination-only and fail-closed with no deploy/runtime/code mutation.
  Disposition remains blocked; unblock owner/action unchanged: LUC-47 (Ops Release Lead + host operator) must attach temp-domain expected-SHA smoke/readiness packet plus worker readiness and rollback note.
  Evidence:
  history/tasks/luc-199-no-stall-queue-expeditor-2026-05-26-task.md.

- LUC-199 source_scoped_recovery_action heartbeat (2026-05-26) was reconciled as a status-only PM queue-expeditor continuation checkpoint.
  Inline wake payload was consumed first (fallbackFetchNeeded=false); pending comments remained 0/0 and no new blocker-closure evidence arrived.
  Scope remained coordination-only and fail-closed with no deploy/runtime/code mutation.
  Disposition remains blocked; unblock owner/action unchanged: LUC-47 (Ops Release Lead + host operator) must attach temp-domain expected-SHA smoke/readiness packet plus worker readiness and rollback note.
  Evidence:
  history/tasks/luc-199-no-stall-queue-expeditor-2026-05-26-task.md.

- LUC-202 assigned heartbeat (2026-05-26) executed a concrete PM no-stall queue-expeditor checkpoint and remains blocked.
  Latest wake payload was acknowledged first (fallbackFetchNeeded=false, pending comments 0/0); no new blocker-closure evidence arrived.
  Scope stayed coordination-only and fail-closed against parent LUC-45.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: LUC-47 (Ops Release Lead + host operator) must publish temp-domain expected-SHA deploy smoke/readiness and worker readiness evidence with rollback note.
  Evidence:
  history/tasks/luc-202-no-stall-queue-expeditor-2026-05-26-task.md.

- LUC-204 assigned heartbeat (2026-05-26) executed a concrete PM no-stall queue-expeditor checkpoint and remains blocked.
  Latest wake payload was acknowledged first (fallbackFetchNeeded=false, pending comments 0/0); no new blocker-closure evidence arrived.
  Scope stayed coordination-only and fail-closed against parent LUC-45.
  No commit/push/deploy/runtime mutation was performed in this lane.
  Unblock owner/action remains unchanged: LUC-47 (Ops Release Lead + host operator) must publish temp-domain expected-SHA deploy smoke/readiness and worker readiness evidence with rollback note.
  Evidence:
  history/tasks/luc-204-no-stall-queue-expeditor-2026-05-26-task.md.

- LUC-204 finish_successful_run_handoff heartbeat (2026-05-26) was reconciled as a status-only PM queue-expeditor continuation checkpoint.
  Inline wake payload was consumed first (fallbackFetchNeeded=false); pending comments remained 0/0 and no new blocker-closure evidence arrived.
  Scope remained coordination-only and fail-closed with no deploy/runtime/code mutation.
  Disposition remains blocked; unblock owner/action unchanged: LUC-47 (Ops Release Lead + host operator) must attach temp-domain expected-SHA smoke/readiness packet plus worker readiness and rollback note.
  Evidence:
  history/tasks/luc-204-no-stall-queue-expeditor-2026-05-26-task.md.

- LUC-99 resume delta (2026-05-26, issue_blockers_resolved) executed with concrete revalidation and remains blocked.
  Runtime Coolify auth bindings are present again in this runner; protected-input readiness improved to PARTIAL (9 matching names) for prior expected SHA 3fedb7a9170097b40accb6ccea1915064f383f11.
  Temp expected-SHA smoke still fails (fetch failed), and a new release-critical drift was observed: production web build-info now reports 71b8d503fd6fdfd7378dc67b2fa678799e2430f8 instead of 3fedb7a9....
  Control smoke against observed SHA 71b8d503... passes, so parent closure must reconcile expected-SHA decision plus unresolved workers-market-stream readiness recovery/deeper-blocker evidence.




- LUC-99 resume delta (2026-05-26, finish_successful_run_handoff) executed with concrete revalidation and remains blocked.
  Runtime auth bindings were present; protected-input readiness stayed PARTIAL (9) for parent expected SHA 3fedb7a9....
  Temp expected-SHA smoke remains failed, production expected-SHA smoke for 3fedb7a9... still fails on build-info mismatch, and production control smoke for observed SHA 71b8d503... passes.
  Read-only Coolify snapshot now reports workers-market-stream as `running:unknown` (improved from exited:unhealthy) but without explicit readiness proof, so closure still requires worker-readiness evidence plus release-controller expected-SHA reconciliation.


- `LUC-99` source-scoped recovery heartbeat (2026-05-26, Ops Release Lead) executed with concrete read-only checks and remains `blocked`.
  In this runner, Coolify auth bindings are absent, protected-input readiness is `BLOCKED` (`0`), temp smoke remains failed (`fetch failed`), and production expected-SHA smoke still mismatches (`expected=3fedb7a9...`, `observed=71b8d503...`).
  Control smoke for observed SHA passes; closure remains operator/release-controller owned (SHA reconciliation + worker readiness proof or accepted deeper blocker packet).

- `LUC-99` reopened-comment reconciliation heartbeat (2026-05-26, Ops Release Lead scope) completed with concrete read-only evidence and remains `blocked`.
  Release-controller SHA target is now explicitly reconciled to `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` based on current production parity smoke (old expected `3fedb7a9...` fails mismatch).
  Worker readiness is still not provable in this runner (`/workers/health` and `/workers/ready` both `401`, no Coolify auth bindings), so a first-class deeper blocker packet was recorded and parent payload prepared for `LUC-98`, `LUC-47`, and `LUC-12`.

- `LUC-99` source-scoped recovery wake (2026-05-26, resumed recheck) executed with concrete read-only evidence and remains `blocked`.
  Production parity on closure-target SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` still passes, temp endpoints still fail (`fetch failed`), and this runner lacks Coolify auth bindings needed for authenticated worker-readiness/log proof.
  Next unblock remains operator-owned: attach authenticated `workers-market-stream` readiness/log packet (or accepted deeper blocker decision) and publish parent closure decision update for `LUC-98` / `LUC-47` / `LUC-12`.

- `LUC-99` reopened-via-comment manual disposition sync (2026-05-26) executed with concrete read-only checks and remains `blocked`.
  Production parity at SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` still passes; temp endpoints still fail (`fetch failed`); worker public probes remain protected (`401/401`).
  No authenticated worker-readiness packet could be produced in this run, so parent closure remains blocked pending operator/release-controller evidence and update.

- `LUC-99` finish-successful-run handoff recheck (2026-05-26) executed with concrete read-only evidence and remains `blocked`.
  Production parity at SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` still passes, while temp endpoints remain unreachable (`fetch failed`) and worker probes remain `401/401`.
  Closure still requires authenticated worker readiness/log evidence (or accepted deeper-blocker packet) plus parent decision sync.

- LUC-202 reopened-comment consolidation heartbeat (2026-05-26) acknowledged board instruction `c07a03c8-2278-49b8-a24a-58e27f316535`.
  This PM lane is now treated as duplicate/superseded by canonical lane `LUC-204`.
  Root blocker routing remains unchanged (`LUC-99` via `LUC-47`).
  No implementation/deploy/runtime mutation was performed.
  Disposition remains `cancelled` for duplicate consolidation.
  Evidence:
  history/tasks/luc-202-no-stall-queue-expeditor-2026-05-26-task.md.

- `LUC-207` issue_reopened_via_comment heartbeat (2026-05-26) reconciled board comment `32ebd568-11b6-4ea5-9adf-dffe5e33ace7` and applied duplicate consolidation.
  Canonical controller lane remains `LUC-45`; this lane is cancelled to avoid autonomous routine/controller duplication noise.
  Scope remained coordination-only status governance with no commit/push/deploy/runtime mutation.
  Disposition: `cancelled` (duplicate consolidation to `LUC-45`).
  Evidence:
  `history/tasks/luc-207-v1-audit-to-completion-controller-2026-05-26-task.md`.

- `LUC-208 assigned heartbeat (2026-05-26)` executed one PM no-stall queue
  expeditor checkpoint and remains `blocked`.
  Wake payload was consumed from inline data first (`fallbackFetchNeeded=false`,
  pending comments `0/0`) and introduced no new blocker-closure evidence.
  Scope stayed PM coordination-only with fail-closed posture.
  No commit/push/deploy/runtime mutation was performed.
  Unblock owner/action remains unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-208-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-208` finish-handoff heartbeat (2026-05-26) reconciled from inline wake
  payload first (`fallbackFetchNeeded=false`, pending comments `0/0`) and
  remains `blocked`.
  No new blocker-closure evidence arrived; scope stayed PM coordination-only
  and fail-closed.
  Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA smoke/readiness packet plus
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-208-no-stall-queue-expeditor-2026-05-26-task.md`.

- `LUC-99` child-completion reconciliation (2026-05-26) closed the external ops blocker via integrated child evidence.
  `LUC-178` provided accepted `NO_TEMP_STACK` routing for temp acceptance, and `LUC-181` plus the Coolify recovery packet provided worker recovery/readback proof.
  Parent closure payload for `LUC-98`/`LUC-47`/`LUC-12` is anchored to production SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`; LUC-99 disposition is now `done`.

- `LUC-99` source-scoped recovery reconciliation (2026-05-26) corrected terminal status to `blocked` after concrete recheck.
  Production parity on SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` still passes, but temp checks still fail (`fetch failed`) and worker probes remain protected (`401/401`), so acceptance evidence for terminal closure is incomplete.
  Unblock remains operator-owned: authenticated worker readiness/log evidence (or accepted deeper-blocker packet) plus parent closure decision update.

## 2026-05-26 Wake Delta (issue_assigned, Ops Release Lead, authenticated-boundary stability recheck)
- Stage: `verification`
- Scope: read-only verification only; no deploy/restart/runtime mutation.
- Fresh command results:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
    => public checks `PASS`; protected `API /workers/ready -> 401`.
  - `corepack pnpm run -s ops:deploy:smoke -- --base-url https://soar-temp.luckysparrow.ch --api-url https://temp-api.soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8 --skip-workers`
    => `FAIL` (`fetch failed` across required API/Web/build-info endpoints).
  - Presence-only auth/context check:
    - `SOAR_API_TOKEN_PRESENT=False`
    - `SOAR_API_KEY_PRESENT=False`
    - `SOAR_SESSION_COOKIE_PRESENT=False`
    - `COOLIFY_BASE_URL_PRESENT=True`
    - `COOLIFY_TOKEN_PRESENT=True`
    - `COOLIFY_API_TOKEN_PRESENT=True`
- Interpretation:
  - Production public SHA parity remains healthy on `71b8d503...`.
  - Acceptance-grade worker readiness proof remains blocked on Soar app-level auth boundary (`/workers/ready`).
  - Temp acceptance surface remains unreachable by direct smoke path.

### Final Disposition
- `blocked`

### Unblock Owner / Action
- Owner: Soar API auth credential owner + Coolify operator + release controller.
- Action:
  1. provide approved read-only app auth/session path that can pass `/workers/ready`,
  2. attach authenticated readiness/log evidence for `workers-market-stream`,
  3. publish parent closure decision update for `LUC-98` / `LUC-47` / `LUC-12` anchored to SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`.

## 2026-05-26 Wake Delta (issue_continuation_needed, Ops runtime+smoke reconciliation)
- Stage: `verification`
- Scope: concrete read-only ops reconciliation; no deploy/restart/runtime mutation.
- Fresh runtime signals:
  - Coolify worker inventory:
    - `WORKER_FOUND=True`
    - `WORKER_STATUS=running:unknown`
    - `WORKER_UPDATED_AT=2026-05-26T18:43:44.000000Z`
    - `WORKER_ENV_ID=6`
  - Coolify worker logs endpoint:
    - `WORKER_LOGS_ENDPOINT=OK_NONEMPTY`
- Fresh smoke checks for closure-target SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`:
  - production full smoke => public checks `PASS`; protected `API /workers/ready -> 401`
  - temp smoke (`--skip-workers`) => `FAIL` (`fetch failed` across required API/Web/build-info checks)
- Interpretation:
  - worker liveness is observable in Coolify (running state + non-empty logs),
  - acceptance-grade readiness proof remains blocked on protected Soar app auth boundary (`/workers/ready`),
  - temp direct acceptance path remains unavailable.

### Final Disposition
- `blocked`

### Unblock Owner / Action
- Owner: Soar API auth credential owner + Coolify operator + release controller.
- Action:
  1. provide approved read-only app auth/session path that can pass `/workers/ready`,
  2. attach authenticated readiness proof (or equivalent protected readiness/log packet) for `workers-market-stream`,
  3. publish parent closure decision update for `LUC-98` / `LUC-47` / `LUC-12` anchored to SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`.


- `LUC-221 finish_successful_run_handoff heartbeat (2026-05-27)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Inline wake carried no new unblock delta (`fallbackFetchNeeded=false`,
  comments `0/0`), so blocker contract is unchanged.
  Unblock owner/action remains `LUC-47` (`Ops Release Lead` + host operator):
  temp-domain expected-SHA smoke/readiness + worker readiness + rollback note.
  Evidence:
  `history/tasks/luc-221-no-stall-queue-expeditor-2026-05-27-task.md`.


- `LUC-244 assigned heartbeat (2026-05-27)` executed a concrete PM no-stall
  queue-expeditor checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`);
  no new blocker-closure evidence arrived in this heartbeat.
  Scope remained coordination-only and fail-closed (no code/runtime/deploy
  mutation).
  Unblock owner/action unchanged: `LUC-47` (`Ops Release Lead` + host
  operator) must attach temp-domain expected-SHA deploy smoke/readiness and
  worker readiness evidence with rollback note.
  Evidence:
  `history/tasks/luc-244-no-stall-queue-expeditor-2026-05-27-task.md`.
- `LUC-244 finish_successful_run_handoff heartbeat (2026-05-27)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Inline wake carried no new unblock delta (`fallbackFetchNeeded=false`,
  comments `0/0`), so blocker contract is unchanged.
  Unblock owner/action remains `LUC-47` (`Ops Release Lead` + host operator):
  temp-domain expected-SHA smoke/readiness + worker readiness + rollback note.
  Evidence:
  `history/tasks/luc-244-no-stall-queue-expeditor-2026-05-27-task.md`.

- `LUC-244 source_scoped_recovery_action heartbeat (2026-05-27)` was
  reconciled as a status-only PM no-stall checkpoint and remains `blocked`.
  Inline wake carried no unblock delta (`fallbackFetchNeeded=false`, comments
  `0/0`, latest comment id `unknown`), so blocker contract is unchanged.
  Unblock owner/action remains `LUC-47` (`Ops Release Lead` + host operator):
  temp-domain expected-SHA smoke/readiness + worker readiness + rollback note.
  Evidence:
  `history/tasks/luc-244-no-stall-queue-expeditor-2026-05-27-task.md`.
- `LUC-244 issue_reopened_via_comment heartbeat (2026-05-27)` consumed one
  pending board comment (`330a9de1-3c40-4bbd-b64d-cffb9b5e4d54`) and remains
  `blocked`.
  Comment scope was triaged as coordination routing only: keep `LUC-244` as the
  canonical PM routine chain issue, cancel/redirect duplicate sibling lanes
  here, and keep blocker linkage explicit to `LUC-47`.
  No new blocker-closure evidence was attached, so unblock owner/action is
  unchanged: `LUC-47` (`Ops Release Lead` + host operator) must attach
  temp-domain expected-SHA deploy smoke/readiness + worker readiness + rollback
  note.
  Evidence:
  `history/tasks/luc-244-no-stall-queue-expeditor-2026-05-27-task.md`.


- `LUC-386 Mobile module docs baseline (2026-05-28)` is now explicitly recorded as complete for the scaffold-only scope. `docs/modules/mobile-module-index.md` and `docs/modules/mobile-bootstrap.md` are present; `docs/modules/module-doc-status-index.md` includes `Mobile Surface`; `docs/modules/module-registry.md` includes `Mobile Module Registry`; and `.agents/state/module-confidence-ledger.md` (`SOAR-MOBILE-001`) now references this docs baseline. Native/mobile implementation remains deferred by design until activation approval.


- `LUC-175 [Soar][LUC-103-P6]` heartbeat (`issue_commented`, 2026-05-28) consumed comment `f2640c8a-3c88-4971-bd25-d1ab2730c7ec` and applied control-loop unblock policy for local source-control closure lanes.
  Local closure is now explicitly decoupled from protected production gates: `LUC-241`/`LUC-47` continue to block deploy/restart/push/protected smoke, but do not block local diff classification, local validation, and local commit/no-commit disposition.
  Concrete execution completed:
  1) full dirty-group classification (`product-code=2`, `state/control=6`, `docs/evidence/plans=15`),
  2) local validation for product-code group (`assistantOrchestrator`): targeted vitest `7/7 pass` + `api` typecheck pass,
  3) disposition split: product-code is local commit-eligible; non-product groups remain no-commit/preserved in this heartbeat.
  No revert, no push, no deploy/restart/protected smoke, no secret disclosure.
  Evidence:
  `history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md`.

- `LUC-387 [ARB-003]` is complete for the targeted inferred-coverage slice. Web deep dives for `orders`, `positions`, `icons`, and `shared` now include exact-file `Tests` tables, and drift/traceability wording was updated from unresolved inferred coverage to repaired-with-maintenance guidance. Evidence: `history/tasks/luc-387-arb-003-web-tests-table-expansion-2026-05-28-task.md`.

- `LUC-241 source_scoped_recovery_action heartbeat (2026-05-28)` executed one
  concrete read-only presence-only auth artifact checkpoint and remains `blocked`.
  Inline wake was consumed first (`fallbackFetchNeeded=false`, comments `0/0`,
  latest comment id `unknown`).
  Checkpoint timestamp: `2026-05-28T02:05:19+02:00`.
  Presence-only result:
  `SMOKE_AUTH_TOKEN=False`, `SMOKE_AUTH_EMAIL=False`,
  `SMOKE_AUTH_PASSWORD=False`, `SOAR_API_TOKEN=False`, `SOAR_API_KEY=False`,
  `SOAR_SESSION_COOKIE=False`.
  Interpretation: no new unblock artifact class appeared; `SMOKE_AUTH_*`
  bindings are absent in this runtime, so protected `/workers/ready` recheck
  path is not actionable in this wake.
  Unblock owner/action:
  Soar API auth credential owner + Security/Test secret-ref owner must restore
  approved `SMOKE_AUTH_*` bindings for this runtime; then Ops executes exactly
  one worker-included smoke recheck (or on explicit board gate approval).
  Scope remained read-only verification/docs-state sync (no deploy/restart/runtime mutation).
  Evidence:
  `history/tasks/luc-241-unblock-workers-ready-smoke-principal-permissions-2026-05-27-task.md`.

- `LUC-241 issue_reopened_via_comment heartbeat (2026-05-28)` consumed pending
  comment `56478cae-42c0-4619-bb27-2cfa60cc174c` and executed a concrete
  stale-evidence freshness response while remaining `blocked`.
  Comment request acknowledged first: attach fresh gate evidence or keep blocked
  with explicit next-review condition.
  Concrete read-only action in this heartbeat:
  1. presence-only auth artifact checkpoint at `2026-05-28T15:21:41+02:00`:
     `SMOKE_AUTH_TOKEN=False`, `SMOKE_AUTH_EMAIL=False`,
     `SMOKE_AUTH_PASSWORD=False`, `SOAR_API_TOKEN=False`,
     `SOAR_API_KEY=False`, `SOAR_SESSION_COOKIE=False`,
  2. one canonical-host smoke rerun on expected SHA
     `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`:
     `PASS` public checks and `FAIL API /workers/ready -> 401`.
  Interpretation: fresh gate evidence attached; protected readiness remains
  blocked on auth/session/permission path with missing runtime `SMOKE_AUTH_*`
  bindings.
  Explicit next-review condition recorded:
  run next active protected recheck only when at least one appears:
  restored approved `SMOKE_AUTH_*` bindings, fresh valid approved principal/session
  artifact, or explicit board gate approval for exactly one protected recheck.
  Scope remained read-only verification/docs-state sync (no deploy/restart/runtime mutation).
  Evidence:
  `history/tasks/luc-241-unblock-workers-ready-smoke-principal-permissions-2026-05-27-task.md`.

- `LUC-241 issue_continuation_needed heartbeat (2026-05-28)` executed a
  concrete read-only status-sync checkpoint and remains `blocked`.
  Inline wake consumed first (`fallbackFetchNeeded=false`, comments `0/0`,
  latest comment id `unknown`) with no new approval/comment delta.
  Concrete action: one presence-only auth artifact checkpoint at
  `2026-05-28T15:23:16+02:00` (no smoke/probe rerun per active next-review condition).
  Presence-only result:
  `SMOKE_AUTH_TOKEN=False`, `SMOKE_AUTH_EMAIL=False`,
  `SMOKE_AUTH_PASSWORD=False`, `SOAR_API_TOKEN=False`, `SOAR_API_KEY=False`,
  `SOAR_SESSION_COOKIE=False`.
  Interpretation: no new unblock artifact class appeared; protected recheck
  remains paused by guardrail.
  Next review condition unchanged:
  re-open active verification only when at least one appears:
  restored approved `SMOKE_AUTH_*` bindings, fresh valid approved
  principal/session artifact, or explicit board gate approval for exactly one
  protected recheck.
  Scope remained read-only verification/docs-state sync (no deploy/restart/runtime mutation).
  Evidence:
  `history/tasks/luc-241-unblock-workers-ready-smoke-principal-permissions-2026-05-27-task.md`.

- `LUC-405 [Soar][ARB-006][Ops]` heartbeat checkpointed on 2026-05-28 and remains `blocked`.
  Executable window packet is in place (`history/releases/luc-405-arb-006-protected-evidence-window-packet-2026-05-28.md`) with window `2026-05-30 09:00-11:00 Europe/Berlin`, read-only fail-closed sequence, and no-mutation gate.
  Unblock owner/action is explicit:
  1. Soar auth credential owner + Security/Test owner deliver approved read-only principal/session for `GET /workers/ready` before `2026-05-30 08:30 Europe/Berlin`.
  2. Ops Release Lead + QA + Security + release controller execute `ARB6-WIN-2026-05-30-A` and publish parent unblock disposition on `LUC-402`.

- `LUC-405 [Soar][ARB-006][Ops]` reopened-comment delta was reconciled on 2026-05-28 (`comment 617054fc-2da8-4aac-90a2-395aeb6b8d07`).
  Board-confirmed source-control closure commit `6d3f4769` was validated to include the declared LUC-405 evidence package artifacts and the protected evidence window packet.
  Status remains `blocked` / `NO-GO` with unchanged unblock contract: approved read-only principal/session for `GET /workers/ready` plus completion of missing protected evidence families before parent `LUC-402` unblock publication.

- `LUC-405 [Soar][ARB-006][Ops]` continuation heartbeat (2026-05-28, no new comments) completed an anti-drift recheck and remains `blocked/NO-GO`.
  Window packet and blocker contract are still consistent (`ARB6-WIN-2026-05-30-A`, protected `GET /workers/ready` auth boundary, and missing protected evidence families).
  Unblock owner/action unchanged.

## 2026-05-28 - LUC-405 protected evidence window revalidation (Ops)
- `ops:operator-unblock:check`: PASS, packet stays fail-closed and no-mutation.
- `ops:protected-inputs:check` for SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`: PARTIAL; protected families still missing (`LIVEIMPORT_READBACK`, `ROLLBACK_GUARD`, `SOAR_PROD`, `PROD_DB_CHECK`/`PRODUCTION_DB_CHECK`, `RC`, `GATE`).
- Project release posture for ARB-006 remains `NO-GO / BLOCKED` pending named external owners.

## 2026-05-28 - LUC-405 parent unblock publication packet
- Published `history/releases/luc-405-luc-402-parent-unblock-comment-packet-2026-05-28.md` for direct parent (`LUC-402`) posting.
- Packet encodes: window `ARB6-WIN-2026-05-30-A`, expected SHA, no-mutation gate, named owners/actions, and required approvals.
- ARB-006 release posture remains `BLOCKED/NO-GO` pending auth principal and missing protected evidence families.

- `LUC-405 [Soar][ARB-006][Ops]` source-scoped recovery checkpoint (2026-05-28) reran `ops:operator-unblock:check` and confirmed `PASS` with `NO-GO: yes`.
  Contract remains fail-closed `blocked` pending approved read-only principal/session for `GET /workers/ready` and closure of missing protected evidence families.

## 2026-05-28 - LUC-405 Ops heartbeat continuation
- Reran `ops:operator-unblock:check` as minimal protected-window contract checkpoint.
- Result remains `PASS` with explicit `NO-GO` (`Status NO-GO: yes`) and packet/readiness consistency (`Protected input evidence matches packet: yes`, missing packet fragments/paths: `0`).
- Release posture unchanged: `blocked` on approved read-only auth principal/session for protected `GET /workers/ready` plus completion/execution of protected evidence window chain for parent `LUC-402`.

## 2026-05-28 - LUC-405 protected-input readiness continuation
- Reran `ops:protected-inputs:check` for `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` with dated JSON/Markdown outputs.
- Result remains `PARTIAL` with matching protected names `9`; missing families are unchanged (`LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, `SOAR_PROD_*`, `PROD_DB_CHECK_*`, `PRODUCTION_DB_CHECK_*`, `RC_*`, `GATE*` / `GATE_*`).
- Release posture remains `blocked/NO-GO`; unblock contract unchanged (`GET /workers/ready` approved read-only principal/session plus missing protected evidence families before parent `LUC-402` unblock publication).

- `LUC-405 [Soar][ARB-006][Ops]` source-scoped recovery checkpoint (2026-05-28) validated protected-input artifact parity (`PARTIAL`, `NO-GO`, missing families unchanged) and kept disposition `blocked` with unchanged unblock owners/actions.

## 2026-05-28 - LUC-405 input-readiness sign-off artifact (Ops)
- Added executable protected-window input readiness sheet:
  - `history/releases/luc-405-arb-006-window-input-readiness-signoff-2026-05-28.md`
- The sheet captures owner/status/evidence fields for all currently missing protected families and enforces a hard T-30 stop rule (`2026-05-30 08:30 Europe/Berlin`) if any row remains `BLOCKED`.
- Release posture unchanged: `blocked/NO-GO` until read-only auth principal for protected `GET /workers/ready` and all protected families are marked `READY`.

## 2026-05-28 - LUC-405 resume-delta readiness checkpoint (Ops)
- Revalidated protected-window contract after resume delta:
  - `ops:operator-unblock:check` stayed `PASS` with explicit `NO-GO: yes`,
  - `ops:protected-inputs:check` stayed `PARTIAL` (only `PROD_UI_*` / `PROD_UI_AUDIT_*` present, all other required families still missing).
- Release posture unchanged: `blocked/NO-GO`; no-mutation evidence window may not execute until auth boundary and missing protected families are closed.

- `LUC-405 [Soar][ARB-006][Ops]` source-scoped recovery checkpoint (2026-05-28) reran dual checks and observed readiness drift: `operator-unblock` stayed `PASS/NO-GO`, while `protected-inputs` regressed to `BLOCKED` (`0` matching protected names) in the current runtime context.
  Disposition remains `blocked`; unblock now explicitly includes restoring protected-input families in the active runner context before window execution.

## 2026-05-28 - LUC-405 protected-input readiness oscillation control (Ops)
- Heartbeat reran `ops:protected-inputs:check` for SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` and returned `PARTIAL` (`matching names: 9`) after earlier same-day `BLOCKED` (`0`) drift.
- Added explicit stability gate artifact:
  - `history/releases/luc-405-arb-006-protected-input-readiness-oscillation-addendum-2026-05-28.md`
- Gate rule: `ARB6-WIN-2026-05-30-A` remains `NO-GO` until approved read-only auth for `GET /workers/ready` is present and two consecutive same-context readiness checks show full required protected-input families.
- Disposition remains `blocked`; no production mutation performed.

## 2026-05-28 - LUC-405 continuation checkpoint (Ops)
- Rechecked protected evidence gate with dual verification:
  - `ops:operator-unblock:check` => `PASS` (`NO-GO: yes`),
  - `ops:protected-inputs:check` => `PARTIAL` (`matching names: 9`; required families still missing outside `PROD_UI_*` / `PROD_UI_AUDIT_*`).
- Published parent unblock checklist update artifact:
  - `history/releases/luc-405-luc-402-parent-unblock-checklist-update-2026-05-28.md`
- Release posture remains `blocked/NO-GO`; no mutation actions executed.

- `LUC-405 [Soar][ARB-006][Ops]` source-scoped recovery checkpoint (2026-05-28) confirmed runtime-context instability: checklist snapshot showed `PARTIAL (9)` but immediate rerun returned `BLOCKED (0)` for protected inputs, while `operator-unblock` stayed `PASS/NO-GO`.
  Disposition remains `blocked`; unblock now requires two consecutive non-regressing protected-input runs in the same runner context before evidence-window execution.

- `LUC-405 [Soar][ARB-006][Ops]` processed `issue_children_completed` (2026-05-28): child `LUC-413` cancellation was reconciled as governance-only with no new unblock evidence; parent remains fail-closed `blocked` with unchanged owner/action gate.

- `LUC-405 [Soar][ARB-006][Ops]` processed human fail-closed recovery comment `5e0e31a2-e7f7-4b81-a2b9-2d41a45cdaea` on 2026-05-28.
  Impact was triage-only: issue remains dependency-blocked with unchanged no-mutation boundaries (no push/deploy/restart/protected smoke/production mutation/secret access).
  Minimal live checkpoint executed: `corepack pnpm run -s ops:operator-unblock:check` => `PASS` with `NO-GO: yes` and intact packet/protected-input contract.
  Disposition remains `blocked`; unblock owner/action unchanged (approved read-only principal/session for protected `GET /workers/ready` + restoration/stability of required protected-input families before `ARB6-WIN-2026-05-30-A`).

- `LUC-405 [Soar][ARB-006][Ops]` continuation wake (`issue_continuation_needed`, 2026-05-28) consumed with no new unblock trigger signal.
  In line with `history/releases/luc-405-continuation-control-addendum-2026-05-28.md`, this heartbeat executed `state-sync only` (no repetitive protected dual-check rerun).
  Disposition remains `blocked` with unchanged unblock owners/actions: approved read-only principal/session for protected `GET /workers/ready` and restoration/stability of required protected-input families before `ARB6-WIN-2026-05-30-A`.

- `LUC-405 [Soar][ARB-006][Ops]` source-scoped recovery checkpoint (2026-05-28) applied state-sync-only anti-churn reconciliation (no new unblock signals, no rerun), keeping fail-closed `blocked` status and unchanged owner/action gate.

- `LUC-405 [Soar][ARB-006][Ops]` issue_assigned heartbeat (2026-05-28) completed a trigger-safe read-only packet integrity checkpoint and remains `blocked`.
  Execution: `corepack pnpm run -s ops:operator-unblock:check` => `PASS` (`NO-GO: yes`, `Target SHA ok: yes`, packet/protected-input alignment intact).
  No new approved protected principal/session or protected-input family restoration signal was present, so repetitive dual-check reruns remained suppressed by anti-churn policy.
  Unblock owner/action unchanged: approved read-only principal/session for protected `GET /workers/ready`, then restoration/stability of required protected-input families with two consecutive non-regressing same-context readiness runs before `ARB6-WIN-2026-05-30-A`.

- `LUC-405 [Soar][ARB-006][Ops]` resume-delta `finish_successful_run_handoff` (2026-05-28) was disposition-synced to `blocked` with unchanged fail-closed contract.
  No new auth/protected-input unblock signal was present, so anti-churn trigger policy remained in force and no repetitive dual-check rerun was executed.
  Unblock owner/action unchanged: approved read-only principal/session for protected `GET /workers/ready`, then restoration/stability of required protected-input families with two consecutive non-regressing same-context readiness runs before `ARB6-WIN-2026-05-30-A`.

- `LUC-418 known-state evidence baseline (2026-05-28)` is now checkpointed and synchronized. PM captured current architecture baseline from canonical generated artifacts with no runtime mutation: `architecture-awareness.json` generated `2026-05-27T02:15:57.657Z` (`entities=7338`, `relations=14300`) and status report still showing disconnected entities `0` with inferred-proof gaps (`tests=2056`, `docs=798`). Release posture remains unchanged: V1 stays `blocked/NO-GO` on protected evidence owner path (`LUC-47` and protected proof/input owners). Evidence: `history/tasks/luc-418-known-state-evidence-architecture-baseline-2026-05-28-task.md`.

- `LUC-418 finish_successful_run_handoff (2026-05-28)` reconciled to `done` for the PM known-state baseline scope. No new blockers introduced; blocker topology for V1 remains unchanged outside this issue scope (`LUC-47` + protected evidence owners).

## 2026-05-28 LUC-431 [Soar][Source Control Closure] classify local dirty state for LUC-402
- Wake issue_assigned consumed from inline payload (fallbackFetchNeeded=false, comments 0/0, latest comment id unknown).
- Concrete action in this heartbeat:
  - classified current dirty worktree into source-control closure groups,
  - confirmed no runtime/product code drift in this lane,
  - recorded explicit commit/push/deploy disposition.
- Classification result: state/control=3, task-evidence=2, runtime/product code=0.
- Final disposition: done.
- Evidence:
  history/tasks/luc-431-source-control-closure-classify-local-dirty-state-for-luc-402-2026-05-28-task.md.

## 2026-05-28 - LUC-431 issue_commented follow-up (local sidecar closure)
- Processed board comment `827fcda9-240a-414f-a42a-71f9f9f9a4ea` as local sidecar-only scope for source-control closure.
- Revalidated current dirty-state classification with no runtime/product code mutation in lane scope.
- Recorded explicit no-commit closure disposition for this heartbeat under blocked protected-delivery dependencies.
- Evidence:
  - `history/tasks/luc-431-source-control-closure-comment-followup-2026-05-28-task.md`
  - `history/tasks/luc-431-source-control-closure-classify-local-dirty-state-for-luc-402-2026-05-28-task.md`

## 2026-05-28 - LUC-431 finish_successful_run_handoff sync
- Processed resume-delta handoff with no comment/unblock delta.
- Revalidated local source-control closure classification; lane remains state/evidence-only with no runtime/product code mutation.
- Disposition remains `done` with unchanged no-commit decision.
- Evidence:
  - `history/tasks/luc-431-source-control-closure-comment-followup-2026-05-28-task.md`
  - `history/tasks/luc-431-source-control-closure-classify-local-dirty-state-for-luc-402-2026-05-28-task.md`

- `LUC-433 [Soar][Source Control Closure]` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: classified local dirty worktree for `LUC-402` and recorded explicit source-control disposition.
  Result: `state/control=3`, `task-evidence=4`, `runtime/product code=0`; commit/push/deploy = `not committed` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-433-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-28-task.md`.

## 2026-05-28 - LUC-433 issue_commented follow-up (local repair sidecar closure)
- Processed board comment `e5003ea1-8d54-44ab-9a71-d09c8ab29391` first and treated it as sidecar-only local source-control closure scope.
- Revalidated local dirty-state classification; lane remains state/evidence-only with no runtime/product code mutation.
- Recorded explicit no-commit closure disposition under unchanged protected-gate dependency block in parent flow.
- Evidence:
  - `history/tasks/luc-433-source-control-closure-comment-followup-2026-05-28-task.md`
  - `history/tasks/luc-433-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-28-task.md`

## 2026-05-28 - LUC-433 finish_successful_run_handoff sync
- Processed resume-delta handoff with no new comment/unblock signal.
- Revalidated local source-control closure classification; lane remains state/evidence-only with `runtime/product code=0`.
- Disposition remains `done` with unchanged no-commit decision.
- Evidence:
  - `history/tasks/luc-433-source-control-closure-finish-successful-run-handoff-2026-05-28-task.md`
  - `history/tasks/luc-433-source-control-closure-comment-followup-2026-05-28-task.md`

- `LUC-442 [Soar][Source Control Closure]` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: executed local source-control classification for `LUC-402` sidecar continuity and verified clean worktree (`git status --short` returned no entries).
  Result: `state/control=0`, `task-evidence=0`, `runtime/product code=0`; commit/push/deploy = `local commit required after supervisor review` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-442-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-28-task.md`.

- `LUC-442 [Soar][Source Control Closure]` issue_commented follow-up (`2026-05-28`, comment `5f1ddcf6-aa60-47b8-b4b0-fa28be2adaca`) executed and kept `done`.
  Comment was acknowledged first and treated as sidecar-only local source-control closure scope while protected delivery for `LUC-402` remains dependency-blocked.
  Minimal checkpoint reclassified current local dirty set as lane-local docs/state only: `state/control=2`, `task-evidence=1`, `runtime/product code=0`.
  Commit/push/deploy disposition after supervisor review: `local commit required` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-442-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-28-task.md`.

- `LUC-512 [Soar][Source Control Closure]` heartbeat executed on 2026-05-28 and is `done`.
  Inline wake scope was consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
  Concrete action: executed local source-control classification for `LUC-402` sidecar continuity and verified dirty scope remains non-runtime.
  Result: `state/control=2`, `task-evidence=2`, `runtime/product code=0`; commit/push/deploy = `local commit required` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-512-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-28-task.md`.

- `LUC-512 [Soar][Source Control Closure]` issue_commented follow-up (`2026-05-28`, comment `e438c221-8225-48fc-adc7-78869518e59b`) executed and kept `done`.
  Comment was acknowledged first and treated as sidecar-only local source-control closure scope while protected delivery for `LUC-402` remains dependency-blocked.
  Minimal checkpoint reclassified current local dirty set as state/evidence/planning only: `state/control=2`, `task-evidence=3`, `runtime/product code=0`.
  Commit/push/deploy disposition: `local commit required` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-512-source-control-closure-comment-followup-2026-05-28-task.md`.

- `LUC-512 [Soar][Source Control Closure]` issue_continuation_needed sync (`2026-05-28`) executed and kept `done`.
  No new comment/unblock delta was present (`fallbackFetchNeeded=false`, comments `0/0`), so this heartbeat performed state-sync-only verification.
  Classification remained unchanged: `state/control=2`, `task-evidence=3`, `runtime/product code=0`; commit/push/deploy stays `local commit required` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-512-source-control-closure-comment-followup-2026-05-28-task.md`.

- `LUC-512 [Soar][Source Control Closure]` source_scoped_recovery_action sync (`2026-05-28`) executed and kept `done`.
  Wake payload had no new comment/unblock delta (`fallbackFetchNeeded=false`, comments `0/0`), and this heartbeat executed concrete local reclassification.
  Classification result: `state/control=2`, `task-evidence=4`, `runtime/product code=0`; commit/push/deploy stays `local commit required` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-512-source-control-closure-source-scoped-recovery-action-2026-05-28-task.md`.

- LUC-241 source-scoped recovery heartbeat (2026-05-28T15:24:52+02:00) executed concrete read-only status checkpoint and remains blocked.
  Presence scan in runner context: SMOKE_AUTH_TOKEN=False, SMOKE_AUTH_EMAIL=False, SMOKE_AUTH_PASSWORD=False, SOAR_API_TOKEN=False, SOAR_API_KEY=False, SOAR_SESSION_COOKIE=False.
  No protected /workers/ready rerun was allowed because required auth artifact class is absent.
  Unblock owner/action unchanged: Soar auth credential owner + Security/Test secret-ref owner restore approved SMOKE_AUTH_*, then Ops executes exactly one read-only protected recheck and publishes evidence + rollback-impact note.

- `LUC-516 known-state evidence baseline (2026-05-28)` is now checkpointed and synchronized. PM captured current architecture baseline from canonical generated artifacts with no runtime mutation: `architecture-awareness.json` generated `2026-05-27T02:15:57.657Z` (`entities=7338`, `relations=14300`) and status report still showing disconnected entities `0` with inferred-proof gaps (`tests=2056`, `docs=798`). Release posture remains unchanged: V1 stays `blocked/NO-GO` on protected evidence owner path (`LUC-47` and protected proof/input owners). Evidence: `history/tasks/luc-516-known-state-evidence-architecture-baseline-2026-05-28-task.md`.

- `LUC-516 finish_successful_run_handoff (2026-05-28)` reconciled to `done` after read-only baseline recheck; metrics remained stable (`generatedAt=2026-05-27T02:15:57.657Z`, `entities=7338`, `relations=14300`) and blocker topology stayed unchanged (`LUC-47` + protected proof/input owners). Evidence: `history/tasks/luc-516-known-state-evidence-architecture-baseline-2026-05-28-task.md`.

- `LUC-579 known-state evidence baseline (2026-05-29)` is now checkpointed and synchronized. PM captured current architecture baseline from canonical generated artifacts with no runtime mutation: `architecture-awareness.json` generated `2026-05-27T02:15:57.657Z` (`entities=7338`, `relations=14300`) and status report still showing disconnected entities `0` with inferred-proof gaps (`tests=2056`, `docs=798`). Release posture remains unchanged: V1 stays `blocked/NO-GO` on protected evidence owner path (`LUC-47` and protected proof/input owners). Evidence: `history/tasks/luc-579-known-state-evidence-architecture-baseline-2026-05-29-task.md`.

- `LUC-579 finish_successful_run_handoff (2026-05-29)` reconciled to `done` after read-only baseline recheck; metrics remained stable (`generatedAt=2026-05-27T02:15:57.657Z`, `entities=7338`, `relations=14300`) and blocker topology stayed unchanged (`LUC-47` + protected proof/input owners). Evidence: `history/tasks/luc-579-known-state-evidence-architecture-baseline-2026-05-29-task.md`.

## 2026-05-29 LUC-616 ARB-001 activation-scope decision packet (Product lane)
- Wake `issue_assigned` was consumed first from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action: published Product decision packet `history/plans/luc-616-arb-001-activation-scope-decision-2026-05-29.md` and added decision register row `DEC-ARB-001`.
- Decision outcome: Soar V1 keeps assistant runtime hot-path orchestration deactivated for `BACKTEST/PAPER/LIVE`; foundation + dry-run remains the active scope.
- Gate routing: `in_review` with CTO as named reviewer before any AI Runtime/Security activation implementation child issues.
- Runtime/deploy mutation: none.

- `LUC-636 [Soar][Source Control Closure]` source_scoped_recovery_action sync (`2026-05-29`) executed and kept `done`.
  Wake payload had no new comment/unblock delta (`fallbackFetchNeeded=false`, comments `0/0`), and this heartbeat executed concrete local reclassification.
  Classification remains `state/control=4`, `task-evidence=2`, `runtime/product code=0`; commit/push/deploy stays `not committed` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-636 [Soar][Source Control Closure]` issue_reopened_via_comment resolution (`2026-05-29`) executed and kept `done`.
  Wake comment `a448a445-0f2c-4683-9386-6fe5011e8d77` explicitly cleared board-level missing-disposition stall for local source-control closure (`project_source_control_closure_needed`) while protected delivery remained fail-closed.
  Concrete local reclassification confirmed `current` dirty set is state/control + task-evidence only, `stale=none`, `out-of-scope runtime/product code=none`.
  Numeric summary remained `state/control=4`, `task-evidence=2`, `runtime/product code=0`; commit/push/deploy stayed `not committed` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

- `LUC-636 [Soar][Source Control Closure]` finish_successful_run_handoff post-reopen sync (`2026-05-29`) executed and kept `done`.
  Wake had no new comment delta (`0/0`) and triggered concrete local recheck with touched-routes reconciliation.
  Confirmed no `server/workers/frontend` and no `.github/workflows/ci.yml` mutation in this lane; dirty scope stayed state/control + task-evidence only.
  Classification remained `current` only (`state/control=4`, `task-evidence=2`), with `stale=none` and `out-of-scope runtime/product code=none`; commit/push/deploy stayed `not committed` / `not needed` / `none`.
  Evidence:
  `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`.

## 2026-05-29 LUC-636 [Soar][Source Control Closure] source_scoped_recovery_action disposition-closure sync
- Wake `source_scoped_recovery_action` consumed first from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action:
  - reran local dirty-state verification (`git status --short`, `git diff --name-only`),
  - synced closure evidence for final disposition on this recovery wake.
- Classification remains:
  - `state/control=4`
  - `task-evidence=2`
  - `runtime/product code=0`
- Closure disposition:
  - commit: `not committed`
  - push: `not needed`
  - deploy impact: `none`
- Final disposition: `done`.
- Evidence:
  - `history/tasks/luc-636-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-29-task.md`

- `LUC-386` reconciliation (2026-05-29): child gate issue `LUC-633` is `done` and confirms `DEC-ARB-002`. Current ARB-002 scope remains complete for scaffold-only mobile docs/registry coverage; any new mobile module doc expansion is blocked by design until Product/CTO-approved mobile runtime activation is explicitly started.

- `LUC-386` continuation reconciliation (2026-05-29): validated local dirty scope is docs/state-only (`.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`). No runtime/product-code mutation is present in this lane; continuation-summary touched entries `server/workers/frontend` and `.github/workflows/ci.yml` are not actionable for current docs-memory scope. Status remains `done` pending explicit Product/CTO mobile runtime activation.


- `LUC-405 [Soar][ARB-006][Ops]` wake `issue_blockers_resolved` (2026-05-29) was validated with live evidence and remains `blocked`.
  `ops:protected-inputs:check` for `2026-05-29` stayed `PARTIAL` (`matching names=9`; required families still missing), while `ops:operator-unblock:check` stayed `PASS` with `NO-GO: yes`.
  Conclusion: unblock claim is not yet confirmed; owner/action contract remains unchanged before `ARB6-WIN-2026-05-30-A`.

- `LUC-405 [Soar][ARB-006][Ops]` continuation wake on 2026-05-29 (`issue_continuation_needed`) was handled via artifact-based anti-churn verification and remains `blocked`.
  Latest readiness artifacts still report `PARTIAL` / `NO-GO` with missing required protected families, so unblock contract remains unchanged.

- `LUC-405 [Soar][ARB-006][Ops]` source-scoped recovery checkpoint on 2026-05-29 validated latest artifact presence (`PARTIAL`, `NO-GO`, matching names `9`) with unchanged missing protected families; anti-churn no-rerun state-sync applied and disposition stays `blocked`.
