"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify, cn } from "@/lib/utils";
import { themes, type ThemeId } from "@/lib/themes";
import { ThemePreview } from "@/components/waitlist/theme-preview";
import { Check, X, Loader2 } from "lucide-react";

const categories = [
  { value: "ai", label: "AI" },
  { value: "saas", label: "SaaS" },
  { value: "devtools", label: "Dev Tools" },
  { value: "fintech", label: "Fintech" },
  { value: "mobile", label: "Mobile" },
  { value: "consumer", label: "Consumer" },
  { value: "creator", label: "Creator" },
  { value: "b2b", label: "B2B" },
  { value: "gaming", label: "Gaming" },
  { value: "other", label: "Other" },
] as const;

type Category = (typeof categories)[number]["value"];

export default function CreateWaitlistPage() {
  const router = useRouter();
  const createWaitlist = useMutation(api.waitlists.create);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [category, setCategory] = useState<Category>("saas");
  const [theme, setTheme] = useState<ThemeId>("minimal-dark");
  const [description, setDescription] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const slugAvailability = useQuery(
    api.waitlists.checkSlugAvailability,
    slug.length >= 2 ? { slug } : "skip"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !tagline || !slug) return;
    if (slugAvailability && !slugAvailability.available) return;

    setIsSubmitting(true);
    setError("");

    try {
      const waitlistId = await createWaitlist({
        name,
        tagline,
        slug,
        category,
        theme,
        description: description || undefined,
        launchDate: launchDate ? new Date(launchDate).getTime() : undefined,
      });
      router.push(`/dashboard/waitlists/${waitlistId}/created`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  }

  const themeEntries = Object.values(themes);

  return (
    <div className="flex gap-8 min-h-[calc(100vh-8rem)]">
      {/* Left: Form */}
      <div className="flex-1 max-w-xl">
        <h1 className="text-2xl font-semibold mb-1">Create your waitlist</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Set up in under 3 minutes. Everything is editable later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Product name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                const next = e.target.value;
                setName(next);
                if (!slugEdited) setSlug(slugify(next));
              }}
              placeholder="My Awesome Product"
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Tagline
              <span className="text-neutral-500 font-normal ml-1">
                — what does it do?
              </span>
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="The fastest way to do something amazing"
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <p className="text-xs text-neutral-600 mt-1">
              {tagline.length}/100
            </p>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              URL slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 shrink-0">
                waitlist.expert/w/
              </span>
              <div className="flex-1 relative">
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugEdited(true);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent pr-8"
                />
                {slug.length >= 2 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {slugAvailability === undefined ? (
                      <Loader2 className="w-4 h-4 text-neutral-500 animate-spin" />
                    ) : slugAvailability.available ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs transition-colors",
                    category === cat.value
                      ? "bg-accent text-white"
                      : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Page theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themeEntries.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "rounded-lg border-2 p-3 text-left transition-all",
                    theme === t.id
                      ? "border-accent"
                      : "border-neutral-800 hover:border-neutral-700"
                  )}
                >
                  <div
                    className={cn(
                      "w-full h-10 rounded-md border mb-2",
                      t.bg,
                      t.cardBorder
                    )}
                  >
                    <div className="p-2">
                      <div
                        className={cn("h-1.5 w-12 rounded-full", t.buttonBg)}
                      />
                    </div>
                  </div>
                  <p className="text-xs font-medium">{t.label}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Optional: Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Description
              <span className="text-neutral-500 font-normal ml-1">
                (optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people more about what you're building..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            />
          </div>

          {/* Optional: Launch date */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Launch date
              <span className="text-neutral-500 font-normal ml-1">
                (optional)
              </span>
            </label>
            <input
              type="date"
              value={launchDate}
              onChange={(e) => setLaunchDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !name ||
              !tagline ||
              !slug ||
              (slugAvailability !== undefined && !slugAvailability.available)
            }
            className="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create waitlist"
            )}
          </button>
        </form>
      </div>

      {/* Right: Live Preview */}
      <div className="hidden lg:block w-96 sticky top-8 self-start">
        <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wider font-medium">
          Live Preview
        </p>
        <div className="h-[600px]">
          <ThemePreview name={name} tagline={tagline} theme={theme} />
        </div>
      </div>
    </div>
  );
}
