// manager_charts.js

// Wait for the document to be ready
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Create the Revenue Trends Line Chart ---
    
    // Get the 'context' of the canvas element (where to draw)
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    
    new Chart(revenueCtx, {
        type: 'line', // Type of chart
        data: {
            labels: ['May', 'June', 'July', 'August', 'September', 'October'],
            datasets: [{
                label: 'Revenue',
                data: [75000, 88000, 92000, 110000, 105000, 120500],
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1 // Makes the line slightly curved
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    // Format the y-axis to show dollar signs
                    ticks: {
                        callback: function(value, index, values) {
                            return 'RS:' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // --- 2. Create the Usage Patterns Bar Chart ---

    const usageCtx = document.getElementById('usageChart').getContext('2d');
    
    new Chart(usageCtx, {
        type: 'bar', // Type of chart
        data: {
            labels: ['Electricity (kWh)', 'Water (m³)', 'Gas (units)'],
            datasets: [{
                label: 'Consumption',
                data: [54000, 22000, 15000], // Sample data
                backgroundColor: [
                    'rgba(255, 159, 64, 0.7)', // Orange
                    'rgba(54, 162, 235, 0.7)', // Blue
                    'rgba(75, 192, 192, 0.7)'  // Green
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Hide the legend as it's obvious
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

});