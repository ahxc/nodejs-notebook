/* 原生 npm install websocket */

var WebSocket = require('websocket').server

var http = require('http')

var httpServer = http.createServer()

httpServer.listen(8080, function (params) {

})

var wsServer = new WebSocket({
    httpServer: httpServer,
    autoAcceptConnections: false,
})

// 建立一个array缓存链接
var conArr = []

wsServer.on('request', function (request) {
    var connection = request.accept()
    conArr.push(connection) // 每建立一个链接就推入array

    // 接收客户端send的消息
    connection.on('message', function (msg) {
        console.log(msg)
        // 发送消息至链接的客户端
        // connection.send(msg.utf8Data)

        // 群发
        for (let i = 0; i < array.length; i++) {
            conArr[i].send(msg.utf8Data)
        }
    })
})

/* io框架 npm install socket.io */

const { server } = require('socket.io')
const io = new Server(httpServer, {
    // 跨域配置
    cors: {
        origin: '*', // 域名
        methods: ['GET', 'POST'],
    }
})

// 接收消息
io.on('connection', (socket) => {
    socket.on('sendMsg', (data) => {
        iosocket.emit('pushMsg', data)
    })
})

httpServer.listen(3000, function (params) {

})