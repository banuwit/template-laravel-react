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
import { Spinner } from '@/components/ui/spinner';

type CountryFormValues = {
    name: string;
    code: string;
};

type Props = {
    form: { action: string; method: 'post' };
    country?: CountryFormValues;
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
};

export default function CountryForm({
    form,
    country,
    submitLabel,
    onCancel,
    onSuccess,
}: Props) {
    return (
        <Form
            {...form}
            disableWhileProcessing
            className="flex flex-col gap-4"
            resetOnSuccess={!country}
            options={{ preserveScroll: true, preserveState: true }}
            onSuccess={onSuccess}
        >
            {({ processing, errors }) => (
                <>
                    <FieldGroup>
                        <Field data-invalid={errors.name ? true : undefined}>
                            <FieldLabel htmlFor="country-name">Name</FieldLabel>
                            <Input
                                id="country-name"
                                name="name"
                                defaultValue={country?.name}
                                required
                                autoFocus
                                autoComplete="off"
                                placeholder="Indonesia"
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field data-invalid={errors.code ? true : undefined}>
                            <FieldLabel htmlFor="country-code">Code</FieldLabel>
                            <Input
                                id="country-code"
                                name="code"
                                defaultValue={country?.code}
                                required
                                maxLength={2}
                                autoComplete="off"
                                placeholder="ID"
                                className="uppercase"
                                aria-invalid={errors.code ? true : undefined}
                            />
                            <FieldDescription>
                                Two-letter ISO 3166-1 alpha-2 code.
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
