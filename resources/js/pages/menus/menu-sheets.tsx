import type { ReactNode } from 'react';
import MenuController from '@/actions/App/Http/Controllers/MenuController';
import type { SelectOption } from '@/components/filters/types';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { ListedMenu } from './menu-columns';
import MenuForm from './menu-form';

export type MenuSheet =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: ListedMenu }
    | { type: 'view'; record: ListedMenu };

type Props = {
    sheet: MenuSheet;
    onSheetChange: (sheet: MenuSheet) => void;
    parentOptions: SelectOption[];
};

const sheetContentClassName = 'gap-0 overflow-y-auto p-0 sm:max-w-md';
const sheetHeaderClassName = 'gap-1 border-b px-4 py-4 pr-12 text-left';
const sheetBodyClassName = 'flex flex-col gap-4 p-4';

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

function MenuSheetPanel({
    open,
    onOpenChange,
    title,
    description,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
}) {
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

export default function MenuSheets({
    sheet,
    onSheetChange,
    parentOptions,
}: Props) {
    const close = () => onSheetChange({ type: 'closed' });

    return (
        <>
            <MenuSheetPanel
                open={sheet.type === 'create'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title="Add New Menu"
                description="Add a menu item to the navigation."
            >
                <MenuForm
                    form={MenuController.store.form()}
                    parentOptions={parentOptions}
                    submitLabel="Add New Menu"
                    onCancel={close}
                    onSuccess={close}
                    idPrefix="menu-create"
                />
            </MenuSheetPanel>

            <MenuSheetPanel
                open={sheet.type === 'edit'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title="Edit Menu"
                description="Update the menu details."
            >
                {sheet.type === 'edit' && (
                    <MenuForm
                        key={sheet.record.id}
                        form={MenuController.update.form(sheet.record.id)}
                        record={{
                            name: sheet.record.name,
                            slug: sheet.record.slug,
                            icon: sheet.record.icon,
                            route_name: sheet.record.route_name,
                            route_pattern: sheet.record.route_pattern,
                            parent_id: sheet.record.parent_id
                                ? String(sheet.record.parent_id)
                                : null,
                            sort_order: sheet.record.sort_order,
                            layout: sheet.record.layout,
                            is_active: sheet.record.is_active,
                        }}
                        parentOptions={parentOptions}
                        submitLabel="Save changes"
                        onCancel={close}
                        onSuccess={close}
                        idPrefix="menu-edit"
                    />
                )}
            </MenuSheetPanel>

            <MenuSheetPanel
                open={sheet.type === 'view'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
                title={sheet.type === 'view' ? sheet.record.name : 'Menu'}
                description="Menu details."
            >
                {sheet.type === 'view' && (
                    <dl className="flex flex-col gap-3">
                        <DetailRow label="Name">
                            {sheet.record.name}
                        </DetailRow>
                        <DetailRow label="Slug">
                            {sheet.record.slug}
                        </DetailRow>
                        <DetailRow label="Parent">
                            {sheet.record.parent_name ?? '—'}
                        </DetailRow>
                        <DetailRow label="Level">
                            {sheet.record.level}
                        </DetailRow>
                        <DetailRow label="Layout">
                            <Badge variant="outline" className="capitalize">
                                {sheet.record.layout}
                            </Badge>
                        </DetailRow>
                        <DetailRow label="Sort order">
                            {sheet.record.sort_order}
                        </DetailRow>
                        <DetailRow label="Route name">
                            {sheet.record.route_name ?? '—'}
                        </DetailRow>
                        <DetailRow label="Route pattern">
                            {sheet.record.route_pattern ?? '—'}
                        </DetailRow>
                        <DetailRow label="Status">
                            <Badge
                                variant={
                                    sheet.record.is_active
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {sheet.record.is_active
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
                        </DetailRow>
                    </dl>
                )}
            </MenuSheetPanel>
        </>
    );
}
