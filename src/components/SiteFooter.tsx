import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
  { label: "Men", href: "/catalog?gender=MALE" },
  { label: "Women", href: "/catalog?gender=FEMALE" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-foreground px-6 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <span className="font-serif text-2xl tracking-tight text-background">
              URBAN CRAFT
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-background/50">
              Minimalist streetwear for the modern individual. Elevated basics,
              quiet luxury, timeless design. Built with intention — every piece,
              every detail.
            </p>
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-background/30">
                A portfolio project by
              </span>
              <span className="text-sm text-background/70">
                Mariano Enzo Quiroga
              </span>
              <a
                href="mailto:marianoenzo00@gmail.com"
                className="text-xs text-background/40 transition-colors hover:text-background"
              >
                marianoenzo00@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-widest text-background/30">
              Navigation
            </span>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-widest text-background/30">
              Connect
            </span>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="https://www.linkedin.com/in/mariano-quirogait"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MarianoEnzo/ecomerce_frontEnd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub — Frontend
                </a>
              </li>
              <li>
                <a
                  href="mailto:marianoenzo00@gmail.com"
                  className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  marianoenzo00@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-12 border-t border-background/10 pt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-background/30">
            © 2026 URBAN CRAFT. All rights reserved.
          </p>
          <p className="text-xs text-background/20">
            Full-stack ecommerce — NestJS · React · MySQL · Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
