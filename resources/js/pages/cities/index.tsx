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
import { index as citiesIndex } from '@/routes/cities';
import type { BreadcrumbItem, Paginated } from '@/types';
import { createCityColumns } from './city-columns';
import type { ListedCity } from './city-columns';
import CityDialogs from './city-dialogs';
import type { CityDialog } from './city-dialogs';

type Props = {
    cities: Paginated<ListedCity>;
    filters: DataTableFilters;
    provinceOptions: SelectOption[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Cities',
        href: citiesIndex(),
    },
];

export default function CitiesIndex({
    cities,
    filters,
    provinceOptions,
}: Props) {
    const page = usePage();
    const [dialog, setDialog] = useState<CityDialog>({ type: 'closed' });

    function closeDialog() {
        setDialog({ type: 'closed' });

        if (Object.keys(page.props.errors ?? {}).length > 0) {
            router.get(citiesIndex.url());
        }
    }

    const columns = createCityColumns(setDialog);

    return (
        <>
            <Head title="Cities" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Cities"
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
                            paginated={cities}
                            filters={filters}
                            url={citiesIndex.url()}
                            rowKey={(record) => record.id}
                            pagination="none"
                            defaults={{ sort: 'name', direction: 'asc' }}
                            toolbar={{
                                searches: [
                                    {
                                        key: 'search',
                                        placeholder: 'Search cities...',
                                    },
                                ],
                            }}
                            emptyTitle="No cities yet"
                            emptyDescription="Add a city to start the reference list."
                            emptyFilteredTitle="No matching cities"
                            emptyFilteredDescription="Try a different search term, or clear the search to see every city."
                        />
                    </CardContent>
                </Card>
            </div>

            <CityDialogs
                dialog={dialog}
                provinceOptions={provinceOptions}
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

CitiesIndex.layout = {
    breadcrumbs,
};
