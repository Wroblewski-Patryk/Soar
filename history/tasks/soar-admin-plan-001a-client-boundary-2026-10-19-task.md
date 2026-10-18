# Task

## Header
- ID: SOAR-ADMIN-PLAN-001A/CLIENT-BOUNDARY
- Title: Separate human browser authority from legacy API JWTs
- Task Type: fix
- Current Stage: independent acceptance
- Status: IN_PROGRESS
- Owner: Backend
- Priority: P1

## Trigger
Independent local acceptance of source SHA
`f5888ab20c3e95ff97ec37767ecbb7467ef4a232` failed:
- A legacy admin JWT with `Authorization: Bearer` received 403 on
  `PATCH /admin/users/:id`; adding the same JWT in `Cookie: token=...`
  changed a user from `USER` to `ADMIN`.
- A legacy user Bearer JWT could create an exchange API key with
  `POST /dashboard/profile/apiKeys`.

## Implemented boundary
- Login and registration now issue an HttpOnly human browser session JWT with
  audience `cryptosparrow-human-session` and signed `sessionKind=human`.
  Legacy `cryptosparrow-app` tokens remain a separate, non-human credential.
- Authentication tracks token kind and source independently. If Bearer and
  Cookie carry the same token, the request keeps Bearer provenance. Sensitive
  writes require a human-session token in Cookie and no Authorization header.
- Old cookies fail with 401 and prompt a fresh login. `/auth/me` never copies a
  Bearer token into Cookie. Only a human cookie logout increments
  `sessionVersion`; legacy logout clears its cookie without revoking a human
  session. Human sessions survive a fresh request client and are invalidated
  by logout, password change, or role demotion.
- All non-read `/admin` routes, including LIVE pause, use the human-session
  guard. Profile basic writes/deletion, password/account deletion, all API-key
  lifecycle and connection-test routes, and avatar upload use the same guard.
- API-key responses continue to return only masked key metadata, never a raw
  exchange key or secret. Public user responses exclude password hashes.

## Evidence and rollout limits
- Focused API suite: 14 files / 84 tests passed, including exact Bearer +
  Cookie replay for role, plan, and API-key writes; regular-user and real
  cookie controls; fresh-client session use, logout/revocation, and current
  trusted-origin CSRF behavior.
- Full API suite on the implementation: 231 passed files, 3 skipped files,
  1622 passed tests, 10 skipped tests. The subsequently added HTTP listener
  restart case passed in the focused auth suite (13/13); it does not claim a
  production process restart.
- Root API/Web typecheck, docs parity, and repository guardrails passed.
- The legacy audience remains accepted for compatible Bearer domain routes;
  this is not a delegated-client grant. A separate scoped, revocable principal
  is required for external domain/LIVE acceptance.
- A stolen human-session cookie or a stolen password remains a compromised
  human credential; the JWT kind does not prove a person is at the keyboard.
- No production write, deployment, payment action, LIVE order, or private
  audit is claimed by this task.

## Independent acceptance
1. Repeat both reported requests against this source SHA and verify 403/401
   with unchanged user and API-key state.
2. Verify a genuine newly issued cookie session can perform the intended
   manual actions, while a regular user cannot perform administrator writes.
3. Verify legacy cookie re-login, browser logout/revocation, untrusted Origin
   rejection, and masked/no-secret responses.
4. Verify the deployed SHA and browser journeys separately before production
   acceptance. Preserve historical payment and subscription records.
