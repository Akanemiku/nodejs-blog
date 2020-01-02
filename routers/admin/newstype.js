const express = require("express");
const router = express.Router();
const mysql = require("../../config/db.js");
router.get("/", function (req, res, nxet) {
    mysql.query("select *from newstype order by sort desc", function (err, data) {
        if (err) {
            return ""
        } else {
            res.render("admin/newstype/index.html", {
                data: data
            })
        }
    })
});
router.get("/add", function (req, res, nxet) {
    res.render("admin/newstype/add.html")
});
router.post("/add", function (req, res, next) {
    let {
        name, keywords, description, sort
    } = req.body;
    mysql.query("insert into newstype(name,keywords,description,sort) value(?,?,?,?)", [name, keywords, description, sort], function (err, data) {
        if (err) {
            console.log(err);
            return ""
        } else {
            if (data.affectedRows == 1) {
                res.send("<script>alert('分类添加成功');location.href ='/admin/newstype'</script>")
            } else {
                res.send("<script>alert('分类添加成功');history.go(-1) </script>")
            }
        }
    })
});
router.get("/edit", function (req, res, nxet) {
    let id = req.query.id;
    mysql.query("select * from newstype where id = ?", [id], function (err, data) {
        if (err) {
            return ""
        } else {
            res.render("admin/newstype/edit.html", {
                data: data[0]
            })
        }
    })
});
router.post("/edit", function (req, res, next) {
    let {
        name, keywords, description, sort, id
    } = req.body;
    console.log(id);
    mysql.query("update newstype set name = ?, keywords = ?, description = ?, sort = ? where id = ?", [name, keywords, description, sort, id], function (err, data) {
        if (err) {
            return err
        } else {
            console.log(data);
            if (data.affectedRows == 1) {
                res.send("<script>alert('分类数据修改成功');location.href ='/admin/newstype'</script>")
            } else {
                res.send("<script>alert('分类数据修改失败');history.go(-1) </script>")
            }
        }
    })
});
router.get('/ajax_del', function (req, res, next) {
    let id = req.query.id;
    mysql.query(`delete from newstype where id=${id}`, function (err, data) {
        if (err) {
            return ""
        } else {
            if (data.affectedRows == 1) {
                res.send('1')
            } else {
                res.send('0')
            }
        }
    })
});
router.get("/ajax_sort", function (req, res, next) {
    let {
        id, sort
    } = req.query;
    mysql.query("update newstype set sort = ? where id = ?", [sort, id], function (err, data) {
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