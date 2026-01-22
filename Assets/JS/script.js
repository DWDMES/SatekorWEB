
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


    // --- Lógica del Banner de Cookies ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Verifica si ya se aceptaron las cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            // Muestra el banner (quita el atributo hidden)
            // Pequeño timeout para animación suave
            setTimeout(() => {
                cookieBanner.hidden = false;
            }, 500);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            // Oculta con animación si es posible, o simplemente hidden = true
            cookieBanner.style.opacity = '0';
            cookieBanner.style.transform = 'translateY(100%)';
            setTimeout(() => {
                cookieBanner.hidden = true;
            }, 500); // Espera a que termine la transición CSS si hubiera
        });
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

}); // Fin de DOMContentLoaded
