// Payment service for Razorpay integration
let currentAmount = 0;

function createPaymentOptions(amount) {
    return {
        "key": "rzp_test_M7ec5ZnuHkoyje", // Enter the Key ID generated from the Dashboard
        "amount": amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Dominos Pizza", //your business name
        "description": "Delicious pizza order",
        "image": "https://www.dominos.co.in/theme2/front/images/logo.png",
        "handler": function (response) {
            handlePaymentSuccess(response);
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": "Customer Name", //your customer's name
            "email": "customeremail@example.com", 
            "contact": "customer phone.no"  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Dominos Pizza Delivery"
        },
        "theme": {
            "color": "#E31837" // Dominos red color
        }
    };
}

function handlePaymentSuccess(response) {
    // Show success message
    showPaymentSuccess();
    
    // Clear cart after successful payment
    if (window.productOperations) {
        window.productOperations.clearCart();
        // Refresh cart display
        if (window.printBasket) {
            window.printBasket();
        }
    }
    
    console.log("Payment successful:", response);
    console.log("Payment ID:", response.razorpay_payment_id);
    console.log("Order ID:", response.razorpay_order_id);
    console.log("Signature:", response.razorpay_signature);
}

function handlePaymentFailure(response) {
    showPaymentError("Payment failed. Please try again.");
    console.error("Payment failed:", response.error);
}

function showPaymentSuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    successDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1000; max-width: 300px;';
    successDiv.innerHTML = `
        <h6>🎉 Payment Successful!</h6>
        <p class="mb-0">Your order has been placed successfully. You will receive a confirmation shortly.</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(successDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

function showPaymentError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    errorDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1000; max-width: 300px;';
    errorDiv.innerHTML = `
        <h6>❌ Payment Failed</h6>
        <p class="mb-0">${message}</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function initializePayment(amount) {
    if (amount <= 0) {
        showPaymentError("Cart is empty. Please add items before proceeding to payment.");
        return;
    }
    
    currentAmount = amount;
    const options = createPaymentOptions(amount);
    const rzp = new Razorpay(options);
    
    rzp.on('payment.failed', handlePaymentFailure);
    
    rzp.open();
}

// Global function to update payment amount
window.updatePaymentAmount = function(amount) {
    currentAmount = amount;
};

// Initialize payment button when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // The payment button will be created dynamically in the cart
    // This ensures it's always up to date with the current cart total
});

// Export for use in other modules
window.initializePayment = initializePayment;