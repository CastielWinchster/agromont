// App State Management
class AppState {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.theme = 'light';
        this.isMenuOpen = false;
    }

    setAuthenticated(user) {
        this.isAuthenticated = true;
        this.currentUser = user;
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        
        const themeIcon = document.querySelector('#theme-toggle i');
        if (this.theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
        
        // Save theme preference
        localStorage.setItem('ilume-theme', this.theme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('ilume-theme');
        if (savedTheme) {
            this.theme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.theme);
            const themeIcon = document.querySelector('#theme-toggle i');
            if (this.theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }
    }
}

// Initialize app state
const appState = new AppState();

// DOM Elements
const elements = {
    // Navigation
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav__link'),
    themeToggle: document.getElementById('theme-toggle'),
    brand: document.querySelector('.nav__brand'),
    // Dashboard Brand
    dashboardBrand: null, // Will be set later
    // Modals
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    loginModal: document.getElementById('login-modal'),
    registerModal: document.getElementById('register-modal'),
    loginClose: document.getElementById('login-close'),
    registerClose: document.getElementById('register-close'),
    // Forms
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    contactForm: document.getElementById('contact-form'),
    // Dashboard
    dashboard: document.getElementById('dashboard'),
    mainContent: document.getElementById('main-content'),
    logoutBtn: document.getElementById('logout-btn'),
    userNameEl: document.getElementById('user-name'),
    // Modal switches
    switchToRegister: document.getElementById('switch-to-register'),
    switchToLogin: document.getElementById('switch-to-login'),
    // Scroll to top
    scrollTop: document.getElementById('scroll-top'),
    // Hero CTAs
    heroCTAs: null // Will be set later
};

// Utility Functions
const utils = {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    isValidPassword(password) {
        return password.length >= 6;
    },
    showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    },
    clearError(elementId) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    },
    clearAllErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const errors = form.querySelectorAll('.form-error');
            errors.forEach(error => {
                error.textContent = '';
                error.style.display = 'none';
            });
        }
    },
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
        `;
        document.body.appendChild(successDiv);
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }, 3000);
    },
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 3000);
    },
    scrollToElement(elementId) {
        const element = document.getElementById(elementId.replace('#', ''));
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    setButtonLoading(button, loading = true) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        } else {
            button.disabled = false;
            button.innerHTML = button.getAttribute('data-original-text');
        }
    }
};

// Hero CTA Functions
const heroCTA = {
    init() {
        // Set up hero CTA buttons
        elements.heroCTAs = document.querySelectorAll('.hero__actions .btn');
        
        elements.heroCTAs.forEach(btn => {
            const btnText = btn.textContent.trim();
            
            if (btnText === 'Começar Projeto') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Scroll to contact section
                    utils.scrollToElement('#contact');
                    navigation.setActiveLink(document.querySelector('.nav__link[href="#contact"]'));
                    
                    // Focus on the contact form name field after scrolling
                    setTimeout(() => {
                        const nameField = document.querySelector('#contact .form-control');
                        if (nameField) {
                            nameField.focus();
                        }
                    }, 800);
                });
            } else if (btnText === 'Ver Portfolio') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Scroll to portfolio section
                    utils.scrollToElement('#portfolio');
                    navigation.setActiveLink(document.querySelector('.nav__link[href="#portfolio"]'));
                });
            }
        });
    }
};

// Navigation Functions
const navigation = {
    init() {
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', this.toggleMobileMenu);
        }
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    // If dashboard is visible, return to landing page!
                    if (!elements.mainContent.classList.contains('hidden')) {
                        utils.scrollToElement(href);
                        this.setActiveLink(link);
                        this.closeMobileMenu();
                    } else {
                        auth.showMainContent();
                        setTimeout(() => { utils.scrollToElement(href); }, 400);
                        this.setActiveLink(link);
                        this.closeMobileMenu();
                    }
                }
            });
        });
        // Brand click returns user to landing page if logged in
        if (elements.brand) {
            elements.brand.addEventListener('click', (e) => {
                e.preventDefault();
                if (!elements.mainContent.classList.contains('hidden')) {
                    utils.scrollToElement('#home');
                    navigation.setActiveLink(document.querySelector('.nav__link[href="#home"]'));
                    return;
                }
                auth.showMainContent();
                navigation.setActiveLink(document.querySelector('.nav__link[href="#home"]'));
                setTimeout(() => { utils.scrollToElement('#home'); }, 400);
            });
        }
        // Dashboard brand click (needs to be set post login)
        setTimeout(() => {
            elements.dashboardBrand = document.querySelector('.sidebar__header');
            if (elements.dashboardBrand) {
                elements.dashboardBrand.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.showMainContent();
                    navigation.setActiveLink(document.querySelector('.nav__link[href="#home"]'));
                    setTimeout(() => { utils.scrollToElement('#home'); }, 400);
                });
            }
        }, 1000);
        document.addEventListener('click', (e) => {
            if (elements.navMenu && elements.navToggle && 
                !elements.navMenu.contains(e.target) && !elements.navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        window.addEventListener('scroll', this.updateActiveLink);
    },
    toggleMobileMenu() {
        appState.isMenuOpen = !appState.isMenuOpen;
        elements.navMenu.classList.toggle('active');
        const icon = elements.navToggle.querySelector('i');
        if (appState.isMenuOpen) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    },
    closeMobileMenu() {
        appState.isMenuOpen = false;
        if (elements.navMenu) {
            elements.navMenu.classList.remove('active');
        }
        if (elements.navToggle) {
            const icon = elements.navToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    },
    setActiveLink(activeLink) {
        elements.navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    },
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                if (activeLink) {
                    navigation.setActiveLink(activeLink);
                }
            }
        });
    }
};

// Modal Functions
const modal = {
    init() {
        if (elements.loginBtn) {
            elements.loginBtn.addEventListener('click', () => this.openModal('login'));
        }
        if (elements.loginClose) {
            elements.loginClose.addEventListener('click', () => this.closeModal('login'));
        }
        if (elements.registerBtn) {
            elements.registerBtn.addEventListener('click', () => this.openModal('register'));
        }
        if (elements.registerClose) {
            elements.registerClose.addEventListener('click', () => this.closeModal('register'));
        }
        if (elements.switchToRegister) {
            elements.switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal('login');
                this.openModal('register');
            });
        }
        if (elements.switchToLogin) {
            elements.switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal('register');
                this.openModal('login');
            });
        }
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__backdrop')) {
                this.closeAllModals();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    },
    openModal(modalType) {
        const modal = document.getElementById(`${modalType}-modal`);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },
    closeModal(modalType) {
        const modal = document.getElementById(`${modalType}-modal`);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                utils.clearAllErrors(form.id);
            }
        }
    },
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }
};

// Form Validation
const validation = {
    init() {
        this.setupRealTimeValidation('login-form', {
            'login-email': (value) => {
                if (!value) return 'Email é obrigatório';
                if (!utils.isValidEmail(value)) return 'Email inválido';
                return null;
            },
            'login-password': (value) => {
                if (!value) return 'Senha é obrigatória';
                if (!utils.isValidPassword(value)) return 'Senha deve ter pelo menos 6 caracteres';
                return null;
            }
        });
        this.setupRealTimeValidation('register-form', {
            'register-name': (value) => {
                if (!value) return 'Nome é obrigatório';
                if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
                return null;
            },
            'register-email': (value) => {
                if (!value) return 'Email é obrigatório';
                if (!utils.isValidEmail(value)) return 'Email inválido';
                return null;
            },
            'register-password': (value) => {
                if (!value) return 'Senha é obrigatória';
                if (!utils.isValidPassword(value)) return 'Senha deve ter pelo menos 6 caracteres';
                return null;
            },
            'register-confirm-password': (value) => {
                const password = document.getElementById('register-password');
                if (!password) return 'Erro interno';
                if (!value) return 'Confirmação de senha é obrigatória';
                if (value !== password.value) return 'Senhas não conferem';
                return null;
            }
        });
    },
    setupRealTimeValidation(formId, validators) {
        const form = document.getElementById(formId);
        if (!form) return;
        Object.keys(validators).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(fieldId, validators[fieldId]);
                });
                field.addEventListener('input', () => {
                    utils.clearError(`${fieldId}-error`);
                });
            }
        });
    },
    validateField(fieldId, validator) {
        const field = document.getElementById(fieldId);
        const errorId = `${fieldId}-error`;
        if (field) {
            const error = validator(field.value);
            if (error) {
                utils.showError(errorId, error);
                field.classList.add('error');
                return false;
            } else {
                utils.clearError(errorId);
                field.classList.remove('error');
                return true;
            }
        }
        return false;
    },
    validateForm(formId, validators) {
        let isValid = true;
        Object.keys(validators).forEach(fieldId => {
            if (!this.validateField(fieldId, validators[fieldId])) {
                isValid = false;
            }
        });
        return isValid;
    }
};

// Authentication
const auth = {
    init() {
        if (elements.loginForm) {
            elements.loginForm.addEventListener('submit', this.handleLogin);
        }
        if (elements.registerForm) {
            elements.registerForm.addEventListener('submit', this.handleRegister);
        }
        if (elements.logoutBtn) {
            elements.logoutBtn.addEventListener('click', this.handleLogout);
        }
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', this.handleSocialAuth);
        });
    },
    async handleLogin(e) {
        e.preventDefault();
        const validators = {
            'login-email': (value) => {
                if (!value) return 'Email é obrigatório';
                if (!utils.isValidEmail(value)) return 'Email inválido';
                return null;
            },
            'login-password': (value) => {
                if (!value) return 'Senha é obrigatória';
                if (!utils.isValidPassword(value)) return 'Senha deve ter pelo menos 6 caracteres';
                return null;
            }
        };
        if (!validation.validateForm('login-form', validators)) {
            return;
        }
        const submitBtn = elements.loginForm.querySelector('button[type="submit"]');
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        utils.setButtonLoading(submitBtn, true);
        // Simulate API call
        setTimeout(() => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if (utils.isValidEmail(email) && utils.isValidPassword(password)) {
                const user = {
                    name: email.split('@')[0],
                    email: email
                };
                appState.setAuthenticated(user);
                auth.showDashboard();
                modal.closeModal('login');
                utils.showSuccess('Login realizado com sucesso!');
            } else {
                utils.showErrorMessage('Credenciais inválidas');
            }
            utils.setButtonLoading(submitBtn, false);
        }, 1500);
    },
    async handleRegister(e) {
        e.preventDefault();
        const validators = {
            'register-name': (value) => {
                if (!value) return 'Nome é obrigatório';
                if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
                return null;
            },
            'register-email': (value) => {
                if (!value) return 'Email é obrigatório';
                if (!utils.isValidEmail(value)) return 'Email inválido';
                return null;
            },
            'register-password': (value) => {
                if (!value) return 'Senha é obrigatória';
                if (!utils.isValidPassword(value)) return 'Senha deve ter pelo menos 6 caracteres';
                return null;
            },
            'register-confirm-password': (value) => {
                const password = document.getElementById('register-password').value;
                if (!value) return 'Confirmação de senha é obrigatória';
                if (value !== password) return 'Senhas não conferem';
                return null;
            }
        };
        if (!validation.validateForm('register-form', validators)) {
            return;
        }
        const submitBtn = elements.registerForm.querySelector('button[type="submit"]');
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        utils.setButtonLoading(submitBtn, true);
        // Simulate API call
        setTimeout(() => {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const user = { name: name, email: email };
            appState.setAuthenticated(user);
            auth.showDashboard();
            modal.closeModal('register');
            utils.showSuccess('Cadastro realizado com sucesso!');
            utils.setButtonLoading(submitBtn, false);
        }, 1500);
    },
    handleLogout(e) {
        e.preventDefault();
        appState.logout();
        auth.showMainContent();
        navigation.setActiveLink(document.querySelector('.nav__link[href="#home"]'));
        setTimeout(() => { utils.scrollToElement('#home'); }, 400);
        utils.showSuccess('Logout realizado com sucesso!');
    },
    handleSocialAuth(e) {
        e.preventDefault();
        const platform = e.currentTarget.textContent.trim();
        utils.showSuccess(`Login com ${platform} em desenvolvimento!`);
    },
    showDashboard() {
        if (elements.mainContent) {
            elements.mainContent.classList.add('hidden');
        }
        if (elements.dashboard) {
            elements.dashboard.classList.remove('hidden');
        }
        if (elements.userNameEl && appState.currentUser) {
            elements.userNameEl.textContent = appState.currentUser.name;
        }
        // dashboardBrand logo event: recreate each time dashboard opens
        elements.dashboardBrand = document.querySelector('.sidebar__header');
        if (elements.dashboardBrand) {
            elements.dashboardBrand.addEventListener('click', (e) => {
                e.preventDefault();
                auth.showMainContent();
                navigation.setActiveLink(document.querySelector('.nav__link[href="#home"]'));
                setTimeout(() => { utils.scrollToElement('#home'); }, 400);
            });
        }
    },
    showMainContent() {
        if (elements.dashboard) {
            elements.dashboard.classList.add('hidden');
        }
        if (elements.mainContent) {
            elements.mainContent.classList.remove('hidden');
        }
    }
};

// Animations and Effects
const effects = {
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupScrollToTop();
    },
    setupScrollAnimations() {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .stat, .contact__item');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    },
    setupHoverEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (!btn.disabled) {
                    btn.style.transform = 'translateY(-2px)';
                }
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    },
    setupScrollToTop() {
        const scrollTopBtn = elements.scrollTop;
        if (scrollTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollTopBtn.classList.remove('hidden');
                } else {
                    scrollTopBtn.classList.add('hidden');
                }
            });
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
};

// Contact Form
const contact = {
    init() {
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', this.handleSubmit);
        }
    },
    async handleSubmit(e) {
        e.preventDefault();
        const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        utils.setButtonLoading(submitBtn, true);
        // Simulate form submission
        setTimeout(() => {
            utils.showSuccess('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            elements.contactForm.reset();
            utils.setButtonLoading(submitBtn, false);
        }, 1500);
    }
};

// Theme Management
const theme = {
    init() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => {
                appState.toggleTheme();
            });
        }
        // Load saved theme on init
        appState.loadTheme();
    }
};

// Add custom styles for animations and effects
const addCustomStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
        .animate-in { 
            opacity: 1 !important; 
            transform: translateY(0) !important; 
        }
        .form-control.error { 
            border-color: var(--error-color); 
            box-shadow: 0 0 0 3px var(--error-light); 
        }
        .nav__menu.active { 
            transform: translateY(0) !important; 
            opacity: 1 !important; 
            visibility: visible !important; 
        }
        
        /* Logo hover effects */
        .nav__brand:hover .logo {
            transform: scale(1.05);
        }
        
        .nav__brand:hover .brand-name {
            color: var(--highlight-color);
        }
        
        /* Smooth logo animations */
        .logo circle {
            transition: all var(--transition-normal);
        }
        
        /* Enhanced button effects */
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .btn:hover::before {
            left: 100%;
        }
        
        /* Enhanced service card animations */
        .service-card {
            transform-origin: center bottom;
        }
        
        .service-card:hover .service-card__icon {
            transform: scale(1.1) rotate(5deg);
            transition: transform var(--transition-normal);
        }
        
        /* Portfolio item animations */
        .portfolio-item__image {
            overflow: hidden;
        }
        
        .portfolio-item:hover .portfolio-item__image::after {
            animation: bounce 0.6s ease-in-out;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); }
            40% { transform: translate(-50%, -50%) translateY(-10px); }
            60% { transform: translate(-50%, -50%) translateY(-5px); }
        }
        
        /* Theme transition animations */
        * {
            transition: background-color var(--transition-normal), 
                       color var(--transition-normal),
                       border-color var(--transition-normal);
        }
    `;
    document.head.appendChild(style);
};

