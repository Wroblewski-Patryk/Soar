import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { toast } from "sonner";

import { I18nProvider } from "../../../i18n/I18nProvider";
import { useUser } from "../hooks/useUser";
import type { User } from "../types/user.type";
import BasicForm from "./BasicForm";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("../hooks/useUser", () => ({
  useUser: vi.fn(),
}));

const updateUserMock = vi.fn();
const mockUseUser = vi.mocked(useUser);

const profileUser: User = {
  id: "user-profile-test",
  email: "operator@example.com",
  name: "Operator One",
  avatarUrl: "",
  uiPreferences: {
    timeZonePreference: "UTC",
  },
  createdAt: new Date("2026-05-11T08:00:00.000Z"),
  updatedAt: new Date("2026-05-11T08:00:00.000Z"),
};

const renderForm = async () => {
  await act(async () => {
    render(
      <I18nProvider>
        <BasicForm />
      </I18nProvider>
    );
  });

  await waitFor(() => {
    expect(document.documentElement.lang).toBe("en");
  });
};

describe("BasicForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateUserMock.mockResolvedValue(undefined);
    mockUseUser.mockReturnValue({
      user: profileUser,
      updateUser: updateUserMock,
      fetchUser: vi.fn(),
      loading: false,
    });
  });

  it("submits profile changes with timezone preference and shows success feedback", async () => {
    await renderForm();

    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "Operator Updated" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Europe/Warsaw" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith({
        name: "Operator Updated",
        avatarUrl: "",
        uiPreferences: {
          timeZonePreference: "Europe/Warsaw",
        },
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Profile changes saved.");
  });

  it("keeps the form on screen and shows error feedback when profile save fails", async () => {
    updateUserMock.mockRejectedValueOnce(new Error("profile save failed"));

    await renderForm();

    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "Operator Failed" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith({
        name: "Operator Failed",
        avatarUrl: "",
        uiPreferences: {
          timeZonePreference: "UTC",
        },
      });
    });

    expect(toast.error).toHaveBeenCalledWith("Could not save profile changes.");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });

  it("keeps the profile editor stacked and width bounded on narrow screens", async () => {
    await renderForm();

    const form = screen.getByRole("button", { name: "Save changes" }).closest("form");
    const layout = form?.firstElementChild;
    const fields = screen.getByPlaceholderText("John Doe").closest(".flex-grow");

    expect(layout).toHaveClass("flex-col", "md:flex-row");
    expect(fields).toHaveClass("w-full", "min-w-0");
  });

  it("exposes stable labels and keeps the email field disabled and out of tab order", async () => {
    await renderForm();

    expect(screen.getByRole("textbox", { name: "Name / Nickname" })).toHaveAttribute(
      "name",
      "name"
    );
    expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("combobox", { name: "Time zone" })).toHaveAttribute(
      "aria-describedby",
      "profile-time-zone-hint"
    );
  });

  it("exposes one native keyboard-operable avatar action that opens the file chooser", async () => {
    await renderForm();

    const avatarAction = screen.getByRole("button", { name: "Add avatar" });
    const avatarInput = document.querySelector<HTMLInputElement>("#avatar-upload");
    expect(avatarInput).not.toBeNull();

    const openFileChooser = vi.spyOn(avatarInput!, "click");

    expect(avatarAction).toHaveAttribute("type", "button");
    avatarAction.focus();
    expect(avatarAction).toHaveFocus();

    fireEvent.click(avatarAction);

    expect(openFileChooser).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll("#avatar-upload")).toHaveLength(1);
  });

  it("renders one accessible avatar fallback when the avatar is absent", async () => {
    await renderForm();

    expect(screen.getByRole("img", { name: "Avatar" })).toHaveTextContent("O");
    expect(screen.queryByAltText("Avatar")).not.toBeInTheDocument();
  });

  it("renders one accessible avatar fallback when the avatar URL is malformed", async () => {
    mockUseUser.mockReturnValue({
      user: { ...profileUser, avatarUrl: "not a valid avatar URL" },
      updateUser: updateUserMock,
      fetchUser: vi.fn(),
      loading: false,
    });

    await renderForm();

    expect(screen.getByRole("img", { name: "Avatar" })).toHaveTextContent("O");
    expect(screen.queryByAltText("Avatar")).not.toBeInTheDocument();
  });

  it("replaces a failed avatar resource with the accessible fallback without an error loop", async () => {
    mockUseUser.mockReturnValue({
      user: { ...profileUser, avatarUrl: "https://cdn.example.com/avatar.png" },
      updateUser: updateUserMock,
      fetchUser: vi.fn(),
      loading: false,
    });

    await renderForm();

    fireEvent.error(screen.getByAltText("Avatar"));

    expect(screen.queryByAltText("Avatar")).not.toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: "Avatar" })).toHaveLength(1);
  });

  it("hydrates without an exception when the server and browser detect different time zones", async () => {
    const originalDateTimeFormat = Intl.DateTimeFormat;
    let detectedTimeZone = "UTC";
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(((...args: ConstructorParameters<typeof Intl.DateTimeFormat>) => {
      const formatter = new originalDateTimeFormat(...args);
      formatter.resolvedOptions = () => ({
        ...originalDateTimeFormat().resolvedOptions(),
        timeZone: detectedTimeZone,
      });
      return formatter;
    }) as typeof Intl.DateTimeFormat);

    window.localStorage.setItem("cryptosparrow-timezone", "auto");
    const view = (
      <I18nProvider>
        <BasicForm />
      </I18nProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(view);
    detectedTimeZone = "Europe/Warsaw";

    const recoverableErrors: unknown[] = [];
    const root = hydrateRoot(container, view, {
      onRecoverableError: (error) => recoverableErrors.push(error),
    });

    await act(async () => undefined);

    await act(async () => root.unmount());
    vi.mocked(Intl.DateTimeFormat).mockRestore();
    expect(recoverableErrors).toEqual([]);
  });
});
