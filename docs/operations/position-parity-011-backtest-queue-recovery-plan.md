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

## Wynik lokalny 2026-10-21

Plan powyżej został wypchnięty przed próbą jako
`a7791113860812e97ed6e7c08ee58c1e50f943bb`. Na własnym PostgreSQL
`soar_011_queue_recovery_test` (127.0.0.1:5578, 84 migracje), Redis
(127.0.0.1:6418) i osobnej kolejce `backtest-011-queue-local-20261021`
warianty zmienionej i brakującej taśmy zakończyły się `2/2 PASS` po
skróceniu lease tylko tych dwóch testowych runów. Nowy worker nie pobierał
źródła przez sieć, nie uruchomił symulacji i zapisał `FAILED` bez trades
lub wkładów.

Wariant naturalnego lease zakończył się `1/1 PASS` po 612,94 s. Pierwszy
worker rzeczywiście pobrał ZIP i `.CHECKSUM`, zapisał archiwum i digest,
przetworzył DCA o 02:46:47.639 UTC na `a=167049972`, a potem został
zakończony `SIGKILL` przed TTP. Przed awarią był jeden `RUNNING` run,
jeden raport, zero trwałych trades i wkładów, jeden ID w Redis `processing`
i `dedupe`. Drugi worker nie otrzymał ręcznego enqueue ani claim; skan
odzyskał ten sam run po naturalnym terminie 10-minutowego lease.
Nie nastąpił ponowny fetch ZIP/.CHECKSUM; wynik zachował ID runu, raportu
i archiwum (`runId` + symbol oraz hash payloadu). Po ACK kolejka była pusta.
Jedna terminalna symulacja dała sześć trades, jeden raport i net PnL około
`+0,01386` USDT. Zapisana taśma zawierała też późniejsze
`a=167049975` oraz `a=167049977`; timeline po odzyskaniu miał DCA i TTP
na oczekiwanych znacznikach czasu. Sam ten test nie wystawia osobnego
zdarzenia `ARM`; dokładny arm na `a=167049975` pochodzi z wcześniejszego
lokalnego dowodu 011 na tym samym digestcie i konfiguracji.

API typecheck, docs parity, guardrails i strict graph drift przeszły.
Po cleanup w tej `_test` liczniki User/Strategy/BacktestRun/BacktestTrade/
BacktestReport/BacktestContribution/BacktestIntrabarArchive wynosiły zero,
Redis miał zero kluczy. Dowód obejmuje automatyczne przejęcie w lokalnej
kolejce BACKTEST; nie dowodzi real LIVE, produkcji, nadzoru produkcyjnego
workera ani braku ponownych **obliczeń** po SIGKILL. Pełne 011/011A
pozostają REVIEW/NO-GO do niezależnego odbioru.
