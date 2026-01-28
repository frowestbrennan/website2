/**
 * Mouse Tracking for backgrounds
 * Makes video and 360 images respond to mouse movement
 */

document.addEventListener('DOMContentLoaded', () => {
    initMouseTracking();
    initScrollAnimations();
});

function initMouseTracking() {
    // Look for either video or 360 image
    const bgVideo = document.querySelector('.bg-video');
    const panoImage = document.querySelector('.pano-image');
    const target = bgVideo || panoImage;

    if (!target) return;

    // Configuration
    const config = {
        sensitivity: 0.12,
        smoothing: 0.06,
        maxOffset: 30
    };

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const offsetX = (e.clientX - centerX) / centerX;
        const offsetY = (e.clientY - centerY) / centerY;

        targetX = -offsetX * config.maxOffset;
        targetY = -offsetY * config.maxOffset;
    });

    // Smooth animation loop
    function animate() {
        currentX += (targetX - currentX) * config.smoothing;
        currentY += (targetY - currentY) * config.smoothing;

        target.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Scroll Animations
 * Makes nav items scale up as they come into view
 */
function initScrollAnimations() {
    const navItems = document.querySelectorAll('.nav-item');
    const scrollHint = document.querySelector('.scroll-hint');

    if (navItems.length === 0) return;

    function checkVisibility() {
        const windowHeight = window.innerHeight;

        navItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;

            // Item is visible when its center is in the viewport
            if (itemCenter < windowHeight * 0.85 && rect.bottom > 0) {
                // Stagger the animation slightly for each item
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100);
            }
        });

        // Fade out scroll hint when user scrolls
        if (scrollHint) {
            const scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > 50) {
                scrollHint.style.opacity = '0';
            } else {
                scrollHint.style.opacity = '0.6';
            }
        }
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check on load
}

/**
 * Smooth page transitions (optional enhancement)
 */
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only handle internal links
        if (href && href.startsWith('pages/') || href === '../index.html' || href.startsWith('../pages/')) {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';

            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });
});

// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
