// Lightweight, privacy‑focused Google Analytics (GA4) helpers.
// Only sends high‑level, anonymous usage metrics:
//  * session summary (duration seconds, counts of events created & files imported, user agent string)
//  * a ping when a file is imported
//  * a ping per event successfully created
// No calendar IDs, event titles, times, or identifying data are sent.

let sessionStart = Date.now();
let eventsCreated = 0;
let filesImported = 0;
let summarySent = false;

function safeGtag() {
  if (typeof window === 'undefined') return () => {};
  if (!window.gtag) return () => {};
  return window.gtag;
}

function sendSessionSummary() {
  if (summarySent) return; // ensure exactly one summary
  summarySent = true;
  const gtag = safeGtag();
  const durationSec = Math.round((Date.now() - sessionStart) / 1000);
  try {
    gtag('event', 'session_summary', {
      session_duration_sec: durationSec,
      events_created: eventsCreated,
      files_imported: filesImported,
      // User agent can help gauge browser/version distribution for compatibility.
      user_agent: (typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown')
    });
  } catch (e) { /* ignore */ }
}

export function initAnalytics(measurementId) {
  if (typeof document === 'undefined') return;
  if (!measurementId) return; // Analytics disabled if no ID provided.
  if (document.getElementById('ga4-base')) return; // already loaded

  // Create the tag script
  const script = document.createElement('script');
  script.id = 'ga4-base';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  // Inline init script
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, { anonymize_ip: true });

  // Session summary on visibility hidden or before unload.
  const finalise = () => sendSessionSummary();
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') finalise();
  });
  window.addEventListener('beforeunload', finalise);
}

export function trackFileImported() {
  filesImported += 1;
  const gtag = safeGtag();
  try { gtag('event', 'file_imported', { value: 1 }); } catch (e) { /* ignore */ }
}

export function trackEventCreated() {
  eventsCreated += 1;
  const gtag = safeGtag();
  try { gtag('event', 'event_created', { value: 1 }); } catch (e) { /* ignore */ }
}

// For tests or manual flush (not currently used elsewhere)
export function _flushForTest() {
  sendSessionSummary();
}
