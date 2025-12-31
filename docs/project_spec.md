# Ruby AI - Product Specification

## Executive Summary

Ruby AI is an AI-powered web application for residential real estate investment analysis. The platform enables investors to search any US property address, receive comprehensive valuation reports, analyze deals with a back-of-the-napkin calculator, and consult an AI investment advisor.

**Target Users**: Individual real estate investors focusing on fix-and-flip and BRRRR strategies.

**Business Model**: Freemium SaaS with two tiers (Free and Pro).

---

## Core Features

### 1. Address Search

**Purpose**: Enable users to quickly find and select any US property.

**Requirements**:
- Real-time autocomplete as user types
- Support for full addresses, partial addresses, and parcel numbers
- Powered by Google Places API for autocomplete
- Geocoding for latitude/longitude
- Recent searches saved for logged-in users

**User Flow**:
1. User begins typing address in search bar
2. Autocomplete suggestions appear after 2-3 characters
3. User selects address from dropdown
4. System validates address and redirects to property page

**Technical Notes**:
- Debounce autocomplete requests (300ms)
- Cache recent autocomplete results
- Handle edge cases: PO boxes, new constructions, rural addresses

---

### 2. Property Report

**Purpose**: Provide comprehensive property information at a glance.

**Data Points to Display**:

| Category | Fields |
|----------|--------|
| **Basic Info** | Address, property type, year built, lot size, living area (sqft), beds, baths |
| **Valuation** | Current estimated value, ARV (After Repair Value), value range |
| **Price History** | Previous sales with dates and prices, price trend chart |
| **Tax Info** | Annual property tax, tax assessment value |
| **Market Context** | Days on market (if listed), median neighborhood price |

**Comparable Properties Section**:
- Display 3-6 comparable sales
- Show as cards with property photos
- Include: address, sale price, sale date, sqft, beds/baths
- Allow user to adjust comp selection for ARV calculation

**Missing Data Handling**:
- Use AI to estimate missing values
- Display confidence indicator (High/Medium/Low)
- Show "Estimated" badge on AI-generated values

---

### 3. Back-of-the-Napkin Calculator

**Purpose**: The defining feature - a single-page deal analyzer for quick investment decisions.

**Supported Strategies**:
1. **Fix & Flip**: Buy, renovate, sell
2. **BRRRR**: Buy, Rehab, Rent, Refinance, Repeat

**Calculator Layout** (Single Page):

```
┌─────────────────────────────────────────────────────────────┐
│                    DEAL ANALYZER                            │
├─────────────────────────────────────────────────────────────┤
│  ACQUISITION                    │  RENOVATION               │
│  ─────────────                  │  ───────────              │
│  Purchase Price: $________      │  Scope: [Light ▼]         │
│  Closing Costs:  $________      │  Est. Cost: $_______      │
│  Points/Fees:    $________      │  Contingency: ___%        │
│                                 │                           │
├─────────────────────────────────────────────────────────────┤
│  FINANCING                      │  HOLDING COSTS            │
│  ───────────                    │  ──────────────           │
│  [○ Cash] [● Loan]              │  Hold Period: ___ months  │
│  Down Payment: ___%             │  ☑ Interest    $_____/mo  │
│  Interest Rate: ___%            │  ☑ Taxes       $_____/mo  │
│  Loan Term: ___                 │  ☑ Insurance   $_____/mo  │
│                                 │  ☑ Utilities   $_____/mo  │
│                                 │  ☐ HOA        $_____/mo   │
├─────────────────────────────────────────────────────────────┤
│  EXIT                           │  FINAL METRICS            │
│  ────                           │  ─────────────            │
│  ARV (Sale Price): $_______     │  Total Investment: $XXX   │
│  Selling Costs: ___%            │  Net Profit: $XXX         │
│  Agent Commission: ___%         │  ROI: XX.X%               │
│                                 │  Cash-on-Cash: XX.X%      │
│                                 │  $/Month Held: $XXX       │
└─────────────────────────────────────────────────────────────┘
```

**Renovation Cost Presets**:
| Scope | $/sqft | Description |
|-------|--------|-------------|
| Cosmetic | $15-20 | Paint, flooring, fixtures |
| Light | $25-35 | Cosmetic + minor kitchen/bath updates |
| Medium | $40-50 | Kitchen/bath remodel, some systems |
| Heavy | $60-80 | Full gut, new systems |
| Addition | $100-150 | Adding square footage |

