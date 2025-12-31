import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import type { Profile } from "@/lib/supabase/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If no profile exists yet (race condition), create a minimal one
  const userProfile: Profile = profile || {
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || null,
    avatar_url: null,
    tier: "free",
    stripe_customer_id: null,
    reports_used_this_month: 0,
    ai_questions_used_this_month: 0,
    usage_reset_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-obsidian">
      <Sidebar profile={userProfile} />
      <main className="pl-[280px] min-h-screen transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
