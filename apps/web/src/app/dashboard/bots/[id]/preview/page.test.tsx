import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const pageTitleMock = vi.hoisted(() => vi.fn());
const botsManagementMock = vi.hoisted(() => vi.fn());

vi.mock("@/ui/layout/dashboard/PageTitle", () => ({
  PageTitle: (props: {
    title: string;
    breadcrumb?: Array<{ label: string }>;
  }) => {
    pageTitleMock(props);
    return (
      <div>
        <h1>{props.title}</h1>
        <nav aria-label="breadcrumb">
          {(props.breadcrumb ?? []).map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </nav>
      </div>
    );
  },
}));

vi.mock("@/features/bots/components/BotsManagement", () => ({
  default: (props: {
    initialTab: string;
    lockedTab?: string;
    preferredBotId?: string;
  }) => {
    botsManagementMock(props);
    return <div data-testid="bots-management">{props.initialTab}:{props.preferredBotId}</div>;
  },
}));

describe("Bots preview page", () => {
  it("renders the canonical monitoring shell for the selected bot", async () => {
    const { default: BotPreviewPage } = await import("./page");
    const ui = await BotPreviewPage({
      params: Promise.resolve({ id: "bot-777" }),
    });

    render(ui);

    expect(screen.getByRole("heading", { name: "Bots" })).toBeInTheDocument();
    expect(screen.getByLabelText("breadcrumb")).toHaveTextContent("Dashboard");
    expect(screen.getByLabelText("breadcrumb")).toHaveTextContent("Bots");
    expect(screen.getByLabelText("breadcrumb")).toHaveTextContent("Preview");
    expect(screen.getByTestId("bots-management")).toHaveTextContent("monitoring:bot-777");
    expect(pageTitleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Bots",
      })
    );
    expect(botsManagementMock).toHaveBeenCalledWith({
      initialTab: "monitoring",
      lockedTab: "monitoring",
      preferredBotId: "bot-777",
    });
  });
});
