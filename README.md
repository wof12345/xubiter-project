# Preorder Manager

A small Next.js app to manage preorders. Two screens:

- **Preorders list** — filter (All / Active / Inactive), sort (Name / Created At / Starts At / Ends At, ascending or descending), paginate, toggle status, and delete. Filtering, sorting, and pagination all run on the server against the database.
- **Create / Edit preorder** — a shared form with inline validation, a save loader, and toast feedback.

## Stack

- **Next.js 16** (App Router, TypeScript) with **Server Actions**
- **Prisma** + **SQLite** (via the libSQL driver adapter, so the same client works locally and against Turso)
- **Tailwind CSS** (hand-built components)
- **Zod** for validating action input and query params

## Getting started

```bash
npm install
npx prisma migrate dev    # creates prisma/dev.db, applies the schema, and seeds 8 sample rows
npm run dev               # http://localhost:3000
```

`npx prisma migrate dev` runs the seed automatically. To reseed at any time:

```bash
npx prisma db seed
```

## Project layout

```
app/
  page.tsx                       redirect → /preorders
  actions/preorders.ts           server actions (create / update / toggle / delete)
  _components/Toast.tsx          toast provider + hook
  preorders/
    page.tsx                     list (reads searchParams, queries the DB)
    new/page.tsx                 create form
    [id]/edit/page.tsx           edit form (pre-filled, 404 if missing)
    _components/                 toolbar, table, row, toggle, delete, pagination, selection, form, fields/
lib/
  prisma.ts                      Prisma client (libSQL adapter; local file or Turso)
  validation.ts                  Zod schemas (preorder + query params)
  query.ts                       parse/clamp filter + sort + page
  format.ts                      date formatting helpers
prisma/
  schema.prisma
  seed.ts                        seeds the 8 sample rows
```

## Data model

| Field          | Type        | Notes                                            |
| -------------- | ----------- | ------------------------------------------------ |
| `id`           | String      | cuid primary key                                 |
| `name`         | String      | required                                         |
| `products`     | Int         | default `1`                                      |
| `preorderWhen` | String      | `out-of-stock` \| `regardless-of-stock`          |
| `startsAt`     | DateTime    | when the preorder window opens                   |
| `endsAt`       | DateTime?   | nullable — empty means no end date               |
| `active`       | Boolean     | default `true` (the status toggle)               |
| `createdAt`    | DateTime    | `@default(now())`                                |
| `updatedAt`    | DateTime    | `@updatedAt`                                     |

## Deploying to Netlify (with Turso)

Netlify functions run on a read-only, ephemeral filesystem, so a committed SQLite file cannot persist writes. Use [Turso](https://turso.tech) (hosted, SQLite-compatible) in production — local dev keeps the `dev.db` file, production points at Turso, same schema and Prisma client.

1. Create the database and capture credentials:

   ```bash
   turso db create preorder-manager
   turso db show preorder-manager --url     # → TURSO_DATABASE_URL
   turso db tokens create preorder-manager  # → TURSO_AUTH_TOKEN
   ```

2. Apply the schema to Turso:

   ```bash
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > schema.sql
   turso db shell preorder-manager < schema.sql
   ```

3. In **Netlify → Site settings → Environment variables**, set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. When these are present, `lib/prisma.ts` connects to Turso; otherwise it falls back to the local `prisma/dev.db`.

4. Connect the repo (or `netlify deploy --build --prod`). `netlify.toml` already configures the build (`prisma generate && next build`) and the Next.js runtime plugin.
