import { Form, Link } from '@inertiajs/react';
import PasswordInput from '@/components/password-input';
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
import { cn } from '@/lib/utils';
import { index as usersIndex } from '@/routes/users';
import { GENDER_OPTIONS, STATUS_OPTIONS } from '@/types/example-record';
import type { ExampleRecord } from '@/types/example-record';

const selectClassName = cn(
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs',
    'transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
);

type UserFormValues = {
    name: string;
    email: string;
    phone?: string | null;
    department?: string | null;
    position?: string | null;
    join_date?: string | null;
    gender?: ExampleRecord['gender'] | null;
    status?: ExampleRecord['status'] | null;
};

type Props = {
    form: { action: string; method: 'post' };
    user?: UserFormValues;
    passwordRules: string;
    passwordRequired?: boolean;
    submitLabel: string;
};

export default function UserForm({
    form,
    user,
    passwordRules,
    passwordRequired = false,
    submitLabel,
}: Props) {
    return (
        <Form
            {...form}
            disableWhileProcessing
            className="flex flex-col gap-6"
            resetOnSuccess={['password', 'password_confirmation']}
        >
            {({ processing, errors }) => (
                <>
                    <FieldGroup>
                        <Field data-invalid={errors.name ? true : undefined}>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user?.name}
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder="Full name"
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field data-invalid={errors.email ? true : undefined}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user?.email}
                                required
                                autoComplete="email"
                                placeholder="email@example.com"
                                aria-invalid={errors.email ? true : undefined}
                            />
                            <FieldError>{errors.email}</FieldError>
                        </Field>

                        <Field data-invalid={errors.phone ? true : undefined}>
                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={user?.phone ?? ''}
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
                            <FieldLabel htmlFor="department">
                                Department
                            </FieldLabel>
                            <Input
                                id="department"
                                name="department"
                                defaultValue={user?.department ?? ''}
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
                            <FieldLabel htmlFor="position">Position</FieldLabel>
                            <Input
                                id="position"
                                name="position"
                                defaultValue={user?.position ?? ''}
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
                            <FieldLabel htmlFor="join_date">
                                Join date
                            </FieldLabel>
                            <Input
                                id="join_date"
                                name="join_date"
                                type="date"
                                defaultValue={user?.join_date ?? ''}
                                required
                                aria-invalid={
                                    errors.join_date ? true : undefined
                                }
                            />
                            <FieldError>{errors.join_date}</FieldError>
                        </Field>

                        <Field data-invalid={errors.gender ? true : undefined}>
                            <FieldLabel htmlFor="gender">Gender</FieldLabel>
                            <select
                                id="gender"
                                name="gender"
                                defaultValue={user?.gender ?? 'male'}
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
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <select
                                id="status"
                                name="status"
                                defaultValue={user?.status ?? 'active'}
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

                        <Field
                            data-invalid={errors.password ? true : undefined}
                        >
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <PasswordInput
                                id="password"
                                name="password"
                                required={passwordRequired}
                                autoComplete="new-password"
                                placeholder={
                                    passwordRequired
                                        ? 'Password'
                                        : 'Leave blank to keep the current password'
                                }
                                passwordrules={passwordRules}
                                aria-invalid={
                                    errors.password ? true : undefined
                                }
                            />
                            {!passwordRequired && (
                                <FieldDescription>
                                    Leave blank to keep the current password.
                                </FieldDescription>
                            )}
                            <FieldError>{errors.password}</FieldError>
                        </Field>

                        <Field
                            data-invalid={
                                errors.password_confirmation ? true : undefined
                            }
                        >
                            <FieldLabel htmlFor="password_confirmation">
                                Confirm password
                            </FieldLabel>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required={passwordRequired}
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                passwordrules={passwordRules}
                                aria-invalid={
                                    errors.password_confirmation
                                        ? true
                                        : undefined
                                }
                            />
                            <FieldError>
                                {errors.password_confirmation}
                            </FieldError>
                        </Field>
                    </FieldGroup>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" asChild>
                            <Link href={usersIndex()}>Cancel</Link>
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
