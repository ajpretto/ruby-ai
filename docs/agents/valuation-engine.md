# Valuation Engine Agent Specification

## Purpose
Calculate accurate property valuations including current value, After Repair Value (ARV), and land values based on comparable sales analysis.

## Responsibilities

1. **Current Value Estimation**
   - Analyze comparable sales
   - Adjust for property differences
   - Calculate confidence intervals

2. **ARV Calculation**
   - Identify renovated comparable properties
   - Project post-renovation value
   - Factor in renovation scope

3. **Comp Analysis**
   - Select appropriate comparables
   - Apply adjustment factors
   - Weight by relevance

4. **AI-Assisted Estimation**
   - Fill gaps in data
   - Provide confidence levels
   - Explain valuation reasoning

## Technical Implementation

### Libraries
- `src/lib/valuation/currentValue.ts` - Current value calculation
- `src/lib/valuation/arv.ts` - ARV estimation
- `src/lib/valuation/compAnalysis.ts` - Comparable analysis
- `src/lib/valuation/adjustments.ts` - Adjustment factors
- `src/lib/valuation/aiEstimation.ts` - AI fallback estimation

### Hooks
- `useValuation(propertyId: string)` - Full valuation data
- `useComps(propertyId: string)` - Comparable properties

## Valuation Methodology

### Comparable Selection Criteria

**Distance Radius:**
- Urban: 0.5 mile radius
- Suburban: 1 mile radius
- Rural: 3-5 mile radius

**Time Frame:**
- Primary: Last 6 months
- Extended: Last 12 months (if insufficient data)

**Property Matching:**
- Same property type (single family, condo, etc.)
- Similar size (within 20% sqft)
- Similar bed/bath count (within 1)
- Similar lot size (within 30%)
- Similar age (within 15 years)

### Adjustment Factors

```typescript
interface AdjustmentFactors {
  // Per-unit adjustments
  sqftAdjustment: number;        // $ per sqft difference
  bedroomAdjustment: number;     // $ per bedroom difference
  bathroomAdjustment: number;    // $ per bathroom difference
  ageAdjustment: number;         // $ per year difference
  lotSizeAdjustment: number;     // $ per acre difference

  // Percentage adjustments
  conditionAdjustment: number;   // % for condition difference
  locationAdjustment: number;    // % for micro-location
  timeAdjustment: number;        // % per month since sale
}
```

### Standard Adjustments

| Factor | Typical Adjustment |
|--------|-------------------|
| Square Footage | $100-150 per sqft |
| Bedroom | $5,000-15,000 per room |
| Bathroom | $10,000-20,000 per bath |
| Garage | $10,000-25,000 per car |
| Pool | $10,000-30,000 |
| Age | -0.5% per year older |
| Time (market) | +0.5% per month |

### Value Calculation

```typescript
function calculateValue(subject: Property, comps: Comparable[]): Valuation {
  const adjustedValues = comps.map(comp => {
    let adjustedPrice = comp.salePrice;

    // Square footage adjustment
    const sqftDiff = subject.squareFeet - comp.squareFeet;
    adjustedPrice += sqftDiff * SQFT_ADJUSTMENT;

    // Bedroom adjustment
    const bedDiff = subject.bedrooms - comp.bedrooms;
    adjustedPrice += bedDiff * BEDROOM_ADJUSTMENT;

    // Bathroom adjustment
    const bathDiff = subject.bathrooms - comp.bathrooms;
    adjustedPrice += bathDiff * BATHROOM_ADJUSTMENT;

    // Age adjustment
    const ageDiff = comp.yearBuilt - subject.yearBuilt;
    adjustedPrice *= (1 + ageDiff * AGE_ADJUSTMENT_PERCENT);

    // Time adjustment (market appreciation)
    const monthsSinceSale = getMonthsSince(comp.saleDate);
    adjustedPrice *= (1 + monthsSinceSale * MONTHLY_APPRECIATION);

    return {
      comp,
      adjustedPrice,
      adjustments: { sqft: sqftDiff, beds: bedDiff, baths: bathDiff, age: ageDiff }
    };
  });

  // Weight by relevance (closer matches weighted higher)
  const weightedAvg = calculateWeightedAverage(adjustedValues);

  return {
    estimatedValue: weightedAvg,
    range: calculateConfidenceInterval(adjustedValues),
    confidence: determineConfidence(comps.length, adjustedValues)
  };
}
```

