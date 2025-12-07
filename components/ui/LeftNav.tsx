'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useInvestorStore } from '@/lib/investorStore';

export function LeftNav() {
    const pathname = usePathname();
    const { currentUser } = useInvestorStore();

    // Founder navigation
    const founderNavItems = [
        { label: 'Home', href: '/home-founder' },
        { label: 'Submit Idea', href: '/submit' },
        { label: 'My Projects', href: '/my-projects' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Showcase', href: '/showcase' },
    ];

    // Investor navigation
    const investorNavItems = [
        { label: 'Home', href: '/home-investor' },
        { label: 'View Ideas', href: '/investor' },
        { label: 'Requests', href: '/my-requests' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Showcase', href: '/showcase' },
    ];

    const navItems = currentUser.role === 'founder' ? founderNavItems : investorNavItems;

    return (
        <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
            <ul className="space-y-6">
                {navItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-foreground',
                                pathname === item.href
                                    ? 'text-foreground'
                                    : 'text-muted hover:text-foreground'
                            )}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
