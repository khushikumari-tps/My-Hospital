/* ===================================================================
   hero-motion.js — pointer parallax for the home hero.

   Publishes two custom properties on .hv-hero, --hv-px and --hv-py, a few
   pixels either way. The stylesheet decides what each layer does with them:
   the background photograph takes them negated, the portrait takes just over
   half, so the planes separate as the cursor crosses the hero without
   anything appearing to slide.

   Reads are batched into a rAF and the listener is passive, so nothing here
   touches layout on the input thread. Off entirely for a visitor who asked
   for reduced motion, and off on touch, where there is no hover to track.
   =================================================================== */
(function () {
    'use strict';

    var RANGE = 7;   // px of travel at the far edge — past this it reads as slide

    /* ---- hero copy entrance -------------------------------------------
       The copy carries .hv-anim in the markup, which is what hides it, and a
       <noscript> beside it puts it back for anyone without JavaScript —
       setting the class from here instead would show the text and then blank
       it a frame later.

       .is-in starts the sequence, once: the observer unhooks itself, so
       scrolling back to the top never replays it. */
    var copy = document.querySelector('.hv-hero-copy');

    if (copy) {
        /* When the last line has landed, both classes come off. The copy is
           then plain, fully visible markup with no animation attached to it —
           which is the honest end state, and it means nothing about how the
           hero finally looks depends on a fill mode continuing to hold. */
        var settle = function () {
            copy.classList.remove('hv-anim', 'is-in');
        };

        var start = function () {
            copy.classList.add('is-in');
            // 1.43s delay + 0.45s on the last feature point, plus a margin
            setTimeout(settle, 2200);
        };

        if (!('IntersectionObserver' in window)) {
            start();
        } else {
            var io = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (e) {
                    if (!e.isIntersecting) return;
                    obs.unobserve(e.target);
                    start();
                });
            }, { threshold: .2 });
            io.observe(copy);
        }
    }

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var hero = document.querySelector('.hv-hero');
        if (!hero) return;

        var calm = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var fine = window.matchMedia && window.matchMedia('(hover: hover)').matches;
        if (calm || !fine) return;

        var px = 0, py = 0, queued = false;

        function paint() {
            queued = false;
            hero.style.setProperty('--hv-px', px.toFixed(2) + 'px');
            hero.style.setProperty('--hv-py', py.toFixed(2) + 'px');
        }

        hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect();
            // -1 .. 1 from the centre of the hero
            px = ((e.clientX - r.left) / r.width * 2 - 1) * RANGE;
            py = ((e.clientY - r.top) / r.height * 2 - 1) * RANGE;
            if (queued) return;
            queued = true;
            requestAnimationFrame(paint);
        }, { passive: true });

        // ease back to centre rather than snapping when the cursor leaves
        hero.addEventListener('pointerleave', function () {
            px = py = 0;
            if (queued) return;
            queued = true;
            requestAnimationFrame(paint);
        }, { passive: true });
    });
})();
