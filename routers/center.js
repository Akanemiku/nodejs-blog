const express = require("express");
const cardModel = require("../dao/cardDao");
const fs = require("fs");
const router = express.Router();
const moment = require("moment");
const mysql = require("../config/db.js");
router.get('/person_info', function (req, res, next) {
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    const webConfig = JSON.parse(webConfigData.toString());
    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
        var loginUser = req.session.homeUsername;
        var username = req.session.username;
        var userAvatar = req.session.userAvatar;
        var lastLoginTime = moment(req.session.lastLoginTime * 1000).format("YYYY-MM-DD HH:mm:ss")
    }
    res.render("center/person_info.html", {
        webConfig: webConfig,
        loginUser: loginUser,
        userAvatar: userAvatar,
        username: username,
        lastLoginTime: lastLoginTime
    })
});
router.get('/card_management', function (req, res, next) {
    let p = req.query.p ? req.query.p : 1;
    let search = req.query.search ? req.query.search : "";
    let size = 1;
    let start = (p - 1) * size;
    mysql.query("select count(*) tot from card where publish_id=?", [req.session.username], function (err, data) {
        if (err) {
            console.log("[SELECT ERROR] - ", err.message);
            return ''
        } else {
            let tot = data[0].tot;
            mysql.query("select * from card where publish_id = ? order by publish_time desc", [req.session.username], function (err, data) {
                if (err) {
                    console.log("[SELECT ERROR] - ", err.message);
                    return ''
                } else {
                    data.forEach(item => {
                        item.publish_time = moment(item.publish_time * 1000).format("YYYY-MM-DD")
                    });
                    console.log(data);
                    res.render("center/card_management.html", {
                        data: data
                    })
                }
            })
        }
    })
});
module.exports = router;