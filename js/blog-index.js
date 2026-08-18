/* ===================================================================
   blog-index.js — renders the editorial blog index from blog-data.js.

   blog-data.js is the single source of truth for every article on the
   site, so nothing here is hard-coded: add an entry there and the post
   appears on this page, in the article pages' "related" strip, and in the
   sitemap, with its existing URL untouched.
   =================================================================== */
(function () {
    'use strict';

    var PER_PAGE = 6;

    /* The pills the page offers, mapped onto the category ids the data
       actually carries. Adding one is a single row here. */
    var FILTERS = [
        { id: 'all', label: 'All' },
        { id: 'surgery', label: 'General Surgery' },
        { id: 'pancreas', label: 'Pancreas' },
        { id: 'gallbladder', label: 'Gallbladder' },
        { id: 'biliary-disease', label: 'Biliary Disease' },
        { id: 'gi-health', label: 'Patient Education' },
        { id: 'healthcare-updates', label: 'Healthcare Updates' }
    ];

    var CAT_LABEL = {
        'cancer': 'Cancer Care',
        'surgery': 'General Surgery',
        'gi-health': 'Patient Education',
        'pancreas': 'Pancreas',
        'gallbladder': 'Gallbladder',
        'biliary-disease': 'Biliary Disease',
        'liver': 'Liver Care',
        'diet': 'Diet & Nutrition',
        'patient-stories': 'Patient Stories',
        'healthcare-updates': 'Healthcare Updates'
    };

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

    function label(id) {
        return CAT_LABEL[id] || String(id || '').replace(/-/g, ' ');
    }

    /* --i is the element's rung on the reveal ladder: image, title,
       description, metadata, Read More. The stylesheet turns it into a
       transition-delay, so the parts of an article arrive in reading order. */
    function cardHTML(p) {
        var art = p.art || {};
        var cat = label(p.primary || (p.cats && p.cats[0]));

        return '' +
            '<a class="ob-post" href="' + esc(p.url) + '">' +
            '  <div class="ob-media' + (art.kind !== 'photo' ? ' is-art' : '') +
            '" style="--i:0;--ob-bg:url(&quot;' + esc(art.src) + '&quot;)">' +
            '    <img src="' + esc(art.src) + '" alt="' + esc(art.alt || p.title) + '" loading="lazy">' +
            '  </div>' +
            '  <div class="ob-body">' +
            '    <h2 style="--i:1"><span class="ob-t">' + esc(p.title) + '</span></h2>' +
            '    <p class="ob-excerpt" style="--i:2">' + esc(p.excerpt) + '</p>' +
            '    <div class="ob-meta" style="--i:3">' +
            '      <span class="ob-date">' + esc(p.dateLabel) + '</span>' +
            '      <span class="ob-dot" aria-hidden="true"></span>' +
            '      <span class="ob-cat">' + esc(cat) + '</span>' +
            '    </div>' +
            '    <span class="ob-more" style="--i:4"><span>Read More</span>' +
            '      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>' +
            '  </div>' +
            '</a>';
    }

    var CALM = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Reveal on entry, then stop watching — an article that has arrived stays
       arrived, however many times the reader scrolls back past it. Entries
       that cross together share one ladder, so the first screenful staggers
       on load while a single article scrolled into view arrives at once. */
    function makeRevealer() {
        if (CALM || !('IntersectionObserver' in window)) {
            return { watch: function (el) { el.classList.add('is-in'); } };
        }

        var io = new IntersectionObserver(function (entries, obs) {
            var rung = 0;
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                e.target.style.setProperty('--s', (Math.min(rung, 4) * 100) + 'ms');
                e.target.classList.add('is-in');
                rung++;
                obs.unobserve(e.target);
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });

        var watched = [];

        /* Safety net: content starts at opacity 0, so anything that is on
           screen but somehow never got an entry must not stay invisible. */
        window.addEventListener('load', function () {
            watched.forEach(function (el) {
                if (el.classList.contains('is-in')) return;
                var r = el.getBoundingClientRect();
                if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
            });
        });

        return {
            watch: function (el) {
                watched.push(el);
                io.observe(el);
            }
        };
    }

    /* Hairline fill on the right edge. Reads scroll position inside a rAF so
       the listener itself never touches layout on the scroll thread. */
    function readingProgress() {
        var rail = document.querySelector('.ob-progress');
        if (!rail || CALM) return;
        var fill = rail.querySelector('span');
        var queued = false;

        function draw() {
            queued = false;
            var doc = document.documentElement;
            var span = doc.scrollHeight - window.innerHeight;
            var pct = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
            fill.style.transform = 'scaleY(' + pct.toFixed(4) + ')';
            rail.classList.toggle('is-on', window.scrollY > 260);
        }

        window.addEventListener('scroll', function () {
            if (queued) return;
            queued = true;
            requestAnimationFrame(draw);
        }, { passive: true });

        window.addEventListener('resize', draw, { passive: true });
        draw();
    }

    ready(function () {
        var list = document.getElementById('ob-list');
        var bar = document.getElementById('ob-filters');
        var foot = document.getElementById('ob-foot');
        if (!list || !window.ADV_POSTS) return;

        var reveal = makeRevealer();

        // newest first, whatever order the data file happens to be in
        var all = window.ADV_POSTS.slice().sort(function (a, b) {
            return (b.date || '').localeCompare(a.date || '');
        });

        var active = 'all';
        var page = 1;
        var matches = all;

        function inCat(p, id) {
            if (id === 'all') return true;
            if (p.primary === id) return true;
            return !!(p.cats && p.cats.indexOf(id) !== -1);
        }

        /* A run of five numbers that slides with the current page, with the
           first and last always reachable. On page one that reads
           "1 2 3 4 5 … 8", which is the shape the brief asked for. */
        function pageNumbers(total, current) {
            var span = 5;
            var start = Math.max(1, Math.min(current - 2, total - span + 1));
            var end = Math.min(total, start + span - 1);
            var out = [];

            if (start > 1) {
                out.push(1);
                if (start > 2) out.push('...');
            }
            for (var n = start; n <= end; n++) out.push(n);
            if (end < total) {
                if (end < total - 1) out.push('...');
                out.push(total);
            }
            return out;
        }

        function paintPager(total) {
            if (total <= 1) {
                foot.innerHTML = matches.length
                    ? '<p class="ob-count">' + matches.length + ' article' +
                      (matches.length === 1 ? '' : 's') + '</p>'
                    : '';
                return;
            }

            var first = (page - 1) * PER_PAGE + 1;
            var last = Math.min(page * PER_PAGE, matches.length);

            var html = '<p class="ob-count">Showing ' + first + '–' + last +
                ' of ' + matches.length + ' articles</p><div class="ob-pager">' +
                '<button class="ob-page ob-step ob-prev" type="button" data-go="' + (page - 1) +
                '"' + (page === 1 ? ' disabled' : '') +
                '><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Prev</button>';

            pageNumbers(total, page).forEach(function (n) {
                html += n === '...'
                    ? '<span class="ob-gap">…</span>'
                    : '<button class="ob-page' + (n === page ? ' is-on' : '') +
                      '" type="button" data-go="' + n + '"' +
                      (n === page ? ' aria-current="page"' : '') + '>' + n + '</button>';
            });

            html += '<button class="ob-page ob-step" type="button" data-go="' + (page + 1) +
                '"' + (page === total ? ' disabled' : '') +
                '>Next<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div>';

            foot.innerHTML = html;
        }

        function paint(resetPage) {
            if (resetPage) {
                page = 1;
                matches = all.filter(function (p) { return inCat(p, active); });
            }

            if (!matches.length) {
                list.innerHTML = '<p class="ob-empty">No articles in this category yet — ' +
                    'try <strong>All</strong>.</p>';
                foot.innerHTML = '';
                return;
            }

            var total = Math.ceil(matches.length / PER_PAGE);
            page = Math.min(Math.max(page, 1), total);

            list.innerHTML = matches
                .slice((page - 1) * PER_PAGE, page * PER_PAGE)
                .map(cardHTML)
                .join('');

            list.querySelectorAll('.ob-post').forEach(reveal.watch);
            paintPager(total);
            reveal.watch(foot);
        }

        // pills
        bar.innerHTML = FILTERS.map(function (f) {
            return '<button class="ob-pill' + (f.id === 'all' ? ' is-on' : '') +
                '" type="button" data-cat="' + f.id + '">' + esc(f.label) + '</button>';
        }).join('');

        bar.addEventListener('click', function (e) {
            var btn = e.target.closest('.ob-pill');
            if (!btn || btn.dataset.cat === active) return;
            active = btn.dataset.cat;
            bar.querySelectorAll('.ob-pill').forEach(function (b) {
                b.classList.toggle('is-on', b === btn);
            });
            paint(true);
        });

        foot.addEventListener('click', function (e) {
            var btn = e.target.closest('.ob-page');
            if (!btn || btn.disabled) return;
            var go = parseInt(btn.dataset.go, 10);
            if (!go || go === page) return;
            page = go;
            paint(false);
            // start the new page at the first article, not wherever the pager sat
            list.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        paint(true);

        // release the masthead a frame later, so the transition actually runs
        requestAnimationFrame(function () {
            document.body.classList.add('ob-ready');
        });

        readingProgress();
    });
})();
