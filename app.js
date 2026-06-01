/**
 * ASCL Advocacia - Lógica Interativa (JavaScript)
 * Responsável por:
 * 1. Scroll suave para os links do menu e rodapé.
 * 2. Fechamento automático de outras perguntas no FAQ (acordeão exclusivo).
 * 3. Carrossel dinâmico interativo para a seção de depoimentos dos clientes.
 * 4. Animação de revelação de elementos ao rolar a página (Intersection Observer).
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL SUAVE PARA LINKS ÂNCORA
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 85; // Altura do header fixo
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. ACORDEÃO EXCLUSIVO PARA O FAQ
    const faqDetails = document.querySelectorAll('.faq-item');
    faqDetails.forEach(targetDetail => {
        targetDetail.addEventListener('toggle', () => {
            if (targetDetail.open) {
                // Se esta pergunta foi aberta, fecha todas as outras
                faqDetails.forEach(detail => {
                    if (detail !== targetDetail && detail.open) {
                        detail.open = false;
                    }
                });
            }
        });
    });

    // 3. CARROSSEL DE DEPOIMENTOS INTERATIVO (Google Reviews)
    const reviewsGrid = document.querySelector('.reviews-grid');
    const reviewCards = document.querySelectorAll('.review-card');
    
    if (reviewsGrid && reviewCards.length > 0) {
        // Envolve o grid em controles se o usuário puder navegar
        let currentIndex = 0;
        let cardWidth = reviewCards[0].offsetWidth + 30; // Largura do card + gap
        let autoPlayInterval;
        
        // Função para mover para o card atual
        const moveToReview = (index) => {
            if (index < 0) {
                currentIndex = reviewCards.length - 1;
            } else if (index >= reviewCards.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            // Recalcula largura do card em caso de redimensionamento
            cardWidth = reviewCards[0].offsetWidth + 30;
            
            const scrollAmount = currentIndex * cardWidth;
            reviewsGrid.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        };
        
        // Auto-play a cada 6 segundos
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                moveToReview(currentIndex + 1);
            }, 6000);
        };
        
        const stopAutoPlay = () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        };
        
        // Iniciar auto-play
        startAutoPlay();
        
        // Pausar auto-play em interações do usuário (hover/scroll)
        reviewsGrid.addEventListener('mouseenter', stopAutoPlay);
        reviewsGrid.addEventListener('mouseleave', startAutoPlay);
        reviewsGrid.addEventListener('touchstart', stopAutoPlay);
        
        // Ouvinte de resize para ajustar a largura do scroll
        window.addEventListener('resize', () => {
            moveToReview(currentIndex);
        });
    }

    // 4. ANIMAÇÃO DE REVELAÇÃO AO ROLAR A PÁGINA (Intersection Observer)
    const revealElements = [
        ...document.querySelectorAll('.problem-card'),
        ...document.querySelectorAll('.area-item'),
        ...document.querySelectorAll('.timeline-item'),
        ...document.querySelectorAll('.team-card'),
        ...document.querySelectorAll('.faq-item'),
        document.querySelector('.hero-content'),
        document.querySelector('.hero-stats')
    ].filter(el => el !== null); // Garante que não há elementos nulos
    
    // Adiciona classe de preparação para animação
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
    });
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, {
        threshold: 0.1, // Elemento aparece quando 10% estiver na tela
        rootMargin: '0px 0px -50px 0px' // Ativa um pouco antes de entrar
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
