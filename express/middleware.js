// 中间件本质是一个回调函数，可以访问请求对象，响应对象。也是一个公共封装，节省操作。
// 中间件有全局中间件，路由中间件。

const expresss = require('express');
const fs = require('fs');
const path = require('path');

const app = expresss();

// fs.writeFile('./access.log', '', (err) => {

// });

/* 
全局中间件
 */
function accessLog(req, res, next) {
    const { url, ip } = req;
    fs.appendFileSync(path.resolve(__dirname, `./access.log`), `${url}-${ip}\r\n`);
    next(); // 必须调用next，调完next继续调用路由回调，可以将错误传递给下一个中间件
}
app.use(accessLog); // 自动传入req，res

app.get('/admin', (req, res) => {
    const { url, ip } = req;
    res.send('前台首页');
});

/* 
路由中间件
 */
function checkCode(req, res, next) {
    if (req.query.code === '521') {

        res.send('设置页面');
        return;
    }
    res.send('暗号错误');
}
app.get('/setting', checkCode, (req, res) => {
});

/*
静态资源中间件static，其他的都有路由接管
*/
// 该中间件不需要你编写路由1.区分path是何种静态资源，2.然后fs读取，3.response.end返回静态资源
// 需要一个根目录，他会自己在根目录查找返回。还会自动设置mime类型
// 路径举例：/css/index.css，如果无路径，默认重定向文件夹下的index.html
app.use(expresss.static(__dirname + '/public'));

/* 
防盗链中间件，盗链即把外部网站的资源链接复制到自己的项目中，原理referer不是主域名则发送404.
当然referer是可以伪造的
*/
(req, res, next) => {
    const referer = req.get('referer');
    const url = new URL(referer);

    if (url.hostname !== '127.0.0.1') {
        res.status(404).send('404');
    }
    next();
};


app.listen(9000, () => {
    console.log('原神，启动');
});
