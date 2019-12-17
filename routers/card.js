// 后台路由文件

// 导入express
const express = require("express");

const cardModel = require("../dao/cardDao");


// 实例化
const router = express.Router();

const moment = require("moment");

router.post('/publish_card', function (req, res, next) {
    let {stu_no, stu_name, stu_school, lost_location, publish_time} = req.body;
    publish_time = moment().subtract(publish_time, 'days').unix();
    if (stu_no === "" || stu_name === "" || stu_school === "" || lost_location === "") {
        res.send("<script>alert('发布失败，请重新发布！');location.href = '/publishcard';</script>");
    } else {
        var params = [stu_no, stu_name, stu_school, lost_location, "1701040120", publish_time];
        cardModel.addCard(params, req, res, function (err, result) {
            if (result.affectedRows > 0) {
                res.send("<script>alert('发布成功！');location.href = '/publishcard';</script>");
            } else {
                res.send("<script>alert('发布失败，请重新发布！');location.href = '/publishcard';</script>");
            }
        })
    }

});

router.get('/getcardlist', function (req, res, next) {
    console.log(req.query.search);
    console.log(req.query.searchSchool);
    console.log(req.query.searchLocation);
    cardModel.getCardList(req.query.search, req.query.searchSchool, req.query.searchLocation, req, res, function (err, result) {
        res.end(JSON.stringify({list: result}));
    })

});

router.get('/detailcard', function (req, res, next) {
    cardModel.getDetailCard(req.query.id, req, res, function (err, result) {
        res.end(JSON.stringify(result));
    })

});

module.exports = router;