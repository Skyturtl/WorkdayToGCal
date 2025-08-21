// Parse an array of rows (as returned by xlsx.utils.sheet_to_json)
// and return only courses with Registration Status === 'Registered'.
// For each course return a simplified object:
// { title, instructor, days, startTime, endTime, room, startDate, endDate }

import { excelSerialToISO } from '../utils/date';

export function parseRegistrationJson(rows) {
	if (!Array.isArray(rows)) return [];

	return rows
		.filter((r) => {
			const status = (r['Registration Status'] || r.RegistrationStatus || r['RegistrationStatus'] || '');
			return String(status).toLowerCase().includes('registered');
		})
		.map((r) => {
			const title = r['Course Listing'] || r.Course || '';
			const instructor = r['Instructor'] || '';
			const meeting = r['Meeting Patterns'] || r['Meeting Pattern'] || r.Meeting || '';

			const parts = String(meeting).split('|').map((p) => p.trim()).filter(Boolean);
			const daysPart = parts[0] || '';
			const timePart = parts[1] || '';
			const roomPart = parts[2] || '';

			const days = daysPart ? daysPart.split('/').map((d) => d.trim()).filter(Boolean) : [];

			let startTime = '';
			let endTime = '';
			if (timePart) {
				const t = timePart.split('-').map((s) => s.trim());
				startTime = t[0] || '';
				endTime = t[1] || '';
			}

			const startDate = excelSerialToISO(r['Start Date'] ?? r.StartDate ?? r['StartDate']);
			const endDate = excelSerialToISO(r['End Date'] ?? r.EndDate ?? r['EndDate']);

			return {
				title,
				instructor,
				days,
				startTime,
				endTime,
				room: roomPart,
				startDate,
				endDate,
			};
		});
  }
export default parseRegistrationJson;
