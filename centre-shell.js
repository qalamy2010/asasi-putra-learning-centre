(function () {
  var subjects = [
    {
      id: "mathematics",
      name: "Mathematics",
      accent: "Math",
      status: "live",
      chapters: [
        { id: "math-ch1", number: 1, title: "Real Number System", status: "live" },
        { id: "math-ch2", number: 2, title: "Complex Numbers", status: "live" },
        { id: "math-ch3", number: 3, title: "Next Mathematics Chapter", status: "pending" }
      ]
    },
    {
      id: "chemistry",
      name: "Chemistry",
      accent: "Chem",
      status: "pending",
      chapters: [
        { id: "chem-ch1", number: 1, title: "Chapter 1", status: "pending" },
        { id: "chem-ch2", number: 2, title: "Chapter 2", status: "pending" },
        { id: "chem-ch3", number: 3, title: "Chapter 3", status: "pending" }
      ]
    },
    {
      id: "biology",
      name: "Biology",
      accent: "Bio",
      status: "pending",
      chapters: [
        { id: "bio-ch1", number: 1, title: "Chapter 1", status: "pending" },
        { id: "bio-ch2", number: 2, title: "Chapter 2", status: "pending" },
        { id: "bio-ch3", number: 3, title: "Chapter 3", status: "pending" }
      ]
    },
    {
      id: "physics",
      name: "Physics",
      accent: "Phy",
      status: "pending",
      chapters: [
        { id: "phy-ch1", number: 1, title: "Chapter 1", status: "pending" },
        { id: "phy-ch2", number: 2, title: "Chapter 2", status: "pending" },
        { id: "phy-ch3", number: 3, title: "Chapter 3", status: "pending" }
      ]
    }
  ];

  function safeParse(value) {
    try { return JSON.parse(value); } catch (error) { return null; }
  }

  function getProgressStore() {
    try { return safeParse(localStorage.getItem("skorasasi1ProgressStable")) || {}; } catch (error) { return {}; }
  }

  function mathChapterProgress(chapterId) {
    var store = getProgressStore();
    var chapter = store.chapters && store.chapters[chapterId] ? store.chapters[chapterId] : null;
    if (!chapter || !chapter.topics) return { mastery: 0, accuracy: 0, answered: 0, status: "Not started" };
    var topicIds = Object.keys(chapter.topics);
    var total = 0;
    for (var i = 0; i < topicIds.length; i++) {
      var t = chapter.topics[topicIds[i]];
      var acc = t.attempts ? Math.round((t.correct / t.attempts) * 100) : 0;
      var score = 0;
      if (t.attempts >= 8 && acc >= 90) score = 100;
      else if (t.attempts >= 5 && acc >= 80) score = 82;
      else if (t.attempts >= 3 && acc >= 70) score = 60;
      else if (t.attempts > 0) score = 35;
      total += score;
    }
    var mastery = topicIds.length ? Math.round(total / topicIds.length) : 0;
    var accuracy = chapter.answered ? Math.round((chapter.correct / chapter.answered) * 100) : 0;
    return {
      mastery: mastery,
      accuracy: accuracy,
      answered: chapter.answered || 0,
      status: mastery >= 80 ? "Strong" : mastery > 0 ? "In progress" : "Not started"
    };
  }

  function subjectProgress(subject) {
    if (subject.id !== "mathematics") return { mastery: 0, live: 0, total: subject.chapters.length, status: "Content pending" };
    var live = 0;
    var totalMastery = 0;
    for (var i = 0; i < subject.chapters.length; i++) {
      if (subject.chapters[i].status === "live") {
        live++;
        totalMastery += mathChapterProgress(subject.chapters[i].id).mastery;
      }
    }
    return { mastery: live ? Math.round(totalMastery / live) : 0, live: live, total: subject.chapters.length, status: "Live" };
  }

  function overallProgress() {
    var total = 0;
    for (var i = 0; i < subjects.length; i++) total += subjectProgress(subjects[i]).mastery;
    return Math.round(total / subjects.length);
  }

  function badge(status) {
    return status === "live" ? '<span class="centre-badge live">Live</span>' : '<span class="centre-badge pending">Coming soon</span>';
  }

  function renderHomeUpgrade() {
    var dashboard = document.getElementById("dashboard");
    if (!dashboard) return;
    var head = dashboard.querySelector(".section-head h2");
    var copy = dashboard.querySelector(".section-head p");
    if (head) head.textContent = "SkorAsasi1 Command Centre";
    if (copy) copy.textContent = "One learning centre for Asasi Putra UPM Semester 1. Start with live Mathematics chapters, then expand subject by subject.";

    var existing = document.getElementById("centreHero");
    if (!existing) {
      var hero = document.createElement("div");
      hero.id = "centreHero";
      hero.className = "centre-hero";
      var shelf = document.getElementById("chapterShelf");
      dashboard.insertBefore(hero, shelf);
    }
    document.getElementById("centreHero").innerHTML =
      '<div class="centre-hero-main">' +
        '<div class="path-kicker">Semester 1 Learning Centre</div>' +
        '<h1>Study by subject, master by chapter.</h1>' +
        '<p>Built for Asasi Putra students: quick revision, active recall, chapter practice, weak-area review and real progress tracking.</p>' +
        '<div class="centre-actions">' +
          '<button class="btn" data-view="subjects">Browse Subjects</button>' +
          '<button class="btn secondary" data-view="revision">Continue Learning</button>' +
          '<button class="btn ghost" data-view="progress">View Progress</button>' +
        '</div>' +
      '</div>' +
      '<div class="centre-score-card">' +
        '<span>Semester mastery</span>' +
        '<strong>' + overallProgress() + '%</strong>' +
        '<small>Average across active and planned subjects</small>' +
      '</div>';
  }

  function renderSubjectExplorer() {
    var target = document.getElementById("subjectExplorer");
    if (!target) return;
    var html = '<div class="subject-grid">';
    for (var i = 0; i < subjects.length; i++) {
      var subject = subjects[i];
      var sp = subjectProgress(subject);
      html += '<article class="subject-card ' + subject.status + '">' +
        '<div class="subject-topline"><div class="subject-mark">' + subject.accent + '</div>' + badge(subject.status) + '</div>' +
        '<h3>' + subject.name + '</h3>' +
        '<p>' + (subject.status === "live" ? "Live chapters are ready for revision, flashcards, practice and mastery tracking." : "Chapter structure is ready. Content will be activated when notes/PDFs are added.") + '</p>' +
        '<div class="meter"><span style="width:' + sp.mastery + '%"></span></div>' +
        '<div class="subject-meta"><span>' + sp.mastery + '% mastery</span><span>' + sp.live + '/' + sp.total + ' live chapters</span></div>' +
        '<div class="chapter-list">';
      for (var j = 0; j < subject.chapters.length; j++) {
        var chapter = subject.chapters[j];
        var cp = chapter.status === "live" ? mathChapterProgress(chapter.id) : { mastery: 0, status: "Locked" };
        html += '<button class="chapter-line" data-centre-chapter="' + chapter.id + '" ' + (chapter.status === "live" ? "" : "disabled") + '>' +
          '<span>Chapter ' + chapter.number + ': ' + chapter.title + '</span>' +
          '<b>' + (chapter.status === "live" ? cp.mastery + "%" : "Soon") + '</b>' +
        '</button>';
      }
      html += '</div></article>';
    }
    html += '</div>';
    target.innerHTML = html;
  }

  function renderSemesterProgress() {
    var target = document.getElementById("semesterProgressPanel");
    if (!target) return;
    var html = '<div class="progress-layout"><article class="progress-hero-panel"><div class="path-kicker">Overall</div><h3>' + overallProgress() + '% Semester Mastery</h3><p>Progress uses active chapter practice. Planned subjects stay visible so the app already feels like a full learning centre, not a single Math tool.</p></article><article class="progress-panel"><h3>Subject Breakdown</h3><div class="progress-list">';
    for (var i = 0; i < subjects.length; i++) {
      var subject = subjects[i];
      var sp = subjectProgress(subject);
      html += '<div class="progress-row"><div><strong>' + subject.name + '</strong><span>' + sp.status + ' · ' + sp.live + '/' + sp.total + ' chapters live</span></div><b>' + sp.mastery + '%</b></div>';
    }
    html += '</div></article></div>';
    target.innerHTML = html;
  }

  function renderAllCentre() {
    var brand = document.querySelector(".brand-title span");
    if (brand) brand.textContent = "Asasi Putra UPM Semester 1 Learning Centre";
    renderHomeUpgrade();
    renderSubjectExplorer();
    renderSemesterProgress();
  }

  document.addEventListener("click", function (event) {
    var chapterButton = event.target.closest("[data-centre-chapter]");
    if (chapterButton && !chapterButton.disabled) {
      var target = document.querySelector('[data-chapter="' + chapterButton.getAttribute("data-centre-chapter") + '"]');
      if (target) target.click();
      var learnTab = document.querySelector('[data-view="revision"]');
      if (learnTab) learnTab.click();
      setTimeout(renderAllCentre, 80);
    }
    if (event.target.closest("[data-view], [data-chapter], #resetProgress")) {
      setTimeout(renderAllCentre, 80);
      setTimeout(renderAllCentre, 220);
    }
  });

  renderAllCentre();
  setTimeout(renderAllCentre, 150);
})();
