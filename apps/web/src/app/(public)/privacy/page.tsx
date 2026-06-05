export default function PrivacyPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12 md:px-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Soar</p>
        <h1 className="text-4xl font-bold text-base-content">Privacy Policy</h1>
        <p className="text-base leading-7 text-base-content/75">
          Soar uses account, strategy, wallet, runtime, and audit information to provide the
          trading-assistant experience. Sensitive credentials and exchange access must only be
          handled through approved secure flows.
        </p>
      </div>
      <div className="space-y-4 text-sm leading-7 text-base-content/75">
        <p>
          The application should not expose API keys, secrets, tokens, passwords, cookies, payment
          data, or exchange credentials in public pages, screenshots, repository artifacts, logs, or
          issue comments.
        </p>
        <p>
          Operational evidence may record route names, status summaries, timestamps, and validation
          results. It must not store raw secret values or private exchange payloads.
        </p>
        <p>
          If you suspect secret exposure, unauthorized access, or incorrect account isolation, stop
          the affected workflow and contact the project operator for a security review.
        </p>
      </div>
    </section>
  );
}
