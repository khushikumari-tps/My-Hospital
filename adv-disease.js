/* Behaviour for the Advitya disease pages: scroll reveal, stat counters and
   the FAQ accordion. Deliberately small — no library, no layout thrash. */
(function () {
    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    onReady(function () {

        /* ---------------- scroll reveal ---------------- */
        var reveals = document.querySelectorAll('.adv-reveal');

        if (reduced || !('IntersectionObserver' in window)) {
            reveals.forEach(function (el) { el.classList.add('is-in'); });
        } else {
            var revealObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    // stagger siblings so a row of cards arrives in sequence
                    var delay = parseInt(entry.target.dataset.advDelay || '0', 10);
                    setTimeout(function () { entry.target.classList.add('is-in'); }, delay);
                    obs.unobserve(entry.target);
                });
            }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

            reveals.forEach(function (el) { revealObserver.observe(el); });
        }

        /* ---------------- stat counters ---------------- */
        var stats = document.querySelectorAll('[data-adv-count]');

        function runCount(el) {
            var target = parseFloat(el.dataset.advCount);
            var suffix = el.dataset.advSuffix || '';
            if (reduced) {
                el.textContent = target + suffix;
                return;
            }
            var duration = 1400;
            var start = null;

            function tick(now) {
                if (start === null) start = now;
                var p = Math.min((now - start) / duration, 1);
                // ease-out so the number settles rather than stopping dead
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        if (!('IntersectionObserver' in window)) {
            stats.forEach(runCount);
        } else {
            var countObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    runCount(entry.target);
                    obs.unobserve(entry.target);
                });
            }, { threshold: 0.5 });

            stats.forEach(function (el) { countObserver.observe(el); });
        }

        /* ---------------- FAQ accordion ---------------- */
        document.querySelectorAll('.adv-faq').forEach(function (faq) {
            faq.querySelectorAll('.adv-faq-q').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var item = btn.closest('.adv-faq-item');
                    var isOpen = item.classList.contains('is-open');

                    // one answer open at a time keeps the section scannable
                    faq.querySelectorAll('.adv-faq-item.is-open').forEach(function (other) {
                        if (other !== item) {
                            other.classList.remove('is-open');
                            other.querySelector('.adv-faq-q').setAttribute('aria-expanded', 'false');
                        }
                    });

                    item.classList.toggle('is-open', !isOpen);
                    btn.setAttribute('aria-expanded', String(!isOpen));
                });
            });
        });
    });
})();
