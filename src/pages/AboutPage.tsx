const GithubIcon = () => (
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const TAGS = [
  "React",
  "NestJS",
  "TypeScript",
  "MySQL",
  "Prisma",
  "Docker",
  "JWT Auth",
  "Tailwind CSS",
  "TanStack Query",
  "Zustand",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
        <div className="mb-16 flex flex-col gap-6">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Portfolio Project
          </span>
          <h1 className="font-serif text-4xl text-foreground lg:text-5xl">
            About URBN
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
            URBN is a full-stack ecommerce project built to demonstrate modern
            web development skills. It features a complete shopping experience
            including product browsing, filtering, cart management,
            authentication, and order processing.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
            Built by{" "}
            <span className="text-foreground">Mariano Enzo Quiroga</span> as a
            portfolio showcase for full-stack React and NestJS development.
          </p>
        </div>

        <div className="border-t border-border pt-16 flex flex-col gap-10">
          <p className="text-sm text-muted-foreground tracking-wide">
            This project was built with...
          </p>

          <div className="flex flex-wrap gap-2.5">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-4 py-2 text-xs text-foreground tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/MarianoEnzo/ecomerce_frontEnd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-border px-5 py-2.5 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <GithubIcon />
              Frontend
            </a>
            <a
              href="https://github.com/MarianoEnzo/ecommerce_backend"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-border px-5 py-2.5 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <GithubIcon />
              Backend
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
