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

## Wynik ponownej próby lokalnej

Ten poprawiony plan został wypchnięty **przed** próbą w SHA `8537eddee`.
ZIP, `.CHECKSUM`, 100 niezależnych klines i digest
`506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8`
pozostały niezmienione. Pierwszy kandydat `(period=2, lossIndex=3)` spełnił
warunki; drugiego nie próbowano. Źródłowe wartości to
`v(2)=-0,00020000000000000573` i `v(3)=-0,00010000000000001674`.
Wybrana, jawnie zapisana reguła `MOMENTUM(2)<-0,00015000000000001124`
dała decyzje evaluatora `[null,null,LONG,null,null]` na świecach 0–4.
Brak LONG na finalnej świecy 3 o 02:44:59.999 UTC nastąpił po ENTRY na 2
i przed DCA na świecy 5.

BACKTEST, PAPER i Binance FUTURES internal mock LIVE użyły tej samej
zapisanej strategii. Obie pozycje runtime pozostały OPEN bez EXIT po
zaniku sygnału. DCA na publicznym agregacie `a=167049972` o
02:46:47.639 UTC poprzedził uzbrojenie TTP na `a=167049975` oraz
zamknięcie przez TTP na `a=167049977` o 02:46:57.282 UTC po wznowieniu
w osobnym PID. Każdy runtime miał OPEN/DCA/CLOSE; mock LIVE trzy unikalne
intenty i fille, jeden DCA dedupe i zero dodatkowych zleceń po retry.
BACKTEST miał status COMPLETED, jeden raport, sześć trades, net PnL całego
raportu `+0,01386000000000004` USDT i bez duplikatu po ponowieniu joba.
Pierwszy cykl miał ilość `1376,463143376176`, średnią `0,145299931177`,
fee `0,16006` i net PnL `-0,02232` USDT; PAPER/mock LIVE miały ilość
`1376,46314337`, średnią `0,145299931176875`, fee `0,1600550964180656`
i net PnL `-0,02231404958610045` USDT. Drobna różnica pierwszego cyklu
wynika z jawnych syntetycznych kroków ilości i zaokrągleń opłaty.

Na własnej bazie PostgreSQL `_test` po 84 migracjach i osobnym Redisie
opt-in `RUN_011_REAL_SOURCE_SIGNAL_LOSS_PROOF=1` miał `open` 1 PASS /
1 SKIP i proces `resume` 1 PASS. API typecheck, docs parity, quality
guardrails i graph drift `937/937` PASS. Po cleanup SQL
`migracje/User/BacktestRun/BacktestTrade/BacktestReport/Position/Order/Dedupe`
`84/0/0/0/0/0/0/0`, Redis `DBSIZE=0`. Wynik nie dowodzi produkcji ani
automatycznego powrotu po SIGKILL. Pełne 011/011A nadal REVIEW, NO-GO.

## Osobny defekt kontraktu parametru `MOMENTUM`

Potwierdzone lokalnie: wcześniejszy POST `/dashboard/strategies` z
`params.period=1` otrzymał 201 i zachował tę konfigurację. Funkcja
`validateStrategyConfig` również przyjmuje ją bez błędu. Kernel używa
`clampPeriod(1,14)=2`, więc wykonuje okres 2. Minimalna reprodukcja bez
bazy: dla `closes=[1,2,3,4]` wywołanie kernela z `period=1` i `period=2`
zwraca w obu przypadkach `[null,null,2,2]`; rzeczywista różnica o jeden
krok byłaby `[null,1,1,1]`. API dopuszcza zatem parametr, którego znaczenia
nie zachowuje wykonanie. Nie stwierdzamy tu, czy formularz Web dopuszcza 1.

Proponowany priorytet **P1** jako osobny ticket: rozbieżność może zmienić
decyzje transakcyjne względem strategii zadanej przez użytkownika, choć
BACKTEST/PAPER/LIVE dzielą ten sam kernel. Odbiór osobnej poprawki powinien
ustalić zamierzoną granicę, następnie albo jawnie odrzucać `period=1` przy
zapisie z czytelnym błędem i sprawdzić istniejące strategie, albo obsłużyć
prawdziwy okres 1 w kernelu we wszystkich trzech trybach. Wymagany test:
create/read API i finalne świece na danych, na których `period=1` i `2`
dają różne sygnały. Ta korekta 011 nie zmienia semantyki kernela.
