"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/marketing/reveal";
import { duration, ease } from "@/components/marketing/motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type StepId = 0 | 1 | 2;

function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function Marquee({
  items,
  durationSeconds,
  reverse,
  className,
}: {
  items: string[];
  durationSeconds: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden",
        "group",
        className,
      ].join(" ")}
    >
      <div
        className="flex w-[200%] gap-12 whitespace-nowrap will-change-transform"
        style={{
          animation: `marquee-x ${durationSeconds}s linear infinite`,
          animationDirection: reverse ? ("reverse" as const) : ("normal" as const),
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className="t-body-sm text-[--black-600] font-medium tracking-[0.08em] uppercase"
          >
            {item} <span className="mx-3 text-[--black-500]">·</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .group:hover div {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function PrimaryButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={
        reduced
          ? undefined
          : {
              scale: 1.02,
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.5), 0 8px 32px rgba(255,255,255,0.12)",
            }
      }
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: duration.fast, ease: ease.spring }}
      className={className}
      style={{ borderRadius: 8 }}
    >
      <Link
        href={href}
        className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[--white-0] text-[--black-0] px-6 py-3 t-body-md font-semibold tracking-[-0.01em] select-none"
      >
        {children}
      </Link>
    </motion.div>
  );
}

function GhostButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center rounded-[10px] px-4 py-2",
        "border border-[rgba(255,255,255,0.12)] text-[--white-50]",
        "bg-transparent hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.25)]",
        "transition-colors duration-150",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function CopyButton({
  value,
  className,
  size = "sm",
}: {
  value: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {
          // no-op
        }
      }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ duration: duration.fast, ease: ease.spring }}
      className={[
        "inline-flex items-center gap-2",
        "rounded-[10px] border border-[rgba(255,255,255,0.12)] bg-transparent",
        "text-[--white-50] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.25)]",
        "transition-colors duration-150",
        size === "md" ? "px-3 py-2 t-body-sm" : "px-3 py-1.5 text-[12px]",
        className,
      ].join(" ")}
      aria-label={copied ? "Copied" : "Copy"}
    >
      <motion.span
        key={copied ? "copied" : "copy"}
        initial={reduced ? false : { opacity: 0, y: 4, filter: "blur(3px)" }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: duration.normal, ease: ease.outQuart }}
        className="text-[--black-800]"
      >
        {copied ? "✓ Copied" : "Copy"}
      </motion.span>
    </motion.button>
  );
}

