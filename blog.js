/* ===================================================================
   Blog index behaviour: category filtering across the five sections,
   per-section "show all", latest-insights carousel, scroll reveal,
   newsletter. Every article is server-rendered — this only shows and
   hides, so the whole archive survives with JavaScript disabled.
   =================================================================== */
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- jump to a category ----------------
       Every article is on the page, in its own section — nothing filters,
       so these links simply scroll to the right band. */
    function goTo(id) {
        var section = document.getElementById('cat-' + id);
        if (!section) return;
        var y = section.getBoundingClientRect().top + window.pageYOffset - 92;
        window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }

    document.querySelectorAll('.bt-card [data-section]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            goTo(a.dataset.section);
        });
    });

    /* ---------------- latest insights carousel ---------------- */
    var rail = document.getElementById('bx-rail');
    if (rail && window.ADV_BLOG) {
        var latest = window.ADV_BLOG.posts().slice(0, 6);
        rail.innerHTML = latest.map(function (p) {
            var art = p.art.kind === 'icon'
                ? '<i class="' + p.art.icon + '"></i>'
                : '<img src="' + p.art.src + '" alt="" loading="lazy">';
            var photo = p.art.kind === 'photo' ? ' is-photo' : '';
            return '' +
                '<article class="bc-card">' +
                  '<a class="bc-cover bc-cover--' + p.art.tint + photo + '" href="' + p.url + '" tabindex="-1" aria-hidden="true">' +
                    art +
                  '</a>' +
                  '<div class="bc-body">' +
                    '<span class="bc-badge">' + window.ADV_BLOG.label(p.section) + '</span>' +
                    '<div class="bc-meta">' +
                      '<span><i class="fa-regular fa-calendar"></i><time datetime="' + p.date + '">' + p.dateLabel + '</time></span>' +
                      '<span class="bc-dot" aria-hidden="true">&bull;</span>' +
                      '<span><i class="fa-regular fa-clock"></i>' + p.read + ' min read</span>' +
                    '</div>' +
                    '<h3><a href="' + p.url + '">' + p.title + '</a></h3>' +
                    '<p>' + p.excerpt + '</p>' +
                    '<a class="bc-more" href="' + p.url + '">Read More <i class="fa-solid fa-arrow-right"></i></a>' +
                  '</div>' +
                '</article>';
        }).join('');

        var prev = document.getElementById('bx-prev');
        var next = document.getElementById('bx-next');

        var step = function () {
            var card = rail.querySelector('.bc-card');
            if (!card) return 320;
            var gap = parseInt(getComputedStyle(rail).columnGap || '24', 10) || 24;
            return card.getBoundingClientRect().width + gap;
        };

        var syncArrows = function () {
            prev.disabled = rail.scrollLeft < 8;
            next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
        };

        prev.addEventListener('click', function () { rail.scrollLeft -= step(); });
        next.addEventListener('click', function () { rail.scrollLeft += step(); });
        rail.addEventListener('scroll', syncArrows, { passive: true });
        window.addEventListener('resize', syncArrows);
        syncArrows();
    }

    /* ---------------- scroll reveal ---------------- */
    var reveals = document.querySelectorAll('[data-reveal]');
    if (reduce || !('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    }

    /* cards fade up the first time their section scrolls into view */
    if (!reduce && 'IntersectionObserver' in window) {
        var cardIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                cardIo.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.bs .bc-card').forEach(function (c) { cardIo.observe(c); });
    }

    /* ---------------- newsletter (front-end only) ---------------- */
    var form = document.getElementById('bw-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = document.getElementById('bw-email');
            var ok = document.getElementById('bw-ok');
            var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
            ok.textContent = valid
                ? 'Thank you — ' + input.value.trim() + ' is on the list. We will only email new articles and hospital updates.'
                : 'Please enter a valid email address.';
            ok.style.color = valid ? '#3F7A4E' : '#9E1F2B';
            ok.classList.add('is-on');
            if (valid) form.reset();
        });
    }

    /* ---------------- deep link: blogs.html?cat=pancreas ---------------- */
    var param = new URLSearchParams(window.location.search).get('cat');
    if (param && document.getElementById('cat-' + param)) {
        window.addEventListener('load', function () { goTo(param); });
    }
})();
