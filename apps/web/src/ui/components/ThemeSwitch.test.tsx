import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../../i18n/I18nProvider';
import { themeBootstrapScript } from '../../security/themeBootstrap';
import ThemeSwitcher from './ThemeSwitch';

describe('ThemeSwitcher', () => {
  let mediaMatches = false;
  const mediaListeners = new Set<(event: MediaQueryListEvent) => void>();

  beforeEach(() => {
    mediaMatches = false;
    mediaListeners.clear();
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        get matches() {
          return mediaMatches;
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_event: string, callback: (event: MediaQueryListEvent) => void) => {
          mediaListeners.add(callback);
        }),
        removeEventListener: vi.fn((_event: string, callback: (event: MediaQueryListEvent) => void) => {
          mediaListeners.delete(callback);
        }),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders accessible theme selector and options', () => {
    render(
      <I18nProvider>
        <ThemeSwitcher />
      </I18nProvider>
    );

    expect(screen.getByLabelText('Theme selector')).toBeInTheDocument();
    expect(screen.getByLabelText('System')).toBeInTheDocument();
    expect(screen.getByLabelText('Cupcake')).toBeInTheDocument();
    expect(screen.getByLabelText('Dracula')).toBeInTheDocument();
    expect(screen.getByLabelText('Forest')).toBeInTheDocument();
    expect(screen.getByLabelText('Valentine')).toBeInTheDocument();
    expect(screen.getByLabelText('Cyberpunk')).toBeInTheDocument();
    expect(screen.queryByLabelText('Luxury')).not.toBeInTheDocument();
  });

  it('persists selected themes and mirrors the resolved document theme', () => {
    render(
      <I18nProvider>
        <ThemeSwitcher />
      </I18nProvider>
    );

    fireEvent.click(screen.getByLabelText('Dracula'));

    expect(window.localStorage.getItem('themePreference')).toBe('dracula');
    expect(window.localStorage.getItem('theme')).toBe('dracula');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dracula');
    expect(screen.getByLabelText('Theme selector')).toHaveTextContent('Dracula');
  });

  it('updates system theme resolution when the OS color scheme changes', () => {
    mediaMatches = false;
    window.localStorage.setItem('themePreference', 'system');

    render(
      <I18nProvider>
        <ThemeSwitcher />
      </I18nProvider>
    );

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    mediaMatches = true;
    for (const listener of mediaListeners) {
      listener({ matches: true } as MediaQueryListEvent);
    }

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('bootstraps legacy and unsafe storage reads to a safe system theme fallback', () => {
    mediaMatches = true;
    window.localStorage.setItem('themePreference', 'cryptosparrow');

    new Function(themeBootstrapScript)();

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('bootstraps supported locale onto the document element', () => {
    window.localStorage.setItem('themePreference', 'forest');
    window.localStorage.setItem('cryptosparrow-locale', 'de-CH');

    new Function(themeBootstrapScript)();

    expect(document.documentElement).toHaveAttribute('data-theme', 'forest');
    expect(document.documentElement).toHaveAttribute('lang', 'de-CH');
  });
});
