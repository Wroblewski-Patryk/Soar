# 011A: lokalny odbiór fundamentu surowych transakcji USD-M

**Zakres:** addytywna migracja bloba i referencji runu, strumieniowy
preflight oficjalnego dziennego `trades` ZIP + `.CHECKSUM`, odczyt offline.
Kod bazowy: `7d26f0c866368e7086800f2113078ca46074a901`.
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
- SQL dla dwóch runów ostatniej próby: `1` wspólny blob, `2` referencje,
  `0` raportów; `88` migracji. Po trzech uruchomieniach testu w tej samej
  bazie globalnie pozostało `1` blob i `6` referencji; Redis `DBSIZE=0`.
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
