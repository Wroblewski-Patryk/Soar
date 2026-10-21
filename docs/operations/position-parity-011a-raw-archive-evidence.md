# 011A — zapis i ponowna kontrola surowych ZIP

Plan przed kodem: `a64af09d2c3621925c014b80c39c46ef219b4db6`.
Kod, migracja i testy: `13ff23a1e4ac3956b703a78f4509729ccc572a80`.
Ograniczony odbiór lokalny dotyczy BACKTEST Binance USD-M `aggTrades`,
1m, jednej lub dwóch sąsiednich dób UTC. Pełne 011A/011 nadal `REVIEW`.

## Mechanizm i retencja

Nowe snapshoty v3 zapisują w JSON dzień, URL oraz SHA-256 ZIP i dokładnych
bajtów `.CHECKSUM`. Migracja 85 dodaje podrzędną tabelę
`BacktestIntrabarArchiveRaw` z `BYTEA` dla obu pobranych plików.
Snapshot i wszystkie 1–2 pary bajtów są zapisane w jednej transakcji.
Przy każdym odczycie offline, również po restarcie i dla timeline,
serwis sprawdza SHA-256 zapisanych bajtów checksum, treść checksum,
SHA-256 ZIP, strukturę i rozmiar ZIP, scaloną sekwencję `a`/`T`/`f..l`,
rekordy brzegowe, zgodność JSON rows i OHLCV świec. Dopiero potem
zwraca taśmę. Pochodzenie świecy oznacza
`PERSISTED_CHECKSUM_REVERIFIED`; wcześniejsze v1/v2 pozostają czytelne
z oznaczeniem `LEGACY_SNAPSHOT` i **nie** dostają silniejszej deklaracji.
Starych bajtów nie backfillowano.

Suma ZIP ma limit 8 MiB na run/symbol, każdy checksum 256 B, CSV 64 MiB,
wybrana taśma 20 000 agregatów. Baza trzyma te bajty obok JSON do czasu
usunięcia runu; kaskada usuwa wówczas oba zapisy. Nie ma osobnego TTL.
Tym samym każda nowa para run/symbol może dodać do około 8 MiB ZIP oraz
checksum i JSON do rozmiaru bazy. Surowe pliki są publicznymi danymi
rynku; kopie bazy podlegają zwykłej retencji kopii Soar.

## Dowód na dokładnym SHA kodu

- `prisma validate` i API `typecheck` `PASS`; publiczny walidator 13/13
  `PASS`. Obejmuje realne ZIP i `.CHECKSUM` ALICEUSDT dla jednodniowego
  okna oraz zamrożonego okna 2026-10-17 23:50–2026-10-18 00:10 UTC.
  Dwa ZIP mają SHA-256
  `0cb11b74fb1514e650613d23fb60224a4131af6fcbff0c14218604762dee9b01`
  i `4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
- Własna PostgreSQL `_test` po 85 migracjach i osobny Redis: 10/10
  `PASS` (jednodniowy proces 3/3, dwudniowy 6/6, legacy v1/v2 1/1).
  Pierwszy PID utrwalił bajty i digest, po `SIGKILL` drugi PID wznowił
  ten sam run automatycznie bez sieci i nowego submitu. Przy dwóch dniach
  zapisane ZIP zajęły 401 456 B, checksum miały SHA-256
  `65902f15a5dd62b79f5dc6e1d014421b33a86fc5a9b30b23db0b4dcc03e6b369`
  i `af5b960b618d8b0b08d2b1abae2d1692db4fff0f582570a058824bd4a29f27e7`.
  Trwały payload ma SHA-256
  `f6def3eaaf63bcb1884faa7724f2c223d3d93746b4d13eb39bea1f5618ae8c6d`,
  a digest taśmy
  `639b68595919f111f454f61bbfc5985983d14f80d3d4fd8dfaa17640f0ea358c`.
  Wynik: jeden run i raport, trzy trades, net PnL `+0,34133` USDT zgodny
  z trwałymi trades, 18 świec i 6 zdarzeń timeline; kolejka pusta po ACK.
- Zmiana ZIP lub nawet dopisanie białego znaku do zapisanego `.CHECKSUM`
  daje `FAILED` przed symulacją: `reportReady=false`, `netPnl=null`,
  zero trades i wkładów. Brak drugiego surowego pliku lub całego
  snapshotu też kończy fail-closed bez fetch. Po `COMPLETED` ta sama
  modyfikacja ZIP/checksum daje timeline HTTP 409 `SOURCE_CHANGED`,
  brak pliku 409 `SOURCE_UNAVAILABLE`; wcześniej zapisany raport i
  trades nie zmieniają się. Przywrócenie oryginalnych bajtów odtwarza
  identyczne zdarzenia timeline.
- Odczyt dwóch payloadów w historycznym formacie v1/v2, zbudowanych z
  rzeczywistych publicznych okien i zapisanych bez rekordów raw w bazie
  po migracji, daje oznaczenie `LEGACY_SNAPSHOT`.
  Po selektywnym cleanup własna SQL:
  migracje/User/Strategy/Run/Archive/Raw/Trade/Report/Contribution
  `85/0/0/0/0/0/0/0/0`, Redis `DBSIZE=0`; własne kontenery usunięto.

Docs parity i guardrails `PASS`, strict architecture graph `942/942`.
Dowód dotyczy lokalnego skróconego lease oraz tych publicznych okien.
Zapisana `.CHECKSUM` nie jest podpisem cyfrowym Binance: potwierdza
spójność dokładnie pobranych bajtów i wykrywa późniejszą zmianę w bazie
w granicach zaufania do snapshotu. Nie dowodzi niezmienności zdalnego
archiwum po pobraniu ani filli PAPER/LIVE. Większe pliki, archiwa
miesięczne, trzecia doba i produkcja pozostają poza zakresem. Pełne 011A
i 011 `REVIEW`, `POSITION-CYCLE` `OPEN`, LIVE/wydanie `NO-GO` do
niezależnego odbioru.
