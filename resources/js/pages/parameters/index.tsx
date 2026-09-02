import { Head, router, usePage } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Eye, Pencil, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataGridClient } from '@/components/data-grid/data-grid-client';
import type { DataGridFeatures } from '@/components/data-grid/data-grid-features';
import { DataGridHeaderSort } from '@/components/data-grid/data-grid-header-sort';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { dashboard } from '@/routes';
import { index as parametersIndex } from '@/routes/parameters';
import type { BreadcrumbItem } from '@/types';
import ParameterDeleteButton from './parameter-delete-button';
import ParameterSheets from './parameter-sheets';
import type { ParameterSheet } from './parameter-sheets';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Parameters',
        href: parametersIndex(),
    },
];

export type ListedParameter = {
    id: number;
    group: string;
    code: string;
    value: string;
    description: string | null;
    text_color: string | null;
    bg_color: string | null;
    is_system: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

type Props = {
    parameters: ListedParameter[];
};

function RowActions({
    record,
    onView,
    onEdit,
}: {
    record: ListedParameter;
    onView: () => void;
    onEdit: () => void;
}) {
    return (
        <div className="flex items-center justify-end gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon-sm"
                        type="button"
                        aria-label="View"
                        onClick={onView}
                    >
                        <Eye />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon-sm"
                        type="button"
                        aria-label="Edit"
                        onClick={onEdit}
                    >
                        <Pencil />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            {record.can_delete && <ParameterDeleteButton record={record} />}
        </div>
    );
}

const columnHelper = createColumnHelper<DataGridFeatures, ListedParameter>();

export default function ParametersIndex({ parameters }: Props) {
    const page = usePage();
    const [sheet, setSheet] = useState<ParameterSheet>({ type: 'closed' });

    function closeSheet() {
        setSheet({ type: 'closed' });

        if (Object.keys(page.props.errors ?? {}).length > 0) {
            router.get(
                parametersIndex.url(),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }

    const groupOptions = useMemo(
        () =>
            Array.from(new Set(parameters.map((record) => record.group)))
                .sort()
                .map((group) => ({ value: group, label: group })),
        [parameters],
    );

    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.display({
                    id: 'no',
                    header: 'No.',
                    enableHiding: false,
                    cell: ({ row }) => {
                        const displayIndex = row.getDisplayIndex();

                        return (
                            <span className="text-muted-foreground tabular-nums">
                                {displayIndex === -1 ? '' : displayIndex + 1}
                            </span>
                        );
                    },
                }),
                columnHelper.accessor('group', {
                    header: ({ column }) => (
                        <DataGridHeaderSort column={column} title="Group" />
                    ),
                    cell: ({ getValue }) => (
                        <Badge variant="secondary">{getValue()}</Badge>
                    ),
                    filterFn: 'multiValue',
                }),
                columnHelper.accessor('code', {
                    header: ({ column }) => (
                        <DataGridHeaderSort column={column} title="Code" />
                    ),
                    cell: ({ row }) => (
                        <button
                            type="button"
                            className="text-left font-medium hover:underline"
                            onClick={() =>
                                setSheet({ type: 'view', record: row.original })
                            }
                        >
                            {row.original.code}
                        </button>
                    ),
                }),
                columnHelper.accessor('value', {
                    header: ({ column }) => (
                        <DataGridHeaderSort column={column} title="Value" />
                    ),
                    cell: ({ row }) => {
                        const record = row.original;

                        return record.text_color || record.bg_color ? (
                            <span
                                className="inline-flex rounded-md border px-2 py-0.5 text-xs font-medium"
                                style={{
                                    color: record.text_color ?? undefined,
                                    backgroundColor:
                                        record.bg_color ?? undefined,
                                }}
                            >
                                {record.value}
                            </span>
                        ) : (
                            record.value
                        );
                    },
                }),
                columnHelper.accessor(
                    (record) => (record.is_active ? 'active' : 'inactive'),
                    {
                        id: 'is_active',
                        header: ({ column }) => (
                            <DataGridHeaderSort
                                column={column}
                                title="Status"
                            />
                        ),
                        cell: ({ getValue }) => (
                            <Badge
                                variant={
                                    getValue() === 'active'
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {getValue() === 'active'
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
                        ),
                        filterFn: 'multiValue',
                    },
                ),
                columnHelper.accessor('sort_order', {
                    header: ({ column }) => (
                        <DataGridHeaderSort column={column} title="Order" />
                    ),
                }),
                columnHelper.display({
                    id: 'actions',
                    cell: ({ row }) => (
                        <RowActions
                            record={row.original}
                            onView={() =>
                                setSheet({ type: 'view', record: row.original })
                            }
                            onEdit={() =>
                                setSheet({ type: 'edit', record: row.original })
                            }
                        />
                    ),
                }),
            ]),
        [],
    );

    return (
        <>
            <Head title="Parameters" />

            <ParameterSheets
                sheet={sheet}
                onSheetChange={(next) => {
                    if (next.type === 'closed') {
                        closeSheet();

                        return;
                    }

                    setSheet(next);
                }}
            >
                <div className="flex min-h-0 flex-1 flex-col gap-6 p-4">
                    <PageHeader
                        title="Parameters"
                        breadcrumbs={breadcrumbs}
                        actions={
                            <Button
                                type="button"
                                onClick={() => setSheet({ type: 'create' })}
                            >
                                <Plus data-icon="inline-start" />
                                Add New
                            </Button>
                        }
                    />

                    <Card className="gap-0 overflow-hidden py-0">
                        <CardContent className="p-4">
                            <DataGridClient
                                columns={columns}
                                data={parameters}
                                defaultSorting={[
                                    { id: 'sort_order', desc: false },
                                ]}
                                showVisibilityToggle={false}
                                toolbar={{
                                    searches: [
                                        {
                                            key: 'code',
                                            placeholder: 'Search code...',
                                        },
                                    ],
                                    facets: [
                                        {
                                            key: 'group',
                                            title: 'Group',
                                            options: groupOptions,
                                        },
                                        {
                                            key: 'is_active',
                                            title: 'Status',
                                            options: [
                                                {
                                                    value: 'active',
                                                    label: 'Active',
                                                },
                                                {
                                                    value: 'inactive',
                                                    label: 'Inactive',
                                                },
                                            ],
                                        },
                                    ],
                                }}
                                emptyTitle="No parameters yet"
                                emptyDescription="Create a record to add the first one to this list."
                                emptyFilteredTitle="No matching parameters"
                                emptyFilteredDescription="Try a different search term, or clear the filters to see every record."
                            />
                        </CardContent>
                    </Card>
                </div>
            </ParameterSheets>
        </>
    );
}

ParametersIndex.layout = {
    breadcrumbs,
};
