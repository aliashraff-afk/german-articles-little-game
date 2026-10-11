"use strict";

// ---------- Data ----------
// Everyday words plus vocabulary you will hear in a customer service job.
const WORDS = [
  // der
  { word: "Tisch", article: "der", ar: "طاولة" },
  { word: "Stuhl", article: "der", ar: "كرسي" },
  { word: "Hund", article: "der", ar: "كلب" },
  { word: "Apfel", article: "der", ar: "تفاحة" },
  { word: "Bahnhof", article: "der", ar: "محطة قطار" },
  { word: "Kuchen", article: "der", ar: "كعكة" },
  { word: "Kaffee", article: "der", ar: "قهوة" },
  { word: "Tag", article: "der", ar: "يوم" },
  { word: "Zug", article: "der", ar: "قطار" },
  { word: "Schlüssel", article: "der", ar: "مفتاح" },
  { word: "Brief", article: "der", ar: "خطاب" },
  { word: "Garten", article: "der", ar: "حديقة" },
  { word: "Kunde", article: "der", ar: "عميل" },
  { word: "Vertrag", article: "der", ar: "عقد" },
  { word: "Anruf", article: "der", ar: "مكالمة" },

  // die
  { word: "Frau", article: "die", ar: "امرأة" },
  { word: "Katze", article: "die", ar: "قطة" },
  { word: "Tasche", article: "die", ar: "حقيبة" },
  { word: "Lampe", article: "die", ar: "مصباح" },
  { word: "Schule", article: "die", ar: "مدرسة" },
  { word: "Zeitung", article: "die", ar: "جريدة" },
  { word: "Küche", article: "die", ar: "مطبخ" },
  { word: "Uhr", article: "die", ar: "ساعة" },
  { word: "Straße", article: "die", ar: "شارع" },
  { word: "Blume", article: "die", ar: "زهرة" },
  { word: "Woche", article: "die", ar: "أسبوع" },
  { word: "Tür", article: "die", ar: "باب" },
  { word: "Stadt", article: "die", ar: "مدينة" },
  { word: "Familie", article: "die", ar: "عائلة" },
  { word: "Rechnung", article: "die", ar: "فاتورة" },
  { word: "Bestellung", article: "die", ar: "طلب" },
  { word: "Adresse", article: "die", ar: "عنوان" },
  { word: "Nummer", article: "die", ar: "رقم" },

  // das
  { word: "Haus", article: "das", ar: "بيت" },
  { word: "Buch", article: "das", ar: "كتاب" },
  { word: "Auto", article: "das", ar: "سيارة" },
  { word: "Kind", article: "das", ar: "طفل" },
  { word: "Wasser", article: "das", ar: "ماء" },
  { word: "Brot", article: "das", ar: "خبز" },
  { word: "Fenster", article: "das", ar: "نافذة" },
  { word: "Handy", article: "das", ar: "موبايل" },
  { word: "Mädchen", article: "das", ar: "بنت" },
  { word: "Bett", article: "das", ar: "سرير" },
  { word: "Geld", article: "das", ar: "فلوس" },
  { word: "Konto", article: "das", ar: "حساب" },
  { word: "Passwort", article: "das", ar: "كلمة السر" },
  { word: "Problem", article: "das", ar: "مشكلة" },
  { word: "Telefon", article: "das", ar: "تليفون" },
  { word: "Angebot", article: "das", ar: "عرض" },
  { word: "Gespräch", article: "das", ar: "محادثة" },
];

const ROUND_LENGTH = 15;
const BEST_KEY = "german-articles-little-game:best";
const KEY_TO_ARTICLE = { "1": "der", "2": "die", "3": "das" };

// ---------- DOM references ----------
const el = {
  qNumber: document.getElementById("q-number"),
  qTotal: document.getElementById("q-total"),
  score: document.getElementById("score"),
  streak: document.getElementById("streak"),
  best: document.getElementById("best"),
  progressBar: document.getElementById("progress-bar"),
  quiz: document.getElementById("quiz"),
  result: document.getElementById("result"),
  word: document.getElementById("word"),
  meaning: document.getElementById("meaning"),
  answerButtons: document.querySelectorAll("[data-article]"),
  feedback: document.getElementById("feedback"),
  next: document.getElementById("next"),
  resultText: document.getElementById("result-text"),
  mistakes: document.getElementById("mistakes"),
  restart: document.getElementById("restart"),
};

// ---------- State ----------
const state = {
  questions: [],
  index: 0,
  score: 0,
  streak: 0,
  answered: false,
  mistakes: [],
  best: loadBest(),
};

