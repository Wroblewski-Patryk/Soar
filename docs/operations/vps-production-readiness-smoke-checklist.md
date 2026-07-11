# VPS Production Readiness Smoke Checklist

Date: 2026-07-11
Scope: Soar production VPS/Coolify readiness proof for LUC-502.

## Purpose

Convert the remaining production proof gaps into an operator checklist that can
be executed without exposing secret values. This checklist separates public
readiness, protected input readiness, protected runtime proof, rollback proof,
and release acceptance so public smoke is never substituted for protected
production proof.

## Safety Boundary

- Do not print, copy, screenshot, or store raw secrets, cookies, JWTs, database
  URLs, exchange keys, account passwords, payment data, or Coolify tokens.
- Use Paperclip protected refs and environment bindings by name only.
- Do not deploy, restart, rollback, mutate subscriptions, mutate API keys,
  mutate exchange state, place orders, close positions, or perform paid-resource
  actions from this checklist unless a separate issue/approval explicitly
  authorizes that action.
- LIVE trading mutation is out of scope. Read-only trading/runtime checks must
  stay read-only and fail closed on ambiguous controls.

## Required Operator Inputs

| Input family | Required for | Evidence rule | If missing |
| --- | --- | --- | --- |
| `SOAR_PROD_*` | production API/Web base URLs and app context | name presence only in readiness sweep; no values recorded | block protected proof setup |
| `ROLLBACK_GUARD_*` | rollback/runtime freshness and protected auth context | name presence plus successful rollback guard proof artifact | block rollback acceptance |
| `PROD_DB_CHECK_*` or `PRODUCTION_DB_CHECK_*` | backup/restore drill proof | name presence plus current restore drill PASS artifact | block restore acceptance |
| `RC_*` | release-candidate evidence context | current RC external gates and sign-off artifacts | block release acceptance |
| `GATE*` / `GATE_*` | operator/board gate context | current gate approval/status artifact | block release acceptance |
| `PROD_UI_AUDIT_*` or `PROD_UI_*` | authenticated production browser/UI proof | protected browser proof artifact with redacted output | block authenticated UI acceptance |
| `LIVEIMPORT_READBACK_*` | read-only runtime/trading readback | redacted readback artifact proving no token capture and no mutation | block runtime/trading acceptance |

Run the existing no-secret readiness sweep before protected proof:

```bash
pnpm run ops:protected-inputs:check
```

Pass condition for setup readiness: all account-access required families are
present by name and the checker reports account-access gate `PASS`. This is not
runtime proof by itself.

## Checklist

| ID | Gate | Proof to collect | Pass condition | Fail-closed condition |
| --- | --- | --- | --- | --- |
| VPS-RDY-01 | Source provenance | `git rev-parse HEAD`; Web `/api/build-info` | deployed SHA matches candidate SHA and build-info source is `env`, `git`, or `git-files` | SHA mismatch, `unknown`, `env-runtime`, or branch-head fallback |
| VPS-RDY-02 | Public API readiness | `GET /health`; `GET /ready` | both return `200`; `/ready` confirms DB/Redis dependencies | non-200, timeout, degraded readiness, Redis unavailable |
| VPS-RDY-03 | Public Web readiness | Web `/`; Web `/auth/login`; static chunk load | status `200`; no fatal runtime load error | non-200, broken chunks, login route runtime error |
| VPS-RDY-04 | Worker readiness | protected/public worker readiness path according to configured auth | workers healthy, no crash loop, runtime freshness within budget | unauthorized expected path not documented, crash loop, stale workers |
| VPS-RDY-05 | Protected input readiness | `pnpm run ops:protected-inputs:check` | account-access gate `PASS`; required family names present | missing required family or checker `BLOCKED` |
| VPS-RDY-06 | Auth/session proof | protected auth browser or API proof with test account refs | login, protected route access, logout, stale session rejection pass | rate-limit dependency failure, unauthorized protected access, secret exposure |
| VPS-RDY-07 | Runtime dashboard proof | protected dashboard/bot runtime proof | dashboard loads, bot runtime sections resolve, no fatal fetch errors | `NO_SESSION` false negative, fatal API errors, stale runtime |
| VPS-RDY-08 | Read-only trading/runtime readback | `LIVEIMPORT_READBACK_*` protected readback artifact | expected runtime rows present, no token capture, no mutation | missing rows, token capture, mutation risk, ambiguous LIVE control |
| VPS-RDY-09 | Backup/restore evidence | current prod restore drill artifact | fresh PASS artifact for candidate/current day | stale, missing, or failed restore artifact |
| VPS-RDY-10 | Rollback guard | current prod rollback proof artifact | fresh PASS artifact; rollback path and target SHA named | stale, missing, failed, or destructive ambiguity |
| VPS-RDY-11 | RC and gate evidence | RC checklist, external gates, sign-off record | all required current-day RC/gate artifacts PASS/APPROVED | stale, missing, not approved, or mismatched SHA |
| VPS-RDY-12 | Logs and secret hygiene | redacted Coolify/app log window | no crash loop, no raw secret/account/token leakage | leaked secret, repeated crash, unclassified high-severity error |

## Recommended Command Flow

Public no-secret checks:

```bash
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha <candidate-sha> --no-workers
pnpm run ops:protected-inputs:check
```

Full protected release gate, only after protected refs and approval context are
bound:

```bash
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha <candidate-sha>
```

Secret-bearing auth values must be supplied through approved protected
environment bindings, not CLI flags, issue comments, documents, screenshots, or
repo files.

## Evidence Packet

Record the following for each run:

- issue id and operator identity,
- environment (`prod`),
- candidate SHA and deployed build-info SHA,
- UTC timestamp,
- checklist rows executed and status,
- command names and exit status,
- redacted artifact paths or issue work products,
- blocker owner/action for every failed row,
- explicit statement that no raw secret values were recorded.

## Acceptance Rule

Production VPS readiness is accepted only when all required rows for the target
release scope are `PASS` with fresh, redacted evidence. Public smoke, input-name
presence, or docs-only checklist completion may improve readiness confidence but
must not close protected production proof or release acceptance by itself.
