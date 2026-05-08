-- EXCHANGE2-01: add Gate.io exchange placeholder (fail-closed rollout)
ALTER TYPE "Exchange" ADD VALUE IF NOT EXISTS 'GATEIO';
