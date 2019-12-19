// 导入express
const express = require("express");

const cardModel = require("../dao/cardDao");

// 导入fs文件处理模块
const fs = require("fs");

// 实例化
const router = express.Router();

const moment = require("moment");

// 导入数据库模块
const mysql = require("../config/db.js");

// 导入分页方法
// const page = require("../common/page");


//个人中心-个人信息
router.get('/person_info', function (req, res, next) {
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    // 获取到的是一个buffer流，需要转换成json对象
    const webConfig = JSON.parse(webConfigData.toString());

    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
        var loginUser = req.session.homeUsername;//获取用户名
        var username = req.session.username;//获取学号
        var userAvatar = req.session.userAvatar;//获取用户头像
        var lastLoginTime = moment(req.session.lastLoginTime * 1000).format("YYYY-MM-DD HH:mm:ss")
    }

    res.render("center/person_info.html", {
        webConfig: webConfig,
        loginUser: loginUser,
        userAvatar: userAvatar,
        username: username,
        lastLoginTime: lastLoginTime
    });

});

//个人中心-校卡管理
router.get('/card_management', function (req, res, next) {
    // 第一步：获取页面,URL上的数据，如果URL上有p并带了数据，取得该p的数值，否则取1
    let p = req.query.p ? req.query.p : 1;
    // console.log(req.query)
    // 搜索
    let search = req.query.search ? req.query.search : "";
    // console.log(p);
    // 第二步：默认每页展示数据个数
    let size = 1;
    // 第二步：计算页码开始的位置
    let start = (p - 1) * size;
    // 第三步：统计数据库中数据总条数
    mysql.query("select count(*) tot from card where publish_id=?", [req.session.username],
        function (err, data) {
            if (err) {
                console.log("[SELECT ERROR] - ", err.message);
                return '';
            } else {
                // console.log(data);
                let tot = data[0].tot; //获取数据条数
                mysql.query("select * from card where publish_id = ? order by publish_time desc",
                    [req.session.username], function (err, data) {
                        if (err) {
                            console.log("[SELECT ERROR] - ", err.message);
                            return '';
                        } else {
                            // 格式话时间戳
                            data.forEach(item => {
                                item.publish_time = moment(item.publish_time * 1000).format("YYYY-MM-DD");
                            });
                            // 加载新闻管理首页
                            console.log(data)
                            res.render("center/card_management.html", {data: data});
                        }
                    });

            }


        });
});




module.exports = router;