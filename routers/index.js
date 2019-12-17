// 前台路由文件

// 导入express

const express = require("express");

// 实例化路由类

const router = express.Router();

// 导入fs文件处理模块
const fs = require("fs");

// 导入数据库模块
const mysql = require("../config/db.js");

// 导入moment模块，初始化时间
const moment = require('moment');

//载入MD5密码加密模块
const crypto = require('crypto');

//设置文件上传
const multer = require("multer");

// 设置存放文件的临时目录
const upload = multer({dest: "tmp/"});
// 引入path模块获取文件名后缀
const path = require('path');
// 引入图片上传方法
// const myuploads = require("../common/myuploads");


router.get('/publishcard',function (req, res, next){
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    // 获取到的是一个buffer流，需要转换成json对象
    const webConfig = JSON.parse(webConfigData.toString());

    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
        var loginUser = req.session.homeUsername;//获取用户名
        var userAvatar = req.session.userAvatar;//获取用户头像
    }
    res.render("card/publishcard.html",{
        webConfig: webConfig,
        loginUser: loginUser,
        userAvatar: userAvatar
    });
});

router.get('/findcard',function (req, res, next){
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    // 获取到的是一个buffer流，需要转换成json对象
    const webConfig = JSON.parse(webConfigData.toString());

    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
        var loginUser = req.session.homeUsername;//获取用户名
        var userAvatar = req.session.userAvatar;//获取用户头像
    }
    res.render("card/findcard.html",{
        webConfig: webConfig,
        loginUser: loginUser,
        userAvatar: userAvatar
    });
});



// 前台首页
router.get('/', function (req, res, next) {
    // console.log(req.session);
    // 读取网站配置相关文件
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    // 获取到的是一个buffer流，需要转换成json对象
    const webConfig = JSON.parse(webConfigData.toString());
    // 读取分类信息
    mysql.query("select * from newstype order by sort desc", function (err, data) {
        if (err) {
            return "";
        } else {
            // 读取轮播图信息
            mysql.query("select * from banner order by sort desc", function (err, data2) {
                if (err) {
                    return "";
                } else {
                    // 查询最新发布的文章
                    mysql.query("select news.*,newstype.name as tname from news inner join newstype on news.cid = newstype.id order by news.id desc", function (err, data3) {
                        if (err) {
                            return ""
                        } else {
                            data3.forEach(item => {
                                item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss");
                            })
                            // 处理热门文章
                            mysql.query("select * from news order by num desc limit 5", function (err, data4) {
                                if (err) {
                                    return ""
                                } else {

                                    data4.forEach(item => {
                                        item.time = moment(item.time * 1000).format("YYYY-MM-DD ");
                                    })
                                    if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
                                        var loginUser = req.session.homeUsername;//获取用户名
                                        var userAvatar = req.session.userAvatar;//获取用户头像
                                    }
                                    // 加载首页
                                    res.render("home/index.html", {
                                        webConfig: webConfig,
                                        typeData: data,
                                        sliderData: data2,
                                        newsData: data3,
                                        hotData: data4,
                                        loginUser: loginUser,
                                        userAvatar: userAvatar
                                    });
                                }
                            });

                        }
                    });

                }
            });

        }
    });


});


// 前台新闻详情页

router.get('/news', function (req, res, next) {
    // 获取地址栏带的数据
    const id = req.query.id;
    // 读取网站配置相关文件
    const webConfigData = fs.readFileSync(__dirname + "/../config/webConfig.json");
    // 获取到的是一个buffer流，需要转换成json对象
    const webConfig = JSON.parse(webConfigData.toString());

    //加载分类数据
    mysql.query("select * from newstype order by sort desc", function (err, data) {
        if (err) {
            return "";
        } else {
            // 查询对应文章的数据
            mysql.query("select news.* ,newstype.name as tname,newstype.id as tid from news,newstype where news.cid = newstype.id and news.id=" + id, function (err, data2) {
                if (err) {
                    return "";
                } else {
                    data2.forEach(item => {
                        item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss");
                    })
                    // 查询评论信息
                    mysql.query("select user.username,user.avatar,comment.* from comment,user where comment.user_id = user.id and comment.news_id = ? order by comment.id desc", [id], function (err, data3) {
                        if (err) {
                            return "";
                        } else {
                            data3.forEach(item => {
                                item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss");
                            })
                            // 热门文章展示
                            mysql.query("select * from news order by num desc limit 5", function (err, data4) {
                                if (err) {
                                    return "";
                                } else {
                                    data4.forEach(item => {
                                        item.time = moment(item.time * 1000).format("YYYY-MM-DD ");
                                    })
                                    mysql.query("select news.id,news.title,newstype.id as tid from news,newstype where news.cid = newstype.id order by news.time desc ", function (err, data5) {
                                        if (err) {
                                            return "";
                                        } else {
                                            if (req.session.isLogin && req.session.homeUsername && req.session.userAvatar) {
                                                var loginUser = req.session.homeUsername;
                                                var userAvatar = req.session.userAvatar;
                                            }
                                            // 加载首页
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
                                            });
                                        }
                                    });

                                }
                            })

                        }
                    });

                }
            })

        }
    });

});

