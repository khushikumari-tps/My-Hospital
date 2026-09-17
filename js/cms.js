/* CMS binding.
 *
 * Markup:
 *   <img src="images/default.png" data-cms-endpoint="home" data-cms-field="image.url">
 *   Optional: data-cms-index="1" (item in "data", default 0),
 *             data-cms-slug="my-entry" (item whose slug matches; wins over index),
 *             data-cms-fit="contain" (keep the default image's shape),
 *             data-cms-hide=".selector" (hide these once the CMS value is shown).
 *
 * The element keeps its current (default) content until the CMS answers.
 * The new image is preloaded first and only swapped in once it has loaded,
 * so a failed request, an empty field or a broken file leaves the default
 * image in place. Each endpoint is requested once per page, however many
 * elements bind to it.
 *
 * Other scripts can call:  AdvCMS.get("home").then(function (items) { ... })
 */
(function () {
    "use strict";

    var config = window.ADV_CMS_CONFIG || {};
    var cache = {};

    // A key may be scoped to one content type, so keys can be set per type in
    // ADV_CMS_CONFIG.keys ("home-page": "so_live_..."); apiKey is the fallback.
    function keyFor(endpoint) {
        var type = String(endpoint).replace(/^\/+/, "").split("/")[0];
        var keys = config.keys || {};
        return keys[type] || config.apiKey || "";
    }

    function buildUrl(endpoint, params) {
        var base = String(config.apiBase || "").replace(/\/+$/, "");
        var query = ["key=" + encodeURIComponent(keyFor(endpoint))];
        Object.keys(params || {}).forEach(function (name) {
            query.push(encodeURIComponent(name) + "=" + encodeURIComponent(params[name]));
        });
        return base + "/" + String(endpoint).replace(/^\/+/, "") + "?" + query.join("&");
    }

    // Resolves to the response "data" as an array ([] on any failure). A list
    // endpoint returns an array; a single-entry endpoint returns one object,
    // which is wrapped so index 0 is that entry.
    function get(endpoint, params) {
        var url = buildUrl(endpoint, params);
        if (!config.apiBase || !config.apiKey || !window.fetch) return Promise.resolve([]);
        if (!cache[url]) {
            cache[url] = fetch(url, { headers: { Accept: "application/json" } })
                .then(function (res) {
                    if (!res.ok) throw new Error("CMS " + res.status);
                    return res.json();
                })
                .then(function (json) {
                    if (!json || json.data == null) return [];
                    return Array.isArray(json.data) ? json.data : [json.data];
                })
                .catch(function (err) {
                    if (window.console) console.warn("[cms] " + endpoint + ": " + err.message);
                    return [];
                });
        }
        return cache[url];
    }

    // "image.url" -> item.image.url; undefined if any step is missing.
    function pick(obj, path) {
        return String(path).split(".").reduce(function (value, key) {
            return value == null ? undefined : value[key];
        }, obj);
    }

    function applyImage(img, src) {
        if (!src || img.getAttribute("src") === src) return;
        var probe = new Image();
        probe.onload = function () {
            // opt-in (data-cms-fit="contain"): keep the default image's shape
            // so a CMS image with different proportions cannot push the layout
            // around. Without it the page CSS (e.g. object-fit: cover) applies.
            if (img.getAttribute("data-cms-fit") === "contain" && img.naturalWidth && img.naturalHeight) {
                img.style.aspectRatio = img.naturalWidth + " / " + img.naturalHeight;
                img.style.objectFit = "contain";
            }
            img.src = src;
            img.removeAttribute("srcset");
            img.setAttribute("data-cms-bound", "true");
        };
        probe.src = src;
    }

    function bind() {
        var nodes = document.querySelectorAll("[data-cms-endpoint][data-cms-field]");
        Array.prototype.forEach.call(nodes, function (el) {
            var index = parseInt(el.getAttribute("data-cms-index") || "0", 10) || 0;
            var slug = el.getAttribute("data-cms-slug");
            get(el.getAttribute("data-cms-endpoint")).then(function (items) {
                // data-cms-slug picks the entry by slug; otherwise by position
                var item = slug
                    ? items.filter(function (it) { return it && it.slug === slug; })[0]
                    : items[index];
                var value = pick(item, el.getAttribute("data-cms-field"));
                if (typeof value !== "string" || !value.trim()) return;
                if (el.tagName === "IMG") applyImage(el, value.trim());
                else el.textContent = value.trim();
                // data-cms-hide: selector of elements the CMS value replaces
                var hide = el.getAttribute("data-cms-hide");
                if (hide) {
                    Array.prototype.forEach.call(document.querySelectorAll(hide), function (node) {
                        // inline display beats page CSS such as display:inline-block,
                        // which would otherwise override the hidden attribute
                        node.hidden = true;
                        node.style.display = "none";
                    });
                }
            });
        });
    }

    window.AdvCMS = { get: get, url: buildUrl, bind: bind };

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
    else bind();
})();
