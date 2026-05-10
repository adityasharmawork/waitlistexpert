"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Plus, ArrowUpRight, Users, TrendingUp } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const waitlists = useQuery(api.waitlists.listByOwner);

  if (waitlists === undefined) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-neutral-900 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const totalSignups = waitlists.reduce((sum, w) => sum + w.signupCount, 0);
  const totalReferrals = waitlists.reduce(
    (sum, w) => sum + w.referralCount,
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          href="/dashboard/waitlists/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Waitlist
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <Users className="w-4 h-4" />
            Total Signups
          </div>
          <p className="text-3xl font-semibold mt-2">
            {formatNumber(totalSignups)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            Total Referrals
          </div>
          <p className="text-3xl font-semibold mt-2">
            {formatNumber(totalReferrals)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            Active Waitlists
          </div>
          <p className="text-3xl font-semibold mt-2">
            {waitlists.filter((w) => w.status === "active").length}
          </p>
        </div>
      </div>

      {/* Waitlists list */}
      <div>
        <h2 className="text-lg font-medium mb-4">Your Waitlists</h2>
        {waitlists.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-700 p-12 text-center">
            <p className="text-neutral-400 mb-4">
              You haven&apos;t created any waitlists yet.
            </p>
            <Link
              href="/dashboard/waitlists/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create your first waitlist
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {waitlists.map((waitlist) => (
              <Link
                key={waitlist._id}
                href={`/dashboard/waitlists/${waitlist._id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{waitlist.name}</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-400">
                      {waitlist.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    {waitlist.tagline}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {formatNumber(waitlist.signupCount)}
                    </p>
                    <p className="text-xs text-neutral-500">signups</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
