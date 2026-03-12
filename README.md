# The Cod Store (React + Supabase)

Modern English-first storefront with:
- Supabase auth (sign up/login/logout)
- Product catalog with images, filters, search and sorting
- Persistent cart (Supabase for authenticated users, localStorage fallback for guests)
- Checkout with secure RPC (`create_order_from_cart`)
- Order history page
- Live chat history (Supabase)
- Booster application form (Supabase)

## 1. Install

```bash
npm install
```

## 2. Configure environment

Copy `.env.example` to `.env` and fill your project values:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## 3. Create database objects

Run `supabase-schema.sql` in Supabase SQL Editor.

## 4. Start app

```bash
npm run dev
```

If PowerShell blocks scripts, use:

```bash
npm.cmd run dev
```
