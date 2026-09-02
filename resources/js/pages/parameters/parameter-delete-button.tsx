import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import ParameterController from '@/actions/App/Http/Controllers/ParameterController';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
    record: {
        id: number;
        code: string;
    };
    variant?: ComponentProps<typeof Button>['variant'];
    size?: ComponentProps<typeof Button>['size'];
};

export default function ParameterDeleteButton({
    record,
    variant = 'destructive',
    size = 'icon-sm',
}: Props) {
    return (
        <AlertDialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant={variant}
                            size={size}
                            aria-label="Delete"
                        >
                            <Trash2 />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {record.code}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently remove this parameter. This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form {...ParameterController.destroy.form(record.id)}>
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
