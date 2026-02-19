import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
    className?: string;
    variant?: 'line' | 'circle' | 'card' | 'table-row';
    lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'line', lines = 1 }) => {
    if (variant === 'circle') {
        return <div className={cn('shimmer rounded-full', className)} />;
    }

    if (variant === 'card') {
        return (
            <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-2">
                        <div className="shimmer h-4 w-24 rounded-md" />
                        <div className="shimmer h-8 w-16 rounded-md" />
                    </div>
                    <div className="shimmer h-12 w-12 rounded-lg" />
                </div>
            </div>
        );
    }

    if (variant === 'table-row') {
        return (
            <tr className="border-b border-border">
                <td className="p-4"><div className="shimmer h-4 w-32 rounded-md" /></td>
                <td className="p-4"><div className="shimmer h-4 w-20 rounded-md" /></td>
                <td className="p-4"><div className="shimmer h-4 w-16 rounded-md" /></td>
                <td className="p-4"><div className="shimmer h-4 w-12 rounded-md" /></td>
                <td className="p-4"><div className="shimmer h-5 w-16 rounded-full" /></td>
                <td className="p-4 text-right"><div className="shimmer h-8 w-20 rounded-md ml-auto" /></td>
            </tr>
        );
    }

    // line variant
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'shimmer h-4 rounded-md',
                        i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
                    )}
                />
            ))}
        </div>
    );
};
