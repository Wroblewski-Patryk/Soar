import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderDcaLadderCell } from "./dcaLadderCell";

describe("renderDcaLadderCell", () => {
  it("renders zero when dcaCount is not positive", () => {
    render(<>{renderDcaLadderCell({ dcaCount: 0 })}</>);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders warning pill count when no executed or planned levels are available", () => {
    render(<>{renderDcaLadderCell({ dcaCount: 2 })}</>);

    const badge = screen.getByText("2");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-warning");
    expect(document.querySelector("details")).toBeNull();
  });

  it("renders expandable ladder preview from executed levels", () => {
    const { container } = render(
      <>{renderDcaLadderCell({ id: "position-1", dcaCount: 2, dcaExecutedLevels: [1.25, 2.5] })}</>,
    );

    const summaryBadge = screen.getByTitle("1:1.25%, 2:2.50%");
    expect(summaryBadge).toBeInTheDocument();

    const details = container.querySelector("details");
    expect(details).not.toBeNull();

    fireEvent.click(summaryBadge);

    expect(screen.getByText("1.25%")).toBeInTheDocument();
    expect(screen.getByText("2.50%")).toBeInTheDocument();
  });

  it("falls back to planned levels and custom formatting when executed levels are absent", () => {
    const customFormat = (value: number) => `${value.toFixed(1)} pct`;
    const { container } = render(
      <>
        {renderDcaLadderCell({
          id: "position-2",
          dcaCount: 3,
          dcaPlannedLevels: [1.1, 2.2],
          formatLevel: customFormat,
        })}
      </>,
    );

    const summaryBadge = screen.getByTitle("1:1.1 pct, 2:2.2 pct, 3:2.2 pct");
    fireEvent.click(summaryBadge);

    expect(container.textContent).toContain("1.1 pct");
    expect(container.textContent).toContain("2.2 pct");
  });
});
