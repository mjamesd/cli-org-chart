// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Author: Mark Drummond
// Date: 09-Dec-2021
// Project Title: CLI Organization Chart
// Assignment: employee-tracker
// See README.md for more information
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootrootroot',
        database: 'org_chart_db'
    },
    console.log(`Connected to the org_chart_db database.`)
);

module.exports = connection;