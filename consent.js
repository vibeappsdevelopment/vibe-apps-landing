(function () {
  var CONSENT_KEY = 'vibe_analytics_consent';
  var POSTHOG_KEY = 'phc_HXF64unA6jxbChFFtKZGUNEdMS1Lhv3lqlNOkadzjz5';
  var POSTHOG_HOST = 'https://eu.i.posthog.com';

  function initPostHog() {
    if (window.__posthog_initialized) return;
    window.__posthog_initialized = true;

    !function (t, e) { var o, n, p, r; e.__SV || (window.posthog && window.posthog.__loaded) || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } } (p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0, p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e }, u.people.toString = function () { return u.toString(1) + ".people (stub)" }, o = "capture calculateEventProperties register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId init".split(" "), n = 0; n < o.length; n++)g(u, o[n]); e._i.push([i, s, a]) }, e.__SV = 1) }(document, window.posthog || []);

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      persistence: 'memory',
      capture_pageleave: true,
      capture_pageview: true
    });
  }

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); }
    catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); }
    catch (e) { /* private browsing */ }
  }

  function hideBanner() {
    var banner = document.getElementById('consent-banner');
    if (banner) banner.remove();
  }

  function showBanner() {
    if (document.getElementById('consent-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics consent');
    banner.className = 'consent-banner';

    var text = document.createElement('p');
    text.className = 'consent-banner__text';
    text.textContent = 'We use anonymous analytics to improve this site. No cookies are stored. ';
    var link = document.createElement('a');
    link.href = 'website-privacy.html#analytics';
    link.textContent = 'Learn more';
    text.appendChild(link);

    var buttons = document.createElement('div');
    buttons.className = 'consent-banner__buttons';

    var rejectBtn = document.createElement('button');
    rejectBtn.className = 'consent-btn consent-btn--reject';
    rejectBtn.textContent = 'Reject';
    rejectBtn.addEventListener('click', function () {
      setConsent('rejected');
      hideBanner();
    });

    var acceptBtn = document.createElement('button');
    acceptBtn.className = 'consent-btn consent-btn--accept';
    acceptBtn.textContent = 'Accept';
    acceptBtn.addEventListener('click', function () {
      setConsent('accepted');
      hideBanner();
      initPostHog();
    });

    buttons.appendChild(rejectBtn);
    buttons.appendChild(acceptBtn);
    banner.appendChild(text);
    banner.appendChild(buttons);

    document.body.appendChild(banner);
  }

  // Allow users to reset consent from footer link
  window.vibeResetConsent = function () {
    try { localStorage.removeItem(CONSENT_KEY); }
    catch (e) {}
    if (window.posthog && typeof posthog.opt_out_capturing === 'function') {
      posthog.opt_out_capturing();
    }
    window.__posthog_initialized = false;
    showBanner();
  };

  // Boot
  var consent = getConsent();
  if (consent === 'accepted') {
    initPostHog();
  } else if (consent !== 'rejected') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
