import parseRegistrationJson from './registrationParser.js';

const sample = [
  {
    'Course Listing': 'CSE 4501 - Video Game Programming II',
    'Instructor': 'Santos, Robert',
    'Meeting Patterns': 'Mon/Wed | 5:30 PM - 7:00 PM | RIDGLEY, Room 00016',
    'Registration Status': 'Registered',
    'Start Date': 45894,
    'End Date': 46008,
  },
  {
    'Course Listing': 'CSE 2301 - Intro',
    'Instructor': 'Cosgrove, Dennis',
    'Meeting Patterns': 'Tue/Thu | 10:00 AM - 11:20 AM | MCDONNELL, Room 00362',
    'Registration Status': 'Unregistered',
    'Start Date': 45894,
    'End Date': 46008,
  },
];

console.log(parseRegistrationJson(sample));
