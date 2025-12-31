# Mistakes Log

This file tracks coding errors encountered during development to prevent repeating them.

---

## TypeScript / Framer Motion

### Issue: Framer Motion ease array type error
**Date**: 2024-12-31
**File**: `src/components/landing/Features.tsx`
**Error**:
```
Type 'number[]' is not assignable to type 'Easing | Easing[] | undefined'.
```
**Cause**: Framer Motion's strict TypeScript types require cubic-bezier arrays to be typed as const tuples.
**Wrong**:
```typescript
ease: [0.22, 1, 0.36, 1]
```
**Correct**:
```typescript
ease: [0.22, 1, 0.36, 1] as const
```
**Lesson**: Always use `as const` for Framer Motion easing arrays to satisfy TypeScript's strict type checking.

---
