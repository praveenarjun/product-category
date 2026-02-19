import React from 'react';
import { cn } from '../../utils';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    pulse?: boolean;
}

const variantConfig: Record<BadgeVariant, { classes: string; dot: string }> = {
    default: {
        classes: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
        dot: "bg-blue-500",
    },
    secondary: {
        classes: "bg-secondary text-secondary-foreground border border-border",
        dot: "bg-muted-foreground",
    },
    outline: {
        classes: "text-foreground border border-border bg-background",
        dot: "bg-foreground",
    },
    destructive: {
        classes: "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20",
        dot: "bg-red-500",
    },
    success: {
        classes: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
        dot: "bg-emerald-500",
    },
    warning: {
        classes: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
        dot: "bg-amber-500",
    },
};

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', pulse = false, children, ...props }) => {
    const config = variantConfig[variant];

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                config.classes,
                className
            )}
            {...props}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", config.dot, pulse && "animate-pulse")} />
            {children}
        </div>
    );
};
