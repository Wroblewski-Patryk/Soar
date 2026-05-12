import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
});
