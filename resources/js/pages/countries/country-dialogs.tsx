import { format } from 'date-fns';
import type { ReactNode } from 'react';
import CountryController from '@/actions/App/Http/Controllers/CountryController';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import CountryForm from './country-form';

export type ListedCountry = {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

export type CountryDialog =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; country: ListedCountry }
    | { type: 'view'; country: ListedCountry };

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
            <dt className="w-24 shrink-0 text-sm text-muted-foreground">
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Country</DialogTitle>
                        <DialogDescription>
                            Add a country name and its two-letter ISO code.
                        </DialogDescription>
                    </DialogHeader>
                    <CountryForm
                        form={CountryController.store.form()}
                        submitLabel="Add New Country"
                        onCancel={close}
                        onSuccess={close}
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit country</DialogTitle>
                        <DialogDescription>
                            Update the country name or ISO code.
                        </DialogDescription>
                    </DialogHeader>
                    {dialog.type === 'edit' && (
                        <CountryForm
                            key={dialog.country.id}
                            form={CountryController.update.form(
                                dialog.country.id,
                            )}
                            country={{
                                name: dialog.country.name,
                                code: dialog.country.code,
                            }}
                            submitLabel="Save changes"
                            onCancel={close}
                            onSuccess={close}
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
                <DialogContent className="sm:max-w-md">
                    {dialog.type === 'view' && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{dialog.country.name}</DialogTitle>
                                <DialogDescription>
                                    Country details.
                                </DialogDescription>
                            </DialogHeader>
                            <dl className="flex flex-col gap-3">
                                <DetailRow label="Name">
                                    {dialog.country.name}
                                </DetailRow>
                                <DetailRow label="Code">
                                    <Badge variant="secondary">
                                        {dialog.country.code}
                                    </Badge>
                                </DetailRow>
                                <DetailRow label="Created">
                                    {format(
                                        new Date(dialog.country.created_at),
                                        'MMM d, yyyy',
                                    )}
                                </DetailRow>
                                <DetailRow label="Updated">
                                    {format(
                                        new Date(dialog.country.updated_at),
                                        'MMM d, yyyy',
                                    )}
                                </DetailRow>
                            </dl>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
