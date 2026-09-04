(function () {
  'use strict';

  const storageKey = 'szanyiaida_statistics_consent';
  const choiceLifetime = 180 * 24 * 60 * 60 * 1000;

  function getChoice() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (!stored || !stored.value || !stored.savedAt) return null;
      if (Date.now() - stored.savedAt > choiceLifetime) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return stored.value;
    } catch (_) {
      localStorage.removeItem(storageKey);
      return null;
    }
  }

  function loadStatcounter() {
    if (document.querySelector('script[data-statcounter]')) return;

    window.sc_project = 13295039;
    window.sc_invisible = 1;
    window.sc_security = '2cfbde6b';

    const script = document.createElement('script');
    script.src = 'https://www.statcounter.com/counter/counter.js';
    script.async = true;
    script.dataset.statcounter = 'true';
    document.head.appendChild(script);
  }

  function saveChoice(value) {
    localStorage.setItem(storageKey, JSON.stringify({ value, savedAt: Date.now() }));
    document.getElementById('privacy-consent-banner')?.remove();
    if (value === 'accepted') loadStatcounter();
  }

  function showBanner() {
    const banner = document.createElement('section');
    banner.id = 'privacy-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Statisztikai adatkezelési beállítások');
    banner.innerHTML = `
      <div class="privacy-consent-content">
        <p><strong>Látogatottsági statisztika</strong></p>
        <p>Az oldal opcionális sütiket használ a látogatottság méréséhez. <a href="${window.PRIVACY_NOTICE_PATH || 'adatkezeles.html'}">Részletek</a></p>
        <div class="privacy-consent-actions">
          <button type="button" data-consent="rejected">Elutasítom</button>
          <button type="button" class="privacy-consent-accept" data-consent="accepted">Elfogadom</button>
        </div>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `
      #privacy-consent-banner{position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;max-width:760px;margin:auto;background:#fffaf4;color:#241f1a;border:1px solid #d7c8b9;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.22);font:15px/1.5 system-ui,sans-serif}
      .privacy-consent-content{padding:18px 20px}.privacy-consent-content p{margin:0 0 10px}.privacy-consent-content a{color:#70452f}
      .privacy-consent-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}.privacy-consent-actions button{border:1px solid #70452f;border-radius:999px;background:transparent;color:#241f1a;padding:9px 16px;cursor:pointer;font:inherit}.privacy-consent-actions .privacy-consent-accept{background:#70452f;color:#fff}
      .privacy-consent-actions button:focus-visible{outline:3px solid #c89570;outline-offset:2px}
    `;
    document.head.appendChild(style);
    document.body.appendChild(banner);

    banner.querySelectorAll('[data-consent]').forEach((button) => {
      button.addEventListener('click', () => saveChoice(button.dataset.consent));
    });
  }

  window.resetStatisticsConsent = function () {
    localStorage.removeItem(storageKey);
    window.location.reload();
  };

  const choice = getChoice();
  if (choice === 'accepted') loadStatcounter();
  else if (choice !== 'rejected') showBanner();
}());
