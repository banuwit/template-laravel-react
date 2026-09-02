import { Pencil } from 'lucide-react';
import type { DataTableColumn } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import ProvinceDeleteButton from './province-delete-button';
import type { ProvinceDialog } from './province-dialogs';

export type ListedProvince = {
    id: number;
    country_id: number;
    country_name: string;
    name: string;
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

export function createProvinceColumns(
    setDialog: (dialog: ProvinceDialog) => void,
): DataTableColumn<ListedProvince>[] {
    return [
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            cell: (record) => (
                <button
                    type="button"
                    className="text-left font-medium hover:underline"
                    onClick={() => setDialog({ type: 'view', record })}
                >
                    {record.name}
                </button>
            ),
        },
        {
            key: 'country',
            header: 'Country',
            cell: (record) => (
                <Badge variant="secondary">{record.country_name}</Badge>
            ),
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            cell: (record) => (
                <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon-sm"
                                type="button"
                                aria-label="Edit"
                                onClick={() =>
                                    setDialog({ type: 'edit', record })
                                }
                            >
                                <Pencil />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    {record.can_delete && (
                        <ProvinceDeleteButton record={record} />
                    )}
                </div>
            ),
        },
    ];
}
