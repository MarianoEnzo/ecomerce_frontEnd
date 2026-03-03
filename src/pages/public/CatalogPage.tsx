import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { productsApi } from "../../features/auth/products/product.api";
import ProductCard from "../../components/Productcard";
import QuickAddModal from "../../components/QuickAddModal";
import type { Category, Gender, Size, Product } from "../../types";

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "T-Shirts", value: "TSHIRT" },
  { label: "Sweatshirts", value: "SWEATSHIRT" },
  { label: "Jackets", value: "JACKET" },
  { label: "Pants", value: "PANTS" },
];

const GENDERS: { label: string; value: Gender }[] = [
  { label: "Men", value: "MALE" },
  { label: "Women", value: "FEMALE" },
  { label: "Unisex", value: "UNISEX" },
];

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

const LIMIT = 12;

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-[10px] uppercase tracking-widest text-foreground"
      >
        {title}
        {open ? (
          <ChevronUp className="h-3 w-3" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
        )}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);

  const category = (searchParams.get("category") as Category) || undefined;
  const gender = (searchParams.get("gender") as Gender) || undefined;
  const size = (searchParams.get("size") as Size) || undefined;
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search") || undefined;

  const filters = {
    category,
    gender,
    size,
    minPrice,
    maxPrice,
    page,
    search,
    limit: LIMIT,
  };

  const setParam = (key: string, value: string | undefined) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== "page") next.delete("page");
      return next;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage > 1) {
        next.set("page", String(newPage));
      } else {
        next.delete("page");
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = !!(
    category ||
    gender ||
    size ||
    minPrice ||
    maxPrice
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", Object.fromEntries(searchParams)],
    queryFn: () => productsApi.getAll(filters),
  });

  const SidebarContent = () => (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <span className="text-[10px] uppercase tracking-widest text-foreground">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Category">
        <ul className="flex flex-col gap-2.5">
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <button
                onClick={() =>
                  setParam(
                    "category",
                    category === cat.value ? undefined : cat.value,
                  )
                }
                className={`text-xs transition-colors ${
                  category === cat.value
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category === cat.value ? "— " : ""}
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Gender">
        <ul className="flex flex-col gap-2.5">
          {GENDERS.map((g) => (
            <li key={g.value}>
              <button
                onClick={() =>
                  setParam("gender", gender === g.value ? undefined : g.value)
                }
                className={`text-xs transition-colors ${
                  gender === g.value
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {gender === g.value ? "— " : ""}
                {g.label}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setParam("size", size === s ? undefined : s)}
              className={`h-8 w-10 text-[10px] uppercase tracking-wider transition-colors ${
                size === s
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice ?? ""}
            onChange={(e) => setParam("minPrice", e.target.value || undefined)}
            className="w-full border-b border-border bg-transparent pb-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ""}
            onChange={(e) => setParam("maxPrice", e.target.value || undefined)}
            className="w-full border-b border-border bg-transparent pb-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-screen-2xl px-8 lg:px-16">
        <div className="flex items-center justify-between border-b border-border py-8">
          <h1 className="font-serif text-2xl text-foreground">
            {search ? `"${search}"` : "Catalog"}
          </h1>
          <div className="flex items-center gap-4">
            {data && (
              <span className="text-xs text-muted-foreground">
                {data.meta.total} items
              </span>
            )}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8 py-8">
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <SidebarContent />
          </aside>

          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 bg-background p-6 overflow-y-auto">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest">
                    Filters
                  </span>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>
                <SidebarContent />
              </div>
            </div>
          )}

          <div className="flex-1">
            {isLoading && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-[3/4] animate-pulse bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse bg-muted" />
                    <div className="h-3 w-1/3 animate-pulse bg-muted" />
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm text-muted-foreground">
                  Failed to load products.
                </p>
              </div>
            )}

            {!isLoading && !isError && data?.data.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm text-muted-foreground">
                  No products found.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-xs uppercase tracking-widest text-foreground underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            )}

            {!isLoading && !isError && data && data.data.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
                  {data.data.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index + 1 + (page - 1) * LIMIT}
                      onQuickAdd={setQuickAdd}
                      activeSize={size}
                    />
                  ))}
                </div>

                {data.meta.lastPage > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="flex h-9 w-9 items-center justify-center border border-border text-xs text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ‹
                    </button>

                    {Array.from({ length: data.meta.lastPage }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`h-9 w-9 text-xs transition-colors ${
                          page === i + 1
                            ? "bg-foreground text-background"
                            : "border border-border text-foreground hover:bg-foreground hover:text-background"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === data.meta.lastPage}
                      className="flex h-9 w-9 items-center justify-center border border-border text-xs text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {quickAdd && (
        <QuickAddModal product={quickAdd} onClose={() => setQuickAdd(null)} />
      )}
    </div>
  );
}
