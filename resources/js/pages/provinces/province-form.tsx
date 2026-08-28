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

type CountryOption = {
    id: number;
    name: string;
    code: string;
};

type ProvinceFormValues = {
    country_id: number;
    name: string;
    code: string;
};

type Props = {
    form: { action: string; method: 'post' };
    countries: CountryOption[];
    province?: ProvinceFormValues;
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
};

export default function ProvinceForm({
    form,
    countries,
    province,
    submitLabel,
    onCancel,
    onSuccess,
}: Props) {
    return (
        <Form
            {...form}
            disableWhileProcessing
            className="flex flex-col gap-4"
            resetOnSuccess={!province}
            options={{ preserveScroll: true, preserveState: true }}
            onSuccess={onSuccess}
        >
            {({ processing, errors }) => (
                <>
                    <FieldGroup>
                        <Field
                            data-invalid={errors.country_id ? true : undefined}
                        >
                            <FieldLabel htmlFor="province-country">
                                Country
                            </FieldLabel>
                            <NativeSelect
                                id="province-country"
                                name="country_id"
                                className="w-full"
                                defaultValue={
                                    province?.country_id
                                        ? String(province.country_id)
                                        : undefined
                                }
                                required
                                aria-invalid={
                                    errors.country_id ? true : undefined
                                }
                            >
                                <NativeSelectOption value="" disabled>
                                    Select a country
                                </NativeSelectOption>
                                {countries.map((country) => (
                                    <NativeSelectOption
                                        key={country.id}
                                        value={String(country.id)}
                                    >
                                        {country.name} ({country.code})
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <FieldError>{errors.country_id}</FieldError>
                        </Field>

                        <Field data-invalid={errors.name ? true : undefined}>
                            <FieldLabel htmlFor="province-name">
                                Name
                            </FieldLabel>
                            <Input
                                id="province-name"
                                name="name"
                                defaultValue={province?.name}
                                required
                                autoFocus
                                autoComplete="off"
                                placeholder="West Java"
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field data-invalid={errors.code ? true : undefined}>
                            <FieldLabel htmlFor="province-code">
                                Code
                            </FieldLabel>
                            <Input
                                id="province-code"
                                name="code"
                                defaultValue={province?.code}
                                required
                                maxLength={10}
                                autoComplete="off"
                                placeholder="32"
                                aria-invalid={errors.code ? true : undefined}
                            />
                            <FieldDescription>
                                Short code unique within the selected country.
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
