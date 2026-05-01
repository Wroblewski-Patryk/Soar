export const dashboardReportsDeCh = {
  "page": {
    "title": "Berichte",
    "breadcrumbPerformance": "Leistung"
  },
  "states": {
    "loadingTitle": "Leistungsberichte werden geladen",
    "errorTitle": "Leistungsberichte konnten nicht geladen werden",
    "errorFallback": "Leistungsberichte konnten nicht geladen werden.",
    "retryLabel": "Versuchen Sie es erneut",
    "emptyTitle": "Noch keine Leistungsberichte",
    "emptyDescription": "Abgeschlossene Backtests mit Berichten werden hier angezeigt.",
    "successTitle": "Leistungsberichte geladen",
    "successDescription": "{count}-Berichte zur Leistungsanalyse geladen."
  },
  "cards": {
    "reports": "Berichte",
    "avgNetPnl": "Durchschnittlicher Nettogewinn",
    "avgWinRate": "Durchschnittliche Gewinnrate",
    "bestRun": "Bester Lauf"
  },
  "sections": {
    "crossMode": {
      "title": "Cross-Mode-Leistung",
      "description": "Vergleichen Sie die Wirksamkeit von BACKTEST vs. PAPER vs. LIVE.",
      "table": {
        "mode": "Modus",
        "trades": "Gewerbe",
        "winRate": "Gewinnrate",
        "netPnl": "Netto-Gewinn- und Verlustrechnung",
        "grossProfit": "Bruttogewinn",
        "grossLoss": "Bruttoverlust"
      }
    },
    "byRun": {
      "title": "Leistung durch Backtest-Lauf",
      "table": {
        "run": "Laufen",
        "symbol": "Symbol",
        "timeframe": "Zeitrahmen",
        "trades": "Gewerbe",
        "winRate": "Gewinnrate",
        "netPnl": "Netto-Gewinn- und Verlustrechnung",
        "maxDd": "Max DD",
        "sharpe": "Sharpe"
      }
    }
  }
} as const;
