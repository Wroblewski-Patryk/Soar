# LUC-2286 Choose Next Soar Web Recovery Action After Restart 503

Date: 2026-06-05
Owner: Ops Release Lead
Stage: release

## Context

[LUC-2280](/LUC/issues/LUC-2280) exhausted the single permitted `soar-web`
restart after public Web stayed `503` and Coolify reported `soar-web`
`restarting:unknown`. [LUC-2282](/LUC/issues/LUC-2282) prepared the next
legal action: one controlled Web-only redeploy from pushed `main` at
`6e31d814046b640ad529d1cd57f968ba6f67b05e`, with rollback explicitly
unauthorized until a previous stable deployment/image is named from approved
deployment history or host/Coolify logs.

## Goal

Choose and execute the smallest permitted `soar-web` recovery action, then
fail closed with a named blocker if readiness does not recover.

## Constraints

- Target only `Soar / production / soar-web`.
- Use existing Paperclip/Coolify secret bindings only; never print or persist
  token values, cookies, raw resource ids, generated database suffixes, or
  secret-bearing logs.
- Do not mutate API, database, Redis, workers, environment variables, team
  settings, accounts, exchange settings, or live-trading state.
- Do not perform a second restart or second recovery mutation after the permit
  stop condition trips.

## Definition Of Done

- Source ref is confirmed pushed.
- Exactly one permitted recovery action is attempted.
- Public API/Web smoke and Web build-info polling are recorded.
- If recovery fails, a first-class blocker exists for the next legal action.
- Issue disposition is updated with evidence and residual risk.

## Forbidden

- No rollback without an exact previous stable deployment/image selected from
  approved evidence.
- No unredacted deployment logs in repository artifacts or issue comments.
- No protected smoke, account action, database mutation, env edit, or
  live-trading action.

## Evidence

| Check | Result |
| --- | --- |
| Wake payload | consumed scoped [LUC-2286](/LUC/issues/LUC-2286); `fallbackFetchNeeded=no`; checkout already claimed by harness |
| Source ref | `origin/main` resolves to `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| Chosen action | one controlled `soar-web` redeploy via Coolify deploy-by-UUID endpoint |
| Deploy request | accepted and queued for `soar-web`; raw deployment/resource ids not persisted |
| Web build-info wait | failed after 10 attempts over 150 seconds; every attempt returned `503` |
| Public smoke after redeploy | API `/health` `200`; API `/ready` `200`; Web `/` `503`; Web `/api/build-info` `503` |
| Coolify readback after redeploy | `soar-web` still `restarting:unknown`; branch `main`; configured commit `HEAD`; deployment history shows new queued `HEAD` rows and earlier queued `6e31d814...` row |
| Env-contract regression | `pnpm run ops:coolify-stack:env-check:test` passed (`8/8`) |
| Follow-up blocker | created [LUC-2289](/LUC/issues/LUC-2289) for Security-approved redacted host/Coolify deployment-log export |

## Result Report

Status: done as recovery decision.

The redeploy permit did not recover production Web. API stayed healthy, but
Web stayed unavailable and Coolify did not produce a successful current Web
deployment within the permitted polling window.

Security Review Lead completed [LUC-2289](/LUC/issues/LUC-2289), approving a
constrained redacted deployment-history/log export path. Ops retrieved only a
projected `soar-web` deployment-history/log summary under that approval:

- current public state still failed: API `/health` and `/ready` `200`, Web `/`
  and `/api/build-info` `503`;
- Coolify still reported `soar-web` `restarting:unknown`;
- a same-SHA `6e31d814046b640ad529d1cd57f968ba6f67b05e` deployment finished
  with normalized build/start/rolling-update completion events, but Web stayed
  `503`;
- the immediately preceding finished source candidate is
  `b894e5dd30614dfd2035e91e3d848c842d3ff380`, finished at
  `2026-06-05T19:51:01Z` with normalized build/start/rolling-update completion
  events;
- the current app-log endpoint returned `400`; no raw logs or raw ids were
  persisted.

Next owner/action: Ops created [LUC-2293](/LUC/issues/LUC-2293), a separate
release permit for one controlled `soar-web` rollback/redeploy to
`b894e5dd30614dfd2035e91e3d848c842d3ff380` with explicit stop condition,
smoke, exclusions, and roll-forward boundary. [LUC-2286](/LUC/issues/LUC-2286)
is complete as the decision issue; the next mutation belongs to
[LUC-2293](/LUC/issues/LUC-2293).
