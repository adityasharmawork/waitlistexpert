/**
 * waitlist.expert embeddable widget
 * Standalone vanilla JS — no dependencies, < 5KB minified
 *
 * Usage:
 * <script src="https://waitlist.expert/api/widget/WAITLIST_ID" async></script>
 *
 * Or with data attributes:
 * <script src="https://waitlist.expert/api/widget.js" data-waitlist-id="WAITLIST_ID" async></script>
 */

(function () {
  const CONVEX_SITE_URL = "__CONVEX_SITE_URL__";
  const SITE_URL = "__SITE_URL__";

  // Find the waitlist ID from the script tag or injected value
  const scriptEl = document.currentScript as HTMLScriptElement | null;
  const WAITLIST_ID =
    "__WAITLIST_ID__" !== "__" + "WAITLIST_ID" + "__"
      ? "__WAITLIST_ID__"
      : scriptEl?.getAttribute("data-waitlist-id") ?? "";

  if (!WAITLIST_ID) return;

  // Prevent double-init
  if (window.__wle_init) return;
  window.__wle_init = true;

  // --- Styles ---
  const CSS = `
    #wle-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999998;
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(99,102,241,0.3);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    #wle-fab:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 28px rgba(99,102,241,0.4);
    }
    #wle-fab-count {
      background: rgba(255,255,255,0.2);
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 12px;
    }
    #wle-overlay {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    #wle-overlay.open { opacity: 1; }
    #wle-modal {
      background: #0a0a0a;
      border: 1px solid #262626;
      border-radius: 16px;
      padding: 32px;
      width: 90%;
      max-width: 400px;
      font-family: system-ui, -apple-system, sans-serif;
      color: #fafafa;
      position: relative;
      transform: translateY(8px);
      transition: transform 0.2s;
    }
    #wle-overlay.open #wle-modal { transform: translateY(0); }
    #wle-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: #737373;
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
    }
    #wle-close:hover { color: #fafafa; }
    #wle-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 4px;
    }
    #wle-tagline {
      font-size: 14px;
      color: #a3a3a3;
      margin: 0 0 20px;
    }
    #wle-counter {
      font-size: 13px;
      color: #737373;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    #wle-counter strong {
      color: #fafafa;
      font-size: 18px;
    }
    #wle-form { display: flex; flex-direction: column; gap: 8px; }
    #wle-form input {
      background: #171717;
      border: 1px solid #262626;
      border-radius: 8px;
      padding: 10px 14px;
      color: #fafafa;
      font-size: 14px;
      outline: none;
      font-family: inherit;
    }
    #wle-form input:focus { border-color: #6366f1; }
    #wle-form input::placeholder { color: #525252; }
    #wle-submit {
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s;
    }
    #wle-submit:hover { background: #4f46e5; }
    #wle-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    #wle-success {
      text-align: center;
      padding: 12px 0;
    }
    #wle-success-check {
      color: #22c55e;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    #wle-position {
      font-size: 36px;
      font-weight: 700;
      margin: 8px 0 4px;
    }
    #wle-position-label {
      font-size: 13px;
      color: #737373;
    }
    #wle-copy {
      margin-top: 16px;
      background: #171717;
      border: 1px solid #262626;
      border-radius: 8px;
      padding: 10px 14px;
      color: #fafafa;
      font-size: 13px;
      cursor: pointer;
      width: 100%;
      font-family: inherit;
      transition: border-color 0.15s;
    }
    #wle-copy:hover { border-color: #404040; }
    #wle-footer {
      text-align: center;
      margin-top: 20px;
    }
    #wle-footer a {
      color: #404040;
      text-decoration: none;
      font-size: 11px;
    }
    #wle-footer a:hover { color: #737373; }
    #wle-error {
      color: #f87171;
      font-size: 13px;
      margin-top: 4px;
    }
  `;

  // Inject styles
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  // --- State ---
  let waitlistData: { name: string; signupCount: number; slug: string } | null =
    null;
  let isOpen = false;

  // --- Fetch waitlist info ---
  async function fetchInfo() {
    try {
      // Use the Convex HTTP endpoint with waitlist ID to get slug first,
      // or we can call the Next.js API which accepts ID
      const res = await fetch(
        `${SITE_URL}/api/widget/${WAITLIST_ID}/info`
      );
      if (res.ok) {
        waitlistData = await res.json();
        updateFab();
      }
    } catch {
      // Silent fail — fab still works
    }
  }

  // --- FAB (Floating Action Button) ---
  function createFab() {
    const fab = document.createElement("button");
    fab.id = "wle-fab";
    fab.innerHTML = `Join Waitlist <span id="wle-fab-count"></span>`;
    fab.onclick = () => openModal();
    document.body.appendChild(fab);
  }

  function updateFab() {
    const countEl = document.getElementById("wle-fab-count");
    if (countEl && waitlistData) {
      countEl.textContent = waitlistData.signupCount.toLocaleString();
    }
  }

  // --- Modal ---
  function openModal() {
    isOpen = true;
    let overlay = document.getElementById("wle-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "wle-overlay";
      overlay.innerHTML = `
        <div id="wle-modal">
          <button id="wle-close">&times;</button>
          <div id="wle-title">${waitlistData?.name ?? "Join the Waitlist"}</div>
          <div id="wle-tagline">Be the first to know when we launch.</div>
          <div id="wle-counter">
            <strong>${waitlistData?.signupCount?.toLocaleString() ?? "0"}</strong> people waiting
          </div>
          <div id="wle-form-container">
            <form id="wle-form">
              <input type="email" id="wle-email" placeholder="you@example.com" required />
              <button type="submit" id="wle-submit">Join the waitlist</button>
            </form>
            <div id="wle-error" style="display:none"></div>
          </div>
          <div id="wle-success" style="display:none">
            <div id="wle-success-check">✓ You're on the list!</div>
            <div id="wle-position-label">Your position</div>
            <div id="wle-position"></div>
            <button id="wle-copy">Copy referral link</button>
          </div>
          <div id="wle-footer">
            <a href="${SITE_URL}" target="_blank" rel="noopener">Built with waitlist.expert →</a>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Close button
      document.getElementById("wle-close")!.onclick = closeModal;

      // Click outside to close
      overlay.onclick = (e) => {
        if (e.target === overlay) closeModal();
      };

      // Form submit
      document.getElementById("wle-form")!.onsubmit = handleSubmit;
    }

    // Update counter
    const counterEl = overlay.querySelector("#wle-counter strong");
    if (counterEl && waitlistData) {
      counterEl.textContent = waitlistData.signupCount.toLocaleString();
    }

    requestAnimationFrame(() => overlay!.classList.add("open"));
  }

  function closeModal() {
    isOpen = false;
    const overlay = document.getElementById("wle-overlay");
    if (overlay) {
      overlay.classList.remove("open");
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const emailInput = document.getElementById("wle-email") as HTMLInputElement;
    const submitBtn = document.getElementById("wle-submit") as HTMLButtonElement;
    const errorEl = document.getElementById("wle-error")!;

    const email = emailInput.value.trim();
    if (!email) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Joining...";
    errorEl.style.display = "none";

    try {
      const res = await fetch(`${CONVEX_SITE_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waitlistId: WAITLIST_ID,
          email,
          source: "widget",
        }),
      });

      const data = await res.json();

      if (data.success || data.error === "already_signed_up") {
        // Show success
        document.getElementById("wle-form-container")!.style.display = "none";
        const successEl = document.getElementById("wle-success")!;
        successEl.style.display = "block";

        const position = data.position;
        const referralCode = data.referralCode;

        document.getElementById("wle-position")!.textContent = `#${position}`;

        // Update fab counter
        if (waitlistData && data.totalSignups) {
          waitlistData.signupCount = data.totalSignups;
          updateFab();
        }

        // Copy referral link
        const copyBtn = document.getElementById("wle-copy")!;
        copyBtn.onclick = () => {
          const slug = waitlistData?.slug ?? "";
          const link = `${SITE_URL}/w/${slug}?ref=${referralCode}`;
          navigator.clipboard.writeText(link).then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => (copyBtn.textContent = "Copy referral link"), 2000);
          });
        };
      } else {
        errorEl.textContent =
          data.error === "invalid_email"
            ? "Please enter a valid email address."
            : data.error === "disposable_email"
              ? "Please use a real email address."
              : "Something went wrong. Please try again.";
        errorEl.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "Join the waitlist";
      }
    } catch {
      errorEl.textContent = "Network error. Please try again.";
      errorEl.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = "Join the waitlist";
    }
  }

  // --- Keyboard ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeModal();
  });

  // --- Init ---
  createFab();
  fetchInfo();
})();

declare global {
  interface Window {
    __wle_init?: boolean;
  }
}

export {};
