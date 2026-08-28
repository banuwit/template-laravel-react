import { format } from 'date-fns';
import type { ReactNode } from 'react';
import CityController from '@/actions/App/Http/Controllers/CityController';
import {
    ContentSidePanelBody,
    ContentSidePanelDescription,
    ContentSidePanelHeader,
    ContentSidePanelLayout,
    ContentSidePanelTitle,
} from '@/components/content-side-panel';
import { Badge } from '@/components/ui/badge';
import CityForm from './city-form';

type ProvinceOption = {
    id: number;
    name: string;
    code: string;
    country: {
        id: number;
        name: string;
        code: string;
    };
};

export type ListedCity = {
    id: number;
    province_id: number;
    name: string;
    code: string;
    province: ProvinceOption;
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

export type CitySheet =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; city: ListedCity }
    | { type: 'view'; city: ListedCity };

type Props = {
    sheet: CitySheet;
    provinces: ProvinceOption[];
    onSheetChange: (sheet: CitySheet) => void;
    children: ReactNode;
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

function CityPanelContent({
    sheet,
    provinces,
    onClose,
}: {
    sheet: CitySheet;
    provinces: ProvinceOption[];
    onClose: () => void;
}) {
    if (sheet.type === 'create') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>Add New City</ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        Add a city under a province with a unique code.
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <CityForm
                        form={CityController.store.form()}
                        provinces={provinces}
                        submitLabel="Add New City"
                        onCancel={onClose}
                        onSuccess={onClose}
                    />
                </ContentSidePanelBody>
            </>
        );
    }

    if (sheet.type === 'edit') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>Edit city</ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        Update the city province, name, or code.
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <CityForm
                        key={sheet.city.id}
                        form={CityController.update.form(sheet.city.id)}
                        provinces={provinces}
                        city={{
                            province_id: sheet.city.province_id,
                            name: sheet.city.name,
                            code: sheet.city.code,
                        }}
                        submitLabel="Save changes"
                        onCancel={onClose}
                        onSuccess={onClose}
                    />
                </ContentSidePanelBody>
            </>
        );
    }

    if (sheet.type === 'view') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>{sheet.city.name}</ContentSidePanelTitle>
                    <ContentSidePanelDescription>
                        City details.
                    </ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <dl className="flex flex-col gap-3">
                        <DetailRow label="Province">
                            <span className="inline-flex items-center gap-2">
                                {sheet.city.province.name}
                                <Badge variant="secondary">
                                    {sheet.city.province.code}
                                </Badge>
                            </span>
                        </DetailRow>
                        <DetailRow label="Country">
                            <span className="inline-flex items-center gap-2">
                                {sheet.city.province.country.name}
                                <Badge variant="secondary">
                                    {sheet.city.province.country.code}
                                </Badge>
                            </span>
                        </DetailRow>
                        <DetailRow label="Name">{sheet.city.name}</DetailRow>
                        <DetailRow label="Code">
                            <Badge variant="secondary">{sheet.city.code}</Badge>
                        </DetailRow>
                        <DetailRow label="Created">
                            {format(
                                new Date(sheet.city.created_at),
                                'MMM d, yyyy',
                            )}
                        </DetailRow>
                        <DetailRow label="Updated">
                            {format(
                                new Date(sheet.city.updated_at),
                                'MMM d, yyyy',
                            )}
                        </DetailRow>
                    </dl>
                </ContentSidePanelBody>
            </>
        );
    }

    return null;
}

export default function CitySheets({
    sheet,
    provinces,
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
                    ? 'Add New City'
                    : sheet.type === 'edit'
                      ? 'Edit City'
                      : sheet.type === 'view'
                        ? 'View City'
                        : 'City panel'
            }
            panel={
                isOpen ? (
                    <CityPanelContent
                        sheet={sheet}
                        provinces={provinces}
                        onClose={close}
                    />
                ) : null
            }
        >
            {children}
        </ContentSidePanelLayout>
    );
}
