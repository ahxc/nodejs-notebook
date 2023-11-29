const express = require('express');

const app = express();

// 多用于多页面用的子页面扩展。
// 一行代码返回静态页面。使用静态资源中间件，分发包括html各种静态资源返回
// 127.0.0.1:9000没找到对应路由，static会304重定向至根目录index.html，其他的静态资源会根据路径查找。
app.use(express.static(__dirname + '/dist'));

/* 
获取请求体数据中间件
*/
const bodyParser = require('body-parser');

// 解析json
const json = bodyParser.json();
// 解析querystring
const urlEncodeParams = bodyParser.urlencoded({ extended: false });

app.get('/login', urlEncodeParams, (req, res) => {
    res.sendFile('登录页面');
    console.log(req.body); // 获取
});

app.listen(9000, () => {
    console.log('京东首页启动成功');
});