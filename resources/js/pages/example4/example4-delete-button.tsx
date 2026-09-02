import { Form } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import Example4Controller from '@/actions/App/Http/Controllers/Example4Controller';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    record: {
        id: number;
        name: string;
    };
    variant?: ComponentProps<typeof Button>['variant'];
    size?: ComponentProps<typeof Button>['size'];
};

export default function Example4DeleteButton({
    record,
    variant = 'ghost',
    size = 'sm',
}: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant} size={size}>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {record.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently remove this record. This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form {...Example4Controller.destroy.form(record.id)}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                {processing && (
                                    <Spinner data-icon="inline-start" />
                                )}
                                Delete record
                            </Button>
                        )}
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
