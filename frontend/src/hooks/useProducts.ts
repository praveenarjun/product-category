import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi } from '../services/api';
import { type ProductFilterParams, type Product, type ProductStatus } from '../types';
import toast from 'react-hot-toast';

export const useProducts = (params: ProductFilterParams) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productApi.getProducts(params),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProduct(id),
        enabled: !!id,
    });
};

export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: productApi.getFeaturedProducts,
    });
};

export const useLowStockProducts = () => {
    return useQuery({
        queryKey: ['products', 'low-stock'],
        queryFn: productApi.getLowStockProducts,
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.getCategories,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: Partial<Product>) => productApi.createProduct(product),
        onSuccess: () => {
            toast.success('Product created successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-recent'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create product');
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
            productApi.updateProduct(id, data),
        onSuccess: (_, variables) => {
            toast.success('Product updated successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-recent'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
        },
    });
};

export const useUpdateProductStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: ProductStatus }) =>
            productApi.updateStatus(id, status),
        onSuccess: (_, variables) => {
            toast.success(`Product status updated to ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-products'] });
        },
        onError: () => {
            toast.error('Failed to update status');
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => productApi.deleteProduct(id),
        onSuccess: () => {
            toast.success('Product deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-recent'] });
        },
        onError: () => {
            toast.error('Failed to delete product');
        },
    });
};
