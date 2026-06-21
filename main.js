// T Balaji Logistics - Interactive Web Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initTrackingSimulator();
  initShippingCalculator();
  initContactForm();
});

/* ==========================================================================
   1. Navigation & Header Logic
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  // Header Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   2. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, no need to track it further
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    reveals.forEach(el => el.classList.add('active'));
  }
}

/* ==========================================================================
   3. Logistics Live Tracking Simulator
   ========================================================================== */
function initTrackingSimulator() {
  const trackForm = document.getElementById('trackForm');
  const trackInput = document.getElementById('trackInput');
  const trackResults = document.getElementById('trackResults');
  
  if (!trackForm || !trackInput || !trackResults) return;

  // Pre-configured simulated database
  const trackingDatabase = {
    'TB-8890-IND': {
      status: 'In Transit',
      statusClass: 'badge-in-transit',
      origin: 'Chennai Port (MAA)',
      destination: 'New Delhi ICD (DEL)',
      carrier: 'T Balaji Express Line',
      timeline: [
        { title: 'In Transit', desc: 'Arrived at Nagpur Transshipment Hub', time: 'Today, 02:40 PM', current: true },
        { title: 'Dispatched', desc: 'Departed Chennai Distribution Center', time: 'Yesterday, 08:30 AM', completed: true },
        { title: 'Customs Cleared', desc: 'Import formalities completed at Port', time: '20 Jun 2026, 11:15 AM', completed: true },
        { title: 'Shipment Received', desc: 'Container unloaded at Chennai Terminal', time: '19 Jun 2026, 04:20 PM', completed: true }
      ]
    },
    'TB-1024-GLO': {
      status: 'Delivered',
      statusClass: 'badge-delivered',
      origin: 'Mumbai Central Hub (BOM)',
      destination: 'Bengaluru Logistics Park (BLR)',
      carrier: 'T Balaji Logistics Fleet',
      timeline: [
        { title: 'Delivered', desc: 'Signed by: Security Desk Office', time: '20 Jun 2026, 10:45 AM', completed: true, current: false },
        { title: 'Out for Delivery', desc: 'Loaded on local delivery van', time: '20 Jun 2026, 07:15 AM', completed: true },
        { title: 'Arrived Hub', desc: 'Received at Bengaluru Gateway Hub', time: '19 Jun 2026, 09:30 PM', completed: true },
        { title: 'Dispatched', desc: 'Departed Mumbai Central Terminal', time: '18 Jun 2026, 02:00 AM', completed: true }
      ]
    }
  };

  trackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const trackCode = trackInput.value.trim().toUpperCase();
    if (!trackCode) return;

    // Simulate search animation
    trackResults.classList.add('results-hidden');
    
    // Check if tracking code exists, or generate a realistic dynamic tracking response if not in list
    let trackingInfo = trackingDatabase[trackCode];
    
    if (!trackingInfo) {
      // Generate a dynamic one so any code works and feels alive!
      trackingInfo = {
        status: 'In Transit',
        statusClass: 'badge-in-transit',
        origin: 'Mumbai Hub (BOM)',
        destination: 'Kolkata ICD (CCU)',
        carrier: 'T Balaji Freight Express',
        timeline: [
          { title: 'Transit Update', desc: `In transit via route hub for code ${trackCode}`, time: 'Today, 10:15 AM', current: true },
          { title: 'Dispatched', desc: 'Dispatched from origin fulfillment center', time: 'Yesterday, 09:00 AM', completed: true },
          { title: 'Shipment Registered', desc: 'Manifest file generated and cargo booked', time: '2 Days Ago, 03:30 PM', completed: true }
        ]
      };
    }

    setTimeout(() => {
      renderTrackingResults(trackCode, trackingInfo);
    }, 450); // slight delay for premium loading experience
  });

  function renderTrackingResults(code, info) {
    // Populate header info
    document.getElementById('resTrackingCode').textContent = code;
    
    const badge = document.getElementById('resStatusBadge');
    badge.textContent = info.status;
    badge.className = `status-badge ${info.statusClass}`;
    
    document.getElementById('resRoute').textContent = `${info.origin} → ${info.destination}`;
    document.getElementById('resCarrier').textContent = info.carrier;

    // Populate timeline
    const timelineEl = document.getElementById('resTimeline');
    timelineEl.innerHTML = '';

    info.timeline.forEach(step => {
      const node = document.createElement('div');
      node.className = 'timeline-node';
      if (step.completed) node.classList.add('completed');
      if (step.current) node.classList.add('current');

      node.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-info">
          <div>
            <div class="timeline-title">${step.title}</div>
            <div class="timeline-desc">${step.desc}</div>
          </div>
          <div class="timeline-time">${step.time}</div>
        </div>
      `;
      timelineEl.appendChild(node);
    });

    trackResults.classList.remove('results-hidden');
    trackResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   4. Shipping Cost Calculator
   ========================================================================== */
function initShippingCalculator() {
  const calcForm = document.getElementById('shippingCalcForm');
  
  if (!calcForm) return;

  const originSelect = document.getElementById('calcOrigin');
  const destSelect = document.getElementById('calcDest');
  const weightInput = document.getElementById('calcWeight');
  const serviceSelect = document.getElementById('calcService');
  
  const valCost = document.getElementById('resCalcCost');
  const valDays = document.getElementById('resCalcDays');
  const valRoute = document.getElementById('resCalcRoute');

  const baseRates = {
    'mumbai': { name: 'Mumbai Hub', rate: 1.0 },
    'delhi': { name: 'Delhi NCR Hub', rate: 1.2 },
    'chennai': { name: 'Chennai Hub', rate: 1.15 },
    'kolkata': { name: 'Kolkata Hub', rate: 1.25 },
    'bengaluru': { name: 'Bengaluru Hub', rate: 1.1 }
  };

  const serviceFactors = {
    'express': { name: 'Express Freight (Road)', multiplier: 1.2, baseDays: 2 },
    'economy': { name: 'Economy Ground', multiplier: 0.85, baseDays: 5 },
    'air': { name: 'Priority Air Freight', multiplier: 2.5, baseDays: 1 },
    'ocean': { name: 'FCL Cargo (Sea)', multiplier: 0.6, baseDays: 8 }
  };

  calcForm.addEventListener('input', calculateRates);
  if (weightInput) {
    weightInput.addEventListener('keyup', calculateRates);
  }

  function calculateRates() {
    const origin = originSelect.value;
    const dest = destSelect.value;
    const weight = parseFloat(weightInput.value) || 0;
    const service = serviceSelect.value;

    if (!origin || !dest || weight <= 0) {
      valCost.textContent = '₹0.00';
      valDays.textContent = '-- Days';
      valRoute.textContent = 'Select Origin & Destination';
      return;
    }

    if (origin === dest) {
      valCost.textContent = '₹0.00';
      valDays.textContent = '-- Days';
      valRoute.textContent = 'Origin and destination match';
      return;
    }

    // Dynamic cost logic
    const originDetails = baseRates[origin];
    const destDetails = baseRates[dest];
    const serviceDetails = serviceFactors[service];

    // Distance calculation logic (mock based on hub rates differences)
    const factorDiff = Math.abs(originDetails.rate - destDetails.rate) + 0.5;
    const estimatedDistanceKm = Math.round(factorDiff * 1400);

    // Rate = Base distance cost + (weight * multiplier)
    const distanceCost = estimatedDistanceKm * 2;
    const weightCost = weight * 15 * serviceDetails.multiplier;
    const totalCost = Math.round((distanceCost + weightCost) * serviceDetails.multiplier);

    // Delivery days calculation
    let deliveryDays = serviceDetails.baseDays + Math.round(factorDiff * 2);
    if (deliveryDays < 1) deliveryDays = 1;

    // Counter animation for cost
    animateCounter(valCost, parseInt(valCost.textContent.replace(/[^\d]/g, '')) || 0, totalCost, '₹');
    valDays.textContent = `${deliveryDays} ${deliveryDays === 1 ? 'Day' : 'Days'}`;
    valRoute.textContent = `${originDetails.name} to ${destDetails.name} (~${estimatedDistanceKm} km)`;
  }

  // Initial calculation trigger if populated
  calculateRates();
}

function animateCounter(element, start, end, prefix = '') {
  let current = start;
  const range = end - start;
  const duration = 400; // ms
  const stepTime = 16; // ~60fps
  const steps = duration / stepTime;
  const increment = range / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current += increment;
    
    if (step >= steps) {
      clearInterval(timer);
      element.textContent = prefix + end.toLocaleString('en-IN');
    } else {
      element.textContent = prefix + Math.round(current).toLocaleString('en-IN');
    }
  }, stepTime);
}

/* ==========================================================================
   5. Interactive Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('submitSuccessMsg');

  if (!contactForm || !successMsg) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check basic inputs
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const msg = document.getElementById('formMessage').value.trim();

    if (!name || !email || !msg) return;

    // Simulate sending progress on the button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 38 38" stroke="#080c14" style="animation: rotate 1s linear infinite">
        <g fill="none" fill-rule="evenodd">
          <g transform="translate(1 1)" stroke-width="3">
            <circle stroke-opacity=".2" cx="18" cy="18" r="18"/>
            <path d="M36 18c0-9.94-8.06-18-18-18"/>
          </g>
        </g>
      </svg>
      Sending Inquiry...
    `;

    setTimeout(() => {
      // Success feedback
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      successMsg.textContent = `Thank you, ${name}! Your logistics inquiry has been received. Our team will contact you at ${email} shortly.`;
      successMsg.style.display = 'block';

      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        successMsg.style.opacity = '0';
        successMsg.style.transition = 'opacity 1s ease';
        setTimeout(() => {
          successMsg.style.display = 'none';
          successMsg.style.opacity = '1';
        }, 1000);
      }, 7000);

    }, 1500);
  });
}
