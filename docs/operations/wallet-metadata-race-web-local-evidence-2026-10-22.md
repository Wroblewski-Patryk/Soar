# Portfel Web: zapis podczas zmiany giełdy — lokalny dowód

- Ticket: `SOAR-QA-WEB-WALLET-METADATA-RACE-001`.
- Punkt wyjścia: `23ec619abdf8beb882d48a5cab5761c02ae78370`.
- Commit poprawki: `a0ea42f525cebf0cf5be5d5a34359e7f71a0658a`; tree `94ba10fbbbb37cf52934285a166f93bce3e09b1f`.
- Zakres: wyłącznie formularz tworzenia/edycji portfela Web i jego dwa widoczne przyciski zapisu. Bez zmian API, bazy, konfiguracji giełd i runtime.

## Odtworzenie i poprawka

Przy portfelu PAPER ustawiono walutę `USDC` dla Binance, przełączono giełdę na Gate.io i zatrzymano odpowiedź katalogu metadanych. Przed poprawką test wysłał `createWallet` z `exchange=GATEIO` oraz poprzednią walutą `baseCurrency=USDC`, mimo że lista walut była wyłączona i pokazywała ładowanie. Dla tego wariantu katalog Gate.io zwracał tylko `USDT`. Test celowany przed poprawką: 10 PASS, 1 FAIL na nowej asercji, która wymagała braku zapisu podczas oczekiwania.

Formularz blokuje teraz submit w czasie pobierania metadanych, a oba widoczne przyciski zapisu są wyłączone. Zmiana giełdy włącza blokadę bez czekania na efekt pobierania. Po odpowiedzi formularz używa waluty z metadanych wybranej giełdy i pozwala zapisać; po błędzie katalogu nadal pokazuje komunikat i dostępne opcje domyślne. Formularz oznacza stan ładowania przez `aria-busy`; komunikat ładowania ma `role="status"`, a błąd `role="alert"`.

## Weryfikacja lokalna

| Sprawdzenie | Wynik | Granica |
| --- | --- | --- |
| `pnpm --filter web test --run src/features/wallets/components/WalletCreateEditForm.test.tsx` | 12/12 PASS po poprawce; test obejmuje brak zapisu podczas opóźnienia, poprawny payload po odpowiedzi oraz oba przyciski zapisu. | Test komponentu z mockiem metadanych, bez przeglądarki i API. |
| `pnpm --filter web test --run` | 161 plików, 614/614 PASS. | Pakiet Web, bez pełnej ścieżki użytkownika. |
| `pnpm --filter web typecheck` i `git diff --check` | PASS. | Kontrola statyczna. |

Nie uruchomiono API, Web dev server, Dockera ani testów bazodanowych; lokalnych danych nie zmieniono. Porty `3101` i `3002` nie miały listenerów. Wpis `ACCEPT` w rejestrze odbioru odnotowuje wcześniejsze automatyczne `blocked by policy` dla startu lokalnych API/Web i nakazuje nie ponawiać ani nie obchodzić tej blokady. Dlatego brak zalogowanej sesji, zrzutów ekranu i ręcznego wyniku PASS/FAIL dla nowej poprawki. Produkcja i rzeczywisty LIVE nie były sprawdzane.

## Otwarty odbiór

Po dopuszczonym uruchomieniu izolowanych API/Web i zalogowaniu na testowe konto przejść tworzenie oraz edycję portfela PAPER dla Binance i Gate.io. Wymusić opóźnioną oraz błędną odpowiedź katalogu, sprawdzić blokadę rynku, waluty i obu akcji zapisu, komunikat błędu, opcje domyślne, poprawny payload po odpowiedzi i stan po odświeżeniu. Powtórzyć przełączenie na COINBASE jako regresję oraz EN/PL przy wąskim i szerokim widoku. Formularz LIVE sprawdzić bez zapisu produkcyjnego i bez transakcji LIVE. Wynik udokumentować osobno dla przeglądarki; obecny lokalny test nie zamyka ścieżki ani bramki wydania.
