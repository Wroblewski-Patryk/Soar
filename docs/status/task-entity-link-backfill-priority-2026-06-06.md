# Task Entity Link Backfill Priority - 2026-06-06

Source reports:

- `docs/status/task-synchronization-report.md`
- `docs/status/architecture-awareness-report.md`
- `docs/graphs/architecture-awareness.json`

## Current Signal

The 2026-06-06 awareness sync reports:

- Tasks without architecture links: 1077
- Implementation entities without task links: 988
- Verified entities without proof evidence: 0

This is documentation and memory hygiene drift. It does not currently indicate
missing proof evidence, but it does make it harder for agents to answer which
task last changed a feature/module/chain and which task should own follow-up
maintenance.

## Backfill Priority

Backfill task-to-entity links in this order:

1. Runtime, trading, exchange, wallet, position, order, strategy, market,
   backtest, report, and log tasks.
   - Export signal: about 288 historical task records match this family.
   - Reason: these cover money-facing and runtime-critical behavior where
     stale task ownership creates the highest operator risk.
   - Link targets: relevant `SOAR-WORKFLOW-*` chain nodes, API/service/test
     nodes, and module docs.

2. Deployment, Coolify, production freshness, release, migration, and service
   stack tasks.
   - Export signal: about 310 historical task records match this family.
   - Reason: these records decide whether local truth, VPS readiness, and
     release gates are current.
   - Link targets: deployment/runtime-service reference docs, release tooling
     chain nodes, service-stack notes, and production evidence records.

3. Dashboard, web UI, route, browser proof, form, panel, and view tasks.
   - Export signal: about 176 historical task records match this family.
   - Reason: these are the operator-facing surface area and are likely to be
     consulted during personal-use readiness checks.
   - Link targets: page/component nodes, route map rows, web journey index
     rows, and browser evidence records.

4. Testing, audit, security, permission, isolation, guardrail, and validation
   tasks.
   - Export signal: about 127 historical task records match this family.
   - Reason: these records explain why confidence was granted or withheld.
   - Link targets: test nodes, proof register rows, guardrail scripts, and
     security/privacy architecture notes.

5. Auth, profile, admin, subscription, user, session, and API-key tasks.
   - Export signal: about 61 historical task records match this family.
   - Reason: these are subscription-readiness and account-boundary surfaces.
   - Link targets: auth/profile/admin/subscription API nodes, entitlement
     reference contracts, and access-control test nodes.

6. Architecture graph, traceability, awareness, drift, and backfill tasks.
   - Export signal: about 27 historical task records match this family.
   - Reason: these tasks govern the graph itself and should be normalized after
     the highest-risk product/runtime families are linked.
   - Link targets: architecture graph system doc, graph generation scripts,
     registry files, chain records, and status reports.

7. Assistant, agent-system, protocol harness, coordinator, and prompt tasks.
   - Export signal: about 10 historical task records match this family.
   - Reason: these are important for agent continuity, but current operator and
     runtime confidence depends first on product, deploy, and proof links.
   - Link targets: assistant runtime contracts, agent registry rows, prompts,
     and protocol harness tests.

The family counts are overlapping keyword triage counts from
`docs/graphs/architecture-awareness.json`, not final ownership totals. Use them
to choose a first pass, then promote exact relations into the graph registries
or task metadata during actual backfill.

## Repeatable Rule For Future Task Files

Every new task file under `history/tasks/` must include a traceability block
near the header before the task is considered complete:

```markdown
## Architecture Links

- Primary feature/module:
- Architecture nodes:
- Function chains:
- Affected files:
- Tests/proof:
- Docs updated:
```

Rules:

- `Primary feature/module` must name the canonical feature or module, not just
  `Soar`.
- `Architecture nodes` should list stable graph node IDs or node file paths
  from `docs/architecture/nodes/`.
- `Function chains` should list affected `docs/architecture/chains/` records
  when the task changes user-facing, runtime, API, or proof behavior.
- `Affected files` should name code, test, docs, config, script, or migration
  paths touched by the task.
- `Tests/proof` should link command, browser, deployment, or accepted
  limitation evidence.
- `Docs updated` should list the canonical docs changed or explicitly state
  `none - no behavior/docs contract changed`.

Historical backfill should add this block to the task file when the task is
still likely to be consulted. For low-value archival tasks, prefer adding graph
registry/task relation rows or a short backfill note rather than rewriting every
old file.

## Next Backfill Slice

Start with a bounded runtime/deployment sample:

- choose 10 runtime/money-facing tasks and 10 deployment/freshness tasks from
  `history/tasks/`;
