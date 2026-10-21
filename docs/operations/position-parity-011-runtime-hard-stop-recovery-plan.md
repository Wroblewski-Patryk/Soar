# 011: twarde przerwanie lokalnego runtime po DCA — plan przed próbą

Plan zamrożony na bazowym SHA `376801e0bcfe4f760d8770b84fcc9c0647d9305e`.
Nie zmieniamy osobnego kontraktu MOMENTUM `period=1`.

## Źródło i strategia

Ta sama zapisana strategia z poprawionego [świadka 011](position-parity-011-effective-momentum-signal-loss-plan.md):
`MOMENTUM(2)<-0,00015000000000001124`, LONG na finalnej świecy 2,
rzeczywisty zanik sygnału od świecy 3 i HOLD bez EXIT. Publiczny Binance
USD-M `ALICEUSDT` `aggTrades` 2026-10-18 02:41–04:21 UTC, 100 świec 1m,
ZIP SHA-256 `4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`,
`.CHECKSUM`, niezależne klines i digest
`506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8`.
DCA na źródłowym `a=167049972` o 02:46:47.639 UTC, następnie uzbrojenie
TTP na `a=167049975` i TTP na `a=167049977` o 02:46:57.282 UTC.
Konfiguracja DCA/TTP, syntetyczne reguły venue, opłata i saldo pozostają
jak w poprzednim lokalnym teście trzech trybów.

## Granica awarii i tożsamość procesu

Nowy opt-in etap orkiestratora uruchomi własny proces Node/Vitest z
`--pool=threads --maxWorkers=1`, aby kod testowy i runtime wykonały się
w PID uruchomionego procesu. Etap `crash-open` przejdzie zwykły zapis
strategii, BACKTEST oraz PAPER/internal mock LIVE, po czym poda wszystkie
źródłowe ticki przez `a=167049972`. Dopiero gdy oba DCA są trwałe (po jednym
trade i order, poziom DCA, pozycje OPEN, brak EXIT), wyemituje marker z ID
pozycji, przebiegu, botów, ID DCA i własnym PID, a następnie będzie czekał.
Marker nie jest samym dowodem DCA: orkiestrator po nim odczyta stan trwały.

Orkiestrator porówna PID z markera z `spawn.pid`. Przy różnicy nie zabije
niezidentyfikowanego procesu i zapisze FAIL. Przy zgodności użyje wyłącznie
`child.kill('SIGKILL')` na tym własnym PID, poczeka na jego faktyczne wyjście,
a potem odczyta nadal otwarte pozycje oraz pojedyncze DCA z izolowanej bazy.
Na Windows `SIGKILL` przez Node jest żądaniem twardego zakończenia procesu;
próba musi dodatkowo wykazać, że po wyjściu nie wykonał się `finally` z
czyszczeniem rekordu użytkownika. Jeśli tej granicy nie da się spełnić,
wynik jest FAIL, bez zastępowania jej zwykłym graceful restartem.

## Wznowienie i odbiór

Po potwierdzonym przerwaniu orkiestrator uruchomi nowy PID `resume`, który
odczyta ten sam zapisany archiwum offline z bazy, odzyska trwały licznik DCA
i poda tylko ticki po `a=167049972` do `a=167049977`. Nie wolno ponawiać
DCA. Odbiór wymaga arm dokładnie `167049975`, jednego TTP dokładnie
`167049977`, jednego OPEN/DCA/CLOSE na pozycję, trzech orders na tryb,
trzech unikalnych intencji i filli mock LIVE, jednego dedupe DCA, zero EXIT,
zgodnych trwałych wkładów, ilości, średniej, opłat i PnL. Powtórzenie ticku
zamknięcia nie może dodać zlecenia. BACKTEST ma pozostać COMPLETED z jednym
raportem, sześcioma trades i net PnL około `+0,01386` USDT; retry joba bez
duplikatu. Pierwszy cykl runtime ma trwały net PnL około
`-0,02231404958610045` USDT w obu trybach.

Własna nowa PostgreSQL `_test` i osobny Redis są obowiązkowe; test nie może
łączyć się z portami zwykłego lokalnego stacka ani produkcją. Każde
przerwanie poza własnym PID i każdy stan niepewny przerywa odbiór. Cleanup
dotyczy tylko zasobów utworzonych dla tej próby. Nowy proces jest uruchamiany
przez test, więc dowód obejmuje trwałe odtworzenie po twardym przerwaniu,
nie automatyczny nadzór procesu w produkcji. Internal mock LIVE używa
syntetycznych filli i reguł; nie dowodzi prawdziwego Binance ani wydania.
Pełne 011/011A pozostają REVIEW, release NO-GO do niezależnego odbioru.
