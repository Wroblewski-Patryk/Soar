# Task

## Header
- ID: XVENUE-07
- Title: Align worker topology truth
- Status: DONE
- Owner: Backend Builder
- Depends on: XVENUE-06
- Priority: P1

## Context
`XVENUE-06` locked exact exchange-context parity, but the approved
worker-topology part of `XVENUE-A` remained open.

Architecture requires `/workers/*` and related observability to model the full
deployed topology rather than silently treating every `inline` configuration as
healthy. The current code still modeled only `marketData` and `backtest` in
ownership config, did not expose `market-stream` and `execution` as first-class
families, and let runtime freshness skip passive checks for any inline mode.

## Goal
Align worker ownership, health, readiness, and passive runtime-freshness truth
to the approved split-worker topology while keeping local/test inline support
explicit rather than pretending it matches deployed production truth.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the source of truth

## Definition of Done
- [x] Worker topology contract models all four canonical families:
      `market-data`, `market-stream`, `backtest`, and `execution`.
- [x] `/workers/health` and `/workers/ready` expose explicit topology truth,
      including degraded deployed inline or partial-split configurations.
- [x] Runtime freshness skips passive inline checks only for explicit
      local/test inline mode, not for deployed degraded inline.
- [x] Focused worker-topology regression coverage exists without depending on
      DB-backed route tests.
- [x] Queue/context artifacts point to `XVENUE-08` as the next slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/workers/workerOwnership.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed `/workers/health`, `/workers/ready`, and
    `runtimeFreshness.ts` against the architecture requirement that deployed
    inline must not be treated as a healthy equivalent of split topology
- Screenshots/logs:
  - none
- High-risk checks:
  - deployed inline now reports degraded/not-ready truth instead of `200 ready`
  - passive freshness skip remains allowed only for explicit local/test inline

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/planning/exchange-context-and-worker-topology-hardening-plan-2026-04-25.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - user-approved direction in current thread on 2026-04-25
- Follow-up architecture doc updates:
  - none in this slice; closure evidence moves to `XVENUE-08`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference:
  - n/a
- Required states: loading | empty | error | success
- Responsive checks:
  - n/a
- Accessibility checks:
  - n/a
- Parity evidence:
  - n/a

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- This slice intentionally keeps `market-stream` topology explicit without
  inventing a fake queue-lag or queue-env contract for that worker family.
