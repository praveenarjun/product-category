import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Package, DollarSign, FileText } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
// Select is rendered via native <select> inside Controller — no custom component needed
import { useProduct, useCreateProduct, useUpdateProduct, useCategories } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { ProductStatus, type ApiResponse, type Category, type Product } from '../types';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    sku: z.string().regex(/^[A-Z]{2,4}-[A-Z]{2,4}-[A-Z0-9]{2,5}$/, 'Invalid SKU format (e.g., ELEC-PHN-IP15)'),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    // z.preprocess keeps output typed as number (z.coerce infers unknown in v4)
    price: z.preprocess(Number, z.number().min(0.01, 'Price must be greater than 0')),
    quantity: z.preprocess(Number, z.number().int().min(0, 'Quantity cannot be negative')),
    categoryId: z.preprocess(Number, z.number().min(1, 'Please select a category')),
    status: z.string().min(1, 'Status is required'),
    brand: z.string().optional(),
    featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    // Only fetch product if we are editing (id is defined)
    const { data: productResponse, isLoading: isLoadingProduct } = useProduct(Number(id));
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useCategories();

    // Categories may be wrapped in ApiResponse or returned directly depending on hook version
    const categoryList: Category[] = (() => {
        if (!categoriesResponse) return [];
        // If it's an ApiResponse wrapper
        if (typeof categoriesResponse === 'object' && 'data' in categoriesResponse) {
            return (categoriesResponse as ApiResponse<Category[]>).data ?? [];
        }
        // If it's already an array
        if (Array.isArray(categoriesResponse)) return categoriesResponse;
        return [];
    })();

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            sku: '',
            description: '',
            price: undefined,
            quantity: undefined,
            categoryId: undefined,
            status: 'ACTIVE',
            brand: '',
            featured: false,
        }
    });

    const product = productResponse?.data;

    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                sku: product.sku,
                description: product.description ?? '',
                shortDescription: product.shortDescription ?? '',
                price: product.price,
                quantity: product.quantity,
                categoryId: product.categoryId,
                status: product.status ?? 'ACTIVE',
                brand: product.brand ?? '',
                featured: product.featured,
            });
        }
    }, [product, reset]);

    const onSubmit = (data: ProductFormData) => {
        const payload: Partial<Product> = { ...data, status: data.status as ProductStatus };
        if (isEdit) {
            updateMutation.mutate({ id: Number(id), data: payload }, {
                onSuccess: () => navigate('/products')
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => navigate('/products')
            });
        }
    };

    if (isEdit && isLoadingProduct) {
        return (
            <div className="space-y-6 max-w-2xl mx-auto animate-slide-up">
                <div className="flex items-center gap-4">
                    <div className="shimmer h-9 w-9 rounded-lg" />
                    <div className="space-y-2">
                        <div className="shimmer h-5 w-36 rounded" />
                        <div className="shimmer h-3.5 w-24 rounded" />
                    </div>
                </div>
                <div className="shimmer rounded-xl h-96" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-slide-up">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEdit ? 'Edit Product' : 'Create Product'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {isEdit ? 'Update product details' : 'Add a new product to your catalog'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Basic Info section */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                            label="Product Name *"
                            placeholder="e.g. iPhone 15 Pro"
                            {...register('name')}
                            error={errors.name?.message}
                        />
                        <Input
                            label="SKU *"
                            placeholder="e.g. ELEC-PHN-IP15"
                            {...register('sku')}
                            error={errors.sku?.message}
                            disabled={isEdit}
                            hint={isEdit ? 'SKU cannot be changed after creation' : 'Format: XX-XXX-XXXXX'}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                            label="Brand"
                            placeholder="e.g. Apple"
                            {...register('brand')}
                            error={errors.brand?.message}
                        />
                        {/* Category dropdown */}
                        <div className="w-full">
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Category *
                            </label>
                            {isCategoriesLoading ? (
                                <div className="shimmer h-10 w-full rounded-md" />
                            ) : (
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">— Select a category —</option>
                                            {categoryList.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    )}
                                />
                            )}
                            {errors.categoryId && (
                                <p className="mt-1 text-sm text-destructive">{errors.categoryId.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pricing & Inventory section */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Pricing & Inventory</h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <Input
                            label="Price *"
                            type="number"
                            step="0.01"
                            min={0}
                            placeholder="0.00"
                            {...register('price', { valueAsNumber: true })}
                            error={errors.price?.message}
                        />
                        <Input
                            label="Stock Quantity *"
                            type="number"
                            min={0}
                            placeholder="0"
                            {...register('quantity', { valueAsNumber: true })}
                            error={errors.quantity?.message}
                        />
                        <div className="w-full">
                            <label className="mb-2 block text-sm font-medium text-foreground">Status *</label>
                            <select
                                {...register('status')}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="ACTIVE">✅ Active</option>
                                <option value="DRAFT">📝 Draft</option>
                                <option value="INACTIVE">⏸ Inactive</option>
                                <option value="ARCHIVED">🗄 Archived</option>
                            </select>
                            {errors.status && <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Description section */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Description</h3>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Short Description</label>
                        <textarea
                            {...register('shortDescription')}
                            placeholder="Brief one-liner summary of the product..."
                            className="flex min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Full Description</label>
                        <textarea
                            {...register('description')}
                            placeholder="Detailed product description, features, and specifications..."
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-muted/40 border border-border px-4 py-3">
                        <input
                            type="checkbox"
                            id="featured"
                            {...register('featured')}
                            className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
                        />
                        <div>
                            <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                                Mark as Featured Product
                            </label>
                            <p className="text-xs text-muted-foreground">Featured products appear on the Featured Products page</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pb-6">
                    <Link to="/products">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                        <Save className="h-4 w-4" />
                        {isEdit ? 'Save Changes' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
