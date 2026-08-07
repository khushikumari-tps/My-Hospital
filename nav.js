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

        // Dropdowns + mega menu
        document.querySelectorAll('.dropdown > .dropbtn').forEach(function (btn) {
            btn.setAttribute('href', '#');
            btn.addEventListener('click', function (e) {
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

            // Close the drawer once a real link is followed
            navLinks.querySelectorAll('a:not(.dropbtn)').forEach(function (link) {
                link.addEventListener('click', function () {
                    if (this.closest('.dropdown-submenu') && this.nextElementSibling) return;
                    navLinks.classList.remove('open');
                    setIcon(false);
                });
            });
        }

        // Click outside closes any open panel
        window.addEventListener('click', function (e) {
            if (!e.target.closest('.dropbtn') && !e.target.closest('.dropdown-submenu')) {
                document.querySelectorAll('.dropdown-content.show, .dropdown-submenu-content.show')
                    .forEach(function (d) { d.classList.remove('show'); });
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
