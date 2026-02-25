import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const featured = [
  {
    id: 1,
    tag: 'New',
    name: 'Essential Oversized Tee',
    description: 'Unisex Streetwear',
    price: '$68',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  },
  {
    id: 2,
    tag: 'New',
    name: 'Heavyweight Hoodie',
    description: 'Premium Cotton Fleece',
    price: '$128',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
  },
  {
    id: 3,
    tag: 'New',
    name: 'Wide Leg Cargo',
    description: 'Relaxed Fit Pants',
    price: '$148',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4a02?w=600&q=80',
  },
  {
    id: 4,
    tag: 'New',
    name: 'Linen Bomber',
    description: 'Lightweight Jacket',
    price: '$198',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
  },
  {
    id: 5,
    tag: 'New',
    name: 'Merino Crewneck',
    description: 'Fine Knit Sweater',
    price: '$158',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80',
  },
  {
    id: 6,
    tag: 'New',
    name: 'Relaxed Chino',
    description: 'Tapered Fit',
    price: '$118',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
  },
];

const CARD_WIDTH = 220;
const GAP = 16;
const INTERVAL = 4000;

export default function FeaturedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;

    // Si llegó al final, vuelve al principio
    if (direction === 'right' && el.scrollLeft >= maxScroll - 1) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({
        left: direction === 'left' ? -(CARD_WIDTH + GAP) : CARD_WIDTH + GAP,
        behavior: 'smooth',
      });
    }
  };

  // Auto-scroll cada 4 segundos, se pausa en hover
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => scroll('right'), INTERVAL);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section className="bg-card px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between lg:mb-14">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
            Featured
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Carrusel */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group flex flex-shrink-0 flex-col"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              {/* Imagen */}
              <div className="relative aspect-[3/4] overflow-hidden bg-background">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Botón agregar al carrito — sube desde abajo en hover */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-foreground py-3 text-center text-xs uppercase tracking-widest text-background transition-transform duration-300 group-hover:translate-y-0">
                  Add to Cart
                </div>
              </div>

              {/* Info */}
              <div className="mt-3 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {product.tag}
                </span>
                <span className="text-sm text-foreground">{product.name}</span>
                <span className="text-xs text-muted-foreground">{product.description}</span>
                <span className="mt-1 text-sm text-foreground">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}