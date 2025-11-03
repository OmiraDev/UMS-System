CREATE DATABASE UMS_Database;

USE  UMS_Database;


/*
================================================================
 UMS (UTILITY MANAGEMENT SYSTEM) DATABASE SCRIPT (v2 - Corrected)
================================================================
 Fix 1: Added 'Inactive' to the CHECK constraint in CREATE TABLE Meters.
 Fix 2: Added 'GO' after all PRINT statements in Section 3 to ensure
        CREATE statements are the first in their batch.
*/

-- Supress "rows affected" messages for cleaner output
SET NOCOUNT ON;
GO

/*
================================================================
 SECTION 1: CREATE TABLES
================================================================
*/

PRINT '--- 1. Creating Tables ---';

-- 1. Staff Table
PRINT 'Creating Table: Staff...';
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(150),
    Role VARCHAR(50) NOT NULL CHECK (Role IN ('Admin', 'Cashier', 'Manager', 'FieldOfficer'))
);
GO

-- 2. Customers Table
PRINT 'Creating Table: Customers...';
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE,
    Phone VARCHAR(50),
    Address VARCHAR(255),
    City VARCHAR(100),
    CustomerType VARCHAR(50) CHECK (CustomerType IN ('Household', 'Business', 'Government')),
    Status VARCHAR(50) DEFAULT 'Active' CHECK (Status IN ('Active', 'Inactive')),
    OutstandingBalance DECIMAL(10, 2) DEFAULT 0.00
);
GO

-- 3. Tariffs Table
PRINT 'Creating Table: Tariffs...';
CREATE TABLE Tariffs (
    TariffID INT PRIMARY KEY IDENTITY(1,1),
    UtilityType VARCHAR(50) NOT NULL,
    Description VARCHAR(255),
    FixedCharge DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    Slab1_EndUnit INT,
    Slab1_Rate DECIMAL(10, 4),
    Slab2_EndUnit INT,
    Slab2_Rate DECIMAL(10, 4),
    Slab3_EndUnit INT,
    Slab3_Rate DECIMAL(10, 4)
);
GO

-- 4. Meters Table
PRINT 'Creating Table: Meters...';
CREATE TABLE Meters (
    MeterID VARCHAR(50) PRIMARY KEY NOT NULL,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    UtilityType VARCHAR(50) NOT NULL CHECK (UtilityType IN ('Electricity', 'Water', 'Gas')),
    
    -- === FIX 1 WAS HERE ===
    -- Added 'Inactive' to the list of allowed statuses
    Status VARCHAR(50) DEFAULT 'Active' CHECK (Status IN ('Active', 'Stock', 'Maintenance', 'Inactive')), 
    
    LastReadingValue INT DEFAULT 0,
    LastReadingDate DATE
);
GO

-- 5. MeterReadings Table
PRINT 'Creating Table: MeterReadings...';
CREATE TABLE MeterReadings (
    ReadingID INT PRIMARY KEY IDENTITY(1,1),
    MeterID VARCHAR(50) FOREIGN KEY REFERENCES Meters(MeterID),
    ReadingDate DATE NOT NULL,
    ReadingValue INT NOT NULL,
    RecordedBy INT FOREIGN KEY REFERENCES Staff(StaffID)
);
GO

-- 6. Bills Table
PRINT 'Creating Table: Bills...';
CREATE TABLE Bills (
    BillID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    BillDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    Consumption INT,
    AmountDue DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'Unpaid' CHECK (Status IN ('Unpaid', 'Paid', 'Overdue'))
);
GO

-- 7. Payments Table
PRINT 'Creating Table: Payments...';
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    BillID INT FOREIGN KEY REFERENCES Bills(BillID),
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    PaymentDate DATE NOT NULL,
    AmountPaid DECIMAL(10, 2) NOT NULL,
    PaymentMethod VARCHAR(50) CHECK (PaymentMethod IN ('Cash', 'Card', 'Online')),
    ProcessedBy INT FOREIGN KEY REFERENCES Staff(StaffID)
);
GO

