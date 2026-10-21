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

## Plan przed próbą nadzorowanego restartu (2026-10-21)

Projektowy mechanizm nadzoru to `restart: unless-stopped` dla
`workers-execution` w `docker-compose.coolify.yml` i `docker-compose.vps.yml`.
`scripts/start-workers-prod.mjs` kończy własny proces po awarii dziecka;
sam nie uruchamia go ponownie. Dlatego nowy opt-in dowód użyje izolowanego
projektu Docker Compose z tą samą polityką restartu i procesem świadectwa 011
zawierającym zwykły runtime PAPER oraz internal mock LIVE. Testowy proces nie
jest produkcyjnym `execution.worker.js`; wynik trzeba tak właśnie opisać.

Projekt Compose ma mieć własną nazwę, sieć, PostgreSQL z bazą
`soar_position_parity_011_test`, Redis i wolumeny, bez publikowania portów
oraz bez połączenia ze zwykłym stosem Soar. Obraz testowy powstaje z etapu
`build` istniejącego Dockerfile API i zawiera test Vitest; żaden obraz nie
zostanie wdrożony. Jedyny restartowany serwis wykonuje ten sam testowy
entrypoint przy każdym starcie. Wybór pierwszego przebiegu lub odzyskania
następuje automatycznie z markera w **tym izolowanym Redisie**; host nie
uruchamia procesu `resume`.

Pierwszy przebieg ma zapisać jedną strategię i źródło, dojść do źródłowego
`a=167049972`, wykazać trwałe pojedyncze DCA w obu trybach i dopiero wtedy
opublikować marker. Orkiestrator ma zweryfikować własność kontenera po nazwie
projektu/serwisu, stan bazy i PID, po czym `SIGKILL` dotknie wyłącznie
procesu świadectwa wewnątrz tego kontenera. Bootstrap zakończy się błędem,
a Compose ma wznowić usługę. Odbiór wymaga wzrostu `RestartCount`, nowego PID
hosta kontenera oraz automatycznego
odczytu tego samego markera, strategii i archiwum. Proces po restarcie poda
ponownie tick DCA, następnie `a=167049975` (arm) i `a=167049977` (jedno TTP).
Drugi submit DCA lub CLOSE jest błędem.

Po restarcie porównać trwałe ID pozycji, botów, runu, DCA, intencji i filli,
wkłady, ilości, średnią, opłaty, PnL, jedną intencję i fill na każde z trzech
zleceń mock LIVE oraz brak EXIT. Zgodność z wcześniej zamrożonym świadkiem jest
wymagana. BACKTEST może służyć jako odniesienie w bazie, lecz automatyczne
odzyskanie jego kolejki pozostaje odrębną otwartą bramką. Real Binance LIVE,
produkcyjny obraz workera, Coolify i mixed-version restart pozostają poza
zakresem dowodu.

Po zebraniu wyniku wolno usunąć tylko zasoby utworzone pod dokładną nazwą tego
projektu Compose. Przy braku możliwości uruchomienia tego supervisora lub
niepewnej własności procesu próba kończy się blockerem, bez ręcznego
`resume` i bez zastępczego PASS.

## Wynik nadzorowanej próby lokalnej

Uruchomienie opt-in: z katalogu repo ustawić `RUN_011_SUPERVISED_PROOF=1` i
wykonać `node scripts/run011-supervised-proof.mjs`. Skrypt sam losuje nazwę
projektu Compose i testowy sekret JWT, buduje etap `build`, wdraża migracje
wyłącznie do `soar_position_parity_011_test`, identyfikuje swój kontener po
etykietach i po zakończeniu usuwa tylko własny projekt, wolumeny oraz obraz.
Żadna usługa tej próby nie publikuje portu hosta.

Trzeci przebieg testowy zakończył się `PUBLIC_011_SUPERVISOR_PROOF` dla
projektu `soar011e464ab8c3329`. Przed sygnałem baza zawierała dwie pozycje
OPEN, dwa DCA, cztery orders, dwie intencje i dwa fille mock LIVE, jeden
COMPLETED BACKTEST, jeden raport i sześć backtest trades. Marker miał
`a=167049972` oraz dokładne ID dwóch DCA trades, czterech orders, dwóch
intencji i dwóch filli. SIGKILL objął tylko jego proces Vitest PID 18;
Compose zwiększył `RestartCount` z 0 do 1, a PID hosta kontenera zmienił się
z 26738 na 27265. Nowy start sam wybrał odzyskanie z Redis, odczytał tę samą
strategię i archiwum o digest
`506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8`.
Nie było wywołania ręcznego etapu `resume` przez hosta.

Powtórzony źródłowy tick DCA nie dodał trade ani order. `a=167049975`
uzbroił TTP, `a=167049977` zamknął obie pozycje raz; ponowienie ticku CLOSE
również niczego nie dodało. Po odzyskaniu baza miała zero OPEN, dwie CLOSED,
nadal dwa DCA, sześć orders, trzy unikalne intencje i trzy fille mock LIVE,
zero EXIT, nadal jeden BACKTEST run i raport oraz sześć backtest trades.
Test potwierdził zachowanie wszystkich ID zapisanych przed awarią. PAPER
i mock LIVE osiągnęły po `-0,02231404958610045` USDT PnL i po
`0,1600550964180656` USDT opłat; BACKTEST miał `+0,01386` USDT net PnL.
Własne kontenery, wolumeny i obraz zostały po odczycie usunięte; obcych
zasobów nie dotknięto.

Pierwsza próba ujawniła, że `kill -9 1` wykonane wewnątrz kontenera nie
zatrzymało PID 1, więc nie wystąpił restart; wynik pozostał FAIL. Druga
zatrzymała się na nadmiernie restrykcyjnym rozpoznaniu nazwy procesu przed
SIGKILL. Izolowana próba kontrolna potwierdziła, że przerwanie procesu
potomnego, po którym PID 1 kończy się błędem, uruchamia politykę Compose.
Finalny przebieg stosował tę granicę i sprawdził własność PID przez marker
procesu oraz istnienie tego PID w zweryfikowanym kontenerze.

PASS dotyczy lokalnego procesu świadectwa 011 pod taką samą polityką
Compose `restart: unless-stopped` jak `workers-execution`. Nie dowodzi
uruchomienia produkcyjnego `execution.worker.js`, realnego Binance LIVE,
Coolify, mixed-version ani automatycznego odzyskania kolejki BACKTEST.
Te bramki i niezależny odbiór exact SHA pozostają otwarte.
