import { useMemo } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useI18n } from "@/i18n/I18nProvider";
import {
  CompoundField,
  FormGrid,
  FormSectionCard,
  NumberField,
  RadioGroupField,
  ToggleField,
} from "@/ui/forms";
import { AdditionalProps, DcaLevel, TimeUnit } from "../../types/StrategyForm.type";
import {
  numericInputProps,
  readNumericInputValue,
  strategyNumericContracts,
} from "../../utils/strategyNumericInput";

const getPrimaryDcaLevel = (levels: DcaLevel[]): DcaLevel => levels[0] ?? { percent: -1, multiplier: 2 };
const integerInputProps = numericInputProps(strategyNumericContracts.integer);
const decimalInputProps = numericInputProps(strategyNumericContracts.decimal2);

export function Additional({ data, setData }: AdditionalProps) {
  const { t } = useI18n();
  const copy = useMemo(() => ({
    positions: t("dashboard.strategies.form.additional.positions"),
    orders: t("dashboard.strategies.form.additional.orders"),
    maxCount: t("dashboard.strategies.form.additional.maxCount"),
    lifetime: t("dashboard.strategies.form.additional.lifetime"),
    lifetimeHint: t("dashboard.strategies.form.additional.lifetimeHint"),
    unitMin: t("dashboard.strategies.form.additional.unitMin"),
    unitHour: t("dashboard.strategies.form.additional.unitHour"),
    unitDay: t("dashboard.strategies.form.additional.unitDay"),
    unitWeek: t("dashboard.strategies.form.additional.unitWeek"),
    dca: t("dashboard.strategies.form.additional.dca"),
    basic: t("dashboard.strategies.form.additional.basic"),
    advanced: t("dashboard.strategies.form.additional.advanced"),
    times: t("dashboard.strategies.form.additional.times"),
    triggerLevel: t("dashboard.strategies.form.additional.triggerLevel"),
    multiplier: t("dashboard.strategies.form.additional.multiplier"),
    levelPercent: t("dashboard.strategies.form.additional.levelPercent"),
    removeLevel: t("dashboard.strategies.form.additional.removeLevel"),
    addLevel: t("dashboard.strategies.form.additional.addLevel"),
  }), [t]);
  const timeUnitOptions = useMemo(
    () => [
      { value: "min", label: copy.unitMin },
      { value: "h", label: copy.unitHour },
      { value: "d", label: copy.unitDay },
      { value: "w", label: copy.unitWeek },
    ],
    [copy.unitDay, copy.unitHour, copy.unitMin, copy.unitWeek]
  );

  const patch = (changes: Partial<typeof data>) => setData((prev) => ({ ...prev, ...changes }));

  const updateLevel = (idx: number, field: keyof DcaLevel, value: number) =>
    setData((prev) => ({
      ...prev,
      dcaLevels: prev.dcaLevels.map((level, i) => (i === idx ? { ...level, [field]: value } : level)),
      dcaTimes:
        prev.dcaMode === "advanced"
          ? prev.dcaLevels.map((level, i) => (i === idx ? { ...level, [field]: value } : level)).length
          : prev.dcaTimes,
    }));

  const setPrimaryDcaLevel = (changes: Partial<DcaLevel>) =>
    setData((prev) => {
      const current = getPrimaryDcaLevel(prev.dcaLevels);
      const next = { ...current, ...changes };
      const rest = prev.dcaLevels.slice(1);
      return { ...prev, dcaLevels: [next, ...rest] };
    });

  const addLevel = () =>
    setData((prev) => ({
      ...prev,
      dcaLevels: [...prev.dcaLevels, { percent: -1, multiplier: 2 }],
      dcaTimes: prev.dcaMode === "advanced" ? prev.dcaLevels.length + 1 : prev.dcaTimes,
    }));

  const removeLevel = (idx: number) =>
    setData((prev) => ({
      ...prev,
      dcaLevels: prev.dcaLevels.filter((_, i) => i !== idx),
      dcaTimes: prev.dcaMode === "advanced" ? Math.max(0, prev.dcaLevels.length - 1) : prev.dcaTimes,
    }));

  const primaryLevel = getPrimaryDcaLevel(data.dcaLevels);

  return (
    <FormGrid columns={2}>
      <FormSectionCard title={copy.positions}>
        <div className="space-y-6">
          <FormGrid columns={2}>
            <NumberField
              id="strategy-additional-max-positions"
              label={copy.maxCount}
              min={1}
              value={data.maxPositions}
              inputMode={integerInputProps.inputMode}
              step={Number(integerInputProps.step)}
              onChange={(value) => {
                const parsed = readNumericInputValue(value, strategyNumericContracts.integer);
                if (parsed == null) return;
                patch({ maxPositions: parsed });
              }}
            />
            <CompoundField label={copy.lifetime} hint={copy.lifetimeHint} columns={2}>
              <input
                id="strategy-additional-position-lifetime"
                type="number"
                min={0}
                inputMode={integerInputProps.inputMode}
                step={integerInputProps.step}
                className="input input-bordered w-full"
                value={data.positionLifetime}
                onChange={(event) => {
                  const parsed = readNumericInputValue(event.target.value, strategyNumericContracts.integer);
                  if (parsed == null) return;
                  patch({ positionLifetime: parsed });
                }}
              />
              <select
                id="strategy-additional-position-unit"
                className="select select-bordered w-full"
                value={data.positionUnit}
                onChange={(event) => patch({ positionUnit: event.target.value as TimeUnit })}
              >
                {timeUnitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </CompoundField>
          </FormGrid>

          <div className="border-t border-base-300/60 pt-6">
            <h4 className="mb-3 text-sm font-semibold text-base-content/80">{copy.orders}</h4>
            <FormGrid columns={2}>
              <NumberField
                id="strategy-additional-max-orders"
                label={copy.maxCount}
                min={1}
                value={data.maxOrders}
                inputMode={integerInputProps.inputMode}
                step={Number(integerInputProps.step)}
                onChange={(value) => {
                  const parsed = readNumericInputValue(value, strategyNumericContracts.integer);
                  if (parsed == null) return;
                  patch({ maxOrders: parsed });
                }}
              />
              <CompoundField label={copy.lifetime} hint={copy.lifetimeHint} columns={2}>
                <input
                  id="strategy-additional-order-lifetime"
                  type="number"
                  min={0}
                  inputMode={integerInputProps.inputMode}
                  step={integerInputProps.step}
                  className="input input-bordered w-full"
                  value={data.orderLifetime}
                  onChange={(event) => {
                    const parsed = readNumericInputValue(event.target.value, strategyNumericContracts.integer);
                    if (parsed == null) return;
                    patch({ orderLifetime: parsed });
                  }}
                />
                <select
                  id="strategy-additional-order-unit"
                  className="select select-bordered w-full"
                  value={data.orderUnit}
                  onChange={(event) => patch({ orderUnit: event.target.value as TimeUnit })}
                >
                  {timeUnitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </CompoundField>
            </FormGrid>
          </div>
        </div>
      </FormSectionCard>

      <FormSectionCard title={copy.dca}>
        <div className="space-y-4">
          <ToggleField
            id="strategy-dca-enabled"
            label={copy.dca}
            checked={data.dcaEnabled}
            onChange={(next) => patch({ dcaEnabled: next })}
          />

          {data.dcaEnabled ? (
            <>
              <RadioGroupField
                id="strategy-dca-mode"
                label={copy.dca}
                value={data.dcaMode}
                options={[
                  { value: "basic", label: copy.basic },
                  { value: "advanced", label: copy.advanced },
                ]}
                onChange={(next) => {
                  if (next === "basic") {
                    setData((prev) => ({
                      ...prev,
                      dcaMode: "basic",
                      dcaTimes: Math.max(1, prev.dcaTimes || prev.dcaLevels.length || 1),
                    }));
                    return;
                  }
                  setData((prev) => ({
                    ...prev,
                    dcaMode: "advanced",
                    dcaTimes: prev.dcaLevels.length,
                  }));
                }}
              />

              {data.dcaMode === "basic" ? (
                <FormGrid columns={2}>
                  <CompoundField label={copy.times} columns={1}>
                    <div className="space-y-3">
                      <input
                        id="strategy-dca-times-input"
                        type="number"
                        min={1}
                        max={10}
                        step={1}
                        inputMode={integerInputProps.inputMode}
                        className="input input-bordered w-full"
                        value={data.dcaTimes}
                        onChange={(event) => {
                          const parsed = readNumericInputValue(event.target.value, strategyNumericContracts.integer);
                          if (parsed == null) return;
                          patch({ dcaTimes: parsed });
                        }}
                      />
                      <input
                        id="strategy-dca-times-range"
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        className="range range-primary w-full"
                        value={data.dcaTimes}
                        onChange={(event) => {
                          const parsed = readNumericInputValue(event.target.value, strategyNumericContracts.integer);
                          if (parsed == null) return;
                          patch({ dcaTimes: parsed });
                        }}
                      />
                    </div>
                  </CompoundField>

                  <NumberField
                    id="strategy-dca-trigger-level"
                    label={copy.triggerLevel}
                    min={-100}
                    max={100}
                    step={Number(decimalInputProps.step)}
                    inputMode={decimalInputProps.inputMode}
                    value={primaryLevel.percent}
                    onChange={(value) => {
                      const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                      if (parsed == null) return;
                      setPrimaryDcaLevel({ percent: parsed });
                    }}
                  />

                  <NumberField
                    id="strategy-dca-multiplier"
                    label={copy.multiplier}
                    min={1}
                    step={Number(decimalInputProps.step)}
                    inputMode={decimalInputProps.inputMode}
                    value={data.dcaMultiplier}
                    onChange={(value) => {
                      const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                      if (parsed == null) return;
                      patch({ dcaMultiplier: parsed });
                      setPrimaryDcaLevel({ multiplier: parsed });
                    }}
                  />
                </FormGrid>
              ) : (
                <>
                  <div className="space-y-3">
                    {data.dcaLevels.map((level, idx) => (
                      <div key={`dca-level-${idx}`} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        <NumberField
                          id={`strategy-dca-level-percent-${idx}`}
                          label={copy.levelPercent}
                          step={Number(decimalInputProps.step)}
                          inputMode={decimalInputProps.inputMode}
                          value={level.percent}
                          onChange={(value) => {
                            const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                            if (parsed == null) return;
                            updateLevel(idx, "percent", parsed);
                          }}
                        />
                        <NumberField
                          id={`strategy-dca-level-multiplier-${idx}`}
                          label={copy.multiplier}
                          min={1}
                          step={Number(decimalInputProps.step)}
                          inputMode={decimalInputProps.inputMode}
                          value={level.multiplier}
                          onChange={(value) => {
                            const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                            if (parsed == null) return;
                            updateLevel(idx, "multiplier", parsed);
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => removeLevel(idx)}
                          title={copy.removeLevel}
                        >
                          <LuTrash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-outline mt-2" onClick={addLevel}>
                    {copy.addLevel}
                  </button>
                </>
              )}
            </>
          ) : null}
        </div>
      </FormSectionCard>
    </FormGrid>
  );
}
