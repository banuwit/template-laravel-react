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
    record?: CountryFormValues;
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
    idPrefix?: string;
};

export default function CountryForm({
    form,
    record,
    submitLabel,
    onCancel,
    onSuccess,
    idPrefix = 'country',
}: Props) {
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
                                placeholder="Indonesia"
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
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
                                maxLength={2}
                                className="uppercase"
                                placeholder="ID"
                                onChange={(event) => {
                                    event.target.value =
                                        event.target.value.toUpperCase();
                                }}
                                aria-invalid={errors.code ? true : undefined}
                            />
                            <FieldDescription>
                                ISO 3166-1 alpha-2 code, e.g. ID, US, JP.
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
