// Jay Maa Laxmi Temple Donation Portal - Main JavaScript
// Core functionality for donation management and interactive features

class TempleDonationPortal {
    constructor() {
        this.donations = this.loadDonations();
        this.vehicleNumbers = this.loadVehicleNumbers();
        this.settings = this.loadSettings();
        this.adminLoggedIn = false;
        
        this.init();
    }

    init() {
        this.initializeDefaultData();
        this.setupEventListeners();
        this.updateLiveData();
        
        // Initialize page-specific functionality
        const currentPage = this.getCurrentPage();
        switch(currentPage) {
            case 'index':
                this.initHomepage();
                break;
            case 'donate':
                this.initDonationForm();
                break;
            case 'records':
                this.initRecordsPage();
                break;
            case 'admin':
                this.initAdminPanel();
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('donate.html')) return 'donate';
        if (path.includes('records.html')) return 'records';
        if (path.includes('admin.html')) return 'admin';
        return 'index';
    }

    // Data Management
    loadDonations() {
        const stored = localStorage.getItem('temple_donations');
        return stored ? JSON.parse(stored) : [];
    }

    saveDonations() {
        localStorage.setItem('temple_donations', JSON.stringify(this.donations));
    }

    loadVehicleNumbers() {
        const stored = localStorage.getItem('temple_vehicle_numbers');
        return stored ? JSON.parse(stored) : [];
    }

    saveVehicleNumbers() {
        localStorage.setItem('temple_vehicle_numbers', JSON.stringify(this.vehicleNumbers));
    }

    loadSettings() {
        const stored = localStorage.getItem('temple_settings');
        return stored ? JSON.parse(stored) : {
            targetAmount: 5000000, // ₹50 lakh target
            bankAccount: '1234567890',
            bankName: 'State Bank of India',
            bankBranch: 'Main Branch',
            ifscCode: 'SBIN0001234',
            upiId: 'jaymaalaxmi@upi'
        };
    }

    saveSettings() {
        localStorage.setItem('temple_settings', JSON.stringify(this.settings));
    }

    initializeDefaultData() {
        if (this.donations.length === 0) {
            // Add some sample donations for demonstration
            this.donations = [
                {
                    id: 1,
                    date: new Date('2024-09-15').toISOString(),
                    name: 'Ramesh Sharma',
                    phone: '9876543210',
                    vehicle: 'DL1CAB1234',
                    amount: 5100,
                    verified: true
                },
                {
                    id: 2,
                    date: new Date('2024-09-20').toISOString(),
                    name: 'Priya Patel',
                    phone: '9123456789',
                    vehicle: 'MH02XY5678',
                    amount: 2100,
                    verified: true
                },
                {
                    id: 3,
                    date: new Date('2024-09-25').toISOString(),
                    name: 'Amit Kumar',
                    phone: '9988776655',
                    vehicle: 'UP32AB9012',
                    amount: 11000,
                    verified: true
                },
                {
                    id: 4,
                    date: new Date('2024-09-28').toISOString(),
                    name: 'Sunita Devi',
                    phone: '9876543210',
                    vehicle: 'RJ14CD3456',
                    amount: 510,
                    verified: true
                },
                {
                    id: 5,
                    date: new Date('2024-10-01').toISOString(),
                    name: 'Vikram Singh',
                    phone: '9123456789',
                    vehicle: 'PB08EF7890',
                    amount: 2100,
                    verified: true
                }
            ];
            this.saveDonations();
        }

        // Update vehicle numbers list
        this.vehicleNumbers = this.donations.map(d => d.vehicle);
        this.saveVehicleNumbers();
    }

    // Donation Management
    addDonation(donationData) {
        const newDonation = {
            id: Date.now(),
            date: new Date().toISOString(),
            name: donationData.name,
            phone: donationData.phone,
            vehicle: donationData.vehicle,
            amount: parseFloat(donationData.amount),
            verified: false
        };

        this.donations.unshift(newDonation);
        this.vehicleNumbers.push(donationData.vehicle);
        
        this.saveDonations();
        this.saveVehicleNumbers();
        
        return newDonation;
    }

