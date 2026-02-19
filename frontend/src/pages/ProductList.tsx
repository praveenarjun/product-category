import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Filter, Package } from 'lucide-react';
import { useProducts, useDeleteProduct, useCategories } from '../hooks/useProducts';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { formatPrice } from '../utils';
import { ProductStatus } from '../types';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export const ProductList = () => {
    const [page, setPage] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [status, setStatus] = useState<ProductStatus | undefined>();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteName, setDeleteName] = useState('');

    const search = useDebounce(searchInput, 300);

    const { data: apiResponse, isLoading } = useProducts({ page, size: 10, search, categoryId, status });
    const productsData = apiResponse?.data;
    const { data: categoriesResponse } = useCategories();
    const categories = categoriesResponse?.data || [];
    const deleteMutation = useDeleteProduct();

    const handleDelete = useCallback(() => {
        if (deleteId) {
            deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }
    }, [deleteId, deleteMutation]);

    const statusVariant = (s: ProductStatus) => {
        switch (s) {
            case ProductStatus.ACTIVE: return 'success';
            case ProductStatus.DRAFT: return 'warning';
            case ProductStatus.ARCHIVED: return 'secondary';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {productsData ? `${productsData.totalElements} products in your catalog` : 'Manage your product catalog'}
                    </p>
                </div>
                <Link to="/products/new">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden md:block" />
                <div className="flex-1">
                    <Input
                        placeholder="Search by name, SKU, or brand..."
                        value={searchInput}
                        onChange={(e) => { setSearchInput(e.target.value); setPage(0); }}
                        icon={Search}
                        iconPosition="left"
                    />
                </div>
                <div className="w-full md:w-44">
                    <Select
                        options={[
                            { value: '', label: 'All Categories' },
                            ...categories.map(c => ({ value: c.id, label: c.name }))
                        ]}
                        value={categoryId || ''}
                        onChange={(e) => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
                    />
                </div>
                <div className="w-full md:w-36">
                    <Select
                        options={[
                            { value: '', label: 'All Status' },
                            { value: ProductStatus.ACTIVE, label: 'Active' },
                            { value: ProductStatus.DRAFT, label: 'Draft' },
                            { value: ProductStatus.INACTIVE, label: 'Inactive' },
                            { value: ProductStatus.ARCHIVED, label: 'Archived' },
                        ]}
                        value={status || ''}
                        onChange={(e) => { setStatus(e.target.value ? e.target.value as ProductStatus : undefined); setPage(0); }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} variant="table-row" />
                            ))
                        ) : !productsData?.content?.length ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <Package className="h-10 w-10 opacity-30" />
                                        <div>
                                            <p className="font-medium">No products found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                        <Link to="/products/new">
                                            <Button size="sm" variant="outline">Add your first product</Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            productsData.content.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-sm font-bold text-primary border border-primary/10">
                                                {product.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground leading-tight">{product.name}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">{product.categoryName || 'Uncategorized'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-sm font-medium ${product.quantity === 0 ? 'text-destructive' : product.lowStock ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
                                            {product.quantity}
                                            {product.lowStock && product.quantity > 0 && <span className="ml-1 text-xs text-muted-foreground">⚠️</span>}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(product.status)} pulse={product.quantity === 0}>
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link to={`/products/${product.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </Link>
                                            <Link to={`/products/${product.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => { setDeleteId(product.id); setDeleteName(product.name); }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {productsData && productsData.totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={productsData.totalPages}
                        totalElements={productsData.totalElements}
                        pageSize={10}
                        onPageChange={setPage}
                    />
                )}
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Product"
                description="This action cannot be undone."
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteName}"</span>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} isLoading={deleteMutation.isPending}>
                            Delete Product
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
