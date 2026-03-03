import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative bg-background overflow-hidden min-h-screen flex items-stretch">
      <div className="flex w-full">
        <div className="relative z-10 flex flex-col justify-center gap-6 lg:gap-8 px-6 lg:px-16 xl:px-24 w-full lg:w-1/2 py-24">
          <span className="absolute top-1/2 -translate-y-1/2 left-0 text-[180px] font-serif font-bold text-foreground/[0.03] leading-none select-none pointer-events-none lg:text-[220px]">
            025
          </span>

          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            SS 2025 Collection
          </span>

          <h1 className="font-serif text-6xl leading-[0.95] font-normal tracking-tight text-foreground sm:text-7xl lg:text-[96px]">
            <span className="block">WEAR THE</span>
            <span className="block italic">SILENCE</span>
          </h1>

          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Minimalist streetwear for those who move in silence. Elevated basics
            designed with intention.
          </p>

          <Link
            to="/catalog"
            className="inline-flex w-fit items-center bg-accent text-white px-8 py-3.5 text-xs uppercase tracking-wider transition-opacity hover:opacity-75"
          >
            Shop Now
          </Link>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://res.cloudinary.com/dm8vhezlk/image/upload/v1772467873/eirik-skarstein-7nJaxCw4SVg-unsplash.jpg"
            alt="SS 2025 Collection"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
