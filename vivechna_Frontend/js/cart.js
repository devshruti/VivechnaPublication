let showNotification = (message) => {
    // Set the message in the modal
    document.getElementById("notificationMessage").innerText = message;

    // Show the modal
    $('#notificationModal').modal('show');
}

function clearCart() {
    localStorage.removeItem('cartItems');
}
const CheckCred = () => {
    if (!localStorage.getItem("user-creds")) {
        clearCart();
        window.location.href = "login.html"
        showNotification("Login to access cart page")
    }
}

window.addEventListener('load', CheckCred);

// Retrieve cart items from local storage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Function to render cart items
// Function to render cart items
function renderCart() {
    const cartContainer = document.querySelector('#cart-container tbody');
    cartContainer.innerHTML = ''; // Clear previous content

    cartItems.forEach((item, index) => {
        const cartItemRow = document.createElement('tr');
        cartItemRow.innerHTML = `
      <td><img src="${item.image}" alt="${item.title}" style="max-width: 50px;"></td>
      <td>${item.price.toFixed(2)}</td>
      <td class="quantBtn" style="height:20px; ">
        <button class="quant btn rounded-pill" style="fontweight:bold; font-size: 20px;" onclick="increaseQuantity(${index})">+</button>
        <span>${item.quantity}</span>
        <button class="quant btn rounded-pill" style="fontweight:bold ;font-size: 28px;" onclick="decreaseQuantity(${index})"
          ${item.quantity <= 1 ? 'disabled' : ''}> - </button>
      </td>
      <td>${calculateTotal(item).toFixed(2)}</td>
      <td>
        <button class="btn btn-danger rounded-pill" onclick="removeFromCart(${index})">Remove</button>
      </td>
    `;

        cartContainer.appendChild(cartItemRow);
    });

    // Update cart total
    updateCartTotal();
}


// Function to update the cart total
function updateCartTotal() {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    const subtotal = cartItems.reduce((total, item) => total + calculateTotal(item), 0);
    const total = subtotal; // You can add shipping or other costs here if needed

    subtotalElement.innerText = `₹ ${subtotal.toFixed(2)}`;
    totalElement.innerText = `₹ ${total.toFixed(2)}`;
}


// Function to calculate the total price for an item
function calculateTotal(item) {
    return item.price * item.quantity;
}

// Call the function to render the initial cart
renderCart();

// Sample functions for modifying cart items (replace with your actual functions)
function increaseQuantity(index) {
    cartItems[index].quantity++;
    renderCart();
    updateLocalStorage();
}

function decreaseQuantity(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        renderCart();
        updateLocalStorage();
    }
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    renderCart();
    updateLocalStorage();
}

// Function to update local storage with the latest cart items
function updateLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function redirectToPayment() {
    // // Calculate total amount from the cart
    // const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // // Store total amount in sessionStorage to be accessed on the payment page
    // sessionStorage.setItem('totalAmount', totalAmount.toFixed(2));

    // Redirect to the payment page
    window.location.href = 'address.html';
}