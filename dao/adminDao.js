let express = require("express");
let router = express.Router();
let crypto = require('crypto');
let mysql = require("../config/db.js");
router.use(function(req, res, next) {
    if (req.url != "/login" && req.url != "/check") {
        if (req.session.HsmMessageIsAdmin && req.session.HsmMessageUsername) {
            next()
        } else {
            res.send("<script>alert('请登录');location.href = '/admin/login';</script>")
        }
    } else {
        next()
    }
});
router.get("/login", function(req, res, next) {
    res.render("admin/login.html")
});
router.post("/check", function(req, res, next) {
    console.log(req.body);
    console.log(req.session);
    let {
        username, password
    } = req.body;
    if (username) {
        if (password) {
            console.log(username + " " + password);
            let md5 = crypto.createHash('md5');
            password = md5.update(password).digest('hex');
            mysql.query("select * from admin where username = ? and password = ?", [username, password], function(err, data) {
                console.log("--" + data[0].username + " " + data[0].password + "--");
                if (err) {
                    return ""
                } else {
                    if (data[0]) {
                        if (data[0].status == '0001') {
                            res.send("<script>alert('黑名单用户,请联系管理员！');location.href = '/admin/login';</script>")
                        } else {
                            if (data[0].username == username && data[0].password == password) {
                                req.session.HsmMessageIsAdmin = true;
                                req.session.HsmMessageUsername = data[0].username;
                                res.send("<script>location.href = '/admin';</script>")
                            } else {
                                res.send("<script>alert('登录失败');location.href = '/admin/login';</script>")
                            }
                        }
                    } else {
                        res.send("<script>alert('登录失败');location.href = '/admin/login';</script>")
                    }
                }
            })
        } else {
            res.send("<script>alert('请登录');location.href = '/admin/login';</script>")
        }
    } else {
        res.send("<script>alert('请登录');location.href = '/admin/login';</script>")
    }
});
router.get("/logout", function(req, res, next) {
    req.session.HsmMessageIsAdmin = false;
    req.session.HsmMessageUsername = "";
    res.send("<script>alert('退出成功');location.href = '/admin';</script>")
});
router.get("/", function(req, res, next) {
    res.render("admin/index")
});
router.get("/welcome", function(req, res, next) {
    res.render("admin/welcome")
});
let adminRouter = require('./admin/admin');
router.use('/admin', adminRouter);
let userRouter = require('./admin/user');
router.use('/user', userRouter);
let sliderRouter = require('./admin/slider');
router.use('/slider', sliderRouter);
let typeRouter = require("./admin/newstype");
router.use('/newstype', typeRouter);
let newsRouter = require("./admin/news.js");
router.use('/news', newsRouter);
let commentRouter = require("./admin/comment.js");
router.use('/comment', commentRouter);
let systemRouter = require('./admin/system');
router.use('/system', systemRouter);
let cardRouter = require("./admin/card.js");
router.use("/card", cardRouter);
module.exports = router;