-- 8. Complaints Table
PRINT 'Creating Table: Complaints...';
CREATE TABLE Complaints (
    TicketID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    Subject VARCHAR(255) NOT NULL,
    Description VARCHAR(MAX),
    DateSubmitted DATE DEFAULT GETDATE(),
    Status VARCHAR(50) DEFAULT 'Open' CHECK (Status IN ('Open', 'In Progress', 'Closed')),
    AssignedTo INT FOREIGN KEY REFERENCES Staff(StaffID) NULL
);
GO

PRINT '✅ All tables created successfully.';
PRINT ' ';

/*
================================================================
 SECTION 2: INSERT SAMPLE DATA
================================================================
*/

PRINT '--- 2. Inserting Sample Data ---';

-- Insert Staff
PRINT 'Inserting Staff...';
INSERT INTO Staff (Username, PasswordHash, FullName, Role)
VALUES
('admin', 'admin', 'Admin User', 'Admin'),
('cashier', 'cashier', 'Cashier User', 'Cashier'),
('manager', 'manager', 'Manager User', 'Manager'),
('field', 'field', 'Field Officer 1', 'FieldOfficer');
GO

-- Insert Customers
PRINT 'Inserting Customers...';
INSERT INTO Customers (FirstName, LastName, Email, Phone, Address, City, CustomerType, Status)
VALUES
('John', 'Doe', 'john.doe@email.com', '555-1234', '123 Green St', 'Colombo', 'Household', 'Active'),
('Jane', 'Smith', 'jane.smith@email.com', '555-5678', '789 Oak Rd', 'Kandy', 'Household', 'Active'),
('Smith', 'Enterprises', 'contact@smith.com', '555-9012', '456 Main Ave', 'Colombo', 'Business', 'Active'),
('Kamal', 'Perera', 'k.perera@email.com', '555-1111', '10 Palm Grove', 'Galle', 'Household', 'Active'),
('Saman', 'Disilva', 'saman.d@email.com', '555-2222', '22 Hill Street', 'Kandy', 'Household', 'Active'),
('Nimali', 'Fernando', 'nimali@email.com', '555-3333', '33 Beach Rd', 'Negombo', 'Household', 'Inactive'),
('ABC', 'Logistics', 'info@abclogistics.com', '555-4444', '44 Industrial Zone', 'Colombo', 'Business', 'Active'),
('Govt', 'Hospital', 'info@hospital.gov', '555-5555', '55 Hospital Rd', 'Colombo', 'Government', 'Active'),
('Sunil', 'Rathnayake', 'sunil.r@email.com', '555-6666', '66 Lake Rd', 'Kandy', 'Household', 'Active'),
('David', 'Johnson', 'david.j@email.com', '555-7777', '77 Flower Lane', 'Colombo', 'Household', 'Active');
GO

-- Insert Tariffs
PRINT 'Inserting Tariffs...';
INSERT INTO Tariffs (UtilityType, Description, FixedCharge, Slab1_EndUnit, Slab1_Rate, Slab2_EndUnit, Slab2_Rate, Slab3_EndUnit, Slab3_Rate)
VALUES
('Electricity', 'Residential Electricity', 5.00, 60, 0.15, 90, 0.25, 99999, 0.40),
('Water', 'Residential Water', 3.00, 99999, 1.20, NULL, NULL, NULL, NULL),
('Gas', 'Residential Gas', 2.50, 99999, 0.80, NULL, NULL, NULL, NULL);
GO

