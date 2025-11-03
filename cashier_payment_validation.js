// cashier_payment_validation.js

document.addEventListener("DOMContentLoaded", function() {

    // 1. Get references
    const paymentForm = document.querySelector('.payment-form');
    const paymentAmountInput = document.getElementById('payment-amount');
    
    // Create an element for error messages
    const errorContainer = document.createElement('p');
    errorContainer.style.color = 'red';
    errorContainer.style.marginTop = '10px'; // Add some space above the button
    errorContainer.style.fontWeight = 'bold';
    
    // Insert error container before the submit button
    const submitButton = paymentForm.querySelector('button[type="submit"]');
    paymentForm.insertBefore(errorContainer, submitButton);

    // 2. Listen for form submission
    paymentForm.addEventListener('submit', function(event) {
        
        // Clear previous errors
        errorContainer.textContent = '';
        paymentAmountInput.style.borderColor = '#ddd'; // Reset border
        let errors = [];

        // --- Validation Checks ---
        const paymentAmountValue = paymentAmountInput.value.trim();

        // Check if Payment Amount is empty
        if (paymentAmountValue === '') {
            errors.push('Payment Amount cannot be empty.');
            paymentAmountInput.style.borderColor = 'red';
        } 
        // Check if Payment Amount is a valid number (allows decimals)
        else if (isNaN(paymentAmountValue) || parseFloat(paymentAmountValue) < 0) {
            errors.push('Please enter a valid positive Payment Amount.');
            paymentAmountInput.style.borderColor = 'red';
        }

        // --- Handle Results ---
        if (errors.length > 0) {
            // Prevent submission
            event.preventDefault(); 
            // Display the first error
            errorContainer.textContent = 'Error: ' + errors[0]; 
        } else {
            // No errors, allow submission (navigates to action URL)
            console.log('Payment form is valid! Submitting...');
            // In a real app, you might show a confirmation message here
        }
    });

    // Optional: Remove red border on input
    paymentAmountInput.addEventListener('input', () => {
        paymentAmountInput.style.borderColor = '#ddd';
        errorContainer.textContent = ''; 
    });
});