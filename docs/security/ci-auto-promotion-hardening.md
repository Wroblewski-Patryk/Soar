# CI Auto-Promotion Security Hardening

Date: 2026-04-03  
Task: `DPL-19 security(ci)`

## Goal
Reduce risk of unsafe deployment promotion by hardening branch protections, workflow ownership, and secret handling.

## Implemented Repository Controls
1. `CODEOWNERS` added at `.github/CODEOWNERS`:
   - default ownership enforced,
   - CI/CD workflow and deployment docs paths require owner review.
2. CI workflow permissions reduced:
   - `.github/workflows/ci.yml` uses `permissions: contents: read`.
3. Production deployment workflows rely on explicit secrets and protected environments:
   - `promote-prod.yml`,
   - `prod-rollback.yml`.

## Required GitHub Branch Protection (Settings)
Apply in GitHub repository settings:

### `main`
- Require pull request before merge.
- Require approvals (recommended: at least 1).
- Require status checks to pass before merge:
  - `Web checks`,
  - `API checks`.
- Restrict direct pushes.
- Disallow force pushes.
- Disallow branch deletion.

### Integration branches
- Restrict direct pushes to trusted maintainers or PR-only flow.
- Require normal CI status checks before merging into the production branch.
- Disallow force pushes.

## Required Environment Protection

### `production` environment
- Require manual reviewers for sensitive workflows where needed.
- Allow only trusted maintainers to run manual dispatch.
- Enforce separate production-only secrets.

## Secret Hardening Rules
1. Store only in GitHub Secrets/Environment Secrets.
2. Never commit secret values into repository files or workflow YAML.
3. Keep production-only values active while stage is parked.
4. Rotate webhook URLs/credentials after incidents or quarterly.
5. Audit workflows for secret usage before enabling new automation links.

## Verification Checklist
- [ ] `CODEOWNERS` present and active.
- [ ] Branch protection enabled for the production branch.
- [ ] `production` environment configured with protections.
- [ ] Required secrets exist:
  - `COOLIFY_PROD_DEPLOY_HOOK_URL`
  - `COOLIFY_PROD_ROLLBACK_HOOK_URL`
- [ ] Stage-only secrets removed or left unused while stage remains parked.
- [ ] Production deployment run completed with green post-deploy gates.
