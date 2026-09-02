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
import { index as provincesIndex } from '@/routes/provinces';
import type { BreadcrumbItem, Paginated } from '@/types';
import { createProvinceColumns } from './province-columns';
import type { ListedProvince } from './province-columns';
import ProvinceDialogs from './province-dialogs';
import type { ProvinceDialog } from './province-dialogs';

type Props = {
    provinces: Paginated<ListedProvince>;
    filters: DataTableFilters;
    countryOptions: SelectOption[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Provinces',
        href: provincesIndex(),
    },
];

export default function ProvincesIndex({
    provinces,
    filters,
    countryOptions,
}: Props) {
    const page = usePage();
    const [dialog, setDialog] = useState<ProvinceDialog>({ type: 'closed' });

    function closeDialog() {
        setDialog({ type: 'closed' });

        if (Object.keys(page.props.errors ?? {}).length > 0) {
            router.get(provincesIndex.url());
        }
    }

    const columns = createProvinceColumns(setDialog);

    return (
        <>
            <Head title="Provinces" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Provinces"
                    breadcrumbs={breadcrumbs}
                    actions={
                        <Button
                            type="button"
                            onClick={() => setDialog({ type: 'create' })}
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
                            paginated={provinces}
                            filters={filters}
                            url={provincesIndex.url()}
                            rowKey={(record) => record.id}
                            pagination="none"
                            defaults={{ sort: 'name', direction: 'asc' }}
                            toolbar={{
                                searches: [
                                    {
                                        key: 'search',
                                        placeholder: 'Search provinces...',
                                    },
                                ],
                            }}
                            emptyTitle="No provinces yet"
                            emptyDescription="Add a province to start the reference list."
                            emptyFilteredTitle="No matching provinces"
                            emptyFilteredDescription="Try a different search term, or clear the search to see every province."
                        />
                    </CardContent>
                </Card>
            </div>

            <ProvinceDialogs
                dialog={dialog}
                countryOptions={countryOptions}
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

ProvincesIndex.layout = {
    breadcrumbs,
};
