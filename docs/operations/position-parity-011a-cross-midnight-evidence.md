# 011A — ograniczony odbiór dwóch dziennych archiwów przez północ UTC

Plan zamrożono przed kodem w `511ad1a0ef5ea7ba2a470be200a23b87ca855132`.
Kod i testy: `22e08d1233097b6996ae6cc128ce7f88d5831114`.
Zakres: BACKTEST Binance USD-M `aggTrades`, 1m, jawne 1–120 świec w
dwóch sąsiednich dobach UTC. Dotychczasowy snapshot v1 dla jednej doby
pozostaje czytelny; przekroczenie północy zapisuje v2 z dwoma ZIP SHA-256.
Każdy ZIP jest sprawdzany osobno z opublikowanym `.CHECKSUM`; limit 8 MiB
ZIP, 64 MiB CSV i 20 000 wybranych agregatów dotyczy sumy obu plików.
Parser sprawdza dobę każdego wiersza, ciągłość `a`, wzrost `f..l` i czas,
rekordy brzegowe oraz OHLCV każdej świecy przed zapisem źródła.

## Publiczny świadek i wznowienie

- Zamrożone okno: `ALICEUSDT`, 2026-10-17 23:50–2026-10-18 00:10 UTC,
  20 świec. Oficjalne `.CHECKSUM` i obliczony SHA-256 ZIP: 17 października
  `0cb11b74fb1514e650613d23fb60224a4131af6fcbff0c14218604762dee9b01`,
  18 października
  `4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
  Świece porównano z publicznym kline Binance. Opt-in walidatora z siecią:
  12/12 `PASS`; obejmuje także v1, brak ZIP/checksum, zmianę checksum,
  lukę `a` na granicy, odwrócony czas, mismatch OHLCV i limity sumaryczne.
- Procesowy opt-in na własnej PostgreSQL `_test` po 84 migracjach i osobnym
  Redisie: 3/3 `PASS`. Pierwszy PID pobrał po dwa ZIP i `.CHECKSUM`, zapisał
  snapshot i digest, został zatrzymany przez `SIGKILL` przed symulacją.
  Po skróceniu lease wyłącznie własnego testowego runu drugi PID odzyskał
  ten sam run automatycznie z kolejki, przy całkowicie wyłączonym `fetch`.
  Nie było drugiego submitu ani pobrania źródła; Redis po ACK był pusty.
- Wariant zgodny: `COMPLETED`, jeden run, jeden raport, trzy trwałe trades,
  18 świec timeline, 6 zdarzeń, net PnL `+0,34133` USDT zgodny z sumą
  trades. SHA-256 zapisanego payloadu przed i po restarcie:
  `52273ba963fc402ae63030575d80ec387336cbc3133c55d79a6bf8ec0776504c`;
  digest taśmy w runie:
  `639b68595919f111f454f61bbfc5985983d14f80d3d4fd8dfaa17640f0ea358c`.
- Usunięty lub zmieniony zapisany snapshot: w obu wariantach `FAILED`,
  `reportReady=false`, `netPnl=null`, zero trades i wkładów, bez symulacji
  i ponownego fetch. Własne zasoby po selektywnym cleanup: SQL
  migracje/User/Strategy/Run/Archive/Trade/Report/Contribution
  `84/0/0/0/0/0/0/0`, Redis `DBSIZE=0`; dwa własne kontenery usunięte.

API typecheck, docs parity, guardrails i strict architecture graph drift
przeszły (`941/941` ścieżek). Dowód jest lokalny i dotyczy tego okna oraz
skróconego lease. Surowe ZIP nie są zapisane do późniejszej niezależnej
kontroli `.CHECKSUM`; odczyt offline sprawdza SHA-256 payloadu i taśmę.
Większe archiwa, miesięczne pliki, trzy doby, PAPER/LIVE, rzeczywiste
fille i produkcja pozostają poza wycinkiem. W chwili wyniku autorskiego
pełne 011A i 011 nadal były `REVIEW`, `POSITION-CYCLE` `OPEN`, LIVE i
wydanie `NO-GO` do niezależnego odbioru.

## Niezależny odbiór ograniczonego wycinka

Niezależny statyczny review na dokładnym kodowym SHA
`22e08d1233097b6996ae6cc128ce7f88d5831114` dał ograniczony `PASS`.
Niezależny runtime QA uzyskał `12/12 PASS` walidatora i `3/3 PASS` próby
procesowej na publicznym oknie ALICEUSDT 20 świec przez północ UTC.
Każdy z dwóch ZIP przeszedł własną `.CHECKSUM`; OHLCV zgodziło się z
publicznymi klines. Po `SIGKILL` drugi PID odzyskał ten sam run offline bez
ponownego fetch i bez duplikatu: jeden raport, trzy trades, net PnL
`+0,34133` USDT i 18 świec timeline. Zmiana lub usunięcie snapshotu
zakończyły się `FAILED`, `netPnl=null`, bez trades i wkładów.

SHA-256 logów QA: walidator
`B91CBF6AACDE5F9F5D7B7F9BF68AFDC3C0981EA1FAE17266508E858ECD475F78`;
runtime `E263AACCF264CE33FA1C9C444F9FF91EFEC72C28868BA3D00796F66B6DD630BF`.
Zakres `1–120` świec w dwóch sąsiednich dobach to granica walidatora w kodzie;
publiczny test potwierdził **20** świec. Surowe ZIP nie są utrwalane do
późniejszej ponownej kontroli `.CHECKSUM`, a lease skrócono w teście.
To lokalny odbiór BACKTEST, bez dowodu real LIVE lub produkcji. Pełne 011A
i 011 pozostają `REVIEW`, `POSITION-CYCLE` `OPEN`, wydanie `NO-GO`.
