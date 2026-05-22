"use client";

import { FormEvent, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useI18n } from "../../../i18n/I18nProvider";
import PasswordVisibilityToggle from "../../auth/components/PasswordVisibilityToggle";
import { changePassword, deleteAccount } from "../services/security.service";
import ConfirmModal from "@/ui/components/ConfirmModal";
import { navigateWithFallback } from "@/lib/navigation";
import { resolveUiErrorMessage } from "@/lib/errorResolver";

const mapApiError = (error: unknown, fallback: string) =>
  isAxiosError(error) ? (resolveUiErrorMessage(error, { fallback }) ?? fallback) : fallback;

export default function SecurityPanel() {
  const { t } = useI18n();
  const router = useRouter();
  const securityText = (key: string) => t(`dashboard.security.${key}`);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const canSubmitPasswordChange = useMemo(() => {
    return (
      currentPassword.trim().length >= 6 &&
      newPassword.trim().length >= 6 &&
      confirmPassword.trim().length >= 6 &&
      !isChangingPassword
    );
  }, [confirmPassword, currentPassword, isChangingPassword, newPassword]);

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(securityText("mismatch"));
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(securityText("samePassword"));
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(securityText("passwordChanged"));
    } catch (error) {
      toast.error(mapApiError(error, securityText("passwordChangeFailed")));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const performDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount({ password: deletePassword });
      toast.success(securityText("accountDeleted"));
      navigateWithFallback(router, { href: "/auth/login", mode: "replace" });
    } catch (error) {
      toast.error(mapApiError(error, securityText("deleteFailed")));
      setIsDeletingAccount(false);
    }
  };

  const handleDeleteAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!deletePassword.trim()) {
      toast.error(securityText("deletePasswordMissing"));
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-box border border-base-300 bg-base-100 p-4 h-full">
        <h2 className="text-lg font-semibold">{securityText("passwordSectionTitle")}</h2>
        <p className="mt-1 text-sm opacity-70">{securityText("passwordSectionDescription")}</p>

        <form className="mt-4 grid gap-3" onSubmit={handlePasswordChange}>
          <label className="form-control w-full">
            <span className="label-text mb-1 block">{securityText("currentPassword")}</span>
            <div className="join w-full">
              <input
                className="input input-bordered join-item w-full"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <PasswordVisibilityToggle
                show={showCurrentPassword}
                disabled={isChangingPassword}
                onToggle={() => setShowCurrentPassword((prev) => !prev)}
              />
            </div>
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block">{securityText("newPassword")}</span>
            <div className="join w-full">
              <input
                className="input input-bordered join-item w-full"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <PasswordVisibilityToggle
                show={showNewPassword}
                disabled={isChangingPassword}
                onToggle={() => setShowNewPassword((prev) => !prev)}
              />
            </div>
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block">{securityText("confirmPassword")}</span>
            <div className="join w-full">
              <input
                className="input input-bordered join-item w-full"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <PasswordVisibilityToggle
                show={showConfirmPassword}
                disabled={isChangingPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
              />
            </div>
          </label>

          <div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={!canSubmitPasswordChange}>
              {isChangingPassword ? securityText("savingPassword") : securityText("savePassword")}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-box border border-error/40 bg-error/5 p-4 h-full">
        <h2 className="text-lg font-semibold text-error">{securityText("deleteSectionTitle")}</h2>
        <p className="mt-1 text-sm opacity-80">{securityText("deleteSectionDescription")}</p>

        <form className="mt-4 grid gap-3" onSubmit={handleDeleteAccount}>
          <label className="form-control w-full">
            <span className="label-text mb-1 block">{securityText("deletePasswordLabel")}</span>
            <div className="join w-full">
              <input
                className="input input-bordered join-item w-full"
                type={showDeletePassword ? "text" : "password"}
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <PasswordVisibilityToggle
                show={showDeletePassword}
                disabled={isDeletingAccount}
                onToggle={() => setShowDeletePassword((prev) => !prev)}
              />
            </div>
          </label>

          <div>
            <button
              className="btn btn-error btn-sm"
              type="submit"
              disabled={isDeletingAccount || deletePassword.trim().length === 0}
            >
              {isDeletingAccount ? securityText("deleting") : securityText("deleteAction")}
            </button>
          </div>
        </form>
        <ConfirmModal
          open={isDeleteConfirmOpen}
          title={securityText("deleteSectionTitle")}
          description={securityText("deleteConfirm")}
          confirmLabel={securityText("deleteAction")}
          cancelLabel={securityText("cancel")}
          confirmVariant="error"
          pending={isDeletingAccount}
          onCancel={() => {
            if (isDeletingAccount) return;
            setIsDeleteConfirmOpen(false);
          }}
          onConfirm={() => {
            setIsDeleteConfirmOpen(false);
            void performDeleteAccount();
          }}
        />
      </section>
    </div>
  );
}
