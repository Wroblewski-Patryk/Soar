---
type: release_status
status: canonical
area: status
last_updated: 2026-10-20
---

# Soar — bieżący status wydania

Stan sprawdzony 2026-10-20 dla kodu bazowego
`0ce5e054006d6f68b4155ef9e08e16b0d3e4c2d4` (PR #2 jest szkicem;
commity tej tablicy zmieniają tylko dokumentację). Ten plik
jest bieżącym widokiem wydania i **jedyną kolejką otwartych usterek oraz luk
odbiorowych** dla tej wersji. Historyczne pakiety V1 i plany nie zmieniają
poniższej decyzji. [Kontrakt produktu](../product/current-version-contract.md)
określa wymagania, a [Definition of Done](../../DEFINITION_OF_DONE.md) — próg
ukończenia; żaden z nich sam nie stanowi dowodu wdrożenia.

## Decyzja i granice dowodu

**NO-GO dla wydania produkcyjnego, publicznych działań domenowych MCP,
produkcyjnego cutover i realnego LIVE.** Lokalny manifest gate
`2026-10-20t18-04-29-892z-d3d22a42` (`%LOCALAPPDATA%\Soar\local-ci\runs\<runId>\manifest.json`,
poza repo) zapisuje `PASS` dla 20/20 kroków i powyższego SHA; jego wynik
został niezależnie sprawdzony według przekazania do tego statusu. Manifest
oznacza `coverage.application=PARTIAL`: nie obejmuje budowy obrazów workerów,
ich uruchomienia ani rzeczywistej giełdy i produkcyjnych ścieżek użytkownika.
Gate nie był uruchamiany ponownie w tej zmianie dokumentacji. Dla
`SOAR-EXT-GRANT-001Z1` istnieje tylko dowód
autora; niezależny review zatrzymał filtr platformy. Nie jest to `PASS`.

| Warstwa | Stan dowodu dla bieżącej wersji |
| --- | --- |
| Decyzja właściciela | Web, panel administratora, API i zewnętrzny MCP; PAPER/LIVE na Binance i Gate.io; EN/PL, jedna aktywna grupa rynków bota, ręczny przydział planu i ról, brak płatności oraz wbudowanego AI i aplikacji mobilnej — [kontrakt](../product/current-version-contract.md). To wymaganie, nie wynik testu. |
| Kod i test lokalny | Manifest `2026-10-20t18-04-29-892z-d3d22a42`: gate 20/20 na powyższym SHA, `ciParity=PASS`, `application=PARTIAL`; wybrane testy modułów i kontrakty poniżej. Zakres lokalny, bez prawdziwego zlecenia giełdowego. |
| Wdrożenie | Brak świeżego dowodu, że ten SHA, migracje, API, Web i workery działają razem na docelowym środowisku. Publiczne health/ready nie potwierdzają wersji ani przetwarzania kolejek; obowiązują [bramki wdrożenia](../operations/deployment-readiness-gates.md). |
| Zalogowany użytkownik | Brak zamkniętej, aktualnej macierzy pełnych ścieżek zalogowanego użytkownika i administratora oraz odbioru produkcyjnego. Starsze obserwacje i indeksy nie zastępują takiego przejścia. |

## Ukończone prace z ograniczeniem dowodu

- Kontrakt bieżącej wersji rozstrzyga zakres, plan/role, utrzymanie pozycji po
  utracie sygnału wejścia i granice upoważnienia MCP. Lokalny kod i testy
  obejmują wybrane ścieżki web/admin/API, HOLD zamiast fałszywego EXIT oraz
  ręczny przydział planu; całościowy odbiór pozostaje otwarty.
- [BT-001/001b](../architecture/reference/backtest-recovery-contract.md) ma
  lokalny dowód dwóch workerów tej samej wersji, fencing i jednego trwałego
  wyniku. Starszy worker nie respektuje tokenu; wymaga zatrzymania przed
  uruchomieniem nowego i dowodu odzyskania na docelowym środowisku.
