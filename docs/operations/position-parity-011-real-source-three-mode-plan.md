# 011: plan trzech trybów na ustalonym rzeczywistym świadku 011A

## Zamrożony zakres przed próbą integracyjną

Źródło i zakres: publiczny, uporządkowany Binance USD-M `ALICEUSDT` `aggTrades`
2026-10-18 **02:41–04:21 UTC** (100 pełnych świec 1m), dzienny ZIP i jego
`.CHECKSUM`. Oczekiwany SHA-256 ZIP:
`4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
Kandydat pochodzi z jawnego, wcześniej zapisanego selektora 011A
`5a85cb5d82751efb40c82ad712b3b9471b7d2094` i źródłowego testu
`488023c81a4d716464f737182213bca7735374e5`. Po wyniku tej próby nie
wybieramy innego okna ani nie stroimy progu.

Jedna zapisana strategia ma dokładnie konfigurację
`marketSequenceStrategyConfig` z
`apps/api/src/modules/backtests/backtest011aMarketWitness.config.ts`:
LONG `MOMENTUM(1)>-100`, legacy `noMatchAction=EXIT` z polityką HOLD otwartej
pozycji, advanced DCA `+0,10%` jeden raz z mnożnikiem bieżącego wkładu USDT
`1`, advanced TTP uzbrojenie `+0,08%`, trailing `0,05%`, bez prostego TP/SL
i TSL. Dźwignia 1, `ISOLATED`, ryzyko portfela 10%, saldo 1000 USDT,
modelowa prowizja `0,0004` na fill i slippage 0. Sygnał ENTRY musi powstać
przez zwykły evaluator finalnej świecy; bez ręcznie podanego ENTRY, EXIT,
stanu TTP lub pozycji.

Warunek lokalnego funkcjonalnego odbioru: z tej samej zweryfikowanej taśmy
BACKTEST, PAPER i Binance FUTURES **internal mock LIVE** otwierają pozycję
ze zwykłego LONG, zachowują ją po zaniku sygnału wejścia (bez EXIT), wykonują
dodatni DCA przy źródłowym agregacie `a=167049972`, 02:46:47.639 UTC,
a dopiero później na tej samej świecy TTP przy `a=167049977`,
02:46:57.282 UTC. Używamy ceny źródłowej 0,1454 obu agregatów oraz ich
faktycznej kolejności; TTP z modelowego zamknięcia 02:46:59.999 nie spełnia
warunku. Sprawdzamy jedną parę ENTRY/DCA/CLOSE w każdym runtime, trwały wkład,
ilość, średnią, opłatę, net PnL, jeden raport BACKTEST, replay, restart
PAPER/mock LIVE i brak duplikatów po retry. Każda różnica względem BACKTEST
wynikająca z jawnych **syntetycznych** reguł ilości/ceny mock venue ma być
wyliczona, nie zamaskowana tolerancją. Jeśli normalny sygnał lub runtime nie
osiągną tej kolejności, zapisujemy odtwarzalny FAIL z pierwszym rozjazdem.

Poza zakresem: prawdziwe zlecenia i fille, aktualne reguły i opłaty venue,
LIVE/prod/deploy. Ten celowany przypadek z selekcją 161 okien nie dowodzi
typowej częstości ani rentowności. 011 i pełne 011A pozostają `REVIEW`,
wydanie `NO-GO` do osobnego niezależnego odbioru.

## Wynik

Plan zapisano i wypchnięto **przed** próbą w SHA
`fe008242e2adce4d2508081b769f175a5ae6be3e`. Opt-in
`apps/api/src/modules/engine/runtime011RealSourceThreeMode.e2e.test.ts` na własnej
PostgreSQL `soar_position_parity_011_test` po 84 migracjach i osobnym Redisie
zweryfikował publiczny ZIP, `.CHECKSUM`, 100 niezależnych klines oraz digest
`506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8`.
Po zapisaniu zweryfikowanego archiwum globalny fetch był zablokowany; drugi
proces czytał tę samą taśmę offline z DB.

Jedna zapisana strategia, bez ręcznego ENTRY i bez zaszczepionego TTP, dała
zwykły LONG w PAPER i internal mock LIVE po finalnej świecy indeks 2. Po
świecach 3–4 oba runtime miały jedną pozycję OPEN, jeden trwały sygnał LONG
i zero EXIT. Osobna kontrola evaluatora pokazała jednak `LONG` na wszystkich
trzech świecach 2, 3 i 4: przy zamrożonym progu `MOMENTUM(1)>-100` na tej
taśmie **nie znika sygnał wejścia**. Tym samym planowany warunek HOLD po zaniku
sygnału nie został tu wykonany; jego syntetyczny odbiór pozostaje w starszym
teście 011. Nie przypisujemy tej rzeczywistej taśmie dowodu no-match HOLD.
Oba otrzymały wszystkie źródłowe agregaty przez DCA `a=167049972`, bez
wcześniejszego DCA; potwierdzony DCA nastąpił przy 0,1454 o
02:46:47.639 UTC. Po restarcie procesu oba runtime pozostały OPEN przed
`a=167049977` i zamknęły się jednokrotnie przez TTP na tym późniejszym
agregacie przy 0,1454 o 02:46:57.282 UTC. Po DCA drugi proces odczytał
trwały licznik dodatków i poziom DCA; późniejszy agregat `a=167049975`
uzbroił TTP w obu runtime przed agregatem zamykającym. Powtórzenie ticku nie dodało
zlecenia. Trwałe dane każdego runtime: dokładnie OPEN/DCA/CLOSE, jeden
poziom DCA dedupe, trzy zlecenia; w mock LIVE trzy unikalne intenty i fille
z fee `EXCHANGE_FILL`. BACKTEST miał `COMPLETED`, jeden raport, pięć trades,
źródłowy pierwszy DCA/TTP, zgodny powtórny timeline i brak duplikatu po
ponowieniu joba.

Pierwszy cykl: BACKTEST ilość `1376,463143376176`, średnia
`0,145299931177`, fee `0,16006`, net PnL `-0,02232` USDT. PAPER i mock LIVE
mają ilość `1376,46314337`, średnią `0,145299931176875`, fee
`0,1600550964180656` i net PnL `-0,02231404958610045` USDT. Wkład ENTRY
PAPER `100,000000000032` i DCA `99,999999999134` USDT odpowiadają w granicy
syntetycznego kroku ilości wkładom BACKTEST po około 100 USDT. Różnica
ilości to `0,000000006176` jednostki, a różnica fee `0,0000049035819344`
USDT; BACKTEST zaokrągla rozliczenie do pięciu miejsc, runtime zachowuje
precyzję opłaty mock fill. Różnica net PnL `0,00000595041389956` USDT
została jawnie sprawdzona w teście. Cały raport BACKTEST wynosi
`-0,16687` USDT dla pięciu trades; runtime porównuje pierwszy cykl.

Powtórzenie: z `apps/api`, `RUN_011_REAL_SOURCE_THREE_MODE_PROOF=1` i
`RUN_011_REAL_SOURCE_THREE_MODE_STAGE=open`, `DATABASE_URL` wskazuje lokalne
administracyjne `postgres`, `TEST_DATABASE_URL` własną
`soar_position_parity_011_test`, `REDIS_URL` własny port; wykonać
`pnpm exec vitest run src/modules/engine/runtime011RealSourceThreeMode.e2e.test.ts -t 'ordinary LONG' --reporter=dot`.
Etap `open` uruchamia odrębny etap `resume` w nowym PID. Test autora: etap
`open` 1 PASS / 1 SKIP, etap `resume` 1 PASS. API typecheck,
docs parity, repo guardrails i graph drift `937/937` PASS. Po cleanup własne SQL:
migracje/User/BacktestRun/BacktestTrade/BacktestReport/Position/Order/Dedupe
`84/0/0/0/0/0/0/0`; Redis `DBSIZE=0`.

Granica: ilości, ceny wykonalne, saldo i fille internal mock LIVE opierają się
na **syntetycznej** regule `contractSize=1`, base step `0,00000001`, price
step `0,0001`, min notional `5` USDT oraz fee `0,0004`. Nie są to aktualne
metadane ani prawdziwy fill Binance. Test nie mierzy całych 100 minut PAPER/LIVE,
nie dowodzi produkcji ani zyskowności; wcześniejszy 011A osobno potwierdził
procesowe odzyskanie BACKTEST po SIGKILL. Pełne 011 i 011A nadal `REVIEW`,
wydanie `NO-GO` do niezależnego odbioru tego kodu.

Następna zamrożona próba na tym samym oknie, z rzeczywistym zanikiem sygnału
wejścia przed DCA, jest opisana w
[planie i wyniku 011 signal loss](position-parity-011-public-signal-loss-plan.md).
