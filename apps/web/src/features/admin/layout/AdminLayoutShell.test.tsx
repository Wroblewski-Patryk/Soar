import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminLayoutShell from "./AdminLayoutShell";
import { I18nProvider } from "@/i18n/I18nProvider";

const authState = vi.hoisted(() => ({
  user: { email: "admin@example.com", userId: "admin-1", role: "ADMIN" } as
    | { email: string; userId: string; role?: "ADMIN" | "USER" }
    | null,
  loading: false,
}));
const routerPushMock = vi.hoisted(() => vi.fn());

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => authState,
}));

vi.mock("@/ui/components/FooterPreferencesSwitchers", () => ({
  default: () => <div data-testid="footer-preferences" />,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/users",
  useRouter: () => ({ push: routerPushMock }),
}));

const renderShell = () =>
  render(
    <I18nProvider>
      <AdminLayoutShell>
        <div>admin-content</div>
      </AdminLayoutShell>
    </I18nProvider>
  );

describe("AdminLayoutShell", () => {
  beforeEach(() => {
    authState.user = { email: "admin@example.com", userId: "admin-1", role: "ADMIN" };
    authState.loading = false;
    routerPushMock.mockClear();
  });

  it("renders admin navigation only for confirmed admin users", async () => {
    renderShell();

    expect(await screen.findByText("admin-content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Subscriptions" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Users" })).toBeInTheDocument();
  });

  it("withholds admin shell content for authenticated non-admin users", async () => {
    authState.user = { email: "user@example.com", userId: "user-1", role: "USER" };

    renderShell();

    expect(await screen.findByText("Admin access required")).toBeInTheDocument();
    expect(screen.queryByText("admin-content")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Subscriptions" })).not.toBeInTheDocument();
    expect(routerPushMock).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated admin visits to login", async () => {
    authState.user = null;

    renderShell();

    expect(await screen.findByText("Admin access required")).toBeInTheDocument();
    expect(routerPushMock).toHaveBeenCalledWith("/auth/login");
  });
});
