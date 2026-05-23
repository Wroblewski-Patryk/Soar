# Coolify Deploy Queue Recovery - 33a2ebc4

Date: 2026-05-10

## Scope

Record the production Coolify queue recovery after old Soar deployments were
still queued while production Web build-info had already advanced to the latest
pushed commit.

## Commit

- Full SHA: `33a2ebc468be3dbfab7c784f375672ebead5ae16`
- Commit: `docs(ops): record v1 deploy control readiness`

## Coolify Actions

- Logged into Coolify through the operator-approved UI path.
- Switched to the `Root Team`.
- Confirmed Soar production had a queue of eight deployments.
- Waited until production Web build-info exposed
  `33a2ebc468be3dbfab7c784f375672ebead5ae16`.
- Public smoke passed while three stale `soar-api` deployments remained in
  Coolify.
- Confirmed the stale in-progress `soar-api` deployment was building
  `e70f5cf6229d6fc4d26ea0342b81baab80851800`, not the current target SHA.
- Cancelled the stale queued/in-progress `soar-api` deployments from the
  Coolify UI.
- Triggered one fresh `soar-api` redeploy.
- Confirmed the fresh `soar-api` deployment imported and finished with
  `33a2ebc468be3dbfab7c784f375672ebead5ae16`.
- Confirmed the Coolify deployment queue was empty afterward.

## Verification

```text
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 33a2ebc468be3dbfab7c784f375672ebead5ae16 --timeout-seconds 120 --interval-seconds 15
```

Result: PASS.

```text
node scripts\deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

- PASS API `/health` -> HTTP 200
- PASS API `/ready` -> HTTP 200
- PASS Web `/` -> HTTP 200

```text
node scripts\runV1FinalPreflight.mjs --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 33a2ebc468be3dbfab7c784f375672ebead5ae16 --today 2026-05-10 --json-output history\artifacts\_artifacts-v1-final-preflight-33a2ebc4-2026-05-10.json --markdown-output history\releases\v1-final-preflight-33a2ebc4-2026-05-10.md
```

Result: expected `BLOCKED` after public deploy checks passed, because protected
and formal V1 release evidence is still missing or stale.

## Current V1 Meaning

The previous deploy-lag note for `e70f5cf6` is superseded by this Coolify
operator recovery. Production is now build-info-proven at `33a2ebc4`, public
API/Web smoke passes, and the Coolify queue is empty.

V1 remains `BLOCKED / NO-GO` only on protected or formal release evidence:

- `LIVEIMPORT_READBACK_*` application auth and `LIVEIMPORT-03` readback
- `ROLLBACK_GUARD_*` auth and fresh rollback proof
- production DB restore context and fresh restore drill evidence
- real RC approver identities and approved RC gate artifacts
- authenticated/admin production UI clickthrough

No secrets are recorded in this artifact.
