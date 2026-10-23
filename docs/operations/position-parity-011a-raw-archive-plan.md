# 011A: trwałe bajty archiwum — plan przed kodem

Punkt bazowy: `d74b0563039b5aebe0fce587614101ebf5751447`.
Zgodnie z kontraktem produktu, DoD i wierszem 011A jest to ograniczony
BACKTEST Binance USD-M `aggTrades`, 1m, 1–120 świec w jednej lub dwóch
sąsiednich dobach UTC. Wynik pełnego 011A/011 i wydania pozostaje NO-GO.

Nowe snapshoty będą miały `version: 3`, wspólną listę 1–2 archiwów i
dotychczasowe świece oraz wybrane rekordy. Osobna tabela podrzędna
`BacktestIntrabarArchiveRaw` utrwali dla każdego dnia dokładne bajty ZIP
(`BYTEA`) i otrzymanej `.CHECKSUM` (`BYTEA`), powiązane kluczem
`runId, symbol, day` z dotychczasowym snapshotem. Jeden zapis transakcyjny
obejmie snapshot i wszystkie pliki, bez częściowego źródła. Limit 8 MiB ZIP
dotyczy sumy 1–2 plików, 256 B każdego checksum, 64 MiB scalonego CSV i
20 000 wybranych agregatów. Usunięcie runu kaskadowo usuwa bajty;
osobnego automatycznego TTL nie wprowadzamy, aby nie zepsuć replay.

Przy pierwszym pobraniu i przy każdym offline retry/timeline wykonamy tę
samą walidację: nazwa/URL dnia, składnia checksum, SHA-256 **utrwalonego**
ZIP względem `.CHECKSUM` i metadanych snapshotu, struktura/rozmiar ZIP,
połączenie rekordów `a`, `T`, `f..l`, brzegów i OHLCV. Zmiana/brak bajtów,
checksum, jednego dnia lub snapshotu kończy fail-closed przed symulacją,
trades i PnL. Próba retry przy brakującym źródle nie użyje sieci.

Migracja dodaje tabelę bez zmiany starych rekordów. Snapshoty v1/v2
zostają odczytywalne jako **legacy: hash JSON i replay taśmy**, bez
deklaracji ponownej weryfikacji surowego ZIP. Wartość pochodzenia świecy
rozróżni legacy od nowej weryfikacji raw; digest istniejących świec się nie
zmienia. Nowe runy zapiszą tylko v3. Nie backfillujemy starych bajtów.

Odbiór: fixture dla 1 i 2 dni, limitów, tamper ZIP/checksum, braku jednej
części i zgodności v1/v2. Publiczne, zamrożone ALICEUSDT 2026-10-17
23:50–2026-10-18 00:10 UTC oraz jednodniowe okno 2026-10-18
02:27–04:07 UTC. Własna `_test`/Redis: pierwszy PID pobierze i utrwali
surowe pliki, `SIGKILL` przed symulacją; drugi PID wznowi ten sam run
bez fetch/submit, przeliczy SHA z DB i skończy jednym raportem. Osobne
warianty zmiany/usunięcia surowych bajtów i checksum dadzą `FAILED`,
`reportReady=false`, zero trades i PnL. Odczyt timeline po modyfikacji
nie wyda nowego PnL. Testy nie dotkną produkcji ani LIVE.

Surowe ZIP + checksum zajmą do około 8 MiB na run/symbol, obok JSON
snapshotu; baza rośnie razem z liczbą runów. Limity są w kodzie i
ograniczeniach rozmiaru w bazie. Nie rozszerzamy archiwów miesięcznych,
trzeciej doby ani pobierania plików większych niż aktualny limit.
