import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Columns2,
    FolderGit2,
    Layers,
    LayoutGrid,
    MessageSquare,
    PanelRight,
    SlidersHorizontal,
    SquareStack,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as example1 } from '@/routes/example1';
import { index as example2 } from '@/routes/example2';
import { index as example3 } from '@/routes/example3';
import { index as example4 } from '@/routes/example4';
import { index as parameters } from '@/routes/parameters';
import { index as users } from '@/routes/users';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: users(),
        icon: Users,
    },
    {
        title: 'Example 1',
        href: example1(),
        icon: Layers,
    },
    {
        title: 'Example 2',
        href: example2(),
        icon: MessageSquare,
    },
    {
        title: 'Example 3',
        href: example3(),
        icon: PanelRight,
    },
    {
        title: 'Example 4',
        href: example4(),
        icon: Columns2,
    },
    {
        title: 'Parameters',
        href: parameters(),
        icon: SlidersHorizontal,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
