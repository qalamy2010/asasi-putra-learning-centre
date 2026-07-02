(function () {
  var storageKey = "skorasasi1ProgressStable";
  var chapters = [
    {
      id: "math-ch1",
      label: "Chapter 1",
      title: "Real Number System",
      topics: ["sets", "numbers", "intervals", "inequalities", "indices", "surds", "logs"],
      questions: [
        ["sets", "If S={1,2,3} and T={2,3,4}, what is S intersection T?", ["{1,4}", "{2,3}", "{1,2,3,4}", "empty set"], 1, "Intersection means common elements."],
        ["numbers", "Which number is irrational?", ["0.25", "8/3", "sqrt(2)", "-6"], 2, "sqrt(2) cannot be expressed as a ratio of integers."],
        ["intervals", "Write -2 <= x < 5 in interval notation.", ["(-2,5)", "[-2,5)", "[-2,5]", "(-2,5]"], 1, "Closed at -2, open at 5."],
        ["inequalities", "Solve -2x < 6.", ["x < -3", "x > -3", "x < 3", "x > 3"], 1, "Divide by -2, so the sign flips."],
        ["indices", "Simplify 3^5 x 3^2.", ["3^7", "3^10", "9^7", "3^3"], 0, "Same base multiplied: add indices."],
        ["surds", "Simplify sqrt(27).", ["3sqrt(3)", "9sqrt(3)", "sqrt(9)", "27sqrt(3)"], 0, "sqrt(27)=sqrt(9x3)=3sqrt(3)."],
        ["logs", "Convert 2^4=16 to log form.", ["log_4(2)=16", "log_2(16)=4", "log_16(4)=2", "log(16)=2"], 1, "Base 2 raised to 4 gives 16."]
      ]
    },
    {
      id: "math-ch2",
      label: "Chapter 2",
      title: "Complex Numbers",
      topics: ["imaginary", "operations", "conjugate", "argand", "polar"],
      questions: [
        ["imaginary", "What is i^2?", ["1", "-1", "i", "-i"], 1, "By definition, i^2=-1."],
        ["imaginary", "Simplify sqrt(-25).", ["5", "-5", "5i", "-25i"], 2, "sqrt(-25)=5i."],
        ["operations", "If 5-3bi=(a-1)+3i, find a and b.", ["a=6,b=-1", "a=4,b=1", "a=6,b=1", "a=-6,b=-1"], 0, "a-1=5, so a=6. -3b=3, so b=-1."],
        ["operations", "Simplify (3-5i)+(-3+4i).", ["-i", "i", "6-i", "-6+9i"], 0, "Real parts cancel. -5i+4i=-i."],
        ["operations", "Simplify (2+3i)(4-2i).", ["2+16i", "14+8i", "-2+16i", "8+i"], 1, "Expand and use i^2=-1."],
        ["conjugate", "What is the conjugate of -2+5i?", ["2+5i", "-2-5i", "2-5i", "-5+2i"], 1, "Keep real part, change imaginary sign."],
        ["conjugate", "For z=3+4i, what is z times conjugate(z)?", ["7", "25", "9+16i", "3-4i"], 1, "a^2+b^2=3^2+4^2=25."],
        ["argand", "Where is z=2-5i plotted?", ["(2,5)", "(-5,2)", "(2,-5)", "(-2,5)"], 2, "z=a+bi maps to (a,b)."],
        ["argand", "Find |3+4i|.", ["3", "4", "5", "7"], 2, "sqrt(3^2+4^2)=5."],
        ["polar", "What is polar form?", ["a+bi", "r(cos theta+i sin theta)", "r+theta i", "tan inverse b/a"], 1, "Polar form is z=r(cos theta+i sin theta)."],
        ["polar", "For z=2-2i, what is r?", ["2", "2sqrt(2)", "4", "sqrt(2)"], 1, "r=sqrt(2^2+(-2)^2)=2sqrt(2)."]
      ]
    }
  ];

  var challenge = null;

  function chapterById(id) {
    for (var i = 0; i < chapters.length; i++) if (chapters[i].id === id) return chapters[i];
    return chapters[0];
  }

  function activeChapterId() {
    var active = document.querySelector(".chapter-card.active");
    return active ? active.getAttribute("data-chapter") : "math-ch1";
  }

  function switchChapter(id) {
    var button = document.querySelector('[data-chapter="' + id + '"]');
    if (button) button.click();
    setTimeout(renderChapterTools, 80);
    setTimeout(renderChallengeTools, 100);
  }

  function renderChapterTools() {
    var sections = ["revision", "quiz", "challenge", "formula"];
    var active = activeChapterId();
    for (var i = 0; i < sections.length; i++) {
      var section = document.getElementById(sections[i]);
      if (!section) continue;
      var head = section.querySelector(".section-head");
      if (!head) continue;
      var old = section.querySelector(".chapter-toolbar");
      if (!old) {
        old = document.createElement("div");
        old.className = "chapter-toolbar";
        head.parentNode.insertBefore(old, head.nextSibling);
      }
      old.innerHTML = '<div><span>Active chapter</span><strong>' + chapterById(active).label + ': ' + chapterById(active).title + '</strong></div><div class="chapter-pills">' +
        chapters.map(function (chapter) {
          return '<button class="' + (chapter.id === active ? "active" : "") + '" data-tool-chapter="' + chapter.id + '">' + chapter.label + '</button>';
        }).join("") +
      '</div>';
    }
  }

  function renderChallengeTools() {
    var section = document.getElementById("challenge");
    if (!section) return;
    var head = section.querySelector(".section-head");
    if (!head) return;
    var controls = document.getElementById("challengeScopeTools");
    if (!controls) {
      controls = document.createElement("div");
      controls.id = "challengeScopeTools";
      controls.className = "challenge-scope";
      head.parentNode.insertBefore(controls, head.nextSibling);
    }
    var active = activeChapterId();
    controls.innerHTML =
      '<div><label for="challengeScope">Challenge scope</label><select id="challengeScope">' +
        '<option value="active">Current chapter: ' + chapterById(active).title + '</option>' +
        '<option value="math-ch1">Chapter 1: Real Number System</option>' +
        '<option value="math-ch2">Chapter 2: Complex Numbers</option>' +
        '<option value="all">All live Mathematics chapters</option>' +
      '</select></div>' +
      '<p>Use current chapter for focused mastery. Use all chapters for interleaving, exam recall and method selection.</p>';
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function questionsForScope(scope) {
    if (scope === "active") scope = activeChapterId();
    var pool = [];
    for (var i = 0; i < chapters.length; i++) {
      if (scope === "all" || chapters[i].id === scope) {
        for (var j = 0; j < chapters[i].questions.length; j++) {
          pool.push({ chapterId: chapters[i].id, question: chapters[i].questions[j] });
        }
      }
    }
    return shuffle(pool);
  }

  function readState() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch (error) { return {}; }
  }

  function writeState(state) {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) {}
  }

  function ensureChapterState(state, chapter) {
    if (!state.active) state.active = activeChapterId();
    if (!state.chapters) state.chapters = {};
    if (!state.chapters[chapter.id]) {
      state.chapters[chapter.id] = { topics: {}, answered: 0, correct: 0, todayAnswered: 0, todayCorrect: 0, challengeDone: false };
    }
    for (var i = 0; i < chapter.topics.length; i++) {
      if (!state.chapters[chapter.id].topics[chapter.topics[i]]) {
        state.chapters[chapter.id].topics[chapter.topics[i]] = { attempts: 0, correct: 0 };
      }
    }
    return state.chapters[chapter.id];
  }

  function record(item, ok) {
    var state = readState();
    var chapter = chapterById(item.chapterId);
    var chapterState = ensureChapterState(state, chapter);
    var topicId = item.question[0];
    if (!chapterState.topics[topicId]) chapterState.topics[topicId] = { attempts: 0, correct: 0 };
    chapterState.topics[topicId].attempts++;
    if (ok) chapterState.topics[topicId].correct++;
    chapterState.answered = (chapterState.answered || 0) + 1;
    if (ok) chapterState.correct = (chapterState.correct || 0) + 1;
    chapterState.todayAnswered = (chapterState.todayAnswered || 0) + 1;
    if (ok) chapterState.todayCorrect = (chapterState.todayCorrect || 0) + 1;
    writeState(state);
  }

  function startChallenge() {
    var scopeInput = document.getElementById("challengeScope");
    var scope = scopeInput ? scopeInput.value : "active";
    var pool = questionsForScope(scope);
    challenge = {
      scope: scope,
      questions: pool.slice(0, Math.min(12, pool.length)),
      index: 0,
      score: 0,
      selected: null,
      done: false
    };
    renderChallenge();
  }

  function renderChallenge() {
    var panel = document.getElementById("challengePanel");
    if (!panel || !challenge) return;
    if (challenge.done) {
      var percent = Math.round((challenge.score / challenge.questions.length) * 100);
      panel.innerHTML = '<div class="empty-state"><h3>Challenge Complete</h3><p>Score: <strong>' + challenge.score + '/' + challenge.questions.length + '</strong> (' + percent + '%). Progress has been added to the included chapter topics.</p><button class="btn" data-custom-challenge-restart="1">Try Another Mix</button></div>';
      return;
    }
    var item = challenge.questions[challenge.index];
    var q = item.question;
    var chapter = chapterById(item.chapterId);
    var answered = challenge.selected !== null;
    var choices = "";
    for (var i = 0; i < q[2].length; i++) {
      var cls = answered && i === q[3] ? " correct" : answered && i === challenge.selected ? " wrong" : "";
      choices += '<button class="choice' + cls + '" data-custom-answer="' + i + '"' + (answered ? " disabled" : "") + '>' + q[2][i] + '</button>';
    }
    panel.innerHTML = '<div class="quiz-topline"><span class="pill" style="display:inline-flex">' + chapter.label + ' · ' + chapter.title + '</span><div class="progress-line"><span style="width:' + Math.round((challenge.index / challenge.questions.length) * 100) + '%"></span></div><strong>' + (challenge.index + 1) + '/' + challenge.questions.length + '</strong></div><div class="question">' + q[1] + '</div><div class="choices">' + choices + '</div><div class="feedback ' + (answered ? "show" : "") + '">' + (answered ? '<strong>' + (challenge.selected === q[3] ? "Correct" : "Not yet") + '</strong><div>' + q[4] + '</div>' : "") + '</div><div class="hero-actions" style="margin-top:16px"><button class="btn" data-custom-next="1"' + (answered ? "" : " disabled") + '>' + (challenge.index + 1 === challenge.questions.length ? "Finish" : "Next") + '</button></div>';
  }

  document.addEventListener("click", function (event) {
    var chapterButton = event.target.closest("[data-tool-chapter]");
    if (chapterButton) {
      switchChapter(chapterButton.getAttribute("data-tool-chapter"));
      return;
    }
    if (event.target.closest("#startChallenge")) {
      event.preventDefault();
      event.stopPropagation();
      startChallenge();
      return;
    }
    var answer = event.target.closest("[data-custom-answer]");
    if (answer && challenge && challenge.selected === null) {
      challenge.selected = Number(answer.getAttribute("data-custom-answer"));
      var item = challenge.questions[challenge.index];
      var ok = challenge.selected === item.question[3];
      if (ok) challenge.score++;
      record(item, ok);
      renderChallenge();
      return;
    }
    if (event.target.closest("[data-custom-next]") && challenge) {
      if (challenge.index + 1 >= challenge.questions.length) challenge.done = true;
      else {
        challenge.index++;
        challenge.selected = null;
      }
      renderChallenge();
      return;
    }
    if (event.target.closest("[data-custom-challenge-restart]")) {
      startChallenge();
      return;
    }
    if (event.target.closest("[data-view], [data-chapter]")) {
      setTimeout(renderChapterTools, 80);
      setTimeout(renderChallengeTools, 80);
    }
  }, true);

  renderChapterTools();
  renderChallengeTools();
  setTimeout(renderChapterTools, 150);
  setTimeout(renderChallengeTools, 150);
})();
