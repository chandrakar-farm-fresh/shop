let cart = [];

const cartIcon = document.getElementById('cart-icon');
const cartCountElement = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const toastContainer = document.getElementById('toast-container');

// Sidebar Logic
function openCart() { cartSidebar.classList.add('open'); cartOverlay.classList.add('active'); }
function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('active'); }
cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Dynamically Update Price Display Based on Subscription Toggle
window.updatePrice = function(productId, standardPrice, subPrice) {
    const radioGroup = document.getElementsByName(`sub-${productId}`);
    const priceDisplay = document.getElementById(`price-display-${productId}`);
    
    let isSub = false;
    for (const radio of radioGroup) {
        if (radio.checked && radio.value === 'subscribe') {
            isSub = true;
            break;
        }
    }
    
    priceDisplay.innerText = isSub ? `₹${subPrice} / month` : `₹${standardPrice}`;
}

// Add to Cart Logic (Triggered from HTML)
window.addToCart = function(baseName, productId, standardPrice, subPrice) {
    const radioGroup = document.getElementsByName(`sub-${productId}`);
    
    let isSub = false;
    for (const radio of radioGroup) {
        if (radio.checked && radio.value === 'subscribe') {
            isSub = true;
            break;
        }
    }

    const finalPrice = isSub ? subPrice : standardPrice;
    const finalName = isSub ? `${baseName} (Monthly Subscription)` : baseName;

    cart.push({ name: finalName, price: finalPrice, isSub: isSub });

    updateCart();
    showToast(isSub ? 'Subscription Box' : baseName);
    
    cartIcon.style.transform = "scale(1.1)";
    setTimeout(() => cartIcon.style.transform = "scale(1)", 200);
}

// Update Cart Display
function updateCart() {
    cartCountElement.innerText = cart.length;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        cartTotalElement.innerText = '0';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        
        const subBadge = item.isSub ? `<div class="cart-item-sub">Renews Monthly</div>` : '';

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <div>
                <div class="cart-item-title">${item.name}</div>
                ${subBadge}
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
            <div>₹${item.price}</div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    cartTotalElement.innerText = total;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function showToast(productName) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerText = `🌾 ${productName} added!`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}