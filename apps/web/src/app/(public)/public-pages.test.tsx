import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import OfflinePage from '../offline/page';
import PublicPage from './page';
import PrivacyPage from './privacy/page';
import TermsPage from './terms/page';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/i18n/I18nProvider', () => ({
  I18nProvider: ({ children }: { children: ReactNode }) => children,
  useI18n: () => ({ t: (key: string) => key }),
}));

describe('public and offline route pages', () => {
  it('renders the public landing page and account actions', () => {
    render(<PublicPage />);

    expect(screen.getByText('public.landing.heading')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /public\.landing\./i }).length).toBeGreaterThan(0);
  });

  it('renders the privacy policy', () => {
    render(<PrivacyPage />);

    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
  });

  it('renders the terms of service', () => {
    render(<TermsPage />);

    expect(screen.getByRole('heading', { name: 'Terms of Service' })).toBeInTheDocument();
  });

  it('renders the offline fallback through its locale provider', () => {
    render(<OfflinePage />);

    expect(screen.getByText('public.offline.title')).toBeInTheDocument();
    expect(screen.getByText('public.offline.description')).toBeInTheDocument();
  });
});
