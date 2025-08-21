// Small date formatting helper
export function formatEventDate(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  } catch (e) {
    return isoString;
  }
}

// Convert an Excel serial date (1900 system) to an ISO yyyy-mm-dd string.
// Returns null for invalid or empty input.
export function excelSerialToISO(serial) {
  if (serial == null || serial === '') return null;
  const num = Number(serial);
  if (Number.isNaN(num)) return null;

  // Convert Excel serial (1900 date system) to JS date.
  // Formula: ms = (serial - 25569) * 86400 * 1000
  const ms = Math.round((num - 25569) * 86400 * 1000);
  const d = new Date(ms);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Convert a time like "5:30 PM" or "10:00 AM" to 24-hour "HH:MM" suitable for <input type=time>
export function to24Hour(t) {
  if (!t) return '';
  const s = String(t).trim();
  // Already HH:MM
  if (/^\d{1,2}:\d{2}$/.test(s)) return s.padStart(5, '0');
  const m = s.match(/(\d{1,2}:\d{2})\s*([APap][Mm])?/);
  if (!m) return '';
  const time = m[1];
  const ampm = (m[2] || '').toUpperCase();
  let [hh, mm] = time.split(':').map(Number);
  if (ampm === 'PM' && hh < 12) hh += 12;
  if (ampm === 'AM' && hh === 12) hh = 0;
  return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
}

// Map day label to index 0..6 (M,T,W,R,F,S,S). Accepts 'M', 'Mon', 'Monday', or numeric strings.
export function dayLabelToIndex(label) {
  if (label == null) return -1;
  if (typeof label === 'number') return label;
  const s = String(label).trim();
  if (/^\d+$/.test(s)) return Number(s);
  const low = s.toLowerCase();
  // full-word / common 3-letter checks
  if (low.startsWith('mon')) return 0;
  if (low.startsWith('tue') || low.startsWith('tues')) return 1;
  if (low.startsWith('wed')) return 2;
  if (low.startsWith('thu') || low.startsWith('thur') || low === 'r') return 3;
  if (low.startsWith('fri')) return 4;
  if (low.startsWith('sat')) return 5;
  if (low.startsWith('sun')) return 6;
  // single-letter fallback
  const first = s[0].toUpperCase();
  const map = { M:0, T:1, W:2, R:3, F:4, S:5 };
  return map[first] ?? -1;
}
