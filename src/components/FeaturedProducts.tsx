import { Link } from 'react-router-dom';

// Productos estáticos por ahora — después se conectan al backend
const products = [
  {
    id: 1,
    name: 'Essential Oversized Tee',
    price: '$68',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  },
  {
    id: 2,
    name: 'Heavyweight Hoodie',
    price: '$128',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
  },
  {
    id: 3,
    name: 'Wide Leg Cargo',
    price: '$148',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4a02?w=600&q=80',
  },
  {
    id: 4,
    name: 'Linen Bomber',
    price: '$198',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-card px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-xs uppercase tracking-widest text-muted-foreground lg:mb-14">
          New Arrivals
        </h2>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group flex flex-col"
            >
              {/* Número editorial */}
              <span className="mb-2 text-[10px] text-muted-foreground tracking-widest">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Imagen */}
              <div className="relative aspect-[3/4] overflow-hidden bg-background">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="mt-3 flex flex-col gap-1">
                <span className="text-sm text-foreground">{product.name}</span>
                <span className="text-sm text-muted-foreground">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Ver todos */}
        <div className="mt-12 text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground border-b border-foreground pb-0.5 transition-opacity hover:opacity-60"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}