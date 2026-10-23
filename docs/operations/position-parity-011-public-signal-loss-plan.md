# 011: zanik sygnału na ustalonej publicznej taśmie — plan przed próbą

## Niezmienny zakres

Jedyną taśmą jest już zweryfikowany publiczny Binance USD-M `ALICEUSDT`
`aggTrades` z 2026-10-18 02:41–04:21 UTC (100 świec 1m), ZIP SHA-256
`4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
Porównanie z niezależnymi klines i digest źródła pozostają obowiązkowe. Nie
wybieramy następnego okna po wyniku.

Stałe parametry: LONG, `noMatchAction=EXIT` w zapisanej strategii, lecz HOLD
otwartej pozycji według bieżącej polityki, DCA advanced +0,10% jeden raz,
mnożnik wkładu USDT 1, TTP advanced +0,08% i trailing 0,05%, dźwignia 1,
ISOLATED, ryzyko 10%, saldo 1000 USDT, opłata 0,0004/fill, slippage 0.
Jedyna zmienna konfiguracji to reguła wejścia `MOMENTUM(period) condition
threshold`. Nie dodajemy ręcznego ENTRY, EXIT, TTP ani stanu pozycji.

## Zamknięta kolejność kandydatów

Po sprawdzeniu taśmy liczymy z jej zamknięć `v(i,p)=close[i]-close[i-p]`,
czyli dokładnie jednostkę implementacji `MOMENTUM`. Kandydaci są wyznaczani
w porządku `(period=1, lossIndex=3)`, `(1,4)`, `(2,3)`, `(2,4)`; to najwyżej
cztery konfiguracje, bez ręcznego strojenia. Dla każdej pary bierzemy
`entry=v(2,period)` oraz `loss=v(lossIndex,period)`. Jeśli są równe, pomijamy
parę. W przeciwnym razie próg to dokładny środek `(entry+loss)/2` w liczbach
JavaScript, warunek `>` gdy `entry>loss` albo `<` gdy `entry<loss`.

Kandydat kwalifikuje się tylko wtedy, gdy zwykły evaluator daje brak sygnału
na indeksach 0 i 1, LONG na indeksie 2 i brak sygnału na wskazanym indeksie
3 lub 4. Na tej samej taśmie i bez zmiany reszty strategii symulator musi
dać pierwszy ENTRY na świecy 2, dodatni DCA przy źródłowym agregacie
`a=167049972` o 02:46:47.639 UTC i późniejszy TTP przy `a=167049977`
o 02:46:57.282 UTC. Wybieramy pierwszego kwalifikującego się kandydata.
Jeżeli żaden nie przejdzie, zapisujemy ujemny wynik i **nie** dodajemy
piątego kandydata ani nie zmieniamy okna.

## Odbiór i granica

Wybraną konfigurację zapisujemy jako jedną strategię i używamy jej w BACKTEST,
PAPER i Binance FUTURES internal mock LIVE. Finalne świece otwierają pozycję
zwykłym LONG. Na świecy z rzeczywistym brakiem sygnału obie pozycje pozostają
OPEN i nie powstaje EXIT; następnie potwierdzamy źródłową kolejność DCA,
uzbrojenia TTP i TTP, ilość, wkład, średnią, opłaty, net PnL, jeden raport,
timeline, brak duplikatu po retry oraz utrzymanie stanu PAPER/mock LIVE po
restarcie procesu. Pierwszy rozjazd przerywa próbę; nie naprawiamy wyniku
doborem następnego progu poza podaną kolejnością.

Test jest celowanym świadkiem, a nie estymacją typowej częstości lub
rentowności. Mock venue ma syntetyczne reguły ilości, ceny i fille; żaden
wynik nie dowodzi prawdziwego zlecenia Binance, produkcji ani odzyskania po
awarii, której test nie wywołał. Pełne 011/011A pozostają REVIEW i wydanie
NO-GO do niezależnego odbioru.

## Wynik lokalnej próby

Plan wypchnięto przed testem w SHA `fa7eec0c9`. Zweryfikowany ZIP i `.CHECKSUM`,
100 niezależnych klines oraz digest
`506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8`
pozostały zgodne. Pierwszy kandydat `(1,3)` (`MOMENTUM(1)<-0,00005`)
odpadł: evaluator wciąż dawał LONG na świecy 3. Drugi `(1,4)` został
wybrany bez dalszego szukania: `MOMENTUM(1)<0`, decyzje evaluatora na
świecach 0–4 to `[null,null,LONG,LONG,null]`. Zanik nastąpił na finalnej
świecy 4 o 02:45:59.999 UTC po zwykłym otwarciu na świecy 2 i przed DCA.

Jedna zapisana konfiguracja przeszła przez BACKTEST, PAPER i Binance FUTURES
internal mock LIVE. Obie pozycje runtime po świecy 4 pozostały OPEN bez EXIT;
na publicznym agregacie `a=167049972` o 02:46:47.639 UTC doszedł jeden
dodatni DCA. Po wznowieniu w odrębnym PID agregat `a=167049975` uzbroił TTP,
a `a=167049977` zamknął obie pozycje o 02:46:57.282 UTC; powtórzenie ticku
nie dodało zlecenia. Każdy runtime miał dokładnie OPEN/DCA/CLOSE; mock LIVE
zachował trzy unikalne intenty i fille, DCA dedupe jeden raz. BACKTEST miał
COMPLETED, jeden raport, sześć trades (net PnL całego raportu `-0,1221`
USDT), tę samą pierwszą parę źródłową i nie dodał duplikatów po ponowieniu
joba.

Pierwszy cykl BACKTEST: ilość `1376,463143376176`, średnia
`0,145299931177`, fee `0,16006`, net PnL `-0,02232` USDT. PAPER i mock LIVE:
ilość `1376,46314337`, średnia `0,145299931176875`, fee
`0,1600550964180656`, net PnL `-0,02231404958610045` USDT. Różnice są
skutkiem jawnych kroków ilości i zaokrągleń modelu, tak jak w pierwszym
źródłowym teście 011. Zmiana reguły wejścia zmieniła późniejsze transakcje,
więc cały raport ma sześć, a nie wcześniejsze pięć trades.

Próba na osobnych PostgreSQL `_test` po 84 migracjach i Redisie: etap `open`
1 PASS / 1 SKIP oraz odrębny proces `resume` 1 PASS. Stary wariant opt-in
`MOMENTUM(1)>-100` również ponownie przeszedł 1 PASS / 1 SKIP z pięcioma
trades i dotychczasowym raportem. API typecheck, docs parity, quality
guardrails i graph drift `937/937` PASS. Po obu próbach SQL
`migracje/User/BacktestRun/BacktestTrade/BacktestReport/Position/Order/Dedupe`
`84/0/0/0/0/0/0/0`, Redis `DBSIZE=0`.

Powtórzenie: w `apps/api` ustaw `DATABASE_URL` na lokalne administracyjne
`postgres`, `TEST_DATABASE_URL` na pustą własną
`soar_position_parity_011_test`, `REDIS_URL` na własny port i
`JWT_SECRET` na wartość lokalną; ustaw
`RUN_011_REAL_SOURCE_SIGNAL_LOSS_PROOF=1` i
`RUN_011_REAL_SOURCE_THREE_MODE_STAGE=open`, następnie uruchom
`pnpm exec vitest run src/modules/engine/runtime011RealSourceThreeMode.e2e.test.ts
-t 'ordinary LONG' --reporter=dot`. Etap `open` uruchamia proces `resume`.

To lokalny, celowo wybrany świadek rzeczywistego zaniku sygnału i HOLD przed
DCA→TTP; nie dowodzi automatycznego wznowienia po awarii procesu ani
zachowania prawdziwego Binance/produkcji. Pełne 011/011A pozostają REVIEW,
wydanie NO-GO.

## Errata do SHA `fa7eec0c9` i `05822c0fe`

Powyższa reguła doboru **nie odpowiadała wykonaniu**. `clampPeriod` w
`sharedIndicatorSeries.ts` podnosi okres 1 do 2; kernel wywołuje ją dla
`MOMENTUM`. Wcześniejsze `v(i,1)=close[i]-close[i-1]`, oba opisane progi
oraz uzasadnienie kolejności kandydatów były liczone dla niewykonywanego
okresu. Zaobserwowane przez evaluator i runtime decyzje, OPEN po zaniku
sygnału i DCA→TTP są faktami z lokalnej próby, ale nie spełniają wymogu
poprawnie zamrożonego doboru. Wcześniejszego planu i wyniku nie usuwamy ani
nie przedstawiamy jako zatwierdzonego odbioru. Nowy plan przed próbą:
[011 effective MOMENTUM](position-parity-011-effective-momentum-signal-loss-plan.md).