-- Insert Meters
PRINT 'Inserting Meters...';
INSERT INTO Meters (MeterID, CustomerID, UtilityType, Status, LastReadingValue, LastReadingDate)
VALUES
('E-90210', 1, 'Electricity', 'Active', 1500, '2025-09-30'),
('W-11235', 2, 'Water', 'Active', 200, '2025-09-30'),
('G-44556', 1, 'Gas', 'Active', 50, '2025-09-30'),
('E-90211', 3, 'Electricity', 'Active', 10500, '2025-09-30'),
('W-11236', 3, 'Water', 'Active', 800, '2025-09-30'),
('E-90212', 4, 'Electricity', 'Active', 300, '2025-09-30'),
('E-90213', 5, 'Electricity', 'Active', 450, '2025-09-30'),
('E-90214', 6, 'Electricity', 'Inactive', 700, '2025-01-01'), -- This row will now work
('E-90215', 7, 'Electricity', 'Active', 25000, '2025-09-30'),
('W-11237', 8, 'Water', 'Active', 1500, '2025-09-30');
GO

-- Insert MeterReadings
PRINT 'Inserting MeterReadings...';
INSERT INTO MeterReadings (MeterID, ReadingDate, ReadingValue, RecordedBy)
VALUES
('E-90210', '2025-10-27', 1650, 4), -- 150 unit consumption
('W-11235', '2025-10-27', 225, 4),  -- 25 unit consumption
('G-44556', '2025-10-27', 60, 4),
('E-90211', '2025-10-27', 10800, 4),
('W-11236', '2025-10-27', 850, 4),
('E-90212', '2025-10-27', 370, 4),
('E-90213', '2025-10-27', 510, 4),
('E-90215', '2025-10-27', 25500, 4),
('W-11237', '2025-10-27', 1600, 4),
('E-90210', '2025-11-27', 1750, 4); -- A second reading for E-90210
GO

-- Insert Bills
PRINT 'Inserting Bills...';
INSERT INTO Bills (CustomerID, BillDate, DueDate, Consumption, AmountDue, Status)
VALUES
(1, '2025-10-01', '2025-10-15', 100, 17.50, 'Paid'),
(2, '2025-10-01', '2025-10-15', 20, 27.00, 'Unpaid'),
(3, '2025-09-01', '2025-09-15', 50, 7.50, 'Unpaid'),
(4, '2025-10-01', '2025-10-15', 80, 14.00, 'Paid'),
(5, '2025-10-01', '2025-10-15', 70, 11.50, 'Unpaid'),
(7, '2025-10-01', '2025-10-15', 500, 195.00, 'Paid'),
(8, '2025-10-01', '2025-10-15', 200, 243.00, 'Unpaid'),
(9, '2025-10-01', '2025-10-15', 60, 9.50, 'Unpaid'),
(10, '2025-10-01', '2025-10-15', 110, 24.50, 'Paid'),
(1, '2025-11-01', '2025-11-15', 150, 31.50, 'Unpaid');
GO

-- Insert Payments
PRINT 'Inserting Payments...';
INSERT INTO Payments (BillID, CustomerID, PaymentDate, AmountPaid, PaymentMethod, ProcessedBy)
VALUES
(1, 1, '2025-10-05', 17.50, 'Card', 2),
(4, 4, '2025-10-06', 14.00, 'Cash', 2),
(6, 7, '2025-10-07', 195.00, 'Online', 2),
(10, 10, '2025-10-10', 24.50, 'Card', 2),
(1, 1, '2025-09-05', 15.00, 'Card', 2),
(4, 4, '2025-09-06', 12.00, 'Cash', 2),
(6, 7, '2025-09-07', 180.00, 'Online', 2),
(10, 10, '2025-09-10', 20.00, 'Card', 2),
(1, 1, '2025-08-05', 16.00, 'Card', 2),
(4, 4, '2025-08-06', 13.00, 'Cash', 2);
GO


-- Insert Complaints
PRINT 'Inserting Complaints...';
INSERT INTO Complaints (CustomerID, Subject, Description, Status, AssignedTo)
VALUES
(2, 'Billing Error', 'My bill is too high!', 'Open', 1),
(3, 'Low Water Pressure', 'The water pressure has been very low all week.', 'In Progress', 1),
(7, 'Request for new meter', 'We are expanding and need a second meter.', 'Closed', 1);
GO

