# 011A: ograniczony wycinek archiwum przez północ UTC — plan przed kodem

Punkt bazowy: `61208f44451f2be4927ae4dd0381aeb6a162e31f`.
Kontrakt `docs/product/current-version-contract.md`, `DEFINITION_OF_DONE.md`
i wiersz 011A wymagają prawdziwego źródła oraz fail-closed, a nie samego
statusu workera. Zakres: Binance USD-M `aggTrades`, 1m, jawne okno 1–120
świec mieszczące się w najwyżej dwóch **sąsiednich** dobach UTC.

Zachowujemy wersję 1 snapshotu i jej digest dla jednego dnia. Nowa wersja 2
dla przejścia przez północ zapisze dwa uporządkowane opisy archiwów
(`day`, URL, SHA-256 ZIP), wspólne żądane świece i wybrane agregaty. Każdy
surowy ZIP przejdzie niezależnie oficjalną `.CHECKSUM` i kontrolę struktury.
Limit 8 MiB skompresowanych i 64 MiB CSV będzie dotyczył **sumy** obu
archiwów; limit 20 000 agregatów dotyczy scalonej taśmy z rekordami
brzegowymi. Parser sprawdzi czas w dobie każdego pliku, porządek `a`, `T`
i `f..l` w całym połączeniu oraz obecność rekordów przed/po oknie. Kline
OHLCV każdej minuty muszą zgodzić się ze źródłem. Brak drugiego pliku,
checksum, luka, zmiana kolejności, rozmiar lub rozbieżny OHLCV dają błąd
przed zapisem snapshotu i przed publikacją wyniku BACKTEST.

Jedyny publiczny świadek procesowy zostanie zamrożony na `ALICEUSDT`
2026-10-17 23:50–2026-10-18 00:10 UTC. Na własnej `_test` i Redisie
`createRun` zapisze jeden run; pierwszy worker pobierze dwa ZIP i obie
`.CHECKSUM`, utrwali digest i zatrzyma się przed symulacją. Po SIGKILL
drugi PID odzyska ten sam run po testowo skróconym lease bez drugiego submit
i bez sieci. Sprawdzimy jedną parę run/report, trwałe trades/PnL i timeline,
ten sam digest/snapshot oraz pustą kolejkę po ACK. Osobne warianty błędu
sprawdzą brak i zmianę zapisanego snapshotu bez częściowych trades/raportu.
Testy jednostkowe obejmą brak drugiego ZIP/checksum, lukę `a` na granicy,
odwrócony czas, mismatch OHLCV i przekroczenie limitów.

Nie rozszerzamy okna na trzecią dobę, pliki miesięczne, większe archiwa,
inne venue ani nieograniczoną paginację. Surowe ZIP nie są utrwalane, więc
odczyt offline weryfikuje hash zapisanego snapshotu i zweryfikowaną taśmę,
ale nie pobiera ponownie oficjalnych `.CHECKSUM`. To lokalny BACKTEST;
real LIVE, produkcja i pełne 011A/011 pozostają NO-GO.
