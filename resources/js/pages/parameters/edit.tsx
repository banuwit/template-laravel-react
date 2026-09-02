import { Head, setLayoutProps } from '@inertiajs/react';
import ParameterController from '@/actions/App/Http/Controllers/ParameterController';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { edit, index as parametersIndex } from '@/routes/parameters';
import ParameterForm from './parameter-form';

type EditableParameter = {
    id: number;
    group: string;
    code: string;
    value: string;
    description: string | null;
    text_color: string | null;
    bg_color: string | null;
    is_system: boolean;
    is_active: boolean;
    sort_order: number;
};

type Props = {
    parameter: EditableParameter;
};

export default function ParametersEdit({ parameter }: Props) {
    setLayoutProps({
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
                title: parameter.code,
                href: edit(parameter.id),
            },
        ],
    });

    return (
        <>
            <Head title={`Edit ${parameter.code}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    variant="small"
                    title="Edit parameter"
                    description={`Update ${parameter.code}'s details.`}
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
                            form={ParameterController.update.form(parameter.id)}
                            parameter={parameter}
                            submitLabel="Save changes"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
