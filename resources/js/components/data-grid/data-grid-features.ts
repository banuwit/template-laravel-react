import {
    columnFilteringFeature,
    columnVisibilityFeature,
    constructFilterFn,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_includesString,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures,
} from '@tanstack/react-table';

/**
 * Type of `table.options.meta` for every data-grid instance.
 *
 * Lets `DataGridClient` / `DataGridServer` set page-wide defaults that column
 * header components read as a fallback when their own per-column prop is left
 * unset — e.g. `DataGridHeaderDropdown`'s `showVisibilityToggle`.
 */
export interface DataGridTableMeta {
    /**
     * Default for `DataGridHeaderDropdown`'s `showVisibilityToggle` prop on
     * every column that doesn't set its own. Default: true.
     */
    showHeaderVisibilityToggle?: boolean;
}

/**
 * Keeps rows whose column value is one of the selected facet values.
 *
 * Backs the `multiValue` filter used by the toolbar's `FacetedFilter`: an empty
 * selection means "no filter", so it is auto-removed from filter state.
 */
const filterFn_multiValue = constructFilterFn({
    filter: (dataValue, filterValue: string[]) => {
        if (!filterValue?.length) {
            return true;
        }

        return filterValue.includes(dataValue as string);
    },
    autoRemove: (filterValue) =>
        !Array.isArray(filterValue) || filterValue.length === 0,
});

// New in v9: declare the features this grid uses — anything you don't
// register is tree-shaken out of the bundle.
export const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: {
        includesString: filterFn_includesString,
        multiValue: filterFn_multiValue,
    },
    sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
    tableMeta: {} as DataGridTableMeta,
});

// Pass this as the first generic argument to `ColumnDef`, `Column`, `Table`,
// and `Row` so each type knows which feature APIs are available.
export type DataGridFeatures = typeof features;
