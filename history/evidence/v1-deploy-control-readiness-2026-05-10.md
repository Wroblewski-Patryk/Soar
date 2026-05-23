# V1 Deploy Control Readiness (2026-05-10)

## Status

- Current pushed HEAD: `41e398a49062daca0480faedeee5d3430d26d086`
- Last observed production build-info:
  `40e9b3c35c96d4acced73bbab980039f9e6b6a22`
- Public smoke: PASS
- Result: **DEPLOY CONTROL BLOCKED**

## Evidence

- `docs/operations/coolify-trigger-wiring.md` defines production deployment as
  Coolify/manual operator controlled.
- `.github/workflows/ci.yml` contains CI checks only and is triggered manually
  with `workflow_dispatch`; it does not deploy production.
- Coolify webhook URLs are intentionally operator-held secrets and are not
  stored in the repository.
- Privileged VPS/Docker access was rejected by escalation review without fresh
  explicit production infrastructure authorization.

## Accepted Next Actions

One of these must happen before the latest pushed status/evidence commits can
be proven in production:

1. Operator retriggers or inspects the production Coolify deployment manually.
2. Operator provides approved Coolify deploy webhook/API credentials out of
   repository artifacts.
3. Operator explicitly authorizes production infrastructure access for this
   session, with the scope limited to deploy inspection/retrigger.

## Not Accepted

- Adding a new production deploy workflow without explicit approval.
- Storing Coolify webhook URLs or API tokens in the repository.
- Treating pushed Git commits as deployed without build-info proof.
- Bypassing rejected production infrastructure escalation through another
  access path.

## Impact On V1

V1 remains `BLOCKED / NO-GO` for two separate reasons:

1. Latest pushed source-of-truth commits are not production-current.
2. Final V1 evidence still requires protected inputs listed in
   `history/releases/v1-operator-unblock-checklist-2026-05-10.md`.
