import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    description?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    maxWidth = 'md'
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className={cn(
                "relative w-full rounded-xl bg-card border border-border shadow-2xl animate-scale-in",
                maxWidthClasses[maxWidth]
            )}>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border p-5">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};
