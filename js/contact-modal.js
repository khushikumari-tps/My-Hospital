/* Shared contact / appointment modal.
 *
 * The modal markup used to live only in index.html, so every other page linked
 * to index.html#contactModal — which meant "Book Appointment" navigated home
 * before the form appeared. This script gives every page its own copy of the
 * modal and opens it in place, so the visitor never leaves the page they were
 * reading. index.html already ships the markup and its own open/close helpers,
 * so there the injection is skipped and only the link interception applies.
 */
(function () {
    'use strict';

    var MARKUP = '' +
        '<div id="contactModal" class="modal">' +
        '  <div class="modal-content contact-modal">' +
        '    <span class="contact-modal-close" role="button" tabindex="0" aria-label="Close">&times;</span>' +
        '    <div class="contact-modal-left">' +
        '      <div>' +
        '        <h2>Contact Us</h2>' +
        '        <p class="cm-intro">We\'re here to help &mdash; appointments, second opinions, or questions about a report. Outstation patients: send your scans before you travel.</p>' +
        '        <div class="cm-row">' +
        '          <div class="cm-icon"><i class="fa-solid fa-phone"></i></div>' +
        '          <div><h4>Call Us</h4><p>' +
        '            <a href="tel:+919211221551">+91 9211221551</a> / <a href="tel:+919211221552">9211221552</a><br>' +
        '            <a href="tel:+919211221553">+91 9211221553</a> / <a href="tel:+919211221554">9211221554</a>' +
        '          </p></div>' +
        '        </div>' +
        '        <div class="cm-row">' +
        '          <div class="cm-icon"><i class="fa-brands fa-whatsapp"></i></div>' +
        '          <div><h4>WhatsApp</h4><p><a href="https://wa.me/919211221551" target="_blank" rel="noopener noreferrer">+91 9211221551</a></p></div>' +
        '        </div>' +
        '        <div class="cm-row">' +
        '          <div class="cm-icon"><i class="fa-solid fa-envelope"></i></div>' +
        '          <div><h4>Email</h4><p><a href="mailto:info@advityahealthcares.com">info@advityahealthcares.com</a></p></div>' +
        '        </div>' +
        '        <div class="cm-row">' +
        '          <div class="cm-icon"><i class="fa-solid fa-location-dot"></i></div>' +
        '          <div><h4>Our centres</h4><p>' +
        '            <b>Advitya Hospital Baruipur</b><br>Kulpi Road, Puratan Bazar, Subuddhipur,<br>Baruipur, West Bengal &ndash; 700144<br>' +
        '            <b>Kolkata OPD</b> &mdash; Rajdanga Main Road<br>' +
        '            Alliance centres: Ranchi &middot; Khunti<br>' +
        '            <a href="our-network.html">See the full network</a></p></div>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '    <div class="contact-modal-right">' +
        '      <h3>Book an Appointment</h3>' +
        '      <form class="premium-form" id="appointmentForm">' +
        '        <div class="form-row">' +
        '          <div class="form-group"><input type="text" name="name" placeholder="Full Name" required></div>' +
        '          <div class="form-group"><input type="tel" name="phone" placeholder="Phone Number" required pattern="[0-9+ ()-]{7,}"></div>' +
        '        </div>' +
        '        <div class="form-group"><input type="email" name="email" placeholder="Email Address" required></div>' +
        '        <div class="form-row">' +
        '          <div class="form-group"><select name="service" required aria-label="Department or service">' +
        '            <option value="" disabled selected>Service</option>' +
        '            <option>Surgical Gastroenterology</option>' +
        '            <option>GI, Liver and Pancreatic Surgery</option>' +
        '            <option>GI Cancer Surgery</option>' +
        '            <option>General and Laparoscopic Surgery</option>' +
        '            <option>Urology and Andrology</option>' +
        '            <option>Trauma Surgery and Critical Care</option>' +
        '            <option>Preventive Health Check-up</option>' +
        '            <option>Second Opinion on Reports</option>' +
        '          </select></div>' +
        '          <div class="form-group"><select name="centre" required aria-label="Preferred centre">' +
        '            <option value="" disabled selected>Preferred Centre</option>' +
        '            <option>Advitya Hospital Baruipur</option>' +
        '            <option>Advitya Kolkata OPD &mdash; Rajdanga Main Road</option>' +
        '            <option>Care Clinic, Morabadi &mdash; Ranchi</option>' +
        '            <option>Jeevah Healthcares, Bariatu Road &mdash; Ranchi</option>' +
        '            <option>Synergy Global Hospital &mdash; Ranchi</option>' +
        '            <option>Rane Hospital &mdash; Khunti</option>' +
        '          </select></div>' +
        '        </div>' +
        '        <div class="form-group">' +
        '          <label class="form-label" for="apptDate">Preferred date</label>' +
        '          <input type="date" id="apptDate" name="date" required>' +
        '        </div>' +
        '        <div class="form-group"><textarea name="message" placeholder="Your message or symptoms..." required></textarea></div>' +
        '        <button type="submit" class="btn-gradient">Send Request</button>' +
        '        <p class="form-note">Not for emergencies. If this is urgent, call <a href="tel:+919211221553">+91 9211221553</a> now.</p>' +
        '      </form>' +
        '    </div>' +
        '  </div>' +
        '</div>';

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var injected = false;
        var modal = document.getElementById('contactModal');

        if (!modal) {
            var host = document.createElement('div');
            host.innerHTML = MARKUP;
            modal = host.firstChild;
            document.body.appendChild(modal);
            injected = true;
        }

        // index.html defines these itself; only fill the gap on other pages.
        if (typeof window.openContactModal !== 'function') {
            window.openContactModal = function () {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            };
        }
        if (typeof window.closeContactModal !== 'function') {
            window.closeContactModal = function () {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            };
        }

        // The floating WhatsApp disc is painted at z-index 9999 against the
        // modal's 2000, so it lands on top of the appointment form. Watching
        // the dialog's own style attribute, rather than hooking the open and
        // close helpers, keeps `body.modal-open` correct on index.html too,
        // where that pair is defined in the page instead of here.
        var syncOpenState = function () {
            var open = window.getComputedStyle(modal).display !== 'none';
            document.body.classList.toggle('modal-open', open);
        };
        syncOpenState();
        new MutationObserver(syncOpenState)
            .observe(modal, { attributes: true, attributeFilter: ['style', 'class'] });

        // Any link that pointed at the modal now opens it where the visitor is
        // standing instead of navigating to the home page first.
        document.addEventListener('click', function (e) {
            var link = e.target.closest ? e.target.closest('a[href*="#contactModal"]') : null;
            if (!link) return;
            e.preventDefault();
            window.openContactModal();
        });

        // Close plumbing only for the copy this script created — index.html
        // already wires its own, and doubling up would toggle twice.
        if (!injected) return;

        modal.querySelector('.contact-modal-close')
            .addEventListener('click', function () { window.closeContactModal(); });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) window.closeContactModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') window.closeContactModal();
        });

        // No backend on this site, so the request is handed to the visitor's
        // mail client — same behaviour as the home page form.
        var form = modal.querySelector('#appointmentForm');
        if (!form) return;

        var date = form.querySelector('input[type="date"]');
        if (date) date.min = new Date().toISOString().split('T')[0];

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var f = new FormData(form);
            var body = [
                'Name: ' + f.get('name'),
                'Phone: ' + f.get('phone'),
                'Email: ' + f.get('email'),
                'Service: ' + f.get('service'),
                'Preferred centre: ' + f.get('centre'),
                'Preferred date: ' + f.get('date'),
                '',
                'Message:',
                f.get('message')
            ].join('\n');

            var url = 'mailto:info@advityahealthcares.com'
                + '?subject=' + encodeURIComponent('Appointment request - ' + f.get('name'))
                + '&body=' + encodeURIComponent(body);

            // goes through mail-link.js so a visitor with no mail app still
            // gets somewhere to send it, rather than nothing happening
            if (window.ADV_MAILTO) window.ADV_MAILTO(url);
            else window.location.href = url;

            form.innerHTML = '' +
                '<div class="form-sent">' +
                '  <i class="fa-regular fa-circle-check"></i>' +
                '  <h4>Your email is ready to send</h4>' +
                '  <p>We\'ve opened your mail app with the request filled in &mdash; press send and we\'ll reply within one working day.<br>Prefer to talk? Call <a href="tel:+919211221551">+91 9211221551</a>.</p>' +
                '</div>';
        });
    });
})();

