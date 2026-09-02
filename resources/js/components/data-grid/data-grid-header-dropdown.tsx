import { Subscribe } from '@tanstack/react-table';
import type {
    Column,
    ColumnVisibilityState,
    RowData,
    Table,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import type { DataGridFeatures } from './data-grid-features';
import { DataGridVisibilityHeader } from './data-grid-visibility-header';
import { getSorted } from './types';

interface DataGridHeaderDropdownProps<
    TData extends RowData,
    TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<DataGridFeatures, TData, TValue>;
    title: string;
    /**
     * Sort direction supplied by the caller (server-driven grids). When
     * omitted, the direction is read reactively from the table store.
     */
    sorted?: false | 'asc' | 'desc';
    onSortChange?: (desc: boolean) => void;
    /**
     * Show the "View columns" submenu (column visibility toggle) inside this
     * column's dropdown. Requires `table` when enabled — pass `false` to
     * render a plain sort-only dropdown without `table` / `columnVisibility`.
     *
     * Defaults to `table.options.meta.showHeaderVisibilityToggle` (set by
     * `DataGridClient` / `DataGridServer`'s own `showHeaderVisibilityToggle`
     * prop), or `true` when that isn't set either — so a page can turn this
     * off for every column at once instead of passing it per column.
     */
    showVisibilityToggle?: boolean;
    table?: Table<DataGridFeatures, TData>;
    columnVisibility?: ColumnVisibilityState;
}

export function DataGridHeaderDropdown<TData extends RowData, TValue>({
    column,
    title,
    sorted,
    onSortChange,
    showVisibilityToggle,
    table,
    columnVisibility,
    className,
}: DataGridHeaderDropdownProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    const resolvedShowVisibilityToggle =
        showVisibilityToggle ??
        table?.options.meta?.showHeaderVisibilityToggle ??
        true;

    const sort = (desc: boolean) => {
        if (onSortChange) {
            onSortChange(desc);
        } else {
            column.toggleSorting(desc);
        }
    };

    const renderMenu = (current: false | 'asc' | 'desc') => (
        <div className={cn('flex items-center gap-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        aria-sort={
                            current === 'desc'
                                ? 'descending'
                                : current === 'asc'
                                  ? 'ascending'
                                  : undefined
                        }
                        className={cn(
                            '-ml-3 h-8 data-[state=open]:bg-accent',
                            current
                                ? 'font-semibold text-foreground'
                                : 'font-normal text-muted-foreground',
                        )}
                    >
                        <span>{title}</span>
                        {current === 'desc' ? (
                            <ArrowDown
                                data-icon="inline-end"
                                className="text-primary"
                            />
                        ) : current === 'asc' ? (
                            <ArrowUp
                                data-icon="inline-end"
                                className="text-primary"
                            />
                        ) : (
                            <ChevronsUpDown
                                data-icon="inline-end"
                                className="opacity-40"
                            />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="start"
                    onCloseAutoFocus={(event) => event.preventDefault()}
                >
                    <DropdownMenuItem onClick={() => sort(false)}>
                        <ArrowUp />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => sort(true)}>
                        <ArrowDown />
                        Desc
                    </DropdownMenuItem>
                    {resolvedShowVisibilityToggle && table && (
                        <>
                            <DropdownMenuSeparator />
                            <DataGridVisibilityHeader
                                table={table}
                                columnVisibility={columnVisibility ?? {}}
                            />
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    if (sorted !== undefined) {
        return renderMenu(sorted);
    }

    return (
        <Subscribe
            source={column.table.store}
            selector={(state) => getSorted(state.sorting, column.id)}
        >
            {(storeSorted) => renderMenu(storeSorted)}
        </Subscribe>
    );
}
