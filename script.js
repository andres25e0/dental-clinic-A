/**
 * CLINICA DENTAL DR. CESAR - SCRIPT
 * Premium Dental Clinic Website Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // ============================================
  // NAVIGATION
  // ============================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar scroll effect
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Mobile menu toggle
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('mobile-open');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('mobile-open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('mobile-open')) {
        toggleMobileMenu();
      }
    });
  });

  // Active nav link on scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const animateElements = document.querySelectorAll('[data-animate]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => {
    // Skip hero elements that have their own animation
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    
    const heroSection = document.querySelector('.hero');
    const heroRect = heroSection.getBoundingClientRect();
    
    if (heroRect.bottom > 0) {
      countersAnimated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease out quart
          const easeOut = 1 - Math.pow(1 - progress, 4);
          const current = Math.floor(easeOut * target);
          
          counter.textContent = current.toLocaleString();
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }
        
        requestAnimationFrame(updateCounter);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters(); // Check on load

  // ============================================
  // SERVICES FILTER
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter cards
      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ============================================
  // TESTIMONIALS SLIDER
  // ============================================
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonials-dots .dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
      card.classList.remove('active');
      testimonialDots[i].classList.remove('active');
    });
    
    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(next);
  }

  function prevTestimonial() {
    const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(prev);
  }

  function startTestimonialAutoplay() {
    testimonialInterval = setInterval(nextTestimonial, 6000);
  }

  function stopTestimonialAutoplay() {
    clearInterval(testimonialInterval);
  }

  prevBtn.addEventListener('click', () => {
    stopTestimonialAutoplay();
    prevTestimonial();
    startTestimonialAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    stopTestimonialAutoplay();
    nextTestimonial();
    startTestimonialAutoplay();
  });

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopTestimonialAutoplay();
      showTestimonial(index);
      startTestimonialAutoplay();
    });
  });

  startTestimonialAutoplay();

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
      });
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ============================================
  // CONTACT FORM
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset errors
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });
      
      let hasError = false;
      
      // Validate nombre
      const nombre = document.getElementById('nombre');
      if (!nombre.value.trim()) {
        nombre.closest('.form-group').classList.add('error');
        hasError = true;
      }
      
      // Validate telefono
      const telefono = document.getElementById('telefono');
      if (!telefono.value.trim()) {
        telefono.closest('.form-group').classList.add('error');
        hasError = true;
      }
      
      // Validate email if provided
      const email = document.getElementById('email');
      if (email.value.trim() && !isValidEmail(email.value)) {
        email.closest('.form-group').classList.add('error');
        hasError = true;
      }
      
      if (hasError) return;
      
      // Simulate submission
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.style.display = 'none';
        formSuccess.classList.add('active');
        
        // Reset form after delay
        setTimeout(() => {
          contactForm.reset();
          submitBtn.style.display = 'flex';
          submitBtn.disabled = false;
          formSuccess.classList.remove('active');
        }, 5000);
      }, 2000);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Real-time validation on input
  document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('input', function() {
      this.closest('.form-group').classList.remove('error');
    });
  });

  // ============================================
  // BACK TO TOP
  // ============================================
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ============================================
  // PARALLAX EFFECT FOR HERO
  // ============================================
  const heroBg = document.querySelector('.hero-bg img');
  
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    }, { passive: true });
  }

  // ============================================
  // MOUSE PARALLAX FOR FLOATING ELEMENTS
  // ============================================
  const floatingElements = document.querySelector('.floating-elements');
  
  if (floatingElements && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      document.querySelectorAll('.float-circle').forEach((circle, i) => {
        const factor = (i + 1) * 0.5;
        circle.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
  }

  // ============================================
  // WHATSAPP FLOAT BUTTON INTERACTION
  // ============================================
  const whatsappFloat = document.querySelector('.whatsapp-float');
  
  if (whatsappFloat) {
    // Show tooltip briefly on first visit
    if (!sessionStorage.getItem('whatsappTooltipShown')) {
      setTimeout(() => {
        whatsappFloat.classList.add('show-tooltip');
        setTimeout(() => {
          whatsappFloat.classList.remove('show-tooltip');
        }, 4000);
      }, 3000);
      sessionStorage.setItem('whatsappTooltipShown', 'true');
    }
  }

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ============================================
  // REDUCED MOTION SUPPORT
  // ============================================
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable complex animations
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('animated');
      el.style.transition = 'none';
    });
  }
});

// ============================================
// CSS KEYFRAME INJECTION FOR DYNAMIC ANIMATIONS
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .show-tooltip .whatsapp-tooltip {
    opacity: 1 !important;
    visibility: visible !important;
    right: 75px !important;
  }
`;
document.head.appendChild(styleSheet);
