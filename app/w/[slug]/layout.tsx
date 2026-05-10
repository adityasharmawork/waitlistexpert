export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No outer layout chrome — waitlist pages are standalone
  return <>{children}</>;
}
