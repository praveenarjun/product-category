export interface Product {
    id: number;
    sku: string;
    name: string;
    description?: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    discountPercentage?: number;
    status: ProductStatus;
    quantity: number;
    inStock: boolean;
    lowStock: boolean;
    brand?: string;
    weightGrams?: number;
    tags?: string[];
    imageUrls?: string[];
    categoryName?: string;
    categoryId?: number;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export const ProductStatus = {
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    ARCHIVED: 'ARCHIVED',
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface ProductFilterParams {
    page?: number;
    size?: number;
    search?: string;
    categoryId?: number;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: ProductStatus;
    inStock?: boolean;
    featured?: boolean;
    sortBy?: string;
    direction?: 'asc' | 'desc';
}

export interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    lowStockCount: number;
    totalCategories: number;
    productsByStatus: { status: string; count: number }[];
    productsByCategory: { category: string; count: number }[];
    recentProducts: Product[];
}
