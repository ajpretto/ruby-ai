export type UserTier = "free" | "pro";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tier: UserTier;
  stripe_customer_id: string | null;
  reports_used_this_month: number;
  ai_questions_used_this_month: number;
  usage_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface SavedProperty {
  id: string;
  user_id: string;
  address: string;
  property_data: Record<string, unknown> | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyReport {
  id: string;
  user_id: string;
  address: string;
  property_data: Record<string, unknown> | null;
  comps: Record<string, unknown> | null;
  valuation: Record<string, unknown> | null;
  created_at: string;
}

export interface CalculatorAnalysis {
  id: string;
  user_id: string;
  saved_property_id: string | null;
  address: string;
  strategy: "flip" | "brrrr";
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

// Tier limits
export const TIER_LIMITS = {
  free: {
    reports_per_month: 5,
    ai_questions_per_month: 10,
    max_saved_properties: 10,
    can_export_pdf: false,
  },
  pro: {
    reports_per_month: Infinity,
    ai_questions_per_month: Infinity,
    max_saved_properties: Infinity,
    can_export_pdf: true,
  },
} as const;

export function canUseFeature(
  profile: Profile,
  feature: "report" | "ai_question" | "save_property" | "export_pdf"
): boolean {
  const limits = TIER_LIMITS[profile.tier];

  switch (feature) {
    case "report":
      return profile.reports_used_this_month < limits.reports_per_month;
    case "ai_question":
      return profile.ai_questions_used_this_month < limits.ai_questions_per_month;
    case "save_property":
      return true; // Check count in component
    case "export_pdf":
      return limits.can_export_pdf;
    default:
      return false;
  }
}
