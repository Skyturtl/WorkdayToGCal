import React from 'react';

// Updated privacy policy reflecting current lightweight analytics implementation.
const PrivacyPolicy = () => {
  return (
    <section id="privacy" className="privacy-policy">
      <h1>Privacy Policy</h1>
      <p style={{ fontStyle: 'italic', marginTop: -4 }}>Last updated: {new Date().toISOString().split('T')[0]}</p>

      <h2>Summary</h2>
      <p>
        This site does <strong>not</strong> collect or store your calendar contents, class schedule details, event titles, locations, times, or any personal identifiers. All schedule parsing happens locally in your browser; only the Google Calendar <em>create</em> calls you initiate are sent to Google. Read‑access scopes bundled by Google are not used.
      </p>

      <h2>Open Source Transparency</h2>
      <p>
        You can inspect every line of code here: {' '}
        <a href="https://github.com/Skyturtl/WorkdayToGCal" target="_blank" rel="noopener noreferrer">https://github.com/Skyturtl/WorkdayToGCal</a>. Feel free to audit or contribute.
      </p>

      <h2>Anonymous Analytics</h2>
      <p>
        Google Analytics (GA4) is integrated <strong>only</strong> to understand high‑level usage and improve reliability. It is configured with IP anonymization and never receives calendar data or class details.
      </p>
      <p>Data points sent:</p>
      <ul>
        <li>Session duration (seconds).</li>
        <li>Browser user agent string (helps prioritize compatibility).</li>
        <li>A counter of how many schedule files were imported (no file content).</li>
        <li>A counter of how many events were successfully created (no event metadata).</li>
      </ul>
      <p>
        A single <code>session_summary</code> event (with the counters & duration) fires when you leave or hide the tab; individual <code>file_imported</code> and <code>event_created</code> events fire at those actions. No unique user identifier beyond GA’s anonymous session cookie is used.
      </p>

      <h2>Cookies</h2>
      <p>
        GA4 sets a cookie to distinguish anonymous sessions. You can block or clear this with standard browser privacy settings if you prefer.
      </p>

      <h2>User Control & Opt‑Out</h2>
      <p>
        You can opt out by: (1) using a browser tracking protection / ad‑blocker, (2) clearing or blocking cookies for this site, or (3) installing Google’s official opt‑out add‑on. The app continues to function fully without analytics.
      </p>

      <h2>Questions</h2>
      <p>
        Open an issue on the GitHub repository if you have any concerns or suggestions.
      </p>
    </section>
  );
};

export default PrivacyPolicy;
