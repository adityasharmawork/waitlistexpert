import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  Globe,
  Code,
  Sparkles,
  Timer,
  Share2,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(99,102,241,0.08),transparent_70%)]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 text-sm text-neutral-400 mb-8 bg-neutral-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Free forever &middot; No credit card required
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Build your audience
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                before you launch
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 mt-6 max-w-xl leading-relaxed">
              Create a viral waitlist in 3 minutes. Built-in referral mechanics
              that grow your list on autopilot. Beautiful pages. Real-time
              analytics. Completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-white rounded-xl font-semibold text-base hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                Create your waitlist
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-neutral-700 text-neutral-300 rounded-xl font-medium hover:bg-neutral-900 transition-colors"
              >
                Explore launches
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-12 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Setup in under 3 min</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No code required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium uppercase tracking-wider mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Live in 3 minutes. Seriously.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Name your product",
                desc: "Enter your product name and tagline. Pick a theme. Your waitlist page is instantly live at a shareable URL.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Share everywhere",
                desc: "Share the link, embed the widget on your site, or drop the iframe in Notion. Every signup gets a referral link to spread the word.",
                icon: Share2,
              },
              {
                step: "03",
                title: "Watch it grow",
                desc: "Real-time analytics show signups, referrals, and sources. Your waiters share their referral links and the list grows itself.",
                icon: BarChart3,
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-md">
                    {item.step}
                  </span>
                </div>
                <item.icon className="w-5 h-5 text-neutral-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium uppercase tracking-wider mb-3">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need before launch day
            </h2>
            <p className="text-neutral-400 mt-4 max-w-lg mx-auto">
              Not just a form. A complete pre-launch growth engine with
              referrals, analytics, and a discovery feed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                title: "Viral Referrals",
                desc: "Every signup gets a unique link. Share to move up in the queue. Your waiters become your growth team.",
              },
              {
                icon: Users,
                title: "Live Counters",
                desc: "Real-time signup counters update instantly across all visitors. Social proof that drives urgency.",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                desc: "Track signups, referrals, sources, and growth rate. Daily charts. CSV export. No vanity metrics.",
              },
              {
                icon: Globe,
                title: "Discovery Feed",
                desc: "Your waitlist appears in our public feed — browsed by early adopters looking for the next big thing.",
              },
              {
                icon: Code,
                title: "Embed Anywhere",
                desc: "Script tag widget, iFrame embed, or standalone page. Works on any site — no build tools needed.",
              },
              {
                icon: Timer,
                title: "Launch Countdown",
                desc: "Set a launch date and a live countdown appears on your page. Creates urgency automatically.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-neutral-800/60 bg-neutral-900/20 hover:bg-neutral-900/40 transition-colors"
              >
                <feature.icon className="w-5 h-5 text-accent mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes preview */}
      <section className="border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium uppercase tracking-wider mb-3">
              Themes
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              4 production-ready themes
            </h2>
            <p className="text-neutral-400 mt-4 max-w-lg mx-auto">
              Not just color swaps. Each theme has its own layout, typography,
              and personality. Pick one that matches your product.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Minimal Light",
                bg: "bg-white",
                text: "text-neutral-900",
                accent: "bg-neutral-900",
              },
              {
                name: "Minimal Dark",
                bg: "bg-neutral-950",
                text: "text-white",
                accent: "bg-white",
              },
              {
                name: "Premium Dark",
                bg: "bg-[#09090b]",
                text: "text-white",
                accent: "bg-gradient-to-r from-indigo-500 to-purple-500",
              },
              {
                name: "Stealth",
                bg: "bg-black",
                text: "text-green-400",
                accent: "bg-green-500",
              },
            ].map((theme) => (
              <div
                key={theme.name}
                className="rounded-xl border border-neutral-800 overflow-hidden"
              >
                <div className={`${theme.bg} p-6 h-36 flex flex-col justify-between`}>
                  <div>
                    <div
                      className={`h-2 w-20 rounded-full ${theme.text === "text-green-400" ? "bg-green-400" : theme.text === "text-white" ? "bg-white" : "bg-neutral-900"} opacity-80 mb-2`}
                    />
                    <div
                      className={`h-1.5 w-32 rounded-full ${theme.text === "text-green-400" ? "bg-green-800" : theme.text === "text-white" ? "bg-neutral-700" : "bg-neutral-300"} opacity-50`}
                    />
                  </div>
                  <div className={`h-8 w-full rounded-lg ${theme.accent}`} />
                </div>
                <div className="px-4 py-3 bg-neutral-900/50">
                  <p className="text-xs font-medium">{theme.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Viral loop explanation */}
      <section className="border-t border-neutral-800/50 bg-neutral-900/20">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-accent text-sm font-medium uppercase tracking-wider mb-3">
              The growth loop
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Every feature creates a share moment
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-12">
              The same &quot;Powered by&quot; viral loop that helped Calendly
              reach $270M ARR. Every waitlist page, every widget, every
              referral link carries your growth — and ours.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                {
                  label: "Founder creates waitlist",
                  detail: "Shares link, embeds widget on their site",
                },
                {
                  label: "Visitors sign up",
                  detail: "See their position, get a referral link",
                },
                {
                  label: "Signups share to move up",
                  detail: "Tweet, post, message — each share brings more signups",
                },
                {
                  label: "\"Built with waitlist.expert\"",
                  detail: "Every page and widget grows the platform organically",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl border border-neutral-800/60 bg-neutral-950/50"
                >
                  <span className="text-accent font-mono text-sm mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{step.label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to build your audience?
          </h2>
          <p className="text-neutral-400 mb-10 max-w-md mx-auto">
            Join founders who launch with a waitlist. Setup takes less than 3
            minutes. No credit card. Free forever.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-base hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
          >
            Create your waitlist — free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
