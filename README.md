# Redro Workforce

**Employee & Attendance Management** — a free, offline-first PWA by Redro.

## Project status

The first foundation commit establishes the responsive application shell, English/Arabic interface, installable PWA configuration, offline app-shell caching, and an initial local attendance flow.

This is an early development build, not a finished attendance system.

## Current foundation

- Mobile-first responsive dashboard.
- Redro red and charcoal visual identity.
- English and Arabic interface toggle.
- Local-device attendance prototype.
- Automatic check-in then check-out flow.
- One check-in and one check-out per employee per day.
- Late check-in calculation when a branch start time exists.
- PWA manifest and service worker.

## Product rules

- One attendance monitor account.
- No phone fingerprint integration.
- One shift per branch.
- Attendance movements are immutable through the normal interface.
- Absence and leave are recorded manually.
- No automatic absence marking.
- No employee photo or notes field.
- Employee deletion is permanent and must require confirmation and password protection.
- Data is local to the current browser/device in the first version. It does not automatically synchronize between a phone and a computer.

## Development roadmap

1. Complete employee and branch management.
2. Implement IndexedDB storage and data migration.
3. Add attendance history, manual absence and leave records.
4. Add reports and real PDF/Excel/CSV exports.
5. Add password/PIN app lock and audit log.
6. Add encrypted manual backup and verified restore.
7. Test installation, offline behavior, accessibility and mobile layouts.

## Deployment

The project is a static PWA and can be hosted with GitHub Pages. No paid service or backend is required for the initial local-only version.

## Data warning

Browser storage can be lost if site data is cleared, browser storage is reset, or the device is lost. Create backups regularly once backup functionality is available.

## License

MIT