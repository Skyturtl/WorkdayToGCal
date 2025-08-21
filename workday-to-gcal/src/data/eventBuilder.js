const pad = (n) => String(n).padStart(2, '0');
const combineLocal = (dateStr, timeStr = '00:00') => {
  if (!dateStr) return undefined;
  const [h = '00', m = '00'] = (timeStr || '00:00').split(':');
  return `${dateStr}T${pad(h)}:${pad(m)}:00`;
};

const toIcalByDay = (days = []) => {
  const map = {
    SU: 'SU', SUN: 'SU', SUNDAY: 'SU',
    MO: 'MO', MON: 'MO', MONDAY: 'MO',
    TU: 'TU', TUE: 'TU', TUESDAY: 'TU',
    WE: 'WE', WED: 'WE', WEDNESDAY: 'WE',
    TH: 'TH', THU: 'TH', THURSDAY: 'TH',
    FR: 'FR', FRI: 'FR', FRIDAY: 'FR',
    SA: 'SA', SAT: 'SA', SATURDAY: 'SA',
  };
  return (days || []).map(d => String(d || '').toUpperCase()).map(d => map[d]).filter(Boolean);
};

const formatUntil = (value) => {
  if (!value) return undefined;
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const mo = pad(value.getUTCMonth() + 1);
    const d = pad(value.getUTCDate());
    return `${y}${mo}${d}T235959Z`;
  }
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, mo, d] = s.split('-');
    return `${y}${mo}${d}T235959Z`;
  }
  if (/^\d{8}$/.test(s)) {
    return `${s}T235959Z`;
  }
  return undefined;
};

export function buildEventResource(opts) {
  if (!opts) return {};
  const tz = opts.timeZone || (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  let startDateTime, endDateTime;
  if (opts.start) {
    const s = opts.start instanceof Date ? opts.start.toISOString() : String(opts.start);
    startDateTime = s;
  } else {
    startDateTime = combineLocal(opts.startDate, opts.startTime);
  }
  if (opts.end) {
    const e = opts.end instanceof Date ? opts.end.toISOString() : String(opts.end);
    endDateTime = e;
  } else {
    endDateTime = combineLocal(opts.endDate, opts.endTime);
  }

  const resource = {
    summary: opts.title ?? opts.summary,
    description: opts.description,
    location: opts.location,
    start: startDateTime ? { dateTime: startDateTime, timeZone: tz } : undefined,
    end: endDateTime ? { dateTime: endDateTime, timeZone: tz } : undefined,
  };

  const byDay = toIcalByDay(opts.daysOfWeek);
  if (byDay && byDay.length) {
    const until = formatUntil(opts.repeatUntil);
    const rruleParts = [`FREQ=WEEKLY`, `BYDAY=${byDay.join(',')}`];
    if (until) rruleParts.push(`UNTIL=${until}`);
    resource.recurrence = [`RRULE:${rruleParts.join(';')}`];
  }

  Object.keys(resource).forEach(k => resource[k] === undefined && delete resource[k]);
  return resource;
}

export function mapRowToEventOptions(row) {
  return {
    title: row.Title || row.Summary || row.Event || row.title,
    description: row.Description || row.description,
    location: row.Location || row.location,
    timeZone: row.TimeZone || row.timeZone,
    startDate: row.StartDate || row.startDate,
    startTime: row.StartTime || row.startTime,
    endDate: row.EndDate || row.endDate,
    endTime: row.EndTime || row.endTime,
    daysOfWeek: row.Days || row.days || row.daysOfWeek,
    repeatUntil: row.Until || row.until || row.repeatUntil,
  };
}
