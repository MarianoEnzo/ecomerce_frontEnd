import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span className="font-serif text-[120px] leading-none text-foreground/10">404</span>
      <h1 className="mt-4 font-serif text-3xl text-foreground">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center bg-foreground px-8 py-3.5 text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-75"
      >
        Back to Home
      </Link>
    </div>
  );
}