# Preorder Manager — Implementation Plan

A small Next.js application with two screens: a **preorder list page** (UI-1 / UI-2) and a
**create & update preorder page** (UI-3). Filtering, sorting, and pagination are handled on the
backend (database), not client-only.

## Confirmed decisions

- **Backend/mutation style:** Next.js **Server Actions**. The list page reads `searchParams` and
  queries Prisma directly on the server. Mutations (create / update / toggle status / delete) are
  server actions with `revalidatePath`.
- **Styling:** **Tailwind CSS, hand-built components** to match the screenshots precisely (light
  footprint, no heavy component library). A tiny toast utility provides save/toggle/delete feedback.

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Prisma + SQLite** (`prisma/schema.prisma`, `dev.db`)
- **Tailwind CSS**
- **Zod** for validating request bodies and query params

---

## 1. Data model

Derived from the form in UI-3. SQLite has no native enum, so `preorderWhen` is stored as a `String`
and constrained by a Zod enum at the application layer.

| Field          | Type       | Notes                                                       |
| -------------- | ---------- | ----------------------------------------------------------- |
| `id`           | String (cuid) | Primary key                                              |
| `name`         | String     | Required — "A label to recognize this preorder by"          |
| `products`     | Int        | Default `1` — "Number of products covered by this preorder" |
| `preorderWhen` | String     | Enum: `out-of-stock` \| `regardless-of-stock`               |
| `startsAt`     | DateTime   | "When the preorder window opens"                            |
| `endsAt`       | DateTime?  | Nullable — "Leave empty for no end date"                    |
| `active`       | Boolean    | Default `true` — the Status toggle                          |
| `createdAt`    | DateTime   | `@default(now())` — used by the "Created At" sort           |
| `updatedAt`    | DateTime   | `@updatedAt`                                                |

---

## 2. Project structure

```
app/
  page.tsx                          → redirect to /preorders
  preorders/
    page.tsx                        → list (reads searchParams, queries DB)
    _components/
      Toolbar.tsx                   → filter tabs + sort popover
      SortPopover.tsx
      PreorderTable.tsx
      PreorderRow.tsx
      StatusToggle.tsx
      DeleteButton.tsx
      Pagination.tsx
      SelectionProvider.tsx         → client-side row/select-all state
    new/page.tsx                    → create form
    [id]/edit/page.tsx              → update form (pre-filled)
    _components/
      PreorderForm.tsx              → shared create/update form (composes the fields below)
      fields/
        TextField.tsx               → Name
        NumberStepperField.tsx      → Products
        SelectField.tsx             → Preorder when
        DateTimeField.tsx           → Starts at / Ends at
        StatusField.tsx             → Status toggle
        FieldShell.tsx              → label + helper text + error wrapper shared by all fields
  actions/preorders.ts              → server actions
lib/
  prisma.ts                         → Prisma client singleton
  validation.ts                     → Zod schemas (preorder + query params)
  query.ts                          → parse/clamp filter + sort + page
  format.ts                         → date formatting helpers
prisma/
  schema.prisma
  seed.ts                           → seeds the 8 rows from UI-1
README.md
```

---

## 3. List page (UI-1 / UI-2) — backend-driven

State lives in the URL; changing any control updates `searchParams` and the server re-renders.

- **Filter tabs** `All / Active / Inactive` → `?status=all|active|inactive`, applied as a Prisma
  `where { active }` clause.
- **Sort popover** (UI-2): radio `Name / Created At / Starts At / Ends At` + `Ascending /
  Descending` → `?sortBy=&order=`, applied as Prisma `orderBy`. Default = `Created At` /
  `Descending` (matches the highlighted state in UI-2).
- **Pagination** → `?page=`, fixed `pageSize` (8, to match the shot). Uses
  `prisma.$transaction([findMany({ skip, take }), count()])`. Footer renders "Showing X to Y from N"
  with prev/next disabled at the bounds.
- **Columns:** select checkbox · Name (bold) · Products · Preorder when · Starts at · Ends at ·
  Status (toggle) · Actions (pencil → edit, trash → delete).
- **Date format:** `Dec 15, 2025 08:24 PM`.
- **Empty state:** single full-width table row — "No preorders found".

---

## 4. Status toggle & delete

- `StatusToggle` (client) calls a `toggleStatus` server action → updates DB → `revalidatePath`,
  with an optimistic UI flip and a toast for feedback.
- `DeleteButton` (client) → confirm → `deletePreorder` action → `revalidatePath` → toast.

---

## 5. Selection checkboxes

Client-side only (spec: "No action buttons need for selection"). A small selection context using
`useState<Set<id>>`:

- Row checkbox toggles a single row.
- Header checkbox selects / clears all visible rows and shows an indeterminate state when partially
  selected.
- No persistence and no bulk actions.

---

## 6. Create / Update page (UI-3)

One shared `PreorderForm`:

- **Create mode:** blank (products = 1, status = Active).
- **Edit mode:** pre-filled from a server fetch by `id` (404 if missing).

**Each field is its own component** under `_components/fields/`, composed by `PreorderForm`:

