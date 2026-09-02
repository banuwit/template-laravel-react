import { Head } from '@inertiajs/react';
import Example1Controller from '@/actions/App/Http/Controllers/Example1Controller';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, index as example1Index } from '@/routes/example1';
import Example1Form from './example1-form';

export default function Example1Create() {
    return (
        <>
            <Head title="Add New Record" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    variant="small"
                    title="Add New"
                    description="Create a demo employee profile for Example 1 (full pages)."
                />

                <Card className="max-w-2xl gap-6">
                    <CardHeader>
                        <CardTitle>Record details</CardTitle>
                        <CardDescription>
                            All profile fields are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Example1Form
                            form={Example1Controller.store.form()}
                            submitLabel="Add New Record"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Example1Create.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Example 1',
            href: example1Index(),
        },
        {
            title: 'Create',
            href: create(),
        },
    ],
};
