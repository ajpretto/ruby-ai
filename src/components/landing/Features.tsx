"use client";

import { motion } from "framer-motion";
import { Search, Calculator, Brain, FolderKanban } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Property Search",
    description: "Search any US address instantly. Get property details, history, and comps in seconds.",
    stat: "100M+",
    statLabel: "properties",
  },
  {
    icon: Calculator,
    title: "Deal Calculator",
    description: "Run flip and BRRRR analysis with our back-of-napkin model. Know your numbers fast.",
    stat: "< 30s",
    statLabel: "per analysis",
  },
  {
    icon: Brain,
    title: "AI Advisor",
    description: "Ask anything about a property. Our AI analyzes deals like a seasoned investor.",
    stat: "GPT-4",
    statLabel: "powered",
  },
  {
    icon: FolderKanban,
    title: "Portfolio Tracking",
    description: "Save properties, compare deals side-by-side, and track your investment pipeline.",
    stat: "Unlimited",
    statLabel: "properties",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function Features() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-ruby font-[family-name:var(--font-mono)] text-sm tracking-widest uppercase mb-4">
            The Edge You Need
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-cream mb-4">
            Every tool in one place
          </h2>
          <p className="text-cream-muted text-lg max-w-2xl mx-auto">
            Stop juggling spreadsheets, Zillow tabs, and calculators. Ruby brings everything together
            so you can focus on closing deals.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative p-8 bg-obsidian-light/50 border border-obsidian-lighter rounded-xl
                         hover:border-ruby/30 transition-all duration-500 overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -inset-px bg-gradient-to-br from-ruby/10 via-transparent to-transparent rounded-xl" />
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg
                              bg-obsidian-lighter border border-obsidian-lighter group-hover:border-ruby/30
                              transition-colors duration-300 mb-6">
                  <feature.icon className="w-6 h-6 text-ruby-glow" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-cream mb-2">{feature.title}</h3>
                <p className="text-cream-muted mb-6">{feature.description}</p>

                {/* Stat */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gradient-ruby">{feature.stat}</span>
                  <span className="text-cream-muted/60 text-sm font-[family-name:var(--font-mono)]">
                    {feature.statLabel}
                  </span>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-ruby/50" />
                <div className="absolute top-4 right-8 w-1 h-1 rounded-full bg-ruby/30" />
                <div className="absolute top-8 right-4 w-1 h-1 rounded-full bg-ruby/30" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
