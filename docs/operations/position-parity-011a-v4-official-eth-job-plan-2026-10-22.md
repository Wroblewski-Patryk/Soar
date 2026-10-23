# 011A: zamrożony plan opt-in BACKTEST na oficjalnym raw ETH

**Stan przed uruchomieniem:** plan testu; brak wyniku joba. Baza kodu
`f0e36f40b090b4da21c65433eeb68df084ab82fc`. Ten wycinek nie dotyczy
wybranego świadka ALICEUSDT `aggTrades` ani jego DCA→TTP.

## Źródło i limity

Jedyna dopuszczona para: lokalna kopia oryginalnych plików Binance USD-M
`ETHUSDT-trades-2026-10-18.zip` oraz `ETHUSDT-trades-2026-10-18.zip.CHECKSUM`
z `%TEMP%/soar-011a-raw-trades-2026-10-22/`; 1m klines z
`%TEMP%/soar-011a-120m-c82a637/ETHUSDT-klines.json`. Okno
2026-10-18 **02:00–04:00 UTC**, dokładnie 120 świec, bez wyboru podokna.
Odczyt przed planem: ZIP `29 176 827 B`, SHA-256
`8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7`
zgodny z oryginalnym `.CHECKSUM`; jeden wpis CSV `178 044 910 B`.
JSON klines ma SHA-256
`9334eb8e2f94a34e8a45c9dfdba6544a0ee7d8f5129b85d2055cd6d19f2acc3f`,
120 wierszy i sumę `tradeCount=199 234`. Wcześniejszy test źródła
potwierdził 120/120 OHLCV i trade count oraz 199 234 raw w tym oknie.

Jawny **testowy** budżet parsera jest równy zmierzonym granicom:
`maxZipBytes=29 176 827`, `maxCsvBytes=178 044 910`,
`maxSelectedTrades=199 234`, `maxElapsedMs=120 000` na pojedynczą
weryfikację. Żadna z tych wartości nie jest zatwierdzonym limitem
produkcyjnym. Zmiana pliku, rozmiaru, liczby transakcji, checksum albo
przekroczenie czasu ma zakończyć próbę bez wyniku symulacji; nie zwiększać
budżetu po niepowodzeniu.

## Strategia ustalona przed wynikiem

Jeden symbol `ETHUSDT`, `BINANCE/FUTURES`, `1m`, leverage `1`, margin
`ISOLATED`, saldo początkowe `1000` USDT, wallet risk `10%`, fee rate
`0.0004`, slippage `0`. Zapisana konfiguracja:

```json
{
  "open": {
    "direction": "long",
    "noMatchAction": "HOLD",
    "indicatorsLong": [
      { "name": "MOMENTUM", "condition": ">", "value": -100,
        "params": { "period": 2 } }
    ],
    "indicatorsShort": []
  },
  "close": { "mode": "basic", "tp": 0.1, "sl": 0.1 },
  "additional": { "dcaEnabled": false, "dcaTimes": 0 }
}
```

Wybrano prostą strategię do sprawdzenia drogi źródło→symulacja→trwały
raport, bez dopasowywania progów do obserwowanego PnL. Brak zamkniętej
transakcji jest dopuszczalnym wynikiem; wtedy raport i liczba trades mają
uczciwie wynosić zero, a konfiguracji nie zmienia się po teście.

## Kryteria odbioru lokalnego

Test jest opt-in (`RUN_011A_RAW_V4_JOB_PROOF=1` oraz osobny przełącznik
oficjalnego testu) na własnej PostgreSQL `_test` i Redisie. Produkcyjny
`backtests.service.ts` nie wstrzykuje adaptera. Test tworzy zapisany run
i używa prawdziwego `createClaimedBacktestRunJob`. Adapter pod tokenem
wiąże zweryfikowany blob/ref/snapshot v4 **przed** wywołaniem symulatora.
Symulacja dostaje uporządkowane raw ticki z odczytu utrwalonych bajtów.

Wymagane: status `COMPLETED`, jeden trwały raport `reportReady=true`,
digest runu równy snapshotowi, 120/120 świec i 199 234 raw potwierdzone
źródłem; `totalTrades` i PnL raportu zgodne z trwałymi trades, fee i wkłady
sprawdzone względem trwałych rekordów. Jeśli `totalTrades=0`, jawnie
zanotować brak zamkniętego cyklu zamiast go wymuszać. Drugi odczyt źródła
i timeline muszą korzystać z persisted blob bez fetch; ponowne
wywołanie zakończonego joba nie dodaje raportu, trades, wkładów ani
snapshotów. Log, dokładny SHA/tree testowanego kodu i liczniki własnej
SQL/Redis zapisujemy po uruchomieniu.

Nie testujemy SIGKILL ani automatycznego przejęcia RUNNING przez kolejkę,
PAPER/LIVE, rzeczywistych filli, produkcji, retencji/GC lub backupu.
Pełne 011A pozostaje `REVIEW`, wydanie `NO-GO`.
