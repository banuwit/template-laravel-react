import type { ReactNode } from 'react';
import ProvinceController from '@/actions/App/Http/Controllers/ProvinceController';
import type { SelectOption } from '@/components/filters/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ListedProvince } from './province-columns';
import ProvinceForm from './province-form';

export type ProvinceDialog =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: ListedProvince }
    | { type: 'view'; record: ListedProvince };

type Props = {
    dialog: ProvinceDialog;
    onDialogChange: (dialog: ProvinceDialog) => void;
    countryOptions: SelectOption[];
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

export default function ProvinceDialogs({
    dialog,
    onDialogChange,
    countryOptions,
}: Props) {
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
                        <DialogTitle>Add New Province</DialogTitle>
                        <DialogDescription>
                            Add a province to the reference list.
                        </DialogDescription>
                    </DialogHeader>
                    <ProvinceForm
                        form={ProvinceController.store.form()}
                        countryOptions={countryOptions}
                        submitLabel="Add New Province"
                        onCancel={close}
                        onSuccess={close}
                        idPrefix="province-create"
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
                        <DialogTitle>Edit province</DialogTitle>
                        <DialogDescription>
                            Update the province details.
                        </DialogDescription>
                    </DialogHeader>
                    {dialog.type === 'edit' && (
                        <ProvinceForm
                            key={dialog.record.id}
                            form={ProvinceController.update.form(
                                dialog.record.id,
                            )}
                            record={{
                                name: dialog.record.name,
                                country_id: String(dialog.record.country_id),
                            }}
                            countryOptions={countryOptions}
                            submitLabel="Save changes"
                            onCancel={close}
                            onSuccess={close}
                            idPrefix="province-edit"
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
                                    Province details.
                                </DialogDescription>
                            </DialogHeader>
                            <dl className="flex flex-col gap-3">
                                <DetailRow label="Name">
                                    {dialog.record.name}
                                </DetailRow>
                                <DetailRow label="Country">
                                    {dialog.record.country_name}
                                </DetailRow>
                            </dl>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
