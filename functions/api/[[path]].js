const SESSION_COOKIE = 'skorasasi_session';
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const ITERATIONS = 120000;

const SUBJECTS = {
  mathematics: ['math1', 'math2', 'math3', 'math4'],
  chemistry: ['chem1', 'chem2', 'chem3', 'chem4'],
  biology: ['bio2', 'bio3'],
  agriculture: ['agri1', 'agri2'],
};
const TOPIC_COUNTS = {
  math1: 5, math2: 5, math3: 4, math4: 4,
  chem1: 4, chem2: 4, chem3: 4, chem4: 4,
  bio2: 5, bio3: 5,
  agri1: 4, agri2: 4,
};

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });
}

function base64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value) {
  const normalized = String(value || '');
  const padded = normalized.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - normalized.length % 4) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function randomToken(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return base64Url(new Uint8Array(digest));
}

async function hashPassword(password, salt = randomToken(18), iterations = ITERATIONS) {
  const material = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2', hash: 'SHA-256', salt: decodeBase64Url(salt), iterations: Number(iterations) || ITERATIONS,
  }, material, 256);
  return { hash: base64Url(new Uint8Array(bits)), salt, iterations: Number(iterations) || ITERATIONS };
}

async function verifyPassword(password, user) {
  const actual = await hashPassword(password, user.password_salt, user.password_iterations);
  const expected = String(user.password_hash || '');
  if (actual.hash.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.hash.length; index += 1) {
    difference |= actual.hash.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return difference === 0;
}

function parseCookies(request) {
  const output = {};
  for (const part of (request.headers.get('cookie') || '').split(';')) {
    const item = part.trim();
    if (!item) continue;
    const index = item.indexOf('=');
    if (index > 0) output[decodeURIComponent(item.slice(0, index))] = decodeURIComponent(item.slice(index + 1));
  }
  return output;
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePhone(value) {
  const raw = String(value || '').trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('60')) return `+${digits}`;
  if (digits.startsWith('0')) return `+60${digits.slice(1)}`;
  return `+${digits}`;
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 160;
}

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    phone: user.phone || '',
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at || null,
  };
}

async function ensureSchema(env) {
  if (!env?.DB) throw new Error('Cloudflare D1 binding "DB" belum disambungkan pada projek SkorAsasi1.');
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_iterations INTEGER NOT NULL DEFAULT 120000,
    role TEXT NOT NULL DEFAULT 'student',
    created_at TEXT NOT NULL,
    last_login_at TEXT
  )`).run();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`).run();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS learning_state (
    user_id TEXT PRIMARY KEY,
    state_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`).run();
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)').run();
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at)').run();
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)').run();
}

async function ensureAdmin(env) {
  const email = normalizeEmail(env.ADMIN_EMAIL || '');
  const password = String(env.ADMIN_PASSWORD || '');
  if (!email || !password) return;
  if (!validEmail(email) || password.length < 10) throw new Error('ADMIN_EMAIL atau ADMIN_PASSWORD Cloudflare tidak sah.');

  const existingAdmin = await env.DB.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").first();
  if (existingAdmin) return;

  const now = new Date().toISOString();
  const passwordData = await hashPassword(password);
  const id = crypto.randomUUID();
  const fullName = String(env.ADMIN_NAME || 'SkorAsasi1 Admin').trim().slice(0, 80) || 'SkorAsasi1 Admin';
  const phone = normalizePhone(env.ADMIN_PHONE || '') || null;
  const existingEmail = await env.DB.prepare('SELECT id FROM users WHERE email = ? LIMIT 1').bind(email).first();
  if (existingEmail) {
    await env.DB.prepare(`UPDATE users SET full_name = ?, phone = ?, password_hash = ?, password_salt = ?,
      password_iterations = ?, role = 'admin' WHERE id = ?`)
      .bind(fullName, phone, passwordData.hash, passwordData.salt, passwordData.iterations, existingEmail.id).run();
    return;
  }
  await env.DB.prepare(`INSERT INTO users (
    id, full_name, phone, email, password_hash, password_salt, password_iterations, role, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'admin', ?)`)
    .bind(id, fullName, phone, email, passwordData.hash, passwordData.salt, passwordData.iterations, now).run();
  await env.DB.prepare("INSERT INTO learning_state (user_id, state_json, updated_at) VALUES (?, '{}', ?)")
    .bind(id, now).run();
}

async function sessionUser(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  const tokenHash = await sha256(token);
  return env.DB.prepare(`SELECT users.id, users.full_name, users.phone, users.email, users.role,
      users.created_at, users.last_login_at, sessions.id AS session_id
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ? LIMIT 1`)
    .bind(tokenHash, new Date().toISOString()).first();
}

async function createSession(env, userId) {
  const token = randomToken();
  const tokenHash = await sha256(token);
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_SECONDS * 1000);
  await env.DB.prepare('INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), userId, tokenHash, expires.toISOString(), now.toISOString()).run();
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}`;
}

