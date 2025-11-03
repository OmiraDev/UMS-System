// cashier_search.js

document.addEventListener("DOMContentLoaded", function() {

    // 1. Get references to the HTML elements
    const findButton = document.getElementById('find-customer-btn');
    const searchInput = document.getElementById('customer-search-input');
    const detailsSection = document.getElementById('payment-details-section');

    // Check if all elements were found
    if (findButton && searchInput && detailsSection) {
        
        // 2. Listen for a click on the "Find" button
        findButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();

            if (searchTerm === '') {
                // In a real app, you might show an error
                // For this prototype, we'll just show the details anyway
                console.log("Search is empty, showing details for prototype.");
            }

            // --- Simulate finding the customer ---
            // In a real app (Team 3), this is where you would:
            // 1. Send `searchTerm` to the backend (Team 1) using fetch().
            // 2. Get customer data back.
            // 3. Update the HTML with the new data.

            // For this frontend prototype (Team 2), just show the section
            console.log('Simulating search for:', searchTerm);
            detailsSection.style.display = 'block'; // Show the hidden section
        });

        // 3. Optional: Allow searching on Enter key press
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Stop form from submitting
                findButton.click(); // Trigger the button's click event
            }
        });

    } else {
        console.error('Cashier search script could not find required elements (find-customer-btn, customer-search-input, or payment-details-section).');
    }
});
