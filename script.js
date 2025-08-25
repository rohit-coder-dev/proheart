
const audio = document.getElementById('backgroundMusic');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

document.body.addEventListener('click', () => {
    if (!audioContext || audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            audio.play().catch(error => console.error("Playback error:", error));
        });
    }
});





const spectrumCanvas = document.getElementById('spectrumCanvas');
const spectrumCtx = spectrumCanvas.getContext('2d');
spectrumCanvas.width = window.innerWidth;
spectrumCanvas.height = 150;

function drawSpectrum() {
    requestAnimationFrame(drawSpectrum);
    analyser.getByteFrequencyData(dataArray);
    spectrumCtx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
    spectrumCtx.fillStyle = 'red';
    for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i] / 2;
        spectrumCtx.fillRect(i * 5, spectrumCanvas.height - barHeight, 3, barHeight);
    }
}

setTimeout(() => {
    document.getElementById('name').style.opacity = '1';
    document.getElementById('name').style.animation = 'glitchEffect 3s steps(4, end) forwards, neonGlow 1.5s infinite alternate, sparkEffect 2s infinite alternate';
}, 6000); // Delay after heart is drawn
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const scale = 20;
let drawProgress = 0;

function heartEquation(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    };
}

const particles = [];
const arrows = [];
const numParticles = 400;

function createParticle() {
    const t = Math.random() * Math.PI * 2;
    const pos = heartEquation(t);
    return {
        x: centerX + pos.x * scale + Math.random() * 10 - 5,
        y: centerY + pos.y * scale + Math.random() * 10 - 5,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        alpha: Math.random() * 0.5 + 0.5,
        size: Math.random() * 3 + 1
    };
}

function createArrow() {
    return {
        x: Math.random() * canvas.width,
        y: canvas.height,
        vx: (centerX - Math.random() * canvas.width) * 0.01,
        vy: -Math.random() * 3 - 2,
        angle: Math.random() * Math.PI / 4 - Math.PI / 8
    };
}

for (let i = 0; i < numParticles; i++) {
    particles.push(createParticle());
}

for (let i = 0; i < 5; i++) {
    arrows.push(createArrow());
}

function updateParticles() {
    for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.005;
        if (p.alpha <= 0) {
            Object.assign(p, createParticle());
        }
    }
}

function updateArrows() {
    for (let a of arrows) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.y < 0) {
            Object.assign(a, createArrow());
        }
    }
}

function drawHeartOutline() {
    ctx.beginPath();
    for (let t = 0; t <= drawProgress; t += 0.01) {
        const pos = heartEquation(t);
        ctx.lineTo(centerX + pos.x * scale, centerY + pos.y * scale);
    }
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'red';
    ctx.shadowBlur = 15;
    ctx.stroke();

    if (drawProgress < Math.PI * 2) {
        drawProgress += 0.02;
    }
}

function drawParticles() {
    ctx.globalCompositeOperation = 'lighter';
    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 80, 80, ${p.alpha})`;
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 10;
        ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
}

function drawArrows() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 10;
    for (let a of arrows) {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10, -20);
        ctx.lineTo(-10, -20);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHeartOutline();
    updateParticles();
    drawParticles();
    updateArrows();
    drawArrows();
    requestAnimationFrame(animate);
}

animate();
drawSpectrum();
