import { Form } from '@inertiajs/react';
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

export type ParameterFormValues = {
    group: string;
    code: string;
    value: string;
    description: string | null;
    text_color: string | null;
    bg_color: string | null;
    is_active: boolean;
    sort_order: number;
};

type Props = {
    form: { action: string; method: 'post' };
    record?: ParameterFormValues;
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
    idPrefix?: string;
};

function isValidHex(value: string): boolean {
    return /^#[0-9A-Fa-f]{3,8}$/.test(value);
}

export default function ParameterForm({
    form,
    record,
    submitLabel,
    onCancel,
    onSuccess,
    idPrefix = 'parameter',
}: Props) {
    const [textColor, setTextColor] = useState(record?.text_color ?? '');
    const [bgColor, setBgColor] = useState(record?.bg_color ?? '');
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
                        <Field data-invalid={errors.group ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-group`}>
                                Group
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-group`}
                                name="group"
                                defaultValue={record?.group}
                                required
                                autoFocus
                                maxLength={50}
                                placeholder="status"
                                aria-invalid={errors.group ? true : undefined}
                            />
                            <FieldError>{errors.group}</FieldError>
                        </Field>

                        <Field data-invalid={errors.code ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-code`}>
                                Code
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-code`}
                                name="code"
                                defaultValue={record?.code}
                                required
                                maxLength={100}
                                placeholder="status_active"
                                aria-invalid={errors.code ? true : undefined}
                            />
                            <FieldError>{errors.code}</FieldError>
                        </Field>

                        <Field data-invalid={errors.value ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-value`}>
                                Value
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-value`}
                                name="value"
                                defaultValue={record?.value}
                                required
                                maxLength={150}
                                placeholder="Active"
                                aria-invalid={errors.value ? true : undefined}
                            />
                            <FieldError>{errors.value}</FieldError>
                        </Field>

                        <Field
                            data-invalid={errors.description ? true : undefined}
                        >
                            <FieldLabel htmlFor={`${idPrefix}-description`}>
                                Description
                            </FieldLabel>
                            <Textarea
                                id={`${idPrefix}-description`}
                                name="description"
                                defaultValue={record?.description ?? ''}
                                placeholder="What this parameter is used for"
                                aria-invalid={
                                    errors.description ? true : undefined
                                }
                            />
                            <FieldError>{errors.description}</FieldError>
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                data-invalid={
                                    errors.text_color ? true : undefined
                                }
                            >
                                <FieldLabel htmlFor={`${idPrefix}-text-color`}>
                                    Text color
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="size-6 shrink-0 rounded border"
                                        style={{
                                            backgroundColor: isValidHex(
                                                textColor,
                                            )
                                                ? textColor
                                                : 'transparent',
                                        }}
                                        aria-hidden
                                    />
                                    <Input
                                        id={`${idPrefix}-text-color`}
                                        name="text_color"
                                        value={textColor}
                                        onChange={(event) =>
                                            setTextColor(event.target.value)
                                        }
                                        maxLength={10}
                                        placeholder="#166534"
                                        aria-invalid={
                                            errors.text_color ? true : undefined
                                        }
                                    />
                                </div>
                                <FieldError>{errors.text_color}</FieldError>
                            </Field>

                            <Field
                                data-invalid={
                                    errors.bg_color ? true : undefined
                                }
                            >
                                <FieldLabel htmlFor={`${idPrefix}-bg-color`}>
                                    Background color
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="size-6 shrink-0 rounded border"
                                        style={{
                                            backgroundColor: isValidHex(bgColor)
                                                ? bgColor
                                                : 'transparent',
                                        }}
                                        aria-hidden
                                    />
                                    <Input
                                        id={`${idPrefix}-bg-color`}
                                        name="bg_color"
                                        value={bgColor}
                                        onChange={(event) =>
                                            setBgColor(event.target.value)
                                        }
                                        maxLength={10}
                                        placeholder="#dcfce7"
                                        aria-invalid={
                                            errors.bg_color ? true : undefined
                                        }
                                    />
                                </div>
                                <FieldError>{errors.bg_color}</FieldError>
                            </Field>
                        </div>

                        <Field
                            data-invalid={errors.sort_order ? true : undefined}
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
