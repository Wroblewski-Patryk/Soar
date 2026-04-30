import { useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { FormGrid, FormSectionCard, NumberField, RadioGroupField } from "@/ui/forms";
import { CloseConditions, CloseProps } from "../../types/StrategyForm.type";
import {
  numericInputProps,
  readNumericInputValue,
  strategyNumericContracts,
} from "../../utils/strategyNumericInput";
import { createThreshold } from "../../utils/strategyThresholdItems";
import { SortableThresholdListEditor } from "./SortableThresholdListEditor";

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
    dragThreshold: t("dashboard.strategies.form.reorderDrag"),
    moveThresholdUp: t("dashboard.strategies.form.reorderUp"),
    moveThresholdDown: t("dashboard.strategies.form.reorderDown"),
  }), [t]);

  const setClose = (changes: Partial<CloseConditions>) =>
    setData((prev) => ({ ...prev, ...changes }));

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
              <SortableThresholdListEditor
                items={close.ttp}
                fields={[
                  { key: "percent", label: copy.percent, idPrefix: "strategy-close-ttp-percent" },
                  { key: "arm", label: copy.arm, idPrefix: "strategy-close-ttp-arm" },
                ]}
                addLabel={copy.addThreshold}
                removeLabel={copy.removeThreshold}
                moveUpLabel={copy.moveThresholdUp}
                moveDownLabel={copy.moveThresholdDown}
                dragLabel={copy.dragThreshold}
                createItem={() => createThreshold()}
                onChange={(ttp) => setClose({ ttp })}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-base-content/80">{copy.tsl}</p>
              <SortableThresholdListEditor
                items={close.tsl}
                fields={[
                  { key: "percent", label: copy.percent, idPrefix: "strategy-close-tsl-percent" },
                  { key: "arm", label: copy.arm, idPrefix: "strategy-close-tsl-arm" },
                ]}
                addLabel={copy.addThreshold}
                removeLabel={copy.removeThreshold}
                moveUpLabel={copy.moveThresholdUp}
                moveDownLabel={copy.moveThresholdDown}
                dragLabel={copy.dragThreshold}
                createItem={() => createThreshold()}
                onChange={(tsl) => setClose({ tsl })}
              />
            </div>
          </FormGrid>
        </FormSectionCard>
      )}
    </div>
  );
}
