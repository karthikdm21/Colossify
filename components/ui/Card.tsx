import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hover?: boolean;
}

export function Card({ className, children, hover = true, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-card-bg border border-card-border rounded-2xl p-6',
                'shadow-lg shadow-black/20',
                hover && 'hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
