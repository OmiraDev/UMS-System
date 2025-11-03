// admin_meter_form.js

document.addEventListener("DOMContentLoaded", function() {

    // 1. Get references
    const meterForm = document.querySelector('form'); // Assuming one form
    const meterIdInput = document.getElementById('meter-id');
    // Note: Utility Type is a <select> and always has a value, so no need to validate emptiness typically
    
    // Create an element for error messages
    const errorContainer = document.createElement('p');
    errorContainer.style.color = 'red';
    errorContainer.style.marginTop = '10px';
    errorContainer.style.fontWeight = 'bold';
    
    // Insert error container before form actions
    const formActions = document.querySelector('.form-actions');
    meterForm.insertBefore(errorContainer, formActions);

    // 2. Listen for form submission
    meterForm.addEventListener('submit', function(event) {
        
        // Clear previous errors
        errorContainer.textContent = '';
        let errors = []; 

        // --- Validation Checks ---
        
        // Check if Meter ID is empty
        if (meterIdInput.value.trim() === '') {
            errors.push('Meter ID cannot be empty.');
            meterIdInput.style.borderColor = 'red'; // Highlight
        } else {
            meterIdInput.style.borderColor = '#ddd'; // Reset
        }

        // --- Handle Results ---
        if (errors.length > 0) {
            // Prevent submission
            event.preventDefault(); 
            // Display the first error
            errorContainer.textContent = 'Error: ' + errors[0]; 
        } else {
            // No errors, allow submission (navigates to action URL)
            console.log('Meter form is valid! Submitting...');
        }
    });

    // Optional: Remove red border on input
    meterIdInput.addEventListener('input', () => {
        meterIdInput.style.borderColor = '#ddd';
        errorContainer.textContent = ''; 
    });
});