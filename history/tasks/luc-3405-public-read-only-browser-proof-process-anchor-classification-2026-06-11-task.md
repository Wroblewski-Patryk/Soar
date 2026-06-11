# LUC-3405 Public Read-Only Browser Proof Process Anchor Classification

## Header

- ID: LUC-3405
- Title: Classify public read-only browser proof process anchors
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2958, LUC-2975
- Priority: P1
- Module Confidence Rows: public read-only browser proof helper lane
- Requirement Rows: public browser proof traceability
- Quality Scenario Rows: browser/process proof evidence integrity
- Risk Rows: public browser proof process anchor classification
- Iteration: 2026-06-11
- Operation Mode: TESTER
- Mission ID: LUC-3405-PUBLIC-READ-ONLY-BROWSER-PROOF-PROCESS-ANCHOR-CLASSIFICATION-2026-06-11
- Mission Status: VERIFIED

## Context

[LUC-3405](/LUC/issues/LUC-3405) asked QA to classify the remaining public
read-only browser proof process anchors from
`scripts/runPublicReadOnlyBrowserProof.mjs` after [LUC-2958](/LUC/issues/LUC-2958)
and [LUC-2975](/LUC/issues/LUC-2975) completed safe deterministic helper
coverage. The current architecture-awareness report generated
`2026-06-11T02:22:02.917Z` still lists:

- `scripts/runPublicReadOnlyBrowserProof.mjs#createPage`
- `scripts/runPublicReadOnlyBrowserProof.mjs#killProcessTree`
- `scripts/runPublicReadOnlyBrowserProof.mjs#launchBrowser`

## Goal

Classify whether the three remaining anchors should receive local unit proof,
scanner relation rows, or remain tied to real public browser/process proof
evidence.

## Success Signal

- User or operator problem: the missing-test queue should not route duplicate
  local-helper work for anchors that are intentionally browser/process
  orchestration boundaries.
- Expected product or reliability outcome: public read-only browser proof
  traceability is truthful and does not claim mocked unit proof for real
  process/browser lifecycle behavior.
- How success will be observed: documented classification and focused proof
  that existing safe helper tests still pass without launching a browser.
- Post-launch learning needed: no.

## Deliverable For This Stage

A verified QA classification artifact and source-of-truth state updates. No
code implementation was needed.

## Constraints

- Use existing proof and architecture-awareness systems.
- Do not introduce fake test links for process/browser anchors.
- Do not launch a production browser proof, protected proof, deploy, restart,
  secret, account, exchange, order, position, payment, database, or live-trading
  action.
- Preserve [LUC-2958](/LUC/issues/LUC-2958) deterministic helper-test evidence.

## Definition of Done

- [x] Each remaining public browser proof anchor is classified.
- [x] Focused local checks pass without launching a browser.
- [x] State/context files record the classification and residual action.

## Forbidden

- Fake relation rows that imply local unit coverage of OS/browser lifecycle.
- New browser/process proof behavior without explicit scope.
- Protected or production proof execution.
- Secrets, deploys, pushes, restarts, account/payment/exchange/live-trading
  mutations.

## Classification

| Anchor | Classification | Reason | Correct evidence owner |
| --- | --- | --- | --- |
| `scripts/runPublicReadOnlyBrowserProof.mjs#createPage` | `classified_process_browser_boundary` | Opens a real CDP target via `http://127.0.0.1:<port>/json/new`, creates a `CdpClient`, connects a WebSocket, and enables browser domains. This is not a pure deterministic helper. | Public browser proof artifact or future browser harness integration proof. |
| `scripts/runPublicReadOnlyBrowserProof.mjs#killProcessTree` | `classified_os_process_boundary` | Calls Windows `taskkill.exe /T /F` through `spawn` and is intentionally platform/OS side-effect cleanup. | Process cleanup evidence from real browser proof or a dedicated OS-process harness if one is approved. |
| `scripts/runPublicReadOnlyBrowserProof.mjs#launchBrowser` | `classified_process_browser_boundary` | Spawns Chrome/Edge headless with a temporary profile and waits for the remote-debugging endpoint. This is lifecycle orchestration, not a safe helper to unit-claim through static mocks. | Public browser proof artifact or future browser harness integration proof. |

## Validation Evidence

- `node --check scripts/runPublicReadOnlyBrowserProof.mjs` PASS.
- `node --check scripts/runPublicReadOnlyBrowserProof.test.mjs` PASS.
- `node --test scripts/runPublicReadOnlyBrowserProof.test.mjs` PASS (`5/5`).
- Direct [LUC-2958](/LUC/issues/LUC-2958) relation readback remains present for
  the safe helper anchors (`16` rows).
- No `chrome-headless-shell` process found after validation.

## Architecture Evidence

- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/status/luc-2953-actionable-missing-test-proof-classification-2026-06-08.md`,
  `docs/architecture/relations/priority-test-links.csv`,
  `scripts/runPublicReadOnlyBrowserProof.mjs`, and
  `scripts/runPublicReadOnlyBrowserProof.test.mjs`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none required for implementation; a
  future architecture-awareness classifier may classify these anchors as
  browser/process orchestration noise instead of actionable unit-test gaps.

## Result Report

[LUC-3405](/LUC/issues/LUC-3405) is complete as a QA classification. The
remaining `createPage`, `killProcessTree`, and `launchBrowser` rows should not
create another local helper-test lane. They are legitimate browser/process
orchestration boundaries and should be evidenced by public browser proof
artifacts or a future approved browser/process integration harness.

No code was changed, no browser was launched, and no protected or production
action was performed.
