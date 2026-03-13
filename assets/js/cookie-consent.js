/**
 * Forty Cookie Consent
 * 
 * Laadt Snitcher alleen na expliciete toestemming.
 * Umami draait altijd (cookieloos, geen consent nodig).
 * 
 * Gebruik: voeg dit script toe vóór </body> op elke pagina:
 * <script src="/assets/js/cookie-consent.js"></script>
 *
 */
(function () {
  'use strict';

  // Niet tonen als al gekozen
  var consent = localStorage.getItem('forty_cookie_consent');
  if (consent === 'accepted') {
    loadSnitcher();
    return;
  }
  if (consent === 'rejected') return;

  // Banner HTML injecteren
  var banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie-instellingen');
  banner.innerHTML =
    '<div class="cookie-banner__inner">' +
      '<div class="cookie-banner__text">' +
        '<strong>Cookies</strong>' +
        '<p>We gebruiken alleen wat nodig is. Met toestemming plaatsen we cookies om ons bereik beter te begrijpen. ' +
        '<a href="/privacy/" style="color:var(--stone-500,#78716c);text-decoration:underline;font-size:13px">Meer info</a></p>' +
      '</div>' +
      '<div class="cookie-banner__actions">' +
        '<button id="cookieReject" class="cookie-banner__btn cookie-banner__btn--secondary">Alleen noodzakelijk</button>' +
        '<button id="cookieAccept" class="cookie-banner__btn cookie-banner__btn--primary">Accepteren</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(banner);

  // Animatie: fade in na kort delay
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      banner.classList.add('cookie-banner--visible');
    });
  });

  // Handlers
  document.getElementById('cookieAccept').addEventListener('click', function () {
    localStorage.setItem('forty_cookie_consent', 'accepted');
    closeBanner();
    loadSnitcher();
  });

  document.getElementById('cookieReject').addEventListener('click', function () {
    localStorage.setItem('forty_cookie_consent', 'rejected');
    closeBanner();
  });

  function closeBanner() {
    banner.classList.remove('cookie-banner--visible');
    banner.classList.add('cookie-banner--hiding');
    setTimeout(function () {
      banner.remove();
    }, 300);
  }

  function loadSnitcher() {
    if (window.Snitcher && window.Snitcher._loaded) return;
    !function(e){"use strict";var t=e&&e.namespace;if(t&&e.profileId&&e.cdn){var i=window[t];if(i&&Array.isArray(i)||(i=window[t]=[]),!i.initialized&&!i._loaded)if(i._loaded)console&&console.warn("[Radar] Duplicate initialization attempted");else{i._loaded=!0;["track","page","identify","group","alias","ready","debug","on","off","once","trackClick","trackSubmit","trackLink","trackForm","pageview","screen","reset","register","setAnonymousId","addSourceMiddleware","addIntegrationMiddleware","addDestinationMiddleware","giveCookieConsent"].forEach((function(e){var a;i[e]=(a=e,function(){var e=window[t];if(e.initialized)return e[a].apply(e,arguments);var i=[].slice.call(arguments);return i.unshift(a),e.push(i),e})})),-1===e.apiEndpoint.indexOf("http")&&(e.apiEndpoint="https://"+e.apiEndpoint),i.bootstrap=function(){var t,i=document.createElement("script");i.async=!0,i.type="text/javascript",i.id="__radar__",i.setAttribute("data-settings",JSON.stringify(e)),i.src=[-1!==(t=e.cdn).indexOf("http")?"":"https://",t,"/releases/latest/radar.min.js"].join("");var a=document.scripts[0];a.parentNode.insertBefore(i,a)},i.bootstrap()}}else"undefined"!=typeof console&&console.error("[Radar] Configuration incomplete")}({
      "apiEndpoint": "radar.snitcher.com",
      "cdn": "cdn.snitcher.com",
      "namespace": "Snitcher",
      "profileId": "s3cckcDVuO"
    });
  }
})();
