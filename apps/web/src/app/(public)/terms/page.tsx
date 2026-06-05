export default function TermsPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12 md:px-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Soar</p>
        <h1 className="text-4xl font-bold text-base-content">Terms of Service</h1>
        <p className="text-base leading-7 text-base-content/75">
          Use Soar only when you understand the risks of automated and assisted trading. Public
          pages, account setup, strategy tools, and exchange integrations are provided for the
          approved Soar application experience and must be used within the operator-approved
          workflow.
        </p>
      </div>
      <div className="space-y-4 text-sm leading-7 text-base-content/75">
        <p>
          You are responsible for the accuracy of account details, exchange credentials, trading
          permissions, and strategy configuration you provide. Do not enable live trading or connect
          exchange accounts unless you have explicit authority to do so.
        </p>
        <p>
          Soar can present market, wallet, runtime, backtest, and audit information, but the
          application does not remove market risk, liquidity risk, operational risk, or exchange
          availability risk. Review every live-impacting action before use.
        </p>
        <p>
          If you find unexpected account behavior, incorrect balances, missing audit data, or an
          unsafe trading state, stop using the affected workflow and contact the project operator.
        </p>
      </div>
    </section>
  );
}
