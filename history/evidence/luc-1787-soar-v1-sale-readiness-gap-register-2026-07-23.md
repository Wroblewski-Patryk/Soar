# LUC-1787 Soar V1.0 Sale-Readiness Gap Register

Date: Thursday, July 23, 2026
Parent issue: `LUC-1787`
Contract: `docs/planning/soar-v1-sale-readiness-contract.md`

## Scope

This packet deduplicates the current Soar v1.0 sale-readiness blockers against
the new contract gates. It uses current July 23, 2026 evidence and keeps the
exact production SHA separate from the unreleased local candidate.

## Baseline

- Current public production build-info SHA is
  `ca712e98b70e157b643db4f57726a02821a140bc`.
- Local workspace `HEAD` is
  `ca712e98b70e157b643db4f57726a02821a140bc`.
- Earlier same-day sale-readiness candidate
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa` is superseded by five later
  commits.
- Generated project truth reports `totalGaps=0`.
- No active gap is created for app-completion/doc-truth because current truth is
  clean; the remaining blockers are release/proof/acceptance gates.

## Deduplicated Gap Register

| Gap ID | Contract gate | Current state | Evidence | Owner / next action | Verification exit | Release impact |
| --- | --- | --- | --- | --- | --- | --- |
| SRG-001 | Release provenance | `RESOLVED_FOR_CURRENT_CANDIDATE` | `history/evidence/luc-27-soar-build-to-production-blocked-closeout-2026-07-23.md`; `history/evidence/luc-1708-release-sha-reconciliation-2026-07-23.md`; `history/evidence/luc-1791-soar-v1-exact-candidate-release-parity-packet-2026-07-23.md` | Release / EDL via [LUC-1791](/LUC/issues/LUC-1791): superseded old candidate `40cfb8f2...`, verified current exact candidate `ca712e98...` across local `HEAD`, `origin/main`, and public production build-info, and retired the obsolete no-force-push packet for the old SHA. | Current exact candidate remains the one pushed and deployed, and downstream protected acceptance uses the same SHA. | Release-safe wording now points at the current deployed candidate; sale-ready still remains blocked by protected acceptance and owner-acceptance lanes. |
| SRG-002 | Protected acceptance and supportability | `BLOCKED_ON_EXACT_CANDIDATE_PROOF` | `history/evidence/luc-27-soar-build-to-production-blocked-closeout-2026-07-23.md`; `docs/operations/post-deploy-smoke-checklist.md`; `docs/operations/deployment-rollback-playbook.md`; `docs/operations/service-reliability-and-observability.md` | QA / QVE via [LUC-1793](/LUC/issues/LUC-1793): translate the contract into an exact-candidate verification matrix, then rerun public/protected smoke, route checks, and operator-readiness proof after the approved deploy. | Public `/health` and `/ready`, protected `/ready/details`, `/workers/ready`, `/workers/runtime-freshness`, plus exact-candidate smoke gates pass on the deployed candidate with recorded evidence. | Without exact-candidate proof, Soar can only claim historical runtime health, not current sale-readiness. |
| SRG-003 | Owner acceptance | `BLOCKED / WAITING_METHOD_SELECTION` | `.codex/context/PROJECT_STATE.md` entries for `LUC-4103`; existing owner-login waiting-state packets; `history/evidence/luc-1792-owner-acceptance-and-protected-proof-gate-review-2026-07-23.md` | Security via [LUC-1792](/LUC/issues/LUC-1792) plus board/operator path: confirm `LUC-4103` remains the approved owner-login method boundary, then complete the selected redacted proof path without secret leakage, unsafe mutation, raw protected-body capture, or principal-class drift. | Approved owner-verification method is selected, the matching owner-level proof passes, and the evidence remains redacted/fail-closed. Non-owner protected proof does not close this gap. | Sale-readiness cannot be claimed without explicit owner-acceptance for the approved path. |

## Non-Gaps By Decision

These areas were reviewed and intentionally not emitted as fresh gaps:

- Documentation truth:
  current generated project truth reports `totalGaps=0`.
- Historical functional breadth:
  delivery-map and capability evidence already prove a broad implemented surface;
  the remaining problem is exact-candidate provenance/proof, not missing core
  functional inventory.
- LIVE trading proof:
  explicitly out of scope for this sale-readiness contract.
- Hosted Paperclip V1, sales, and customer outreach:
  explicitly out of scope for this maturation program.

## Current Disposition

`NO-GO / 2 ACTIVE GAPS / CURRENT_CANDIDATE_PUBLICLY_ALIGNED / SRG-002_EXECUTION_DELEGATED / OWNER_ACCEPTANCE_PENDING`

## Recommended Follow-Up Lanes

1. [LUC-1796](/LUC/issues/LUC-1796) `09 QVE` exact-candidate acceptance rerun for current deployed candidate `ca712e98...`.
2. [LUC-4103](/LUC/issues/LUC-4103) owner-login method selection and redacted owner-acceptance path.
3. Closed prerequisite lanes:
   [LUC-1791](/LUC/issues/LUC-1791) resolved release provenance,
   [LUC-1792](/LUC/issues/LUC-1792) confirmed the owner-acceptance boundary,
   and [LUC-1793](/LUC/issues/LUC-1793) published the verification matrix now
   executed by `LUC-1796`.
