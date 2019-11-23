// 导入数据库模块

const mysql = require("mysql");

// 设置数据库连接属性

let connect = mysql.createConnection({
    host:"47.100.93.218",
    user:"akane",
    password:"6458",
    database:"newblog",
    port: "3306"
    

});

// 开始连接数据库
connect.connect();

// 抛出模块

module.exports = connect;

