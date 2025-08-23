import React from 'react';

// Simple privacy policy section. Adjust GitHub repo URL if it changes.
const PrivacyPolicy = () => {
  return (
    <section id="privacy" className="privacy-policy">
      <h1>Privacy Policy</h1>
      <h2>TL;DR</h2>
      <p> I do not collect any information about your calendars, the events on your calendars, or your class schedule. The only information I (plan to) collect is anonymized basic usage information via Google Analytics (not yet enabled).</p>
      <h2>No calendar data collected</h2>
      <p>
        All reading and exporting of your class schedule happens entirely in your web browser, on your computer. This site does <strong>NOT</strong> read or store events from Google Calendar; it only sends (creates) the class schedule events you choose to upload. Permission scopes that include read access are bundled by Google with the scope required to add events &mdash; the site does not otherwise use them.
      </p>
      <p>
        For proof, you can review the full source code here: {' '}
        <a href="https://github.com/Skyturtl/WorkdayToGCal" target="_blank" rel="noopener noreferrer">https://github.com/Skyturtl/WorkdayToGCal</a>.
      </p>

      <h2>Google Analytics (planned)</h2>
      <p>
        I intend to add Google Analytics to gather <em>anonymized</em> usage statistics only. It will set a browser cookie and collect high-level, aggregate data. Until it is actually integrated, no analytics data are being collected.
      </p>
      <p>The anonymized data points that may be collected once enabled:</p>
      <ul>
        <li>Basic usage stats (e.g. session duration, browser version).</li>
        <li>Whether a class / schedule file was imported (yes / no only).</li>
        <li>The count of events successfully added to a calendar.</li>
      </ul>
      <p>
        This helps me understand if people are finding the tool useful, diagnose parsing issues early, and decide future improvements.
      </p>

      <h2>User control</h2>
      <p>
        When analytics is added you will be able to opt out using browser privacy features or Google’s official opt‑out extension. Links will be listed here at that time.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions or concerns, please open an issue on the GitHub repository above.
      </p>
    </section>
  );
};

export default PrivacyPolicy;
