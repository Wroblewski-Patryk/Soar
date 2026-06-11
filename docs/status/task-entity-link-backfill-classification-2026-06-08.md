# Task Entity Link Backfill Classification - 2026-06-08

Issue: [LUC-2952](/LUC/issues/LUC-2952)

Source files reviewed:

- `docs/status/task-synchronization-report.md`
- `docs/graphs/architecture-health.json`
- `docs/graphs/architecture-awareness.json`
- `docs/graphs/architecture-graph.json`
- `docs/status/architecture-awareness-report.md`
- `docs/status/task-entity-link-backfill-priority-2026-06-06.md`

## Source Signal

The current generated task synchronization report is dated
`2026-06-07T22:12:46.871Z`. The originating Paperclip issue described an older
`2026-06-07T22:06:01.945Z` report, so this classification uses the newer local
export.

Current signals:

- Tasks without architecture links: 109.
- Implementation entities without task links: 659.
- Verified entities without proof evidence: 0.

The report Markdown prints only the first 80 items for each gap section. Exact
counts were taken from `docs/graphs/architecture-health.json`; classification
used the full graph plus curated coverage from `docs/graphs/architecture-graph.json`.

## Classification

### Tasks Without Architecture Links

| Category | Count | Decision |
| --- | ---: | --- |
| Duplicate/noise or process-only operational tasks | 73 | Do not backfill individually unless a linked release gate needs the task. Most are no-stall, source-control, Coolify-team confirmation, blocked-disposition, or operator-access artifacts. |
| Miscellaneous historical docs/process tasks | 18 | Low priority. Backfill only when a future owner consults the task for current Soar truth. |
| Runtime, trading, bot, market, backtest, or live-exchange tasks | 12 | Real backfill work. Add `## Architecture Links` blocks or graph relations to connect these to runtime/money chains. |
| QA, proof, regression, or conformance tasks | 5 | Real backfill work. Link to test/proof nodes and acceptance-matrix or smoke chains. |
| Graph-governance task already carrying an architecture block in the dirty worktree | 1 | Stale generated report or parser mismatch. Re-run scanner before editing this task again. |

Affected task patterns that still need bounded backfill:

- Runtime/money: `live-bot-symbol-overlap-guard`, bot signals, worker runtime
  readiness, protected route/action proof, and related trading-scope tasks.
- QA/proof: V1 conformance, acceptance-matrix, and executable regression proof
  records.
- Ops/process noise: `confirm-coolify-team-workspace`, source-control closure,
  no-stall queue expeditor, blocked-disposition, and deploy/restart decision
  records. These should stay low-value archival unless they become release-gate
  evidence.

### Implementation Entities Without Task Links

| Category | Count | Decision |
| --- | ---: | --- |
| Already covered by curated architecture graph paths | 342 | No immediate task backfill required. These entities are represented by curated nodes/chains but lack direct historical task edges. |
| Uncovered route/component/API/model/feature entities | 317 | Split into bounded child backfill lanes by ownership and risk. |

Uncovered implementation family split:

| Family | Count | Decision |
| --- | ---: | --- |
| Miscellaneous generated or low-level docs/process feature/model/route entries | 246 | Treat as metadata noise unless a future graph rule promotes them. Do not create implementation work item per entity. |
| Runtime, trading, exchange, bot, order, market, strategy, backtest, or wallet | 43 | Real backfill lane. Link to runtime/money chains and the highest-signal historical task records. |
| Auth, account, security, admin, subscription, API-key, profile, or session | 15 | Real backfill lane. Link to auth/security/account chains and proof records. |
| Graph-governance or traceability tooling | 6 | Docs-owned backfill lane, after scanner refresh confirms whether current dirty graph blocks are already parsed. |
| QA/proof tooling | 4 | Real backfill lane, likely paired with test/proof task backfill. |
| Ops/release tooling | 2 | Defer to Ops only if the release gate needs exact lineage. |
| Mobile scope | 1 | Defer unless mobile parity scope is promoted from documentation to active V1 implementation. |

## Backfill Decision

Do not rewrite all 109 task files or all 659 implementation entities. The safe
path is:

1. Re-run the Soar architecture scanner to eliminate stale report rows created
   by already-present `## Architecture Links` blocks in the dirty worktree.
2. Create bounded follow-up issues for the remaining real link-backfill
   families:
   - runtime/money task and implementation links;
   - auth/security/account implementation links;
   - QA/proof task and implementation links;
   - graph-governance parser or metadata reconciliation if the scanner still
     reports tasks that already contain valid architecture blocks.
3. Leave process-only operational artifacts and low-level generated entities as
   classified noise unless they become current release-gate evidence.

## Verification

- `docs/graphs/architecture-health.json` readback confirmed:
  - `tasks_without_architecture.count = 109`
  - `implementation_without_task.count = 659`
  - `verified_without_proof.count = 0`
- Local graph classification script derived the category counts above from
  `docs/graphs/architecture-awareness.json` and curated path coverage from
  `docs/graphs/architecture-graph.json`.

No product code, secrets, deployment, restart, protected smoke, or runtime
mutation was touched by this classification.

## Runtime/Money Backfill Result - LUC-2965

Issue: [LUC-2965](/LUC/issues/LUC-2965)

Affected task files updated with scanner-readable `## Architecture Links`
blocks:

