# SkorAsasi1

Asasi Putra Semester 1 Learning Centre by Perintis Siswa.

## Production Roles

SkorAsasi1 has two roles only:

- `student` — learning dashboard, subjects, notes, topic practice, mixed challenge and own progress.
- `admin` — live student list, student detail, mastery/accuracy monitoring, content overview and cohort insights.

There is no partner/content-partner role and no frontend role-preview switch.

## Authentication & Progress v7

The application now uses real Cloudflare Pages Functions + D1 authentication:

- student registration requires full name, phone, email and password,
- login accepts email or phone + password,
- passwords are PBKDF2-SHA256 hashed with a unique salt,
- sessions use Secure + HttpOnly + SameSite=Lax cookies,
- student progress is synced from the learning engine into D1,
- admin APIs are authorized server-side and expose no password hash,
- admin can search students and open detailed learning progress.

The password fields use Lucide eye / eye-off controls for show/hide password.

## Required Cloudflare Pages Configuration

Create or attach a D1 database to the Pages project with binding name:

`DB`

The API auto-creates its schema at runtime. The same schema is also available in:

`migrations/001_auth_progress.sql`

Configure these Production environment variables/secrets in Cloudflare Pages:

- `ADMIN_EMAIL` — admin login email (required for bootstrap admin)
- `ADMIN_PASSWORD` — admin password, minimum 10 characters (required)
- `ADMIN_NAME` — optional display name, defaults to `SkorAsasi1 Admin`
- `ADMIN_PHONE` — optional admin phone number

The first API request after deployment bootstraps one admin account when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are present and no admin exists yet.

Do not commit the admin password into this repository.

## Semester 1 Content

- Mathematics
- Chemistry I
- Biology I
- Agriculture Industry
- Physics (placeholder / coming soon)

## Deployment

Cloudflare Pages:

- Branch: `main`
- Base directory: leave empty
- Build command: leave empty
- Publish directory: `.`
- Functions route: `/api/*`
- D1 binding: `DB`

## Important Files

- `index.html` — production login, student shell and admin shell
- `auth-v7.js` — account lifecycle, session gating, progress sync and admin monitoring UI
- `auth-v7.css` — authentication and admin data UI
- `functions/api/[[path]].js` — auth, session, progress and admin API
- `migrations/001_auth_progress.sql` — D1 schema
- `app-v5.js` — existing learning, quiz and mastery engine
