import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements?: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalElements,
    pageSize = 10,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i);
        }
        pages.push(0);
        if (currentPage > 3) pages.push('ellipsis');
        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages - 2, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 4) pages.push('ellipsis');
        pages.push(totalPages - 1);
        return pages;
    };

    const from = totalElements ? currentPage * pageSize + 1 : null;
    const to = totalElements ? Math.min((currentPage + 1) * pageSize, totalElements) : null;

    return (
        <div className="flex flex-col gap-2 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            {totalElements != null && (
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{from}</span>–<span className="font-medium text-foreground">{to}</span> of{' '}
                    <span className="font-medium text-foreground">{totalElements}</span> results
                </p>
            )}
            {totalElements == null && (
                <p className="text-sm text-muted-foreground">
                    Page <span className="font-medium text-foreground">{currentPage + 1}</span> of{' '}
                    <span className="font-medium text-foreground">{totalPages}</span>
                </p>
            )}

            <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {getPageNumbers().map((page, i) =>
                    page === 'ellipsis' ? (
                        <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-all duration-150",
                                currentPage === page
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            {page + 1}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </nav>
        </div>
    );
};
