# 011A: projekt trwałego źródła surowych transakcji USD-M

**Status: projekt do decyzji, bez implementacji i bez runtime PASS.**
Punkt bazowy `d227021dacad4a1f155cb4c0c4cd291c6c2a2252`.
Niezależnie odebrane lokalne dowody: [granice `aggTrades`](position-parity-011a-120-minute-source-reconciliation-2026-10-22.md)
na `4d8650f03a147f24f35098f13fd463bace5c9760` i [surowy ETH](position-parity-011a-raw-trades-boundary-feasibility-2026-10-22.md)
na `ba338c03ad425a7ed242c330456b042134d8b7b1`. Pełne 011A
pozostaje `REVIEW`, wydanie `NO-GO`. Nie ma dowodu trwałego raw
BACKTEST, produkcyjnego workera ani LIVE.

## Twarde dane do budżetu

Oficjalne dzienne USD-M `trades` ZIP z 2026-10-18 pobrano z
`https://data.binance.vision/data/futures/um/daily/trades/<symbol>/<symbol>-trades-2026-10-18.zip`.
Każdy SHA-256 ZIP zgadzał się z osobnym `.CHECKSUM`. UTC 02:00–04:00
jest przedziałem domkniętym z lewej, otwartym z prawej. Strumieniowy
odczyt pojedynczych transakcji dał dokładne OHLCV **i trade count 120/120**
oficjalnych klines dla obu symboli; nie jest to test trwałego joba.

| Dzień i symbol | ZIP B | CSV B (rozpakowany, nie do przechowania) | Raw w 120 min | SHA-256 ZIP |
| --- | ---: | ---: | ---: | --- |
| 2026-10-18 BTCUSDT | 16 652 622 | 122 525 930 | 191 243 | `f586fcfb3981743bae76b19151ce3bceb2791a3c5fdf7ed678dad3e186ddd234` |
| 2026-10-18 ETHUSDT | 29 176 827 | 178 044 910 | 199 234 | `8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7` |

Oba `.CHECKSUM` mają po 96 B. Dwa **unikalne** źródła to co najmniej
`16 652 622 + 29 176 827 + 192 = 45 829 641 B` (43,71 MiB)
logicznych bajtów ZIP+checksum, niezależnie od liczby runów z dokładnie
tymi samymi ZIP/SHA; referencje, indeksy, TOAST, WAL, kopie i wolne
miejsce powiększą koszt. Dla `N` runów obejmujących te same dwa ZIP/SHA
bajty pozostają `45 829 641 B`, a liczba referencji wynosi `2N`.
Dla nowych dni koszt rośnie o rzeczywisty rozmiar każdego nowego ZIP,
nie o stałą ekstrapolowaną z tej próbki. Okno przez północ wymaga
dwóch sąsiednich dziennych ZIP na symbol; rozmiar niezbadanego dnia
jest nieznany i musi przejść preflight.

Obecny v3 dopuszcza 16 777 216 B ZIP, 67 108 864 B CSV i 80 000
wybranych agregatów wraz z brzegowymi. BTC jest tylko 124 594 B poniżej
limitu ZIP, ale jego CSV i 120-minutowa taśma przekraczają pozostałe
limity o 55 417 066 B i co najmniej 111 243 wiersze. ETH przekracza
wszystkie trzy o 12 399 611 B, 110 936 046 B i co najmniej 119 234
wiersze. Są to **dolne granice wymaganego budżetu dla tej próbki**, nie
proponowane nowe limity. Przed implementacją właściciel/operator musi
zatwierdzić budżet na unikalne dni, kopie/WAL, RAM/czas strumieniowego
odczytu i próg odmowy. Bez budżetu nowe okno odmawia przed snapshotem/PnL.

## Warianty

