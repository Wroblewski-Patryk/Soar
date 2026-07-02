# Task

## Header
- ID: LUC-5998
- Title: App-completion row-level proof backlog by flow
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: 11 SPM (Soar Product Manager)
- Depends on: LUC-5995 status report; current app-completion index
- Priority: P1
- Module Confidence Rows: app-completion proof backlog; user-facing proof linkage
- Requirement Rows: not changed
- Quality Scenario Rows: release evidence traceability
- Risk Rows: proof/linkage backlog; broad smoke masking row-level proof gaps
- Iteration: 2026-06-28
- Operation Mode: BUILDER
- Mission ID: LUC-5998-APP-COMPLETION-ROW-PROOF-BACKLOG-BY-FLOW-2026-06-28
- Mission Status: VERIFIED

## Context

`LUC-5995` reported that Soar's strict app-completion row-clean rate is
`94/2587 = 3.6%`. The issue scope is PM/QA/Docs backlog burn-down by flow, not
feature implementation. The latest local app-completion index was generated at
`2026-06-28T12:20:40.798Z`.

## Goal

Classify the app-completion row-level proof backlog by user flow, avoid
duplicate Account/Subscription/Exchange lanes, and start the smallest concrete
follow-up lanes for the two dominant browser-review buckets.

## Scope

- Read `docs/status/app-completion-index.md`.
- Read `docs/status/app-completion-index.json`.
- Read Paperclip issue `LUC-5998`.
- Create bounded Paperclip child issues for selected flow follow-up.
- Update project state ledgers with the routing decision.

## Implementation Plan

1. Confirm the current app-completion aggregate counts and flow split.
2. Identify the selected flows from the issue acceptance criteria:
   `Unclassified user workflow` and `Trading operation`.
3. Assign owners and expected proof without duplicating existing Account,
   Subscription, Exchange, Admin, protected-smoke, stale-token, build
   provenance, or host-level proof lanes.
4. Create child issues for bounded follow-up work.
5. Record evidence and residual risk in project state.

## Acceptance Criteria

- Backlog is triaged by flow from the current generated index.
- The selected flows have explicit owner/proof decisions.
- Follow-up work is routed as child issues instead of leaving this issue in a
  vague `in_progress` posture.
- No live-money, exchange mutation, order, position, subscription/payment
  mutation, deploy, restart, or secret/account readback occurs.

## Flow Triage

| User flow | Total rows | Browser-review rows | Other dominant risks | Decision | Owner/proof |
| --- | ---: | ---: | --- | --- | --- |
| Unclassified user workflow | 332 | 147 | `implemented_needs_proof=78`, `missing_doc_link=55`, `missing_test_link=50` | Start with PM/Docs row classification before QA browser proof. | 11 SPM owns parent routing; 04 DSM owns journey/doc classification child; QA uses the classified row set after mapping. |
| Trading operation | 219 | 140 | `missing_doc_link=44`, `missing_test_link=28`, `implemented_needs_proof=7` | Start safe no-live-money route/state browser proof and linkage audit. | 09 QVE owns proof execution; 09 FEW owns frontend repair only if QA finds a concrete UI defect; 04 DSM owns doc-link repair follow-up if proof finds doc gaps. |
| Dashboard overview | 134 | 51 | `missing_test_link=56`, `missing_doc_link=24` | Defer until the first two dominant buckets are routed. Existing same-day production clickthrough evidence reduces urgency. | QVE/Docs follow-up later if row-level gaps remain after selected flow slices. |
| Account access | 651 | 31 | `missing_test_link=377`, `missing_doc_link=197` | Do not duplicate. | Covered by existing Account proof lane family. |
| Subscription and entitlement | 541 | 20 | `missing_test_link=435`, `missing_doc_link=69`, `blocked=7` | Do not duplicate. | Covered by existing Subscription/protected-gate lane family. |
| Exchange connection and configuration | 518 | 30 | `missing_test_link=247`, `missing_doc_link=163` | Do not duplicate. | Covered by existing Exchange proof/security/API-key cleanup lanes. |
| User configuration | 152 | 24 | `missing_test_link=75`, `missing_doc_link=49` | Defer. | Later PM/Docs/QVE slice after dominant buckets. |
| Admin operation | 40 | 9 | `missing_test_link=24`, `missing_doc_link=7` | Do not duplicate. | Existing Admin operation proof lane remains owner path. |

## Evidence

- Current app-completion index:
  `docs/status/app-completion-index.md`.
- Current generated JSON:
  `docs/status/app-completion-index.json`.
- Counts: `2587` items, `8` flows, `452` browser/screenshot review rows,
  `1292` missing test-link rows, `608` missing doc-link rows, `11` blocked rows.
- Selected flow counts:
  `Unclassified user workflow` has `147` browser-review rows;
  `Trading operation` has `140` browser-review rows.
- JSON limitation:
  `priorityReviewItems` is currently dominated by global Account rows and does
  not expose row-level detail for Unclassified or Trading. Follow-up child work
  must generate or extract the flow-specific row drill-down before claiming
  row-level verification.

## Validation Evidence

- Tests: not run; no runtime code changed.
- Manual checks:
  - Paperclip issue `LUC-5998` readback confirmed active acceptance criteria.
  - `docs/status/app-completion-index.json` parsed successfully with Node.
  - `git status --short --branch` captured pre-existing mixed dirty/divergent
    state: `main...origin/main [ahead 15, behind 2]`.
- Reality status: verified PM/Docs routing; implementation proof delegated.

## Definition of Done

- [x] Current index counts recorded.
- [x] Dominant selected flows classified.
- [x] Duplicate lane guard recorded for Account, Subscription, Exchange, and
      Admin rows.
- [x] Child issues created for the next executable proof lanes.
- [x] Repository source-of-truth state updated.

## Result Report

- Task summary:
  completed PM triage for `LUC-5998` and routed the selected dominant buckets.
- Child issues created:
  [LUC-6003](/LUC/issues/LUC-6003) for Unclassified user workflow row
  classification, assigned to 04 DSM; [LUC-6004](/LUC/issues/LUC-6004) for
  Trading operation safe browser/state proof, assigned to 09 QVE.
- Files changed:
  this task packet plus project state ledgers.
- How tested:
  read-only index parsing and issue/API readback; no runtime tests required.
- What is incomplete:
  row-level Unclassified and Trading proof is not complete; it is delegated to
  child issues because this issue is the PM/QA/Docs routing parent.
- Next steps:
  child issue owners execute the flow-specific drill-down and safe proof.
- Decisions made:
  do not create duplicate Account, Subscription, Exchange, Admin, protected
  smoke, stale-token, build-provenance, or host-level proof lanes from this
  issue.
