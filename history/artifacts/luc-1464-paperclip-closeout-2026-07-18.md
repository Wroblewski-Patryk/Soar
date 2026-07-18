`LUC-1464` resolved the access question for `LUC-1438` without running protected proof or reading secrets.

- Confirmed existing approved read-only dashboard auth family:
  `PROD_UI_AUDIT_AUTH_EMAIL` + `PROD_UI_AUDIT_AUTH_PASSWORD`, mapped process-locally to `PROD_AUTH_EMAIL` + `PROD_AUTH_PASSWORD`.
- Confirmed safety boundary:
  read-only authenticated app/dashboard route proof only; no cookie/token export, no secret/body storage, and no production mutation.
- Confirmed remaining execution gate:
  local-board/operator owner-login path `LUC-4103` is still the real approval/interaction boundary before `LUC-1438` can run `/dashboard/bots/<real-bot-id>/assistant`.
- Outcome for `LUC-1438`:
  do not reopen auth-family discovery; resume only after `LUC-4103` resolves and hands back one approved authenticated dashboard session path for the assistant page proof.
