//载入mysql数据库模块
const mysql = require("mysql");
const dbconfig = require("../config/database");
const pool = mysql.createPool(dbconfig.mysql);
const moment = require("moment");

module.exports = {
    addCard: function (params, req, res, callback) {
        // console.log(params)
        pool.getConnection(function (err, conn) {
            var sql = "insert into card(stu_no,stu_name,stu_school,lost_location,publish_id,publish_time,contact) values(?,?,?,?,?,?,?)";
            conn.query(sql, params, function (err, result) {
                if (err) {
                    console.log("[INSERT ERROR] - ", err.message);
                    return;
                }
                console.log('-----------------------------------------INSERT SUCCESSFUL---------------------------------------------');
                // console.log("INSERT ID:", result.insertId);
                // console.log("result:", result);
                console.log("学号：" + params[0] + " 姓名：" + params[1] + " 学院：" + params[2] + " 丢失地点：" + params[3] + " 拾卡人ID：" + params[4] + " 发布时间：" + moment(params[5] * 1000).format("YYYY-MM-DD"));
                console.log('-------------------------------------------------------------------------------------------------------\n');
                // callback(err, JSON.stringify(result));
                callback(err, result);
                conn.release()
            })
        })
    },
    getCardList: function (text, school, location, req, res, callback) {
        pool.getConnection(function (err, conn) {
            var sql = "select * from card";
            if (text !== undefined && text !== "") {
                sql += " where stu_no like '%" + text + "%' or stu_name like '%" + text + "%'";
            }
            if (school !== "" && school !== undefined) {
                if (text === undefined || text === "") {
                    sql += " where (";
                } else {
                    sql += " or (";
                }
                school.forEach(function (v, i, a) {    //当前的值，循环遍历的下标，数组的值
                    // console.log(v);
                    // console.log(i);
                    // console.log(a);
                    if (i == a.length - 1) {
                        sql += "stu_school='" + v + "'";
                    } else {
                        sql += "stu_school='" + v + "' or ";
                    }

                });
                sql += ")";
            }
            if (location !== "" && location !== undefined) {
                if ((text === undefined || text === "") && (school === "" || school === undefined)) {
                    sql += " where (";
                } else {
                    sql += " or (";
                }
                location.forEach(function (v, i, a) {    //当前的值，循环遍历的下标，数组的值
                    // console.log(v);
                    // console.log(i);
                    // console.log(a);
                    if (i == a.length - 1) {
                        sql += "lost_location='" + v + "'";
                    } else {
                        sql += "lost_location='" + v + "' or ";
                    }

                });
                sql += ")";
            }
            sql += " order by publish_time desc";
            console.log(sql);
            conn.query(sql, function (err, result) {
                if (err) {
                    console.log("[SELECT ERROR] - ", err.message);
                    return;
                }
                // console.log(result);
                // result = JSON.stringify(result);
                callback(err, result);
                conn.release();
            })

        })
    },
    getDetailCard: function (id, req, res, callback) {
        pool.getConnection(function (err, conn) {
            var sql = "select * from card where id=?";
            conn.query(sql, id, function (err, result) {
                if (err) {
                    console.log("[SELECT ERROR] - ", err.message);
                    return;
                }
                console.log('-----------------------------------------SELECT SUCCESSFUL---------------------------------------------');
                console.log(result)
                console.log("selectCardId:" + id + " No:" + result[0].stu_no + " Name:" + result[0].stu_name);
                console.log('-------------------------------------------------------------------------------------------------------\n');
                // callback(err, JSON.stringify(result));
                data = ' <div class="modal-header" style="border: none;padding: 10px;">\n' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;\n</button>\n' +
                    '</div>\n' +
                    '<div class="modal-body" style="margin:0 25px 10px 25px;padding-top:0;">' +
                    "<h3>学号：" + result[0].stu_no + "</h3>" +
                    "<h3>姓名：" + result[0].stu_name + "</h3>" +
                    "<h3>学院：" + result[0].stu_school + "</h3>" +
                    "<h3>丢失地点：" + result[0].lost_location + "</h3>" +
                    "<h3>联系方式：" + result[0].contact + "</h3>" +
                    "</div>";
                // "<h3>" + "</h3>" +

                callback(err, data);
                conn.release()
            })
        })
    },
    getCenterCardList: function (username, req, res, callback) {
        pool.getConnection(function (err,conn) {
            var sql = "select * from card where publish_id=?";
            conn.query(sql, username, function (err, result) {
                if (err) {
                    console.log("[SELECT ERROR] - ", err.message);
                    return;
                }
                callback(err, result);
                conn.release()
            })
        })
    },
    deleteCard: function (id, req, res, callback) {
        pool.getConnection(function (err, conn) {
            var sql = "delete from card where id=?";
            conn.query(sql, id, function (err, result) {
                if (err) {
                    console.log("[DELETE ERROR] - ", err.message);
                    return;
                }
                console.log('-----------------------DELETE-----------------------');
                console.log('delete id:' + id + ' ------ DELETE affectedRows', result.affectedRows);
                console.log('----------------------------------------------------\n\n');
                callback(err, result);
                conn.release();
            })
        })
    }

};