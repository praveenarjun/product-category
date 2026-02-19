import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: { value: number; isPositive: boolean; label?: string };
    className?: string;
    iconColor?: string;
    isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon: Icon,
    trend,
    className,
    iconColor = "from-blue-500 to-indigo-600",
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="shimmer h-3 w-24 rounded-md" />
                        <div className="shimmer h-8 w-16 rounded-md" />
                    </div>
                    <div className="shimmer h-12 w-12 rounded-xl" />
                </div>
                <div className="mt-4 shimmer h-3 w-32 rounded-md" />
            </div>
        );
    }

    return (
        <div className={cn(
            "group rounded-xl border border-border bg-card p-6 transition-all duration-200",
            "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20",
            className
        )}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <h3 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {value}
                    </h3>
                </div>
                <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-200 group-hover:scale-110",
                    iconColor
                )}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-1.5 text-xs">
                    {trend.isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={trend.isPositive ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                        {trend.value > 0 ? '+' : ''}{trend.value}%
                    </span>
                    <span className="text-muted-foreground">{trend.label || 'from last month'}</span>
                </div>
            )}
        </div>
    );
};
