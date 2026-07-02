(function () {
  var formulaGroups = {
    1: [
      ["Set Notation", [
        "x in S: x is an element of set S",
        "x notin S: x is not an element of set S",
        "Empty set: empty or { } has no element",
        "{0} is not empty because it contains 0",
        "S subset T: every element of S is also in T",
        "S = T iff S subset T and T subset S",
        "S union T: elements in S or T or both",
        "S intersection T: elements common to S and T"
      ]],
      ["Number Sets", [
        "N = {1, 2, 3, ...}",
        "W = {0, 1, 2, 3, ...}",
        "Z = {..., -2, -1, 0, 1, 2, ...}",
        "Q = {a/b : a,b in Z and b != 0}",
        "Irrational numbers cannot be written as a/b",
        "R = rational numbers union irrational numbers",
        "Every natural number is whole, integer, rational and real"
      ]],
      ["Intervals", [
        "(a,b): a < x < b",
        "[a,b]: a <= x <= b",
        "(a,b]: a < x <= b",
        "[a,b): a <= x < b",
        "(-infinity,a): x < a",
        "(-infinity,a]: x <= a",
        "(a,infinity): x > a",
        "[a,infinity): x >= a",
        "Infinity is never included in an interval"
      ]],
      ["Linear Inequalities", [
        "Add/subtract same number: inequality direction stays",
        "Multiply/divide by positive number: direction stays",
        "Multiply/divide by negative number: direction reverses",
        "If a < b and c < 0, then ac > bc",
        "Express final answer as inequality or interval when asked"
      ]],
      ["Indices", [
        "a^m x a^n = a^(m+n)",
        "a^m / a^n = a^(m-n), a != 0",
        "(a^m)^n = a^(mn)",
        "(ab)^n = a^n b^n",
        "(a/b)^n = a^n / b^n, b != 0",
        "a^0 = 1, a != 0",
        "a^(-n) = 1/a^n",
        "a^(m/n) = nthroot(a^m)"
      ]],
      ["Surds", [
        "nthroot(a) = b iff b^n = a",
        "sqrt(ab) = sqrt(a)sqrt(b), for valid real roots",
        "sqrt(a/b) = sqrt(a)/sqrt(b), b > 0",
        "sqrt(a^2) = |a|",
        "Conjugate of a + sqrt(b) is a - sqrt(b)",
        "(a + sqrt(b))(a - sqrt(b)) = a^2 - b",
        "Rationalise denominator by multiplying by its conjugate",
        "Check answers after squaring both sides"
      ]],
      ["Logarithms", [
        "y = a^x iff log_a(y) = x",
        "Conditions: a > 0, a != 1, y > 0",
        "log_a(1) = 0",
        "log_a(a) = 1",
        "log_a(mn) = log_a(m) + log_a(n)",
        "log_a(m/n) = log_a(m) - log_a(n)",
        "log_a(m^n) = n log_a(m)",
        "log_a(1/n) = -log_a(n)",
        "Change of base: log_a(m) = log_b(m) / log_b(a)",
        "Common log: log(x) = log_10(x)",
        "Natural log: ln(x) = log_e(x)"
      ]]
    ],
    2: [
      ["Complex Form", [
        "i^2 = -1",
        "i = sqrt(-1)",
        "z = a + bi, where a and b are real",
        "Re(z) = a",
        "Im(z) = b",
        "Pure real: b = 0",
        "Pure imaginary: a = 0"
      ]],
      ["Powers of i", [
        "i^1 = i",
        "i^2 = -1",
        "i^3 = -i",
        "i^4 = 1",
        "Cycle repeats every 4 powers",
        "i^n depends on remainder when n is divided by 4"
      ]],
      ["Operations", [
        "(a+bi) + (c+di) = (a+c) + (b+d)i",
        "(a+bi) - (c+di) = (a-c) + (b-d)i",
        "(a+bi)(c+di) = (ac-bd) + (ad+bc)i",
        "a+bi = c+di iff a=c and b=d"
      ]],
      ["Conjugates and Division", [
        "Conjugate of a+bi is a-bi",
        "z + conjugate(z) = 2a",
        "z - conjugate(z) = 2bi",
        "z conjugate(z) = a^2 + b^2",
        "To divide, multiply numerator and denominator by conjugate of denominator"
      ]],
      ["Argand, Modulus and Argument", [
        "z = a+bi maps to point (a,b)",
        "Horizontal axis: real part",
        "Vertical axis: imaginary part",
        "|z| = sqrt(a^2 + b^2)",
        "arg(z) is the angle from positive real axis",
        "Use quadrant to choose correct argument"
      ]],
      ["Polar Form", [
        "z = r(cos theta + i sin theta)",
        "r = |z| = sqrt(a^2 + b^2)",
        "a = r cos theta",
        "b = r sin theta",
        "tan theta = b/a when a != 0",
        "Rectangular form: a + bi",
        "Polar form is useful for modulus and argument"
      ]]
    ]
  };

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
    });
  }

  function activeChapterNumber() {
    var activeCard = document.querySelector(".chapter-card.active h3");
    var text = activeCard ? activeCard.textContent : "";
    if (!text) {
      var brand = document.querySelector(".brand-title span");
      text = brand ? brand.textContent : "";
    }
    return /Chapter 2/i.test(text) ? 2 : 1;
  }

  function renderFormulaSheet() {
    var target = document.getElementById("formulaGrid");
    if (!target) return;
    var chapter = activeChapterNumber();
    var groups = formulaGroups[chapter] || formulaGroups[1];
    var html = "";
    for (var i = 0; i < groups.length; i++) {
      html += '<article class="formula-panel"><h3>' + escapeHtml(groups[i][0]) + '</h3><ul class="rule-list">';
      for (var j = 0; j < groups[i][1].length; j++) {
        html += '<li class="math-line">' + escapeHtml(groups[i][1][j]) + '</li>';
      }
      html += '</ul></article>';
    }
    target.innerHTML = html;
  }

  function scheduleRender() {
    setTimeout(renderFormulaSheet, 0);
    setTimeout(renderFormulaSheet, 120);
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-chapter], [data-view='formula'], [data-jump='formula']")) {
      scheduleRender();
    }
  });

  renderFormulaSheet();
})();
