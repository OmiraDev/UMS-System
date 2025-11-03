// admin_complaints_search.js

document.addEventListener("DOMContentLoaded", function() {

    // 1. Get references
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const tableRows = document.querySelectorAll('.customer-table tbody tr'); // Reusing '.customer-table'

    // 2. Filter function
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();

        tableRows.forEach(row => {
            // Get text from relevant cells for complaints
            const ticketId = row.cells[0].textContent.toLowerCase();
            const customerId = row.cells[1].textContent.toLowerCase();
            const subject = row.cells[2].textContent.toLowerCase();
            const status = row.cells[3].textContent.toLowerCase();

            // 4. Check if any cell matches
            if (ticketId.includes(searchTerm) ||
                customerId.includes(searchTerm) ||
                subject.includes(searchTerm) ||
                status.includes(searchTerm))
            {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        });
    }

    // 5. Add Event Listeners
    searchButton.addEventListener('click', filterTable);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            filterTable();
        }
    });
});