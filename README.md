# SkorAsasi1

Asasi Putra Semester 1 Learning Centre by Perintis Siswa.

## Current App

SkorAsasi1 is a responsive Semester 1 learning workspace with two product roles only:

- `student` — dashboard, subjects, learning notes, topic practice, mixed challenge and personal progress.
- `admin` — platform overview, student-readiness view, content workspace and analytics-readiness view.

There is no partner/content-partner role in SkorAsasi1.

## UI v6

The current interface uses a Mahirly-inspired application shell with:

- responsive desktop sidebar and mobile navigation,
- consistent Lucide line icons,
- clearer learning hierarchy and top-level progress context,
- dedicated Admin and Student views,
- preserved existing quiz, mastery, progress and exam-countdown engine.

## Semester 1 Content

- Mathematics
- Chemistry I
- Biology I
- Agriculture Industry
- Physics (placeholder / coming soon)

Content is organised through `data/semester-1/` and the current learning engine.

## Deployment

Cloudflare Pages / static hosting:

- Branch: `main`
- Base directory: leave empty
- Build command: leave empty
- Publish directory: `.`

## Data Note

Student progress is currently stored locally on the browser/device. Central student accounts, cross-device sync and cohort analytics require a backend identity + database phase.
