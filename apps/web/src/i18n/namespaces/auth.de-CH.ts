export const authDeCh = {
  "labels": {
    "login": "anmelden",
    "register": "Benutzerkonto erstellen"
  },
  "page": {
    "login": {
      "title": "Melden Sie sich bei Soar an",
      "description": "Greifen Sie auf Ihr Kontrollzentrum zu und überwachen Sie Märkte, Positionen und Bot-Laufzeit an einem Ort."
    },
    "register": {
      "title": "Erstellen Sie Ihr Soar-Konto",
      "description": "Richten Sie Ihr Konto ein und beginnen Sie mit dem Testen von Strategien, dem Ausführen von Bots und dem Verfolgen von Risiken in einem Dashboard."
    }
  },
  "forms": {
    "common": {
      "emailLabel": "E-Mail",
      "emailPlaceholder": "name@example.com",
      "passwordLabel": "Passwort",
      "passwordPlaceholder": "********",
      "passwordResetSoon": "Das Zurücksetzen des Passworts wird in Kürze verfügbar sein.",
      "showPassword": "Passwort anzeigen",
      "hidePassword": "Passwort verbergen"
    },
    "login": {
      "rememberDevice": "Denken Sie an dieses Gerät",
      "submitIdle": "anmelden",
      "submitPending": "Anmelden...",
      "noAccount": "Sie haben noch kein Konto?",
      "createOne": "Erstellen Sie eins"
    },
    "register": {
      "agreePrefix": "Ich stimme dem zu",
      "terms": "Nutzungsbedingungen",
      "agreeMiddle": "und die",
      "privacy": "Datenschutzrichtlinie",
      "submitIdle": "Benutzerkonto erstellen",
      "submitPending": "Konto erstellen...",
      "haveAccount": "Haben Sie ein Konto?",
      "signIn": "anmelden"
    }
  },
  "toasts": {
    "login": {
      "sessionConfirmFailed": "Sitzung konnte nicht bestätigt werden. Bitte melden Sie sich erneut an.",
      "success": "Erfolgreich angemeldet.",
      "failedFallback": "Die Anmeldung ist fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.",
      "failedPrefix": "Anmeldung fehlgeschlagen:"
    },
    "register": {
      "sessionConfirmFailed": "Die Sitzung konnte nach der Registrierung nicht bestätigt werden. Bitte melden Sie sich erneut an.",
      "success": "Registrierung erfolgreich abgeschlossen.",
      "failedFallback": "Die Registrierung ist fehlgeschlagen. Überprüfen Sie Ihre Daten und versuchen Sie es erneut.",
      "failedPrefix": "Registrierung fehlgeschlagen:"
    }
  },
  "validation": {
    "emailInvalid": "Geben Sie eine gültige E-Mail-Adresse an.",
    "passwordRequired": "Passwort angeben.",
    "passwordMin": "Das Passwort muss mindestens 8 Zeichen lang sein.",
    "passwordLetter": "Das Passwort muss mindestens einen Buchstaben enthalten.",
    "passwordDigit": "Das Passwort muss mindestens eine Ziffer enthalten.",
    "termsRequired": "Sie müssen die Bedingungen akzeptieren."
  }
} as const;
