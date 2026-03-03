import { Link } from "react-router-dom";
import type { Category } from "../types";

const CATEGORIES: {
  name: string;
  value: Category;
  href: string;
  image: string;
}[] = [
  {
    name: "T-Shirts",
    value: "TSHIRT",
    href: "/catalog?category=TSHIRT",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
  },
  {
    name: "Sweatshirts",
    value: "SWEATSHIRT",
    href: "/catalog?category=SWEATSHIRT",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
  },
  {
    name: "Jackets",
    value: "JACKET",
    href: "/catalog?category=JACKET",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  },
  {
    name: "Pants",
    value: "PANTS",
    href: "/catalog?category=PANTS",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-background">
      <h2 className="py-10 text-center text-xs uppercase tracking-widest text-muted-foreground">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 gap-1" style={{ height: "90vh" }}>
        {CATEGORIES.map((category) => (
          <Link
            key={category.name}
            to={category.href}
            className="group relative overflow-hidden"
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ opacity: 0 }}
              onLoad={(e) => (e.currentTarget.style.opacity = "1")}
            />
            <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-3xl text-white uppercase tracking-widest">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
