"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join waitlist");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 px-6 py-4 bg-obsidian-lighter border border-ruby/30 rounded-lg"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-ruby/20">
          <Check className="w-4 h-4 text-ruby-glow" />
        </div>
        <div>
          <p className="text-cream font-medium">You&apos;re on the list!</p>
          <p className="text-cream-muted text-sm font-[family-name:var(--font-mono)]">
            We&apos;ll notify you when Ruby launches.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative group">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Enter your email"
          className="w-full px-5 py-4 pr-32 bg-obsidian-light border border-obsidian-lighter rounded-lg
                     text-cream placeholder:text-cream-muted/50 font-[family-name:var(--font-mono)] text-sm
                     focus:border-ruby/50 focus:ring-1 focus:ring-ruby/30 transition-all duration-300
                     group-hover:border-obsidian-lighter/80"
          disabled={status === "loading"}
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2
                     bg-ruby hover:bg-ruby-glow disabled:bg-ruby-dark
                     text-cream text-sm font-medium rounded-md
                     transition-all duration-300 flex items-center gap-2
                     hover:shadow-lg hover:shadow-ruby/20"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Join
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-ruby-glow text-sm font-[family-name:var(--font-mono)]"
        >
          {errorMessage}
        </motion.p>
      )}

      <p className="mt-3 text-cream-muted/60 text-xs font-[family-name:var(--font-mono)]">
        Join 200+ investors waiting for early access
      </p>
    </form>
  );
}
