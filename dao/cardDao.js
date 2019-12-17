//载入mysql数据库模块
const mysql = require("mysql");
const dbconfig = require("../config/database");
const pool = mysql.createPool(dbconfig.mysql);
const moment = require("moment");

module.exports = {
    addCard: function (params, req, res, callback) {
        console.log(params)
        pool.getConnection(function (err, conn) {
            var sql = "insert into card(stu_no,stu_name,stu_school,lost_location,publish_id,publish_time) values(?,?,?,?,?,?)";
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
                    sql += " and (";
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
                    sql += " and (";
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
                console.log("selectCardId:" + id + " No:" + result.stu_no + " Name:" + result.stu_name);
                console.log('-------------------------------------------------------------------------------------------------------\n');
                // callback(err, JSON.stringify(result));
                callback(err, result);
                conn.release()
            })
        })
    },
};