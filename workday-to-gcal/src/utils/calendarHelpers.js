// Pure helpers for calendar objects
export function formatCalendarLabel(cal) {
  if (!cal) return '';
  return cal.summary || cal.id || '';
}

export function sortCalendars(list = []) {
  return [...list].sort((a, b) => (a.summary || '').localeCompare(b.summary || ''));
}
