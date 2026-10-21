# 011: odzyskanie BACKTEST przez kolejkę po źródłowym DCA — plan przed próbą

Punkt bazowy: `cb82bc5c9d81a14db65b8caf7046b23b307f1a89`. To osobny
podetap lokalny względem nadzorowanego restartu runtime PAPER/internal mock
LIVE. Nie zmienia zamrożonego świadka: zapisana strategia
`MOMENTUM(2)<-0,00015000000000001124`, ALICEUSDT 2026-10-18
02:41–04:21 UTC, dzienny ZIP i `.CHECKSUM` SHA-256
`4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`
oraz digest taśmy
`506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8`.

## Mechanizm i granica awarii

BACKTEST nie używa BullMQ: `BacktestRunQueue` ma własne listy `pending` i
`processing` oraz zbiór `dedupe` w Redisie. `createClaimedBacktestRunJob`
wiąże zapis z tokenem w PostgreSQL; domyślny lease trwa 10 minut, poll 1 s,
skan recovery 30 s. Próba użyje prawdziwego `createRun`/enqueue, claim i
workera w osobnym procesie. Po potwierdzonym zdarzeniu DCA ze źródłowego
`a=167049972` proces zablokuje się przed arm `a=167049975` i TTP
`a=167049977`; orkiestrator sprawdzi trwały archiwum/digest, kolejkę i
status `RUNNING`, a potem twardo zakończy wyłącznie własny PID.

Wkłady i trades BACKTEST są buforowane w trakcie symulacji i zapisywane
atomowo z raportem dopiero przy terminalnym commit. Marker DCA w procesie
jest dowodem przejścia obliczeń przez źródłowy tick przy trwałej taśmie,
nie trwałym wkładem DCA przed awarią. Po restarcie ten sam run będzie
przeliczony od zapisanej taśmy; wymagany brak **drugiego trwałego wyniku**,
duplikatu runu, trades, raportu i zleceń, nie brak ponownego obliczenia.

Drugi worker uruchomi się bez ręcznego enqueue lub claim i z domyślnymi
parametrami. Pełne naturalne 10 minut lease zostanie odczekane, jeśli własna
izolowana próba jest wykonalna. Przed terminem nie może być takeover; po
terminie musi zmienić się token i nastąpić automatyczne wznowienie. Źródło
na retry ma pochodzić z zapisanego archiwum, bez drugiego fetch ZIP lub
`.CHECKSUM`. Odbiór: ten sam run, jeden raport, sześć trades, PnL
`+0,01386` USDT, zdarzenia DCA/arm/TTP z ID `167049972/167049975/167049977`,
identyczne ID zapisanych przed awarią rekordów źródła i runu oraz puste
`pending/processing/dedupe` po ACK. Brak lub zmiana taśmy musi zakończyć
osobny retry jako `FAILED` bez częściowego wyniku; jeżeli te warianty
wymagają skrócenia lease, wynik opisze to jako ograniczenie.

Wyłącznie własna PostgreSQL `_test`, Redis i nazwa kolejki; żadnego deploy,
produkcji, real LIVE ani cudzych kontenerów. Własne zasoby zostaną usunięte
po odczycie liczników. PASS lokalny nie zamknie 011/011A ani wydania.
