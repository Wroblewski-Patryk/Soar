# Task

## Context

- Source issue: `LUC-572`
- Target issue: `LUC-564`
- Wake reason: board comment created a sidecar lane for local source-control
  closure while protected delivery gates remain separate.
- Current Stage: verification

## Goal

Classify and close the local dirty state for the `LUC-564` Account access
`signAuthToken` doc-link package without changing runtime behavior or crossing
protected delivery gates.

## Constraints

- Stay inside local source-control closure scope.
- Do not push, deploy, restart, rollback, edit environments, access protected
  secrets/accounts, mutate DB/Redis, mutate payment/exchange/subscription state,
  place orders, change positions, activate bots, or perform LIVE trading.
- Commit only if the dirty set is coherent docs/state/evidence/generated-index
  work and validation/redaction checks pass.

## Definition of Done

- Dirty state is classified by path group and ownership.
- Minimal local validation passes.
- Closure evidence is recorded.
- Local commit is made if no no-commit blocker remains.
- Paperclip issue and target issue receive closure evidence.

## Forbidden

- Production action.
- Protected credential readback.
- Secret disclosure.
- Push or deploy.
- Runtime workaround.

## Result Report

- Classification: current docs/state/evidence/generated-index package for
  `LUC-564`; no runtime/product code paths were dirty.
- Validation: `git diff --check` passed with CRLF normalization warnings only;
  targeted redaction scan passed.
- Disposition: local source-control closure commit made; no push/deploy/runtime
  operation performed.
