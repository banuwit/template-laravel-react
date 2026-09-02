import type { ReactNode } from 'react';
import CountryController from '@/actions/App/Http/Controllers/CountryController';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ListedCountry } from './country-columns';
import CountryForm from './country-form';

export type CountryDialog =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: ListedCountry }
    | { type: 'view'; record: ListedCountry };

type Props = {
    dialog: CountryDialog;
    onDialogChange: (dialog: CountryDialog) => void;
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
            <dt className="w-28 shrink-0 text-sm text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm font-medium">{children}</dd>
        </div>
    );
}

export default function CountryDialogs({ dialog, onDialogChange }: Props) {
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
                        <DialogTitle>Add New Country</DialogTitle>
                        <DialogDescription>
                            Add a country to the reference list.
                        </DialogDescription>
                    </DialogHeader>
                    <CountryForm
                        form={CountryController.store.form()}
                        submitLabel="Add New Country"
                        onCancel={close}
                        onSuccess={close}
                        idPrefix="country-create"
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
                        <DialogTitle>Edit country</DialogTitle>
                        <DialogDescription>
                            Update the country details.
                        </DialogDescription>
                    </DialogHeader>
                    {dialog.type === 'edit' && (
                        <CountryForm
                            key={dialog.record.id}
                            form={CountryController.update.form(
                                dialog.record.id,
                            )}
                            record={{
                                name: dialog.record.name,
                                code: dialog.record.code,
                            }}
                            submitLabel="Save changes"
                            onCancel={close}
                            onSuccess={close}
                            idPrefix="country-edit"
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
                                    Country details.
                                </DialogDescription>
                            </DialogHeader>
                            <dl className="flex flex-col gap-3">
                                <DetailRow label="Name">
                                    {dialog.record.name}
                                </DetailRow>
                                <DetailRow label="Code">
                                    {dialog.record.code}
                                </DetailRow>
                            </dl>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
