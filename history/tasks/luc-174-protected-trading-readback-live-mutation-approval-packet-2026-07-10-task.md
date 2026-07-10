# LUC-174 Protected Trading Readback vs LIVE Mutation Approval Packet

## Context

[LUC-174](/LUC/issues/LUC-174) asks Security to draft the protected trading
readback vs LIVE mutation approval packet from [LUC-169](/LUC/issues/LUC-169).
The 2026-07-10 wake selected an autonomous local repair/source-control lane and
forbade push, deploy, production restart, protected smoke/live account
mutation, and secret disclosure until protected gate evidence exists.

## Goal

Produce a non-secret security packet that defines allowed read-only production
trading readback, forbidden LIVE mutations, protected input families by name,
redaction requirements, stop conditions, and the exact owner path for any later
LIVE mutation proposal.

## Scope

- Files:
  - `history/evidence/luc-174-protected-trading-readback-live-mutation-approval-packet-2026-07-10.md`
  - `history/tasks/luc-174-protected-trading-readback-live-mutation-approval-packet-2026-07-10-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/next-steps.md`
  - `.agents/state/risk-register.md`
- Source contracts:
  - `docs/product/capability-map.md`
  - `docs/architecture/capability-to-implementation-map.csv`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/security/secure-development-lifecycle.md`
  - `scripts/runProdSecurityExchangeProof.mjs`

## Current Stage

- Stage: `verification`
- Output expected: approval packet plus local helper validation and
  source-control disposition.

## Constraints

- No raw secrets, tokens, cookies, credentials, API keys, payment data, exchange
  credentials, or private headers in repo files, command output, artifacts, or
  issue comments.
- No push, deploy, production restart, protected smoke, protected account
  mutation, API-key mutation, subscription/payment mutation, DB/Redis mutation,
  exchange mutation, order, position, or live-trading action.
- Do not treat local helper tests as protected production proof.
- Keep read-only proof and LIVE mutation approval as separate gates.

## Implementation Plan

1. Acknowledge the wake comment and keep the heartbeat inside local
   repair/source-control boundaries.
2. Read the scoped issue context and source contracts for CAP-003, CAP-008,
   CAP-026, exchange access ownership, and secure development lifecycle.
3. Draft the LUC-174 packet with allowed readback, forbidden actions, protected
   input families, evidence artifacts, stop conditions, and LIVE mutation owner
   path.
4. Update local source-of-truth summaries so the packet is discoverable.
5. Validate Markdown/diff hygiene and local helper contract tests.
6. Commit the docs/evidence/context-only closure if validation passes.

## Acceptance Criteria

- Packet states allowed protected readback scope.
- Packet states forbidden actions and LIVE mutation approval boundary.
- Packet states required principal/session class and protected input families
  by name only.
- Packet states redaction and evidence artifact requirements.
- Packet states stop conditions and exact owner/reviewer path for any LIVE
  mutation proposal.
- Validation commands and source-control disposition are recorded.

## Definition Of Done

- `history/evidence/luc-174-protected-trading-readback-live-mutation-approval-packet-2026-07-10.md`
  exists and contains no raw secret values.
- Local state points to the packet and records the read-only/LIVE mutation
  separation.
- `git diff --check` passes.
- `node --test scripts/runProdSecurityExchangeProof.test.mjs` passes.
- Dirty docs/history/context set is committed locally or a concrete no-commit
  blocker is recorded.

## Forbidden

- Push.
- Deploy.
- Production restart.
- Protected smoke/live account mutation.
- Raw secret/cookie/token/API-key capture.
- API-key, exchange setting, order, position, subscription/payment, DB/Redis,
  Coolify, rollback, or LIVE trading mutation.

## Validation

- `git diff --check`
  - PASS, no whitespace errors.
- `node --test scripts/runProdSecurityExchangeProof.test.mjs`
  - PASS, `4/4` tests.

## Security / Privacy Evidence

- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: protected trading/runtime account data and exchange
  credential-adjacent metadata.
- Trust boundaries: Paperclip secret refs, Soar protected auth/session, Soar
  API, exchange authenticated read boundary, exchange write-side execution
  boundary.
- Permission or ownership checks: read-only proof requires approved protected
  session/principal; LIVE mutation requires separate exact approval and
  Integration Trading + Security + QA/Ops review.
- Abuse cases: read-only proof misused as LIVE approval; raw secret leakage in
  artifacts; unsupported exchange capability inferred from broad support;
  stale/ambiguous ownership snapshot treated as mutable authority.
- Secret handling: binding names only; no values consumed or recorded.
- Fail-closed behavior: stop on missing session, build mismatch, unsupported
  capability, ambiguous ownership, secret exposure, or any mutation request
  without explicit approval.
- Residual risk: future protected readback still needs approved bindings and
  must not be overclaimed as LIVE mutation approval.

## Result Report

- Task summary: drafted the Security approval packet separating read-only
  protected trading readback from LIVE mutation approval.
- Files changed:
  - `history/evidence/luc-174-protected-trading-readback-live-mutation-approval-packet-2026-07-10.md`
  - `history/tasks/luc-174-protected-trading-readback-live-mutation-approval-packet-2026-07-10-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/next-steps.md`
  - `.agents/state/risk-register.md`
- How tested:
  - `git diff --check`
  - `node --test scripts/runProdSecurityExchangeProof.test.mjs`
- What is incomplete:
  - No protected production readback was run in this heartbeat because protected
    smoke/live account mutation was forbidden by the wake and no protected
    input/session binding was consumed.
- Next steps:
  - Approved protected-session runner can execute read-only proof with
    `scripts/runProdSecurityExchangeProof.mjs` and redacted artifacts.
  - Integration Trading + Security + QA/Ops must use a separate issue/approval
    for any exact LIVE mutation proposal.
- Decisions made:
  - LUC-174 can proceed as read-only proof when approved protected bindings are
    present; it does not authorize LIVE mutation.
