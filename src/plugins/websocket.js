// var websock = null
// var globalCallback = null
 
//  // 初始化websocket
// function initWebSocket () {
//   // ws地址 -->这里是你的请求路径
//   let userinfor = JSON.parse(sessionStorage.getItem('user'))
//   var ws= 'wss://118.190.38.198:8080/video/web/'
//   websock = new WebSocket(ws+userinfor.account)
//   websock.onmessage = function (e) {
//     websocketonmessage(e)
//   }
//   websock.onclose = function (e) {
//     websocketclose(e)
//   }
//   websock.onopen = function () {
//     websocketOpen()
//   }
 
//   // 连接发生错误的回调方法
//   websock.onerror = function () {
//     ('WebSocket连接发生错误')
//   }
// }
 
// // 实际调用的方法
// function sendSock (agentData, callback) {
//   globalCallback = callback
//   if (websock.readyState === websock.OPEN) {
//     // 若是ws开启状态
//     websocketsend(agentData)
//   } else if (websock.readyState === websock.CONNECTING) {
//     // 若是 正在开启状态，则等待1s后重新调用
//     setTimeout(function () {
//       sendSock(agentData, callback)
//     }, 1000)
//   } else {
//     // 若未开启 ，则等待1s后重新调用
//     setTimeout(function () {
//       sendSock(agentData, callback)
//     }, 1000)
//   }
// }
 
// // 数据接收
// function websocketonmessage (e) {
//   globalCallback(JSON.parse(e.data))
// }
 
// // 数据发送
// function websocketsend (agentData) {
//   websock.send(JSON.stringify(agentData))
// }
 
// // 关闭
// function websocketclose (e) {
//   ('connection closed (' + e.code + ')')
// }
 
// // 创建 websocket 连接
// function websocketOpen (e) {
//   ('连接成功')
// }
 
// initWebSocket()
 
// // 将方法暴露出去
// export {sendSock,websocketonmessage}