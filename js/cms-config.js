/* CMS connection settings, shared by every page.
 * Change the domain or key here only; js/cms.js reads them from
 * window.ADV_CMS_CONFIG. */
window.ADV_CMS_CONFIG = {
    apiBase: "https://speedoone.com/cms-api/v1",

    // default key, used for any content type not listed in keys below
    apiKey: "so_live_c556899a87b67b8040190d3c2ffa427dddf1e64f6286b0b9",

    // a key can be scoped to a single content type in the CMS: reading any
    // other type with it answers 403. Put the type's own key here.
    //   "home-page-doctor-image": "so_live_..."
    keys: {}
};
