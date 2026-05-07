# Current Focus

Last updated: 2026-05-07

## Active Focus

V1 foundation hardening: keep Soar stable, architecture-aligned,
regression-resistant, and easy for future agents to continue without hidden
chat context.

## Current System Objective

Build and maintain an AI-assisted self-improving development system for Soar.
The system must let agents continue from repository state, identify the next
smallest valuable task, protect runtime safety, and keep backend/frontend/UI
contracts synchronized.

## Current Delivery Stage

Implementation and verification for the agent operating system documentation
slice.

## Current Priority Order

1. Stability
2. Architecture alignment
3. No regressions
4. Correct flows
5. UX quality
6. Visual polish
7. New features

## Active Constraints

- Do not touch unrelated in-progress code changes.
- Keep source-of-truth docs in English.
- Reuse existing `.codex/context`, planning, governance, and architecture
  systems.
- Add agent operating memory under `.agents/` and documentation memory under
  `docs/` without replacing canonical architecture truth.
