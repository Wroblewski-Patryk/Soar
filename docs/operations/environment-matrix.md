# Environment Matrix

> Unfilled generic template, not the active Soar environment contract. The current Soar matrix has local Windows and existing Coolify production only: [environment matrix](./dev-stage-prod-environment-matrix.md).


Last updated: YYYY-MM-DD

## Purpose

Map how the project runs across local, stage, production, and any special
worker or mobile environments.

## Environments

| Environment | Purpose | URL / target | Data source | Deploy source | Owner |
| --- | --- | --- | --- | --- | --- |
| local | Development |  |  | working tree |  |
| stage | Pre-production proof |  |  | immutable SHA |  |
| production | User-facing runtime |  |  | promoted SHA |  |

## Required Checks

| Environment | Health | Readiness | Smoke | Rollback | Evidence |
| --- | --- | --- | --- | --- | --- |
| local |  |  |  |  |  |
| stage |  |  |  |  |  |
| production |  |  |  |  |  |

## Rule

Do not assume parity between environments. Record differences explicitly.
