/**
 * German Heller Portfolio - Main JavaScript
 * Handles animations, navigation, and interactions
 */

(function() {
  'use strict';

  // ==========================================
  // Intersection Observer for Animations
  // ==========================================
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.anim-fade-up');

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  };

  // ==========================================
  // Header Scroll Effect
  // ==========================================
  const headerScrollEffect = () => {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  };

  // ==========================================
  // Mobile Navigation
  // ==========================================
  const mobileNavigation = () => {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close nav on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.classList.remove('is-active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  };

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, '', href);
      });
    });
  };

  // ==========================================
  // Initialize
  // ==========================================
  const init = () => {
    // Wait for fonts to load for smoother animations
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        animateOnScroll();
      });
    } else {
      // Fallback for browsers without font loading API
      setTimeout(animateOnScroll, 100);
    }

    headerScrollEffect();
    mobileNavigation();
    smoothScroll();
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
