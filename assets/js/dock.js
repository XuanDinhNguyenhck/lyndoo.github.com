/* Dock behavior (vanilla JS implementation approximating the React motion-based dock) */
(function initDock() {
    const dock = document.getElementById('app-dock');
    if (!dock) return;

    const panel = dock.querySelector('#dock-panel');
    const items = Array.from(panel.querySelectorAll('.dock-item'));

    // Configurable values (match defaults from the React code)
    const baseItemSize = 30;
    const magnification = 40; // when hovered center
    const distance = 200; // influence distance
    const spring = { stiffness: 0.15, damping: 0.8 }; // simplified

    let mouseX = Infinity;
    let isHover = false;

    function setSizes() {
        items.forEach(it => {
            it.style.width = baseItemSize + 'px';
            it.style.height = baseItemSize + 'px';
        });
    }

    // Smoothly animate a value toward target (critically damped-ish)
    function animateValue(current, target, velocityRef, dt) {
        // spring-damper: v += (stiffness*(target-current) - damping*v) * dt
        const v = velocityRef.v + (spring.stiffness * (target - current) - spring.damping * velocityRef.v) * dt;
        const next = current + v * dt * 60; // scale by 60fps baseline
        velocityRef.v = v;
        return next;
    }

    // Keep a per-item velocity
    const velocities = items.map(() => ({ v: 0 }));

    function frame(time) {
        const now = performance.now();
        if (!frame.last) frame.last = now;
        const dt = Math.min(0.05, (now - frame.last) / 1000);
        frame.last = now;

        items.forEach((it, idx) => {
            const rect = it.getBoundingClientRect();
            const centerX = rect.x + rect.width / 2;
            const dist = Math.abs(mouseX - centerX);
            let target = baseItemSize;
            if (!isFinite(mouseX)) {
                target = baseItemSize;
            } else if (dist < distance) {
                // map distance to size (linear between magnification and base)
                const t = 1 - dist / distance;
                target = baseItemSize + (magnification - baseItemSize) * t;
            }

            // animate width/height
            const currentW = parseFloat(getComputedStyle(it).width);
            const next = animateValue(currentW, target, velocities[idx], dt);
            it.style.width = Math.max(32, next) + 'px';
            it.style.height = Math.max(32, next) + 'px';
            // small elevate transform based on size
            const scale = next / baseItemSize;
            it.style.transform = `translateY(${-(scale - 1) * 8}px)`;
        });

        requestAnimationFrame(frame);
    }

    // Mouse tracking
    panel.addEventListener('mousemove', (e) => {
        isHover = true;
        mouseX = e.pageX;
    });

    panel.addEventListener('mouseleave', () => {
        isHover = false;
        mouseX = Infinity;
    });

    // Accessibility: focus via keyboard
    items.forEach(it => {
        it.setAttribute('tabindex', '0');
        it.addEventListener('focus', (e) => {
            const rect = it.getBoundingClientRect();
            mouseX = rect.x + rect.width / 2;
        });
        it.addEventListener('blur', () => {
            mouseX = Infinity;
        });

        it.addEventListener('click', () => {
            const action = it.dataset.action;
            // Simple action handlers (navigate/scroll or alert)
            if (action === 'home') { document.getElementById('home')?.scrollIntoView({behavior: 'smooth'}); }
            else if (action === 'archive') { alert('Archive clicked'); }
            else if (action === 'profile') { alert('Profile clicked'); }
            else if (action === 'settings') { alert('Settings clicked'); }
            else if (action === 'toggle-theme') {
                // If ThemeManager is available on the window, toggle theme
                if (window.themeManager && typeof window.themeManager.toggleTheme === 'function') {
                    window.themeManager.toggleTheme();
                } else {
                    // fallback: toggle dark class on body
                    document.body.classList.toggle('dark');
                }
            }
        });

        // Support keyboard activation (Enter/Space)
        it.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                it.click();
            }
        });
    });

    // Initialize
    setSizes();
    requestAnimationFrame(frame);
})();
