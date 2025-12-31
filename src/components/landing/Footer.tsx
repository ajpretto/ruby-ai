"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-obsidian-lighter">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            {/* Ruby gem icon */}
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-ruby rounded rotate-45 transform origin-center" />
              <div className="absolute inset-1 bg-ruby-glow/30 rounded rotate-45 transform origin-center" />
              <div className="absolute inset-2 bg-ruby-dark/50 rounded rotate-45 transform origin-center" />
            </div>
            <span className="text-cream font-semibold text-xl">Ruby</span>
            <span className="text-cream-muted/40 text-xs font-[family-name:var(--font-mono)]">
              AI
            </span>
          </motion.div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <FooterLink href="#" label="Privacy" />
            <FooterLink href="#" label="Terms" />
            <FooterLink href="mailto:hello@ruby.ai" label="Contact" />
          </div>

          {/* Copyright */}
          <p className="text-cream-muted/40 text-sm font-[family-name:var(--font-mono)]">
            &copy; {new Date().getFullYear()} Ruby AI. All rights reserved.
          </p>
        </div>

        {/* Tagline */}
        <div className="mt-12 text-center">
          <p className="text-cream-muted/30 text-sm italic">
            Built for investors who move fast.
          </p>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ruby/30 to-transparent" />
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="text-cream-muted/60 hover:text-cream text-sm transition-colors duration-300
                 font-[family-name:var(--font-mono)] tracking-wide"
    >
      {label}
    </a>
  );
}
