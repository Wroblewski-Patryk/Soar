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
  const titleId = useId();
  const descriptionId = useId();
  const resolvedConfirmLabel = confirmLabel ?? t('public.sharedUi.confirmLabel');
  const resolvedCancelLabel = cancelLabel ?? t('public.sharedUi.cancelLabel');

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    cancelRef.current?.focus();
    const focusFrame = requestAnimationFrame(() => cancelRef.current?.focus());

    return () => {
      cancelAnimationFrame(focusFrame);
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
      queueMicrotask(() => {
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
      });
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className='modal'
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
        role='button'
        aria-label={t('public.a11y.closeModal')}
        tabIndex={0}
        onClick={() => { if (!pending) onCancel(); }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!pending) onCancel();
          }
        }}
      />
    </dialog>
  );
}
