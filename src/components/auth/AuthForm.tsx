"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-semibold text-cream mb-2">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-cream-muted">
          {mode === "login"
            ? "Sign in to access your dashboard"
            : "Start analyzing properties in minutes"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-muted/50" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full pl-12 pr-4 py-4 bg-obsidian-light border border-obsidian-lighter rounded-lg
                       text-cream placeholder:text-cream-muted/50 font-[family-name:var(--font-mono)] text-sm
                       focus:border-ruby/50 focus:ring-1 focus:ring-ruby/30 transition-all duration-300"
            />
          </div>
        )}

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

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-muted/50" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full pl-12 pr-4 py-4 bg-obsidian-light border border-obsidian-lighter rounded-lg
                     text-cream placeholder:text-cream-muted/50 font-[family-name:var(--font-mono)] text-sm
                     focus:border-ruby/50 focus:ring-1 focus:ring-ruby/30 transition-all duration-300"
          />
        </div>

        {mode === "login" && (
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-cream-muted hover:text-ruby-glow transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-ruby-dark/20 border border-ruby/30 rounded-lg"
          >
            <p className="text-ruby-glow text-sm">{error}</p>
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg"
          >
            <p className="text-green-400 text-sm">{message}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-ruby hover:bg-ruby-glow disabled:bg-ruby-dark
                   text-cream font-medium rounded-lg transition-all duration-300
                   flex items-center justify-center gap-2
                   hover:shadow-lg hover:shadow-ruby/20"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-cream-muted text-sm">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-ruby-glow hover:text-ruby transition-colors">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-ruby-glow hover:text-ruby transition-colors">
              Sign in
            </Link>
          </>
        )}
      </p>
    </motion.div>
  );
}
