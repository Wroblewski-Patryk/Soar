'use client';

import { useRef } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import type { Locale } from '../../../i18n/translations';
import { useDetailsDropdown } from '../../hooks/useDetailsDropdown';
import { getHeaderDropdownLinkClass, getHeaderDropdownMenuClass, headerMenuItemClass } from './headerControlStyles';

type LocaleCode = Locale;
type FlagId = 'gb' | 'pl' | 'pt' | 'ch';
type LanguageOption = {
  locale: LocaleCode;
  labelKey: string;
  shortLabel: string;
  countryCode: string;
  flag: FlagId;
};

type DropdownPlacement = 'top' | 'bottom';
type LanguageSwitcherTone = 'header' | 'footer';

type LanguageSwitcherProps = {
  placement?: DropdownPlacement;
  summaryClassName?: string;
  tone?: LanguageSwitcherTone;
};

const LANGUAGES: LanguageOption[] = [
  {
    locale: 'en',
    labelKey: 'public.localeNames.en',
    shortLabel: 'EN',
    countryCode: 'gb',
    flag: 'gb',
  },
  {
    locale: 'pl',
    labelKey: 'public.localeNames.pl',
    shortLabel: 'PL',
    countryCode: 'pl',
    flag: 'pl',
  },
  {
    locale: 'pt',
    labelKey: 'public.localeNames.pt',
    shortLabel: 'PT',
    countryCode: 'pt',
    flag: 'pt',
  },
  {
    locale: 'de-CH',
    labelKey: 'public.localeNames.deCH',
    shortLabel: 'CH',
    countryCode: 'ch',
    flag: 'ch',
  },
];

const getLanguage = (locale: LocaleCode) =>
  LANGUAGES.find((item) => item.locale === locale) ?? LANGUAGES[0];

function FlagSvg({ flag }: { flag: FlagId }) {
  if (flag === 'ch') {
    return (
      <>
        <rect width="30" height="20" fill="#d52b1e" />
        <rect x="12" y="4" width="6" height="12" fill="#fff" />
        <rect x="8" y="8" width="14" height="4" fill="#fff" />
      </>
    );
  }

  if (flag === 'pl') {
    return (
      <>
        <rect width="30" height="10" fill="#fff" />
        <rect y="10" width="30" height="10" fill="#dc143c" />
      </>
    );
  }

  if (flag === 'pt') {
    return (
      <>
        <rect width="12" height="20" fill="#046a38" />
        <rect x="12" width="18" height="20" fill="#da291c" />
        <circle cx="12" cy="10" r="3.7" fill="#ffcd00" />
        <circle cx="12" cy="10" r="2.4" fill="#fff" />
        <path d="M10.7 8.4h2.6v3.4a1.9 1.9 0 0 1-2.6 0z" fill="#c8102e" />
        <path d="M11.2 8.9h1.6v2.5a1.15 1.15 0 0 1-1.6 0z" fill="#003399" />
      </>
    );
  }

  return (
    <>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="2.4" />
      <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
      <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.6" />
    </>
  );
}

function FlagIcon({ option }: { option: LanguageOption }) {
  return (
    <svg
      aria-hidden
      className="h-4 w-6 shrink-0 overflow-hidden rounded-[2px] border border-base-content/20 shadow-sm"
      data-testid={`flag-${option.locale}`}
      focusable="false"
      viewBox="0 0 30 20"
    >
      <FlagSvg flag={option.flag} />
    </svg>
  );
}

export default function LanguageSwitcher({
  placement = 'bottom',
  summaryClassName = '',
  tone = 'header',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useDetailsDropdown(detailsRef);
  const active = getLanguage(locale);
  const activeLabel = t(active.labelKey);
  const detailsClass = `dropdown dropdown-end group ${placement === 'top' ? 'dropdown-top' : ''}`;
  const menuClass = getHeaderDropdownMenuClass(placement, 'w-44');
  const summaryToneClass =
    tone === 'footer'
      ? 'inline-flex min-h-9 items-center gap-2 rounded-md px-3 py-2 text-base-content/80 hover:bg-base-content/10 hover:text-base-content/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-content/35 transition-colors group-open:bg-base-content/10 group-open:text-base-content/80 list-none cursor-pointer [&::-webkit-details-marker]:hidden'
      : `${headerMenuItemClass} font-normal`;

  const handleSelect = (next: LocaleCode) => {
    setLocale(next);
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className={detailsClass}>
      <summary className={`${summaryToneClass} ${summaryClassName}`.trim()} aria-label={t('dashboard.common.language')}>
        <FlagIcon option={active} />
        <span>{activeLabel || active.shortLabel}</span>
      </summary>
      <ul className={menuClass}>
        {LANGUAGES.map((option) => (
          <li key={option.locale}>
            <button
              type="button"
              onClick={() => handleSelect(option.locale)}
              className={getHeaderDropdownLinkClass(locale === option.locale)}
            >
              <FlagIcon option={option} />
              {t(option.labelKey)}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
