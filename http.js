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


// 参考汇总

// 属性：

// http.globalAgent：全局的http agent，用于控制所有http请求的代理设置。
// http.Agent：用于创建新的http agent实例，用于控制单个http请求的代理设置。
// http.METHODS：列出所有支持的HTTP方法，例如GET、POST、DELETE等。

// 方法：

// http.createServer([requestListener])：创建一个新的HTTP服务器，使用requestListener处理每个请求。
// http.request(options[, callback])：创建一个新的HTTP客户端请求，可以通过options参数设置请求选项，如请求方法、请求头、请求路径等，使用callback处理响应数据。
// http.get(options[, callback])：创建一个新的HTTP GET请求，与http.request()相似，但自动设置HTTP方法为GET，并自动调用response.end()方法。
// http.Agent.prototype.request(options[, callback])：创建一个新的HTTP客户端请求，与http.request()相似，但可以通过Agent选项设置代理设置。
// http.Agent.prototype.sockets：一个WebSocket对象，用于监听新的连接事件。
// http.Agent.prototype.freeSockets：一个WebSocket对象，用于监听空闲连接事件。
// http.globalAgent.maxSockets：全局最大连接数限制。
// http.globalAgent.sockets：全局所有正在连接的Socket组成的数组。
// http.globalAgent.freeSockets：全局所有空闲的Socket组成的数组。
// http.globalAgent.keepAlive：是否启用长连接模式。
// http.ClientRequest.prototype.end([data][, encoding][, callback])：结束请求，可指定发送的数据和编码方式，或指定回调函数处理响应数据。
// http.ClientRequest.prototype.abort()：中止请求，关闭连接。
// http.httpSocketShutdown(callback)关闭当前Socket与服务器的连接。
// http.ServerResponse.prototype.writeHead(statusCode[, statusMessage][, headers])：发送HTTP响应头，包括状态码、响应头信息等。
// http.ServerResponse.prototype.end([data][, encoding][, callback])：结束响应，可指定发送的数据和编码方式，或指定回调函数处理响应数据。
// http.ServerResponse.prototype.write(chunk[, encoding][, callback])：发送响应数据块。
// http.ServerResponse.prototype.addTrailers(headers)添加HTTP响应尾部信息。
// http.ServerResponse.prototype.setTimeout(msecs, callback)设置超时时间。
// http.ServerResponse.prototype.flushHeaders()发送响应头信息到客户端并关闭内部缓冲区。
// http.ServerResponse.prototype._implicitHeader()设置响应头信息并发送给客户端。

// 属性方法：

// response.statusCode：HTTP响应的状态码，例如200、404等。
// response.statusMessage：HTTP响应的状态消息，例如"OK"、"Not Found"等。
// response.headers：HTTP响应的头部信息，以对象形式表示。
// response.body：HTTP响应的主体内容。
// response.method：HTTP请求的方法，例如GET、POST等。
// response.url：HTTP请求的URL。
// response.connection：连接对象，表示与客户端的连接。
// response.locals：一个对象，用于存储在请求期间有效的数据。
// response.append(name, value)：添加一个HTTP响应头部的额外字段。
// response.remove(name)：删除一个HTTP响应头部的字段。
// response.set(name, value)：设置一个HTTP响应头部的字段的值。

// 属性：

// response.req：请求对象，表示客户端发送的HTTP请求。
// response.res：响应对象，表示服务器的HTTP响应。
// response.locals：一个对象，用于存储在请求期间有效的数据。
// response.cookies：一个Cookie对象，用于设置和获取HTTP响应中的Cookie。
// response.signedCookies：一个已签名的Cookie对象，用于获取已签名的Cookie。
// response.redirects：一个数组，用于跟踪HTTP重定向的次数。
// response.close()：关闭与客户端的连接。