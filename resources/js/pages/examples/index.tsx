import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { columns } from './components/data-table-columns';
import { data } from './data';
import { DataTable } from '@/components/data-table/data-table-client';

export default function DemoPage() {
    return (
        <>
        <Head title="Examples" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading
                        variant="small"
                        title="Examples"
                        description="Search, sort, and manage examples used across the workspace."
                    />
                </div>
                
                <Card className="gap-0 overflow-hidden py-0">
                    <CardContent className="p-4">
                        <DataTable
                            columns={columns}
                            data={data}
                            emptyTitle="No examples yet"
                            emptyDescription="There is no example data to display yet."
                            emptyFilteredTitle="No matching results"
                            emptyFilteredDescription="Try a different name, or clear the search to see all rows."
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