- `history/tasks/live-bot-symbol-overlap-guard-task-2026-04-28.md`
- `history/tasks/luc-1167-soar-bot-signals-verify-active-bot-signal-dashboard-semantics-2026-05-31-task.md`
- `history/tasks/luc-181-workers-market-stream-operator-log-root-cause-packet-2026-05-26-task.md`
- `history/tasks/luc-19-protected-input-readiness-refresh-2026-05-26-task.md`
- `history/tasks/luc-19-runtime-readiness-refresh-2026-05-26-task.md`
- `history/tasks/luc-19-worker-proof-auth-gate-2026-05-26-task.md`
- `history/tasks/luc-2368-decompose-bot-runtime-aggregate-read-model-monoliths-2026-06-06-task.md`
- `history/tasks/luc-2380-close-post-2374-dirty-api-runtime-diff-before-push-permit-2026-06-06-task.md`
- `history/tasks/luc-2381-resolve-dirty-runtime-monitoring-source-state-blocking-4787ee98-promotion-2026-06-06-task.md`
- `history/tasks/luc-2799-workers-ready-smoke-principal-gate-blocked-disposition-2026-06-07-task.md`
- `history/tasks/v1-runtime-non-binance-derivatives-adapter-2026-05-13-task.md`
- `history/tasks/v1-runtime-ticker-and-backtest-venue-ui-2026-05-13-task.md`

Runtime/money architecture families named in those blocks:

- live bot market-group symbol overlap and bot signal semantics;
- worker runtime readiness, market-stream subscriptions, and protected worker
  gates;
- protected route/action proof inputs and production proof boundaries;
- Bot Runtime aggregate/session-position read models and runtime monitoring
  source-control closure;
- exchange public market-data fallback, runtime ticker fallback, Backtest venue
  display, and non-Binance derivatives adapter boundaries.

Missing-node and deferred patterns:

- The selected tasks linked to existing `SOAR-*` node files and current
  pipeline/reference docs; no new graph node files were required in this safe
  docs-only pass.
- Low-value archival source-control, no-stall, Coolify-team confirmation, and
  blocked-disposition noise remains deferred unless a future release gate needs
  exact lineage.
- Auth/security/account implementation links and QA/proof implementation links
  remain separate backfill families from the LUC-2952 classification and were
  not expanded into this runtime/money lane.

Verification:

- Targeted parser readback confirmed all 12 selected task files contain a
  parseable `## Architecture Links` block with at least one concrete
  `docs/architecture/nodes/SOAR-*.md` path and one repo path.
- `git diff --check` on the selected task/status files reported no whitespace
  errors; Git emitted LF/CRLF normalization warnings only.
- Full scanner refresh passed:
  `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  from `C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse`.
- Refreshed `docs/status/task-synchronization-report.md` generated
  `2026-06-07T22:41:40.784Z` reports:
  - tasks without architecture links: `96` (down from `109`);
  - implementation entities without task links: `464` (down from `659`);
  - verified entities without proof evidence: `0`.
- All 12 selected task paths are absent from the refreshed
  `tasks_without_architecture` signal.

## Auth/Security And QA/Proof Backfill Result - LUC-2966

Issue: [LUC-2966](/LUC/issues/LUC-2966)

Affected auth/account/security/admin/profile/subscription/session
implementation files linked through scanner-readable task evidence:

- Auth API routes: `apps/api/src/modules/auth/auth.routes.ts#/login`,
  `#/logout`, `#/me`, and `#/register`.
- Admin/API router mounts: `apps/api/src/router/admin.routes.ts#/`,
  `#/subscriptions/plans`, `#/users`, `apps/api/src/router/index.ts#/admin`,
  and `apps/api/src/router/index.ts#/auth`.
- Profile router mounts:
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys`,
  `#/profile/basic`, `#/profile/security`, and `#/profile/subscription`.
- Web auth/admin/profile surfaces:
  `AdminLayoutShell`, `PasswordVisibilityToggle`, `ApiKeysList`, `BasicForm`,
  `Subscription`, `ProfileButton`, profile hooks/services, auth service, and
  admin/auth locale namespace files.

QA/proof task files updated with scanner-readable `## Architecture Links`
blocks:

- `history/tasks/luc-1189-soar-v1-conformance-test-automation-worker-turn-acceptance-matrix-rows-into-executable-regression-checks-2026-06-01-task.md`
- `history/tasks/luc-37-c-journey-verification-and-qa-2026-05-25-task.md`
- `history/tasks/luc-45-d-security-boundary-readonly-proof-2026-05-25-task.md`
- `history/tasks/luc-67-qa-verify-matched-strategy-signal-blocked-execution-reason-2026-05-25-task.md`
- `history/tasks/luc-963-regression-proof-dca-before-close-2026-05-31-task.md`

New scanner-readable task record:

- `history/tasks/luc-2966-auth-security-qa-proof-task-entity-link-backfill-2026-06-08-task.md`

Link targets include:

- Auth/session, profile API-key, subscription-admin, and API platform safety
  architecture nodes/chains.
- V1 conformance, acceptance-matrix, security boundary, runtime signal, and
  DCA-before-close proof records.
- Existing local test/proof files only; no protected smoke or production proof
  was run or claimed.

Verification:

- Targeted parser readback confirmed the new LUC-2966 task record and five
  QA/proof task files contain parseable `## Architecture Links` blocks with
  concrete `docs/architecture/nodes/SOAR-*.md` paths and repo paths.
- Full scanner refresh passed:
  `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  from `C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse`.
- Refreshed `docs/status/task-synchronization-report.md` generated
  `2026-06-07T22:51:33.669Z` reports:
  - tasks without architecture links: `91` (down from `96`);
  - implementation entities without task links: `422` (down from `464`);
  - verified entities without proof evidence: `0`.
- All six selected task paths are absent from the refreshed
  `tasks_without_architecture` signal, and the auth/account/security/admin/
  profile/subscription/session subset is absent from the visible refreshed
  `implementation_without_task` signal.
