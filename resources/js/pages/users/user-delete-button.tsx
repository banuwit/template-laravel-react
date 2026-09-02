import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import * as React from 'react';
import type { ComponentProps } from 'react';
import UserController from '@/actions/App/Http/Controllers/UserController';
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';

type User = {
    id: number;
    name: string;
};

type Props =
    | {
          user: User;
          asMenuItem?: false;
          variant?: ComponentProps<typeof Button>['variant'];
          size?: ComponentProps<typeof Button>['size'];
      }
    | {
          user: User;
          /** Render as a `DropdownMenuItem` instead of a standalone button. */
          asMenuItem: true;
      };

function DeleteAlertDialogContent({ user }: { user: User }) {
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete {user.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently remove their account. This action
                    cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Form {...UserController.destroy.form(user.id)}>
                    {({ processing }) => (
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing}
                        >
                            {processing && <Spinner data-icon="inline-start" />}
                            Delete user
                        </Button>
                    )}
                </Form>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}

export default function UserDeleteButton(props: Props) {
    const { user } = props;

    // A `DropdownMenuItem` can't be an `AlertDialogTrigger` directly: selecting
    // it closes the menu, and opening the dialog synchronously in that same
    // tick races the menu's own unmount/focus-return, so the dialog never
    // actually shows. Deferring the open past the menu's close sidesteps it.
    const [open, setOpen] = React.useState(false);

    if (props.asMenuItem) {
        return (
            <>
                <DropdownMenuItem
                    variant="destructive"
                    className="data-highlighted:bg-destructive/10! data-highlighted:text-destructive!"
                    onSelect={() => {
                        setTimeout(() => setOpen(true), 0);
                    }}
                >
                    <Trash2 />
                    Delete
                </DropdownMenuItem>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <DeleteAlertDialogContent user={user} />
                </AlertDialog>
            </>
        );
    }

    const { variant = 'ghost', size = 'sm' } = props;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant} size={size}>
                    <Trash2 data-icon="inline-start" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <DeleteAlertDialogContent user={user} />
        </AlertDialog>
    );
}
