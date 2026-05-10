import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-bold text-neutral-800 mb-4">404</p>
        <h1 className="text-xl font-semibold mb-2">Page not found</h1>
        <p className="text-sm text-neutral-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/explore"
            className="px-5 py-2.5 border border-neutral-800 text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-900 transition-colors"
          >
            Explore waitlists
          </Link>
        </div>
      </div>
    </div>
  );
}
