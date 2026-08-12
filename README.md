# PressureGuard Care

Pressure injury prevention & clinical documentation workflow, built as one
system across three surfaces:

- **`backend/`** — Node.js + Express + MongoDB REST API
- **`frontend/`** — React + Vite web app (staff-facing dashboard)
- **`mobile/`** — Flutter app (iOS + Android) for bedside use

All three share the same data model and the same five clinical modules,
sourced from the Lovable prototype you provided:

| Module | What it does |
|---|---|
| **Repositioning** | 2-hour turn timer per patient, position log with staff/notes |
| **Braden Scale** | 6-category risk assessment (6–23), auto-computed risk level & guidance |
| **Skin Inspection** | Head-to-toe check across 12 body areas, 7-stage findings, tagged wound photos |
| **Diabetic Foot** | Wagner grade (0–5) monitoring, drainage/pulses/sensation, tagged photos, trend view |
| **Compliance** | Unit-wide 24h turn compliance %, overdue patients, high-risk roster, CSV export |

⚠️ **Read `APP_STORE_COMPLIANCE.md` before submitting the mobile app for
review.** You mentioned there's no medical certification behind this
product — that document explains exactly how to stay compliant with Apple's
guidelines anyway (this is achievable; the guide covers what to change).

---

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env      # edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed               # creates admin@pressureguard.local / ChangeMe123!
npm run dev                 # http://localhost:4000
```

Requires a running MongoDB instance (local `mongod`, Docker, or Atlas) —
point `MONGO_URI` in `.env` at it.


### 2. Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                 # http://localhost:5173
```

Sign in with the seeded admin account, or register a new staff account from
the login screen (see the note in `backend/src/controllers/authController.js`
about gating this behind invites before production).

### 3. Mobile (Flutter)

```bash
cd mobile
flutter create . --project-name pressureguard_care
# merge ios/Runner/Info-additions.plist → ios/Runner/Info.plist
# merge android/app/.../AndroidManifest-additions.xml → the generated manifest
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:4000/api   # Android emulator
```

See `mobile/README.md` for full setup, including physical-device and
production configuration.

---

## Architecture notes

- **Photos are never stored as base64 in the database.** The Lovable
  prototype stored wound photos as base64 data URLs in `localStorage`, which
  doesn't scale to a real multi-user backend. This rebuild uploads photos via
  `POST /api/uploads` (multipart, served by Multer) and stores only the
  returned URL in Mongo — both the web and mobile clients follow this same
  flow.
- **History is real history, not just "latest state."** The prototype only
  kept the patient's *current* Braden score. This rebuild adds a full
  `BradenAssessment` collection so every assessment is retained for audit,
  while still denormalizing the latest score onto `Patient` for fast
  dashboard reads.
- **Auth is new.** The prototype had none (all data lived in one browser's
  `localStorage`). This rebuild adds JWT-based staff accounts so multiple
  users/devices share the same patient data safely. **Before production,**
  gate `/api/auth/register` behind an admin-invite flow — right now anyone
  who can reach the API can create a staff account, which is fine for a demo
  but not for real patient data.
- **Enums are validated server-side**, not just in the UI — position names,
  skin areas, Wagner grades, etc. are enforced by Mongoose schema validation
  so mobile and web can never write inconsistent data.

## What's not included / next steps

- Automated tests (unit/integration) for any of the three apps.
- Offline support for the mobile app (see `mobile/README.md`).
- Push notifications for overdue repositioning.
- Per-unit / per-assignment role-based access control (currently just
  `staff` vs `admin`).
- HIPAA-specific infrastructure (BAAs, encryption at rest, full audit
  logging) — flagged in detail in `APP_STORE_COMPLIANCE.md` §5, since your
  facility customers will ask about this even though Apple won't.
- PDF report generation (the Lovable prototype used `jspdf` client-side for
  per-patient/per-shift PDFs with a signature block; this rebuild ships CSV
  export from the same compliance data — the PDF layer can be added back
  using the same `jspdf`/`jspdf-autotable` approach against the new API data
  shapes if you want it restored).
