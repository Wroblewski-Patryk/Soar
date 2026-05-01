'use client';

import { useRef, type CSSProperties } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import type { Locale } from '../../../i18n/translations';
import { useDetailsDropdown } from '../../hooks/useDetailsDropdown';
import { getHeaderDropdownLinkClass, getHeaderDropdownMenuClass, headerMenuItemClass } from './headerControlStyles';

type LocaleCode = Locale;
type LanguageOption = {
  locale: LocaleCode;
  labelKey: string;
  shortLabel: string;
  countryCode: string;
  flagClassName: string;
  flagStyle?: CSSProperties;
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
    flagClassName: 'bg-[#012169]',
    flagStyle: {
      backgroundImage:
        'linear-gradient(28deg, transparent 0 39%, #fff 39% 45%, #c8102e 45% 50%, #fff 50% 56%, transparent 56% 100%), linear-gradient(152deg, transparent 0 39%, #fff 39% 45%, #c8102e 45% 50%, #fff 50% 56%, transparent 56% 100%), linear-gradient(90deg, transparent 0 42%, #fff 42% 58%, transparent 58% 100%), linear-gradient(0deg, transparent 0 35%, #fff 35% 65%, transparent 65% 100%), linear-gradient(90deg, transparent 0 46%, #c8102e 46% 54%, transparent 54% 100%), linear-gradient(0deg, transparent 0 41%, #c8102e 41% 59%, transparent 59% 100%)',
    },
  },
  {
    locale: 'pl',
    labelKey: 'public.localeNames.pl',
    shortLabel: 'PL',
    countryCode: 'pl',
    flagClassName: 'bg-[linear-gradient(to_bottom,#ffffff_0_50%,#dc143c_50%_100%)]',
  },
  {
    locale: 'pt',
    labelKey: 'public.localeNames.pt',
    shortLabel: 'PT',
    countryCode: 'pt',
    flagClassName: 'bg-[linear-gradient(to_right,#046a38_0_42%,#da291c_42%_100%)]',
  },
];

const getLanguage = (locale: LocaleCode) =>
  LANGUAGES.find((item) => item.locale === locale) ?? LANGUAGES[0];

function FlagIcon({ option }: { option: LanguageOption }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[2px] border border-base-content/20 shadow-sm ${option.flagClassName}`}
      data-testid={`flag-${option.locale}`}
      style={option.flagStyle}
      title={option.countryCode.toUpperCase()}
    />
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
