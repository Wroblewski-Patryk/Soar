# Architecture Layer

This directory is the operational source of truth for agents. If code, tests, pipelines, or docs disagree with these files, the architecture wins and the inconsistency must become a task in `tasks/backlog.md`.

Required files:

- `system.md` - system purpose, boundaries, runtime shape, invariants.
- `modules.md` - module catalogue, ownership, dependencies, function coverage expectations.
- `api.md` - public and internal contracts.
- `data-flow.md` - data lifecycle, events, state transitions, trust boundaries.
- `tech-stack.md` - approved technologies, constraints, replacement rules.

Agent rule: read this directory before planning or implementation work.
