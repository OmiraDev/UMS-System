// cashier_billing_validation.js

document.addEventListener("DOMContentLoaded", function() {

    // 1. Get references
    const billingForm = document.querySelector('form'); // Assuming one form
    const billingCycleInput = document.getElementById('billing-cycle');
    const dueDateInput = document.getElementById('due-date');
    
    // Create an element for error messages
    const errorContainer = document.createElement('p');
    errorContainer.style.color = 'red';
    errorContainer.style.marginTop = '10px'; // Add space above the button
    errorContainer.style.fontWeight = 'bold';
    
    // Insert error container before the submit button
    const submitButton = billingForm.querySelector('button[type="submit"]');
    billingForm.insertBefore(errorContainer, submitButton);

    // 2. Listen for form submission
    billingForm.addEventListener('submit', function(event) {
        
        // Clear previous errors
        errorContainer.textContent = '';
        billingCycleInput.style.borderColor = '#ddd';
        dueDateInput.style.borderColor = '#ddd';
        let errors = [];

        // --- Validation Checks ---
        
        // Check if Billing Cycle is empty
        if (billingCycleInput.value.trim() === '') {
            errors.push('Billing Cycle cannot be empty.');
            billingCycleInput.style.borderColor = 'red';
        }

        // Check if Due Date is empty
        if (dueDateInput.value.trim() === '') {
            errors.push('Payment Due Date cannot be empty.');
            dueDateInput.style.borderColor = 'red';
        }
        
        // --- Handle Results ---
        if (errors.length > 0) {
            // Prevent submission
            event.preventDefault(); 
            // Display the first error
            errorContainer.textContent = 'Error: ' + errors[0]; 
        } else {
            // No errors, allow submission (navigates to action URL)
            console.log('Billing form is valid! Submitting...');
            // In a real app, this would trigger the backend billing process
        }
    });

    // Optional: Remove red border on input
    [billingCycleInput, dueDateInput].forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '#ddd';
            errorContainer.textContent = ''; 
        });
    });
});