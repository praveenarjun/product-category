import { useQuery } from '@tanstack/react-query';
import { Package, AlertTriangle, CheckCircle, Tag, Clock } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { StatCard } from '../components/dashboard/StatCard';
import { Badge } from '../components/common/Badge';
import { productApi, categoryApi } from '../services/api';
import { ProductStatus } from '../types';
import { formatPrice, formatDate } from '../utils';
import { Link } from 'react-router-dom';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-sm">
                <p className="font-medium text-foreground">{label}</p>
                <p className="text-primary">{payload[0].value} products</p>
            </div>
        );
    }
    return null;
};

export const Dashboard = () => {
    const { data: productsData, isLoading: loadingProducts } = useQuery({
        queryKey: ['dashboard-products'],
        queryFn: () => productApi.getProducts({ page: 0, size: 100 }),
    });

    const { data: lowStockData } = useQuery({
        queryKey: ['products', 'low-stock'],
        queryFn: productApi.getLowStockProducts,
    });

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.getCategories,
    });

    const { data: recentData } = useQuery({
        queryKey: ['dashboard-recent'],
        queryFn: () => productApi.getProducts({ page: 0, size: 5, sortBy: 'createdAt', direction: 'desc' }),
    });

    const allProducts = productsData?.data?.content || [];
    const totalProducts = productsData?.data?.totalElements || 0;
    const activeProducts = allProducts.filter(p => p.status === ProductStatus.ACTIVE).length;
    const lowStockCount = (lowStockData?.data as any)?.totalElements ?? (lowStockData?.data as any)?.content?.length ?? 0;
    const totalCategories = Array.isArray(categoriesData?.data) ? (categoriesData?.data as any[]).length : 0;

    const statusCounts = [
        ProductStatus.ACTIVE, ProductStatus.DRAFT,
        ProductStatus.INACTIVE, ProductStatus.ARCHIVED
    ].map(status => ({
        name: status.charAt(0) + status.slice(1).toLowerCase(),
        value: allProducts.filter(p => p.status === status).length,
    })).filter(s => s.value > 0);

    const categoryMap = new Map<string, number>();
    allProducts.forEach(p => {
        const cat = p.categoryName || 'Uncategorized';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
    const categoryData = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    const recentProducts = recentData?.data?.content || [];
    const isLoading = loadingProducts;

    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{greeting} 👋</h2>
                <p className="mt-1 text-muted-foreground">
                    {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total Products"
                    value={totalProducts}
                    icon={Package}
                    iconColor="from-blue-500 to-indigo-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Active Products"
                    value={activeProducts}
                    icon={CheckCircle}
                    iconColor="from-emerald-500 to-teal-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Low Stock Alerts"
                    value={lowStockCount}
                    icon={AlertTriangle}
                    iconColor="from-amber-500 to-orange-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Categories"
                    value={totalCategories}
                    icon={Tag}
                    iconColor="from-purple-500 to-pink-600"
                    isLoading={isLoading}
                />
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Bar Chart */}
                <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-1 text-sm font-semibold text-foreground">Products by Category</h3>
                    <p className="mb-4 text-xs text-muted-foreground">Distribution across all categories</p>
                    {isLoading ? (
                        <div className="h-[260px] flex items-center justify-center">
                            <div className="shimmer h-full w-full rounded-lg" />
                        </div>
                    ) : categoryData.length === 0 ? (
                        <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                            No data available
                        </div>
                    ) : (
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="count" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} />
                                    <defs>
                                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-1 text-sm font-semibold text-foreground">Status Breakdown</h3>
                    <p className="mb-4 text-xs text-muted-foreground">Products by status</p>
                    {isLoading ? (
                        <div className="h-[260px] flex items-center justify-center">
                            <div className="shimmer h-full w-full rounded-lg" />
                        </div>
                    ) : statusCounts.length === 0 ? (
                        <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                            No data available
                        </div>
                    ) : (
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusCounts}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {statusCounts.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(val) => [val, 'Products']} />
                                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Products */}
            <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Recent Products
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Latest additions to the catalog</p>
                    </div>
                    <Link to="/products" className="text-xs font-medium text-primary hover:underline">
                        View all →
                    </Link>
                </div>
                <div className="divide-y divide-border">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-3">
                                <div className="shimmer h-9 w-9 rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="shimmer h-3.5 w-40 rounded" />
                                    <div className="shimmer h-3 w-24 rounded" />
                                </div>
                                <div className="shimmer h-3.5 w-16 rounded" />
                            </div>
                        ))
                    ) : recentProducts.length === 0 ? (
                        <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                            No products yet. <Link to="/products/new" className="text-primary hover:underline">Add your first product →</Link>
                        </div>
                    ) : (
                        recentProducts.map(product => (
                            <Link key={product.id} to={`/products/${product.id}`}
                                className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/50 group">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-sm font-bold text-primary border border-primary/10">
                                    {product.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.categoryName || 'Uncategorized'} · {formatDate(product.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</span>
                                    <Badge variant={product.status === ProductStatus.ACTIVE ? 'success' : 'secondary'}>
                                        {product.status}
                                    </Badge>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
