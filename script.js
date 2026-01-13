// Smooth scroll and interactions
document.addEventListener('DOMContentLoaded', function() {
    // CTA Button click handler
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Здесь можно добавить переход на приложение
            console.log('Open App clicked');
            // window.location.href = 'your-app-url';
        });
    }

    // Tab switching (optional enhancement)
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Dot indicator interaction
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            dots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add parallax effect on scroll (optional)
    let lastScrollY = window.scrollY;
    const phoneScreens = document.querySelector('.phone-screens');
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        if (phoneScreens && window.innerWidth > 768) {
            const offset = (currentScrollY - lastScrollY) * 0.1;
            phoneScreens.style.transform = `translateY(${offset}px)`;
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
});