function HeroMock() {
  const reduced = useReducedMotion();

  return (
    <div className="relative">
      <motion.div
        initial={reduced ? false : { opacity: 0, x: 40, filter: "blur(6px)" }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 0.6, ease: ease.outQuart }}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[--black-100] shadow-[var(--shadow-xl)] overflow-hidden"
          style={{
            transform: "rotateY(8deg) rotateX(2deg)",
          }}
        >
          <div className="h-10 px-4 flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(3,3,3,0.8)]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.10)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
            </div>
            <div className="ml-4 flex-1 h-6 rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
          </div>

          <div className="p-6">
            <div className="t-label text-[--black-600]">
              Waitlist page
            </div>
            <div className="mt-3 t-heading-lg text-[--white-0]">
              Minimal, fast, confident.
            </div>
            <div className="mt-3 t-body-md text-[--black-700] max-w-[28ch]">
              Collect signups, track referrals, and launch with an audience.
            </div>

            <div className="mt-6 rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-10 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.35)]" />
                <div className="h-10 px-4 rounded-[10px] bg-[--white-0] text-[--black-0] inline-flex items-center font-semibold">
                  Join
                </div>
              </div>
              <div className="mt-4 h-px bg-[rgba(255,255,255,0.06)]" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {["Referrals", "Analytics", "Discovery"].map((k) => (
                  <div
                    key={k}
                    className="rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3"
                  >
                    <div className="t-label text-[--black-600]">{k}</div>
                    <div className="mt-2 h-2 rounded-full bg-[rgba(255,255,255,0.09)]" />
                    <div className="mt-2 h-2 w-[70%] rounded-full bg-[rgba(255,255,255,0.06)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <HeroToast
          delay={1.0}
          className="absolute -top-6 -right-6"
          icon="↑"
          text="+23 signups in the last hour"
        />
        <HeroToast
          delay={1.4}
          className="absolute -bottom-6 -left-6"
          icon="↗"
          text="Referral link shared 47 times today"
        />
        <HeroToast
          delay={1.8}
          className="absolute -bottom-10 -right-2"
          icon="🎉"
          text="Hit 1,000 signups milestone"
        />
      </motion.div>
    </div>
  );
}

function HeroToast({
  delay,
  icon,
  text,
  className,
}: {
  delay: number;
  icon: string;
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.8, filter: "blur(6px)" }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        delay,
        type: reduced ? "tween" : "spring",
        stiffness: 240,
        damping: 20,
      }}
      className={[
        "rounded-[10px] px-4 py-3",
        "bg-[rgba(10,10,10,0.9)] border border-[rgba(255,255,255,0.1)]",
        "backdrop-blur-[20px] shadow-[var(--shadow-lg)]",
        "t-body-sm text-[--black-800] flex items-center gap-2",
        className,
      ].join(" ")}
      style={{ willChange: "transform" }}
    >
      <span className="text-[--white-50]">{icon}</span>
      <span>{text}</span>
      <motion.div
        aria-hidden
        animate={reduced ? undefined : { y: [0, -5, 0] }}
        transition={reduced ? undefined : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function CodeTypingBlock() {
  const reduced = useReducedMotion();
  const code =
    '<script\n  src="https://waitlist.expert/widget.js"\n  data-id="your-waitlist-id"\n></script>';
  const [text, setText] = useState(reduced ? code : "");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (started) return;
        setStarted(true);
      },
      { threshold: 0.25, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced, started]);

  useEffect(() => {
    if (reduced) return;
    if (!started) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setText(code.slice(0, i));
      if (i >= code.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [reduced, started, code]);

  return (
    <div
      ref={ref}
      className="relative rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[--black-150] p-8 overflow-hidden"
    >
      <div className="absolute top-4 right-4">
        <CopyButton value={code} />
      </div>

      <pre className="t-mono text-[16px] leading-[1.6] whitespace-pre-wrap">
        <span className="text-[--white-50]">
          {text}
        </span>
      </pre>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 t-body-sm text-[--black-600]">
        <span>Works on any website</span>
        <span className="text-[--black-500]">·</span>
        <span>&lt; 3KB</span>
        <span className="text-[--black-500]">·</span>
        <span>No build step required</span>
      </div>
    </div>
  );
}

function Particles() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = Array.from({ length: 20 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random(),
      o: 0.15 + Math.random() * 0.15,
      v: 0.02 + Math.random() * 0.05,
      dx: (Math.random() - 0.5) * 0.01,
    }));

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y -= p.v * 0.003;
        p.x += p.dx * 0.2;
        if (p.y < -0.1) p.y = 1.1;
        if (p.x < -0.1) p.x = 1.1;
        if (p.x > 1.1) p.x = -0.1;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}

