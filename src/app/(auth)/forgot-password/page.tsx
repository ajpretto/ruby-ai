"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ruby/20 mb-6">
          <Check className="w-8 h-8 text-ruby-glow" />
        </div>
        <h1 className="text-3xl font-semibold text-cream mb-2">Check your email</h1>
        <p className="text-cream-muted mb-6">
          We&apos;ve sent a password reset link to <span className="text-cream">{email}</span>
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-ruby-glow hover:text-ruby transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-ruby rounded rotate-45" />
            <div className="absolute inset-1 bg-ruby-glow/30 rounded rotate-45" />
          </div>
          <span className="text-cream font-semibold text-xl">Ruby</span>
        </Link>
        <h1 className="text-3xl font-semibold text-cream mb-2">Reset password</h1>
        <p className="text-cream-muted">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-muted/50" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full pl-12 pr-4 py-4 bg-obsidian-light border border-obsidian-lighter rounded-lg
                     text-cream placeholder:text-cream-muted/50 font-[family-name:var(--font-mono)] text-sm
                     focus:border-ruby/50 focus:ring-1 focus:ring-ruby/30 transition-all duration-300"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-ruby-dark/20 border border-ruby/30 rounded-lg"
          >
            <p className="text-ruby-glow text-sm">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-ruby hover:bg-ruby-glow disabled:bg-ruby-dark
                   text-cream font-medium rounded-lg transition-all duration-300
                   flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-cream-muted hover:text-ruby-glow transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
