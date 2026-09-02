import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { DataTableServer } from '@/components/data-table/data-table-server';
import type { DataTableFilters } from '@/components/data-table/types';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { index as countriesIndex } from '@/routes/countries';
import type { BreadcrumbItem, Paginated } from '@/types';
import { createCountryColumns } from './country-columns';
import type { ListedCountry } from './country-columns';
import CountryDialogs from './country-dialogs';
import type { CountryDialog } from './country-dialogs';

type Props = {
    countries: Paginated<ListedCountry>;
    filters: DataTableFilters;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Countries',
        href: countriesIndex(),
    },
];

export default function CountriesIndex({ countries, filters }: Props) {
    const page = usePage();
    const [dialog, setDialog] = useState<CountryDialog>({ type: 'closed' });

    function closeDialog() {
        setDialog({ type: 'closed' });

        if (Object.keys(page.props.errors ?? {}).length > 0) {
            router.get(countriesIndex.url());
        }
    }

    const columns = createCountryColumns(setDialog);

    return (
        <>
            <Head title="Countries" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Countries"
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
                            paginated={countries}
                            filters={filters}
                            url={countriesIndex.url()}
                            rowKey={(record) => record.id}
                            pagination="none"
                            defaults={{ sort: 'name', direction: 'asc' }}
                            toolbar={{
                                searches: [
                                    {
                                        key: 'search',
                                        placeholder: 'Search countries...',
                                    },
                                ],
                            }}
                            emptyTitle="No countries yet"
                            emptyDescription="Add a country to start the reference list."
                            emptyFilteredTitle="No matching countries"
                            emptyFilteredDescription="Try a different search term, or clear the search to see every country."
                        />
                    </CardContent>
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
    breadcrumbs,
};
