import test from 'node:test';
import assert from 'node:assert/strict';

import { validateOperatorUnblockPacket } from './checkOperatorUnblockPacket.mjs';

const completePacket = (overrides = {}) => ({
  id: 'V1-OPERATOR-UNBLOCK-PACKET-DD1A1FAF-2026-05-20',
  date: '2026-05-20',
  status: 'NO-GO',
  target: {
    webBaseUrl: 'https://soar.luckysparrow.ch',
    apiBaseUrl: 'https://api.soar.luckysparrow.ch',
    gitSha: 'dd1a1faf79f8ac3581ca0a8c983481a3e30327ac',
    gitRef: 'main',
    buildInfoCheckedAt: '2026-05-20T20:56:14.532Z',
  },
  evidence: {
    preflight: 'docs/operations/v1-final-preflight-dd1a1faf-2026-05-20.md',
    preflightJson: 'docs/operations/_artifacts-v1-final-preflight-dd1a1faf-2026-05-20.json',
    protectedInputReadiness: 'docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-20.md',
    protectedInputReadinessJson: 'docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-20.json',
  },
  protectedInputReadiness: {
    matchingProtectedInputNames: 0,
    status: 'BLOCKED',
  },
  requiredInputs: [
    'LIVEIMPORT_READBACK_AUTH_TOKEN or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD',
    'ROLLBACK_GUARD_AUTH_TOKEN or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD',
    'PROD_UI_AUDIT_AUTH_TOKEN or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD',
    'PROD_UI_AUDIT_ADMIN_TOKEN or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD',
    'PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME',
    'Engineering/Product/Operations/RC owner names and RC owner contact',
  ],
  remainingProofSteps: [
    'no-secret final preflight',
    'protected input readiness sweep',
    'build-info wait if needed',
    'production DB restore drill PASS',
    'LIVEIMPORT-03 protected runtime readback',
    'rollback proof PASS',
    'Gate 2 production SLO evidence PASS',
    'Gate 4 sign-off APPROVED',
    'strict RC evidence check PASS',
    'production UI clickthrough PASS',
    'final release gate ready',
    'generated V1 state refresh',
  ],
  forbiddenWithoutExplicitApproval: [
    'production data mutation beyond approved proof scope',
    'LIVE order submit/cancel/close',
    'exchange-side mutation',
    'existing production data mutation',
    'fabricated approval or substituting public smoke for protected proof',
  ],
  acceptanceRule:
    'Final release gate ready with same-date protected, redacted, secret-free evidence for the deployed target.',
  ...overrides,
});

const allPathsExist = () => true;

test('validateOperatorUnblockPacket passes a complete no-secret packet', () => {
  const result = validateOperatorUnblockPacket(completePacket(), {
    exists: allPathsExist,
    expectedSha: 'dd1a1faf79f8ac3581ca0a8c983481a3e30327ac',
  });

  assert.equal(result.status, 'PASS');
  assert.equal(result.target.statusOk, true);
  assert.equal(result.protectedInputReadiness.matchingProtectedInputNames, 0);
});

test('validateOperatorUnblockPacket fails on SHA mismatch', () => {
  const result = validateOperatorUnblockPacket(completePacket(), {
    exists: allPathsExist,
    expectedSha: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  });

  assert.equal(result.status, 'FAIL');
  assert.equal(result.target.targetShaOk, false);
});

test('validateOperatorUnblockPacket fails when evidence paths are missing', () => {
  const result = validateOperatorUnblockPacket(completePacket(), {
    exists: (relativePath) => !String(relativePath).endsWith('.json'),
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.evidence.missingPaths, [
    {
      key: 'preflightJson',
      path: 'docs/operations/_artifacts-v1-final-preflight-dd1a1faf-2026-05-20.json',
    },
    {
      key: 'protectedInputReadinessJson',
      path: 'docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-20.json',
    },
  ]);
});

test('validateOperatorUnblockPacket fails when protected input families are incomplete', () => {
  const result = validateOperatorUnblockPacket(
    completePacket({
      requiredInputs: ['LIVEIMPORT_READBACK_AUTH_TOKEN'],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.requiredInputs.missingFragments, [
    'ROLLBACK_GUARD_AUTH_TOKEN',
    'PROD_UI_AUDIT_AUTH_TOKEN',
    'PROD_UI_AUDIT_ADMIN_TOKEN',
    'PROD_DB_CHECK_CONTAINER',
    'Engineering/Product/Operations/RC owner names',
  ]);
});

test('validateOperatorUnblockPacket fails without the acceptance rule', () => {
  const result = validateOperatorUnblockPacket(
    completePacket({
      acceptanceRule: 'Looks good.',
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.acceptanceRule.missingFragments, [
    'Final release gate ready',
    'same-date protected',
    'redacted',
    'secret-free evidence',
    'deployed target',
  ]);
});
