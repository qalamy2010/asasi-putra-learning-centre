(function () {
  var chapters = [
    {
      id: "math-ch1",
      chapter: 1,
      title: "Real Number System",
      short: "Sets, real numbers, intervals, inequalities, indices, surds and logarithms.",
      source: "Chapter 1 - Real Number System.pdf",
      topics: [
        ["sets", "Sets", "Notation, subset, union and intersection.", "A set is a collection of distinct objects. S subset T means every element of S is also in T.", "If S={1,2,3} and T={3,4,5}, then S union T={1,2,3,4,5} and S intersection T={3}."],
        ["numbers", "Real Numbers", "Natural, whole, integer, rational, irrational and real numbers.", "Rational numbers can be written as a/b where a and b are integers and b is not zero. Irrational numbers cannot.", "45 is natural, whole, integer, rational and real. sqrt(3) is real but irrational."],
        ["intervals", "Intervals", "Number line and interval notation.", "(a,b) means a < x < b. [a,b] means a <= x <= b. Infinity is never included.", "-2 <= x < 5 is written [-2,5)."],
        ["inequalities", "Inequalities", "Solving inequalities and sign changes.", "When multiplying or dividing by a negative number, the inequality sign flips.", "-2x < 6 gives x > -3."],
        ["indices", "Indices", "Exponent laws.", "Use same-base rules: a^m a^n = a^(m+n), a^m/a^n = a^(m-n), a^-n = 1/a^n.", "3^5 x 3^2 = 3^7."],
        ["surds", "Surds", "Roots, conjugates and rationalising.", "Use conjugates to remove surds from denominators.", "1/(3+sqrt2) is rationalised using 3-sqrt2."],
        ["logs", "Logarithms", "Index form, log form and log laws.", "y=a^x is equivalent to log_a(y)=x. Product law: log_a(mn)=log_a(m)+log_a(n).", "log_2(16)=4 because 2^4=16."]
      ],
      cards: [
        ["sets", "What does S subset T mean?", "Every element of S is also in T."],
        ["numbers", "What makes a number rational?", "It can be written as a/b where a and b are integers and b is not zero."],
        ["intervals", "Write a <= x < b in interval notation.", "[a,b)."],
        ["inequalities", "When does an inequality sign flip?", "When multiplying or dividing by a negative number."],
        ["indices", "State the product rule.", "a^m a^n = a^(m+n)."],
        ["surds", "Why use a conjugate?", "To rationalise a denominator."],
        ["logs", "Convert y=a^x into log form.", "log_a(y)=x."]
      ],
      questions: [
        ["sets", "If S={1,2,3} and T={2,3,4}, what is S intersection T?", ["{1,4}", "{2,3}", "{1,2,3,4}", "empty set"], 1, "Intersection means common elements."],
        ["numbers", "Which number is irrational?", ["0.25", "8/3", "sqrt(2)", "-6"], 2, "sqrt(2) cannot be expressed as a ratio of integers."],
        ["intervals", "Write -2 <= x < 5 in interval notation.", ["(-2,5)", "[-2,5)", "[-2,5]", "(-2,5]"], 1, "Closed at -2, open at 5."],
        ["inequalities", "Solve -2x < 6.", ["x < -3", "x > -3", "x < 3", "x > 3"], 1, "Divide by -2, so the sign flips."],
        ["indices", "Simplify 3^5 x 3^2.", ["3^7", "3^10", "9^7", "3^3"], 0, "Same base multiplied: add indices."],
        ["surds", "Simplify sqrt(27).", ["3sqrt(3)", "9sqrt(3)", "sqrt(9)", "27sqrt(3)"], 0, "sqrt(27)=sqrt(9x3)=3sqrt(3)."],
        ["logs", "Convert 2^4=16 to log form.", ["log_4(2)=16", "log_2(16)=4", "log_16(4)=2", "log(16)=2"], 1, "Base 2 raised to 4 gives 16."]
      ],
      formulas: ["S subset T means every element of S is in T", "(a,b): a < x < b", "[a,b]: a <= x <= b", "a^m a^n = a^(m+n)", "a^-n = 1/a^n", "log_a(mn)=log_a(m)+log_a(n)"]
    },
    {
      id: "math-ch2",
      chapter: 2,
      title: "Complex Numbers",
      short: "Imaginary unit, operations, conjugates, Argand diagram, modulus, argument and polar form.",
      source: "Ch 2 Complex Number.pdf",
      topics: [
        ["imaginary", "Imaginary Unit", "i squared equals -1 and z=a+bi.", "Complex numbers extend the real number system. A complex number is written z=a+bi.", "sqrt(-9)=3i. If z=3+2i, Re(z)=3 and Im(z)=2."],
        ["operations", "Operations", "Equality, addition, subtraction and multiplication.", "a+bi=c+di only when a=c and b=d. Expand normally, then use i^2=-1.", "(2+3i)(4-2i)=14+8i."],
        ["conjugate", "Conjugates", "Use conjugates to divide complex numbers.", "The conjugate of a+bi is a-bi. z times conjugate(z)=a^2+b^2.", "1/(2+3i)=(2-3i)/13."],
        ["argand", "Argand, Modulus and Argument", "Represent z=a+bi as point (a,b).", "The modulus is |z|=sqrt(a^2+b^2). The argument is the angle from the positive real axis.", "For z=3+4i, |z|=5."],
        ["polar", "Polar Form", "z=r(cos theta + i sin theta).", "Use a=r cos theta and b=r sin theta to convert between rectangular and polar form.", "2(cos300 + i sin300)=1-sqrt(3)i."]
      ],
      cards: [
        ["imaginary", "What is i^2?", "i^2 = -1."],
        ["imaginary", "For z=5-7i, what is Im(z)?", "-7."],
        ["operations", "When are a+bi and c+di equal?", "When a=c and b=d."],
        ["operations", "What is i^3?", "-i."],
        ["conjugate", "What is the conjugate of 4-3i?", "4+3i."],
        ["conjugate", "Why multiply by the conjugate?", "To make the denominator real."],
        ["argand", "How is z=a+bi plotted?", "As point (a,b)."],
        ["argand", "What is |a+bi|?", "sqrt(a^2+b^2)."],
        ["polar", "State polar form.", "z=r(cos theta + i sin theta)."]
      ],
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
      ],
      formulas: ["i^2=-1", "z=a+bi", "Re(z)=a, Im(z)=b", "conjugate(a+bi)=a-bi", "|z|=sqrt(a^2+b^2)", "z=r(cos theta+i sin theta)"]
    }
  ];

  var key = "skorasasi1ProgressStable";
  var active = "math-ch1";
  var lesson = "";
  var flash = [];
  var flashIndex = 0;
  var showingAnswer = false;
  var quiz = null;
  var challenge = null;
  var state = loadState();

  function byId(id) { return document.getElementById(id); }
  function getChapter(id) { for (var i = 0; i < chapters.length; i++) if (chapters[i].id === id) return chapters[i]; return chapters[0]; }
  function topic(chapter, id) { for (var i = 0; i < chapter.topics.length; i++) if (chapter.topics[i][0] === id) return chapter.topics[i]; return chapter.topics[0]; }
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function makeChapterState(chapter) { var topics = {}; for (var i = 0; i < chapter.topics.length; i++) topics[chapter.topics[i][0]] = { attempts: 0, correct: 0 }; return { topics: topics, answered: 0, correct: 0, todayAnswered: 0, todayCorrect: 0, challengeDone: false }; }
  function normalize(saved) { var out = { active: active, chapters: {} }; if (saved && saved.active) out.active = saved.active; for (var i = 0; i < chapters.length; i++) { var c = chapters[i], old = saved && saved.chapters ? saved.chapters[c.id] : null; var base = makeChapterState(c); if (old) { base.answered = old.answered || 0; base.correct = old.correct || 0; base.todayAnswered = old.todayAnswered || 0; base.todayCorrect = old.todayCorrect || 0; base.challengeDone = !!old.challengeDone; for (var j = 0; j < c.topics.length; j++) { var id = c.topics[j][0]; if (old.topics && old.topics[id]) base.topics[id] = { attempts: old.topics[id].attempts || 0, correct: old.topics[id].correct || 0 }; } } out.chapters[c.id] = base; } return out; }
  function loadState() { try { return normalize(JSON.parse(safeGet(key))); } catch (e) { return normalize(null); } }
  function saveState() { state.active = active; safeSet(key, JSON.stringify(state)); }
  function progress(chapterId) { return state.chapters[chapterId || active]; }
  function topicMastery(chapterId, topicId) { var r = progress(chapterId).topics[topicId] || { attempts: 0, correct: 0 }; if (!r.attempts) return { percent: 0, label: "Not started" }; var acc = Math.round((r.correct / r.attempts) * 100); if (r.attempts >= 8 && acc >= 90) return { percent: 100, label: "Mastered" }; if (r.attempts >= 5 && acc >= 80) return { percent: 82, label: "Proficient" }; if (r.attempts >= 3 && acc >= 70) return { percent: 60, label: "Familiar" }; return { percent: 35, label: "Attempted" }; }
  function chapterSummary(chapterId) { var c = getChapter(chapterId), total = 0, mastered = 0; for (var i = 0; i < c.topics.length; i++) { var m = topicMastery(chapterId, c.topics[i][0]); total += m.percent; if (m.label === "Mastered") mastered++; } var p = progress(chapterId); return { mastery: Math.round(total / c.topics.length), accuracy: p.answered ? Math.round((p.correct / p.answered) * 100) : 0, answered: p.answered, mastered: mastered, topics: c.topics.length }; }
  function overallMastery() { var total = 0; for (var i = 0; i < chapters.length; i++) total += chapterSummary(chapters[i].id).mastery; return Math.round(total / chapters.length); }
  function escapeHtml(text) { return String(text).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]; }); }
  function shuffle(items) { var copy = items.slice(); for (var i = copy.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp; } return copy; }
  function recordAnswer(question, ok) { var p = progress(active), topicId = question[0]; if (!p.topics[topicId]) p.topics[topicId] = { attempts: 0, correct: 0 }; p.topics[topicId].attempts++; if (ok) p.topics[topicId].correct++; p.answered++; if (ok) p.correct++; p.todayAnswered++; if (ok) p.todayCorrect++; saveState(); renderDashboard(); }

  function renderDashboard() {
    var c = getChapter(active), p = progress(active), s = chapterSummary(active);
    byId("topMetrics").innerHTML = '<span class="metric-chip">Semester <b>' + overallMastery() + '%</b></span><span class="metric-chip">Chapter <b>' + s.mastery + '%</b></span><span class="metric-chip">Today <b>' + p.todayAnswered + '/5</b></span>';
    var shelf = "";
    for (var i = 0; i < chapters.length; i++) { var cs = chapterSummary(chapters[i].id); shelf += '<button class="chapter-card ' + (chapters[i].id === active ? "active" : "") + '" data-chapter="' + chapters[i].id + '"><div><h3>Chapter ' + chapters[i].chapter + ': ' + chapters[i].title + '</h3><p>' + chapters[i].short + '</p><div class="meter"><span style="width:' + cs.mastery + '%"></span></div></div><div class="chapter-score">' + cs.mastery + '%</div></button>'; }
    byId("chapterShelf").innerHTML = shelf;
    var weak = c.topics[0], weakM = topicMastery(active, weak[0]);
    for (i = 0; i < c.topics.length; i++) { var tm = topicMastery(active, c.topics[i][0]); if (tm.percent < weakM.percent || (weakM.percent === 0 && tm.percent === 0)) { weak = c.topics[i]; weakM = tm; break; } }
    byId("focusCard").innerHTML = '<div><div class="focus-kicker">Next best action</div><h3>Focus: ' + weak[1] + '</h3><p>' + weak[2] + '</p><div class="focus-actions"><button class="btn" data-smart-action="revision" data-smart-topic="' + weak[0] + '">Revise</button><button class="btn secondary" data-smart-action="quiz" data-smart-topic="' + weak[0] + '">Topic Quiz</button></div></div><div class="progress-ring"><strong>' + s.mastery + '%</strong></div>';
    byId("pathTitle").textContent = "Chapter " + c.chapter + ": " + c.title;
    byId("pathCopy").textContent = "Source: " + c.source + ". Move topic by topic, then prove understanding through mixed practice.";
    var path = "";
    for (i = 0; i < c.topics.length; i++) { tm = topicMastery(active, c.topics[i][0]); path += '<div class="path-step ' + (tm.label === "Mastered" ? "done" : "") + '"><div class="path-dot">' + (i + 1) + '</div><div class="path-copy"><strong>' + c.topics[i][1] + '</strong><span>' + c.topics[i][2] + '</span></div><div class="path-badge">' + tm.label + '</div></div>'; }
    byId("learningPath").innerHTML = path;
    byId("missionGrid").innerHTML = '<article class="mission-card"><div class="mission-top"><div class="mission-icon">Q1</div><div class="mission-state">Today</div></div><h3>Answer 5 questions</h3><p>' + Math.min(p.todayAnswered, 5) + '/5 completed today</p><div class="mission-progress"><span style="width:' + Math.min(100, p.todayAnswered * 20) + '%"></span></div></article><article class="mission-card"><div class="mission-top"><div class="mission-icon">M2</div><div class="mission-state">Mix</div></div><h3>Do one mixed challenge</h3><p>' + (p.challengeDone ? "Completed" : "Not yet") + '</p><div class="mission-progress"><span style="width:' + (p.challengeDone ? 100 : 0) + '%"></span></div></article>';
    byId("reviewStrip").innerHTML = '<article class="review-card"><div class="path-kicker">Review queue</div><h3>' + weak[1] + '</h3><p>Weak or new topic. Revise, then answer 5 focused questions.</p><div class="meter"><span style="width:' + weakM.percent + '%"></span></div></article>';
    byId("progressBoard").innerHTML = '<article class="progress-panel"><h3>Progress that actually means something</h3><div class="trust-note">Mastery rises only after quiz attempts. This is saved on this device.</div><div class="progress-list">' + chapters.map(function (x) { var xs = chapterSummary(x.id); return '<div class="progress-row"><div><strong>Chapter ' + x.chapter + ': ' + x.title + '</strong><span>' + xs.answered + ' answered · ' + xs.accuracy + '% accuracy · ' + xs.mastered + '/' + xs.topics + ' topics mastered</span></div><b>' + xs.mastery + '%</b></div>'; }).join("") + '</div></article><article class="progress-panel"><h3>Perintis Siswa support map</h3><p style="color:var(--muted);margin:0">Mathematics is live now. Chemistry, Biology and Physics can be added using the same chapter structure.</p></article>';
    byId("stats").innerHTML = '<div class="stat"><strong>' + overallMastery() + '%</strong><span>Semester Mastery</span></div><div class="stat"><strong>' + s.accuracy + '%</strong><span>Chapter Accuracy</span></div><div class="stat"><strong>' + s.answered + '</strong><span>Answered</span></div><div class="stat"><strong>' + s.mastered + '/' + s.topics + '</strong><span>Mastered</span></div>';
    var grid = "";
    for (i = 0; i < c.topics.length; i++) { tm = topicMastery(active, c.topics[i][0]); var rec = progress(active).topics[c.topics[i][0]]; grid += '<article class="topic-card"><div><h3>' + c.topics[i][1] + '</h3><p>' + c.topics[i][2] + '</p></div><div><div class="meter"><span style="width:' + tm.percent + '%"></span></div><div class="stats-row"><span>' + tm.label + '</span><span>' + rec.correct + '/' + rec.attempts + ' correct</span></div></div></article>'; }
    byId("masteryGrid").innerHTML = grid;
  }

  function renderRevision() { var c = getChapter(active); byId("revisionIntro").textContent = "Chapter " + c.chapter + ": " + c.title + ". Read one topic, then prove recall with questions."; var buttons = ""; for (var i = 0; i < c.topics.length; i++) buttons += '<button class="topic-button ' + (c.topics[i][0] === lesson ? "active" : "") + '" data-topic="' + c.topics[i][0] + '">' + c.topics[i][1] + '</button>'; byId("lessonTopics").innerHTML = buttons; var t = topic(c, lesson); byId("lessonPanel").innerHTML = '<h3>' + t[1] + '</h3><p>' + t[2] + '</p><div class="note-list"><div class="note-item"><strong>Core idea</strong><span>' + t[3] + '</span></div></div><div class="example-box"><strong>Example</strong><div class="math-line">' + t[4] + '</div></div><div class="hero-actions" style="margin-top:16px"><button class="btn" data-quiz-topic="' + t[0] + '">Practise ' + t[1] + '</button><button class="btn ghost" data-open-flash="' + t[0] + '">Flashcards</button></div>'; }
  function renderFlashFilters() { var c = getChapter(active), html = '<option value="all">All topics in Chapter ' + c.chapter + '</option>'; for (var i = 0; i < c.topics.length; i++) html += '<option value="' + c.topics[i][0] + '">' + c.topics[i][1] + '</option>'; byId("flashFilter").innerHTML = html; updateFlashSet(); }
  function updateFlashSet() { var c = getChapter(active), filter = byId("flashFilter").value || "all"; flash = []; for (var i = 0; i < c.cards.length; i++) if (filter === "all" || c.cards[i][0] === filter) flash.push(c.cards[i]); flashIndex = 0; showingAnswer = false; renderFlashCard(); }
  function renderFlashCard() { if (!flash.length) return; var c = getChapter(active), card = flash[flashIndex], t = topic(c, card[0]); byId("flashTopic").textContent = t[1] + " · " + (flashIndex + 1) + "/" + flash.length; byId("flashText").textContent = showingAnswer ? card[2] : card[1]; byId("flashCard").classList.toggle("flipped", showingAnswer); }
  function renderQuizOptions() { var c = getChapter(active), html = ""; byId("quizIntro").textContent = "Chapter " + c.chapter + ": " + c.title + ". Choose one topic for focused practice."; for (var i = 0; i < c.topics.length; i++) html += '<option value="' + c.topics[i][0] + '">' + c.topics[i][1] + '</option>'; byId("quizTopic").innerHTML = html; }
  function makeQuiz(topicId, count) { var c = getChapter(active), pool = []; for (var i = 0; i < c.questions.length; i++) if (topicId === "all" || c.questions[i][0] === topicId) pool.push(c.questions[i]); pool = shuffle(pool).slice(0, count); return { questions: pool, index: 0, score: 0, done: false, selected: null }; }
  function renderQuiz(boxId, qz, mode) { var box = byId(boxId); if (!qz || !qz.questions.length) { box.innerHTML = '<div class="empty-state">No questions available yet.</div>'; return; } if (qz.done) { var pc = Math.round((qz.score / qz.questions.length) * 100); box.innerHTML = '<div class="empty-state"><h3 style="margin-bottom:8px">Session Complete</h3><p style="margin:0 0 14px">Score: <strong>' + qz.score + '/' + qz.questions.length + '</strong> (' + pc + '%).</p><button class="btn" data-restart="' + mode + '">Try Again</button></div>'; return; } var item = qz.questions[qz.index], c = getChapter(active), t = topic(c, item[0]), answered = qz.selected !== null; var choices = ""; for (var i = 0; i < item[2].length; i++) { var cls = answered && i === item[3] ? " correct" : answered && i === qz.selected ? " wrong" : ""; choices += '<button class="choice' + cls + '" data-answer="' + i + '"' + (answered ? " disabled" : "") + '>' + escapeHtml(item[2][i]) + '</button>'; } box.innerHTML = '<div class="quiz-topline"><span class="pill" style="display:inline-flex">' + t[1] + '</span><div class="progress-line"><span style="width:' + Math.round((qz.index / qz.questions.length) * 100) + '%"></span></div><strong>' + (qz.index + 1) + '/' + qz.questions.length + '</strong></div><div class="question">' + escapeHtml(item[1]) + '</div><div class="choices">' + choices + '</div><div class="feedback ' + (answered ? "show" : "") + '">' + (answered ? '<strong>' + (qz.selected === item[3] ? "Correct" : "Not yet") + '</strong><div>' + item[4] + '</div>' : "") + '</div><div class="hero-actions" style="margin-top:16px"><button class="btn" data-next="' + mode + '"' + (answered ? "" : " disabled") + '>' + (qz.index + 1 === qz.questions.length ? "Finish" : "Next") + '</button></div>'; }
  function answerQuiz(qz, selected, boxId, mode) { if (!qz || qz.selected !== null) return; qz.selected = selected; var item = qz.questions[qz.index], ok = selected === item[3]; if (ok) qz.score++; recordAnswer(item, ok); renderQuiz(boxId, qz, mode); }
  function nextQuiz(qz, boxId, mode) { if (!qz) return; if (qz.index + 1 >= qz.questions.length) { qz.done = true; if (mode === "challenge") { progress(active).challengeDone = true; saveState(); renderDashboard(); } } else { qz.index++; qz.selected = null; } renderQuiz(boxId, qz, mode); }
  function renderFormula() { var c = getChapter(active), html = '<article class="formula-panel"><h3>Chapter ' + c.chapter + ': ' + c.title + '</h3><ul class="rule-list">'; for (var i = 0; i < c.formulas.length; i++) html += '<li class="math-line">' + c.formulas[i] + '</li>'; byId("formulaGrid").innerHTML = html + '</ul></article>'; }
  function renderAll() { var c = getChapter(active); document.querySelector(".brand-title span").textContent = "Mathematics Chapter " + c.chapter + ": " + c.title; byId("challengeIntro").textContent = "Mixed questions for Chapter " + c.chapter + ": " + c.title + "."; renderDashboard(); renderRevision(); renderFlashFilters(); renderQuizOptions(); renderFormula(); byId("quizPanel").innerHTML = '<div class="empty-state">Choose a topic and start the quiz.</div>'; byId("challengePanel").innerHTML = '<div class="empty-state">Start the challenge when you are ready. It will mix Chapter ' + c.chapter + ' skills.</div>'; }
  function showView(id) { var views = document.querySelectorAll(".view"), tabs = document.querySelectorAll(".nav-tab"); for (var i = 0; i < views.length; i++) views[i].classList.toggle("active", views[i].id === id); for (i = 0; i < tabs.length; i++) tabs[i].classList.toggle("active", tabs[i].getAttribute("data-view") === id); }
  function bind() { document.body.addEventListener("click", function (event) { var el = event.target; while (el && el !== document.body) { if (el.getAttribute && el.getAttribute("data-view")) { showView(el.getAttribute("data-view")); return; } if (el.getAttribute && el.getAttribute("data-jump")) { showView(el.getAttribute("data-jump")); return; } if (el.getAttribute && el.getAttribute("data-chapter")) { active = el.getAttribute("data-chapter"); lesson = getChapter(active).topics[0][0]; saveState(); renderAll(); return; } if (el.getAttribute && el.getAttribute("data-topic")) { lesson = el.getAttribute("data-topic"); renderRevision(); return; } if (el.getAttribute && el.getAttribute("data-smart-action")) { var action = el.getAttribute("data-smart-action"), t = el.getAttribute("data-smart-topic"); if (action === "revision") { lesson = t; renderRevision(); showView("revision"); } if (action === "quiz") { byId("quizTopic").value = t; quiz = makeQuiz(t, 5); renderQuiz("quizPanel", quiz, "quiz"); showView("quiz"); } return; } if (el.getAttribute && el.getAttribute("data-quiz-topic")) { byId("quizTopic").value = el.getAttribute("data-quiz-topic"); quiz = makeQuiz(byId("quizTopic").value, 5); renderQuiz("quizPanel", quiz, "quiz"); showView("quiz"); return; } if (el.getAttribute && el.getAttribute("data-open-flash")) { byId("flashFilter").value = el.getAttribute("data-open-flash"); updateFlashSet(); showView("flashcards"); return; } if (el.getAttribute && el.getAttribute("data-answer")) { var box = el.closest("#challengePanel") ? "challengePanel" : "quizPanel"; answerQuiz(box === "challengePanel" ? challenge : quiz, Number(el.getAttribute("data-answer")), box, box === "challengePanel" ? "challenge" : "quiz"); return; } if (el.getAttribute && el.getAttribute("data-next")) { var mode = el.getAttribute("data-next"); nextQuiz(mode === "challenge" ? challenge : quiz, mode === "challenge" ? "challengePanel" : "quizPanel", mode); return; } if (el.getAttribute && el.getAttribute("data-restart")) { var rmode = el.getAttribute("data-restart"); if (rmode === "challenge") { challenge = makeQuiz("all", 12); renderQuiz("challengePanel", challenge, "challenge"); } else { quiz = makeQuiz(byId("quizTopic").value, 5); renderQuiz("quizPanel", quiz, "quiz"); } return; } el = el.parentNode; } }); byId("flashFilter").addEventListener("change", updateFlashSet); byId("flashCard").addEventListener("click", function () { showingAnswer = !showingAnswer; renderFlashCard(); }); byId("flipCard").addEventListener("click", function () { showingAnswer = !showingAnswer; renderFlashCard(); }); byId("prevCard").addEventListener("click", function () { flashIndex = (flashIndex - 1 + flash.length) % flash.length; showingAnswer = false; renderFlashCard(); }); byId("nextCard").addEventListener("click", function () { flashIndex = (flashIndex + 1) % flash.length; showingAnswer = false; renderFlashCard(); }); byId("shuffleCard").addEventListener("click", function () { flash = shuffle(flash); flashIndex = 0; showingAnswer = false; renderFlashCard(); }); byId("startQuiz").addEventListener("click", function () { quiz = makeQuiz(byId("quizTopic").value, 5); renderQuiz("quizPanel", quiz, "quiz"); }); byId("startChallenge").addEventListener("click", function () { challenge = makeQuiz("all", Math.min(12, getChapter(active).questions.length)); renderQuiz("challengePanel", challenge, "challenge"); }); byId("resetProgress").addEventListener("click", function () { if (confirm("Reset all SkorAsasi1 progress on this device?")) { safeSet(key, ""); state = normalize(null); active = chapters[0].id; lesson = getChapter(active).topics[0][0]; renderAll(); } }); }

  active = getChapter(state.active).id;
  lesson = getChapter(active).topics[0][0];
  renderAll();
  bind();
})();
