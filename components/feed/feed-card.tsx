"use client";

import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { formatNumber, daysUntil, timeAgo, cn } from "@/lib/utils";
import { Users, Clock, TrendingUp, Eye } from "lucide-react";

const categoryColors: Record<string, string> = {
  ai: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  saas: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  devtools: "bg-green-500/10 text-green-400 border-green-500/20",
  fintech: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  mobile: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  consumer: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  creator: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  b2b: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  gaming: "bg-red-500/10 text-red-400 border-red-500/20",
  other: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
};

interface FeedCardProps {
  waitlist: Doc<"waitlists">;
  rank?: number;
  isWatched?: boolean;
  watchedIds?: Id<"waitlists">[];
}

export function FeedCard({ waitlist, rank, watchedIds }: FeedCardProps) {
  const toggleWatch = useMutation(api.watchers.toggle);
  const isWatched = watchedIds?.includes(waitlist._id) ?? false;

  function handleWatch(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWatch({ waitlistId: waitlist._id }).catch(() => {
      // User not logged in — silently ignore
    });
  }
  const catColor = categoryColors[waitlist.category] ?? categoryColors.other;

  return (
    <Link
      href={`/w/${waitlist.slug}`}
      className="group block rounded-xl border border-neutral-800/80 bg-neutral-900/20 p-5 hover:bg-neutral-900/60 hover:border-neutral-700/80 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Rank number (if trending) */}
        {rank && (
          <div className="shrink-0 w-8 h-8 rounded-lg bg-neutral-800/50 flex items-center justify-center">
            <span className="text-xs font-mono text-neutral-500">{rank}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-white group-hover:text-accent transition-colors truncate">
                {waitlist.name}
              </h3>
              <p className="text-sm text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">
                {waitlist.tagline}
              </p>
            </div>
            <span
              className={cn(
                "px-2 py-0.5 text-[10px] rounded-full border shrink-0 uppercase tracking-wide font-medium",
                catColor
              )}
            >
              {waitlist.category}
            </span>
          </div>

          {/* Metrics row */}
          <div className="flex items-center gap-4 mt-4 text-xs text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              <span className="font-medium text-neutral-300">
                {formatNumber(waitlist.signupCount)}
              </span>
              <span>waiting</span>
            </div>

            {waitlist.launchDate && daysUntil(waitlist.launchDate) > 0 ? (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>{daysUntil(waitlist.launchDate)}d to launch</span>
              </div>
            ) : (
              <span>{timeAgo(waitlist.createdAt)}</span>
            )}

            {waitlist.referralCount > 0 && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                <span>{formatNumber(waitlist.referralCount)} referrals</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-3 pt-3 border-t border-neutral-800/50 flex items-center justify-between">
        <span className="text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Join waitlist →
        </span>
        <div className="flex items-center gap-3">
          {waitlist.watcherCount > 0 && (
            <span className="text-[10px] text-neutral-600">
              {formatNumber(waitlist.watcherCount)} watching
            </span>
          )}
          <button
            onClick={handleWatch}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors",
              isWatched
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-neutral-500 hover:text-neutral-300 border border-neutral-800 hover:border-neutral-700"
            )}
          >
            <Eye className="w-3 h-3" />
            {isWatched ? "Watching" : "Watch"}
          </button>
        </div>
      </div>
    </Link>
  );
}
