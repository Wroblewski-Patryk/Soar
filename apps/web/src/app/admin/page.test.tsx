import { describe, expect, it, vi } from "vitest";

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  usePathname: () => (typeof window === "undefined" ? "/" : window.location.pathname || "/"),
}));

describe("Admin index page", () => {
  it("redirects to canonical subscriptions route", async () => {
    const { default: AdminIndexPage } = await import("./page");

    AdminIndexPage();

    expect(redirectMock).toHaveBeenCalledWith("/admin/subscriptions");
  });
});
