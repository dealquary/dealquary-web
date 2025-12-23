# Claude Code Instructions — SaaS Deal Calculator (Next.js)

You are working in a Next.js App Router project with authentication, database, and payments. Follow these rules:

## Goals
- Keep the app fully functional locally with `npm run dev`.
- All calculations must live in `src/lib/calc.ts` as pure functions.
- UI must not embed business logic besides calling calc functions.
- PDF export is a Pro feature requiring Stripe subscription.

## Architecture
- **Frontend**: Next.js 15 App Router with React 19
- **State Management**: Zustand store in `src/state/store.ts` for workspace data (localStorage)
- **Auth**: NextAuth.js with Google provider (database sessions)
- **Database**: Prisma + PostgreSQL (Neon) for user data, auth, and subscriptions
- **Payments**: Stripe Checkout for Pro subscriptions
- **Validation**: Zod schemas in `src/lib/validators.ts`
- **Formatting**: helpers in `src/lib/format.ts`

## Implementation Rules
- TypeScript strict mode.
- Keep calc.ts pure (no DB, no auth, no side effects).
- Server-side Pro status checks via NextAuth session.
- Client-side: use `useSession()` hook for auth state and Pro badge.
- Gate PDF export based on `session.user.isPro` boolean.

## UX Requirements
- User can create multiple deals, select one, clone, delete.
- Deal contains products (line items). Add/remove/edit products.
- Support recurring per-license and one-time products.
- Support discount mode: percent OR dollars per license (or one-time).
- Support free months up front at deal-level.
- Show deal comparison matrix for multiple deals.
- CAC and Contracted LTV (term-based) + LTV:CAC + Payback months.
- **Pro Features**: PDF export, device sync (future)

## Authentication & Billing
- Logged-out users: see "Sign in to Export" on PDF buttons.
- Logged-in free users: see "Upgrade to Export" → redirect to /billing.
- Pro users: see "Pro" badge and enabled PDF export.
- Stripe webhook updates `user.isPro` on subscription events.

## Testing
- Add/maintain unit tests for `src/lib/calc.ts` using Vitest.
- Tests should cover discounts, free months, term months.
- Do NOT test auth/payments in unit tests (integration tests only if needed).

## Guardrails
- Do NOT modify calculation logic in calc.ts when adding features.
- Do NOT add heavy UI libraries. Use simple components already included.
- If you need a new UI primitive, put it under `src/components/ui/`.
- Keep database migrations in sync using `npx prisma migrate dev`.

## Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `NEXTAUTH_URL`: App URL (http://localhost:3000 for dev)
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `STRIPE_PRICE_ID_PRO_MONTHLY`: Stripe price ID for Pro subscription
- `NEXT_PUBLIC_APP_URL`: Public app URL (for Stripe redirects)

## If something is missing
- Prefer minimal changes that keep the system consistent with existing types.
- Add types first, then calc, then UI.
- For auth/billing features, consult existing patterns in `/billing` and `/api/stripe`.
