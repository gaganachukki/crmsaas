/**
 * Stackly CRM - Global GSAP Animation Engine
 * Comprehensive animations: Page load choreography, ScrollTrigger reveals,
 * directional slide effects, floating elements, stat counters, and interactive transitions.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // 1. Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
            return;
        }

        // 2. Check if GSAP and ScrollTrigger are available
        const hasGSAP = typeof window.gsap !== 'undefined';
        const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

        if (!hasGSAP) {
            console.warn('GSAP not detected. Initializing IntersectionObserver fallback.');
            initIntersectionFallback();
            return;
        }

        if (hasScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Initialize animations
        initNavbarAnimations();
        initHeroAnimations();
        initSplitSectionSlideEffects();
        initGridStaggerAnimations();
        initNumberCounters();
        initAccordionAnimations();
        initPricingToggleAnimation();
        initAuthPageAnimations();
        init404Animations();
        initDashboardAnimations();
        initFigmaBlueCardAnimations();
        initFeatureMockupAnimations();
    });

    /* ==========================================================================
       1. Navbar Entrance & Scroll Effect
       ========================================================================== */
    function initNavbarAnimations() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            gsap.from(navbar, {
                y: -15,
                opacity: 0.4,
                duration: 0.5,
                ease: 'power2.out',
                clearProps: 'all'
            });

            // Add scrolled class on scroll
            window.addEventListener('scroll', () => {
                if (window.scrollY > 30) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }, { passive: true });
        }
    }

    /* ==========================================================================
       2. Hero Section Entrance Choreography
       ========================================================================== */
    function initHeroAnimations() {
        // Marketing Hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const heroElements = heroContent.querySelectorAll('h1, p, .btn, .client-logos');
            if (heroElements.length) {
                gsap.from(heroElements, {
                    y: 20,
                    opacity: 0.4,
                    duration: 0.55,
                    stagger: 0.06,
                    ease: 'power2.out',
                    clearProps: 'opacity,transform'
                });
            }
        }

        // Hero Visuals
        const heroVisuals = document.querySelector('.hero-visuals');
        if (heroVisuals) {
            const boxes = heroVisuals.querySelectorAll('.visual-box');
            const floatingCards = heroVisuals.querySelectorAll('.floating-card');

            if (boxes.length) {
                gsap.from(boxes, {
                    y: 25,
                    opacity: 0.4,
                    scale: 0.98,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }

            if (floatingCards.length) {
                gsap.from(floatingCards, {
                    scale: 0.85,
                    opacity: 0.5,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.4)',
                    clearProps: 'all'
                });
            }
        }

        // Page Header Titles (About, Blog, Pricing, Contact)
        const subHeroTitles = document.querySelectorAll(
            '.about-hero h1, .about-hero .subtitle, .blog-header-text > *, .pricing-title, .billing-toggle, .contact-heading h1'
        );
        if (subHeroTitles.length) {
            gsap.from(subHeroTitles, {
                y: 20,
                opacity: 0.4,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'opacity,transform'
            });
        }
    }

    /* ==========================================================================
       3. Directional Split Section Slide Effects (Left & Right)
       ========================================================================== */
    function initSplitSectionSlideEffects() {
        if (typeof ScrollTrigger === 'undefined') return;

        const splitSections = document.querySelectorAll('.feature-section.split, .feature-section .split, .about-hero-split, .featured-article.split, .contact-hero.split');
        splitSections.forEach(section => {
            const children = section.children;
            if (children.length >= 2) {
                const leftEl = children[0];
                const rightEl = children[1];

                gsap.from(leftEl, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 88%',
                        once: true
                    },
                    x: -25,
                    opacity: 0.4,
                    duration: 0.6,
                    ease: 'power2.out',
                    clearProps: 'all'
                });

                gsap.from(rightEl, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 88%',
                        once: true
                    },
                    x: 25,
                    opacity: 0.4,
                    duration: 0.6,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }
        });

        // Split boxes in Mission & Vision
        const missionVision = document.querySelector('.mission-vision');
        if (missionVision) {
            const boxes = missionVision.querySelectorAll('.mission-box, .vision-box');
            if (boxes.length === 2) {
                gsap.from(boxes[0], {
                    scrollTrigger: { trigger: missionVision, start: 'top 88%', once: true },
                    x: -25, opacity: 0.4, duration: 0.6, ease: 'power2.out', clearProps: 'all'
                });
                gsap.from(boxes[1], {
                    scrollTrigger: { trigger: missionVision, start: 'top 88%', once: true },
                    x: 25, opacity: 0.4, duration: 0.6, ease: 'power2.out', clearProps: 'all'
                });
            }
        }
    }

    /* ==========================================================================
       4. Staggered Grid ScrollTrigger Reveals
       ========================================================================== */
    function initGridStaggerAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;

        const gridConfigs = [
            { container: '.features-list', items: '.feature-item' },
            { container: '.values-grid', items: '.value-card' },
            { container: '.team-grid', items: '.team-card' },
            { container: '.pricing-cards', items: '.price-card' },
            { container: '.articles-grid', items: '.article-card' },
            { container: '.info-grid', items: '.info-card' },
            { container: '.logos-grid', items: '.logo-item' },
            { container: '.showcase-grid', items: '.card' },
            { container: '.grid-showcase', items: '.grid-item' },
            { container: '.testimonials-grid', items: '.testimonial-card' },
            { container: '.compare-table tbody', items: 'tr' }
        ];

        gridConfigs.forEach(cfg => {
            const parent = document.querySelector(cfg.container);
            if (parent) {
                const items = parent.querySelectorAll(cfg.items);
                if (items.length) {
                    gsap.from(items, {
                        scrollTrigger: {
                            trigger: parent,
                            start: 'top 88%',
                            once: true
                        },
                        y: 20,
                        opacity: 0.4,
                        duration: 0.55,
                        stagger: 0.05,
                        ease: 'power2.out',
                        clearProps: 'all'
                    });
                }
            }
        });

        // Section Headings Reveal on Scroll
        const headings = document.querySelectorAll('section > h2, .section-title, .showcase h2, .core-values h2, .team-section h2');
        headings.forEach(heading => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 90%',
                    once: true
                },
                y: 18,
                opacity: 0.4,
                duration: 0.5,
                ease: 'power2.out',
                clearProps: 'all'
            });
        });
    }

    /* ==========================================================================
       5. Animated Number Counters
       ========================================================================== */
    function initNumberCounters() {
        if (typeof ScrollTrigger === 'undefined') return;

        const statElements = document.querySelectorAll('.stat-info h3, .big-text, .pricing-card .amount, .stat-large-num');
        statElements.forEach(el => {
            const rawText = el.textContent.trim();
            const match = rawText.match(/([^\d]*)([\d,]+(\.\d+)?)(.*)/);
            if (!match) return;

            const prefix = match[1];
            const numStr = match[2].replace(/,/g, '');
            const targetVal = parseFloat(numStr);
            const suffix = match[4];

            if (isNaN(targetVal)) return;

            const obj = { val: 0 };
            const isFloat = numStr.includes('.');

            ScrollTrigger.create({
                trigger: el,
                start: 'top 92%',
                once: true,
                onEnter: () => {
                    gsap.to(obj, {
                        val: targetVal,
                        duration: 1.2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            let formatted = isFloat ? obj.val.toFixed(2) : Math.floor(obj.val).toLocaleString();
                            el.textContent = `${prefix}${formatted}${suffix}`;
                        }
                    });
                }
            });
        });
    }

    /* ==========================================================================
       6. Interactive Accordion Animations
       ========================================================================== */
    function initAccordionAnimations() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const body = item.querySelector('.accordion-body');
                if (!body) return;

                setTimeout(() => {
                    if (item.classList.contains('active')) {
                        gsap.fromTo(body, 
                            { opacity: 0, y: -6 }, 
                            { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', clearProps: 'all' }
                        );
                    }
                }, 10);
            });
        });
    }

    /* ==========================================================================
       7. Interactive Pricing Toggle Morph
       ========================================================================== */
    function initPricingToggleAnimation() {
        const toggleInput = document.getElementById('billing-toggle');
        if (toggleInput) {
            toggleInput.addEventListener('change', () => {
                const priceCards = document.querySelectorAll('.price-card');
                if (priceCards.length) {
                    gsap.fromTo(priceCards, 
                        { scale: 0.98, opacity: 0.8 }, 
                        { scale: 1, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(1.4)', clearProps: 'all' }
                    );
                }
            });
        }
    }

    /* ==========================================================================
       8. Auth Pages (Login & Signup) Choreography
       ========================================================================== */
    function initAuthPageAnimations() {
        const authContainer = document.querySelector('.auth-container, .login-container');
        if (!authContainer) return;

        const leftPanel = authContainer.querySelector('.auth-left, .login-left, .auth-visual');
        const rightPanel = authContainer.querySelector('.auth-right, .login-right, .auth-form-side');

        if (leftPanel) {
            gsap.from(leftPanel, {
                x: -30,
                opacity: 0.4,
                duration: 0.6,
                ease: 'power2.out',
                clearProps: 'all'
            });

            const floatCards = leftPanel.querySelectorAll('.float-card');
            if (floatCards.length) {
                gsap.from(floatCards, {
                    scale: 0.85,
                    opacity: 0.5,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'back.out(1.4)',
                    clearProps: 'all'
                });
            }
        }

        if (rightPanel) {
            gsap.from(rightPanel, {
                x: 30,
                opacity: 0.4,
                duration: 0.6,
                ease: 'power2.out',
                clearProps: 'all'
            });

            const formElements = rightPanel.querySelectorAll(
                'h1, .subtitle, .role-select-box, .btn-google, .separator, .form-group, .btn-submit, .btn-login, .auth-footer, .login-nav'
            );
            if (formElements.length) {
                gsap.from(formElements, {
                    y: 15,
                    opacity: 0.4,
                    duration: 0.45,
                    stagger: 0.04,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }
        }
    }

    /* ==========================================================================
       9. 404 Error Page Animations
       ========================================================================== */
    function init404Animations() {
        const errorWrapper = document.querySelector('.error-wrapper');
        if (!errorWrapper) return;

        const code = errorWrapper.querySelector('.error-code');
        const illustration = errorWrapper.querySelector('.error-illustration');
        const msg = errorWrapper.querySelector('.error-message');
        const btn = errorWrapper.querySelector('.btn-home');

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        if (code) tl.from(code, { scale: 0.7, opacity: 0.4, duration: 0.5, clearProps: 'all' });
        if (illustration) tl.from(illustration, { scale: 0.8, opacity: 0.4, duration: 0.5, clearProps: 'all' }, '-=0.3');
        if (msg) tl.from(msg, { y: 15, opacity: 0.4, duration: 0.45, clearProps: 'all' }, '-=0.2');
        if (btn) tl.from(btn, { y: 12, opacity: 0.4, duration: 0.4, clearProps: 'all' }, '-=0.15');
    }

    /* ==========================================================================
       10. Dashboard View Transitions & Slide Effects
       ========================================================================== */
    function initDashboardAnimations() {
        const topbar = document.querySelector('.topbar');
        if (topbar) {
            gsap.from(topbar, {
                y: -15,
                opacity: 0.4,
                duration: 0.5,
                ease: 'power2.out',
                clearProps: 'all'
            });
        }

        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const navLinks = sidebar.querySelectorAll('.sidebar-nav li');
            if (navLinks.length) {
                gsap.from(navLinks, {
                    x: -15,
                    opacity: 0.4,
                    duration: 0.45,
                    stagger: 0.03,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }
        }

        // Animate deal cards and tasks on view entrance
        window.addEventListener('hashchange', () => {
            const activeView = document.querySelector('.dashboard-view.active');
            if (activeView) {
                gsap.fromTo(activeView,
                    { opacity: 0.3, y: 12 },
                    { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', clearProps: 'all' }
                );

                const cards = activeView.querySelectorAll('.deal-card, .task-item, .report-card');
                if (cards.length) {
                    gsap.fromTo(cards,
                        { opacity: 0.3, y: 10 },
                        { opacity: 1, y: 0, duration: 0.28, stagger: 0.04, ease: 'power2.out', clearProps: 'all' }
                    );
                }
            }
        });
    }

    /* ==========================================================================
       11. Figma Blue Feature Section Choreography & Ring Draw Animation
       ========================================================================== */
    function initFigmaBlueCardAnimations() {
        const blueSections = document.querySelectorAll('.feature-blue-section');
        if (!blueSections.length) return;

        blueSections.forEach(section => {
            const container = section.querySelector('.blue-card-container');
            if (!container) return;

            // Only run animated entrance if GSAP & ScrollTrigger are loaded
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                // 1. Text elements entrance (staggered upward slide & fade)
                const textElements = container.querySelectorAll('.blue-card-title, .blue-card-desc, .btn-pill-dark');
                if (textElements.length) {
                    gsap.from(textElements, {
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 85%',
                            once: true
                        },
                        y: 35,
                        opacity: 0,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: 'power3.out',
                        immediateRender: false,
                        clearProps: 'opacity,transform'
                    });
                }

                // 2. Weekly tasks card entrance (tilted -7deg)
                const cardWeekly = container.querySelector('.card-weekly-tasks');
                if (cardWeekly) {
                    gsap.from(cardWeekly, {
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 85%',
                            once: true
                        },
                        x: -50,
                        y: 40,
                        opacity: 0,
                        rotation: 0,
                        duration: 0.85,
                        ease: 'back.out(1.2)',
                        immediateRender: false
                    });
                }

                // 3. Top customers card entrance (tilted +3deg)
                const cardTop = container.querySelector('.card-top-customers');
                if (cardTop) {
                    gsap.from(cardTop, {
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 85%',
                            once: true
                        },
                        x: 50,
                        y: 40,
                        opacity: 0,
                        rotation: 0,
                        duration: 0.85,
                        delay: 0.1,
                        ease: 'back.out(1.2)',
                        immediateRender: false
                    });
                }

                // 4. SVG Concentric Rings Draw Animation
                const greenRing = container.querySelector('.ring-green');
                const blueRing = container.querySelector('.ring-blue');
                const orangeRing = container.querySelector('.ring-orange');

                if (greenRing) {
                    gsap.fromTo(greenRing,
                        { strokeDashoffset: 374 },
                        {
                            strokeDashoffset: 0,
                            duration: 1.3,
                            delay: 0.25,
                            ease: 'power2.out',
                            scrollTrigger: { trigger: container, start: 'top 85%', once: true }
                        }
                    );
                }
                if (blueRing) {
                    gsap.fromTo(blueRing,
                        { strokeDashoffset: 261 },
                        {
                            strokeDashoffset: 0,
                            duration: 1.1,
                            delay: 0.4,
                            ease: 'power2.out',
                            scrollTrigger: { trigger: container, start: 'top 85%', once: true }
                        }
                    );
                }
                if (orangeRing) {
                    gsap.fromTo(orangeRing,
                        { strokeDashoffset: 163 },
                        {
                            strokeDashoffset: 0,
                            duration: 0.9,
                            delay: 0.55,
                            ease: 'power2.out',
                            scrollTrigger: { trigger: container, start: 'top 85%', once: true }
                        }
                    );
                }

                // 5. Stat Counter Animations (70% and 630k)
                const stat70 = container.querySelector('.blue-stat-70');
                if (stat70) {
                    const countObj70 = { val: 0 };
                    ScrollTrigger.create({
                        trigger: container,
                        start: 'top 85%',
                        once: true,
                        onEnter: () => {
                            gsap.to(countObj70, {
                                val: 70,
                                duration: 1.2,
                                delay: 0.2,
                                ease: 'power2.out',
                                onUpdate: () => {
                                    stat70.textContent = Math.floor(countObj70.val);
                                }
                            });
                        }
                    });
                }

                const stat630 = container.querySelector('.blue-stat-630');
                if (stat630) {
                    const countObj630 = { val: 0 };
                    ScrollTrigger.create({
                        trigger: container,
                        start: 'top 85%',
                        once: true,
                        onEnter: () => {
                            gsap.to(countObj630, {
                                val: 630,
                                duration: 1.3,
                                delay: 0.35,
                                ease: 'power2.out',
                                onUpdate: () => {
                                    stat630.textContent = Math.floor(countObj630.val);
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    /* ==========================================================================
       12. Feature 1 & 3 Figma Mockups Animation (Revenue Bars & Visitor Curve)
       ========================================================================== */
    function initFeatureMockupAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // 1. Revenue Bars Entrance
        const revenueCard = document.querySelector('.revenue-card-mockup');
        if (revenueCard) {
            const bars = revenueCard.querySelectorAll('.revenue-bar-pill');
            if (bars.length) {
                gsap.from(bars, {
                    scrollTrigger: {
                        trigger: revenueCard,
                        start: 'top 85%',
                        once: true
                    },
                    scaleY: 0,
                    transformOrigin: 'bottom',
                    duration: 0.65,
                    stagger: 0.08,
                    ease: 'power2.out',
                    immediateRender: false,
                    clearProps: 'transform'
                });
            }
        }

        // 2. Visitor Online SVG Wave Curve Entrance
        const visitorCard = document.querySelector('.visitor-card-mockup');
        if (visitorCard) {
            const linePath = visitorCard.querySelector('.visitor-line-path');
            const dots = visitorCard.querySelectorAll('circle');
            const tooltip = visitorCard.querySelector('.chart-tooltip-orange');

            if (linePath) {
                const length = linePath.getTotalLength ? linePath.getTotalLength() : 350;
                gsap.fromTo(linePath,
                    { strokeDashoffset: length },
                    {
                        strokeDashoffset: 0,
                        duration: 1.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: visitorCard,
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            }

            if (dots.length) {
                gsap.from(dots, {
                    scrollTrigger: {
                        trigger: visitorCard,
                        start: 'top 85%',
                        once: true
                    },
                    scale: 0,
                    transformOrigin: 'center',
                    duration: 0.45,
                    delay: 0.5,
                    stagger: 0.07,
                    ease: 'back.out(1.5)',
                    immediateRender: false,
                    clearProps: 'transform'
                });
            }

            if (tooltip) {
                gsap.from(tooltip, {
                    scrollTrigger: {
                        trigger: visitorCard,
                        start: 'top 85%',
                        once: true
                    },
                    y: -10,
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.8,
                    ease: 'back.out(1.4)',
                    immediateRender: false,
                    clearProps: 'opacity,transform'
                });
            }
        }
    }

    /* ==========================================================================
       13. Fallback for environments without external GSAP
       ========================================================================== */
    function initIntersectionFallback() {
        document.body.classList.add('js-fallback');

        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        const revealTargets = document.querySelectorAll(
            '.feature-item, .price-card, .article-card, .value-card, .team-card, .info-card, .stat-card'
        );

        revealTargets.forEach(el => {
            el.classList.add('gsap-slide-up');
            observer.observe(el);
        });
    }

})();
