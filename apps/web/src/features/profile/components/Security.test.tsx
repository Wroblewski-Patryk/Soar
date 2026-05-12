import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";

import { I18nProvider } from "../../../i18n/I18nProvider";
import { changePassword } from "../services/security.service";
import SecurityPanel from "./Security";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("../services/security.service", () => ({
  changePassword: vi.fn(),
  deleteAccount: vi.fn(),
}));

describe("SecurityPanel", () => {
  const mockChangePassword = vi.mocked(changePassword);

  beforeEach(() => {
    vi.clearAllMocks();
    mockChangePassword.mockResolvedValue(undefined);
  });

  const renderPanel = async () => {
    window.history.pushState({}, "", "/dashboard/profile");
    await act(async () => {
      render(
        <I18nProvider>
          <SecurityPanel />
        </I18nProvider>
      );
    });
    await waitFor(() => {
      expect(document.documentElement.lang).toBe("en");
    });
  };

  it("hides passwords by default and toggles visibility per field", async () => {
    await renderPanel();

    const currentPasswordInput = screen.getByLabelText("Current password");
    const newPasswordInput = screen.getByLabelText("New password");
    const confirmPasswordInput = screen.getByLabelText("Confirm new password");
    const deletePasswordInput = screen.getByLabelText("Enter password to confirm");

    expect(currentPasswordInput).toHaveAttribute("type", "password");
    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(deletePasswordInput).toHaveAttribute("type", "password");

    const showButtons = screen.getAllByRole("button", { name: /show password/i });
    expect(showButtons).toHaveLength(4);

    fireEvent.click(showButtons[0]);
    fireEvent.click(showButtons[1]);
    fireEvent.click(showButtons[2]);
    fireEvent.click(showButtons[3]);

    expect(currentPasswordInput).toHaveAttribute("type", "text");
    expect(newPasswordInput).toHaveAttribute("type", "text");
    expect(confirmPasswordInput).toHaveAttribute("type", "text");
    expect(deletePasswordInput).toHaveAttribute("type", "text");

    const hideButtons = screen.getAllByRole("button", { name: /hide password/i });
    expect(hideButtons).toHaveLength(4);

    fireEvent.click(hideButtons[0]);
    fireEvent.click(hideButtons[1]);
    fireEvent.click(hideButtons[2]);
    fireEvent.click(hideButtons[3]);

    expect(currentPasswordInput).toHaveAttribute("type", "password");
    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(deletePasswordInput).toHaveAttribute("type", "password");
  });

  it("rejects mismatched password confirmation without calling the API", async () => {
    await renderPanel();

    fireEvent.change(screen.getByLabelText("Current password"), {
      target: { value: "current-password" },
    });
    fireEvent.change(screen.getByLabelText("New password"), {
      target: { value: "new-password" },
    });
    fireEvent.change(screen.getByLabelText("Confirm new password"), {
      target: { value: "different-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Change password" }));

    expect(mockChangePassword).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("New password and confirmation must match.");
  });

  it("submits a valid password change, clears fields, and shows success feedback", async () => {
    await renderPanel();

    const currentPasswordInput = screen.getByLabelText("Current password");
    const newPasswordInput = screen.getByLabelText("New password");
    const confirmPasswordInput = screen.getByLabelText("Confirm new password");

    fireEvent.change(currentPasswordInput, {
      target: { value: "current-password" },
    });
    fireEvent.change(newPasswordInput, {
      target: { value: "new-password" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "new-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Change password" }));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: "current-password",
        newPassword: "new-password",
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Password changed successfully.");
    expect(currentPasswordInput).toHaveValue("");
    expect(newPasswordInput).toHaveValue("");
    expect(confirmPasswordInput).toHaveValue("");
  });
});
