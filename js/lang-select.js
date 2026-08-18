/* ===================================================================
   lang-select.js — a language selector that drives Google Translate.

   The visible control is ours; the translation is Google's. The widget is
   loaded hidden, and picking a language sets the value of the <select> it
   builds and fires a change at it, which is the supported way to drive it
   without showing its own interface.

   Two things make the choice stick across the site: the widget writes a
   `googtrans` cookie, and we write the same cookie ourselves before the
   widget loads, so every subsequent page comes up already translated instead
   of flashing English first.

   The markup is built here rather than pasted into 98 pages.
   =================================================================== */
(function () {
    'use strict';

    /* Native spelling first, because someone looking for their own language
       is scanning for its script, not for the English label. */
    var LANGS = [
        { code: 'en', name: 'English', native: '' },
        { code: 'bn', name: 'Bengali', native: 'বাংলা' },
        { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
        { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
        { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
        { code: 'mr', name: 'Marathi', native: 'मराठी' },
        { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
        { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
        { code: 'te', name: 'Telugu', native: 'తెలుగు' }
    ];

    var PAGE_LANG = 'en';
    var CODES = LANGS.map(function (l) { return l.code; }).join(',');

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* ---- the googtrans cookie ----
       Google reads `/<from>/<to>`. It has to be written on the bare host and
       on the dot-prefixed domain, or a visitor arriving at www keeps losing
       the setting they made on the apex. */
    function readCookie() {
        var m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
        if (!m) return PAGE_LANG;
        var parts = decodeURIComponent(m[1]).split('/');
        return parts[2] || PAGE_LANG;
    }

    function writeCookie(code) {
        var value = code === PAGE_LANG ? '' : '/' + PAGE_LANG + '/' + code;
        var host = window.location.hostname;
        var bases = ['googtrans=' + value + ';path=/'];

        if (host && host !== 'localhost' && !/^[\d.]+$/.test(host)) {
            bases.push('googtrans=' + value + ';path=/;domain=' + host);
            bases.push('googtrans=' + value + ';path=/;domain=.' + host);
        }

        bases.forEach(function (base) {
            // an empty value with a past expiry is how the choice is cleared
            document.cookie = value
                ? base + ';max-age=31536000'
                : base + ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
        });
    }

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    /* ---- waiting for the widget ----
       The <select> the widget builds is what performs the translation, and it
       does not exist until Google's script has run and rendered. An observer
       catches it the instant it is inserted; the interval is the safety net
       for the case where it is already there, or arrives without a mutation
       we are watching. Whoever fires first wins and the rest is torn down. */
    var comboCache = null;

    function whenCombo(cb) {
        var combo = comboCache || document.querySelector('.goog-te-combo');
        if (combo && combo.options.length) {
            comboCache = combo;          // every later switch skips all of this
            return cb(combo);
        }

        var done = false;
        var obs, timer, giveUp;

        function finish(el) {
            if (done) return;
            done = true;
            if (obs) obs.disconnect();
            clearInterval(timer);
            clearTimeout(giveUp);
            cb(el);
        }

        function look() {
            var el = document.querySelector('.goog-te-combo');
            // options arrive a tick after the element itself
            if (el && el.options.length) { comboCache = el; finish(el); }
        }

        /* Scoped to the widget's own mount, not the whole body: the select can
           only appear inside it, and an observer over the entire document
           would then be woken by every node Google rewrites during a
           translation. It disconnects the moment the select is found. */
        obs = new MutationObserver(look);
        obs.observe(document.getElementById('als-gt') || document.body,
                    { childList: true, subtree: true });
        timer = setInterval(look, 120);

        // a blocked or failed script should not leave an observer running
        giveUp = setTimeout(function () {
            if (done) return;
            done = true;
            obs.disconnect();
            clearInterval(timer);
            cb(null);
        }, 15000);
    }

    /* Set by the control once it is built, so changeLanguage() can keep the
       pill and the ticked row in step even when it is called from elsewhere. */
    var syncUI = null;

    /* ---- the public entry point ----
       changeLanguage('hi') translates the page in place, with no reload. Safe
       to call before the widget has loaded: the request is held until the
       select appears, then applied. */
    function changeLanguage(next) {
        writeCookie(next);
        current = next;
        if (syncUI) syncUI(next);

        whenCombo(function (combo) {
            // widget never arrived, or we are already showing this language
            if (!combo || combo.value === next) return;

            /* Restoring the original is the one case the select may not offer
               as an option: some builds drop the page language from the list.
               An empty value is how that build spells "show the original". */
            var offered = Array.prototype.some.call(combo.options, function (o) {
                return o.value === next;
            });

            /* Hand it straight to the widget. Nothing is drawn over the page
               while it works: an overlay only replaced one flicker with
               another, and the swap itself is a single paint. */
            combo.value = offered ? next : (next === PAGE_LANG ? '' : next);
            combo.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    window.changeLanguage = changeLanguage;

    // the cookie has to exist before the widget script reads it
    var current = readCookie();

    ready(function () {
        var actions = document.querySelector('.nav-actions');
        if (!actions || document.querySelector('.als')) return;

        /* the element the widget renders into — kept in the document because
           the <select> it builds is what performs the translation */
        var mount = document.createElement('div');
        mount.id = 'als-gt';
        document.body.appendChild(mount);

        var wrap = document.createElement('div');
        /* notranslate: the point of a language menu is that it reads the same
           whatever the page is showing. Without it Google rewrites the native
           names and the code on the pill. */
        wrap.className = 'als notranslate';
        wrap.setAttribute('translate', 'no');

        var label = function (code) {
            var l = LANGS.filter(function (x) { return x.code === code; })[0];
            return l ? l.code.toUpperCase() : 'EN';
        };

        wrap.innerHTML =
            '<button class="als-btn" type="button" aria-haspopup="listbox" aria-expanded="false"' +
            '        aria-label="Choose a language">' +
            '  <span class="als-globe" aria-hidden="true">🌐</span>' +
            '  <span class="als-code">' + esc(label(current)) + '</span>' +
            '  <i class="fa-solid fa-chevron-down als-caret" aria-hidden="true"></i>' +
            '</button>' +
            '<ul class="als-panel" role="listbox" aria-label="Language">' +
            LANGS.map(function (l) {
                return '<li role="presentation">' +
                    '<button class="als-opt" type="button" role="option" data-code="' + l.code + '"' +
                    ' aria-selected="' + (l.code === current) + '">' +
                    '<span>' + esc(l.name) + '</span>' +
                    (l.native ? '<span class="als-native">' + esc(l.native) + '</span>' : '') +
                    '</button></li>';
            }).join('') +
            '</ul>';

        actions.insertBefore(wrap, actions.firstChild);

        var btn = wrap.querySelector('.als-btn');
        var code = wrap.querySelector('.als-code');
        var panel = wrap.querySelector('.als-panel');
        var opts = Array.prototype.slice.call(wrap.querySelectorAll('.als-opt'));

        function open() {
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            var on = wrap.querySelector('.als-opt[aria-selected="true"]');
            (on || opts[0]).focus();
        }

        function close(refocus) {
            wrap.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            if (refocus) btn.focus();
        }

        function isOpen() {
            return wrap.classList.contains('is-open');
        }

        /* Hand the choice to the widget. The <select> only exists once the
           widget script has run, so a language picked before then is applied
           when it appears. */
        // the visible half only — changeLanguage() drives this, never the reverse
        syncUI = function (next) {
            opts.forEach(function (o) {
                o.setAttribute('aria-selected', String(o.dataset.code === next));
            });
            code.textContent = label(next);
            /* <html lang> is deliberately not touched here: writing it forces
               a second full-document restyle at the exact moment Google is
               rewriting the text, which is visible as a flash. The widget
               sets it itself once the swap is done. */
        };

        btn.addEventListener('click', function () {
            isOpen() ? close(false) : open();
        });

        opts.forEach(function (o, i) {
            o.addEventListener('click', function () {
                changeLanguage(o.dataset.code);
                close(true);
            });

            o.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    opts[(i + 1) % opts.length].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    opts[(i - 1 + opts.length) % opts.length].focus();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    close(true);
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (isOpen() && !wrap.contains(e.target)) close(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen()) close(true);
        });

        /* ---- load the widget ----
           autoDisplay off, so it never puts its own banner up; the layout is
           SIMPLE because the <select> is all we use. */
        window.googleTranslateElementInit = function () {
            /* global google */
            new google.translate.TranslateElement({
                pageLanguage: PAGE_LANG,
                includedLanguages: CODES,
                /* HORIZONTAL, not SIMPLE. SIMPLE renders a link-and-menu
                   gadget and never builds the <select> — which is the only
                   part of the widget that can be driven from script, so with
                   SIMPLE a click changed nothing until the page was reloaded
                   and the cookie took over. The gadget is clipped out of view
                   either way, so the layout is invisible to the visitor. */
                layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                autoDisplay: false
            }, 'als-gt');

            // a language carried in on the cookie still needs the select nudged
            if (current !== PAGE_LANG) changeLanguage(current);
        };

        var s = document.createElement('script');
        s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        s.async = true;
        document.body.appendChild(s);
    });
})();
