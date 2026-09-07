(() => {
  const cards = [...document.querySelectorAll('.question-grid .question-card p')];
  const questions = [...new Set((window.QUESTIONS || [])
    .filter((question) => typeof question === 'string')
    .map((question) => question.trim())
    .filter(Boolean))];
  if (!cards.length || questions.length < cards.length) return;

  // Fisher–Yates: kiválasztás visszatevés nélkül, így nincs ismétlődés a kártyákon.
  for (let index = 0; index < cards.length; index++) {
    const next = index + Math.floor(Math.random() * (questions.length - index));
    [questions[index], questions[next]] = [questions[next], questions[index]];
    cards[index].textContent = questions[index];
  }
})();
