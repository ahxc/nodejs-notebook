const http = require('http');

const url = require('url');
const { URL } = url;
const fs = require('fs');

// http默认80，https默认443

// 服务对象
const server = http.createServer((request, response) => {
    const requesturl = request.url; // 只包含路径与查询字符串
    const httpVersion = request.httpVersion; // 请求行
    const headers = request.headers; // 请求头，用的多

    response.statusCode = 404; // 或许可以根据状态码递交不同的页面
    response.statusMessage = '234';


    // 请求体
    let body = '';
    request.on('data', (chunk) => {
        body += chunk; // &连接
    });

    request.on('end', (chunk) => {
        console.log(body);
        response.end('hello,node.js');
    });

    // 如果有中文
    response.setHeader('content-type', 'text/html;charset=utf-8');
    // 收到请求后，编写响应体，不支持热更新
    response.write('hello, node.js'); // 终止后不能在调用，追加写入
    response.write('hello, node.js');
    // 设置响应体，然后终止响应，通知客户端关闭
    //     response.end(`
    //     <!DOCTYPE html>
    // <html lang="zh">

    // <head>
    //     <meta charset="UTF-8">
    //     <meta
    //       name="viewport"
    //       content="width=device-width, initial-scale=1.0"
    //     >
    //     <title>http</title>
    //     <style>

    //     </style>
    // </head>

    // <body>
    //     <form
    //       action="http://127.0.0.1:9000"
    //       method="post"
    //     >

    //         <input
    //           type="text"
    //           name="usename"
    //         >
    //         <input
    //           type="text"
    //           name="password"
    //         >
    //         <input
    //           type="submit"
    //           value="提交"
    //         >
    //     </form>
    // </body>

    // </html>
    //     `);

    // 127.0.0.1防止输入地址不全的情况
    const res = url.parse(URL(requesturl, 'http:127.0.0.1'), true); // search数据解析为query对象，否则原样输出字符串需要解析?和&
    // const requesturl2 = new URL(request.url);
    // requesturl2.searchParams.get('keyword');

    const html = fs.readFileSync(__dirname + '/http.html');
    // response.end(html); // 不能加载样式，js等，需额外处理，并end响应过去

    const { pathname } = res;

    // 设置一个根目录，方便静态资源查找，根据场景设定
    const root = __dirname + '/../'; // 返回上一级
    const filepath = __dirname + '/page' + pathname;
    fs.readFile(filepath, (err, data) => {
        if (err) {
            response.statusCode = 500;
            response.end('文件读取失败');
            return;
        }
        response.end(data);

        if (err.code === 'ENOENT') {
            response.end('404');
            // ENOENT: 文件或目录不存在。404
            // EISDIR: 尝试读取一个目录，就像它是一个文件一样。
            // EACCES: 用户没有足够的权限来读取文件。403
            // EPERM: 文件或目录不可读。403，其他一般都500
            // ENFILE: 系统的文件描述符已达到其上限。
            // EMFILE: 进程的文件描述符已达到其上限。
            // EFBIG: 文件太大，无法读取。
            // ENOSPC: 设备上没有足够的空间来读取文件。
            // EIO: 一个低级 I/O 错误发生。
            // EINTR: 一个信号被发送到进程，导致 readFile 函数调用失败。
            // EAGAIN: 在尝试读取文件时，系统无法分配更多的内存。

            return;
        }
    });

    // 静态资源返回原理
    switch (pathname) {
        case '/': // 主页面
            response.end(html);
            break;
        case '/index.css':
            const css = fs.readFileSync(__dirname + '/http.css');
            response.end(css);
            break;
        case '/index.js':
            const js = fs.readFileSync(__dirname + '/http.js');
            response.end(js);
            break;

        default:
            break;
    }

    if (request.method === 'get' && pathname === '/login') {
        response.end('登录页面');
    }

    else {
        // response.end('404');
    }
});

// 监听端口
server.listen(9000, () => {
    console.log('原神，启动');
});

/*
 url的相对路径
  */

// 静态资源引用通常使用相对路径，/css/index.css，防止域名变更。

/*
mime类型
*/
// mime类型是Multipurpose Internet Mail Extensions，互联网标准文件扩展，
// 使其能够支持非ASCII字符文本、非文本格式附件（二进制、声音、图像等）、
// 由多部分组成的消息体以及包含非ASCII字符的头信息。
// 它主要用于设定某种扩展名的文件用一种应用程序来打开的方式类型。
const mime = {
    "纯文本文件": "text/plain",
    "HTML文件": "text/html",
    "CSS文件": "text/css",
    "JavaScript文件": "application/javascript",
    "JSON文件": "application/json",
    "JPEG图像文件": "image/jpeg",
    "PNG图像文件": "image/png",
    "GIF图像文件": "image/gif",
    "SVG图像文件": "image/svg+xml",
    "MP3音频文件": "audio/mpeg",
    "WAV音频文件": "audio/wav",
    "MP4视频文件": "video/mp4",
    "PDF文件": "application/pdf",
    "ZIP文件": "application/zip",
    "XML文件": "application/xml",
    "CSV文件": "text/csv",
    '没有匹配到': 'application/octet-stream'
};
// mime设置更规范可加可不加，但有时可以解决一些乱码问题，此处多加了字符集。
// response.setHeader('content-type', 'text/html;charset=utf-8');