| Wariant | Trwała zawartość i dowód offline | Koszt i ograniczenie |
| --- | --- | --- |
| **A — rekomendowany:** cały oficjalny dzienny ZIP i `.CHECKSUM` w deduplikowanym, niezmiennym store | Po restarcie odczyt dokładnych bajtów, ponowny SHA-256 ZIP, parsowanie `.CHECKSUM`, kontrola nazwy/symbolu/dnia/CSV oraz 120/120 klines i digestu taśmy. Bez sieci. | Co najmniej suma unikalnych ZIP+checksum z tabeli; dekompresja strumieniowa, cache i backup wymagają osobnego limitu. |
| **B:** tylko wycinek raw i hash pełnego ZIP | Wycinek pozwala ponownie policzyć własny digest i OHLCV, lecz **nie dowodzi niezależnie**, że pochodzi z pełnego ZIP ani że nie pominięto pasujących wierszy poza wycinkiem. Dla badanych plików dostępne są ZIP i `.CHECKSUM`, bez podpisanego przez dostawcę dowodu Merkle/range dla wierszy; lokalny hash/atest nie zastępuje oryginalnych bajtów. | Mniejszy hot payload, ale samodzielnie nie spełnia wymaganego offline proof. Jeśli pełny ZIP pozostaje w cold store, to A jest nadal źródłem prawdy, a B tylko cache. |

`.CHECKSUM` w obu wariantach jest oficjalnie publikowanym skrótem,
**nie podpisem cyfrowym**. Zapis URL, czasu pobrania, nazwy i
checksumy pozwala audytować pochodzenie z publicznego endpointu; sam
offline hash nie poświadcza tożsamości zdalnego wydawcy. Żaden wariant
nie uprawnia do rozluźnienia walidacji OHLCV/trade count.

## Proponowany kontrakt A do zatwierdzenia

1. Dodać wersjonowany typ źródła `BINANCE_USDM_TRADES_DAILY` i osobny
   content-addressed store PostgreSQL: jeden niezmienny blob na
   `(sourceType, symbol, UTC day, zipSha256)` z dokładnymi bajtami ZIP,
   `.CHECKSUM`, rozmiarami i URL. Osobna relacja `(runId, symbol, day)`
   wskazuje blob; FK chroni go przed usunięciem, gdy jest referencja.
   To propozycja modelu, nie migracja. SQL/rola aplikacji mają odmawiać
   nadpisania bajtów/metadanych; deduplikacja wymaga porównania całej
   tożsamości, nie tylko nazwy dnia. Inny SHA zdalnego ZIP oznacza nowy
   blob dla nowych runów; istniejących referencji nie wolno przepinać.
2. Nowy snapshot **v4/raw-trades** zawiera okno, klines z tożsamością
   ich źródła i digestem, uporządkowane klucze blobów, SHA-256
   kanonicznej taśmy i digest per świeca, a nie
   199 tys. skopiowanych wierszy. Pełny ZIP pozostaje referowany tak
   długo, jak istnieje run. v1/v2/v3 oraz ich dotychczasowy odczyt i
   historyczne raporty pozostają bez zmiany; v3 `aggTrades` nigdy nie
   jest reinterpretowany jako raw.
3. Pierwszy worker pobiera tylko do zatwierdzonego budżetu, weryfikuje
   `.CHECKSUM`, strukturę ZIP, właściwą dobę, rosnące ID/czas i
   120/120 OHLCV oraz **trade count** względem zweryfikowanych klines.
   Raw ID mogą mieć luki (BTC 850, ETH 1213 w tej próbce); sama luka
   nie dowodzi brakującego market trade. Parser musi strumieniować CSV,
   ograniczać pamięć i nie używać obecnego `unzipSync` na pełnym CSV.
   Transakcje z tym samym czasem zachowują kolejność raw ID z CSV.
   Każdy symbol musi przejść przed publikacją portfelowego PnL.
4. Blob można zapisać przed związaniem runu; związanie referencji,
   snapshotu/digestu i tokenu właściciela workera następuje atomowo
   pod istniejącym fence. Niezwiązany blob po awarii jest tylko
   kandydatem do późniejszego GC, bez trade/raportu. Po trwałym
   związaniu **retry i timeline nie pobierają sieciowo**: odczytują blob,
   ponownie liczą SHA i `.CHECKSUM`, odtwarzają 120 świec/ticków i
   porównują digests. Brak/zmiana daje `FAILED` albo 409 bez nowego
   PnL; nie wolno zastępować zapisu aktualnym zdalnym ZIP.
