/*
================================
 SERVER.JS (Backend)
 Task for: Team 1 (API Developer) & Team 4 (Project Lead)
================================
*/

// --- 1. Import Required Packages ---
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const { poolPromise, sql } = require('./db');

// --- 2. Setup the Server ---
const app = express();
const port = 3000;

// --- 3. Configure Middleware ---
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json()); 

// --- 4. Define Routes ---

// This route serves your main index.html (the login page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// === REAL LOGIN API ENDPOINT ===
app.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password) 
            .input('role', sql.VarChar, role)
            .query('SELECT * FROM Staff WHERE Username = @username AND PasswordHash = @password AND Role = @role');

        if (result.recordset.length > 0) {
            console.log('Login successful for:', username);
            res.json({ success: true, message: 'Login successful!', role: role });
        } else {
            console.log('Login failed for:', username);
            res.json({ success: false, message: 'Invalid username, password, or role.' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// === ADD CUSTOMER API ENDPOINT ===
app.post('/api/add-customer', async (req, res) => {
    try {
        const { 'first-name': firstName, 'last-name': lastName, email, phone, 'cust-type': customerType, 'cust-status': status, 'address-1': address, city } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('FirstName', sql.VarChar, firstName)
            .input('LastName', sql.VarChar, lastName)
            .input('Email', sql.VarChar, email)
            .input('Phone', sql.VarChar, phone)
            .input('Address', sql.VarChar, address)
            .input('City', sql.VarChar, city)
            .input('CustomerType', sql.VarChar, customerType)
            .input('Status', sql.VarChar, status)
            .query(`
                INSERT INTO Customers 
                (FirstName, LastName, Email, Phone, Address, City, CustomerType, Status)
                VALUES 
                (@FirstName, @LastName, @Email, @Phone, @Address, @City, @CustomerType, @Status)
            `);
        console.log('New customer added successfully');
        res.json({ success: true, message: 'Customer added successfully!' });
    } catch (err) {
        console.error('Error adding customer:', err);
        if (err.number === 2627 || err.number === 2601) {
            res.json({ success: false, message: 'Error: A customer with this email already exists.' });
        } else {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
});

// === NEW: GET ALL CUSTOMERS API ENDPOINT ===
app.get('/api/get-customers', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT CustomerID, FirstName, LastName, CustomerType, Status FROM Customers');
        
        // Send the list of customers back to the frontend
        res.json({ success: true, customers: result.recordset });

    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// === NEW: GET SINGLE CUSTOMER API ENDPOINT ===
// This will listen for URLs like /api/get-customer/1
app.get('/api/get-customer/:id', async (req, res) => {
    try {
        const customerId = req.params.id; // Get the ID from the URL
        const pool = await poolPromise;
        const result = await pool.request()
            .input('CustomerID', sql.Int, customerId)
            .query('SELECT * FROM Customers WHERE CustomerID = @CustomerID');

        if (result.recordset.length > 0) {
            // Send the customer's data back
            res.json({ success: true, customer: result.recordset[0] });
        } else {
            res.json({ success: false, message: 'Customer not found.' });
        }
    } catch (err) {
        console.error('Error fetching single customer:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// === NEW: UPDATE CUSTOMER API ENDPOINT ===
// This will listen for a PUT request to update a customer
app.put('/api/update-customer/:id', async (req, res) => {
    try {
        const customerId = req.params.id; // Get the ID from the URL
        // Get the updated data from the form
        const { 
            'first-name': firstName, 
            'last-name': lastName, 
            email, 
            phone, 
            'cust-type': customerType, 
            'cust-status': status, 
            'address-1': address, 
            city 
        } = req.body;

        const pool = await poolPromise;
        await pool.request()
            .input('CustomerID', sql.Int, customerId)
            .input('FirstName', sql.VarChar, firstName)
            .input('LastName', sql.VarChar, lastName)
            .input('Email', sql.VarChar, email)
            .input('Phone', sql.VarChar, phone)
            .input('Address', sql.VarChar, address)
            .input('City', sql.VarChar, city)
            .input('CustomerType', sql.VarChar, customerType)
            .input('Status', sql.VarChar, status)
            .query(`
                UPDATE Customers SET
                FirstName = @FirstName,
                LastName = @LastName,
                Email = @Email,
                Phone = @Phone,
                Address = @Address,
                City = @City,
                CustomerType = @CustomerType,
                Status = @Status
                WHERE CustomerID = @CustomerID
            `);
        
        console.log('Customer updated successfully');
        res.json({ success: true, message: 'Customer updated successfully!' });

    } catch (err) {
        console.error('Error updating customer:', err);
        // Check for a specific "UNIQUE KEY" error
        if (err.number === 2627 || err.number === 2601) {
            res.json({ success: false, message: 'Error: A customer with this email already exists.' });
        } else {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
});
// === END: GET ALL CUSTOMERS API ENDPOINT ===
    
// --- 5. Start the Server ---
app.listen(port, async () => {
    try {
        await poolPromise; 
        console.log(`✅ Server is running at http://localhost:${port}`);
    } catch (err) {
        console.error('Failed to start server:', err);
    }
});

