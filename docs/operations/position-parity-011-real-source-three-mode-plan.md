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

Do uzupełnienia po commicie tego planu i próbie na izolowanej `_test`/Redis.
