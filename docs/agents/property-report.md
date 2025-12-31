# Property Report Agent Specification

## Purpose
Generate comprehensive property reports by aggregating data from multiple sources and presenting it in a clear, actionable format.

## Responsibilities

1. **Data Aggregation**
   - Fetch property details from data APIs
   - Combine data from multiple sources
   - Handle missing data gracefully

2. **Report Generation**
   - Structure data into report sections
   - Calculate derived metrics
   - Cache reports for performance

3. **Usage Tracking**
   - Track report generation per user
   - Enforce tier limits
   - Show remaining report count

4. **PDF Export** (Pro only)
   - Generate downloadable PDF reports
   - Include all property data and comps

## Technical Implementation

### Components
- `src/components/report/PropertyReport.tsx` - Main report container
- `src/components/report/PropertyOverview.tsx` - Basic info section
- `src/components/report/ValuationSection.tsx` - Value estimates
- `src/components/report/CompsGrid.tsx` - Comparable properties
- `src/components/report/PriceHistory.tsx` - Historical price chart
- `src/components/report/TaxInfo.tsx` - Tax details
- `src/components/report/ExportButton.tsx` - PDF download (Pro)

### API Routes
- `src/app/api/property/[id]/route.ts` - Get property data
- `src/app/api/property/[id]/report/route.ts` - Generate full report
- `src/app/api/property/[id]/export/route.ts` - PDF generation

### Libraries
- `@react-pdf/renderer` or `puppeteer` for PDF generation
- `recharts` or `chart.js` for price history visualization

### Hooks
- `usePropertyReport(propertyId: string)` - Fetch and cache report
- `useReportUsage()` - Track user's report usage

## Data Model

```typescript
interface PropertyReport {
  id: string;
  address: string;
  generatedAt: Date;

  // Basic Info
  propertyType: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land';
  yearBuilt: number | null;
  squareFeet: number | null;
  lotSize: number | null;
  bedrooms: number | null;
  bathrooms: number | null;

  // Valuation
  currentValue: number;
  valueConfidence: 'high' | 'medium' | 'low';
  valueRange: { low: number; high: number };
  arvEstimate: number | null;

  // History
  priceHistory: PricePoint[];
  lastSaleDate: Date | null;
  lastSalePrice: number | null;

  // Tax
  annualTax: number | null;
  assessedValue: number | null;

  // Market
  daysOnMarket: number | null;
  medianNeighborhoodPrice: number | null;

  // Comps
  comparables: Comparable[];

  // Meta
  dataSource: string;
  missingFields: string[];
}

interface PricePoint {
  date: Date;
  price: number;
  event: 'sale' | 'listing' | 'assessment';
}

interface Comparable {
  address: string;
  distance: number; // miles
  salePrice: number;
  saleDate: Date;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  pricePerSqft: number;
  photoUrl: string | null;
}
```

## Report Sections Layout

```
┌─────────────────────────────────────────────────┐
│  PROPERTY OVERVIEW                              │
│  123 Main Street, Anytown, USA 12345           │
│  [Photo]  Single Family | 3 bed | 2 bath       │
│           1,850 sqft | Built 1998              │
├─────────────────────────────────────────────────┤
│  VALUATION                                      │
│  Current Value: $425,000 (High Confidence)     │
│  Range: $400,000 - $450,000                    │
│  Estimated ARV: $525,000                       │
├─────────────────────────────────────────────────┤
│  PRICE HISTORY                                  │
│  [Line Chart showing historical values]         │
│  Last Sale: $350,000 (Jan 2019)               │
├─────────────────────────────────────────────────┤
│  COMPARABLE SALES                               │
│  [Card] [Card] [Card] [Card]                   │
│  (Photo, address, price, sqft, date)           │
├─────────────────────────────────────────────────┤
│  TAX INFORMATION                                │
│  Annual Tax: $4,200 | Assessed: $380,000      │
└─────────────────────────────────────────────────┘
```

## Missing Data Handling

For each field that might be missing:

| Field | Fallback Strategy |
|-------|-------------------|
| Year Built | Estimate from tax records or show "Unknown" |
| Square Feet | Calculate from lot size and typical coverage |
| Current Value | AI estimate based on comps |
| Photo | Show placeholder image |
| Price History | Show available data points only |

Display confidence indicators:
- Green badge: "Verified" - from authoritative source
- Yellow badge: "Estimated" - AI or algorithmic estimate
- Gray badge: "Unknown" - could not determine

## API Integration

### Primary: RealtyMole API

```typescript
// Property details
GET https://realty-mole-property-api.p.rapidapi.com/properties/{address}

// Comparable sales
GET https://realty-mole-property-api.p.rapidapi.com/saleComparables/{address}
```

### Fallback: ATTOM Data

```typescript
// Property details
GET https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail
```

## Caching Strategy

- Cache property data for 24 hours
- Cache comps for 7 days
- Store in Supabase `property_reports` table
- Invalidate on user request (refresh button)

## Usage Limits

```typescript
async function canGenerateReport(userId: string): Promise<boolean> {
  const user = await getUser(userId);

  if (user.tier === 'pro') return true;

  const monthlyUsage = await getMonthlyReportCount(userId);
  return monthlyUsage < FREE_TIER_REPORT_LIMIT;
}
```

## Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Property not found | "We couldn't find data for this property" | Offer to submit for manual review |
| API failure | "Report generation failed" | Retry, then show cached version if available |
| Usage limit | "You've reached your monthly limit" | Show upgrade prompt |
| Partial data | "Some information is unavailable" | Display what's available |

## PDF Export Requirements

PDF should include:
- All visible report sections
- Ruby AI branding
- Generation timestamp
- Disclaimer about data accuracy
- Clean, printable formatting

## Performance Requirements

- Initial report load < 3 seconds
- Cached report load < 500ms
- PDF generation < 10 seconds
- Lazy load comps photos

## Testing Scenarios

1. Property with complete data
2. Property with missing fields
3. New construction (limited history)
4. Vacant land (different data points)
5. Recently sold property
6. Free tier at limit
7. PDF export

## Dependencies

- RealtyMole API key
- Supabase for caching
- PDF generation library
- Charting library
