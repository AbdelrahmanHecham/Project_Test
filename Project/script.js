// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartIcon();

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.card');
            const product = {
                name: card.querySelector('.card-title').textContent,
                price: parseFloat(card.querySelector('.card-footer').textContent.replace('$', '')),
                image: card.querySelector('.card-img-top').src,
                quantity: 1 // Default quantity
            };
            addToCart(product);
        });
    });

    // Remove from cart buttons
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-from-cart')) {
            e.preventDefault();
            const index = e.target.dataset.index;
            removeFromCart(index);
        }
    });

    // Quantity change
    document.body.addEventListener('input', function(e) {
        if (e.target && e.target.classList.contains('quantity')) {
            const index = e.target.dataset.index;
            const quantity = parseInt(e.target.value);
            updateQuantity(index, quantity);
        }
    });

    // Proceed to checkout button
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Implement checkout logic here
            alert('Proceeding to checkout...');
        });
    }

    // Functions
    function addToCart(product) {
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        updateCart();
        alert(`${product.name} added to cart!`);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    function updateQuantity(index, quantity) {
        if (quantity < 1) {
            quantity = 1;
        }
        cart[index].quantity = quantity;
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }
    }

    function updateCartIcon() {
        const cartIcon = document.querySelector('.nav-link[href="cart.html"]');
        if (cartIcon) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartIcon.textContent = `🛒 (${totalItems})`;
        }
    }

    function displayCart() {
        const cartContainer = document.querySelector('.col-md-8');
        if (!cartContainer) return;

        cartContainer.innerHTML = '<h2>Your Course\'s Cart</h2>';
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML += '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item', 'border', 'p-3', 'mb-3');
                cartItem.innerHTML = `
                    <div class="row">
                        <div class="col-md-3">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid">
                        </div>
                        <div class="col-md-5">
                            <h5>${item.name}</h5>
                            <p>$${item.price.toFixed(2)}</p>
                        </div>
                        <div class="col-md-2">
                            <input type="number" class="form-control quantity" value="${item.quantity}" min="1" data-index="${index}">
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-danger remove-from-cart" data-index="${index}">Remove</button>
                        </div>
                    </div>
                `;
                cartContainer.appendChild(cartItem);
                total += item.price * item.quantity;
            });
        }

        // Update cart summary
        const summaryContainer = document.querySelector('.col-md-4');
        if (summaryContainer) {
            const taxRate = 0.08; // Assuming 8% tax
            const taxAmount = total * taxRate;
            const grandTotal = total + taxAmount;

            summaryContainer.innerHTML = `
                <div class="border p-3 mb-3">
                    <h3 class="mb-3">Cart Summary</h3>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Tax</span>
                        <span>$${taxAmount.toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-3">
                        <strong>Total</strong>
                        <strong>$${grandTotal.toFixed(2)}</strong>
                    </div>
                    <button class="btn btn-primary w-100 checkout-button">Proceed to Checkout</button>
                </div>
            `;
        }
    }

    // Display cart on cart page
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }

    // Contact form submission
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            // Here you would typically send this data to a server
            console.log('Form submitted:', { name, email, message });
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
});
document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    alert(result.message);
});

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (result.token) {
        localStorage.setItem("token", result.token);
        alert("Login successful");
    } else {
        alert(result.message);
    }
});
