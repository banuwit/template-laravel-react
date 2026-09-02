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

type ProvinceFormValues = {
    name: string;
    country_id: string;
};

type Props = {
    form: { action: string; method: 'post' };
    record?: ProvinceFormValues;
    countryOptions: SelectOption[];
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
    idPrefix?: string;
};

export default function ProvinceForm({
    form,
    record,
    countryOptions,
    submitLabel,
    onCancel,
    onSuccess,
    idPrefix = 'province',
}: Props) {
    const [countryId, setCountryId] = useState<string | null>(
        record?.country_id ?? null,
    );

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
                        <Field
                            data-invalid={errors.country_id ? true : undefined}
                        >
                            <FieldLabel htmlFor={`${idPrefix}-country_id`}>
                                Country
                            </FieldLabel>
                            <SelectBox
                                id={`${idPrefix}-country_id`}
                                name="country_id"
                                options={countryOptions}
                                value={countryId}
                                onValueChange={setCountryId}
                                searchable
                                clearable
                                placeholder="Select a country"
                                invalid={!!errors.country_id}
                            />
                            <FieldError>{errors.country_id}</FieldError>
                        </Field>

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
                                placeholder="West Java"
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>
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
