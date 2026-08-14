/* ===================================================================
   Article page upgrades, applied to every post that uses .ar-body:
     reading progress bar · meta strip · 70/30 layout with a sticky
     sidebar (table of contents, share, related, appointment CTA) ·
     medical disclaimer · "You May Also Like" row.
   Reads blog-data.js for titles, dates and related-article matching,
   so the article HTML itself never has to be hand-maintained.
   =================================================================== */
(function () {
    'use strict';

    var body = document.querySelector('.ar-body');
    var wrap = body && body.querySelector('.ar-wrap');
    if (!wrap || !window.ADV_BLOG) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var file = (window.location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    var post = window.ADV_BLOG.bySlug(file);
    var catLabel = post ? window.ADV_BLOG.label(post.primary) : 'Health Library';
    var pageTitle = post ? post.title : document.title.split('|')[0].trim();
    var shareUrl = window.location.href.split('#')[0];

    /* ------------------- 1. reading progress bar ------------------- */
    var prog = document.createElement('div');
    prog.className = 'ax-progress';
    prog.innerHTML = '<span></span>';
    prog.setAttribute('aria-hidden', 'true');
    document.body.appendChild(prog);
    var progFill = prog.firstChild;

    /* ------------------- 2. 70/30 layout ------------------- */
    var layout = document.createElement('div');
    layout.className = 'ax-layout';
    var main = document.createElement('div');
    main.className = 'ax-main';
    while (wrap.firstChild) main.appendChild(wrap.firstChild);
    var side = document.createElement('aside');
    side.className = 'ax-side';
    side.setAttribute('aria-label', 'Article tools');
    layout.appendChild(main);
    layout.appendChild(side);
    wrap.appendChild(layout);
    wrap.classList.add('is-wide');

    /* the back-link belongs under the whole layout, not inside the column */
    var back = main.querySelector('.ar-back');

    /* ------------------- 3. meta strip ------------------- */
    var meta = document.createElement('div');
    meta.className = 'ax-meta';
    meta.innerHTML =
        '<nav class="ax-crumbs" aria-label="Breadcrumb">' +
            '<a href="index.html">Home</a><span aria-hidden="true">/</span>' +
            '<a href="blogs.html">Blog</a><span aria-hidden="true">/</span>' +
            '<a href="blogs.html?cat=' + (post ? post.primary : 'all') + '">' + catLabel + '</a>' +
            '<span aria-hidden="true">/</span><span aria-current="page">' + pageTitle + '</span>' +
        '</nav>' +
        '<div class="ax-meta-row">' +
            '<span class="ax-badge">' + catLabel + '</span>' +
            (post ? '<span><i class="fa-regular fa-calendar"></i> Published: <time datetime="' + post.date + '">' + post.dateLabel + '</time></span>' : '') +
            (post ? '<span><i class="fa-regular fa-clock"></i> Reading time: ' + post.read + ' min</span>' : '') +
            '<span><i class="fa-solid fa-user-doctor"></i> Advitya Clinical Team</span>' +
        '</div>';
    main.insertBefore(meta, main.firstChild);

    /* ------------------- 4. table of contents ------------------- */
    /* any depth: a few imported articles wrap their headings in a div.
       Some posts were written entirely in h3 — fall back to those so every
       article still gets numbered sections and a contents list. */
    var heads = Array.prototype.slice.call(main.querySelectorAll('.ar-sec h2'));
    if (heads.length < 2) {
        var h3s = Array.prototype.slice.call(main.querySelectorAll('.ar-sec h3'));
        if (h3s.length > heads.length) heads = h3s;
    }
    heads.forEach(function (h, i) {
        if (!h.id) {
            h.id = (h.textContent || 'section').toLowerCase()
                .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || ('section-' + i);
        }
    });

    var blocks = [];

    if (heads.length > 2) {
        blocks.push(
            '<nav class="ax-card ax-toc" aria-label="Table of contents">' +
                '<h2 class="ax-card-title">Table of Contents</h2>' +
                '<ol>' + heads.map(function (h) {
                    return '<li><a href="#' + h.id + '">' + h.textContent.trim() + '</a></li>';
                }).join('') + '</ol>' +
            '</nav>'
        );
    }

    /* ------------------- 5. share ------------------- */
    var enc = encodeURIComponent;
    blocks.push(
        '<div class="ax-card ax-share">' +
            '<h2 class="ax-card-title">Share Article</h2>' +
            '<div class="ax-share-row">' +
                '<a class="ax-sbtn is-li" target="_blank" rel="noopener" aria-label="Share on LinkedIn" ' +
                    'href="https://www.linkedin.com/sharing/share-offsite/?url=' + enc(shareUrl) + '"><i class="fa-brands fa-linkedin-in"></i></a>' +
                '<a class="ax-sbtn is-fb" target="_blank" rel="noopener" aria-label="Share on Facebook" ' +
                    'href="https://www.facebook.com/sharer/sharer.php?u=' + enc(shareUrl) + '"><i class="fa-brands fa-facebook-f"></i></a>' +
                '<a class="ax-sbtn is-wa" target="_blank" rel="noopener" aria-label="Share on WhatsApp" ' +
                    'href="https://wa.me/?text=' + enc(pageTitle + ' — ' + shareUrl) + '"><i class="fa-brands fa-whatsapp"></i></a>' +
                '<button class="ax-sbtn is-cp" type="button" aria-label="Copy link"><i class="fa-solid fa-link"></i></button>' +
            '</div>' +
            '<p class="ax-copied" role="status"></p>' +
        '</div>'
    );

    /* ------------------- 6. related (sidebar) ------------------- */
    var related = window.ADV_BLOG.related(file, 3);
    if (related.length) {
        blocks.push(
            '<div class="ax-card ax-rel">' +
                '<h2 class="ax-card-title">Related Articles</h2>' +
                related.map(function (p) {
                    return '<a class="ax-rel-item" href="' + p.url + '">' +
                        '<span class="ax-rel-art ax-rel--' + p.art.tint + (p.art.kind === 'photo' ? ' is-photo' : '') + '">' +
                            (p.art.kind === 'icon'
                                ? '<i class="' + p.art.icon + '"></i>'
                                : '<img src="' + p.art.src + '" alt="" loading="lazy">') +
                        '</span>' +
                        '<span class="ax-rel-txt">' +
                            '<strong>' + p.title + '</strong>' +
                            '<span>' + p.dateLabel + ' &middot; ' + p.read + ' min read</span>' +
                        '</span>' +
                    '</a>';
                }).join('') +
            '</div>'
        );
    }

    /* ------------------- 7. appointment CTA ------------------- */
    blocks.push(
        '<div class="ax-card ax-cta">' +
            '<h2 class="ax-card-title">Book an Appointment</h2>' +
            '<p>Talk to a GI, HPB or surgical oncology specialist about your reports and symptoms.</p>' +
            '<a class="ax-cta-btn" href="index.html#contactModal"><i class="fa-regular fa-calendar-check"></i> Book a Consultation</a>' +
            '<a class="ax-cta-alt" href="https://wa.me/919211221551" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp us</a>' +
        '</div>'
    );

    side.innerHTML = '<div class="ax-side-inner">' + blocks.join('') + '</div>';

    /* ------------------- 8. disclaimer ------------------- */
    var disc = document.createElement('aside');
    disc.className = 'ax-disclaimer';
    disc.innerHTML =
        '<i class="fa-solid fa-circle-info" aria-hidden="true"></i>' +
        '<p><strong>Medical disclaimer.</strong> This blog is intended for general health education and awareness ' +
        'only. It does not replace professional medical advice, diagnosis or treatment. Please consult a qualified ' +
        'healthcare professional for individual medical concerns.</p>';
    main.appendChild(disc);

    /* ------------------- 9. you may also like ------------------- */
    if (related.length) {
        var alsoWrap = document.createElement('section');
        alsoWrap.className = 'ax-also';
        alsoWrap.innerHTML =
            '<div class="ax-also-inner">' +
                '<h2>You May Also Like</h2>' +
                '<p>More from ' + catLabel + ' and closely related topics.</p>' +
                '<div class="ax-also-grid">' +
                related.map(function (p) {
                    return '<article class="ax-also-card">' +
                        '<a class="ax-also-art ax-rel--' + p.art.tint + (p.art.kind === 'photo' ? ' is-photo' : '') +
                            '" href="' + p.url + '" tabindex="-1" aria-hidden="true">' +
                            (p.art.kind === 'icon'
                                ? '<i class="' + p.art.icon + '"></i>'
                                : '<img src="' + p.art.src + '" alt="" loading="lazy">') +
                        '</a>' +
                        '<div class="ax-also-body">' +
                            '<div class="ax-also-meta"><time datetime="' + p.date + '">' + p.dateLabel + '</time>' +
                                '<span aria-hidden="true">&bull;</span>' + p.read + ' min read</div>' +
                            '<h3><a href="' + p.url + '">' + p.title + '</a></h3>' +
                            '<p>' + p.excerpt + '</p>' +
                            '<span class="ax-also-more">Read More <i class="fa-solid fa-arrow-right"></i></span>' +
                        '</div>' +
                    '</article>';
                }).join('') +
                '</div>' +
            '</div>';
        body.parentNode.insertBefore(alsoWrap, body.nextSibling);
    }

    /* back-link sits below the two columns */
    if (back) { wrap.appendChild(back); }

    /* ------------------- behaviour ------------------- */
    var copyBtn = side.querySelector('.ax-sbtn.is-cp');
    var copied = side.querySelector('.ax-copied');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var done = function (ok) {
                copied.textContent = ok ? 'Link copied to clipboard' : shareUrl;
                copied.classList.add('is-on');
                setTimeout(function () { copied.classList.remove('is-on'); }, 2600);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareUrl).then(function () { done(true); }, function () { done(false); });
            } else {
                done(false);
            }
        });
    }

    var links = Array.prototype.slice.call(side.querySelectorAll('.ax-toc a'));

    function onScroll() {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progFill.style.width = (h > 0 ? Math.min(100, Math.max(0, (window.pageYOffset / h) * 100)) : 0) + '%';

        if (!links.length) return;
        var current = heads[0];
        heads.forEach(function (head) {
            if (head.getBoundingClientRect().top <= 140) current = head;
        });
        links.forEach(function (a) {
            a.classList.toggle('is-current', a.getAttribute('href') === '#' + current.id);
        });
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () { onScroll(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    /* the layout rewrite moves every [data-aos] node, so AOS must re-measure */
    if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        window.AOS.refreshHard();
    }

    /* reveal for the injected blocks */
    if (!reduce && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.ax-also-card, .ax-disclaimer').forEach(function (el) {
            el.classList.add('ax-reveal');
            io.observe(el);
        });
    }
})();
