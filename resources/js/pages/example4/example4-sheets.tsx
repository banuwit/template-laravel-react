import type { ReactNode } from 'react';
import Example4Controller from '@/actions/App/Http/Controllers/Example4Controller';
import {
    ContentSidePanelBody,
    ContentSidePanelDescription,
    ContentSidePanelHeader,
    ContentSidePanelLayout,
    ContentSidePanelTitle,
} from '@/components/content-side-panel';
import ExampleRecordForm from '@/components/example-record-form';
import {
    ExampleRecordDetailRows,
    exampleRecordFormValues,
} from '@/components/example-record-detail';
import type { ExampleRecord } from '@/types/example-record';

export type ListedExample4 = ExampleRecord;

export type Example4Sheet =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: ListedExample4 }
    | { type: 'view'; record: ListedExample4 };

type Props = {
    sheet: Example4Sheet;
    onSheetChange: (sheet: Example4Sheet) => void;
    children: ReactNode;
};

function Example4PanelContent({
    sheet,
    onClose,
}: {
    sheet: Example4Sheet;
    onClose: () => void;
}) {
    if (sheet.type === 'create') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>Add New Record</ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        Create a demo employee profile for Example 4 (panel
                        inline).
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <ExampleRecordForm
                        form={Example4Controller.store.form()}
                        submitLabel="Add New Record"
                        onCancel={onClose}
                        onSuccess={onClose}
                        idPrefix="example4-create"
                    />
                </ContentSidePanelBody>
            </>
        );
    }

    if (sheet.type === 'edit') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>Edit record</ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        Update the employee profile details.
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <ExampleRecordForm
                        key={sheet.record.id}
                        form={Example4Controller.update.form(sheet.record.id)}
                        record={exampleRecordFormValues(sheet.record)}
                        submitLabel="Save changes"
                        onCancel={onClose}
                        onSuccess={onClose}
                        idPrefix="example4-edit"
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
                        {sheet.record.name}
                    </ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        Employee profile details.
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <ExampleRecordDetailRows record={sheet.record} />
                </ContentSidePanelBody>
            </>
        );
    }

    return null;
}

export default function Example4Sheets({
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
                    ? 'Add New Record'
                    : sheet.type === 'edit'
                      ? 'Edit Record'
                      : sheet.type === 'view'
                        ? 'View Record'
                        : 'Example 4 panel'
            }
            panel={
                isOpen ? (
                    <Example4PanelContent sheet={sheet} onClose={close} />
                ) : null
            }
        >
            {children}
        </ContentSidePanelLayout>
    );
}
