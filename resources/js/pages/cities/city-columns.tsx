import { Pencil } from 'lucide-react';
import type { DataTableColumn } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import CityDeleteButton from './city-delete-button';
import type { CityDialog } from './city-dialogs';

export type ListedCity = {
    id: number;
    province_id: number;
    province_name: string;
    country_name: string;
    name: string;
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

export function createCityColumns(
    setDialog: (dialog: CityDialog) => void,
): DataTableColumn<ListedCity>[] {
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
            key: 'province',
            header: 'Province',
            cell: (record) => (
                <Badge variant="secondary">{record.province_name}</Badge>
            ),
        },
        {
            key: 'country',
            header: 'Country',
            cell: (record) => (
                <span className="text-muted-foreground">
                    {record.country_name}
                </span>
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
                    {record.can_delete && <CityDeleteButton record={record} />}
                </div>
            ),
        },
    ];
}
