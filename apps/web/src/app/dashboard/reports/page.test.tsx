import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ReportsPage from "./page";
import { I18nProvider } from "@/i18n/I18nProvider";

vi.mock("@/features/reports/components/PerformanceReportsView", () => ({
  default: () => <div data-testid="performance-reports-view">reports-view</div>,
}));

describe("Reports page", () => {
  it("renders the canonical reports route shell", () => {
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/dashboard/reports");

    render(
      <I18nProvider>
        <ReportsPage />
      </I18nProvider>
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb navigation" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("performance-reports-view")).toBeInTheDocument();
  });
});
