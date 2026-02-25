// Formatea precio — Prisma Decimal viene como string
export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(Number(price));
}

// Clases condicionales sin shadcn
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}