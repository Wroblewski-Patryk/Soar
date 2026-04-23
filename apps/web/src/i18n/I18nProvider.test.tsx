import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "./I18nProvider";
import LanguageSwitcher from "../ui/layout/dashboard/LanguageSwitcher";

describe("I18nProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses EN by default and allows switching to PL and PT", async () => {
    window.localStorage.removeItem("cryptosparrow-locale");
    window.localStorage.removeItem("cryptosparrow-timezone");

    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    );

    const toggle = screen.getByLabelText("Language");
    expect(toggle).toHaveTextContent("English");
    expect(document.documentElement.lang).toBe("en");

    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole("button", { name: /polski|polish/i }));

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("pl");
      expect(window.localStorage.getItem("cryptosparrow-locale")).toBe("pl");
      expect(screen.getByLabelText(/language|jezyk|idioma/i)).toHaveTextContent("Polski");
    });

    fireEvent.click(screen.getByLabelText(/language|jezyk|idioma/i));
    fireEvent.click(screen.getByRole("button", { name: /portugalski|portuguese|portugues/i }));

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("pt");
      expect(window.localStorage.getItem("cryptosparrow-locale")).toBe("pt");
      expect(screen.getByLabelText(/language|jezyk|idioma/i)).toHaveTextContent("Portugues");
    });
  });

  it("hydrates locale from storage on first render without act warnings", async () => {
    window.localStorage.setItem("cryptosparrow-locale", "pt");
    window.localStorage.removeItem("cryptosparrow-timezone");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("pt");
      expect(screen.getByLabelText(/language|jezyk|idioma/i)).toHaveTextContent("Portugues");
    });

    const actWarnings = errorSpy.mock.calls.filter(([message]) =>
      String(message).includes("not wrapped in act")
    );

    expect(actWarnings).toHaveLength(0);
  });
});