    updateDonation(id, updatedData) {
        const index = this.donations.findIndex(d => d.id === id);
        if (index !== -1) {
            this.donations[index] = { ...this.donations[index], ...updatedData };
            this.saveDonations();
            return true;
        }
        return false;
    }

    deleteDonation(id) {
        const index = this.donations.findIndex(d => d.id === id);
        if (index !== -1) {
            const donation = this.donations[index];
            this.donations.splice(index, 1);
            
            // Remove from vehicle numbers
            const vehicleIndex = this.vehicleNumbers.indexOf(donation.vehicle);
            if (vehicleIndex > -1) {
                this.vehicleNumbers.splice(vehicleIndex, 1);
            }
            
            this.saveDonations();
            this.saveVehicleNumbers();
            return true;
        }
        return false;
    }

    // Vehicle Number Validation
    isVehicleNumberDuplicate(vehicleNumber) {
        return this.vehicleNumbers.includes(vehicleNumber.toUpperCase());
    }

    // Calculations
    getTotalDonations() {
        return this.donations.reduce((total, donation) => total + donation.amount, 0);
    }

    getBalanceRemaining() {
        return Math.max(0, this.settings.targetAmount - this.getTotalDonations());
    }

    getDonationProgress() {
        const total = this.getTotalDonations();
        const progress = (total / this.settings.targetAmount) * 100;
        return Math.min(100, progress);
    }

    // Homepage Initialization
    initHomepage() {
        this.updateHomepageStats();
        this.initAnimations();
        this.initImageCarousel();
        this.initParticleEffect();
    }

    updateHomepageStats() {
        const totalElement = document.getElementById('total-donations');
        const targetElement = document.getElementById('target-amount');
        const balanceElement = document.getElementById('balance-remaining');
        const progressElement = document.getElementById('progress-bar');

        if (totalElement) {
            this.animateCounter(totalElement, this.getTotalDonations());
        }
        if (targetElement) {
            targetElement.textContent = this.formatCurrency(this.settings.targetAmount);
        }
        if (balanceElement) {
            balanceElement.textContent = this.formatCurrency(this.getBalanceRemaining());
        }
        if (progressElement) {
            const progress = this.getDonationProgress();
            this.animateProgressBar(progressElement, progress);
        }
    }

