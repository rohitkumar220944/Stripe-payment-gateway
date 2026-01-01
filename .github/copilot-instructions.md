# Copilot Instructions for E-Commerce Payment Page

## Project Overview
Next.js 16 e-commerce payment checkout UI with multiple payment method support (UPI, Cards, EMI, Net Banking, Cash on Delivery). The frontend communicates with a payments API backend (`NEXT_PUBLIC_PAYMENTS_API`, defaulting to `http://localhost:8081`).

## Architecture

### Component Structure
- **`app/`** - Next.js App Router with root layout and home page
- **`components/payment/`** - Payment domain: `payment-page.tsx` (state container), `payment-method-selector.tsx`, `payment-form.tsx`, `order-summary.tsx`, `header.tsx`
- **`components/ui/`** - Shadcn/ui components (Radix UI primitives with Tailwind styling)
- **`components/theme-provider.tsx`** - Next-themes wrapper for dark mode

### Data Flow
1. User selects payment method in `PaymentMethodSelector` → sets `selectedMethod` state
2. User enters card details in `PaymentForm` → updates `formData` state
3. `OrderSummary` displays static items (Product 1: ₹15,000, Product 2: ₹15,499) + protect fee (₹129)
4. On submit: POST to `{API_BASE}/api/payments/create` with payment details
5. Response sets success/error status displayed to user

### Payment Form Data Structure
```typescript
{
  amount: number,
  cardNumber: string,        // User-formatted as "XXXX XXXX XXXX XXXX"
  cardHolder: string,
  validThru: string,        // MM/YY format
  cvv: string,
  currency: "inr",
  paymentMethod: "card" | "upi" | "emi" | "netbanking" | "cod"
}
```

## Key Patterns & Conventions

### Client Components
- Use `"use client"` at top for React state (hooks)
- Stateful containers like `PaymentPage` manage form state and API calls
- Props follow `{data, onchange, onaction}` naming for callbacks

### Styling
- **Tailwind CSS** only—no CSS modules
- Utility class patterns: `cn()` function (from `lib/utils.ts`) merges classes with conflict resolution
- Shadcn UI components inherit Tailwind defaults; customize via className props
- Color scheme: Blue accents (blue-500 for active states), gray neutrals, green for offers
- Hover/focus states use ring-2 (focus-ring-blue-500) and smooth transitions (duration-200)

### UI Components
- Located in `components/ui/` directory, imported from Radix UI
- Each wraps a Radix primitive with Tailwind styling
- Use Button, Card, Input, Dialog, Tabs, etc. from this directory

### Input Formatting
- Card number: auto-format on input with spaces every 4 digits (`formatCardNumber()`)
- Use `maxLength` attributes for field constraints
- Input fields have light blue background (`bg-blue-50`) with focus state upgrades

### API Integration
- Environment variable: `NEXT_PUBLIC_PAYMENTS_API` (public, visible to client)
- Endpoint: `POST {API_BASE}/api/payments/create`
- Error handling: try/catch with `statusMessage` state for user feedback
- Loading state: `isSubmitting` boolean during request

## Development Workflows

### Start Dev Server
```bash
npm run dev
# or
pnpm dev
```
Runs on http://localhost:3000. Backend expected at http://localhost:8081.

### Build & Start Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```
Uses ESLint (config not shown; likely Next.js default).

### Environment Setup
Create `.env.local` (or `.env`) to override:
```
NEXT_PUBLIC_PAYMENTS_API=http://your-backend-url
```

## Adding Features

### New Payment Method
1. Add to `paymentMethods` array in `payment-method-selector.tsx`
2. Update `PaymentMethodSelector` props if new UI needed
3. Ensure backend `/api/payments/create` accepts the method in `paymentMethod` field
4. Conditionally render form fields in `PaymentForm` based on `selectedMethod` (currently only cards are rendered)

### New Form Fields
1. Add to `formData` interface in `payment-page.tsx`
2. Add input in `PaymentForm` component
3. Handle formatting in `handleInputChange()` if needed (e.g., auto-spacing)

### New UI Components
- Copy from Shadcn UI library into `components/ui/`
- Follow existing naming: lowercase, hyphenated (e.g., `dropdown-menu.tsx`)
- Wrap Radix UI primitives with Tailwind classes

## Important Quirks & Gotchas

1. **Build Ignores TS Errors** - `next.config.mjs` has `ignoreBuildErrors: true`; fix actual errors before deployment
2. **Images Unoptimized** - `unoptimized: true` in Next config (no Next.js Image optimization)
3. **Hard-Coded Order Items** - Products defined in `PaymentPage` state; connect to real data when integrating backend
4. **Static Calculations** - Subtotal, total, and protect fee hard-coded; add dynamic calculation when needed
5. **Card-Only Form** - Payment form currently only shows when `selectedMethod === "card"`; other methods need form variants

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **UI Library**: Shadcn/ui (Radix primitives + Tailwind)
- **Form**: React hooks (`useState`)—consider `react-hook-form` + `@hookform/resolvers` (already in deps) for complex validation
- **Styling**: Tailwind CSS + PostCSS
- **Icons**: lucide-react
- **Theme**: next-themes
- **Analytics**: @vercel/analytics

## Path Aliases
- `@/*` maps to project root, allowing `import { cn } from "@/lib/utils"`

