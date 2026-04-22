import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useI18n } from "../../../i18n/I18nProvider";
import { User } from "../types/user.type";
import { executeWithRetry, isRetriableHttpError, runAsyncWithViewState } from "@/lib/async";
import { readProfileBasic, updateProfileBasic } from "../services/profileBasicCache";

export function useUser() {
  const { t } = useI18n();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      await runAsyncWithViewState({
        setPending: setLoading,
        operation: async () => {
          const res = await executeWithRetry(
            () => readProfileBasic(),
            {
            maxAttempts: 2,
            retryDelayMs: 250,
            shouldRetry: isRetriableHttpError,
            }
          );
          setUser(res);
        },
      });
    } catch {
      toast.error(t("dashboard.profileBasic.fetchFailed"));
    }
  }, [t]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const updateUser = async (data: Partial<User>) => {
    try {
      await runAsyncWithViewState({
        setPending: setLoading,
        operation: async () => {
          const res = await executeWithRetry(
            () => updateProfileBasic(data),
            {
            maxAttempts: 2,
            retryDelayMs: 250,
            shouldRetry: isRetriableHttpError,
            }
          );
          setUser(res);
        },
      });
    } catch (err) {
      toast.error(t("dashboard.profileBasic.saveFailed"));
      throw err;
    }
  };

  return {
    user,
    loading,
    fetchUser,
    updateUser,
  };
}
