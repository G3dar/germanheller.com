/**
 * Smooth Scroll & Navigation
 * Handles smooth scrolling and mobile navigation
 */

(function() {
  'use strict';

  const HEADER_HEIGHT = 64; // Height of fixed header in pixels

  /**
   * Smooth scroll to element
   */
  function scrollToElement(element, offset = HEADER_HEIGHT) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, targetPosition);
    } else {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Handle anchor link clicks
   */
  function handleAnchorClick(e) {
    const href = this.getAttribute('href');

    // Only handle internal anchor links
    if (!href || !href.startsWith('#')) return;

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      e.preventDefault();
      scrollToElement(targetElement);

      // Update URL hash without jumping
      history.pushState(null, '', href);

      // Close mobile menu if open
      closeMobileMenu();

      // Focus management for accessibility
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    }
  }

  /**
   * Mobile menu toggle
   */
  function toggleMobileMenu() {
    const nav = document.querySelector('.header__nav');
    const toggle = document.querySelector('.header__menu-toggle');

    if (nav && toggle) {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);

      // Trap focus in menu when open
      if (isOpen) {
        nav.querySelector('a')?.focus();
      }
    }
  }

  function closeMobileMenu() {
    const nav = document.querySelector('.header__nav');
    const toggle = document.querySelector('.header__menu-toggle');

    if (nav && toggle) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Handle scroll-based header styling
   */
  function handleScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  /**
   * Initialize scroll on hash
   */
  function handleInitialHash() {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Delay to ensure page is fully loaded
        setTimeout(() => {
          scrollToElement(targetElement);
        }, 100);
      }
    }
  }

  /**
   * Initialize
   */
  function init() {
    // Set up anchor link handlers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    // Set up mobile menu toggle
    const menuToggle = document.querySelector('.header__menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Close mobile menu on click outside
    document.addEventListener('click', (e) => {
      const nav = document.querySelector('.header__nav');
      const toggle = document.querySelector('.header__menu-toggle');

      if (nav && toggle && nav.classList.contains('is-open')) {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Handle scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Handle initial hash
    handleInitialHash();

    // Initial scroll check
    handleScroll();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose scrollTo function globally
  window.smoothScrollTo = scrollToElement;

})();
