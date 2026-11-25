/**
 * Developer Productivity & System Monitoring Toolkit - Dashboard Controller
 * Full 60fps UI/UX: Starfield Canvas, Circular SVG Gauges, Live Spline Chart,
 * Interactive Typing Terminal, 3D Tilt, Dynamic REST/JSON Telemetry.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Components
  initStarfield();
  initCursorGlow();
  initTiltEffect();
  initTypewriter();
  initNavigation();
  initTimelineProgress();
  initScrollReveal();
  initTerminalSimulator();
  initTelemetryChart();
  loadData();
  setupInteractions();
});

/* ==============================================================================
   1. Dynamic Starfield Particle System with Parallax
============================================================================== */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const STAR_COUNT = Math.min(130, Math.floor((width * height) / 10000));
  const stars = [];

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - width / 2) * 0.05;
    targetMouseY = (e.clientY - height / 2) * 0.05;
  });

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.7 + 0.2,
      baseOpacity: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth lerp mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Connect constellation lines between close stars
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 75) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 75)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(stars[i].x + mouseX, stars[i].y + mouseY);
          ctx.lineTo(stars[j].x + mouseX, stars[j].y + mouseY);
          ctx.stroke();
        }
      }
    }

    // Draw individual twinkling stars
    stars.forEach((star) => {
      star.x += star.speedX;
      star.y += star.speedY;

      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      star.twinklePhase += star.twinkleSpeed;
      const alpha = Math.max(0.1, star.baseOpacity + Math.sin(star.twinklePhase) * 0.25);

      ctx.beginPath();
      ctx.arc(star.x + mouseX, star.y + mouseY, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 245, 255, ${alpha})`;
      ctx.shadowBlur = star.size > 1.8 ? 6 : 0;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (!reducedMotion) {
      requestAnimationFrame(render);
    }
  }

  render();
}

/* ==============================================================================
   2. Interactive Cursor Glow
============================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100;
  let mouseY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });
}

/* ==============================================================================
   3. 3D Card Hover Tilt Transform
============================================================================== */
function initTiltEffect() {
  const tiltCards = document.querySelectorAll('.tilt-target');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  tiltCards.forEach((card) => {
    if (card.dataset.tiltBound === '1') return;
    card.dataset.tiltBound = '1';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==============================================================================
   4. Hero Typewriter Effect
============================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    "Monitor. Automate. Backup. Ship.",
    "Real-Time Linux Telemetry & Kernel Watchdog.",
    "Automated Tarball Backups with 5-Archive Rotation.",
    "Zero-Dependency REST API Data Pipeline."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function typeCycle() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 65;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at completion
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new sentence
    }

    setTimeout(typeCycle, typingSpeed);
  }

  typeCycle();
}

/* ==============================================================================
   5. Smooth Navigation & Active Anchor Highlights
============================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 180;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==============================================================================
   6. Animated Vertical Timeline Progress Bar
============================================================================== */
function initTimelineProgress() {
  const progressBar = document.getElementById('timeline-progress');
  const timelineWrapper = document.querySelector('.timeline-wrapper');
  if (!progressBar || !timelineWrapper) return;

  window.addEventListener('scroll', () => {
    const rect = timelineWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const totalHeight = rect.height;
      const scrolled = windowHeight - rect.top;
      const progress = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
      progressBar.style.height = `${progress}%`;
    }
  });
}

/* ==============================================================================
   7. Scroll Triggered Reveals (IntersectionObserver)
============================================================================== */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, idx * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* ==============================================================================
   8. Interactive Terminal Simulator
============================================================================== */
const TERMINAL_SCRIPTS = {
  system_info: {
    command: "./system_info.sh",
    output: [
      "[36m╔══════════════════════════════════════════════════════════════════════╗[0m",
      "[36m║                   SYSTEM PROFILE & HARDWARE REPORT                   ║[0m",
      "[36m║             Developer Productivity & System Monitoring Toolkit       ║[0m",
      "[36m╚══════════════════════════════════════════════════════════════════════╝[0m",
      "",
      "[33m▶ SYSTEM IDENTITY[0m",
      "Hostname               : dev-workstation",
      "Current User           : devops",
      "Operating System       : Ubuntu 24.04 LTS (Noble Numbat)",
      "Kernel Release         : 6.8.0-40-generic",
      "System Uptime          : 14 days, 3 hours, 42 minutes",
      "Primary IPv4           : 192.168.1.105",
      "",
      "[33m▶ HARDWARE & RESOURCE CAPACITY[0m",
      "Processor (CPU)        : AMD Ryzen 7 5800H with Radeon Graphics",
      "CPU Threads / Cores    : 16 logical cores",
      "Physical Memory        : 5.2Gi / 15Gi (32.7% used)",
      "Root Disk Space        : 142G / 468G (32% on /)",
      "",
      "[32m✓ Telemetry verified. All systems nominal.[0m"
    ]
  },
  resource_monitor: {
    command: "./resource_monitor.sh",
    output: [
      "[36m=== RESOURCE HEALTH MONITOR ===[0m",
      "Thresholds : CPU: 80% | RAM: 85% | Disk: 90%",
      "",
      "[32m[OK] CPU usage: 18.4% (< 80%)[0m",
      "[32m[OK] RAM usage: 32.7% (< 85%)[0m",
      "[32m[OK] Root Disk usage: 32.0% (< 90%)[0m",
      "",
      "Log appended to: /home/devops/DeveloperPortfolio/ShellScripts/logs/monitor.log",
      "[32m✓ Health watchdog cycle complete with 0 alerts.[0m"
    ]
  },
  backup: {
    command: "./backup.sh",
    output: [
      "[36m=== AUTOMATED ARCHIVE & BACKUP MANAGER ===[0m",
      "Source Path      : /home/devops/DeveloperPortfolio",
      "Destination Path : /home/devops/DeveloperPortfolio/ShellScripts/backups",
      "Creating Archive : backup_20261121_143000.tar.gz...",
      "",
      "[32m[SUCCESS] Backup created and verified successfully![0m",
      "Archive Size     : 4.8M",
      "",
      "[36mEnforcing Retention Policy (Max 5 archives)...[0m",
      "[32mTotal backups (4) within limit (5). No rotation needed.[0m",
      "",
      "Current Backups in ShellScripts/backups:",
      "  backup_20261121_143000.tar.gz (4.8M, Nov 21 14:30)",
      "  backup_20261120_020001.tar.gz (4.7M, Nov 20 02:00)",
      "  backup_20261119_020002.tar.gz (4.7M, Nov 19 02:00)",
      "  backup_20261118_020001.tar.gz (4.6M, Nov 18 02:00)"
    ]
  },
  cleanup: {
    command: "./cleanup.sh --dry-run",
    output: [
      "[36m=== TEMPORARY & CACHE CLEANUP UTILITY ===[0m",
      "[33m*** DRY RUN MODE ENABLED - NO FILES WILL BE DELETED ***[0m",
      "",
      "Scanning workspace: /home/devops/DeveloperPortfolio...",
      "",
      "Checking: Temporary files (*.tmp)",
      "Checking: Python bytecode caches (__pycache__)",
      "Checking: Editor swap/backup files (*~)",
      "Checking: macOS metadata files (.DS_Store)",
      "Checking: Old log files in ShellScripts/logs (> 14 days old)",
      "",
      "[36m=== CLEANUP SUMMARY ===[0m",
      "Total items affected : 0",
      "Estimated reclaimed  : 0 KB",
      "",
      "[33mTo perform actual deletion, re-run without --dry-run flag:[0m",
      "  ./ShellScripts/cleanup.sh"
    ]
  },
  git_auto_commit: {
    command: "./git_auto_commit.sh --push",
    output: [
      "[36m=== GIT AUTO-STAGE & COMMIT TOOLKIT ===[0m",
      "Target Repository: /home/devops/DeveloperPortfolio",
      "",
      "[33mDetected Changes:[0m",
      "  M API/stats_summary.json",
      "  M API/system_stats.json",
      "",
      "[36mStaging changes with 'git add -A'...[0m",
      "Committing with message: \"chore(auto): backup snapshot 2026-11-21 14:30:15\"",
      "[32m[SUCCESS] Committed successfully [4983a34][0m",
      "",
      "[36mPushing changes to remote branch: main...[0m",
      "[32m[SUCCESS] Pushed to remote repository! Everything up-to-date.[0m"
    ]
  },
  menu: {
    command: "./menu.sh",
    output: [
      "[36m╔══════════════════════════════════════════════════════════════════════════╗[0m",
      "[36m║               DEVELOPER PRODUCTIVITY & MONITORING TOOLKIT                ║[0m",
      "[36m║                 Interactive Automation & Administration Menu             ║[0m",
      "[36m╚══════════════════════════════════════════════════════════════════════════╝[0m",
      "",
      "Select an operation to execute:",
      "",
      "  [32m[1][0m System Information      - Formatted CPU, RAM, OS, & Uptime report",
      "  [32m[2][0m Resource Monitor        - Check CPU/RAM/Disk thresholds & log",
      "  [32m[3][0m Automated Backup        - Timestamped tar.gz archive (rotation of 5)",
      "  [32m[4][0m Safe Cleanup (Dry Run)  - Preview temporary file & cache purging",
      "  [32m[5][0m Safe Cleanup (Execute)  - Purge temporary files & cache dirs",
      "  [32m[6][0m Git Auto-Commit         - Stage & commit with snapshot timestamp",
      "  [32m[7][0m View Monitor Logs       - Inspect recent entries in logs/monitor.log",
      "  [31m[0][0m Exit Toolkit",
      "",
      "Enter choice [0-7]: 1"
    ]
  }
};

let activeScriptKey = 'system_info';
let typeInterval = null;

function initTerminalSimulator() {
  const tabs = document.querySelectorAll('.term-tab');
  const replayBtn = document.getElementById('btn-replay-term');
  const copyBtn = document.getElementById('btn-copy-term');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeScriptKey = tab.getAttribute('data-script');
      runTerminalTyping(activeScriptKey);
    });
  });

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      runTerminalTyping(activeScriptKey);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const script = TERMINAL_SCRIPTS[activeScriptKey];
      if (script && copyBtn.dataset.copying !== '1') {
        navigator.clipboard?.writeText(script.command).catch(() => {});
        const originalText = copyBtn.textContent;
        copyBtn.dataset.copying = '1';
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          delete copyBtn.dataset.copying;
        }, 1500);
      }
    });
  }

  // Initial Run
  runTerminalTyping(activeScriptKey);
}

function runTerminalTyping(key) {
  const scriptData = TERMINAL_SCRIPTS[key];
  if (!scriptData) return;

  const cmdEl = document.getElementById('terminal-command');
  const outputEl = document.getElementById('terminal-text');
  if (!cmdEl || !outputEl) return;

  cmdEl.textContent = scriptData.command;
  outputEl.innerHTML = '';

  if (typeInterval) clearInterval(typeInterval);

  let lineIdx = 0;
  const lines = scriptData.output;

  typeInterval = setInterval(() => {
    if (lineIdx < lines.length) {
      const formattedLine = formatAnsiLine(lines[lineIdx]);
      outputEl.innerHTML += formattedLine + '\n';
      lineIdx++;
    } else {
      clearInterval(typeInterval);
      typeInterval = null;
    }
  }, 40);
}

function formatAnsiLine(line) {
  return line
    .replace(/\[36m/g, '<span class="line-header">')
    .replace(/\[32m/g, '<span class="line-success">')
    .replace(/\[33m/g, '<span class="line-warn">')
    .replace(/\[31m/g, '<span class="line-alert">')
    .replace(/\[0m/g, '</span>');
}

/* ==============================================================================
   9. Live Resource Telemetry Canvas Line Chart (60fps Spline)
============================================================================== */
let telemetryHistory = {
  cpu: [14, 18, 15, 22, 19, 25, 21, 18, 17, 24, 20, 22, 18, 16, 21, 19, 23, 18],
  ram: [32, 33, 32, 34, 33, 35, 34, 33, 34, 35, 34, 33, 34, 34, 35, 35, 34, 33]
};

function initTelemetryChart() {
  const canvas = document.getElementById('telemetryChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 20, right: 30, bottom: 25, left: 35 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Draw horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillText(`${100 - i * 25}%`, 5, y + 3);
    }

    // Helper to draw series
    function drawSeries(data, strokeColor, glowColor) {
      if (data.length < 2) return;
      const step = chartW / (data.length - 1);

      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = padding.left + i * step;
        const y = padding.top + chartH - (data[i] / 100) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevX = padding.left + (i - 1) * step;
          const prevY = padding.top + chartH - (data[i - 1] / 100) * chartH;
          const cpX1 = prevX + (x - prevX) / 2;
          const cpX2 = prevX + (x - prevX) / 2;
          ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
        }
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = glowColor;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw active point at the head
      const lastX = padding.left + (data.length - 1) * step;
      const lastY = padding.top + chartH - (data[data.length - 1] / 100) * chartH;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = glowColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    drawSeries(telemetryHistory.cpu, '#00f0ff', '#00f0ff');
    drawSeries(telemetryHistory.ram, '#a855f7', '#a855f7');

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(draw);
    }
  }

  draw();

  // Tick every 2 seconds with simulated or delta data
  setInterval(() => {
    const currentCpu = parseFloat(document.getElementById('cpu-val')?.textContent || '20');
    const currentRam = parseFloat(document.getElementById('ram-val')?.textContent || '33');

    // Add mild fluctuation to keep chart live
    const nextCpu = Math.min(100, Math.max(5, currentCpu + (Math.random() - 0.5) * 6));
    const nextRam = Math.min(100, Math.max(10, currentRam + (Math.random() - 0.5) * 1.5));

    telemetryHistory.cpu.push(Math.round(nextCpu * 10) / 10);
    telemetryHistory.ram.push(Math.round(nextRam * 10) / 10);

    if (telemetryHistory.cpu.length > 20) telemetryHistory.cpu.shift();
    if (telemetryHistory.ram.length > 20) telemetryHistory.ram.shift();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
    }
  }, 2000);
}

/* ==============================================================================
   10. Asynchronous Data Fetching & Dashboard Hydration
============================================================================== */
async function loadData() {
  // Load System Telemetry
  try {
    let sysResp = await fetch('/api/system').catch(() => null);
    if (!sysResp || !sysResp.ok) {
      sysResp = await fetch('../../API/system_stats.json');
    }
    if (!sysResp.ok) throw new Error('API system stats not found');
    const sysData = await sysResp.json();
    hydrateSystemStats(sysData);
  } catch (err) {
    try {
      const fallbackResp = await fetch('data/fallback_system.json');
      const fallbackData = await fallbackResp.json();
      hydrateSystemStats(fallbackData);
    } catch (e) {
      console.warn('Using built-in system telemetry defaults');
      hydrateSystemStats(getBuiltinSystemDefaults());
    }
  }

  // Load GitHub API Telemetry
  try {
    let gitResp = await fetch('/api/stats').catch(() => null);
    if (!gitResp || !gitResp.ok) {
      gitResp = await fetch('../../API/stats_summary.json');
    }
    if (!gitResp.ok) throw new Error('API GitHub stats not found');
    const gitData = await gitResp.json();
    hydrateGitHubStats(gitData);
  } catch (err) {
    try {
      const fallbackResp = await fetch('data/fallback_stats.json');
      const fallbackData = await fallbackResp.json();
      hydrateGitHubStats(fallbackData);
    } catch (e) {
      console.warn('Using built-in GitHub stats defaults');
      hydrateGitHubStats(getBuiltinGitHubDefaults());
    }
  }
}

function hydrateSystemStats(data) {
  if (!data) return;

  const cpuPct = data.cpu?.usage_percent || 18.4;
  const ramPct = data.memory?.usage_percent || 32.7;
  const diskPct = data.disk?.usage_percent || 32.0;

  // Animate Gauge Numbers
  animateValue('cpu-val', 0, cpuPct, 1200);
  animateValue('ram-val', 0, ramPct, 1200);
  animateValue('disk-val', 0, diskPct, 1200);

  // Update SVG Circles (Circumference = 2 * PI * 66 ≈ 414.69)
  updateGaugeCircle('cpu-gauge-circle', cpuPct, 'cpu-status-badge');
  updateGaugeCircle('ram-gauge-circle', ramPct, 'ram-status-badge');
  updateGaugeCircle('disk-gauge-circle', diskPct, 'disk-status-badge');

  // Specs text
  setText('cpu-cores', `${data.cpu?.logical_cores ?? 16} Cores`);
  setText('cpu-freq', `${((data.cpu?.current_frequency_mhz ?? 3200) / 1000).toFixed(2)} GHz`);
  setText('ram-used', `${data.memory?.used_gb ?? 5.2} GB`);
  setText('ram-total', `${data.memory?.total_gb ?? 15.9} GB`);
  setText('disk-free', `${data.disk?.free_gb ?? 303} GB`);
  setText('disk-total', `${data.disk?.total_gb ?? 468} GB`);

  // Hardware Matrix
  setText('spec-hostname', data.system?.hostname || 'dev-workstation');
  setText('spec-os', data.system?.os_name || 'Ubuntu 24.04 LTS');
  setText('spec-kernel', data.system?.os_release || '6.8.0-40-generic');
  setText('spec-arch', data.system?.architecture || 'x86_64');
  if (data.network?.bytes_sent_mb !== undefined && data.network?.bytes_recv_mb !== undefined) {
    setText('spec-net', `▲ ${formatMb(data.network.bytes_sent_mb)} / ▼ ${formatMb(data.network.bytes_recv_mb)}`);
  }
  setText('spec-uptime', data.uptime?.formatted || '14d 3h 42m');
  setText('hero-uptime', data.uptime?.formatted || '14d 3h 42m');
  setText('hero-platform', `${data.system?.os_name || 'Linux'} ${data.system?.architecture || 'x86_64'}`);
}

function formatMb(mb) {
  const value = Number(mb) || 0;
  return value >= 1024 ? `${(value / 1024).toFixed(1)} GB` : `${value.toFixed(1)} MB`;
}

function updateGaugeCircle(circleId, pct, badgeId) {
  const circle = document.getElementById(circleId);
  const badge = document.getElementById(badgeId);
  if (!circle) return;

  const circumference = 414.69;
  const offset = circumference - (pct / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  // Threshold color modulation
  if (pct >= 85) {
    circle.style.stroke = 'var(--neon-red)';
    circle.style.filter = 'drop-shadow(0 0 8px var(--neon-red))';
    if (badge) {
      badge.textContent = 'Critical';
      badge.className = 'badge-status critical';
    }
  } else if (pct >= 70) {
    circle.style.stroke = 'var(--neon-yellow)';
    circle.style.filter = 'drop-shadow(0 0 8px var(--neon-yellow))';
    if (badge) {
      badge.textContent = 'Warning';
      badge.className = 'badge-status warning';
    }
  } else {
    circle.style.stroke = '';
    circle.style.filter = '';
    if (badge) {
      badge.textContent = 'Normal';
      badge.className = 'badge-status';
    }
  }
}

function hydrateGitHubStats(data) {
  if (!data) return;

  animateValue('count-repos', 0, data.public_repos || 14, 1500);
  animateValue('count-stars', 0, data.total_stars || 141, 1500);
  animateValue('count-followers', 0, data.followers || 48, 1500);
  animateValue('count-forks', 0, data.total_forks || 28, 1500);

  setText('github-name', data.name || 'DevOps Engineer');
  setText('github-handle', `@${data.username || 'bajajaarna4-bit'}`);
  setText('github-bio', data.bio || 'Building resilient systems and developer tools.');

  const avatar = document.getElementById('github-avatar');
  if (avatar && data.avatar_url) {
    avatar.src = data.avatar_url;
  }

  const profileLink = document.getElementById('github-profile-link');
  if (profileLink && data.username) {
    profileLink.href = `https://github.com/${data.username}`;
  }

  // Populate Languages
  renderLanguages(data.top_languages || []);

  // Populate Repositories
  renderRepositories(data.recent_repositories || []);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(url) {
  const raw = String(url ?? '');
  return /^https?:\/\//i.test(raw) ? raw : '#';
}

function renderLanguages(languages) {
  const container = document.getElementById('language-bars-container');
  if (!container || languages.length === 0) return;

  const classMap = {
    Shell: 'shell',
    Python: 'python',
    JavaScript: 'js',
    HTML: 'js',
    HCL: 'hcl',
    Go: 'go'
  };

  container.innerHTML = languages
    .map((lang) => {
      const cls = classMap[lang.name] || 'shell';
      const pct = Math.min(100, Math.max(0, Number(lang.percentage) || 0));
      return `
      <div class="lang-bar-item">
        <div class="lang-info">
          <span class="lang-name">${escapeHtml(lang.name)}</span>
          <span class="lang-pct">${pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${cls}" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
    })
    .join('');
}

function renderRepositories(repos) {
  const container = document.getElementById('repos-container');
  if (!container || repos.length === 0) return;

  container.innerHTML = repos
    .map(
      (repo) => `
    <div class="glass-card repo-card tilt-target">
      <div class="repo-card-header">
        <a href="${escapeHtml(safeUrl(repo.html_url))}" target="_blank" rel="noopener noreferrer" class="repo-name">
          ${escapeHtml(repo.name)} ↗
        </a>
        <span class="repo-stars-badge">★ ${Number(repo.stars) || 0}</span>
      </div>
      <p class="repo-desc">${escapeHtml(repo.description)}</p>
      <div class="repo-footer">
        <span class="repo-lang-pill">
          <span class="lang-color-circle"></span>
          <span>${escapeHtml(repo.language)}</span>
        </span>
        <span>⑂ ${Number(repo.forks) || 0} forks</span>
      </div>
    </div>
  `
    )
    .join('');

  // Re-bind tilt to newly injected elements
  initTiltEffect();
}

/* ==============================================================================
   11. Helper Utilities
============================================================================== */
function animateValue(id, start, end, duration) {
  const el = document.getElementById(id);
  if (!el) return;

  const isDecimal = String(end).includes('.');
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const currentVal = start + (end - start) * easeOutQuad;

    el.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isDecimal ? end.toFixed(1) : end;
    }
  }

  requestAnimationFrame(update);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setupInteractions() {
  const emailRow = document.getElementById('copy-email-row');
  if (emailRow) {
    emailRow.addEventListener('click', () => {
      const email = document.getElementById('email-text')?.textContent || 'bajajaarna4@gmail.com';
      navigator.clipboard?.writeText(email).catch(() => {});
      const valEl = emailRow.querySelector('.link-val');
      if (valEl && valEl.dataset.copying !== '1') {
        const orig = valEl.textContent;
        valEl.dataset.copying = '1';
        valEl.textContent = '✓ Copied to clipboard!';
        setTimeout(() => {
          valEl.textContent = orig;
          delete valEl.dataset.copying;
        }, 1800);
      }
    });
  }
}

function getBuiltinSystemDefaults() {
  return {
    system: {
      hostname: "dev-workstation",
      os_name: "Ubuntu 24.04 LTS",
      os_release: "6.8.0-40-generic",
      architecture: "x86_64"
    },
    uptime: { formatted: "14d 3h 42m" },
    cpu: { usage_percent: 18.4, logical_cores: 16, current_frequency_mhz: 3200 },
    memory: { used_gb: 5.2, total_gb: 15.9, usage_percent: 32.7 },
    disk: { used_gb: 142, total_gb: 468, free_gb: 303, usage_percent: 32.0 }
  };
}

function getBuiltinGitHubDefaults() {
  return {
    username: "bajajaarna4-bit",
    name: "DevOps Engineer & Full-Stack Architect",
    bio: "Building resilient systems, developer tools, and high-performance applications.",
    public_repos: 14,
    followers: 48,
    total_stars: 141,
    total_forks: 28,
    top_languages: [
      { name: "Shell", percentage: 30.0 },
      { name: "Python", percentage: 25.0 },
      { name: "JavaScript", percentage: 20.0 },
      { name: "HCL", percentage: 15.0 },
      { name: "Go", percentage: 10.0 }
    ],
    recent_repositories: [
      {
        name: "DeveloperPortfolio",
        html_url: "https://github.com/bajajaarna4-bit/DeveloperPortfolio",
        stars: 38,
        forks: 9,
        language: "Shell",
        description: "Developer Productivity & System Monitoring Toolkit with animated glassmorphism dashboard."
      },
      {
        name: "cloud-infrastructure-iac",
        html_url: "https://github.com/bajajaarna4-bit/cloud-infrastructure-iac",
        stars: 24,
        forks: 5,
        language: "HCL",
        description: "Production Terraform & Kubernetes deployment templates for distributed microservices."
      }
    ]
  };
}
