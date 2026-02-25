import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'T-Shirts',
    href: '/catalog?category=TSHIRT',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
    span: 'lg:col-span-2', // primera categoría ocupa el doble — layout asimétrico
  },
  {
    name: 'Sweatshirts',
    href: '/catalog?category=SWEATSHIRT',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
    span: '',
  },
  {
    name: 'Jackets',
    href: '/catalog?category=JACKET',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    span: '',
  },
  {
    name: 'Pants',
    href: '/catalog?category=PANTS',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4a02?w=600&q=80',
    span: '',
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-background px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-center text-xs uppercase tracking-widest text-muted-foreground lg:mb-14">
          Shop by Category
        </h2>

        {/* Grid asimétrico — primera card ocupa 2 columnas */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className={`group relative overflow-hidden aspect-[3/4] ${category.span}`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

              {/* Número editorial */}
              <span className="absolute top-4 right-4 text-xs text-white/40 tracking-widest">
                0{categories.indexOf(category) + 1}
              </span>

              {/* Nombre categoría */}
              <div className="absolute bottom-0 left-0 p-4 lg:p-6">
                <span className="text-sm font-medium uppercase tracking-wide text-white">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}