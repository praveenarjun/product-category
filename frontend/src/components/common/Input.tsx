import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, icon: Icon, iconPosition = 'left', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && iconPosition === 'left' && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    {Icon && iconPosition === 'right' && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-all duration-200",
                            "placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-primary/50",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            Icon && iconPosition === 'left' && "pl-9",
                            Icon && iconPosition === 'right' && "pr-9",
                            error && "border-destructive focus:ring-destructive/30 focus:border-destructive",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                        <span className="h-1 w-1 rounded-full bg-destructive" />
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
