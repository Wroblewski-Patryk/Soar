import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  type AssistantDecision,
  orchestrateAssistantDecision,
} from './assistantOrchestrator.service';

type ProtocolScenario = {
  test_name: string;
  risk_area:
    | 'memory_consistency'
    | 'multi_step_context'
    | 'adversarial'
    | 'role_break'
    | 'memory_corruption'
    | 'edge_case'
    | 'security';
  classification: 'executable_foundation' | 'not_applicable_foundation_only';
  reason?: string;
  input?: {
    mandate?: string;
    forbiddenActions?: AssistantDecision[];
    outputs?: Array<{
      slotIndex: number;
      proposal: AssistantDecision;
      confidence: number;
      rationale: string;
    }>;
  };
  expected?: {
    finalDecision?: AssistantDecision;
    finalReason?: string;
    traceMustNotContain?: string[];
    outputConfidence?: number[];
  };
};

const scenarioPath = path.resolve(
  process.cwd(),
  '..',
  '..',
  'history',
  'artifacts',
  'ai-assistant-foundation-protocol-scenarios-2026-05-23.json'
);

const suite = JSON.parse(readFileSync(scenarioPath, 'utf8')) as {
  scope: string;
  scenarios: ProtocolScenario[];
};

const baseInput = {
  requestId: 'protocol-req-1',
  userId: 'user-1',
  botId: 'bot-protocol-1',
  botMarketGroupId: 'dry-run',
  symbol: 'BTCUSDT',
  intervalWindow: '5m',
  mode: 'PAPER' as const,
};

describe('assistant foundation AI protocol scenarios', () => {
  it('keeps every AI_TESTING_PROTOCOL risk area represented', () => {
    expect(suite.scope).toBe('foundation_dry_run_only');
    expect(new Set(suite.scenarios.map((scenario) => scenario.risk_area))).toEqual(
      new Set([
        'memory_consistency',
        'multi_step_context',
        'adversarial',
        'role_break',
        'memory_corruption',
        'edge_case',
        'security',
      ])
    );
  });

  it('classifies non-runtime AI scenarios without claiming full AI behavior proof', () => {
    const notApplicable = suite.scenarios.filter(
      (scenario) => scenario.classification === 'not_applicable_foundation_only'
    );

    expect(notApplicable.length).toBeGreaterThan(0);
    for (const scenario of notApplicable) {
      expect(scenario.reason).toMatch(/current assistant foundation/i);
    }
  });

  it('executes foundation-applicable scenarios against deterministic orchestration', async () => {
    const executable = suite.scenarios.filter(
      (scenario) => scenario.classification === 'executable_foundation'
    );

    expect(executable.length).toBeGreaterThan(0);

    for (const scenario of executable) {
      const outputs = scenario.input?.outputs ?? [];
      const subagents = outputs.map((output) => ({
        slotIndex: output.slotIndex,
        role: `SCENARIO_${output.slotIndex}`,
        enabled: true,
        timeoutMs: 200,
      }));
      const captured: unknown[] = [];

      const trace = await orchestrateAssistantDecision(
        {
          ...baseInput,
          requestId: `protocol:${scenario.test_name}`,
          botId: `bot:${scenario.test_name}`,
          mandate: scenario.input?.mandate,
          forbiddenActions: scenario.input?.forbiddenActions,
          subagents,
        },
        {
          planner: {
            createPlan: vi.fn(async () => ({
              planId: `plan:${scenario.test_name}`,
              steps: subagents.map((slot) => ({
                slotIndex: slot.slotIndex,
                role: slot.role,
                task: `run ${scenario.test_name}`,
              })),
            })),
          },
          subagentGateway: {
            runStep: vi.fn(async (_input, step) => {
              const output = outputs.find((candidate) => candidate.slotIndex === step.slotIndex);
              if (!output) throw new Error(`missing output for slot ${step.slotIndex}`);
              return {
                proposal: output.proposal,
                confidence: output.confidence,
                rationale: output.rationale,
              };
            }),
          },
          traceWriter: {
            write: vi.fn(async (writtenTrace) => {
              captured.push(writtenTrace);
            }),
          },
          nowMs: () => 1000,
        }
      );

      expect(trace.finalDecision, scenario.test_name).toBe(scenario.expected?.finalDecision);
      expect(trace.finalReason, scenario.test_name).toBe(scenario.expected?.finalReason);

      if (scenario.expected?.outputConfidence) {
        expect(trace.outputs.map((output) => output.confidence), scenario.test_name).toEqual(
          scenario.expected.outputConfidence
        );
      }

      const serializedTrace = JSON.stringify(captured[0] ?? trace);
      for (const forbiddenText of scenario.expected?.traceMustNotContain ?? []) {
        expect(serializedTrace, scenario.test_name).not.toContain(forbiddenText);
      }
    }
  });
});
