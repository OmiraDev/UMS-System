// admin_services_search.js

document.addEventListener("DOMContentLoaded", function() {

    // 1. Get references to elements
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    // Get all the data rows (skip the header row 'thead tr')
    const tableRows = document.querySelectorAll('.customer-table tbody tr'); // Reusing '.customer-table'

    // 2. Function to perform the search/filter
    function filterTable() {
        // Get the search term, convert to lowercase
        const searchTerm = searchInput.value.toLowerCase();

        // 3. Loop through each row in the table body
        tableRows.forEach(row => {
            // Get the text content of the relevant cells
            const meterId = row.cells[0].textContent.toLowerCase();
            const utilityType = row.cells[1].textContent.toLowerCase();
            const customerId = row.cells[2].textContent.toLowerCase();
            const address = row.cells[3].textContent.toLowerCase(); // Added Address search

            // 4. Check if any cell contains the search term
            if (meterId.includes(searchTerm) ||
                utilityType.includes(searchTerm) ||
                customerId.includes(searchTerm) ||
                address.includes(searchTerm))
            {
                // If it matches, make sure the row is visible
                row.style.display = '';
            } else {
                // If it doesn't match, hide the row
                row.style.display = 'none';
            }
        });
    }

    // 5. Add Event Listeners
    
    // Listen for clicks on the search button
    searchButton.addEventListener('click', filterTable);

    // Listen for the "Enter" key press in the input field
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            filterTable();
        }
    });

});