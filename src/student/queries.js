// Queries for GET
const getBook = 'SELECT * FROM "Book"';
const getBookbyID = 'SELECT * FROM "Book" WHERE "BookNumber" = $1';
const getCustomer = 'SELECT * FROM "Customer"';
const getCustomerbyID = 'SELECT * FROM "Customer" WHERE "CustomerNumber" = $1';

// Queries for POST
const addBook = 'INSERT INTO "Book" ("BookNumber", "BookTitle", "PublicationYear", "Pages", "PubID") VALUES ($1, $2, $3, $4, $5)';
const addCustomer = 'INSERT INTO "Customer" ("CustomerNumber", "CustomerName", "Street", "City", "State", "Country") VALUES ($1, $2, $3, $4, $5, $6)';
const addStocks = 'INSERT INTO "Stocks" ("InvtID", "BkID", "BookStock") VALUES ($1, $2, $3)';

// Queries for DELETE
const removeBook = 'DELETE FROM "Book" WHERE "BookNumber" = $1';
const removeCustomer = 'DELETE FROM "Customer" WHERE "CustomerNumber" = $1';
const removeStock = 'DELETE FROM "Stocks" WHERE "BkID" = $1';

// Queries for DELETE
const updateBook = 'UPDATE "Book" SET "PublicationYear" = $1 WHERE "PublicationYear" = $2';
const updateCustomer = 'UPDATE "Customer" SET "Street" = $1, "City" = $2, "State" = $3, "Country" = $4 WHERE "CustomerNumber" = $5';

// etc
const checkBookNumberExists = 'SELECT b FROM "Book" b WHERE b."BookNumber" = $1';
const checkCustomerNumberExists = 'SELECT c FROM "Customer" c WHERE c."CustomerNumber" = $1';
const joinTable = 'SELECT b."BookNumber", b."BookTitle", b."PublicationYear", b."Pages", s."BookStock" FROM "Book" b LEFT JOIN "Stocks" s ON b."BookNumber" = s."BkID"';

module.exports = {
    getBook,
    getBookbyID,
    getCustomer,
    getCustomerbyID,
    checkBookNumberExists,
    checkCustomerNumberExists,
    addBook,
    addCustomer,
    addStocks,
    removeBook,
    removeCustomer,
    removeStock,
    updateBook,
    updateCustomer,
    joinTable,
};