- [Granty zewnętrzne](../modules/api-externalClientGrants.md) mają lokalne
  ograniczenia, trwałą rezerwację i bezpieczną ścieżkę lookup. `001D3`
  pozostaje `disabled`; [MCP](../modules/mcp-grant-status.md) udostępnia
  wyłącznie lokalnie testowane odczyty statusu. Nie ma publicznego działania
  domenowego MCP ani uprawnienia do realnego wywołania giełdy.
- Lokalny kod weryfikuje tożsamość i wiązanie klucza dla niepewnego zlecenia
  LIVE zgodnie z [kontraktem intencji](../architecture/reference/live-order-intent-contract.md).
  Test z atrapą giełdy nie jest dowodem Binance/Gate.io ani produkcji.

## Blokery i kolejność

Blokują nas pozycje `001Z1`, `001D3/MCP`, `MCP-HOSTS`, `BT-PROD`,
`POSITION-CYCLE`, `OPS`, `ACCEPT` i `VENUE`
z jednej kolejki poniżej. Kolejność dalszych etapów, bez terminu i procentu:

1. Dokończyć niezależny przegląd `001Z1`, gdy filtr platformy pozwoli na zwykły
   review, oraz zaprojektować bezpieczny pełny permit i działanie domenowe MCP.
2. Po zmianach kodu wybrać jeden dokładny SHA, powtórzyć jego lokalny gate i
   przygotować zgodność migracji, obrazów, workerów oraz rollbacku.
3. Operator potwierdza obraz→SHA, zatrzymanie starych konsumentów i chronione
   bramki; dopiero potem wykonuje kontrolowane wdrożenie i świeży readback.
4. Przejść ścieżki zalogowanego użytkownika/admina i hostów MCP, odzyskanie
   backtestu oraz cykl pozycji BACKTEST/PAPER na wdrożonym SHA; sprawdzić macierz
   `(exchange, marketType, operation)`.
5. Po osobnym przygotowaniu i zgodzie właściciela wykonać ograniczony scenariusz
   LIVE z odczytem giełdy, stanu Soar i audytu. Na końcu zapisać nowe GO/NO-GO.

## Jedna kolejka otwartych usterek i luk odbiorowych

`OPEN` znaczy brak wymaganego dowodu; nie przesądza o błędzie w kodzie.
Identyfikatory statusowe są lokalne dla tej kolejki, a wskazane identyfikatory
implementacyjne zachowują swoje odrębne kontrakty. Pozycję zamyka tylko
aktualny test odbioru na właściwym SHA i środowisku.

