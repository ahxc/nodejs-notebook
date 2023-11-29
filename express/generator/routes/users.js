var express = require('express');
var router = express.Router();
var formidable = require("formidable"); // 不能用const let

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* 
处理文件上传
 */
router.post('/portrait', (req, res, next) => {
  // 创建form表单对象
  const form = formidable({
    multiples: true,
    uploadDir: __dirname + '/../public/images', // 路径上的文件夹必须事先创建
    keepExtensions: true // 保持后缀名
  });

  // 解析过来的表单
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const url = '/images/' + files.portrait.newFilename;

    res.send(url); // 必须放在form回调内部响应，否则会与form内部一些设置请求头方法发生顺序冲突，
  });
});

module.exports = router;
