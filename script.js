// ============================================
// RENOVAR - ODONTOLOGIA E ESTÉTICA
// Landing Page Interativa
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos os módulos
    initLoader();
    initParticles();
    initCursor();
    initNavigation();
    initScrollProgress();
    initHeroStats();
    init3DMouth();
    initServiceCards();
    initContactForm();
    initScrollAnimations();
});

// ============================================
// LOADER
// ============================================
function initLoader() {
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    });

    // Fallback caso o load demore
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 3000);
}

// ============================================
// PARTÍCULAS
// ============================================
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

// ============================================
// CURSOR PERSONALIZADO
// ============================================
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Cursor principal
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Seguidor
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;

        requestAnimationFrame(animate);
    }
    animate();

    // Efeitos de hover
    const interactiveElements = document.querySelectorAll('a, button, .tooth-wrapper, .service-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });
}

// ============================================
// NAVEGAÇÃO
// ============================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Scroll effect na navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Atualizar link ativo
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll para links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// BARRA DE PROGRESSO DO SCROLL
// ============================================
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

// ============================================
// ESTATÍSTICAS DO HERO (CONTADOR)
// ============================================
function initHeroStats() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        if (animated) return;
        animated = true;

        stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            updateCounter();
        });
    };

    // Observer para animar quando visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

