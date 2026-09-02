import Example2Controller from '@/actions/App/Http/Controllers/Example2Controller';
import {
    ExampleRecordDetailRows,
    exampleRecordFormValues,
} from '@/components/example-record-detail';
import ExampleRecordForm from '@/components/example-record-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ExampleRecord } from '@/types/example-record';

export type ListedExample2 = ExampleRecord;

export type Example2Dialog =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: ListedExample2 }
    | { type: 'view'; record: ListedExample2 };

type Props = {
    dialog: Example2Dialog;
    onDialogChange: (dialog: Example2Dialog) => void;
};

export default function Example2Dialogs({ dialog, onDialogChange }: Props) {
    const close = () => onDialogChange({ type: 'closed' });

    return (
        <>
            <Dialog
                open={dialog.type === 'create'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Record</DialogTitle>
                        <DialogDescription>
                            Create a demo employee profile for Example 2
                            (dialog).
                        </DialogDescription>
                    </DialogHeader>
                    <ExampleRecordForm
                        form={Example2Controller.store.form()}
                        submitLabel="Add New Record"
                        onCancel={close}
                        onSuccess={close}
                        idPrefix="example2-create"
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={dialog.type === 'edit'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit record</DialogTitle>
                        <DialogDescription>
                            Update the employee profile details.
                        </DialogDescription>
                    </DialogHeader>
                    {dialog.type === 'edit' && (
                        <ExampleRecordForm
                            key={dialog.record.id}
                            form={Example2Controller.update.form(
                                dialog.record.id,
                            )}
                            record={exampleRecordFormValues(dialog.record)}
                            submitLabel="Save changes"
                            onCancel={close}
                            onSuccess={close}
                            idPrefix="example2-edit"
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={dialog.type === 'view'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                    {dialog.type === 'view' && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{dialog.record.name}</DialogTitle>
                                <DialogDescription>
                                    Employee profile details.
                                </DialogDescription>
                            </DialogHeader>
                            <ExampleRecordDetailRows record={dialog.record} />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
