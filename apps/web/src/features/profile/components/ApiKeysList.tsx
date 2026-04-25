"use client";
import { useCallback, useMemo, useState } from "react";
import { LuPencilLine, LuTrash2 } from "react-icons/lu";
import ApiKeyForm, { ApiKeyFormSavePayload } from "./ApiKeyForm";
import { useApiKeys } from "../hooks/useApiKeys";
import { EmptyState, ErrorState, LoadingState } from "../../../ui/components/ViewState";
import { useI18n } from "../../../i18n/I18nProvider";
import { useLocaleFormatting } from "../../../i18n/useLocaleFormatting";
import DataTable, { DataTableColumn } from "../../../ui/components/DataTable";
import { TableIconButtonAction, TableToneBadge } from "../../../ui/components/TableUi";
import type { ApiKey } from "../types/apiKey.type";

export default function ApiKeysList() {
  const { t } = useI18n();
  const { formatDate } = useLocaleFormatting();
  const { keys, loading, error, refresh, handleAdd, handleEdit, handleDelete } = useApiKeys();
  const apiKeysText = useCallback((key: string) => t(`dashboard.apiKeys.${key}`), [t]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState(apiKeysText("addTitle"));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteRiskAccepted, setDeleteRiskAccepted] = useState(false);

  const handleAddKey = useCallback(() => {
    setEditId(null);
    setModalTitle(apiKeysText("addTitle"));
    setShowModal(true);
  }, [apiKeysText]);

  const handleEditKey = useCallback((id: string) => {
    setEditId(id);
    setModalTitle(apiKeysText("editTitle"));
    setShowModal(true);
  }, [apiKeysText]);

  const handleSave = async (data: ApiKeyFormSavePayload) => {
    if (editId) {
      await handleEdit(editId, data);
    } else {
      await handleAdd(data);
    }
    setShowModal(false);
    setEditId(null);
  };

  const handleDeleteKey = useCallback((id: string) => {
    setDeleteId(id);
    setDeleteRiskAccepted(false);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (deleteId) {
      await handleDelete(deleteId);
    }
    setShowDeleteModal(false);
    setDeleteId(null);
    setDeleteRiskAccepted(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
    setDeleteRiskAccepted(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditId(null);
  };

  const selectedKey = editId ? keys.find((k) => k.id === editId) : undefined;
  const defaultValues = selectedKey
      ? {
        id: selectedKey.id,
        label: selectedKey.label,
        exchange: selectedKey.exchange,
        maskedApiKey: selectedKey.apiKey,
      }
    : undefined;

  const columns = useMemo<DataTableColumn<ApiKey>[]>(
    () => [
      {
        key: "label",
        label: apiKeysText("tableLabel"),
        sortable: true,
        accessor: (row) => row.label,
        className: "font-medium",
      },
      {
        key: "exchange",
        label: apiKeysText("tableExchange"),
        sortable: true,
        accessor: (row) => row.exchange,
        render: (row) => <TableToneBadge label={row.exchange} tone="info" />,
      },
      {
        key: "createdAt",
        label: apiKeysText("tableCreatedAt"),
        sortable: true,
        accessor: (row) => row.createdAt,
        render: (row) => formatDate(row.createdAt),
      },
      {
        key: "lastUsed",
        label: apiKeysText("tableLastUsed"),
        sortable: true,
        accessor: (row) => row.lastUsed ?? "",
        render: (row) => formatDate(row.lastUsed),
      },
      {
        key: "apiKey",
        label: apiKeysText("tableApiKey"),
        sortable: true,
        accessor: (row) => row.apiKey,
        render: (row) => (
          <span className="font-mono">
            {row.apiKey ? row.apiKey.slice(0, 2) + "********" + row.apiKey.slice(-2) : "-"}
          </span>
        ),
      },
      {
        key: "actions",
        label: apiKeysText("tableActions"),
        className: "text-right",
        render: (row) => (
          <div className="flex items-center justify-end gap-2">
            <TableIconButtonAction
              label={apiKeysText("edit")}
              icon={<LuPencilLine className="h-3.5 w-3.5" />}
              onClick={() => handleEditKey(row.id)}
              tone="info"
            />
            <TableIconButtonAction
              label={apiKeysText("remove")}
              icon={<LuTrash2 className="h-3.5 w-3.5" />}
              onClick={() => handleDeleteKey(row.id)}
              tone="danger"
            />
          </div>
        ),
      },
    ],
    [
      formatDate,
      handleDeleteKey,
      handleEditKey,
      apiKeysText,
    ]
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{apiKeysText("title")}</h3>
        <button className="btn btn-primary btn-sm" onClick={handleAddKey}>
          {apiKeysText("addAction")}
        </button>
      </div>
      {loading && <LoadingState title={apiKeysText("loadingTitle")} />}
      {!loading && error && (
        <ErrorState
          title={apiKeysText("loadErrorTitle")}
          description={error}
          retryLabel={apiKeysText("refresh")}
          onRetry={() => void refresh()}
        />
      )}
      {!loading && !error && keys.length === 0 && (
        <EmptyState
          title={apiKeysText("emptyTitle")}
          description={apiKeysText("emptyDescription")}
          actionLabel={apiKeysText("addAction")}
          onAction={handleAddKey}
        />
      )}
      {!loading && !error && keys.length > 0 && (
        <DataTable
          compact
          rows={keys}
          columns={columns}
          getRowId={(row) => row.id}
          filterPlaceholder={apiKeysText("searchPlaceholder")}
          filterFn={(row, query) => {
            const normalized = query.trim().toLowerCase();
            return (
              row.label.toLowerCase().includes(normalized) ||
              row.exchange.toLowerCase().includes(normalized) ||
              row.apiKey.toLowerCase().includes(normalized)
            );
          }}
          emptyText={apiKeysText("emptyFilter")}
          paginationEnabled
          defaultPageSize={10}
        />
      )}

      <dialog id="apiKeyModal" className={`modal ${showModal ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{modalTitle}</h3>
          <ApiKeyForm
            key={editId || "add"}
            defaultValues={defaultValues}
            isEdit={!!editId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
        <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
          <button>{apiKeysText("close")}</button>
        </form>
      </dialog>

      <dialog id="deleteApiKeyModal" className={`modal ${showDeleteModal ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4 text-error">{apiKeysText("deleteModalTitle")}</h3>
          <p className="mb-3">{apiKeysText("deleteModalDescription")}</p>
          <p className="mb-4 text-sm text-warning">{apiKeysText("deleteRisk")}</p>
          <label className="label cursor-pointer justify-start gap-2 mb-6">
            <input
              type="checkbox"
              className="checkbox checkbox-warning checkbox-sm"
              checked={deleteRiskAccepted}
              onChange={(event) => setDeleteRiskAccepted(event.target.checked)}
            />
            <span className="label-text">{apiKeysText("deleteRiskConfirm")}</span>
          </label>
          <div className="flex gap-4 justify-end">
            <button className="btn btn-outline" type="button" onClick={cancelDelete}>
              {apiKeysText("cancel")}
            </button>
            <button
              className="btn btn-error"
              type="button"
              disabled={!deleteRiskAccepted}
              onClick={confirmDelete}
            >
              {apiKeysText("remove")}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={cancelDelete}>
          <button>{apiKeysText("close")}</button>
        </form>
      </dialog>
    </div>
  );
}
