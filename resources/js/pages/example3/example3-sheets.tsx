import Example3Controller from '@/actions/App/Http/Controllers/Example3Controller';
import {
    ExampleRecordDetailRows,
    exampleRecordFormValues,
} from '@/components/example-record-detail';
import ExampleRecordForm from '@/components/example-record-form';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { ExampleRecord } from '@/types/example-record';

export type ListedExample3 = ExampleRecord;

export type Example3Sheet =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: ListedExample3 }
    | { type: 'view'; record: ListedExample3 };

type Props = {
    sheet: Example3Sheet;
    onSheetChange: (sheet: Example3Sheet) => void;
};

const sheetContentClassName = 'gap-0 overflow-y-auto p-0 sm:max-w-md';
const sheetHeaderClassName = 'gap-1 border-b px-4 py-4 pr-12 text-left';
const sheetBodyClassName = 'flex flex-col gap-4 p-4';

type Example3SheetPanelProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
};

function Example3SheetPanel({
    open,
    onOpenChange,
    title,
    description,
    children,
}: Example3SheetPanelProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className={sheetContentClassName}>
                <SheetHeader className={sheetHeaderClassName}>
                    <SheetTitle>{title}</SheetTitle>
                    {description ? (
                        <SheetDescription>{description}</SheetDescription>
                    ) : null}
                </SheetHeader>
                <div className={cn(sheetBodyClassName, 'flex-1')}>
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default function Example3Sheets({ sheet, onSheetChange }: Props) {
    const close = () => onSheetChange({ type: 'closed' });

    return (
        <>
            <Example3SheetPanel
                open={sheet.type === 'create'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title="Add New Record"
                description="Create a demo employee profile for Example 3 (sheet)."
            >
                <ExampleRecordForm
                    form={Example3Controller.store.form()}
                    submitLabel="Add New Record"
                    onCancel={close}
                    onSuccess={close}
                    idPrefix="example3-create"
                />
            </Example3SheetPanel>

            <Example3SheetPanel
                open={sheet.type === 'edit'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title="Edit record"
                description="Update the employee profile details."
            >
                {sheet.type === 'edit' ? (
                    <ExampleRecordForm
                        key={sheet.record.id}
                        form={Example3Controller.update.form(sheet.record.id)}
                        record={exampleRecordFormValues(sheet.record)}
                        submitLabel="Save changes"
                        onCancel={close}
                        onSuccess={close}
                        idPrefix="example3-edit"
                    />
                ) : null}
            </Example3SheetPanel>

            <Example3SheetPanel
                open={sheet.type === 'view'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title={sheet.type === 'view' ? sheet.record.name : ''}
                description="Employee profile details."
            >
                {sheet.type === 'view' ? (
                    <ExampleRecordDetailRows record={sheet.record} />
                ) : null}
            </Example3SheetPanel>
        </>
    );
}
