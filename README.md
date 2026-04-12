# Toko Hafizh - Fullstack E-Commerce

Stack:
- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Credentials)
- Zustand (Cart)
- TanStack Query (data fetching + cache)
- Radix UI wrappers (custom, not shadcn)
- React Hook Form + Zod

## Folder Structure

```txt
app/
  (public)/
    layout.tsx
    page.tsx
    products/page.tsx
    cart/page.tsx
    checkout/page.tsx
  (auth)/
    layout.tsx
    login/page.tsx
    register/page.tsx
  (dashboard)/
    layout.tsx
    dashboard/page.tsx
    dashboard/products/page.tsx
    dashboard/products/[id]/page.tsx
  api/
    auth/[...nextauth]/route.ts
    auth/register/route.ts
    dashboard/products/route.ts
    products/route.ts
    products/[id]/route.ts
    checkout/route.ts
  globals.css
  layout.tsx
  providers.tsx
components/
  dashboard/
    product-form.tsx
    products-table.tsx
  product/
    product-card.tsx
    products-catalog.tsx
  shared/
    auth-actions.tsx
  ui/
    button.tsx
    input.tsx
    modal.tsx
    toast.tsx
lib/
  auth.ts
  prisma.ts
  whatsapp.ts
  currency.ts
  validators/
    auth.ts
    product.ts
    checkout.ts
store/
  cart-store.ts
prisma/
  schema.prisma
middleware.ts
types/
  next-auth.d.ts
```

## Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-secure-secret"
NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"
```

## Run Locally

```bash
npm install
npx prisma generate
npx prisma migrate dev -n init
npm run dev
```

## Features

- Public catalog browsing
- Zustand-based cart state
- TanStack Query-powered product catalog and admin product list
- Checkout to `wa.me` with formatted message
- Credentials auth via NextAuth
- Admin dashboard for product CRUD
