/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { resolveIsolatedTestDatabaseUrl } from "./testDatabaseUrl";

loadEnv({ path: fileURLToPath(new URL("./.env", import.meta.url)), quiet: true });
process.env.DATABASE_URL = resolveIsolatedTestDatabaseUrl({
  runtimeUrl: process.env.DATABASE_URL,
  explicitTestUrl: process.env.TEST_DATABASE_URL,
});

export default defineConfig({
  test: {
    fileParallelism: false,
    testTimeout: 15_000,
    sequence: {
      concurrent: false,
    },
  },
});