5. Wynik runu, trades, wkłady i raport pozostają pod dotychczasowym
   token-fenced, atomowym zapisem. Po utracie workera startup recovery
   podejmuje **ten sam run** po lease, nie robi nowego submitu, a
   powtórne obliczenie taśmy nie dodaje rekordów. Heartbeat nie jest
   dowodem ukończenia: odbiór sprawdza stan `COMPLETED`, pojedynczy
   raport i trwałe rachunki.

**Retencja i cleanup:** brak TTL krótszego niż życie runu. Usunięcie
uprawnionego runu usuwa tylko jego referencje; blob wolno usunąć dopiero
po udokumentowanym okresie karencji, gdy brak referencji i aktywnych
pisarzy. GC działa transakcyjnie z blokadą, recheckiem liczby referencji
i audytem usuniętego SHA; nie usuwa plików innych runów. Nie wykonano
teraz żadnego cleanupu. Czas karencji i ogólny okres retencji wymagają
decyzji właściciela wraz z budżetem. Kopia/restore musi obejmować
bloby, referencje i snapshoty oraz weryfikować SHA po odtworzeniu.

**Migracja i rollback:** tylko addytywna tabela/ref/snapshot v4,
z writerem raw wyłączonym do odbioru. Nie migrować automatycznie
starych v3 ani nie usuwać `BacktestIntrabarArchiveRaw`; przed STAGE/PROD
operator osobno rozstrzyga znaną różnicę checksum migracji 86/87,
budżet WAL/kopii i zgodność dokładnych SHA workerów. Stare workery nie
czytają v4: cutover wymaga stop-before-start i readback ownership.
Po pojawieniu się v4 rollback binarki do starego workera jest
`STOP/NO-GO`; zachować bloby i runy, użyć kompatybilnego builda
naprawczego. Restore do checkpointu może utracić późniejsze runy i
wymaga osobnej decyzji operatora; żadnego DROP ani automatycznego
przepisania wyników.

## Minimalny odbiór przed zmianą statusu

Na własnej PostgreSQL `_test` i Redisie, bez produkcji/LIVE:

- Dwa oficjalne symbole z tego samego dnia z tabeli, `ZIP+.CHECKSUM`
  i kline ZIP/REST:
  120/120 OHLCV **i trade count**, porządek raw, poprawny podział
  agregatu ETH o 02:15, kontrola granic i powtarzalny digest.
- Dwa runy odwołujące się do tego samego dnia/symbolu tworzą jeden
  niezmienny blob i dwie referencje. `SIGKILL` po trwałym związaniu
  źródła, drugi PID po lease, sieć zablokowana: ten sam run kończy się
  raz, z jednym raportem/trades/PnL i bez duplikatu przy retry/timeline.
- Uszkodzony ZIP, checksum, brak bloba, niepełny kline lub zmieniony
  digest odmawiają przed symulacją albo przy odczycie, bez częściowego
  wyniku i bez refetch. Osobno odczyt v1/v2/v3 pozostaje zgodny.
- Pomiar peak RAM/czasu, TOAST/WAL, `pg_dump`/restore, liczby unikalnych
  blobów i GC po **zatwierdzonym** usunięciu własnych runów. Wariant
  przez północ i drugi dzień mierzyć z rzeczywistymi rozmiarami,
  nie z ekstrapolacji. Wszystko ponad zatwierdzony budżet kończy się
  jawnie `LIMIT`/`FAILED`, nigdy częściowym PnL.

Ten plan nie jest dowodem wykonania żadnego z tych testów. Decyzje
otwarte: budżet per źródło i globalnie, retencja/karencja GC,
PostgreSQL vs zatwierdzony immutable object store oraz procedura
backup/rollback. Do ich zatwierdzenia nie uruchamiać writera v4.
