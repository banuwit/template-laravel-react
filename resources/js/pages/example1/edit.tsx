import { Head, setLayoutProps } from '@inertiajs/react';
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
import { edit, index as example1Index } from '@/routes/example1';
import type { ExampleRecordFormValues } from '@/types/example-record';
import Example1Form from './example1-form';

type EditableExample1 = ExampleRecordFormValues & {
    id: number;
};

type Props = {
    example1: EditableExample1;
};

export default function Example1Edit({ example1 }: Props) {
    setLayoutProps({
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
                title: example1.name,
                href: edit(example1.id),
            },
        ],
    });

    return (
        <>
            <Head title={`Edit ${example1.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    variant="small"
                    title="Edit record"
                    description={`Update ${example1.name}'s profile details.`}
                />

                <Card className="max-w-2xl gap-6">
                    <CardHeader>
                        <CardTitle>Record details</CardTitle>
                        <CardDescription>
                            Update the employee profile fields below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Example1Form
                            form={Example1Controller.update.form(example1.id)}
                            record={example1}
                            submitLabel="Save changes"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
