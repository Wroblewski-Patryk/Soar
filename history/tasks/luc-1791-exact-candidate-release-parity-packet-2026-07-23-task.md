# Task Contract: LUC-1791 exact-candidate release-parity packet

## Context

- Issue: `LUC-1791`
- Title: `[Soar][Release] Build exact-candidate release-parity packet for v1.0 sale-readiness`
- Stage: `verification`
- Date: Thursday, July 23, 2026
- Role: `09 EDL (Engineering Delivery Lead)`
- Related files:
  - `docs/planning/soar-v1-sale-readiness-contract.md`
  - `history/evidence/luc-1787-soar-v1-sale-readiness-gap-register-2026-07-23.md`
  - `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md`

## Goal

Establish the truthful exact-candidate release-parity state for Soar v1.0 sale
readiness and determine whether the previously named candidate
`40cfb8f2...` still requires an approval-ready deploy path.

## Constraints

- Do not push, deploy, restart, roll back, or mutate production.
- Do not invent a new candidate when the active branch/build-info truth already
  identifies one.
- Keep the result limited to release coordination and source-of-truth updates;
  protected proof and owner-acceptance remain separate lanes.
- Preserve existing unrelated workspace changes.

## Definition of Done

- An inspectable release-parity packet exists for `LUC-1791`.
- The packet states whether `40cfb8f2...` is still the active target.
- Current local, remote, and public production candidate alignment is recorded.
- Sale-readiness state files are updated so downstream lanes use the corrected
  candidate truth.
- The Paperclip issue can move to a terminal or review-ready disposition with
  explicit residual blockers, if any.

## Forbidden

- Treating historical same-day proof for an older SHA as proof for a newer SHA
  without reconciliation.
- Claiming protected acceptance or owner acceptance from public-only evidence.
- Reverting unrelated repo changes.

## Implementation Plan

1. Read the current sale-readiness contract and gap register.
2. Compare the named candidate against current `HEAD`, `origin/main`, and
   public production build-info.
3. Write the `LUC-1791` parity packet.
4. Refresh the Soar source-of-truth files that still refer to the superseded
   candidate.

## Acceptance Criteria

- `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md`
  records the candidate reconciliation and release-safe conclusion.
- Sale-readiness docs/state no longer describe `40cfb8f2...` as the current
  exact candidate blocker.
- Residual non-EDL blockers are named by owner.

## Verification

- `git rev-parse HEAD`
- `git rev-parse origin/main`
- `git rev-list --left-right --count 40cfb8f2cf913966f9c7159b49ae256b2aebbcaa...ca712e98b70e157b643db4f57726a02821a140bc`
- `git merge-base 40cfb8f2cf913966f9c7159b49ae256b2aebbcaa ca712e98b70e157b643db4f57726a02821a140bc`
- `Invoke-RestMethod https://api.soar.luckysparrow.ch/health`
- `Invoke-RestMethod https://api.soar.luckysparrow.ch/ready`
- `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info`

## Result Report

- The old candidate `40cfb8f2...` is superseded by five later commits and is no
  longer the current release target.
- The current exact candidate is
  `ca712e98b70e157b643db4f57726a02821a140bc`, aligned across local `HEAD`,
  `origin/main`, and public production build-info.
- Release-parity packet scope is complete; sale-readiness still remains blocked
  on `LUC-1793` and `LUC-1792`.
