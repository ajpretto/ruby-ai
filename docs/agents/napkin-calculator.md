# Back-of-the-Napkin Calculator Agent Specification

## Purpose
Provide a single-page deal analysis tool that calculates investment returns for Fix & Flip and BRRRR strategies. This is the defining feature of the application.

## Responsibilities

1. **Deal Analysis**
   - Calculate all-in costs
   - Project returns and profit
   - Compare financing scenarios

2. **Renovation Estimation**
   - Provide cost presets by scope
   - Allow detailed line-item override
   - Track contingency

3. **Holding Cost Tracking**
   - Calculate monthly carrying costs
   - Project total holding period costs
   - User-configurable line items

4. **Final Metrics**
   - ROI calculation
   - Cash-on-Cash return
   - Net profit
   - Per-month profitability

## Technical Implementation

### Components
- `src/components/calculator/NapkinCalculator.tsx` - Main calculator
- `src/components/calculator/AcquisitionSection.tsx` - Purchase inputs
- `src/components/calculator/RenovationSection.tsx` - Rehab costs
- `src/components/calculator/FinancingSection.tsx` - Loan details
- `src/components/calculator/HoldingSection.tsx` - Carrying costs
- `src/components/calculator/ExitSection.tsx` - Sale projections
- `src/components/calculator/MetricsDisplay.tsx` - Final numbers

### Libraries
- `src/lib/calculator/calculations.ts` - Core calculation logic
- `src/lib/calculator/presets.ts` - Renovation cost presets
- `src/lib/calculator/validation.ts` - Input validation

### Hooks
- `useCalculator(propertyId?: string)` - Calculator state management
- `useCalculatorResults(inputs: CalculatorInputs)` - Computed results

## Calculator Layout

**Single Page Design** - All inputs and outputs visible simultaneously:

```
┌───────────────────────────────────────────────────────────────────┐
│                      DEAL ANALYZER                                 │
│  [Fix & Flip ●] [BRRRR ○]                    Property: 123 Main St │
├────────────────────────────────┬──────────────────────────────────┤
│  ACQUISITION                   │  RENOVATION                       │
│  ━━━━━━━━━━━━                  │  ━━━━━━━━━━━                      │
│  Purchase Price    $[350,000]  │  Scope: [Medium ▼]                │
│  Closing Costs %      [3   ]%  │  Estimated Cost    $[45,000]      │
│  Closing Costs $      $10,500  │  Contingency          [10]%       │
│                                │  Total Reno        $49,500        │
│  Total Acquisition   $360,500  │  [+ Customize Details]            │
├────────────────────────────────┼──────────────────────────────────┤
│  FINANCING                     │  HOLDING COSTS                    │
│  ━━━━━━━━━━━                   │  ━━━━━━━━━━━━━━                   │
│  [○ Cash] [● Loan]             │  Hold Period        [6] months    │
│  Down Payment         [20]%    │                                   │
│  Loan Amount        $280,000   │  ☑ Interest        $1,633/mo     │
│  Interest Rate        [7.5]%   │  ☑ Property Tax      $350/mo     │
│  Points              [2  ]%    │  ☑ Insurance         $150/mo     │
│  Points Cost          $5,600   │  ☑ Utilities         $200/mo     │
│                                │  ☐ HOA               $0/mo       │
│  Cash Required      $85,600    │  ☐ Lawn/Maint        $0/mo       │
│                                │                                   │
│                                │  Monthly Total      $2,333        │
│                                │  Holding Total     $13,998        │
├────────────────────────────────┼──────────────────────────────────┤
│  EXIT                          │  FINAL METRICS                    │
│  ━━━━                          │  ━━━━━━━━━━━━━━                   │
│  ARV (Sale Price)   $[475,000] │                                   │
│  Selling Costs          [2]%   │  Total Investment    $135,098     │
│  Agent Commission       [5]%   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Net Proceeds        $441,750  │  NET PROFIT          $81,252      │
│                                │  ROI                 60.1%        │
│                                │  Cash-on-Cash        94.9%        │
│                                │  $/Month Held        $13,542      │
│                                │                                   │
│                                │  [Save Analysis] [Share]          │
└────────────────────────────────┴──────────────────────────────────┘
```

## Data Models

### Calculator Inputs

