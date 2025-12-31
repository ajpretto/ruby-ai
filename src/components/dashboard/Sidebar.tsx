"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Calculator,
  FolderHeart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

interface SidebarProps {
  profile: Profile;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Property Search", icon: Search },
  { href: "/calculator", label: "Deal Calculator", icon: Calculator },
  { href: "/portfolio", label: "Portfolio", icon: FolderHeart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-screen bg-obsidian-light border-r border-obsidian-lighter
                 flex flex-col z-40"
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <div className="absolute inset-0 bg-ruby rounded rotate-45" />
            <div className="absolute inset-1 bg-ruby-glow/30 rounded rotate-45" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-cream font-semibold text-xl overflow-hidden whitespace-nowrap"
              >
                Ruby
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                            ${
                              isActive
                                ? "bg-ruby/20 text-ruby-glow"
                                : "text-cream-muted hover:text-cream hover:bg-obsidian-lighter/50"
                            }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade banner (for free users) */}
      {profile.tier === "free" && !collapsed && (
        <div className="mx-3 mb-4 p-4 bg-gradient-to-br from-ruby-dark/30 to-obsidian-lighter rounded-lg border border-ruby/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-ruby-glow" />
            <span className="text-cream text-sm font-medium">Upgrade to Pro</span>
          </div>
          <p className="text-cream-muted text-xs mb-3">
            Unlimited reports, PDF exports, and more.
          </p>
          <Link
            href="/settings/subscription"
            className="block w-full text-center py-2 bg-ruby hover:bg-ruby-glow text-cream text-sm font-medium rounded-md transition-colors"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* User section */}
      <div className="p-3 border-t border-obsidian-lighter">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-obsidian-lighter flex items-center justify-center shrink-0">
            <span className="text-cream text-sm font-medium">
              {profile.full_name?.[0] || profile.email[0].toUpperCase()}
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-cream text-sm font-medium truncate">
                  {profile.full_name || "User"}
                </p>
                <p className="text-cream-muted text-xs truncate">{profile.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-cream-muted hover:text-ruby-glow
                   hover:bg-obsidian-lighter/50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-obsidian-lighter
                 border border-obsidian-lighter hover:border-ruby/30 rounded-full
                 flex items-center justify-center text-cream-muted hover:text-cream
                 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
}
