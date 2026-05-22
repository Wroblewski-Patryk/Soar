export const adminDeCh = {
  "labels": {
    "users": "Benutzer",
    "subscriptions": "Abonnements"
  },
  "layout": {
    "nav": {
      "subscriptions": "Abonnements",
      "users": "Benutzer"
    },
    "footer": {
      "rights": "Alle Rechte vorbehalten."
    },
    "auth": {
      "loading": "Admin-Zugriff wird bestaetigt...",
      "deniedTitle": "Admin-Zugriff erforderlich",
      "deniedDescription": "Das aktuelle Konto ist nicht als Administrator bestaetigt."
    }
  },
  "users": {
    "loadError": "Benutzer konnten nicht geladen werden.",
    "roleUpdateErrorPrefix": "Die Rolle konnte nicht aktualisiert werden",
    "planAssignErrorPrefix": "Abonnementplan konnte nicht zugewiesen werden",
    "title": "Benutzeradministrator",
    "description": "Verwalten Sie Kontorollen und aktive Abonnementpläne für registrierte Benutzer.",
    "refresh": "Aktualisieren",
    "searchLabel": "Suchen Sie nach E-Mail oder Namen",
    "searchPlaceholder": "zum Beispiel user@example.com",
    "roleLabel": "Rolle",
    "allRoles": "Alle Rollen",
    "apply": "Anwenden",
    "totalUsers": "Gesamtzahl der Benutzer",
    "loadingUsers": "Benutzer werden geladen...",
    "tableUser": "Benutzer",
    "tableRole": "Rolle",
    "tableActivePlan": "Aktiver Plan",
    "tableCreated": "Erstellt",
    "tableActions": "Aktionen",
    "noDisplayName": "Kein Anzeigename",
    "noActiveSubscription": "Kein aktives Abonnement",
    "cannotDemoteSelf": "Sie können Ihr eigenes Administratorkonto nicht herabstufen.",
    "makeAdmin": "Machen Sie Administrator",
    "makeUser": "Benutzer erstellen",
    "assignPlan": "Plan zuweisen",
    "toggleRoleAriaPrefix": "Rolle umschalten für",
    "planSelectAriaPrefix": "Plan auswählen für",
    "assignPlanAriaPrefix": "Plan zuweisen für"
    ,"confirmTitle": "Admin-Aenderung bestaetigen",
    "confirmRoleDescription": "Rolle von {email} zu {role} aendern.",
    "confirmPlanDescription": "Plan {plan} an {email} zuweisen.",
    "confirmLabel": "Bestaetigen",
    "cancelLabel": "Abbrechen"
  },
  "subscriptions": {
    "loadError": "Abonnementpläne konnten nicht geladen werden.",
    "numericValidation": "Alle numerischen Felder müssen gültige Ganzzahlen sein.",
    "nonNegativeValidation": "Preis und Limits dürfen nicht negativ sein.",
    "minBacktestsValidation": "Das Limit für gleichzeitige Backtests muss mindestens 1 betragen.",
    "modeLimitsValidation": "Die Moduslimits dürfen das Gesamt-Bot-Limit nicht überschreiten.",
    "currencyValidation": "Die Währung muss ein 3-Buchstaben-Code sein (z. B. USD).",
    "saveError": "Der Abonnementplan konnte nicht gespeichert werden. Bitte überprüfen Sie die Werte und versuchen Sie es erneut.",
    "title": "Abonnementadministrator",
    "description": "Bearbeiten Sie Preise und Berechtigungsgrenzen für die Pläne FREE, ADVANCED und PROFESSIONAL.",
    "refresh": "Aktualisieren",
    "loading": "Pläne werden geladen...",
    "tablePlan": "Planen",
    "tablePrice": "Preis",
    "tableTotalBots": "Insgesamt Bots",
    "tablePaperLive": "PAPIER / LIVE",
    "tableBacktests": "Backtests",
    "tableStatus": "Status",
    "tableActions": "Aktionen",
    "statusActive": "Aktiv",
    "statusInactive": "Inaktiv",
    "edit": "Bearbeiten",
    "editPlanTitlePrefix": "Plan bearbeiten:",
    "editPlanFallback": "Planen",
    "monthlyPrice": "Monatspreis (Kleineinheiten)",
    "currency": "Währung",
    "maxBotsTotal": "Maximale Bots insgesamt",
    "paperBotsLimit": "PAPIER-Bots-Limit",
    "liveBotsLimit": "Limit für LIVE-Bots",
    "maxConcurrentBacktests": "Max. gleichzeitige Backtests",
    "cancel": "Stornieren",
    "save": "Speichern",
    "closeBackdrop": "Schließen"
  }
} as const;
