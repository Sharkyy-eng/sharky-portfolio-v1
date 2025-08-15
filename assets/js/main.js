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
    ctx.fillStyle = '#0ff';
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