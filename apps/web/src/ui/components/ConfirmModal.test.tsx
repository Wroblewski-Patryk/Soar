import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal keyboard behavior', () => {
  it('focuses Cancel, handles native Escape cancellation, and restores trigger focus', async () => {
    const onCancel = vi.fn();
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();

    const { rerender, unmount } = render(
      <ConfirmModal open title='Confirm admin change' onConfirm={vi.fn()} onCancel={onCancel} />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    expect(onCancel).toHaveBeenCalledOnce();

    rerender(<ConfirmModal open={false} title='Confirm admin change' onConfirm={vi.fn()} onCancel={onCancel} />);
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
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onCancel).not.toHaveBeenCalled();
    unmount();
  });
});
