// Disposable email domains — common throwaway services
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "tempmail.com",
  "throwaway.email",
  "temp-mail.org",
  "10minutemail.com",
  "trashmail.com",
  "yopmail.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "sharklasers.com",
  "grr.la",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.de",
  "guerrillamailblock.com",
  "spam4.me",
  "getairmail.com",
  "mailnesia.com",
  "tmpmail.net",
  "tmpmail.org",
  "binkmail.com",
  "safetymail.info",
  "filzmail.com",
  "mailcatch.com",
  "mailexpire.com",
  "tempail.com",
  "mailnull.com",
  "meltmail.com",
  "harakirimail.com",
  "mailforspam.com",
  "spamhereplease.com",
  "trashymail.com",
  "mailzilla.com",
  "bugmenot.com",
]);

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  const localPart = email.split("@")[0];
  if (localPart.length > 64) return false;
  return true;
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

export function hashIP(ip: string): string {
  // Simple hash for privacy — not cryptographic, just for dedup
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
