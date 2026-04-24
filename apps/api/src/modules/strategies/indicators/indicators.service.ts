import { getStrategyIndicatorRegistry } from '../../engine/strategyIndicatorRegistry';

export function getIndicators() {
  return getStrategyIndicatorRegistry().map((indicator) => ({
    name: indicator.name,
    group: indicator.group,
    type: indicator.type,
    params: indicator.params,
    dataRequirement: indicator.dataRequirement,
    outputs: indicator.outputs,
    defaultPanel: indicator.defaultPanel,
    supportedModes: indicator.supportedModes,
    operators: indicator.operators,
  }));
}
