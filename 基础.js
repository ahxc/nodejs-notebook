
// cd
// dir
//  dir /s
//   cd ..
//    cd.

// pslist -dmx 9452 查看进程pid 9452的资源使用情况

// node hello world.js

// ./相对路径（命令行工作目录，而不是js脚本目录，比如最外层调用子文件夹的js，
// 会在最外层作为相对基准，子目录工作调用外层js同理）所以相对路径不太稳定，会随工作目录变化而变化
// 解决办法，绝对路肩 迁居变量： __dirname 所在文件当前目录的绝对路径，__filename包含文件名的绝对路径
const path = require('path');
fs.writeFile(path.resolve(__dirname, './test', 'index.html'), 'LOVE');
// sep分隔符
// path.sep === \

path.parse('url');// 分析路径 root 盘符，dir文件夹路径 D:\\a\\b，base 文件全名，ext 后缀名，name 文件名
// 可以分别获取上述内容
// path.basename .dirname .extname

/* 
buffer 的创建方式
 */
// alloc 10个字节
let buf = Buffer.alloc(10); // <Buffer 00 00 00 00 00 00 00 00 00 00> 

// allocUnsafe，复用内存，可能包含旧数据，alloc会清空，unsafe不会。但unsafe更快。
let buf_2 = Buffer.allocUnsafe(10);

// from
let buf_3 = Buffer.from('hello'); // <Buffer 68 65 6c 6c 6f> 转换为unicode码表数字，unicode兼容ascII码
// 或者直接使用asc码数组
let buf_4 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]); // <Buffer 69 6c 6f 76 65 79 6f 75>
// console.log(buf, buf_2, buf_3, buf_4);

// 转字符，还有utf-8的转换等
// console.log(buf_4.toString()); // iloveyou

// 获取数据
let code = Buffer.from('hello'); // 104，h的asc码，实际存的68 unicode码
code[0].toString(2);// 二进制 1101000，// 不会修改原数据
// 修改buffer
code[0] = 95;
// console.log(code,);// <Buffer 5f 65 6c 6c 6f> 68 变成了 5f。增伤改查都是asc，存储unicode

// 溢出
// buf[0]=361 // 最大存储255，舍弃高位数字， 0001 0110 1001 高于8位的数据全部舍弃，0110 1001 361 变成了69

// 中文
let cn = Buffer.from('你好'); // <Buffer e4 bd a0 e5 a5 bd> utf-8用了六个字节而不是两字节。你三个，好三个
// console.log(cn);

/* 
 fs，file system文件系统实现与硬盘的交互，文件读写和文件夹操作。
 */

// 导入fs模块
const fs = require("fs");

// 异步写入
fs.writeFile(
    './座右铭.txt', '加油，明天会不会更好，无所谓，但求无愧于心', (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('写入成功');
    });

// 同步写入
fs.writeFileSync('./座右铭.txt', '加油，明天会不会更好，无所谓，但求无愧于心');

// 追加写入
fs.appendFile('./座右铭.txt', '\r\n从善如流', (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('写入成功');
});

fs.appendFileSync('./座右铭.txt', '加油，明天会不会更好，无所谓，但求无愧于心');

// 流式写入，可以减少文件的频繁打开关闭，适合大文件和多次写入，上述则适合单次写入场景。
// 写入流对象，不是追加写入
const ws = fs.createWriteStream('./学习使我快乐.txt');
ws.write('最是人间留不住\r\n');
ws.write('朱颜辞镜花辞树\r\n');
// 关闭通道
ws.close();

// 文件读取
fs.readFile('./座右铭.txt', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data); // buffer
});

// 同步读取
fs.readFileSync('./座右铭.txt', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data.toString()); // buffer
});

// 读入流
const rs = fs.createReadStream('./webapi.png');
// 读取数据data事件
rs.on('data', (chunk) => {
    console.log(chunk.length); // 块 buffer对象，分了两次，65536字节,42070字节，64kb标准一个data，42kb，总共100多kb
});
// 读取数据终止事件
rs.on('end', () => {
    console.log('读取完成');
});

/*
综合案例，复制文件
*/
// 1
const webapi = fs.readFileSync('webapi.png');
fs.writeFileSync('webapi-copy.png', webapi);
// 2流式更节省内存，理想状态只需要64kb内存。
const webapiRsStream = fs.createReadStream('webapi.png');
const webapiWsStream = fs.createWriteStream('webapiStream.png');
// 读取数据data事件
// rs.on('data', (chunk) => {
//     console.log(chunk.length); // 块 buffer对象，分了两次，65536字节,42070字节，64kb标准一个data，42kb，总共100多kb
// });
// 流式读取，流式写入
// rs.on('data', (chunk) => {
//     ws.write(chunk);
// });

// 流式读写简便写法
webapiRsStream.pipe(webapiWsStream);

// 重命名，同步假sync没回调函数
fs.rename('./a.txt', './b.txt', (err) => {
    if (err) {
        console.log(err);
        return;
    }
});

// 移动，同步假sync
fs.rename('./a.txt', './c/a.txt', (err) => {
    if (err) {
        console.log(err);
        return;
    }
});

// 删除
fs.unlink('./a.txt', (err) => { }); // 适合删文件
fs.rm('./c', (err) => { }); // 适合删目录，连带子文件全部删除

/* 
文件夹操作
*/
// 创建文件夹，如果多个子文件夹，需要设置recursive为true，或则用回调
fs.mkdir('./a/b/c', { recursive: true }, (err) => { });

// 读取文件夹，返回一个数组，包含当前内容文件夹名字和文件名字后缀名
fs.readdir('../b', (err, data) => {
    if (err) {

    }

});

// 删除文件夹，不为空不能删。需要设置recursive为true，不推荐使用
fs.rmdir('./a', { recursive: true }, (err) => { });

/* 
文件状态
*/
fs.stat('./a.txt', (err, data) => {
    // 包含文件的信息 ：dev,mode,nlink,uid,size,等等
    data.isFile(); // 是否为文件类型
    data.isDirectory(); // 是否文件夹
});