async function destroySession(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (token) {
    const tokenHash = await sha256(token);
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run();
  }
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function topicPct(topic) {
  const attempts = Number(topic?.attempts || 0);
  const correct = Number(topic?.correct || 0);
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  if (attempts >= 12 && accuracy >= 85) return 100;
  if (attempts >= 8 && accuracy >= 75) return 78;
  if (attempts >= 4 && accuracy >= 65) return 55;
  if (attempts > 0) return 30;
  return 0;
}

function stateSummary(rawState) {
  const state = rawState && typeof rawState === 'object' ? rawState : {};
  const progress = state.progress && typeof state.progress === 'object' ? state.progress : {};
  const chapterMastery = {};
  let answered = 0;
  let correct = 0;
  let topicsAttempted = 0;
  let topicsMastered = 0;

  for (const [chapterId, count] of Object.entries(TOPIC_COUNTS)) {
    const chapter = progress[chapterId] || {};
    const topics = chapter.topics && typeof chapter.topics === 'object' ? Object.values(chapter.topics) : [];
    let total = 0;
    for (const topic of topics) {
      const pct = topicPct(topic);
      total += pct;
      if (Number(topic?.attempts || 0) > 0) topicsAttempted += 1;
      if (pct === 100) topicsMastered += 1;
    }
    chapterMastery[chapterId] = Math.round(total / count);
    answered += Number(chapter.answered || 0);
    correct += Number(chapter.correct || 0);
  }

  const subjectMastery = {};
  for (const [subject, chapters] of Object.entries(SUBJECTS)) {
    subjectMastery[subject] = Math.round(chapters.reduce((sum, id) => sum + (chapterMastery[id] || 0), 0) / chapters.length);
  }
  const subjectValues = Object.values(subjectMastery);
  const mastery = Math.round(subjectValues.reduce((sum, value) => sum + value, 0) / subjectValues.length);
  return {
    mastery,
    accuracy: answered ? Math.round((correct / answered) * 100) : 0,
    answered,
    correct,
    topicsAttempted,
    topicsMastered,
    subjectMastery,
    chapterMastery,
    activeSubject: state.activeSubject || null,
    activeChapter: state.activeChapter || null,
  };
}

async function readBody(request) {
  try { return await request.json(); }
  catch { return {}; }
}

async function handleRegister(request, env) {
  const body = await readBody(request);
  const fullName = String(body.fullName || '').trim();
  const phone = normalizePhone(body.phone);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (fullName.length < 2 || fullName.length > 80) return json({ ok: false, error: 'Nama perlu antara 2 hingga 80 aksara.' }, 400);
  if (!/^\+\d{9,15}$/.test(phone)) return json({ ok: false, error: 'Masukkan nombor telefon yang sah.' }, 400);
  if (!validEmail(email)) return json({ ok: false, error: 'Masukkan alamat email yang sah.' }, 400);
  if (password.length < 8 || password.length > 128) return json({ ok: false, error: 'Password perlu sekurang-kurangnya 8 aksara.' }, 400);

  const existing = await env.DB.prepare('SELECT id, email, phone FROM users WHERE email = ? OR phone = ? LIMIT 1').bind(email, phone).first();
  if (existing) return json({ ok: false, error: existing.email === email ? 'Email ini sudah berdaftar.' : 'Nombor telefon ini sudah berdaftar.' }, 409);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const passwordData = await hashPassword(password);
  await env.DB.prepare(`INSERT INTO users (
    id, full_name, phone, email, password_hash, password_salt, password_iterations, role, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'student', ?)`)
    .bind(id, fullName, phone, email, passwordData.hash, passwordData.salt, passwordData.iterations, now).run();
  await env.DB.prepare("INSERT INTO learning_state (user_id, state_json, updated_at) VALUES (?, '{}', ?)").bind(id, now).run();
  const cookie = await createSession(env, id);
  return json({ ok: true, user: { id, fullName, phone, email, role: 'student', createdAt: now, lastLoginAt: now } }, 201, { 'set-cookie': cookie });
}

async function handleLogin(request, env) {
  const body = await readBody(request);
  const identifierRaw = String(body.identifier || '').trim();
  const password = String(body.password || '');
  if (!identifierRaw || !password) return json({ ok: false, error: 'Email / telefon dan password diperlukan.' }, 400);
  const isEmail = identifierRaw.includes('@');
  const identifier = isEmail ? normalizeEmail(identifierRaw) : normalizePhone(identifierRaw);
  const user = await env.DB.prepare(`SELECT id, full_name, phone, email, role, created_at, last_login_at,
      password_hash, password_salt, password_iterations
    FROM users WHERE ${isEmail ? 'email' : 'phone'} = ? LIMIT 1`).bind(identifier).first();
  if (!user || !(await verifyPassword(password, user))) return json({ ok: false, error: 'Email / telefon atau password tidak tepat.' }, 401);

  const now = new Date().toISOString();
  await env.DB.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').bind(now, user.id).run();
  await env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now).run();
  const cookie = await createSession(env, user.id);
  user.last_login_at = now;
  return json({ ok: true, user: publicUser(user) }, 200, { 'set-cookie': cookie });
}

async function handleSession(request, env) {
  const user = await sessionUser(request, env);
  if (!user) return json({ ok: false, authenticated: false }, 401);
  return json({ ok: true, authenticated: true, user: publicUser(user) });
}

