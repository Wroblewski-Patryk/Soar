# LUC-1793 Soar V1.0 Exact-Candidate Verification Matrix

Status: Planned  
Date: Thursday, July 23, 2026  
Owner: `09 QVE (QA & Verification Engineer)`  
Contract: `docs/planning/soar-v1-sale-readiness-contract.md`  
Gap register row: `SRG-002` in `history/evidence/luc-1787-soar-v1-sale-readiness-gap-register-2026-07-23.md`

## Purpose

Freeze the minimum exact-candidate QA proof required before Soar can change its
v1.0 sale-readiness disposition from `NO-GO` to `GO` for the current local
candidate SHA:

`40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`

This packet does not execute deploy, smoke, protected proof, or owner-login.
It defines the fail-closed verification order and evidence requirements for the
approved deploy candidate.

## Current Truth

- Current green production runtime proof belongs to deployed SHA
  `b0b2c2ce9477a32fcda7717f447ad46aa4327589`.
- Local workspace `HEAD`
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa` is `142` commits ahead of the
  tested production SHA and is not yet covered by the July 23 runtime proof.
- `LUC-1791` owns exact-candidate release parity and approved deploy path.
- `LUC-1792` owns protected gate review and whether `LUC-4103` remains the
  correct owner-acceptance boundary.
- `LUC-4103` remains the owner-login method-selection and approved execution
  path for owner-level acceptance proof.

## Dependencies And Stop Conditions

Do not run later phases when an earlier dependency fails.

| Dependency | Owner | Why it blocks this matrix | Required unblock |
| --- | --- | --- | --- |
| Exact candidate approved for release | `LUC-1791` | QA cannot prove a SHA that is not the approved deployed candidate. | Approved push/deploy path for exact SHA `40cfb8f2...` |
| Production/Web build-info parity | `LUC-1791` | Historical runtime proof cannot be reused for the local unreleased SHA. | Production reports candidate SHA consistently |
| Protected-route method and scope review | `LUC-1792` | Protected acceptance must not overrun auth/security boundaries. | Security confirms exact protected proof scope and prerequisites |
| Owner-login method selection | `LUC-4103` | Owner acceptance cannot be improvised from a different account path. | Approved owner-login method and redaction rules |

## Evidence Bundle Required Per Execution

Each future rerun of this matrix should record:

- environment: `prod` or explicitly approved `stage`
- exact candidate SHA
- execution date/time in UTC
- operator or agent identity
- command outputs for scripted smoke
- endpoint responses or screenshots for public/protected routes
- Web `/api/build-info` readback proving the candidate SHA
- protected route readback proving worker/API identity consistency
- owner-acceptance evidence or explicit blocker reference to `LUC-4103`
- rollback and observability references used during the rerun

## Phase Order

1. Release parity bind
2. Public exact-candidate smoke
3. Protected readiness and worker freshness proof
4. Auth/dashboard/operator baseline
5. Paper-safe write proof
6. Security and owner-acceptance gates
7. Supportability / rollback closeout

If any phase fails, disposition remains `NO-GO` and the failure becomes the new
first-class blocker for the candidate.

## Verification Matrix

| Phase | Gate family | Preconditions | Exact action | PASS rule | Evidence to capture | Fail-closed notes |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Candidate binding | `LUC-1791` approved deploy path exists | Record exact candidate SHA, target env, intended branch/ref, and approved deploy scope | Candidate SHA is explicitly `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa` and is the only SHA under test | Release packet reference, issue links, timestamp | Do not accept abbreviated SHA or "latest main" wording |
| 1 | Public API smoke | Candidate is deployed | Run `pnpm run ops:deploy:smoke -- --base-url <api-url> --web-base-url <web-url> --expected-sha 40cfb8f2cf913966f9c7159b49ae256b2aebbcaa --no-workers` or equivalent public probes | `/health` and `/ready` return `200`; API release/build identity matches expected SHA | Command output, endpoint snapshots | Any SHA mismatch or degraded readiness is a blocker |
| 2 | Web baseline and build-info provenance | Candidate is deployed and Web reachable | Verify `/`, `/auth/login`, static assets, and `/api/build-info` on the production Web domain | Web routes load; `/api/build-info` returns exact SHA and authoritative provenance (`env`, `git`, or `git-files`) | Browser/readback notes and `/api/build-info` payload | `env-runtime`, `github-branch`, or stale SHA fail provenance |
| 3 | Protected readiness details | Approved protected auth/session path exists per `LUC-1792` | Read `GET /ready/details` with approved auth context | `200` and no degraded critical dependency state | Response payload excerpt, auth method reference | No unauthenticated fallback or copied historical payloads |
| 4 | Worker readiness identity | Protected auth/session path exists | Read `GET /workers/ready` | Every required worker heartbeat is fresh and every `releaseSha` equals `40cfb8f2...` | Response payload excerpt showing worker identities | Mixed worker/API SHAs fail readiness even during rollout |
| 5 | Worker runtime freshness | Protected auth/session path exists | Read `GET /workers/runtime-freshness` | Endpoint returns `200 PASS` for candidate and freshness window | Payload excerpt with PASS result | Any stale/missing worker makes sale-readiness `NO-GO` |
| 6 | Auth baseline | Approved test/admin account path exists | Verify login, protected route access, and logout on deployed candidate | Login works without degraded Redis/auth errors; protected routes are accessible only with session; logout returns to public route | Manual steps, screenshots or notes | `Rate limit temporarily unavailable`, auth loop, or broken logout fail the gate |
| 7 | Dashboard baseline | Auth baseline passed | Open `/dashboard` and confirm main cards/loaders settle without fatal API errors | Dashboard renders; no critical authenticated fetch failures; auto-refresh remains stable long enough to observe | Manual notes/screenshots | Public health alone is insufficient if dashboard is broken |
| 8 | Bots runtime/operator baseline | Dashboard baseline passed | Load bot runtime view and operator-critical runtime surfaces | Runtime view loads positions/history/signals; no false `NO_SESSION`; drift audit path behaves deterministically when applicable | Screenshots/notes plus API response excerpt if used | This gate is required because sale-readiness includes operator supportability, not only API health |
| 9 | Paper-safe write baseline | Approved non-destructive paper scenario exists | Execute one controlled paper-safe bot/backtest action | Write persists and appears in UI/API without unexpected errors | Step log and resulting UI/API readback | No LIVE trading or unsafe mutation is allowed |
| 10 | Security fail-closed baseline | Protected/auth baseline passed | Check unauthorized access denial for protected ops paths and inspect logs/UI for obvious secret leakage | Protected routes deny unauthorized access; no secret values leak in UI/log proof | Notes, sanitized log reference if needed | Do not paste secrets or tokens into evidence |
| 11 | Owner acceptance boundary | `LUC-4103` method selected and allowed | Execute the approved owner-verification path only through `LUC-4103` method | Owner-level acceptance is captured with redaction and no unsafe mutation | Linked owner-acceptance packet | This matrix cannot self-authorize owner proof |
| 12 | Rollback/supportability closeout | Prior phases passed | Reconfirm smoke, observability, and rollback references remain valid for candidate deploy | Operators can point to current smoke checklist, rollback playbook, and service reliability references for this candidate run | Linked runbooks and execution notes | Historical runbooks without candidate-bound rerun notes are insufficient |

## Minimal Commands And Surfaces

Use the smallest sufficient proof first:

- `pnpm run ops:deploy:smoke -- --base-url <api-url> --web-base-url <web-url> --expected-sha 40cfb8f2cf913966f9c7159b49ae256b2aebbcaa --no-workers`
- `GET /health`
- `GET /ready`
- Web `/api/build-info`
- `GET /ready/details`
- `GET /workers/ready`
- `GET /workers/runtime-freshness`
- manual auth/dashboard/bot-runtime readback
- one paper-safe write path

Escalate to broader release gate only if the narrow candidate proof exposes a
new failure family that the smaller smoke cannot classify.

## PASS / FAIL Disposition

### Matrix PASS

The matrix is `PASS` only when all applicable rows above are green for the
exact deployed candidate SHA and the owner-acceptance path is either completed
or explicitly marked as the only remaining blocker by the approved security
boundary.

### Matrix FAIL

The matrix is `FAIL` when any of the following occur:

- deployed API or Web reports a SHA other than `40cfb8f2...`
- `/health`, `/ready`, `/ready/details`, `/workers/ready`, or
  `/workers/runtime-freshness` fail
- protected routes require unapproved auth handling
- dashboard/operator surfaces regress while public smoke stays green
- paper-safe write path fails or mutates outside approved scope
- owner-acceptance is claimed without the `LUC-4103` approved method

## Closeout Rule

Future execution of this packet may upgrade Soar's v1.0 readiness only when:

1. `LUC-1791` proves exact deploy parity for `40cfb8f2...`
2. this matrix is rerun against that deployed candidate
3. `LUC-1792` confirms protected scope remains approved
4. `LUC-4103` resolves the owner-acceptance method and evidence path

Until then, the truthful status remains:

`NO-GO / CURRENT_RUNTIME_GREEN_BUT_LOCAL_CANDIDATE_UNPROVEN / OWNER_ACCEPTANCE_PENDING`

## Source References

- `docs/planning/soar-v1-sale-readiness-contract.md`
- `history/evidence/luc-1787-soar-v1-sale-readiness-gap-register-2026-07-23.md`
- `history/evidence/luc-27-soar-build-to-production-blocked-closeout-2026-07-23.md`
- `history/evidence/luc-1708-release-sha-reconciliation-2026-07-23.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/operations/service-reliability-and-observability.md`
