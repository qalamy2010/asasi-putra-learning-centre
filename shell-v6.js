(function () {
  'use strict';

  var body = document.body;
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  var roleModal = document.getElementById('roleModal');
  var studentNav = document.getElementById('studentNav');
  var adminNav = document.getElementById('adminNav');
  var mobileNav = document.getElementById('mobileNav');
  var roleLabel = document.getElementById('roleLabel');
  var roleSub = document.getElementById('roleSub');
  var profileRole = document.getElementById('profileRole');
  var pageTitle = document.getElementById('pageTitle');
  var pageEyebrow = document.getElementById('pageEyebrow');

  var VIEW_META = {
    home: ['Dashboard', 'PEMBELAJARAN'],
    subjects: ['Subjek', 'PEMBELAJARAN'],
    learn: ['Belajar', 'PEMBELAJARAN'],
    practice: ['Latihan', 'PEMBELAJARAN'],
    challenge: ['Challenge', 'PEMBELAJARAN'],
    progress: ['Progress', 'PRESTASI'],
    'admin-dashboard': ['Admin Dashboard', 'PENGURUSAN'],
    'admin-students': ['Pelajar', 'PENGURUSAN'],
    'admin-content': ['Kandungan', 'PENGURUSAN'],
    'admin-insights': ['Insights', 'ANALITIK']
  };

  function iconRefresh() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
    }
  }

  function currentView() {
    var view = document.querySelector('.view.on');
    return view ? view.id : 'home';
  }

  function updateHeading(view) {
    var meta = VIEW_META[view] || ['SkorAsasi1', 'SEMESTER 1'];
    if (pageTitle) pageTitle.textContent = meta[0];
    if (pageEyebrow) pageEyebrow.textContent = meta[1];
    document.title = meta[0] + ' | SkorAsasi1';
  }

  function updateActiveNav(view) {
    var navButtons = document.querySelectorAll('[data-shell-nav][data-view]');
    navButtons.forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-view') === view);
    });
    if (mobileNav) {
      mobileNav.querySelectorAll('[data-view]').forEach(function (button) {
        button.classList.toggle('active', button.getAttribute('data-view') === view);
      });
    }
    updateHeading(view);
  }

  function openSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.add('open');
    overlay.classList.add('show');
    body.classList.add('nav-open');
  }

  function closeSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    body.classList.remove('nav-open');
  }

  function openRoleModal() {
    if (!roleModal) return;
    roleModal.classList.remove('hidden');
    requestAnimationFrame(function () { roleModal.classList.add('visible'); });
  }

  function closeRoleModal() {
    if (!roleModal) return;
    roleModal.classList.remove('visible');
    setTimeout(function () { roleModal.classList.add('hidden'); }, 160);
  }

  function setRole(role) {
    var isAdmin = role === 'admin';
    body.classList.toggle('admin-mode', isAdmin);
    body.classList.toggle('student-mode', !isAdmin);
    if (studentNav) studentNav.classList.toggle('hidden', isAdmin);
    if (adminNav) adminNav.classList.toggle('hidden', !isAdmin);

    if (roleLabel) roleLabel.textContent = isAdmin ? 'Admin' : 'Student';
    if (roleSub) roleSub.textContent = isAdmin ? 'Control centre' : 'Learning workspace';
    if (profileRole) profileRole.textContent = isAdmin ? 'Admin' : 'Student';

    try { localStorage.setItem('skorasasi-role', role); } catch (e) {}

    closeRoleModal();
    closeSidebar();

    var targetView = isAdmin ? 'admin-dashboard' : 'home';
    var targetButton = document.querySelector('[data-view="' + targetView + '"]');
    if (targetButton) targetButton.click();
    updateActiveNav(targetView);
    iconRefresh();
  }

  function syncViewSoon() {
    setTimeout(function () {
      updateActiveNav(currentView());
      iconRefresh();
    }, 0);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('button');
    if (!button) return;

    if (button.id === 'openSidebar') {
      openSidebar();
      return;
    }
    if (button.id === 'closeSidebar') {
      closeSidebar();
      return;
    }
    if (button.id === 'roleTrigger' || button.id === 'profileRoleTrigger') {
      openRoleModal();
      return;
    }
    if (button.classList.contains('modal-close')) {
      closeRoleModal();
      return;
    }
    if (button.hasAttribute('data-role')) {
      setRole(button.getAttribute('data-role'));
      return;
    }
    if (button.hasAttribute('data-view')) {
      closeSidebar();
      syncViewSoon();
    }
  });

  if (overlay) overlay.addEventListener('click', closeSidebar);

  if (roleModal) {
    roleModal.addEventListener('click', function (event) {
      if (event.target === roleModal) closeRoleModal();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSidebar();
      closeRoleModal();
    }
  });

  var observer = new MutationObserver(function (mutations) {
    var shouldSync = mutations.some(function (mutation) {
      return mutation.type === 'attributes' && mutation.attributeName === 'class';
    });
    if (shouldSync) updateActiveNav(currentView());
  });

  document.querySelectorAll('.view').forEach(function (view) {
    observer.observe(view, { attributes: true });
  });

  var savedRole = 'student';
  try { savedRole = localStorage.getItem('skorasasi-role') || 'student'; } catch (e) {}
  setRole(savedRole === 'admin' ? 'admin' : 'student');
  updateActiveNav(currentView());
  iconRefresh();
  window.addEventListener('load', iconRefresh);
})();