// ---------- Helpers ----------
// Fisher-Yates shuffle on a copy, so the original list is never changed.
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// localStorage can be blocked (private mode), so always wrap it.
function loadBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Ignore: the quiz still works without saving.
  }
}

// Two reliable German gender rules worth learning.
function getRuleTip(word) {
  if (word.endsWith("ung")) return "Tip: nouns ending in -ung are feminine (die).";
  if (word.endsWith("chen")) return "Tip: nouns ending in -chen are neuter (das).";
  return "";
}

// ---------- Rendering ----------
function renderStats() {
  const answeredCount = state.index + (state.answered ? 1 : 0);
  el.qNumber.textContent = Math.min(state.index + 1, ROUND_LENGTH);
  el.qTotal.textContent = ROUND_LENGTH;
  el.score.textContent = state.score;
  el.streak.textContent = state.streak;
  el.best.textContent = state.best;
  el.progressBar.style.width = `${(answeredCount / ROUND_LENGTH) * 100}%`;
}

function showQuestion() {
  const question = state.questions[state.index];
  state.answered = false;

  el.word.textContent = question.word;
  el.meaning.textContent = question.ar;
  el.feedback.textContent = "";
  el.feedback.className = "feedback";
  el.next.hidden = true;

  el.answerButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });

  renderStats();
}

function showResult() {
  el.quiz.hidden = true;
  el.result.hidden = false;

  if (state.score > state.best) {
    state.best = state.score;
    saveBest(state.best);
  }

  let message = "Keep going. Repetition is the key.";
  if (state.score >= 9) message = "Excellent!";
  else if (state.score >= 6) message = "Good job. Keep practicing.";
  el.resultText.textContent = `You got ${state.score} out of ${ROUND_LENGTH} right. ${message}`;

  el.mistakes.replaceChildren();
  if (state.mistakes.length === 0) {
    const perfect = document.createElement("p");
    perfect.textContent = "No mistakes. Perfect round!";
    el.mistakes.append(perfect);
  } else {
    const title = document.createElement("p");
    title.textContent = "Review these words:";
    const list = document.createElement("ul");
    state.mistakes.forEach((item) => {
      const li = document.createElement("li");
      li.append(`${item.article} ${item.word} `);
      const meaning = document.createElement("span");
      meaning.className = "ar";
      meaning.lang = "ar";
      meaning.dir = "rtl";
      meaning.textContent = `(${item.ar})`;
      li.append(meaning);
      list.append(li);0
   
   });
    el.mistakes.append(title, list);
  }

  renderStats();
  el.restart.focus();
}

// ---------- Game flow ----------
function startRound() {
  state.questions = shuffle(WORDS).slice(0, ROUND_LENGTH);
  state.index = 0;
  state.score = 0;
  state.streak = 0;
  state.mistakes = [];

  el.result.hidden = true;
  el.quiz.hidden = false;
  showQuestion();
}

function handleAnswer(chosenArticle) {
  if (state.answered) return;
  state.answered = true;

  const question = state.questions[state.index];
  const isCorrect = chosenArticle === question.article;

  if (isCorrect) {
    state.score += 1;
    state.streak += 1;
    el.feedback.textContent = `Richtig! ${question.article} ${question.word}`;
    el.feedback.className = "feedback good";
  } else {
    state.streak = 0;
    state.mistakes.push(question);
    el.feedback.textContent = `Falsch. It's ${question.article} ${question.word}`;
    el.feedback.className = "feedback bad";
  }

  const tipText = getRuleTip(question.word);
  if (tipText) {
    const tip = document.createElement("span");
    tip.className = "tip";
    tip.textContent = tipText;
    el.feedback.append(tip);
  }

  el.answerButtons.forEach((button) => {
    button.disabled = true;
    if (button.dataset.article === question.article) button.classList.add("correct");
    else if (button.dataset.article === chosenArticle) button.classList.add("wrong");
  });

  const isLast = state.index === state.questions.length - 1;
  el.next.textContent = isLast ? "See result" : "Next";
  el.next.hidden = false;
  el.next.focus();
  renderStats();
}

function goNext() {
  state.index += 1;
  if (state.index >= state.questions.length) showResult();
  else showQuestion();
}

// ---------- Events ----------
el.answerButtons.forEach((button) => {
  button.addEventListener("click", () => handleAnswer(button.dataset.article));
});
el.next.addEventListener("click", goNext);
el.restart.addEventListener("click", startRound);

// Keys 1, 2, 3 answer. Enter works on the focused "Next" button by default.
document.addEventListener("keydown", (event) => {
  if (el.quiz.hidden || state.answered) return;
  const article = KEY_TO_ARTICLE[event.key];
  if (article) handleAnswer(article);
});

startRound();
