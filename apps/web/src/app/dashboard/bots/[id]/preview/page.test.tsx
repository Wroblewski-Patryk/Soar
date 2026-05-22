import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const botsManagementMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useParams: () => ({
    id: "bot-789",
  }),
  usePathname: () => (typeof window === "undefined" ? "/" : window.location.pathname || "/"),
}));

vi.mock("@/features/bots/components/BotsManagement", () => ({
  default: (props: unknown) => {
    botsManagementMock(props);
    return <div data-testid="bots-management" />;
  },
}));

import { I18nProvider } from "@/i18n/I18nProvider";
import BotPreviewPage from "./page";

describe("Bot preview page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    botsManagementMock.mockClear();
  });

  it("renders localized preview breadcrumbs and locks monitoring tab for the selected bot", () => {
    window.localStorage.setItem("cryptosparrow-locale", "pl");
    window.history.pushState({}, "", "/dashboard/bots/bot-789/preview");

    render(
      <I18nProvider>
        <BotPreviewPage />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Boty" })).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveTextContent("Podglad");
    expect(botsManagementMock).toHaveBeenCalledWith({
      initialTab: "monitoring",
      lockedTab: "monitoring",
      preferredBotId: "bot-789",
    });
  });
});
