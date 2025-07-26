// Global variables
let currentUser = null;
let userType = null; // 'renter' or 'owner'

// DOM elements
const loginModal = document.getElementById('loginModal');
const dashboard = document.getElementById('dashboard');
const modalTitle = document.getElementById('modalTitle');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    addEventListeners();
    createRippleEffect();
});

function initializeApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('rentzyUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.category-card, .feature-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function addEventListeners() {
    // Modal event listeners
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeModal();
        }
    });
    
    // Form submissions
    const loginFormElement = loginForm.querySelector('form');
    const signupFormElement = signupForm.querySelector('form');
    
    loginFormElement.addEventListener('submit', handleLogin);
    signupFormElement.addEventListener('submit', handleSignup);
    
    // Dashboard menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchDashboardSection(section);
            
            // Update active menu item
            document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            handleCategoryClick(category);
        });
    });
    
    // Google login button
    document.querySelector('.btn-google').addEventListener('click', handleGoogleLogin);
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Add listing button
    const addListingBtn = document.querySelector('.btn-add-listing');
    if (addListingBtn) {
        addListingBtn.addEventListener('click', handleAddListing);
    }
}

function createRippleEffect() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-hero-primary, .btn-hero-secondary').forEach(button => {
        button.classList.add('ripple');
        
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Modal functions
function openLogin(type) {
    userType = type;
    const title = type === 'renter' ? 'Login as Renter' : 'Login as Owner';
    modalTitle.textContent = title;
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Reset forms
    showLogin();
}

function closeModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showLogin() {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-btn:first-child').classList.add('active');
}

function showSignup() {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-btn:last-child').classList.add('active');
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: e.target.querySelector('input[type="text"]').value,
        password: e.target.querySelector('input[type="password"]').value
    };
    
    // Simulate login (in real app, this would be an API call)
    if (loginData.email && loginData.password) {
        currentUser = {
            id: Date.now(),
            name: 'John Doe',
            email: loginData.email,
            phone: '+91 9876543210',
            type: userType,
            aadhaar: '1234-5678-9012',
            pan: 'ABCDE1234F'
        };
        
        localStorage.setItem('rentzyUser', JSON.stringify(currentUser));
        closeModal();
        showDashboard();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Please fill all fields', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const inputs = e.target.querySelectorAll('input');
    const signupData = {
        name: inputs[0].value,
        email: inputs[1].value,
        phone: inputs[2].value,
        aadhaar: inputs[3].value,
        pan: inputs[4].value,
        password: inputs[5].value,
        confirmPassword: inputs[6].value
    };
    
    // Validate inputs
    if (!validateSignupData(signupData)) {
        return;
    }
    
    // Simulate signup
    currentUser = {
        id: Date.now(),
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        type: userType,
        aadhaar: signupData.aadhaar,
        pan: signupData.pan
    };
    
    localStorage.setItem('rentzyUser', JSON.stringify(currentUser));
    closeModal();
    showDashboard();
    showNotification('Account created successfully!', 'success');
}

function validateSignupData(data) {
    // Check if all fields are filled
    for (let key in data) {
        if (!data[key]) {
            showNotification(`Please fill the ${key} field`, 'error');
            return false;
        }
    }
    
    // Check password match
    if (data.password !== data.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email', 'error');
        return false;
    }
    
    // Validate phone
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    // Validate Aadhaar
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(data.aadhaar.replace(/[-\s]/g, ''))) {
        showNotification('Please enter a valid 12-digit Aadhaar number', 'error');
        return false;
    }
    
    // Validate PAN
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(data.pan.toUpperCase())) {
        showNotification('Please enter a valid PAN number', 'error');
        return false;
    }
    
    return true;
}

function handleGoogleLogin() {
    // Simulate Google login
    currentUser = {
        id: Date.now(),
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        phone: '+91 9876543210',
        type: userType,
        aadhaar: '1234-5678-9012',
        pan: 'ABCDE1234F'
    };
    
    localStorage.setItem('rentzyUser', JSON.stringify(currentUser));
    closeModal();
    showDashboard();
    showNotification('Google login successful!', 'success');
}

