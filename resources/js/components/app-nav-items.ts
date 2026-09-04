import {
    Building2,
    Globe,
    LayoutGrid,
    ListTree,
    Map,
    MapPin,
    SlidersHorizontal,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';
import { index as cities } from '@/routes/cities';
import { index as countries } from '@/routes/countries';
import { index as menus } from '@/routes/menus';
import { index as parameters } from '@/routes/parameters';
import { index as provinces } from '@/routes/provinces';
import { index as users } from '@/routes/users';
import type { NavItem } from '@/types';

export const mainNavItems: NavItem[] = [
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
        title: 'Parameters',
        href: parameters(),
        icon: SlidersHorizontal,
    },
    {
        title: 'Location',
        icon: MapPin,
        items: [
            {
                title: 'Countries',
                href: countries(),
                icon: Globe,
            },
            {
                title: 'Provinces',
                href: provinces(),
                icon: Map,
            },
            {
                title: 'Cities',
                href: cities(),
                icon: Building2,
            },
        ],
    },
    {
        title: 'Menus',
        href: menus(),
        icon: ListTree,
    },
];
