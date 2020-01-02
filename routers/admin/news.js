const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
    dest: "tmp/"
});
const mysql = require("../../config/db.js");
const uploads = require("../../common/uploads");
const moment = require("moment");
const page = require("../../common/page");
const fs = require("fs");
router.get("/", function (req, res, next) {
    let p = req.query.p ? req.query.p : 1;
    let search = req.query.search ? req.query.search : "";
    let size = 3;
    let start = (p - 1) * size;
    mysql.query("select count(*) tot from news,newstype type where news.cid = type.id and title like ? ", ['%' + search + '%'], function (err, data) {
        if (err) {
            return ''
        } else {
            let tot = data[0].tot;
            let fpage = page(tot, p, size);
            mysql.query("select news.*,type.name tname from news,newstype type where news.cid = type.id and title like ? order by news.id desc limit ?,?", [`%${search}%`, fpage.start, fpage.size], function (err, data) {
                if (err) {
                    return ""
                } else {
                    data.forEach(item => {
                        item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss")
                    })
                    res.render("admin/news/index.html", {
                        data: data,
                        search: search,
                        show: fpage.show
                    })
                }
            })
        }
    })
});
router.get("/add", function (req, res, next) {
    mysql.query("select * from newstype order by sort desc", function (err, data) {
        if (err) {
            return ""
        } else {
            res.render("admin/news/add.html", {
                data: data
            })
        }
    })
});
router.post("/add", upload.single("img"), function (req, res, next) {
    let imgRes = req.file;
    let {
        title, keywords, description, info, author, cid, text
    } = req.body;
    let num = 0;
    let time = (Math.round(new Date().getTime()) / 1000);
    let img = uploads(imgRes, "news");
    mysql.query("insert into news(title,keywords,description,info,author,cid,text,num,time,img) value(?,?,?,?,?,?,?,?,?,?)", [title, keywords, description, info, author, cid, text, num, time, img], function (err, data) {
        if (err) {
            return ""
        } else {
            if (data.affectedRows == 1) {
                res.send("<script>alert('添加成功');location.href = '/admin/news'</script>")
            } else {
                res.send("<script>alert('添加失败');history.go(-1)</script>")
            }
        }
    })
});
router.get("/edit", function (req, res, next) {
    let id = req.query.id;
    mysql.query("select * from newstype order by sort desc", function (err, data) {
        if (err) {
            return ""
        } else {
            mysql.query("select * from news where id = " + id, function (err, data2) {
                if (err) {
                    return ""
                } else {
                    res.render("admin/news/edit.html", {
                        data: data,
                        newDate: data2[0]
                    })
                }
            })
        }
    })
});
router.post("/edit", upload.single("img"), function (req, res, next) {
    let imgRes = req.file;
    let {
        id, cid, text, oldimg, author, info, description, keywords, title
    } = req.body;
    let img = oldimg;
    if (imgRes) {
        img = uploads(imgRes, "news")
    }
    mysql.query("update news set cid = ? , text = ? , author= ? , info= ? , description= ? , keywords= ?, title= ? , img = ? where id = ?", [cid, text, author, info, description, keywords, title, img, id], function (err, data) {
        if (err) {
            return ""
        } else {
            if (data.affectedRows == 1) {
                if (imgRes) {
                    if (fs.existsSync(__dirname + "/../../" + oldimg)) {
                        fs.unlinkSync(__dirname + "/../../" + oldimg)
                    }
                }
                res.send("<script>alert('修改成功');location.href = '/admin/news'</script>")
            } else {
                res.send("<script>alert('修改失败');history.go(-1)</script>")
            }
        }
    })
});
router.get("/ajax_del", function (req, res, next) {
    let {
        id, img
    } = req.query;
    mysql.query("delete from news where id =" + id, function (err, data) {
        if (err) {
            console.log(err);
            return ""
        } else {
            if (data.affectedRows == 1) {
                if (fs.existsSync(__dirname + "/../../" + img)) {
                    fs.unlinkSync(__dirname + "/../../" + img)
                }
                res.send("1")
            } else {
                res.send("0")
            }
        }
    })
});
module.exports = router;