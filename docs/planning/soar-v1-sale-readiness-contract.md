# Soar V1.0 Sale-Readiness Contract

Version: `v1.0-2026-07-23`
Status: `NO-GO`
Owner: `11 SPM (Soar Product Manager)`
Last reviewed: Thursday, July 23, 2026

## Purpose

Define the bounded, evidence-backed meaning of "sale-ready" for Soar v1.0 while
the project remains inside `11 Innovation: Soar`.

This contract is not a commercialization launch approval. It is the local
product/release contract that must be true before Soar can be proposed as ready
for controlled customer-facing transition work.

## Scope

This contract covers:

- functional product journeys that Soar v1.0 must keep working
- UX/accessibility quality at the approved Web surface
- reliability, observability, and operational recovery gates
- security/privacy and protected-route acceptance gates
- documentation and supportability truth
- rollback and recovery readiness
- explicit owner-acceptance evidence
- exact release provenance for the candidate being claimed as ready

## Explicit Exclusions

This contract does not authorize:

- sales or marketing activation
- customer outreach or onboarding
- hosted Paperclip V1 activation
- LIVE trading proof or live-money mutation
- paid resource activation outside already approved project operations
- treating historical release-ready packets as proof for a newer unreleased SHA

## Canonical Current-State Baseline

As of Thursday, July 23, 2026:

- generated project truth reports `totalGaps=0`
- public `GET /health -> 200`
- public `GET /ready -> 200`
- protected `GET /ready/details -> 200`
- protected `GET /workers/ready -> 200`
- protected `GET /workers/runtime-freshness -> 200 PASS`
- current public production build-info SHA is
  `ca712e98b70e157b643db4f57726a02821a140bc`
- local workspace `HEAD` is
  `ca712e98b70e157b643db4f57726a02821a140bc`
- `origin/main` is
  `ca712e98b70e157b643db4f57726a02821a140bc`
