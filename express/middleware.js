// 中间件本质是一个回调函数，可以访问请求对象，响应对象。也是一个公共封装，节省操作。
// 中间件有全局中间件，路由中间件。

const expresss = require('express');
const fs = require('fs');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken');

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
// 路径举例：/css/index.css，如果无路径，默认重定向静态文件目录下的index.html
app.use(expresss.static(__dirname + '/public'));

/* 
登录判断中间件大概原理
*/
function checkLogin(req, res, next) {
    if (!req.session.username) {
        return res.redirect('/login');
    }
    next();
}

/* 
session中间件
*/
app.use(session({
    name: 'sid',
    secret: '签名',
    saveUnitialized: false,
    resave: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/project'
    }),
    cookie: {
        httpOnly: true, // js无法操作cookie，跨站请求脚本攻击。xss
        maxAge: 1000 * 30, // sessionId国企时间
    }
}));
// 简单模拟登录会话原理
app.get('/login', (req, res) => {
    if (req.query.username === 'admin' && req.query.password === 'admin') {
        req.session.username = 'admin';
        req.session.uid = 'sddf23432fdd';
        res.send('登陆成功');
    }
    else {
        res.send('登录失败');
    }
    // 登录判断
    if (req.session.username) {
        res.send('页面');
    }
    // 注销
    req.session.destroy();

    // token
    // 和小程序步骤一致。服务端拿到用户登录数据后用中间件生成。返回给客户端，客户端请求回调获取成功后保存至本地。

    UserModel.findOne({ username: req.username, password: md5(req.password) }, (err, data) => {
        // err 登录失败

        // data 登陆成功
        // 生成token，通过用户的请求返回
        const token = jwt.sign(
            {
                username: data.username,
                _id: data._id,
            },
            '签名编号值',
            {
                expiresIn: 60// 有效期，秒
            }
        )
        res.json({
            code: '200',
            data: token // {token:token} 
            // 后续请求放在header中的Authorization中
        })
    })


    // 校验
    jwt.verify(token, '签名编号值', (err, data) => {

        res.json({
            code: '200', // 500
            data: '成功/失败'
        })
    });
});




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
