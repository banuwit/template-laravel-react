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

type CityFormValues = {
    name: string;
    province_id: string;
};

type Props = {
    form: { action: string; method: 'post' };
    record?: CityFormValues;
    provinceOptions: SelectOption[];
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
    idPrefix?: string;
};

export default function CityForm({
    form,
    record,
    provinceOptions,
    submitLabel,
    onCancel,
    onSuccess,
    idPrefix = 'city',
}: Props) {
    const [provinceId, setProvinceId] = useState<string | null>(
        record?.province_id ?? null,
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
                            data-invalid={errors.province_id ? true : undefined}
                        >
                            <FieldLabel htmlFor={`${idPrefix}-province_id`}>
                                Province
                            </FieldLabel>
                            <SelectBox
                                id={`${idPrefix}-province_id`}
                                name="province_id"
                                options={provinceOptions}
                                value={provinceId}
                                onValueChange={setProvinceId}
                                searchable
                                clearable
                                placeholder="Select a province"
                                invalid={!!errors.province_id}
                            />
                            <FieldError>{errors.province_id}</FieldError>
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
                                placeholder="Bandung"
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
