// 导入express
const express = require("express");
// 实例化router
const router = express.Router();

// 导入数据库模块
const mysql = require("../../config/db.js");

// 格式化时间戳
const moment = require("moment");

// 导入分页方法
const page = require("../../common/page");

router.get("/", function (req, res, next) {
    // 第一步：获取页面,URL上的数据，如果URL上有p并带了数据，取得该p的数值，否则取1
    let p = req.query.p ? req.query.p : 1;
    // console.log(req.query)
    // 搜索
    let search = req.query.search ? req.query.search : "";
    // console.log(p);
    // 第二步：默认每页展示数据个数
    let size = 5;
    // 第二步：计算页码开始的位置
    let start = (p - 1) * size;
    // 第三步：统计数据库中数据总条数
    mysql.query("select count(*) tot from card where contact like ?", ['%' + search + '%'],
        function (err, data) {
            if (err) {
                console.log("[SELECT ERROR] - ", err.message);
                return '';
            } else {
                console.log(data);
                let tot = data[0].tot; //获取数据条数
                let fpage = page(tot, p, size); //
                // 从数据中查询相关数据
                mysql.query("select * from card where contact like ? order by publish_time desc limit ?,?",
                    [`%${search}%`, fpage.start, fpage.size], function (err, data) {
                        if (err) {
                            console.log("[SELECT ERROR] - ", err.message);
                            return '';
                        } else {
                            // 格式话时间戳
                            data.forEach(item => {
                                item.publish_time = moment(item.publish_time * 1000).format("YYYY-MM-DD");
                            });
                            // 加载新闻管理首页
                            res.render("admin/card/index.html", {data: data, search: search, show: fpage.show});
                        }
                    });

            }


        });
});


module.exports = router;