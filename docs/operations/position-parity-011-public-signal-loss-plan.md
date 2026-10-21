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
