// List of Navbar Items

export type NavbarItem = {
    label: string;
    children?: Array<NavbarItem>;
    href?: string;
}

export const NAVBAR_ITEMS: Array<NavbarItem> = [
    {
        label: 'My Bar',
        children: [
            {
                label: 'My Ingredients',
                href: '/my_ingredients'
            },
            {
                label: 'My Cocktails',
                href: '/my_cocktails'
            },
            {
                label: 'My Favorites',
                href: '/my_favorites'
            }
        ]
    },
    {
        label: 'Explore',
        children: [
            {
                label: 'Ingredients',
                href: '/ingredients'
            },
            {
                label: 'Cocktials',
                href: '/cocktails'
            }
        ]
    },
    {
        label: 'Search',
        href: '/search'
    }
] 