import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
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
    Users,
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
    create as usersCreate,
    edit as usersEdit,
    index as usersIndex,
    show as usersShow,
} from '@/routes/users';
import type { Paginated } from '@/types';
import UserDeleteButton from './user-delete-button';

type ListedUser = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    can_delete: boolean;
};

type SortColumn = 'name' | 'email' | 'created_at';

type UserFilters = {
    search: string;
    sort: SortColumn;
    direction: 'asc' | 'desc';
};

type Props = {
    users: Paginated<ListedUser>;
    filters: UserFilters;
};

function visit(filters: UserFilters, overrides: Partial<UserFilters> = {}) {
    const search = overrides.search ?? filters.search;
    const sort = overrides.sort ?? filters.sort;
    const direction = overrides.direction ?? filters.direction;

    router.get(
        usersIndex.url({
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
    filters: UserFilters;
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
    filters: UserFilters;
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

export default function UsersIndex({ users, filters }: Props) {
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
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading
                        variant="small"
                        title="Users"
                        description="Search, sort, and manage every account in the workspace."
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
                                placeholder="Search name or email"
                                aria-label="Search users"
                            />
                        </InputGroup>

                        <Button asChild>
                            <Link href={usersCreate()}>
                                <Plus data-icon="inline-start" />
                                Add New
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <CardTitle>All users</CardTitle>
                        <CardDescription>
                            {users.total === 1
                                ? '1 user'
                                : `${users.total} users`}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {users.data.length === 0 ? (
                            <Empty className="border-0">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Users />
                                    </EmptyMedia>
                                    <EmptyTitle>
                                        {filters.search
                                            ? 'No matching users'
                                            : 'No users yet'}
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        {filters.search
                                            ? 'Try a different name or email, or clear the search to see everyone.'
                                            : 'Create an account to add the first person to this list.'}
                                    </EmptyDescription>
                                </EmptyHeader>
                                {!filters.search && (
                                    <EmptyContent>
                                        <Button asChild>
                                            <Link href={usersCreate()}>
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
                                            column="name"
                                            filters={filters}
                                        >
                                            Name
                                        </SortableHead>
                                        <SortableHead
                                            column="email"
                                            filters={filters}
                                        >
                                            Email
                                        </SortableHead>
                                        <TableHead>Status</TableHead>
                                        <SortableHead
                                            column="created_at"
                                            filters={filters}
                                        >
                                            Joined
                                        </SortableHead>
                                        <TableHead className="text-right">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar size="sm">
                                                        <AvatarFallback>
                                                            {getInitials(
                                                                user.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">
                                                        <Link
                                                            href={usersShow(
                                                                user.id,
                                                            )}
                                                            className="hover:underline"
                                                        >
                                                            {user.name}
                                                        </Link>
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                {user.email_verified_at ? (
                                                    <Badge variant="secondary">
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        Unverified
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(
                                                    new Date(user.created_at),
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
                                                            href={usersShow(
                                                                user.id,
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
                                                            href={usersEdit(
                                                                user.id,
                                                            )}
                                                        >
                                                            <Pencil data-icon="inline-start" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    {user.can_delete && (
                                                        <UserDeleteButton
                                                            user={user}
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

                    {users.total > 0 && (
                        <CardFooter className="flex flex-col gap-3 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {users.from}–{users.to} of {users.total}
                            </p>

                            <div className="flex items-center gap-2">
                                {users.prev_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={users.prev_page_url}
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

                                {users.next_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={users.next_page_url}
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

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Users',
            href: usersIndex(),
        },
    ],
};
