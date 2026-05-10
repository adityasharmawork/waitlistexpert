"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FeedCard } from "@/components/feed/feed-card";
import { Search, TrendingUp, Sparkles, Rocket, Timer } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

type SortOption = "trending" | "newest" | "most-anticipated" | "launching-soon";
type Category =
  | "all"
  | "ai"
  | "saas"
  | "devtools"
  | "fintech"
  | "mobile"
  | "consumer"
  | "creator"
  | "b2b"
  | "gaming"
  | "other";

const sortOptions: {
  value: SortOption;
  label: string;
  icon: typeof TrendingUp;
}[] = [
  { value: "trending", label: "Trending", icon: TrendingUp },
  { value: "newest", label: "Newest", icon: Sparkles },
  { value: "most-anticipated", label: "Most Anticipated", icon: Rocket },
  { value: "launching-soon", label: "Launching Soon", icon: Timer },
];

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
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
];

export default function ExplorePage() {
  const [sort, setSort] = useState<SortOption>("trending");
  const [category, setCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const watchedIds = useQuery(api.watchers.getWatchedByUser) as
    | Id<"waitlists">[]
    | undefined;

  const categoryArg = category === "all" ? undefined : category;

  const trending = useQuery(
    api.feed.getTrending,
    sort === "trending" && !isSearching
      ? { category: categoryArg, limit: 30 }
      : "skip"
  );
  const newest = useQuery(
    api.feed.getNewest,
    sort === "newest" && !isSearching ? { limit: 30 } : "skip"
  );
  const mostAnticipated = useQuery(
    api.feed.getMostAnticipated,
    sort === "most-anticipated" && !isSearching ? { limit: 30 } : "skip"
  );
  const launchingSoon = useQuery(
    api.feed.getLaunchingSoon,
    sort === "launching-soon" && !isSearching ? { limit: 30 } : "skip"
  );
  const searchResults = useQuery(
    api.feed.search,
    isSearching && searchQuery.length >= 2 ? { query: searchQuery } : "skip"
  );

  const rawWaitlists = isSearching
    ? searchResults
    : sort === "trending"
      ? trending
      : sort === "newest"
        ? newest
        : sort === "most-anticipated"
          ? mostAnticipated
          : launchingSoon;

  // Filter by category for non-trending sorts
  const waitlists =
    !isSearching && category !== "all" && sort !== "trending"
      ? rawWaitlists?.filter((w) => w.category === category)
      : rawWaitlists;

  const isLoading = waitlists === undefined;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Discover what&apos;s launching next
        </h1>
        <p className="text-neutral-400 mt-2 max-w-lg">
          Browse upcoming products from founders around the world. Join their
          waitlists before launch day.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search waitlists..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearching(e.target.value.length >= 2);
          }}
          className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        {isSearching && (
          <button
            onClick={() => {
              setSearchQuery("");
              setIsSearching(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Sort + Filter bar */}
      {!isSearching && (
        <div className="space-y-4 mb-8">
          {/* Sort tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSort(option.value)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  sort === option.value
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-white hover:bg-neutral-900"
                )}
              >
                <option.icon className="w-3.5 h-3.5" />
                {option.label}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                  category === cat.value
                    ? "bg-accent text-white"
                    : "bg-neutral-900/50 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search results header */}
      {isSearching && (
        <div className="mb-6">
          <p className="text-sm text-neutral-400">
            {searchResults === undefined
              ? "Searching..."
              : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Feed grid */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-neutral-900/30 animate-pulse"
            />
          ))}
        </div>
      ) : waitlists.length === 0 ? (
        <div className="text-center py-24 rounded-xl border border-dashed border-neutral-800">
          <p className="text-neutral-500 mb-2">
            {isSearching
              ? "No waitlists match your search."
              : "No waitlists in this category yet."}
          </p>
          <p className="text-xs text-neutral-600">
            {isSearching
              ? "Try a different search term."
              : "Check back soon — new products are listed daily."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {waitlists.map((waitlist, i) => (
            <FeedCard
              key={waitlist._id}
              waitlist={waitlist}
              rank={sort === "trending" && !isSearching ? i + 1 : undefined}
              watchedIds={watchedIds ?? []}
            />
          ))}
        </div>
      )}
    </main>
  );
}
