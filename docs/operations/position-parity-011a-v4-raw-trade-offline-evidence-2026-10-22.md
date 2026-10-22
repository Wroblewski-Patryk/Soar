# 011A: lokalny odbiór opt-in snapshotu v4/raw-trades

**Status:** ograniczony lokalny PASS kodu i odczytu offline. Pełne 011A
pozostaje `REVIEW`, wydanie, produkcyjny BACKTEST writer i LIVE `NO-GO`.
Kodowy commit testowany na czystym śledzonym drzewie:
`08f9a5e7dccff6bec807ae00394662a3f7615556`, tree
`8e3fdde85281b770c2f3cffac1f84811f1491214`.
`git diff --quiet HEAD --` zwrócił `0` przed i po testach; jedynym
nieśledzonym stanem był cudzy
`docs/operations/api-endpoint-docs-parity-2026-10-20/`, nietknięty.

## Kontrakt wycinka

Opt-in writer zapisuje w istniejącej tabeli `BacktestIntrabarArchive` payload
`version=4`, a w jednej token-fenced transakcji wiąże go z niezmienną
referencją run→blob. Zawiera okno 1m, symbol, jawnie zadeklarowany endpoint
klines i SHA-256 znormalizowanych świec, klucz źródła `(day, zipSha256)`,
SHA `.CHECKSUM`, SHA całej uporządkowanej raw taśmy, 120 digestów per świeca
oraz digest replay. Nie kopiuje 199 234 wierszy raw do JSON snapshotu.
Blob ZIP+.CHECKSUM pozostaje w deduplikowanym store. Odczyt v4 ponownie
sprawdza ZIP, checksum, pełną dobę, porządek raw, OHLCV, trade count,
digesty i klucze przed oddaniem ticków. Testowy adapter timeline wymaga
jawnego `rawTradeV4Budget`; bez niego dotychczasowa ścieżka v1/v2/v3
i niedawny REST pozostają bez zmiany. Domyślny job nie ma call site v4.

SHA-256 ZIP ETHUSDT `2026-10-18`:
`8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7`.
Lokalny JSON klines miał SHA-256
`9334eb8e2f94a34e8a45c9dfdba6544a0ee7d8f5129b85d2055cd6d19f2acc3f`;
snapshot wiąże jego znormalizowane świece SHA-256
`2530ccdeb0ea740938769425d49d14883d6641894ccdba22e1eb0b9c76ca9e8b`.
Niezależny strumieniowy odczyt CSV dał dla 199 234 raw w 02:00–04:00 UTC
digest `e29f15b7b5a7e9c98dc826f466d7dbafd30bb16aa7c74ff3933f2cf2ef6c3228`;
świeca 02:15 miała 2166 raw o ID `8867044765`–`8867046942` i digest
`2cdcc965941f48eb7b63082ae82ffd98cbcd01123d21cea95e2c29eb722d0c84`.
Oba digesty były stałymi testu, nie obliczeniami powtórzonymi jego parserem.
Digest replay snapshotu:
`1dc02821428ce7530ea4c45288f5c1bb9d7b58d427176fccf756a6823753f87c`.

## Powtarzalna próba na własnej bazie

Własna PostgreSQL `_test` pod `127.0.0.1:62436`, Redis pod
`127.0.0.1:62439`, `88/88` migracji; źródłowe pliki są poza repo.
Ustawiono `DATABASE_URL` na nieużywaną lokalną bazę runtime,
`TEST_DATABASE_URL` na `soar_011a_raw_foundation_test`, `REDIS_URL` na
własny Redis, `RUN_011A_RAW_V4_PROOF=1` oraz
`RUN_011A_RAW_ARCHIVE_DIR` i `RUN_011A_KLINES_DIR` na lokalne źródła.
Budżet opt-in był testowy: ZIP `29 176 827 B`, CSV `178 044 910 B`,
`199 234` raw w oknie, `120 000 ms`; nie jest zatwierdzonym limitem workera.

```powershell
pnpm --filter api exec vitest run src/modules/backtests/backtestRawTradeSnapshotV4.runtime.test.ts --reporter=verbose
```

Na exact code SHA: `1/1 PASS`, czas testu `45,05 s`, pliku `45,97 s`.
Log `%TEMP%/soar-011a-v4-exact-08f9a5e7.log` miał SHA-256
`31367e3609d675fb02db3857ea46b92908c7e3dae2e99f750265e7fda5a2c6a1`.
Manifest istotnych blobów Git tego commita:

| Plik | Git blob |
| --- | --- |
| snapshot v4 | `05e0d7c313286520175047f86d5a891bf85a62b6` |
| repozytorium raw | `fb1b920de30a6d99397f6d2492856131330f4f1f` |
| parser raw | `d77089e49db2fabb22ebc97da8d78ac0d794de03` |
| adapter timeline | `4f1ac6795fd6c679259ef996d13c2804df8186b3` |
| test opt-in | `35d86fffc75f8af649d67555e0440a660ea9e600` |

Test porównał `120/120` oficjalnych OHLCV i trade count, dwie referencje
runów do jednego bloba i dwa identyczne odczyty replay/timeline bez `fetch`.
Retry z tym samym tokenem nie dodał snapshotu. V4 odrzuciło zły digest,
zmieniony ZIP, limit mniejszy o jeden bajt, brak snapshotu, manipulację
payloadu i usuniętą referencję. Stary dekoder odmówił v4, bez
reinterpretacji jako v3 `aggTrades`. Testy v1/v2/v3 i parsera:
`29 PASS`, `5 SKIP` (opcjonalne). API typecheck, docs parity i guardrails
z `0` brakujących ścieżek grafu przeszły.

Po czterech próbach v4 na tej samej izolowanej bazie globalnie:
`1` blob, `12` referencji raw, `8` snapshotów v4, `0` trades,
`0` raportów, `88` migracji, Redis `DBSIZE=0`. W każdej próbie sprawdzono
dwie referencje przed celową manipulacją własnym snapshotem/ref dla testu
fail-closed; liczniki globalne obejmują też wcześniejsze próby fundamentu.

## Granica dowodu

Nie ma produkcyjnego call site raw, zatwierdzonego budżetu, retencji/GC,
backup/rollback ani procesu SIGKILL → automatyczne wznowienie tego samego
runu → `COMPLETED` z pojedynczym raportem. Nie zweryfikowano PAPER/LIVE,
rzeczywistych filli, PnL ani okna przez północ. Endpoint klines w snapshocie
jest zadeklarowaną tożsamością lokalnego pliku/źródła, nie podpisem Binance.
Nie wykonano deployu, produkcyjnych zapisów, LIVE ani resetów.
