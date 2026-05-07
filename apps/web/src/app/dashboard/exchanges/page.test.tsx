import { describe, expect, it, vi } from "vitest";

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  usePathname: () => (typeof window === "undefined" ? "/" : window.location.pathname || "/"),
}));

describe("Exchanges page", () => {
  it("redirects to the canonical profile API tab", async () => {
    const { default: ExchangesPage } = await import("./page");

    await ExchangesPage();

    expect(redirectMock).toHaveBeenCalledWith("/dashboard/profile#api");
  });
});
