"use client";

import { motion } from "framer-motion";
import { TrendingUp, Home, DollarSign, Percent } from "lucide-react";

export function MockUI() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative max-w-5xl mx-auto px-6 py-16"
    >
      {/* Main browser frame */}
      <div className="relative bg-obsidian-light border border-obsidian-lighter rounded-xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-obsidian border-b border-obsidian-lighter">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-ruby-dark/50" />
            <div className="w-3 h-3 rounded-full bg-gold-muted/30" />
            <div className="w-3 h-3 rounded-full bg-cream-muted/20" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 bg-obsidian-lighter rounded-md">
              <span className="text-cream-muted/50 text-xs font-[family-name:var(--font-mono)]">
                ruby.ai/property/123-main-st
              </span>
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="p-6 space-y-6">
          {/* Search bar mockup */}
          <div className="flex items-center gap-4 p-4 bg-obsidian rounded-lg border border-obsidian-lighter">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-5 h-5 rounded bg-ruby/30" />
              <span className="text-cream-muted/50 font-[family-name:var(--font-mono)] text-sm">
                123 Main Street, Austin, TX 78701
              </span>
            </div>
            <div className="px-3 py-1.5 bg-ruby rounded text-xs text-cream font-medium">
              Analyze
            </div>
          </div>

          {/* Property overview cards */}
          <div className="grid grid-cols-3 gap-4">
            <PropertyCard
              icon={<Home className="w-4 h-4 text-ruby-glow" />}
              label="Current Value"
              value="$425,000"
              trend="+8.2%"
              delay={0.1}
            />
            <PropertyCard
              icon={<TrendingUp className="w-4 h-4 text-ruby-glow" />}
              label="ARV Estimate"
              value="$525,000"
              trend="+23.5%"
              delay={0.2}
            />
            <PropertyCard
              icon={<DollarSign className="w-4 h-4 text-ruby-glow" />}
              label="Potential Profit"
              value="$67,500"
              trend="ROI: 41%"
              delay={0.3}
            />
          </div>

          {/* Calculator preview */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Inputs */}
            <div className="space-y-4">
              <h4 className="text-cream font-medium flex items-center gap-2">
                <Percent className="w-4 h-4 text-ruby" />
                Deal Analysis
              </h4>
              <div className="space-y-3">
                <InputRow label="Purchase Price" value="$350,000" />
                <InputRow label="Renovation Cost" value="$45,000" />
                <InputRow label="Holding (6 mo)" value="$14,000" />
                <InputRow label="ARV Sale Price" value="$525,000" />
              </div>
            </div>

            {/* Right: Metrics */}
            <div className="p-4 bg-obsidian rounded-lg border border-ruby/20 space-y-4">
              <h4 className="text-ruby-glow font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider">
                Final Metrics
              </h4>
              <div className="space-y-3">
                <MetricRow label="Total Investment" value="$135,098" />
                <MetricRow label="Net Profit" value="$81,252" highlight />
                <MetricRow label="ROI" value="60.1%" />
                <MetricRow label="Cash-on-Cash" value="94.9%" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-8 top-24 p-3 bg-obsidian border border-ruby/30 rounded-lg shadow-lg shadow-ruby/10"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-ruby/20 flex items-center justify-center">
              <Brain className="w-3 h-3 text-ruby-glow" />
            </div>
            <span className="text-cream text-xs">AI: Good flip opportunity</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-4 bottom-32 p-2 bg-obsidian border border-obsidian-lighter rounded-lg shadow-lg"
        >
          <div className="text-xs font-[family-name:var(--font-mono)]">
            <span className="text-cream-muted">5 comps found</span>
          </div>
        </motion.div>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ruby rounded-full" />
      </div>
    </motion.div>
  );
}

function PropertyCard({
  icon,
  label,
  value,
  trend,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-4 bg-obsidian rounded-lg border border-obsidian-lighter"
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-cream-muted text-xs">{label}</span>
      </div>
      <div className="text-xl font-semibold text-cream">{value}</div>
      <div className="text-xs text-ruby-glow font-[family-name:var(--font-mono)]">{trend}</div>
    </motion.div>
  );
}

function InputRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 bg-obsidian-lighter/50 rounded">
      <span className="text-cream-muted text-sm">{label}</span>
      <span className="text-cream font-[family-name:var(--font-mono)] text-sm">{value}</span>
    </div>
  );
}

function MetricRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-cream-muted text-sm">{label}</span>
      <span className={`font-[family-name:var(--font-mono)] text-sm font-semibold ${highlight ? "text-ruby-glow text-lg" : "text-cream"}`}>
        {value}
      </span>
    </div>
  );
}

function Brain({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
    </svg>
  );
}
