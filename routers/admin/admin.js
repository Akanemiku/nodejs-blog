let express = require("express");
let router = new express.Router();
let mysql = require("../../config/db");
let crypto = require('crypto');
let moment = require('moment');
const page = require("../../common/page.js");
router.get('/', function(req, res, next) {
	let p = req.query.p ? req.query.p : 1;
	let search = req.query.search ? req.query.search : "";
	let size = 5;
	let start = (p - 1) * size;
	mysql.query("select count(*) tot from admin where username like ? ", ['%' + search + '%'], function(err, data) {
		if (err) {
			return ''
		} else {
			let tot = data[0].tot;
			let fpage = page(tot, p, size);
			mysql.query("select * from admin where username like ? order by id desc limit ?,?", [`%${search}%`, fpage.start, fpage.size], function(err, data) {
				if (err) {
					return ""
				} else {
					data.forEach(item => {
						item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss")
					}); res.render("admin/admin/index.html", {
						data: data,
						search: search,
						show: fpage.show
					})
				}
			})
		}
	})
});
router.get('/add', function(req, res, next) {
	res.render("admin/admin/add")
});
router.post("/add", function(req, res, next) {
	let {
		username, password, repassword, status
	} = req.body
	if (username) {
		if (username.length >= 6 && username.length <= 12) {
			if (password) {
				if (password == repassword) {
					mysql.query("select * from admin where username = ?", [username], function(err, data) {
						if (err) {
							return ""
						} else {
							console.log(data);
							if (data.length == 0) {
								let time = Math.round((new Date().getTime() / 1000));
								let md5 = crypto.createHash('md5');
								password = md5.update(password).digest('hex');
								mysql.query("insert into admin(username,password,status,time) value(?,?,?,?)", [username, password, status, time], function(err, data) {
									if (err) {
										console.log(err);
										return ""
									} else {
										if (data.affectedRows === 1) {
											res.send("<script>alert('管理员添加成功');location.href ='/admin/admin'</script>")
										} else {
											res.send("<script>alert('管理员添加失败');history.go(-1)</script>")
										}
									}
								})
							} else {
								res.send("<script>alert('该账户名已被注册，请重新输入');history.go(-1)</script>")
							}
						}
					})
				} else {
					res.send("<script>alert('两次输入的密码不一致');history.go(-1)</script>")
				}
			} else {
				res.send("<script>alert('请输入密码');history.go(-1)</script>")
			}
		} else {
			res.send("<script>alert('用户名长度在6-12位之间');history.go(-1)</script>")
		}
	} else {
		res.send("<script>alert('请输入用户名');history.go(-1)</script>")
	}
});
// 无刷新修改状态
router.get('/ajax_status', function(req, res, next) {
	let {
		id, status
	} = req.query;
	mysql.query("update admin set status= ? where id= ?", [status, id], function(err, data) {
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
//管理员管理修改页面
router.get('/edit', function(req, res, next) {
	let id = req.query.id;
	mysql.query("select * from admin where id = " + id, function(err, data) {
		if (err) {
			return ""
		} else {
			res.render("admin/admin/edit.html", {
				data: data[0]
			})
		}
	})
});

//管理员修改数据功能
router.post("/edit", function(req, res, next) {
	let {
		username, password, repassword, id, status
	} = req.body;
	let sql = "";
	if (password) {
		var md5 = crypto.createHash('md5');
		password = md5.update(password).digest('hex');
		sql = `update admin set status=${status},password='${password}'where id=${id}`
	} else {
		sql = `update admin set status=${status}where id=${id}`
	}
	mysql.query(sql, function(err, data) {
		if (err) {
			return ""
		} else {
			if (data.affectedRows == 1) {
				res.send("<script>alert('修改成功');location.href='/admin/admin'</script>")
			} else {
				res.send("<script>alert('修改失败');history.go(-1)</script>")
			}
		}
	})
});
//无刷新删除管理员数据
router.get('/ajax_del', function(req, res, next) {
	let id = req.query.id;
	mysql.query(`delete from admin where id=${id}`, function(err, data) {
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
module.exports = router;