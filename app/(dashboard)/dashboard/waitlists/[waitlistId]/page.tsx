"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Share2,
  Copy,
  ExternalLink,
  ArrowUpRight,
  Download,
  Trophy,
} from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";
import { useState } from "react";
import { SignupChart } from "@/components/dashboard/signup-chart";
import { SourceBreakdown } from "@/components/dashboard/source-breakdown";

export default function WaitlistDetailPage(props: {
  params: Promise<{ waitlistId: string }>;
}) {
  const { waitlistId } = use(props.params);
  const waitlist = useQuery(api.waitlists.getById, {
    id: waitlistId as Id<"waitlists">,
  });
  const stats = useQuery(api.signups.getStats, {
    waitlistId: waitlistId as Id<"waitlists">,
  });
  const signups = useQuery(api.signups.getByWaitlist, {
    waitlistId: waitlistId as Id<"waitlists">,
    limit: 50,
  });
  const leaderboard = useQuery(api.signups.getReferralLeaderboard, {
    waitlistId: waitlistId as Id<"waitlists">,
  });
  const dailyStats = useQuery(api.analytics.getDailyStats, {
    waitlistId: waitlistId as Id<"waitlists">,
    days: 30,
  });
  const sourceBreakdown = useQuery(api.analytics.getSourceBreakdown, {
    waitlistId: waitlistId as Id<"waitlists">,
  });
  const growth = useQuery(api.analytics.getGrowthMetrics, {
    waitlistId: waitlistId as Id<"waitlists">,
  });

  const [copied, setCopied] = useState<string | null>(null);

  function exportCSV() {
    if (!signups || signups.length === 0) return;
    const headers = ["Position", "Email", "Name", "Source", "Referrals", "Joined"];
    const rows = signups.map((s) => [
      s.position,
      s.email,
      s.name || "",
      s.source,
      s.referralCount,
      new Date(s.createdAt).toISOString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${waitlist?.slug ?? "waitlist"}-signups.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (waitlist === undefined) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-900 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-neutral-900 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!waitlist) {
    return <p className="text-neutral-400">Waitlist not found.</p>;
  }

  const pageUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/w/${waitlist.slug}`;

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{waitlist.name}</h1>
          <p className="text-neutral-400 text-sm mt-1">{waitlist.tagline}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/w/${waitlist.slug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 border border-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View page
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="flex items-center gap-2 text-neutral-400 text-xs mb-2">
            <Users className="w-3.5 h-3.5" />
            Total Signups
          </div>
          <p className="text-2xl font-semibold">
            {formatNumber(stats?.totalSignups ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="text-neutral-400 text-xs mb-2">Today</div>
          <p className="text-2xl font-semibold">
            {formatNumber(stats?.todaySignups ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="flex items-center gap-2 text-neutral-400 text-xs mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Referrals
          </div>
          <p className="text-2xl font-semibold">
            {formatNumber(stats?.totalReferrals ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="flex items-center gap-2 text-neutral-400 text-xs mb-2">
            <Share2 className="w-3.5 h-3.5" />
            Referral Rate
          </div>
          <p className="text-2xl font-semibold">
            {stats?.totalSignups
              ? `${Math.round((stats.totalReferrals / stats.totalSignups) * 100)}%`
              : "0%"}
          </p>
        </div>
      </div>

      {/* Growth indicator */}
      {growth && growth.weekOverWeekGrowth !== 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span
            className={
              growth.weekOverWeekGrowth > 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {growth.weekOverWeekGrowth > 0 ? "↑" : "↓"}{" "}
            {Math.abs(growth.weekOverWeekGrowth)}%
          </span>
          <span className="text-neutral-500">week-over-week growth</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-500">
            {growth.thisWeek} this week vs {growth.lastWeek} last week
          </span>
        </div>
      )}

      {/* Charts row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Signup chart */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h2 className="text-sm font-medium text-neutral-300 mb-4">
            Signups (Last 30 Days)
          </h2>
          <SignupChart data={dailyStats ?? []} />
        </div>

        {/* Source breakdown */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h2 className="text-sm font-medium text-neutral-300 mb-4">
            Signup Sources
          </h2>
          <SourceBreakdown data={sourceBreakdown ?? []} />
        </div>
      </div>

      {/* Share links */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="font-medium mb-4">Share & Embed</h2>
        <div className="space-y-3">
          {/* Page URL */}
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-400 truncate">
              {pageUrl}
            </div>
            <button
              onClick={() => copyToClipboard(pageUrl, "url")}
              className="flex items-center gap-1.5 px-3 py-2 border border-neutral-800 rounded-lg text-sm hover:bg-neutral-800 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied === "url" ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Embed code */}
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-400 truncate font-mono">
              {`<iframe src="${pageUrl}/embed" width="100%" height="400" frameborder="0"></iframe>`}
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  `<iframe src="${pageUrl}/embed" width="100%" height="400" frameborder="0"></iframe>`,
                  "embed"
                )
              }
              className="flex items-center gap-1.5 px-3 py-2 border border-neutral-800 rounded-lg text-sm hover:bg-neutral-800 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied === "embed" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Referral Leaderboard */}
      {leaderboard && leaderboard.length > 0 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <h2 className="font-medium">Top Referrers</h2>
          </div>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-900/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-neutral-500 w-6">
                    #{entry.rank}
                  </span>
                  <span className="text-sm">{entry.name}</span>
                </div>
                <div className="flex items-center gap-1 text-accent text-sm font-medium">
                  <ArrowUpRight className="w-3 h-3" />
                  {entry.referralCount} referrals
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signups table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Recent Signups</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              {signups?.length ?? 0} shown
            </span>
            {signups && signups.length > 0 && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 rounded-lg text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              >
                <Download className="w-3 h-3" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {signups === undefined ? (
          <div className="h-48 rounded-xl bg-neutral-900 animate-pulse" />
        ) : signups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-700 p-12 text-center">
            <p className="text-neutral-500">No signups yet. Share your waitlist link to get started!</p>
          </div>
        ) : (
          <div className="border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">
                    Referrals
                  </th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup) => (
                  <tr
                    key={signup._id}
                    className="border-b border-neutral-800/50 last:border-0"
                  >
                    <td className="px-4 py-3 text-neutral-500">
                      {signup.position}
                    </td>
                    <td className="px-4 py-3">{signup.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-400">
                        {signup.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {signup.referralCount > 0 && (
                        <span className="flex items-center gap-1 text-accent">
                          <ArrowUpRight className="w-3 h-3" />
                          {signup.referralCount}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {timeAgo(signup.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
