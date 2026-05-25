---
type: docs_index
status: canonical
area: operations
last_verified: 2026-05-23
---

# Operations

This folder contains living operational documentation: runbooks, checklists,
operator guides, release gates, reliability guidance, and current status
templates. Dated proof lives in [Evidence History](../../history/evidence/evidence-history.md),
release packets live in [Release History](../../history/releases/release-history.md),
and raw generated output lives in [Raw Artifacts](../../history/artifacts/raw-artifact-history.md).

## Start Here

| File | Use when |
| --- | --- |
| [Post-deploy smoke checklist](./post-deploy-smoke-checklist.md) | Verifying a deployment. |
| [Deployment rollback playbook](./deployment-rollback-playbook.md) | Deciding or executing rollback. |
| [Service reliability and observability](./service-reliability-and-observability.md) | Reading reliability, SLO, and observability expectations. |
| [Coolify Linux VPS setup guide](./coolify-linux-vps-setup-guide.md) | Operating the VPS/Coolify deployment. |
| [V1 release gate runbook](./v1-release-gate-runbook.md) | Running release readiness checks. |
| [V1 RC external gates runbook](./v1-rc-external-gates-runbook.md) | Managing external release gates. |
| [Operator handbook](./operator-handbook.md) | Day-to-day operator guidance. |

## Deployment And Release

| File | Use when |
| --- | --- |
| [Deployment readiness gates](./deployment-readiness-gates.md) | Checking deploy readiness before promotion. |
| [Deployment rollback playbook](./deployment-rollback-playbook.md) | Rolling back or deciding not to roll back. |
| [Deployment incident playbook](./deployment-incident-playbook.md) | Handling a deploy incident. |
| [Deployment migration strategy](./deployment-migration-strategy.md) | Understanding deployment migration sequencing. |
| [Deployment template local/stage/production](./deployment-template-local-stage-production.md) | Comparing environment deployment templates. |
| [Dev/stage/prod environment matrix](./dev-stage-prod-environment-matrix.md) | Checking environment ownership and differences. |
| [Dev/stage/prod promotion contract](./dev-stage-prod-promotion-contract.md) | Promoting across environments. |
| [Post-deploy smoke checklist](./post-deploy-smoke-checklist.md) | Running post-deploy checks. |
| [Post-release monitoring](./post-release-monitoring.md) | Watching a release after deployment. |
| [Release candidate checklist](./release-candidate-checklist.md) | Preparing a release candidate. |
| [MVP release checklist](./mvp-release-checklist.md) | Checking MVP release readiness. |

## Platform And Reliability

| File | Use when |
| --- | --- |
| [Coolify Linux VPS setup guide](./coolify-linux-vps-setup-guide.md) | Operating Coolify on the VPS. |
| [Coolify trigger wiring](./coolify-trigger-wiring.md) | Debugging Coolify triggers. |
| [VPS Docker Compose fallback guide](./vps-docker-compose-fallback-guide.md) | Recovering through compose fallback. |
| [Service reliability and observability](./service-reliability-and-observability.md) | Reading SLO and observability expectations. |
| [Runtime incident triage matrix](./runtime-incident-triage-matrix.md) | Diagnosing runtime incidents. |
| [Redis AOF recovery runbook](./redis-aof-recovery-runbook.md) | Recovering Redis AOF state. |
| [Stale cache incident playbook](./stale-cache-incident-playbook.md) | Handling stale cache incidents. |
| [Control center 10s checklist](./control-center-10s-checklist.md) | Fast operator dashboard sanity check. |
| [i18n route-reachable audit contract](./i18n-route-reachable-audit-contract.md) | Running route-reachable copy audits. |

## Operator And Product Runbooks

