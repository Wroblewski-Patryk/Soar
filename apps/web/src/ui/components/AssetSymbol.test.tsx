import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AssetSymbol from "./AssetSymbol";

describe("AssetSymbol", () => {
  it("renders loading placeholder when icon is pending", () => {
    const { container } = render(<AssetSymbol symbol="BTCUSDT" loading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.getByText("BTCUSDT")).toBeInTheDocument();
  });

  it("renders icon image when url is provided", () => {
    render(<AssetSymbol symbol="ETHUSDT" iconUrl="https://example.com/eth.png" />);
    expect(screen.getByAltText("ETHUSDT icon")).toBeInTheDocument();
  });

  it("recovers image rendering when symbol or icon url changes after a failed load", () => {
    const { rerender } = render(<AssetSymbol symbol="BTCUSDT" iconUrl="https://example.com/btc-missing.png" />);

    fireEvent.error(screen.getByAltText("BTCUSDT icon"));
    expect(screen.queryByAltText("BTCUSDT icon")).not.toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();

    rerender(<AssetSymbol symbol="ETHUSDT" iconUrl="https://example.com/eth.png" />);

    expect(screen.getByAltText("ETHUSDT icon")).toBeInTheDocument();
    expect(screen.getByText("ETHUSDT")).toBeInTheDocument();
  });

  it("renders error-aware fallback badge when icon lookup fails", () => {
    render(<AssetSymbol symbol="XRPUSDT" hasError />);
    const fallback = screen.getByText("X");
    expect(fallback).toBeInTheDocument();
    expect(fallback.className).toContain("text-error");
  });
});
