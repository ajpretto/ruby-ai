import { createClient } from "@/lib/supabase/server";
import { Search, FileText, Calculator, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | Ruby AI",
  description: "Your real estate investment command center",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Fetch recent saved properties
  const { data: savedProperties } = await supabase
    .from("saved_properties")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch recent reports
  const { data: recentReports } = await supabase
    .from("property_reports")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-cream mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-cream-muted">
          Here&apos;s what&apos;s happening with your investments
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickActionCard
          href="/search"
          icon={<Search className="w-5 h-5" />}
          title="Search Property"
          description="Look up any US address"
        />
        <QuickActionCard
          href="/calculator"
          icon={<Calculator className="w-5 h-5" />}
          title="Analyze Deal"
          description="Run the numbers"
        />
        <QuickActionCard
          href="/portfolio"
          icon={<FileText className="w-5 h-5" />}
          title="View Portfolio"
          description={`${savedProperties?.length || 0} saved properties`}
        />
        <QuickActionCard
          href="/settings/subscription"
          icon={<TrendingUp className="w-5 h-5" />}
          title={profile?.tier === "pro" ? "Pro Member" : "Upgrade to Pro"}
          description={profile?.tier === "pro" ? "Unlimited access" : "Unlock all features"}
          highlight={profile?.tier !== "pro"}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Reports This Month"
          value={profile?.reports_used_this_month || 0}
          limit={profile?.tier === "pro" ? "Unlimited" : "5"}
        />
        <StatCard
          label="AI Questions"
          value={profile?.ai_questions_used_this_month || 0}
          limit={profile?.tier === "pro" ? "Unlimited" : "10"}
        />
        <StatCard
          label="Saved Properties"
          value={savedProperties?.length || 0}
          limit={profile?.tier === "pro" ? "Unlimited" : "10"}
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Properties */}
        <div className="bg-obsidian-light border border-obsidian-lighter rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-cream">Saved Properties</h2>
            <Link
              href="/portfolio"
              className="text-sm text-ruby-glow hover:text-ruby transition-colors"
            >
              View all
            </Link>
          </div>
          {savedProperties && savedProperties.length > 0 ? (
            <ul className="space-y-3">
              {savedProperties.map((property) => (
                <li
                  key={property.id}
                  className="p-3 bg-obsidian rounded-lg hover:bg-obsidian-lighter/50 transition-colors"
                >
                  <p className="text-cream text-sm font-medium truncate">
                    {property.address}
                  </p>
                  <p className="text-cream-muted text-xs">
                    Saved {new Date(property.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-cream-muted text-sm mb-3">No saved properties yet</p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 text-ruby-glow hover:text-ruby text-sm transition-colors"
              >
                <Search className="w-4 h-4" />
                Search for properties
              </Link>
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="bg-obsidian-light border border-obsidian-lighter rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-cream">Recent Reports</h2>
          </div>
          {recentReports && recentReports.length > 0 ? (
            <ul className="space-y-3">
              {recentReports.map((report) => (
                <li
                  key={report.id}
                  className="p-3 bg-obsidian rounded-lg hover:bg-obsidian-lighter/50 transition-colors"
                >
                  <p className="text-cream text-sm font-medium truncate">
                    {report.address}
                  </p>
                  <p className="text-cream-muted text-xs">
                    Generated {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-cream-muted text-sm mb-3">No reports generated yet</p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 text-ruby-glow hover:text-ruby text-sm transition-colors"
              >
                <FileText className="w-4 h-4" />
                Generate your first report
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  highlight,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group p-5 rounded-xl border transition-all duration-300
                ${
                  highlight
                    ? "bg-gradient-to-br from-ruby-dark/30 to-obsidian-light border-ruby/30 hover:border-ruby/50"
                    : "bg-obsidian-light border-obsidian-lighter hover:border-ruby/30"
                }`}
    >
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3
                  ${highlight ? "bg-ruby/20" : "bg-obsidian-lighter"}`}
      >
        <span className={highlight ? "text-ruby-glow" : "text-cream-muted group-hover:text-ruby-glow transition-colors"}>
          {icon}
        </span>
      </div>
      <h3 className="text-cream font-medium mb-1">{title}</h3>
      <p className="text-cream-muted text-sm">{description}</p>
    </Link>
  );
}

function StatCard({
  label,
  value,
  limit,
}: {
  label: string;
  value: number;
  limit: string | number;
}) {
  const percentage = typeof limit === "number" ? (value / limit) * 100 : 0;

  return (
    <div className="p-5 bg-obsidian-light border border-obsidian-lighter rounded-xl">
      <p className="text-cream-muted text-sm mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-cream">{value}</span>
        <span className="text-cream-muted text-sm">/ {limit}</span>
      </div>
      {typeof limit === "number" && (
        <div className="mt-3 h-1 bg-obsidian-lighter rounded-full overflow-hidden">
          <div
            className="h-full bg-ruby rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
