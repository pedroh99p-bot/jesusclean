// 1. Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
            preloader.remove();
        }, 800); 
    }, 2000); // 2s duration
});

document.getElementById('year').textContent = new Date().getFullYear();

// 2. Services rendering
const WHATSAPP_ICON = "https://res.cloudinary.com/dm9mnc97u/image/upload/v1780172069/WhatsApp_icon_yzvteu.webp";
const servicesTrack = document.getElementById('servicesTrack');

if (servicesTrack && Array.isArray(window.JC_SERVICES)) {
    servicesTrack.innerHTML = window.JC_SERVICES.map(service => `
        <article class="service-card">
            <div class="service-header">
                <div class="service-icon">${service.icon}</div>
                <div class="service-time">⏱️ ${service.time}</div>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <a href="#" class="mini-cta wa-link" data-wa-msg="${service.whatsappMessage}">
                <img src="${WHATSAPP_ICON}" alt="WhatsApp" class="icon-img icon-img-sm">
                Orçar este serviço
            </a>
        </article>
    `).join('');
}

// 3. WhatsApp Number Update
const waNumber = "5521980325724";
document.querySelectorAll('.wa-link').forEach(link => {
    if (link.id !== 'quizWaLink') {
        const customMsg = link.getAttribute('data-wa-msg') || "Olá! Vim pelo site da Jesus Clean e gostaria de saber mais.";
        link.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(customMsg)}`;
        link.target = "_blank";
    }
});

// 4. Navbar iPhone Effect & Mobile Menu Link clicks
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// 5. Infinite Rollers (com emojis)
const texts1 = ["🧼 Higienização de estofados", "🛋️ Sofás", "🛏️ Colchões", "🪑 Poltronas", "🧶 Tapetes", "📍 Atendimento em todo RJ", "📱 Orçamento pelo WhatsApp"];
const texts2 = ["✨ Limpeza profunda", "🌸 Remoção de odores", "🛋️ Sofá renovado", "🛡️ Cuidado com o tecido", "📅 Atendimento agendado", "👁️ Resultado visível"];
const texts3 = ["📍 Atendimento em todo RJ", "📅 Agendamento pelo WhatsApp", "🏠 Higienização em domicílio", "🏢 Residencial e comercial"];
const texts4 = ["🛋️ Sofá limpo", "🏠 Casa mais confortável", "😷 Adeus mau cheiro", "✨ Higienização profissional", "📍 Atendimento no RJ", "📱 Peça seu orçamento"];

function populateRoller(trackId, texts) {
    const track = document.getElementById(trackId);
    if(!track) return;
    let html = '';
    const fullArray = [...texts, ...texts, ...texts, ...texts];
    fullArray.forEach(text => {
        const parts = text.split(' ');
        const emoji = parts.shift();
        html += `<span class="roller-item"><span>${emoji}</span> ${parts.join(' ')}</span>`;
    });
    track.innerHTML = html;
}
populateRoller('track1', texts1); 
populateRoller('track2', texts2); 
populateRoller('track3', texts3); 
populateRoller('track4', texts4); 

// 6. Scroll Reveal & Counters
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2500;
                const increment = target / (duration / 16);
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target === 5000 ? "5.000" : target;
                        const prefixEl = counter.parentElement.querySelector('span[data-prefix]');
                        if(prefixEl) prefixEl.innerText = prefixEl.getAttribute('data-prefix');
                    }
                };
                updateCounter();
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
revealElements.forEach(el => revealObserver.observe(el));

// 7. Services Drag/Swipe
const slider = document.getElementById('servicesCarousel');
let isDown = false;
let startX;
let scrollLeft;
if(slider){
    slider.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
    slider.addEventListener('mouseleave', () => { isDown = false; });
    slider.addEventListener('mouseup', () => { isDown = false; });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; 
        slider.scrollLeft = scrollLeft - walk;
    });
    slider.addEventListener('touchstart', (e) => { isDown = true; startX = e.touches[0].pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
    slider.addEventListener('touchend', () => { isDown = false; });
    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

// 8. Interactive Quiz
let quizData = { p1: '', p2: '', p3: '', p4: '', p5: '', p6: '' };

function nextQuiz(current, next, answer, prop) {
    if(prop) quizData[prop] = answer;
    
    document.getElementById('step' + current).classList.remove('active');
    const bar = document.getElementById('quizBar');
    
    if(next === 'loading') {
        document.getElementById('stepLoading').classList.add('active');
        bar.style.width = '95%';
        
        setTimeout(() => {
            document.getElementById('stepLoading').classList.remove('active');
            document.getElementById('stepFinal').classList.add('active');
            bar.style.width = '100%';
            
            // Build Summary Visual
            document.getElementById('summaryText').innerHTML = `
                <div class="summary-item"><strong>Peça:</strong> ${quizData.p1}</div>
                <div class="summary-item"><strong>Necessidade:</strong> ${quizData.p2}</div>
                <div class="summary-item"><strong>Foto:</strong> ${quizData.p3}</div>
                <div class="summary-item"><strong>Região:</strong> ${quizData.p4}</div>
                <div class="summary-item"><strong>Urgência:</strong> ${quizData.p5}</div>
                <div class="summary-item"><strong>Local:</strong> ${quizData.p6}</div>
            `;
            
            // Build WhatsApp URL
            const customMsg = `Olá! Vim pelo site da Jesus Clean e fiz o pré-orçamento.%0A%0A*Peça:* ${quizData.p1}%0A*Necessidade:* ${quizData.p2}%0A*Foto:* ${quizData.p3}%0A*Região:* ${quizData.p4}%0A*Urgência:* ${quizData.p5}%0A*Local:* ${quizData.p6}%0A%0AGostaria de receber um orçamento.`;
            document.getElementById('quizWaLink').href = `https://wa.me/5521980325724?text=${customMsg}`;
            document.getElementById('quizWaLink').target = "_blank";
        }, 1500);
    } else {
        document.getElementById('step' + next).classList.add('active');
        bar.style.width = ((next - 1) * 16.6) + '%';
    }
}

