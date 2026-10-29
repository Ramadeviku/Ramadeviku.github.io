/**
 * Rama Devi - Senior .NET Full Stack Developer & Cloud Architect
 * High-Interactivity Mission Control Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initThemeSwitcher();
  initSoundEffects();
  init3DCardTilt();
  initHeroSparkline();
  initSkillsFilter();
  initModals();
  initClipboard();
  initNavScroll();
});

/* ==========================================================================
   1. PARTICLE MESH CANVAS (Interactive Starfield / Network)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 160 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.density = (Math.random() * 30) + 1;
    }

    draw() {
      const accent = getComputedStyle(document.body).getPropertyValue('--accent') || '#00f2fe';
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * this.density * 0.4;
          this.y -= (dy / dist) * force * this.density * 0.4;
        }
      }
    }
  }

  const count = Math.min(Math.floor(window.innerWidth / 16), 75);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const opacity = (1 - dist / 130) * 0.22;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. DYNAMIC ROTATING TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const roles = [
    'Senior .NET Full Stack Developer',
    'Enterprise Cloud Architect (Azure & AWS)',
    '.NET 10 & Microservices Specialist',
    'FHIR Healthcare & AI Copilot Integrator',
    'Modern React & Blazor UI Engineer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const role = roles[roleIdx];
    if (isDeleting) {
      typingEl.textContent = role.substring(0, charIdx - 1);
      charIdx--;
      speed = 45;
    } else {
      typingEl.textContent = role.substring(0, charIdx + 1);
      charIdx++;
      speed = 90;
    }

    if (!isDeleting && charIdx === role.length) {
      isDeleting = true;
      speed = 2200;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   3. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const dots = document.querySelectorAll('.theme-dot');
  const saved = localStorage.getItem('rama-theme') || 'cyan';
  setTheme(saved);

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const t = d.getAttribute('data-theme');
      setTheme(t);
      playUiSound('click');
    });
  });

  function setTheme(t) {
    if (t === 'cyan') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', t);
    }
    localStorage.setItem('rama-theme', t);
  }
}

/* ==========================================================================
   4. WEB AUDIO SYNTHESIZED SOUND EFFECTS
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEffects() {
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      btn.innerHTML = soundEnabled 
        ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>`
        : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      showToast(soundEnabled ? 'Audio Feedback Enabled' : 'Audio Feedback Muted');
    });
  }
}

function playUiSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'dispatch') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(940, now + 0.22);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {}
}

/* ==========================================================================
   5. 3D CARD TILT PHYSICS (Hero Visual Card)
   ========================================================================== */
