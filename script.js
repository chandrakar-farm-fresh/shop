let cart = []; // Array to hold items with quantities
let customer = null;

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const loginBtn = document.getElementById('login-btn');
const userGreeting = document.getElementById('user-greeting');
const loginModal = document.getElementById('login-modal');
const closeLogin = document.getElementById('close-login');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const cartCountElement = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const toastContainer = document.getElementById('toast-container');
const checkoutBtn = document.querySelector('.checkout-btn');

// --- Sidebar Logic ---
window.openCart = function() { cartSidebar.classList.add('open'); cartOverlay.classList.add('active'); }
function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('active'); }
cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// --- Radio Button Price Update ---
window.updatePrice = function(productId, standardPrice, subPrice) {
    const radioGroup = document.getElementsByName(`sub-${productId}`);
    const priceDisplay = document.getElementById(`price-display-${productId}`);
    
    let isSub = false;
    for (const radio of radioGroup) {
        if (radio.checked && radio.value === 'subscribe') { isSub = true; break; }
    }
    
    priceDisplay.innerText = isSub ? `₹${subPrice} / month` : `₹${standardPrice}`;
    
    // Refresh the button UI because they might have switched to a variant not in the cart
    updateProductUI(productId);
}
window.addToCart = function(baseName, productId, standardPrice, subPrice) {
    // Add this line to give a tiny 'click' feel on Android phones
    if (navigator.vibrate) navigator.vibrate(50); 
    
    // ... rest of your existing code ...
}

// --- Add Initial Item to Cart ---
window.addToCart = function(baseName, productId, standardPrice, subPrice) {
    const radioGroup = document.getElementsByName(`sub-${productId}`);
    let isSub = false;
    for (const radio of radioGroup) {
        if (radio.checked && radio.value === 'subscribe') { isSub = true; break; }
    }

    const finalPrice = isSub ? subPrice : standardPrice;
    const finalName = isSub ? `${baseName} (Monthly Box)` : baseName;
    
    // Create a unique ID combining the product and its subscription type
    const cartItemId = `${productId}-${isSub ? 'sub' : 'one'}`;

    cart.push({ id: cartItemId, productId: productId, name: finalName, price: finalPrice, isSub: isSub, qty: 1 });

    updateCart();
    updateProductUI(productId);
    showToast(isSub ? 'Subscription Box' : baseName);
    
    cartIcon.style.transform = "scale(1.1)";
    setTimeout(() => cartIcon.style.transform = "scale(1)", 200);
}

// --- Modify Quantity Logic ---
window.changeQty = function(cartItemId, delta) {
    const itemIndex = cart.findIndex(item => item.id === cartItemId);
    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;
        const pId = cart[itemIndex].productId;
        
        // Remove from array if qty hits 0
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        updateCart();
        updateProductUI(pId);
    }
}

// Proxy function to get the cart item ID from the product card
window.modifyCardQty = function(productId, delta) {
    const radioGroup = document.getElementsByName(`sub-${productId}`);
    let isSub = false;
    for (const radio of radioGroup) {
        if (radio.checked && radio.value === 'subscribe') { isSub = true; break; }
    }
    const cartItemId = `${productId}-${isSub ? 'sub' : 'one'}`;
    changeQty(cartItemId, delta);
}

// --- Update Product Card UI ---
function updateProductUI(productId) {
    const radioGroup = document.getElementsByName(`sub-${productId}`);
    let isSub = false;
    for (const radio of radioGroup) {
        if (radio.checked && radio.value === 'subscribe') { isSub = true; break; }
    }
    
    const cartItemId = `${productId}-${isSub ? 'sub' : 'one'}`;
    const cartItem = cart.find(item => item.id === cartItemId);
    
    const addBtn = document.getElementById(`add-btn-${productId}`);
    const qtyUI = document.getElementById(`qty-ui-${productId}`);
    const qtyText = document.getElementById(`card-qty-${productId}`);

    // If item is in cart, hide 'Add' and show 'Qty' controls
    if (cartItem && cartItem.qty > 0) {
        addBtn.style.display = 'none';
        qtyUI.style.display = 'flex';
        qtyText.innerText = cartItem.qty;
    } else {
        addBtn.style.display = 'block';
        qtyUI.style.display = 'none';
    }
}

// --- Update Cart Sidebar UI ---
function updateCart() {
    // Tally up total items based on quantity
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElement.innerText = totalItems;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        cartTotalElement.innerText = '0';
        return;
    }

    let total = 0;
    cart.forEach((item) => {
        total += item.price * item.qty;
        const subBadge = item.isSub ? `<div class="cart-item-sub">Renews Monthly</div>` : '';

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <div style="flex-grow: 1;">
                <div class="cart-item-title">${item.name}</div>
                ${subBadge}
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
            </div>
            <div style="text-align: right; min-width: 60px;">
                <div style="font-weight: 600;">₹${item.price * item.qty}</div>
                <button class="remove-btn" onclick="changeQty('${item.id}', -${item.qty})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    cartTotalElement.innerText = total;
}

// --- Toast Notification ---
function showToast(productName) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerText = `🌾 ${productName} added!`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- Login/Customer Info Logic ---
function loadCustomer() {
    const stored  = localStorage.getItem('farmCustomer');
    if (stored) {
        customer = JSON.parse(stored);
        userGreeting.innerText = `Welcome, ${customer.name}`;
        loginBtn.innerText = 'Logout';
    }
}

function openLoginModal() {
    loginError.innerText = '';
    loginModal.classList.add('active');
}

function closeLoginModal() {
    loginModal.classList.remove('active');
}

function setCustomerProfile(name, email, phone) {
    customer = { name: name.trim(), email: email.trim(), phone: phone.trim() };
    localStorage.setItem('farmCustomer', JSON.stringify(customer));
    userGreeting.innerText = `Welcome, ${customer.name}`;
    loginBtn.innerText = 'Logout';
    closeLoginModal();
}

loginBtn.addEventListener('click', () => {
    if (customer) {
        customer = null;
        localStorage.removeItem('farmCustomer');
        userGreeting.innerText = 'Welcome, Guest';
        loginBtn.innerText = 'Login';
        return;
    }
    openLoginModal();
});

closeLogin.addEventListener('click', closeLoginModal);

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    if (!name || !email || !phone) {
        loginError.innerText = 'All fields are required.';
        return;
    }
    setCustomerProfile(name, email, phone);
});

loadCustomer();

// --- WhatsApp Checkout Integration ---
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add some produce before checking out.");
        return;
    }

    let message = "🌾 *New Order from Chandrakar Farm Fresh* 🌾\n\n";
    if (customer) {
        message += `Customer: ${customer.name} \nEmail: ${customer.email} \nPhone: ${customer.phone} \n\n`;
    } else {
        message += "Customer: Guest (login recommended)\n\n";
    }
    
    // Updated to show quantities in the WhatsApp message
    cart.forEach(item => {
        message += `- ${item.name} (Qty: ${item.qty}): ₹${item.price * item.qty}\n`;
    });

    const currentTotal = cartTotalElement.innerText;
    message += `\n*Total: ₹${currentTotal}*\n\n`;
    message += "I would like to proceed with the payment and provide my delivery details.";

    const encodedMessage = encodeURIComponent(message);
    
    // Remember to put your actual number here later
    const whatsappNumber = "919340249299"; 
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
});

// --- FAQ Accordion Logic ---
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const faqAnswer = question.nextElementSibling;
        faqItem.classList.toggle('active');
        if (faqItem.classList.contains('active')) {
            faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
        } else {
            faqAnswer.style.maxHeight = 0;
        }
    });
});
