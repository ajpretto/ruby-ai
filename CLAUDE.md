# Ruby AI - Project Conventions

## Project Overview
Ruby AI is an AI-powered real estate investment analysis platform for residential property flips and BRRRR strategies. Users can search any US address, receive property valuations, run deal analysis, and interact with an AI investment advisor.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| AI | OpenAI GPT-4 |
| Deployment | Vercel |
| Analytics | Vercel Analytics |

## Project Structure

```
home_app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth routes (login, signup)
│   │   ├── (dashboard)/        # Protected app routes
│   │   ├── api/                # API routes
│   │   ├── property/[id]/      # Property detail pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Base UI components (shadcn)
│   │   ├── search/             # Address search components
│   │   ├── report/             # Property report components
│   │   ├── calculator/         # Napkin calculator components
│   │   ├── ai-assistant/       # AI chat components
│   │   └── portfolio/          # Portfolio/comparison components
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── api/                # External API integrations
│   │   ├── valuation/          # Valuation logic
│   │   ├── calculator/         # Deal analysis logic
│   │   ├── ai/                 # AI/LLM utilities
│   │   ├── stripe/             # Payment integration
│   │   └── utils.ts            # General utilities
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── constants/              # App constants
├── supabase/
│   └── migrations/             # Database migrations
├── docs/
│   ├── project_spec.md         # Full specification
│   └── agents/                 # Subagent specifications
├── public/                     # Static assets
└── tests/                      # Test files
```

## Code Style

### TypeScript
- Use strict mode (`"strict": true`)
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions
- Avoid `any` - use `unknown` if type is truly unknown

### React/Next.js
- Use functional components with hooks
- Prefer Server Components by default, add `'use client'` only when needed
- Use `async/await` in Server Components for data fetching
- Colocate component-specific types in the same file

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PropertyCard.tsx` |
| Hooks | camelCase with `use` prefix | `usePropertyData.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FREE_REPORTS` |
| Types/Interfaces | PascalCase | `PropertyReport` |
| Database tables | snake_case | `property_reports` |
| API routes | kebab-case | `/api/property-data` |

### File Naming
- React components: `ComponentName.tsx`
- Hooks: `useHookName.ts`
- Utilities: `utilityName.ts`
- Types: `types.ts` or `ComponentName.types.ts`

## Component Patterns

### Server Components (Default)
```tsx
// src/app/property/[id]/page.tsx
import { getPropertyData } from '@/lib/api/property-data';

interface Props {
  params: { id: string };
}

export default async function PropertyPage({ params }: Props) {
  const property = await getPropertyData(params.id);
  return <PropertyReport property={property} />;
}
```

### Client Components
```tsx
// src/components/search/AddressSearch.tsx
'use client';

import { useState } from 'react';

export function AddressSearch() {
  const [query, setQuery] = useState('');
  // ...
}
```

## Database Schema Conventions

### Table Naming
- Use plural snake_case: `users`, `property_reports`, `saved_properties`
- Junction tables: `user_saved_properties`

### Column Naming
- Use snake_case: `created_at`, `user_id`, `property_address`
- Foreign keys: `{table_singular}_id` (e.g., `user_id`)
- Timestamps: `created_at`, `updated_at`

### Required Columns
Every table should have:
- `id` (UUID, primary key)
- `created_at` (timestamp with timezone)
- `updated_at` (timestamp with timezone, optional)

## API Conventions

### Route Handlers
```tsx
// src/app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // ... logic
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
```

### Error Responses
```json
{
  "error": "Human readable message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Property Data API
PROPERTY_API_KEY=
PROPERTY_API_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Google (for address autocomplete)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## Git Conventions

### Branch Naming
- `feature/feature-name`
- `fix/bug-description`
- `refactor/what-changed`

### Commit Messages
Use conventional commits:
- `feat: add address autocomplete`
- `fix: correct ARV calculation`
- `refactor: extract valuation logic`
- `docs: update API documentation`
- `style: format calculator component`
- `test: add property report tests`

## Testing

### File Location
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

### Naming
- `ComponentName.test.tsx`
- `utilityName.test.ts`

## Subagent Architecture

This project uses specialized AI subagents for complex features. Each agent has a dedicated specification file in `docs/agents/`:

1. **address-search.md** - Address lookup, autocomplete, geocoding
2. **property-report.md** - Report generation, data aggregation
3. **valuation-engine.md** - Current value, ARV, comp analysis
4. **napkin-calculator.md** - Deal analysis, ROI calculations
5. **ai-assistant.md** - GPT-4 integration, Q&A

When working on a feature, read the corresponding agent spec first.

## Key Business Rules

### Free Tier Limits
- Unlimited address searches
- Limited full property reports (exact limit TBD)
- No PDF export
- No email digest

### Pro Tier Features
- Unlimited property reports
- PDF export
- Weekly email digest
- Priority support

### Data Handling
- Missing data should show AI-estimated values with confidence indicators
- All US addresses supported, with "limited data" warnings where applicable
- Comp radius: configurable, default 1 mile

## Performance Guidelines

- Use React Server Components for data fetching
- Implement proper loading states with Suspense
- Lazy load heavy components (maps, charts)
- Cache API responses where appropriate
- Optimize images with Next.js Image component

## Security

- Validate all user input server-side
- Use Supabase RLS (Row Level Security) for data access
- Never expose API keys to client
- Sanitize AI responses before rendering
- Rate limit API endpoints

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Test
npm run test
```
