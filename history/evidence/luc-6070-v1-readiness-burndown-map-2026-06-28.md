# LUC-6070 V1 Readiness Burn-Down Map - 2026-06-28

## Scope

PM coordination and queue restoration only. No production mutation, push,
deploy, secret reveal, paid-account mutation, exchange mutation, order,
position, subscription/payment mutation, or live-trading action.

## Current Readiness Index

Source readback:

- Paperclip issue: `LUC-6070`, status `in_progress`, no comments.
- Soar project active issues readback: `153`.
- Status split: `135 blocked`, `5 in_review`, `6 backlog`, `6 todo`, `1 in_progress`.
- Priority split: `106 critical`, `44 high`, `3 medium`.
- `82` active issues report blocker attention.
- `16` active issues are assigned to paused agents.
- `10` active issues are local-board-owned and should stay assigned to
  local-board until answered.
- App-completion source: `docs/status/app-completion-index.json`, generated
  `2026-06-28T12:20:40.798Z`.
- App-completion split: `2587` items, `452` browser-review rows, `1292`
  missing test links, `608` missing doc links, `11` blocked rows.
- Architecture-awareness report generated `2026-06-28T12:19:56.760Z`;
  recent controller evidence records strict graph drift `PASS` (`849/849`, `0`
  missing).

## Queue Buckets

| Bucket | Count | Current handling |
| --- | ---: | --- |
| Done | existing closed evidence lanes | Account, Subscription, Exchange subproofs, Unclassified classification, Trading safe proof, HomeLiveWidgets split proof, stale smoke-token removal, production acceptance, and production health evidence are already represented by same-day closed issues and history packets. |
| Blocked | 135 | Keep fail-closed where protected credentials, board secrets, deploy/source-control, or control-plane owner authority are missing. Do not reopen duplicate proxy lanes. |
| Todo | 6 | Active next work includes `LUC-5606`; paused-owner todos need reassignment (`LUC-5636`, `LUC-5864`, `LUC-5869`, `LUC-4853`). |
| Paused-owner | 16 | Routed to child `LUC-6073` for COO/control-plane reassignment or explicit owner-action. |
| Board-needed | 10 | Keep assigned to local-board: `LUC-4103`, `LUC-5205`, `LUC-6002`, `LUC-4471`, `LUC-4202`, `LUC-4192`, `LUC-4184`, `LUC-4019`, `LUC-3525`, `LUC-2755`. |
| Duplicate/superseded | multiple controller/proxy lanes | Do not create more Account, Subscription, Exchange, Admin, protected-smoke, stale-token, build-provenance, host-level, Trading heavy-component, or Unclassified classification lanes without a new failing artifact. |

## Top-10 V1 Burn-Down List

| Rank | Work | Owner | Layer | Proof | Dependency |
| ---: | --- | --- | --- | --- | --- |
| 1 | Reassign paused-owner active V1 issues, especially `LUC-5636`, `LUC-5864`, `LUC-5869`, and `LUC-4853`. | `04 COO` via `LUC-6073` | Control plane / delivery ownership | Issue updates showing live owner or explicit blocker/action. | Paperclip authorization boundary. |
| 2 | Resolve protected release/account input families for parent protected gate. | local-board / Security-Ops | Secrets / release inputs | No-value readiness shows required families present, then protected proof lane wakes. | Board-owned `LUC-6002`; do not expose secret values. |
| 3 | Repair API Backtests shared-DB cleanup isolation. | `09 CBE` on existing `LUC-5606` | Backend / tests | Repeatable smoke/e2e pack passes without DB cleanup flake. | Local DB/test runtime availability. |
| 4 | Close runtime-impact dirty cluster only after DB-backed API validation. | `09 CBE` on `LUC-6064` | Backend / source-control | Passing focused API-key e2e validation and coherent commit SHA. | Shared main is dirty/divergent; no deploy source. |
| 5 | Package app-completion residual rows into worker-ready packets. | `04 DSM` via `LUC-6074` | Docs / product proof map | Artifact with row counts, owner, route/file, and verification needed. | Current app-completion index. |
| 6 | Continue safe no-live browser-review burn-down. | `09 QVE` via `LUC-6075` | QA / Web proof | Browser/test evidence for Dashboard overview, User configuration, and selected Trading rows. | Avoid protected/live-money rows. |
| 7 | Close or transfer exchange parent `LUC-5636`. | COO/Delivery after `LUC-6073` | Integration / delivery | Parent issue closed, transferred, or explicitly deferred with evidence from children. | Current assignee `09 IDE` is paused. |
| 8 | Resolve Web build-info/source provenance before any release claim. | DRE/CTO | Ops / source-control | Build-info metadata fix promoted and redeploy readback verified. | Protected inputs and clean release ref. |
| 9 | Keep board-owned operator inputs waiting with exact asks. | local-board | Operator / credentials | Board provides owner-login, PROD_DB_CHECK, Coolify log, or smoke principal inputs. | Human/operator decision/input, not agent work. |
| 10 | Convert remaining blocker-attention queue into first-class blockers or closures. | COO / SPM follow-up | Control plane hygiene | Stale proxy issues closed as superseded or blocked by concrete child issue. | Requires owner-path authority; avoid duplicate proxies. |

## Child Issues Created

- `LUC-6073`: `[Soar][COO] Reassign paused-owner V1 queue lanes from LUC-6070 map`.
- `LUC-6074`: `[Soar][Docs] Package app-completion residual rows into worker-ready proof lanes`.
- `LUC-6075`: `[Soar][QA] Continue safe no-live browser-review burn-down from V1 readiness map`.

## Validation

- Paperclip heartbeat context readback for `LUC-6070`: `PASS`.
- Soar active issue readback by project/status: `PASS`, `153` active issues.
- Company agent readback: `PASS`, active/paused ownership classified.
- App-completion index metadata readback: `PASS`.
- `git status --short --branch`: repo is pre-existing dirty/divergent
  (`main...origin/main` ahead `16`, behind `2`); this PM packet is not a
  release source.

## Residual Risk

V1 is not complete. Current state is `partially verified / execution restored
through delegated lanes / protected and board-owned gates still blocked`.

