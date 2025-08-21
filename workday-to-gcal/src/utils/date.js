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
