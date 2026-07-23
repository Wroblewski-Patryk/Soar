# Task

- ID: LUC-1688
- Exact target: `apps/web/src/app/dashboard/markets/create/page.tsx`
  (`route:page-tsx:220e4e1fa3`).
- Result: VERIFIED.
- Focused create/list tests: `2/2` PASS.
- Fresh direct authenticated route: `/dashboard/markets/create` PASS.
- Fixture CTA click: FAIL because the intercepted list fixture did not render
  the button; the focused list test proves the production component wiring to
  the canonical create route. No form was submitted.
