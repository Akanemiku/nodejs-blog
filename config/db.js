const mysql = require("mysql");
let connect = mysql.createConnection({
    host: "47.100.93.218",
    user: "akane",
    password: "6458",
    database: "bnuzblog",
    port: "3306",
    useConnectionPooling: true
});
connect.connect();
module.exports = connect;