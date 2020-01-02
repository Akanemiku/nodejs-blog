let express = require("express");
let router = new express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({
    dest: "tmp/"
});
const uploads = require("../../common/uploads.js");
router.get("/", function(req, res, next) {
    let fileData = fs.readFileSync(__dirname + "/../../config/webConfig.json");
    let data = JSON.parse(fileData.toString());
    res.render("admin/system/index.html", {
        data: data
    })
});
router.post("/save", upload.single("logo"), function(req, res, next) {
    let imgRes = req.file;
    let {
        title, keywords, description, count, copyright, record, logo
    } = req.body;
    let newlogo = ""
    if (imgRes) {
        newlogo = uploads(imgRes)
    }
    let data = {
        title: title,
        keywords: keywords,
        description: description,
        copyright: copyright,
        record: record,
        count: count,
        logo: newlogo ? newlogo : logo
    }
    fs.writeFileSync(__dirname + "/../../config/webConfig.json", JSON.stringify(data));
    if (imgRes) {
        fs.unlinkSync(__dirname + "/../../" + logo)
    }
    res.send("<script>alert('修改成功');location.href='/admin/system'</script>")
});
module.exports = router;