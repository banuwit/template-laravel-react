import { Link } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';
import type { DataGridFeatures } from '@/components/data-grid/data-grid-features';
import { DataGridHeader } from '@/components/data-grid/data-grid-header';
import { DataGridHeaderSort } from '@/components/data-grid/data-grid-header-sort';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { edit as usersEdit, show as usersShow } from '@/routes/users';
import { genderLabel, statusLabel } from '@/types/example-record';
import type { ExampleRecord } from '@/types/example-record';
import UserDeleteButton from './user-delete-button';

export type ListedUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    department: string | null;
    position: string | null;
    join_date: string | null;
    gender: ExampleRecord['gender'] | null;
    status: ExampleRecord['status'];
    email_verified_at: string | null;
    created_at: string;
    can_delete: boolean;
};

function NameCell({ user }: { user: ListedUser }) {
    const getInitials = useInitials();

    return (
        <div className="flex items-center gap-3">
            <Avatar size="sm">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">
                <Link href={usersShow(user.id)} className="hover:underline">
                    {user.name}
                </Link>
            </span>
        </div>
    );
}

function RowActions({ user }: { user: ListedUser }) {
    // The delete confirmation can't live inside `DropdownMenuContent`: Radix
    // unmounts that content as soon as the menu closes (which happens on
    // selecting any item), taking the `AlertDialog` and its `open` state
    // down with it before the dialog ever gets a chance to show. Keeping
    // `open` here, above the menu, and rendering `UserDeleteButton` as a
    // sibling of `DropdownMenu` keeps the dialog alive after the menu closes.
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        asChild
                        className="data-highlighted:bg-accent! data-highlighted:text-accent-foreground!"
                    >
                        <Link href={usersShow(user.id)}>
                            <Eye />
                            View
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        asChild
                        className="data-highlighted:bg-accent! data-highlighted:text-accent-foreground!"
                    >
                        <Link href={usersEdit(user.id)}>
                            <Pencil />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    {user.can_delete && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                className="data-highlighted:bg-destructive/10! data-highlighted:text-destructive!"
                                onSelect={() => {
                                    // Deferred past the menu's own close so
                                    // the two don't race each other.
                                    setTimeout(() => setDeleteOpen(true), 0);
                                }}
                            >
                                <Trash2 />
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {user.can_delete && (
                <UserDeleteButton
                    user={user}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                />
            )}
        </>
    );
}

const columnHelper = createColumnHelper<DataGridFeatures, ListedUser>();

export const userColumns = columnHelper.columns([
    columnHelper.display({
        id: 'no',
        header: () => <DataGridHeader title="No." />,
        enableHiding: false,
        cell: ({ row, table }) => {
            // `DataGridServer` runs manual pagination, so `table` only ever
            // holds the current page's rows — `row.getDisplayIndex()` is
            // relative to that page, hence the `pageIndex * pageSize` offset
            // to keep the number continuous across pages.
            const { pageIndex, pageSize } = table.store.state.pagination;

            return (
                <span className="text-muted-foreground tabular-nums">
                    {pageIndex * pageSize + row.getDisplayIndex() + 1}
                </span>
            );
        },
    }),
    columnHelper.accessor('name', {
        header: ({ column }) => (
            <DataGridHeaderSort column={column} title="Name" />
        ),
        cell: ({ row }) => <NameCell user={row.original} />,
    }),
    columnHelper.accessor('email', {
        header: ({ column }) => (
            <DataGridHeaderSort column={column} title="Email" />
        ),
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.email}</span>
        ),
    }),
    columnHelper.accessor('phone', {
        header: () => <DataGridHeader title="Phone" />,
        enableSorting: false,
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.phone ?? '—'}
            </span>
        ),
    }),
    columnHelper.accessor('department', {
        header: ({ column }) => (
            <DataGridHeaderSort column={column} title="Department" />
        ),
        cell: ({ row }) => row.original.department ?? '—',
    }),
    columnHelper.accessor('position', {
        header: ({ column }) => (
            <DataGridHeaderSort column={column} title="Position" />
        ),
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.position ?? '—'}
            </span>
        ),
    }),
    columnHelper.accessor('join_date', {
        header: ({ column }) => (
            <DataGridHeaderSort column={column} title="Join date" />
        ),
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.join_date
                    ? format(new Date(row.original.join_date), 'MMM d, yyyy')
                    : '—'}
            </span>
        ),
    }),
    columnHelper.accessor('status', {
        header: ({ column }) => (
            <DataGridHeaderSort column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.status === 'active' ? 'default' : 'secondary'
                }
            >
                {statusLabel(row.original.status)}
            </Badge>
        ),
    }),
    columnHelper.accessor('gender', {
        header: () => <DataGridHeader title="Gender" />,
        enableSorting: false,
        cell: ({ row }) =>
            row.original.gender ? genderLabel(row.original.gender) : '—',
    }),
    columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right"></div>,
        cell: ({ row }) => <RowActions user={row.original} />,
    }),
]);
