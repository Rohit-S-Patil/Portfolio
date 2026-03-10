/* =========================================
   Rohit Patil Portfolio - script.js
   ========================================= */

'use strict';

/* ---- Navbar: shrink on scroll + active link ---- */
const mainNav = document.getElementById('mainNav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  /* Shrink navbar */
  if (window.scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }

  /* Highlight active nav link */
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    if (
      scrollPos >= section.offsetTop &&
      scrollPos < section.offsetTop + section.offsetHeight
    ) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (active) active.classList.add('active');
    }
  });
});

/* ---- Smooth scroll for nav links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    /* Close mobile nav if open */
    const bsNavCollapse = document.getElementById('navbarNav');
    if (bsNavCollapse && bsNavCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(bsNavCollapse);
      if (bsCollapse) bsCollapse.hide();
    }

    window.scrollTo({
      top: target.offsetTop - 70,
      behavior: 'smooth'
    });
  });
});

/* ---- Typed text effect ---- */
const typedTarget = document.getElementById('typed-text');
if (typedTarget) {
  const phrases = [
    'Frontend Developer',
    'MERN Stack Enthusiast',
    'UI/UX Developer',
    'Problem Solver'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeLoop() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typedTarget.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedTarget.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 1600; /* pause before deleting */
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeLoop, typingSpeed);
  }

  setTimeout(typeLoop, 1200);
}

/* ---- Intersection Observer: scroll-reveal ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(
  '.timeline-item, .skill-card, .project-card'
).forEach(el => revealObserver.observe(el));

/* ---- Skill bars: animate on reveal ---- */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          /* Small delay so CSS transition plays after display */
          setTimeout(() => {
            fill.style.width = fill.dataset.pct + '%';
          }, 150);
        }
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.skill-card').forEach(card => {
  skillBarObserver.observe(card);
});

/* ---- Counter animation for about stats ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); /* ease-out-cubic */
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const aboutStatGrid = document.querySelector('.about-stat-grid');
if (aboutStatGrid) counterObserver.observe(aboutStatGrid);

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Basic validation */
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) return;

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending…';
    btn.disabled = true;

    /* Simulate sending (replace with real EmailJS / fetch call) */
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      contactForm.reset();

      if (formFeedback) {
        formFeedback.classList.add('success');
        formFeedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
        setTimeout(() => {
          formFeedback.classList.remove('success');
        }, 4000);
      }
    }, 1800);
  });
}

/* ---- Stagger skill cards on load ---- */
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
});

/* ---- Stagger project cards ---- */
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.12}s`;
});
