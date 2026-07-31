import { useMatches } from '@tanstack/react-router';

import type { BreadcrumbT } from '@/components/sidebar/inset';

export interface BreadcrumbLoaderData {
  breadcrumb: BreadcrumbT | BreadcrumbT[];
}

export function useQuickBreadcrumb(): BreadcrumbT[] {
  const matches = useMatches();
  return matches
    .filter(
      (match): match is typeof match & { loaderData: BreadcrumbLoaderData } =>
        match.loaderData !== undefined &&
        typeof match.loaderData === 'object' &&
        'breadcrumb' in match.loaderData,
    )
    .flatMap((match) => {
      const { breadcrumb } = match.loaderData;
      return Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb];
    });
}
