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

## Wynik próby 2026-10-21 (lokalny, izolowany)

Plan powyżej został wypchnięty przed implementacją testu w SHA
`06768e36e403104f7843e8f00ab792503baf1f2e`. Opt-in test
`runtime011RealSourceThreeMode.e2e.test.ts` przeszedł na własnym PostgreSQL
`soar_position_parity_011_test` pod `127.0.0.1:5577` i Redisie pod
`127.0.0.1:6417`, po 84 migracjach. Nie korzystał ze zwykłych portów stacka.

Etap `crash-open` potwierdził po jednym trwałym DCA i dwóch orders dla każdej
otwartej pozycji przed przerwaniem. Marker PID był zgodny z `spawn.pid`.
`child.kill('SIGKILL')` zakończył własny PID `12108`; Node na Windows zwrócił
`code=null`, `signal=SIGKILL`. Po wyjściu nadal istniał użytkownik i obie
pozycje OPEN z pojedynczym DCA oraz stanem poziomu `[0]` w Redisie, co
wykluczyło wykonanie bloku `finally` procesu. Nowy PID `191948` odczytał
zapisane archiwum bez sieci i doprowadził obie pozycje do TTP: źródłowe
`a=167049972` DCA, `a=167049975` arm, `a=167049977` close. Ponowienie ticku
close nie dodało zlecenia. Każda pozycja miała jeden OPEN/DCA/CLOSE, trzy
orders i jeden dedupe DCA; mock LIVE miał trzy unikalne intents i trzy fills.
Oba boty miały jeden LONG i zero EXIT. PAPER i mock LIVE miały po
`1376,46314337` jednostek, średnią `0,145299931176875`, sumę opłat
`0,1600550964180656` USDT i net PnL `-0,02231404958610045` USDT.
BACKTEST pozostał COMPLETED z sześcioma trades, jednym raportem i net PnL
`+0,01386` USDT. Osobny pełny przebieg 011 na tym samym świadku przeszedł
z decyzjami `[LONG,null,null]`, porównał wkłady i fee oraz powtórzył job
BACKTEST bez zmiany przebiegu, trades i raportu.

Wynik: `1 passed / 2 skipped` dla testu twardego przerwania i osobno
`1 passed / 2 skipped` dla pełnego testu sygnału; API typecheck,
repo guardrails i strict graph drift przeszły. Po cleanup izolowana baza miała
zero User, BacktestRun, Position, Order, LiveOrderIntent i OrderFill, a Redis
zero kluczy. Pierwsze dwa uruchomienia testu awarii zatrzymały się na odczycie
stanu przez tryb testowy, który trzyma go wyłącznie w pamięci procesu;
orkiestrator został poprawiony tak, by odczytywać wspólny Redis jak runtime.
Nie zmieniono danych źródłowych ani strategii.

Ten PASS dowodzi lokalnej trwałości i odtworzenia przez nowy proces testowy.
Nie dowodzi automatycznego uruchomienia procesu przez supervisor ani
rzeczywistej giełdy; niezależny odbiór 011/011A pozostaje REVIEW/NO-GO.
