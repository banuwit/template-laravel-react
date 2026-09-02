import { format } from 'date-fns';
import type { ReactNode } from 'react';
import ParameterController from '@/actions/App/Http/Controllers/ParameterController';
import {
    ContentSidePanelBody,
    ContentSidePanelDescription,
    ContentSidePanelHeader,
    ContentSidePanelLayout,
    ContentSidePanelTitle,
} from '@/components/content-side-panel';
import { Badge } from '@/components/ui/badge';
import ParameterForm from './parameter-form';
import type { ParameterFormValues } from './parameter-form';
import type { ListedParameter } from './index';

export type ParameterSheet =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: ListedParameter }
    | { type: 'view'; record: ListedParameter };

type Props = {
    sheet: ParameterSheet;
    onSheetChange: (sheet: ParameterSheet) => void;
    children: ReactNode;
};

function parameterFormValues(record: ListedParameter): ParameterFormValues {
    return {
        group: record.group,
        code: record.code,
        value: record.value,
        description: record.description,
        text_color: record.text_color,
        bg_color: record.bg_color,
        is_active: record.is_active,
        sort_order: record.sort_order,
    };
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

function ParameterDetailRows({ record }: { record: ListedParameter }) {
    return (
        <dl className="flex flex-col gap-3">
            <DetailRow label="Group">
                <Badge variant="secondary">{record.group}</Badge>
            </DetailRow>
            <DetailRow label="Code">{record.code}</DetailRow>
            <DetailRow label="Value">
                {record.text_color || record.bg_color ? (
                    <span
                        className="inline-flex rounded-md border px-2 py-0.5 text-xs font-medium"
                        style={{
                            color: record.text_color ?? undefined,
                            backgroundColor: record.bg_color ?? undefined,
                        }}
                    >
                        {record.value}
                    </span>
                ) : (
                    record.value
                )}
            </DetailRow>
            {record.description && (
                <DetailRow label="Description">{record.description}</DetailRow>
            )}
            <DetailRow label="Sort order">{record.sort_order}</DetailRow>
            <DetailRow label="Status">
                <Badge variant={record.is_active ? 'default' : 'secondary'}>
                    {record.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </DetailRow>
            {record.is_system && (
                <DetailRow label="System">
                    <Badge variant="outline">Locked — cannot be deleted</Badge>
                </DetailRow>
            )}
            <DetailRow label="Created">
                {format(new Date(record.created_at), 'MMM d, yyyy')}
            </DetailRow>
            <DetailRow label="Updated">
                {format(new Date(record.updated_at), 'MMM d, yyyy')}
            </DetailRow>
        </dl>
    );
}

function ParameterPanelContent({
    sheet,
    onClose,
}: {
    sheet: ParameterSheet;
    onClose: () => void;
}) {
    if (sheet.type === 'create') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>
                        Add New Parameter
                    </ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        Create a new reference value.
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <ParameterForm
                        form={ParameterController.store.form()}
                        submitLabel="Add New Parameter"
                        onCancel={onClose}
                        onSuccess={onClose}
                        idPrefix="parameter-create"
                    />
                </ContentSidePanelBody>
            </>
        );
    }

    if (sheet.type === 'edit') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>
                        Edit Parameter
                    </ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        Update this reference value.
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <ParameterForm
                        key={sheet.record.id}
                        form={ParameterController.update.form(sheet.record.id)}
                        record={parameterFormValues(sheet.record)}
                        submitLabel="Save changes"
                        onCancel={onClose}
                        onSuccess={onClose}
                        idPrefix="parameter-edit"
                    />
                </ContentSidePanelBody>
            </>
        );
    }

    if (sheet.type === 'view') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>
                        {sheet.record.code}
                    </ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        Parameter details.
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <ParameterDetailRows record={sheet.record} />
                </ContentSidePanelBody>
            </>
        );
    }

    return null;
}

export default function ParameterSheets({
    sheet,
    onSheetChange,
    children,
}: Props) {
    const close = () => onSheetChange({ type: 'closed' });
    const isOpen = sheet.type !== 'closed';

    return (
        <ContentSidePanelLayout
            open={isOpen}
            panelLabel={
                sheet.type === 'create'
                    ? 'Add New Parameter'
                    : sheet.type === 'edit'
                      ? 'Edit Parameter'
                      : sheet.type === 'view'
                        ? 'View Parameter'
                        : 'Parameter panel'
            }
            panel={
                isOpen ? (
                    <ParameterPanelContent sheet={sheet} onClose={close} />
                ) : null
            }
        >
            {children}
        </ContentSidePanelLayout>
    );
}
