/**
 * === Fungsi Keranjang ===
 */

document.addEventListener('DOMContentLoaded', function () {
    //  Add To Cart 
    attachAddToCartListeners();
    updateCartCount();

    // === Sticky Header ===
    const stickyHeader = document.getElementById('stickyHeader');
    const originalHeader = document.querySelector('header');
    if (stickyHeader && originalHeader) {
        const headerHeight = originalHeader.offsetHeight;
        window.addEventListener('scroll', function () {
            if (window.scrollY > headerHeight) {
                stickyHeader.classList.remove('hidden');
            } else {
                stickyHeader.classList.add('hidden');
            }
        });
    }

    // === Mobile Menu Toggle ===
    const mobileMenuBtn = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Tutup saat klik di luar
        document.addEventListener('click', function (e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // === Sticky Mobile Menu Toggle ===
    const stickyMobileBtn = document.getElementById('stickyMobileMenuButton');
    const stickyMobileMenu = document.getElementById('stickyMobileMenu');
    if (stickyMobileBtn && stickyMobileMenu) {
        stickyMobileBtn.addEventListener('click', function () {
            stickyMobileMenu.classList.toggle('hidden');
        });
    }

    // === Hero Slider ===
    const heroSection = document.querySelector('.hero-section');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    if (heroSection && prevBtn && nextBtn) {
        const slides = [
            {
                title: 'Daily Grocery Order and Get Express Delivery',
                desc: 'Order your daily groceries online and enjoy express delivery...',
                image: 'assets/hero/hero1.webp',
            },
            {
                title: 'Fresh Produce Delivered to Your Door',
                desc: 'Get farm-fresh vegetables, fruits, and pantry staples...',
                image: 'assets/hero/hero2.jpg',
            },
        ];

        let currentSlide = 0;

        function updateSlide(index) {
            if (index < 0 || index >= slides.length) return;
            currentSlide = index;
            const slide = slides[currentSlide];
            heroSection.querySelector('h1').textContent = slide.title;
            heroSection.querySelector('p').textContent = slide.desc;
            heroSection.querySelector('img').src = slide.image;
        }

        nextBtn.addEventListener('click', () => updateSlide(currentSlide + 1));
        prevBtn.addEventListener('click', () => updateSlide(currentSlide - 1));
    }

    // Category Carousel
    const catWrapper = document.getElementById('catWrapper');
    const catTrack = document.getElementById('catTrack');
    const catLeftBtn = document.getElementById('catLeftBtn');
    const catRightBtn = document.getElementById('catRightBtn');

    if (catTrack) {
        // Data kategori
        const categories = [
            { name: 'Vegetables', count: '125+ Products', img: 'assets/food/category1.webp' },
            { name: 'Fish & Meats', count: '90+ Products', img: 'assets/food/category2.webp' },
            { name: 'Desserts', count: '80+ Products', img: 'assets/food/category3.webp' },
            { name: 'Drinks & Juice', count: '60+ Products', img: 'assets/food/category4.webp' },
            { name: 'Animals Food', count: '100+ Products', img: 'assets/food/category5.webp' },
            { name: 'Fresh Fruits', count: '70+ Products', img: 'assets/food/category6.webp' },
            { name: 'Yummy Candy', count: '50+ Products', img: 'assets/food/category7.webp' },
            { name: 'Dairy & Eggs', count: '45+ Products', img: 'assets/food/category8.webp' },
            { name: 'Bakery', count: '35+ Products', img: 'assets/food/category9.webp' },
            { name: 'Spices & Herbs', count: '65+ Products', img: 'assets/food/category10.webp' },
        ];

        // Buat card
        function createCategoryCard(cat) {
            const card = document.createElement('div');
            card.className = 'flex-shrink-0 w-36 md:w-48 flex flex-col items-center space-y-2';
            card.innerHTML = `
            <div class="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#e9f9ef] flex items-center justify-center overflow-hidden">
                <img src="${cat.img}" alt="${cat.name}" class="w-10 h-10 object-cover" />
            </div>
            <div class="text-center">
                <h3 class="font-bold text-sm md:text-base text-gray-800">${cat.name}</h3>
                <p class="text-xs md:text-sm text-gray-500">${cat.count}</p>
            </div>
        `;
            return card;
        }

        // Render card asli
        categories.forEach((cat) => {
            catTrack.appendChild(createCategoryCard(cat));
        });

        // untuk seamless loop
        const originalCards = Array.from(catTrack.children);
        originalCards.forEach((card) => {
            catTrack.appendChild(card.cloneNode(true));
        });

        // Auto-scroll seamless 
        let rafId = null;
        let lastTs = null;
        let paused = false;
        const SPEED = 60; // px per detik

        function animate(ts) {
            if (!lastTs) lastTs = ts;
            const delta = ts - lastTs;
            lastTs = ts;

            if (!paused) {
                const move = (SPEED * delta) / 1000;
                catWrapper.scrollLeft += move;

                // Reset posisi saat mencapai tengah
                if (catWrapper.scrollLeft >= catTrack.scrollWidth / 2) {
                    catWrapper.scrollLeft -= catTrack.scrollWidth / 2;
                }
            }
            rafId = requestAnimationFrame(animate);
        }

        rafId = requestAnimationFrame(animate);

        // Pause saat hover/touch
        catWrapper.addEventListener('mouseenter', () => (paused = true));
        catWrapper.addEventListener('mouseleave', () => (paused = false));
        catWrapper.addEventListener('touchstart', () => (paused = true));
        catWrapper.addEventListener('touchend', () => (paused = false));

        //Tombol Navigasi 
        if (catLeftBtn && catRightBtn) {
            function scrollStep() {
                return Math.max(120, Math.round(catWrapper.clientWidth * 0.35));
            }

            catLeftBtn.addEventListener('click', () => {
                catWrapper.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
            });

            catRightBtn.addEventListener('click', () => {
                catWrapper.scrollBy({ left: scrollStep(), behavior: 'smooth' });
            });

            // Tampilkan tombol hanya jika bisa discroll
            function updateButtonVisibility() {
                const canScroll = catTrack.scrollWidth > catWrapper.clientWidth + 4;
                catLeftBtn.classList.toggle('hidden', !canScroll);
                catRightBtn.classList.toggle('hidden', !canScroll);
            }

            updateButtonVisibility();
            window.addEventListener('resize', updateButtonVisibility);
        }

        // Cleanup saat halaman
        window.addEventListener('beforeunload', () => {
            if (rafId) cancelAnimationFrame(rafId);
        });
    }

    //  Recommended Products 
    const recommendedGrid = document.getElementById('recommendedGrid');
    if (recommendedGrid) {
        // Data produk
        const products = [
            {
                name: 'C-500 Antioxidant Dietary Supplement',
                price: '$12.49',
                originalPrice: '$24.99',
                rating: '17k',
                sold: '18/35',
                img: 'assets/recommend/product-img1.webp',
                badge: { type: 'discount', value: '50%' },
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Marcel’s Modern Pantry Almond Unsweetened',
                price: '$16.99',
                originalPrice: '$33.99',
                rating: '17k',
                sold: '22/40',
                img: 'assets/recommend/product-img2.webp',
                badge: { type: 'discount', value: '50%' },
                store: 'By Lucky Supermarket',
            },
            {
                name: 'O Organics Milk, Whole, Vitamin D',
                price: '$13.49',
                originalPrice: '$26.99',
                rating: '17k',
                sold: '20/32',
                img: 'assets/recommend/product-img3.webp',
                badge: { type: 'new', value: 'New' },
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Whole Grains and Seeds Organic Bread',
                price: '$8.99',
                originalPrice: '$17.99',
                rating: '17k',
                sold: '15/25',
                img: 'assets/recommend/product-img4.webp',
                badge: { type: 'discount', value: '35%' },
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Fresh Eggplant & Cucumber Mix',
                price: '$14.99',
                originalPrice: '$28.99',
                rating: '17k',
                sold: '18/35',
                img: 'assets/recommend/product-img5.webp',
                badge: null,
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Organic Beets with Greens',
                price: '$12.99',
                originalPrice: '$22.99',
                rating: '12k',
                sold: '22/40',
                img: 'assets/recommend/product-img6.webp',
                badge: null,
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Mixed Fresh Vegetables Pack',
                price: '$13.99',
                originalPrice: '$25.99',
                rating: '8k',
                sold: '15/25',
                img: 'assets/recommend/product-img7.webp',
                badge: null,
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Sun-Maid Raisins Healthy',
                price: '$16.99',
                originalPrice: '$32.99',
                rating: '5k',
                sold: '8/15',
                img: 'assets/recommend/product-img8.webp',
                badge: null,
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Doritos Spicy Sweet Chili',
                price: '$28.99',
                originalPrice: '$38.99',
                rating: '11k',
                sold: '20/30',
                img: 'assets/recommend/product-img9.webp',
                badge: null,
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Organic Girl Romaine Lettuce',
                price: '$5.99',
                originalPrice: '$11.99',
                rating: '25k',
                sold: '30/50',
                img: 'assets/recommend/product-img10.webp',
                badge: { type: 'discount', value: '50%' },
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Almond Breeze Almond Milk',
                price: '$4.99',
                originalPrice: '$9.99',
                rating: '30k',
                sold: '40/60',
                img: 'assets/recommend/product-img11.webp',
                badge: { type: 'new', value: 'New' },
                store: 'By Lucky Supermarket',
            },
            {
                name: 'Dave’s Killer Bread Yellow',
                price: '$7.99',
                originalPrice: '$15.99',
                rating: '20k',
                sold: '25/40',
                img: 'assets/recommend/product-img12.webp',
                badge: { type: 'discount', value: '50%' },
                store: 'By Lucky Supermarket',
            },
        ];

        // Bersihkan grid
        recommendedGrid.innerHTML = '';

        // Generate card
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card relative rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 group';

            // Tambahkan data attributes
            card.setAttribute('data-id', `rec-${index + 1}`);
            card.setAttribute('data-title', product.name);
            card.setAttribute('data-price', product.price);
            card.setAttribute('data-price-numeric', product.price.replace('$', ''));
            card.setAttribute('data-image', product.img);

            // Badge
            let badgeHTML = '';
            if (product.badge) {
                const { type, value } = product.badge;
                const bgColor = type === 'discount' ? 'bg-red-500' : 'bg-yellow-500';
                badgeHTML = `<div class="absolute top-2 right-2 ${bgColor} text-white text-xs font-bold px-2 py-1 rounded-full">${value}</div>`;
            }

            // HTML card
            card.innerHTML = `
            <div class="relative h-48 overflow-hidden flex justify-center items-center p-4">
                <img src="${product.img}" alt="${product.name}" class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute top-2 left-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-emerald-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </div>
                ${badgeHTML}
            </div>
            <div class="p-4 pt-2">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-400 line-through">${product.originalPrice}</span>
                    <span class="text-lg font-bold text-gray-800">${product.price}</span>
                    <span class="text-gray-500 text-sm">/Qty</span>
                </div>
                <div class="flex items-center text-yellow-500 text-sm mb-1">
                    <div class="text-xl">&starf;</div>
                    (${product.rating})
                </div>
                <h3 class="text-md font-bold text-gray-800 mb-2 hover:text-green-600 cursor-pointer">${product.name}</h3>
                <div class="flex items-center text-gray-500 text-sm mb-2">
                    <img src="assets/icon/shop.svg" alt="Fresh Groceries Delivery" class="pr-2" />
                    ${product.store}
                </div>
                <div class="text-gray-500 text-sm mb-4">Sold: ${product.sold}</div>
                <button class="w-full bg-emerald-100 hover:bg-emerald-400 hover:scale-105 text-emerald-800 font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                    Add To Cart
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h11.37a1.125 1.125 0 001.087-.835l2.006-7.52a.563.563 0 00-.087-.465.56.56 0 00-.45-.23H4.106m3.394 9.05L5.25 6.75M7.5 14.25l-2.25 4.5m0 0h12m-12 0a1.125 1.125 0 11-2.25 0m14.25 0a1.125 1.125 0 11-2.25 0" />
                    </svg>
                </button>
            </div>
        `;

            recommendedGrid.appendChild(card);
        });

        attachAddToCartListeners(recommendedGrid);
    }

    //today best deals
    const wrapper = document.getElementById('dealsWrapper');
    const track = document.getElementById('dealsTrack');

    // Ambil semua card
    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    let currentSlide = 0; // Untuk mobile: 0,1,2,3. Untuk desktop: 0,1
    let autoScrollInterval;

    // responsive pake js (coba coba)
    function isMobileOrTablet() {
        return window.innerWidth < 1024; // lg = 1024px
    }

    function scrollToCards(index) {
        // Jika mobile/tablet: scroll 1 card per tampilan
        // Jika desktop: scroll 2 card per tampilan
        if (isMobileOrTablet()) {
            const leftPos = (cardWidth + gap) * index;
            wrapper.scrollTo({ left: leftPos, behavior: 'smooth' });
        } else {
            const targetIndex = index * 2; // Karena 2 card per tampilan
            const leftPos = (cardWidth + gap) * targetIndex;
            wrapper.scrollTo({ left: leftPos, behavior: 'smooth' });
        }
    }

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (isMobileOrTablet()) {
                // Mobile: Geser ke card berikutnya
                currentSlide++;
                if (currentSlide >= 4) {
                    //  4 card
                    currentSlide = 0;
                }
            } else {
                // Desktop Geser ke 2 card berikutnya
                currentSlide++;
                if (currentSlide >= 2) {
                    //  4 card (2 set)
                    currentSlide = 0;
                }
            }
            scrollToCards(currentSlide);
        }, 2500); // Setiap x detik
    }

    // Start Auto Scroll
    startAutoScroll();

    // Pause saat hover/touch
    // wrapper.addEventListener('mouseenter', () => {
    //     clearInterval(autoScrollInterval);
    // });

    // wrapper.addEventListener('mouseleave', () => {
    //     startAutoScroll();
    // });

    // wrapper.addEventListener('touchstart', () => {
    //     clearInterval(autoScrollInterval);
    // });

    // Hot Deals Carousel 
    const hotDealsWrapper = document.getElementById('hotDealsWrapper');
    const hotDealsTrack = document.getElementById('hotDealsTrack');

    if (hotDealsTrack) {
        const cards = Array.from(hotDealsTrack.children);
        if (cards.length === 0) return;

        let autoScrollInterval;
        let currentGroupIndex = 0;

        // Tentukan jumlah card yang terlihat berdasarkan layar
        function getVisibleCardsCount() {
            const width = window.innerWidth;
            if (width < 640) return 1; // mobile
            if (width < 1024) return 2; // tablet
            return 3; // desktop
        }

        // Ambil lebar card & gap
        function getCardWidth() {
            return cards[0].offsetWidth;
        }

        function getGap() {
            const style = window.getComputedStyle(hotDealsTrack);
            return parseFloat(style.gap) || 24;
        }

        // Scroll ke grup tertentu
        function scrollToGroup(index) {
            const visible = getVisibleCardsCount();
            const cardWidth = getCardWidth();
            const gap = getGap();
            const scrollPos = (cardWidth + gap) * index;
            hotDealsWrapper.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }

        // Hitung jumlah grup maksimal
        function getMaxGroups() {
            const visible = getVisibleCardsCount();
            return Math.max(0, cards.length - visible + 1);
        }

        // Mulai auto-scroll
        function startAutoScroll() {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                const maxGroups = getMaxGroups();
                if (maxGroups <= 0) return;
                currentGroupIndex = (currentGroupIndex + 1) % (maxGroups + 1);
                scrollToGroup(currentGroupIndex);
            }, 2000); // 2 detik
        }

        // Reset carousel
        function resetCarousel() {
            currentGroupIndex = 0;
            scrollToGroup(0);
            startAutoScroll();
        }

        // Jalankan pertama kali
        resetCarousel();

        // Pause saat hover/touch
        hotDealsWrapper.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        hotDealsWrapper.addEventListener('mouseleave', () => startAutoScroll());
        hotDealsWrapper.addEventListener('touchstart', () => clearInterval(autoScrollInterval), { passive: true });
        hotDealsWrapper.addEventListener('touchend', () => startAutoScroll(), { passive: true });

        // Re-init saat resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resetCarousel, 150);
        });

        // Cleanup
        window.addEventListener('beforeunload', () => {
            clearInterval(autoScrollInterval);
        });
    }

    // === New Arrivals Carousel  ===
    const arrivalsWrapper = document.getElementById('arrivalsWrapper');
    const arrivalsTrack = document.getElementById('arrivalsTrack');

    if (arrivalsTrack) {
        const cards = Array.from(arrivalsTrack.children);
        if (cards.length === 0) return;

        let autoScrollInterval;
        let currentGroupIndex = 0;

        // Tentukan jumlah card yang terlihat
        function getVisibleCardsCount() {
            const width = window.innerWidth;
            if (width < 640) return 1; // mobile
            if (width < 1024) return 2; // tablet
            return 4; // desktop (4 card)
        }

        // Ambil lebar card & gap
        function getCardWidth() {
            return cards[0].offsetWidth;
        }

        function getGap() {
            const style = window.getComputedStyle(arrivalsTrack);
            return parseFloat(style.gap) || 24;
        }

        // Scroll ke grup tertentu
        function scrollToGroup(index) {
            const visible = getVisibleCardsCount();
            const cardWidth = getCardWidth();
            const gap = getGap();
            const scrollPos = (cardWidth + gap) * index;
            arrivalsWrapper.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }

        // Hitung jumlah grup maksimal
        function getMaxGroups() {
            const visible = getVisibleCardsCount();
            return Math.max(0, cards.length - visible + 1);
        }

        // Mulai auto-scroll
        function startAutoScroll() {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                const maxGroups = getMaxGroups();
                if (maxGroups <= 0) return;
                currentGroupIndex = (currentGroupIndex + 1) % (maxGroups + 1);
                scrollToGroup(currentGroupIndex);
            }, 3000); // 3 detik
        }

        // Reset carousel
        function resetCarousel() {
            currentGroupIndex = 0;
            scrollToGroup(0);
            startAutoScroll();
        }

        // Jalankan pertama kali
        resetCarousel();

        // Pause saat hover/touch
        arrivalsWrapper.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        arrivalsWrapper.addEventListener('mouseleave', () => startAutoScroll());
        arrivalsWrapper.addEventListener('touchstart', () => clearInterval(autoScrollInterval), { passive: true });
        arrivalsWrapper.addEventListener('touchend', () => startAutoScroll(), { passive: true });

        // Re-init saat resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resetCarousel, 150);
        });

        // Cleanup
        window.addEventListener('beforeunload', () => {
            clearInterval(autoScrollInterval);
        });
    }
});

