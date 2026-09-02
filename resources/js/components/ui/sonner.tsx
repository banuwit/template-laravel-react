import { Toaster as Sonner, type ToasterProps } from 'sonner';
import {
    CircleCheckIcon,
    InfoIcon,
    TriangleAlertIcon,
    OctagonXIcon,
    Loader2Icon,
} from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

const Toaster = ({ ...props }: ToasterProps) => {
    // `next-themes` isn't wired up in this app — appearance (light/dark/system,
    // resolved against the OS when "system") lives in `useAppearance`, the
    // same source the `.dark` class on `<html>` comes from. Reading theme
    // from anywhere else would drift from what's actually on screen.
    const { resolvedAppearance } = useAppearance();

    return (
        <Sonner
            theme={resolvedAppearance}
            className="toaster group"
            duration={5000}
            closeButton
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    // Soft, per-status backgrounds — default stays neutral
                    // (bg-background), the rest pair a tinted background with
                    // a matching border and text color.
                    default: 'bg-background! text-foreground! border-border!',
                    success:
                        'bg-success-bg! text-success! border-success-border!',
                    info: 'bg-info-bg! text-info! border-info-border!',
                    warning:
                        'bg-warning-bg! text-warning! border-warning-border!',
                    error: 'bg-error-bg! text-destructive! border-error-border!',
                    closeButton:
                        'bg-transparent! border-current/20! text-current!',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
