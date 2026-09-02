import type * as React from 'react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export interface PageHeaderProps {
    title: string;
    breadcrumbs?: BreadcrumbItemType[];
    /**
     * Rendered on the right, e.g. a search box, a `FacetedFilter` / `SelectBox`,
     * a status label, or a "Create" button — or several of these together.
     * Stacks under the heading on small screens, sits inline on the right from
     * `lg` up.
     */
    actions?: React.ReactNode;
    className?: string;
}

/**
 * The title + breadcrumbs + optional right-side actions row used at the top
 * of list pages, above the data table/grid card.
 */
export default function PageHeader({
    title,
    breadcrumbs = [],
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between',
                className,
            )}
        >
            <header>
                {breadcrumbs.length > 0 && (
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                )}
                <h2 className="text-base font-medium">{title}</h2>
            </header>
            {actions && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {actions}
                </div>
            )}
        </div>
    );
}
