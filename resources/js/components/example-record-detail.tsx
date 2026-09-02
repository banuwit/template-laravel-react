import { format } from 'date-fns';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    genderLabel,
    statusLabel,
    type ExampleRecord,
    type ExampleRecordFormValues,
} from '@/types/example-record';

export function ExampleRecordDetailRows({
    record,
}: {
    record: ExampleRecord;
}) {
    return (
        <dl className="flex flex-col gap-3">
            <DetailRow label="Name">{record.name}</DetailRow>
            <DetailRow label="Email">{record.email}</DetailRow>
            <DetailRow label="Phone">{record.phone}</DetailRow>
            <DetailRow label="Department">{record.department}</DetailRow>
            <DetailRow label="Position">{record.position}</DetailRow>
            <DetailRow label="Join date">
                {format(new Date(record.join_date), 'MMM d, yyyy')}
            </DetailRow>
            <DetailRow label="Gender">
                <Badge variant="secondary">{genderLabel(record.gender)}</Badge>
            </DetailRow>
            <DetailRow label="Status">
                <Badge
                    variant={
                        record.status === 'active' ? 'default' : 'secondary'
                    }
                >
                    {statusLabel(record.status)}
                </Badge>
            </DetailRow>
            <DetailRow label="Created">
                {format(new Date(record.created_at), 'MMM d, yyyy')}
            </DetailRow>
            <DetailRow label="Updated">
                {format(new Date(record.updated_at), 'MMM d, yyyy')}
            </DetailRow>
        </dl>
    );
}

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
            <dt className="w-28 shrink-0 text-sm text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm font-medium">{children}</dd>
        </div>
    );
}

export function exampleRecordFormValues(
    record: ExampleRecord,
): ExampleRecordFormValues {
    return {
        name: record.name,
        email: record.email,
        phone: record.phone,
        department: record.department,
        position: record.position,
        join_date: record.join_date,
        gender: record.gender,
        status: record.status,
    };
}
