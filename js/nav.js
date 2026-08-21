/* Shared navbar behaviour: sticky state, dropdowns, mega menu, mobile drawer.
   Loaded by every page so the header behaves the same everywhere. */
(function () {
    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    onReady(function () {
        var navbar = document.querySelector('.navbar');
        var navLinks = document.querySelector('.nav-links');
        var mobileMenu = document.querySelector('.mobile-menu');

        // Sticky / scrolled state
        if (navbar) {
            var setScrolled = function () {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            };
            setScrolled();
            window.addEventListener('scroll', setScrolled);
        }

        // Wide enough for the bar, or narrow enough that the menu is a drawer.
        // 1360 is where style.css hides .nav-links and shows the hamburger;
        // at 992 this said "desktop" for the whole 993-1360 band, so inside
        // the drawer a tap on Related Disease followed its href instead of
        // opening the panel, and the diseases under it needed a hover.
        var isDrawer = function () { return window.matchMedia('(max-width: 1360px)').matches; };

        // Dropdowns + mega menu
        document.querySelectorAll('.dropdown > .dropbtn').forEach(function (btn) {
            /* Most of these are labels rather than links — their href is
               decorative and the click belongs to the panel, so it is pinned
               to '#'. One that opts in with data-follow-link has a page of
               its own and keeps its href: on the bar the panel opens on
               hover, which leaves the click free to navigate. In the drawer
               there is no hover, so the tap still has to open the panel or
               every row underneath becomes unreachable. */
            var follows = btn.hasAttribute('data-follow-link');
            if (!follows) btn.setAttribute('href', '#');

            btn.addEventListener('click', function (e) {
                if (follows && !isDrawer()) return;
                e.preventDefault();
                var content = this.nextElementSibling;
                var wasOpen = content.classList.contains('show');
                // Close sibling panels at the same level
                document.querySelectorAll('.dropdown-content.show').forEach(function (d) {
                    if (d !== content) {
                        d.classList.remove('show');
                        d.querySelectorAll('.dropdown-submenu-content.show')
                            .forEach(function (s) { s.classList.remove('show'); });
                    }
                });
                content.classList.toggle('show', !wasOpen);
            });
        });

        document.querySelectorAll('.dropdown-submenu > a').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                this.nextElementSibling.classList.toggle('show');
            });
        });

        // Related Disease menu. Desktop opening is pure CSS hover; the only
        // things needed here are clearing a stale .show left by a click, and
        // turning the second level into a tap accordion inside the drawer.
        document.querySelectorAll('.dropdown.advmega').forEach(function (menu) {
            menu.addEventListener('mouseleave', function () {
                if (isDrawer()) return;
                var panel = menu.querySelector('.advmega-panel');
                if (panel) panel.classList.remove('show');
            });

            menu.querySelectorAll('.advmega-item > .advmega-link').forEach(function (link) {
                link.addEventListener('click', function (e) {
                    if (!isDrawer()) return;      // desktop: follow the link
                    var item = link.parentElement;
                    var open = item.classList.contains('is-open');
                    e.preventDefault();
                    e.stopPropagation();
                    // one disease expanded at a time
                    menu.querySelectorAll('.advmega-item.is-open').forEach(function (o) {
                        if (o !== item) o.classList.remove('is-open');
                    });
                    item.classList.toggle('is-open', !open);
                });
            });
        });

        // Mobile hamburger drawer
        if (mobileMenu && navLinks) {
            var icon = mobileMenu.querySelector('i');
            var setIcon = function (open) {
                if (!icon) return;
                icon.classList.toggle('fa-bars', !open);
                icon.classList.toggle('fa-xmark', open);
            };

            mobileMenu.addEventListener('click', function (e) {
                e.stopPropagation();
                setIcon(navLinks.classList.toggle('open'));
            });

            /* The menu is a panel over the page rather than a screen of its
               own, so the page around it is still there to be tapped — and a
               tap outside a dropdown is how a dropdown is dismissed. */
            document.addEventListener('click', function (e) {
                if (!navLinks.classList.contains('open')) return;
                if (navLinks.contains(e.target) || mobileMenu.contains(e.target)) return;
                navLinks.classList.remove('open');
                setIcon(false);
            });

            document.addEventListener('keydown', function (e) {
                if (e.key !== 'Escape' || !navLinks.classList.contains('open')) return;
                navLinks.classList.remove('open');
                setIcon(false);
                mobileMenu.focus();
            });

            // Close the drawer once a real link is followed. Rows that expand
            // rather than navigate must not close it.
            navLinks.querySelectorAll('a:not(.dropbtn)').forEach(function (link) {
                link.addEventListener('click', function () {
                    if (this.closest('.dropdown-submenu') && this.nextElementSibling) return;
                    if (this.classList.contains('advmega-link') && isDrawer()) return;
                    navLinks.classList.remove('open');
                    setIcon(false);
                });
            });
        }

        // Click outside closes any open panel
        window.addEventListener('click', function (e) {
            if (!e.target.closest('.dropbtn') && !e.target.closest('.dropdown-submenu')
                && !e.target.closest('.advmega-panel')) {
                document.querySelectorAll('.dropdown-content.show, .dropdown-submenu-content.show')
                    .forEach(function (d) { d.classList.remove('show'); });
                document.querySelectorAll('.advmega-item.is-open')
                    .forEach(function (d) { d.classList.remove('is-open'); });
            }
        });

        // Let other pages deep-link to the contact modal: index.html#contactModal
        if (window.location.hash === '#contactModal') {
            if (typeof window.openContactModal === 'function') {
                window.openContactModal();
            } else {
                var modal = document.getElementById('contactModal');
                if (modal) modal.style.display = 'flex';
            }
        }
    });
})();
