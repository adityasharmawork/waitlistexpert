"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { getTheme } from "@/lib/themes";
import { formatNumber, daysUntil, cn } from "@/lib/utils";
import { Users, Clock, ArrowRight, Check, Copy, Share2, Twitter } from "lucide-react";

interface WaitlistPageProps {
  waitlist: Doc<"waitlists">;
  preview?: boolean; // true when showing in the creation form live preview
}

export function WaitlistPageView({ waitlist, preview }: WaitlistPageProps) {
  const theme = getTheme(waitlist.theme);
  const createSignup = useMutation(api.signups.create);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    position?: number;
    referralCode?: string;
    totalSignups?: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (preview || !email) return;

    setError("");

    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");

    try {
      const res = await createSignup({
        waitlistId: waitlist._id,
        email,
        name: name || undefined,
        referralCode: refCode || undefined,
        source: "page",
      });

      if (res.success) {
        setSubmitted(true);
        setResult(res);
      } else if (res.error === "already_signed_up") {
        setSubmitted(true);
        setResult({ position: res.position, referralCode: res.referralCode });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  function copyReferralLink() {
    if (!result?.referralCode) return;
    const link = `${window.location.origin}/w/${waitlist.slug}?ref=${result.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isAligned = theme.layout === "left-aligned";

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col relative overflow-hidden",
        theme.bg,
        theme.text,
        theme.fontClass
      )}
    >
      {/* Background gradient */}
      {theme.showGradient && (
        <div className={cn("pointer-events-none", theme.gradientClass)} />
      )}

      <div
        className={cn(
          "flex-1 flex flex-col justify-center px-6 py-20 relative z-10",
          isAligned ? "max-w-2xl mx-6 md:mx-16 lg:mx-24" : "max-w-lg mx-auto"
        )}
      >
        <div className={isAligned ? "text-left" : "text-center"}>
          {/* Product name */}
          <h1
            className={cn(
              "tracking-tight leading-[1.1]",
              theme.headingWeight,
              theme.id === "stealth"
                ? "text-3xl md:text-4xl"
                : "text-4xl md:text-5xl"
            )}
          >
            {waitlist.name || "Your Product"}
          </h1>

          {/* Tagline */}
          <p className={cn("text-lg mt-4", theme.textMuted)}>
            {waitlist.tagline || "Describe what you're building"}
          </p>

          {/* Description */}
          {waitlist.description && (
            <p
              className={cn(
                "mt-6 text-sm leading-relaxed",
                theme.textSubtle,
                !isAligned && "max-w-md mx-auto"
              )}
            >
              {waitlist.description}
            </p>
          )}

          {/* Live counter + launch countdown */}
          <div
            className={cn(
              "flex items-center gap-6 mt-8 flex-wrap",
              !isAligned && "justify-center"
            )}
          >
            <div className="flex items-center gap-2">
              <Users
                className={cn(
                  "w-4 h-4",
                  theme.accentText
                )}
              />
              <span className={cn(theme.counterSize, theme.headingWeight)}>
                {formatNumber(waitlist.signupCount)}
              </span>
              <span className={cn("text-sm", theme.textMuted)}>
                {theme.id === "stealth" ? "in queue" : "people waiting"}
              </span>
            </div>
            {waitlist.launchDate && daysUntil(waitlist.launchDate) > 0 && (
              <div className="flex items-center gap-2">
                <Clock className={cn("w-4 h-4", theme.accentText)} />
                <span className={cn("font-semibold", theme.text)}>
                  {daysUntil(waitlist.launchDate)}
                </span>
                <span className={cn("text-sm", theme.textMuted)}>
                  days to launch
                </span>
              </div>
            )}
          </div>

          {/* Signup form or confirmation */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className={cn(
                "mt-10 space-y-3",
                !isAligned && "max-w-sm mx-auto"
              )}
            >
              <input
                type="text"
                placeholder={
                  theme.id === "stealth" ? "name (optional)" : "Your name (optional)"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                  theme.inputBg,
                  theme.inputBorder,
                  theme.inputText,
                  theme.inputPlaceholder
                )}
              />
              <input
                type="email"
                required
                placeholder={
                  theme.id === "stealth"
                    ? "email@example.com"
                    : "you@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                  theme.inputBg,
                  theme.inputBorder,
                  theme.inputText,
                  theme.inputPlaceholder
                )}
              />
              <button
                type="submit"
                disabled={preview}
                className={cn(
                  "w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm",
                  theme.buttonBg,
                  theme.buttonText,
                  theme.buttonHover,
                  preview && "cursor-default"
                )}
              >
                {theme.id === "stealth" ? (
                  <>$ join --waitlist</>
                ) : (
                  <>
                    Join the waitlist
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </form>
          ) : (
            <div
              className={cn(
                "mt-10 space-y-6",
                !isAligned && "max-w-sm mx-auto"
              )}
            >
              {/* Success */}
              <div className="flex items-center gap-2 text-green-400 justify-center">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {theme.id === "stealth"
                    ? "access_granted: queued"
                    : "You're on the list!"}
                </span>
              </div>

              {/* Position */}
              {result?.position && (
                <div className={!isAligned ? "text-center" : ""}>
                  <p className={cn("text-sm", theme.textMuted)}>
                    {theme.id === "stealth" ? "queue_position:" : "Your position"}
                  </p>
                  <p
                    className={cn(
                      "mt-1",
                      theme.headingWeight,
                      theme.counterSize
                    )}
                  >
                    #{formatNumber(result.position)}
                  </p>
                </div>
              )}

              {/* Referral sharing */}
              {result?.referralCode && waitlist.enableReferrals && (
                <div
                  className={cn(
                    "rounded-xl p-6",
                    theme.cardBg,
                    "border",
                    theme.cardBorder
                  )}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Share2 className={cn("w-4 h-4", theme.accentText)} />
                    <p className="font-medium text-sm">
                      {theme.id === "stealth"
                        ? "share_to_advance()"
                        : "Share to move up in line"}
                    </p>
                  </div>
                  <p className={cn("text-xs mb-4", theme.textSubtle)}>
                    Each friend who joins through your link moves you closer to
                    the front.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={copyReferralLink}
                      className={cn(
                        "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors border",
                        copied
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : cn(theme.cardBg, theme.text, theme.cardBorder)
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          {theme.id === "stealth" ? "copied" : "Copied!"}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {theme.id === "stealth" ? "copy link" : "Copy link"}
                        </>
                      )}
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Just joined the waitlist for ${waitlist.name} — I'm #${result?.position ?? ""} in line! ${typeof window !== "undefined" ? window.location.origin : ""}/w/${waitlist.slug}?ref=${result?.referralCode ?? ""} via @waitlistexpert`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors border",
                        theme.cardBg,
                        theme.text,
                        theme.cardBorder
                      )}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Powered by footer */}
      <div className={cn("pb-8", !isAligned ? "text-center" : "px-6 md:px-16 lg:px-24")}>
        <a
          href="https://waitlist.expert"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-xs transition-colors inline-flex items-center gap-1 hover:opacity-70",
            theme.textSubtle
          )}
        >
          {theme.id === "stealth"
            ? "// powered by waitlist.expert"
            : "Built with waitlist.expert →"}
        </a>
      </div>
    </div>
  );
}
