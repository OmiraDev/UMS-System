// admin_customers_search.js

document.addEventListener("DOMContentLoaded", function() {

    // 1. Get references to elements
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const tableBody = document.querySelector('.customer-table tbody');

    let allCustomers = []; // This will store the master list of customers

    // --- NEW: Function to load customers from the server ---
    async function loadCustomers() {
        try {
            const response = await fetch('/api/get-customers');
            const data = await response.json();

            if (data.success) {
                allCustomers = data.customers; // Store the master list
                renderTable(allCustomers); // Render the table for the first time
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('Error fetching customers:', err);
            tableBody.innerHTML = '<tr><td colspan="5" style="color: red; text-align: center;">Error: Cannot load customer data. Is the server running?</td></tr>';
        }
    }

    // --- NEW: Function to render the table ---
    function renderTable(customers) {
        tableBody.innerHTML = ''; // Clear the table first

        if (customers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No customers found.</td></tr>';
            return;
        }

        customers.forEach(customer => {
            const row = document.createElement('tr');
            
            // Add a class for the status pill
            const statusClass = customer.Status === 'Active' ? 'status-active' : 'status-inactive';

            row.innerHTML = `
                <td>C-${customer.CustomerID}</td>
                <td>${customer.FirstName} ${customer.LastName}</td>
                <td>${customer.CustomerType}</td>
                <td><span class="${statusClass}">${customer.Status}</span></td>
                <td>
                    <a href="admin_customer_form.html?id=${customer.CustomerID}" class="btn-action btn-view">View</a>
                    <a href="admin_customer_form.html?id=${customer.CustomerID}" class="btn-action btn-edit">Edit</a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // --- UPDATED: Search function ---
    // This now filters the 'allCustomers' array instead of the HTML
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredCustomers = allCustomers.filter(customer => {
            const customerId = `c-${customer.CustomerID}`.toLowerCase();
            const customerName = `${customer.FirstName} ${customer.LastName}`.toLowerCase();
            const customerType = customer.CustomerType.toLowerCase();

            return customerId.includes(searchTerm) ||
                   customerName.includes(searchTerm) ||
                   customerType.includes(searchTerm);
        });

        // Re-render the table with only the filtered results
        renderTable(filteredCustomers);
    }

    // --- 5. Add Event Listeners ---
    searchButton.addEventListener('click', filterTable);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            filterTable();
        }
    });

    // --- 6. Load data when the page starts ---
    loadCustomers();

});
