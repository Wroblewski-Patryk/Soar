type TtpProtectionSource = "backend" | "prospective" | null;

type BotsMonitoringProtectionCellProps = {
  value: number | null;
  source: TtpProtectionSource;
  prospectiveLabel: string;
  formatNumber: (value: number, digits?: number) => string;
};

export function BotsMonitoringProtectionCell({
  value,
  source,
  prospectiveLabel,
  formatNumber,
}: BotsMonitoringProtectionCellProps) {
  if (value == null) return "-";

  return (
    <div className="flex flex-col leading-tight">
      <span>{formatNumber(value, 2)}%</span>
      {source === "prospective" ? (
        <span className="text-[10px] uppercase tracking-wide opacity-60">
          {prospectiveLabel}
        </span>
      ) : null}
    </div>
  );
}