/* Sticky mobile contact bar: Call, WhatsApp and Appointment, always within
 * thumb reach on a phone. Styled in css/responsive.css (hidden above 768px).
 * The campaign landing pages already carry their own sticky bar, so this one
 * steps aside wherever .lp-sticky exists. Numbers are the hospital's
 * verified lines. */
(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    ready(function () {
        if (document.querySelector('.lp-sticky, .adv-mbar')) return;

        // pages under diseases/ link their stylesheets as ../../css/..., so
        // the same prefix gets the booking link to the right place
        var brand = document.querySelector('link[href*="css/brand.css"]');
        var base = brand ? brand.getAttribute('href').split('css/brand.css')[0] : '';
        var appt = document.getElementById('appointmentFormBaruipur')
            ? '#appointment'
            : base + 'advitya-hospital-baruipur.html#appointment';

        var bar = document.createElement('nav');
        bar.className = 'adv-mbar';
        bar.setAttribute('aria-label', 'Quick contact');
        bar.innerHTML =
            '<a class="adv-mbar-call" href="tel:+919211221552">' +
                '<i class="fa-solid fa-phone" aria-hidden="true"></i><span>Call</span></a>' +
            '<a class="adv-mbar-wa" href="https://wa.me/919211221552" target="_blank" rel="noopener noreferrer">' +
                '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>WhatsApp</span></a>' +
            '<a class="adv-mbar-appt" href="' + appt + '">' +
                '<i class="fa-regular fa-calendar-check" aria-hidden="true"></i><span>Appointment</span></a>';
        document.body.appendChild(bar);
        document.body.classList.add('has-mbar');
    });
})();

/* Floating emergency call disc, styled like the WhatsApp disc and stacked
 * above it when the page carries one. Number: hospital emergency line. */
(function () {
    "use strict";

    function ready(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }

    ready(function () {
        if (document.querySelector(".adv-emg")) return;
        var a = document.createElement("a");
        a.className = "adv-emg";
        a.href = "tel:+919211221553";
        a.setAttribute("aria-label", "Emergency call +91 9211221553");
        a.innerHTML =
            "<i class=\"fa-solid fa-phone-volume\" aria-hidden=\"true\"></i>" +
            "<span class=\"adv-emg-tip\" aria-hidden=\"true\">Emergency 24&times;7<b>+91 9211221553</b></span>";
        if (document.querySelector(".hv-wa, .wa-fab, a[href*=\"wa.me\"][style*=\"position: fixed\"]")) {
            a.classList.add("has-wa");
        }
        document.body.appendChild(a);
    });
})();