- add the `Architecture Links` block or equivalent graph relations;
- regenerate awareness reports;
- confirm the task-link counts move before expanding the batch size.

## Backfill Slice 2 Result - 2026-06-06

Issue: [LUC-2496](/LUC/issues/LUC-2496)

Selected runtime/money-facing task files:

- `history/tasks/botmulti-00-planning-task-2026-04-29.md`
- `history/tasks/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`
- `history/tasks/botmulti-03-canonical-topology-migration-task-2026-05-03.md`
- `history/tasks/botmulti-07-web-operator-multi-strategy-truth-task-2026-05-03.md`
- `history/tasks/botmulti-08-architecture-runtime-closure-task-2026-05-03.md`
- `history/tasks/botmulti-09-containment-supersede-00169d7f-2026-05-12-task.md`
- `history/tasks/botmulti-09-current-production-containment-task-2026-05-09.md`
- `history/tasks/botmulti-09-production-deploy-task-2026-05-03.md`
- `history/tasks/dashboard-runtime-signal-condition-active-2026-05-25-task.md`
- `history/tasks/backtest-non-binance-order-book-fail-closed-2026-05-23-task.md`

Selected deployment/freshness task files:

- `history/tasks/current-executable-v1-boundary-3c5da343-task-2026-05-09.md`
- `history/tasks/current-focus-4ee1672e-sync-task-2026-05-09.md`
- `history/tasks/deploy-freshness-55469cdc-task-2026-05-09.md`
- `history/tasks/deploy-freshness-6c54bb5d-task-2026-05-09.md`
- `history/tasks/deploy-freshness-90cd07d6-task-2026-05-08.md`
- `history/tasks/deploy-freshness-9c125683-task-2026-05-10.md`
- `history/tasks/deploy-freshness-ba3d852d-task-2026-05-09.md`
- `history/tasks/deploy-freshness-c50e1e7c-task-2026-05-09.md`
- `history/tasks/deploy-freshness-e8cd748e-task-2026-05-09.md`
- `history/tasks/deploy-lag-1f1d9c12-task-2026-05-09.md`

Before regeneration:

- Tasks without architecture links: 1077
- Implementation entities without task links: 983
- Verified entities without proof evidence: 0

After regeneration (`2026-06-06T16:24:34.647Z`):

- Tasks without architecture links: 1061
- Implementation entities without task links: 979
- Verified entities without proof evidence: 0

Verification:

- `node scripts/build-architecture-awareness-index.mjs --project Soar --root ../Soar` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` passed.
- All selected task files are absent from `docs/status/task-synchronization-report.md` under `## Tasks Without Architecture Links`.
- `git diff --check` on selected task files and refreshed graph/status exports reported no whitespace errors; Git only emitted line-ending normalization warnings.

## Backfill Slice 3 Result - 2026-06-07

Issue: [LUC-2868](/LUC/issues/LUC-2868)

Selected architecture-graph task files:

- `history/tasks/architecture-evidence-graph-system-2026-05-24-task.md`
- `history/tasks/architecture-graph-api-platform-safety-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-api-support-routes-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-auth-session-deep-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-backtests-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-bot-setup-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-full-drift-closure-2026-05-24-task.md`
- `history/tasks/architecture-graph-logs-audit-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-markets-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-ops-config-pipeline-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-profile-api-keys-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-reports-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-runtime-support-services-backfill-2026-05-24-task.md`
- `history/tasks/architecture-graph-strategies-backfill-2026-05-24-task.md`

Before/after signal:

- Before this slice: `docs/status/task-synchronization-report.md` reported
  `121` tasks without architecture links at `2026-06-07T16:12:55.932Z`.
- A partial scanner output during this slice reported `109` tasks without
  architecture links at `2026-06-07T16:22:29.154Z`.
- The full scanner command
  `node scripts/build-architecture-awareness-index.mjs --project Soar --root ../Soar`
  timed out twice from the Paperclip workspace after 124 seconds and 304
  seconds, so the exact final generated report should be refreshed in a later
  scanner-health or longer-running graph sync lane.

Verification:

- Targeted parser check confirmed all 14 selected task files now contain a
  parseable `## Architecture Links` block with at least one concrete graph node
  ID and at least one repo path reference.
- `git diff --check` on the 14 selected task files reported no whitespace
  errors; Git only emitted line-ending normalization warnings.

Residual risk:

- This was a documentation traceability backfill only. It did not change
  runtime behavior, run product journeys, or prove production behavior.
- Remaining task-link drift is still present in older runtime, deployment,
  Coolify, source-control, and no-stall task records.
