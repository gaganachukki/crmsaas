document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            const icon = header.querySelector('i');
            
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBody = otherItem.querySelector('.accordion-body');
                    if (otherBody) otherBody.style.display = 'none';
                    const otherIcon = otherItem.querySelector('.accordion-header i');
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up', 'fa-minus');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                }
            });

            // Toggle current
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                if (body) body.style.display = 'none';
                if (icon) {
                    icon.classList.remove('fa-chevron-up', 'fa-minus');
                    icon.classList.add('fa-chevron-down');
                }
            } else {
                item.classList.add('active');
                if (body) body.style.display = 'block';
                if (icon) {
                    icon.classList.remove('fa-chevron-down', 'fa-plus');
                    icon.classList.add('fa-chevron-up');
                }
            }
        });
    });

    // Pricing Toggle
    const toggleInput = document.getElementById('billing-toggle');
    const amounts = document.querySelectorAll('.amount');
    
    if(toggleInput) {
        toggleInput.addEventListener('change', (e) => {
            if (e.target.checked) {
                // Annually
                amounts[0].innerText = '290';
                amounts[1].innerText = '990';
                amounts[2].innerText = '2990';
                document.querySelectorAll('.period').forEach(p => p.innerText = '/yr');
            } else {
                // Monthly
                amounts[0].innerText = '29';
                amounts[1].innerText = '99';
                amounts[2].innerText = '299';
                document.querySelectorAll('.period').forEach(p => p.innerText = '/mo');
            }
        });
    }

    // Tabs Interaction
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            tabItems.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileNavToggle && navLinks) {
        const iconMenu = mobileNavToggle.querySelector('.icon-menu');
        const iconClose = mobileNavToggle.querySelector('.icon-close');
        const icon = mobileNavToggle.querySelector('i');

        const updateIcons = (isActive) => {
            if (iconMenu && iconClose) {
                iconMenu.style.display = isActive ? 'none' : 'block';
                iconClose.style.display = isActive ? 'block' : 'none';
            }
            if (icon) {
                if (isActive) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        };

        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            mobileNavToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.classList.toggle('nav-open', isActive);
            updateIcons(isActive);
        });

        // Close on clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
                updateIcons(false);
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                    updateIcons(false);
                }
            }
        });

        // Auto close if resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
                updateIcons(false);
            }
        });
    }

    /* ==========================================================================
       Hero Section Typewriter Animation
       ========================================================================== */
    function initHeroTypewriter() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const targets = Array.from(new Set(document.querySelectorAll(
            '.typewriter-hero, .hero-content h1, .about-hero h1, .pricing-title, .blog-header-text h1, .contact-heading h1'
        )));

        if (!targets.length) return;

        targets.forEach(heading => {
            if (heading.dataset.typewriterInit === 'true') return;
            heading.dataset.typewriterInit = 'true';

            heading.classList.add('typewriter-hero');

            const fullAccessibleText = heading.textContent.trim().replace(/\s+/g, ' ');
            heading.setAttribute('aria-label', fullAccessibleText);

            const tokens = [];
            function parseNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const chars = Array.from(node.textContent);
                    for (let i = 0; i < chars.length; i++) {
                        tokens.push(chars[i]);
                    }
                } else if (node.nodeName === 'BR') {
                    tokens.push('<br>');
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    Array.from(node.childNodes).forEach(parseNode);
                }
            }
            Array.from(heading.childNodes).forEach(parseNode);

            if (!tokens.length) return;

            const fullHtml = tokens.join('');

            const updateMinHeight = () => {
                const clone = heading.cloneNode(false);
                clone.innerHTML = fullHtml + '<span class="typewriter-cursor" aria-hidden="true">|</span>';
                clone.style.visibility = 'hidden';
                clone.style.position = 'absolute';
                clone.style.pointerEvents = 'none';
                clone.style.minHeight = '';
                clone.style.height = 'auto';
                const parentW = heading.parentElement ? heading.parentElement.clientWidth : heading.clientWidth;
                if (parentW > 0) clone.style.width = `${parentW}px`;
                document.body.appendChild(clone);
                const measuredHeight = clone.offsetHeight;
                document.body.removeChild(clone);

                if (measuredHeight > 0) {
                    heading.style.minHeight = `${measuredHeight}px`;
                }
            };

            updateMinHeight();

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(updateMinHeight, 150);
            });

            heading.innerHTML = '<span class="typewriter-content"></span><span class="typewriter-cursor" aria-hidden="true">|</span>';
            const contentSpan = heading.querySelector('.typewriter-content');
            const cursorSpan = heading.querySelector('.typewriter-cursor');

            let charIndex = 0;
            let isDeleting = false;

            function typeStep() {
                if (!isDeleting) {
                    charIndex++;
                    contentSpan.innerHTML = tokens.slice(0, charIndex).join('');
                    if (cursorSpan) cursorSpan.classList.add('typing');

                    if (charIndex >= tokens.length) {
                        isDeleting = true;
                        if (cursorSpan) cursorSpan.classList.remove('typing');
                        setTimeout(typeStep, 3500);
                        return;
                    }

                    const currentToken = tokens[charIndex - 1];
                    let delay = 45 + Math.random() * 20;
                    if (currentToken === '.' || currentToken === ',') {
                        delay += 180;
                    } else if (currentToken === '<br>') {
                        delay += 100;
                    }
                    setTimeout(typeStep, delay);
                } else {
                    charIndex--;
                    contentSpan.innerHTML = tokens.slice(0, charIndex).join('');
                    if (cursorSpan) cursorSpan.classList.add('typing');

                    if (charIndex <= 0) {
                        isDeleting = false;
                        if (cursorSpan) cursorSpan.classList.remove('typing');
                        setTimeout(typeStep, 600);
                        return;
                    }

                    const currentToken = tokens[charIndex];
                    let delDelay = 22;
                    if (currentToken === '<br>') {
                        delDelay = 40;
                    }
                    setTimeout(typeStep, delDelay);
                }
            }

            setTimeout(typeStep, 300);
        });
    }

    initHeroTypewriter();
});

