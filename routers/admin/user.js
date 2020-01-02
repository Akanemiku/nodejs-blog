let express = require("express");
let router = new express.Router();
const mysql = require("../../config/db.js");
const moment = require("moment");
const page = require("../../common/page.js");
const multer = require("multer");
const upload = multer({
	dest: "tmp/"
});
const uploads = require("../../common/uploads");
router.get('/', function(req, res, next) {
	let p = req.query.p ? req.query.p : 1;
	let size = 5;
	let search = req.query.search ? req.query.search : "";
	mysql.query("select count(*) tot from user where username like ? ", ['%' + search + '%'], function(err, data) {
		if (err) {
			return ""
		} else {
			let tot = data[0].tot;
			let fpage = page(tot, p, size);
			mysql.query("select * from user where username like ? order by id desc limit ?,?", ['%' + search + '%', fpage.start, fpage.size], function(err, data) {
				if (err) {
					return ""
				} else {
					data.forEach(item => {
						item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss")
					}); res.render("admin/user/index.html", {
						data: data,
						search: search,
						show: fpage.show
					})
				}
			})
		}
	})
});
router.get('/ajax_status', function(req, res, next) {
	let {
		id, status
	} = req.query;
	mysql.query("update user set status= ? where id= ?", [status, id], function(err, data) {
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