/* ===================================================================
   lp-config.js — the only file a marketer has to edit.

   Two things live here: the contact points every CTA on the landing
   pages uses, and the tracking IDs, kept for reference.

   >>> GOOGLE TAG MANAGER <<<
   The container, GTM-WGHV76PH, is installed by Google's snippet at the
   top of every page's <head>, with its noscript fallback after <body>.
   Nothing reads GTM_ID below, so changing it does not change the
   container: edit the snippet on each page instead. GA4 and Google Ads
   tags belong inside the container. lp.js pushes every CTA, form and
   scroll event to window.dataLayer, where GTM picks them up and where
   they can be checked in the console with `dataLayer`.
   =================================================================== */
window.ADV_LP_CONFIG = {

    /* ---- tracking ---- */
    GTM_ID: 'GTM-WGHV76PH',         /* Google Tag Manager container      */
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

    /* ---- contact points: the landing pages' own lines, 1553 for calls,
       WhatsApp and emergencies and 1552 as the second line. The main
       site keeps +91 92112 21551. ---- */
    phone: '+919211221553',
    phoneDisplay: '+91 92112 21553',
    whatsapp: '919211221553',
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
