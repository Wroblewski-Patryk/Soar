import { useMemo, useState } from "react";
import { LuArrowDown, LuArrowUp, LuGripVertical, LuTrash2 } from "react-icons/lu";
import { NumberField } from "@/ui/forms";
import {
  numericInputProps,
  readNumericInputValue,
  strategyNumericContracts,
} from "../../utils/strategyNumericInput";

type SortableItem = {
  clientId?: string;
  [key: string]: number | string | undefined;
};

type FieldConfig<TItem extends SortableItem> = {
  key: keyof TItem;
  label: string;
  idPrefix: string;
  min?: number;
  max?: number;
};

type Props<TItem extends SortableItem> = {
  items: TItem[];
  fields: [FieldConfig<TItem>, FieldConfig<TItem>];
  addLabel: string;
  removeLabel: string;
  moveUpLabel: string;
  moveDownLabel: string;
  dragLabel: string;
  createItem: () => TItem;
  onChange: (items: TItem[]) => void;
};

const decimalInputProps = numericInputProps(strategyNumericContracts.decimal2);

const moveItem = <TItem,>(items: TItem[], fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return items;

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

export function SortableThresholdListEditor<TItem extends SortableItem>({
  items,
  fields,
  addLabel,
  removeLabel,
  moveUpLabel,
  moveDownLabel,
  dragLabel,
  createItem,
  onChange,
}: Props<TItem>) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const fieldList = useMemo(() => fields, [fields]);

  const updateItem = (clientId: string, key: keyof TItem, value: number) => {
    onChange(
      items.map((item) =>
        item.clientId === clientId
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  };

  const reorderItems = (sourceId: string, targetId: string) => {
    const sourceIndex = items.findIndex((item) => item.clientId === sourceId);
    const targetIndex = items.findIndex((item) => item.clientId === targetId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
    onChange(moveItem(items, sourceIndex, targetIndex));
  };

  const moveByOffset = (clientId: string, offset: number) => {
    const sourceIndex = items.findIndex((item) => item.clientId === clientId);
    const targetIndex = sourceIndex + offset;
    if (sourceIndex < 0 || targetIndex < 0 || targetIndex >= items.length) return;
    onChange(moveItem(items, sourceIndex, targetIndex));
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const clientId = item.clientId ?? `fallback-${index}`;
        const isDropTarget = dropTargetId === clientId && draggedId !== clientId;

        return (
          <div
            key={clientId}
            className={[
              "rounded-box border border-base-300/60 bg-base-100/70 p-3 transition-colors",
              isDropTarget ? "border-primary/70 bg-primary/5" : "",
            ].join(" ")}
            onDragOver={(event) => {
              if (!draggedId || draggedId === clientId) return;
              event.preventDefault();
              setDropTargetId(clientId);
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== clientId) {
                reorderItems(draggedId, clientId);
              }
              setDraggedId(null);
              setDropTargetId(null);
            }}
            onDragLeave={() => {
              if (dropTargetId === clientId) {
                setDropTargetId(null);
              }
            }}
          >
            <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[auto_1fr_1fr_auto]">
              <button
                type="button"
                draggable
                className="btn btn-ghost btn-sm cursor-grab active:cursor-grabbing"
                aria-label={dragLabel}
                title={dragLabel}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", clientId);
                  setDraggedId(clientId);
                }}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDropTargetId(null);
                }}
              >
                <LuGripVertical className="h-4 w-4" aria-hidden />
              </button>

              {fieldList.map((field) => (
                <NumberField
                  key={`${clientId}-${String(field.key)}`}
                  id={`${field.idPrefix}-${index}`}
                  label={field.label}
                  value={Number(item[field.key])}
                  min={field.min}
                  max={field.max}
                  inputMode={decimalInputProps.inputMode}
                  step={Number(decimalInputProps.step)}
                  onChange={(value) => {
                    const parsed = readNumericInputValue(value, strategyNumericContracts.decimal2);
                    if (parsed == null) return;
                    updateItem(clientId, field.key, parsed);
                  }}
                />
              ))}

              <div className="flex items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label={moveUpLabel}
                  title={moveUpLabel}
                  disabled={index === 0}
                  onClick={() => moveByOffset(clientId, -1)}
                >
                  <LuArrowUp className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label={moveDownLabel}
                  title={moveDownLabel}
                  disabled={index === items.length - 1}
                  onClick={() => moveByOffset(clientId, 1)}
                >
                  <LuArrowDown className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  aria-label={removeLabel}
                  title={removeLabel}
                  onClick={() => onChange(items.filter((entry) => entry.clientId !== clientId))}
                >
                  <LuTrash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <button type="button" className="btn btn-outline mt-2" onClick={() => onChange([...items, createItem()])}>
        {addLabel}
      </button>
    </div>
  );
}
