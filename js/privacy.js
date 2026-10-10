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
    document.getElementById('privacy-consent-overlay')?.remove();
    document.body.classList.remove('privacy-consent-open');
    if (value === 'accepted') loadStatcounter();
  }

  function showBanner() {
    const overlay = document.createElement('div');
    overlay.id = 'privacy-consent-overlay';

    const banner = document.createElement('div');
    banner.id = 'privacy-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-labelledby', 'privacy-consent-title');
    banner.setAttribute('aria-describedby', 'privacy-consent-description');
    banner.innerHTML = `
      <div class="privacy-consent-content">
        <p id="privacy-consent-title"><strong>Adatkezelési beállítások</strong></p>
        <p id="privacy-consent-description">Az oldal opcionális sütiket használ a látogatottság méréséhez és az optimális felhasználói élmény érdekében. <a href="${window.PRIVACY_NOTICE_PATH || '/adatkezeles/'}">Részletek</a></p>
        <div class="privacy-consent-actions">
          <button type="button" data-consent="rejected">Elutasítom</button>
          <button type="button" class="privacy-consent-accept" data-consent="accepted">Elfogadom</button>
        </div>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `
      body.privacy-consent-open{overflow:hidden}
      #privacy-consent-overlay{position:fixed;z-index:9999;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(23,21,19,.56);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
      #privacy-consent-banner{width:min(620px,100%);background:#fffaf4;color:#241f1a;border:1px solid #d7c8b9;border-radius:16px;box-shadow:0 22px 70px rgba(0,0,0,.34);font:16px/1.5 system-ui,sans-serif}
      .privacy-consent-content{padding:28px 30px}.privacy-consent-content p{margin:0}.privacy-consent-content p+p{margin-top:8px}.privacy-consent-content a{color:#70452f;text-decoration:underline;text-underline-offset:2px}
      .privacy-consent-actions{display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap;margin-top:22px}.privacy-consent-actions button{min-width:124px;border:1.5px solid #675d56;border-radius:999px;background:transparent;color:#4f4741;padding:10px 19px;cursor:pointer;font:inherit;font-weight:600}.privacy-consent-actions .privacy-consent-accept{border-color:#16824b;background:#16824b;color:#fff;box-shadow:0 3px 10px rgba(22,130,75,.28)}
      .privacy-consent-actions button:hover{border-color:#241f1a;color:#241f1a}.privacy-consent-actions .privacy-consent-accept:hover{border-color:#116b3d;background:#116b3d;color:#fff}
      .privacy-consent-actions button:focus-visible{outline:3px solid #c89570;outline-offset:2px}
      @media (max-width:600px){#privacy-consent-overlay{align-items:flex-end;padding:0;background:rgba(23,21,19,.5)}#privacy-consent-banner{width:100%;border-width:1px 0 0;border-radius:20px 20px 0 0;font-size:15px}.privacy-consent-content{padding:26px 20px max(22px,env(safe-area-inset-bottom))}.privacy-consent-actions{flex-direction:column;margin-top:20px}.privacy-consent-actions button{width:100%;min-height:46px}}
      @media (prefers-reduced-motion:no-preference){#privacy-consent-overlay{animation:privacy-fade-in .18s ease-out}#privacy-consent-banner{animation:privacy-dialog-in .22s ease-out}@keyframes privacy-fade-in{from{background:rgba(23,21,19,0);backdrop-filter:blur(0);-webkit-backdrop-filter:blur(0)}}@keyframes privacy-dialog-in{from{opacity:0;transform:translateY(10px) scale(.985)}}}
    `;
    document.head.appendChild(style);
    overlay.appendChild(banner);
    document.body.appendChild(overlay);
    document.body.classList.add('privacy-consent-open');

    banner.querySelectorAll('[data-consent]').forEach((button) => {
      button.addEventListener('click', () => saveChoice(button.dataset.consent));
    });

    const focusableElements = banner.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    banner.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    });

    banner.querySelector('[data-consent="rejected"]').focus();
  }

  window.resetStatisticsConsent = function () {
    localStorage.removeItem(storageKey);
    window.location.reload();
  };

  const choice = getChoice();
  if (choice === 'accepted') loadStatcounter();
  else if (choice !== 'rejected') showBanner();
}());
