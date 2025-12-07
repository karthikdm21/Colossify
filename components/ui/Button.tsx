import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'pill';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    {
                        'bg-accent text-white hover:bg-accent-hover hover:scale-105 shadow-lg':
                            variant === 'primary',
                        'border border-card-border bg-card-bg text-foreground hover:bg-muted/10':
                            variant === 'secondary',
                        'bg-card-bg text-foreground hover:bg-muted/20 rounded-full border border-card-border':
                            variant === 'pill',
                    },
                    {
                        'px-3 py-1.5 text-sm rounded-lg': size === 'sm',
                        'px-6 py-3 text-base rounded-xl': size === 'md',
                        'px-8 py-4 text-lg rounded-2xl': size === 'lg',
                    },
                    variant === 'pill' && 'px-4 py-2 text-sm',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
