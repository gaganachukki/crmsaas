// Helper function to extract person name and initials from email or input
function parseEmailToName(email, providedName) {
    if (providedName && providedName.trim().length > 0) {
        const parts = providedName.trim().split(/\s+/);
        const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
        const fullName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
        let initials = parts[0].charAt(0).toUpperCase();
        if (parts.length > 1) {
            initials += parts[parts.length - 1].charAt(0).toUpperCase();
        } else if (parts[0].length > 1) {
            initials += parts[0].slice(0, 2).toUpperCase();
        }
        return { fullName, firstName, initials };
    }

    if (!email) {
        return { fullName: 'User', firstName: 'User', initials: 'U' };
    }

    // Extract username prefix before @
    const username = email.split('@')[0];
    
    // Remove trailing/inline digits
    let cleaned = username.replace(/[0-9]+/g, ' ').trim();
    if (!cleaned) cleaned = username;

    // Handle camelCase and common delimiters: dot, underscore, dash, plus
    let rawParts = cleaned
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(/[\s._\-+]+/)
        .filter(p => p.length > 0);

    if (rawParts.length === 0) {
        rawParts = [username];
    }

    const parts = rawParts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    const fullName = parts.join(' ');
    const firstName = parts[0];

    let initials = '';
    if (parts.length >= 2) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts[0].length >= 2) {
        initials = parts[0].slice(0, 2).toUpperCase();
    } else {
        initials = parts[0].toUpperCase();
    }

    return { fullName, firstName, initials };
}

// Authentication and Role Management for Login & Signup
document.addEventListener('DOMContentLoaded', () => {
    const userRoleBtn = document.getElementById('userRoleBtn');
    const adminRoleBtn = document.getElementById('adminRoleBtn');
    const authForm = document.querySelector('.auth-form');
    const submitBtn = authForm ? authForm.querySelector('button[type="submit"]') : null;
    const emailInput = document.querySelector('input[type="email"]');
    const nameInput = document.querySelector('input[placeholder*="name" i]');
    const isSignup = window.location.pathname.includes('signup');

    let currentRole = 'user';

    function setRole(role) {
        currentRole = role;

        if (role === 'admin') {
            userRoleBtn?.classList.remove('active');
            adminRoleBtn?.classList.add('active');

            if (submitBtn) {
                submitBtn.textContent = isSignup ? 'Sign up as Admin' : 'Log in as Admin';
            }
        } else {
            adminRoleBtn?.classList.remove('active');
            userRoleBtn?.classList.add('active');

            if (submitBtn) {
                submitBtn.textContent = isSignup ? 'Sign up as User' : 'Log in as User';
            }
        }
    }

    if (userRoleBtn) {
        userRoleBtn.addEventListener('click', () => setRole('user'));
    }

    if (adminRoleBtn) {
        adminRoleBtn.addEventListener('click', () => setRole('admin'));
    }

    // Google button handles role redirection too
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleAuth();
        });
    }

    function handleAuth() {
        const email = emailInput ? emailInput.value.trim() : '';
        const name = nameInput ? nameInput.value.trim() : '';

        // Extract name and initials from email or input
        const profile = parseEmailToName(email, name);

        // Save in localStorage for the dashboards
        const sessionData = {
            email: email,
            role: currentRole,
            fullName: profile.fullName,
            firstName: profile.firstName,
            initials: profile.initials
        };

        try {
            localStorage.setItem('stackly_user', JSON.stringify(sessionData));
        } catch (err) {
            console.error('Could not save session to localStorage', err);
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Redirecting...`;
        }

        setTimeout(() => {
            if (currentRole === 'admin') {
                window.location.href = 'admindashboard.html';
            } else {
                window.location.href = 'userdashboard.html';
            }
        }, 300);
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuth();
        });
    }
});
