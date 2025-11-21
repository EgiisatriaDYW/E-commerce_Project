// cart.js

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach((badge) => {
        badge.textContent = totalItems;
        badge.classList.toggle('hidden', totalItems === 0);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cartItemList');
    const emptyCartEl = document.getElementById('emptyCart');
    const cartSummaryEl = document.getElementById('cartSummary');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');

    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');

    function renderCart() {
        if (cart.length === 0) {
            emptyCartEl.classList.remove('hidden');
            cartItemsContainer.innerHTML = '';
            cartSummaryEl.classList.add('hidden');
            updateCartCount();
            return;
        }

        emptyCartEl.classList.add('hidden');
        cartSummaryEl.classList.remove('hidden');

        let subtotal = 0;
        cartItemsContainer.innerHTML = '';

        cart.forEach((item) => {
            const itemSubtotal = item.priceNumeric * item.quantity;
            subtotal += itemSubtotal;

            // Flex di mobile, Grid di desktop
            const itemEl = document.createElement('div');
            itemEl.className = 'p-4 border-b border-gray-100';

            itemEl.innerHTML = `
                <div class="md:grid md:grid-cols-6 md:items-center md:gap-4 md:text-center">
                    <!-- Product Info -->
                    <div class="md:col-span-2 md:text-left flex items-start gap-3 mb-4 md:mb-0">
                        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain rounded" />
                        <div>
                            <h3 class="font-semibold text-sm md:text-base">${item.title}</h3>
                            <p class="text-xs text-gray-600 md:hidden">Price: ${item.price}</p>
                            <p class="text-xs text-gray-600 md:hidden">Qty: ${item.quantity}</p>
                            <p class="text-xs text-gray-600 md:hidden">Subtotal: $${itemSubtotal.toFixed(2)}</p>
                        </div>
                    </div>

                    <!-- Price (hidden on mobile) -->
                    <div class="md:block hidden font-medium text-sm">${item.price}</div>

                    <!-- Quantity -->
                    <div class="md:block hidden">
                        <div class="flex items-center justify-center space-x-1">
                            <button class="decrease px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 text-xs">−</button>
                            <span class="quantity px-2 py-1 bg-white border border-gray-300 text-center w-10 text-sm">${item.quantity}</span>
                            <button class="increase px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 text-xs">+</button>
                        </div>
                    </div>

                    <!-- Subtotal (hidden on mobile) -->
                    <div class="md:block hidden font-semibold text-green-700 text-sm">$${itemSubtotal.toFixed(2)}</div>

                    <!-- Delete -->
                    <div class="md:block hidden text-center">
                        <button class="remove text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                    </div>

                    <!-- Mobile actions (full width below product) -->
                    <div class="md:hidden mt-3 space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium">Quantity:</span>
                            <div class="flex items-center space-x-1">
                                <button class="decrease px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 text-xs">−</button>
                                <span class="quantity px-2 py-1 bg-white border border-gray-300 text-center w-10 text-sm">${item.quantity}</span>
                                <button class="increase px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 text-xs">+</button>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium">Subtotal:</span>
                            <span class="font-semibold text-green-700">$${itemSubtotal.toFixed(2)}</span>
                        </div>
                        <button class="remove w-full mt-2 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium text-sm">
                            Remove Item
                        </button>
                    </div>
                </div>
            `;

            // Attach event listeners
            const decreaseBtn = itemEl.querySelector('.decrease');
            const increaseBtn = itemEl.querySelector('.increase');
            const removeBtn = itemEl.querySelector('.remove');
            const quantityEl = itemEl.querySelector('.quantity');

            decreaseBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    saveAndRender();
                }
            });

            increaseBtn.addEventListener('click', () => {
                item.quantity += 1;
                saveAndRender();
            });

            removeBtn.addEventListener('click', () => {
                cart = cart.filter((i) => i.id !== item.id);
                saveAndRender();
            });

            cartItemsContainer.appendChild(itemEl);
        });

        // Update summary
        const tax = 10.0;
        const total = subtotal + tax;
        cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        cartTotalEl.textContent = `$${total.toFixed(2)}`;
        updateCartCount();
    }

    function saveAndRender() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart(); // ✅ No reload! Smooth update.
    }

    // Render awal
    renderCart();

    // Checkout button
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        alert('Maaf fitur checkout belum diimplementasikan. 😊');
    });
});
