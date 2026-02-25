import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative bg-background px-6 pt-24 pb-12 lg:px-8 lg:pt-32 lg:pb-20 overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center lg:grid-cols-2">

        {/* Left Content */}
        <div className="relative z-10 flex flex-col gap-6 lg:gap-8">
          {/* Número editorial de fondo */}
          <span className="absolute -top-4 -left-4 text-[180px] font-serif font-bold text-foreground/[0.03] leading-none select-none pointer-events-none lg:text-[220px]">
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
            Minimalist streetwear for those who move in silence.
            Elevated basics designed with intention.
          </p>

          <Link
            to="/catalog"
            className="inline-flex w-fit items-center bg-foreground px-8 py-3.5 text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-75"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative mt-8 lg:mt-0 lg:-mr-8">
          <div className="relative aspect-[3/4] w-full overflow-hidden lg:aspect-[2/3]">
            <img
              src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80"
              alt="SS 2025 Collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}