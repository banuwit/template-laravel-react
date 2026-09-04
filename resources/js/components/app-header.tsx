import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ChevronRight, Folder, Menu, Search } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { mainNavItems } from '@/components/app-nav-items';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

function isNavItemActive(
    item: NavItem,
    isCurrentUrl: (href: NonNullable<NavItem['href']>) => boolean,
): boolean {
    if (item.href && isCurrentUrl(item.href)) {
        return true;
    }

    return (
        item.items?.some(
            (subItem) =>
                subItem.href !== undefined && isCurrentUrl(subItem.href),
        ) ?? false
    );
}

function MobileNavItem({ item }: { item: NavItem }) {
    const { isCurrentUrl } = useCurrentUrl();
    const childItems = item.items ?? [];
    const isChildActive = childItems.some(
        (subItem) => subItem.href !== undefined && isCurrentUrl(subItem.href),
    );

    if (childItems.length > 0) {
        return (
            <Collapsible
                key={isChildActive ? 'active' : 'inactive'}
                defaultOpen={isChildActive}
                className="group/collapsible flex flex-col gap-2"
            >
                <CollapsibleTrigger className="flex items-center gap-2 font-medium">
                    {item.icon && <item.icon className="size-5" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="flex flex-col gap-2 pl-7">
                        {childItems.map((subItem) =>
                            subItem.href ? (
                                <Link
                                    key={subItem.title}
                                    href={subItem.href}
                                    className="font-medium"
                                >
                                    {subItem.title}
                                </Link>
                            ) : null,
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        );
    }

    if (!item.href) {
        return null;
    }

    return (
        <Link href={item.href} className="flex items-center gap-2 font-medium">
            {item.icon && <item.icon className="size-5" />}
            <span>{item.title}</span>
        </Link>
    );
}

export function AppHeader() {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-[34px] w-[34px]"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col gap-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col gap-4">
                                            {mainNavItems.map((item) => (
                                                <MobileNavItem
                                                    key={item.title}
                                                    item={item}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {rightNavItems.map((item) => (
                                                <a
                                                    key={item.title}
                                                    href={
                                                        item.href
                                                            ? toUrl(item.href)
                                                            : undefined
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 font-medium"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="size-5" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center gap-2"
                    >
                        <AppLogo />
                    </Link>

                    <div className="ml-6 hidden h-full items-center gap-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch gap-2">
                                {mainNavItems.map((item) =>
                                    item.items && item.items.length > 0 ? (
                                        <NavigationMenuItem
                                            key={item.title}
                                            className="relative flex h-full items-center"
                                        >
                                            <NavigationMenuTrigger
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    isNavItemActive(
                                                        item,
                                                        isCurrentUrl,
                                                    ) && activeItemStyles,
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="mr-2 size-4" />
                                                )}
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="flex min-w-40 flex-col gap-1 p-1">
                                                    {item.items.map(
                                                        (subItem) =>
                                                            subItem.href ? (
                                                                <li
                                                                    key={
                                                                        subItem.title
                                                                    }
                                                                >
                                                                    <NavigationMenuLink
                                                                        asChild
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subItem.href
                                                                            }
                                                                            className={cn(
                                                                                whenCurrentUrl(
                                                                                    subItem.href,
                                                                                    activeItemStyles,
                                                                                ),
                                                                            )}
                                                                        >
                                                                            {subItem.icon && (
                                                                                <subItem.icon />
                                                                            )}
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                </li>
                                                            ) : null,
                                                    )}
                                                </ul>
                                            </NavigationMenuContent>
                                            {isNavItemActive(
                                                item,
                                                isCurrentUrl,
                                            ) && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                            )}
                                        </NavigationMenuItem>
                                    ) : item.href ? (
                                        <NavigationMenuItem
                                            key={item.title}
                                            className="relative flex h-full items-center"
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    whenCurrentUrl(
                                                        item.href,
                                                        activeItemStyles,
                                                    ),
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="mr-2 size-4" />
                                                )}
                                                {item.title}
                                            </Link>
                                            {isCurrentUrl(item.href) && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                            )}
                                        </NavigationMenuItem>
                                    ) : null,
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="relative flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="group h-9 w-9 cursor-pointer"
                            >
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button>
                            <div className="ml-1 hidden gap-1 lg:flex">
                                {rightNavItems.map((item) => (
                                    <Tooltip key={item.title}>
                                        <TooltipTrigger>
                                            <a
                                                href={
                                                    item.href
                                                        ? toUrl(item.href)
                                                        : undefined
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group inline-flex size-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                <span className="sr-only">
                                                    {item.title}
                                                </span>
                                                {item.icon && (
                                                    <item.icon className="size-5 opacity-80 group-hover:opacity-100" />
                                                )}
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user?.avatar}
                                            alt={auth.user?.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user?.name ?? '')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                {auth.user && (
                                    <UserMenuContent user={auth.user} />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </>
    );
}
