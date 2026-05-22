import type { NextConfig } from "next";
import { createHash } from "node:crypto";
import { themeBootstrapScript } from "./src/security/themeBootstrap";

const themeBootstrapScriptSha256 = createHash("sha256")
  .update(themeBootstrapScript)
  .digest("base64");

const uniqueValues = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const originFromUrl = (value: string | undefined) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
};

const productionConnectSources = () =>
  uniqueValues([
    "'self'",
    "https://api.soar.luckysparrow.ch",
    "https://stage-api.soar.luckysparrow.ch",
    originFromUrl(process.env.NEXT_PUBLIC_API_BASE_URL) ?? "",
  ]).join(" ");

const buildCsp = (nodeEnv: string | undefined) => {
  const isDev = nodeEnv === "development";
  const scriptSources = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";
  const connectSources = isDev
    ? "connect-src 'self' http: https: ws: wss:"
    : `connect-src ${productionConnectSources()}`;

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    scriptSources,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    connectSources,
    "form-action 'self'",
  ].join("; ");
};

const nextConfig: NextConfig = {
  async headers() {
    const csp = buildCsp(process.env.NODE_ENV);
    const headers = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
      },
    ];
    if (process.env.NODE_ENV === "production") {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }
    return [
      {
        source: "/:path*",
        headers,
      },
    ];
  },
};

export { buildCsp };
export { themeBootstrapScriptSha256 };
export default nextConfig;
