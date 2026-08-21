/* ===================================================================
   lp-config.js — the only file a marketer has to edit.

   Two things live here: the contact points every CTA on the landing
   pages uses, and the tracking IDs. Both are read by lp.js and by the
   GTM snippet in each page's <head>.

   >>> BEFORE THE CAMPAIGNS GO LIVE <<<
   Replace GTM_ID, GA4_ID and ADS_ID below with the real containers.
   While GTM_ID is left at the placeholder the container is NOT injected,
   so the pages stay clean and nothing silently half-tracks: every event
   is still pushed to window.dataLayer, where it can be verified in the
   console with `dataLayer` before a container exists.
   =================================================================== */
window.ADV_LP_CONFIG = {

    /* ---- tracking (replace before launch) ---- */
    GTM_ID: 'GTM-XXXXXXX',          /* Google Tag Manager container      */
    GA4_ID: 'G-XXXXXXXXXX',         /* GA4 measurement ID                */
    ADS_ID: 'AW-XXXXXXXXXX',        /* Google Ads conversion ID          */
    ADS_LEAD_LABEL: 'XXXXXXXXXXXXXXXXXX',  /* conversion label for a lead */

    /* ---- appointment form delivery ----
       Empty means the enquiry is handed to the visitor's mail client,
       which is what happens today because this site has no backend.
       Put a URL here and lp.js POSTs the enquiry to it as JSON instead:

         { service, slug, name, phone, preferred_date, preferred_time,
           condition, message, consent, page_url }

       The endpoint should answer 2xx on success. Anything else, or a
       network failure, falls back to the mail route so a lead is never
       silently dropped. Validation, the dataLayer events and the
       thank-you redirect are the same on both routes. */
    formEndpoint: '',

    /* ---- contact points, matching the main site ---- */
    phone: '+919211221551',
    phoneDisplay: '+91 92112 21551',
    whatsapp: '919211221551',
    whatsappMessage: 'Hello, I would like to enquire about a surgical consultation.',
    email: 'info@advityahealthcares.com',

    /* set per page by the page itself, just before this script is used.
       pageType is 'landing_page' unless a page says otherwise; the
       thank-you page sets 'thank_you', which is what fires the booking
       conversion. */
    service: '',
    slug: '',
    pageType: 'landing_page'
};

/* -------------------------------------------------------------------
   GTM loader. Kept here rather than pasted into six pages so there is
   one place to change it, and guarded so the placeholder ID never
   reaches the network.
   ------------------------------------------------------------------- */
(function (w, d, cfg) {
    if (!cfg || !cfg.GTM_ID || cfg.GTM_ID.indexOf('XXXX') > -1) return;

    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    var f = d.getElementsByTagName('script')[0];
    var j = d.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + cfg.GTM_ID;
    f.parentNode.insertBefore(j, f);
})(window, document, window.ADV_LP_CONFIG);
