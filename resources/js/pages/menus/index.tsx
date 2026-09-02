import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { DataTableServer } from '@/components/data-table/data-table-server';
import type { DataTableFilters } from '@/components/data-table/types';
import type { SelectOption } from '@/components/filters/types';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { index as menusIndex } from '@/routes/menus';
import type { BreadcrumbItem, Paginated } from '@/types';
import { createMenuColumns } from './menu-columns';
import type { ListedMenu } from './menu-columns';
import MenuSheets from './menu-sheets';
import type { MenuSheet } from './menu-sheets';

type Props = {
    menus: Paginated<ListedMenu>;
    filters: DataTableFilters;
    parentOptions: SelectOption[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Menus',
        href: menusIndex(),
    },
];

const layoutFacetOptions = [
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'topbar', label: 'Topbar' },
    { value: 'footer', label: 'Footer' },
];

const activeFacetOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
];

export default function MenusIndex({ menus, filters, parentOptions }: Props) {
    const page = usePage();
    const [sheet, setSheet] = useState<MenuSheet>({ type: 'closed' });

    function closeSheet() {
        setSheet({ type: 'closed' });

        if (Object.keys(page.props.errors ?? {}).length > 0) {
            router.get(menusIndex.url());
        }
    }

    const columns = createMenuColumns(setSheet);

    return (
        <>
            <Head title="Menus" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Menus"
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
                        <DataTableServer
                            columns={columns}
                            paginated={menus}
                            filters={filters}
                            url={menusIndex.url()}
                            rowKey={(record) => record.id}
                            pagination="advance"
                            defaults={{ sort: 'sort_order', direction: 'asc' }}
                            toolbar={{
                                searches: [
                                    {
                                        key: 'search',
                                        placeholder: 'Search menus...',
                                    },
                                ],
                                facets: [
                                    {
                                        key: 'layout',
                                        title: 'Layout',
                                        options: layoutFacetOptions,
                                    },
                                    {
                                        key: 'is_active',
                                        title: 'Status',
                                        options: activeFacetOptions,
                                    },
                                ],
                            }}
                            emptyTitle="No menus yet"
                            emptyDescription="Create a menu item to add the first one to this list."
                            emptyFilteredTitle="No matching menus"
                            emptyFilteredDescription="Try a different search term, or clear the search to see every menu."
                        />
                    </CardContent>
                </Card>
            </div>

            <MenuSheets
                sheet={sheet}
                parentOptions={parentOptions}
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

MenusIndex.layout = {
    breadcrumbs,
};
