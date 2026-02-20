import { Link } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';
import { useFeaturedProducts } from '../hooks/useProducts';
import { Badge } from '../components/common/Badge';
import { formatPrice } from '../utils';
import { ProductStatus, type Product } from '../types';
import { Button } from '../components/common/Button';

const gradients = [
    'from-blue-500/20 to-indigo-500/20',
    'from-emerald-500/20 to-teal-500/20',
    'from-purple-500/20 to-pink-500/20',
    'from-amber-500/20 to-orange-500/20',
    'from-rose-500/20 to-red-500/20',
    'from-cyan-500/20 to-sky-500/20',
];

const textGradients = [
    'text-blue-700 dark:text-blue-400',
    'text-emerald-700 dark:text-emerald-400',
    'text-purple-700 dark:text-purple-400',
    'text-amber-700 dark:text-amber-400',
    'text-rose-700 dark:text-rose-400',
    'text-cyan-700 dark:text-cyan-400',
];

export const FeaturedProducts = () => {
    const { data: response, isLoading } = useFeaturedProducts();
    // getFeaturedProducts returns paginated response: { content: [...], totalElements, ... }
    const products: Product[] = response?.data?.content ?? [];

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
                </div>
                <p className="text-sm text-muted-foreground">Handpicked products highlighted for customers</p>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="shimmer h-44 w-full" />
                            <div className="p-4 space-y-2">
                                <div className="shimmer h-4 w-3/4 rounded-md" />
                                <div className="shimmer h-3.5 w-1/2 rounded-md" />
                                <div className="shimmer h-6 w-1/3 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-24 text-center">
                    <Star className="h-12 w-12 text-muted-foreground/30" />
                    <div>
                        <p className="font-semibold text-foreground">No featured products</p>
                        <p className="mt-1 text-sm text-muted-foreground">Mark products as featured to see them here</p>
                    </div>
                    <Link to="/products">
                        <Button variant="outline" size="sm">Browse Products</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product, index) => {
                        const grad = gradients[index % gradients.length];
                        const textColor = textGradients[index % textGradients.length];

                        return (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20"
                            >
                                {/* Image or gradient placeholder */}
                                {product.imageUrls && product.imageUrls.length > 0 ? (
                                    <img
                                        src={product.imageUrls[0]}
                                        alt={product.name}
                                        className="h-44 w-full object-cover"
                                    />
                                ) : (
                                    <div className={`relative h-44 w-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
                                        <span className={`text-6xl font-black ${textColor} opacity-60 select-none`}>
                                            {product.name.charAt(0).toUpperCase()}
                                        </span>
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-200">
                                            <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-black/80 px-4 py-1.5 text-xs font-semibold shadow-lg">
                                                <ExternalLink className="h-3 w-3" />
                                                View Details
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <Badge variant={product.status === ProductStatus.ACTIVE ? 'success' : 'secondary'}>
                                            {product.status}
                                        </Badge>
                                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                                    </div>
                                    <h3 className="font-semibold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                        {product.shortDescription || product.description || `${product.categoryName || 'Product'} by ${product.brand || 'Unknown'}`}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
                                        <span className="text-xs text-muted-foreground">{product.categoryName}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Summary */}
            {!isLoading && products.length > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-muted/40 border border-border px-4 py-3 text-sm text-muted-foreground">
                    <span>Showing <span className="font-medium text-foreground">{products.length}</span> featured products</span>
                    <Link to="/products" className="text-primary hover:underline font-medium text-sm">
                        View all products →
                    </Link>
                </div>
            )}
        </div>
    );
};
