# AI Property Assistant Agent Specification

## Purpose
Provide a comprehensive AI-powered Q&A assistant that can answer any question about a property, neighborhood, or investment strategy using GPT-4.

## Responsibilities

1. **Property Q&A**
   - Answer questions about specific properties
   - Explain valuations and comps
   - Assess property condition and features

2. **Investment Advice**
   - Evaluate deal quality
   - Suggest renovation strategies
   - Identify risks and opportunities

3. **Market Intelligence**
   - Neighborhood analysis
   - Market trends
   - Rental demand

4. **Preset Questions**
   - Curated common questions
   - Categorized by topic
   - Dynamic suggestions based on property

## Technical Implementation

### Components
- `src/components/ai-assistant/AIChatPanel.tsx` - Main chat interface
- `src/components/ai-assistant/PresetQuestions.tsx` - Preset question chips
- `src/components/ai-assistant/ChatMessage.tsx` - Individual message display
- `src/components/ai-assistant/ChatInput.tsx` - Question input field

### API Routes
- `src/app/api/ai/chat/route.ts` - Chat endpoint with streaming
- `src/app/api/ai/presets/route.ts` - Get preset questions

### Libraries
- `src/lib/ai/prompts.ts` - System prompts and templates
- `src/lib/ai/context.ts` - Context injection logic
- `src/lib/ai/streaming.ts` - SSE streaming utilities

### Hooks
- `useAIChat(propertyId: string)` - Chat state management
- `usePresetQuestions(propertyType: string)` - Preset questions

## Chat Interface Design

```
┌─────────────────────────────────────────────────┐
│  Property Assistant                        [X]  │
├─────────────────────────────────────────────────┤
│  📍 123 Main Street, Anytown, USA              │
├─────────────────────────────────────────────────┤
│  PRESET QUESTIONS                               │
│  ┌─────────────┐ ┌──────────────┐              │
│  │ Valuation   │ │ Investment   │              │
│  └─────────────┘ └──────────────┘              │
│  ┌─────────────┐ ┌──────────────┐              │
│  │ Neighborhood│ │ Market       │              │
│  └─────────────┘ └──────────────┘              │
├─────────────────────────────────────────────────┤
│  [How you can help me analyze this property]   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🤖 I can help you understand this        │   │
│  │ property's investment potential. Here's  │   │
│  │ what I can tell you about 123 Main St:   │   │
│  │                                          │   │
│  │ • Current estimated value: $425,000      │   │
│  │ • Potential ARV: $525,000                │   │
│  │ • Location: B+ neighborhood              │   │
│  │                                          │   │
│  │ What would you like to know more about?  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 👤 Is this a good flip opportunity?      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🤖 Based on my analysis, this could be   │   │
│  │ a good flip opportunity. Here's why...   │   │
│  │ [streaming response continues...]        │   │
│  └─────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│  [Ask a question about this property...]   [→] │
└─────────────────────────────────────────────────┘
```

## Preset Questions

### Valuation (4 questions)
```typescript
const VALUATION_QUESTIONS = [
  "What factors are affecting this property's current value?",
  "How does this property compare to similar homes in the area?",
  "What's a realistic ARV after a full renovation?",
  "Has this property appreciated or depreciated over time?"
];
```

### Location (4 questions)
```typescript
const LOCATION_QUESTIONS = [
  "What's the neighborhood like for families?",
  "How are the schools rated in this area?",
  "What's the crime situation compared to surrounding areas?",
  "What amenities and attractions are nearby?"
];
```

### Investment (4 questions)
```typescript
const INVESTMENT_QUESTIONS = [
  "Is this a good flip opportunity and why?",
  "What renovation scope would you recommend?",
  "What are the biggest risks with this investment?",
  "How long would it realistically take to sell after renovation?"
];
```

### Market (3 questions)
```typescript
const MARKET_QUESTIONS = [
  "Is this currently a buyer's or seller's market here?",
  "What's the trend for property values in this area?",
  "How strong is the rental demand in this neighborhood?"
];
```

## Context Injection

The AI receives comprehensive context about the property:

