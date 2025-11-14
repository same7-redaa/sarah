// Testimonials Dynamic Loader from Firebase
import { db, collection, getDocs } from './firebase-config.js';

async function loadTestimonials() {
    const slider = document.querySelector('.testimonials-slider');
    const dotsContainer = document.querySelector('.testimonials-dots');
    
    if (!slider) {
        console.log('Testimonials slider not found, retrying...');
        // إعادة المحاولة بعد تحميل الصفحة بالكامل
        setTimeout(loadTestimonials, 1000);
        return;
    }

    try {
        console.log('Loading testimonials from Firebase...');
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const testimonials = [];
        
        querySnapshot.forEach((doc) => {
            testimonials.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Loaded ${testimonials.length} testimonials`);

        // Sort by creation date (newest first)
        testimonials.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });

        if (testimonials.length === 0) {
            slider.innerHTML = '<div class="testimonial-slide active"><p style="color: #aaa;">لا توجد صور قصص نجاح حالياً</p></div>';
            dotsContainer.innerHTML = '';
            return;
        }

        // Clear existing slides
        slider.innerHTML = '';
        if (dotsContainer) dotsContainer.innerHTML = '';

        // Add new slides
        testimonials.forEach((testimonial, index) => {
            // Add slide
            const slide = document.createElement('div');
            slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = testimonial.url;
            img.alt = testimonial.title || 'Success Story';
            img.onerror = function() {
                console.error('Failed to load image:', testimonial.url);
                this.src = 'https://via.placeholder.com/800x600?text=Error+Loading+Image';
            };
            
            slide.appendChild(img);
            slider.appendChild(slide);

            // Add dot
            if (dotsContainer) {
                const dot = document.createElement('div');
                dot.className = `dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('onclick', `goToSlide(${index})`);
                dotsContainer.appendChild(dot);
            }
        });

        console.log('Testimonials loaded successfully');

        // Reinitialize slider after loading
        setTimeout(() => {
            if (window.initTestimonialsSlider) {
                console.log('Reinitializing slider...');
                window.initTestimonialsSlider();
            }
        }, 200);

    } catch (error) {
        console.error('Error loading testimonials:', error);
        slider.innerHTML = `<div class="testimonial-slide active"><p style="color: #f44336;">حدث خطأ في تحميل الصور: ${error.message}</p></div>`;
        if (dotsContainer) dotsContainer.innerHTML = '';
    }
}

// Load on page load with multiple triggers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTestimonials);
} else {
    // DOM already loaded
    loadTestimonials();
}

// Also try loading after window is fully loaded
window.addEventListener('load', loadTestimonials);

// Expose function globally for manual refresh
window.refreshTestimonials = loadTestimonials;

export { loadTestimonials };
