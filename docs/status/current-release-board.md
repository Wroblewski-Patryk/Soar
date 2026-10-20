---
type: release_status
status: canonical
area: status
last_updated: 2026-10-20
---

# Soar — bieżący status wydania

Stan sprawdzony 2026-10-20 dla kodu `0ce5e054006d6f68b4155ef9e08e16b0d3e4c2d4`
(HEAD i upstream przed commitem tego statusu; PR #2 jest szkicem). Ten plik
jest bieżącym widokiem wydania i **jedyną kolejką otwartych usterek oraz luk
odbiorowych** dla tej wersji. Historyczne pakiety V1 i plany nie zmieniają
poniższej decyzji. [Kontrakt produktu](../product/current-version-contract.md)
określa wymagania, a [Definition of Done](../../DEFINITION_OF_DONE.md) — próg
ukończenia; żaden z nich sam nie stanowi dowodu wdrożenia.

## Decyzja i granice dowodu

**NO-GO dla wydania produkcyjnego, publicznych działań domenowych MCP,
produkcyjnego cutover i realnego LIVE.** Lokalny gate 20/20 dla wskazanego SHA
został niezależnie potwierdzony w przekazaniu do tego statusu. Nie uruchamiano
go ponownie w tej zmianie dokumentacji. Oznacza lokalną poprawność kandydata,
nie akceptację całego produktu. Dla `SOAR-EXT-GRANT-001Z1` istnieje tylko dowód
autora; niezależny review zatrzymał filtr platformy. Nie jest to `PASS`.

| Warstwa | Stan dowodu dla bieżącej wersji |
| --- | --- |
| Decyzja właściciela | Web, panel administratora, API i zewnętrzny MCP; PAPER/LIVE na Binance i Gate.io; EN/PL, jedna aktywna grupa rynków bota, ręczny przydział planu i ról, brak płatności oraz wbudowanego AI i aplikacji mobilnej — [kontrakt](../product/current-version-contract.md). To wymaganie, nie wynik testu. |
| Kod i test lokalny | Gate 20/20 na powyższym SHA; wybrane testy modułów i kontrakty poniżej. Zakres lokalny, bez prawdziwego zlecenia giełdowego. |
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

Blokują nas pozycje `001Z1`, `001D3/MCP`, `BT-PROD`, `OPS`, `ACCEPT` i `VENUE`
z jednej kolejki poniżej. Kolejność dalszych etapów, bez terminu i procentu:

1. Dokończyć niezależny przegląd `001Z1`, gdy filtr platformy pozwoli na zwykły
   review, oraz zaprojektować bezpieczny pełny permit i działanie domenowe MCP.
2. Po zmianach kodu wybrać jeden dokładny SHA, powtórzyć jego lokalny gate i
   przygotować zgodność migracji, obrazów, workerów oraz rollbacku.
3. Operator potwierdza obraz→SHA, zatrzymanie starych konsumentów i chronione
   bramki; dopiero potem wykonuje kontrolowane wdrożenie i świeży readback.
4. Przejść ścieżki zalogowanego użytkownika/admina, odzyskanie backtestu i PAPER
   na wdrożonym SHA; sprawdzić macierz `(exchange, marketType, operation)`.
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
| `BT-PROD` | Niedokończony backtest ma wznowić się automatycznie bez duplikatu. | Na docelowym środowisku przerwać workera przy istniejącym run, uruchomić nowego, porównać run, kolejkę, trades i raport. | [Lokalny test dwóch workerów](../architecture/reference/backtest-recovery-contract.md); brak produkcyjnego readbacku po migracji/restarcie. | P0 | Runtime/Ops | `OPEN` | Jedna tożsamość run i jeden trwały wynik po awarii, prawdziwy status UI; stare workery zatrzymane przed startem nowych. |
| `OPS` | Jeden sprawdzony SHA i bezpieczne API/Web/workery na produkcji. | Odczytać dokładne obrazy, migracje, procesy, kolejki, limity zasobów, uprawnienia i chronione bramki po kontrolowanym wdrożeniu. | [Bramki](../operations/deployment-readiness-gates.md) i [procedura cutover](../operations/coolify-linux-vps-setup-guide.md); audyt z 17 października odnotował brak pobierania kolejki i awarię pamięci, lecz bieżący stan wymaga nowego odczytu. | P0 | Operator/Ops | `BLOCKED` | Niezależne związanie obrazu z SHA, zgodność workerów i konfiguracji, świeży G1–G7/readback, bezpieczny rollback i stabilność po obciążeniu. |
| `ACCEPT` | Pełne ścieżki web, admin, API, planów/ról, EN/PL i jednej aktywnej grupy. | Przejść akcje z [indeksu użytkownika](./user-action-index.md) i [indeksu ścieżek](./function-journey-index.md) jako zalogowany użytkownik i administrator, także błędy i ponowne wejście. | Wybrane testy lokalne; brak aktualnej macierzy odbioru na wydanym SHA. | P1 | QA + Web/Admin | `OPEN` | Dla każdej wymaganej ścieżki zapis PASS/FAIL, konto/rola, SHA, środowisko, wynik po odświeżeniu i potwierdzenie odbioru. |
| `VENUE` | PAPER i LIVE na Binance/Gate.io tylko dla potwierdzonych operacji i typów rynku. | Porównać każdą deklarowaną trójkę z [macierzą giełd](../architecture/reference/exchange-access-ownership-matrix.md), potem przejść odpowiedni scenariusz i odczytać giełdę/Soar/audyt. | Kontrakty i testy lokalne; brak świeżego dowodu realnego LIVE dla bieżącego SHA. | P0 | API/exchange + właściciel LIVE | `BLOCKED` | Środowiskowy PAPER i osobno uzgodniony, limitowany LIVE bez duplikatu, z potwierdzoną tożsamością zlecenia i zamknięciem. |

Aktualizacja: po każdej zmianie kodu, wdrożenia lub dowodu zmień SHA, odpowiedni
wiersz i decyzję; nie przenoś automatycznie `PASS` z lokalnego testu na produkcję.
