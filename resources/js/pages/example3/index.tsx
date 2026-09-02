import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    PanelRight,
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
import { index as example3Index } from '@/routes/example3';
import type { Paginated } from '@/types';
import { statusLabel } from '@/types/example-record';
import type {
    ExampleFilters,
    ExampleRecord,
    ExampleSortColumn,
} from '@/types/example-record';
import Example3DeleteButton from './example3-delete-button';
import Example3Sheets from './example3-sheets';
import type { Example3Sheet } from './example3-sheets';

type Props = {
    example3: Paginated<ExampleRecord>;
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
        example3Index.url({
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

export default function Example3Index({ example3, filters }: Props) {
    const page = usePage();
    const getInitials = useInitials();
    const [search, setSearch] = useState(filters.search);
    const [sheet, setSheet] = useState<Example3Sheet>({ type: 'closed' });

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

    function closeSheet() {
        setSheet({ type: 'closed' });

        if (Object.keys(page.props.errors ?? {}).length > 0) {
            visit(filters);
        }
    }

    return (
        <>
            <Head title="Example 3" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading
                        variant="small"
                        title="Example 3"
                        description="Demo CRUD with sheet UI"
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
                                aria-label="Search example 3 records"
                            />
                        </InputGroup>

                        <Button
                            type="button"
                            onClick={() => setSheet({ type: 'create' })}
                        >
                            <Plus data-icon="inline-start" />
                            Add New Record
                        </Button>
                    </div>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <CardTitle>All records</CardTitle>
                        <CardDescription>
                            {example3.total === 1
                                ? '1 record'
                                : `${example3.total} records`}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {example3.data.length === 0 ? (
                            <Empty className="border-0">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <PanelRight />
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
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setSheet({ type: 'create' })
                                            }
                                        >
                                            <Plus data-icon="inline-start" />
                                            Add New
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
                                        {example3.data.map((record, index) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="text-muted-foreground tabular-nums">
                                                    {example3.from !== null
                                                        ? example3.from + index
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
                                                        <button
                                                            type="button"
                                                            className="text-left font-medium hover:underline"
                                                            onClick={() =>
                                                                setSheet({
                                                                    type: 'view',
                                                                    record,
                                                                })
                                                            }
                                                        >
                                                            {record.name}
                                                        </button>
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
                                                            type="button"
                                                            onClick={() =>
                                                                setSheet({
                                                                    type: 'view',
                                                                    record,
                                                                })
                                                            }
                                                        >
                                                            <Eye data-icon="inline-start" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            type="button"
                                                            onClick={() =>
                                                                setSheet({
                                                                    type: 'edit',
                                                                    record,
                                                                })
                                                            }
                                                        >
                                                            <Pencil data-icon="inline-start" />
                                                            Edit
                                                        </Button>
                                                        {record.can_delete && (
                                                            <Example3DeleteButton
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

                    {example3.total > 0 && (
                        <CardFooter className="flex flex-col gap-3 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {example3.from}–{example3.to} of{' '}
                                {example3.total}
                            </p>

                            <div className="flex items-center gap-2">
                                {example3.prev_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={example3.prev_page_url}
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

                                {example3.next_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={example3.next_page_url}
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

            <Example3Sheets
                sheet={sheet}
                onSheetChange={(next) => {
                    if (next.type === 'closed') {
                        closeSheet();

                        return;
                    }

                    setSheet(next);
                }}
            />
        </>
    );
}

Example3Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Example 3',
            href: example3Index(),
        },
    ],
};
