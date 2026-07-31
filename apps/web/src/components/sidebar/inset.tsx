import { formatForDisplay } from '@tanstack/react-hotkeys';
import { Link, useLocation } from '@tanstack/react-router';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { hotkeys } from '@/hotkeys';
import { cn } from '@/lib/utils';

export interface BreadcrumbT {
  label: string;
  href?: string;
}

export function AppInset({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbT[];
}) {
  return (
    <SidebarInset>
      <header className="flex h-12 shrink-0 items-center gap-y-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-x-2 px-4">
          <Tooltip>
            <TooltipTrigger render={<SidebarTrigger className="-ml-1" />} />
            <TooltipContent>
              Alternar barra lateral <Kbd>{formatForDisplay(hotkeys.toggleSidebar.keys)}</Kbd>
            </TooltipContent>
          </Tooltip>

          {breadcrumbs?.length && <BreadcrumbNavigation items={breadcrumbs} />}
        </div>
      </header>
      <div className="p-4">{children}</div>
    </SidebarInset>
  );
}

function BreadcrumbNavigation({ items }: { items: BreadcrumbT[] }) {
  const pathname = useLocation({ select: (loc) => loc.pathname });

  return (
    <>
      <Separator orientation="vertical" className="mr-2" />
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isCurrent = !item.href || item.href === pathname;
            const showSeparator = !isLast;

            return (
              <Fragment key={item.href ?? item.label}>
                <BreadcrumbItem className={cn(!isLast && 'hidden md:block')}>
                  {isCurrent ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link to={item.href} />}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {showSeparator && <BreadcrumbSeparator className="hidden md:block" />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
