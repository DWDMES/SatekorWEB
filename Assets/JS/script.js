
document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidad del Menú Hamburguesa (Móvil) ---
    const menuToggle = document.getElementById('menu-toggle'); // Botón hamburguesa
    const mainNav = document.getElementById('main-nav');       // Panel de navegación
    const body = document.body;                             // Body del documento

    // DEP DEBUG: Verificar selección de elementos
    console.log('Menu Toggle:', menuToggle);
    console.log('Main Nav:', mainNav);

    // Verifica que los elementos del menú principal existan
    if (menuToggle && mainNav) {
        console.log('Menu elements found, attaching listeners...'); // DEP DEBUG

        // Listener para el clic en el BOTÓN HAMBURGUESA
        menuToggle.addEventListener('click', (event) => {
            console.log('Menu toggle CLICKED'); // DEP DEBUG
            event.stopPropagation(); // Evita que el clic se propague
            toggleMenu();
        });

        // --- Listener DELEGADO para clics DENTRO de mainNav ---
        mainNav.addEventListener('click', (event) => {
            console.log('Click inside mainNav detected'); // DEP DEBUG
            const clickedElement = event.target;
            const clickedLink = clickedElement.closest('a');

            if (!clickedLink) {
                console.log('Click inside mainNav was not on a link.'); // DEP DEBUG
                return;
            }
             console.log('Clicked link:', clickedLink.href); // DEP DEBUG

            const isMobile = window.innerWidth < 768;
            const parentLi = clickedLink.parentElement;
            const isSubmenuToggle = parentLi && parentLi.classList.contains('has-dropdown') && clickedLink === parentLi.firstElementChild;

            console.log(`isMobile: ${isMobile}, isSubmenuToggle: ${isSubmenuToggle}`); // DEP DEBUG

            // CASO 1: Clic en el enlace padre de un submenú EN MÓVIL
            if (isMobile && isSubmenuToggle) {
                console.log('Handling mobile submenu toggle click'); // DEP DEBUG
                event.preventDefault();
                parentLi.classList.toggle('submenu-open');
                const isSubmenuExpanded = parentLi.classList.contains('submenu-open');
                clickedLink.setAttribute('aria-expanded', isSubmenuExpanded);
            }
            // CASO 2: Clic en cualquier otro enlace DENTRO del menú
            else {
                console.log('Handling other link click or desktop submenu click'); // DEP DEBUG
                if (mainNav.classList.contains('active') && clickedLink.getAttribute('href').startsWith('#')) {
                     console.log('Internal anchor link clicked, closing menu.'); // DEP DEBUG
                    closeMenu();
                }
                 else if (mainNav.classList.contains('active')) {
                    // console.log('Normal link clicked while menu open, allowing navigation.'); // DEP DEBUG
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
                 console.log('Click outside detected, closing menu.'); // DEP DEBUG
                closeMenu();
            }
        });

        // Listener para cerrar el menú con la tecla Escape
         document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mainNav.classList.contains('active')) {
                 console.log('Escape key pressed, closing menu.'); // DEP DEBUG
                closeMenu();
            }
        });
    } else {
         console.error('Error: Menu toggle button or main nav panel not found!'); // DEP DEBUG
    }

    // Función para alternar el estado del menú (abrir/cerrar)
    function toggleMenu() {
        console.log('toggleMenu called'); // DEP DEBUG
        const isActive = mainNav.classList.contains('active');
        console.log('Menu currently active:', isActive); // DEP DEBUG
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Función para ABRIR el menú móvil
    function openMenu() {
        console.log('openMenu called'); // DEP DEBUG
        if (!mainNav || !menuToggle || !body) {
             console.error("Cannot open menu - elements missing"); return; // DEP DEBUG
        }
        menuToggle.classList.add('active');
        mainNav.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('no-scroll');
        console.log('Menu opened, classes applied.'); // DEP DEBUG
    }

    // Función para CERRAR el menú móvil
    function closeMenu() {
        console.log('closeMenu called'); // DEP DEBUG
         if (!mainNav || !menuToggle || !body || !mainNav.classList.contains('active')) {
             console.warn("Cannot close menu - elements missing or menu not active"); // DEP DEBUG
             return;
         }
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll');
         console.log('Menu closed, classes removed.'); // DEP DEBUG

        // Cierra cualquier submenú abierto
        const openSubmenus = mainNav.querySelectorAll('.has-dropdown.submenu-open');
        openSubmenus.forEach(submenu => {
            submenu.classList.remove('submenu-open');
            const toggleLink = submenu.querySelector('a');
            if (toggleLink) {
                toggleLink.setAttribute('aria-expanded', 'false');
            }
             console.log('Closed open submenu:', submenu); // DEP DEBUG
        });
    }

    // --- Actualizar Año en el Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn('Year span not found in footer.'); // DEP DEBUG
    }

}); // Fin de DOMContentLoaded
