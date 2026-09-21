// Dashboard Navigation, Dynamic Profiles, and Interactive Controls
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Profile & Initials Sync from localStorage
    // ==========================================
    let userData = null;
    const isAdmin = window.location.pathname.includes('admindashboard');

    try {
        const stored = localStorage.getItem('stackly_user');
        if (stored) {
            userData = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to parse stackly_user from localStorage', e);
    }

    // Fallback defaults if accessed directly
    if (!userData || !userData.fullName) {
        if (isAdmin) {
            userData = {
                fullName: 'Admin Manager',
                firstName: 'Admin',
                initials: 'AD'
            };
        } else {
            userData = {
                fullName: 'James Wilson',
                firstName: 'James',
                initials: 'JW'
            };
        }
    }

    // Topbar avatar & name sync
    const userProfileEl = document.querySelector('.user-profile');
    if (userProfileEl) {
        let initialsAvatar = userProfileEl.querySelector('.user-avatar-initials');
        const profileImg = userProfileEl.querySelector('img');

        if (!initialsAvatar) {
            initialsAvatar = document.createElement('div');
            initialsAvatar.className = 'user-avatar-initials' + (isAdmin ? ' admin-avatar' : '');
            if (profileImg) {
                profileImg.replaceWith(initialsAvatar);
            } else {
                userProfileEl.prepend(initialsAvatar);
            }
        }
        
        initialsAvatar.textContent = userData.initials;

        const nameSpan = userProfileEl.querySelector('span');
        if (nameSpan) {
            nameSpan.textContent = userData.fullName;
        }
    }

    // Welcome Greeting personalization
    if (!isAdmin) {
        const welcomeHeading = document.querySelector('#view-dashboard .page-header h1');
        if (welcomeHeading) {
            welcomeHeading.innerHTML = `Welcome back, ${userData.firstName}! 👋`;
        }
        // Also update settings form if present
        const settingsFirst = document.getElementById('settingsFirstName');
        const settingsLast = document.getElementById('settingsLastName');
        const settingsEmail = document.getElementById('settingsEmail');
        if (settingsFirst && userData.firstName) settingsFirst.value = userData.firstName;
        if (settingsLast && userData.fullName) {
            const parts = userData.fullName.split(' ');
            if (parts.length > 1) settingsLast.value = parts.slice(1).join(' ');
        }
        if (settingsEmail && userData.email) settingsEmail.value = userData.email;
    } else {
        const headerP = document.querySelector('#view-overview .page-header p');
        if (headerP) {
            headerP.innerHTML = `Welcome back, ${userData.firstName}. Global metrics for Stackly SaaS platform.`;
        }
    }

    // ==========================================
    // 2. Tab Navigation & View Switching
    // ==========================================
    const navItems = document.querySelectorAll('.sidebar-nav li[data-view]');
    const views = document.querySelectorAll('.dashboard-view');

    function switchView(viewName) {
        if (!viewName) return;

        // Verify target view element exists
        const targetViewEl = document.getElementById(`view-${viewName}`);
        if (!targetViewEl) return;

        // Update active sidebar item
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Hide all views and show target view with animation
        views.forEach(view => {
            if (view.id === `view-${viewName}`) {
                view.classList.add('active');
                // Scroll main area to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(view,
                        { opacity: 0, y: 14, scale: 0.995 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }
                    );
                }
            } else {
                view.classList.remove('active');
            }
        });
    }

    // Click handler for sidebar items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const viewName = item.getAttribute('data-view');
            if (viewName) {
                e.preventDefault();
                window.location.hash = viewName;
                switchView(viewName);
            }
        });
    });

    // Handle initial route or hash changes
    function handleRoute() {
        const hash = window.location.hash.replace('#', '').trim();
        if (hash) {
            const matchingView = document.getElementById(`view-${hash}`);
            if (matchingView) {
                switchView(hash);
                return;
            }
        }
        // Default views if no hash or invalid hash
        const defaultView = isAdmin ? 'overview' : 'dashboard';
        switchView(defaultView);
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    // ==========================================
    // 3. Interactive Tasks (User Dashboard)
    // ==========================================
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        const checkBtn = item.querySelector('.task-check-btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.toggle('completed');
                showToast(item.classList.contains('completed') ? 'Task marked as completed!' : 'Task reopened!');
            });
        }
    });

    // ==========================================
    // 4. Filter Pills Interactivity
    // ==========================================
    const filterPillContainers = document.querySelectorAll('.filter-pills');
    filterPillContainers.forEach(container => {
        const pills = container.querySelectorAll('.filter-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            });
        });
    });

    // ==========================================
    // 5. Settings Save & Notification Toast
    // ==========================================
    const toast = document.getElementById('settingsToast') || document.getElementById('adminToast');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        if (message) {
            const span = toast.querySelector('span');
            if (span) span.textContent = message;
        }
        toast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    const saveButtons = document.querySelectorAll('.btn-save-settings');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Settings saved successfully!');
        });
    });

    // ==========================================
    // 6. Server Log Terminal Controls (Admin Dashboard)
    // ==========================================
    const terminalStream = document.getElementById('terminalStream');
    const logFilterButtons = document.querySelectorAll('.terminal-btn');
    const clearLogBtn = document.getElementById('clearLogBtn');
    const pauseLogBtn = document.getElementById('pauseLogBtn');
    let isStreamPaused = false;

    if (logFilterButtons.length && terminalStream) {
        logFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                logFilterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                const lines = terminalStream.querySelectorAll('.stream-line');
                lines.forEach(line => {
                    if (filter === 'all') {
                        line.style.display = 'flex';
                    } else {
                        const levelSpan = line.querySelector('.log-level');
                        if (levelSpan && levelSpan.classList.contains(filter)) {
                            line.style.display = 'flex';
                        } else {
                            line.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    if (clearLogBtn && terminalStream) {
        clearLogBtn.addEventListener('click', () => {
            terminalStream.innerHTML = '<div class="stream-line"><span class="log-ts">--:--:--</span><span class="log-level info">INFO</span><span class="log-msg">Terminal buffer cleared by operator.</span></div>';
        });
    }

    if (pauseLogBtn) {
        pauseLogBtn.addEventListener('click', () => {
            isStreamPaused = !isStreamPaused;
            pauseLogBtn.innerHTML = isStreamPaused 
                ? '<i class="fa-solid fa-play"></i> Resume Stream'
                : '<i class="fa-solid fa-pause"></i> Pause Stream';
            showToast(isStreamPaused ? 'Log stream paused' : 'Log stream resumed');
        });
    }

    // ==========================================
    // 7. Search Bar Filtering (Table rows & Cards)
    // ==========================================
    const searchInputs = document.querySelectorAll('.search-bar input, .view-search input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const activeView = document.querySelector('.dashboard-view.active');
            if (!activeView) return;

            const rows = activeView.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });

            const cards = activeView.querySelectorAll('.deal-card, .task-item');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(term) ? '' : 'none';
            });
        });
    });

    // ==========================================
    // 8. Logout Session Cleanup
    // ==========================================
    const logoutLinks = document.querySelectorAll('a[href*="login.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', () => {
            try {
                localStorage.removeItem('stackly_user');
            } catch (err) {}
        });
    });

    // ==========================================
    // 9. Mobile Responsive Sidebar Drawer
    // ==========================================
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const openSidebar = () => {
        if (sidebar) sidebar.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    };

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    };

    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSidebar();
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close on clicking nav links in mobile view
    if (sidebar) {
        sidebar.querySelectorAll('.sidebar-nav a').forEach(navLink => {
            navLink.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    closeSidebar();
                }
            });
        });
    }

    // Auto-close if screen expands beyond 992px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            closeSidebar();
        }
    });
});
