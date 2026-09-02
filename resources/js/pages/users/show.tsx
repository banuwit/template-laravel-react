import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';
import { index as usersIndex, show } from '@/routes/users';
import { genderLabel, statusLabel } from '@/types/example-record';
import UserDeleteButton from './user-delete-button';

type ShownUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    department: string | null;
    position: string | null;
    join_date: string | null;
    gender: 'male' | 'female' | 'other' | null;
    status: 'active' | 'inactive';
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    can_update: boolean;
    can_delete: boolean;
};

type Props = {
    user: ShownUser;
};

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
            <dt className="w-32 shrink-0 text-sm text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm font-medium">{children}</dd>
        </div>
    );
}

export default function UsersShow({ user }: Props) {
    const getInitials = useInitials();

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
                href: show(user.id),
            },
        ],
    });

    return (
        <>
            <Head title={user.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        variant="small"
                        title={user.name}
                        description="Account details for this workspace member."
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={usersIndex()}>
                                <ChevronLeft data-icon="inline-start" />
                                Back to users
                            </Link>
                        </Button>
                        {user.can_delete && (
                            <UserDeleteButton
                                user={user}
                                variant="outline"
                                size="default"
                            />
                        )}
                    </div>
                </div>

                <Card className="max-w-2xl gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b py-4">
                        <div className="flex items-center gap-3">
                            <Avatar size="lg">
                                <AvatarFallback>
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col gap-1">
                                <CardTitle className="truncate">
                                    {user.name}
                                </CardTitle>
                                <CardDescription className="truncate">
                                    {user.email}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="py-6">
                        <dl className="flex flex-col gap-4">
                            <DetailRow label="Name">{user.name}</DetailRow>
                            <Separator />
                            <DetailRow label="Email">{user.email}</DetailRow>
                            <Separator />
                            <DetailRow label="Phone">
                                {user.phone ?? '—'}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Department">
                                {user.department ?? '—'}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Position">
                                {user.position ?? '—'}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Join date">
                                {user.join_date
                                    ? format(
                                          new Date(user.join_date),
                                          'MMM d, yyyy',
                                      )
                                    : '—'}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Gender">
                                {user.gender ? (
                                    <Badge variant="secondary">
                                        {genderLabel(user.gender)}
                                    </Badge>
                                ) : (
                                    '—'
                                )}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Status">
                                <Badge
                                    variant={
                                        user.status === 'active'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {statusLabel(user.status)}
                                </Badge>
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Email status">
                                {user.email_verified_at ? (
                                    <Badge variant="secondary">Verified</Badge>
                                ) : (
                                    <Badge variant="outline">Unverified</Badge>
                                )}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Joined">
                                {format(
                                    new Date(user.created_at),
                                    'MMM d, yyyy',
                                )}
                            </DetailRow>
                            <Separator />
                            <DetailRow label="Last updated">
                                {format(
                                    new Date(user.updated_at),
                                    'MMM d, yyyy',
                                )}
                            </DetailRow>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
