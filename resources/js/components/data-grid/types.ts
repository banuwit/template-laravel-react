import type { SortingState } from '@tanstack/react-table';

import type {
    FilterOption,
    FilterSelectionVariant,
} from '@/components/filters/types';

export type { Paginated } from '@/types/pagination';

/**
 * Query string shape shared by every server-driven list page.
 */
export type DataGridFilters = {
    search?: string;
    sort?: string;
    direction?: string;
    per_page?: string;
    [key: string]: string | string[] | undefined;
};

/** A facet's options are plain filter options — see `@/components/filters`. */
export type FacetOption = FilterOption;

export interface FacetConfig {
    key: string;
    title: string;
    options: FacetOption[];
    variant?: FilterSelectionVariant;
}

export interface SearchConfig {
    key: string;
    placeholder: string;
}

export interface ToolbarConfig {
    searches?: SearchConfig[];
    facets?: FacetConfig[];
}

export function getSorted(
    sorting: SortingState,
    columnId: string,
): false | 'asc' | 'desc' {
    const entry = sorting.find((sort) => sort.id === columnId);

    if (!entry) {
        return false;
    }

    return entry.desc ? 'desc' : 'asc';
}
