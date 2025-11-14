// Clients Dynamic Loader from Firebase
import { db, collection, getDocs } from './firebase-config.js';

async function loadClients() {
    // محاولة البحث بـ ID أو class
    const clientsGrid = document.getElementById('clientsGallery') || document.querySelector('.clients-gallery');
    
    if (!clientsGrid) {
        console.log('Clients gallery not found, retrying...');
        // إعادة المحاولة بعد تحميل الصفحة بالكامل
        setTimeout(loadClients, 1000);
        return;
    }

    try {
        console.log('Loading clients from Firebase...');
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const clients = [];
        
        querySnapshot.forEach((doc) => {
            clients.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Loaded ${clients.length} clients`);

        // Sort by creation date (oldest first for clients)
        clients.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateA - dateB;
        });

        if (clients.length === 0) {
            clientsGrid.innerHTML = '<p style="text-align: center; color: #aaa; grid-column: 1 / -1;">لا توجد شعارات عملاء حالياً</p>';
            return;
        }

        // Clear existing logos
        clientsGrid.innerHTML = '';

        // Add new logos with fade-up animation
        clients.forEach((client, index) => {
            const logoBox = document.createElement('div');
            logoBox.className = 'client-logo-box fade-up';
            logoBox.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
            
            // Add logo glow effect
            const logoGlow = document.createElement('div');
            logoGlow.className = 'logo-glow';
            logoBox.appendChild(logoGlow);
            
            const img = document.createElement('img');
            img.src = client.url;
            img.alt = client.name || 'Client Logo';
            img.loading = 'lazy';
            img.onerror = function() {
                console.error('Failed to load client logo:', client.url);
                this.src = 'https://via.placeholder.com/200x100?text=Logo+Error';
            };
            
            logoBox.appendChild(img);
            clientsGrid.appendChild(logoBox);
            
            // Trigger fade-up animation
            setTimeout(() => {
                logoBox.classList.add('visible');
            }, 100 + (index * 50));
        });

        console.log('Clients loaded successfully');

    } catch (error) {
        console.error('Error loading clients:', error);
        clientsGrid.innerHTML = `<p style="text-align: center; color: #f44336; grid-column: 1 / -1;">حدث خطأ في تحميل شعارات العملاء: ${error.message}</p>`;
    }
}

// Load on page load with multiple triggers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadClients);
} else {
    // DOM already loaded
    loadClients();
}

// Also try loading after window is fully loaded
window.addEventListener('load', loadClients);

// Expose function globally for manual refresh
window.refreshClients = loadClients;

export { loadClients };
