# Address Search Agent Specification

## Purpose
Handle all aspects of property address search, autocomplete, validation, and geocoding.

## Responsibilities

1. **Autocomplete Search**
   - Integrate with Google Places API
   - Provide real-time suggestions as user types
   - Filter to US addresses only
   - Handle partial addresses gracefully

2. **Address Validation**
   - Verify address exists and is valid
   - Normalize address format
   - Detect and handle edge cases (PO boxes, new construction)

3. **Geocoding**
   - Convert addresses to latitude/longitude
   - Store coordinates for property mapping

4. **Recent Searches**
   - Track user's recent searches
   - Persist for logged-in users
   - Show in search dropdown

## Technical Implementation

### Components
- `src/components/search/AddressSearch.tsx` - Main search component
- `src/components/search/AddressAutocomplete.tsx` - Dropdown suggestions
- `src/components/search/RecentSearches.tsx` - Recent search list

### API Routes
- `src/app/api/search/autocomplete/route.ts` - Proxy to Google Places
- `src/app/api/search/validate/route.ts` - Address validation

### Libraries
- `@react-google-maps/api` or `use-places-autocomplete` for Places integration

### Hooks
- `useAddressSearch(query: string)` - Debounced search with autocomplete
- `useRecentSearches()` - Fetch and manage recent searches

## Data Flow

```
User Types → Debounce (300ms) → Google Places API → Filter Results → Display Suggestions
                                                                           ↓
User Selects → Validate Address → Geocode → Navigate to /property/[id]
```

## API Response Format

```typescript
interface AddressSuggestion {
  placeId: string;
  mainText: string;      // Street address
  secondaryText: string; // City, State, ZIP
  fullAddress: string;   // Complete formatted address
}

interface ValidatedAddress {
  address: string;
  streetNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  latitude: number;
  longitude: number;
  propertyType?: 'residential' | 'land' | 'commercial';
}
```

## Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| No results | "No matching addresses found" | Show message, allow manual entry |
| API failure | "Search temporarily unavailable" | Retry with exponential backoff |
| Invalid address | "This address couldn't be verified" | Allow user to proceed anyway |
| Rate limited | "Please slow down" | Disable input briefly |

## Performance Requirements

- Autocomplete response < 200ms
- Debounce interval: 300ms
- Max suggestions shown: 5
- Cache recent autocomplete results (5 min TTL)

## Security

- Never expose Google API key to client
- Proxy all requests through API route
- Rate limit by user/IP
- Sanitize all inputs

## Testing Scenarios

1. Normal address entry
2. Partial address (just street name)
3. Address with apartment/unit
4. Rural addresses
5. New construction (may not exist in databases)
6. Invalid/nonexistent addresses
7. Rapid typing (debounce testing)
8. API failure recovery

## Dependencies

- Google Places API key (with Places Autocomplete enabled)
- Supabase for storing recent searches

## Cost Considerations

Google Places API pricing:
- Autocomplete: $2.83 per 1000 requests
- Place Details: $17 per 1000 requests (for geocoding)

Optimization strategies:
- Only call Place Details on selection
- Cache aggressively
- Debounce effectively