- the earlier same-day sale-readiness candidate
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa` was superseded by five later
  commits and is no longer the active release target

Primary evidence:

- `history/tasks/luc-27-soar-build-to-production-blocked-closeout-2026-07-23-task.md`
- `history/evidence/luc-27-soar-build-to-production-blocked-closeout-2026-07-23.md`
- `history/evidence/luc-1708-release-sha-reconciliation-2026-07-23.md`
- `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md`

## Gate Model

The candidate claimed as sale-ready must satisfy every gate below for the exact
candidate SHA, not for a previous or adjacent deploy.

| Gate | Required truth for `GO` | Current 2026-07-23 status | Canonical evidence |
| --- | --- | --- | --- |
| Functional journeys | Core v1 journeys are implemented, routable, and not emitted as active project-truth gaps. | `PASS on current production baseline / CURRENT_CANDIDATE_PUBLICLY_ALIGNED` | `.codex/context/PROJECT_STATE.md`; `.agents/state/delivery-map.md`; `history/evidence/luc-27-soar-build-to-production-blocked-closeout-2026-07-23.md`; `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md` |
| UX and accessibility | Approved Web surfaces render and remain stable across critical authenticated/public journeys for the exact candidate. | `HISTORICALLY PROVEN / EXACT_CANDIDATE_BROWSER_REFRESH_STILL_NEEDED` | `docs/ux/*`; historical proof packets in `history/evidence/` and `history/plans/`; current parent block in `LUC-27`; `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md` |
| Reliability and observability | Public and protected readiness, worker freshness, and operator-readable recovery signals are green for the exact candidate. | `PUBLIC PATH PASS / PROTECTED RERUN STILL REQUIRED` | `docs/operations/service-reliability-and-observability.md`; `history/evidence/luc-27-soar-build-to-production-blocked-closeout-2026-07-23.md`; `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md` |
| Security and privacy | Protected-route acceptance, fail-closed auth/session boundaries, and security-sensitive proofs are current for the exact candidate. | `PARTIAL` | `docs/product/capability-map.md` CAP-011; current owner-login and protected-proof lanes |
| Documentation truth | Canonical docs, ledgers, and generated truth indexes are current and do not emit active Soar gaps for the claimed surface. | `PASS` | `.codex/context/PROJECT_STATE.md`; `.codex/context/TASK_BOARD.md`; generated project truth `totalGaps=0` |
| Supportability | Operators have current smoke, rollback, and observability runbooks tied to the exact candidate and current topology. | `PARTIAL` | `docs/operations/post-deploy-smoke-checklist.md`; `docs/operations/deployment-rollback-playbook.md`; `docs/operations/service-reliability-and-observability.md` |
| Rollback and recovery | A rollback path exists, remains documented, and has not been invalidated by the candidate delta. | `PASS for current topology / CANDIDATE-SPECIFIC RECONFIRMATION STILL OWNED BY QA/OPS` | `docs/operations/deployment-rollback-playbook.md`; same-day runtime recovery packets; `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md` |
| Owner acceptance | An approved owner-verification method is selected in `LUC-4103`, the resulting proof uses the matching approved principal class, and current owner-level acceptance is captured without secret leakage, unsafe mutation, raw protected-body capture, or non-redacted account artifacts. Non-owner protected proof does not satisfy this gate. | `BLOCKED` | `LUC-4103` owner-login interaction path; `.codex/context/PROJECT_STATE.md` owner-login notes; `history/evidence/luc-1792-owner-acceptance-and-protected-proof-gate-review-2026-07-23.md` |
| Release provenance | The exact candidate SHA is independently reviewed, pushed under approval, deployed, and re-smoked on production. | `CURRENT_CANDIDATE_PARITY_ESTABLISHED / PROTECTED ACCEPTANCE STILL SEPARATE` | `history/evidence/luc-27-soar-build-to-production-blocked-closeout-2026-07-23.md`; `history/evidence/luc-1708-release-sha-reconciliation-2026-07-23.md`; `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md` |

## Sale-Readiness Decision Rule

Soar v1.0 is `sale-ready` only when all of the following are true for the exact
candidate SHA:

1. every gate above is `PASS`
2. no first-class blocker remains in the associated gap register
3. owner-acceptance is complete through the approved verification path
   and cannot be substituted by admin-smoke or other non-owner protected proof
4. release provenance is current for the deployed candidate
5. no excluded surface is silently being treated as in-scope proof

If any gate is not `PASS`, the disposition remains `NO-GO`.

## Current Decision

Current decision for Thursday, July 23, 2026:

`NO-GO / PROTECTED_ACCEPTANCE_PENDING / OWNER_ACCEPTANCE_PENDING`

Why:

- current exact candidate alignment is public for
  `ca712e98b70e157b643db4f57726a02821a140bc`, but protected acceptance is not
  yet rerun and recorded for this contract
- owner-login / owner-acceptance remains a live gated interaction path
- owner acceptance still requires the approved `LUC-4103` method and matching
  principal-class proof; current protected proof does not replace that gate
- supportability and protected acceptance are not yet refreshed for the exact
  current candidate

## Minimal Next Legal Lanes

1. QA execution lane:
   [LUC-1796](/LUC/issues/LUC-1796) exact-candidate acceptance rerun for
   deployed candidate `ca712e98b70e157b643db4f57726a02821a140bc`.
2. Owner-acceptance lane:
   [LUC-4103](/LUC/issues/LUC-4103) remains the approved owner-verification
   method-selection and evidence path.
3. Closed prerequisite lanes:
   [LUC-1791](/LUC/issues/LUC-1791) resolved release provenance for the current
   candidate; [LUC-1792](/LUC/issues/LUC-1792) confirmed the owner-acceptance
   boundary; [LUC-1793](/LUC/issues/LUC-1793) published the verification
   matrix that `LUC-1796` now executes against the current candidate.

## Transition Rule Out Of 11 Innovation

This contract only establishes Soar's internal v1.0 readiness gate.

A move from `11 Innovation: Soar` to a product/commercialization track requires
an explicit later decision after this contract turns `GO`. This document alone
does not authorize that transition.
