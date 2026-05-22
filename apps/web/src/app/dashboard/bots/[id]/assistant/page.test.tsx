import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const botsManagementMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useParams: () => ({
    id: "bot-456",
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
import BotAssistantPage from "./page";

describe("Bot assistant page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    botsManagementMock.mockClear();
  });

  it("renders localized assistant breadcrumbs and locks assistant tab for the selected bot", () => {
    window.localStorage.setItem("cryptosparrow-locale", "pl");
    window.history.pushState({}, "", "/dashboard/bots/bot-456/assistant");

    render(
      <I18nProvider>
        <BotAssistantPage />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Boty" })).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveTextContent("Asystent");
    expect(botsManagementMock).toHaveBeenCalledWith({
      initialTab: "assistant",
      lockedTab: "assistant",
      preferredBotId: "bot-456",
    });
  });
});