// Dashboard functions
function showDashboard() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.categories').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    document.querySelector('.navbar').style.display = 'none';
    
    dashboard.classList.remove('hidden');
    dashboard.classList.add('active');
    
    // Update user info
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}`;
    
    // Load dashboard data
    loadDashboardData();
}

function loadDashboardData() {
    // Load sample data for different sections
    loadOverviewData();
    loadBrowseItems();
    loadBookings();
    loadListings();
    loadProfile();
}

function loadOverviewData() {
    // This would typically fetch real data from an API
    const stats = {
        activeBookings: Math.floor(Math.random() * 20) + 1,
        pendingRequests: Math.floor(Math.random() * 30) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1),
        earnings: Math.floor(Math.random() * 50000) + 10000
    };
    
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('h3').textContent = stats.activeBookings;
        statCards[1].querySelector('h3').textContent = stats.pendingRequests;
        statCards[2].querySelector('h3').textContent = stats.rating;
        statCards[3].querySelector('h3').textContent = `₹${stats.earnings.toLocaleString()}`;
    }
}

function loadBrowseItems() {
    const itemsGrid = document.querySelector('.items-grid');
    if (!itemsGrid) return;
    
    const sampleItems = [
        { id: 1, name: 'Honda City', category: 'Cars', price: '₹2000/day', image: '🚗', rating: 4.5 },
        { id: 2, name: 'Royal Enfield', category: 'Bikes', price: '₹800/day', image: '🏍️', rating: 4.3 },
        { id: 3, name: 'MacBook Pro', category: 'Gadgets', price: '₹1500/day', image: '💻', rating: 4.8 },
        { id: 4, name: 'Beach Villa', category: 'Villas', price: '₹8000/day', image: '🏖️', rating: 4.9 },
        { id: 5, name: 'Canon DSLR', category: 'Gadgets', price: '₹1200/day', image: '📷', rating: 4.6 },
        { id: 6, name: 'Apartment', category: 'Homes', price: '₹3000/day', image: '🏠', rating: 4.4 }
    ];
    
    itemsGrid.innerHTML = sampleItems.map(item => `
        <div class="item-card" data-id="${item.id}">
            <div class="item-image">${item.image}</div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-category">${item.category}</p>
                <div class="item-footer">
                    <span class="item-price">${item.price}</span>
                    <span class="item-rating">⭐ ${item.rating}</span>
                </div>
                <button class="btn-rent">Rent Now</button>
            </div>
        </div>
    `).join('');
    
    // Add styles for item cards
    const style = document.createElement('style');
    style.textContent = `
        .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
        }
        .item-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .item-image {
            font-size: 3rem;
            text-align: center;
            margin-bottom: 1rem;
        }
        .item-info h3 {
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        .item-category {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        .item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .item-price {
            font-weight: 600;
            color: #2563eb;
        }
        .item-rating {
            font-size: 0.875rem;
        }
        .btn-rent {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-rent:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
        }
    `;
    document.head.appendChild(style);
}

function loadBookings() {
    const bookingsList = document.querySelector('.bookings-list');
    if (!bookingsList) return;
    
    const sampleBookings = [
        { id: 1, item: 'Honda City', dates: '15 Jan - 17 Jan 2024', status: 'Active', amount: '₹6000' },
        { id: 2, item: 'MacBook Pro', dates: '20 Jan - 25 Jan 2024', status: 'Pending', amount: '₹7500' },
        { id: 3, item: 'Beach Villa', dates: '28 Jan - 30 Jan 2024', status: 'Confirmed', amount: '₹24000' }
    ];
    
    bookingsList.innerHTML = sampleBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-info">
                <h3>${booking.item}</h3>
                <p>${booking.dates}</p>
                <span class="booking-status status-${booking.status.toLowerCase()}">${booking.status}</span>
            </div>
            <div class="booking-amount">${booking.amount}</div>
        </div>
    `).join('');
    
    // Add booking card styles
    const bookingStyle = document.createElement('style');
    bookingStyle.textContent = `
        .booking-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }
        .booking-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .booking-info h3 {
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        .booking-info p {
            color: #6b7280;
            margin-bottom: 0.5rem;
        }
        .booking-status {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .status-active { background: #d1fae5; color: #065f46; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #dbeafe; color: #1e40af; }
        .booking-amount {
            font-size: 1.25rem;
            font-weight: 700;
            color: #2563eb;
        }
    `;
    document.head.appendChild(bookingStyle);
}