```typescript
interface AIContext {
  // Property basics
  property: {
    address: string;
    type: string;
    yearBuilt: number;
    squareFeet: number;
    bedrooms: number;
    bathrooms: number;
    lotSize: number;
  };

  // Valuation data
  valuation: {
    currentValue: number;
    arvEstimate: number;
    pricePerSqft: number;
    confidence: string;
  };

  // Comparable sales
  comps: Array<{
    address: string;
    salePrice: number;
    saleDate: string;
    squareFeet: number;
    condition: string;
  }>;

  // Neighborhood data
  neighborhood: {
    medianPrice: number;
    medianRent: number;
    schoolRating: number;
    crimeIndex: number;
    walkScore: number;
  };

  // Market data
  market: {
    daysOnMarket: number;
    inventoryLevel: string;
    priceGrowth1yr: number;
    priceGrowth5yr: number;
  };

  // Calculator results (if available)
  analysis?: {
    purchasePrice: number;
    renovationBudget: number;
    arv: number;
    projectedProfit: number;
    roi: number;
  };
}
```

## System Prompt

```typescript
const SYSTEM_PROMPT = `You are an expert real estate investment advisor built into Ruby AI,
a property analysis platform. You help investors evaluate residential properties for
fix-and-flip and BRRRR strategies.

## Your Capabilities
- Analyze property values and ARV potential
- Assess neighborhood quality and trends
- Evaluate investment returns and risks
- Recommend renovation scopes
- Compare to market conditions

## Communication Style
- Be direct and actionable
- Use specific numbers when available
- Acknowledge uncertainty appropriately
- Focus on investor-relevant insights
- Keep responses concise but thorough

## Context
You have access to detailed property data, comparable sales, neighborhood statistics,
and market trends. Use this data to provide specific, data-backed answers.

## Limitations
- Don't provide legal, tax, or financial advice
- Recommend professional inspections for condition
- Note when data may be incomplete or estimated
- Suggest due diligence for important decisions

## Current Property Context
{contextJson}
`;
```

## API Implementation

### Chat Endpoint with Streaming

```typescript
// src/app/api/ai/chat/route.ts
import { OpenAI } from 'openai';
import { getPropertyContext } from '@/lib/ai/context';

export async function POST(request: Request) {
  const { propertyId, message, history } = await request.json();

  // Get property context
  const context = await getPropertyContext(propertyId);

  // Build messages
  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT.replace('{contextJson}', JSON.stringify(context))
    },
    ...history.map(h => ({
      role: h.role,
      content: h.content
    })),
    {
      role: 'user',
      content: message
    }
  ];

  // Create streaming response
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
    max_tokens: 1000,
    temperature: 0.7
  });

  // Return as SSE stream
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(new TextEncoder().encode(`data: ${text}\n\n`));
        }
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      }
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    }
  );
}
```

## Data Models

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  propertyId: string;
  messages: ChatMessage[];
  createdAt: Date;
}
```

## Usage Tracking

```typescript
async function trackAIUsage(userId: string): Promise<boolean> {
  const user = await getUser(userId);

  if (user.tier === 'pro') return true;

  const monthlyUsage = await getMonthlyAIQuestionCount(userId);
  if (monthlyUsage >= FREE_TIER_AI_LIMIT) {
    throw new UsageLimitError('AI question limit reached');
  }

  await incrementAIUsage(userId);
  return true;
}
```

## Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Rate limit | "I'm getting a lot of questions. Please wait a moment." | Exponential backoff |
| Token limit | "That's a complex question. Let me give you a summary." | Truncate context |
| API failure | "I'm having trouble connecting. Please try again." | Retry with fallback |
| Usage limit | "You've used your free AI questions this month." | Show upgrade prompt |

## Response Guidelines

### Good Responses
- Use specific numbers: "The ARV is estimated at $525,000, which is 23% above current value"
- Reference data: "Based on the 5 comparable sales I analyzed..."
- Be actionable: "I recommend a medium renovation scope because..."
- Acknowledge limits: "Note that this estimate assumes typical market conditions"

### Avoid
- Vague statements: "The property might be a good investment"
- Overpromising: "You will definitely make money"
- Legal/tax advice: "You should structure this as an LLC"
- Speculation without data: "The market will probably go up"

## Performance Requirements

- First token within 500ms
- Full response streaming
- Context injection < 200ms
- Session storage in memory (no DB persistence)

## Security

- Rate limit per user (10 req/min)
- Sanitize user inputs
- Don't echo back user data in responses
- Log conversations for abuse detection

## Testing Scenarios

1. Simple property value question
2. Complex investment analysis
3. Neighborhood comparison
4. Multi-turn conversation
5. Edge case: minimal property data
6. Edge case: user at limit
7. Inappropriate questions (redirect)

## Dependencies

- OpenAI API (GPT-4)
- Property data for context
- Valuation engine for ARV
- Neighborhood data APIs
