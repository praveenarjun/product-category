import React from 'react';
import { cn } from '../../utils';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    containerClassName?: string;
}

export const Table: React.FC<TableProps> = ({ className, containerClassName, children, ...props }) => {
    return (
        <div className={cn("relative w-full overflow-auto", containerClassName)}>
            <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
                {children}
            </table>
        </div>
    );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
    <thead className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, ...props }) => (
    <tr
        className={cn(
            "border-b border-border transition-colors duration-150",
            "hover:bg-primary/5 cursor-default",
            "data-[state=selected]:bg-primary/10",
            className
        )}
        {...props}
    />
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
    <th
        className={cn(
            "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground",
            "[&:has([role=checkbox])]:pr-0",
            "bg-muted/40",
            className
        )}
        {...props}
    />
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
    <td className={cn("px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
);
