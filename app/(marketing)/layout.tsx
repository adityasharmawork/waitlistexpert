"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrolled = useScrolled(80);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Nav */}
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
              <Link href="/#features" className="nav-link">
                Features
              </Link>
              <Link href="/#discovery" className="nav-link">
                Discovery
              </Link>
              <Link href="/explore" className="nav-link">
                Explore
              </Link>
            </nav>

            <div className="hidden md:block">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-[10px] px-4 py-2 border border-[rgba(255,255,255,0.12)] text-[--white-50] bg-transparent hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.25)] transition-colors duration-150 text-[14px]"
              >
                Get started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-[--black-700] hover:text-[--white-0] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-out"
          style={{ maxHeight: menuOpen ? "240px" : "0px" }}
        >
          <div className="border-t border-[rgba(255,255,255,0.06)] bg-[rgba(3,3,3,0.95)] backdrop-blur-[24px] px-6 py-4 space-y-1">
            {[
              ["Features", "/#features"],
              ["Discovery", "/#discovery"],
              ["Explore", "/explore"],
              ["Sign in", "/sign-in"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block text-[14px] text-[--black-700] hover:text-[--white-0] py-2.5 transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/sign-up"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center mt-2 px-4 py-2.5 rounded-[10px] border border-[rgba(255,255,255,0.12)] text-[--white-50] text-[14px] font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>

      {children}

      {/* Footer */}
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
                &copy; {new Date().getFullYear()} waitlist.expert
              </div>
            </div>

            <FooterCol
              title="Product"
              links={[
                ["Features", "/#features"],
                ["Discovery", "/#discovery"],
                ["Embed", "/#embed"],
                ["Themes", "/#features"],
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
    </>
  );
}
