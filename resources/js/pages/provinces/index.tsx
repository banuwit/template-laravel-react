import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    MapPin,
    Pencil,
    Plus,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import ProvinceDeleteButton from '@/components/province-delete-button';
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
import { index as provincesIndex } from '@/routes/provinces';
import type { Paginated } from '@/types';
import ProvinceSheets from './province-sheets';
import type { ListedProvince, ProvinceSheet } from './province-sheets';

type CountryOption = {
    id: number;
    name: string;
    code: string;
};

type SortColumn = 'name' | 'code' | 'country' | 'created_at';

type ProvinceFilters = {
    search: string;
    sort: SortColumn;
    direction: 'asc' | 'desc';
};

type Props = {
    provinces: Paginated<ListedProvince>;
    countries: CountryOption[];
    filters: ProvinceFilters;
};

function visit(
    filters: ProvinceFilters,
    overrides: Partial<ProvinceFilters> = {},
) {
    const search = overrides.search ?? filters.search;
    const sort = overrides.sort ?? filters.sort;
    const direction = overrides.direction ?? filters.direction;

    router.get(
        provincesIndex.url({
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
    filters: ProvinceFilters;
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
    filters: ProvinceFilters;
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

export default function ProvincesIndex({
    provinces,
    countries,
    filters,
}: Props) {
    const page = usePage();
    const [search, setSearch] = useState(filters.search);
    const [sheet, setSheet] = useState<ProvinceSheet>({ type: 'closed' });

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
            <Head title="Provinces" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading
                        variant="small"
                        title="Provinces"
                        description="Search, sort, and manage provinces within each country."
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
                                placeholder="Search name, code, or country"
                                aria-label="Search provinces"
                            />
                        </InputGroup>

                        <Button
                            type="button"
                            onClick={() => setSheet({ type: 'create' })}
                            disabled={countries.length === 0}
                        >
                            <Plus data-icon="inline-start" />
                            Add New
                        </Button>
                    </div>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <CardTitle>All provinces</CardTitle>
                        <CardDescription>
                            {provinces.total === 1
                                ? '1 province'
                                : `${provinces.total} provinces`}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {provinces.data.length === 0 ? (
                            <Empty className="border-0">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <MapPin />
                                    </EmptyMedia>
                                    <EmptyTitle>
                                        {filters.search
                                            ? 'No matching provinces'
                                            : 'No provinces yet'}
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        {filters.search
                                            ? 'Try a different name, code, or country, or clear the search to see every province.'
                                            : countries.length === 0
                                              ? 'Create a country first, then add provinces to this list.'
                                              : 'Create a province to add the first record to this list.'}
                                    </EmptyDescription>
                                </EmptyHeader>
                                {!filters.search && countries.length > 0 && (
                                    <EmptyContent>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setSheet({ type: 'create' })
                                            }
                                        >
                                            <Plus data-icon="inline-start" />
                                            Add New Province
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
                                    {provinces.data.map((province) => (
                                        <TableRow key={province.id}>
                                            <TableCell>
                                                <button
                                                    type="button"
                                                    className="font-medium hover:underline"
                                                    onClick={() =>
                                                        setSheet({
                                                            type: 'view',
                                                            province,
                                                        })
                                                    }
                                                >
                                                    {province.name}
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {province.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {province.country.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(
                                                    new Date(
                                                        province.created_at,
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
                                                                province,
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
                                                                province,
                                                            })
                                                        }
                                                    >
                                                        <Pencil data-icon="inline-start" />
                                                        Edit
                                                    </Button>
                                                    {province.can_delete && (
                                                        <ProvinceDeleteButton
                                                            province={province}
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

                    {provinces.total > 0 && (
                        <CardFooter className="flex flex-col gap-3 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {provinces.from}–{provinces.to} of{' '}
                                {provinces.total}
                            </p>

                            <div className="flex items-center gap-2">
                                {provinces.prev_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={provinces.prev_page_url}
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

                                {provinces.next_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={provinces.next_page_url}
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

            <ProvinceSheets
                sheet={sheet}
                countries={countries}
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

ProvincesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Provinces',
            href: provincesIndex(),
        },
    ],
};
