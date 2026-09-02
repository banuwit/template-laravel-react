import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Layers,
    Pencil,
    Plus,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';
import {
    create as example1Create,
    edit as example1Edit,
    index as example1Index,
    show as example1Show,
} from '@/routes/example1';
import type { Paginated } from '@/types';
import { statusLabel } from '@/types/example-record';
import type {
    ExampleFilters,
    ExampleRecord,
    ExampleSortColumn,
} from '@/types/example-record';
import Example1DeleteButton from './example1-delete-button';

type Props = {
    example1: Paginated<ExampleRecord>;
    filters: ExampleFilters;
};

function visit(
    filters: ExampleFilters,
    overrides: Partial<ExampleFilters> = {},
) {
    const search = overrides.search ?? filters.search;
    const sort = overrides.sort ?? filters.sort;
    const direction = overrides.direction ?? filters.direction;

    router.get(
        example1Index.url({
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
    column: ExampleSortColumn;
    filters: ExampleFilters;
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
    column: ExampleSortColumn;
    filters: ExampleFilters;
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

export default function Example1Index({ example1, filters }: Props) {
    const getInitials = useInitials();
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
            <Head title="Example 1" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading
                        variant="small"
                        title="Example 1"
                        description="Demo CRUD with full pages UI — employee profile fields."
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
                                placeholder="Search name, email, or department"
                                aria-label="Search example 1 records"
                            />
                        </InputGroup>

                        <Button asChild>
                            <Link href={example1Create()}>
                                <Plus data-icon="inline-start" />
                                Add New Record
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <CardTitle>All records</CardTitle>
                        <CardDescription>
                            {example1.total === 1
                                ? '1 record'
                                : `${example1.total} records`}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {example1.data.length === 0 ? (
                            <Empty className="border-0">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Layers />
                                    </EmptyMedia>
                                    <EmptyTitle>
                                        {filters.search
                                            ? 'No matching records'
                                            : 'No records yet'}
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        {filters.search
                                            ? 'Try a different search term, or clear the search to see every record.'
                                            : 'Create a record to add the first employee profile to this list.'}
                                    </EmptyDescription>
                                </EmptyHeader>
                                {!filters.search && (
                                    <EmptyContent>
                                        <Button asChild>
                                            <Link href={example1Create()}>
                                                <Plus data-icon="inline-start" />
                                                Add New
                                            </Link>
                                        </Button>
                                    </EmptyContent>
                                )}
                            </Empty>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="[&_td]:px-4 [&_th]:px-4">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                No
                                            </TableHead>
                                            <SortableHead
                                                column="name"
                                                filters={filters}
                                            >
                                                Name
                                            </SortableHead>
                                            <SortableHead
                                                column="department"
                                                filters={filters}
                                            >
                                                Department
                                            </SortableHead>
                                            <TableHead>Position</TableHead>
                                            <SortableHead
                                                column="status"
                                                filters={filters}
                                            >
                                                Status
                                            </SortableHead>
                                            <SortableHead
                                                column="join_date"
                                                filters={filters}
                                            >
                                                Join date
                                            </SortableHead>
                                            <TableHead className="text-right">
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {example1.data.map((record, index) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="text-muted-foreground tabular-nums">
                                                    {example1.from !== null
                                                        ? example1.from + index
                                                        : index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-8">
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(
                                                                    record.name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">
                                                            <Link
                                                                href={example1Show(
                                                                    record.id,
                                                                )}
                                                                className="hover:underline"
                                                            >
                                                                {record.name}
                                                            </Link>
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {record.department}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {record.position}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            record.status ===
                                                            'active'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {statusLabel(
                                                            record.status,
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            record.join_date,
                                                        ),
                                                        'MMM d, yyyy',
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={example1Show(
                                                                    record.id,
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
                                                                href={example1Edit(
                                                                    record.id,
                                                                )}
                                                            >
                                                                <Pencil data-icon="inline-start" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        {record.can_delete && (
                                                            <Example1DeleteButton
                                                                record={record}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>

                    {example1.total > 0 && (
                        <CardFooter className="flex flex-col gap-3 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {example1.from}–{example1.to} of{' '}
                                {example1.total}
                            </p>

                            <div className="flex items-center gap-2">
                                {example1.prev_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={example1.prev_page_url}
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

                                {example1.next_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={example1.next_page_url}
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

Example1Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Example 1',
            href: example1Index(),
        },
    ],
};
