import { useEffect, useMemo, useRef, useState } from "react";
import {
  getLocalStorageJsonItem,
  setLocalStorageItem,
  setLocalStorageJsonItem,
} from "@/lib/storage";
import {
  readTableColumnVisibilityPreference,
  saveTableColumnVisibilityPreference,
} from "@/features/profile/services/profileBasicCache";

export type TableColumnVisibilityState = Record<string, boolean>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value != null && !Array.isArray(value);

export const normalizeColumnVisibilityState = (
  raw: unknown,
  columns: string[]
): TableColumnVisibilityState | null => {
  if (!isRecord(raw)) return null;
  const knownKeys = new Set(columns);
  const normalized: TableColumnVisibilityState = {};
  let hasKnownKey = false;

  for (const [key, value] of Object.entries(raw)) {
    if (!knownKeys.has(key) || typeof value !== "boolean") continue;
    normalized[key] = value;
    hasKnownKey = true;
  }

  return hasKnownKey ? normalized : null;
};

export const buildDefaultColumnVisibility = (
  columns: string[]
): TableColumnVisibilityState => Object.fromEntries(columns.map((key) => [key, true]));

export const mergeColumnVisibilityState = (
  defaults: TableColumnVisibilityState,
  incoming: TableColumnVisibilityState | null
) => {
  if (!incoming) return defaults;
  const next = { ...defaults };
  for (const [key, value] of Object.entries(incoming)) {
    if (!(key in next)) continue;
    next[key] = value;
  }
  return next;
};

type UseDataTableColumnVisibilityStateArgs = {
  columns: Array<{ key: string }>;
  enabled: boolean;
  preferenceKey?: string;
};

export const useDataTableColumnVisibilityState = ({
  columns,
  enabled,
  preferenceKey,
}: UseDataTableColumnVisibilityStateArgs) => {
  const [columnVisibilityState, setColumnVisibilityState] = useState<TableColumnVisibilityState>({});
  const [columnVisibilityReady, setColumnVisibilityReady] = useState(false);
  const lastSerializedColumnVisibilityRef = useRef("");

  const columnKeys = useMemo(() => columns.map((column) => column.key), [columns]);
  const columnKeysSignature = useMemo(() => columnKeys.join("|"), [columnKeys]);
  const defaultColumnVisibility = useMemo(
    () => buildDefaultColumnVisibility(columnKeys),
    [columnKeys]
  );
  const resolvedColumnVisibility = useMemo(() => {
    if (!enabled) return defaultColumnVisibility;
    return mergeColumnVisibilityState(
      defaultColumnVisibility,
      normalizeColumnVisibilityState(columnVisibilityState, columnKeys)
    );
  }, [columnKeys, columnVisibilityState, defaultColumnVisibility, enabled]);

  useEffect(() => {
    if (!enabled || !preferenceKey) {
      setColumnVisibilityState(defaultColumnVisibility);
      setColumnVisibilityReady(true);
      return;
    }

    let cancelled = false;
    setColumnVisibilityReady(false);

    const localStorageKey = `datatable.columns.${preferenceKey}`;
    const parsedLocalPayload = normalizeColumnVisibilityState(
      getLocalStorageJsonItem(localStorageKey),
      columnKeys
    );

    const localResolved = mergeColumnVisibilityState(defaultColumnVisibility, parsedLocalPayload);
    setColumnVisibilityState(localResolved);
    lastSerializedColumnVisibilityRef.current = JSON.stringify(localResolved);

    const hydrateFromProfile = async () => {
      try {
        const remoteRaw = await readTableColumnVisibilityPreference(preferenceKey);
        const remoteParsed = normalizeColumnVisibilityState(remoteRaw, columnKeys);
        if (!remoteParsed || cancelled) return;

        const remoteResolved = mergeColumnVisibilityState(defaultColumnVisibility, remoteParsed);
        setColumnVisibilityState(remoteResolved);
        lastSerializedColumnVisibilityRef.current = JSON.stringify(remoteResolved);

        setLocalStorageJsonItem(localStorageKey, remoteResolved);
      } catch {
        // Ignore profile preference hydration failures.
      }
    };

    void hydrateFromProfile().finally(() => {
      if (cancelled) return;
      setColumnVisibilityReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [columnKeys, columnKeysSignature, defaultColumnVisibility, enabled, preferenceKey]);

  useEffect(() => {
    if (!enabled || !preferenceKey || !columnVisibilityReady) return;

    const serialized = JSON.stringify(resolvedColumnVisibility);
    if (serialized === lastSerializedColumnVisibilityRef.current) return;

    const localStorageKey = `datatable.columns.${preferenceKey}`;
    setLocalStorageItem(localStorageKey, serialized);

    const timeout = window.setTimeout(async () => {
      try {
        await saveTableColumnVisibilityPreference(preferenceKey, resolvedColumnVisibility);
        lastSerializedColumnVisibilityRef.current = serialized;
      } catch {
        // Ignore profile preference sync failures.
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [columnVisibilityReady, enabled, preferenceKey, resolvedColumnVisibility]);

  return {
    columnVisibilityReady,
    columnVisibilityState,
    defaultColumnVisibility,
    resolvedColumnVisibility,
    setColumnVisibilityState,
  };
};
