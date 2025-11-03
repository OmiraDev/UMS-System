// admin_customer_form.js

document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Get DOM Elements ---
    const customerForm = document.querySelector('form');
    const errorContainer = document.createElement('p');
    const formActions = document.querySelector('.form-actions');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('form-submit-btn');

    // Form inputs
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const typeInput = document.getElementById('cust-type');
    const statusInput = document.getElementById('cust-status');
    const addressInput = document.getElementById('address-1');
    const cityInput = document.getElementById('city');
    // Note: You may need to add IDs for address-2 and zip-code if you want them to populate

    // Setup error container
    errorContainer.style.marginTop = '10px';
    errorContainer.style.fontWeight = 'bold';
    customerForm.insertBefore(errorContainer, formActions);

    // --- 2. Check URL for an ID (to see if we are in "Edit Mode") ---
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');
    const isEditMode = customerId !== null;

    // --- 3. Function to Populate Form (if in Edit Mode) ---
    async function loadCustomerData() {
        if (!isEditMode) {
            // We are in "Add New" mode. Do nothing.
            return;
        }

        // We are in "Edit Mode". Change the UI.
        formTitle.textContent = `Edit Customer (ID: ${customerId})`;
        submitButton.textContent = 'Update Customer';

        try {
            // Fetch the existing customer's data
            const response = await fetch(`/api/get-customer/${customerId}`);
            const data = await response.json();

            if (data.success) {
                // Populate the form with the data
                const customer = data.customer;
                firstNameInput.value = customer.FirstName;
                lastNameInput.value = customer.LastName;
                emailInput.value = customer.Email;
                phoneInput.value = customer.Phone;
                typeInput.value = customer.CustomerType;
                statusInput.value = customer.Status;
                addressInput.value = customer.Address;
                cityInput.value = customer.City;
            } else {
                showError(data.message);
            }
        } catch (err) {
            console.error('Error loading customer:', err);
            showError('Could not load customer data. Server error.');
        }
    }

    // --- 4. Form Submit Handler (Handles BOTH Add and Edit) ---
    customerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Frontend Validation (from QA Dev)
        if (!validateForm()) return; 

        // Get all form data
        const formData = new FormData(customerForm);
        const data = Object.fromEntries(formData.entries());

        // Decide the URL and Method
        const url = isEditMode ? `/api/update-customer/${customerId}` : '/api/add-customer';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                const action = isEditMode ? 'updated' : 'added';
                showSuccess(`Success! Customer ${action}. Redirecting...`);
                
                setTimeout(() => {
                    window.location.href = 'admin_customers.html';
                }, 1500);

            } else {
                showError(result.message); // Show error from server
            }
        } catch (err) {
            console.error('Submit error:', err);
            showError('Error: Cannot connect to server.');
        }
    });

    // --- 5. Helper Functions (from QA Dev) ---
    function validateForm() {
        clearErrors();
        let errors = [];
        if (firstNameInput.value.trim() === '') errors.push('First Name');
        if (lastNameInput.value.trim() === '') errors.push('Last Name');
        if (emailInput.value.trim() === '') errors.push('Email');
        
        if (errors.length > 0) {
            showError(`Please enter a ${errors.join(', ')}.`);
            return false;
        }
        return true;
    }

    function showError(message) {
        errorContainer.textContent = `Error: ${message}`;
        errorContainer.style.color = 'red';
    }

    function showSuccess(message) {
        errorContainer.textContent = message;
        errorContainer.style.color = 'green';
    }

    function clearErrors() {
        errorContainer.textContent = '';
    }

    // --- 6. Run the load function on page start ---
    loadCustomerData();
});
