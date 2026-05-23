# Audit Remediation Master Plan - 2026-05-19

## Purpose

This plan turns the 2026-05-19 reusable audit findings into an ordered repair
roadmap. It is based on the current audit rollup, decision packet, repair
playbooks, manifest, rerun playbook, and tooling index.

Primary evidence:

- `history/audits/full-reusable-audit-rollup-2026-05-19.md`
- `history/audits/audit-decision-packet-2026-05-19.md`
- `history/audits/audit-decision-repair-playbooks-2026-05-19.md`
- `history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json`
- `history/artifacts/reusable-audit-rerun-playbook-2026-05-19.json`
- `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`
- `history/artifacts/audit-remediation-master-plan-2026-05-19.json`

## Current Truth

- `23` audit families are current/current-local for current scope.
- `AUD-01` is resolved by accepted `DEC-AUD-001`: current exchange
  implementation scope is Binance + Gate.io, not Binance-only.
- `AUD-20` is resolved by accepted `DEC-AUD-002`: current assistant truth is
  foundation/dry-run, and hot-path orchestration is future/gated scope.
- `AUD-21` is deferred and verified as scaffold-only mobile scope.
- `AUD-19` is locally current, but production release readiness remains
  historical and must be rerun before any new production readiness claim.

No production data mutation, LIVE order submit/cancel/close, exchange-side
mutation, or architecture decision is authorized by this plan.

## Priority Roadmap

| Phase | Priority | Scope | Why | Blocks | Output |
| --- | --- | --- | --- | --- | --- |
| P0 | done | Accept `DEC-AUD-001` exchange-scope option. | `AUD-01` could not become truthful without a user decision. | User decision. | Accepted Binance + Gate.io implementation scope. |
| P0 | done | Accept `DEC-AUD-002` assistant-runtime option. | `AUD-20` overclaimed hot-path AI relative to code proof. | User decision. | Accepted assistant foundation/dry-run current scope. |
| P1 | done | Repair exchange architecture wording after `DEC-AUD-001`. | Removes architecture/code contradiction. | `DEC-AUD-001`. | Updated architecture/state/audit docs and `AUD-01` status. |
| P1 | done | Repair assistant runtime truth after `DEC-AUD-002`. | Removes AI runtime overclaim. | `DEC-AUD-002`. | Updated assistant architecture/audit docs and `AUD-20` status. |
| P2 | P1 | Refresh production release gate before any production readiness claim. | `AUD-19` production evidence is historical. | Explicit production scope, auth, and operator approval. | Fresh build-info, smoke, protected runtime, rollback, backup/restore, and sign-off evidence. |
| P3 | P1 | Promote production-safe proofs for historical-production audit families. | Several families are locally current but production-safe proof is historical. | Production-safe fixture/auth scope. | Fresh production-safe evidence where approved. |
| P4 | P1 | Schedule independent security review. | `AUD-06` is locally/prod-safe current, but external review remains governance follow-up. | Reviewer/scope availability. | External review report or tracked governance task. |
| P5 | P2 | Deepen UX/a11y proof after UI changes. | `AUD-05` has current local route proof but production UX proof is historical. | UI change scope or production-safe browser access. | Fresh responsive/a11y/browser evidence. |
| P6 | P2 | Keep audit tooling and manifests current. | Future reruns need stable comparison and a machine-readable remediation roadmap. | None. | `audit:manifest:verify` and `audit:remediation-plan:check` remain PASS. |

## Decision Gates

### DEC-AUD-001 - Exchange Scope

Accepted option: Binance + Gate.io implementation scope, not Binance-only.

Reason:

- It matches current tested code reality.
- It keeps production/live-money claims conservative.
- It avoids high-churn rollback to Binance-only while preserving safety.

Applied:

1. Record the decision in `.agents/state/decision-register.md`.
2. Update architecture overview/domain/integration wording.
3. Keep production readiness evidence-scoped.
4. Reconcile exchange ownership docs and module docs.
5. Run the exchange validation pack from the repair playbook.

### DEC-AUD-002 - Assistant Runtime Truth

Accepted option: narrow docs to assistant foundation/dry-run truth and defer
hot-path orchestration to later gated scope.

Reason:

- It immediately removes overclaim risk.
- It keeps AI out of trading hot paths until fail-closed behavior and red-team
  evidence exist.
- It preserves the future hot-path implementation as a separately planned
  product slice.

Applied:

1. Record the decision in `.agents/state/decision-register.md`.
2. Update assistant architecture and module docs to foundation-only current
   truth.
3. Keep hot-path orchestration as planned/gated future work.
4. Update `AUD-20` status to truthful foundation-current.
5. Run assistant foundation tests and docs/guardrail checks.

## Work Packages

### WP-01 - Exchange Architecture Truth Repair

- Depends on: `DEC-AUD-001`.
- Preferred option: staged Gate.io adapter scope.
- Files: architecture overview/domain/runtime/integration docs, exchange
  ownership matrix, `docs/modules/api-exchange.md`, audit state files, project
  state, task board.
