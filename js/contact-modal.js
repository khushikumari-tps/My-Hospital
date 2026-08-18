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
        '          <div><h4>WhatsApp</h4><p><a href="https://wa.me/919211221551">+91 9211221551</a></p></div>' +
        '        </div>' +
        '        <div class="cm-row">' +
        '          <div class="cm-icon"><i class="fa-solid fa-envelope"></i></div>' +
        '          <div><h4>Email</h4><p><a href="mailto:info@advityahealthcares.com">info@advityahealthcares.com</a></p></div>' +
        '        </div>' +
        '        <div class="cm-row">' +
        '          <div class="cm-icon"><i class="fa-solid fa-location-dot"></i></div>' +
        '          <div><h4>Centres</h4><p>Ranchi &middot; Khunti &middot; Kolkata<br>' +
        '            <a href="index.html#location">See all locations</a></p></div>' +
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
        '          <div class="form-group"><select name="service" required>' +
        '            <option value="" disabled selected>Service</option>' +
        '            <option>Gastroenterology</option>' +
        '            <option>Pancreatic Disorders</option>' +
        '            <option>Liver Care</option>' +
        '            <option>Endoscopy / ERCP / EUS</option>' +
        '            <option>GI Surgery</option>' +
        '            <option>Colonoscopy</option>' +
        '            <option>Nutrition &amp; Dietetics</option>' +
        '            <option>Preventive Health Checkup</option>' +
        '            <option>Second Opinion on Reports</option>' +
        '          </select></div>' +
        '          <div class="form-group"><select name="centre" required>' +
        '            <option value="" disabled selected>Preferred Centre</option>' +
        '            <option>Care Clinic, Morabadi &mdash; Ranchi</option>' +
        '            <option>Jeevah Healthcares, Bariatu Road &mdash; Ranchi</option>' +
        '            <option>Synergy Global Hospital &mdash; Ranchi</option>' +
        '            <option>Rane Hospital &mdash; Khunti</option>' +
        '            <option>Kolkata</option>' +
        '          </select></div>' +
        '        </div>' +
        '        <div class="form-group">' +
        '          <label class="form-label" for="apptDate">Preferred date</label>' +
        '          <input type="date" id="apptDate" name="date" required>' +
        '        </div>' +
        '        <div class="form-group"><textarea name="message" placeholder="Your message or symptoms..." required></textarea></div>' +
        '        <button type="submit" class="btn-gradient">Send Request</button>' +
        '        <p class="form-note">Not for emergencies. If this is urgent, call <a href="tel:+919211221551">+91 9211221551</a> now.</p>' +
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
