const express = require('express');

const app = express();

// 路由// 路由
app.get('/', (request, res) => {
    res.end('hell express');
});

app.post('/login', (request, res) => {
    res.end('hell express');
});
// 任意请求
app.all('/test', (req, res) => {
    res.end();
});

// 通配符，404等场景
app.all('*', (req, res) => { });

app.get('/request', (req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log(req.httpVersion);
    console.log(req.headers);
    console.log(req.path);
    console.log(req.query);
    console.log(req.ip);
    console.log(req.get('host'));

});

// id
app.get('/12345.html', (req, res) => {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.end('详情页');
});

// 路由参数
const items = [];
app.get('/:id.html', (req, res) => {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    const { id } = req.params;

    const result = items.findIndex((item) => item.id === id);
    if (!result) {
        res.statusCode = 404;
        res.end('<h1>404</h1>');
    }

    // res的操作和方法兼容原生。
    res.redirect('http://123.com');
    res.download(__dirname + 'pacage.json'); // 浏览器会自动下载
    res.json({ test: '返回一个json页面给你' });
    res.sendFile(__dirname + '/test.html');
});

app.listen(9000, () => {

});