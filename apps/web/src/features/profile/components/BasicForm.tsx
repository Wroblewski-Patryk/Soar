"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import api from "../../../lib/api";
import { useI18n } from "../../../i18n/I18nProvider";
import { useUser } from "../hooks/useUser";

const COMMON_TIME_ZONES = [
  "UTC",
  "Europe/Warsaw",
  "Europe/Berlin",
  "Europe/London",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const formatTimeZoneLabel = (value: string) => value.replaceAll("_", " ");

const normalizeAvatarSource = (value: string): string | null => {
  const normalized = value.trim();
  if (!normalized) return null;

  if (normalized.startsWith("/") && !normalized.startsWith("//")) {
    return normalized;
  }

  if (/^(blob:|data:image\/)/i.test(normalized)) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? normalized : null;
  } catch {
    return null;
  }
};

export default function ProfileForm() {
  const { timeZone, timeZonePreference, setTimeZonePreference, t } = useI18n();
  const { user, updateUser, loading } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAvatarUrl(user?.avatarUrl || "");
    setAvatarLoadFailed(false);
    const preferredTimeZone = user?.uiPreferences?.timeZonePreference;
    if (preferredTimeZone) {
      setTimeZonePreference(preferredTimeZone);
    }
  }, [setTimeZonePreference, user]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarLoadFailed(false);
      setAvatarUrl(response.data.url);
      toast.success(t("dashboard.profileBasic.avatarUploadChanged"));
    } catch {
      toast.error(t("dashboard.profileBasic.avatarUploadFailed"));
    }
  };

  const avatarSource = normalizeAvatarSource(avatarUrl);
  const avatarFallbackInitial = name.trim().slice(0, 1).toLocaleUpperCase() || "?";
  const avatarLabel = t("dashboard.profileBasic.avatarAlt");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        name,
        avatarUrl,
        uiPreferences: {
          timeZonePreference,
        },
      });
      toast.success(t("dashboard.profileBasic.profileSaved"));
    } catch {
      toast.error(t("dashboard.profileBasic.profileSaveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="mx-auto w-full space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6 py-2 md:flex-row md:items-center md:gap-4">
        <div className="w-full shrink-0 md:w-56 md:pr-8">
          {avatarSource && !avatarLoadFailed ? (
            <Image
              src={avatarSource}
              alt={avatarLabel}
              width={192}
              height={192}
              loader={({ src }) => src}
              unoptimized
              onError={() => setAvatarLoadFailed(true)}
              className="mx-auto mb-4 h-40 w-40 rounded-full object-cover sm:h-48 sm:w-48 md:mx-0"
            />
          ) : (
            <div
              className="mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-primary text-4xl font-semibold text-primary-content sm:h-48 sm:w-48 md:mx-0"
              role="img"
              aria-label={avatarLabel}
            >
              <span aria-hidden="true">{avatarFallbackInitial}</span>
            </div>
          )}

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <span className="btn btn-outline btn-info w-full mt-2 cursor-pointer">
              {avatarUrl
                ? t("dashboard.profileBasic.changeAvatar")
                : t("dashboard.profileBasic.addAvatar")}
            </span>
          </label>
        </div>

        <div className="w-full min-w-0 flex-grow">
          <div className="form-control mb-4">
            <label className="label" htmlFor="profile-name">
              <span className="label-text">{t("dashboard.profileBasic.nameLabel")}</span>
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              placeholder={t("dashboard.profileBasic.namePlaceholder")}
              className="input input-bordered w-full"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="profile-email">
              <span className="label-text">{t("dashboard.profileBasic.emailLabel")}</span>
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              placeholder={t("dashboard.profileBasic.emailPlaceholder")}
              className="input input-bordered w-full"
              value={email}
              disabled
              tabIndex={-1}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="profile-time-zone">
              <span className="label-text">{t("dashboard.profileBasic.timeZoneLabel")}</span>
            </label>
            <select
              id="profile-time-zone"
              name="timeZonePreference"
              aria-describedby="profile-time-zone-hint"
              className="select select-bordered w-full"
              value={timeZonePreference}
              onChange={(event) => setTimeZonePreference(event.target.value)}
            >
              <option value="auto">
                {hasMounted
                  ? `${t("dashboard.profileBasic.timeZoneAuto")} (${timeZone})`
                  : t("dashboard.profileBasic.timeZoneAuto")}
              </option>
              {[...new Set([...COMMON_TIME_ZONES, timeZone])].sort((a, b) => a.localeCompare(b)).map((zone) => (
                <option key={zone} value={zone}>
                  {formatTimeZoneLabel(zone)}
                </option>
              ))}
            </select>
            <span id="profile-time-zone-hint" className="mt-1 text-xs opacity-70">
              {t("dashboard.profileBasic.timeZoneHint")}
            </span>
          </div>

          <button
            className={`btn btn-primary ${saving ? "loading" : ""}`}
            type="submit"
            disabled={saving || loading}
          >
            {t("dashboard.profileBasic.saveChanges")}
          </button>
        </div>
      </div>
    </form>
  );
}
