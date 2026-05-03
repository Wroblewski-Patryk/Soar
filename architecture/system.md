# System Architecture

## Purpose

This project is produced through an AI-driven software production pipeline. Architecture is the source of truth, pipelines define execution, tasks capture gaps, code implements approved plans, and documentation is synchronized after every change.

## Boundaries

- Product requirements live in `docs/product/`.
- Architecture decisions live in `architecture/` and detailed supporting docs live in `docs/architecture/`.
- Execution processes live in `pipelines/`.
- Work items live in `tasks/`.
- Agent responsibilities live in `agents/` and tool-specific agent folders.
- Runtime implementation lives in `src/` or the framework-specific application directories adopted by a concrete project.
- Verification lives in `tests/`.
- Release configuration and runbooks live in `deploy/`.

## Invariants

- Architecture changes must be reflected in modules, API, data flow, tech stack, tasks, and docs.
- Code changes must cite a task and pipeline.
- Documentation changes are part of done work, not a later cleanup.
- Every inconsistency becomes a backlog task.
- Agents may attempt at most 3 fix iterations for the same problem before stopping and reporting.
- Prefer extension over deletion unless a removal is explicitly approved by architecture.

## AI Production Loop

Canonical loop:

1. Analysis: compare architecture, code, tests, docs, and task state.
2. Planning: create or update tasks with dependencies and pipeline references.
3. Implementation: make the smallest coherent change that satisfies the active task.
4. Testing: run relevant unit, integration, e2e, and AI behavior checks.
5. Fixing: repair failures within the 3-iteration limit.
6. Documentation: update architecture, docs, task state, and function coverage records.

## Consistency Checks

Before work starts and before work is marked done, agents must verify:

- Architecture files exist and agree with each other.
- Each active task references a pipeline.
- Each changed module has documented dependencies.
- Tests cover the changed behavior or a task explains the gap.
- Deployment and monitoring expectations are current when release behavior changes.
