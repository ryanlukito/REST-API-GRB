const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "GRD_DB",
    port: 5432,
});

module.exports = pool;
