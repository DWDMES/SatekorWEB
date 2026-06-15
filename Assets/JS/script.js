
document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidad del Menú Hamburguesa (Móvil) ---
    const menuToggle = document.getElementById('menu-toggle'); // Botón hamburguesa
    const mainNav = document.getElementById('main-nav');       // Panel de navegación
    const body = document.body;                             // Body del documento

    // Verifica que los elementos del menú principal existan
    if (menuToggle && mainNav) {

        // Listener para el clic en el BOTÓN HAMBURGUESA
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el clic se propague
            toggleMenu();
        });

        // --- Listener DELEGADO para clics DENTRO de mainNav ---
        mainNav.addEventListener('click', (event) => {
            const clickedElement = event.target;
            const clickedLink = clickedElement.closest('a');

            if (!clickedLink) {
                return;
            }

            const isMobile = window.innerWidth < 768;
            const parentLi = clickedLink.parentElement;
            const isSubmenuToggle = parentLi && parentLi.classList.contains('has-dropdown') && clickedLink === parentLi.firstElementChild;

            // CASO 1: Clic en el enlace padre de un submenú EN MÓVIL
            if (isMobile && isSubmenuToggle) {
                event.preventDefault();
                parentLi.classList.toggle('submenu-open');
                const isSubmenuExpanded = parentLi.classList.contains('submenu-open');
                clickedLink.setAttribute('aria-expanded', isSubmenuExpanded);
            }
            // CASO 2: Clic en cualquier otro enlace DENTRO del menú
            else {
                if (mainNav.classList.contains('active') && clickedLink.getAttribute('href').startsWith('#')) {
                    closeMenu();
                }
                else if (mainNav.classList.contains('active')) {
                    // Opcionalmente, cerrar el menú aquí si se prefiere cerrar antes de navegar
                    // closeMenu();
                }
            }
        });
        // --- FIN Listener DELEGADO ---


        // Listener para cerrar el menú al hacer clic FUERA
        document.addEventListener('click', (event) => {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (mainNav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
                closeMenu();
            }
        });

        // Listener para cerrar el menú con la tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Función para alternar el estado del menú (abrir/cerrar)
    function toggleMenu() {
        const isActive = mainNav.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Función para ABRIR el menú móvil
    function openMenu() {
        if (!mainNav || !menuToggle || !body) {
            return;
        }
        menuToggle.classList.add('active');
        mainNav.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('no-scroll');
    }

    // Función para CERRAR el menú móvil
    function closeMenu() {
        if (!mainNav || !menuToggle || !body || !mainNav.classList.contains('active')) {
            return;
        }
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll');

        // Cierra cualquier submenú abierto
        const openSubmenus = mainNav.querySelectorAll('.has-dropdown.submenu-open');
        openSubmenus.forEach(submenu => {
            submenu.classList.remove('submenu-open');
            const toggleLink = submenu.querySelector('a');
            if (toggleLink) {
                toggleLink.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Actualizar Año en el Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    // --- Resaltar la Página Actual en la Navegación ---
    const currentPath = window.location.pathname.replace(/index\.html$/, '');
    document.querySelectorAll('.main-nav a[href]').forEach(link => {
        if (link.getAttribute('href').startsWith('#') || link.hash) {
            return; // Ignora enlaces a secciones (#servicios, #faq...)
        }
        const linkPath = new URL(link.href, window.location.href).pathname.replace(/index\.html$/, '');
        if (linkPath === currentPath) {
            link.setAttribute('aria-current', 'page');
            // Si es un enlace del submenú, marca también "Servicios"
            const dropdown = link.closest('.has-dropdown');
            if (dropdown) {
                dropdown.classList.add('current-section');
            }
        }
    });


    // --- Consentimiento de Cookies y Carga Condicional de Google Analytics ---
    // RGPD: Google Analytics solo se carga si el usuario acepta las cookies.
    const GA_MEASUREMENT_ID = 'G-NY4Y6RT0TB';

    function loadGoogleAnalytics() {
        if (window.gaLoaded) {
            return;
        }
        window.gaLoaded = true;

        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, { 'anonymize_ip': true });
    }

    // Lectura/escritura segura: localStorage puede lanzar excepción en file://,
    // en modo privado o con el almacenamiento bloqueado. Si falla, el banner debe
    // seguir funcionando (cerrarse al pulsar), aunque la elección no se recuerde.
    function getConsent() {
        try { return localStorage.getItem('cookiesAccepted'); }
        catch (e) { return null; }
    }
    function setConsent(value) {
        try { localStorage.setItem('cookiesAccepted', value); }
        catch (e) { /* almacenamiento no disponible */ }
    }

    const cookieConsent = getConsent();

    // Si ya aceptó en una visita anterior, carga GA directamente
    if (cookieConsent === 'true') {
        loadGoogleAnalytics();
    }

    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Muestra el banner solo si aún no ha elegido (ni aceptar ni rechazar)
        if (cookieConsent === null) {
            // Pequeño timeout para animación suave
            setTimeout(() => {
                cookieBanner.hidden = false;
            }, 500);
        }

        function hideCookieBanner() {
            cookieBanner.style.opacity = '0';
            cookieBanner.style.transform = 'translateY(100%)';
            setTimeout(() => {
                cookieBanner.hidden = true;
            }, 500); // Espera a que termine la transición CSS si hubiera
        }

        acceptCookiesBtn.addEventListener('click', () => {
            hideCookieBanner();   // cerrar siempre primero, aunque falle el almacenamiento
            setConsent('true');
            loadGoogleAnalytics();
        });

        if (rejectCookiesBtn) {
            rejectCookiesBtn.addEventListener('click', () => {
                hideCookieBanner();
                setConsent('false');
            });
        }
    }

    // --- Lógica del Botón "Volver Arriba" ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (scrollToTopBtn) {
        // Mostrar/Ocultar al hacer scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // Acción al hacer click
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Accesibilidad: devolver el foco al inicio
            document.body.focus();
        });
    }


    // --- VISUAL POLISH: Scroll Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15, // Trigger when 15% visible
            rootMargin: "0px 0px -50px 0px" // Offset slightly
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }


    // --- Tarjetas dinámicas en táctil (sustituto del hover) ---
    // En dispositivos sin ratón, cada tarjeta se "enciende" al pasar por el centro
    // de la pantalla mientras haces scroll, replicando el efecto hover de escritorio.
    const noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (noHover && !reduceMotion && 'IntersectionObserver' in window) {
        const cards = document.querySelectorAll('.service-card, .feature-card, .benefit-item, .blog-post-card');
        if (cards.length > 0) {
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Solo cuenta la franja central de la pantalla (rootMargin)
                    entry.target.classList.toggle('touch-active', entry.isIntersecting);
                });
            }, {
                root: null,
                threshold: 0,
                rootMargin: '-45% 0px -45% 0px' // banda estrecha en el centro vertical
            });
            cards.forEach(card => cardObserver.observe(card));
        }
    }


    // --- Medición de Conversiones (eventos GA4; solo si hay consentimiento) ---
    // gtag solo existe si el usuario aceptó cookies (ver carga condicional arriba).
    function trackEvent(name, params) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, params || {});
        }
    }

    // Clics en WhatsApp
    document.querySelectorAll('a.whatsapp-btn, a[href*="wa.me"]').forEach(el => {
        el.addEventListener('click', () => trackEvent('contacto_whatsapp', { method: 'whatsapp' }));
    });

    // Clics en teléfono
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.addEventListener('click', () => trackEvent('contacto_telefono', { method: 'telefono' }));
    });

    // Clics en email
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        el.addEventListener('click', () => trackEvent('contacto_email', { method: 'email' }));
    });

    // Envío del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => trackEvent('envio_formulario', { form: 'contacto' }));
    }

    // Clic en CTAs principales (botones primarios hacia contacto)
    document.querySelectorAll('a.btn-primary[href*="contacto"]').forEach(el => {
        el.addEventListener('click', () => trackEvent('clic_cta_contacto', { cta: el.textContent.trim().slice(0, 50) }));
    });

}); // Fin de DOMContentLoaded
