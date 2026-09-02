import { Pencil } from 'lucide-react';
import type { DataTableColumn } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import MenuDeleteButton from './menu-delete-button';
import type { MenuSheet } from './menu-sheets';

export type MenuLayout = 'sidebar' | 'topbar' | 'footer';

export type ListedMenu = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    route_name: string | null;
    route_pattern: string | null;
    parent_id: number | null;
    parent_name: string | null;
    level: number;
    sort_order: number;
    layout: MenuLayout;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

export function createMenuColumns(
    setSheet: (sheet: MenuSheet) => void,
): DataTableColumn<ListedMenu>[] {
    return [
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            cell: (record) => (
                <button
                    type="button"
                    className="text-left font-medium hover:underline"
                    onClick={() => setSheet({ type: 'view', record })}
                >
                    {record.name}
                </button>
            ),
        },
        {
            key: 'slug',
            header: 'Slug',
            sortable: true,
            cell: (record) => (
                <span className="text-muted-foreground">{record.slug}</span>
            ),
        },
        {
            key: 'parent',
            header: 'Parent',
            cell: (record) =>
                record.parent_name ? (
                    <Badge variant="secondary">{record.parent_name}</Badge>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            key: 'layout',
            header: 'Layout',
            sortable: true,
            cell: (record) => (
                <Badge variant="outline" className="capitalize">
                    {record.layout}
                </Badge>
            ),
        },
        {
            key: 'sort_order',
            header: 'Order',
            sortable: true,
            align: 'right',
            cell: (record) => record.sort_order,
        },
        {
            key: 'is_active',
            header: 'Status',
            cell: (record) => (
                <Badge variant={record.is_active ? 'default' : 'secondary'}>
                    {record.is_active ? 'Active' : 'Inactive'}
                </Badge>
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
                                    setSheet({ type: 'edit', record })
                                }
                            >
                                <Pencil />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    {record.can_delete && <MenuDeleteButton record={record} />}
                </div>
            ),
        },
    ];
}