PRINT '✅ Sample data inserted successfully.';
PRINT ' ';

/*
================================================================
 SECTION 3: ADVANCED SQL OBJECTS
 (FIX: Added GO after each PRINT statement)
================================================================
*/

PRINT '--- 3. Creating Advanced SQL Objects ---';

-- ==== 1. USER DEFINED FUNCTIONS ====
PRINT 'Creating User Defined Functions...';
GO -- <-- FIX 2: Added GO

CREATE FUNCTION fn_CalculateBillAmount (@UtilityType VARCHAR(50), @Consumption INT)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    DECLARE @Amount DECIMAL(10, 2) = 0.00;
    DECLARE @FixedCharge DECIMAL(10, 2);
    DECLARE @Slab1_End INT, @Slab1_Rate DECIMAL(10,4);
    DECLARE @Slab2_End INT, @Slab2_Rate DECIMAL(10,4);
    DECLARE @Slab3_Rate DECIMAL(10,4);

    SELECT 
        @FixedCharge = FixedCharge,
        @Slab1_End = Slab1_EndUnit, @Slab1_Rate = Slab1_Rate,
        @Slab2_End = Slab2_EndUnit, @Slab2_Rate = Slab2_Rate,
        @Slab3_Rate = Slab3_Rate
    FROM Tariffs
    WHERE UtilityType = @UtilityType;

    SET @Amount = @FixedCharge;

    IF @UtilityType = 'Electricity' AND @Consumption > 0
    BEGIN
        IF @Consumption <= @Slab1_End
            SET @Amount = @Amount + (@Consumption * @Slab1_Rate);
        ELSE IF @Consumption <= @Slab2_End
            SET @Amount = @Amount + (@Slab1_End * @Slab1_Rate) + 
                          ((@Consumption - @Slab1_End) * @Slab2_Rate);
        ELSE
            SET @Amount = @Amount + (@Slab1_End * @Slab1_Rate) + 
                          ((@Slab2_End - @Slab1_End) * @Slab2_Rate) +
                          ((@Consumption - @Slab2_End) * @Slab3_Rate);
    END
    ELSE IF @UtilityType IN ('Water', 'Gas')
    BEGIN
        SET @Amount = @Amount + (@Consumption * @Slab1_Rate);
    END

    RETURN @Amount;
END;
GO -- <-- FIX 2: Added GO

CREATE FUNCTION fn_CalculateLateFee (@BillID INT)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    DECLARE @LateFee DECIMAL(10, 2) = 0.00;
    DECLARE @AmountDue DECIMAL(10, 2);
    DECLARE @DueDate DATE;

    SELECT @AmountDue = AmountDue, @DueDate = DueDate
    FROM Bills
    WHERE BillID = @BillID AND Status IN ('Unpaid', 'Overdue');

    IF @DueDate < GETDATE() AND @AmountDue > 0
    BEGIN
        SET @LateFee = @AmountDue * 0.10; -- 10% late fee
    END

    RETURN @LateFee;
END;
GO -- <-- FIX 2: Added GO

-- ==== 2. VIEWS ====
PRINT 'Creating Views...';
GO -- <-- FIX 2: Added GO

CREATE VIEW v_UnpaidBillsSummary AS
SELECT 
    B.BillID, 
    C.CustomerID,
    C.FirstName + ' ' + C.LastName AS CustomerName, 
    B.AmountDue, 
    B.DueDate
FROM Bills B
JOIN Customers C ON B.CustomerID = C.CustomerID
WHERE B.Status IN ('Unpaid', 'Overdue');
GO -- <-- FIX 2: Added GO

CREATE VIEW v_MonthlyRevenue AS
SELECT 
    YEAR(PaymentDate) AS PaymentYear,
    MONTH(PaymentDate) AS PaymentMonth,
    SUM(AmountPaid) AS TotalRevenue
FROM Payments
GROUP BY YEAR(PaymentDate), MONTH(PaymentDate);
GO -- <-- FIX 2: Added GO

