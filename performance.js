/* ===== PERFORMANCE OPTIMIZED THIRD-PARTY SCRIPT LOADER ===== */
(function () {
    'use strict';

    var loaded = { gtm: false, fb: false };
    var userInteracted = false;

    /* ===== GOOGLE TAG MANAGER - Delayed 3s ===== */
    function loadGTM() {
        if (loaded.gtm) return;
        loaded.gtm = true;

        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0];
            var j = d.createElement(s);
            var dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-KDKH9M44');
    }

    /* ===== FACEBOOK PIXEL - After interaction or 5s ===== */
    function loadFacebookPixel() {
        if (loaded.fb) return;
        loaded.fb = true;

        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        // Initialize your Facebook Pixel ID here if needed
        // fbq('init', 'YOUR_PIXEL_ID');
        // fbq('track', 'PageView');
    }

    /* ===== USER INTERACTION DETECTION ===== */
    function onUserInteraction() {
        if (userInteracted) return;
        userInteracted = true;
        loadFacebookPixel();
        // Remove listeners after first interaction
        removeInteractionListeners();
    }

    function removeInteractionListeners() {
        window.removeEventListener('scroll', onUserInteraction, { passive: true });
        window.removeEventListener('click', onUserInteraction, { passive: true });
        window.removeEventListener('touchstart', onUserInteraction, { passive: true });
        window.removeEventListener('mousemove', onUserInteraction, { passive: true });
    }

    /* ===== INITIALIZE LOADING STRATEGY ===== */
    function init() {
        // GTM - Load after 3s
        setTimeout(loadGTM, 3000);

        // Facebook Pixel - Load on first interaction or after 5s
        var interactionEvents = ['scroll', 'click', 'touchstart', 'mousemove'];
        interactionEvents.forEach(function (event) {
            window.addEventListener(event, onUserInteraction, { once: true, passive: true });
        });

        // Fallback: load after 5s even without interaction
        setTimeout(function () {
            if (!loaded.fb) loadFacebookPixel();
        }, 5000);
    }

    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
