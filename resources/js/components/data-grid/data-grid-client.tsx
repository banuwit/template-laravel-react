import { useTable } from '@tanstack/react-table';
import type {
    ColumnDef,
    ColumnFiltersState,
    ColumnVisibilityState,
    PaginationState,
    RowData,
    SortingState,
} from '@tanstack/react-table';
import * as React from 'react';

import { FacetedFilter } from '@/components/filters/faceted-filter';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { PAGE_SIZE } from './constants';
import { DataGridEmpty } from './data-grid-empty';
import { features } from './data-grid-features';
import type { DataGridFeatures } from './data-grid-features';
import { DataGridPaginationAdvance } from './data-grid-pagination-advance';
import { DataGridPaginationSimple } from './data-grid-pagination-simple';
import { DataGridSearchInput } from './data-grid-search-input';
import { DataGridVisibilityToggle } from './data-grid-visibility-toggle';
import type { ToolbarConfig } from './types';

export interface DataGridClientProps<TData extends RowData> {
    columns: ColumnDef<DataGridFeatures, TData>[];
    data: TData[];
    /** Omit for a plain grid with sorting only — no search or filter. */
    toolbar?: ToolbarConfig;
    defaultSorting?: SortingState;
    /** Extra buttons rendered to the right of the visibility toggle. */
    actions?: React.ReactNode;
    /** Hide the column visibility toggle. Default: true. */
    showVisibilityToggle?: boolean;
    /**
     * Default for `DataGridHeaderDropdown`'s per-column `showVisibilityToggle`
     * prop across every column that doesn't set its own. Default: true.
     */
    showHeaderVisibilityToggle?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyFilteredTitle?: string;
    emptyFilteredDescription?: string;
    /** Pagination style, or `none` to render every row. Default: `advance`. */
    pagination?: 'advance' | 'simple' | 'none';
}

export function DataGridClient<TData extends RowData>({
    columns,
    data,
    toolbar,
    defaultSorting = [],
    actions,
    showVisibilityToggle = true,
    showHeaderVisibilityToggle = true,
    emptyTitle,
    emptyDescription,
    emptyFilteredTitle,
    emptyFilteredDescription,
    pagination = 'advance',
}: DataGridClientProps<TData>) {
    const facets = toolbar?.facets ?? [];
    const searchConfigs = toolbar?.searches ?? [];
    const paginate = pagination !== 'none';

    const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<ColumnVisibilityState>({});
    const [paginationState, setPaginationState] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: PAGE_SIZE,
        });

    const table = useTable({
        features,
        data,
        columns,
        meta: { showHeaderVisibilityToggle },
        enableSortingRemoval: false,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPaginationState,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination: paginationState,
        },
    });

    const resetPage = () => {
        setPaginationState((current) => ({ ...current, pageIndex: 0 }));
    };

    const handleSearch = (key: string, value: string) => {
        table.getColumn(key)?.setFilterValue(value || undefined);
        resetPage();
    };

    const getSearchValue = (key: string) =>
        (columnFilters.find((filter) => filter.id === key)?.value as string) ??
        '';

    const getFacetValues = (key: string) => {
        const applied = columnFilters.find(
            (filter) => filter.id === key,
        )?.value;

        return Array.isArray(applied) ? (applied as string[]) : [];
    };

    const applyFacet = (key: string, values: string[]) => {
        table
            .getColumn(key)
            ?.setFilterValue(values.length ? values : undefined);
        resetPage();
    };

    // `getRowModel()` returns the paginated slice; when pagination is off,
    // read the pre-pagination (filtered + sorted) rows instead so every row
    // renders.
    const rows = paginate
        ? table.getRowModel().rows
        : table.getSortedRowModel().rows;

    return (
        <div className="flex flex-col gap-3">
            {toolbar && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {searchConfigs.map((search) => (
                            <DataGridSearchInput
                                key={search.key}
                                placeholder={search.placeholder}
                                value={getSearchValue(search.key)}
                                onChange={(value) =>
                                    handleSearch(search.key, value)
                                }
                            />
                        ))}
                        {facets.map((facet) => (
                            <FacetedFilter
                                key={facet.key}
                                title={facet.title}
                                options={facet.options}
                                variant={facet.variant}
                                appliedValues={getFacetValues(facet.key)}
                                onApply={(values) =>
                                    applyFacet(facet.key, values)
                                }
                                onClear={() => applyFacet(facet.key, [])}
                            />
                        ))}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {showVisibilityToggle && (
                            <DataGridVisibilityToggle
                                table={table}
                                columnVisibility={columnVisibility}
                            />
                        )}
                        {actions}
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {rows.length ? (
                            rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={
                                        table.getVisibleLeafColumns().length
                                    }
                                    className="p-0"
                                >
                                    <DataGridEmpty
                                        title={
                                            data.length === 0
                                                ? emptyTitle
                                                : emptyFilteredTitle
                                        }
                                        description={
                                            data.length === 0
                                                ? emptyDescription
                                                : emptyFilteredDescription
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {paginate && pagination === 'advance' && (
                <DataGridPaginationAdvance
                    table={table}
                    pagination={paginationState}
                />
            )}
            {paginate && pagination === 'simple' && (
                <DataGridPaginationSimple
                    table={table}
                    pagination={paginationState}
                />
            )}
        </div>
    );
}
