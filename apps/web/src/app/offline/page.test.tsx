import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import OfflinePage from './page';

describe('OfflinePage', () => {
  beforeEach(() => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/offline');
  });

  it('renders localized offline copy', () => {
    render(<OfflinePage />);

    expect(screen.getByRole('heading', { name: 'Tryb offline' })).toBeInTheDocument();
    expect(
      screen.getByText('Soar jest chwilowo offline. Sprawdz polaczenie i sprobuj ponownie.')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sprobuj ponownie' })).toHaveAttribute('href', '/');
  });

  it('retries the original user path after the service worker fallback', async () => {
    window.history.pushState({}, '', '/dashboard/backtests/run-1?tab=trades#orders');
    render(<OfflinePage />);

    await waitFor(() => expect(screen.getByRole('link', { name: 'Sprobuj ponownie' })).toHaveAttribute(
      'href', '/dashboard/backtests/run-1?tab=trades#orders'
    ));
  });
});
