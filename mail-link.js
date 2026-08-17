/* ===================================================================
   mail-link.js — makes every email link actually open something.

   A mailto: link does nothing at all on a machine with no mail app
   registered, which is most browsers on a fresh Windows install and every
   phone where mail was never set up: the visitor clicks Apply, nothing
   happens, and the application is lost.

   So the mailto: is still tried first — anyone with Outlook or Mail gets
   their normal client — and if the browser is still sitting here a moment
   later, a small panel offers Gmail, Outlook on the web, or the plain
   address to copy. Nothing is assumed about which mail service they use.

   Also exposes window.ADV_MAILTO(url) for scripts that send someone to an
   address rather than linking to one (the contact modal does this).
   =================================================================== */
(function () {
    'use strict';

    /* How long to wait before deciding no mail app answered. Long enough
       that a slow client still wins the race, short enough not to feel
       broken. */
    var WAIT = 1500;

    var CSS = '' +
        '.aml-veil{position:fixed;inset:0;z-index:3000;display:flex;align-items:center;' +
        'justify-content:center;padding:20px;background:rgba(43,26,24,.45);opacity:0;' +
        'visibility:hidden;transition:opacity .2s ease,visibility .2s ease}' +
        '.aml-veil.is-open{opacity:1;visibility:visible}' +
        '.aml-box{width:min(420px,100%);background:#fff;border-radius:16px;padding:26px 24px 20px;' +
        'box-shadow:0 24px 60px rgba(43,26,24,.3);font-family:inherit;text-align:center}' +
        '.aml-box h3{margin:0 0 6px;font-size:1.12rem;font-weight:700;color:#2B2B2B}' +
        '.aml-box p{margin:0 0 18px;font-size:.9rem;line-height:1.55;color:#6F6F6F}' +
        '.aml-box strong{color:#C94239;word-break:break-all}' +
        '.aml-acts{display:grid;gap:10px}' +
        '.aml-acts a,.aml-acts button{display:flex;align-items:center;justify-content:center;gap:9px;' +
        'padding:12px 16px;border-radius:10px;border:1px solid #F0E4E0;background:#FDF7F5;' +
        'font:inherit;font-size:.92rem;font-weight:600;color:#2B2B2B;text-decoration:none;cursor:pointer}' +
        '.aml-acts a:hover,.aml-acts button:hover{background:#FDF2EF;border-color:#E4574E}' +
        '.aml-close{margin-top:14px;background:none;border:0;font:inherit;font-size:.82rem;' +
        'color:#8C7A77;cursor:pointer;text-decoration:underline}' +
        '@media (prefers-reduced-motion:reduce){.aml-veil{transition:none}}';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* mailto:a@b.com?subject=x&body=y -> the three pieces, still encoded */
    function parse(url) {
        var rest = String(url).replace(/^mailto:/i, '');
        var cut = rest.indexOf('?');
        var query = cut === -1 ? '' : rest.slice(cut + 1);
        var out = { to: decodeURIComponent(cut === -1 ? rest : rest.slice(0, cut)), su: '', body: '' };

        query.split('&').forEach(function (pair) {
            var eq = pair.indexOf('=');
            if (eq === -1) return;
            var key = pair.slice(0, eq).toLowerCase();
            var val = pair.slice(eq + 1);
            if (key === 'subject') out.su = val;
            else if (key === 'body') out.body = val;
        });
        return out;
    }

    var veil = null;

    function panel(m) {
        if (!veil) {
            var style = document.createElement('style');
            style.textContent = CSS;
            document.head.appendChild(style);

            veil = document.createElement('div');
            veil.className = 'aml-veil';
            veil.setAttribute('role', 'dialog');
            veil.setAttribute('aria-modal', 'true');
            document.body.appendChild(veil);

            veil.addEventListener('click', function (e) {
                if (e.target === veil || e.target.classList.contains('aml-close')) close();
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && veil.classList.contains('is-open')) close();
            });
        }

        var q = 'to=' + encodeURIComponent(m.to) + '&su=' + m.su + '&body=' + m.body;
        var gmail = 'https://mail.google.com/mail/?view=cm&fs=1&' + q;
        var outlook = 'https://outlook.live.com/mail/0/deeplink/compose?to=' +
            encodeURIComponent(m.to) + '&subject=' + m.su + '&body=' + m.body;

        veil.innerHTML =
            '<div class="aml-box">' +
            '  <h3>No mail app opened</h3>' +
            '  <p>Your browser has no email program set up. Write to us at<br><strong>' +
            esc(m.to) + '</strong></p>' +
            '  <div class="aml-acts">' +
            '    <a href="' + esc(gmail) + '" target="_blank" rel="noopener">' +
            '      <i class="fa-solid fa-envelope" aria-hidden="true"></i> Open in Gmail</a>' +
            '    <a href="' + esc(outlook) + '" target="_blank" rel="noopener">' +
            '      <i class="fa-solid fa-envelope-open" aria-hidden="true"></i> Open in Outlook</a>' +
            '    <button type="button" class="aml-copy">' +
            '      <i class="fa-regular fa-copy" aria-hidden="true"></i> ' +
            '      <span>Copy the address</span></button>' +
            '  </div>' +
            '  <button type="button" class="aml-close">Close</button>' +
            '</div>';

        var copy = veil.querySelector('.aml-copy');
        copy.addEventListener('click', function () {
            var label = copy.querySelector('span');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(m.to).then(function () {
                    label.textContent = 'Copied';
                }, function () {
                    label.textContent = m.to;
                });
            } else {
                label.textContent = m.to;
            }
        });

        veil.classList.add('is-open');
        veil.querySelector('a').focus();
    }

    function close() {
        if (veil) veil.classList.remove('is-open');
    }

    /* Try the mail client, and only put the panel up if nothing took over —
       a client that opens moves focus out of the page, which is the signal
       that no fallback is needed. */
    function send(url) {
        var handled = false;
        var note = function () { handled = true; };

        window.addEventListener('blur', note);
        document.addEventListener('visibilitychange', note);
        window.addEventListener('pagehide', note);

        window.location.href = url;

        setTimeout(function () {
            window.removeEventListener('blur', note);
            document.removeEventListener('visibilitychange', note);
            window.removeEventListener('pagehide', note);
            if (!handled && document.visibilityState === 'visible' && document.hasFocus()) {
                panel(parse(url));
            }
        }, WAIT);
    }

    window.ADV_MAILTO = send;

    document.addEventListener('click', function (e) {
        var link = e.target.closest && e.target.closest('a[href^="mailto:"]');
        if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey ||
            e.button !== 0) return;
        e.preventDefault();
        send(link.getAttribute('href'));
    });
})();