**Default Holding Costs** (User-configurable):
- Interest on loan
- Property taxes (auto-populated from property data)
- Insurance (estimated based on value)
- Utilities ($200/month default)
- HOA (if applicable)
- Maintenance reserve

**Calculated Metrics**:
- **Total Investment**: All cash required
- **Net Profit**: ARV - Total Costs
- **ROI**: (Net Profit / Total Investment) x 100
- **Cash-on-Cash Return**: For leveraged deals
- **Profit per Month Held**: Net Profit / Hold Period

**BRRRR Mode Additions**:
- Monthly rent estimate (from property data)
- Refinance terms (LTV, rate)
- Cash left in deal after refinance
- Monthly cash flow

---

### 4. AI Property Assistant

**Purpose**: Answer any question about a property or investment strategy.

**Capabilities**:
- Property-specific questions (value, history, features)
- Neighborhood information (schools, crime, amenities)
- Investment analysis (is this a good deal?)
- Strategy recommendations
- Market trend insights
- Risk assessment

**Preset Questions** (Categorized):

**Valuation (4 questions)**:
- What factors are affecting this property's value?
- How does this compare to similar properties in the area?
- What's the realistic ARV after a full renovation?
- Has this property appreciated or depreciated over time?

**Location (4 questions)**:
- What's the neighborhood like?
- How are the schools in this area?
- What's the crime rate compared to surrounding areas?
- What amenities are nearby?

**Investment (4 questions)**:
- Is this a good flip opportunity?
- What renovation scope would you recommend?
- What are the biggest risks with this property?
- How long would it take to sell after renovation?

**Market (3 questions)**:
- Is this a buyer's or seller's market?
- What's the trend for property values here?
- How does rental demand look in this area?

**Interface**:
- Chat-style interface in a slide-out panel
- Preset questions shown as clickable chips
- Custom question search bar
- Response streaming for better UX
- Conversation history (session-only)

**Context Injection**:
The AI receives full property context including:
- All property data points
- Comparable sales data
- Calculator inputs/results (if available)
- Neighborhood statistics

---

### 5. Portfolio & Comparison

**Purpose**: Save properties and compare investment opportunities.

**Portfolio Features**:
- Save any property to favorites
- Organize with tags/labels (optional)
- Quick-view cards showing key metrics
- Sort by: date added, ROI, price, ARV

**Comparison Tool**:
- Select 2-4 properties to compare
- Side-by-side metrics table
- Visual comparison charts
- Export comparison (Pro only)

**Dashboard View**:
- Recent searches
- Saved properties grid
- Market alerts summary (future)

---

## User Tiers

### Free Tier
| Feature | Limit |
|---------|-------|
| Address searches | Unlimited |
| Property reports | 5 per month |
| Calculator usage | Unlimited |
| AI questions | 10 per month |
| Save properties | 10 max |
| PDF export | No |
| Email digest | No |

### Pro Tier ($29/month suggested)
| Feature | Limit |
|---------|-------|
| Address searches | Unlimited |
| Property reports | Unlimited |
| Calculator usage | Unlimited |
| AI questions | Unlimited |
| Save properties | Unlimited |
| PDF export | Yes |
| Email digest | Weekly |
| Priority support | Yes |

---

## User Authentication

### Supported Methods
1. Email + Password
2. Google Sign-In
3. Apple Sign-In

### Auth Flow
1. Landing page with Sign Up / Log In buttons
2. Email verification required for new accounts
3. Password reset via email link
4. Session persistence (30 days)

### User Data Model
```typescript
interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  tier: 'free' | 'pro';
  stripe_customer_id: string | null;
  reports_used_this_month: number;
  ai_questions_used_this_month: number;
  created_at: Date;
  updated_at: Date;
}
```

---

## Database Schema

### Tables

**users**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | Unique, required |
| name | text | Display name |
| avatar_url | text | Profile image |
| tier | text | 'free' or 'pro' |
| stripe_customer_id | text | For billing |
| created_at | timestamptz | Account creation |
| updated_at | timestamptz | Last update |

**property_reports**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| address | text | Full address |
| property_data | jsonb | Cached property data |
| comps | jsonb | Comparable properties |
| created_at | timestamptz | Report generation time |

