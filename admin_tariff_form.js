// admin_tariff_form.js

document.addEventListener("DOMContentLoaded", function() {

    // Find the 'Add Slab' button and the container that holds the slabs
    const addSlabButton = document.querySelector(".btn-add-slab");
    const slabsContainer = document.querySelector(".tariff-slabs");

    // --- 1. Function to ADD a new slab ---
    function addSlab() {
        // Create a new 'div' element for the row
        const newSlabRow = document.createElement("div");
        newSlabRow.className = "slab-row"; // Give it the 'slab-row' class

        // This is the HTML that will go inside the new row
        const newRowHTML = `
            <div class="form-group">
                <label>Slab Name</label>
                <input type="text" placeholder="e.g., Slab 4 (150+ kWh)">
            </div>
            <div class="form-group">
                <label>Rate (per unit)</label>
                <input type="text" placeholder="RS:0.00">
            </div>
            <button type="button" class="btn-remove">Remove</button>
        `;

        // Add the HTML to the new row
        newSlabRow.innerHTML = newRowHTML;
        
        // Add the new row to the container
        slabsContainer.appendChild(newSlabRow);
    }

    // --- 2. Function to REMOVE a slab ---
    function removeSlab(event) {
        // Check if the clicked element has the class 'btn-remove'
        if (event.target.classList.contains("btn-remove")) {
            
            // Find the parent '.slab-row' and remove it
            const slabRow = event.target.closest(".slab-row");
            slabRow.remove();
        }
    }

    // --- 3. Attach the Event Listeners ---
    
    // Listen for clicks on the 'Add Slab' button
    addSlabButton.addEventListener("click", addSlab);

    // Listen for clicks inside the *entire container*
    // This is called "event delegation" and lets us
    // remove buttons that we add in the future.
    slabsContainer.addEventListener("click", removeSlab);
});