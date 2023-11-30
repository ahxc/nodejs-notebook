// npm i mongoose 默认端口：27017

const mongoose = require('mongoose');

// 数据库名称bilibili
mongoose.connect('mongodb://127.0.0.1:27017/bilibili');

// 连接成功回调
mongoose.connection.on('open', () => {
    console.log('open');
});

mongoose.connection.on('error', () => {
    console.log('error');
});

mongoose.connection.on('close', () => {
    console.log('close');
});

// 仅一次回调
mongoose.connection.once('open', () => {
    // 创建文档结构
    const authore = {
        type: String,
        required: true,
        default: '吴承恩',
        enum: [1, 2],// 枚举
        unique: true,// 唯一，需要重建集合才有效
    };
    const BookSchema = new mongoose.Schema({
        name: String,
        authore: String,
        price: Number,
        is_hot: Boolean,
        tags: Array,
        date: Date,
        mixed: mongoose.Schema.Types.Mixed, // 任意类型
        pid: mongoose.Schema.Types.ObjectId, // 另一文档id
        float_number: mongoose.SchemaType.Types.Decimal128 // 高精度数字
    });

    // 创建模型对象
    const BookModel = mongoose.model('books', BookSchema);

    // 注册
    BookModel.create({
        username: req.body.username,
        password: md5(req.body.password)
    }).then();

    // 登录
    BookModel.findOne({
        username: req.body.username, password: md5(req.body.password)
    }).then(() => {
        // 写入session
        req.session.username = data.username;
        req.session._id = data._id;
    });

    // 操作模型对象
    BookModel.create({
        name: '西游记',
        authore: '吴承恩',
        price: 19.9,
        is_hot: true,
        tags: [1, 2, 3],
        date: new Date(),
        // pid:, // 另一个文档id
    },).then((data) => {// 新版改promise回调，旧版5.0为第二个参数传递回调(err,data)=>{}
        console.log(data);
        mongoose.disconnect();
    }).catch((err) => {
        console.log(err);
    });


    // 批量
    BookModel.insertMany([{
        name: '西游记',
        authore: '吴承恩',
        price: 19.9,
        is_hot: true,
        tags: [1, 2, 3],
        date: new Date(),
        // pid:, // 另一个文档id
    }]);

    // 删除
    BookModel.deleteOne({ _id: 'sdf' });
    BookModel.deleteMany({ is_hot: true });

    // 更新
    BookModel.updateOne({ name: '西游记' }, { price: 9.9 });
    BookModel.updateMany({ name: '余华' }, { price: 9.9 });

    // 读取，可以用正则
    BookModel.findOne({ name: '狂飙' },);
    BookModel.findId('sdfasf');
    BookModel.find({ author: '余华' });

    // 严格查询，字段匹配必须存在，否则报错。
    mongoose.set('strictQuery', true);
});


// 关闭
// setTimeout(() => {
//     mongoose.disconnect();
//     console.log('closed');
// }, 2000);