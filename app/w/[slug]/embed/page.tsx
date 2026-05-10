"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use, useState } from "react";
import { formatNumber } from "@/lib/utils";
import { Users, ArrowRight, Check } from "lucide-react";

export default function WaitlistEmbedPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(props.params);
  const waitlist = useQuery(api.waitlists.getBySlug, { slug });
  const createSignup = useMutation(api.signups.create);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (waitlist === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!waitlist) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");

    const res = await createSignup({
      waitlistId: waitlist!._id,
      email,
      referralCode: refCode || undefined,
      source: "embed",
    });

    if (res.success || res.error === "already_signed_up") {
      setSubmitted(true);
    } else {
      setError("Something went wrong.");
    }
  }

  return (
    <div className="p-6 bg-neutral-950 text-white min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold">{waitlist.name}</h2>
      <p className="text-sm text-neutral-400 mt-1">{waitlist.tagline}</p>

      <div className="flex items-center gap-2 mt-4 text-sm text-neutral-500">
        <Users className="w-3.5 h-3.5" />
        <span>{formatNumber(waitlist.signupCount)} people waiting</span>
      </div>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 w-full max-w-sm flex gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-1"
          >
            Join
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <div className="mt-6 flex items-center gap-2 text-green-400">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">
            You&apos;re on the list!
          </span>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <a
        href="https://waitlist.expert"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-neutral-700 hover:text-neutral-500 mt-8 transition-colors"
      >
        Built with waitlist.expert &rarr;
      </a>
    </div>
  );
}
