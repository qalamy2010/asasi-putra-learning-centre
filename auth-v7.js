(function () {
  'use strict';

  var KEY = 'skorasasi1_mastery_v5';
  var currentUser = null;
  var adminStudents = [];
  var syncTimer = null;
  var lastSynced = null;
  var learningLoaded = false;

  function $(id) { return document.getElementById(id); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char];
    });
  }
  function formatDate(value) {
    if (!value) return 'Belum ada';
    try {
      return new Intl.DateTimeFormat('ms-MY', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
    } catch (_) { return value; }
  }
  function iconRefresh() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
    }
  }
  async function api(path, options) {
    var response = await fetch(path, Object.assign({
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
    }, options || {}));
    var data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok) {
      var error = new Error(data.error || 'Permintaan gagal.');
      error.status = response.status;
      throw error;
    }
    return data;
  }
  function setBusy(form, busy) {
    if (!form) return;
    form.querySelectorAll('button, input').forEach(function (el) { el.disabled = !!busy; });
    var submit = form.querySelector('[type="submit"]');
    if (submit) {
      if (busy) {
        submit.dataset.original = submit.innerHTML;
        submit.innerHTML = '<span class="spinner"></span> Memproses...';
      } else if (submit.dataset.original) {
        submit.innerHTML = submit.dataset.original;
      }
    }
  }
  function authMessage(message, type) {
    var box = $('authMessage');
    if (!box) return;
    box.textContent = message || '';
    box.className = 'auth-message' + (message ? ' show ' + (type || 'error') : '');
  }
  function showAuth(mode) {
    document.body.classList.add('auth-required');
    document.body.classList.remove('authenticated');
    var gate = $('authGate');
    if (gate) gate.classList.remove('hidden');
    var app = $('appShell');
    if (app) app.classList.add('hidden');
    switchAuth(mode || 'login');
    iconRefresh();
  }
  function switchAuth(mode) {
    var login = $('loginForm');
    var register = $('registerForm');
    if (!login || !register) return;
    var isRegister = mode === 'register';
    login.classList.toggle('hidden', isRegister);
    register.classList.toggle('hidden', !isRegister);
    document.querySelectorAll('[data-auth-mode]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-auth-mode') === mode);
    });
    authMessage('');
  }
  function updateIdentity(user) {
    var initials = String(user.fullName || 'S1').split(/\s+/).filter(Boolean).slice(0, 2).map(function (part) { return part[0]; }).join('').toUpperCase();
    document.querySelectorAll('[data-user-name]').forEach(function (el) { el.textContent = user.fullName || 'Pengguna'; });
    document.querySelectorAll('[data-user-role]').forEach(function (el) { el.textContent = user.role === 'admin' ? 'Admin' : 'Student'; });
    document.querySelectorAll('[data-user-email]').forEach(function (el) { el.textContent = user.email || ''; });
    document.querySelectorAll('[data-user-avatar]').forEach(function (el) { el.textContent = initials || 'S1'; });
  }
  function updateHeading(view) {
    var meta = {
      home: ['Dashboard', 'PEMBELAJARAN'], subjects: ['Subjek', 'PEMBELAJARAN'], learn: ['Belajar', 'PEMBELAJARAN'],
      practice: ['Latihan', 'PEMBELAJARAN'], challenge: ['Challenge', 'PEMBELAJARAN'], progress: ['Progress', 'PRESTASI'],
      'admin-dashboard': ['Admin Dashboard', 'PENGURUSAN'], 'admin-students': ['Pelajar', 'PENGURUSAN'],
      'admin-content': ['Kandungan', 'PENGURUSAN'], 'admin-insights': ['Insights', 'ANALITIK'],
    }[view] || ['SkorAsasi1', 'SEMESTER 1'];
    if ($('pageTitle')) $('pageTitle').textContent = meta[0];
    if ($('pageEyebrow')) $('pageEyebrow').textContent = meta[1];
    document.title = meta[0] + ' | SkorAsasi1';
  }
  function navigate(view) {
    document.querySelectorAll('.view').forEach(function (section) { section.classList.toggle('on', section.id === view); });
    document.querySelectorAll('[data-shell-nav][data-view]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-view') === view);
    });
    document.querySelectorAll('#mobileNav [data-view]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-view') === view);
    });
    updateHeading(view);
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openSidebar() {
    if ($('sidebar')) $('sidebar').classList.add('open');
    if ($('sidebarOverlay')) $('sidebarOverlay').classList.add('show');
  }
  function closeSidebar() {
    if ($('sidebar')) $('sidebar').classList.remove('open');
    if ($('sidebarOverlay')) $('sidebarOverlay').classList.remove('show');
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  async function loadLearningEngine() {
    if (learningLoaded) return;
    learningLoaded = true;
    await loadScript('/app-v5.js?v=v7.0');
    await loadScript('/math-quiz-addon.js?v=v7.0');
    await loadScript('/progress-tools.js?v=v7.0');
    await loadScript('/exam-countdown.js?v=v7.0');
    iconRefresh();
  }
  function hasMeaningfulState(state) {
    return !!(state && state.progress && Object.keys(state.progress).length);
  }
  function localState() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; }
  }
  async function preloadStudentState() {
    var data = await api('/api/progress', { method: 'GET', headers: {} });
    var serverState = data.state || {};
    localStorage.setItem(KEY, JSON.stringify(serverState));
    lastSynced = JSON.stringify(serverState);
  }
  async function syncProgress(force) {
    if (!currentUser || currentUser.role !== 'student') return;
    var state = localState();
    var serialized = JSON.stringify(state);
    if (!force && serialized === lastSynced) return;
    try {
      await api('/api/progress', { method: 'PUT', body: JSON.stringify({ state: state }) });
      lastSynced = serialized;
      var sync = $('syncStatus');
      if (sync) sync.textContent = 'Progress synced';
    } catch (error) {
      var sync = $('syncStatus');
      if (sync) sync.textContent = error.status === 401 ? 'Session tamat' : 'Sync tertangguh';
      if (error.status === 401) showAuth('login');
    }
  }
  function startSync() {
    clearInterval(syncTimer);
    syncTimer = setInterval(function () { syncProgress(false); }, 1800);
  }
  function stopSync() {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  async function activate(user) {
    currentUser = user;
    document.body.classList.remove('auth-required');
    document.body.classList.add('authenticated');
    if ($('authGate')) $('authGate').classList.add('hidden');
    if ($('appShell')) $('appShell').classList.remove('hidden');
    updateIdentity(user);

    var isAdmin = user.role === 'admin';
    if ($('studentNav')) $('studentNav').classList.toggle('hidden', isAdmin);
    if ($('adminNav')) $('adminNav').classList.toggle('hidden', !isAdmin);
    if ($('studentMobileNav')) $('studentMobileNav').classList.toggle('hidden', isAdmin);
    if ($('adminMobileNav')) $('adminMobileNav').classList.toggle('hidden', !isAdmin);

    if (isAdmin) {
      stopSync();
      navigate('admin-dashboard');
      await loadAdminData();
    } else {
      await preloadStudentState();
      await loadLearningEngine();
      startSync();
      navigate('home');
    }
    iconRefresh();
  }
  async function bootstrap() {
    try {
      var data = await api('/api/auth/session', { method: 'GET', headers: {} });
      await activate(data.user);
    } catch (_) {
      showAuth('login');
    }
  }

  function studentRow(student) {
    var summary = student.summary || {};
    return '<button class="student-row" type="button" data-student-id="' + esc(student.id) + '">' +
      '<span class="student-avatar">' + esc(String(student.fullName || 'S').split(/\s+/).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase()) + '</span>' +
      '<span class="student-main"><strong>' + esc(student.fullName) + '</strong><small>' + esc(student.email) + ' · ' + esc(student.phone) + '</small></span>' +
      '<span class="student-stat"><strong>' + Number(summary.mastery || 0) + '%</strong><small>Mastery</small></span>' +
      '<span class="student-stat"><strong>' + Number(summary.accuracy || 0) + '%</strong><small>Accuracy</small></span>' +
      '<span class="student-stat desktop-only"><strong>' + Number(summary.answered || 0) + '</strong><small>Answered</small></span>' +
      '<span class="student-last desktop-only"><strong>' + esc(formatDate(student.updatedAt)) + '</strong><small>Aktiviti terakhir</small></span>' +
      '<i data-lucide="chevron-right"></i></button>';
  }
  function renderStudentList(list) {
    var target = $('adminStudentList');
    if (!target) return;
    if (!list.length) {
      target.innerHTML = '<div class="admin-empty compact"><div class="admin-empty-icon"><i data-lucide="users"></i></div><h3>Belum ada pelajar</h3><p>Akaun pelajar yang mendaftar akan muncul di sini secara automatik.</p></div>';
    } else {
      target.innerHTML = list.map(studentRow).join('');
    }
    iconRefresh();
  }
  function renderAdminMetrics(metrics) {
    [['metricTotalStudents', metrics.total], ['metricActiveStudents', metrics.active7d], ['metricMastery', metrics.averageMastery + '%'], ['metricAccuracy', metrics.averageAccuracy + '%']]
      .forEach(function (pair) { if ($(pair[0])) $(pair[0]).textContent = pair[1]; });
  }
  function renderInsights() {
    var top = adminStudents.slice().sort(function (a, b) { return (b.summary.mastery || 0) - (a.summary.mastery || 0); }).slice(0, 5);
    var needsAttention = adminStudents.filter(function (student) {
      return (student.summary.mastery || 0) < 35 || !student.updatedAt;
    }).slice(0, 5);
    if ($('topStudents')) $('topStudents').innerHTML = top.length ? top.map(function (student, index) {
      return '<button class="rank-row" data-student-id="' + esc(student.id) + '"><span>' + (index + 1) + '</span><div><strong>' + esc(student.fullName) + '</strong><small>' + esc(student.email) + '</small></div><b>' + (student.summary.mastery || 0) + '%</b></button>';
    }).join('') : '<p class="muted">Belum ada data.</p>';
    if ($('attentionStudents')) $('attentionStudents').innerHTML = needsAttention.length ? needsAttention.map(function (student) {
      return '<button class="rank-row" data-student-id="' + esc(student.id) + '"><span><i data-lucide="triangle-alert"></i></span><div><strong>' + esc(student.fullName) + '</strong><small>' + (student.updatedAt ? 'Mastery masih rendah' : 'Belum mula belajar') + '</small></div><b>' + (student.summary.mastery || 0) + '%</b></button>';
    }).join('') : '<p class="muted">Tiada pelajar memerlukan perhatian sekarang.</p>';
    iconRefresh();
  }
  async function loadAdminData() {
    try {
      var data = await api('/api/admin/students', { method: 'GET', headers: {} });
      adminStudents = data.students || [];
      renderAdminMetrics(data.metrics || { total: 0, active7d: 0, averageMastery: 0, averageAccuracy: 0 });
      renderStudentList(adminStudents);
      renderInsights();
      if ($('adminDataStatus')) $('adminDataStatus').textContent = 'Live data · ' + formatDate(new Date().toISOString());
    } catch (error) {
      if ($('adminStudentList')) $('adminStudentList').innerHTML = '<div class="admin-error"><strong>Data belum dapat dimuatkan</strong><span>' + esc(error.message) + '</span></div>';
    }
  }
  function subjectLabel(key) {
    return { mathematics: 'Mathematics', chemistry: 'Chemistry I', biology: 'Biology I', agriculture: 'Agriculture' }[key] || key;
  }
  async function openStudentDetail(id) {
    var modal = $('studentDetailModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    $('studentDetailBody').innerHTML = '<div class="detail-loading"><span class="spinner dark"></span> Memuatkan progress...</div>';
    try {
      var data = await api('/api/admin/student?id=' + encodeURIComponent(id), { method: 'GET', headers: {} });
      var student = data.student;
      var summary = student.summary || {};
      var subjects = Object.keys(summary.subjectMastery || {}).map(function (key) {
        var value = summary.subjectMastery[key] || 0;
        return '<div class="detail-progress-row"><div><strong>' + esc(subjectLabel(key)) + '</strong><span>' + value + '% mastery</span></div><div class="detail-track"><i style="width:' + value + '%"></i></div></div>';
      }).join('');
      $('studentDetailBody').innerHTML = '<div class="detail-profile"><span class="student-avatar large">' + esc(String(student.fullName || 'S').split(/\s+/).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase()) + '</span><div><h3>' + esc(student.fullName) + '</h3><p>' + esc(student.email) + '<br>' + esc(student.phone) + '</p></div></div>' +
        '<div class="detail-metrics"><div><strong>' + (summary.mastery || 0) + '%</strong><span>Mastery</span></div><div><strong>' + (summary.accuracy || 0) + '%</strong><span>Accuracy</span></div><div><strong>' + (summary.answered || 0) + '</strong><span>Answered</span></div><div><strong>' + (summary.topicsMastered || 0) + '</strong><span>Topics mastered</span></div></div>' +
        '<div class="detail-meta"><div><span>Daftar</span><strong>' + esc(formatDate(student.createdAt)) + '</strong></div><div><span>Login terakhir</span><strong>' + esc(formatDate(student.lastLoginAt)) + '</strong></div><div><span>Aktiviti belajar</span><strong>' + esc(formatDate(student.updatedAt)) + '</strong></div><div><span>Current path</span><strong>' + esc((summary.activeSubject || 'Belum mula') + (summary.activeChapter ? ' · ' + summary.activeChapter : '')) + '</strong></div></div>' +
        '<div class="detail-section"><span class="section-kicker">SUBJEK</span><h3>Progress mengikut subjek</h3>' + subjects + '</div>';
    } catch (error) {
      $('studentDetailBody').innerHTML = '<div class="admin-error"><strong>Gagal membuka detail</strong><span>' + esc(error.message) + '</span></div>';
    }
    iconRefresh();
  }
  function closeStudentDetail() {
    if ($('studentDetailModal')) $('studentDetailModal').classList.add('hidden');
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('button');
    if (!button) return;

    if (button.hasAttribute('data-auth-mode')) { switchAuth(button.getAttribute('data-auth-mode')); return; }
    if (button.classList.contains('password-toggle')) {
      var input = document.getElementById(button.getAttribute('data-password-target'));
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        button.innerHTML = '<i data-lucide="' + (input.type === 'password' ? 'eye' : 'eye-off') + '"></i>';
        button.setAttribute('aria-label', input.type === 'password' ? 'Lihat password' : 'Sembunyikan password');
        iconRefresh();
      }
      return;
    }
    if (button.id === 'openSidebar') { openSidebar(); return; }
    if (button.id === 'closeSidebar') { closeSidebar(); return; }
    if (button.id === 'logoutBtn' || button.id === 'mobileLogoutBtn') {
      syncProgress(true).finally(async function () {
        try { await api('/api/auth/logout', { method: 'POST', body: '{}' }); } catch (_) {}
        stopSync();
        localStorage.removeItem(KEY);
        location.reload();
      });
      return;
    }
    if (button.hasAttribute('data-student-id')) { openStudentDetail(button.getAttribute('data-student-id')); return; }
    if (button.id === 'closeStudentDetail') { closeStudentDetail(); return; }
    if (button.id === 'refreshAdmin') { loadAdminData(); return; }
    if (button.hasAttribute('data-view')) {
      navigate(button.getAttribute('data-view'));
      if (currentUser && currentUser.role === 'admin' && button.getAttribute('data-view') === 'admin-students') loadAdminData();
    }
  });

  if ($('sidebarOverlay')) $('sidebarOverlay').addEventListener('click', closeSidebar);
  if ($('studentDetailModal')) $('studentDetailModal').addEventListener('click', function (event) { if (event.target === $('studentDetailModal')) closeStudentDetail(); });

  if ($('loginForm')) $('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    var form = event.currentTarget;
    setBusy(form, true); authMessage('');
    try {
      var data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ identifier: form.identifier.value, password: form.password.value }) });
      await activate(data.user);
    } catch (error) { authMessage(error.message, 'error'); }
    finally { setBusy(form, false); }
  });

  if ($('registerForm')) $('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    var form = event.currentTarget;
    var legacyState = localState();
    setBusy(form, true); authMessage('');
    try {
      var data = await api('/api/auth/register', { method: 'POST', body: JSON.stringify({
        fullName: form.fullName.value, phone: form.phone.value, email: form.email.value, password: form.password.value,
      }) });
      if (hasMeaningfulState(legacyState)) {
        try { await api('/api/progress', { method: 'PUT', body: JSON.stringify({ state: legacyState }) }); } catch (_) {}
      }
      await activate(data.user);
    } catch (error) { authMessage(error.message, 'error'); }
    finally { setBusy(form, false); }
  });

  if ($('studentSearch')) $('studentSearch').addEventListener('input', function (event) {
    var query = event.target.value.trim().toLowerCase();
    renderStudentList(adminStudents.filter(function (student) {
      return [student.fullName, student.email, student.phone].join(' ').toLowerCase().includes(query);
    }));
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { closeSidebar(); closeStudentDetail(); }
  });

  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') syncProgress(true); });
  window.addEventListener('beforeunload', function () {
    if (!currentUser || currentUser.role !== 'student') return;
    var state = localState();
    var serialized = JSON.stringify(state);
    if (serialized === lastSynced) return;
    try { navigator.sendBeacon('/api/progress', new Blob([JSON.stringify({ state: state })], { type: 'application/json' })); } catch (_) {}
  });

  bootstrap();
  iconRefresh();
})();
