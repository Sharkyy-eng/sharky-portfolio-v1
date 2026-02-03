// Particle background
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse position for particle interactions
document.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

document.addEventListener('mouseleave', function() {
    mouse.x = null;
    mouse.y = null;
});

// Create particles
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.dx = (Math.random() - 0.5) * 0.5;
        this.dy = (Math.random() - 0.5) * 0.5;
        this.density = (Math.random() * 30) + 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        // Mouse interaction - particles move away from cursor
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius && distance > 0) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to base position
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        } else {
            // Return to base position
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }

        // Base movement
        this.baseX += this.dx;
        this.baseY += this.dy;

        // Bounce off edges
        if (this.baseX < 0 || this.baseX > canvas.width) this.dx *= -1;
        if (this.baseY < 0 || this.baseY > canvas.height) this.dy *= -1;
    }
}

// Initialize particles
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine particle color based on theme
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      localStorage.getItem('theme') === 'dark' ||
                      !document.body.classList.contains('light-mode');
    ctx.fillStyle = isDarkMode ? '#0ff' : '#06b6d4';
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ============ DARK/LIGHT MODE TOGGLE ============
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (!themeToggle || !sunIcon || !moonIcon) return; // Exit early if toggle is not on this page
    
    // Apply initial theme immediately
    applyTheme(savedTheme);
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        } else {
            document.body.classList.remove('light-mode');
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        }
    }
}

// ============ SCROLL REVEAL ANIMATIONS ============
function initScrollReveal() {
    const reveals = document.querySelectorAll('section');
    
    reveals.forEach(element => {
        // Add scroll-reveal class if not already present
        if (!element.classList.contains('scroll-reveal') && element.id !== 'hero') {
            element.classList.add('scroll-reveal');
        }
    });
    
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.scroll-reveal');
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const revealTop = element.getBoundingClientRect().top;
            const revealPoint = 100;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('reveal');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on page load
}

// ============ ACTIVE NAV INDICATOR ============
function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section && section.offsetTop <= window.scrollY + 200) {
                current = link.getAttribute('data-section');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============ LEGO BUILDING ANIMATION FOR HERO SECTION ============
function initLegoAnimation() {
    // Only run on index.html
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    // Check if animation has already been shown
    const hasSeenAnimation = sessionStorage.getItem('heroLegoAnimationShown');
    if (hasSeenAnimation) return;
    
    // Mark animation as shown for this session
    sessionStorage.setItem('heroLegoAnimationShown', 'true');
    
    // Get hero elements
    const profileImg = heroSection.querySelector('img');
    const nameText = document.getElementById('nameText');
    const descText = document.getElementById('descText');
    const heroButtons = document.getElementById('heroButtons');
    
    // Hide elements initially
    if (profileImg) profileImg.style.opacity = '0';
    if (nameText) nameText.style.opacity = '0';
    if (descText) descText.style.opacity = '0';
    if (heroButtons) heroButtons.style.opacity = '0';
    
    // Apply LEGO animations with staggered timing
    setTimeout(() => {
        if (profileImg) {
            profileImg.classList.add('lego-pop-animation', 'lego-delay-1');
        }
    }, 100);
    
    setTimeout(() => {
        if (nameText) {
            nameText.classList.add('lego-build-animation', 'lego-delay-2');
        }
    }, 300);
    
    setTimeout(() => {
        if (descText) {
            descText.classList.add('lego-build-animation', 'lego-delay-3');
        }
    }, 500);
    
    setTimeout(() => {
        if (heroButtons) {
            heroButtons.classList.add('lego-pop-animation', 'lego-delay-4');
        }
    }, 700);
}

// ============ PARALLAX SCROLLING ============
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element, .parallax-bg');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ============ LOADING SCREEN ============
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 200); // Show loading screen for 200ms (total 500ms with fade-out)
    });
}

