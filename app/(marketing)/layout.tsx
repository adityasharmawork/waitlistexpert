"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="font-semibold">waitlist.expert</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
            <Link
              href="/explore"
              className="hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/sign-in"
              className="hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Create Waitlist
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-neutral-400 hover:text-white"
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
        {menuOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-6 py-4 space-y-3">
            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-neutral-400 hover:text-white py-2"
            >
              Explore
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-neutral-400 hover:text-white py-2"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 bg-accent text-white rounded-lg font-medium text-sm"
            >
              Create Waitlist
            </Link>
          </div>
        )}
      </header>

      {children}

      {/* Footer */}
      <footer className="border-t border-neutral-800 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-white font-bold text-xs">W</span>
                </div>
                <span className="font-semibold">waitlist.expert</span>
              </div>
              <p className="text-sm text-neutral-500 max-w-xs">
                The thing every founder does before they launch anywhere else.
              </p>
            </div>
            <div className="flex gap-12 sm:gap-16 text-sm">
              <div>
                <h4 className="font-medium mb-3">Product</h4>
                <ul className="space-y-2 text-neutral-500">
                  <li>
                    <Link
                      href="/explore"
                      className="hover:text-white transition-colors"
                    >
                      Explore
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      className="hover:text-white transition-colors"
                    >
                      Create Waitlist
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Company</h4>
                <ul className="space-y-2 text-neutral-500">
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-white transition-colors"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-neutral-800 text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} waitlist.expert. All rights
            reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
