"use client";

import { motion } from "framer-motion";
import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-obsidian-lighter/50 border border-ruby/20 rounded-full"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ruby opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ruby-glow" />
          </span>
          <span className="text-cream-muted text-sm font-[family-name:var(--font-mono)] tracking-wider uppercase">
            Coming Q1 2026
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-semibold text-cream mb-6 leading-[1.1]"
        >
          Find your next{" "}
          <span className="text-gradient-ruby">flip</span>
          <br />
          <span className="text-4xl md:text-5xl lg:text-6xl text-cream-muted font-normal">
            in seconds, not hours
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-cream-muted max-w-2xl mx-auto mb-12"
        >
          Ruby is the AI-powered command center for real estate investors.
          Search any property, analyze deals instantly, and get AI insights
          that give you the edge.
        </motion.p>

        {/* Waitlist form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center"
        >
          <WaitlistForm />
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-cream-muted/40"
        >
          <TrustItem label="100M+ Properties" />
          <TrustItem label="Nationwide Coverage" />
          <TrustItem label="AI-Powered Analysis" />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-1/4 left-10 hidden lg:block"
      >
        <DataPoint value="$425K" label="Est. Value" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.7 }}
        className="absolute top-1/3 right-10 hidden lg:block"
      >
        <DataPoint value="+23%" label="ARV Upside" highlight />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.9 }}
        className="absolute bottom-1/3 left-16 hidden lg:block"
      >
        <DataPoint value="60.1%" label="Projected ROI" />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-cream-muted/20 flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-cream-muted/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-1 rounded-full bg-ruby/50" />
      <span className="text-sm font-[family-name:var(--font-mono)] tracking-wide">{label}</span>
    </div>
  );
}

function DataPoint({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`p-4 bg-obsidian-light/80 backdrop-blur-sm border rounded-lg ${
        highlight ? "border-ruby/40 glow-ruby-subtle" : "border-obsidian-lighter"
      }`}
    >
      <div className={`text-2xl font-bold mb-1 ${highlight ? "text-ruby-glow" : "text-cream"}`}>
        {value}
      </div>
      <div className="text-cream-muted/60 text-xs font-[family-name:var(--font-mono)]">{label}</div>
    </motion.div>
  );
}
