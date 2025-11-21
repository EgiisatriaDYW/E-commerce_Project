// price range + discount + new filters
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('priceSlider');
    const previewCard = document.getElementById('previewCard');
    const productCards = document.querySelectorAll('.product-card');

    // === Fungsi: Update jumlah di ikon cart  ===
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach((badge) => {
            badge.textContent = totalItems;
            badge.classList.toggle('hidden', totalItems === 0);
        });
    }

    // Fungsi untuk menyimpan keranjang ke localStorage
    function saveCartToStorage(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Fungsi untuk mengambil keranjang dari localStorage
    function getCartFromStorage() {
        const data = localStorage.getItem('shoppingCart');
        return data ? JSON.parse(data) : [];
    }

    // Event: klik tombol "Add To Cart" di setiap card
    document.querySelectorAll('.product-card button').forEach((button) => {
        
        if (button.dataset.cartListener) return;
        button.dataset.cartListener = 'true';

        button.addEventListener('click', function (e) {
            e.stopPropagation(); // agar tidak trigger klik card (preview)

            // Ambil data dari card parent
            const card = this.closest('.product-card');
            const product = {
                id: card.dataset.id,
                title: card.dataset.title,
                price: card.dataset.price, // "$12.49"
                priceNumeric: parseFloat(card.dataset.priceNumeric),
                image: card.dataset.image,
                quantity: 1,
            };

            // Validasi harga
            if (isNaN(product.priceNumeric)) {
                console.warn('Harga tidak valid:', card.dataset.priceNumeric);
                return;
            }

            // Ambil keranjang saat ini
            let cart = getCartFromStorage();

            // Cek apakah produk sudah ada
            const existing = cart.find((item) => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(product);
            }

            // Simpan kembali
            saveCartToStorage(cart);

            
            updateCartCount();

            // Feedback visual
            const originalText = this.innerHTML;
            this.innerHTML = 'Added! 🛒';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 1000);
        });
    });

    // Fungsi untuk update preview card
    function updatePreview(productData) {
        document.getElementById('previewImage').src = productData.image;
        document.getElementById('previewTitle').textContent = productData.title;
        document.getElementById('previewCurrentPrice').textContent = productData.price;
        document.getElementById('previewOriginalPrice').textContent = productData.original;
        document.getElementById('previewSeller').innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shop mr-2" viewBox="0 0 16 16">
                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z"/>
            </svg>
            ${productData.seller}
        `;
        document.getElementById('previewRating').innerHTML = `
            <div class="text-xl">&starf;</div>
            ${productData.rating}
        `;
        document.getElementById('previewSold').textContent = productData.sold;

        const discountBadge = document.getElementById('previewDiscount');
        const newBadge = document.getElementById('previewNew');

        if (productData.discount) {
            discountBadge.textContent = productData.discount;
            discountBadge.classList.remove('hidden');
        } else {
            discountBadge.classList.add('hidden');
        }

        if (productData.new === 'true') {
            newBadge.classList.remove('hidden');
        } else {
            newBadge.classList.add('hidden');
        }
    }

    //  menerapkan semua filter
    function applyFilters() {
        const maxAllowedPrice = parseFloat(slider.value);
        const is50Checked = document.getElementById('filter-50').checked;
        const is30Checked = document.getElementById('filter-30').checked;
        const isNewChecked = document.getElementById('filter-new').checked;

        productCards.forEach((card) => {
            const price = parseFloat(card.dataset.priceNumeric);
            const discount = card.dataset.discount;
            const isNew = card.dataset.new === 'true';

            let show = true;

            if (price > maxAllowedPrice) {
                show = false;
            }

            if (show && (is50Checked || is30Checked)) {
                const has50 = discount === '50%';
                const has30 = discount === '30%';
                const matches50 = is50Checked && has50;
                const matches30 = is30Checked && has30;
                if (!matches50 && !matches30) {
                    show = false;
                }
            }

            if (show && isNewChecked && !isNew) {
                show = false;
            }

            card.style.display = show ? 'flex' : 'none';
        });
    }

    // Event listener untuk setiap produk card (preview)
    productCards.forEach((card) => {
        card.addEventListener('click', function () {
            const data = {
                id: this.dataset.id,
                title: this.dataset.title,
                price: this.dataset.price,
                original: this.dataset.original,
                seller: this.dataset.seller,
                rating: this.dataset.rating,
                sold: this.dataset.sold,
                image: this.dataset.image,
                discount: this.dataset.discount,
                new: this.dataset.new,
            };
            updatePreview(data);
        });
    });

    //  event listener pada semua filter
    document.getElementById('filter-50')?.addEventListener('change', applyFilters);
    document.getElementById('filter-30')?.addEventListener('change', applyFilters);
    document.getElementById('filter-new')?.addEventListener('change', applyFilters);

    // Slider
    if (slider) {
        slider.addEventListener('input', function () {
            const currentValue = slider.value;
            document.getElementById('maxPriceDisplay').textContent = `$${currentValue}`;
            const percentage = ((currentValue - slider.min) / (slider.max - slider.min)) * 100;
            slider.style.background = `linear-gradient(to right, #10b981 ${percentage}%, #d1d5db ${percentage}%)`;
            applyFilters();
        });
    }

    // Reset filters button
    document.getElementById('resetFilters')?.addEventListener('click', function () {
        if (slider) {
            slider.value = 50;
            slider.dispatchEvent(new Event('input'));
        }
        document.getElementById('filter-50').checked = false;
        document.getElementById('filter-30').checked = false;
        document.getElementById('filter-new').checked = false;
        applyFilters();

        const firstVisible = Array.from(productCards).find((card) => card.style.display !== 'none');
        if (firstVisible) {
            updatePreview(firstVisible.dataset);
        }
    });

    // Inisialisasi
    applyFilters();
    if (slider) slider.dispatchEvent(new Event('input'));
    updateCartCount(); 
});
