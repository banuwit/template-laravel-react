import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Globe,
    Pencil,
    Plus,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CountryDeleteButton from '@/components/country-delete-button';
import Heading from '@/components/heading';
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
import { index as countriesIndex } from '@/routes/countries';
import type { Paginated } from '@/types';
import CountryDialogs from './country-dialogs';
import type { CountryDialog, ListedCountry } from './country-dialogs';

type SortColumn = 'name' | 'code' | 'created_at';

type CountryFilters = {
    search: string;
    sort: SortColumn;
    direction: 'asc' | 'desc';
};

type Props = {
    countries: Paginated<ListedCountry>;
    filters: CountryFilters;
};

function visit(
    filters: CountryFilters,
    overrides: Partial<CountryFilters> = {},
) {
    const search = overrides.search ?? filters.search;
    const sort = overrides.sort ?? filters.sort;
    const direction = overrides.direction ?? filters.direction;

    router.get(
        countriesIndex.url({
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
    filters: CountryFilters;
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
    filters: CountryFilters;
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

export default function CountriesIndex({ countries, filters }: Props) {
    const page = usePage();
    const [search, setSearch] = useState(filters.search);
    const [dialog, setDialog] = useState<CountryDialog>({ type: 'closed' });

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

    function closeDialog() {
        setDialog({ type: 'closed' });

        if (Object.keys(page.props.errors ?? {}).length > 0) {
            visit(filters);
        }
    }

    return (
        <>
            <Head title="Countries" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading
                        variant="small"
                        title="Countries"
                        description="Search, sort, and manage countries used across the workspace."
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
                                placeholder="Search name or code"
                                aria-label="Search countries"
                            />
                        </InputGroup>

                        <Button
                            type="button"
                            onClick={() => setDialog({ type: 'create' })}
                        >
                            <Plus data-icon="inline-start" />
                            Add New Country
                        </Button>
                    </div>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <CardTitle>All countries</CardTitle>
                        <CardDescription>
                            {countries.total === 1
                                ? '1 country'
                                : `${countries.total} countries`}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {countries.data.length === 0 ? (
                            <Empty className="border-0">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Globe />
                                    </EmptyMedia>
                                    <EmptyTitle>
                                        {filters.search
                                            ? 'No matching countries'
                                            : 'No countries yet'}
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        {filters.search
                                            ? 'Try a different name or code, or clear the search to see every country.'
                                            : 'Create a country to add the first record to this list.'}
                                    </EmptyDescription>
                                </EmptyHeader>
                                {!filters.search && (
                                    <EmptyContent>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setDialog({ type: 'create' })
                                            }
                                        >
                                            <Plus data-icon="inline-start" />
                                            Add New
                                        </Button>
                                    </EmptyContent>
                                )}
                            </Empty>
                        ) : (
                            <Table className="[&_td]:px-4 [&_th]:px-4">
                                <TableHeader>
                                    <TableRow>
                                        <SortableHead
                                            column="name"
                                            filters={filters}
                                        >
                                            Name
                                        </SortableHead>
                                        <SortableHead
                                            column="code"
                                            filters={filters}
                                        >
                                            Code
                                        </SortableHead>
                                        <SortableHead
                                            column="created_at"
                                            filters={filters}
                                        >
                                            Added
                                        </SortableHead>
                                        <TableHead className="text-right">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {countries.data.map((country) => (
                                        <TableRow key={country.id}>
                                            <TableCell>
                                                <button
                                                    type="button"
                                                    className="font-medium hover:underline"
                                                    onClick={() =>
                                                        setDialog({
                                                            type: 'view',
                                                            country,
                                                        })
                                                    }
                                                >
                                                    {country.name}
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {country.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(
                                                    new Date(
                                                        country.created_at,
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
                                                            setDialog({
                                                                type: 'view',
                                                                country,
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
                                                            setDialog({
                                                                type: 'edit',
                                                                country,
                                                            })
                                                        }
                                                    >
                                                        <Pencil data-icon="inline-start" />
                                                        Edit
                                                    </Button>
                                                    {country.can_delete && (
                                                        <CountryDeleteButton
                                                            country={country}
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

                    {countries.total > 0 && (
                        <CardFooter className="flex flex-col gap-3 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {countries.from}–{countries.to} of{' '}
                                {countries.total}
                            </p>

                            <div className="flex items-center gap-2">
                                {countries.prev_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={countries.prev_page_url}
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

                                {countries.next_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={countries.next_page_url}
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

            <CountryDialogs
                dialog={dialog}
                onDialogChange={(next) => {
                    if (next.type === 'closed') {
                        closeDialog();

                        return;
                    }

                    setDialog(next);
                }}
            />
        </>
    );
}

CountriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Countries',
            href: countriesIndex(),
        },
    ],
};
