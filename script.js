const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const body = document.body;
body.classList.add('is-loading');
const header = document.querySelector('header');
const progress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
const timeline = document.querySelector('[data-timeline]');
const timelineItems = timeline ? [...timeline.querySelectorAll('[data-timeline-item]')] : [];
const loader = document.querySelector('.loader');
const terminalLog = document.querySelector('[data-terminal-log]');
const loaderProgress = document.querySelector('[data-loader-progress]');
const loaderPercent = document.querySelector('[data-loader-percent]');
const loaderStatus = document.querySelector('[data-loader-status]');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const updateTimeline = () => {
    if (!timeline) return;
    const bounds = timeline.getBoundingClientRect();
    const trigger = window.innerHeight * .68;
    const progressValue = clamp(((trigger - bounds.top) / bounds.height) * 100, 0, 100);
    timeline.style.setProperty('--timeline-progress', `${progressValue}%`);
    let activeItem = null;
    timelineItems.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top;
        const complete = itemTop < trigger;
        item.classList.toggle('is-complete', complete);
        if (complete && itemTop > window.innerHeight * .25) activeItem = item;
    });
    timelineItems.forEach((item) => item.classList.toggle('is-active', item === activeItem));
};

const bootMessages = [
    ['INITIALIZING SYSTEM...', false],
    ['LOADING SECURITY MODULES...', false],
    ['ESTABLISHING SECURE CONNECTION...', false],
    ['SCANNING DIGITAL ENVIRONMENT...', false],
    ['NETWORK INTERFACES INITIALIZED', false],
    ['ACCESS GRANTED', true]
];
const revealIdentity = () => document.querySelector('[data-identity-name]')?.classList.add('is-revealed');
const finishTerminalBoot = () => {
    loader?.classList.add('is-hidden');
    body.classList.remove('is-loading');
    revealIdentity();
};
const startTerminalBoot = () => {
    if (!loader) {
        revealIdentity();
        return;
    }
    if (reducedMotion) {
        bootMessages.forEach(([message, success]) => {
            const line = document.createElement('span');
            line.className = `terminal-line${success ? ' is-success' : ''}`;
            line.textContent = message;
            terminalLog?.appendChild(line);
        });
        if (loaderProgress) loaderProgress.style.transform = 'scaleX(1)';
        if (loaderPercent) loaderPercent.textContent = '100%';
        finishTerminalBoot();
        return;
    }
    let messageIndex = 0;
    const messageTimer = window.setInterval(() => {
        const [message, success] = bootMessages[messageIndex];
        const line = document.createElement('span');
        line.className = `terminal-line${success ? ' is-success' : ''}`;
        line.textContent = message;
        terminalLog?.appendChild(line);
        if (loaderStatus) loaderStatus.textContent = success ? 'ACCESS GRANTED' : message.replace('...', '');
        messageIndex += 1;
        if (messageIndex === bootMessages.length) window.clearInterval(messageTimer);
    },850);
    const started = performance.now();
    const progressTimer = window.setInterval(() => {
        const percentage = Math.min(Math.round(((performance.now() - started) / 6000) * 100), 100);
        if (loaderProgress) loaderProgress.style.transform = `scaleX(${percentage / 100})`;
        if (loaderPercent) loaderPercent.textContent = `${percentage}%`;
        if (percentage === 100) window.clearInterval(progressTimer);
    }, 24);
    window.setTimeout(() => {
        finishTerminalBoot();
    }, 6000);
};
startTerminalBoot();

const updateScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
    header.classList.toggle('scrolled', window.scrollY > 24);
    backToTop.classList.toggle('visible', window.scrollY > 500);
    updateTimeline();
};
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const menuIcon = document.getElementById('menu-icon');
const navList = document.querySelector('.navlist');
if (menuIcon && navList) {
    const closeMenu = () => {
        navList.classList.remove('show');
        menuIcon.classList.replace('bx-x', 'bx-menu');
        menuIcon.setAttribute('aria-expanded', 'false');
        menuIcon.setAttribute('aria-label', 'Open navigation menu');
    };
    menuIcon.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('show');
        menuIcon.classList.toggle('bx-menu', !isOpen);
        menuIcon.classList.toggle('bx-x', isOpen);
        menuIcon.setAttribute('aria-expanded', String(isOpen));
        menuIcon.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
    navList.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
}

const words = [...document.querySelectorAll('.word')];
let wordIndex = 0;
const showWord = (index) => words.forEach((word, i) => word.classList.toggle('current', i === index));
if (words.length) {
    showWord(0);
    if (!reducedMotion) window.setInterval(() => {
        wordIndex = (wordIndex + 1) % words.length;
        showWord(wordIndex);
    }, 2600);
}

document.querySelectorAll('.circle').forEach((circle) => {
    circle.style.setProperty('--percent', circle.dataset.percent || '0');
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: .12 });
document.querySelectorAll('.reveal, .stagger').forEach((element) => revealObserver.observe(element));
updateTimeline();

const textRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, { threshold: .35 });
document.querySelectorAll('[data-animate-text]').forEach((element) => {
    const text = element.textContent.trim();
    element.textContent = '';
    element.classList.add('text-reveal');
    [...text].forEach((character, index) => {
        const span = document.createElement('span');
        span.className = 'text-char';
        span.style.setProperty('--char-index', index);
        span.textContent = character === ' ' ? '\u00a0' : character;
        element.appendChild(span);
    });
    if (reducedMotion) element.classList.add('is-visible');
    else textRevealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.navlist a').forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;
        document.querySelectorAll('.port-box[data-category]').forEach((card) => {
            card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
        });
    });
});

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.port-box').forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - .5;
            const y = (event.clientY - bounds.top) / bounds.height - .5;
            card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-6px)`;
        });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
}

const themeToggle = document.querySelector('.theme-toggle');
const storedTheme = localStorage.getItem('portfolio-theme');
if (storedTheme === 'light') body.classList.add('light-theme');
const updateThemeLabel = () => {
    const isLight = body.classList.contains('light-theme');
    themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    if (themeToggle) themeToggle.innerHTML = `<i class='bx ${isLight ? 'bx-moon' : 'bx-sun'}'></i>`;
};
updateThemeLabel();
themeToggle?.addEventListener('click', () => {
    body.classList.add('theme-transition');
    body.classList.toggle('light-theme');
    localStorage.setItem('portfolio-theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    updateThemeLabel();
    window.setTimeout(() => body.classList.remove('theme-transition'), 400);
});

const contactForm = document.querySelector('.contactme form');
contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = contactForm.querySelector('.form-status');
    if (status) status.textContent = 'The form is ready to connect to a backend. No message was sent.';
});

const emailElement = document.getElementById('email');
emailElement?.addEventListener('click', async () => {
    const email = emailElement.dataset.email || emailElement.textContent.trim();
    try {
        await navigator.clipboard.writeText(email);
        emailElement.textContent = 'Copied to clipboard';
        window.setTimeout(() => { emailElement.textContent = email; }, 1400);
    } catch (error) {
        console.error('Copy failed', error);
    }
});

async function fetchAndDownload(url, filename) {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const blobUrl = URL.createObjectURL(await response.blob());
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
        console.error('Download failed', error);
        window.location.href = url;
    }
}
document.querySelectorAll('.js-download-cv').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        fetchAndDownload(link.href, link.dataset.filename || link.download);
    });
});
