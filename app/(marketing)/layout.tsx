"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A853] to-[#F5C542] flex items-center justify-center shadow-[0_0_20px_rgba(212,168,83,0.15)] transition-shadow duration-300 group-hover:shadow-[0_0_24px_rgba(212,168,83,0.25)]">
              <span className="text-black font-bold text-sm">W</span>
            </div>
            <span className="font-semibold tracking-tight">waitlist.expert</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link
              href="/explore"
              className="text-neutral-400 hover:text-white transition-colors duration-200"
            >
              Explore
            </Link>
            <Link
              href="/sign-in"
              className="text-neutral-400 hover:text-white transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="shimmer-btn px-5 py-2 bg-gradient-to-r from-[#D4A853] to-[#C49B45] text-black rounded-lg font-semibold text-sm hover:from-[#E0B55E] hover:to-[#D4A853] transition-all duration-300 shadow-[0_0_20px_rgba(212,168,83,0.15)] hover:shadow-[0_0_30px_rgba(212,168,83,0.25)] flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-out"
          style={{ maxHeight: menuOpen ? "200px" : "0px" }}
        >
          <div className="border-t border-white/[0.06] bg-black/90 backdrop-blur-xl px-6 py-4 space-y-3">
            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-neutral-400 hover:text-white py-2 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-neutral-400 hover:text-white py-2 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-[#D4A853] to-[#C49B45] text-black rounded-lg font-semibold text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {children}

      {/* Footer */}
      <footer className="mt-auto relative">
        {/* Gold gradient line */}
        <div className="border-gradient-gold" />

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4A853] to-[#F5C542] flex items-center justify-center">
                  <span className="text-black font-bold text-xs">W</span>
                </div>
                <span className="font-semibold tracking-tight">waitlist.expert</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                The pre-launch platform for founders who want to build an audience before they ship.
              </p>
            </div>
            <div className="flex gap-16 text-sm">
              <div>
                <h4 className="font-medium text-neutral-300 mb-4">Product</h4>
                <ul className="space-y-3 text-neutral-500">
                  <li>
                    <Link
                      href="/explore"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Explore
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Create Waitlist
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-300 mb-4">Company</h4>
                <ul className="space-y-3 text-neutral-500">
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-white transition-colors duration-200"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between gap-4 text-xs text-neutral-600">
            <span>&copy; {new Date().getFullYear()} waitlist.expert. All rights reserved.</span>
            <span>Built for founders who ship.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
