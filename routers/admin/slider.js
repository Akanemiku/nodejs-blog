let express = require('express');
let router = new express.Router();
const multer = require("multer");
const upload = multer({
    dest: "tmp/"
});
const path = require('path');
const fs = require("fs");
const uploads = require("../../common/uploads.js");
const page = require("../../common/page.js");
const mysql = require('../../config/db.js');
router.get("/", function (req, res, next) {
    let p = req.query.p ? req.query.p : 1;
    let search = req.query.search ? req.query.search : "";
    let size = 5;
    let start = (p - 1) * size;
    mysql.query("select count(*) tot from banner where name like ? ", ['%' + search + '%'], function (err, data) {
        if (err) {
            return ''
        } else {
            let tot = data[0].tot;
            let fpage = page(tot, p, size);
            mysql.query("select * from banner where name like ? order by id desc limit ?,?", [`%${search}%`, fpage.start, fpage.size], function (err, data) {
                if (err) {
                    return ""
                } else {
                    res.render("admin/slider/index.html", {
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
    res.render('admin/slider/add.html')
});
router.post("/add", upload.single("img"), function (req, res, next) {
    let {
        name, url, sort
    } = req.body;
    let imgRes = req.file;
    let tmpPath = imgRes.path;
    let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000);
    let ext = path.extname(imgRes.originalname);
    let newPath = "/photo/slider/" + newName + ext;
    let fileData = fs.readFileSync(tmpPath);
    fs.writeFileSync(__dirname + "/../../" + newPath, fileData);
    mysql.query("insert into banner(name,url,sort,img) value(?,?,?,?)", [name, url, sort, newPath], function (err, data) {
        if (err) {
            return ""
        } else {
            if (data.affectedRows == 1) {
                res.send("<script>alert('添加成功');location.href='/admin/slider'</script>")
            } else {
                res.send("<script>alert('添加失败');history.go(-1)</script>")
            }
        }
    })
});
router.get("/edit", function (req, res, next) {
    let id = req.query.id;
    mysql.query("select * from banner where id = ? ", [id], function (err, data) {
        if (err) {
            return ""
        } else {
            res.render("admin/slider/edit.html", {
                data: data[0]
            })
        }
    })
});
router.post("/edit", upload.single("img"), function (req, res, next) {
    let imgRes = req.file;
    let {
        id, name, url, sort, oldimg
    } = req.body;
    let sql = "";
    let arr = []
    if (imgRes) {
        let img = uploads(imgRes, "slider");
        sql = "update banner set name = ?,url = ?,sort = ?, img = ? where id= ?";
        arr = [name, url, sort, img, id]
    } else {
        sql = "update banner set name = ?,url = ?,sort = ? where id= ?";
        arr = [name, url, sort, id]
    }
    mysql.query(sql, arr, function (err, data) {
        if (err) {
            return ""
        } else {
            if (data.affectedRows == 1) {
                if (fs.existsSync(__dirname + "/../../" + oldimg)) {
                    fs.unlinkSync(__dirname + "/../../" + oldimg)
                }
                res.send("<script>alert('修改成功');location.href ='/admin/slider' </script>")
            } else {
                res.send("<script>alert('修改失败');history.go(-1) </script>")
            }
        }
    })
});
router.get("/ajax_del", function (req, res, next) {
    let {
        id, img
    } = req.query;
    mysql.query("delete from banner where id = ?", [id], function (err, data) {
        if (err) {
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
router.get("/ajax_sort", function (req, res, next) {
    let {
        id, sort
    } = req.query;
    mysql.query("update banner set sort = ? where id = ? ", [sort, id], function (err, data) {
        if (err) {
            return ""
        } else {
            if (data.affectedRows == 1) {
                res.send("1")
            } else {
                res.send("0")
            }
        }
    })
});
module.exports = router;