// ============ TERMINAL TYPING ANIMATION ============
function initTerminalTyping() {
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalPrompt = document.getElementById('terminalPrompt');
    
    if (!terminalOutput) return;
    
    const terminalContent = [
        { type: 'command', text: 'PS C:\\Users\\Sharky> whoami', delay: 0 },
        { type: 'output', text: 'Sharavanan Mathivanan', delay: 60 },
        { type: 'text', text: '', delay: 40 },
        { type: 'command', text: 'PS C:\\Users\\Sharky> cat .\\about_me.txt', delay: 60 },
        { type: 'text', text: '', delay: 40 },
        { type: 'text', text: '--- WHO I AM ---', delay: 35 },
        { type: 'text', text: 'Mechatronics & AI Systems Engineering @ Western University.', delay: 35 },
        { type: 'text', text: 'I bridge mechanical systems with intelligent software to solve real-world problems.', delay: 35 },
        { type: 'text', text: '', delay: 40 },
        { type: 'text', text: '--- MY JOURNEY ---', delay: 35 },
        { type: 'text', text: 'Early curiosity in mechanics + AI turned into building robots and computer vision systems.', delay: 35 },
        { type: 'text', text: 'I ship ideas end-to-end: from hardware prototypes to production-ready software.', delay: 35 },
        { type: 'text', text: 'Motivated by creating tech that works outside the lab and helps people.', delay: 35 },
        { type: 'text', text: '', delay: 40 },
        { type: 'text', text: '--- WHAT I DO ---', delay: 35 },
        { type: 'text', text: 'Robotics, automation, computer vision, embedded/IoT, and full-stack tooling.', delay: 35 },
        { type: 'text', text: 'Love designing autonomous systems that sense, decide, and act reliably.', delay: 35 },
        { type: 'text', text: '', delay: 40 },
        { type: 'text', text: '--- TOOLBOX ---', delay: 35 },
        { type: 'text', text: 'Python, C++, Java, JavaScript; control, CV/ML; CAD; embedded + cloud.', delay: 35 },
        { type: 'text', text: '', delay: 40 },
        { type: 'text', text: '--- PHILOSOPHY ---', delay: 35 },
        { type: 'text', text: 'Engineering thoughts into reality, one project at a time.', delay: 35 },
        { type: 'text', text: '', delay: 50 },
        { type: 'success', text: 'PS C:\\Users\\Sharky> _', delay: 120 }
    ];
    
    let currentLine = 0;
    let currentChar = 0;
    let currentElement = null;
    
    function typeNextChar() {
        if (currentLine >= terminalContent.length) {
            // Show prompt when done
            if (terminalPrompt) {
                terminalPrompt.style.display = 'block';
            }
            return;
        }
        
        const line = terminalContent[currentLine];
        
        // Create new line element if needed
        if (currentChar === 0) {
            currentElement = document.createElement('div');
            currentElement.className = 'terminal-line';
            
            if (line.type === 'command') {
                currentElement.innerHTML = `<span class="text-yellow-400 font-bold"></span>`;
            } else if (line.type === 'output') {
                currentElement.innerHTML = `<span class="text-green-400"></span>`;
            } else if (line.type === 'header') {
                currentElement.innerHTML = `<span class="text-cyan-400"></span>`;
            } else if (line.type === 'success') {
                currentElement.innerHTML = `<span class="text-green-400"></span>`;
            } else {
                currentElement.innerHTML = `<span class="text-gray-300"></span>`;
            }
            
            terminalOutput.appendChild(currentElement);
        }
        
        // Type next character
        if (currentChar < line.text.length) {
            const span = currentElement.querySelector('span');
            if (span) {
                span.textContent += line.text[currentChar];
            }
            currentChar++;
            setTimeout(typeNextChar, 30); // Slower typing speed - 50ms between characters
        } else {
            // Move to next line
            currentLine++;
            currentChar = 0;
            currentElement = null;
            setTimeout(typeNextChar, line.delay);
        }
    }
    
    // Start typing immediately
    typeNextChar();
}

// Initialize all features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollReveal();
    initActiveNav();
    initSmoothScroll();
    initLegoAnimation();
    initParallax();
    initLoadingScreen();
    initTerminalTyping();
});

function getProjectsData() {
    return fetch('projects.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const dataScript = doc.getElementById('projects-data');
            if (dataScript) {
                return JSON.parse(dataScript.textContent);
            }
            return [];
        });
}

