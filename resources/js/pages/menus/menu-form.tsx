import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { SelectBox } from '@/components/filters/select-box';
import type { SelectOption } from '@/components/filters/types';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';

const layoutOptions: SelectOption[] = [
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'topbar', label: 'Topbar' },
    { value: 'footer', label: 'Footer' },
];

export type MenuFormValues = {
    name: string;
    slug: string;
    icon: string | null;
    route_name: string | null;
    route_pattern: string | null;
    parent_id: string | null;
    sort_order: number;
    layout: string;
    is_active: boolean;
};

type Props = {
    form: { action: string; method: 'post' };
    record?: MenuFormValues;
    parentOptions: SelectOption[];
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
    idPrefix?: string;
};

export default function MenuForm({
    form,
    record,
    parentOptions,
    submitLabel,
    onCancel,
    onSuccess,
    idPrefix = 'menu',
}: Props) {
    const [parentId, setParentId] = useState<string | null>(
        record?.parent_id ?? null,
    );
    const [layout, setLayout] = useState<string | null>(
        record?.layout ?? 'sidebar',
    );
    const [isActive, setIsActive] = useState(record?.is_active ?? true);

    return (
        <Form
            {...form}
            disableWhileProcessing
            className="flex flex-col gap-4"
            resetOnSuccess={!record}
            options={{ preserveScroll: true, preserveState: true }}
            onSuccess={onSuccess}
        >
            {({ processing, errors }) => (
                <>
                    <FieldGroup>
                        <Field data-invalid={errors.name ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-name`}>
                                Name
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-name`}
                                name="name"
                                defaultValue={record?.name}
                                required
                                autoFocus
                                placeholder="Dashboard"
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field data-invalid={errors.slug ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-slug`}>
                                Slug
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-slug`}
                                name="slug"
                                defaultValue={record?.slug}
                                required
                                placeholder="dashboard"
                                aria-invalid={errors.slug ? true : undefined}
                            />
                            <FieldError>{errors.slug}</FieldError>
                        </Field>

                        <Field data-invalid={errors.icon ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-icon`}>
                                Icon
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-icon`}
                                name="icon"
                                defaultValue={record?.icon ?? ''}
                                placeholder="layout-grid"
                                aria-invalid={errors.icon ? true : undefined}
                            />
                            <FieldError>{errors.icon}</FieldError>
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                data-invalid={
                                    errors.route_name ? true : undefined
                                }
                            >
                                <FieldLabel htmlFor={`${idPrefix}-route-name`}>
                                    Route name
                                </FieldLabel>
                                <Input
                                    id={`${idPrefix}-route-name`}
                                    name="route_name"
                                    defaultValue={record?.route_name ?? ''}
                                    placeholder="dashboard"
                                    aria-invalid={
                                        errors.route_name ? true : undefined
                                    }
                                />
                                <FieldError>{errors.route_name}</FieldError>
                            </Field>

                            <Field
                                data-invalid={
                                    errors.route_pattern ? true : undefined
                                }
                            >
                                <FieldLabel
                                    htmlFor={`${idPrefix}-route-pattern`}
                                >
                                    Route pattern
                                </FieldLabel>
                                <Input
                                    id={`${idPrefix}-route-pattern`}
                                    name="route_pattern"
                                    defaultValue={record?.route_pattern ?? ''}
                                    placeholder="dashboard*"
                                    aria-invalid={
                                        errors.route_pattern
                                            ? true
                                            : undefined
                                    }
                                />
                                <FieldError>{errors.route_pattern}</FieldError>
                            </Field>
                        </div>

                        <Field
                            data-invalid={errors.parent_id ? true : undefined}
                        >
                            <FieldLabel htmlFor={`${idPrefix}-parent_id`}>
                                Parent menu
                            </FieldLabel>
                            <SelectBox
                                id={`${idPrefix}-parent_id`}
                                name="parent_id"
                                options={parentOptions}
                                value={parentId}
                                onValueChange={setParentId}
                                searchable
                                clearable
                                placeholder="No parent (top-level)"
                                invalid={!!errors.parent_id}
                            />
                            <FieldError>{errors.parent_id}</FieldError>
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                data-invalid={errors.layout ? true : undefined}
                            >
                                <FieldLabel htmlFor={`${idPrefix}-layout`}>
                                    Layout
                                </FieldLabel>
                                <SelectBox
                                    id={`${idPrefix}-layout`}
                                    name="layout"
                                    options={layoutOptions}
                                    value={layout}
                                    onValueChange={setLayout}
                                    invalid={!!errors.layout}
                                />
                                <FieldError>{errors.layout}</FieldError>
                            </Field>

                            <Field
                                data-invalid={
                                    errors.sort_order ? true : undefined
                                }
                            >
                                <FieldLabel htmlFor={`${idPrefix}-sort-order`}>
                                    Sort order
                                </FieldLabel>
                                <Input
                                    id={`${idPrefix}-sort-order`}
                                    name="sort_order"
                                    type="number"
                                    defaultValue={record?.sort_order ?? 0}
                                    required
                                    aria-invalid={
                                        errors.sort_order ? true : undefined
                                    }
                                />
                                <FieldError>{errors.sort_order}</FieldError>
                            </Field>
                        </div>

                        <FieldLabel htmlFor={`${idPrefix}-is-active`}>
                            <Field orientation="horizontal">
                                <Switch
                                    id={`${idPrefix}-is-active`}
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                    aria-invalid={
                                        errors.is_active ? true : undefined
                                    }
                                />
                                <span>Active</span>
                            </Field>
                        </FieldLabel>
                        <input
                            type="hidden"
                            name="is_active"
                            value={isActive ? '1' : '0'}
                        />
                        <FieldError>{errors.is_active}</FieldError>
                    </FieldGroup>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner data-icon="inline-start" />}
                            {submitLabel}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