function loadListings() {
    const listingsGrid = document.querySelector('.listings-grid');
    if (!listingsGrid) return;
    
    if (currentUser.type === 'owner') {
        const sampleListings = [
            { id: 1, name: 'My Honda City', category: 'Cars', price: '₹2000/day', status: 'Active', bookings: 15 },
            { id: 2, name: 'Gaming Laptop', category: 'Gadgets', price: '₹1800/day', status: 'Active', bookings: 8 },
            { id: 3, name: 'Apartment', category: 'Homes', price: '₹3500/day', status: 'Inactive', bookings: 3 }
        ];
        
        listingsGrid.innerHTML = sampleListings.map(listing => `
            <div class="listing-card">
                <div class="listing-info">
                    <h3>${listing.name}</h3>
                    <p class="listing-category">${listing.category}</p>
                    <div class="listing-stats">
                        <span class="listing-price">${listing.price}</span>
                        <span class="listing-bookings">${listing.bookings} bookings</span>
                    </div>
                    <span class="listing-status status-${listing.status.toLowerCase()}">${listing.status}</span>
                </div>
                <div class="listing-actions">
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
    } else {
        listingsGrid.innerHTML = '<p class="no-listings">You need to be an owner to view listings. <a href="#" onclick="switchToOwner()">Switch to Owner Account</a></p>';
    }
}

function loadProfile() {
    const profileForm = document.querySelector('.profile-form');
    if (!profileForm || !currentUser) return;
    
    const inputs = profileForm.querySelectorAll('input');
    if (inputs.length >= 3) {
        inputs[0].value = currentUser.name;
        inputs[1].value = currentUser.email;
        inputs[2].value = currentUser.phone;
    }
}

function switchDashboardSection(section) {
    document.querySelectorAll('.dashboard-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function handleCategoryClick(category) {
    if (currentUser) {
        switchDashboardSection('browse');
        document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
        document.querySelector('[data-section="browse"]').classList.add('active');
        
        // Filter items by category
        const filterSelect = document.querySelector('.filter-select');
        if (filterSelect) {
            filterSelect.value = category.charAt(0).toUpperCase() + category.slice(1);
            handleSearch();
        }
    } else {
        openLogin('renter');
    }
}

function handleSearch() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const filterValue = document.querySelector('.filter-select').value;
    
    const itemCards = document.querySelectorAll('.item-card');
    itemCards.forEach(card => {
        const itemName = card.querySelector('h3').textContent.toLowerCase();
        const itemCategory = card.querySelector('.item-category').textContent;
        
        const matchesSearch = itemName.includes(searchTerm);
        const matchesFilter = filterValue === 'All Categories' || itemCategory === filterValue;
        
        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function handleAddListing() {
    showNotification('Add listing functionality will be implemented', 'info');
}

function logout() {
    localStorage.removeItem('rentzyUser');
    currentUser = null;
    userType = null;
    
    dashboard.classList.add('hidden');
    dashboard.classList.remove('active');
    
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.categories').style.display = 'block';
    document.querySelector('.features').style.display = 'block';
    document.querySelector('.navbar').style.display = 'block';
    
    showNotification('Logged out successfully', 'success');
}

function switchToOwner() {
    if (currentUser) {
        currentUser.type = 'owner';
        localStorage.setItem('rentzyUser', JSON.stringify(currentUser));
        loadListings();
        showNotification('Switched to Owner account', 'success');
    }
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const notificationStyle = document.createElement('style');
        notificationStyle.id = 'notification-styles';
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 3000;
                animation: slideIn 0.3s ease-out;
            }
            .notification-success { background: #10b981; }
            .notification-error { background: #ef4444; }
            .notification-info { background: #3b82f6; }
            .notification-warning { background: #f59e0b; }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(notificationStyle);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Water effect animation
function createWaterDroplets() {
    const waterEffect = document.querySelector('.water-effect');
    if (!waterEffect) return;
    
    setInterval(() => {
        const droplet = document.createElement('div');
        droplet.style.position = 'absolute';
        droplet.style.width = '4px';
        droplet.style.height = '4px';
        droplet.style.background = 'rgba(255, 255, 255, 0.7)';
        droplet.style.borderRadius = '50%';
        droplet.style.left = Math.random() * 100 + '%';
        droplet.style.top = '-10px';
        droplet.style.animation = 'waterDrop 3s linear';
        
        waterEffect.appendChild(droplet);
        
        setTimeout(() => {
            droplet.remove();
        }, 3000);
    }, 200);
}

// Add water droplets CSS
const waterStyle = document.createElement('style');
waterStyle.textContent = `
    @keyframes waterDrop {
        to {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
`;
document.head.appendChild(waterStyle);

// Start water effect
setTimeout(createWaterDroplets, 1000);

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect after page load
setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !currentUser) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
}, 2000);