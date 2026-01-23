// Particle background
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Create particles
for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine particle color based on theme
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      localStorage.getItem('theme') === 'dark' ||
                      !document.body.classList.contains('light-mode');
    ctx.fillStyle = isDarkMode ? '#0ff' : '#06b6d4';
    
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
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

// Initialize all features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollReveal();
    initActiveNav();
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
    document.getElementById('popupGif').src = p.image;
    document.getElementById('popupTitle').textContent = p.name;
    document.getElementById('popupDesc').textContent = p.desc;
    document.getElementById('popupModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closePopup() {
    document.getElementById('popupModal').style.display = 'none';
    document.body.style.overflow = '';
}
document.getElementById('popupModal').addEventListener('click', function(e) {
    if (e.target === this) closePopup();
});

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