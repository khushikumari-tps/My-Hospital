/* Appointment and patient registration — Advitya Hospital Baruipur.
 *
 * Used on the hospital page (the form itself), and on the doctors and
 * treatment pages (for the "preferred date" pickers that hand off to it).
 *
 *  - Arriving with ?dept=, ?doctor= or ?date= in the URL, or clicking any link
 *    or date picker that carries them, fills the form in and scrolls to it.
 *  - The doctor list follows the chosen department.
 *  - A report upload is checked against the 8 MB limit before sending.
 *  - The request is posted to Netlify Forms, which files the whole enquiry —
 *    uploaded report included — and emails it to the hospital team. Where the
 *    site is not running on Netlify the post fails, and the request is handed
 *    to the visitor's mail app instead, so nothing is silently lost.
 *  - Either way the patient sees a confirmation with a reference number.
 */
(function () {
    'use strict';

    var MAX_BYTES = 8 * 1024 * 1024;
    var EMERGENCY = '+91 9211221553';
    var HOSPITAL = '+91 9211221552';

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    function todayISO() {
        var d = new Date();
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    }

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    ready(function () {
        var iso = todayISO();
        Array.prototype.forEach.call(document.querySelectorAll('input[type="date"]'), function (i) {
            if (!i.min) i.min = iso;
        });

        var form = document.getElementById('appointmentFormBaruipur');
        if (!form) return;   // the date pickers elsewhere submit normally to the hospital page

        var dept = form.querySelector('[name="department"]');
        var doctor = form.querySelector('[name="doctor"]');
        var date = form.querySelector('[name="date"]');
        var file = form.querySelector('[name="report"]');
        var hint = document.getElementById('bpDocHint');
        var err = document.getElementById('bpFormErr');

        function setSelect(sel, value) {
            if (!sel || !value) return false;
            var want = String(value).trim().toLowerCase();
            for (var i = 0; i < sel.options.length; i++) {
                if (sel.options[i].value.toLowerCase() === want) {
                    sel.selectedIndex = i;
                    return true;
                }
            }
            return false;
        }

        // Only doctors who work in the chosen department stay selectable.
        function filterDoctors() {
            if (!dept || !doctor) return;
            var d = dept.value, matches = 0;
            Array.prototype.forEach.call(doctor.options, function (o) {
                if (!o.value) return;   // "No preference" always stays
                var depts = (o.getAttribute('data-depts') || '').split('|');
                var ok = !d || depts.indexOf(d) !== -1;
                o.hidden = !ok;
                o.disabled = !ok;
                if (ok) matches++;
            });
            if (doctor.selectedOptions[0] && doctor.selectedOptions[0].disabled) doctor.value = '';
            if (hint) hint.hidden = !(d && matches === 0);
        }

        function deptFromDoctor() {
            if (!dept || !doctor || dept.value) return;
            var o = doctor.selectedOptions[0];
            var first = o && (o.getAttribute('data-depts') || '').split('|')[0];
            if (first) setSelect(dept, first);
        }

        function prefill(p, scroll) {
            if (p.dept) setSelect(dept, p.dept);
            filterDoctors();
            if (p.doctor && setSelect(doctor, p.doctor)) deptFromDoctor();
            filterDoctors();
            if (p.date && date && p.date >= iso) date.value = p.date;
            if (scroll) {
                var target = document.getElementById('appointment');
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            var first = form.querySelector('[name="name"]');
            if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 500);
        }

        if (dept) dept.addEventListener('change', filterDoctors);
        if (doctor) doctor.addEventListener('change', deptFromDoctor);

        // 1. arriving from another page with the details in the URL
        var q = new URLSearchParams(location.search);
        if (q.get('dept') || q.get('doctor') || q.get('date')) {
            prefill({ dept: q.get('dept'), doctor: q.get('doctor'), date: q.get('date') }, true);
        } else {
            filterDoctors();
        }

        // 2. links on this page that carry a department or doctor
        document.addEventListener('click', function (e) {
            var a = e.target.closest ? e.target.closest('a') : null;
            if (!a) return;
            if (a.hasAttribute('data-dept') || a.hasAttribute('data-doctor')) {
                prefill({ dept: a.getAttribute('data-dept'), doctor: a.getAttribute('data-doctor') }, false);
                return;
            }
            var href = a.getAttribute('href') || '';
            if (href.indexOf('doctor=') === -1 && href.indexOf('dept=') === -1) return;
            var url = new URL(a.href, location.href);
            if (url.pathname !== location.pathname) return;
            e.preventDefault();
            prefill({ dept: url.searchParams.get('dept'), doctor: url.searchParams.get('doctor') }, true);
        });

        // 3. a doctor's "preferred date" picker on this same page
        document.addEventListener('submit', function (e) {
            var f = e.target;
            if (!f.classList || !f.classList.contains('doc-date')) return;
            e.preventDefault();
            var fd = new FormData(f);
            prefill({ dept: fd.get('dept'), doctor: fd.get('doctor'), date: fd.get('date') }, true);
        });

        // report upload: size and type, checked before anything is sent
        if (file) {
            file.addEventListener('change', function () {
                var f = file.files && file.files[0];
                var msg = '';
                if (f && f.size > MAX_BYTES) msg = 'This file is larger than 8 MB. Please choose a smaller file, or send it on WhatsApp.';
                else if (f && !/\.(pdf|jpe?g|png)$/i.test(f.name)) msg = 'Please upload a PDF, JPG or PNG file.';
                file.setCustomValidity(msg);
                if (msg) file.reportValidity();
            });
        }

        function reference() {
            var d = new Date();
            var stamp = String(d.getFullYear()).slice(2) +
                ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
            return 'ADV-' + stamp + '-' + Math.floor(1000 + Math.random() * 9000);
        }

        function mailFallback(fd, ref) {
            var skip = { 'form-name': 1, 'bot-field': 1, report: 1, consent: 1 };
            var lines = ['Reference: ' + ref];
            fd.forEach(function (v, k) {
                if (skip[k] || typeof v !== 'string') return;
                lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + v);
            });
            var up = file && file.files && file.files[0];
            if (up) lines.push('Report selected: ' + up.name + ' (please attach it to this email)');
            lines.push('Consent to be contacted: yes');
            var url = 'mailto:info@advityahealthcares.com' +
                '?subject=' + encodeURIComponent('Baruipur appointment request ' + ref + ' - ' + (fd.get('name') || '')) +
                '&body=' + encodeURIComponent(lines.join('\n'));
            if (window.ADV_MAILTO) window.ADV_MAILTO(url);
            else window.location.href = url;
        }

        function confirmation(fd, ref, viaEmail) {
            var box = el('div', 'form-ok');
            box.setAttribute('role', 'status');
            var icon = el('i', 'fa-regular fa-circle-check');
            icon.setAttribute('aria-hidden', 'true');
            box.appendChild(icon);
            box.appendChild(el('h3', null, 'Thank you, ' + (fd.get('name') || 'we have your request') + '.'));
            box.appendChild(el('p', null, viaEmail
                ? 'Your email app has opened with your appointment request filled in. Please press Send so that it reaches the hospital.'
                : 'We have received your appointment request for Advitya Hospital Baruipur.'));
            if (viaEmail && file && file.files && file.files[0]) {
                box.appendChild(el('p', null, 'Please attach your report (' + file.files[0].name + ') to that email.'));
            }
            box.appendChild(el('span', 'ref', 'Reference: ' + ref));
            box.appendChild(el('p', null, 'The hospital team will call you on ' + (fd.get('mobile') || 'your mobile number') +
                ' to confirm your appointment. Please keep this reference number.'));
            box.appendChild(el('p', null, 'For an emergency, call ' + EMERGENCY + ' or ' + HOSPITAL + ' now.'));
            form.innerHTML = '';
            form.appendChild(box);
            box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (err) err.hidden = true;
            if (!form.reportValidity()) return;

            var ref = reference();
            var refInput = form.querySelector('[name="reference"]');
            if (refInput) refInput.value = ref;

            var btn = form.querySelector('[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Sending your request...'; }

            var fd = new FormData(form);
            fetch(form.getAttribute('action') || location.pathname, { method: 'POST', body: fd })
                .then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    confirmation(fd, ref, false);
                })
                .catch(function () {
                    mailFallback(fd, ref);
                    confirmation(fd, ref, true);
                });
        });
    });
})();
