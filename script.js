const header = document.getElementById('stickyHeader');
const hero = document.getElementById('hero');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mcTrack = document.getElementById('mcTrack');
const mcPrev = document.getElementById('mcPrev');
const mcNext = document.getElementById('mcNext');
const mcDots = document.getElementById('mcDots');
const mcThumbs = document.getElementById('mcThumbs');
const zoomPanel = document.getElementById('zoomPanel');
const zpImg = document.getElementById('zpImg');
const appsViewport = document.getElementById('appsViewport');
const appsPrev = document.getElementById('appsPrev');
const appsNext = document.getElementById('appsNext');
const procTabs = document.querySelectorAll('.proc-tab');
const procPanels = document.querySelectorAll('.proc-panel');
const faqButtons = document.querySelectorAll('.faq-q');
const contactForm = document.getElementById('contactForm');

let activeSlide = 0;
const slides = mcTrack ? Array.from(mcTrack.querySelectorAll('.mc-slide')) : [];
const thumbs = mcThumbs ? Array.from(mcThumbs.querySelectorAll('.mc-thumb')) : [];
const dots = mcDots ? Array.from(mcDots.querySelectorAll('.mc-dot')) : [];

function updateCarousel(index) {
  if (!mcTrack || slides.length === 0) return;
  activeSlide = ((index % slides.length) + slides.length) % slides.length;
  mcTrack.style.transform = `translateX(-${activeSlide * 100}%)`;

  dots.forEach((dot, idx) => {
    const isActive = idx === activeSlide;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive.toString());
  });

  thumbs.forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === activeSlide);
  });

  const activeImage = slides[activeSlide].querySelector('img');
  if (activeImage && zpImg) {
    zpImg.src = activeImage.src;
  }
}

if (mcPrev) mcPrev.addEventListener('click', () => updateCarousel(activeSlide - 1));
if (mcNext) mcNext.addEventListener('click', () => updateCarousel(activeSlide + 1));

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    updateCarousel(Number(dot.dataset.idx));
  });
});

thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    updateCarousel(Number(thumb.dataset.idx));
  });
});

const carousel = document.getElementById('mc');
if (carousel && zoomPanel) {
  carousel.addEventListener('mouseenter', () => zoomPanel.classList.add('show'));
  carousel.addEventListener('mouseleave', () => zoomPanel.classList.remove('show'));
  carousel.addEventListener('mousemove', event => {
    const rect = carousel.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const percentX = Math.round((x / rect.width) * 100);
    const percentY = Math.round((y / rect.height) * 100);
    if (zpImg) {
      zpImg.style.objectPosition = `${percentX}% ${percentY}%`;
    }
  });
}

let lastScroll = 0;
window.addEventListener('scroll', () => {
  if (!hero || !header) return;
  const current = window.scrollY;
  const threshold = hero.offsetHeight * 0.25;
  const isBelowFold = current > threshold;
  const isScrollingDown = current > lastScroll;

  header.classList.toggle('visible', isBelowFold && isScrollingDown);
  lastScroll = current;
});

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', (!open).toString());
    hamburger.setAttribute('aria-expanded', open.toString());
  });
}

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

if (appsViewport && appsPrev && appsNext) {
  appsPrev.addEventListener('click', () => {
    appsViewport.scrollBy({ left: -appsViewport.clientWidth * 0.8, behavior: 'smooth' });
  });
  appsNext.addEventListener('click', () => {
    appsViewport.scrollBy({ left: appsViewport.clientWidth * 0.8, behavior: 'smooth' });
  });
}

procTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const panel = tab.dataset.panel;
    procTabs.forEach(button => {
      const isActive = button === tab;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive.toString());
    });

    procPanels.forEach(panelEl => {
      const isActive = panelEl.id === `pp-${panel}`;
      panelEl.classList.toggle('active', isActive);
    });
  });
});

faqButtons.forEach(button => {
  const item = button.closest('.faq-item');
  if (!item) return;
  const answer = item.querySelector('.faq-ans');
  button.addEventListener('click', () => {
    const open = item.classList.toggle('active');
    button.setAttribute('aria-expanded', open.toString());
    if (answer) {
      answer.style.maxHeight = open ? `${answer.scrollHeight}px` : '0px';
    }
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    alert('Thanks! Your request has been submitted. We will contact you shortly.');
    contactForm.reset();
  });
}

window.addEventListener('load', () => {
  updateCarousel(0);
  faqButtons.forEach(button => {
    const item = button.closest('.faq-item');
    if (!item) return;
    const answer = item.querySelector('.faq-ans');
    if (answer) answer.style.maxHeight = '0px';
  });
});