// 前台登录处理操作
router.post('/login', function (req, res, next) {
    // 接收传入的数据
    let {username, password} = req.body;
    //判断用户是否输入
    if (username) {
        if (password) {
            console.log(username+" "+password);
            // 对密码进行MD5加密
            // const md5 = crypto.createHash('md5');
            // password = md5.update(password).digest('hex');

            // 判断数据库中是否存在该用户
            mysql.query("select * from user where username = ? and password = ?", [username, password], function (err, data) {
                console.log("--"+data[0].username+" "+data[0].password+"--");
                if (err) {
                    return "";
                } else {
                    console.log(data);
                    if (data[0]) {
                        if (data[0].username == username && data[0].password == password) {
                            // 判断该用户是否已经登录
                            if (req.session.isLogin && req.session.homeUsername) {
                                res.send({ok: false, msg: "您已登录！！！"});
                            } else {
                                req.session.isLogin = true;
                                req.session.homeUsername = data[0].username;
                                req.session.userAvatar = data[0].avatar
                                res.send({
                                    ok: true,
                                    msg: " 欢迎回来",
                                    username: req.session.homeUsername,
                                    userAvatar: req.session.userAvatar
                                });
                            }

                        } else {
                            res.send({ok: false, msg: "登录失败！"});
                        }

                    } else {
                        res.send({ok: false, msg: "登录失败！"});
                    }

                }
            });

        } else {
            res.send("<script>alert('登录失败！');location.href = '/';</script>");
        }
    } else {
        res.send("<script>alert('登录失败！');location.href = '/';</script>");
    }
});
// ajax前台登录退出操作
router.get('/ajax_logout', function (req, res, next) {
    req.session.isLogin = false;
    req.session.homeUsername = '';
    req.session.userAvatar = '';
    res.send({ok: 1, msg: '退出成功'});
});

// 用户评论操作
router.post('/comment', function (req, res, next) {
    // 获取评论内容、评论文章、评论用户
    const {commentContent, news_id, user_name} = req.body;
    console.log(commentContent+" "+news_id+" "+user_name);
    // 查询当前时间戳
    const time = (Math.round(new Date().getTime()) / 1000);//秒时间戳，需要转换成毫秒
    if (user_name) {
        // 查询数据库用户对应ID
        mysql.query("select id from user where username = ?", [user_name], function (err, data) {
            if (err) {
                // res.send({ok:true,msg:'数据库查询错误'});
                return err;
            } else {
                const userID = data[0].id;
                console.log("userID "+userID);
                // 把用户评论插入数据库
                mysql.query('insert into comment(user_id,news_id,text,time)  value(?,?,?,?)', [userID, news_id, commentContent, time], function (err, data) {
                    if (err) {
                        console.log(err.toString());
                        return "";
                    } else {
                        console.log("执行query");
                        if (data.affectedRows == 1) {
                            res.send({ok: true, msg: '评论成功！'});
                        } else {
                            res.send({ok: false, msg: '评论失败！'});
                        }
                    }
                });

            }
        });
    } else {
        res.send({ok: false, msg: '请登录后在评论'});
        return;
    }

});

// ajax获取用户评论操作
// router.get('/news/ajax_zan', function (req, res, next) {
//     console.log(req.query);
// })

// ajax_num文章阅读量
router.get('/ajax_num', function (req, res, next) {
    // 获取参数
    const id = req.query.id;
    console.log(id);
    // 执行数据库查找操作
    mysql.query("select num from news where id = " + id, function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            const num = data[0].num + 1;
            // 执行数据库更新操作
            mysql.query(`update news set num = ${num} where id = ${id}`, function (err, data) {
                if (err) {
                    console.log(err);
                    return "";
                } else {
                    if (data.affectedRows == 1) {
                        res.send('ok:1');
                    } else {
                        res.send('ok:0');
                    }
                }
            });
        }
    });
})

router.post('/uploadup', upload.single('logo'), function (req, res, next) {
    const imgRes = req.file;
    console.log(imgRes);
});


module.exports = router;