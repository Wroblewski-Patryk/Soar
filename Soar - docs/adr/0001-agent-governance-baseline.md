# ADR 0001: Agent Governance Baseline

- Status: accepted
- Date: 2026-05-23

## Context
Soar uses a coordinator-first agent workflow with durable docs, task records,
state files, and validation gates. The repository needs one accepted baseline
for agent behavior that is project-specific and does not depend on external
template paths.

## Decision
Use the Soar agent governance system as the canonical baseline for:
- planning and task orchestration
- documentation and review standards
- UX evidence policy
- subagent delegation policy

## Consequences
- easier project onboarding
- predictable execution and review quality
- explicit tradeoff: governance files must stay synchronized with current
  repository truth
