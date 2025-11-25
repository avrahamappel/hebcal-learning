// Tests for Oraysa scheduling rules.
// Adjust paths/imports to match the repo's test framework and canonical data location.

const { generateOraysa, isAdvanceDay, formatAmud } = require('../calendars/oraysa');
// const canonicalAmudList = require('../data/canonical-amud-list'); // adjust path

describe('Oraysa generator (basic rules)', () => {
  test('advance-days: Sunday through Thursday advance, Friday+Saturday do not', () => {
    // Sunday (0) -> advance true
    expect(isAdvanceDay(new Date('2025-11-23'))).toBe(true); // 2025-11-23 is Sunday
    // Thursday -> advance true
    expect(isAdvanceDay(new Date('2025-11-27'))).toBe(true);
    // Friday -> no advance
    expect(isAdvanceDay(new Date('2025-11-28'))).toBe(false);
    // Saturday -> no advance
    expect(isAdvanceDay(new Date('2025-11-29'))).toBe(false);
  });

  test('seed mapping around start date (2020-01-05 => Berachot 2a) and weekend review days', () => {
    // This test will mock a small canonical list to validate behavior independent of repo list.
    const canonicalMock = [
      { masechet: 'Berachot', daf: 2, side: 'a' },
      { masechet: 'Berachot', daf: 2, side: 'b' },
      { masechet: 'Berachot', daf: 3, side: 'a' },
      { masechet: 'Berachot', daf: 3, side: 'b' },
      { masechet: 'Berachot', daf: 4, side: 'a' }
    ];
    const from = new Date('2020-01-05'); // Sunday (advance)
    const to = new Date('2020-01-12');   // next Sunday
    const seed = { masechet: 'Berachot', daf: 2, side: 'a' };

    const map = generateOraysa({ canonicalAmudList: canonicalMock, fromDate: from, toDate: to, seedAmud: seed });
    // Expected progression:
    // 2020-01-05 Sun -> Berachot 2a (seed)
    // 2020-01-06 Mon -> Berachot 2b (advance)
    // 2020-01-07 Tue -> Berachot 3a (advance)
    // 2020-01-08 Wed -> Berachot 3b (advance)
    // 2020-01-09 Thu -> Berachot 4a (advance)
    // 2020-01-10 Fri -> Berachot 4a (review, no advance)
    // 2020-01-11 Sat -> Berachot 4a (review)
    // 2020-01-12 Sun -> (advance) stays at next if list continued but in our mock will remain same or clamp
    expect(formatAmud(map[0].amud)).toBe('Berachot 2a');
    expect(formatAmud(map[1].amud)).toBe('Berachot 2b');
    expect(formatAmud(map[4].amud)).toBe('Berachot 4a');
    // Friday & Saturday should not advance compared to the previous day
    expect(formatAmud(map[4].amud)).toBe(formatAmud(map[5].amud)); // Thu vs Fri advance/day
    expect(formatAmud(map[5].amud)).toBe(formatAmud(map[6].amud)); // Fri vs Sat review
  });

  test('integration check placeholder for Nov 26, 2025 => Yevamot 2a', () => {
    // This test should be enabled when the repo's canonicalAmudList is used.
    // Once wired to the canonical list, assert that the mapping for 2025-11-26 is Yevamot 2a.
    // Example (uncomment and adjust path when integrating):
    // const canonicalAmudList = require('../data/canonical-amud-list');
    // const from = new Date('2020-01-05');
    // const to = new Date('2025-11-26');
    // const map = generateOraysa({ canonicalAmudList, fromDate: from, toDate: to, seedAmud: {masechet:'Berachot', daf:2, side:'a'} });
    // const last = map[map.length - 1];
    // expect(formatAmud(last.amud)).toBe('Yevamot 2a');
    expect(true).toBe(true); // placeholder
  });
});
