import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { GENDER_OPTIONS, STATUS_OPTIONS } from '@/types/example-record';
import type { ExampleRecordFormValues } from '@/types/example-record';

const selectClassName = cn(
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs',
    'transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
);

type Props = {
    form: { action: string; method: 'post' };
    record?: ExampleRecordFormValues;
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
    idPrefix?: string;
};

export default function ExampleRecordForm({
    form,
    record,
    submitLabel,
    onCancel,
    onSuccess,
    idPrefix = 'example-record',
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
                                autoComplete="name"
                                placeholder="Full name"
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field data-invalid={errors.email ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-email`}>
                                Email
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-email`}
                                name="email"
                                type="email"
                                defaultValue={record?.email}
                                required
                                autoComplete="email"
                                placeholder="email@example.com"
                                aria-invalid={errors.email ? true : undefined}
                            />
                            <FieldError>{errors.email}</FieldError>
                        </Field>

                        <Field data-invalid={errors.phone ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-phone`}>
                                Phone
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-phone`}
                                name="phone"
                                type="tel"
                                defaultValue={record?.phone}
                                required
                                autoComplete="tel"
                                placeholder="+1 555-0100"
                                aria-invalid={errors.phone ? true : undefined}
                            />
                            <FieldError>{errors.phone}</FieldError>
                        </Field>

                        <Field
                            data-invalid={errors.department ? true : undefined}
                        >
                            <FieldLabel htmlFor={`${idPrefix}-department`}>
                                Department
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-department`}
                                name="department"
                                defaultValue={record?.department}
                                required
                                autoComplete="organization"
                                placeholder="Engineering"
                                aria-invalid={
                                    errors.department ? true : undefined
                                }
                            />
                            <FieldError>{errors.department}</FieldError>
                        </Field>

                        <Field
                            data-invalid={errors.position ? true : undefined}
                        >
                            <FieldLabel htmlFor={`${idPrefix}-position`}>
                                Position
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-position`}
                                name="position"
                                defaultValue={record?.position}
                                required
                                autoComplete="organization-title"
                                placeholder="Software Engineer"
                                aria-invalid={
                                    errors.position ? true : undefined
                                }
                            />
                            <FieldError>{errors.position}</FieldError>
                        </Field>

                        <Field
                            data-invalid={errors.join_date ? true : undefined}
                        >
                            <FieldLabel htmlFor={`${idPrefix}-join-date`}>
                                Join date
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-join-date`}
                                name="join_date"
                                type="date"
                                defaultValue={record?.join_date}
                                required
                                aria-invalid={
                                    errors.join_date ? true : undefined
                                }
                            />
                            <FieldError>{errors.join_date}</FieldError>
                        </Field>

                        <Field data-invalid={errors.gender ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-gender`}>
                                Gender
                            </FieldLabel>
                            <select
                                id={`${idPrefix}-gender`}
                                name="gender"
                                defaultValue={record?.gender ?? 'male'}
                                required
                                className={selectClassName}
                                aria-invalid={errors.gender ? true : undefined}
                            >
                                {GENDER_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <FieldError>{errors.gender}</FieldError>
                        </Field>

                        <Field data-invalid={errors.status ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-status`}>
                                Status
                            </FieldLabel>
                            <select
                                id={`${idPrefix}-status`}
                                name="status"
                                defaultValue={record?.status ?? 'active'}
                                required
                                className={selectClassName}
                                aria-invalid={errors.status ? true : undefined}
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <FieldError>{errors.status}</FieldError>
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