- `TextField` → Name (required)
- `NumberStepperField` → Products (number stepper)
- `SelectField` → Preorder when (select)
- `DateTimeField` → Starts at (`datetime-local`) and Ends at (`datetime-local`, optional)
- `StatusField` → Status toggle

Each field component takes a focused prop contract (`label`, `value`, `onChange`, `error`,
`helperText`, etc.) and shares a common `FieldShell` for label / helper text / error layout, so
`PreorderForm` stays small and the fields are independently reusable and testable.

- **Back / Cancel / Save** all return to `/preorders`.
- **Save** runs the create/update server action, shows a **loader** on the button (`useTransition`
  pending state) while saving, then `router.push('/preorders')` on success.
- Validation errors are shown inline.

---

## 7. README + seed

- **README:** stack overview + setup steps —
  `npm install` → `npx prisma migrate dev` → `npx prisma db seed` → `npm run dev`.
- **Seed:** reproduces the 8 sample rows from UI-1, including the inactive "Multi variant 3" and
  "Multi variant 2" (which has an `endsAt`).

---

## Code conventions

- **No comments in the code.** Keep the code self-explanatory through clear naming and small,
  focused functions and components — do not add explanatory or section comments.
- **Readability first.** Favor small single-responsibility components (every form input is its own
  component), descriptive names, early returns over nesting, and consistent file organization so the
  code reads top-to-bottom without needing annotation.

## Notable decisions

- **Server Actions + URL state** over a separate REST API — simpler, idiomatic Next 16, and keeps
  filter/sort/pagination genuinely server-side.
- **Tailwind hand-built** to match the screenshots exactly without a heavy component library; a tiny
  toast utility handles feedback.

---

## 8. Netlify deployment

### Can we use SQLite + server functions on Netlify?

- **Server functions — yes.** Netlify's Next.js runtime (`@netlify/plugin-nextjs`) maps Next 16
  SSR and **Server Actions** to serverless functions automatically. No code changes needed.
- **File-based SQLite — no (for writes).** Netlify functions run on AWS Lambda: the deployed
  filesystem is read-only and `/tmp` is ephemeral and per-instance. A committed `dev.db` would lose
  every write and be inconsistent across invocations. Plain Prisma + file SQLite cannot back this
  CRUD app on Netlify.
- **Solution — Turso (libSQL):** a hosted, SQLite-compatible database. Prisma connects through its
  libSQL **driver adapter**. **Local dev keeps the `dev.db` file; production points at Turso** —
  same schema, same Prisma client.

> Alternative: to avoid any external DB service entirely, deploy to a host with a **persistent
> disk** (Fly.io, Railway, a VPS) where the `dev.db` file works as-is. Netlify is only unsuitable
> because of its ephemeral filesystem.

### Prisma + libSQL setup (works for both local file and Turso)

1. Enable driver adapters in `schema.prisma` (datasource `provider` stays `sqlite`):
   ```prisma
   generator client {
     provider        = "prisma-client-js"
     previewFeatures = ["driverAdapters"]
   }
   ```
2. Install adapter deps: `npm i @prisma/adapter-libsql @libsql/client`.
3. In `lib/prisma.ts`, build the client from a libSQL adapter. Use Turso env vars when present,
   otherwise fall back to the local `file:./prisma/dev.db`:
   - `TURSO_DATABASE_URL` (e.g. `libsql://<db>-<org>.turso.io`)
   - `TURSO_AUTH_TOKEN`

### Create and provision the Turso database

4. Install the CLI and sign in: `turso auth signup` (or `login`).
5. Create the DB and capture credentials:
   ```bash
   turso db create preorder-manager
   turso db show preorder-manager --url        # → TURSO_DATABASE_URL
   turso db tokens create preorder-manager      # → TURSO_AUTH_TOKEN
   ```
6. Apply the schema to Turso by piping the generated migration SQL through the shell:
   ```bash
   npx prisma migrate diff --from-empty \
     --to-schema-datamodel prisma/schema.prisma --script > schema.sql
   turso db shell preorder-manager < schema.sql
   ```
7. (Optional) Seed production once by running the seed script with the Turso env vars set locally.

### Configure and deploy on Netlify

8. Add `netlify.toml`:
   ```toml
   [build]
     command = "prisma generate && next build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```
9. In the Netlify site UI (Site settings → Environment variables) set:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
10. Connect the Git repo (or `netlify deploy --build --prod` via CLI). Netlify auto-detects Next.js,
    runs `prisma generate && next build`, and deploys SSR + Server Actions as functions.
11. Verify: load the list page, toggle a status, create/edit/delete — confirm writes persist across
    reloads (i.e. they hit Turso, not a throwaway file).

---

## Build order

1. Scaffold — Next.js 16 (App Router, TS) + Tailwind + Prisma/SQLite, Zod, toast util.
2. Schema + seed — `Preorder` model + seed reproducing UI-1's 8 rows.
3. Server actions — `createPreorder`, `updatePreorder`, `toggleStatus`, `deletePreorder`.
4. List page (UI-1 / UI-2) — toolbar, table, toggle, delete, selection, pagination, empty state.
5. Form page (UI-3) — shared create/edit form, validation, button loader, navigation.
6. README — setup, migrate, seed, run steps.
