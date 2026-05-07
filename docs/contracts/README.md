# Contract Memory

Last updated: 2026-05-07

Canonical Soar contracts live primarily in:

- `../architecture/reference/`
- `../architecture/architecture-source-of-truth.md`
- `../modules/`
- `../pipelines/`

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
  `../architecture/reference/runtime-signal-merge-contract.md`
- Assistant runtime:
  `../architecture/reference/assistant-runtime-contract.md`
- Live/Paper runtime safety:
  `../architecture/reference/live-paper-runtime-safety-contract.md`
- Execution lifecycle parity:
  `../architecture/reference/execution-lifecycle-parity-contract.md`
- Dashboard loading UX:
  `../architecture/reference/dashboard-loading-ux-contract.md`
