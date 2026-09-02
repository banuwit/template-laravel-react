import { Subscribe } from '@tanstack/react-table';
import type { Column, RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { DataTableFeatures } from './data-table-features';

interface DataTableColumnHeaderProps<
    TData extends RowData,
    TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<DataTableFeatures, TData, TValue>;
    title: string;
}

function sortDirection(
    sorting: Array<{ id: string; desc: boolean }>,
    columnId: string,
): false | 'asc' | 'desc' {
    const sort = sorting.find((item) => item.id === columnId);

    if (!sort) {
        return false;
    }

    return sort.desc ? 'desc' : 'asc';
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <Subscribe
            source={column.table.store}
            selector={(state) => sortDirection(state.sorting, column.id)}
        >
            {(sorted) => (
                <div className={cn('flex items-center gap-2', className)}>
                    <Button
                        variant="ghost"
                        size="sm"
                        aria-sort={
                            sorted === 'desc'
                                ? 'descending'
                                : sorted === 'asc'
                                  ? 'ascending'
                                  : undefined
                        }
                        className={cn(
                            '-ml-3 h-8',
                            sorted && 'font-bold text-primary',
                        )}
                        onClick={column.getToggleSortingHandler()}
                    >
                        <span>{title}</span>
                        {sorted === 'desc' ? (
                            <ArrowDown data-icon="inline-end" />
                        ) : sorted === 'asc' ? (
                            <ArrowUp data-icon="inline-end" />
                        ) : (
                            <ChevronsUpDown
                                data-icon="inline-end"
                                className="text-muted-foreground"
                            />
                        )}
                    </Button>
                </div>
            )}
        </Subscribe>
    );
}
