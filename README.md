# DealQuary

**A financial modeling platform for SaaS deals**

DealQuary is a professional deal calculator and analytics tool designed for revenue teams, finance analysts, and SaaS executives. Model complex subscription deals, analyze profitability scenarios, and generate customer-ready proposals — all in one collaborative workspace.

---

## Overview

Building the right SaaS deal structure requires balancing multiple variables: pricing, discounts, ramp schedules, payment terms, and customer acquisition costs. DealQuary provides a real-time modeling environment where you can:

- **Model recurring and one-time revenue** with flexible term structures
- **Compare deal scenarios** side-by-side with instant delta analysis
- **Calculate key metrics** including MRR, ARR, TCV, LTV:CAC, and payback periods
- **Export professional proposals** with customer-safe PDF reports
- **Track profitability** with margin analysis and cost basis modeling

---

## Key Features

### 📊 **Real-Time Deal Modeling**
- Multi-product line items with recurring and one-time pricing
- Dynamic MRR/ARR/TCV calculations that update as you type
- Support for annual escalators, ramp periods, and free months
- Customer discount modeling (percentage or dollar-based)

### 📈 **Profitability Analysis**
- Gross margin calculations per product and deal-level
- CAC (Customer Acquisition Cost) tracking
- LTV:CAC ratio and payback period analysis
- Partner commission and sales compensation modeling

### 🔄 **Scenario Comparison**
- Create multiple deal variants (A/B/C scenarios)
- Compare metrics side-by-side with delta highlights
- Lock assumptions to prevent accidental changes
- Visual indicators for better vs. worse outcomes

### 📄 **Professional Exports**
- **Customer-Safe PDFs**: Clean proposals without internal margin data
- **Internal Reports**: Full analytics including profitability metrics
- **Excel Export**: Detailed breakdown with deal summary and product tables
- Copy-to-clipboard formatted summaries for Slack/email

### 💼 **Enterprise Features**
- Multi-year term modeling (12-60 months)
- Cash flow projections by year
- Revenue recognition vs. billings analysis
- Responsive design for mobile and desktop

### 🔐 **Subscription Tiers**
- **Free**: Full deal modeling with unlimited deals
- **Pro** ($19/mo): Unlock all export features (PDF, Excel, copy summary)

---

## Use Cases

**Revenue Operations**
- Model expansion deals with seat-based pricing
- Analyze the impact of discount strategies on annual recurring revenue
- Compare multi-year vs. annual contract structures

**Finance Teams**
- Calculate true profitability with margin and CAC analysis
- Project cash flow by year for revenue planning
- Model different payment terms and their financial impact

**Sales Teams**
- Create professional proposals with customer-safe pricing
- Experiment with discount scenarios to win competitive deals
- Generate executive summaries for deal approvals

**SaaS Executives**
- Understand unit economics across your pipeline
- Compare deals by LTV:CAC ratio and payback period
- Make data-driven decisions on pricing strategy

---

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Recharts** - Data visualization

### Backend & Infrastructure
- **Next.js API Routes** - Serverless backend
- **Prisma** - Type-safe database ORM
- **PostgreSQL** (Neon) - Scalable database
- **NextAuth.js** - Authentication with Google OAuth
- **Stripe** - Subscription and payment processing

### Deployment
- **Vercel** - Edge-optimized hosting
- **Neon** - Serverless PostgreSQL with branching

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Google OAuth credentials
- Stripe account (for Pro subscriptions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dealquary/dealquary-web.git
   cd dealquary-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in the following values in `.env.local`:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - `http://localhost:3000` for development
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `STRIPE_SECRET_KEY` - From Stripe Dashboard
   - `STRIPE_PRICE_ID_PRO_MONTHLY` - Your Pro subscription price ID
   - `STRIPE_WEBHOOK_SECRET` - From Stripe CLI or webhook setup
   - `NEXT_PUBLIC_APP_URL` - `http://localhost:3000` for development

4. **Initialize database**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Stripe Webhook Setup (Local Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── deal/              # Product tables and line item components
│   ├── features/          # Core features (deal editor, totals, charts)
│   ├── export/            # Export functionality (PDF, Excel, copy)
│   ├── metrics/           # Metric cards and visualizations
│   └── ui/                # Reusable UI components
├── lib/
│   ├── calc.ts            # MRR/ARR/TCV calculation engine
│   ├── format.ts          # Currency and number formatting
│   ├── formulas.ts        # Business logic and formulas
│   └── validation.ts      # Input validation rules
└── state/
    └── store.ts           # Zustand state management
```

---

## Development

### Build for Production
```bash
npm run build
npm start
```

### Database Management
```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Environment Variables

See `.env.example` for a complete list of required environment variables.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Configure Stripe webhook endpoint: `https://yourdomain.vercel.app/api/stripe/webhook`
5. Deploy

The main branch automatically deploys to production.

---

## Roadmap

- [ ] Multi-currency support
- [ ] Team collaboration features
- [ ] Custom branding for exports
- [ ] API access for integrations
- [ ] Advanced analytics dashboard
- [ ] Salesforce/HubSpot integration

---

## Contributing

This is a private commercial project. Contributions are welcome by invitation only.

---

## License

Proprietary - All rights reserved

---

## Support

For questions or support, contact: [support@dealquary.com](mailto:support@dealquary.com)

---

Built with ❤️ for revenue teams everywhere.
