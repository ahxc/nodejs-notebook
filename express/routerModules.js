const express = require('express');
const app = express();
// 创建路由
const router = express.Router();

router.get('/home', (req, res) => {

});

module.exports = router;

// 导入
const homeRouter = require('./home.js');
app.use(homeRouter);