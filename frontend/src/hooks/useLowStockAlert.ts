import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productApi } from '../services/api';

/**
 * Polls the low-stock endpoint every 30 s.
 * Returns the current low-stock count (for badges).
 * Fires a toast notification whenever the count increases.
 */
export const useLowStockAlert = (): number => {
    const prevCountRef = useRef<number | null>(null);

    const { data: response } = useQuery({
        queryKey: ['products', 'low-stock'],
        queryFn: productApi.getLowStockProducts,
        refetchInterval: 30_000, // poll every 30 seconds
        staleTime: 20_000,
    });

    const count: number =
        (response?.data as any)?.totalElements ??
        (response?.data as any)?.content?.length ??
        0;

    useEffect(() => {
        if (prevCountRef.current === null) {
            // First load — store count silently, no alert
            prevCountRef.current = count;
            return;
        }

        if (count > prevCountRef.current) {
            const newItems = count - prevCountRef.current;
            toast(
                `⚠️ ${newItems} new low stock alert${newItems > 1 ? 's' : ''}! Go to Low Stock page.`,
                {
                    duration: 6000,
                    style: {
                        background: 'hsl(38 92% 50% / 0.15)',
                        color: 'hsl(38 92% 30%)',
                        border: '1px solid hsl(38 92% 50% / 0.4)',
                        fontWeight: '500',
                    },
                    icon: undefined,
                }
            );
        }

        prevCountRef.current = count;
    }, [count]);

    return count;
};
