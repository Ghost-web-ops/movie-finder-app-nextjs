// components/ScrollToTop.tsx
"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * This component automatically scrolls the window to the top
 * whenever the user navigates to a new page.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component does not render anything
}
