/* ===================================================================
   site-search.js — type a few letters, land on the page.

   Reads window.ADV_SEARCH_INDEX (search-index.js) and opens a jump-to-page
   box on Ctrl/Cmd-K or "/": every match is a real URL on this site, so Enter
   navigates rather than running a query somewhere.

   There is deliberately no button in the navbar. Anything that should open
   the box calls window.ADV_SEARCH_OPEN() — one line wherever a trigger is
   wanted, rather than markup pasted into 98 pages.
   =================================================================== */
(function () {
    'use strict';

    var MAX = 8;

    /* The index stores every URL relative to the site root, but the disease
       pages sit two folders down. This script's own src already carries the
       right number of ../ steps, so the base comes from there rather than
       from guessing at the current path's depth. */
    var self = document.currentScript ||
        document.querySelector('script[src*="site-search.js"]');
    var BASE = self ? self.src.replace(/site-search\.js(\?.*)?$/, '') : '';

    function href(u) {
        return /^(https?:)?\/\//.test(u) ? u : BASE + u;
    }

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function norm(s) {
        return String(s || '')
            .toLowerCase()
            .replace(/[‘’]/g, "'")
            .replace(/[^a-z0-9'&+ ]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /* Rank by where the query lands, not just whether it does: a whole-title
       match beats a title that merely starts with the word, which beats a
       word buried in a description. Every query token has to appear
       somewhere, so "liver cancer" cannot match a page about the liver that
       never mentions cancer. */
    function score(entry, tokens, whole) {
        var t = entry._t, k = entry._k, hay = entry._hay, s = 0;

        for (var i = 0; i < tokens.length; i++) {
            var q = tokens[i];
            if (hay.indexOf(q) === -1) return 0;

            if (t === q) s += 700;
            else if (t.indexOf(q) === 0) s += 480;
            else if (t.indexOf(' ' + q) !== -1) s += 320;
            else if (t.indexOf(q) !== -1) s += 150;
            else if (k.indexOf(' ' + q) !== -1 || k.indexOf(q) === 0) s += 70;
            else s += 25;
        }

        // the phrase itself, in order, is worth more than the same words apart
        if (tokens.length > 1) {
            if (t.indexOf(whole) === 0) s += 400;
            else if (t.indexOf(whole) !== -1) s += 220;
            else if (k.indexOf(whole) !== -1) s += 60;
        }

        // a short title matching is a tighter fit than a long one
        return s + Math.max(0, 40 - t.length / 3);
    }

    /* Highlight what the reader typed. One regex over the escaped title, so
       a later token can never match inside the <mark> an earlier one just
       inserted — longest first, so "liver cancer" wraps the phrase rather
       than each word separately. */
    function mark(text, tokens) {
        var out = esc(text);
        var parts = tokens
            .filter(function (q) { return q.length > 1; })
            .sort(function (a, b) { return b.length - a.length; })
            .map(function (q) { return q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });

        if (!parts.length) return out;
        return out.replace(new RegExp('(' + parts.join('|') + ')', 'ig'), '<mark>$1</mark>');
    }

    ready(function () {
        var index = window.ADV_SEARCH_INDEX;
        if (!index || !index.length) return;

        // precompute the normalised haystacks once, not on every keystroke
        index.forEach(function (e, i) {
            e._t = norm(e.t);
            e._k = norm(e.k);
            e._hay = e._t + ' ' + e._k + ' ' + norm(e.u.replace(/[-/#.]/g, ' '));
            e._i = i;
        });

        var veil = document.createElement('div');
        veil.className = 'as-veil';
        veil.setAttribute('role', 'dialog');
        veil.setAttribute('aria-modal', 'true');
        veil.setAttribute('aria-label', 'Search this site');
        veil.innerHTML =
            '<div class="as-panel">' +
            '  <div class="as-field">' +
            '    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
            '    <input class="as-input" type="search" autocomplete="off" spellcheck="false"' +
            '           placeholder="Search pages, services, blogs…" aria-label="Search this site"' +
            '           role="combobox" aria-expanded="false" aria-controls="as-list" aria-autocomplete="list">' +
            '    <button class="as-esc" type="button">Esc</button>' +
            '  </div>' +
            '  <ul class="as-list" id="as-list" role="listbox"></ul>' +
            '  <div class="as-foot">' +
            '    <span><kbd>↑</kbd> <kbd>↓</kbd> to move</span>' +
            '    <span><kbd>Enter</kbd> to open</span>' +
            '    <span><kbd>Ctrl</kbd> <kbd>K</kbd> to search</span>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(veil);

        var input = veil.querySelector('.as-input');
        var list = veil.querySelector('.as-list');
        var hits = [];
        var at = -1;

        function rows() {
            return list.querySelectorAll('.as-hit');
        }

        function highlight(n) {
            var r = rows();
            if (!r.length) { at = -1; return; }
            at = (n + r.length) % r.length;
            r.forEach(function (el, i) { el.classList.toggle('is-on', i === at); });
            input.setAttribute('aria-activedescendant', r[at].id);
            r[at].scrollIntoView({ block: 'nearest' });
        }

        function suggest() {
            // an empty box offers the places people arrive looking for
            return index.filter(function (e) {
                return e.s === 'Clinical Services' || e.s === 'Contact';
            }).slice(0, 6);
        }

        function draw(q) {
            var tokens = norm(q).split(' ').filter(Boolean);
            var placeholderList = !tokens.length;

            if (placeholderList) {
                hits = suggest();
            } else {
                var whole = tokens.join(' ');
                hits = index
                    .map(function (e) { return { e: e, s: score(e, tokens, whole) }; })
                    .filter(function (x) { return x.s > 0; })
                    .sort(function (a, b) {
                        return b.s - a.s || a.e._i - b.e._i;
                    })
                    .slice(0, MAX)
                    .map(function (x) { return x.e; });
            }

            if (!hits.length) {
                list.innerHTML = '<li class="as-empty">Nothing matched “' + esc(q) +
                    '”.<br>Try <a href="' + esc(href('blogs.html')) + '">all articles</a> or ' +
                    '<a href="' + esc(href('clinical-services.html')) +
                    '">clinical services</a>.</li>';
                input.setAttribute('aria-expanded', 'false');
                at = -1;
                return;
            }

            /* The section rides on the row rather than heading a group: rows
               are ordered by how well they match, so the same section can
               come up again further down and a group heading would then be
               lying about what sits under it. */
            var html = '';
            hits.forEach(function (e, i) {
                html += '<li role="presentation"><a class="as-hit" id="as-hit-' + i +
                    '" role="option" aria-selected="false" href="' + esc(href(e.u)) + '">' +
                    '<span class="as-top"><strong>' +
                    (placeholderList ? esc(e.t) : mark(e.t, tokens)) +
                    '</strong><em>' + esc(e.s) + '</em></span>' +
                    (e.k ? '<span class="as-sub">' + esc(e.k) + '</span>' : '') +
                    '</a></li>';
            });

            list.innerHTML = html;
            input.setAttribute('aria-expanded', 'true');
            highlight(0);
        }

        // whatever the reader was on when they hit the shortcut, so closing
        // puts them back there rather than at the top of the page
        var camefrom = null;

        function open() {
            camefrom = document.activeElement;
            veil.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            draw(input.value);
            input.focus();
            input.select();
        }

        function close() {
            veil.classList.remove('is-open');
            document.body.style.overflow = '';
            if (camefrom && camefrom.focus) camefrom.focus();
        }

        function go() {
            var r = rows();
            var target = r[at < 0 ? 0 : at];
            if (target) window.location.href = target.getAttribute('href');
        }

        // the one way in from markup, for whenever a trigger is wanted back
        window.ADV_SEARCH_OPEN = open;

        veil.querySelector('.as-esc').addEventListener('click', close);

        veil.addEventListener('click', function (e) {
            if (e.target === veil) close();
        });

        input.addEventListener('input', function () { draw(this.value); });

        // pointer and keyboard share one selection, so only one row ever looks chosen
        list.addEventListener('mousemove', function (e) {
            var row = e.target.closest('.as-hit');
            if (!row) return;
            var i = Array.prototype.indexOf.call(rows(), row);
            if (i !== -1 && i !== at) highlight(i);
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); highlight(at + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(at - 1); }
            else if (e.key === 'Enter') { e.preventDefault(); go(); }
            else if (e.key === 'Escape') { e.preventDefault(); close(); }
        });

        /* Ctrl/Cmd-K from anywhere, and a bare "/" when the reader is not
           already typing into something. */
        document.addEventListener('keydown', function (e) {
            var typing = /^(input|textarea|select)$/i.test(e.target.tagName) ||
                e.target.isContentEditable;

            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                veil.classList.contains('is-open') ? close() : open();
            } else if (e.key === '/' && !typing && !veil.classList.contains('is-open')) {
                e.preventDefault();
                open();
            } else if (e.key === 'Escape' && veil.classList.contains('is-open')) {
                close();
            }
        });
    });
})();
