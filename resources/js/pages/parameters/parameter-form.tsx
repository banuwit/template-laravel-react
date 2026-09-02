import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { index as parametersIndex } from '@/routes/parameters';

type ParameterFormValues = {
    group: string;
    code: string;
    value: string;
    description: string | null;
    text_color: string | null;
    bg_color: string | null;
    is_system: boolean;
    is_active: boolean;
    sort_order: number;
};

type Props = {
    form: { action: string; method: 'post' };
    parameter?: ParameterFormValues;
    submitLabel: string;
};

export default function ParameterForm({ form, parameter, submitLabel }: Props) {
    const [isActive, setIsActive] = useState(parameter?.is_active ?? true);
    const [isSystem, setIsSystem] = useState(parameter?.is_system ?? false);

    return (
        <Form {...form} disableWhileProcessing className="flex flex-col gap-6">
            {({ processing, errors }) => (
                <>
                    <FieldGroup>
                        <Field data-invalid={errors.group ? true : undefined}>
                            <FieldLabel htmlFor="group">Group</FieldLabel>
                            <Input
                                id="group"
                                name="group"
                                defaultValue={parameter?.group}
                                required
                                autoFocus
                                placeholder="e.g. status"
                                aria-invalid={errors.group ? true : undefined}
                            />
                            <FieldError>{errors.group}</FieldError>
                        </Field>

                        <Field data-invalid={errors.code ? true : undefined}>
                            <FieldLabel htmlFor="code">Code</FieldLabel>
                            <Input
                                id="code"
                                name="code"
                                defaultValue={parameter?.code}
                                required
                                placeholder="e.g. status_active"
                                aria-invalid={errors.code ? true : undefined}
                            />
                            <FieldError>{errors.code}</FieldError>
                        </Field>

                        <Field data-invalid={errors.value ? true : undefined}>
                            <FieldLabel htmlFor="value">Value</FieldLabel>
                            <Input
                                id="value"
                                name="value"
                                defaultValue={parameter?.value}
                                required
                                placeholder="e.g. Active"
                                aria-invalid={errors.value ? true : undefined}
                            />
                            <FieldError>{errors.value}</FieldError>
                        </Field>

                        <Field
                            data-invalid={errors.description ? true : undefined}
                        >
                            <FieldLabel htmlFor="description">
                                Description
                            </FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={parameter?.description ?? ''}
                                placeholder="Optional notes about this parameter"
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
                                <FieldLabel htmlFor="text_color">
                                    Text color
                                </FieldLabel>
                                <Input
                                    id="text_color"
                                    name="text_color"
                                    defaultValue={parameter?.text_color ?? ''}
                                    placeholder="#111827"
                                    aria-invalid={
                                        errors.text_color ? true : undefined
                                    }
                                />
                                <FieldError>{errors.text_color}</FieldError>
                            </Field>

                            <Field
                                data-invalid={
                                    errors.bg_color ? true : undefined
                                }
                            >
                                <FieldLabel htmlFor="bg_color">
                                    Background color
                                </FieldLabel>
                                <Input
                                    id="bg_color"
                                    name="bg_color"
                                    defaultValue={parameter?.bg_color ?? ''}
                                    placeholder="#E5E7EB"
                                    aria-invalid={
                                        errors.bg_color ? true : undefined
                                    }
                                />
                                <FieldError>{errors.bg_color}</FieldError>
                            </Field>
                        </div>

                        <Field
                            data-invalid={
                                errors.sort_order ? true : undefined
                            }
                        >
                            <FieldLabel htmlFor="sort_order">
                                Sort order
                            </FieldLabel>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                defaultValue={parameter?.sort_order ?? 0}
                                aria-invalid={
                                    errors.sort_order ? true : undefined
                                }
                            />
                            <FieldError>{errors.sort_order}</FieldError>
                        </Field>

                        <div className="flex items-center gap-3">
                            <Switch
                                id="is_active"
                                checked={isActive}
                                onCheckedChange={setIsActive}
                            />
                            <Label htmlFor="is_active">Active</Label>
                            <input
                                type="hidden"
                                name="is_active"
                                value={isActive ? '1' : '0'}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch
                                id="is_system"
                                checked={isSystem}
                                onCheckedChange={setIsSystem}
                            />
                            <Label htmlFor="is_system">
                                System parameter (protected from deletion)
                            </Label>
                            <input
                                type="hidden"
                                name="is_system"
                                value={isSystem ? '1' : '0'}
                            />
                        </div>
                    </FieldGroup>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" asChild>
                            <Link href={parametersIndex()}>Cancel</Link>
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
