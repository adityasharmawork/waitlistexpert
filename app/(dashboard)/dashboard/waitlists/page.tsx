"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";

export default function WaitlistsListPage() {
  const waitlists = useQuery(api.waitlists.listByOwner);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Waitlists</h1>
        <Link
          href="/dashboard/waitlists/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      {waitlists === undefined ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-neutral-900 animate-pulse"
            />
          ))}
        </div>
      ) : waitlists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-700 p-12 text-center">
          <p className="text-neutral-400 mb-4">No waitlists yet.</p>
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
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{waitlist.name}</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-400 shrink-0">
                    {waitlist.status}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-400 shrink-0">
                    {waitlist.category}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mt-1 truncate">
                  /w/{waitlist.slug} &middot; {timeAgo(waitlist.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0 ml-4">
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
  );
}
