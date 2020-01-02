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
router.post('/login', function (req, res, next) {
    console.log(req.body.username, "password:******");
    var loginTime = Date.parse(new Date()) / 1000;
    if ((req.body.username == '0' && req.body.password == '0') || (req.body.username == '1701040120' && req.body.password == 'Ywq1996614')) {
        mysql.query("select last_login_time from user where username=?", [req.body.username], function (err, result1) {
            if (err) {
                console.log("err:" + err.message)
            } else {
                req.session.lastLoginTime = result1[0].last_login_time;
                mysql.query("update user set last_login_time=? where username=?", [loginTime, req.body.username], function (err, result2) {
                    if (err) {
                        console.log("err:" + err.message)
                    } else {
                        switch (req.body.username) {
                            case '0':
                                req.session.isLogin = true;
                                req.session.homeUsername = '管理员';
                                req.session.userAvatar = '/photo/avatar/a.png';
                                req.session.username = '0';
                                break;
                            case '1701040120':
                                req.session.isLogin = true;
                                req.session.homeUsername = '叶威强';
                                req.session.userAvatar = '/photo/avatar/f.png';
                                req.session.username = '1701040120';
                                break;
                            case '1702020052':
                                req.session.isLogin = true;
                                req.session.homeUsername = '刘雨轩';
                                req.session.userAvatar = '/photo/avatar/s.png';
                                req.session.username = '1702020052';
                                break
                        }
                        res.send({
                            ok: true,
                            msg: " 欢迎回来",
                            username: req.session.homeUsername,
                            userAvatar: req.session.userAvatar
                        })
                    }
                })
            }
        })
    } else {
        requessst.post({
            url: 'http://47.98.154.117/doLogin',
            form: {
                username: req.body.username,
                password: req.body.password
            }
        }, function (err, response, body) {
            const user = JSON.parse(body);
            const {
                name, password, success, username
            } = user;
            if (success) {
                console.log('成功');
                mysql.query("select * from user where username = ?", [username], function (err, data) {
                    if (data[0] == undefined) {
                        console.log('无');
                        const time = loginTime;
                        const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
                        const last_login_time = loginTime;
                        const avatar = '/photo/avatar/' + arr[Math.floor(Math.random() * (7))] + '.png';
                        mysql.query("insert into user(username,password,status,time,avatar,name,last_login_time) value(?,?,?,?,?,?,?)", [username, password, 0, time, avatar, name, last_login_time], function (err, data2) {
                            if (err) {
                                console.log(err)
                            } else {
                                if (data2.affectedRows == 1) {
                                    console.log(data2);
                                    req.session.isLogin = true;
                                    req.session.homeUsername = name;
                                    req.session.userAvatar = avatar;
                                    req.session.username = username;
                                    req.session.lastLoginTime = loginTime;
                                    res.send({
                                        ok: true,
                                        msg: " 欢迎回来",
                                        username: req.session.homeUsername,
                                        userAvatar: req.session.userAvatar,
                                        lastLoginTime: req.session.lastLoginTime
                                    })
                                } else {
                                    res.send({
                                        ok: false,
                                        msg: "登录失败！"
                                    })
                                }
                            }
                        })
                    } else {
                        if (data[0].status == '1') {
                            res.send({
                                ok: false,
                                msg: "黑名单用户，请联系管理员！"
                            })
                        } else {
                            console.log("--" + data[0].username + " " + data[0].password + "--");
                            if (err) {
                                return ""
                            } else {
                                if (data[0]) {
                                    if (req.session.isLogin && req.session.homeUsername) {
                                        res.send({
                                            ok: false,
                                            msg: "您已登录！！！"
                                        })
                                    } else {
                                        mysql.query("update user set last_login_time=? where username=?", [loginTime, data[0].username], function (err, result) {
                                            if (err) {
                                                console.log("err:" + err.message)
                                            } else {
                                                req.session.isLogin = true;
                                                req.session.homeUsername = data[0].name;
                                                req.session.userAvatar = data[0].avatar;
                                                req.session.username = data[0].username;
                                                req.session.lastLoginTime = loginTime;
                                                res.send({
                                                    ok: true,
                                                    msg: " 欢迎回来",
                                                    username: req.session.homeUsername,
                                                    userAvatar: req.session.userAvatar,
                                                    lastLoginTime: req.session.lastLoginTime
                                                })
                                            }
                                        })
                                    }
                                } else {
                                    res.send({
                                        ok: false,
                                        msg: "登录失败！"
                                    })
                                }
                            }
                        }
                    }
                })
            } else {
                console.log('失败');
                res.send({
                    ok: false,
                    msg: "登录失败！"
                })
            }
        })
    }
});
router.get('/ajax_logout', function (req, res, next) {
    req.session.isLogin = false;
    req.session.homeUsername = '';
    req.session.userAvatar = '';
    res.send({
        ok: 1,
        msg: '退出成功'
    })
});
router.post('/comment', function (req, res, next) {
    console.log(req.body);
    const {
        commentContent, news_id, user_name
    } = req.body;
    console.log(commentContent + " " + news_id + " " + user_name);
    const time = (Math.round(new Date().getTime()) / 1000);
    if (user_name) {
        mysql.query("select id from user where name = ?", [user_name], function (err, data) {
            if (err) {
                return err
            } else {
                const userID = data[0].id;
                console.log("userID " + userID);
                mysql.query('insert into comment(user_id,news_id,text,time)  value(?,?,?,?)', [userID, news_id, commentContent, time], function (err, data) {
                    if (err) {
                        console.log(err.toString());
                        return ""
                    } else {
                        console.log("执行query");
                        if (data.affectedRows == 1) {
                            res.send({
                                ok: true,
                                msg: '评论成功！'
                            })
                        } else {
                            res.send({
                                ok: false,
                                msg: '评论失败！'
                            })
                        }
                    }
                })
            }
        })
    } else {
        res.send({
            ok: false,
            msg: '请登录后在评论'
        });
        return
    }
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
            mysql.query(`update news set num=${num} where id=${id}`, function (err, data) {
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