- Validation:
  - `corepack pnpm run docs:parity:check`
  - focused exchange capability/boundary/registry tests from the repair
    playbook
  - `corepack pnpm --dir apps/api run typecheck`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Done when: `AUD-01` no longer reports doc-consistency failure.

### WP-02 - Assistant Runtime Truth Repair

- Depends on: `DEC-AUD-002`.
- Preferred option: foundation/dry-run truth narrowing.
- Files: assistant architecture docs, assistant runtime contract, API engine
  and bot module docs, audit baseline/registry, risk/register/matrix/module
  confidence, project state, task board.
- Validation:
  - `corepack pnpm run docs:parity:check`
  - assistant orchestrator focused tests
  - bot assistant config/dry-run e2e if docs still claim it as proven
  - focused Web assistant route tests
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Done when: `AUD-20` is no longer failed against a hot-path claim.

### WP-03 - Production Release Evidence Refresh

- Depends on: explicit production scope and approved auth/operator access.
- Scope: `AUD-19`.
- Include:
  - production build-info freshness;
  - public API/Web smoke;
  - protected runtime readback where applicable;
  - rollback proof;
  - backup/restore proof;
  - RC/sign-off evidence.
- Forbidden without approval:
  - production data mutation beyond approved proof scope;
  - LIVE order submit/cancel/close;
  - exchange-side mutation.
- Done when: a new dated production release evidence packet replaces the
  historical production readiness claim.

### WP-04 - Production-Safe Evidence Refresh Queue

- Depends on: production-safe fixture/auth scope.
- Candidate audit families:
  - `AUD-05` UX/a11y/browser proof;
  - `AUD-06` protected security probes;
  - `AUD-08` protected worker/process proof;
  - `AUD-10` bots/runtime proof;
  - `AUD-12` orders PAPER proof;
  - `AUD-13` positions PAPER proof;
  - `AUD-14` wallets/capital proof;
  - `AUD-15` markets/strategies fixture proof;
  - `AUD-16` backtests/reports fixture proof;
  - `AUD-17` action-produced audit readback;
  - `AUD-18` admin/subscription protected route proof.
- Done when: each refreshed family records fresh production-safe evidence or a
  clear blocked reason.

### WP-05 - Security Governance Follow-Up

- Depends on: reviewer/scope assignment.
- Scope: external independent security review.
- Output: review artifact, findings, remediation tasks, and security risk
  register updates.
- Done when: `AUD-06` governance gap has a dated review result or scheduled
  owner/date.

### WP-06 - UX/A11y Deepening

- Depends on: UI change scope or production-safe browser access.
- Scope: responsive, keyboard, focus, empty/error/success states, screenshot
  comparison where relevant.
- Output: fresh browser proof and updated UX/a11y evidence.
- Done when: `AUD-05` no longer relies on historical production UX proof for
  current UI claims.

### WP-07 - Mobile Activation Plan

- Depends on: explicit product decision to activate native/mobile scope.
- Current truth: `AUD-21` is deferred/scaffold-only verified.
- Output if activated: mobile module docs, Expo/native validation commands,
  route/API parity expectations, and mobile confidence rows.
- Done when: mobile remains explicitly deferred or has a real activation plan.

### WP-08 - Audit Tooling Maintenance

- Depends on: none.
- Scope: keep reusable audit tooling green after audit docs or scripts change.
- Primary command:
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run audit:remediation-plan:check`
- Done when:
  - manifest check is `24/24`;
  - manifest paths are `0` missing;
  - rerun playbook check is `24/24`;
  - tooling index check is complete;
  - remediation plan check is complete;
  - comparison reports `0` unexplained regressions.

## Suggested Execution Order

1. `DEC-AUD-001` accepted and `WP-01` applied.
2. `DEC-AUD-002` accepted and `WP-02` applied.
3. Run `audit:manifest:verify` and `audit:remediation-plan:check`, then
   update the audit status artifacts.
4. If production readiness needs to be claimed, execute `WP-03`.
5. Refresh production-safe evidence families in `WP-04` by risk and release
   priority.
6. Schedule `WP-05` and `WP-06` as governance/quality follow-ups.
7. Keep `WP-07` deferred until mobile is explicitly activated.
8. Run `WP-08` after every audit artifact or tooling change.

## Non-Negotiable Validation

Before closing any repair package:

```powershell
corepack pnpm run audit:manifest:verify
corepack pnpm run audit:remediation-plan:check
corepack pnpm run docs:parity:check
corepack pnpm run quality:guardrails
git diff --check
```

Add module-specific tests from the relevant repair playbook.

After browser, Docker, or DB-backed checks:

```powershell
Get-Process chrome-headless-shell -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5432,6379 -ErrorAction SilentlyContinue
docker compose ps
```

## Current Blockers

- No audit decision blocker remains for `AUD-01` or `AUD-20`.
- Fresh production readiness requires explicit production scope and approved
  auth/operator access.
- LIVE or exchange-side mutation requires separate explicit approval.
