const express = require("express");
const requessst = require('request');
const router = express.Router();
const fs = require("fs");
const mysql = require("../config/db.js");
const moment = require('moment');
const crypto = require('crypto');
const cardModel = require("../dao/cardDao");
const multer = require("multer");
const upload = multer({
    dest: "tmp/"
});
const path = require('path');
router.get('/publishcard', function (req, res, next) {
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    const webConfig = JSON.parse(webConfigData.toString());
    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
        var loginUser = req.session.homeUsername;
        var userAvatar = req.session.userAvatar
    }
    res.render("card/publishcard.html", {
        webConfig: webConfig,
        loginUser: loginUser,
        userAvatar: userAvatar
    })
});
router.get('/findcard', function (req, res, next) {
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    const webConfig = JSON.parse(webConfigData.toString());
    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
        var loginUser = req.session.homeUsername;
        var userAvatar = req.session.userAvatar
    }
    res.render("card/findcard.html", {
        webConfig: webConfig,
        loginUser: loginUser,
        userAvatar: userAvatar
    })
});
router.get('/center', function (req, res, next) {
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    const webConfig = JSON.parse(webConfigData.toString());
    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
        var loginUser = req.session.homeUsername;
        var username = req.session.username;
        var userAvatar = req.session.userAvatar;
        var lastLoginTime = moment(req.session.lastLoginTime * 1000).format("YYYY-MM-DD HH:mm:ss")
    }
    res.render("center/center.html", {
        webConfig: webConfig,
        loginUser: loginUser,
        userAvatar: userAvatar,
        username: username,
        lastLoginTime: lastLoginTime
    })
});
router.post("/deleteCardById", function (req, res) {
    var id = req.body.id;
    cardModel.deleteCard(id, req, res, function (err, result) {
        if (result.affectedRows > 0) {
            res.end(JSON.stringify({
                success: true
            }))
        } else {
            res.end(JSON.stringify({
                success: false
            }))
        }
    })
});
router.get('/', function (req, res, next) {
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    const webConfig = JSON.parse(webConfigData.toString());
    mysql.query("select * from newstype order by sort desc", function (err, data) {
        if (err) {
            return ""
        } else {
            mysql.query("select * from banner order by sort desc", function (err, data2) {
                if (err) {
                    return ""
                } else {
                    mysql.query("select news.*,newstype.name as tname from news inner join newstype on news.cid = newstype.id order by news.id desc", function (err, data3) {
                        if (err) {
                            return ""
                        } else {
                            data3.forEach(item => {
                                item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss")
                            })
                            mysql.query("select * from news order by num desc limit 3", function (err, data4) {
                                if (err) {
                                    return ""
                                } else {
                                    data4.forEach(item => {
                                        item.time = moment(item.time * 1000).format("YYYY-MM-DD ")
                                    });
                                    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
                                        var loginUser = req.session.homeUsername;
                                        var userAvatar = req.session.userAvatar
                                    }
                                    res.render("home/index.html", {
                                        webConfig: webConfig,
                                        typeData: data,
                                        sliderData: data2,
                                        newsData: data3,
                                        hotData: data4,
                                        loginUser: loginUser,
                                        userAvatar: userAvatar
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});
router.get('/news', function (req, res, next) {
    const id = req.query.id;
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    const webConfig = JSON.parse(webConfigData.toString());
    mysql.query("select * from newstype order by sort desc", function (err, data) {
        if (err) {
            return ""
        } else {
            mysql.query("select news.* ,newstype.name as tname,newstype.id as tid from news,newstype where news.cid = newstype.id and news.id=" + id, function (err, data2) {
                if (err) {
                    return ""
                } else {
                    data2.forEach(item => {
                        item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss")
                    });
                    mysql.query("select user.username,user.avatar,comment.* from comment,user where comment.user_id = user.id and comment.news_id = ? order by comment.id desc", [id], function (err, data3) {
                        if (err) {
                            return ""
                        } else {
                            data3.forEach(item => {
                                item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss")
                            });
                            mysql.query("select * from news order by num desc limit 3", function (err, data4) {
                                if (err) {
                                    return ""
                                } else {
                                    data4.forEach(item => {
                                        item.time = moment(item.time * 1000).format("YYYY-MM-DD ")
                                    });
                                    mysql.query("select news.id,news.title,newstype.id as tid from news,newstype where news.cid = newstype.id order by news.time desc ", function (err, data5) {
                                        if (err) {
                                            return ""
                                        } else {
                                            if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
                                                var loginUser = req.session.homeUsername;
                                                var userAvatar = req.session.userAvatar
                                            }
                                            res.render("home/news.html", {
                                                webConfig: webConfig,
                                                typeData: data,
                                                newsData: data2[0],
                                                commentData: data3,
                                                newsDatanum: data3.length,
                                                hotData: data4,
                                                relaData: data5,
                                                loginUser: loginUser,
                                                userAvatar: userAvatar,
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

router.get('/ajax_num', function (req, res, next) {
    const id = req.query.id;
    console.log(id);
    mysql.query("select num from news where id = " + id, function (err, data) {
        if (err) {
            console.log(err);
            return ""
        } else {
            const num = data[0].num + 1;
            mysql.query(`update news set num=${num}where id=${id}`, function (err, data) {
                if (err) {
                    console.log(err);
                    return ""
                } else {
                    if (data.affectedRows == 1) {
                        res.send('ok:1')
                    } else {
                        res.send('ok:0')
                    }
                }
            })
        }
    })
})
router.post('/uploadup', upload.single('logo'), function (req, res, next) {
    const imgRes = req.file;
    console.log(imgRes)
});
module.exports = router;