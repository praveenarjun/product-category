import { useState } from 'react';
import { AlertTriangle, Package, TrendingDown, RefreshCw } from 'lucide-react';
import { useLowStockProducts, useUpdateProduct } from '../hooks/useProducts';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/common/Table';
import { formatPrice } from '../utils';
import type { Product } from '../types';
import { Link } from 'react-router-dom';

const StockBar = ({ quantity, threshold = 10 }: { quantity: number; threshold?: number }) => {
    const pct = Math.min((quantity / threshold) * 100, 100);
    const color = quantity === 0 ? 'bg-red-500' : pct < 30 ? 'bg-amber-500' : 'bg-emerald-500';
    return (
        <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className={`text-xs font-medium w-6 text-right ${quantity === 0 ? 'text-destructive' : quantity < 5 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
                {quantity}
            </span>
        </div>
    );
};

export const LowStock = () => {
    const { data: response, isLoading } = useLowStockProducts();
    const updateMutation = useUpdateProduct();

    const [restockProduct, setRestockProduct] = useState<Product | null>(null);
    const [newQuantity, setNewQuantity] = useState('');

    // Low-stock API returns paginated response: { content: [...], totalElements, ... }
    const products: Product[] = response?.data?.content ?? [];
    const outOfStock = products.filter(p => p.quantity === 0);
    const criticallyLow = products.filter(p => p.quantity > 0 && p.quantity < 5);

    const handleRestock = () => {
        if (!restockProduct) return;
        const qty = parseInt(newQuantity);
        if (isNaN(qty) || qty < 0) return;

        updateMutation.mutate(
            { id: restockProduct.id, data: { quantity: qty } },
            {
                onSuccess: () => {
                    setRestockProduct(null);
                    setNewQuantity('');
                }
            }
        );
    };

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <h2 className="text-2xl font-bold tracking-tight">Low Stock</h2>
                </div>
                <p className="text-sm text-muted-foreground">Products requiring inventory attention</p>
            </div>

            {/* Alert Banner */}
            {!isLoading && products.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20">
                            <Package className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">Out of Stock</p>
                            <p className="text-xl font-bold text-red-700 dark:text-red-300">{outOfStock.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20">
                            <TrendingDown className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Critically Low (&lt;5)</p>
                            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{criticallyLow.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20">
                            <AlertTriangle className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Low Stock</p>
                            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{products.length}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} variant="table-row" />
                            ))
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                                            <Package className="h-8 w-8 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">All stocked up!</p>
                                            <p className="text-sm text-muted-foreground">No products are currently low on stock</p>
                                        </div>
                                        <Link to="/products">
                                            <Button variant="outline" size="sm">View All Products</Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className={product.quantity === 0 ? 'bg-red-500/5' : product.quantity < 5 ? 'bg-amber-500/5' : ''}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold border
                                                ${product.quantity === 0 ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                                                {product.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <Link to={`/products/${product.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                                                    {product.name}
                                                </Link>
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
                                        <StockBar quantity={product.quantity} />
                                    </TableCell>
                                    <TableCell>
                                        {product.quantity === 0 ? (
                                            <Badge variant="destructive" pulse>OUT OF STOCK</Badge>
                                        ) : product.quantity < 5 ? (
                                            <Badge variant="warning" pulse>CRITICAL</Badge>
                                        ) : (
                                            <Badge variant="warning">LOW</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setRestockProduct(product);
                                                setNewQuantity(String(product.quantity));
                                            }}
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Restock
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Restock Modal */}
            <Modal
                isOpen={!!restockProduct}
                onClose={() => setRestockProduct(null)}
                title={`Restock: ${restockProduct?.name}`}
                description="Update the inventory quantity for this product."
            >
                <div className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                        <span className="text-muted-foreground">Current stock: </span>
                        <span className={`font-semibold ${restockProduct?.quantity === 0 ? 'text-destructive' : 'text-amber-600'}`}>
                            {restockProduct?.quantity} units
                        </span>
                    </div>
                    <Input
                        label="New Quantity"
                        type="number"
                        min={0}
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        hint="Enter the updated inventory count"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setRestockProduct(null)}>Cancel</Button>
                        <Button onClick={handleRestock} isLoading={updateMutation.isPending}>
                            <RefreshCw className="h-4 w-4" />
                            Update Stock
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
