/**
 * German Heller Portfolio - Main JavaScript
 * Handles animations, navigation, and interactions
 */

(function() {
  'use strict';

  // ==========================================
  // Geometric Network Background
  // ==========================================
  const createNetworkBackground = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'network-bg';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.4;
    `;
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;

    const config = {
      nodeCount: 60,
      nodeSize: { min: 1, max: 2.5 },
      speed: 0.3,
      connectionDistance: 150,
      nodeColor: '115, 115, 115',
      lineColor: '163, 163, 163'
    };

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (config.nodeSize.max - config.nodeSize.min) + config.nodeSize.min;
        this.speedX = (Math.random() - 0.5) * config.speed;
        this.speedY = (Math.random() - 0.5) * config.speed;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.depth = Math.random();
      }

      update() {
        // Subtle mouse interaction
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius * 0.02;
            this.x -= dx * force;
            this.y -= dy * force;
          }
        }

        this.x += this.speedX * (0.5 + this.depth * 0.5);
        this.y += this.speedY * (0.5 + this.depth * 0.5);

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.nodeColor}, ${this.opacity})`;
        ctx.fill();
      }
    }

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const initNodes = () => {
      nodes = [];
      const count = Math.min(config.nodeCount, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) {
        nodes.push(new Node());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.connectionDistance) {
            const opacity = (1 - dist / config.connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${config.lineColor}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      drawConnections();
      animationId = requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener('resize', () => {
      resize();
      initNodes();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Reduce animation when tab not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.opacity = '0.2';
      resize();
      initNodes();
      nodes.forEach(node => node.draw());
      drawConnections();
      return;
    }

    resize();
    initNodes();
    animate();
  };

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
    // Create network background
    createNetworkBackground();

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
