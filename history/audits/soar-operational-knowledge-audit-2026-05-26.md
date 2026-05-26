# Soar Operational Knowledge Audit

Generated: 2026-05-26

## Purpose

This audit checks whether Soar has the project-knowledge foundation needed for
Paperclip Softwarehouse agents to develop the application without guessing:
project scan, architecture map, product map, proof links, guardrails, regression
signals, and next-work routing.

## Executive Status

Status: **PARTIAL / NO-GO for V1 release**

The knowledge system is largely implemented and refreshable. The required
template backbone files exist, architecture and journey indexes generate, docs
parity passes, and repository guardrails pass. However, the project is not at
100% known/verified status because current generated evidence still reports:

- V1 release status: `NO-GO`
- Function journey index: `0` critical gaps, `28` high gaps
- User action index: `0` critical gaps, `37` high gaps
- Static issue scan: `1` P1 queue/status finding
- V1 master ledger: `NO-GO`, finding bucket `toClassifyQueue`
- V1 completion scorecard: implementation/evidence/release readiness currently
  evaluates to `0%` because the V1 module/action ledger does not contain
  accepted release-ready module rows for scoring.

## What Was Scanned

- Root project structure: apps, docs, history, libs, public, scripts, temporary
  folders, compose files, env examples, workspace files, and project policies.
- Documentation backbone under `docs/`.
- Architecture registry, relations, chains, graph exports, and status reports.
- Product, planning, pipeline, automation, operations, release, quality,
  security, UX, and governance docs.
- History directories for audits, evidence, tasks, releases, operations, plans,
  and artifacts through project-native generators.
- Project scripts and package commands.
- Current task board/status evidence used by static issue scan.

## Required Foundation Coverage

All required files from the takeover prompt are present:

- `docs/documentation-map.md`
- `docs/architecture/codebase-map.md`
- `docs/architecture/architecture-evidence-graph-system.md`
- `docs/architecture/traceability-matrix.md`
- `docs/architecture/registry/*.csv`
- `docs/architecture/relations/dependencies.csv`
- `docs/architecture/chains/chains.csv`
- `docs/product/problem-statement.md`
- `docs/product/user-model.md`
- `docs/product/capability-map.md`
- `docs/product/success-metrics.md`
- `docs/product/non-goals.md`
- `docs/planning/idea-ledger.csv`
- `docs/pipelines/pipeline-registry.md`
- `docs/status/architecture-map-status.md`
- `docs/quality/quality-attribute-scenarios.md`
- `docs/automation/tooling-contract.md`
- `docs/automation/agent-command-catalog.csv`
- `docs/automation/guardrail-commands.md`
- `docs/operations/environment-matrix.md`
- `docs/operations/service-topology.md`
- `docs/releases/release-train.md`
- `history/audits/`, `history/evidence/`, and `history/tasks/`

Template sync scan passed for the expected backbone: all scanned destinations
already exist.

## Commands Run

Fresh command evidence:

| Command | Result | Evidence |
| --- | --- | --- |
| `.\scripts\template-sync.ps1 -Mode scan -TemplateRoot C:\Personal\Projekty\Aplikacje\!template -TargetRoot C:\Personal\Projekty\Aplikacje\Soar` | PASS | All backbone destinations present. |
| `pnpm run architecture:graph:generate` | PASS | `645` nodes, `804` relations, `27` chains. |
| `pnpm run architecture:graph:drift:strict` | PASS | `809/809` covered, `0` missing. |
| `pnpm run architecture:journey:index:strict` | PASS with high gaps | `27` chains, `36` web journeys, `96` API surfaces, `0` critical gaps, `28` high gaps; user actions `39`, `0` critical, `37` high. |
| `pnpm run docs:parity:check` | PASS | API `22/22`, Web `16/16`, Routes `37/37`, no missing/stale docs. |
| `pnpm run quality:guardrails` | PASS | Repository guardrails passed. |
| `pnpm run ops:project:known-state` | PASS / NO-GO output | Generated project index, static scan, V1 master ledger, and V1 scorecard. |

## Fix Applied During Audit

`scripts/runV1StaticIssueScan.mjs` now reads the project index JSON with retry
logic. This prevents a race where agents start `ops:project:scan` while
`ops:project:index` is still writing the JSON file.

New command added:

- `pnpm run ops:project:known-state`

This command serializes the known-state pipeline:

1. architecture graph generate
2. architecture graph drift strict
3. journey index strict
4. docs parity
5. repository guardrails
6. project index
7. static issue scan
8. V1 master state ledger
9. V1 completion scorecard

Agents should prefer this command before broad autonomous handoff instead of
running dependent commands in parallel.

## What Works

- Documentation backbone exists and is discoverable from
  `docs/documentation-map.md`.
- Architecture graph generation works.
- Architecture graph strict drift check passes with zero missing representative
  paths.
- Journey/user-action indexes generate and have no critical gaps.
- Docs parity passes for current API/Web/routes inventory.
- Repository guardrails pass.
- Project index, static scan, V1 ledger, and V1 scorecard can be generated in a
  safe sequence.
- History/evidence/task folders are populated and separated from canonical docs.

## What Does Not Yet Work Or Is Not Proven

- V1 release is not proven ready: generated release state is `NO-GO`.
- `history/audits/v1-static-issue-scan-2026-05-26.md` reports `17` unchecked
  queue markers in `.codex/context/TASK_BOARD.md`.
- `history/audits/v1-master-state-ledger-2026-05-26.md` has no populated module
  next-work rows; the current concrete gap is queue classification.
- `history/releases/v1-completion-scorecard-2026-05-26.md` reports `0%`
  implementation/evidence/release readiness because scored module rows are not
  available.
- Protected production proof, auth-sensitive browser proof, Coolify worker
  recovery, and release gates remain outside this local-only refresh.

## Critical Current Blockers

1. `LUC-181` / `workers-market-stream` operator gate remains the production
   blocker in Paperclip. Do not bypass it from this repository.
2. `.codex/context/TASK_BOARD.md` still contains unchecked queue rows that must
   be classified as active, blocked, done/historical, duplicate, or superseded.
3. High proof gaps remain in function journey and user-action indexes. They are
   not critical generator failures, but they are exactly the proof work that
   prevents "100% known status".

## Next Work Order

1. Classify the `17` unchecked queue markers in `.codex/context/TASK_BOARD.md`.
   For each marker, set one of: active, blocked, done/historical, duplicate, or
   superseded, with evidence link.
2. Re-run `pnpm run ops:project:known-state`.
3. If V1 ledger still has no module rows, repair the ledger input mapping so
   product/action matrix rows feed the scorecard.
4. Convert the `28` function-journey high gaps and `37` user-action high gaps
   into owner-lane follow-ups: Frontend/UX browser states, Backend/API proofs,
   QA repeatable smoke, Security protected boundary, Ops production gate.
5. Keep Coolify/production mutation blocked until Paperclip resolves `LUC-181`.
6. After each lane closes, refresh docs/status and root portfolio index.

## Next Agent First Step

Open `history/audits/v1-static-issue-scan-2026-05-26.md`, then
`.codex/context/TASK_BOARD.md` around the listed lines. Classify the `17`
unchecked queue markers before changing application code. The project cannot be
called "known" while the queue truth is ambiguous.