async function handleProgress(request, env, user) {
  if (user.role !== 'student') return json({ ok: false, error: 'Student sahaja.' }, 403);
  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT state_json, updated_at FROM learning_state WHERE user_id = ? LIMIT 1').bind(user.id).first();
    let state = {};
    try { state = JSON.parse(row?.state_json || '{}'); } catch {}
    return json({ ok: true, state, updatedAt: row?.updated_at || null, summary: stateSummary(state) });
  }
  if (request.method === 'PUT' || request.method === 'POST') {
    const body = await readBody(request);
    const state = body.state && typeof body.state === 'object' ? body.state : null;
    if (!state) return json({ ok: false, error: 'State pembelajaran tidak sah.' }, 400);
    const serialized = JSON.stringify(state);
    if (serialized.length > 300000) return json({ ok: false, error: 'Data progress terlalu besar.' }, 413);
    const now = new Date().toISOString();
    await env.DB.prepare(`INSERT INTO learning_state (user_id, state_json, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at`)
      .bind(user.id, serialized, now).run();
    return json({ ok: true, updatedAt: now, summary: stateSummary(state) });
  }
  return json({ ok: false, error: 'Kaedah tidak dibenarkan.' }, 405);
}

async function handleAdminStudents(request, env, user) {
  if (user.role !== 'admin') return json({ ok: false, error: 'Admin sahaja.' }, 403);
  const rows = await env.DB.prepare(`SELECT users.id, users.full_name, users.phone, users.email, users.created_at,
      users.last_login_at, learning_state.state_json, learning_state.updated_at
    FROM users LEFT JOIN learning_state ON learning_state.user_id = users.id
    WHERE users.role = 'student' ORDER BY COALESCE(learning_state.updated_at, users.created_at) DESC`).all();
  const students = (rows.results || []).map((row) => {
    let state = {};
    try { state = JSON.parse(row.state_json || '{}'); } catch {}
    return {
      id: row.id, fullName: row.full_name, phone: row.phone || '', email: row.email,
      createdAt: row.created_at, lastLoginAt: row.last_login_at || null, updatedAt: row.updated_at || null,
      summary: stateSummary(state),
    };
  });
  const activeSince = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const active7d = students.filter((student) => student.updatedAt && new Date(student.updatedAt).getTime() >= activeSince).length;
  const averageMastery = students.length ? Math.round(students.reduce((sum, student) => sum + student.summary.mastery, 0) / students.length) : 0;
  const answeredStudents = students.filter((student) => student.summary.answered > 0);
  const averageAccuracy = answeredStudents.length ? Math.round(answeredStudents.reduce((sum, student) => sum + student.summary.accuracy, 0) / answeredStudents.length) : 0;
  return json({ ok: true, students, metrics: { total: students.length, active7d, averageMastery, averageAccuracy } });
}

async function handleAdminStudent(request, env, user) {
  if (user.role !== 'admin') return json({ ok: false, error: 'Admin sahaja.' }, 403);
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ ok: false, error: 'Student ID diperlukan.' }, 400);
  const row = await env.DB.prepare(`SELECT users.id, users.full_name, users.phone, users.email, users.created_at,
      users.last_login_at, learning_state.state_json, learning_state.updated_at
    FROM users LEFT JOIN learning_state ON learning_state.user_id = users.id
    WHERE users.id = ? AND users.role = 'student' LIMIT 1`).bind(id).first();
  if (!row) return json({ ok: false, error: 'Pelajar tidak ditemui.' }, 404);
  let state = {};
  try { state = JSON.parse(row.state_json || '{}'); } catch {}
  return json({ ok: true, student: {
    id: row.id, fullName: row.full_name, phone: row.phone || '', email: row.email,
    createdAt: row.created_at, lastLoginAt: row.last_login_at || null, updatedAt: row.updated_at || null,
    summary: stateSummary(state), state,
  } });
}

export async function onRequest({ request, env }) {
  try {
    await ensureSchema(env);
    await ensureAdmin(env);
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/api/health' && request.method === 'GET') return json({ ok: true, database: true });
    if (path === '/api/auth/register' && request.method === 'POST') return handleRegister(request, env);
    if (path === '/api/auth/login' && request.method === 'POST') return handleLogin(request, env);
    if (path === '/api/auth/session' && request.method === 'GET') return handleSession(request, env);
    if (path === '/api/auth/logout' && request.method === 'POST') {
      const cookie = await destroySession(request, env);
      return json({ ok: true }, 200, { 'set-cookie': cookie });
    }

    const user = await sessionUser(request, env);
    if (!user) return json({ ok: false, error: 'Sila log masuk semula.' }, 401);
    if (path === '/api/progress') return handleProgress(request, env, user);
    if (path === '/api/admin/students' && request.method === 'GET') return handleAdminStudents(request, env, user);
    if (path === '/api/admin/student' && request.method === 'GET') return handleAdminStudent(request, env, user);
    return json({ ok: false, error: 'Endpoint tidak ditemui.' }, 404);
  } catch (error) {
    console.error('SkorAsasi API error:', error);
    return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 500);
  }
}
