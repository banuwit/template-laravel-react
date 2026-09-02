import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
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
import { Spinner } from '@/components/ui/spinner';

type User = {
    id: number;
    name: string;
};

type Props =
    | {
          user: User;
          variant?: ComponentProps<typeof Button>['variant'];
          size?: ComponentProps<typeof Button>['size'];
      }
    | {
          user: User;
          /**
           * Fully controlled, trigger-less mode: renders only the
           * `AlertDialog`. Use this when the trigger has to live somewhere
           * that unmounts on its own (e.g. a `DropdownMenuItem` inside a
           * `DropdownMenuContent`, which Radix unmounts as soon as the menu
           * closes) — nesting the dialog there too would unmount it before
           * it ever gets to open. Render the trigger yourself and control
           * `open` from a state that outlives the menu.
           */
          open: boolean;
          onOpenChange: (open: boolean) => void;
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

    if ('open' in props) {
        return (
            <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
                <DeleteAlertDialogContent user={user} />
            </AlertDialog>
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
