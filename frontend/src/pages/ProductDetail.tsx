import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Package, Edit, Trash2, ArrowLeft, Tag,
    DollarSign, Hash, BarChart2, Calendar, Star
} from 'lucide-react';
import { useProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatPrice, formatDate } from '../utils';
import { ProductStatus } from '../types';
import { useState } from 'react';

const statusVariant = (s: ProductStatus) => {
    switch (s) {
        case ProductStatus.ACTIVE: return 'success';
        case ProductStatus.DRAFT: return 'warning';
        case ProductStatus.ARCHIVED: return 'secondary';
        default: return 'secondary';
    }
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-3.5 border-b border-border last:border-0">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-muted">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
        </div>
    </div>
);

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data: response, isLoading } = useProduct(Number(id));
    const deleteMutation = useDeleteProduct();

    const product = response?.data;

    const handleDelete = () => {
        if (product) {
            deleteMutation.mutate(product.id, {
                onSuccess: () => {
                    navigate('/products');
                }
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-slide-up">
                <div className="flex items-center gap-3">
                    <div className="shimmer h-9 w-9 rounded-lg" />
                    <div className="space-y-2">
                        <div className="shimmer h-5 w-48 rounded-md" />
                        <div className="shimmer h-3.5 w-32 rounded-md" />
                    </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 shimmer rounded-xl h-80" />
                    <div className="shimmer rounded-xl h-80" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
                <Package className="h-16 w-16 text-muted-foreground/30" />
                <div>
                    <p className="text-lg font-semibold text-foreground">Product not found</p>
                    <p className="text-sm text-muted-foreground">This product may have been deleted</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/products')}>
                    <ArrowLeft className="h-4 w-4" /> Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Back + Actions header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                </button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/products/${product.id}/edit`)}>
                        <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                        <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header card */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex items-start gap-5">
                            {/* Image / Avatar */}
                            {product.imageUrls && product.imageUrls.length > 0 ? (
                                <img
                                    src={product.imageUrls[0]}
                                    alt={product.name}
                                    className="h-24 w-24 flex-shrink-0 rounded-xl object-cover border border-border"
                                />
                            ) : (
                                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 border border-primary/10 text-3xl font-bold text-primary">
                                    {product.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <Badge variant={statusVariant(product.status)}>
                                        {product.status}
                                    </Badge>
                                    {product.featured && (
                                        <Badge variant="default">
                                            <Star className="h-2.5 w-2.5" /> Featured
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-foreground leading-tight">{product.name}</h1>
                                <p className="mt-1 text-sm text-muted-foreground font-mono">{product.sku}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{product.brand}</p>
                            </div>
                        </div>

                        {product.description && (
                            <div className="mt-5 pt-5 border-t border-border">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</p>
                                <p className="text-sm text-foreground leading-relaxed">{product.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Details grid */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-1">Product Details</h3>
                        <p className="text-xs text-muted-foreground mb-4">Pricing, inventory, and classification</p>
                        <InfoRow icon={DollarSign} label="Price" value={
                            <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
                        } />
                        <InfoRow icon={BarChart2} label="Stock Quantity" value={
                            <span className={product.quantity === 0 ? 'text-destructive' : product.lowStock ? 'text-amber-600' : 'text-foreground'}>
                                {product.quantity} units{product.lowStock ? ' ⚠️ Low Stock' : ''}
                            </span>
                        } />
                        <InfoRow icon={Tag} label="Category" value={product.categoryName || 'Uncategorized'} />
                        <InfoRow icon={Hash} label="SKU" value={<span className="font-mono text-xs">{product.sku}</span>} />
                    </div>
                </div>

                {/* Sidebar / System Info */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-1">System Info</h3>
                        <p className="text-xs text-muted-foreground mb-4">Metadata and timestamps</p>
                        <InfoRow icon={Hash} label="Product ID" value={<span className="font-mono text-xs">#{product.id}</span>} />
                        <InfoRow icon={Calendar} label="Created" value={formatDate(product.createdAt)} />
                        <InfoRow icon={Calendar} label="Last Updated" value={formatDate(product.updatedAt)} />
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                        <p className="text-xs text-muted-foreground text-center">
                            Product part of <span className="font-semibold text-foreground">{product.categoryName || 'General'}</span> category
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Product"
                description="This action cannot be undone."
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">"{product.name}"</span>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} isLoading={deleteMutation.isPending}>
                            Delete Product
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
