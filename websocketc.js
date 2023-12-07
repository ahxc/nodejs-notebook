
const websocket = new WebSocket('ws:/127.0.0.1:8080')

// readystate：
// 0 链接还没有建立
// 1 链接建立成功
// 2 链接正在关闭
// 3 链接已经关闭
console.log(websocket.readyState)

// 链接成功回调
websocket.onopen = function (params) {
    console.log(websocket.readyState)
}

// 封装消息发送
function sendMessage(message = '') {
    websocket.send(message) // 服务端 {type:'utf8,utf8Data:'message'}
}

// 消息接收
websocket.onmessage = function (msg) {
    console.log(msg.data)
}

/* socket.io */
const iosocket = io.connect('http://127.0.0.1:3000')

// 封装消息发送
function sendMessage(message = '') {
    iosocket.emit('sendMsg', message) // 服务端 {type:'utf8,utf8Data:'message'}
}

// 消息接收
iosocket.on('pushMsg', (data) => { })