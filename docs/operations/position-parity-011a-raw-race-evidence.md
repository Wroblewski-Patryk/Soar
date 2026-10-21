# 011A — równoległy zapis raw v3: lokalny odbiór autorski

Plan zapisany przed kodem: `29ae8e630fe3255cbf00d9cc821203574a32fcc3`.
Kod testu: `fffe48b618576d2d7e0e3ab13f3f4cd3a14352f3`.
Kod zapisu raw i migracja 85 nie były zmieniane. Próba dotyczy tylko
lokalnego BACKTEST Binance USD-M 1m i dwóch sąsiednich dób UTC.

Na własnej świeżej PostgreSQL `soar_011a_raw_race_test` po 85 migracjach
i osobnym Redisie test procesowy `backtestRawArchiveRace.runtime.test.ts`
dał 1/1 `PASS`. Dwa różne PID sprawdzały oba syntetyczne dzienne ZIP i
`.CHECKSUM`, a następnie zostały równocześnie zwolnione z bariery przed
`saveVerifiedRunArchive` dla tego samego `(runId,symbol)`:

- Identyczne bajty: PID 255572 i 173236 zakończyły pomyślnie. SQL miał
  jeden kanoniczny snapshot v3 i dokładnie dwa raw. Obie odpowiedzi miały
  ten sam digest.
- Dwa wewnętrznie poprawne, lecz różne pliki: PID 184224 i 200636;
  zwyciężył 200636, przegrany dostał
  `BACKTEST_INTRABAR_ARCHIVE_SOURCE_CHANGED_ON_RETRY`. Odczyt SQL
  potwierdził oba raw zgodne tylko z ZIP zwycięzcy, bez mieszania dni.
- Uszkodzona suma drugiego ZIP dała
  `BACKTEST_INTRABAR_ARCHIVE_CHECKSUM_MISMATCH` przed zapisem; w tym
  momencie liczba snapshotów i raw wynosiła 0. Dopiero prawidłowy
  równoległy klient zapisał kanoniczną parę.
- Po zapisaniu przez PID 25360 i `SIGKILL`, PID 250072 najpierw odczytał
  bajty offline z oznaczeniem `PERSISTED_CHECKSUM_REVERIFIED`, a następnie
  bez błędu ponowił zapis tej samej tożsamości. Digest offline:
  `c3cf4980085008a9011b429c0a9dccdf5de806b6ea52eef6d7b9185c94e96a75`.
  Pozostał jeden snapshot i dwa raw.

W każdym z czterech przypadków przed cleanup odczyt SQL zweryfikował
SHA-256 dokładnych ZIP i checksum, ponowny replay offline oraz jeden
snapshot/dwa raw. Run pozostał `PENDING`; nie pojawiły się trades,
wkłady ani raport/PnL. Redis `DBSIZE=0`. Po selektywnym cleanup obu
własnych baz: User/Strategy/Run/Archive/Raw/Trade/Report/Contribution
`0/0/0/0/0/0/0/0`, Redis `DBSIZE=0`.

Osobno, na tym samym kodzie i własnej bazie
`soar_011a_archived_process_test`, istniejący test prawdziwego joba
`midnight-baseline` dał 1/1 `PASS` po testowym skróceniu lease. Publiczne
ZIP ALICEUSDT 2026-10-17/18 miały SHA-256
`0cb11b74fb1514e650613d23fb60224a4131af6fcbff0c14218604762dee9b01`
i `4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
Po `SIGKILL` pierwszy PID 7192 zastąpił drugi 144612; ten sam run
osiągnął `COMPLETED`, jedno wywołanie joba w drugim PID, jeden raport,
trzy trades, net PnL `+0,34133` USDT i pustą kolejkę po ACK. To osobny
dowód terminal fence i automatycznego wznowienia, nie test jednoczesnych
zapisów w tym jobie.

API typecheck, docs parity, guardrails i strict architecture graph
`943/943` przeszły. Lokalne syntetyczne ZIP dowodzą kolizji zapisu, nie
tożsamości zdalnego źródła. Nie sprawdzono pojemności i rollbacku
migracji, większych archiwów, naturalnego lease tej próby, real LIVE ani
produkcyjnego runtime. Pełne 011A/011 pozostają `REVIEW`,
`POSITION-CYCLE` `OPEN`, wydanie `NO-GO`.
