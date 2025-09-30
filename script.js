// script.js
document.addEventListener('DOMContentLoaded', function () {
  /* Mobile nav toggle (works for all toggle buttons) */
  function initNavToggle(toggleId) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      const nav = document.getElementById('primary-nav');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  initNavToggle('nav-toggle');
  initNavToggle('nav-toggle-2');
  initNavToggle('nav-toggle-3');

  /* Smooth scroll for internal anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* Slider implementation */
  (function () {
    const slidesWrapper = document.getElementById('slides');
    const slides = slidesWrapper ? slidesWrapper.querySelectorAll('.slide') : [];
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.getElementById('slider-dots');
    if (!slidesWrapper || slides.length === 0) return;

    let current = 0;
    let autoplayInterval = null;

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
        btn.addEventListener('click', () => goTo(i));
        if (i === 0) btn.classList.add('active');
        dotsContainer.appendChild(btn);
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      Array.from(dotsContainer.children).forEach((b, i) => {
        b.classList.toggle('active', i === current);
      });
    }

    function show() {
      const width = slidesWrapper.clientWidth;
      slidesWrapper.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    }

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      show();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    // keyboard navigation for slider
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // autoplay
    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(next, 4500);
    }
    function stopAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
    }

    renderDots();
    show();
    startAutoplay();

    // pause on hover
    const slider = document.querySelector('.slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
    }

    // reposition on resize
    window.addEventListener('resize', show);
  })();

  /* Simple form validation (contact form) */
  (function () {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const messages = document.getElementById('form-messages');

    function showMessage(text, type = 'error') {
      messages.textContent = text;
      messages.style.color = type === 'error' ? '#b91c1c' : '#064e3b';
    }

    form.addEventListener('submit', function (e) {
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      const phone = form.querySelector('#phone');

      let errors = [];

      if (!name || name.value.trim().length < 2) {
        errors.push('Please enter your name (at least 2 characters).');
      }
      if (!email || !/^\S+@\S+\.\S+$/.test(email.value)) {
        errors.push('Please enter a valid email address.');
      }
      if (!message || message.value.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters).');
      }
      if (phone && phone.value.trim().length > 0 && !/^\+?\d{7,15}$/.test(phone.value)) {
        errors.push('Phone number looks invalid — use digits, e.g. +254712345678.');
      }

      if (errors.length > 0) {
        e.preventDefault();
        showMessage(errors.join(' '), 'error');
        // focus the first invalid field
        if (name && name.value.trim().length < 2) name.focus();
        else if (email && !/^\S+@\S+\.\S+$/.test(email.value)) email.focus();
        else if (message && message.value.trim().length < 10) message.focus();
        return false;
      } else {
        // let the form submit to Formspree
        showMessage('Sending message…', 'success');
        // Optionally show success after short delay (form will actually submit)
        setTimeout(() => showMessage('If your form does not send, please check your internet connection or try again.' , 'success'), 2500);
      }
    });
  })();
});
