# Task Contract

## Context
- Issue: `LUC-1148` continuation from comment `73477930-b96b-43d4-a18c-2a267afc9f1f` (`softwarehouse-local-repair-lane-starter:v1`).
- Lane objective: classify and close current local dirty state for `LUC-241/LUC-1144/LUC-1145/LUC-1146` source-control closure lineage.
- Wake constraint: local-only repair allowed; push/deploy/protected operations forbidden.

## Goal
Classify the active dirty set (`current/stale/out-of-scope`), run minimal safe validation, and produce a commit/no-commit closure decision with evidence.

## Constraints
- No push/deploy/restart/protected smoke.
- No secret disclosure.
- Keep scope to local source-control closure and durable evidence.

## Definition of Done
- Dirty paths are classified with lane ownership.
- Validation commands/results are recorded.
- Commit/no-commit decision is explicit and justified.
- Canonical context files reflect this heartbeat.

## Forbidden
- Runtime/product code edits.
- Protected account or credential actions.
- Deploy/release mutation.

## Stage
`verification` -> `source-control closure`

## Capability Chain / Affected Files
Current dirty paths at heartbeat start (`git status --short --branch`):
- `.agents/state/active-mission.md`
- `.agents/state/system-health.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/graphs/architecture-awareness.csv`
- `docs/graphs/architecture-awareness.json`
- `docs/graphs/architecture-graph.md`
- `docs/graphs/architecture-graph.mmd`
- `docs/status/architecture-awareness-report.md`
- `docs/graphs/architecture-health.json` (new)
- `docs/graphs/architecture-proof-register.csv` (new)
- `docs/status/architecture-dependency-report.md` (new)
- `docs/status/architecture-ownership-report.md` (new)
- `docs/status/task-synchronization-report.md` (new)
- `history/tasks/luc-1154-known-state-refresh-evidence-delta-and-next-repair-lanes-2026-05-31-task.md` (new)

Classification:
- `current/in-scope for closure`: all above paths are docs/state/evidence artifacts from known-state refresh lineage (`LUC-1154`) and are valid for local source-control closure under `LUC-1148` sidecar policy.
- `stale`: none.
- `out-of-scope runtime/product`: none.

## Validation Commands And Results
- `git status --short --branch` -> dirty set present; branch `main...origin/main [ahead 15]`.
- `git diff --name-status` -> only `.agents/.codex/docs/history` files.
- `git log --oneline -n 12` -> prior `LUC-1148` closure commit chain confirmed (`505c2b65`, `161a0062`, `b79705c1`, `7fdc4907`).
- `git diff -- docs/graphs/... docs/status/...` -> generated architecture-awareness/report deltas only.

Validation outcome: PASS for source-control closure lane (no runtime code, no protected action, no secret-bearing scope detected).

## Regression Risk And Follow-up Gaps
- Runtime regression risk: low (no runtime/product code changed).
- Process risk: medium if left uncommitted (would violate closure hygiene while issue is active).
- Follow-up gap: push/redeploy remains explicitly out of scope for this lane.

## Commit / No-Commit Decision
- Decision: `commit`.
- Rationale: dirty set is docs/history/evidence/context/agent-state only; closure contract requires one local commit instead of leaving this set uncommitted.

## Result Report
- Local source-control closure packet recorded and committed in this heartbeat.
- Push: not performed (forbidden by wake constraints).
- Deploy impact: none.
