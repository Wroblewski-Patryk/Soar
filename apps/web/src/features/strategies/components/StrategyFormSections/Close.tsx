import { useMemo } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useI18n } from "@/i18n/I18nProvider";
import { FormGrid, FormSectionCard, NumberField, RadioGroupField } from "@/ui/forms";
import { CloseConditions, CloseProps, Threshold } from "../../types/StrategyForm.type";
import {
  numericInputProps,
  readNumericInputValue,
  strategyNumericContracts,
} from "../../utils/strategyNumericInput";

const decimalInputProps = numericInputProps(strategyNumericContracts.decimal2);

export function Close({ data, setData }: CloseProps) {
  const { t } = useI18n();
  const close = data;

  const copy = useMemo(() => ({
    mode: t("dashboard.strategies.form.close.mode"),
    modeBasic: t("dashboard.strategies.form.close.modeBasic"),
    modeAdvanced: t("dashboard.strategies.form.close.modeAdvanced"),
    basicTitle: t("dashboard.strategies.form.close.basicTitle"),
    advancedTitle: t("dashboard.strategies.form.close.advancedTitle"),
    takeProfit: t("dashboard.strategies.form.close.takeProfit"),
    stopLoss: t("dashboard.strategies.form.close.stopLoss"),
    ttp: t("dashboard.strategies.form.close.ttp"),
    tsl: t("dashboard.strategies.form.close.tsl"),
    percent: t("dashboard.strategies.form.close.percent"),
    arm: t("dashboard.strategies.form.close.arm"),
    removeThreshold: t("dashboard.strategies.form.close.removeThreshold"),
    addThreshold: t("dashboard.strategies.form.close.addThreshold"),
  }), [t]);

  const setClose = (changes: Partial<CloseConditions>) =>
    setData((prev) => ({ ...prev, ...changes }));

  const addThreshold = (type: "ttp" | "tsl") => {
    setClose({
      [type]: [...(close[type] as Threshold[]), { percent: 0, arm: 0 }],
    });
  };

  const removeThreshold = (type: "ttp" | "tsl", idx: number) => {
    setClose({
      [type]: (close[type] as Threshold[]).filter((_, i) => i !== idx),
    });
  };

  const updateThreshold = (
    type: "ttp" | "tsl",
    idx: number,
    field: "percent" | "arm",
    value: number,
  ) => {
    setClose({
      [type]: (close[type] as Threshold[]).map((threshold, i) =>
        i === idx ? { ...threshold, [field]: value } : threshold,
      ),
    });
  };

  return (
    <div className="space-y-6">
      <RadioGroupField
        id="strategy-close-mode"
        label={copy.mode}
        value={close.mode}
        options={[
          { value: "basic", label: copy.modeBasic },
          { value: "advanced", label: copy.modeAdvanced },
        ]}
        onChange={(value) => setClose({ mode: value as "basic" | "advanced" })}
      />

      {close.mode === "basic" && (
        <FormSectionCard title={copy.basicTitle}>
          <FormGrid columns={2}>
            <NumberField
              id="strategy-close-tp"
              label={copy.takeProfit}
              value={close.tp}
              inputMode={decimalInputProps.inputMode}
              step={Number(decimalInputProps.step)}
              onChange={(value) => {
                const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                if (parsed == null) return;
                setClose({ tp: parsed });
              }}
            />
            <NumberField
              id="strategy-close-sl"
              label={copy.stopLoss}
              value={close.sl}
              inputMode={decimalInputProps.inputMode}
              step={Number(decimalInputProps.step)}
              onChange={(value) => {
                const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                if (parsed == null) return;
                setClose({ sl: parsed });
              }}
            />
          </FormGrid>
        </FormSectionCard>
      )}

      {close.mode === "advanced" && (
        <FormSectionCard title={copy.advancedTitle}>
          <FormGrid columns={2}>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-base-content/80">{copy.ttp}</p>
              {close.ttp.map((threshold, idx) => (
                <div key={`ttp-${idx}`} className="grid grid-cols-1 items-end gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <NumberField
                    id={`strategy-close-ttp-percent-${idx}`}
                    label={copy.percent}
                    value={threshold.percent}
                    inputMode={decimalInputProps.inputMode}
                    step={Number(decimalInputProps.step)}
                    onChange={(value) => {
                      const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                      if (parsed == null) return;
                      updateThreshold("ttp", idx, "percent", parsed);
                    }}
                  />
                  <NumberField
                    id={`strategy-close-ttp-arm-${idx}`}
                    label={copy.arm}
                    value={threshold.arm}
                    inputMode={decimalInputProps.inputMode}
                    step={Number(decimalInputProps.step)}
                    onChange={(value) => {
                      const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                      if (parsed == null) return;
                      updateThreshold("ttp", idx, "arm", parsed);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary w-full sm:w-auto"
                    title={copy.removeThreshold}
                    onClick={() => removeThreshold("ttp", idx)}
                  >
                    <LuTrash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline mt-2" onClick={() => addThreshold("ttp")}>
                {copy.addThreshold}
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-base-content/80">{copy.tsl}</p>
              {close.tsl.map((threshold, idx) => (
                <div key={`tsl-${idx}`} className="grid grid-cols-1 items-end gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <NumberField
                    id={`strategy-close-tsl-percent-${idx}`}
                    label={copy.percent}
                    value={threshold.percent}
                    inputMode={decimalInputProps.inputMode}
                    step={Number(decimalInputProps.step)}
                    onChange={(value) => {
                      const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                      if (parsed == null) return;
                      updateThreshold("tsl", idx, "percent", parsed);
                    }}
                  />
                  <NumberField
                    id={`strategy-close-tsl-arm-${idx}`}
                    label={copy.arm}
                    value={threshold.arm}
                    inputMode={decimalInputProps.inputMode}
                    step={Number(decimalInputProps.step)}
                    onChange={(value) => {
                      const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                      if (parsed == null) return;
                      updateThreshold("tsl", idx, "arm", parsed);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary w-full sm:w-auto"
                    title={copy.removeThreshold}
                    onClick={() => removeThreshold("tsl", idx)}
                  >
                    <LuTrash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline mt-2" onClick={() => addThreshold("tsl")}>
                {copy.addThreshold}
              </button>
            </div>
          </FormGrid>
        </FormSectionCard>
      )}
    </div>
  );
}