## ARV Calculation

### Finding Renovated Comps

Identify renovated properties by:
- Recent sale after renovation
- Significant price increase
- Updated MLS description keywords: "remodeled", "renovated", "updated"
- Recent permit activity

### ARV Methodology

```typescript
function calculateARV(subject: Property, renovationScope: RenovationScope): ARV {
  // Find renovated comps with similar scope
  const renovatedComps = findRenovatedComps(subject.location, {
    minRenovationLevel: renovationScope,
    radius: 1, // mile
    timeframe: 12 // months
  });

  if (renovatedComps.length >= 3) {
    // Use comp-based approach
    return calculateFromComps(subject, renovatedComps);
  } else {
    // Use AI-assisted estimation
    return estimateWithAI(subject, renovationScope);
  }
}
```

### Renovation Scope Multipliers

| Scope | Typical Value Add | Example |
|-------|-------------------|---------|
| Cosmetic | 5-10% | Paint, fixtures, landscaping |
| Light | 15-25% | Kitchen/bath updates, flooring |
| Medium | 25-40% | Full kitchen/bath remodel |
| Heavy | 40-60% | Gut renovation |
| Addition | Variable | Based on sqft added |

## Data Model

```typescript
interface Valuation {
  currentValue: number;
  valueRange: {
    low: number;
    high: number;
  };
  confidence: 'high' | 'medium' | 'low';
  methodology: 'comp_based' | 'ai_estimated' | 'hybrid';

  arv: number | null;
  arvRange: {
    low: number;
    high: number;
  } | null;
  arvConfidence: 'high' | 'medium' | 'low' | null;

  pricePerSqft: number;
  marketPricePerSqft: number;

  comps: AdjustedComp[];
  aiExplanation: string | null;
}

interface AdjustedComp {
  comp: Comparable;
  adjustedPrice: number;
  adjustments: {
    sqft: number;
    beds: number;
    baths: number;
    age: number;
    condition: number;
    time: number;
    total: number;
  };
  weight: number;
  relevanceScore: number;
}
```

## Confidence Scoring

```typescript
function determineConfidence(
  compCount: number,
  adjustments: AdjustedComp[],
  dataQuality: DataQuality
): 'high' | 'medium' | 'low' {
  let score = 0;

  // Comp count factor
  if (compCount >= 5) score += 3;
  else if (compCount >= 3) score += 2;
  else score += 1;

  // Adjustment magnitude factor
  const avgAdjustment = average(adjustments.map(a => Math.abs(a.adjustments.total)));
  if (avgAdjustment < 10000) score += 3;
  else if (avgAdjustment < 25000) score += 2;
  else score += 1;

  // Data quality factor
  if (dataQuality === 'complete') score += 2;
  else if (dataQuality === 'partial') score += 1;

  // Threshold
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}
```

## AI Estimation

When traditional comp analysis is insufficient:

```typescript
async function estimateWithAI(
  property: Property,
  context: ValuationContext
): Promise<AIEstimate> {
  const prompt = `
    Estimate the value of this property:
    ${JSON.stringify(property)}

    Consider:
    - Nearby sales: ${JSON.stringify(context.nearbyPrices)}
    - Market trends: ${context.marketTrend}
    - Neighborhood median: ${context.neighborhoodMedian}

    Provide:
    1. Estimated value
    2. Value range (low-high)
    3. Confidence level
    4. Explanation of reasoning
  `;

  const response = await openai.chat({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });

  return parseAIResponse(response);
}
```

## Error Handling

| Scenario | Handling |
|----------|----------|
| No comps found | Expand radius, use AI estimation |
| Extreme adjustments | Flag for review, lower confidence |
| Outlier comps | Exclude from calculation |
| Missing property data | Use AI to estimate missing values |

## Performance Requirements

- Valuation calculation < 2 seconds
- Comp fetch < 1 second
- AI estimation < 5 seconds
- Cache valuations for 24 hours

## Testing Scenarios

1. Property with many good comps
2. Unique property with few comps
3. New construction
4. Fixer-upper (low condition)
5. Luxury property
6. Vacant land
7. Comparison of calculated vs actual sale price

## Dependencies

- RealtyMole API for comps
- OpenAI for AI estimation
- Market data for trend adjustments
