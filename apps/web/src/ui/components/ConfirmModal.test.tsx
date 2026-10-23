import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal keyboard behavior', () => {
  it('focuses Cancel, handles native Escape cancellation, and restores trigger focus', async () => {
    const onCancel = vi.fn();
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();

    const { rerender, unmount } = render(
      <StrictMode>
        <ConfirmModal open title='Confirm admin change' onConfirm={vi.fn()} onCancel={onCancel} />
      </StrictMode>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
    trigger.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    expect(dialog.querySelector('.modal-backdrop')).toHaveAttribute('aria-hidden', 'true');

    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    expect(onCancel).toHaveBeenCalledOnce();

    rerender(
      <StrictMode>
        <ConfirmModal open={false} title='Confirm admin change' onConfirm={vi.fn()} onCancel={onCancel} />
      </StrictMode>
    );
    await waitFor(() => expect(trigger).toHaveFocus());
    unmount();
    trigger.remove();
  });

  it('does not cancel while pending', () => {
    const onCancel = vi.fn();
    const { unmount } = render(
      <ConfirmModal open title='Confirm admin change' pending onConfirm={vi.fn()} onCancel={onCancel} />
    );
    const dialog = screen.getByRole('dialog');
    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    fireEvent.click(dialog.querySelector('.modal-backdrop') as HTMLElement);
    expect(onCancel).not.toHaveBeenCalled();
    unmount();
  });
});
