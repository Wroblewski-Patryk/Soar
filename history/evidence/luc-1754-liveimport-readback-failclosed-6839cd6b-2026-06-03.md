# LUC-1754 LIVEIMPORT_READBACK Fail-Closed Evidence

## Context

- Issue: `LUC-1754`
- Parent: `LUC-405`
- Evidence date: 2026-06-03
- Target account class: production app/runtime read-only principal required, but absent in this runner
- Secret handling: no secret values printed, copied, or stored
- Mutation boundary: no deploy, restart, rollback, DB write, exchange mutation, order placement, account setting change, protected payload readback, or live-trading action

## Target

- API base URL: `https://api.soar.luckysparrow.ch`
- Web base URL: `https://soar.luckysparrow.ch`
- Production build-info SHA: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- Git ref: `main`
- Build-info checked at: `2026-06-03T13:12:53.834Z`
- Symbol mode requested: `auto`

## Commands And Results

| Step | Command/probe | Result | Notes |
| --- | --- | --- | --- |
| 1 | Public `/api/build-info` readback | PASS | Current production target is `6839cd6b8884e26eca735ce32cea98c1dadccfbe`, not the older historical `71b8d503...` candidate. |
| 2 | `node scripts/checkProtectedInputReadiness.mjs --today 2026-06-03 --expected-sha 6839cd6b8884e26eca735ce32cea98c1dadccfbe ...` | BLOCKED | `0` matching protected input names. `LIVEIMPORT_READBACK_*` is missing. |
| 3 | `node scripts/collectLiveImportReadbackEvidence.mjs --expected-sha 6839cd6b8884e26eca735ce32cea98c1dadccfbe --symbols auto ...` | FAIL_CLOSED | Collector stopped before protected runtime readback because neither `LIVEIMPORT_READBACK_AUTH_TOKEN` nor `LIVEIMPORT_READBACK_AUTH_EMAIL` plus `LIVEIMPORT_READBACK_AUTH_PASSWORD` was present. |

## Redaction Checks

- Raw auth token stored: no
- Password stored: no
- Cookie stored: no
- Exchange credential stored: no
- Runtime/imported-position protected payload stored: no, because the collector failed closed before readback

## Result

`LUC-1754` cannot truthfully produce protected imported-position/runtime readback in the current runner. The available evidence is a protected-input and collector fail-closed packet for the current production SHA/date.

## Release Impact

`LIVEIMPORT_READBACK` protected evidence remains absent. Public build-info readback must not be substituted for protected imported-position/runtime proof.

## Next Action

Security/Ops must bind or provide an approved transient read-only production principal/session in the `LIVEIMPORT_READBACK_*` family, then wake `LUC-1754` to rerun the existing collector against the current production build-info SHA.