| File | Use when |
| --- | --- |
| [Operator handbook](./operator-handbook.md) | Day-to-day operations. |
| [User guide](./user-guide.md) | User-facing operational walkthrough. |
| [MVP ops runbook](./mvp-ops-runbook.md) | MVP operating procedure. |
| [Bot module operator runbook](./bot-module-operator-runbook.md) | Operating bot module flows. |
| [Bot module manual smoke checklist](./bot-module-manual-smoke-checklist.md) | Manually checking bot module behavior. |
| [Wallet lifecycle operator runbook](./wallet-lifecycle-operator-runbook.md) | Operating wallet lifecycle flows. |
| [Subscription admin operator runbook](./subscription-admin-operator-runbook.md) | Operating subscription admin flows. |
| [Binance API key onboarding runbook](./binance-api-key-onboarding-runbook.md) | Onboarding Binance API keys. |
| [Indicator implementation runbook](./indicator-implementation-runbook.md) | Implementing indicators safely. |
| [Agent deployment skill template](./agent-deployment-skill-template.md) | Creating deployment-oriented agent skills. |

## Trading And Runtime Checks

| File | Use when |
| --- | --- |
| [Manual smoke backtest/paper/live checklist](./manual-smoke-backtest-paper-live-checklist.md) | Running manual trading-mode smoke checks. |
| [Backtest markets chart parity checklist](./backtest-markets-chart-parity-checklist.md) | Checking backtest market/chart parity. |
| [Backtest parity mismatch runbook](./backtest-parity-mismatch-runbook.md) | Investigating backtest parity mismatches. |
| [Binance lifecycle reason parity protocol](./binance-lifecycle-reason-parity-protocol.md) | Checking Binance lifecycle reason parity. |
| [Binance side-by-side parity checklist](./binance-side-by-side-parity-checklist.md) | Comparing Binance behavior side by side. |
| [Bot V2 baseline test suite](./bot-v2-baseline-test-suite.md) | Running Bot V2 baseline checks. |
| [Dashboard bots operational UX checklist](./dashboard-bots-operational-ux-checklist.md) | Reviewing dashboard/bots operational UX. |

## V1 Release And Operations

| File | Use when |
| --- | --- |
| [V1 ops runbook](./v1-ops-runbook.md) | Operating V1. |
| [V1 go-live smoke pack](./v1-go-live-smoke-pack.md) | Running V1 go-live smoke. |
| [V1 release gate runbook](./v1-release-gate-runbook.md) | Running V1 release gate. |
| [V1 release candidate checklist](./v1-release-candidate-checklist.md) | Preparing V1 release candidate. |
| [V1 RC external gates runbook](./v1-rc-external-gates-runbook.md) | Managing V1 external gates. |
| [V1 RC external gates status](./v1-rc-external-gates-status.md) | Reading current external gate status template. |
| [V1 RC signoff record](./v1-rc-signoff-record.md) | Recording V1 signoff. |
| [V1 alert rules](./v1-alert-rules.md) | Checking V1 alert rules. |
| [V1 assistant incident runbook](./v1-assistant-incident-runbook.md) | Handling assistant incidents. |
| [V1 changelog](./v1-changelog.md) | Reading V1 changes. |
| [V1 incident drills](./v1-incident-drills.md) | Running incident drills. |
| [V1 launch review template](./v1-launch-review-template.md) | Preparing launch review. |
| [V1 local cutover checklist](./v1-local-cutover-checklist.md) | Running local cutover checks. |
| [V1 local rollback checklist](./v1-local-rollback-checklist.md) | Running local rollback checks. |
| [V1 migration notes](./v1-migration-notes.md) | Reading V1 migration notes. |
| [V1 post-release monitoring](./v1-post-release-monitoring.md) | Watching V1 after release. |
| [V1 RTO/RPO targets](./v1-rto-rpo-targets.md) | Checking recovery targets. |
| [V1 SLO catalog](./v1-slo-catalog.md) | Checking SLO definitions. |
| [V1 stabilization freeze](./v1-stabilization-freeze.md) | Applying stabilization freeze rules. |

## Rule

Generated readable evidence should go to `history/evidence/`, release-specific
packets to `history/releases/`, and raw machine output to `history/artifacts/`.
Keep only durable procedures, living checklists, current gate templates, and
operator references in this folder.
