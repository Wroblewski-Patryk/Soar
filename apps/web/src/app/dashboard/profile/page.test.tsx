import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProfilePage from "./page";
import { I18nProvider } from "@/i18n/I18nProvider";

vi.mock("@/features/profile/components/BasicForm", () => ({
  default: () => <div data-testid="profile-basic-view">basic-view</div>,
}));

vi.mock("@/features/profile/components/Subscription", () => ({
  default: () => <div data-testid="profile-subscription-view">subscription-view</div>,
}));

vi.mock("@/features/profile/components/Security", () => ({
  default: () => <div data-testid="profile-security-view">security-view</div>,
}));

vi.mock("@/features/exchanges/components/ExchangeConnectionsView", () => ({
  default: () => <div data-testid="profile-api-view">api-view</div>,
}));

const renderPage = (route: string) => {
  window.localStorage.setItem("cryptosparrow-locale", "en");
  window.history.pushState({}, "", route);

  render(
    <I18nProvider>
      <ProfilePage />
    </I18nProvider>
  );
};

describe("Profile page", () => {
  it("renders the canonical profile route with the default basic tab", async () => {
    renderPage("/dashboard/profile");

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: "Breadcrumb navigation" })).toBeInTheDocument();
    expect(screen.getByTestId("profile-basic-view")).toBeInTheDocument();
    expect(screen.queryByTestId("profile-api-view")).not.toBeInTheDocument();
  });

  it("honors the canonical #api hash entrypoint for API key management", async () => {
    renderPage("/dashboard/profile#api");

    await waitFor(() => {
      expect(screen.getByTestId("profile-api-view")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("profile-basic-view")).not.toBeInTheDocument();
  });
});
