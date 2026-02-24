/* ================================================================
   THE RIYASAT EVENTS — Script
   Form handling, animations, particles, navigation
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Loader ----
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
  // Fallback: hide loader after 3s max
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (scrollY > 500) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Hamburger Menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll-triggered Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-children');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Guest Count Slider ----
  const guestSlider = document.getElementById('guestCount');
  const guestDisplay = document.getElementById('guestDisplay');

  if (guestSlider && guestDisplay) {
    guestSlider.addEventListener('input', () => {
      const val = parseInt(guestSlider.value);
      guestDisplay.textContent = val >= 2000 ? '2000+' : val;
    });
  }

  // ---- Enquiry Form — Email via Web3Forms ----
  const form = document.getElementById('enquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const eventType = document.getElementById('eventType').value;

    if (!name || !phone || !eventType) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    // Collect form data
    const formData = new FormData(form);

    // Collect checked services
    const services = [];
    form.querySelectorAll('input[name="services"]:checked').forEach(cb => {
      services.push(cb.value);
    });
    formData.set('services', services.join(', ') || 'None selected');
    formData.set('guest_count', guestSlider.value);

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Sending...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        showStatus('✅ Thank you! Your enquiry has been sent. We\'ll get back to you within 24 hours.', 'success');
        form.reset();
        guestDisplay.textContent = '100';
        guestSlider.value = 100;

        // Track in GA
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submission', {
            event_category: 'enquiry',
            event_label: eventType,
          });
        }
      } else {
        showStatus('❌ Something went wrong. Please try WhatsApp or email us directly.', 'error');
      }
    } catch (err) {
      showStatus('❌ Network error. Please try WhatsApp or email us directly at theriyasatevents@gmail.com', 'error');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '✉️ Send Enquiry';
  });

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;
    setTimeout(() => {
      formStatus.className = 'form-status';
    }, 8000);
  }

  // ---- WhatsApp Button ----
  const whatsappBtn = document.getElementById('whatsappBtn');

  whatsappBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim() || 'Not provided';
    const phone = document.getElementById('phone').value.trim() || 'Not provided';
    const email = document.getElementById('email').value.trim() || 'Not provided';
    const eventType = document.getElementById('eventType').value || 'Not selected';
    const eventDate = document.getElementById('eventDate').value || 'Not selected';
    const guests = guestSlider.value;
    const message = document.getElementById('message').value.trim() || 'None';

    const services = [];
    form.querySelectorAll('input[name="services"]:checked').forEach(cb => {
      services.push(cb.value);
    });

    const whatsappMessage = `Hello! I'd like to enquire about an event.

*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Event Type:* ${eventType}
*Preferred Date:* ${eventDate}
*Estimated Guests:* ${guests}
*Services Needed:* ${services.length ? services.join(', ') : 'Not selected'}
*Additional Details:* ${message}

Looking forward to hearing from you!`;

    const encoded = encodeURIComponent(whatsappMessage);
    // Opens WhatsApp with pre-filled message (no phone number — user picks contact)
    // Replace with your business number: wa.me/91XXXXXXXXXX
    window.open(`https://wa.me/?text=${encoded}`, '_blank');

    // Track in GA
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', {
        event_category: 'enquiry',
        event_label: eventType,
      });
    }
  });

  // ---- Floating Particles on Hero ----
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      const hero = document.getElementById('hero');
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.growing = Math.random() > 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.growing) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= 0.7) this.growing = false;
        } else {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0) this.reset();
        }

        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 212, 139, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 8000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    }
    animate();

    // Pause when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) animate();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    });
    heroObserver.observe(document.getElementById('hero'));
  }

  // ---- Set min date to today for date picker ----
  const dateInput = document.getElementById('eventDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

});
