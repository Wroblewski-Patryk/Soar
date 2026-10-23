# 011A — fence właściciela przy zapisie raw: plan przed kodem

Punkt odniesienia: `e0a2ef6911eae5351d04778b28d34585f6367b51`.
Niezależny odbiór poprzedniego testu dwóch PID uznał kolizję ZIP za
ograniczony PASS, lecz wskazał P1: `saveVerifiedRunArchive` może zapisać
źródło przez stary token po utracie lease. Test `SIGKILL` w poprzednim
wycinku ponawiał odczyt bez claimu, więc nie dowodził terminalnego
fence w tej kolizji.

## Zmiana

1. Przekazać token aktualnego claimu z `createClaimedBacktestRunJob` do
   funkcji archiwalnej. Odczyt istniejącego archiwum pozostaje dostępny
   offline; nowy zapis wymaga tokenu.
2. W tej samej transakcji co `BacktestIntrabarArchive` i oba raw wykonać
   warunkową aktualizację `BacktestRun` z `status=RUNNING`, tym tokenem i
   niewygasłym lease. Aktualizacja przedłuża lease i blokuje wiersz do
   końca transakcji. Zero trafień odmawia całego zapisu; konflikt
   identycznych bajtów pozostaje idempotentny tylko dla aktywnego
   właściciela. Żadna ścieżka produkcyjna nie zapisuje raw bez tokenu.
3. Zachować osobne terminalne `commitClaimedBacktestRun` z istniejącym
   fence oraz brak częściowego raportu, trades i PnL.

## Odbiór

- Na świeżej własnej PostgreSQL `_test` po migracji 85 i osobnym Redisie
  uruchomić procesowy test raw: dwa PID z ważnym tokenem ścigają się o
  identyczne oraz różne ZIP; stary token po ręcznie skróconym lease i
  nowym claimie nie może zapisać nawet poprawnego ZIP. Odczyt offline
  ponawia dokładnie zapis zwycięzcy.
- Osobny procesowy test prawdziwego BACKTEST zatrzyma pierwszego workera
  podczas pobierania archiwum, skróci lease tylko własnego runu,
  uruchomi drugiego workera i pozwoli mu zakończyć ten sam run. Potem
  zwolni starego workera. Sprawdzi odmowę jego zapisu, jeden snapshot
  z dwoma raw, jeden terminalny raport/trades/PnL i pustą kolejkę po ACK.
  Prawidłowy retry po `SIGKILL` wcześniej zapisanego źródła nadal nie
  pobiera ZIP ponownie.
- API typecheck, celowane testy, docs parity, guardrails i strict graf.
  Wynik z testu lokalnego nie zastępuje real LIVE ani produkcji. Pełne
  011A/011 `REVIEW`, `POSITION-CYCLE` `OPEN`, wydanie `NO-GO`.

Brak deploy, produkcyjnych zapisów, transakcji LIVE i resetu bazy.
Obcy nieśledzony katalog pozostaje bez zmian.
