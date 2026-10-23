# 011A: lokalny odbiór fundamentu surowych transakcji USD-M

**Zakres:** addytywna migracja bloba i referencji runu, strumieniowy
preflight oficjalnego dziennego `trades` ZIP + `.CHECKSUM`, odczyt offline.
Kod bazowy: `7d26f0c866368e7086800f2113078ca46074a901`.
Kod testowany po pierwszym commicie fundamentu:
`9858a64e45ae3f119c8a74f40ad040e05d9ffb95`.
Ten wynik dotyczy lokalnego fundamentu. Pełne 011A pozostaje `REVIEW`,
wydanie i LIVE pozostają `NO-GO`.

## Źródło i próba

Oficjalny plik ETHUSDT z 2026-10-18: ZIP `29 176 827 B`, rozpakowany CSV
`178 044 910 B`, SHA-256
`8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7`
zgodny z osobnym `.CHECKSUM`. Testowy limit był jawny i równy zmierzonemu
rozmiarowi ZIP/CSV oraz `199 234` wybranym raw trades w oknie 02:00–04:00 UTC;
czas preflight ograniczono do `120 000 ms`. To **budżet testu**, nie limit
zatwierdzony dla workera.

Na świeżej PostgreSQL `soar_011a_raw_foundation_test` pod `127.0.0.1:62436`
zastosowano `88/88` migracji. Osobny Redis `127.0.0.1:62439` miał `DBSIZE=0`.
Oba kontenery noszą etykietę `soar.owner=011a-foundation-c6867`; żaden inny
kontener ani baza nie były użyte. Test opt-in
`backtestRawTradeSourceFoundation.runtime.test.ts` przeszedł `1/1` w 40,28 s:

- surowe rekordy odtworzyły `120/120` oficjalnych 1m OHLCV i trade count,
  dokładnie `199 234` rekordy w oknie; granica 02:15 rozdzieliła raw ID
  `8867044764` i `8867044765` między sąsiednie świece;
- dwa różne runy zapisały `1` blob i `2` referencje w obrębie próby;
  ponowienie z tym samym tokenem nie dodało referencji, a utracony token
  dostał `CLAIM_LOST`; oba odczyty offline odtworzyły ten sam SHA taśmy
  przy zablokowanym `fetch`;
- brak ZIP, zmiana bajtu i limit ZIP mniejszy o jeden bajt odmówiły,
  a SQL odmówił aktualizacji niezmiennego bloba;
- SQL dla dwóch runów próby: `1` wspólny blob, `2` referencje,
  `0` raportów; `88` migracji. Po czterech uruchomieniach testu w tej samej
  bazie globalnie pozostało `1` blob i `8` referencji; Redis `DBSIZE=0`.
  Runy pozostają `RUNNING` wyłącznie w tej bazie testowej.

Jedna oficjalna liczba `quote_qty` była zapisana wykładniczo; parser przyjmuje
ten format wyłącznie dla dodatnich skończonych liczb. Skoncentrowane testy
syntetyczne sprawdziły granicę minuty, brak budżetu/źródła, zmianę checksumy,
limity ZIP/CSV/wierszy/czasu, złą świecę/dobę/CSV/nazwę ZIP oraz cofnięcie
czasu i powtórzony raw ID. Testy v1/v2 i syntetyczne v3 dotychczasowego
archiwum: `15 PASS`, `5 SKIP` (opcjonalne publiczne/pojemnościowe).
API typecheck oraz `prisma validate`/`generate` przeszły.
`docs:parity:check` przeszedł; po dopisaniu nowych testów do rejestru
architektury `quality:guardrails` przeszedł z `0` brakujących ścieżek.

## Odtworzenie na dokładnym commicie

22 października 2026 o 14:54 CEST przed testem `git rev-parse HEAD`
zwrócił `9858a64e45ae3f119c8a74f40ad040e05d9ffb95`, a
`git show -s --format=%T HEAD` zwrócił drzewo
`f21d65502d67a7e0df46073fb3eeea47f3490fd6`. `git diff --quiet HEAD --`
zwrócił kod `0` przed i po teście. Jedynym obcym stanem był nieśledzony
`docs/operations/api-endpoint-docs-parity-2026-10-20/`, nietknięty.
Manifest Git tego commita dla kluczowych plików:

| Plik | Git blob |
| --- | --- |
| migracja 88 | `d0104183e1e5a3ea04eea985c1852c5c557d3745` |
| parser raw | `19b7b98396853270b637a4e13e68b7e22221698a` |
| repozytorium raw | `ce3dbfdb67a16667cd9407b0fb43c44260d89b7b` |
| test runtime | `d389d03d5a2ecfe1317211255a2b99268d6354e0` |

Źródłowy ZIP na dysku miał SHA-256
`8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7`,
plik `.CHECKSUM` SHA-256
`2fce054ba74bbcee96221221cc09892119a3b393d14123b3e942fa57ff75b19b`.
Własna baza testowa odczytała checksum migracji 88
`18a3058942f02e466f771de5f1d2c886ae6344ecf796a6ef2585470287836b56`
ze znacznikiem ukończenia; zgadzała się z SHA-256 lokalnego `migration.sql`.

Przy `DATABASE_URL` ustawionym na nieużywaną lokalną bazę runtime,
`TEST_DATABASE_URL` na bazę testową `127.0.0.1:62436/soar_011a_raw_foundation_test`,
`REDIS_URL=redis://127.0.0.1:62439`, `RUN_011A_RAW_FOUNDATION_PROOF=1`
oraz ścieżkach do opisanych lokalnych ZIP i klines wykonano:

```powershell
pnpm --filter api exec vitest run src/modules/backtests/backtestRawTradeSourceFoundation.runtime.test.ts --reporter=verbose
```

Wynik na powyższym commicie: `1 PASS`, czas testu `38,34 s`, cały plik
`38,99 s`; log poza repo
`%TEMP%/soar-011a-foundation-exact-9858a64e.log` miał SHA-256
`5b720c125248dff2da5c63e36600b44ea8db7d0a4c7acf314cb39226fce40688`.
Test sprawdzał dwie referencje utworzone w tym uruchomieniu; globalny licznik
`8` obejmuje także trzy wcześniejsze próby na tej samej izolowanej bazie.
Brak nowego submitu, restartu workera i stanu `COMPLETED`; nie jest to
dowód pełnego wznowienia 011A.

Artefakt drift z 24 maja zachowano jako historyczny.
[Bieżący wynik 22 października](../../history/artifacts/architecture-graph-drift-2026-10-22.json)
ma własną datę i jest podlinkowany z
[aktualnego statusu grafu](../status/architecture-graph-drift.md).

## Granica dowodu

Nowe tabele nie mają połączenia z domyślnym BACKTEST jobem. Nie istnieje
snapshot v4, produkcyjny budżet, retencja/GC ani test restartu tego nowego
źródła od `PENDING/RUNNING` do `COMPLETED` z pojedynczym raportem i PnL.
Powyższy test **nie** dowodzi automatycznego wznowienia ani równoważności
BACKTEST/PAPER/LIVE. Przed cutover nadal trzeba rozstrzygnąć wcześniejszą
różnicę checksum migracji 86/87, zatwierdzić limity, WAL/kopie i rollback
oraz wykonać procesowy test SIGKILL → ten sam run → jeden raport bez fetch
i bez duplikatu. Nie wykonano deployu, resetu, transakcji LIVE ani zapisu
produkcyjnego.
