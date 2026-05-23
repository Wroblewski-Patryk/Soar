# Mobile And Cross-Platform Scope Audit - 2026-05-19

Audit ID: `AUD-21`
Status: deferred / scaffold-only scope verified
Environment: local

## Scope

This audit verifies whether `apps/mobile` is an active product surface or a
bootstrap placeholder, and whether docs and build scripts overclaim mobile
runtime readiness.

## Evidence Run

| Check | Result | Evidence |
| --- | --- | --- |
| Mobile file inventory | PASS | `apps/mobile` contains `package.json`, `README.md`, and `src/.gitkeep` only |
| Mobile README scope | PASS | README states bootstrap placeholder, no production mobile app code, no CI/runtime obligations |
| Mobile parity contract | PASS | `docs/planning/mobile-parity-contract.md` states bootstrap phase and no production mobile runtime |
| Mobile build script | PASS_SCaffold | `corepack pnpm --filter @cryptosparrow/mobile run build` prints `Mobile scaffold only. Build not enabled yet.` |
| Mobile test script | PASS_SCaffold | `corepack pnpm --filter @cryptosparrow/mobile run test` prints `Mobile scaffold only. Tests not enabled yet.` |
| Root build interaction | PASS_SCaffold | `corepack pnpm run build` includes the same mobile scaffold echo and does not require native build output |

## Findings

| ID | Severity | Status | Finding | Evidence / Next Action |
| --- | --- | --- | --- | --- |
| AUD-MOB-001 | P1 | scope verified | Native mobile is not an active production app in the current repo. | `apps/mobile/src` contains only `.gitkeep`; no Expo Router, native screens, app config, or tests exist. |
| AUD-MOB-002 | P1 | aligned | Mobile docs correctly describe bootstrap-only scope. | `apps/mobile/README.md` and `docs/planning/mobile-parity-contract.md` both state no production mobile runtime. |
| AUD-MOB-003 | P2 | open future gate | Mobile build/test commands are scaffold echoes, not real validation. | This is acceptable only while mobile remains deferred; before mobile implementation, replace echoes with real Expo/native validation. |
| AUD-MOB-004 | P2 | separated | Responsive Web mobile evidence exists under `AUD-05`, not native mobile. | Production/mobile screenshots and route-state mobile screenshots prove responsive Web behavior, not native app parity. |

## Result

`AUD-21` is current for scope: mobile remains deferred and scaffold-only.
There is no active native/mobile runtime to audit beyond scope alignment. Future
mobile work must start by replacing scaffold scripts with real build/test
contracts and creating module docs before implementation.
