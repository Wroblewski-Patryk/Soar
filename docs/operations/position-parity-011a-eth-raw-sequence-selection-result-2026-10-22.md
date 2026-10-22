# 011A: wynik selekcji raw ETH DCA→TTP

**Wynik:** `NO_WITNESS` w zamrożonych 21 oknach; etap zakończony bez
pełnego joba. [Plan selekcji](position-parity-011a-eth-raw-sequence-selection-plan-2026-10-22.md)
zapisano przed odczytem wyniku na SHA
`6aedc3bd7a27b9012bf73e1ce223c5441ee81859`. Selektor uruchomiono
na exact SHA `b5c4316d393b684e2bf4d84778619472e629b619`, tree
`43ffcffcba5ee4688b7759dca0209eb8fb1ebf4d`.

## Wykonanie offline

Jawny opt-in i wyłącznie lokalne oryginalne pliki ETH z planu:

```powershell
$env:RUN_011A_ETH_RAW_WITNESS_SELECTOR='1'
# RUN_011A_RAW_ARCHIVE_DIR i RUN_011A_KLINES_DIR wskazują katalogi z planu.
pnpm --filter api exec tsx scripts/select011aRawTradeEthWitness.ts
```

Exit `0`, około `8,46 s`. Lokalny log
`%TEMP%/soar-011a-eth-raw-selector-b5c4316d-20261022.log`, SHA-256
`ebfb4d57c972895153571de517f141c8e04c4bec099fd5e4c6a789e27ed2baf5`.
`git diff --quiet HEAD --` zwróciło `0` przed i po przebiegu; jedynym
nieśledzonym katalogiem był obcy
`docs/operations/api-endpoint-docs-parity-2026-10-20/`, nietknięty.

Oryginalny ZIP SHA-256
`8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7`
i JSON klines zostały sprawdzone przed selekcją. Jeden strumieniowy
odczyt ZIP + oryginalnego `.CHECKSUM` z testowym budżetem
ZIP/CSV/wybranych raw/czas
`29 176 827 B / 178 044 910 B / 199 234 / 120 000 ms`
potwierdził 120/120 OHLCV i `tradeCount`, ciągłość minut, kolejność raw
ID/czasu oraz digest pełnej taśmy
`e29f15b7b5a7e9c98dc826f466d7dbafd30bb16aa7c74ff3933f2cf2ef6c3228`.
Nie pobierano źródła z sieci i nie podnoszono limitu.

## Wszystkie 21 okien

Symulator użył niezmienionego `marketSequenceStrategyConfig`, ustalonych
parametrów pozycji i `analysisStartIndex=2`. Liczby zdarzeń w grupach:

| Starty UTC | Okna | DCA na okno | TTP na okno | Jednoznaczne pary raw DCA→TTP |
| --- | ---: | ---: | ---: | ---: |
| 02:00 | 1 | 4 | 4 | 0 |
| 02:01–02:08 | 8 | 5 | 4 | 0 |
| 02:09–02:19 | 11 | 5 | 5 | 0 |
| 02:20 | 1 | 4 | 4 | 0 |

Każde okno miało raw ticki, lecz żadne nie miało pary spełniającej
**jednocześnie**: jeden `tradeSequence`, ta sama świeca, późniejszy czas
TTP oraz po jednym jednoznacznym ticku o zgodnej cenie/czasie z
`id(TTP)>id(DCA)`. Liczniki DCA/TTP nie są dowodem ich kolejności w
jednej świecy. `witness:null` oznacza wynik negatywny wyłącznie dla
tej strategii, tej taśmy i tych 21 okien; nie dowodzi braku takiego
zdarzenia gdzie indziej.

Zgodnie z planem **nie** zmieniono progów, strategii, źródła ani zakresu
po wyniku i nie uruchomiono pełnego v4 joba na nowym oknie. Nie ma więc
nowego runu, raportu, trades, wkładów ani testu offline retry w tym
etapie. SQL własnej `_test` pozostał na licznikach sprzed selekcji:
User `36`, Strategy `7`, Run `46`, Report `26`, Trade `19`,
Contribution `25`, RawBlob `7`, RawRef `21`, Snapshot `19`;
Redis `DBSIZE=0`. Własne zasoby zachowano bez cleanupu i resetu.

To nie zmienia wcześniejszego lokalnego PASS pełnego joba na oficjalnym
raw ETH ani wyniku v3 na zamrożonym ALICE `aggTrades`. Nie stanowi
dowodu DCA→TTP na raw ETH, PAPER/LIVE, realnego fillu, produkcji lub
automatycznego wznowienia po SIGKILL. Pełne 011A `REVIEW`, wydanie
`NO-GO`.