```typescript
interface CalculatorInputs {
  // Strategy
  strategy: 'flip' | 'brrrr';

  // Acquisition
  purchasePrice: number;
  closingCostPercent: number;

  // Renovation
  renovationScope: 'cosmetic' | 'light' | 'medium' | 'heavy';
  renovationCost: number;           // Can be preset or custom
  contingencyPercent: number;
  customRenovation?: RenovationLineItems;

  // Financing
  financingType: 'cash' | 'loan';
  downPaymentPercent: number;
  interestRate: number;
  loanTermMonths?: number;          // For BRRRR refinance
  pointsPercent: number;

  // Holding
  holdPeriodMonths: number;
  holdingCosts: HoldingCostItems;

  // Exit
  arvSalePrice: number;
  sellingCostPercent: number;
  agentCommissionPercent: number;

  // BRRRR-specific
  monthlyRent?: number;
  refinanceLTV?: number;
  refinanceRate?: number;
}

interface HoldingCostItems {
  interest: { enabled: boolean; amount: number };
  propertyTax: { enabled: boolean; amount: number };
  insurance: { enabled: boolean; amount: number };
  utilities: { enabled: boolean; amount: number };
  hoa: { enabled: boolean; amount: number };
  lawnMaintenance: { enabled: boolean; amount: number };
  other: { enabled: boolean; amount: number; label?: string };
}

interface RenovationLineItems {
  kitchen: number;
  bathrooms: number;
  flooring: number;
  paint: number;
  exterior: number;
  roofing: number;
  hvac: number;
  electrical: number;
  plumbing: number;
  landscaping: number;
  other: number;
}
```

### Calculator Results

```typescript
interface CalculatorResults {
  // Costs breakdown
  acquisitionCost: number;
  closingCosts: number;
  renovationTotal: number;
  financingCosts: number;
  holdingCostsTotal: number;
  sellingCosts: number;

  // Totals
  totalInvestment: number;    // All cash required
  totalCost: number;          // All costs
  loanAmount: number;
  cashRequired: number;

  // Returns
  netProceeds: number;
  netProfit: number;
  roi: number;                 // Net Profit / Total Investment * 100
  cashOnCash: number;          // Net Profit / Cash Required * 100
  profitPerMonth: number;

  // BRRRR-specific
  refinanceAmount?: number;
  cashOutAfterRefi?: number;
  cashLeftInDeal?: number;
  monthlyCashFlow?: number;
}
```

## Calculation Logic

### Fix & Flip Calculation

```typescript
function calculateFlip(inputs: CalculatorInputs): CalculatorResults {
  // Acquisition
  const closingCosts = inputs.purchasePrice * (inputs.closingCostPercent / 100);
  const acquisitionCost = inputs.purchasePrice + closingCosts;

  // Renovation
  const contingency = inputs.renovationCost * (inputs.contingencyPercent / 100);
  const renovationTotal = inputs.renovationCost + contingency;

  // Financing
  let loanAmount = 0;
  let pointsCost = 0;
  let cashRequired = acquisitionCost + renovationTotal;

  if (inputs.financingType === 'loan') {
    loanAmount = inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100);
    pointsCost = loanAmount * (inputs.pointsPercent / 100);
    cashRequired = (inputs.purchasePrice * inputs.downPaymentPercent / 100)
                 + closingCosts
                 + pointsCost
                 + renovationTotal;
  }

  // Holding Costs
  const monthlyHolding = calculateMonthlyHolding(inputs, loanAmount);
  const holdingTotal = monthlyHolding * inputs.holdPeriodMonths;

  // Exit
  const sellingCosts = inputs.arvSalePrice * (inputs.sellingCostPercent / 100);
  const agentCommission = inputs.arvSalePrice * (inputs.agentCommissionPercent / 100);
  const netProceeds = inputs.arvSalePrice - sellingCosts - agentCommission - loanAmount;

  // Final Metrics
  const totalInvestment = cashRequired + holdingTotal;
  const netProfit = netProceeds - totalInvestment + loanAmount;
  const roi = (netProfit / totalInvestment) * 100;
  const cashOnCash = (netProfit / cashRequired) * 100;
  const profitPerMonth = netProfit / inputs.holdPeriodMonths;

  return {
    acquisitionCost,
    closingCosts,
    renovationTotal,
    financingCosts: pointsCost,
    holdingCostsTotal: holdingTotal,
    sellingCosts: sellingCosts + agentCommission,
    totalInvestment,
    totalCost: acquisitionCost + renovationTotal + holdingTotal + sellingCosts + agentCommission,
    loanAmount,
    cashRequired,
    netProceeds,
    netProfit,
    roi,
    cashOnCash,
    profitPerMonth
  };
}
```

