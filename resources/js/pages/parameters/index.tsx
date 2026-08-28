import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Plus,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import ParameterDeleteButton from '@/components/parameter-delete-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import {
    create as parametersCreate,
    edit as parametersEdit,
    index as parametersIndex,
    show as parametersShow,
} from '@/routes/parameters';
import type { Paginated } from '@/types';

type ListedParameter = {
    id: number;
    group: string;
    code: string;
    value: string;
    is_system: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    can_delete: boolean;
};

type SortColumn = 'group' | 'code' | 'value' | 'sort_order' | 'created_at';

type ParameterFilters = {
    search: string;
    sort: SortColumn;
    direction: 'asc' | 'desc';
};

type Props = {
    parameters: Paginated<ListedParameter>;
    filters: ParameterFilters;
};

function visit(filters: ParameterFilters, overrides: Partial<ParameterFilters> = {}) {
    const search = overrides.search ?? filters.search;
    const sort = overrides.sort ?? filters.sort;
    const direction = overrides.direction ?? filters.direction;

    router.get(
        parametersIndex.url({
            query: {
                ...(search !== '' ? { search } : {}),
                ...(sort !== 'created_at' ? { sort } : {}),
                ...(direction !== 'desc' ? { direction } : {}),
            },
        }),
        {},
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        },
    );
}

function SortIcon({
    column,
    filters,
}: {
    column: SortColumn;
    filters: ParameterFilters;
}) {
    if (filters.sort !== column) {
        return <ArrowUpDown className="size-3.5 text-muted-foreground" />;
    }

    if (filters.direction === 'asc') {
        return <ArrowUp className="size-3.5" />;
    }

    return <ArrowDown className="size-3.5" />;
}

function SortableHead({
    column,
    filters,
    children,
}: {
    column: SortColumn;
    filters: ParameterFilters;
    children: string;
}) {
    const isActive = filters.sort === column;

    return (
        <TableHead
            aria-sort={
                isActive
                    ? filters.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                    : 'none'
            }
        >
            <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-sm font-medium hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                onClick={() =>
                    visit(filters, {
                        sort: column,
                        direction:
                            isActive && filters.direction === 'asc'
                                ? 'desc'
                                : 'asc',
                    })
                }
            >
                {children}
                <SortIcon column={column} filters={filters} />
            </button>
        </TableHead>
    );
}

export default function ParametersIndex({ parameters, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    useEffect(() => {
        const nextSearch = search.trim();

        if (nextSearch === filters.search) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            visit(filters, { search: nextSearch });
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [search, filters]);

    return (
        <>
            <Head title="Parameters" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading
                        variant="small"
                        title="Parameters"
                        description="Manage reference values and system parameters."
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <InputGroup className="w-full sm:max-w-xs">
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                            <InputGroupInput
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search group, code, or value"
                                aria-label="Search parameters"
                            />
                        </InputGroup>

                        <Button asChild>
                            <Link href={parametersCreate()}>
                                <Plus data-icon="inline-start" />
                                Add New
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <CardTitle>All parameters</CardTitle>
                        <CardDescription>
                            {parameters.total === 1
                                ? '1 parameter'
                                : `${parameters.total} parameters`}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {parameters.data.length === 0 ? (
                            <Empty className="border-0">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <SlidersHorizontal />
                                    </EmptyMedia>
                                    <EmptyTitle>
                                        {filters.search
                                            ? 'No matching parameters'
                                            : 'No parameters yet'}
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        {filters.search
                                            ? 'Try a different group, code, or value, or clear the search to see everything.'
                                            : 'Create a parameter to add the first entry to this list.'}
                                    </EmptyDescription>
                                </EmptyHeader>
                                {!filters.search && (
                                    <EmptyContent>
                                        <Button asChild>
                                            <Link href={parametersCreate()}>
                                                <Plus data-icon="inline-start" />
                                                Add New
                                            </Link>
                                        </Button>
                                    </EmptyContent>
                                )}
                            </Empty>
                        ) : (
                            <Table className="[&_td]:px-4 [&_th]:px-4">
                                <TableHeader>
                                    <TableRow>
                                        <SortableHead
                                            column="group"
                                            filters={filters}
                                        >
                                            Group
                                        </SortableHead>
                                        <SortableHead
                                            column="code"
                                            filters={filters}
                                        >
                                            Code
                                        </SortableHead>
                                        <SortableHead
                                            column="value"
                                            filters={filters}
                                        >
                                            Value
                                        </SortableHead>
                                        <TableHead>Status</TableHead>
                                        <SortableHead
                                            column="sort_order"
                                            filters={filters}
                                        >
                                            Order
                                        </SortableHead>
                                        <TableHead className="text-right">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parameters.data.map((parameter) => (
                                        <TableRow key={parameter.id}>
                                            <TableCell className="text-muted-foreground">
                                                {parameter.group}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">
                                                    <Link
                                                        href={parametersShow(
                                                            parameter.id,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {parameter.code}
                                                    </Link>
                                                </span>
                                                {parameter.is_system && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-2"
                                                    >
                                                        System
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {parameter.value}
                                            </TableCell>
                                            <TableCell>
                                                {parameter.is_active ? (
                                                    <Badge variant="secondary">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {parameter.sort_order}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={parametersShow(
                                                                parameter.id,
                                                            )}
                                                        >
                                                            <Eye data-icon="inline-start" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={parametersEdit(
                                                                parameter.id,
                                                            )}
                                                        >
                                                            <Pencil data-icon="inline-start" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    {parameter.can_delete && (
                                                        <ParameterDeleteButton
                                                            parameter={parameter}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>

                    {parameters.total > 0 && (
                        <CardFooter className="flex flex-col gap-3 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {parameters.from}–{parameters.to} of{' '}
                                {parameters.total}
                            </p>

                            <div className="flex items-center gap-2">
                                {parameters.prev_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={parameters.prev_page_url}
                                            preserveState
                                            preserveScroll
                                        >
                                            <ChevronLeft data-icon="inline-start" />
                                            Previous
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                    >
                                        <ChevronLeft data-icon="inline-start" />
                                        Previous
                                    </Button>
                                )}

                                {parameters.next_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={parameters.next_page_url}
                                            preserveState
                                            preserveScroll
                                        >
                                            Next
                                            <ChevronRight data-icon="inline-end" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                    >
                                        Next
                                        <ChevronRight data-icon="inline-end" />
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </>
    );
}

ParametersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Parameters',
            href: parametersIndex(),
        },
    ],
};
