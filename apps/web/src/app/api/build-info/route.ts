import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = false;

const githubBranchApiUrl =
  "https://api.github.com/repos/Wroblewski-Patryk/Soar/commits/main";

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
    "COOLIFY_GIT_BRANCH",
    "COOLIFY_BRANCH",
    "GITHUB_REF_NAME",
    "VERCEL_GIT_COMMIT_REF",
    "RAILWAY_GIT_BRANCH"
  );

const resolveGitShaFromGithubBranch = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(githubBranchApiUrl, {
      cache: "no-store",
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": "soar-web-build-info",
      },
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as { sha?: unknown };
    return typeof payload.sha === "string" && payload.sha.trim()
      ? payload.sha.trim()
      : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const readBuildMetadataFromFile = async (): Promise<BuildMetadata | null> => {
  const candidatePaths = [
    path.join(process.cwd(), ".build-meta", "BUILD_META.json"),
    path.join(process.cwd(), ".next", "BUILD_META.json"),
  ];

  for (const filePath of candidatePaths) {
    try {
      const raw = await readFile(filePath, "utf8");
      const parsed = JSON.parse(raw) as BuildMetadata;
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      // Try the next metadata location.
    }
  }

  return null;
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
  const githubGitSha =
    buildMetadata?.gitSha || envGitSha ? null : await resolveGitShaFromGithubBranch();
  const gitSha = buildMetadata?.gitSha ?? envGitSha ?? githubGitSha ?? null;
  const gitRef = buildMetadata?.gitRef ?? envGitRef ?? null;
  const fileMetadataSource =
    buildMetadata?.metadataSource && buildMetadata.metadataSource !== "unknown"
      ? buildMetadata.metadataSource
      : null;
  const metadataSource =
    fileMetadataSource ??
    (envGitSha || envGitRef ? "env-runtime" : null) ??
    (githubGitSha ? "github-branch-runtime" : null) ??
    buildMetadata?.metadataSource ??
    null;
  const checkedAt = new Date().toISOString();

  return NextResponse.json(
    {
      buildId,
      gitSha,
      gitRef,
      metadataGeneratedAt: buildMetadata?.generatedAt ?? null,
      metadataSource,
      checkedAt,
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
