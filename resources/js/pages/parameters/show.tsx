import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import Heading from '@/components/heading';
import ParameterDeleteButton from '@/components/parameter-delete-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import { index as parametersIndex, show } from '@/routes/parameters';

type ShownParameter = {
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
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string;
    can_update: boolean;
    can_delete: boolean;
};

type Props = {
    parameter: ShownParameter;
};

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
            <dt className="w-32 shrink-0 text-sm text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm font-medium">{children}</dd>
        </div>
    );
}

export default function ParametersShow({ parameter }: Props) {
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
                href: show(parameter.id),
            },
        ],
    });

    return (
        <>
            <Head title={parameter.code} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        variant="small"
                        title={parameter.code}
                        description="Parameter details for this workspace."
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={parametersIndex()}>
                                <ChevronLeft data-icon="inline-start" />
                                Back to parameters
                            </Link>
                        </Button>
                        {parameter.can_delete && (
                            <ParameterDeleteButton
                                parameter={parameter}
                                variant="outline"
                                size="default"
                            />
                        )}
                    </div>
                </div>

                <Card className="max-w-2xl gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex min-w-0 flex-col gap-1">
                                <CardTitle className="truncate">
                                    {parameter.code}
                                </CardTitle>
                                <CardDescription className="truncate">
                                    {parameter.group}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="py-6">
                        <dl className="flex flex-col gap-4">
                            <DetailRow label="Group">
                                {parameter.group}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Code">{parameter.code}</DetailRow>
                            <Separator />
                            <DetailRow label="Value">
                                {parameter.value}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Description">
                                {parameter.description ?? '—'}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Colors">
                                <span className="flex items-center gap-2">
                                    <span>{parameter.text_color ?? '—'}</span>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span>{parameter.bg_color ?? '—'}</span>
                                </span>
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Status">
                                <div className="flex gap-2">
                                    {parameter.is_active ? (
                                        <Badge variant="secondary">
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">
                                            Inactive
                                        </Badge>
                                    )}
                                    {parameter.is_system && (
                                        <Badge variant="outline">
                                            System
                                        </Badge>
                                    )}
                                </div>
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Sort order">
                                {parameter.sort_order}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Created by">
                                {parameter.created_by ?? '—'}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Updated by">
                                {parameter.updated_by ?? '—'}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Created">
                                {format(
                                    new Date(parameter.created_at),
                                    'MMM d, yyyy',
                                )}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Last updated">
                                {format(
                                    new Date(parameter.updated_at),
                                    'MMM d, yyyy',
                                )}
                            </DetailRow>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
