# 011: poprawiony plan zaniku sygnału na ustalonej taśmie

## Zamrożenie przed ponowną próbą

Źródło pozostaje bez zmiany: publiczny Binance USD-M `ALICEUSDT` `aggTrades`
2026-10-18 02:41–04:21 UTC, 100 świec 1m, ZIP SHA-256
`4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
Obowiązują `.CHECKSUM`, 100 niezależnych klines i digest zweryfikowanej taśmy.
Nie zmieniamy okna, źródła, dwóch agregatów docelowych ani konfiguracji DCA,
TTP, ryzyka, salda, dźwigni, opłat lub modelu internal mock LIVE.

Wynik SHA `05822c0fe` nie spełniał wcześniejszego planu wyboru: zapisany
`MOMENTUM(1)` działał jak `MOMENTUM(2)`, ponieważ `clampPeriod` zwraca
`Math.max(2, Math.floor(parsed))`. Ten dokument zastępuje wyłącznie regułę
wyboru kandydata; zachowuje historyczny plan i wynik jako zapis obserwacji.

## Skończona kolejność

Jedynym dopuszczonym okresem jest jawne `period=2`, równe efektywnemu okresowi
jądra i pierwszemu, który może dać zwykły sygnał wejścia na świecy 2.
Kandydatów jest najwyżej dwóch, w kolejności `lossIndex=3`, następnie
`lossIndex=4`. Dla każdego liczymy z zamknięć zweryfikowanej taśmy
`v(i)=close[i]-close[i-2]`. Jeśli `v(2)==v(lossIndex)`, pomijamy go.
W przeciwnym razie próg to `(v(2)+v(lossIndex))/2` w arytmetyce JavaScript,
warunek `>` gdy `v(2)>v(lossIndex)` albo `<` gdy `v(2)<v(lossIndex)`.
Cała reszta strategii jest identyczna z pierwszą próbą.

Kandydat kwalifikuje się tylko gdy zwykły evaluator zapisanej reguły daje
`null` na indeksach 0 i 1, LONG na 2 i `null` na wskazanym indeksie 3 lub 4;
symulator na tej samej taśmie musi dać pierwszy ENTRY na 2, dodatni DCA przy
`a=167049972` (02:46:47.639 UTC, cena 0,1454) i późniejszy TTP przy
`a=167049977` (02:46:57.282 UTC, cena 0,1454), oba na świecy 5.
Pierwszy kwalifikujący się kandydat trafia do jedynej próby trzech trybów.
Jeśli żaden nie przejdzie, zapisujemy FAIL bez dodawania kandydata lub
przesuwania okna. Jeśli próba trzech trybów ujawni rozjazd, zapisujemy FAIL
bez zmiany progu ani powrotu do listy.

## Kryterium trzech trybów i granica

Jedną konfigurację zapisujemy normalnie i używamy w BACKTEST, PAPER oraz
Binance FUTURES internal mock LIVE. Finalna świeca otwiera pozycję z LONG;
po faktycznym zaniku sygnału obie pozycje pozostają OPEN bez EXIT, a potem
wykonują jeden źródłowy DCA i TTP w podanej kolejności. Sprawdzamy wkład,
ilość, średnią, opłaty, net PnL, raport, timeline, retry, dedupe i stan po
wznowieniu w osobnym procesie. Bez ręcznych ENTRY/EXIT/TTP lub stanu.

To lokalny celowany świadek, a nie dowód realnego venue, produkcji,
rentowności czy automatycznego odzyskania PAPER/LIVE po SIGKILL. Pełne
011/011A nadal REVIEW, wydanie NO-GO do niezależnego odbioru.
