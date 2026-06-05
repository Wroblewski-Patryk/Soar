import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/i18n/I18nProvider';
import { useDetailsDropdown } from '../hooks/useDetailsDropdown';
import AppLogoLink from './AppLogoLink';
import ConfirmModal from './ConfirmModal';
import FooterPreferencesSwitchers from './FooterPreferencesSwitchers';
import FormModal from './FormModal';
import InlinePager from './InlinePager';
import SkeletonCardBlock from './loading/SkeletonCardBlock';
import SkeletonFormBlock from './loading/SkeletonFormBlock';
import SkeletonKpiRow from './loading/SkeletonKpiRow';
import SkeletonTableRows from './loading/SkeletonTableRows';
import ProfileButton from './ProfileButton';
import SkipToContentLink from './SkipToContentLink';
import { useAsyncConfirm } from './useAsyncConfirm';

const navigationMocks = vi.hoisted(() => ({
  pathname: '/dashboard',
  push: vi.fn(),
}));

const authMocks = vi.hoisted(() => ({
  loading: false,
  logout: vi.fn(),
  user: { email: 'operator@example.test', userId: 'user-1', role: 'USER' as const },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationMocks.pathname,
  useRouter: () => ({ push: navigationMocks.push }),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => authMocks,
}));

const ConfirmHarness = () => {
  const { confirm, confirmModal } = useAsyncConfirm();

  return (
    <>
      <button type="button" onClick={() => void confirm({ title: 'Delete bot', confirmLabel: 'Delete' })}>
        Ask
      </button>
      {confirmModal}
    </>
  );
};

const DetailsDropdownHarness = ({ closeOnEscape = true }: { closeOnEscape?: boolean }) => {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  useDetailsDropdown(detailsRef, { closeOnEscape });

  return (
    <details ref={detailsRef} open>
      <summary>Menu</summary>
      <button type="button">Inside</button>
    </details>
  );
};

const installMatchMediaStub = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('shared UI primitives', () => {
  afterEach(() => {
    authMocks.loading = false;
    authMocks.logout.mockReset();
    authMocks.user = { email: 'operator@example.test', userId: 'user-1', role: 'USER' };
    navigationMocks.pathname = '/dashboard';
    navigationMocks.push.mockReset();
    window.localStorage.clear();
  });

  it('renders brand link with custom destination and label', () => {
    render(<AppLogoLink href="/dashboard" label="Soar Pro" />);

    const link = screen.getByRole('link', { name: 'Soar Pro' });
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveTextContent('Soar Pro');
  });

  it('keeps confirm modal closed until requested and wires confirm/cancel actions', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { rerender } = render(<ConfirmModal open={false} title="Delete bot" onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <ConfirmModal
        open
        title="Delete bot"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        confirmVariant="error"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Delete bot')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Delete').closest('button') as HTMLButtonElement);
    fireEvent.click(screen.getByText('Keep').closest('button') as HTMLButtonElement);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders form modal body, actions, and keyboard-close backdrop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <FormModal open title="Edit wallet" description="Update display metadata." onClose={onClose} actions={<button type="button">Save</button>}>
        Wallet form
      </FormModal>
    );

    expect(screen.getByText('Edit wallet')).toBeInTheDocument();
    expect(screen.getByText('Wallet form')).toBeInTheDocument();
    expect(screen.getByText('Save').closest('button')).toBeInTheDocument();

    fireEvent.keyDown(container.querySelector('.modal-backdrop') as HTMLElement, { key: 'Enter' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders inline pager controls with disabled state and callbacks', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    render(
      <InlinePager
        previousLabel="Previous page"
        nextLabel="Next page"
        previousDisabled
        hideLabelsOnMobile
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(onPrevious).not.toHaveBeenCalled();
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('renders footer preference switchers with localized labels', () => {
    installMatchMediaStub();

    render(
      <I18nProvider>
        <FooterPreferencesSwitchers tone="footer" />
      </I18nProvider>
    );

    expect(screen.getByRole('navigation', { name: 'Footer preferences' })).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme selector')).toBeInTheDocument();
  });

  it('renders profile navigation and pushes section hash links', () => {
    const onNavigate = vi.fn();
    render(
      <I18nProvider>
        <ProfileButton mobile onNavigate={onNavigate} />
      </I18nProvider>
    );

    expect(screen.getByText('operator@example.test')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /api/i }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(navigationMocks.push).toHaveBeenCalledWith('/dashboard/profile#api');
  });

  it('keeps same-page profile section navigation in place and dispatches hashchange', () => {
    navigationMocks.pathname = '/dashboard/profile';
    const hashListener = vi.fn();
    window.history.pushState({}, '', '/dashboard/profile');
    window.addEventListener('hashchange', hashListener);

    render(
      <I18nProvider>
        <ProfileButton mobile />
      </I18nProvider>
    );

    fireEvent.click(screen.getByRole('link', { name: /security/i }));

    expect(navigationMocks.push).not.toHaveBeenCalled();
    expect(window.location.hash).toBe('#security');
    expect(hashListener).toHaveBeenCalledTimes(1);

    window.removeEventListener('hashchange', hashListener);
  });

  it('renders accessible loading placeholders with requested counts', () => {
    const { container } = render(
      <>
        <SkeletonCardBlock cards={2} linesPerCard={2} />
        <SkeletonFormBlock fields={3} columns={1} />
        <SkeletonKpiRow items={2} />
        <SkeletonTableRows columns={2} rows={2} title={false} toolbar={false} />
      </>
    );

    expect(screen.getByLabelText('Loading cards')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText('Loading form')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText('Loading KPI row')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText('Loading table rows')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('article')).toHaveLength(4);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('resolves skip-link text from stored locale and targets main content', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    render(<SkipToContentLink />);

    const link = await screen.findByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
    expect(link).toHaveTextContent('Przejdz do glownej tresci');
  });

  it('settles stale async confirmations before opening the next request', async () => {
    render(<ConfirmHarness />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ask' }));
    });
    expect(screen.getByText('Delete bot')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Delete').closest('button') as HTMLButtonElement);
    });
    expect(screen.queryByText('Delete bot')).not.toBeInTheDocument();
  });

  it('closes details dropdowns on outside pointer and escape according to options', () => {
    const { container, rerender } = render(<DetailsDropdownHarness />);
    const details = container.querySelector('details') as HTMLDetailsElement;

    expect(details.open).toBe(true);
    fireEvent.pointerDown(document.body);
    expect(details.open).toBe(false);

    rerender(<DetailsDropdownHarness closeOnEscape={false} />);
    const nextDetails = container.querySelector('details') as HTMLDetailsElement;
    nextDetails.open = true;
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(nextDetails.open).toBe(true);

    rerender(<DetailsDropdownHarness />);
    const finalDetails = container.querySelector('details') as HTMLDetailsElement;
    finalDetails.open = true;
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(finalDetails.open).toBe(false);
  });
});