// Fungsi untuk update angka di ikon cart 
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.classList.toggle('hidden', totalItems === 0);
    });
}
// Fungsi "Add To Cart" di semua card yang punya data-id
function attachAddToCartListeners(container = document) {
    const buttons = container.querySelectorAll('[data-id] button');
    buttons.forEach((button) => {
        if (button.dataset.cartListener) return; // biar ga duplikat!!!
        button.dataset.cartListener = 'true';

        button.addEventListener('click', function (e) {
            e.stopPropagation();

            const card = this.closest('[data-id]');
            if (!card) return;

            const product = {
                id: card.dataset.id,
                title: card.dataset.title,
                price: card.dataset.price,
                priceNumeric: parseFloat(card.dataset.priceNumeric),
                image: card.dataset.image,
                quantity: 1,
            };

            // Validasi harga
            if (isNaN(product.priceNumeric)) {
                console.warn('Harga tidak valid:', card.dataset.priceNumeric);
                return;
            }

            // Ambil & update keranjang
            let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
            const existing = cart.find((item) => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(product);
            }
            localStorage.setItem('shoppingCart', JSON.stringify(cart));

            // Update tampilan
            updateCartCount();

            // Feedback visual
            const original = this.innerHTML;
            this.innerHTML = 'Added! 🛒';
            setTimeout(() => {
                this.innerHTML = original;
            }, 1000);
        });
    });
}
