# Oraysa study calendar — design & implementation notes

Summary
- Oraysa studies one amud per progression day.
- Progression days: Sunday–Thursday (advance).
- Review days: Friday & Shabbat (Friday + Saturday) — no advancement.
- Start: 2020-01-05 = Berachot 2a.
- Holidays do NOT pause the schedule.
- Reuse the repo's canonical daf/amud ordering and logic for pages that lack an "amud b".

Goals
- Add a calendar generator option "Oraysa" that behaves like Daf Yomi but steps by amud and skips advancement on Friday & Saturday.
- Keep changes minimal and re-use existing data structures for canonical ordering and exports.

Files to add
- calendars/oraysa.js — Oraysa generator module (exports generator + small helper functions).
- test/oraysa.test.js — Unit tests validating progression rules and key dates.
- ORAYSA-IMPLEMENTATION.md — this document.

Implementation notes
- Use the repo's canonical amud/daf list (imported from existing data source) so that masechet end-of-daf behavior (missing 'b') is handled correctly.
- The generator advances to the next amud only on calendar days Sunday–Thursday.
- The generator accepts a start offset (date + amud) to allow seeding and testability.
- Add tests that:
  - seed the schedule at 2020-01-05 => Berachot 2a and verify early mappings,
  - ensure Friday & Saturday do not produce new amud,
  - verify that Nov 26, 2025 maps to Yevamot 2a (test will depend on canonical list).
- Keep all existing calendars unchanged; register Oraysa as a new calendar option in the same place other calendars are registered.

Usage
- Calendar consumers should be able to request Oraysa for a date range and receive a date→amud mapping or iCal/JSON export, same as other calendars.
