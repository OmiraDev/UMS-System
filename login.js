document.addEventListener("DOMContentLoaded", function() {

    // --- References ---
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username"); // Still here for validation
    const passwordInput = document.getElementById("password"); // Still here for validation
    const errorMessage = document.getElementById("error-message");

    // --- References for Segmented Control ---
    const roleButtonGroup = document.querySelector(".segmented-control");
    const roleButtons = roleButtonGroup.querySelectorAll("button");
    const hiddenRoleInput = document.getElementById("user-role");

    // --- Handle clicks on the role buttons ---
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedRole = this.getAttribute('data-role');
            hiddenRoleInput.value = selectedRole; // Update hidden input
            roleButtons.forEach(btn => btn.classList.remove('active')); // Remove active from all
            this.classList.add('active'); // Add active to the clicked one
            errorMessage.textContent = ''; // Clear error
            roleButtonGroup.style.borderColor = '#007bff'; // Reset border
        });
    });

    // --- Form Submit Handler ---
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Stop the form from submitting
        errorMessage.textContent = ''; // Clear old errors

        // --- 1. Get data from the form ---
        const role = hiddenRoleInput.value;
        const username = usernameInput.value;
        const password = passwordInput.value;

        // --- 2. Frontend Validation ---
        if (role === "") {
            errorMessage.textContent = "Error: Please select your role.";
            roleButtonGroup.style.borderColor = 'red';
            return;
        }
        
        if (username === "" || password === "") {
            errorMessage.textContent = "Error: Username and Password cannot be empty.";
            return;
        }

        // --- 3. SIMULATE Login (No Server) ---
        errorMessage.textContent = "Login Successful! Redirecting...";
        errorMessage.style.color = "green";

        // Redirect to the correct page based on the role
        setTimeout(() => {
            switch (role) {
                case "admin":
                    window.location.href = "admin_dashboard.html";
                    break;
                case "cashier":
                    window.location.href = "cashier_payment.html";
                    break;
                case "manager":
                    window.location.href = "manager_dashboard.html";
                    break;
                case "field":
                    window.location.href = "field_officer_route.html";
                    break;
            }
        }, 1000); // Wait 1 second to show the success message
    });
});
