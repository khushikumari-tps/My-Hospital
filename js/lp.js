/* ===================================================================
   lp.js — behaviour for the Google Ads surgical landing pages.

   Four jobs, in order of how much the page depends on them:

     1. Conversion tracking. Every CTA on these pages is a Google Ads
        conversion, so the click has to reach the dataLayer before the
        browser leaves for the dialler or WhatsApp.
     2. The appointment form. There is no backend on this site, so the
        request is handed to the visitor's mail client (the same route
        the main site's contact modal takes) and the page then moves to
        /thank-you, which is what Ads counts.
     3. Scroll reveal. Applied from script, never from the stylesheet, so
        a failed script leaves the content visible rather than blank.
     4. Scroll depth, for the 25/50/75/100 events the brief asks for.

   Tracking IDs live in lp-config.js so a marketer can change them
   without touching this file.
   =================================================================== */
(function () {
    'use strict';

    var CFG = window.ADV_LP_CONFIG || {};

    window.dataLayer = window.dataLayer || [];

    /* ------------------------------------------------------------------
       Events

       push() is fire-and-forget: GTM may not be present at all (it is not
       loaded until a container ID is filled in), and nothing on the page
       may wait on it. Navigation is never delayed for a beacon — the
       dataLayer push is synchronous, so by the time the browser starts
       unloading, GTM has already had the event.
       ------------------------------------------------------------------ */
    function push(name, params) {
        var payload = { event: name };
        if (params) {
            for (var k in params) {
                if (Object.prototype.hasOwnProperty.call(params, k)) payload[k] = params[k];
            }
        }
        payload.page_service = CFG.service || document.title;
        try {
            window.dataLayer.push(payload);
        } catch (e) {
            /* tracking must never break the page */
        }
        /* gtag is only called when the page actually has it; the brief's
           GA4 events are the same names, so one push serves both when GTM
           forwards them. */
        if (typeof window.gtag === 'function') {
            try {
                window.gtag('event', name, payload);
            } catch (e) { }
        }
    }

    window.ADV_LP_TRACK = push;

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    onReady(function () {

        push('page_view', { page_type: CFG.pageType || 'landing_page' });

        /* The thank-you page is what Google Ads counts as the primary
           conversion, so it announces itself rather than looking like one
           more landing-page view. This is the only event on the page that
           means "a request was completed" - appointment_request means the
           visitor moved towards the form, which is a different thing, and
           mapping both to the same Ads conversion would double-count. */
        if (CFG.pageType === 'thank_you') {
            var confirmed = new URLSearchParams(window.location.search);
            push('appointment_booking', {
                form_id: 'appointment',
                service_slug: confirmed.get('service') || ''
            });
        }

        /* --------------------------------------------------------------
           CTA clicks. One delegated listener rather than a listener per
           button, so buttons added to the markup later are covered too.
           -------------------------------------------------------------- */
        document.addEventListener('click', function (e) {
            var link = e.target.closest ? e.target.closest('a[href]') : null;
            if (!link) return;

            var href = link.getAttribute('href') || '';
            var where = link.getAttribute('data-cta') || 'body';

            if (href.indexOf('tel:') === 0) {
                push('phone_click', { cta_location: where, phone: href.replace('tel:', '') });
            } else if (href.indexOf('wa.me') > -1 || href.indexOf('whatsapp') > -1) {
                push('whatsapp_click', { cta_location: where });
            } else if (href.indexOf('#appointment') > -1) {
                push('appointment_request', { cta_location: where, step: 'scroll_to_form' });
            }
        }, true);

        /* --------------------------------------------------------------
           Appointment form
           -------------------------------------------------------------- */
        var form = document.getElementById('lpAppointmentForm');
        if (form) {
            var started = false;

            /* ----------------------------------------------------------
               Validation

               The form carries novalidate so the messages are ours rather
               than the browser default ones, which means the check has to
               be run by hand on submit. Nothing is sent until it passes.
               ---------------------------------------------------------- */
            function clearError(field) {
                field.removeAttribute('aria-invalid');
                var holder = field.closest('.lp-field') || field.closest('.lp-consent');
                if (!holder) return;
                var msg = holder.querySelector('.lp-err');
                if (msg) msg.remove();
                field.removeAttribute('aria-describedby');
            }

            function showError(field, text) {
                field.setAttribute('aria-invalid', 'true');
                var holder = field.closest('.lp-field') || field.closest('.lp-consent');
                if (!holder) return;
                var msg = holder.querySelector('.lp-err');
                if (!msg) {
                    msg = document.createElement('p');
                    msg.className = 'lp-err';
                    msg.id = 'err-' + (field.id || field.name || 'field');
                    holder.appendChild(msg);
                }
                msg.textContent = text;
                field.setAttribute('aria-describedby', msg.id);
            }

            function messageFor(field) {
                if (field.validity.valueMissing) {
                    return field.type === 'checkbox'
                        ? 'Please confirm we may contact you about this enquiry.'
                        : 'This field is needed so the team can reach you.';
                }
                if (field.validity.patternMismatch || field.validity.typeMismatch) {
                    return field.name === 'phone'
                        ? 'Enter a phone number we can call you back on.'
                        : 'Please check this entry.';
                }
                return field.validationMessage || 'Please check this entry.';
            }

            function validate() {
                var fields = form.querySelectorAll('input, select, textarea');
                var first = null;
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    clearError(f);
                    if (f.checkValidity()) continue;
                    showError(f, messageFor(f));
                    if (!first) first = f;
                }
                if (first) {
                    first.focus();
                    push('form_error', { form_id: 'appointment', field: first.name || first.id });
                }
                return !first;
            }

            form.addEventListener('input', function (e) {
                if (e.target && e.target.getAttribute('aria-invalid') === 'true') clearError(e.target);
                if (started) return;
                started = true;
                push('form_start', { form_id: 'appointment' });
            });

            var dateField = form.querySelector('input[type="date"]');
            if (dateField) dateField.min = new Date().toISOString().split('T')[0];

            /* ----------------------------------------------------------
               Delivery

               Two routes, chosen at submit time:

                 - CFG.formEndpoint set   -> POST the enquiry as JSON.
                 - CFG.formEndpoint empty -> hand the enquiry to the mail
                   client, which is all this site can do while it has no
                   backend of its own.

               Either way the visitor ends on thank-you, because that is
               the page Google Ads counts as the conversion. Connecting a
               real endpoint is one line in lp-config.js; the validation,
               the events and the thank-you step are untouched by it.
               ---------------------------------------------------------- */
            function payload(data) {
                return {
                    service: CFG.service || document.title,
                    slug: CFG.slug || '',
                    name: data.get('name') || '',
                    phone: data.get('phone') || '',
                    preferred_date: data.get('date') || '',
                    preferred_time: data.get('time') || '',
                    condition: data.get('condition') || '',
                    message: data.get('message') || '',
                    consent: !!data.get('consent'),
                    page_url: window.location.href
                };
            }

            function mailBody(p) {
                return [
                    'Surgical consultation request',
                    '',
                    'Service: ' + p.service,
                    'Name: ' + p.name,
                    'Phone: ' + p.phone,
                    'Preferred date: ' + (p.preferred_date || 'Not specified'),
                    'Preferred time: ' + (p.preferred_time || 'Not specified'),
                    'Surgery / condition: ' + p.condition,
                    '',
                    'Message:',
                    p.message
                ].join('\n');
            }

            function toThankYou() {
                window.location.href = 'thank-you.html?service='
                    + encodeURIComponent(CFG.slug || '');
            }

            function sendByMail(p) {
                var url = 'mailto:' + (CFG.email || 'info@advityahealthcares.com')
                    + '?subject=' + encodeURIComponent('Consultation request - ' + p.service)
                    + '&body=' + encodeURIComponent(mailBody(p));

                /* mail-link.js is loaded alongside this file: it tries the
                   mail client and offers webmail if nothing answers, so a
                   visitor without a mail app still gets somewhere. */
                if (typeof window.ADV_MAILTO === 'function') {
                    window.ADV_MAILTO(url);
                } else {
                    window.location.href = url;
                }

                /* The delay lets the mail handler fire before the page
                   navigates away; the visitor reaches thank-you whether or
                   not a mail client actually opened. */
                window.setTimeout(toThankYou, 900);
            }

            function sendToEndpoint(p, button) {
                if (button) {
                    button.disabled = true;
                    button.setAttribute('aria-busy', 'true');
                }

                window.fetch(CFG.formEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(p)
                }).then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    toThankYou();
                }).catch(function (err) {
                    /* A lead is worth more than a tidy failure: if the
                       endpoint is down the enquiry still goes out by mail
                       rather than being dropped. */
                    push('form_endpoint_error', {
                        form_id: 'appointment',
                        error: String((err && err.message) || err)
                    });
                    if (button) {
                        button.disabled = false;
                        button.removeAttribute('aria-busy');
                    }
                    sendByMail(p);
                });
            }

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                if (!validate()) return;

                var data = payload(new FormData(form));
                var usingEndpoint = !!(CFG.formEndpoint && CFG.formEndpoint.length);
                var method = usingEndpoint ? 'endpoint' : 'email';

                push('generate_lead', { form_id: 'appointment', method: method });
                push('form_submit', { form_id: 'appointment', method: method });

                if (usingEndpoint) {
                    sendToEndpoint(data, form.querySelector('button[type="submit"]'));
                } else {
                    sendByMail(data);
                }
            });
        }

        /* --------------------------------------------------------------
           Map. The embed is built on request rather than on load, so a
           third-party frame never delays the first paint.
           -------------------------------------------------------------- */
        document.querySelectorAll('[data-map-load]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var box = btn.closest('.lp-map');
                if (!box) return;
                var query = box.getAttribute('data-map-query') || '';

                var frame = document.createElement('iframe');
                frame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
                frame.title = 'Map of ' + query;
                frame.loading = 'lazy';
                frame.referrerPolicy = 'no-referrer-when-downgrade';
                frame.setAttribute('allowfullscreen', '');

                var face = box.querySelector('.lp-map-face');
                if (face) face.remove();
                box.appendChild(frame);

                push('map_open', { venue: query });
            });
        });

        /* --------------------------------------------------------------
           Scroll reveal
           -------------------------------------------------------------- */
        var targets = document.querySelectorAll('[data-reveal]');
        if (targets.length) {
            if ('IntersectionObserver' in window) {
                targets.forEach(function (el) { el.classList.add('lp-reveal'); });

                var io = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        var el = entry.target;
                        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
                        window.setTimeout(function () { el.classList.add('is-in'); }, delay);
                        io.unobserve(el);
                    });
                }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

                targets.forEach(function (el) { io.observe(el); });

                /* Failsafe. Everything below the fold is hidden until the
                   observer says otherwise, so anything that stops the
                   observer firing — a bfcache restore, an odd embed, a
                   browser quirk — would leave a paid landing page blank.
                   After three seconds the page shows itself regardless. */
                window.setTimeout(function () {
                    targets.forEach(function (el) { el.classList.add('is-in'); });
                }, 3000);
            }
            /* No IntersectionObserver: .lp-reveal is never added, so the
               content renders in its final state. */
        }

        /* --------------------------------------------------------------
           Scroll depth: 25 / 50 / 75 / 100, once each
           -------------------------------------------------------------- */
        var marks = [25, 50, 75, 100];
        var seen = {};
        var ticking = false;

        function depth() {
            var doc = document.documentElement;
            var scrollable = doc.scrollHeight - window.innerHeight;
            if (scrollable <= 0) return;
            var pct = Math.round((window.scrollY / scrollable) * 100);

            marks.forEach(function (m) {
                if (pct >= m && !seen[m]) {
                    seen[m] = true;
                    push('scroll_depth', { percent_scrolled: m });
                }
            });
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(depth);
        }, { passive: true });

        /* --------------------------------------------------------------
           FAQ: <details> handles the open/close itself; this is only here
           so the marketing team can see which questions get opened.
           -------------------------------------------------------------- */
        document.querySelectorAll('.lp-faq details').forEach(function (d) {
            d.addEventListener('toggle', function () {
                if (!d.open) return;
                var q = d.querySelector('summary');
                push('faq_open', { question: q ? q.textContent.trim().slice(0, 90) : '' });
            });
        });
    });
})();
