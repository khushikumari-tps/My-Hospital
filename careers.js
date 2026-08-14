/* ===================================================================
   Careers page: department filter, role accordion, scroll reveal.
   The roles are server-rendered, so every job stays readable and
   crawlable with JavaScript disabled — this only shows and hides.
   =================================================================== */
(function () {
    'use strict';

    var list = document.getElementById('cr-job-list');
    if (!list) return;

    var jobs = Array.prototype.slice.call(list.querySelectorAll('.cr-job'));
    var pills = Array.prototype.slice.call(document.querySelectorAll('.cr-pill'));
    var count = document.getElementById('cr-count');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var empty = document.createElement('p');
    empty.className = 'cr-empty';
    empty.hidden = true;
    empty.textContent = 'No openings in this department right now — send your CV and we will keep it on file.';
    list.appendChild(empty);

    /* ---------------- filter ---------------- */
    function apply(dept) {
        var shown = 0;
        jobs.forEach(function (job) {
            var on = dept === 'all' || job.dataset.dept === dept;
            job.hidden = !on;
            job.style.display = on ? '' : 'none';
            if (on) shown++;
        });

        empty.hidden = shown > 0;

        var label = pills.filter(function (p) { return p.dataset.dept === dept; })[0];
        count.innerHTML = shown
            ? 'Showing <strong>' + shown + '</strong> role' + (shown === 1 ? '' : 's') +
              (dept === 'all' ? '' : ' in <strong>' + label.textContent.trim() + '</strong>')
            : 'No roles in this department';

        pills.forEach(function (p) {
            p.classList.toggle('is-active', p.dataset.dept === dept);
        });
    }

    pills.forEach(function (p) {
        p.addEventListener('click', function () { apply(p.dataset.dept); });
    });

    /* ---------------- accordion ---------------- */
    jobs.forEach(function (job) {
        var head = job.querySelector('.cr-job-head');
        var panel = job.querySelector('.cr-job-panel');
        if (!head || !panel) return;

        head.addEventListener('click', function () {
            var open = job.classList.toggle('is-open');
            head.setAttribute('aria-expanded', open ? 'true' : 'false');
            panel.hidden = !open;
            if (open && !reduce) {
                var y = job.getBoundingClientRect().top + window.pageYOffset - 110;
                if (y < window.pageYOffset) window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    /* open the role named in the address bar: careers.html#staff-nurse-gi-hpb-surgery */
    var hash = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hash) {
        var target = document.getElementById(hash);
        if (target && target.classList.contains('cr-job')) {
            target.querySelector('.cr-job-head').click();
        }
    }

    /* ---------------- copy the HR address ----------------
       mailto: does nothing on a machine with no mail client, so the address
       is also plain text with a copy button beside it. */
    document.querySelectorAll('.cr-copy').forEach(function (btn) {
        var label = btn.querySelector('span');
        var original = label ? label.textContent : '';
        btn.addEventListener('click', function () {
            var value = btn.dataset.copy || '';
            var done = function (ok) {
                if (!label) return;
                label.textContent = ok ? 'Copied' : value;
                btn.classList.toggle('is-done', ok);
                setTimeout(function () {
                    label.textContent = original;
                    btn.classList.remove('is-done');
                }, 2200);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(value).then(function () { done(true); },
                                                          function () { done(false); });
            } else {
                done(false);
            }
        });
    });

    /* ---------------- scroll reveal ---------------- */
    var reveals = document.querySelectorAll('[data-reveal]');
    if (reduce || !('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    }

    apply('all');
})();