function prevQuiz(current, prev) {
    document.getElementById('step' + current).classList.remove('active');
    document.getElementById('step' + prev).classList.add('active');
    document.getElementById('quizBar').style.width = ((prev - 1) * 16.6) + '%';
}

function resetQuiz() {
    document.getElementById('stepFinal').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('quizBar').style.width = '0%';
    quizData = { p1: '', p2: '', p3: '', p4: '', p5: '', p6: '' };
}

// 9. Testimonials
const testimonials = [
    { name: "Maria Fernanda", role: "Zona Sul, RJ", text: "Meu sofá estava com manchas escuras e mau cheiro do cachorro. Eles deixaram como novo e muito cheiroso!" },
    { name: "Carlos Eduardo", role: "Barra da Tijuca, RJ", text: "Fiz a limpeza dos colchões aqui de casa. O resultado da água que saiu foi assustador. Recomendo muito pela saúde." },
    { name: "Amanda Silva", role: "Tijuca, RJ", text: "Atendimento pontual, educados e limparam as poltronas e cadeiras de jantar perfeitamente. Secou rápido." },
    { name: "Roberto Alves", role: "Centro, RJ", text: "Profissionais excelentes. Meu tapete da sala ficou renovado e sem aquele cheiro de mofo. Vale cada centavo." },
    { name: "Juliana Costa", role: "Recreio, RJ", text: "Fiz a higienização dos bancos do meu carro. Valorizou muito o veículo, tirou encardido de anos." }
];

const testiTrack = document.getElementById('testimonialTrack');
if(testiTrack){
    let testiHtml = '';
    const buildCard = (t) => {
        const initial = t.name.charAt(0);
        return `
            <div class="review-card-elegant">
                <div class="review-header">
                    <div class="review-user">
                        <div class="review-avatar">${initial}</div>
                        <div>
                            <div class="review-name">${t.name}</div>
                            <div class="review-role">${t.role}</div>
                        </div>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                <div class="stars">★★★★★</div>
                <div class="review-text">"${t.text}"</div>
            </div>
        `;
    };
    testimonials.forEach(t => testiHtml += buildCard(t));
    testimonials.forEach(t => testiHtml += buildCard(t)); 
    testiTrack.innerHTML = testiHtml;
}