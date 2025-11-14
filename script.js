// Cache for resources
const resourceCache = {
    images: [],
    fonts: [],
    icons: [],
    projects: []
};

// Language toggle function
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
}

// Hide loading screen immediately when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 100);
    }
    
    // Load projects in background
    setTimeout(() => {
        if (typeof window.supabase !== 'undefined') {
            const SUPABASE_URL = 'https://bkvcmceyxsgzvvcozwkf.supabase.co';
            const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrdmNtY2V5eHNnenZ2Y296d2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDAyODQsImV4cCI6MjA3NTY3NjI4NH0.TtZg_fT1gBCfxx7jT9bTk_ylm7kAjQGflCbMKcyZJWY';
            const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            
            supabase
                .from('projects')
                .select('image_url')
                .or('show_on_homepage.eq.true,show_on_homepage.is.null')
                .order('id', { ascending: false })
                .then(({ data: projects }) => {
                    if (projects && projects.length > 0) {
                        resourceCache.projects = projects;
                    }
                })
                .catch(error => console.error('Error loading projects:', error));
        }
    }, 200);
});

// Language Toggle Function
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
}

// Header Scroll Effect and Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header scroll effect
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }, { passive: true });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && navMenu) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuToggle && navMenu && 
            !menuToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Enhanced Scroll Animations with Fade Effects
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add visible class for fade-up animation
            entry.target.classList.add('visible');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const progress = progressBar.getAttribute('data-progress');
                    progressBar.style.width = progress + '%';
                }
            }
            
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

// Observe all fade-up elements
const fadeElements = document.querySelectorAll('.fade-up');
fadeElements.forEach(el => observer.observe(el));

// Observe skill cards
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(el => observer.observe(el));

// Counter Animation for Achievements
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 1500;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Observe achievement numbers
const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.achievement-number');
            numbers.forEach(number => {
                if (number.textContent === '0') {
                    animateCounter(number);
                }
            });
            achievementObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

const achievementsSection = document.querySelector('.achievements');
if (achievementsSection) {
    achievementObserver.observe(achievementsSection);
}

