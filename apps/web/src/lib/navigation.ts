'use client';

import { startTransition } from 'react';

type RouterNavigation = {
  push: (href: string) => void;
  replace: (href: string) => void;
};

type NavigateWithFallbackOptions = {
  href: string;
  mode?: 'push' | 'replace';
  fallbackPrefix?: string;
  delayMs?: number;
  documentNavigation?: boolean;
};

export const navigateWithFallback = (
  router: RouterNavigation,
  {
    href,
    mode = 'replace',
    fallbackPrefix,
    delayMs = 250,
    documentNavigation = false,
  }: NavigateWithFallbackOptions
) => {
  if (
    documentNavigation &&
    typeof window !== 'undefined' &&
    process.env.NODE_ENV !== 'test'
  ) {
    if (mode === 'push') {
      window.location.assign(href);
    } else {
      window.location.replace(href);
    }
    return;
  }

  const navigate = mode === 'push' ? router.push : router.replace;
  startTransition(() => {
    navigate(href);
  });

  if (
    typeof window === 'undefined' ||
    process.env.NODE_ENV === 'test' ||
    !fallbackPrefix
  ) {
    return;
  }

  window.setTimeout(() => {
    if (!window.location.pathname.startsWith(fallbackPrefix)) return;
    startTransition(() => {
      navigate(href);
    });
  }, delayMs);
};
