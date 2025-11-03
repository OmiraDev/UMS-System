// cashier_history_search.js

document.addEventListener("DOMContentLoaded", function() {

    // 1. Get references
    // Assume only one search bar per page for simplicity
    const searchInput = document.querySelector('.report-form input[type="text"]'); 
    const searchButton = document.querySelector('.report-form button[type="submit"]'); 
    const tableRows = document.querySelectorAll('.customer-table tbody tr'); 

    // --- Note: This script focuses ONLY on the text search ---
    // --- Date and Status dropdown filters would require separate logic ---

    // 2. Filter function
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();

        tableRows.forEach(row => {
            // Get text from relevant cells for payment history
            const transactionId = row.cells[0].textContent.toLowerCase();
            const customerId = row.cells[2].textContent.toLowerCase();
            const amount = row.cells[3].textContent.toLowerCase();
            const method = row.cells[4].textContent.toLowerCase();
            const status = row.cells[5].textContent.toLowerCase();

            // 4. Check if any relevant cell matches
            if (transactionId.includes(searchTerm) ||
                customerId.includes(searchTerm) ||
                amount.includes(searchTerm) ||
                method.includes(searchTerm) ||
                status.includes(searchTerm))
            {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        });
    }

    // 5. Add Event Listeners
    
    // Check if search elements exist before adding listeners
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            filterTable();
        });
        
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                filterTable();
            }
        });
    } else {
        console.warn("Search input or button not found on this page.");
    }
});