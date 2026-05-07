'use client';

import { useEffect, useState } from 'react';

export const useHydrationReady = () => {
  const [isHydrationReady, setIsHydrationReady] = useState(false);

  useEffect(() => {
    setIsHydrationReady(true);
  }, []);

  return isHydrationReady;
};