function renderProjectsScroller(projects) {
    const scrollContent = document.getElementById('scrollContent');
    scrollContent.innerHTML = '';
    projects.forEach((p, idx) => {
        scrollContent.appendChild(createProjectCard(p, idx));
    });
    projects.forEach((p, idx) => {
        scrollContent.appendChild(createProjectCard(p, idx));
    });
}

function createProjectCard(project, idx) {
    const card = document.createElement('div');
    card.className = "project-scroll-card cursor-pointer";
    card.onclick = () => showPopup(idx);
    card.innerHTML = `
        <img src="${project.image}" alt="${project.name}">
        <span>${project.name}</span>
    `;
    return card;
}

// Show scroller after 3 seconds (disabled for now)
// setTimeout(() => {
//     document.getElementById('hero').classList.add('translate-y-[-120px]');
//     document.getElementById('hero').style.marginTop = '-120px';
//     getProjectsData().then(projects => {
//         window.projects = projects;
//         renderProjectsScroller(projects);
//         document.getElementById('projectsScroller').style.display = 'flex';
//     });
// }, 3000);

// Pop-up logic
function showPopup(idx) {
    const p = window.projects[idx];
    const popupModal = document.getElementById('popupModal');
    if (!popupModal) return;
    document.getElementById('popupGif').src = p.image;
    document.getElementById('popupTitle').textContent = p.name;
    document.getElementById('popupDesc').textContent = p.desc;
    popupModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closePopup() {
    const popupModal = document.getElementById('popupModal');
    if (!popupModal) return;
    popupModal.style.display = 'none';
    document.body.style.overflow = '';
}

const popupModalEl = document.getElementById('popupModal');
if (popupModalEl) {
    popupModalEl.addEventListener('click', function(e) {
        if (e.target === this) closePopup();
    });
}

// // Animated Stats
// function animateStat(id, end, duration = 1200) {
//     const el = document.getElementById(id);
//     let start = 0;
//     const step = Math.ceil(end / (duration / 30));
//     const interval = setInterval(() => {
//         start += step;
//         if (start >= end) {
//             el.textContent = end;
//             clearInterval(interval);
//         } else {
//             el.textContent = start;
//         }
//     }, 30);
// }
// window.addEventListener('DOMContentLoaded', () => {
//     animateStat('stat-projects', 12); // Update with your actual numbers
//     animateStat('stat-years', 5);
//     animateStat('stat-awards', 3);
// });

// Tech Info Collection
function getTechInfo() {
    const techDetails = document.getElementById('techDetails');
    if (!techDetails) return;
    // Browser info
    const browser = navigator.userAgent;
    // Platform
    const platform = navigator.platform;
    // Language
    const language = navigator.language;
    // Screen size
    const screen = `${window.screen.width} x ${window.screen.height}`;
    // IP address (using public API)
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
            techDetails.innerHTML = `
                <strong>IP Address:</strong> ${data.ip}<br>
                <strong>Browser:</strong> ${browser}<br>
                <strong>Platform:</strong> ${platform}<br>
                <strong>Language:</strong> ${language}<br>
                <strong>Screen:</strong> ${screen}
            `;
        })
        .catch(() => {
            techDetails.innerHTML = `
                <strong>Browser:</strong> ${browser}<br>
                <strong>Platform:</strong> ${platform}<br>
                <strong>Language:</strong> ${language}<br>
                <strong>Screen:</strong> ${screen}
            `;
        });
}
window.addEventListener('DOMContentLoaded', getTechInfo);

// Show/hide tech info on hover/focus
const techTrigger = document.getElementById('techInfo-trigger');
const techInfo = document.getElementById('techInfo');
if (techTrigger && techInfo) {
    techTrigger.addEventListener('mouseenter', () => {
        techInfo.style.opacity = '1';
        techInfo.style.pointerEvents = 'auto';
    });
    techTrigger.addEventListener('mouseleave', () => {
        techInfo.style.opacity = '0';
        techInfo.style.pointerEvents = 'none';
    });
    techInfo.addEventListener('mouseenter', () => {
        techInfo.style.opacity = '1';
        techInfo.style.pointerEvents = 'auto';
    });
    techInfo.addEventListener('mouseleave', () => {
        techInfo.style.opacity = '0';
        techInfo.style.pointerEvents = 'none';
    });
}