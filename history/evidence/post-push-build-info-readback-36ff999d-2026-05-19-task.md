# Post-Push Build-Info Readback Task - 2026-05-19

## Context

The reusable audit and decision-sync commit `36ff999d` was pushed to
`origin/codex/v1-proof-and-ops-evidence`. The user expected pushed commits to
trigger redeploy. `AUD-19` requires build-info freshness before any new
production readiness claim.

## Goal

Check, without mutation, whether public production build-info exposes the pushed
commit and whether the existing public production endpoints are healthy.

## Constraints

- Do not mutate production data.
- Do not submit, cancel, or close LIVE orders.
- Do not run exchange-side mutation.
- Do not run protected authenticated production journeys without a separate
  approved release-gate scope.

## Definition of Done

- Build-info readback for `36ff999d` is recorded.
- Public smoke result is recorded.
- State files distinguish service health from target-SHA production readiness.

## Result Report

Status: verified.

Build-info result: `FAIL_STALE_SHA`. Production build-info stayed on
`1586f59261cef94d7c513d71bbfcfb697d11ca59` (`gitRef: main`) for the 60-second
wait window.

Public smoke result: PASS for API `/health`, API `/ready`, and Web `/`.

Conclusion: production is publicly healthy for the currently deployed `main`
SHA, but `36ff999d` is not deployed according to build-info. No production
readiness claim is made for `36ff999d`.
