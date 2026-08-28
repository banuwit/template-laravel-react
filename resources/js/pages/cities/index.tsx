import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Building2,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Plus,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CityDeleteButton from '@/components/city-delete-button';
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
import { index as citiesIndex } from '@/routes/cities';
import type { Paginated } from '@/types';
import CitySheets from './city-sheets';
import type { CitySheet, ListedCity } from './city-sheets';

type ProvinceOption = {
    id: number;
    name: string;
    code: string;
    country: {
        id: number;
        name: string;
        code: string;
    };
};

type SortColumn = 'name' | 'code' | 'province' | 'country' | 'created_at';

type CityFilters = {
    search: string;
    sort: SortColumn;
    direction: 'asc' | 'desc';
};

type Props = {
    cities: Paginated<ListedCity>;
    provinces: ProvinceOption[];
    filters: CityFilters;
};

function visit(filters: CityFilters, overrides: Partial<CityFilters> = {}) {
    const search = overrides.search ?? filters.search;
    const sort = overrides.sort ?? filters.sort;
    const direction = overrides.direction ?? filters.direction;

    router.get(
        citiesIndex.url({
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
    filters: CityFilters;
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
    filters: CityFilters;
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

export default function CitiesIndex({ cities, provinces, filters }: Props) {
    const page = usePage();
    const [search, setSearch] = useState(filters.search);
    const [sheet, setSheet] = useState<CitySheet>({ type: 'closed' });

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
            <Head title="Cities" />

            <CitySheets
                sheet={sheet}
                provinces={provinces}
                onSheetChange={(next) => {
                    if (next.type === 'closed') {
                        closeSheet();

                        return;
                    }

                    setSheet(next);
                }}
            >
                <div className="flex min-h-0 flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading
                        variant="small"
                        title="Cities"
                        description="Search, sort, and manage cities within each province."
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
                                placeholder="Search name, code, or region"
                                aria-label="Search cities"
                            />
                        </InputGroup>

                        <Button
                            type="button"
                            onClick={() => setSheet({ type: 'create' })}
                            disabled={provinces.length === 0}
                        >
                            <Plus data-icon="inline-start" />
                            Add New City
                        </Button>
                    </div>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <CardTitle>All cities</CardTitle>
                        <CardDescription>
                            {cities.total === 1
                                ? '1 city'
                                : `${cities.total} cities`}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {cities.data.length === 0 ? (
                            <Empty className="border-0">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Building2 />
                                    </EmptyMedia>
                                    <EmptyTitle>
                                        {filters.search
                                            ? 'No matching cities'
                                            : 'No cities yet'}
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        {filters.search
                                            ? 'Try a different name, code, or region, or clear the search to see every city.'
                                            : provinces.length === 0
                                              ? 'Create a province first, then add cities to this list.'
                                              : 'Create a city to add the first record to this list.'}
                                    </EmptyDescription>
                                </EmptyHeader>
                                {!filters.search && provinces.length > 0 && (
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
                                            column="province"
                                            filters={filters}
                                        >
                                            Province
                                        </SortableHead>
                                        <SortableHead
                                            column="country"
                                            filters={filters}
                                        >
                                            Country
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
                                    {cities.data.map((city) => (
                                        <TableRow key={city.id}>
                                            <TableCell>
                                                <button
                                                    type="button"
                                                    className="font-medium hover:underline"
                                                    onClick={() =>
                                                        setSheet({
                                                            type: 'view',
                                                            city,
                                                        })
                                                    }
                                                >
                                                    {city.name}
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {city.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {city.province.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {city.province.country.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(
                                                    new Date(city.created_at),
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
                                                                city,
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
                                                                city,
                                                            })
                                                        }
                                                    >
                                                        <Pencil data-icon="inline-start" />
                                                        Edit
                                                    </Button>
                                                    {city.can_delete && (
                                                        <CityDeleteButton
                                                            city={city}
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

                    {cities.total > 0 && (
                        <CardFooter className="flex flex-col gap-3 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {cities.from}–{cities.to} of{' '}
                                {cities.total}
                            </p>

                            <div className="flex items-center gap-2">
                                {cities.prev_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={cities.prev_page_url}
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

                                {cities.next_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={cities.next_page_url}
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
            </CitySheets>
        </>
    );
}

CitiesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Cities',
            href: citiesIndex(),
        },
    ],
};
