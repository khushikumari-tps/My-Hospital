/* ===================================================================
   feedback.js — the "Feedback" tab and its short form.

   Adds a tab to the right edge of the screen that opens a small dialog:
   a 1-5 rating, what the visitor wants to tell us, and an optional name
   and phone number. The feedback goes to the CRM through js/crm-lead.js
   (load crm-config.js and crm-lead.js first), tagged "Website feedback"
   with the page it came from. If the CRM is switched off or unreachable,
   the visitor is offered WhatsApp with the feedback filled in, so nothing
   they wrote is lost. The styles live in css/style.css (.fb-*).
   =================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = '919211221551';
  var PRODUCT = 'Website feedback';
  var LABELS = ['', 'Poor', 'Below average', 'Average', 'Good', 'Excellent'];

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function pageName() {
    var h1 = document.getElementById('hero-title');
    return (h1 && h1.textContent.trim()) || document.title;
  }

  function normalisePhone(value) {
    return String(value || '').replace(/[^0-9]/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  }

  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9Z"/></svg>';

  function stars() {
    var out = '';
    for (var i = 1; i <= 5; i++) {
      out += '<input type="radio" id="fb-r' + i + '" name="rating" value="' + i + '">' +
             '<label for="fb-r' + i + '" title="' + LABELS[i] + '">' + STAR +
             '<span class="fb-sr">' + i + ' out of 5 &mdash; ' + LABELS[i] + '</span></label>';
    }
    return out;
  }

  ready(function () {
    if (document.querySelector('.fb-tab')) return;

    var tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'fb-tab';
    tab.setAttribute('aria-haspopup', 'dialog');
    tab.setAttribute('aria-controls', 'fb-dialog');
    tab.textContent = 'Feedback';

    var wrap = document.createElement('div');
    wrap.className = 'fb-modal';
    wrap.id = 'fb-dialog';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'fb-title');
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="fb-card" role="document">' +
        '<button class="fb-close" type="button" aria-label="Close">&times;</button>' +
        '<div class="fb-panel">' +
          '<h2 id="fb-title">Share your feedback</h2>' +
          '<p class="fb-sub">Tell us how we did, or what we could do better. It goes straight to the Advitya team.</p>' +
          '<form class="fb-form" novalidate>' +
            '<fieldset class="fb-rate">' +
              '<legend>How would you rate your experience?</legend>' +
              '<div class="fb-stars">' + stars() + '</div>' +
              '<span class="fb-rate-label" aria-live="polite"></span>' +
            '</fieldset>' +
            '<label class="fb-field"><span>Your feedback</span>' +
              '<textarea name="message" rows="4" maxlength="1500" required placeholder="What went well, or what could be better?"></textarea></label>' +
            '<div class="fb-row">' +
              '<label class="fb-field"><span>Name <i>(optional)</i></span>' +
                '<input name="name" type="text" autocomplete="name"></label>' +
              '<label class="fb-field"><span>Phone <i>(optional)</i></span>' +
                '<input name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="14"></label>' +
            '</div>' +
            '<input class="fb-hp" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">' +
            '<label class="fb-consent"><input type="checkbox" name="callback"> ' +
              '<span>Please call me back about this. (Leave unticked if you only want to share feedback.)</span></label>' +
            '<p class="fb-error" role="alert"></p>' +
            '<button class="fb-send" type="submit">Send feedback</button>' +
          '</form>' +
        '</div>' +
        '<div class="fb-done" role="status" hidden>' +
          '<h2 class="fb-done-title">Thank you</h2>' +
          '<p class="fb-done-text"></p>' +
          '<button class="fb-send fb-finish" type="button">Close</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(tab);
    document.body.appendChild(wrap);

    var form = wrap.querySelector('.fb-form');
    var panel = wrap.querySelector('.fb-panel');
    var done = wrap.querySelector('.fb-done');
    var error = wrap.querySelector('.fb-error');
    var rateLabel = wrap.querySelector('.fb-rate-label');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      panel.hidden = false;
      done.hidden = true;
      error.textContent = '';
      wrap.hidden = false;
      document.body.classList.add('fb-open');
      var first = wrap.querySelector('.fb-stars input');
      if (first) first.focus();
    }

    function close() {
      wrap.hidden = true;
      document.body.classList.remove('fb-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    tab.addEventListener('click', open);
    wrap.querySelector('.fb-close').addEventListener('click', close);
    wrap.querySelector('.fb-finish').addEventListener('click', close);
    wrap.addEventListener('mousedown', function (e) { if (e.target === wrap) close(); });

    document.addEventListener('keydown', function (e) {
      if (wrap.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      // keep focus inside the dialog while it is open
      var f = Array.prototype.filter.call(
        wrap.querySelectorAll('button, input, textarea, a[href]'),
        function (el) { return !el.disabled && el.offsetParent !== null && el.tabIndex !== -1; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });

    form.addEventListener('change', function (e) {
      if (e.target.name === 'rating') rateLabel.textContent = LABELS[+e.target.value] || '';
    });

    function whatsappLink(p) {
      var lines = ['Website feedback — Advitya Healthcares', 'Page: ' + p.page];
      if (p.rating) lines.push('Rating: ' + p.rating + '/5 (' + LABELS[p.rating] + ')');
      lines.push('Feedback: ' + p.message);
      if (p.name) lines.push('Name: ' + p.name);
      if (p.phone) lines.push('Phone: +91 ' + p.phone);
      return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    }

    function showDone(p, sent) {
      var title = done.querySelector('.fb-done-title');
      var text = done.querySelector('.fb-done-text');
      text.textContent = '';
      if (sent) {
        title.textContent = p.name ? 'Thank you, ' + p.name + '.' : 'Thank you.';
        text.textContent = p.callback && p.phone
          ? 'We have received your feedback, and the team will call you on +91 ' + p.phone + '.'
          : 'We have received your feedback. It helps us look after the next patient better.';
      } else {
        title.textContent = 'Please send it on WhatsApp';
        text.textContent = 'We could not reach our system just now. ';
        var a = document.createElement('a');
        a.href = whatsappLink(p);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Open WhatsApp with your feedback filled in';
        text.appendChild(a);
        text.appendChild(document.createTextNode('.'));
      }
      panel.hidden = true;
      done.hidden = false;
      done.querySelector('.fb-finish').focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.website.value) return;   // filled in by a bot, not a person

      var checked = form.querySelector('input[name="rating"]:checked');
      var p = {
        page: pageName(),
        rating: checked ? +checked.value : 0,
        message: form.elements.message.value.trim(),
        name: form.elements.name.value.trim(),
        phone: normalisePhone(form.elements.phone.value),
        callback: form.elements.callback.checked
      };

      if (!p.message) {
        error.textContent = 'Please write your feedback before sending.';
        form.elements.message.focus();
        return;
      }
      if (p.phone && p.phone.length !== 10) {
        error.textContent = 'Please enter a 10-digit mobile number, or leave the phone empty.';
        form.elements.phone.focus();
        return;
      }
      if (p.callback && !p.phone) {
        error.textContent = 'Please add a phone number so we can call you back.';
        form.elements.phone.focus();
        return;
      }
      error.textContent = '';

      var send = form.querySelector('.fb-send');
      send.disabled = true;
      send.textContent = 'Sending…';

      var crm = (window.AdvCRM && window.AdvCRM.enabled())
        ? window.AdvCRM.post({
            name: p.name || 'Website visitor (feedback)',
            phone: p.phone,
            product: PRODUCT,
            title: 'Website feedback',
            lines: {
              'Page': p.page,
              'Address': location.pathname,
              'Rating': p.rating ? p.rating + '/5 (' + LABELS[p.rating] + ')' : 'Not given',
              'Feedback': p.message,
              'Call back requested': p.callback ? 'Yes' : 'No'
            }
          })
        : Promise.resolve(false);

      crm.then(function (sent) {
        send.disabled = false;
        send.textContent = 'Send feedback';
        if (sent) form.reset();
        rateLabel.textContent = '';
        showDone(p, sent);
      });
    });
  });
})();
