document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded - Script Initializing...");

    // 1. Hero Slider
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        console.log("Mobile menu elements found and initialized.");
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop propagation to prevent accidental closing
            console.log("Hamburger clicked!");
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });

        // Close menu when link is clicked
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('toggle');
                    console.log("Menu closed by clicking outside.");
                }
            }
        });
    } else {
        console.warn("Mobile menu elements NOT found!");
    }

    // 3. Success Notification & Forms
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent successfully! We will contact you soon.');
            contactForm.reset();
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    const claimOfferBtns = document.querySelectorAll('.claim-offer-btn');
    claimOfferBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Discount code ELEGANCE2024 applied! Enjoy your luxury shopping.');
        });
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(notification);

        // Styling for notification (could also be in CSS)
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#d4af37';
        notification.style.color = '#fff';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        notification.style.zIndex = '2000';
        notification.style.animation = 'fadeInUp 0.5s ease';

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // 4. Live Search & Filtering (Used in products.html)
    const searchInput = document.getElementById('searchInput');
    const tabBar = document.getElementById('tabBar');
    const products = document.querySelectorAll('.product-card');
    let currentCategory = 'all';

    if (searchInput || tabBar) {
        const filterProducts = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            
            products.forEach(product => {
                const name = product.querySelector('.product-name').textContent.toLowerCase();
                const prodCategory = product.getAttribute('data-category');
                
                const matchesSearch = name.includes(searchTerm);
                const matchesCategory = currentCategory === 'all' || prodCategory === currentCategory;

                if (matchesSearch && matchesCategory) {
                    product.style.display = 'block';
                    product.classList.add('animate-in');
                } else {
                    product.style.display = 'none';
                }
            });
        };

        if (searchInput) searchInput.addEventListener('input', filterProducts);
        
        if (tabBar) {
            const tabs = tabBar.querySelectorAll('.tab-btn');
            
            // Check for filter in URL
            const urlParams = new URLSearchParams(window.location.search);
            const filterParam = urlParams.get('filter');
            if (filterParam) {
                currentCategory = filterParam;
                tabs.forEach(t => {
                    if (t.getAttribute('data-filter') === filterParam) {
                        t.classList.add('active');
                    } else {
                        t.classList.remove('active');
                    }
                });
                filterProducts();
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    // Update current category and filter
                    currentCategory = tab.getAttribute('data-filter');
                    filterProducts();
                });
            });
        }
    }

    // 5. Countdown Timer (Used in offers.html)
    const countdownElements = document.querySelectorAll('.countdown-timer');
    if (countdownElements.length > 0) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElements.forEach(timer => {
                timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            });

            if (distance < 0) {
                clearInterval(timerInterval);
                countdownElements.forEach(timer => timer.innerHTML = "EXPIRED");
            }
        };

        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    }

    // 6. Random Team Members (Used in team.html)
    const teamGrid = document.getElementById('teamGrid');
    if (teamGrid) {
        const members = Array.from(teamGrid.children);
        if (members.length > 0) {
            for (let i = members.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [members[i], members[j]] = [members[j], members[i]];
            }
            teamGrid.innerHTML = '';
            members.forEach(m => teamGrid.appendChild(m));
            console.log("Team members randomized.");
        }
    }

    // 7. Display Current Date & Time
    const dateTimeDisplay = document.getElementById('dateTimeDisplay');
    if (dateTimeDisplay) {
        const updateTime = () => {
            const now = new Date();
            dateTimeDisplay.innerText = now.toLocaleString();
        };
        setInterval(updateTime, 1000);
        updateTime();
    }

    // 8. Add to Cart Animation
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.innerHTML = 'Added! ✓';
            btn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                btn.innerHTML = 'Add To Cart';
                btn.style.backgroundColor = '#d4af37';
            }, 2000);
            showNotification('Item added to cart!');
        });
    });

    // 9. Product Modal Logic
    const productModal = document.getElementById('productModal');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const closeModal = document.querySelector('.close-modal');

    if (productModal && viewDetailsButtons.length > 0) {
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.product-card');
                const name = card.querySelector('.product-name').innerText;
                const price = card.querySelector('.product-price').innerText;
                const img = card.querySelector('img').src;
                const rating = card.querySelector('.rating').innerText;
                const desc = card.querySelector('.product-desc').innerText;

                document.getElementById('modalName').innerText = name;
                document.getElementById('modalPrice').innerText = price;
                document.getElementById('modalImg').src = img;
                document.getElementById('modalRating').innerText = rating;
                document.getElementById('modalDesc').innerText = desc;

                productModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                productModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 13. Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
});
