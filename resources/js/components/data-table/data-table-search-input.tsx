import type { ReactTable, RowData } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import type { DataTableFeatures } from './data-table-features';

interface DataTableSearchInputProps<TData extends RowData> {
    table: ReactTable<DataTableFeatures, TData>;
    columnId?: string;
    placeholder?: string;
    className?: string;
}

export function DataTableSearchInput<TData extends RowData>({
    table,
    columnId = 'name',
    placeholder = 'Search names...',
    className,
}: DataTableSearchInputProps<TData>) {
    const column = table.getColumn(columnId);

    return (
        <Input
            placeholder={placeholder}
            value={(column?.getFilterValue() as string) ?? ''}
            onChange={(event) => column?.setFilterValue(event.target.value)}
            className={cn('w-[200px]', className)}
            aria-label={placeholder}
        />
    );
}
