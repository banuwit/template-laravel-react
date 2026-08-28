import { Head } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, index as usersIndex } from '@/routes/users';
import UserForm from './user-form';

type Props = {
    passwordRules: string;
};

export default function UsersCreate({ passwordRules }: Props) {
    return (
        <>
            <Head title="Add New User" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    variant="small"
                    title="Add New"
                    description="Add a new account to the workspace."
                />

                <Card className="max-w-2xl gap-6">
                    <CardHeader>
                        <CardTitle>User details</CardTitle>
                        <CardDescription>
                            Name, email, and a password are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserForm
                            form={UserController.store.form()}
                            passwordRules={passwordRules}
                            passwordRequired
                            submitLabel="Add New"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UsersCreate.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Users',
            href: usersIndex(),
        },
        {
            title: 'Create',
            href: create(),
        },
    ],
};
