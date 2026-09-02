import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ContentSidePanelLayoutProps = {
    open: boolean;
    panel: ReactNode;
    children: ReactNode;
    className?: string;
    panelLabel?: string;
};

function ContentSidePanelLayout({
    open,
    panel,
    children,
    className,
    panelLabel = 'Side panel',
}: ContentSidePanelLayoutProps) {
    return (
        <div
            className={cn(
                'flex min-h-0 min-w-0 flex-1 flex-col md:grid md:transition-[grid-template-columns] md:duration-300 md:ease-in-out',
                open
                    ? 'md:grid-cols-[minmax(0,1fr)_min(28rem,100%)]'
                    : 'md:grid-cols-[minmax(0,1fr)_0rem]',
                className,
            )}
        >
            <div className="min-w-0 flex-1 overflow-auto">{children}</div>
            <aside
                aria-label={panelLabel}
                aria-hidden={!open}
                inert={open ? undefined : true}
                className={cn(
                    'flex min-h-0 min-w-0 flex-col overflow-hidden bg-popover text-popover-foreground',
                    'md:border-l md:transition-opacity md:duration-200 md:ease-in-out',
                    open
                        ? 'w-full animate-in border-t duration-200 fade-in-0 slide-in-from-bottom-4 md:border-t-0 md:opacity-100 md:slide-in-from-right-4'
                        : 'hidden md:pointer-events-none md:flex md:opacity-0',
                )}
            >
                <div className="flex h-full w-full min-w-0 flex-col md:min-w-[28rem]">
                    {panel}
                </div>
            </aside>
        </div>
    );
}

function ContentSidePanelHeader({
    className,
    children,
    onClose,
    ...props
}: React.ComponentProps<'div'> & {
    onClose?: () => void;
}) {
    return (
        <div
            data-slot="content-side-panel-header"
            className={cn(
                'relative flex shrink-0 flex-col gap-0.5 border-b px-4 py-4 pr-12 text-left',
                className,
            )}
            {...props}
        >
            {children}
            {onClose ? (
                <Button
                    type="button"
                    variant="ghost"
                    className="absolute top-3 right-3"
                    size="icon-sm"
                    onClick={onClose}
                >
                    <XIcon />
                    <span className="sr-only">Close</span>
                </Button>
            ) : null}
        </div>
    );
}

function ContentSidePanelTitle({
    className,
    ...props
}: React.ComponentProps<'h2'>) {
    return (
        <h2
            data-slot="content-side-panel-title"
            className={cn(
                'font-heading text-base font-medium text-foreground',
                className,
            )}
            {...props}
        />
    );
}

function ContentSidePanelDescription({
    className,
    ...props
}: React.ComponentProps<'p'>) {
    return (
        <p
            data-slot="content-side-panel-description"
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}

function ContentSidePanelBody({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="content-side-panel-body"
            className={cn(
                'flex flex-1 flex-col gap-4 overflow-y-auto p-4',
                className,
            )}
            {...props}
        />
    );
}

function ContentSidePanelFooter({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="content-side-panel-footer"
            className={cn(
                'mt-auto flex shrink-0 flex-col gap-2 border-t px-4 py-4 sm:flex-row sm:justify-end',
                className,
            )}
            {...props}
        />
    );
}

export {
    ContentSidePanelLayout,
    ContentSidePanelHeader,
    ContentSidePanelTitle,
    ContentSidePanelDescription,
    ContentSidePanelBody,
    ContentSidePanelFooter,
};