### BRRRR Calculation

```typescript
function calculateBRRRR(inputs: CalculatorInputs): CalculatorResults {
  // Start with flip calculation
  const flipResults = calculateFlip(inputs);

  // Refinance
  const arvAfterRehab = inputs.arvSalePrice;
  const refinanceAmount = arvAfterRehab * (inputs.refinanceLTV / 100);
  const cashOutAfterRefi = refinanceAmount - flipResults.loanAmount;
  const cashLeftInDeal = flipResults.cashRequired - cashOutAfterRefi;

  // Monthly Cash Flow
  const monthlyMortgage = calculateMortgagePayment(
    refinanceAmount,
    inputs.refinanceRate,
    360 // 30-year
  );
  const monthlyExpenses = calculateMonthlyExpenses(inputs);
  const monthlyCashFlow = inputs.monthlyRent - monthlyMortgage - monthlyExpenses;

  return {
    ...flipResults,
    refinanceAmount,
    cashOutAfterRefi,
    cashLeftInDeal,
    monthlyCashFlow
  };
}
```

## Renovation Presets

```typescript
const RENOVATION_PRESETS = {
  cosmetic: {
    label: 'Cosmetic',
    description: 'Paint, fixtures, landscaping',
    perSqft: { low: 15, mid: 17, high: 20 }
  },
  light: {
    label: 'Light',
    description: 'Cosmetic + flooring, minor kitchen/bath updates',
    perSqft: { low: 25, mid: 30, high: 35 }
  },
  medium: {
    label: 'Medium',
    description: 'Kitchen/bath remodel, some systems',
    perSqft: { low: 40, mid: 45, high: 50 }
  },
  heavy: {
    label: 'Heavy',
    description: 'Full gut renovation, new systems',
    perSqft: { low: 60, mid: 70, high: 80 }
  }
};

function calculateRenovationCost(
  scope: keyof typeof RENOVATION_PRESETS,
  squareFeet: number
): number {
  const preset = RENOVATION_PRESETS[scope];
  return squareFeet * preset.perSqft.mid;
}
```

## Default Values

```typescript
const CALCULATOR_DEFAULTS: Partial<CalculatorInputs> = {
  closingCostPercent: 3,
  contingencyPercent: 10,
  downPaymentPercent: 20,
  interestRate: 7.5,
  pointsPercent: 2,
  holdPeriodMonths: 6,
  sellingCostPercent: 2,
  agentCommissionPercent: 5,
  holdingCosts: {
    interest: { enabled: true, amount: 0 }, // Calculated
    propertyTax: { enabled: true, amount: 350 },
    insurance: { enabled: true, amount: 150 },
    utilities: { enabled: true, amount: 200 },
    hoa: { enabled: false, amount: 0 },
    lawnMaintenance: { enabled: false, amount: 0 },
    other: { enabled: false, amount: 0 }
  }
};
```

## Auto-Population

When a property is selected, auto-fill:
- Purchase Price: Current listing or estimated value
- ARV: Calculated ARV from valuation engine
- Property Tax: From property data
- Square Feet: For renovation estimate

## Saving & Sharing

```typescript
interface SavedAnalysis {
  id: string;
  userId: string;
  propertyAddress: string | null;
  inputs: CalculatorInputs;
  results: CalculatorResults;
  createdAt: Date;
  updatedAt: Date;
}
```

## Validation Rules

- Purchase price must be > 0
- Down payment must be 0-100%
- Interest rate must be 0-30%
- Hold period must be 1-60 months
- ARV should be >= Purchase Price (warning if not)
- Renovation cost should be reasonable for scope (warning if outlier)

## Error States

| Error | Handling |
|-------|----------|
| Negative profit | Show in red, still display results |
| Invalid input | Show inline validation error |
| Missing required | Disable calculate, highlight field |
| ARV < Purchase | Show warning, allow calculation |

## Performance

- Calculations should be instant (< 50ms)
- Use React state for real-time updates
- Debounce inputs to prevent flicker

## Testing Scenarios

1. Simple cash flip
2. Leveraged flip with financing
3. Break-even deal
4. Losing deal
5. BRRRR with cash-out refinance
6. High holding costs
7. Various renovation scopes
8. Edge cases (0 values, max values)

## Dependencies

- Property data for auto-population
- Valuation engine for ARV
