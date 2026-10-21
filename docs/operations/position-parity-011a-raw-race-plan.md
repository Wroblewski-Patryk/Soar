# 011A — kolizja równoległych zapisów raw v3: plan przed testem

Baza kodu: `818be4ca72c808980a70822c8ef5db074db0f33d`.
Kontrakt produktu wymaga automatycznego wznowienia BACKTEST bez drugiego
runu, trades lub raportu. DoD wymaga dowodu po restarcie; wiersz 011A
zostawia test równoległych zapisów jako otwartą bramkę.

Zakres testu: wyłącznie lokalny `BacktestIntrabarArchive` i jego 1–2
`BacktestIntrabarArchiveRaw` dla tego samego `(runId,symbol)`, Binance
USD-M 1m. Uruchomimy odrębne PID na własnej świeżej PostgreSQL `_test`
po migracji 85 i osobnym Redisie. Każdy proces zweryfikuje dwa dzienne
ZIP i `.CHECKSUM`, zatrzyma się na barierze tuż przed transakcyjnym
`saveVerifiedRunArchive`, a proces nadrzędny zwolni je razem. To jest
rzeczywista kolizja bazy, nie `Promise.all` w jednym kliencie Prisma.

1. Identyczna taśma: dwa procesy próbują zapisać dokładnie ten sam v3.
   Oba mogą zwrócić zweryfikowaną taśmę, ale SQL ma jeden snapshot i
   dokładnie dwie kanoniczne pary raw; hash, digest i ponowny odczyt offline
   zgadzają się. Zwycięzca i przegrany nie tworzą półrekordu.
2. Różne, wewnętrznie spójne taśmy i checksum dla tych samych świec:
   pierwszy zatwierdzony payload jest kanoniczny. Drugi proces musi
   dostać `SOURCE_CHANGED_ON_RETRY`; nadal istnieje jeden snapshot i
   dokładnie jego dwa raw, bez mieszania dni z konkurencyjnych zapisów.
   Osobna uszkodzona checksum/ZIP jest odrzucona przed zapisem.
3. Po bezpiecznym `SIGKILL` klienta, który już zapisał źródło, kolejny
   PID odczytuje je offline i ponawia zapis tej samej tożsamości bez
   dodatkowych rekordów. Osobny istniejący test workera sprawdza fence
   i odzyskanie po testowo skróconym lease; nie czekamy bez potrzeby na
   naturalne 10 minut. Jeśli test odkryje błąd, naprawimy tylko tę ścieżkę.

Test tworzy jeden własny run, ale nie rozpoczyna transakcji LIVE ani
produkcji. Nieudany zapis nie może opublikować raportu/trades/PnL;
kanoniczny snapshot musi weryfikować bajty offline. Sprawdzimy liczniki
SQL, kolejkę Redis i selektywny cleanup własnych zasobów. Obcy untracked
i zasoby zablokowane przez policy review zostają bez zmian.

Plan nie zwiększa limitu 8 MiB ZIP, nie dodaje nowych źródeł, nie
obejmuje produkcyjnych wielu workerów ani naturalnego lease w tym
teście. Pełne 011A/011 `REVIEW`, `POSITION-CYCLE` `OPEN`, wydanie `NO-GO`.
