// ===== COUNTDOWN TIMER =====
function initCountdown() {
    // Define end time - end of today at 23:59:59
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endOfDay.getTime() - now;

        if (distance < 0) {
            // Reset for next day if timer expires
            document.querySelectorAll('[id^="hours"]').forEach(el => el.textContent = '00');
            document.querySelectorAll('[id^="minutes"]').forEach(el => el.textContent = '00');
            document.querySelectorAll('[id^="seconds"]').forEach(el => el.textContent = '00');
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update all countdown displays
        const hoursElements = document.querySelectorAll('[id^="hours"]');
        const minutesElements = document.querySelectorAll('[id^="minutes"]');
        const secondsElements = document.querySelectorAll('[id^="seconds"]');

        hoursElements.forEach(el => el.textContent = hours.toString().padStart(2, '0'));
        minutesElements.forEach(el => el.textContent = minutes.toString().padStart(2, '0'));
        secondsElements.forEach(el => el.textContent = seconds.toString().padStart(2, '0'));
    }

    // Initial update
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== VIDEO FACADE (lazy load YouTube iframes) =====
function initVideoFacades() {
    document.querySelectorAll('.video-facade').forEach(facade => {
        facade.addEventListener('click', function () {
            const videoId = this.dataset.videoId;
            const iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            this.innerHTML = '';
            this.appendChild(iframe);
            this.classList.remove('video-facade');
        });
    });
}

// ===== SMOOTH SCROLL FOR CTA BUTTONS =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                // Reveal all fade-in elements in the target section before scrolling
                targetSection.querySelectorAll('.fade-in').forEach(el => {
                    el.classList.add('visible');
                });

                // For #oferta, scroll to the checkout button so it's visible
                if (targetId === '#oferta') {
                    const ctaButton = targetSection.querySelector('a.cta-button');
                    if (ctaButton) {
                        const buttonRect = ctaButton.getBoundingClientRect();
                        const scrollTarget = window.pageYOffset + buttonRect.top - (window.innerHeight * 0.65);
                        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                        return;
                    }
                }

                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.01, rootMargin: '0px 0px 50px 0px' });

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initFAQ();
    initVideoFacades();
    initSmoothScroll();
    initScrollAnimations();
});