    initAnimations() {
        // Typewriter effect for temple blessing
        if (typeof Typed !== 'undefined' && document.getElementById('temple-blessing')) {
            new Typed('#temple-blessing', {
                strings: [
                    'जय माँ लक्ष्मी 🙏',
                    'May Maa Laxmi bless you with prosperity and happiness',
                    'Your generous donations help build our sacred temple',
                    'Every contribution brings us closer to our divine goal'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }

        // Text reveal animations
        if (typeof Splitting !== 'undefined') {
            Splitting({ target: '.split-text', by: 'chars' });
        }
    }

    initImageCarousel() {
        if (typeof Splide !== 'undefined' && document.querySelector('.splide')) {
            new Splide('.splide', {
                type: 'loop',
                autoplay: true,
                interval: 3000,
                pauseOnHover: true,
                arrows: false,
                pagination: true
            }).mount();
        }
    }

    initParticleEffect() {
        // Simple particle effect using CSS animations
        const particleContainer = document.getElementById('particles');
        if (particleContainer) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 10 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particleContainer.appendChild(particle);
            }
        }
    }

    // Donation Form Initialization
    initDonationForm() {
        const form = document.getElementById('donation-form');
        const vehicleInput = document.getElementById('vehicle-number');
        
        if (vehicleInput) {
            vehicleInput.addEventListener('input', (e) => {
                this.checkVehicleNumber(e.target.value);
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDonationSubmit(e.target);
            });
        }
    }

    checkVehicleNumber(vehicleNumber) {
        const warningElement = document.getElementById('vehicle-warning');
        const submitButton = document.getElementById('submit-donation');
        
        if (vehicleNumber && this.isVehicleNumberDuplicate(vehicleNumber)) {
            warningElement.classList.remove('hidden');
            warningElement.textContent = '⚠️ This vehicle number already exists in our records';
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            warningElement.classList.add('hidden');
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    handleDonationSubmit(form) {
        const formData = new FormData(form);
        const donationData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            vehicle: formData.get('vehicle').toUpperCase(),
            amount: formData.get('amount')
        };

        // Validate form data
        if (!this.validateDonationForm(donationData)) {
            return;
        }

        // Add donation
        const newDonation = this.addDonation(donationData);
        
        // Show success message
        this.showDonationSuccess(newDonation);
        
        // Reset form
        form.reset();
    }

    validateDonationForm(data) {
        const required = ['name', 'phone', 'vehicle', 'amount'];
        for (let field of required) {
            if (!data[field]) {
                this.showError(`Please fill in the ${field} field`);
                return false;
            }
        }

        // Phone validation
        if (!/^\d{10}$/.test(data.phone)) {
            this.showError('Please enter a valid 10-digit phone number');
            return false;
        }

        // Vehicle number validation
        if (!/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(data.vehicle)) {
            this.showError('Please enter a valid vehicle number (e.g., DL01AB1234)');
            return false;
        }

        // Amount validation
        if (data.amount < 51) {
            this.showError('Minimum donation amount is ₹51');
            return false;
        }

        return true;
    }

    showDonationSuccess(donation) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 m-4 max-w-md w-full">
                <div class="text-center">
                    <div class="text-4xl mb-4">🙏</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Donation Successful!</h3>
                    <p class="text-gray-600 mb-4">
                        Thank you ${donation.name} for your generous donation of ₹${donation.amount}.
                        Maa Laxmi's blessings are with you.
                    </p>
                    <p class="text-sm text-gray-500 mb-4">
                        Reference ID: ${donation.id}
                    </p>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                        Continue
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Records Page Initialization
    initRecordsPage() {
        this.updateRecordsStats();
        this.renderDonorList();
        this.initSearchFunctionality();
    }

    updateRecordsStats() {
        const totalElement = document.getElementById('records-total');
        const targetElement = document.getElementById('records-target');
        const balanceElement = document.getElementById('records-balance');
        const progressElement = document.getElementById('records-progress');

        if (totalElement) {
            this.animateCounter(totalElement, this.getTotalDonations());
        }
        if (targetElement) {
            targetElement.textContent = this.formatCurrency(this.settings.targetAmount);
        }
        if (balanceElement) {
            balanceElement.textContent = this.formatCurrency(this.getBalanceRemaining());
        }
        if (progressElement) {
            const progress = this.getDonationProgress();
            this.animateProgressBar(progressElement, progress);
        }
    }

    renderDonorList() {
        const container = document.getElementById('donor-list');
        if (!container) return;

        const html = this.donations.map(donation => `
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-gray-900">${donation.name}</h4>
                        <p class="text-sm text-gray-600">${donation.vehicle}</p>
                        <p class="text-xs text-gray-500">${this.formatDate(donation.date)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-orange-600">₹${donation.amount.toLocaleString()}</p>
                        ${donation.verified ? '<span class="text-xs text-green-600">✓ Verified</span>' : '<span class="text-xs text-yellow-600">⏳ Pending</span>'}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    initSearchFunctionality() {
        const searchInput = document.getElementById('search-donors');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterDonors(e.target.value);
            });
        }
    }

    filterDonors(searchTerm) {
        const filtered = this.donations.filter(donation => 
            donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const container = document.getElementById('donor-list');
        const html = filtered.map(donation => `
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-gray-900">${donation.name}</h4>
                        <p class="text-sm text-gray-600">${donation.vehicle}</p>
                        <p class="text-xs text-gray-500">${this.formatDate(donation.date)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-orange-600">₹${donation.amount.toLocaleString()}</p>
                        ${donation.verified ? '<span class="text-xs text-green-600">✓ Verified</span>' : '<span class="text-xs text-yellow-600">⏳ Pending</span>'}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    // Admin Panel Initialization
    initAdminPanel() {
        this.checkAdminSession();
        this.setupAdminLogin();
        this.setupAdminDashboard();
    }

    checkAdminSession() {
        const session = localStorage.getItem('admin_session');
        if (session) {
            const sessionData = JSON.parse(session);
            if (sessionData.expires > Date.now()) {
                this.adminLoggedIn = true;
                this.showAdminDashboard();
            }
        }
    }

    setupAdminLogin() {
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin(e.target);
            });
        }
    }

    handleAdminLogin(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        // Simple authentication simulation
        if (username === 'admin' && password === 'jaymaalaxmi2024') {
            const session = {
                username: username,
                loginTime: Date.now(),
                expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            };
            localStorage.setItem('admin_session', JSON.stringify(session));
            this.adminLoggedIn = true;
            this.showAdminDashboard();
        } else {
            this.showError('Invalid username or password');
        }
    }

    showAdminDashboard() {
        const loginSection = document.getElementById('admin-login');
        const dashboardSection = document.getElementById('admin-dashboard');
        
        if (loginSection) loginSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        
        this.renderAdminDashboard();
    }

    renderAdminDashboard() {
        this.updateAdminStats();
        this.renderAdminDonationList();
        this.renderAdminSettings();
    }

    updateAdminStats() {
        const totalElement = document.getElementById('admin-total');
        const countElement = document.getElementById('admin-count');
        const targetElement = document.getElementById('admin-target');
        const progressElement = document.getElementById('admin-progress');

        if (totalElement) {
            totalElement.textContent = this.formatCurrency(this.getTotalDonations());
        }
        if (countElement) {
            countElement.textContent = this.donations.length;
        }
        if (targetElement) {
            targetElement.textContent = this.formatCurrency(this.settings.targetAmount);
        }
        if (progressElement) {
            const progress = this.getDonationProgress();
            this.animateProgressBar(progressElement, progress);
        }
    }

    renderAdminDonationList() {
        const container = document.getElementById('admin-donation-list');
        if (!container) return;

        const html = this.donations.map(donation => `
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${donation.name}</h4>
                        <p class="text-sm text-gray-600">${donation.vehicle}</p>
                        <p class="text-sm text-gray-600">${donation.phone}</p>
                        <p class="text-xs text-gray-500">${this.formatDate(donation.date)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-orange-600">₹${donation.amount.toLocaleString()}</p>
                        <div class="mt-2 space-x-2">
                            <button onclick="templeApp.verifyDonation(${donation.id})" 
                                    class="text-xs px-2 py-1 ${donation.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} rounded">
                                ${donation.verified ? 'Verified' : 'Verify'}
                            </button>
                            <button onclick="templeApp.editDonation(${donation.id})" 
                                    class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                Edit
                            </button>
                            <button onclick="templeApp.deleteDonationConfirm(${donation.id})" 
                                    class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    verifyDonation(id) {
        this.updateDonation(id, { verified: true });
        this.renderAdminDonationList();
        this.showSuccess('Donation verified successfully');
    }

    deleteDonationConfirm(id) {
        if (confirm('Are you sure you want to delete this donation?')) {
            this.deleteDonation(id);
            this.renderAdminDonationList();
            this.showSuccess('Donation deleted successfully');
        }
    }

    // Utility Functions
    formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    animateCounter(element, targetValue) {
        if (typeof anime !== 'undefined') {
            anime({
                targets: { value: 0 },
                value: targetValue,
                duration: 2000,
                easing: 'easeOutExpo',
                update: function(anim) {
                    element.textContent = '₹' + Math.round(anim.animatables[0].target.value).toLocaleString('en-IN');
                }
            });
        } else {
            element.textContent = this.formatCurrency(targetValue);
        }
    }

    animateProgressBar(element, progress) {
        if (typeof anime !== 'undefined') {
            anime({
                targets: element,
                width: progress + '%',
                duration: 2000,
                easing: 'easeOutExpo'
            });
        } else {
            element.style.width = progress + '%';
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateLiveData() {
        // Update data every 30 seconds
        setInterval(() => {
            this.updateHomepageStats();
            this.updateRecordsStats();
            this.updateAdminStats();
        }, 30000);
    }

    setupEventListeners() {
        // Global event listeners
        document.addEventListener('click', (e) => {
            // Close modals
            if (e.target.classList.contains('modal-overlay')) {
                e.target.remove();
            }
        });

        // Admin logout
        const logoutBtn = document.getElementById('admin-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('admin_session');
                this.adminLoggedIn = false;
                location.reload();
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.templeApp = new TempleDonationPortal();
});

// Export for global access
window.TempleDonationPortal = TempleDonationPortal;