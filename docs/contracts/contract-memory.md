# Contract Memory

Last updated: 2026-05-07

Canonical Soar contracts live primarily in:

- [Architecture reference contracts](../architecture/reference/architecture-reference-contracts.md)
- [Architecture source of truth](../architecture/architecture-source-of-truth.md)
- [Module docs](../modules/module-documentation.md)
- [Pipeline registry](../pipelines/pipeline-registry.md)

This folder is an agent-friendly index for API/client/runtime/UI contract work.
Do not move existing architecture reference contracts here unless a future
architecture decision approves that reorganization.

## Contract Update Rule

When a backend/frontend/runtime contract changes, update:

1. the canonical architecture reference contract if behavior changed
2. the relevant module doc
3. the relevant pipeline or flow doc
4. the task artifact and validation evidence

## Current Active Contract Sources

- Runtime signal merge:
  [runtime-signal-merge-contract.md](../architecture/reference/runtime-signal-merge-contract.md)
- Assistant runtime:
  [assistant-runtime-contract.md](../architecture/reference/assistant-runtime-contract.md)
- Live/Paper runtime safety:
  [live-paper-runtime-safety-contract.md](../architecture/reference/live-paper-runtime-safety-contract.md)
- Execution lifecycle parity:
  [execution-lifecycle-parity-contract.md](../architecture/reference/execution-lifecycle-parity-contract.md)
- Dashboard loading UX:
  [dashboard-loading-ux-contract.md](../architecture/reference/dashboard-loading-ux-contract.md)
