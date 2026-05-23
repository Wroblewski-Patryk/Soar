# Main Promotion Build-Info Task - 2026-05-19

## Context

Production build-info reported `gitRef: main` and matched `origin/main` at
`1586f59261cef94d7c513d71bbfcfb697d11ca59`, while the audit branch head was
`dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`. The previous post-push readback
therefore represented branch/target drift, not a deployed `main` lag.

## Goal

Promote the current audit branch HEAD to `origin/main` only if it is a
fast-forward relative to `origin/main`, then verify production build-info and
public smoke for the promoted target.

## Constraints

- Do not mutate production data.
- Do not submit, cancel, or close LIVE orders.
- Do not run exchange-side mutation.
- Do not run protected authenticated production journeys.
- Do not claim full production release readiness from public smoke alone.

## Definition of Done

- Confirm `origin/main` is an ancestor of the current HEAD.
- Push the current HEAD to `origin/main`.
- Wait for production Web build-info to expose the target commit.
- Run public no-worker deploy smoke.
- Update state files to distinguish public deploy freshness from full
  protected release-gate readiness.

## Result Report

Status: verified.

Promotion result: PASS. `origin/main` moved from
`1586f59261cef94d7c513d71bbfcfb697d11ca59` to
`dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`.

Build-info result: PASS. `ops:deploy:wait-web-build-info` observed
`dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` on attempt `8`.

Public smoke result: PASS for API `/health`, API `/ready`, and Web `/`.

Conclusion: the pushed audit/decision-sync branch content is now deployed on
production `main` by build-info and public smoke is healthy. Full protected
`AUD-19` release readiness still requires protected runtime, rollback,
backup/restore, and sign-off evidence.
