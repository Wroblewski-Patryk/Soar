import { render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { I18nContext, type I18nContextValue } from "@/i18n/I18nProvider";
import AppRootLayout from "./layout";
import PublicRootLayout from "./(public)/layout";
import DashboardRootLayout from "./dashboard/layout";
import manifest from "./manifest";
import LoginPage from "@/features/auth/pages/LoginPage";

const replace = vi.fn();
let authUser: unknown = null;

vi.mock("next/font/google", () => ({
  Lato: () => ({ variable: "font-body-test" }),
  Titillium_Web: () => ({ variable: "font-heading-test" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

vi.mock("sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: () => ({ user: authUser }),
}));

vi.mock("../ui/pwa/ServiceWorkerRegistration", () => ({
  default: () => <div data-testid="service-worker-registration" />,
}));

vi.mock("../ui/components/SkipToContentLink", () => ({
  default: () => <a href="#main-content">Skip to content</a>,
}));

vi.mock("../ui/layout/public/Header", () => ({
  default: () => <header data-testid="public-header" />,
}));

vi.mock("../ui/layout/public/Footer", () => ({
  default: () => <footer data-testid="public-footer" />,
}));

vi.mock("../ui/layout/dashboard/Header", () => ({
  default: () => <header data-testid="dashboard-header" />,
}));

vi.mock("../ui/layout/dashboard/Footer", () => ({
  default: () => <footer data-testid="dashboard-footer" />,
}));

vi.mock("../ui/layout/dashboard/DashboardRouteProgress", () => ({
  default: () => <div data-testid="dashboard-route-progress" />,
}));

vi.mock("@/features/auth/components/LoginForm", () => ({
  default: () => <form aria-label="login form" />,
}));

const i18nContext: I18nContextValue = {
  locale: "en",
  setLocale: () => undefined,
  timeZone: "UTC",
  timeZonePreference: "UTC",
  setTimeZonePreference: () => undefined,
  t: (key) =>
    ({
      "auth.page.login.title": "Sign in to Soar",
      "auth.page.login.description": "Access your trading dashboard.",
    })[key] ?? key,
};

describe("app route shells", () => {
  beforeEach(() => {
    replace.mockClear();
    authUser = null;
  });

  it("wraps the top-level app with auth, toast, service worker and skip-link chrome", () => {
    const html = renderToStaticMarkup(
      <AppRootLayout>
        <main id="main-content">Content</main>
      </AppRootLayout>
    );

    expect(html).toContain('data-theme="light"');
    expect(html).toContain("font-body-test");
    expect(html).toContain("font-heading-test");
    expect(html).toContain("Skip to content");
    expect(html).toContain('data-testid="toaster"');
    expect(html).toContain('data-testid="service-worker-registration"');
    expect(html).toContain('data-testid="auth-provider"');
  });

  it("keeps public and dashboard segment layouts on the shared main-content landmark", () => {
    const publicHtml = renderToStaticMarkup(
      <PublicRootLayout>
        <span>Public content</span>
      </PublicRootLayout>
    );
    const dashboardHtml = renderToStaticMarkup(
      <DashboardRootLayout>
        <span>Dashboard content</span>
      </DashboardRootLayout>
    );

    expect(publicHtml).toContain('data-testid="public-header"');
    expect(publicHtml).toContain('id="main-content"');
    expect(publicHtml).toContain('data-testid="public-footer"');
    expect(dashboardHtml).toContain('data-testid="dashboard-header"');
    expect(dashboardHtml).toContain('id="main-content"');
    expect(dashboardHtml).toContain('data-testid="dashboard-footer"');
  });

  it("returns installable PWA manifest metadata", () => {
    expect(manifest()).toMatchObject({
      name: "Soar",
      short_name: "Soar",
      start_url: "/",
      display: "standalone",
      theme_color: "#2563eb",
    });
    expect(manifest().icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: "/icons/icon-192.png", sizes: "192x192" }),
        expect.objectContaining({ purpose: "maskable" }),
      ])
    );
  });

  it("renders localized login page copy and redirects authenticated users", async () => {
    authUser = { id: "user-1" };

    render(
      <I18nContext.Provider value={i18nContext}>
        <LoginPage />
      </I18nContext.Provider>
    );

    expect(screen.getByRole("heading", { name: "Sign in to Soar" })).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "login form" })).toBeInTheDocument();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
  });
});
