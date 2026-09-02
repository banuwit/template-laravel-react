import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { DataGridServer } from '@/components/data-grid/data-grid-server';
import type { DataGridFilters } from '@/components/data-grid/types';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create as usersCreate, index as usersIndex } from '@/routes/users';
import type { BreadcrumbItem, Paginated } from '@/types';
import { GENDER_OPTIONS, STATUS_OPTIONS } from '@/types/example-record';
import { userColumns } from './user-columns';
import type { ListedUser } from './user-columns';

type Props = {
    users: Paginated<ListedUser>;
    filters: DataGridFilters;
    departmentOptions: string[];
    positionOptions: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Users',
        href: usersIndex(),
    },
];

export default function UsersIndex({
    users,
    filters,
    departmentOptions,
    positionOptions,
}: Props) {
    return (
        <>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Users"
                    breadcrumbs={breadcrumbs}
                    actions={
                        <Button asChild>
                            <Link href={usersCreate()}>
                                <Plus data-icon="inline-start" />
                                Add New
                            </Link>
                        </Button>
                    }
                />

                <Card className="gap-0 overflow-hidden py-0">
                    <CardContent className="p-4">
                        <DataGridServer
                            columns={userColumns}
                            paginated={users}
                            filters={filters}
                            url={usersIndex.url()}
                            getRowId={(user) => String(user.id)}
                            toolbar={{
                                searches: [
                                    {
                                        key: 'search',
                                        placeholder: 'Search name...',
                                    },
                                ],
                                facets: [
                                    {
                                        key: 'department',
                                        title: 'Department',
                                        options: departmentOptions.map(
                                            (department) => ({
                                                value: department,
                                                label: department,
                                            }),
                                        ),
                                    },
                                    {
                                        key: 'position',
                                        title: 'Position',
                                        options: positionOptions.map(
                                            (position) => ({
                                                value: position,
                                                label: position,
                                            }),
                                        ),
                                    },
                                    {
                                        key: 'status',
                                        title: 'Status',
                                        options: STATUS_OPTIONS,
                                    },
                                    {
                                        key: 'gender',
                                        title: 'Gender',
                                        options: GENDER_OPTIONS,
                                    },
                                ],
                            }}
                            defaults={{
                                sort: 'created_at',
                                direction: 'desc',
                            }}
                            showVisibilityToggle={false}
                            showHeaderVisibilityToggle={true}

                            pagination="advance"
                            emptyTitle={
                                filters.search
                                    ? 'No matching users'
                                    : 'No users yet'
                            }
                            emptyDescription={
                                filters.search
                                    ? 'Try a different name, or clear the search to see everyone.'
                                    : 'Create an account to add the first person to this list.'
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs,
};
