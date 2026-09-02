import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { ExampleRecordDetailRows } from '@/components/example-record-detail';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';
import { index as example1Index, show } from '@/routes/example1';
import type { ExampleRecord } from '@/types/example-record';
import Example1DeleteButton from './example1-delete-button';

type ShownExample1 = ExampleRecord & {
    can_update: boolean;
};

type Props = {
    example1: ShownExample1;
};

export default function Example1Show({ example1 }: Props) {
    const getInitials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
            {
                title: 'Example 1',
                href: example1Index(),
            },
            {
                title: example1.name,
                href: show(example1.id),
            },
        ],
    });

    return (
        <>
            <Head title={example1.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        variant="small"
                        title={example1.name}
                        description="Employee profile details for this record."
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={example1Index()}>
                                <ChevronLeft data-icon="inline-start" />
                                Back to example 1
                            </Link>
                        </Button>
                        {example1.can_delete && (
                            <Example1DeleteButton
                                record={example1}
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
                                    {getInitials(example1.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col gap-1">
                                <CardTitle className="truncate">
                                    {example1.name}
                                </CardTitle>
                                <CardDescription className="truncate">
                                    {example1.email}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="py-6">
                        <ExampleRecordDetailRows record={example1} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
