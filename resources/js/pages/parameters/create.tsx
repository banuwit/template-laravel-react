import { Head } from '@inertiajs/react';
import ParameterController from '@/actions/App/Http/Controllers/ParameterController';
import Heading from '@/components/heading';
import ParameterForm from '@/components/parameter-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, index as parametersIndex } from '@/routes/parameters';

export default function ParametersCreate() {
    return (
        <>
            <Head title="Add New Parameter" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    variant="small"
                    title="Add New"
                    description="Add a new reference parameter to the workspace."
                />

                <Card className="max-w-2xl gap-6">
                    <CardHeader>
                        <CardTitle>Parameter details</CardTitle>
                        <CardDescription>
                            Group, code, and value are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ParameterForm
                            form={ParameterController.store.form()}
                            submitLabel="Add New"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ParametersCreate.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Parameters',
            href: parametersIndex(),
        },
        {
            title: 'Create',
            href: create(),
        },
    ],
};