-- ==== 3. STORED PROCEDURES ====
PRINT 'Creating Stored Procedures...';
GO -- <-- FIX 2: Added GO

CREATE PROCEDURE sp_ListDefaulters
AS
BEGIN
    -- First, automatically update any old 'Unpaid' bills to 'Overdue'
    UPDATE Bills
    SET Status = 'Overdue'
    WHERE Status = 'Unpaid' AND DueDate < GETDATE();
    
    -- Now, select all defaulters (which includes 'Overdue' bills)
    SELECT 
        C.CustomerID,
        C.FirstName + ' ' + C.LastName AS CustomerName,
        C.Phone,
        C.Email,
        B.BillID,
        B.AmountDue,
        B.DueDate,
        DATEDIFF(day, B.DueDate, GETDATE()) AS DaysOverdue
    FROM Customers C
    JOIN Bills B ON C.CustomerID = B.CustomerID
    WHERE B.Status = 'Overdue';
END;
GO -- <-- FIX 2: Added GO

CREATE PROCEDURE sp_GenerateBillForCustomer
    @MeterID VARCHAR(50),
    @NewReadingValue INT,
    @RecordedBy INT
AS
BEGIN
    DECLARE @CustomerID INT;
    DECLARE @UtilityType VARCHAR(50);
    DECLARE @LastReading INT;
    DECLARE @Consumption INT;
    DECLARE @AmountToBill DECIMAL(10, 2);

    SELECT 
        @CustomerID = CustomerID,
        @UtilityType = UtilityType,
        @LastReading = LastReadingValue
    FROM Meters
    WHERE MeterID = @MeterID;

    -- Insert the new reading (this will fire trg_AfterReadingInsert)
    INSERT INTO MeterReadings (MeterID, ReadingDate, ReadingValue, RecordedBy)
    VALUES (@MeterID, GETDATE(), @NewReadingValue, @RecordedBy);

    SET @Consumption = @NewReadingValue - @LastReading;
    SET @AmountToBill = dbo.fn_CalculateBillAmount(@UtilityType, @Consumption);

    -- Insert the new bill
    INSERT INTO Bills (CustomerID, BillDate, DueDate, Consumption, AmountDue, Status)
    VALUES (@CustomerID, GETDATE(), DATEADD(day, 14, GETDATE()), @Consumption, @AmountToBill, 'Unpaid');

    -- Update the customer's outstanding balance
    UPDATE Customers
    SET OutstandingBalance = OutstandingBalance + @AmountToBill
    WHERE CustomerID = @CustomerID;
END;
GO -- <-- FIX 2: Added GO

-- ==== 4. TRIGGERS ====
PRINT 'Creating Triggers...';
GO -- <-- FIX 2: Added GO

CREATE TRIGGER trg_AfterPaymentInsert
ON Payments
AFTER INSERT
AS
BEGIN
    -- Update the customer's balance
    UPDATE C
    SET C.OutstandingBalance = C.OutstandingBalance - I.AmountPaid
    FROM Customers C
    JOIN inserted I ON C.CustomerID = I.CustomerID;

    -- Also mark the corresponding bill as 'Paid'
    UPDATE B
    SET B.Status = 'Paid'
    FROM Bills B
    JOIN inserted I ON B.BillID = I.BillID;
END;
GO -- <-- FIX 2: Added GO

CREATE TRIGGER trg_AfterReadingInsert
ON MeterReadings
AFTER INSERT
AS
BEGIN
    UPDATE M
    SET 
        M.LastReadingValue = I.ReadingValue,
        M.LastReadingDate = I.ReadingDate
    FROM Meters M
    JOIN inserted I ON M.MeterID = I.MeterID;
END;
GO -- <-- FIX 2: Added GO

PRINT '✅ Advanced SQL Objects created successfully.';
PRINT ' ';
PRINT '*** DATABASE SCRIPT COMPLETE ***';



