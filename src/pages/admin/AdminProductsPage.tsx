import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../features/auth/admin/admin.api';
import { formatPrice } from '../../lib/utils';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '../../types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const variantSchema = z.object({
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
  stock: z.preprocess((val) => Number(val), z.number().min(0)),
  colorId: z.preprocess((val) => Number(val), z.number().min(1, 'Color required')),
  imageUrl: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(1, 'Price required')),
  category: z.enum(['TSHIRT', 'SWEATSHIRT', 'JACKET', 'PANTS', 'SHOES']),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']),
  isActive: z.boolean(),
  variants: z.array(variantSchema).min(1, 'At least one variant required'),
});

type ProductForm = z.infer<typeof productSchema>;

// ─── Modal crear/editar ───────────────────────────────────────────────────────

function ProductModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const queryClient = useQueryClient();
  const isEditing = !!product;

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: isEditing
      ? {
          name: product.name,
          description: product.description ?? '',
          price: Number(product.price),
          category: product.category,
          gender: product.gender,
          isActive: product.isActive,
          variants: product.variants.map((v) => ({
            size: v.size,
            stock: v.stock,
            colorId: v.colorId,
            imageUrl: v.imageUrl ?? '',
          })),
        }
      : {
          isActive: true,
          variants: [{ size: 'M', stock: 0, colorId: 1, imageUrl: '' }],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  const mutation = useMutation({
    mutationFn: (data: ProductForm) =>
      isEditing ? adminApi.updateProduct(product.id, data) : adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onClose();
    },
  });

  const inputClass = 'border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors w-full';
  const labelClass = 'text-[10px] uppercase tracking-widest text-muted-foreground';
  const selectClass = 'border-b border-border bg-background pb-2 text-sm text-foreground focus:border-foreground focus:outline-none w-full';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background p-8">

        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-xl text-foreground">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-6">

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Name</label>
            <input {...register('name')} className={inputClass} placeholder="Product name" />
            {errors.name && <span className="text-[10px] text-red-500">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Description</label>
            <textarea
              {...register('description')}
              rows={2}
              className="border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none resize-none w-full"
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Price</label>
              <input {...register('price')} type="number" step="0.01" className={inputClass} placeholder="0.00" />
              {errors.price && <span className="text-[10px] text-red-500">{errors.price.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Category</label>
              <select {...register('category')} className={selectClass}>
                <option value="TSHIRT">T-Shirt</option>
                <option value="SWEATSHIRT">Sweatshirt</option>
                <option value="JACKET">Jacket</option>
                <option value="PANTS">Pants</option>
                <option value="SHOES">Shoes</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Gender</label>
              <select {...register('gender')} className={selectClass}>
                <option value="UNISEX">Unisex</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input {...register('isActive')} type="checkbox" id="isActive" className="h-4 w-4" />
            <label htmlFor="isActive" className={labelClass}>Active</label>
          </div>

          {/* Variants */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className={labelClass}>Variants</span>
              <button
                type="button"
                onClick={() => append({ size: 'M', stock: 0, colorId: 1, imageUrl: '' })}
                className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-foreground hover:opacity-60"
              >
                <Plus className="h-3 w-3" strokeWidth={1.5} />
                Add
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-4 gap-3 border-b border-border pb-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Size</label>
                  <select {...register(`variants.${index}.size`)} className={selectClass}>
                    {['XS','S','M','L','XL','XXL'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Stock</label>
                  <input {...register(`variants.${index}.stock`)} type="number" className={inputClass} placeholder="0" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Color ID</label>
                  <input {...register(`variants.${index}.colorId`)} type="number" className={inputClass} placeholder="1" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Image URL</label>
                  <div className="flex items-end gap-2">
                    <input {...register(`variants.${index}.imageUrl`)} className={inputClass} placeholder="https://..." />
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="mb-2">
                        <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {errors.variants && (
              <span className="text-[10px] text-red-500">{errors.variants.message}</span>
            )}
          </div>

          {mutation.isError && (
            <p className="text-[11px] text-red-500">Something went wrong. Try again.</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-foreground py-3.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75 disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
          </button>

        </form>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => adminApi.getProducts({ page, limit: 20 }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">Products</h1>
        <button
          onClick={() => { setEditingProduct(undefined); setModalOpen(true); }}
          className="flex items-center gap-2 bg-foreground px-5 py-2.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          New Product
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && data && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  {['Name', 'Category', 'Price', 'Variants', 'Status', ''].map((h) => (
                    <th key={h} className="pb-3 pr-6 text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.map((product) => (
                  <tr key={product.id} className="border-b border-border transition-colors hover:bg-card">
                    <td className="py-4 pr-6 text-sm text-foreground">{product.name}</td>
                    <td className="py-4 pr-6 text-xs text-muted-foreground capitalize">
                      {product.category.toLowerCase()}
                    </td>
                    <td className="py-4 pr-6 text-sm text-foreground">{formatPrice(product.price)}</td>
                    <td className="py-4 pr-6 text-xs text-muted-foreground">{product.variants.length}</td>
                    <td className="py-4 pr-6">
                      <span className={`text-[10px] uppercase tracking-widest ${product.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setEditingProduct(product); setModalOpen(true); }}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${product.name}"?`)) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                          className="text-muted-foreground transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.meta.lastPage > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center border border-border text-xs transition-colors hover:bg-foreground hover:text-background disabled:opacity-30"
              >‹</button>
              {Array.from({ length: data.meta.lastPage }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 text-xs transition-colors ${page === i + 1 ? 'bg-foreground text-background' : 'border border-border hover:bg-foreground hover:text-background'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.meta.lastPage}
                className="flex h-9 w-9 items-center justify-center border border-border text-xs transition-colors hover:bg-foreground hover:text-background disabled:opacity-30"
              >›</button>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <ProductModal product={editingProduct} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}