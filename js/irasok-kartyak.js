(() => {
  if (!Array.isArray(window.WRITINGS)) return;
  document.querySelectorAll('[data-writings]').forEach((list) => {
    const limit = Number(list.dataset.limit) || window.WRITINGS.length;
    const fragment = document.createDocumentFragment();
    window.WRITINGS.slice(0, limit).forEach((writing) => {
      const card = document.createElement('a');
      card.className = 'card article-card';
      card.href = (list.dataset.base || '') + writing.file;
      card.dataset.category = writing.categoryId;
      const fields = [
        ['div', 'article-meta', `${writing.category} · ${writing.year}`],
        ['h3', '', writing.title],
        ['p', '', writing.description],
        ['span', 'read-more', 'Tovább olvasom →'],
      ];
      fields.forEach(([tag, className, text]) => {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = text;
        card.append(element);
      });
      fragment.append(card);
    });
    list.replaceChildren(fragment);
  });
})();
