import type { ReactNode } from 'react';
import CityController from '@/actions/App/Http/Controllers/CityController';
import type { SelectOption } from '@/components/filters/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ListedCity } from './city-columns';
import CityForm from './city-form';

export type CityDialog =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: ListedCity }
    | { type: 'view'; record: ListedCity };

type Props = {
    dialog: CityDialog;
    onDialogChange: (dialog: CityDialog) => void;
    provinceOptions: SelectOption[];
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

export default function CityDialogs({
    dialog,
    onDialogChange,
    provinceOptions,
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
                        <DialogTitle>Add New City</DialogTitle>
                        <DialogDescription>
                            Add a city to the reference list.
                        </DialogDescription>
                    </DialogHeader>
                    <CityForm
                        form={CityController.store.form()}
                        provinceOptions={provinceOptions}
                        submitLabel="Add New City"
                        onCancel={close}
                        onSuccess={close}
                        idPrefix="city-create"
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
                        <DialogTitle>Edit city</DialogTitle>
                        <DialogDescription>
                            Update the city details.
                        </DialogDescription>
                    </DialogHeader>
                    {dialog.type === 'edit' && (
                        <CityForm
                            key={dialog.record.id}
                            form={CityController.update.form(dialog.record.id)}
                            record={{
                                name: dialog.record.name,
                                province_id: String(dialog.record.province_id),
                            }}
                            provinceOptions={provinceOptions}
                            submitLabel="Save changes"
                            onCancel={close}
                            onSuccess={close}
                            idPrefix="city-edit"
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
                                    City details.
                                </DialogDescription>
                            </DialogHeader>
                            <dl className="flex flex-col gap-3">
                                <DetailRow label="Name">
                                    {dialog.record.name}
                                </DetailRow>
                                <DetailRow label="Province">
                                    {dialog.record.province_name}
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
