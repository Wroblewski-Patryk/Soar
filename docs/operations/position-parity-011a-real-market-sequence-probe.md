# 011A: ustalona próba rzeczywistej sekwencji DCA → TTP

## Plan ustalony przed odczytem wyniku

Próba dotyczy wyłącznie publicznej taśmy Binance USD-M `ALICEUSDT` z dnia
2026-10-18, okna 02:27–04:07 UTC (100 zamkniętych świec 1m). Źródłem jest
`https://data.binance.vision/data/futures/um/daily/aggTrades/ALICEUSDT/ALICEUSDT-aggTrades-2026-10-18.zip`
oraz jego `.CHECKSUM`. Wcześniejszy test archiwum odczytał SHA-256 ZIP
`4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`;
nowa próba ponownie sprawdzi sumę i nie przyjmie zmienionego pliku bez jawnego
odnotowania zmiany.

Jedna zapisana strategia ma sygnał LONG `MOMENTUM(1) > -100`, historyczne
`noMatchAction=EXIT` (zanik wejścia nie zamyka pozycji), dźwignię 1 i margin
`ISOLATED`. Ma jeden dodatni poziom advanced DCA `+0,10%` z mnożnikiem
bieżącego wkładu USDT `1`, a advanced TTP uzbraja się przy `+0,08%` z krokiem
trailing `0,05%`. Nie ma TSL ani prostego TP/SL. Saldo początkowe wynosi
1000 USDT, ryzyko portfela 10%, opłata za każdy symulowany fill `0,0004`,
slippage 0. Parametry są celowo małe, aby zbadać chronologię na ograniczonym
publicznym oknie; nie stanowią rekomendowanej strategii ani dowodu zyskowności.

Test ma utworzyć strict BACKTEST run przez zwykłe `createRun`, pobrać i
utrwalić sprawdzony ZIP, digest oraz taśmę, zatrzymać pierwszy proces przed
symulacją i wznowić ten sam run z drugiego PID po wygaśnięciu jego lease w
odizolowanej bazie. Drugi proces nie może pobrać źródła ponownie. Odbiór
pozytywny wymaga w **tym samym runie** co najmniej jednej pary DCA i późniejszego
TTP na tej samej świecy, której `eventTime` i `sequenceId` pochodzą z dwóch
rzeczywistych uporządkowanych agregatów; trwałego wkładu, ilości, średniej,
opłat, PnL, jednego raportu i zgodnego timeline bez duplikatów. Jeśli taśma
nie wytworzy takiej pary przy tych parametrach, wynik jest negatywny; nie
zmieniamy progów po obejrzeniu danych w tej próbie.

Granica: agregaty dokumentują kolejność cen, lecz nie dowodzą rzeczywistych
filli użytkownika ani zachowania PAPER/LIVE lub produkcji. Pełne 011A pozostaje
`REVIEW`, 011 `OPEN`, wydanie `NO-GO`.
