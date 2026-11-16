/**
 * Akshay Shinde — Senior QA Automation & Agentic AI Engineer Portfolio
 * Pure Vanilla JavaScript (Zero Framework Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAvatarSpeech();
  initJourneyAccordion();
  initSkillsFilter();
  initTerminalRunner();
  initClipboardButtons();
  initContactForm();
});

/* ==========================================================================
   1. Navigation & Scrollspy
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navBar = document.querySelector('.nav-bar');

  // Mobile navigation drawer toggle
  if (mobileToggle && navBar) {
    mobileToggle.addEventListener('click', () => {
      navBar.classList.toggle('mobile-open');
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navBar.classList.remove('mobile-open');
      });
    });
  }

  // Active section tracking via IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   2. Interactive Avatar with Popover Speech Bubble
   ========================================================================== */
function initAvatarSpeech() {
  const avatarDisc = document.querySelector('.avatar-disc');
  const speechBubble = document.querySelector('.speech-bubble');

  if (!avatarDisc || !speechBubble) return;

  avatarDisc.addEventListener('click', (e) => {
    e.stopPropagation();
    speechBubble.classList.toggle('active');
  });

  // Close speech bubble when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!speechBubble.contains(e.target) && !avatarDisc.contains(e.target)) {
      speechBubble.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. Career Journey Accordion
   ========================================================================== */
function initJourneyAccordion() {
  const timelineCards = document.querySelectorAll('.timeline-card');

  timelineCards.forEach((card, index) => {
    const header = card.querySelector('.role-header');
    
    // Open the first role by default
    if (index === 0) {
      card.classList.add('open');
    }

    if (header) {
      header.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        
        // Optional: Close others or allow multiple open. Here we toggle clicked card.
        card.classList.toggle('open');
      });
    }
  });
}

/* ==========================================================================
   4. Skills Filter Matrix
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive QA Terminal Runner Simulation
   ========================================================================== */
function initTerminalRunner() {
  const runBtn = document.querySelector('.run-btn');
  const terminalBody = document.querySelector('.terminal-body');

  if (!runBtn || !terminalBody) return;

  const testSteps = [
    { type: 'cmd', text: '$ playwright test --project=agentic-mcp-suite --workers=4' },
    { type: 'info', text: 'Running 74 tests using 4 workers across Web & Android targets...' },
    { type: 'subagent', text: '[AI-Planner] Synthesizing dynamic test matrix & boundary criteria' },
    { type: 'pass', text: '✓ [Playwright-TS] VSCode Extension > Smoke & Core LSP Activation (420ms)' },
    { type: 'pass', text: '✓ [Playwright-TS] VSCode Extension > AI Code Generation & Stream Validation (890ms)' },
    { type: 'pass', text: '✓ [MCP-Server] Model Context Protocol Tool Handshake & Schema Gate (310ms)' },
    { type: 'subagent', text: '[AI-Healer] Selector changed in dynamic DOM tree — auto-healed locator in 18ms' },
    { type: 'pass', text: '✓ [Espresso-Kotlin] Android Player > Sanity Stream HLS Playback & Decryption (1.2s)' },
    { type: 'pass', text: '✓ [Espresso-Kotlin] Android Player > DRM Token Rotation & Offline Storage (980ms)' },
    { type: 'pass', text: '✓ [K6-Load] Backend API > 2,500 Virtual Users @ p99 < 120ms (4.5s)' },
    { type: 'pass', text: '✓ [Cypress-DB] Internal Console > PostgreSQL ACID State Verification (540ms)' },
    { type: 'summary', text: '🎉 74 passed (100%) | 0 failed | 0 flaky | Duration: 8.85s' }
  ];

  let isRunning = false;

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    runBtn.textContent = 'Executing...';
    runBtn.style.opacity = '0.7';

    terminalBody.innerHTML = '';
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex >= testSteps.length) {
        clearInterval(interval);
        isRunning = false;
        runBtn.textContent = 'Re-run Suite ↺';
        runBtn.style.opacity = '1';
        return;
      }

      const step = testSteps[stepIndex];
      const line = document.createElement('div');

      if (step.type === 'cmd') {
        line.className = 'term-cmd';
        line.textContent = step.text;
      } else if (step.type === 'subagent') {
        line.className = 'term-subagent';
        line.textContent = step.text;
      } else if (step.type === 'pass') {
        line.className = 'term-pass';
        line.textContent = step.text;
      } else if (step.type === 'summary') {
        line.className = 'term-summary term-pass';
        line.textContent = step.text;
      } else {
        line.className = 'term-prompt';
        line.textContent = step.text;
      }

      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      stepIndex++;
    }, 280);
  });
}

/* ==========================================================================
   6. One-Click Copy to Clipboard
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.innerHTML = `✓ Copied!`;
        btn.classList.add('copied');

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });
}

/* ==========================================================================
   7. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusMsg = document.getElementById('formStatus');

  if (!form || !statusMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate instant client response
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      statusMsg.className = 'form-status success';
      statusMsg.textContent = '✓ Thank you! Your message has been prepared. You can also reach me directly at akshayshinde127@gmail.com.';
      form.reset();

      setTimeout(() => {
        statusMsg.textContent = '';
        statusMsg.className = 'form-status';
      }, 6000);
    }, 600);
  });
}
