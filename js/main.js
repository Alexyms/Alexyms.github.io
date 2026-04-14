// ============================================
// THEME TOGGLE
// ============================================

(function() {
    const STORAGE_KEY = 'ams-theme';
    const toggle = document.getElementById('theme-toggle');

    // Determine initial theme:
    // 1. Check localStorage for saved preference
    // 2. Fall back to system preference
    // 3. Default to light
    function getInitialTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') return saved;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }

    // Apply theme immediately (before paint)
    setTheme(getInitialTheme());

    // Toggle on click
    if (toggle) {
        toggle.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // Listen for system preference changes (if user hasn't manually set)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
})();


// ============================================
// SMOOTH SCROLL for anchor links
// (CSS scroll-behavior handles most of this,
//  but this adds offset for fixed nav)
// ============================================

// ============================================
// LIGHTBOX
// ============================================

(function() {
    var overlay = null;

    function open(img) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', close);
        }
        overlay.innerHTML = '';
        var clone = document.createElement('img');
        clone.src = img.src;
        clone.alt = img.alt;
        overlay.appendChild(clone);
        overlay.style.display = 'flex';
        // Force reflow so the transition triggers
        overlay.offsetHeight;
        overlay.classList.add('is-visible');
    }

    function close() {
        if (overlay) {
            overlay.classList.remove('is-visible');
            overlay.addEventListener('transitionend', function handler() {
                overlay.style.display = 'none';
                overlay.removeEventListener('transitionend', handler);
            });
        }
    }

    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG' && e.target.closest('.figure')) {
            open(e.target);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') close();
    });
})();


document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
