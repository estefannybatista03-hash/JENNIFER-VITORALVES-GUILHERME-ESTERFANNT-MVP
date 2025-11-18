// Configuração e utilitários para a landing page
document.addEventListener("DOMContentLoaded", function() {
    // Inicialização dos componentes
    initSmoothScrolling();
    initMobileMenu();
    initContactForm();
    initAnimations();
    initHeaderScroll();
    initQrTools(); // Nova função para inicializar ferramentas QR
    
    console.log("QR Info - Landing page carregada com sucesso!");
});

// Smooth scrolling para links de navegação
function initSmoothScrolling() {
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            
            if (target) {
                const headerHeight = document.querySelector("header").offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

// Menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav ul");
    
    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function() {
            nav.classList.toggle("mobile-active");
            
            // Animar ícone do menu
            const icon = this.querySelector("i");
            if (nav.classList.contains("mobile-active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });
        
        // Fechar menu ao clicar em um link
        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("mobile-active");
                const icon = menuToggle.querySelector("i");
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            });
        });
    }
}

// Formulário de contato
function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector("button[type=\"submit\"]");
            const originalText = submitButton.innerHTML;
            
            // Mostrar loading
            submitButton.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i> Enviando...";
            submitButton.disabled = true;
            
            try {
                // Simular envio
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Mostrar sucesso
                showNotification("Mensagem enviada com sucesso! Entraremos em contato em breve.", "success");
                this.reset();
                
            } catch (error) {
                showNotification("Erro ao enviar mensagem. Tente novamente.", "error");
            } finally {
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Sistema de notificações
function showNotification(message, type = "info") {
    // Remover notificação existente
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease-in-out;
        max-width: 400px;
    `;
    
    notification.querySelector(".notification-content").style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    notification.querySelector(".notification-close").style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);
    
    // Fechar automaticamente
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Fechar ao clicar no X
    notification.querySelector(".notification-close").addEventListener("click", () => {
        closeNotification(notification);
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: "fa-check-circle",
        error: "fa-exclamation-circle",
        warning: "fa-exclamation-triangle",
        info: "fa-info-circle"
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: "#2ECC71",
        error: "#E74C3C",
        warning: "#F39C12",
        info: "#3498DB"
    };
    return colors[type] || colors.info;
}

function closeNotification(notification) {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Animações de scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll(".benefit-card, .case-card, .step, .contact-card").forEach(el => {
        observer.observe(el);
    });
    
    // Animação de contadores
    const stats = document.querySelectorAll(".stat-number span, .metric-value");
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Animação de contador
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ""));
    const duration = 2000;
    const start = performance.now();
    const suffix = element.textContent.replace(/\d/g, "");
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(target * easeOutQuart(progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Função de easing
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Header com efeito de scroll
function initHeaderScroll() {
    const header = document.querySelector("header");
    let lastScrollY = window.scrollY;
    
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        // Ocultar/mostrar header baseado na direção do scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = "translateY(-100%)";
        } else {
            header.style.transform = "translateY(0)";
        }
        
        lastScrollY = currentScrollY;
    });
}

// Inicialização das ferramentas QR (leitor e gerador)
function initQrTools() {
    // Gerador de QR Code
    const generateQrButton = document.getElementById("generateQr");
    const generatorDataInput = document.getElementById("generatorData");
    const qrcodeGeneratorDiv = document.getElementById("qrcodeGenerator");

    if (generateQrButton && generatorDataInput && qrcodeGeneratorDiv) {
        generateQrButton.addEventListener("click", () => {
            const data = generatorDataInput.value;
            if (data) {
                qrcodeGeneratorDiv.innerHTML = ""; // Limpa o QR Code anterior
                new QRCode(qrcodeGeneratorDiv, {
                    text: data,
                    width: 256,
                    height: 256,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            } else {
                showNotification("Por favor, insira os dados para gerar o QR Code.", "warning");
            }
        });
    }

    // Leitor de QR Code
    const startScannerButton = document.getElementById("startScanner");
    const stopScannerButton = document.getElementById("stopScanner");
    const qrReaderResultsDiv = document.getElementById("qr-reader-results");
    const qrCodeReader = new Html5Qrcode("reader");

    if (startScannerButton && stopScannerButton && qrReaderResultsDiv) {
        startScannerButton.addEventListener("click", () => {
            qrCodeReader.start(
                { facingMode: "environment" }, // Preferir câmera traseira
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 } 
                },
                (decodedText, decodedResult) => {
                    // Lidar com o resultado do QR Code
                    qrReaderResultsDiv.innerHTML = `QR Code escaneado: <strong>${decodedText}</strong>`;
                    showNotification(`QR Code escaneado: ${decodedText}`, "success");
                    
                    // Redirecionar para a página de produto com os dados
                    const encodedData = encodeURIComponent(decodedText);
                    window.location.href = `produto.html?data=${encodedData}`;
                },
                (errorMessage) => {
                    // Erro de leitura (pode ser ignorado para leituras contínuas)
                    // console.log(`Erro de leitura: ${errorMessage}`);
                }
            ).then(() => {
                startScannerButton.style.display = "none";
                stopScannerButton.style.display = "block";
                qrReaderResultsDiv.innerHTML = "Aguardando QR Code...";
            }).catch((err) => {
                showNotification(`Erro ao iniciar scanner: ${err}`, "error");
                console.error("Erro ao iniciar scanner:", err);
            });
        });

        stopScannerButton.addEventListener("click", () => {
            qrCodeReader.stop().then(() => {
                startScannerButton.style.display = "block";
                stopScannerButton.style.display = "none";
                qrReaderResultsDiv.innerHTML = "Scanner parado.";
            }).catch((err) => {
                showNotification(`Erro ao parar scanner: ${err}`, "error");
                console.error("Erro ao parar scanner:", err);
            });
        });
    }
}

// Adicionar estilos CSS dinâmicos
const dynamicStyles = `
    /* Estilos para animações */
    .benefit-card,
    .case-card,
    .step,
    .contact-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .benefit-card.animate-in,
    .case-card.animate-in,
    .step.animate-in,
    .contact-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Header scrolled */
    header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    header {
        transition: transform 0.3s ease-in-out, background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
    
    /* Menu mobile */
    @media (max-width: 768px) {
        nav ul {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease-in-out;
        }
        
        nav ul.mobile-active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        nav ul li {
            margin: 10px 0;
        }
        
        nav ul a {
            padding: 15px 20px;
            border-radius: 8px;
            display: block;
            text-align: center;
        }
    }
    
    /* Melhorias visuais */
    .hero-image {
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
    
    /* Hover effects melhorados */
    .benefit-card:hover,
    .case-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    .step:hover .step-icon {
        transform: scale(1.1) rotate(5deg);
    }
    
    /* Loading states */
    .loading {
        position: relative;
        pointer-events: none;
    }
    
    .loading::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Parallax effect para hero */
    #hero {
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    
    /* Smooth transitions para todos os elementos interativos */
    a, button, .card, .step-icon, .benefit-icon, .case-icon {
        transition: all 0.3s ease-in-out;
    }
    
    /* Focus states melhorados para acessibilidade */
    a:focus,
    button:focus,
    input:focus,
    select:focus,
    textarea:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.2);
    }
    
    /* Scroll suave */
    html {
        scroll-behavior: smooth;
    }
    
    /* Otimizações de performance */
    .hero-image,
    .phone-mockup,
    .qr-code-overlay {
        will-change: transform;
    }
    
    /* Melhorias para dispositivos touch */
    @media (hover: none) and (pointer: coarse) {
        .benefit-card:hover,
        .case-card:hover,
        .step:hover .step-icon {
            transform: none;
        }
        
        .benefit-card:active,
        .case-card:active {
            transform: scale(0.98);
        }
    }
`;

// Adicionar estilos ao head
const styleSheet = document.createElement("style");
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Utilitários adicionais
const LandingUtils = {
    // Scroll suave para elemento específico
    scrollToElement: (elementId, offset = 80) => {
        const element = document.getElementById(elementId);
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        }
    },
    
    // Verificar se elemento está visível
    isElementInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Debounce para otimizar eventos de scroll
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Lazy loading para imagens
    lazyLoadImages: () => {
        const images = document.querySelectorAll("img[data-src]");
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy");
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// Expor utilitários globalmente
window.LandingUtils = LandingUtils;

// Performance monitoring
if ("performance" in window) {
    window.addEventListener("load", () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Página carregada em ${loadTime}ms`);
    });
}

// Service Worker para cache (opcional)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .then(registration => {
                console.log("SW registrado com sucesso:", registration);
            })
            .catch(registrationError => {
                console.log("Falha no registro do SW:", registrationError);
            });
    });
}


