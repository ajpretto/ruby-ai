import { GridBackground, Hero, Features, MockUI, Footer } from "@/components/landing";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-obsidian">
      {/* Animated background */}
      <GridBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero section with waitlist */}
        <Hero />

        {/* App preview / mockup */}
        <MockUI />

        {/* Features grid */}
        <Features />

        {/* Secondary CTA */}
        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-cream mb-4">
              Ready to invest smarter?
            </h2>
            <p className="text-cream-muted mb-8">
              Join the waitlist and be first to access Ruby when we launch.
              Early access members get exclusive benefits.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-obsidian-lighter border border-ruby/30 rounded-lg text-cream-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ruby opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ruby-glow" />
              </span>
              <span className="font-[family-name:var(--font-mono)] text-sm">
                200+ investors on the waitlist
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
