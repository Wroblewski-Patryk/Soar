import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

const readBuildIdFromFile = async (): Promise<string | null> => {
  try {
    const filePath = path.join(process.cwd(), ".next", "BUILD_ID");
    const buildId = (await readFile(filePath, "utf8")).trim();
    return buildId.length > 0 ? buildId : null;
  } catch {
    return null;
  }
};

type BuildMetadata = {
  generatedAt?: string;
  gitRef?: string | null;
  gitSha?: string | null;
  metadataSource?: string | null;
};

const readTrimmedEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return null;
};

const resolveGitShaFromEnv = () =>
  readTrimmedEnv(
    "SOURCE_COMMIT",
    "GITHUB_SHA",
    "COOLIFY_GIT_COMMIT_SHA",
    "VERCEL_GIT_COMMIT_SHA",
    "RAILWAY_GIT_COMMIT_SHA"
  );

const resolveGitRefFromEnv = () =>
  readTrimmedEnv(
    "SOURCE_BRANCH",
    "COOLIFY_BRANCH",
    "GITHUB_REF_NAME",
    "VERCEL_GIT_COMMIT_REF",
    "RAILWAY_GIT_BRANCH"
  );

const readBuildMetadataFromFile = async (): Promise<BuildMetadata | null> => {
  try {
    const filePath = path.join(process.cwd(), ".next", "BUILD_META.json");
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as BuildMetadata;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const resolveBuildId = async () => {
  const fileBuildId = await readBuildIdFromFile();
  if (fileBuildId) return fileBuildId;

  const envBuildId =
    process.env.NEXT_PUBLIC_APP_BUILD_ID?.trim() ||
    process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
    process.env.RAILWAY_GIT_COMMIT_SHA?.trim();
  if (envBuildId) return envBuildId;

  if (process.env.NODE_ENV === "production") {
    return "unknown-production-build";
  }

  return "development";
};

export async function GET() {
  const buildId = await resolveBuildId();
  const buildMetadata = await readBuildMetadataFromFile();
  const envGitSha = resolveGitShaFromEnv();
  const envGitRef = resolveGitRefFromEnv();
  const gitSha = buildMetadata?.gitSha ?? envGitSha ?? null;
  const gitRef = buildMetadata?.gitRef ?? envGitRef ?? null;
  const metadataSource =
    buildMetadata?.metadataSource ??
    (envGitSha || envGitRef ? "env-runtime" : null);

  return NextResponse.json(
    {
      buildId,
      gitSha,
      gitRef,
      metadataGeneratedAt: buildMetadata?.generatedAt ?? null,
      metadataSource,
      checkedAt: buildMetadata?.generatedAt ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
