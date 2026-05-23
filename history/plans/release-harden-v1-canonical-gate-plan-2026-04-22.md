# RELEASE-HARDEN-A V1 Canonical Release Gate Plan (2026-04-22)

Status: Closed 2026-04-22  
Wave: `RELEASE-HARDEN-A`

## Objective

Replace ad hoc release command recall with one canonical `v1` release gate entry
that executes the minimum required quality, smoke, runtime-freshness, and
rollback-guard checks in deterministic order.

## Why This Wave Exists

The repository already had the individual pieces for release hardening, but the
operator still had to remember several separate commands and their intended
order. That creates avoidable drift risk during real release work.

## Governing Sources

- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/operations/v1-release-candidate-checklist.md`
- `docs/operations/v1-rc-external-gates-runbook.md`

## Task Packets

### RELEASE-HARDEN-A-01 docs(contract): freeze one canonical V1 release gate entrypoint

Acceptance:

- one operator-facing release gate command is declared canonical
- gate order is explicit and justified

### RELEASE-HARDEN-A-02 chore(ops-scripts): add a single orchestration script for V1 release gating

Acceptance:

- one script orchestrates existing guardrails/build/smoke/runtime/rollback gates
- script supports dry-run rehearsal
- script reuses existing auth passthrough options instead of inventing a new auth model

### RELEASE-HARDEN-A-03 docs(sync): align release checklist and smoke docs to the canonical gate

Acceptance:

- V1 checklist references the canonical command first
- post-deploy smoke docs reference the canonical command
- queue/context/planning docs are synchronized

## Progress Log

- 2026-04-22: Closed `RELEASE-HARDEN-A` by adding the canonical release gate
  script `scripts/runV1ReleaseGate.mjs`, exposing it as
  `pnpm run ops:release:v1:gate`, publishing
  `docs/operations/v1-release-gate-runbook.md`, and syncing the V1 release
  checklist plus canonical queue/context files.
