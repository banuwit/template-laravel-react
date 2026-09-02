import { Head, setLayoutProps } from '@inertiajs/react';
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
import { edit, index as usersIndex } from '@/routes/users';
import UserForm from './user-form';

type EditableUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    department: string | null;
    position: string | null;
    join_date: string | null;
    gender: 'male' | 'female' | 'other' | null;
    status: 'active' | 'inactive';
};

type Props = {
    user: EditableUser;
    passwordRules: string;
};

export default function UsersEdit({ user, passwordRules }: Props) {
    setLayoutProps({
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
                title: user.name,
                href: edit(user.id),
            },
        ],
    });

    return (
        <>
            <Head title={`Edit ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    variant="small"
                    title="Edit user"
                    description={`Update ${user.name}'s account details.`}
                />

                <Card className="max-w-2xl gap-6">
                    <CardHeader>
                        <CardTitle>User details</CardTitle>
                        <CardDescription>
                            Password is optional. Leave it blank to keep the
                            current one.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserForm
                            form={UserController.update.form(user.id)}
                            user={user}
                            passwordRules={passwordRules}
                            submitLabel="Save changes"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
