'use client';

import { useEffect, useId, useRef } from 'react';
import { useOptionalI18n } from '@/i18n/useOptionalI18n';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'error';
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = 'primary',
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useOptionalI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const resolvedConfirmLabel = confirmLabel ?? t('public.sharedUi.confirmLabel');
  const resolvedCancelLabel = cancelLabel ?? t('public.sharedUi.cancelLabel');

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!previousFocusRef.current && document.activeElement instanceof HTMLElement) {
      previousFocusRef.current = document.activeElement;
    }

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    cancelRef.current?.focus();
    const focusTimer = window.setTimeout(() => {
      const active = document.activeElement;
      if (dialog.open && active !== cancelRef.current && active !== confirmRef.current) {
        cancelRef.current?.focus();
      }
    }, 50);
    const trapTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialog.open) return;
      event.preventDefault();
      const buttons = [cancelRef.current, confirmRef.current].filter(
        (button): button is HTMLButtonElement => Boolean(button && !button.disabled)
      );
      if (buttons.length === 0) {
        dialog.focus();
        return;
      }
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.shiftKey
        ? buttons[current < 0 ? buttons.length - 1 : (current - 1 + buttons.length) % buttons.length]
        : buttons[(current + 1) % buttons.length];
      next.focus();
    };
    document.addEventListener('keydown', trapTab, true);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', trapTab, true);
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
      queueMicrotask(() => {
        if (dialog.isConnected && dialog.open) return;
        if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
        previousFocusRef.current = null;
      });
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className='modal'
      tabIndex={-1}
      aria-modal='true'
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
    >
      <div className='modal-box'>
        <h3 id={titleId} className='font-bold text-lg mb-2'>{title}</h3>
        {description ? <p id={descriptionId} className='mb-4 text-sm opacity-80'>{description}</p> : null}
        <div className='modal-action'>
          <button ref={cancelRef} type='button' className='btn' onClick={onCancel} disabled={pending}>
            {resolvedCancelLabel}
          </button>
          <button
            ref={confirmRef}
            type='button'
            className={`btn ${confirmVariant === 'error' ? 'btn-error' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? '...' : resolvedConfirmLabel}
          </button>
        </div>
      </div>
      <div
        className='modal-backdrop'
        aria-hidden='true'
        onClick={() => { if (!pending) onCancel(); }}
      />
    </dialog>
  );
}
