// Oraysa calendar generator
// - Advances one amud per progression day (Sunday–Thursday).
// - Review days (no advancement): Friday, Saturday.
// - Start: 2020-01-05 => Berachot 2a (seedable).
//
// NOTE: Replace the `canonicalAmudList` import path with the repo's canonical daf/amud list.

const DAY_MS = 24 * 60 * 60 * 1000;

// Example import (adjust path to repository's canonical list):
// const canonicalAmudList = require('../data/canonical-amud-list');

function isAdvanceDay(date) {
  // JS Date.getDay(): 0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday
  const wd = date.getDay();
  // Advance on Sunday(0) through Thursday(4). No advance on Friday(5) or Saturday(6).
  return wd >= 0 && wd <= 4;
}

function findAmudIndex(list, target) {
  return list.findIndex(a =>
    a.masechet === target.masechet && a.daf === target.daf && a.side === target.side
  );
}

function nextAmudIndex(list, currentIndex) {
  const next = currentIndex + 1;
  return next < list.length ? next : currentIndex; // clamp at end
}

// Generate an array of { date: 'YYYY-MM-DD', amud: {masechet,daf,side} }
function generateOraysa({ canonicalAmudList, fromDate, toDate, seedAmud }) {
  if (!canonicalAmudList || !Array.isArray(canonicalAmudList)) {
    throw new Error('canonicalAmudList must be provided as an array');
  }
  const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  let cursor = new Date(start);
  const mapping = [];

  let currentIndex = findAmudIndex(canonicalAmudList, seedAmud);
  if (currentIndex === -1) {
    throw new Error('Start amud not found in canonical list');
  }

  while (cursor <= end) {
    mapping.push({
      date: cursor.toISOString().slice(0, 10),
      amud: canonicalAmudList[currentIndex],
      weekday: cursor.getDay()
    });

    const nextDay = new Date(cursor.getTime() + DAY_MS);
    if (nextDay <= end && isAdvanceDay(nextDay)) {
      currentIndex = nextAmudIndex(canonicalAmudList, currentIndex);
    }
    cursor = nextDay;
  }

  return mapping;
}

// Helper to format amud as string "Masechet D#<a|b>"
function formatAmud(amud) {
  return `${amud.masechet} ${amud.daf}${amud.side}`;
}

module.exports = {
  isAdvanceDay,
  generateOraysa,
  formatAmud
};
