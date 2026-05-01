import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LogsPage from "./page";
import { I18nProvider } from "@/i18n/I18nProvider";

vi.mock("@/features/logs/components/AuditTrailView", () => ({
  default: () => <div data-testid="audit-trail-view">audit-view</div>,
}));

describe("Logs page", () => {
  it("renders the canonical audit route shell", () => {
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/dashboard/logs");

    render(
      <I18nProvider>
        <LogsPage />
      </I18nProvider>
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: "Breadcrumb navigation" })).toBeInTheDocument();
    expect(screen.getByTestId("audit-trail-view")).toBeInTheDocument();
  });
});