**saved_properties**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| address | text | Property address |
| property_data | jsonb | Property snapshot |
| notes | text | User notes |
| tags | text[] | User-defined tags |
| created_at | timestamptz | When saved |

**calculator_analyses**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| property_id | uuid | FK to saved_properties (nullable) |
| address | text | Property address |
| inputs | jsonb | All calculator inputs |
| results | jsonb | Calculated metrics |
| strategy | text | 'flip' or 'brrrr' |
| created_at | timestamptz | Analysis time |

**usage_tracking**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| action | text | 'report', 'ai_question', etc. |
| metadata | jsonb | Additional context |
| created_at | timestamptz | When action occurred |

---

## API Integrations

### Property Data (Primary: RealtyMole)
- Property details
- Valuations (AVM)
- Rental estimates
- Sales history
- Comparable sales

**Fallback**: ATTOM Data (more comprehensive, higher cost)

### Address Autocomplete (Google Places)
- Address suggestions
- Place details
- Geocoding

### AI (OpenAI GPT-4)
- Property Q&A
- Value estimation for missing data
- Investment recommendations

### Payments (Stripe)
- Subscription management
- Usage-based billing (future)
- Customer portal

---

## UI/UX Specifications

### Visual Style
- **Aesthetic**: Bold and dynamic
- **Layout**: Card-based with dashboard elements
- **Typography**: Clean, modern sans-serif
- **Animations**: Subtle, purposeful micro-interactions

### Color Palette
Designer's discretion with these guidelines:
- Primary brand color (used sparingly)
- Success/positive: Green tones
- Warning/caution: Amber/yellow
- Negative/loss: Red tones
- Neutrals: For most UI elements

### Responsive Design
- Desktop-first, fully responsive to mobile
- Breakpoints: 640px, 768px, 1024px, 1280px
- Mobile: Stack layouts, bottom navigation
- Touch-friendly tap targets (44px minimum)

### Loading States
- Skeleton loaders for content
- Progress indicators for calculations
- Optimistic updates where appropriate

---

## Landing Page Specification

### Goal
Capture email addresses for waitlist before full app launch.

### Sections
1. **Hero**: App name, tagline, email capture form
2. **Value Props**: 3-4 key benefits with icons
3. **Features Preview**: Visual mockups of main features
4. **Waitlist CTA**: Secondary email capture
5. **Footer**: Basic legal links

### Email Capture
- Single field: email address only
- Submit button: "Join the Waitlist"
- Success message: "You're on the list!"
- Store in Supabase `waitlist` table

### Style
- Match main app aesthetic (bold, dynamic)
- Engaging animations
- Professional but exciting tone

---

## Development Phases

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| 0 | Foundation | Project setup, landing page, documentation |
| 1 | Infrastructure | Auth, database, app shell |
| 2 | Search | Address autocomplete, basic property view |
| 3 | Reports | Valuations, comps, property details |
| 4 | Calculator | Back-of-napkin deal analyzer |
| 5 | AI | Property assistant Q&A |
| 6 | Portfolio | Save, compare, dashboard |
| 7 | Monetization | Stripe, PDF export, tier limits |
| 8 | Polish | Email digest, performance, refinements |

---

## Success Metrics

### Launch Goals (Phase 0-2)
- Landing page live
- 100+ waitlist signups
- Core search functioning

### MVP Goals (Phase 3-5)
- 50 beta users
- < 3 second property report load time
- 80% accuracy on ARV estimates (vs. actual sales)

### Growth Goals (Phase 6-8)
- 10% conversion free to pro
- < 5% monthly churn
- NPS > 50

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API costs exceed budget | High | Implement aggressive caching, usage limits |
| Data accuracy issues | High | Multiple data sources, user feedback, AI estimation with confidence |
| Competition (FrontFlip, etc.) | Medium | Focus on calculator as differentiator, better UX |
| Low conversion to Pro | Medium | Strong free tier, clear upgrade value |

---

## Open Questions

1. **Exact free tier limits**: Need to balance user value with API costs
2. **Pro pricing**: $29/month suggested, needs validation
3. **App name**: "Ruby" is working title, finalize before launch
4. **Beta testing strategy**: Invite-only or open beta?
