"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { use, useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Code,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Twitter = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function WaitlistCreatedPage(props: {
  params: Promise<{ waitlistId: string }>;
}) {
  const { waitlistId } = use(props.params);
  const waitlist = useQuery(api.waitlists.getById, {
    id: waitlistId as Id<"waitlists">,
  });
  const [copied, setCopied] = useState<string | null>(null);

  if (waitlist === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!waitlist) {
    return (
      <div className="text-center py-20 text-neutral-400">
        Waitlist not found.
      </div>
    );
  }

  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  const pageUrl = `${siteUrl}/w/${waitlist.slug}`;
  const embedCode = `<iframe src="${pageUrl}/embed" width="100%" height="400" frameborder="0"></iframe>`;
  const widgetCode = `<script src="${siteUrl}/api/widget/${waitlist._id}" async></script>`;
  const tweetText = `Just created my waitlist on @waitlistexpert — launching ${waitlist.name} soon! Join here: ${pageUrl}`;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Celebration header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Your waitlist is live!
        </h1>
        <p className="text-neutral-400">
          <strong className="text-white">{waitlist.name}</strong> is ready to
          collect signups. Share it everywhere.
        </p>
      </div>

      {/* Live URL — the main thing */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 mb-6">
        <p className="text-xs text-accent font-medium uppercase tracking-wider mb-3">
          Your waitlist URL
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white truncate font-mono">
            {pageUrl}
          </code>
          <button
            onClick={() => copy(pageUrl, "url")}
            className={cn(
              "shrink-0 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
              copied === "url"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-accent text-white hover:bg-accent/90"
            )}
          >
            {copied === "url" ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="mt-3">
          <Link
            href={pageUrl}
            target="_blank"
            className="text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            Open page
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-sm font-medium transition-colors"
        >
          <Twitter className="w-4 h-4" />
          Tweet about it
        </a>
        <Link
          href={`/dashboard/waitlists/${waitlistId}`}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-sm font-medium transition-colors"
        >
          Go to dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Embed options */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">
          Embed on your site
        </h2>

        {/* Widget script */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-medium">Widget Script</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">
              Recommended
            </span>
          </div>
          <p className="text-xs text-neutral-500 mb-3">
            Adds a floating &quot;Join Waitlist&quot; button to any page. One
            line of code.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 font-mono truncate">
              {widgetCode}
            </code>
            <button
              onClick={() => copy(widgetCode, "widget")}
              className="shrink-0 px-3 py-2 border border-neutral-800 rounded-lg text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            >
              {copied === "widget" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* iFrame embed */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-medium">iFrame Embed</h3>
          </div>
          <p className="text-xs text-neutral-500 mb-3">
            Inline embed for Notion, Webflow, Framer, or any HTML page.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 font-mono truncate">
              {embedCode}
            </code>
            <button
              onClick={() => copy(embedCode, "embed")}
              className="shrink-0 px-3 py-2 border border-neutral-800 rounded-lg text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            >
              {copied === "embed" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Discovery feed notice */}
      <div className="mt-8 rounded-xl border border-neutral-800/50 bg-neutral-900/20 p-5 text-center">
        <p className="text-sm text-neutral-300">
          Your product is now listed on the{" "}
          <Link href="/explore" className="text-accent hover:underline">
            discovery feed
          </Link>{" "}
          — browsed by early adopters daily.
        </p>
        <p className="text-xs text-neutral-600 mt-1">
          You may already have your first signups.
        </p>
      </div>
    </div>
  );
}
