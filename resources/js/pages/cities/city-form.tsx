import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';
import { Spinner } from '@/components/ui/spinner';

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

type CityFormValues = {
    province_id: number;
    name: string;
    code: string;
};

type Props = {
    form: { action: string; method: 'post' };
    provinces: ProvinceOption[];
    city?: CityFormValues;
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
};

export default function CityForm({
    form,
    provinces,
    city,
    submitLabel,
    onCancel,
    onSuccess,
}: Props) {
    return (
        <Form
            {...form}
            disableWhileProcessing
            className="flex flex-col gap-4"
            resetOnSuccess={!city}
            options={{ preserveScroll: true, preserveState: true }}
            onSuccess={onSuccess}
        >
            {({ processing, errors }) => (
                <>
                    <FieldGroup>
                        <Field
                            data-invalid={errors.province_id ? true : undefined}
                        >
                            <FieldLabel htmlFor="city-province">
                                Province
                            </FieldLabel>
                            <NativeSelect
                                id="city-province"
                                name="province_id"
                                className="w-full"
                                defaultValue={
                                    city?.province_id
                                        ? String(city.province_id)
                                        : undefined
                                }
                                required
                                aria-invalid={
                                    errors.province_id ? true : undefined
                                }
                            >
                                <NativeSelectOption value="" disabled>
                                    Select a province
                                </NativeSelectOption>
                                {provinces.map((province) => (
                                    <NativeSelectOption
                                        key={province.id}
                                        value={String(province.id)}
                                    >
                                        {province.name} ({province.country.name}
                                        )
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <FieldError>{errors.province_id}</FieldError>
                        </Field>

                        <Field data-invalid={errors.name ? true : undefined}>
                            <FieldLabel htmlFor="city-name">Name</FieldLabel>
                            <Input
                                id="city-name"
                                name="name"
                                defaultValue={city?.name}
                                required
                                autoFocus
                                autoComplete="off"
                                placeholder="Bandung"
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field data-invalid={errors.code ? true : undefined}>
                            <FieldLabel htmlFor="city-code">Code</FieldLabel>
                            <Input
                                id="city-code"
                                name="code"
                                defaultValue={city?.code}
                                required
                                maxLength={10}
                                autoComplete="off"
                                placeholder="3273"
                                aria-invalid={errors.code ? true : undefined}
                            />
                            <FieldDescription>
                                Short code unique within the selected province.
                            </FieldDescription>
                            <FieldError>{errors.code}</FieldError>
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
