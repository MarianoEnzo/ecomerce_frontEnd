export default function EditorialBanner() {
  return (
    <section className="bg-background px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-16">

        {/* Left — Quote */}
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            QUALITY OVER EVERYTHING
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Every piece is crafted with premium materials and meticulous
            attention to detail. Built to last, designed to transcend seasons.
          </p>
        </div>

        {/* Right — Image */}
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[3/2]">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
            alt="Editorial lifestyle"
            className="h-full w-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}