// Main App Object
const app = {
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => { 
                this.initializeComponents(); 
            });
        } else { 
            this.initializeComponents(); 
        }
    },
    initializeComponents() {
        console.log('🚀 ILUME - Initializing application...');
        
        addCustomStyles();
        theme.init(); // Load theme first
        navigation.init();
        heroCTA.init(); // Initialize hero CTA buttons
        modal.init();
        validation.init();
        auth.init();
        effects.init();
        contact.init();
        this.addInitialAnimations();
        
        console.log('✨ ILUME - Inovação e Clareza - Application ready!');
    },
    addInitialAnimations() {
        const heroContent = document.querySelector('.hero__content');
        const heroVisual = document.querySelector('.hero__visual');
        
        if (heroContent) {
            heroContent.style.animation = 'slideInLeft 1s ease-out';
        }
        if (heroVisual) {
            heroVisual.style.animation = 'slideInRight 1s ease-out';
        }
        
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.style.transform = 'translateY(-100px)';
            nav.style.opacity = '0';
            setTimeout(() => {
                nav.style.transform = 'translateY(0)';
                nav.style.opacity = '1';
                nav.style.transition = 'all 0.6s ease-out';
            }, 100);
        }
        
        // Animate logo on load
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'scale(0.8)';
            setTimeout(() => {
                logo.style.opacity = '1';
                logo.style.transform = 'scale(1)';
                logo.style.transition = 'all 0.6s ease-out';
            }, 300);
        }
    }
};

// Initialize the app
app.init();