function DiscoveryPreview() {
  const waitlists = useQuery(api.feed.getTrending, { limit: 6 });
  const reduced = useReducedMotion();

  const rows = (waitlists ?? []).slice(0, 6);

  return (
    <div className="relative">
      <div
        className="grid sm:grid-cols-2 gap-4"
        style={{
          animation: reduced ? undefined : "drift-up 8s linear infinite",
        }}
      >
        {rows.map((w) => (
          <div
            key={w._id}
            className="rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-4 hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="t-body-md font-medium text-[--white-50] truncate">
                  {w.name}
                </div>
                <div className="t-body-sm text-[--black-700] mt-1 line-clamp-2">
                  {w.tagline}
                </div>
              </div>
              <div className="shrink-0 t-label px-2 py-1 rounded-[999px] border border-[rgba(255,255,255,0.10)] text-[--black-800]">
                {w.category}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="t-body-sm text-[--black-800]">
                <span className="mr-2 text-[--black-700]">👤</span>
                {w.signupCount.toLocaleString()} waiting
              </div>
              <Link
                href={`/w/${w.slug}`}
                className="text-[12px] px-3 py-1.5 rounded-[10px] border border-[rgba(255,255,255,0.12)] text-[--white-50] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.25)] transition-colors duration-150"
              >
                Join waitlist
              </Link>
            </div>
          </div>
        ))}

        {!waitlists &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-4"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="h-4 w-[60%] rounded bg-[rgba(255,255,255,0.06)]" />
              <div className="mt-3 h-3 w-[90%] rounded bg-[rgba(255,255,255,0.04)]" />
              <div className="mt-2 h-3 w-[70%] rounded bg-[rgba(255,255,255,0.04)]" />
              <div className="mt-5 h-8 w-[40%] rounded bg-[rgba(255,255,255,0.05)]" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const scrolled = useScrolled(80);
  const reduced = useReducedMotion();

  const [activeStep, setActiveStep] = useState<StepId>(0);

  const [liveCount, setLiveCount] = useState(2847);
  useEffect(() => {
    if (reduced) return;
    let t: number | undefined;
    const schedule = () => {
      const next = 2800 + Math.floor(Math.random() * 200);
      t = window.setTimeout(() => {
        setLiveCount((c) => Math.max(c + 1, next));
        schedule();
      }, 3000 + Math.random() * 1000);
    };
    schedule();
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [reduced]);

  const [countdown, setCountdown] = useState(() => {
    const target = Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000;
    return target - Date.now();
  });
  useEffect(() => {
    const id = window.setInterval(() => setCountdown((ms) => Math.max(ms - 1000, 0)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const countdownParts = useMemo(() => {
    const total = Math.floor(countdown / 1000);
    const days = Math.floor(total / 86400);
    const hrs = Math.floor((total % 86400) / 3600);
    const min = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return { days: pad(days), hrs: pad(hrs), min: pad(min), sec: pad(sec) };
  }, [countdown]);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
    if (targets.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible?.target) return;
        const idx = Number((visible.target as HTMLElement).dataset.step);
        if (idx === 0 || idx === 1 || idx === 2) setActiveStep(idx);
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: "-20% 0px -50% 0px" }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  const stepVisual = useMemo(() => {
    const visuals: Record<StepId, { title: string; body: React.ReactNode }> = {
      0: {
        title: "Setup",
        body: (
          <div className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[--black-150] p-5">
            <div className="t-label text-[--black-600]">Create waitlist</div>
            <div className="mt-4 grid gap-3">
              <div className="h-10 rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
              <div className="h-10 rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
              <div className="h-10 rounded-[12px] bg-[--white-0]" />
            </div>
          </div>
        ),
      },
      1: {
        title: "Referrals",
        body: (
          <div className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[--black-150] p-5">
            <div className="t-label text-[--black-600]">Referral queue</div>
            <div className="mt-4 t-heading-sm text-[--white-0]">
              You are <span className="text-[--black-900]">#247</span> in line.
            </div>
            <div className="mt-3 t-body-sm text-[--black-700]">
              Share your link to move up ↗
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-9 rounded-[10px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)]" />
              <CopyButton value="https://waitlist.expert/r/abc123" />
            </div>
            <div className="mt-5 h-px bg-[rgba(255,255,255,0.06)]" />
            <div className="mt-5 grid gap-2 t-body-sm text-[--black-800]">
              <div className="flex items-center justify-between">
                <span>Refer 3 people</span>
                <span className="text-[--black-600]">Early Bird access</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Refer 10 people</span>
                <span className="text-[--black-600]">Founding Member</span>
              </div>
            </div>
          </div>
        ),
      },
      2: {
        title: "Launch",
        body: (
          <div className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[--black-150] p-5">
            <div className="t-label text-[--black-600]">Launch card</div>
            <div className="mt-4 rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4">
              <div className="t-body-md font-medium text-[--white-50]">
                waitlist.expert
              </div>
              <div className="mt-1 t-body-sm text-[--black-700]">
                2,000 waiters ready.
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="t-body-sm text-[--black-800]">
                  Launch in <span className="text-[--white-50]">14 days</span>
                </div>
                <div className="px-3 py-1.5 rounded-[10px] border border-[rgba(255,255,255,0.12)] text-[12px] text-[--white-50]">
                  Notify me
                </div>
              </div>
            </div>
          </div>
        ),
      },
    };
    return visuals[activeStep];
  }, [activeStep]);

  return (
    <main className="overflow-hidden noise">
      {/* NAV */}
      <div className="sticky top-0 z-50">
        <div
          className={[
            "h-14",
            "transition-all duration-300",
            scrolled
              ? "backdrop-blur-[24px] bg-[rgba(3,3,3,0.85)] border-b border-[rgba(255,255,255,0.06)]"
              : "bg-transparent border-b border-transparent",
          ].join(" ")}
        >
          <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
            <Link href="/" className="t-body-md">
              <span className="font-normal text-[--black-700]">waitlist</span>
              <span className="text-[--white-0] font-semibold">.expert</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[14px]">
              <Link href="#features" className="nav-link">
                Features
              </Link>
              <Link href="#discovery" className="nav-link">
                Discovery
              </Link>
              <Link href="#docs" className="nav-link">
                Docs
              </Link>
            </nav>

            <GhostButton href="/sign-up" className="text-[14px]">
              Get started
            </GhostButton>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center">
        <div className="absolute inset-0 bg-[--black-50]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_40%,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
          }}
        />
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: "linear" }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
          }}
        />

        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
            <div>
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.1, duration: 0.4, ease: ease.outExpo }}
                className="flex items-center gap-3"
              >
                <div className="h-0 w-0" />
                <div className="t-label text-[--black-600] border-l-2 border-[rgba(255,255,255,0.15)] pl-3">
                  PRE-LAUNCH INFRASTRUCTURE FOR SERIOUS FOUNDERS
                </div>
              </motion.div>

              <h1 className="mt-6">
                <motion.span
                  className="block t-display-xl text-[--black-900] font-semibold"
                  initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.2, duration: 0.5, ease: ease.outCubic }}
                >
                  Build your audience.
                </motion.span>
                <motion.span
                  className="block t-display-xl text-[--white-0] font-bold"
                  initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.35, duration: 0.5, ease: ease.outCubic }}
                >
                  Before you build your launch.
                </motion.span>
              </h1>

              <motion.p
                className="mt-7 t-body-lg text-[--black-700] max-w-[440px]"
                initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.5, duration: 0.4, ease: ease.outQuart }}
              >
                waitlist.expert is the platform every founder creates before they post on Product Hunt.
                Beautiful waitlist pages, viral referral mechanics, and a live discovery feed — permanently free.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                initial={reduced ? false : { opacity: 0, y: 12, scale: 0.97, filter: "blur(4px)" }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.65, duration: 0.4, ease: ease.outQuart }}
              >
                <PrimaryButton href="/sign-up">
                  Get started — it&apos;s free <span aria-hidden>→</span>
                </PrimaryButton>
                <Link
                  href="#demo"
                  className="t-body-md text-[--black-700] hover:text-[--white-0] transition-colors duration-150 inline-flex items-center gap-2"
                >
                  <span aria-hidden className="text-[12px]">
                    ▶
                  </span>
                  Watch a 90-second demo
                </Link>
              </motion.div>

              <motion.div
                className="mt-10 t-body-sm text-[--black-600] flex flex-wrap items-center gap-3"
                initial={reduced ? false : { opacity: 0 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.3 }}
              >
                <span>
                  <span className="text-[--black-800]">12,000+</span> waitlists
                </span>
                <span className="text-[--black-500]">·</span>
                <span>
                  <span className="text-[--black-800]">2.4M</span> signups collected
                </span>
                <span className="text-[--black-500]">·</span>
                <span>free forever</span>
              </motion.div>
            </div>

            <div className="hidden lg:block">
              <HeroMock />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="h-12 bg-[--black-150] border-y border-[rgba(255,255,255,0.06)] flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6">
          <Marquee
            items={[
              "INDIE HACKERS",
              "Y COMBINATOR FOUNDERS",
              "SHOW HN PROJECTS",
              "PRODUCT HUNT LAUNCHES",
              "BOOTSTRAPPED SAAS",
            ]}
            durationSeconds={30}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="t-heading-xl text-[--white-0] max-w-[640px]">
              The 3-minute setup that changes everything about your launch
            </div>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
            <div className="relative">
              <div className="absolute left-[10px] top-0 bottom-0 w-px bg-[rgba(255,255,255,0.08)]" />

              {[
                {
                  step: "01",
                  title: "Create the page",
                  desc: "Pick a theme, set your launch date, and publish instantly to a clean URL you’ll be proud to share.",
                },
                {
                  step: "02",
                  title: "Turn signups into distribution",
                  desc: "Every signup receives a referral link. The queue becomes a game — your waiters share to move up.",
                },
                {
                  step: "03",
                  title: "Launch with momentum",
                  desc: "Your list is warm, tracked, and ready. Share once and watch the compounding effect do the rest.",
                },
              ].map((s, idx) => (
                <Reveal key={s.step} delay={idx * 0.05}>
                  <div
                    className="relative pl-10 py-8"
                    data-step={idx}
                    id={`step-${idx + 1}`}
                  >
                    <div
                      className="absolute left-[6px] top-[34px] w-2 h-2 rounded-full bg-[rgba(255,255,255,0.9)]"
                      style={{ boxShadow: "0 0 12px rgba(255,255,255,0.3)" }}
                    />
                    <div className="t-label text-[--black-600]">{s.step}</div>
                    <div className="mt-2 t-heading-sm text-[--white-0]">{s.title}</div>
                    <div className="mt-2 t-body-md text-[--black-700] max-w-[440px]">
                      {s.desc}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="lg:sticky lg:top-24">
              <Reveal>
                <div className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[--black-100] p-5 shadow-[var(--shadow-lg)]">
                  <div className="t-label text-[--black-600]">
                    {stepVisual.title}
                  </div>
                  <div className="mt-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={reduced ? false : { opacity: 0, filter: "blur(6px)" }}
                        animate={reduced ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
                        exit={reduced ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)" }}
                        transition={{ duration: 0.3 }}
                      >
                        {stepVisual.body}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BENTO */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              className="grid grid-cols-12 gap-5"
            >
              {/* Large card */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: ease.outQuart },
                  },
                }}
                className="col-span-12 lg:col-span-8 rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] overflow-hidden hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <div className="relative p-[1px]">
                  <div className="absolute inset-0 card-hero-border" />
                  <div className="relative rounded-[15px] bg-[--black-150] p-7">
                    <div className="t-label text-[--black-600]">Viral referrals</div>
                    <div className="mt-4 t-heading-sm text-[--white-0]">
                      You are <span className="text-[--black-900]">#247</span> in line.
                    </div>
                    <div className="mt-2 t-body-sm text-[--black-700]">
                      Share your link to move up <span aria-hidden>↗</span>
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <div className="flex-1 h-10 rounded-[10px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)] t-mono px-3 flex items-center text-[--white-50]">
                        https://waitlist.expert/r/abc123
                      </div>
                      <CopyButton value="https://waitlist.expert/r/abc123" size="md" />
                    </div>
                    <div className="mt-6 h-px bg-[rgba(255,255,255,0.06)]" />
                    <div className="mt-6 grid gap-3 t-body-md text-[--black-800]">
                      <div className="flex items-center justify-between">
                        <span>Refer 3 people</span>
                        <span className="text-[--black-600]">Early Bird access</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Refer 10 people</span>
                        <span className="text-[--black-600]">Founding Member</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Live counter */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: ease.outQuart },
                  },
                }}
                className="col-span-12 lg:col-span-4 rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-7 hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <div className="t-label text-[--black-600]">Live counter widget</div>
                <div className="mt-5 rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                  <div className="t-body-md text-[--white-50]">
                    <span className="mr-2 text-[--white-50]">●</span>
                    {liveCount.toLocaleString()} people waiting
                  </div>
                </div>
                <div className="mt-5">
                  <GhostButton href="#embed" className="w-full justify-center t-body-sm">
                    Embed on your site
                  </GhostButton>
                </div>
              </motion.div>

              {/* Discovery feed mini */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: ease.outQuart },
                  },
                }}
                className="col-span-12 lg:col-span-4 rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-7 hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <div className="t-label text-[--black-600]">Discovery feed</div>
                <div className="mt-5 grid gap-3">
                  {[
                    { name: "Arcade", tag: "consumer", signups: "1,284" },
                    { name: "Ledgerline", tag: "fintech", signups: "932" },
                    { name: "Compile", tag: "devtools", signups: "2,104" },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="relative overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="t-body-md font-medium text-[--white-50] truncate">
                            {p.name}
                          </div>
                          <div className="t-body-sm text-[--black-700] mt-1">
                            {p.signups} waiting
                          </div>
                        </div>
                        <div className="t-label px-2 py-1 rounded-[999px] border border-[rgba(255,255,255,0.10)] text-[--black-800]">
                          {p.tag}
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                          transform: "translateX(-120%)",
                          animation: reduced ? undefined : "shimmer-sweep 4.8s ease-in-out infinite",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* One-line embed */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: ease.outQuart },
                  },
                }}
                className="col-span-12 lg:col-span-4 rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-7 hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <div className="t-label text-[--black-600]">One-line embed</div>
                <div className="mt-5 rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.35)] p-4">
                  <div className="t-mono text-[--white-50]">
                    &lt;script src=&quot;https://waitlist.expert/widget.js&quot; /&gt;
                  </div>
                </div>
                <div className="mt-4">
                  <CopyButton value={`<script src="https://waitlist.expert/widget.js"></script>`} size="md" />
                </div>
              </motion.div>

              {/* Queue-jump */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: ease.outQuart },
                  },
                }}
                className="col-span-12 lg:col-span-4 rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-7 hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <div className="t-label text-[--black-600]">Queue-jump referrals</div>
                <div className="mt-6 t-heading-xl text-[--white-0] font-bold tracking-[-0.025em] leading-[1.05]">
                  3–5×
                </div>
                <div className="mt-3 t-body-md text-[--black-700]">
                  more signups from referrals vs cold traffic.
                </div>
              </motion.div>

              {/* Themed pages */}
              <ThemeCard />

              {/* Countdown */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: ease.outQuart },
                  },
                }}
                className="col-span-12 lg:col-span-4 rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-7 hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <div className="t-label text-[--black-600]">Launch countdown</div>
                <div className="mt-6 t-mono text-[--white-0] text-[30px] tracking-[-0.02em]">
                  {countdownParts.days} : {countdownParts.hrs} : {countdownParts.min} : {countdownParts.sec}
                </div>
                <div className="mt-2 grid grid-cols-4 gap-3 t-label text-[--black-600]">
                  <div>DAYS</div>
                  <div>HRS</div>
                  <div>MIN</div>
                  <div>SEC</div>
                </div>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* DISCOVERY */}
      <section
        id="discovery"
        className="py-24 bg-[--black-100] border-y border-[rgba(255,255,255,0.06)]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <Reveal>
                <div className="t-label text-[--black-600]">BUILT-IN DISCOVERY</div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="mt-4 t-heading-lg text-[--white-0]">
                  Your first signups arrive before you share a single link.
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-4 t-body-md text-[--black-700] max-w-[52ch]">
                  Every waitlist on our platform appears in the discovery feed. Thousands of early adopters browse it daily.
                  List your product and get discovered.
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8">
                  <GhostButton href="/explore" className="t-body-sm">
                    Browse the discovery feed <span aria-hidden className="ml-2">→</span>
                  </GhostButton>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <DiscoveryPreview />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CODE / EMBED DEMO */}
      <section id="embed" className="py-24 bg-[--black-0]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="max-w-[800px] mx-auto text-center">
              <div className="t-label text-[--black-600]">DEVELOPER FIRST</div>
              <div className="mt-4 t-heading-xl text-[--white-0] font-bold">
                One line of code. Infinite reach.
              </div>
              <div className="mt-10">
                <CodeTypingBlock />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="t-heading-lg text-[--white-0] max-w-[38ch]">
              Founders don’t buy features. They buy confidence.
            </div>
          </Reveal>

          <div className="mt-10 space-y-6">
            <TestimonialRow
              direction="left"
              durationSeconds={35}
              quotes={[
                { q: "The referral queue turned our waitlist into a game. Growth finally felt engineered.", a: "Maya", t: "@mayafounds" },
                { q: "The page looked premium out of the box. We shipped in an afternoon.", a: "Rohan", t: "Founder, Devtools" },
                { q: "Discovery brought our first 200 signups before we even posted.", a: "Elena", t: "@elena_builds" },
                { q: "Fast, clean, and brutally simple. Exactly what we needed pre-launch.", a: "Sam", t: "@samshipit" },
              ]}
            />
            <TestimonialRow
              direction="right"
              durationSeconds={40}
              quotes={[
                { q: "The embed worked on our marketing site with zero build changes.", a: "Noah", t: "Indie founder" },
                { q: "The motion and typography feel like Linear. Not a template.", a: "Priya", t: "@priyamakes" },
                { q: "We stopped arguing about tools and just launched. That’s the point.", a: "Jordan", t: "YC alum" },
                { q: "Copy button, code block, live counter — everything feels intentional.", a: "Lin", t: "@linships" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative min-h-[100vh] flex items-center">
        <Particles />
        <div className="absolute inset-0 bg-[--black-50]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_45%,rgba(255,255,255,0.06)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full text-center">
          <Reveal>
            <div className="t-label text-[--black-600]">START IN 3 MINUTES</div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-4 t-display-lg text-[--white-0] font-bold tracking-[-0.03em]">
              Your launch deserves an audience.
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-4 t-body-lg text-[--black-700]">
              waitlist.expert is free. Always.
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex items-center justify-center">
              <motion.div
                whileHover={
                  reduced
                    ? undefined
                    : { scale: 1.02, boxShadow: "0 0 60px rgba(255,255,255,0.15)" }
                }
                whileTap={reduced ? undefined : { scale: 0.97 }}
                transition={{ duration: duration.fast, ease: ease.spring }}
                style={{ borderRadius: 10 }}
              >
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[--white-0] text-[--black-0] px-8 py-4 t-body-md font-semibold tracking-[-0.01em]"
                >
                  Create your waitlist <span aria-hidden>→</span>
                </Link>
              </motion.div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-6 t-body-sm text-[--black-600]">
              No credit card. No time limit. No catch.
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[--black-0] border-t border-[rgba(255,255,255,0.06)] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="t-body-md">
                <span className="font-normal text-[--black-700]">waitlist</span>
                <span className="text-[--white-0] font-semibold">.expert</span>
              </div>
              <div className="mt-3 t-body-sm text-[--black-600]">
                The pre-launch platform.
              </div>
              <div className="mt-6 t-body-sm text-[--black-600]">
                © {new Date().getFullYear()} waitlist.expert
              </div>
            </div>

            <FooterCol
              title="Product"
              links={[
                ["Features", "#features"],
                ["Discovery", "#discovery"],
                ["Embed", "#embed"],
                ["API", "/docs"],
                ["Themes", "#features"],
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                ["About", "/about"],
                ["Blog", "/blog"],
                ["Changelog", "/changelog"],
                ["Twitter/X", "https://x.com/"],
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                ["Privacy", "/privacy"],
                ["Terms", "/terms"],
              ]}
            />
          </div>
        </div>
      </footer>
    </main>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <div>
      <div className="text-[12px] font-medium tracking-[0.06em] uppercase text-[--black-800]">
        {title}
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {links.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="text-[14px] text-[--black-600] hover:text-[--white-50] transition-colors duration-150 w-fit"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function TestimonialRow({
  quotes,
  direction,
  durationSeconds,
}: {
  quotes: Array<{ q: string; a: string; t: string }>;
  direction: "left" | "right";
  durationSeconds: number;
}) {
  return (
    <div className="relative overflow-hidden group">
      <div
        className="flex w-[200%] gap-5 will-change-transform"
        style={{
          animation: `marquee-x ${durationSeconds}s linear infinite`,
          animationDirection: direction === "right" ? ("reverse" as const) : ("normal" as const),
        }}
      >
        {[...quotes, ...quotes].map((x, i) => (
          <div
            key={`${x.a}-${i}`}
            className="w-[320px] shrink-0 rounded-[12px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-6 hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            <div className="t-body-sm text-[--black-800] leading-[1.65]">
              “{x.q}”
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[--black-300] border border-[rgba(255,255,255,0.08)]" />
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-[--white-50]">
                  {x.a}{" "}
                  <span className="text-[--black-600] font-normal">{x.t}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .group:hover div {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function ThemeCard() {
  const reduced = useReducedMotion();
  const themes = [
    { id: "minimal", label: "Minimal" },
    { id: "bold", label: "Bold" },
    { id: "editorial", label: "Editorial" },
    { id: "terminal", label: "Terminal" },
    { id: "clean", label: "Clean" },
    { id: "structured", label: "Structured" },
  ] as const;
  const [active, setActive] = useState<(typeof themes)[number]["id"]>("minimal");

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: ease.outQuart },
        },
      }}
      className="col-span-12 lg:col-span-4 rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[--black-150] p-7 hover:border-[rgba(255,255,255,0.14)] transition-colors duration-200"
      style={{ boxShadow: "var(--shadow-lg)" }}
    >
      <div className="t-label text-[--black-600]">Themed pages</div>

      <div className="mt-5 flex gap-2">
        <div className="flex flex-col gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={[
                "w-12 h-7 rounded-[10px] border",
                active === t.id
                  ? "border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.06)]"
                  : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)]",
                "transition-colors duration-150",
              ].join(" ")}
              aria-label={t.label}
            />
          ))}
        </div>

        <div className="flex-1 rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.35)] p-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduced ? false : { opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(6px)" }}
              transition={{ duration: 0.25, ease: ease.outQuart }}
            >
              <div className="t-body-sm text-[--black-700]">Preview</div>
              <div className="mt-3 h-3 w-[70%] rounded bg-[rgba(255,255,255,0.10)]" />
              <div className="mt-2 h-3 w-[55%] rounded bg-[rgba(255,255,255,0.06)]" />
              <div className="mt-5 h-9 w-full rounded-[10px] bg-[rgba(255,255,255,0.12)]" />
              <div className="mt-3 text-[11px] tracking-[0.12em] uppercase text-[rgba(255,255,255,0.35)]">
                {themes.find((t) => t.id === active)?.label}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
