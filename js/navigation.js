(() => {
  const header = document.querySelector('.home-topbar');
  if (!header) return;

  const button = header.querySelector('.menu-toggle');
  const navigation = header.querySelector('nav');
  const mobile = window.matchMedia('(max-width: 820px)');

  const closeMenu = (restoreFocus = false) => {
    header.classList.remove('menu-open');
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus();
  };

  button.hidden = false;
  header.classList.add('navigation-ready');

  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('menu-open', open);
    button.setAttribute('aria-expanded', String(open));
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu(mobile.matches);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      closeMenu(true);
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closeMenu();
  });

  header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) closeMenu();
  });

  mobile.addEventListener('change', () => {
    const focusWillHide = mobile.matches && navigation.contains(document.activeElement);
    closeMenu(focusWillHide);
  });
})();
