import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchApiKeys, addApiKey, editApiKey, deleteApiKey } from "../services/apiKeys.service";
import { ApiKey } from "../types/apiKey.type";
import { handleError } from "../../../lib/handleError";
import { useI18n } from "../../../i18n/I18nProvider";
import { runAsyncWithViewState } from "@/lib/async";

const getErrorMessage = (err: unknown, fallback: string) => {
  return handleError(err, { fallback }) || fallback;
};

export function useApiKeys() {
  const { t } = useI18n();
  const copy = {
    fetchFallback: t('dashboard.apiKeys.hook.fetchFallback'),
    addSuccess: t('dashboard.apiKeys.hook.addSuccess'),
    addFailed: t('dashboard.apiKeys.hook.addFailed'),
    addFailedDescription: t('dashboard.apiKeys.hook.addFailedDescription'),
    editSuccess: t('dashboard.apiKeys.hook.editSuccess'),
    editFailed: t('dashboard.apiKeys.hook.editFailed'),
    editFailedDescription: t('dashboard.apiKeys.hook.editFailedDescription'),
    deleteSuccess: t('dashboard.apiKeys.hook.deleteSuccess'),
    deleteFailed: t('dashboard.apiKeys.hook.deleteFailed'),
    deleteFailedDescription: t('dashboard.apiKeys.hook.deleteFailedDescription'),
  } as const;

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await runAsyncWithViewState({
        setPending: setLoading,
        setError,
        clearErrorValue: null,
        resolveError: (err) => getErrorMessage(err, copy.fetchFallback),
        operation: () => fetchApiKeys(),
      });
      setKeys(data);
    } catch {}
  }, [copy.fetchFallback]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleAdd = async (payload: Partial<ApiKey>) => {
    try {
      await addApiKey(payload);
      await refresh();
      toast.success(copy.addSuccess);
    } catch (err: unknown) {
      toast.error(copy.addFailed, { description: getErrorMessage(err, copy.addFailedDescription) });
    }
  };

  const handleEdit = async (id: string, payload: Partial<ApiKey>) => {
    try {
      await editApiKey(id, payload);
      await refresh();
      toast.success(copy.editSuccess);
    } catch (err: unknown) {
      toast.error(copy.editFailed, {
        description: getErrorMessage(err, copy.editFailedDescription),
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApiKey(id);
      await refresh();
      toast.success(copy.deleteSuccess);
    } catch (err: unknown) {
      toast.error(copy.deleteFailed, {
        description: getErrorMessage(err, copy.deleteFailedDescription),
      });
    }
  };

  return {
    keys,
    loading,
    error,
    refresh,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
