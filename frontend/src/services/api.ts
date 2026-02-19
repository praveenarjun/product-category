import axios from 'axios';
import { type Product, type ApiResponse, type ProductFilterParams, type PaginatedResponse, ProductStatus, type DashboardStats, type Category } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productApi = {
    getProducts: async (params: ProductFilterParams) => {
        const response = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products/filter', { params });
        return response.data;
    },

    getProduct: async (id: number) => {
        const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
        return response.data;
    },

    getProductBySku: async (sku: string) => {
        const response = await api.get<ApiResponse<Product>>(`/products/sku/${sku}`);
        return response.data;
    },

    createProduct: async (product: Partial<Product>) => {
        const response = await api.post<ApiResponse<Product>>('/products', product);
        return response.data;
    },

    updateProduct: async (id: number, product: Partial<Product>) => {
        const response = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
        return response.data;
    },

    updateStatus: async (id: number, status: ProductStatus) => {
        const response = await api.patch<ApiResponse<Product>>(`/products/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    deleteProduct: async (id: number) => {
        const response = await api.delete<ApiResponse<void>>(`/products/${id}`);
        return response.data;
    },

    getFeaturedProducts: async () => {
        const response = await api.get<ApiResponse<Product[]>>('/products/featured');
        return response.data;
    },

    getLowStockProducts: async () => {
        const response = await api.get<ApiResponse<Product[]>>('/products/low-stock');
        return response.data;
    },
};

export const categoryApi = {
    getCategories: async () => {
        const response = await api.get<ApiResponse<Category[]>>('/categories');
        return response.data;
    },

    createCategory: async (category: Partial<Category>) => {
        const response = await api.post<ApiResponse<Category>>('/categories', category);
        return response.data;
    }
};

export const statsApi = {
    // Simulate dashboard stats since backend endpoint is missing for aggregated stats
    // In a real app, you'd add GET /api/v1/dashboard/stats
    getDashboardStats: async (): Promise<DashboardStats> => {
        // Fetch all products to calculate stats client-side or use separate endpoints
        // This is a placeholder implementation
        return {
            totalProducts: 0,
            activeProducts: 0,
            lowStockCount: 0,
            totalCategories: 0,
            productsByStatus: [],
            productsByCategory: [],
            recentProducts: []
        };
    }
};
