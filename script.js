// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();

    // Cache DOM references once
    const hoursElements = document.querySelectorAll('[id^="hours"]');
    const minutesElements = document.querySelectorAll('[id^="minutes"]');
    const secondsElements = document.querySelectorAll('[id^="seconds"]');

    let lastH = -1, lastM = -1, lastS = -1;

    function updateCountdown() {
        const distance = endOfDay - Date.now();

        if (distance < 0) {
            if (lastH !== 0 || lastM !== 0 || lastS !== 0) {
                hoursElements.forEach(el => el.textContent = '00');
                minutesElements.forEach(el => el.textContent = '00');
                secondsElements.forEach(el => el.textContent = '00');
                lastH = lastM = lastS = 0;
            }
            return;
        }

        const h = Math.floor(distance / 3600000) % 24;
        const m = Math.floor(distance / 60000) % 60;
        const s = Math.floor(distance / 1000) % 60;

        // Only update DOM when values change
        if (h !== lastH) {
            const hStr = h < 10 ? '0' + h : '' + h;
            hoursElements.forEach(el => el.textContent = hStr);
            lastH = h;
        }
        if (m !== lastM) {
            const mStr = m < 10 ? '0' + m : '' + m;
            minutesElements.forEach(el => el.textContent = mStr);
            lastM = m;
        }
        if (s !== lastS) {
            const sStr = s < 10 ? '0' + s : '' + s;
            secondsElements.forEach(el => el.textContent = sStr);
            lastS = s;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqList = document.querySelector('.faq-list');
    if (!faqList) return;

    // Event delegation instead of per-item listeners
    faqList.addEventListener('click', function(e) {
        const question = e.target.closest('.faq-question');
        if (!question) return;

        const item = question.parentElement;
        const wasActive = item.classList.contains('active');

        faqList.querySelectorAll('.faq-item.active').forEach(el => el.classList.remove('active'));

        if (!wasActive) {
            item.classList.add('active');
        }
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
                targetSection.querySelectorAll('.fade-in').forEach(el => {
                    el.classList.add('visible');
                });

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

    document.querySelectorAll('section:not(.hero-section) .fade-in').forEach(element => {
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
