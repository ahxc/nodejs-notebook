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

    console.log(req.cookie); // 获取cookie

    // res的操作和方法兼容原生。
    res.redirect('http://123.com');
    res.download(__dirname + 'pacage.json'); // 浏览器会自动下载
    res.json({ msg: '成功', code: '200', data: null });// 接口 json写法
    res.sendFile(__dirname + '/test.html', { status: 200, headers: '' }, (err) => { }); // 发送一个模板，
    res.render(__dirname + '/test.html', { titile: '中国' });// 递交一个模板，title为模板中的变量
});

app.listen(9000, () => {

});

// 其他

// response.statusCode：HTTP响应的状态码，例如200、404等。可以设置响应的状态码，表示请求的处理结果。
// response.statusMessage：HTTP响应的状态消息，例如"OK"、"Not Found"等。可以设置响应的状态消息，用于描述响应的状态码的含义。
// response.headers：HTTP响应的头部信息，以对象形式表示。可以设置和获取响应的头部字段，例如Content-Type、Content-Length等。
// response.body：HTTP响应的主体内容。可以设置响应的主体内容，将其发送给客户端。通常可以使用response.send()方法或response.json()方法来发送响应主体。
// response.set(name, value)：设置响应头部的单个字段的值。可以传递一个包含字段名和值的对象，或者两个单独的参数来表示字段名和值。
// response.remove(name)：删除响应头部的指定字段。可以传递字段名作为参数来删除对应的字段。
// response.append(name, value)：添加一个响应头部的额外字段。可以传递一个包含字段名和值的对象，或者两个单独的参数来表示字段名和值。
// response.cookie(name, value, options)：设置一个Cookie的值。可以传递Cookie的名称、值和一个选项对象作为参数。选项对象可以包含过期时间、路径、域等属性。
// response.clearCookie(name, value, options)：清除cookie
// response.redirect(url[, options])：将客户端重定向到指定的URL。可以传递目标URL和一个选项对象作为参数。选项对象可以包含是否启用301重定向、是否在历史记录中记录等属性。