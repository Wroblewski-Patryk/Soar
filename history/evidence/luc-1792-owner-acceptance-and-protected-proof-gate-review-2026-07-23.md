# LUC-1792 Owner-Acceptance And Protected-Proof Gate Review

Date: Thursday, July 23, 2026
Owner: Security Review Lead
Parent issue: `LUC-1787`

## Scope

Review whether the Soar v1.0 sale-readiness contract still uses the correct
security boundary for owner acceptance and protected proof.

This review is limited to current repo evidence and read-only state:

- no protected prod proof execution
- no secret readback
- no account login/session reuse
- no production mutation

## Sources Reviewed

- `docs/planning/soar-v1-sale-readiness-contract.md`
- `docs/operations/v1-protected-proof-gate-classification.md`
- `docs/product/capability-map.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `history/evidence/luc-1787-soar-v1-sale-readiness-gap-register-2026-07-23.md`
- `history/evidence/luc-1568-security-disposition-post-managed-protected-proof-2026-07-23.md`
- `history/evidence/luc-1556-protected-proof-still-blocked-2026-07-23.md`

## Security Decision

`KEEP_CURRENT_BOUNDARY / NO_ADDITIONAL_SECURITY_GATE`

## Findings

### 1. `LUC-4103` remains the correct owner-acceptance boundary

- Current Soar source-of-truth still treats `LUC-4103` as the live
  owner-login method-selection and waiting-state path.
- The waiting interaction remains intentional, not a missing implementation
  lane: owner acceptance is blocked on approved method selection, not on a new
  product defect.
- The existing redacted owner-login path already requires protected runtime
  inputs or supervised operator proof and forbids secret, cookie, token, or
  broad response capture.

### 2. Protected proof is a separate gate from owner acceptance

- `docs/operations/v1-protected-proof-gate-classification.md` already
  separates:
  protected input readiness,
  auth/session production browser proof,
  protected runtime read-only proof,
  and forbidden mutation classes.
- The July 23 protected proof result in `LUC-1568` confirms the proof path is
  executable through approved managed bindings and stays fail-closed for the
  ordinary production test account.
- That result does not replace owner acceptance. It proves protected-route
  execution boundaries, not owner-level signoff.

### 3. One fail-closed condition should be stated explicitly in sale-readiness language

- A sale-ready claim must not treat any protected proof from a different
  principal class as owner acceptance.
- Specifically: admin-smoke or managed protected readback may satisfy
  protected-route/readiness evidence, but cannot close the owner-acceptance
  gate unless the approved owner-verification method selected in `LUC-4103`
  is the one that produced the evidence.

### 4. One redaction condition should be stated explicitly in sale-readiness language

- Owner-acceptance evidence should remain limited to redacted status/path
  summaries and must not store raw secrets, cookies, bearer tokens, passwords,
  screenshots of private account state, or protected response bodies.
- This rule already exists in the protected-proof classification and prior
  owner-login packets; it should be referenced directly in the sale-readiness
  contract/gap packet so the no-overclaim rule is self-contained.

## Recommended Contract Interpretation

- Keep `SRG-003` anchored to `LUC-4103`.
- Keep `SRG-002` as the exact-candidate protected acceptance/supportability
  proof lane.
- Do not add a new standalone security gate beyond current:
  release-parity/exact-candidate proof,
  protected proof/readiness evidence,
  and owner-login acceptance through the approved `LUC-4103` path.

## Required Wording Change

The current contract is directionally correct, but the security gate should be
made more explicit:

- owner acceptance closes only through the approved `LUC-4103` method and
  matching principal class
- non-owner protected proof cannot be promoted into owner acceptance
- artifacts must stay redacted and fail-closed

## Residual Risk

- Soar remains `NO-GO` for sale-readiness on Thursday, July 23, 2026.
- Exact-candidate parity is still missing for local `HEAD`
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`.
- Owner acceptance is still pending until `LUC-4103` resolves the approved
  method-selection interaction and the selected redacted proof actually runs.

## Final Disposition

`REVIEW_COMPLETE / KEEP_LUC-4103_BOUNDARY / CONTRACT_NEEDS_EXPLICIT_FAIL_CLOSED_AND_REDACTION_LANGUAGE`