// ============================================
// ARCADA 3D INTERATIVA
// ============================================
function init3DMouth() {
    const mouthContainer = document.getElementById('mouthContainer');
    const mouth3D = document.getElementById('mouth3D');
    const teeth = document.querySelectorAll('.tooth-wrapper');
    const curiosityPanel = document.getElementById('curiosityPanel');
    const curiosityTitle = document.getElementById('curiosityTitle');
    const curiosityText = document.getElementById('curiosityText');
    const progressBar = document.getElementById('progressBar');
    const curiosityIndicator = document.getElementById('curiosityIndicator');
    const curiosityNumber = curiosityIndicator?.querySelector('.curiosity-number');

    if (!mouthContainer || !mouth3D) return;

    // Curiosidades para o scroll
    const curiosities = [];
    teeth.forEach(tooth => {
        if (tooth.dataset.curiosity) {
            curiosities.push({
                name: tooth.dataset.name,
                text: tooth.dataset.curiosity,
                element: tooth
            });
        }
    });

    let currentRotationX = 20;
    let currentRotationY = 0;
    let targetRotationX = 20;
    let targetRotationY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let currentCuriosityIndex = 0;

    // ============================================
    // ROTAÇÃO 360° COM SCROLL
    // ============================================
    const experienceSection = document.getElementById('experience');

    function handleScroll() {
        if (!experienceSection) return;

        const rect = experienceSection.getBoundingClientRect();
        const sectionHeight = experienceSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Calcular progresso do scroll dentro da seção
        const scrollStart = rect.top + viewportHeight;
        const scrollEnd = rect.bottom;
        const scrollRange = scrollEnd - scrollStart + viewportHeight;
        const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / scrollRange));

        // Verificar se está na seção
        if (rect.top < viewportHeight && rect.bottom > 0) {
            // Mostrar indicador de curiosidade
            if (curiosityIndicator) {
                curiosityIndicator.classList.add('visible');
            }

            // Rotação baseada no scroll (360 graus completos)
            targetRotationY = scrollProgress * 360;
            targetRotationX = 20 + Math.sin(scrollProgress * Math.PI * 2) * 15;

            // Atualizar curiosidade baseada no progresso
            const curiosityIndex = Math.min(
                Math.floor(scrollProgress * curiosities.length),
                curiosities.length - 1
            );

            if (curiosityIndex !== currentCuriosityIndex && curiosityIndex >= 0) {
                currentCuriosityIndex = curiosityIndex;
                updateCuriosity(curiosities[curiosityIndex]);

                // Atualizar número do indicador
                if (curiosityNumber) {
                    curiosityNumber.textContent = String(curiosityIndex + 1).padStart(2, '0');
                }

                // Destacar o dente correspondente
                teeth.forEach(t => t.classList.remove('active'));
                if (curiosities[curiosityIndex]?.element) {
                    curiosities[curiosityIndex].element.classList.add('active');
                }
            }

            // Atualizar barra de progresso
            if (progressBar) {
                progressBar.style.width = `${scrollProgress * 100}%`;
            }
        } else {
            if (curiosityIndicator) {
                curiosityIndicator.classList.remove('visible');
            }
        }
    }

    function updateCuriosity(curiosity) {
        if (!curiosity) return;

        // Animação de fade
        curiosityPanel.style.opacity = '0';
        curiosityPanel.style.transform = 'translateY(20px)';

        setTimeout(() => {
            curiosityTitle.textContent = curiosity.name;
            curiosityText.textContent = curiosity.text;
            curiosityPanel.style.opacity = '1';
            curiosityPanel.style.transform = 'translateY(0)';
        }, 200);
    }

    // ============================================
    // ARRASTAR PARA ROTAÇÃO MANUAL
    // ============================================
    mouthContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        mouthContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;

        targetRotationY += deltaX * 0.5;
        targetRotationX = Math.max(-30, Math.min(60, targetRotationX - deltaY * 0.5));

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        mouthContainer.style.cursor = 'grab';
    });

    // Touch events para mobile
    mouthContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const deltaX = e.touches[0].clientX - lastMouseX;
        const deltaY = e.touches[0].clientY - lastMouseY;

        targetRotationY += deltaX * 0.5;
        targetRotationX = Math.max(-30, Math.min(60, targetRotationX - deltaY * 0.5));

        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // ============================================
    // CLIQUE NOS DENTES
    // ============================================
    teeth.forEach(tooth => {
        tooth.addEventListener('click', () => {
            const name = tooth.dataset.name;
            const curiosity = tooth.dataset.curiosity;

            if (name && curiosity) {
                // Destacar dente
                teeth.forEach(t => t.classList.remove('active'));
                tooth.classList.add('active');

                // Atualizar painel
                updateCuriosity({ name, text: curiosity });

                // Animação de zoom no dente
                const toothElement = tooth.querySelector('.tooth');
                toothElement.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    toothElement.style.transform = '';
                }, 300);
            }
        });
    });

    // ============================================
    // ANIMAÇÃO CONTÍNUA
    // ============================================
    function animateMouth() {
        // Interpolar suavemente para a rotação alvo
        currentRotationX += (targetRotationX - currentRotationX) * 0.1;
        currentRotationY += (targetRotationY - currentRotationY) * 0.1;

        // Aplicar transformação
        mouth3D.style.transform = `
            rotateX(${currentRotationX}deg)
            rotateY(${currentRotationY}deg)
        `;

        requestAnimationFrame(animateMouth);
    }
    animateMouth();

    // Listener de scroll
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chamar inicialmente

    // Definir cursor inicial
    mouthContainer.style.cursor = 'grab';

    // Inicializar com a primeira curiosidade
    if (curiosities.length > 0) {
        updateCuriosity(curiosities[0]);
    }
}

// ============================================
// CARDS DE SERVIÇOS
// ============================================
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Efeito de hover já está no CSS
        });

        // Animação de entrada ao scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form?.querySelector('.btn-submit');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Mostrar loading
        submitBtn.classList.add('loading');

        // Simular envio
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');

            // Reset após 2 segundos
            setTimeout(() => {
                submitBtn.classList.remove('success');
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// ============================================
// ANIMAÇÕES DE SCROLL
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .about-visual, .contact-info, .contact-form');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Adicionar classe para animação
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animate-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
}

// ============================================
// SMOOTH SCROLL PARA TODOS OS LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// PARALLAX SUAVE NO HERO
// ============================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const floatingElements = document.querySelector('.floating-elements');

    if (hero && heroContent) {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / heroHeight);

            if (floatingElements) {
                floatingElements.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
        }
    }
});

// ============================================
// PRELOAD DE FONTES
// ============================================
document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
});