| ID | Wymaganie | Odtworzenie / sprawdzenie | Dowód obecny | Priorytet | Właściciel roli | Stan | Test odbioru |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SOAR-EXT-GRANT-001Z1` | Mutacja wybranego klucza nie może ominąć claim ani rozpocząć drugiego submit. | Zmienić/rotować klucz między bind i claim w izolowanym teście; sprawdzić brak startu transportu. | [Opis i lokalny dowód autora](../modules/api-externalClientGrants.md); niezależny review zatrzymany przez filtr platformy. | P1 | API/security reviewer | `REVIEW_BLOCKED`, nie `PASS` | Zwykły niezależny review i powtarzalny lokalny test dokładnego SHA; bez obchodzenia filtra. |
| `SOAR-EXT-GRANT-001D3/MCP` | Limitowany grant ma umożliwić tylko autoryzowane działanie domenowe LIVE, z bezpiecznym końcem wywołania. | Wywołać obecny wewnętrzny callback: zwraca `DELEGATED_SUBMIT_PERMIT_DISABLED`; brak publicznej komendy domenowej MCP. | [Kontrakt grantów](../modules/api-externalClientGrants.md) i [status MCP](../modules/mcp-grant-status.md). | P0 | API/MCP | `BLOCKED`, seam disabled | Niezależny test pełnego permit, deadline/ustania transportu, limitów, ryzyka, audytu i lookup-only retry; osobny odbiór realnego LIVE. |
| `MCP-HOSTS` | Narzędzia MCP mają działać w rzeczywistych hostach Codex i Claude w granicach nadanych grantów. | W obu hostach skonfigurować bezpiecznie odrębne granty, wywołać odczyty statusu i sprawdzić odmowy dla cofniętego, wygasłego oraz nieodpowiedniego grantu. | [Test lokalnego stdio](../modules/mcp-grant-status.md) używa syntetycznego HTTP; brak dowodu integracji z hostami. | P1 | MCP/integracja + QA | `OPEN` | Odtwarzalny przebieg w Codex i Claude z poprawnym zakresem, odmową i bez sekretu w argumencie, odpowiedzi lub logu; osobna akceptacja przyszłych działań domenowych. |
| `BT-PROD` | Niedokończony backtest ma wznowić się automatycznie bez duplikatu. | Na docelowym środowisku przerwać workera przy istniejącym run, uruchomić nowego, porównać run, kolejkę, trades i raport. | [Lokalny test dwóch workerów](../architecture/reference/backtest-recovery-contract.md); brak produkcyjnego readbacku po migracji/restarcie. | P0 | Runtime/Ops | `OPEN` | Jedna tożsamość run i jeden trwały wynik po awarii, prawdziwy status UI; stare workery zatrzymane przed startem nowych. |
| `POSITION-CYCLE` | Utrata wejścia to HOLD; ujemne DCA chroni SL/TSL, dodatnie DCA chroni TP/TTP, a niewykonalne osiągnięte ujemne DCA pozwala zamknąć przez przekroczony SL. | Otworzyć pozycję, usunąć sygnał wejścia, przejść dodatnie i ujemne DCA oraz osobno progi TP/SL/TTP/TSL w BACKTEST/PAPER/LIVE; dla PAPER sprawdzić trwałość po odczycie, a dla mock LIVE pełny cykl zlecenia i fillu. | [Kontrakt produktu](../product/current-version-contract.md), [parytet sygnału](../architecture/reference/strategy-evaluation-parity-contract.md) i [macierz cyklu](../architecture/reference/position-lifecycle-parity-matrix.md); lokalny pakiet PAPER 8 plików / 63 testy przeszedł po izolacji fixture. Nie ma pełnego odbioru BACKTEST, mock LIVE ani produkcji. | P0 | Runtime + QA | `OPEN` | Brak fałszywego EXIT, poprawny DCA-first i raport braku środków przy SL; osobne trwałe cykle BACKTEST/PAPER i mock LIVE z jednym właściwym powodem TP/SL/TTP/TSL, odczytem stanu po restarcie oraz parytetem trybów. Realny LIVE wymaga osobnego uzgodnienia i dowodu giełdy. |
| `SOAR-QA-POSITION-ISOLATION-001` | Testy cyklu PAPER muszą usuwać wpływ własnych aktywnych botów na kolejne scenariusze, także gdy test przerwie asercja. | Uruchomić pakiet pięciu testów runtime PAPER oraz trzech testów DCA/pozycji w jednej sesji Vitest, potem powtórzyć na tej samej izolowanej bazie `_test`; sprawdzić aktywne boty i ich otwarte pozycje w bazie. | Niezależny odbiór lokalny dokładnego SHA `696763e7d3a430f431650ee6680ab828f99c5569`: pierwotny pakiet 8 plików / 63 testy przeszedł jako część rozszerzonego pakietu 9 plików / 64 testy, uruchomionego dwukrotnie na świeżej `_test` i własnym Redisie (64/64 oba razy); SQL po drugim przebiegu wykazał 0 aktywnych botów i 0 ich otwartych pozycji. Nowy test nie zmienia pierwotnych ośmiu plików. | P1 | Runtime test + QA | `PASS` (niezależny odbiór lokalny) | Odbiór izolacji fixture zamknięty lokalnie dla `696763e7d3a430f431650ee6680ab828f99c5569`; bez przenoszenia PASS na cykl produktu, LIVE lub produkcję. |
| `SOAR-POSITION-CYCLE-006` | W PAPER osiągnięte dodatnie DCA musi wykonać się przed TTP na tym samym ticku; późniejszy prawidłowy TTP zamyka pozycję dokładnie raz. | Otworzyć pozycję, sprawdzić HOLD po zaniku wejścia, uzbroić TTP, wstrzymać bota, włączyć dodatnie DCA przez API strategii, wznowić bota i podać cenę jednocześnie przekraczającą próg DCA oraz ochronę TTP; po fillu podać późniejszy tick TTP i odtworzyć serwis. | Niezależny odbiór lokalny dokładnego SHA `fe6eca48643b18c62eba2a3338c6446bceee66a5`: [trwały test PAPER](../../apps/api/src/modules/engine/runtimePaperAdvancedTtpPositiveDcaGuard.e2e.test.ts) na izolowanej `_test` i własnym Redisie; pakiet 10 plików / 65 testów przeszedł dwukrotnie przed dodaniem ostatniej asercji PnL, którą sprawdzono następnie osobno 1/1. SQL: 0 aktywnych botów i 0 ich otwartych pozycji. Zakres: DCA włączono po uzbrojeniu TTP. | P0 | Runtime + QA | `PASS` (niezależny odbiór lokalny) | Odbiór lokalny 006 zamknięty dla `fe6eca48643b18c62eba2a3338c6446bceee66a5`; bez przenoszenia PASS na BACKTEST, LIVE ani produkcyjny `POSITION-CYCLE`. |
| `SOAR-POSITION-CYCLE-007` | BACKTEST musi trwale rozróżniać SL/TP od sygnału EXIT po HOLD i dwóch basic DCA o wkładach 1, 2 i 6 USDT, bez duplikatu runu, trade i raportu po ponownym uruchomieniu. | Na izolowanej `_test` uruchomić prawdziwy `createClaimedBacktestRunJob` z 100 syntetycznymi świecami: początek `0.99, 1, 1, 0.6949, 0.5375, 0.5375, 0.47`, dalej płasko; `MOMENTUM > 0`, legacy `noMatchAction=EXIT`, basic `sl=20`, DCA `times=2`, próg `-30.5`, mnożnik `2`, `usdt_contribution_v1`, saldo 10 i ryzyko 10%. Wywołać ten sam job ponownie i odczytać run, trade, report. | Pierwotna reprodukcja wykazała fałszywy trwały `SIGNAL_EXIT` przy raporcie `SL=1`; poprawka 007A obejmuje powód SL/TP. Nadal brak trwałego rozbicia dodatków DCA na 2 i 6 USDT: istnieje agregat 9 USDT i licznik `DCA=2`, co wydzielono do 007B. | P0 | Strategie/backtest + QA | `BLOCKED` (007B i pełny odbiór) | Po 007A i 007B na świeżej `_test` potwierdzić HOLD bez EXIT, trwałe wkłady 1/2/6, właściwy `SL`/`TP` w trade i raporcie, ten sam run i brak duplikatu trade/report po wznowieniu; osobno produkcyjny readback. |
| `SOAR-POSITION-CYCLE-007A` | Trwały `BacktestTrade.exitReason` ma odróżniać podstawowy `SL` i `TP` od historycznego `SIGNAL_EXIT`, `FINAL_CANDLE` i `LIQUIDATION` w replay pojedynczego symbolu oraz portfela. | W obu ścieżkach wykonać próg SL i TP; na świeżej `_test` oraz po migracji istniejącej `_test` odczytać trade i raport, ponowić job dla tego samego runu i sprawdzić zachowanie wcześniej zapisanego `SIGNAL_EXIT`. | [Test trwały](../../apps/api/src/modules/backtests/backtestExitReasonPersistence.e2e.test.ts) potwierdza SL po HOLD i dwóch DCA, osobny TP, po jednym trade/report po ponownej inicjalizacji jobu oraz odczyt `SIGNAL_EXIT`. Nowa forward migration rozszerza enum bez zmiany starych rekordów. W testach replay/portfolio SL i TP zachowują własne powody; etykiety odczytu web pokazują `SL` i `TP`. | P0 | Strategie/backtest + QA | `LOCAL_PASS`, `REVIEW_OPEN` | Niezależnie odtworzyć na dokładnym SHA świeżą i aktualizowaną `_test`, potwierdzić powody SL/TP w obu replay, trwałym trade i odczycie web, brak duplikatów oraz niezmienione historyczne powody; wynik nie zamyka 007 ani produkcji. |
| `SOAR-POSITION-CYCLE-007B` | Kwoty kolejnych basic DCA w BACKTEST muszą być trwałe i audytowalne osobno, z progiem, mnożnikiem, ceną i wkładem USDT każdej potwierdzonej dokładki. | Dla syntetycznego cyklu 007 odczytać po zakończeniu i po ponownym uruchomieniu runu osobne dowody wejścia 1 USDT oraz DCA 2 i 6 USDT; uzgodnić je z pozycją, wynikiem i raportem. | Aktualny `BacktestTrade` zawiera wyłącznie zagregowane wejście 9 USDT, a `BacktestReport.metrics.lifecycleEventCounts` wyłącznie `DCA=2`; brak trwałych rekordów wkładów 2 i 6 USDT. | P0 | Strategie/backtest + QA | `OPEN` | Zapisać osobne potwierdzone DCA bez duplikatu przy recovery; na świeżej `_test` i po restarcie odczytać dokładne 1/2/6 USDT, poziomy i ceny oraz zgodność sumy 9 USDT z trade/report. Bez produkcyjnych zapisów. |
| `OPS` | Jeden sprawdzony SHA i bezpieczne API/Web/workery na produkcji. | Odczytać dokładne obrazy, migracje, procesy, kolejki, limity zasobów, uprawnienia i chronione bramki po kontrolowanym wdrożeniu. | [Bramki](../operations/deployment-readiness-gates.md) i [procedura cutover](../operations/coolify-linux-vps-setup-guide.md); brak świeżego chronionego readbacku dla tego SHA. | P0 | Operator/Ops | `BLOCKED` | Niezależne związanie obrazu z SHA, zgodność workerów i konfiguracji, świeży G1–G7/readback, bezpieczny rollback i stabilność po obciążeniu. |
| `ACCEPT` | Pełne ścieżki web, admin, API, planów/ról, EN/PL i jednej aktywnej grupy. | Przejść akcje z [indeksu użytkownika](./user-action-index.md) i [indeksu ścieżek](./function-journey-index.md) jako zalogowany użytkownik i administrator, także błędy i ponowne wejście. | Wybrane testy lokalne; brak aktualnej macierzy odbioru na wydanym SHA. | P1 | QA + Web/Admin | `OPEN` | Dla każdej wymaganej ścieżki zapis PASS/FAIL, konto/rola, SHA, środowisko, wynik po odświeżeniu i potwierdzenie odbioru. |
| `VENUE` | PAPER i LIVE na Binance/Gate.io tylko dla potwierdzonych operacji i typów rynku. | Porównać każdą deklarowaną trójkę z [macierzą giełd](../architecture/reference/exchange-access-ownership-matrix.md), potem przejść odpowiedni scenariusz i odczytać giełdę/Soar/audyt. | Kontrakty i testy lokalne; brak świeżego dowodu realnego LIVE dla bieżącego SHA. | P0 | API/exchange + właściciel LIVE | `BLOCKED` | Środowiskowy PAPER i osobno uzgodniony, limitowany LIVE bez duplikatu, z potwierdzoną tożsamością zlecenia i zamknięciem. |

Aktualizacja: po każdej zmianie kodu, wdrożenia lub dowodu zmień SHA, odpowiedni
wiersz i decyzję; nie przenoś automatycznie `PASS` z lokalnego testu na produkcję.
