import { readFile } from "node:fs/promises";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const fsMocks = vi.hoisted(() => ({
  readFile: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: fsMocks.readFile,
  },
  readFile: fsMocks.readFile,
}));

const mockedReadFile = vi.mocked(readFile);

const withEnv = async (
  values: Record<string, string | undefined>,
  callback: () => Promise<void>
) => {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, process.env[key]);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    await callback();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
};

describe("build-info route", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("uses trimmed runtime env metadata when build files are unavailable", async () => {
    mockedReadFile.mockRejectedValue(new Error("missing"));

    await withEnv(
      {
        NODE_ENV: "test",
        NEXT_PUBLIC_APP_BUILD_ID: " local-build ",
        SOURCE_COMMIT: " abc123 ",
        SOURCE_BRANCH: " main ",
      },
      async () => {
        const response = await GET();
        const body = await response.json();

        expect(body).toMatchObject({
          buildId: "local-build",
          gitSha: "abc123",
          gitRef: "main",
          metadataGeneratedAt: null,
          metadataSource: "env-runtime",
        });
        expect(response.headers.get("Cache-Control")).toContain("no-store");
      }
    );
  });

  it("prefers build metadata files over runtime env git fields", async () => {
    mockedReadFile
      .mockRejectedValueOnce(new Error("missing build id"))
      .mockResolvedValueOnce(
        JSON.stringify({
          generatedAt: "2026-06-07T00:00:00.000Z",
          gitSha: "file-sha",
          gitRef: "release/web",
          metadataSource: "build-script",
        })
      );

    await withEnv(
      {
        NODE_ENV: "test",
        NEXT_PUBLIC_APP_BUILD_ID: undefined,
        SOURCE_COMMIT: "env-sha",
        SOURCE_BRANCH: "env-branch",
      },
      async () => {
        const response = await GET();
        const body = await response.json();

        expect(body).toMatchObject({
          buildId: "development",
          gitSha: "file-sha",
          gitRef: "release/web",
          metadataGeneratedAt: "2026-06-07T00:00:00.000Z",
          metadataSource: "build-script",
        });
      }
    );
  });
});
