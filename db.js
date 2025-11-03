const sql = require('mssql');

const config = {
    // --- UPDATE THESE VALUES ---
    user: 'sa',                         // The user we enabled ('sa')
    password: '0763992144u',        // The password you set for 'sa'
    server: 'localhost',                // <-- UPDATED: Just use localhost
    database: 'UMS_Database',
    port: 1433,                         // The static port we set
    
    options: {
        trustServerCertificate: true,
        // --- NEW: Specify the instance name separately ---
        instance: 'SQLEXPRESS'
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Connected to MSSQL Database (using SQL Auth)');
        return pool;
    })
    .catch(err => {
        // This will now give us a more specific error
        console.error('❌ Database Connection Failed! Error: ', err); 
        process.exit(1); 
    });

module.exports = {
    sql,
    poolPromise
};