// Dynamic Portfolio on Homepage
document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = 'https://bkvcmceyxsgzvvcozwkf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrdmNtY2V5eHNnenZ2Y296d2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDAyODQsImV4cCI6MjA3NTY3NjI4NH0.TtZg_fT1gBCfxx7jT9bTk_ylm7kAjQGflCbMKcyZJWY';

    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return;
    }

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const portfolioGrid = document.querySelector('#portfolio .portfolio-grid');
    const categoryList = document.querySelector('#portfolio .category-list');

    async function loadHomepagePortfolio() {
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = '';
        
        if (categoryList) {
            categoryList.style.display = 'none';
        }

        try {
            let projects = resourceCache.projects;
            
            if (!projects || projects.length === 0) {
                const { data, error } = await supabase
                    .from('projects')
                    .select('image_url')
                    .or('show_on_homepage.eq.true,show_on_homepage.is.null')
                    .order('id', { ascending: true })
                    .limit(3);

                if (error) {
                    console.error('Error fetching projects:', error);
                    portfolioGrid.innerHTML = '<p style="text-align: center; width: 100%;">حدث خطأ أثناء تحميل المشاريع.</p>';
                    return;
                }
                
                projects = data;
            }

            if (projects.length === 0) {
                 portfolioGrid.innerHTML = '<p style="text-align: center; width: 100%;">لا توجد مشاريع لعرضها حالياً.</p>';
                 return;
            }

            const imagesToShow = projects.slice(0, 3);

            imagesToShow.forEach((project, index) => {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                portfolioItem.style.opacity = '1';
                portfolioItem.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
                
                const img = document.createElement('img');
                img.src = project.image_url;
                img.alt = 'Project Image';
                img.loading = 'lazy';
                
                img.onerror = function() {
                    this.style.display = 'none';
                    portfolioItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                };
                
                portfolioItem.appendChild(img);
                portfolioGrid.appendChild(portfolioItem);
            });

        } catch (error) {
            console.error('Error loading homepage portfolio:', error);
            portfolioGrid.innerHTML = '<p>حدث خطأ أثناء تحميل المشاريع.</p>';
        }
    }

    loadHomepagePortfolio();
    
    // Wave Ripple Effect - تأثير التموج المتتابع
    function startWaveRipple() {
        const portfolioItems = document.querySelectorAll('#portfolio .portfolio-item');
        if (portfolioItems.length === 0) return;
        
        let currentIndex = 0;
        
        setInterval(() => {
            // تطبيق التأثير على البطاقة الحالية
            const card = portfolioItems[currentIndex];
            card.classList.add('wave-ripple');
            
            // إزالة التأثير بعد انتهاء الأنيميشن
            setTimeout(() => {
                card.classList.remove('wave-ripple');
            }, 1200);
            
            // الانتقال للبطاقة التالية
            currentIndex = (currentIndex + 1) % portfolioItems.length;
        }, 1500); // كل 1.5 ثانية
    }
    
    // بدء تأثير التموج بعد تحميل الصور
    setTimeout(() => {
        startWaveRipple();
    }, 2000);
    
    // Add hover and click effects to portfolio items
    function addInteractiveEffects() {
        const portfolioItems = document.querySelectorAll('#portfolio .portfolio-item');
        
        portfolioItems.forEach(item => {
            // تأثير عند النقر
            item.addEventListener('click', function() {
                // إضافة تأثير عشوائي عند النقر
                const effects = ['glow-pulse', 'rotate-scale', 'float-bounce'];
                const randomEffect = effects[Math.floor(Math.random() * effects.length)];
                
                this.classList.add(randomEffect);
                
                setTimeout(() => {
                    this.classList.remove(randomEffect);
                }, 1000);
            });
        });
    }
    
    // تفعيل التأثيرات التفاعلية بعد تحميل الصور
    setTimeout(() => {
        addInteractiveEffects();
    }, 2000);
    
    // Auto-shuffle images - DISABLED FOR PERFORMANCE
    // Uncomment below to enable shuffling (may impact performance)
    /*
    let allProjects = [];
    
    async function loadAllProjects() {
        try {
            if (resourceCache.projects && resourceCache.projects.length > 0) {
                allProjects = resourceCache.projects;
                startImageShuffling();
                return;
            }
            
            const { data: projects, error } = await supabase
                .from('projects')
                .select('image_url')
                .or('show_on_homepage.eq.true,show_on_homepage.is.null')
                .order('id', { ascending: false });

            if (!error && projects) {
                allProjects = projects;
                resourceCache.projects = projects;
                startImageShuffling();
            }
        } catch (error) {
            console.error('Error loading all projects:', error);
        }
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function startImageShuffling() {
        const portfolioGridElement = document.querySelector('#portfolio .portfolio-grid');
        if (!portfolioGridElement || allProjects.length <= 3) return;

        setInterval(() => {
            const portfolioItems = portfolioGridElement.querySelectorAll('.portfolio-item');
            if (portfolioItems.length === 0) return;

            const shuffledProjects = shuffleArray(allProjects);
            const selectedImages = shuffledProjects.slice(0, 3);

            portfolioItems.forEach((item, index) => {
                item.classList.add('shuffling');
                
                setTimeout(() => {
                    const img = item.querySelector('img');
                    if (img && selectedImages[index]) {
                        img.src = selectedImages[index].image_url;
                    }
                }, 300);

                setTimeout(() => {
                    item.classList.remove('shuffling');
                }, 600);
            });

        }, 5000);
    }

    setTimeout(() => {
        loadAllProjects();
    }, 3000);
    */
});

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle smooth scrolling for all anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Specifically handle the hero CTA button
    const heroCTA = document.querySelector('.hero .btn-primary');
    if (heroCTA) {
        heroCTA.addEventListener('click', function(e) {
            e.preventDefault();
            
            const portfolioSection = document.querySelector('#portfolio');
            if (portfolioSection) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = portfolioSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Testimonials Slider
    const slider = document.querySelector('.testimonials-slider');
    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');
    const dotsContainer = document.querySelector('.testimonials-dots');
    
    // Wait for slides to be loaded from Firebase
    function initTestimonialsSlider() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonials-dots .dot');
        
        if (!slider || slides.length === 0) {
            console.log('Slider not ready, retrying...');
            setTimeout(initTestimonialsSlider, 500);
            return;
        }
        
        let currentSlide = 0;
        
        console.log(`Initializing slider with ${slides.length} slides`);
        
        window.updateSlider = function() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (dots[index]) dots[index].classList.remove('active');
            });
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }
        
        window.goToSlide = function(index) {
            currentSlide = index;
            window.updateSlider();
        }
        
        window.nextSlide = function() {
            currentSlide = (currentSlide + 1) % slides.length;
            window.updateSlider();
        }
        
        window.prevSlide = function() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            window.updateSlider();
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', window.nextSlide);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', window.prevSlide);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                window.nextSlide();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                window.prevSlide();
            }
        });
        
        // Touch swipe support
        let touchStartY = 0;
        let touchEndY = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        slider.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    window.nextSlide();
                } else {
                    window.prevSlide();
                }
            }
        }
        
        // Auto play (optional)
        let autoPlayInterval;
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(window.nextSlide, 5000);
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Start auto play
        startAutoPlay();
        
        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        
        console.log('Testimonials slider initialized successfully');
    }
    
    // Initialize slider immediately and also after DOM load
    initTestimonialsSlider();
    window.initTestimonialsSlider = initTestimonialsSlider;
    
});
