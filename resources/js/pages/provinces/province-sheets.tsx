import { format } from 'date-fns';
import type { ReactNode } from 'react';
import ProvinceController from '@/actions/App/Http/Controllers/ProvinceController';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import ProvinceForm from './province-form';

type CountryOption = {
    id: number;
    name: string;
    code: string;
};

export type ListedProvince = {
    id: number;
    country_id: number;
    name: string;
    code: string;
    country: CountryOption;
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

export type ProvinceSheet =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; province: ListedProvince }
    | { type: 'view'; province: ListedProvince };

type Props = {
    sheet: ProvinceSheet;
    countries: CountryOption[];
    onSheetChange: (sheet: ProvinceSheet) => void;
};

const sheetContentClassName = 'gap-0 overflow-y-auto p-0 sm:max-w-md';
const sheetHeaderClassName = 'gap-1 border-b px-4 py-4 pr-12 text-left';
const sheetBodyClassName = 'flex flex-col gap-4 p-4';
const sheetFooterClassName =
    'mt-auto gap-2 border-t px-4 py-4 sm:flex-row sm:justify-end';

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

type ProvinceSheetPanelProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
};

function ProvinceSheetPanel({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
}: ProvinceSheetPanelProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className={sheetContentClassName}>
                <SheetHeader className={sheetHeaderClassName}>
                    <SheetTitle>{title}</SheetTitle>
                    {description ? (
                        <SheetDescription>{description}</SheetDescription>
                    ) : null}
                </SheetHeader>
                <div className={cn(sheetBodyClassName, footer && 'flex-1')}>
                    {children}
                </div>
                {footer ? (
                    <SheetFooter className={sheetFooterClassName}>
                        {footer}
                    </SheetFooter>
                ) : null}
            </SheetContent>
        </Sheet>
    );
}

export default function ProvinceSheets({
    sheet,
    countries,
    onSheetChange,
}: Props) {
    const close = () => onSheetChange({ type: 'closed' });

    return (
        <>
            <ProvinceSheetPanel
                open={sheet.type === 'create'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title="Add New Province"
                description="Add a province under a country with a unique code."
            >
                <ProvinceForm
                    form={ProvinceController.store.form()}
                    countries={countries}
                    submitLabel="Add New Province"
                    onCancel={close}
                    onSuccess={close}
                />
            </ProvinceSheetPanel>

            <ProvinceSheetPanel
                open={sheet.type === 'edit'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title="Edit province"
                description="Update the province country, name, or code."
            >
                {sheet.type === 'edit' ? (
                    <ProvinceForm
                        key={sheet.province.id}
                        form={ProvinceController.update.form(sheet.province.id)}
                        countries={countries}
                        province={{
                            country_id: sheet.province.country_id,
                            name: sheet.province.name,
                            code: sheet.province.code,
                        }}
                        submitLabel="Save changes"
                        onCancel={close}
                        onSuccess={close}
                    />
                ) : null}
            </ProvinceSheetPanel>

            <ProvinceSheetPanel
                open={sheet.type === 'view'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title={sheet.type === 'view' ? sheet.province.name : ''}
                description="Province details."
            >
                {sheet.type === 'view' ? (
                    <dl className="flex flex-col gap-3">
                        <DetailRow label="Country">
                            <span className="inline-flex items-center gap-2">
                                {sheet.province.country.name}
                                <Badge variant="secondary">
                                    {sheet.province.country.code}
                                </Badge>
                            </span>
                        </DetailRow>
                        <DetailRow label="Name">
                            {sheet.province.name}
                        </DetailRow>
                        <DetailRow label="Code">
                            <Badge variant="secondary">
                                {sheet.province.code}
                            </Badge>
                        </DetailRow>
                        <DetailRow label="Created">
                            {format(
                                new Date(sheet.province.created_at),
                                'MMM d, yyyy',
                            )}
                        </DetailRow>
                        <DetailRow label="Updated">
                            {format(
                                new Date(sheet.province.updated_at),
                                'MMM d, yyyy',
                            )}
                        </DetailRow>
                    </dl>
                ) : null}
            </ProvinceSheetPanel>
        </>
    );
}
