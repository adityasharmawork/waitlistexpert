"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use } from "react";
import { WaitlistPageView } from "@/components/waitlist/waitlist-page";

export default function WaitlistPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(props.params);
  const waitlist = useQuery(api.waitlists.getBySlug, { slug });

  if (waitlist === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!waitlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Waitlist not found</h1>
          <p className="text-neutral-400">
            This waitlist doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return <WaitlistPageView waitlist={waitlist} />;
}
