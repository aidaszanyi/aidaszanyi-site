(() => {
  const filters = document.querySelector('.writing-filters');
  const cards = [...document.querySelectorAll('#writing-list [data-category]')];
  const count = document.querySelector('.writing-count');
  if (!filters || !count) return;

  count.textContent = `${cards.length} írás`;

  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button || !filters.contains(button)) return;
    const category = button.dataset.filter;
    filters.querySelectorAll('button').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    let visible = 0;
    cards.forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) visible++;
    });
    count.textContent = `${visible} írás`;
  });
})();
