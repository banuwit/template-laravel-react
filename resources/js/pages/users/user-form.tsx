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
import { index as usersIndex } from '@/routes/users';

type UserFormValues = {
    name: string;
    email: string;
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
