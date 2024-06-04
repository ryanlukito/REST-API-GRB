const pool = require('../../db');
const queries = require('./queries');

// GET All Books
const getBook = (req, res) => {
    pool.query(queries.getBook, (error, result) => {
        if (error) throw error;
        res.status(200).json(result.rows);
    });
};

// GET All Customers
const getCustomer = (req, res) => {
    pool.query(queries.getCustomer, (error, result) => {
        if (error) throw error;
        res.status(200).json(result.rows);
    });
};

// GET Book by ID
const getBookbyID = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getBookbyID, [id], (error, result) => {
        if (error) throw error;
        res.status(200).json(result.rows);
    });
};

// GET Customer by ID
const getCustomerbyID = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getCustomerbyID, [id], (error, result) => {
        if (error) throw error;
        res.status(200).json(result.rows);
    });
};


// POST Book
const addBook = (req, res) => {
    const {BookNumber, BookTitle, PublicationYear, Pages, PubID} = req.body;
    pool.query(queries.checkBookNumberExists, [BookNumber], (error, result) => {
        if (result.rows.length) {
            res.send("Book Number already exists.");
        }
    
        pool.query(queries.addBook, [BookNumber, BookTitle, PublicationYear, Pages, PubID], (error, result) => {
            if (error) throw error;
            res.status(200).send("Book added successfully");
        })
    });
};

// POST Customer
const addCustomer = (req, res) => {
    const {CustomerNumber, CustomerName, Street, City, State, Country} = req.body;
    pool.query(queries.checkCustomerNumberExists, [CustomerNumber], (error, result) => {
        if (result.rows.length) {
            res.send("Customer Number already exists.");
        }
    
        pool.query(queries.addCustomer, [CustomerNumber, CustomerName, Street, City, State, Country], (error, result) => {
            if (error) throw error;
            res.status(200).send("Customer added successfully");
        })
    });
};

// Remove Book by ID
const removeBook = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.removeBook, [id], (error, result) => {
        const noBookFound = !result.rows.length;
        if (noBookFound) {
            res.send("Book does not exist in the database.");
        }

        pool.query(queries.removeBook, [id], (error, result) => {
            if (error) throw error;
            res.status(200).send("Book removed successsfully");
        })
    });
};

// Remove Customer by ID
const removeCustomer = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.removeCustomer, [id], (error, result) => {
        const noCustomerFound = result.rows.length;
        if (!noCustomerFound) {
            res.send("Customer does not exist in the database.");
        }

        pool.query(queries.removeCustomer, [id], (error, result) => {
            if (error) throw error;
            res.status(200).send("Customer removed successsfully");
        })
    });
};


// Update Book by ID
const updateBook = (req,res) => {
    const id = parseInt(req.params.id);
    const {PublicationYear} = req.body;

    pool.query(queries.getBookbyID, [id], (error, result) => {
        const noBookFound = !result.rows.length;
        if (noBookFound) {
            res.send("Book does not exist in the database.");
        }

        pool.query(queries.updateBook, [PublicationYear, id], (error, result) => {
            if (error) throw error;
            res.status(200).send("Book updated successfully");
        });
    });
};

// Update Customer by ID
const updateCustomer = (req,res) => {
    const id = parseInt(req.params.id);
    const {Street, City, State, Country} = req.body;

    pool.query(queries.getCustomerbyID, [id], (error, result) => {
        const noCustomerFound = !result.rows.length;
        if (noCustomerFound) {
            res.send("Customer does not exist in the database.");
        }

        pool.query(queries.updateCustomer, [Street, City, State, Country, id], (error, result) => {
            if (error) throw error;
            res.status(200).send("Customer updated successfully");
        });
    });
};

// SQL Query Builder Based on User Input
const dynamicSQL = (req, res) => {
    const {filter, sort} = req.body;
    let sqlQuery = 'SELECT * FROM "Book" ';
    let queryVals = [];
    let conditions = [];

    if (filter) {
        for(const [field, value] of Object.entries(filter)) {
            if (typeof value === "object" && value !== null) {
                for (const [operator, conditionValue] of Object.entries(value)) {
                    const paramIndex = queryVals.length + 1;
                    switch(operator) {
                        case 'start-year':
                            conditions.push(`"${field}" >= $${paramIndex}`);
                            queryVals.push(conditionValue);
                            break;
                        case 'end-year':
                            conditions.push(`"${field}" <= $${paramIndex} `);
                            queryVals.push(conditionValue);
                            break;
                    }
                }
            } else {
                const paramIndex = queryVals.length + 1;
                conditions.push(`"${field}" = $${paramIndex}`);
                queryVals.push(value);
            }
        }
    }

    // WHERE condition
    if (conditions.length > 0) {
        sqlQuery += `WHERE ${conditions.join(" AND ")}`;
    }

    // SORT (if necessary)
    if (sort) {
        sqlQuery += `ORDER BY "${sort.column}" ${sort.orientation}`;
    }

    pool.query(sqlQuery, queryVals, (error, result) => {
        // console.log(sqlQuery);
        if (error) throw error;
        res.status(200).json(result.rows);
    });
}

const tclPost = async(req, res) => {
    try{
        await pool.query('BEGIN');
        const {BookNumber, BookTitle, PublicationYear, Pages, PubID, InvtID, BookStock} = req.body;

        //INSERT Book Operation
        const insertBook = queries.addBook;
        const insertValsBook = [BookNumber, BookTitle, PublicationYear, Pages, PubID];
        await pool.query(insertBook, insertValsBook);

        //INSERT Stocks Operation
        const insertStocks = queries.addStocks;
        const insertValsStocks = [InvtID, BookNumber, BookStock];
        await pool.query(insertStocks, insertValsStocks);

        // Make Sure That The Transaction Complete
        await pool.query('COMMIT');

        //GET Operation
        // const showBook = queries.getBook;
        const result = await pool.query(queries.joinTable);

        console.log('Transaction Success!');
        res.status(200).send(result.rows); 
    } catch(error) {
        pool.query('ROLLBACK');
        console.error(`Transaction Failed: ${error}`);
        res.status(500).send('Transaction Failed');
    }
}

const tclDelete = async(req, res) => {
    try{
        await pool.query('BEGIN');
        const BookID = parseInt(req.params.id);

        //DELETE Stocks Operation
        const deleteStocks = queries.removeStock;
        const deleteValsStocks = [BookID];
        await pool.query(deleteStocks, deleteValsStocks);
        
        //DELETE Book Operation
        const deleteBook = queries.removeBook;
        const deleteValsBook = [BookID];
        await pool.query(deleteBook, deleteValsBook);

        // Make Sure That The Transaction Complete
        await pool.query('COMMIT');

        //GET Operation
        // const showBook = queries.getBook;
        const result = await pool.query(queries.joinTable);

        console.log('Transaction Success!');
        res.status(200).send(result.rows); 
    } catch(error) {
        pool.query('ROLLBACK');
        console.error(`Transaction Failed: ${error}`);
        res.status(500).send('Transaction Failed');
    }
}

module.exports = {
    getBook,
    getBookbyID,
    getCustomer,
    getCustomerbyID,
    addBook,
    addCustomer,
    removeBook,
    removeCustomer,
    updateBook,
    updateCustomer,
    dynamicSQL,
    tclPost,
    tclDelete,
};