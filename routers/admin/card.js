const express = require("express");
const router = express.Router();
const mysql = require("../../config/db.js");
const moment = require("moment");
const page = require("../../common/page");
router.get("/", function(req, res, next) {
    let p = req.query.p ? req.query.p : 1;
    let search = req.query.search ? req.query.search : "";
    let size = 5;
    let start = (p - 1) * size;
    mysql.query("select count(*) tot from card where contact like ?", ['%' + search + '%'], function(err, data) {
        if (err) {
            console.log("[SELECT ERROR] - ", err.message);
            return ''
        } else {
            console.log(data);
            let tot = data[0].tot;
            let fpage = page(tot, p, size);
            mysql.query("select * from card where contact like ? order by publish_time desc limit ?,?", [`%${search}%`, fpage.start, fpage.size], function(err, data) {
                if (err) {
                    console.log("[SELECT ERROR] - ", err.message);
                    return ''
                } else {
                    data.forEach(item => {
                        item.publish_time = moment(item.publish_time * 1000).format("YYYY-MM-DD")
                    });
                    res.render("admin/card/index.html", {
                        data: data,
                        search: search,
                        show: fpage.show
                    })
                }
            })
        }
    })
});
module.exports = router;