function init3DCardTilt() {
  const card = document.querySelector('.hero-visual-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  });
}

/* ==========================================================================
   6. HERO LIVE TELEMETRY SPARKLINE
   ========================================================================== */
function initHeroSparkline() {
  const canvas = document.getElementById('hero-sparkline-canvas');
  const valEl = document.getElementById('hero-sparkline-val');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = 140;
  canvas.height = 35;

  let points = [12, 16, 14, 22, 19, 28, 24, 30, 26, 32, 29, 35, 31, 38, 34];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const step = canvas.width / (points.length - 1);
    for (let i = 0; i < points.length; i++) {
      const x = i * step;
      const y = canvas.height - (points[i] / 50) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fill gradient
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  setInterval(() => {
    const next = Math.max(15, Math.min(48, points[points.length - 1] + (Math.random() - 0.48) * 8));
    points.shift();
    points.push(next);
    draw();
    if (valEl) {
      valEl.textContent = `${Math.round(next * 120)} req/s`;
    }
  }, 450);

  draw();
}

/* ==========================================================================
   7. SKILLS FILTER MATRIX
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });

      playUiSound('click');
    });
  });
}

/* ==========================================================================
   10. CASE STUDY MODALS
   ========================================================================== */
const projectDetailsData = {
  cvs: {
    title: 'CVS Health Enterprise Modernization & AI Copilot Suite',
    client: 'AETNA / CVS Health (Texas) • July 2025 - Present',
    tags: ['.NET 10', 'ASP.NET Core', 'AWS Lambda', 'EventBridge', 'FHIR / HIPAA', 'Microsoft Copilot', '.NET MAUI'],
    overview: 'Led the enterprise transformation of critical healthcare microservices and modern UI systems handling sensitive patient workflows, prescription fulfillment, and cross-organization integrations.',
    challenge: 'Transition legacy .NET 8 monoliths into decoupled .NET 10 microservices, adhere to strict HIPAA and FHIR interoperability standards, and wire up AI Copilot capabilities without downtime.',
    solution: 'Designed event-driven pipelines utilizing Amazon EventBridge, AWS Lambda, S3, and DynamoDB alongside SQL Server. Upgraded application frameworks to .NET 10 with asynchronous caching, SignalR real-time event distribution, and Microsoft Copilot agent integration for automated clinical query handling. Built cross-platform mobile functionality via .NET MAUI.',
    metrics: [
      { label: 'Latency Reduction', val: '45%' },
      { label: 'Throughput', val: '10k+ req/sec' },
      { label: 'Compliance', val: '100% HIPAA/FHIR' },
      { label: 'Release Cycle', val: 'Automated CI/CD' }
    ]
  },
  microsoft: {
    title: 'Microsoft Substrate DCS & Flighting Platform',
    client: 'Microsoft (Redmond, WA) • August 2020 - January 2022',
    tags: ['C# .NET', 'Azure Service Bus', 'Azure Redis', 'Purview DCS', 'Exchange Online', 'Microservices'],
    overview: 'Engineered high-scale core systems running across Microsoft Exchange Online (EXO) and Purview Substrate, managing feature rollouts and sensitive data protection.',
    challenge: 'Enforcing mailbox throttling limits at cloud scale (10,000+ daily limit defaults) while running real-time Data Classification Service (DCS) for Data Loss Prevention (DLP) across Microsoft 365 services with sub-second SLA.',
    solution: 'Architected distributed event-driven microservices on Azure with Entity Framework Core, Redis Cache, Application Gateway, and weighted routing DNS. Implemented runtime policy management and gradual feature flighting for multi-million user cohorts.',
    metrics: [
      { label: 'DCS Scale', val: 'Millions M365 docs' },
      { label: 'Throttling Accuracy', val: '99.99%' },
      { label: 'Rollout Safety', val: 'Instant Flag Rollback' },
      { label: 'Availability', val: '99.999%' }
    ]
  },
  lacoe: {
    title: 'LACOE Statewide Education Data Exchange Platform',
    client: 'Los Angeles County Office of Education (LACOE) • Jan 2022 - July 2025',
    tags: ['ASP.NET Core', 'Angular 19', 'Blazor WASM', 'RabbitMQ', 'AKS', 'OAuth 2.0 / SSO', 'Power BI'],
    overview: 'Architected and modernized public-sector K-12 education platforms supporting administrative workflows, data compliance, and multi-department interoperability.',
    challenge: 'Ensuring seamless IFC sign data exchange between educational departments, third-party state agencies, and K-12 school districts with strict role-based access control and legacy data reconciliation.',
    solution: 'Developed the central Data Exchange Layer in ASP.NET Core with RabbitMQ queuing, AKS microservices, and modern UI dashboards using Angular 19 and Blazor WebAssembly. Created Power BI analytical dashboards for county stakeholders.',
    metrics: [
      { label: 'Districts Served', val: '80+ K-12 Districts' },
      { label: 'Data Processing', val: 'Real-time Async' },
      { label: 'Security', val: 'SSO & OAuth 2.0' },
      { label: 'UI Modernization', val: 'Angular 19 + Blazor' }
    ]
  },
  nationwide: {
    title: 'Nationwide Enterprise Quotation & Policy Engine',
    client: 'Nationwide Pet Insurance (Los Angeles, CA) • July 2019 - Aug 2020',
    tags: ['.NET Core', 'Service Fabric', 'Angular', 'React', 'Payment Gateways', 'OAuth 2.0'],
    overview: 'Built next-generation customer-facing insurance enrollment, quotation, and policy purchasing engines with integrated corporate employee discount rewards.',
    challenge: 'Modernizing the legacy Quote Enrollment Center (QEC) while integrating with major external partners (Amazon, Home Depot) and handling high-volume financial transactions securely.',
    solution: 'Created microservices utilizing Azure Service Fabric, Angular material components, REST APIs with OAuth tokens, and real-time payment gateway adapters.',
    metrics: [
      { label: 'Quote Speed', val: '< 1.2s instant' },
      { label: 'Conversion Lift', val: '+28%' },
      { label: 'Partner Feeds', val: 'Automated Sync' },
      { label: 'Test Coverage', val: 'TDD / 90%+' }
    ]
  },
  ebay: {
    title: 'eBay DSPM & PCI-SOX Financial Modernization',
    client: 'eBay (Draper, UT) • Feb 2019 - July 2019',
    tags: ['ASP.NET MVC', 'C#', 'SQL Server 2012', 'Kendo UI', 'PCI/SOX', 'REST & WCF'],
    overview: 'Developed critical digital document systems (DSPM, Digital Docs) and enterprise financial reporting portals adhering to stringent PCI-DSS and SOX requirements.',
    challenge: 'Processing high-volume credit card workflows and compliance tracking without exposing sensitive financial records.',
    solution: 'Implemented PCI-compliant payment validation services, Kendo UI Grid enterprise dashboards with server-side paging, and optimized T-SQL stored procedures.',
    metrics: [
      { label: 'Compliance Audit', val: '100% Passed' },
      { label: 'Query Tuning', val: '3x Faster Reports' },
      { label: 'Dashboard UX', val: 'Kendo UI Grid' },
      { label: 'Data Security', val: 'PCI-DSS Tier 1' }
    ]
  }
};

function initModals() {
  const modalOverlay = document.getElementById('case-study-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-dynamic-content');
  const triggerBtns = document.querySelectorAll('[data-open-modal]');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-open-modal');
      const data = projectDetailsData[key];
      if (!data) return;

      modalContent.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <span class="badge" style="margin-bottom: 0.75rem;">${data.client}</span>
          <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">${data.title}</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            ${data.tags.map(t => `<span class="exp-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; font-size: 0.95rem; color: #cbd5e1; line-height: 1.65;">
          <div>
            <h4 style="color: var(--accent); font-size: 1.05rem; margin-bottom: 0.35rem;">Overview</h4>
            <p>${data.overview}</p>
          </div>
          <div>
            <h4 style="color: #fbbf24; font-size: 1.05rem; margin-bottom: 0.35rem;">The Challenge</h4>
            <p>${data.challenge}</p>
          </div>
          <div>
            <h4 style="color: #34d399; font-size: 1.05rem; margin-bottom: 0.35rem;">Engineering Solution</h4>
            <p>${data.solution}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.85rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
          ${data.metrics.map(m => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.85rem; text-align: center;">
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent); font-family: var(--font-heading);">${m.val}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${m.label}</div>
            </div>
          `).join('')}
        </div>
      `;

      modalOverlay.classList.add('active');
      playUiSound('click');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }
}

/* ==========================================================================
   11. CLIPBOARD & TOAST
   ========================================================================== */
function initClipboard() {
  const copyBtns = document.querySelectorAll('#copy-email-btn, .copy-chip-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'rkreddy313579@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        playUiSound('click');
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast('Email: ' + email);
      });
    });
  });
}

function initNavScroll() {
  const nav = document.querySelector('.nav-container');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 140;
      if (window.scrollY >= top) {
        current = s.getAttribute('id');
      }
    });

    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) {
        l.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
      playUiSound('click');
    });

    links.forEach(l => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== mobileToggle) {
        navLinks.classList.remove('open');
      }
    });
  }
}

let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  const text = document.getElementById('toast-text');
  if (!toast || !text) return;

  text.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
