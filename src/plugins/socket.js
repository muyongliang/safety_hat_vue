import Axios from 'axios';

// const WSS_URL = 'wss://' + window.location.host + '/video/web/'
// const WSS_URL = `ws://192.168.0.198:8083/video/web/`
// const WSS_URL = `ws://118.190.38.198:8080/video/web/`;
// const WSS_URL = `ws://47.104.189.23:8080/video/web/`
const WSS_URL = `wss://qiye.ytha-hd.com/video/web/`;

let Socket = '';
let setIntervalWesocketPush = null;
let num = 0;
// let userinfor = JSON.parse(sessionStorage.getItem('user'))


/**建立连接 */
export function createSocket(userinfor) {
  if (!Socket) {
    Socket = new WebSocket(WSS_URL + userinfor.account);
    Socket.onopen = onopenWS;
    Socket.onmessage = onmessageWS;
    Socket.onerror = onerrorWS;
    // Socket.onclose = oncloseWS
  } else if (Socket.readyState === 3) {
    num++;
    if (num > 10) {
      return false;
    }
    Socket = null;
    Socket = new WebSocket(WSS_URL + userinfor.account);
    Socket.onopen = onopenWS;
    Socket.onmessage = onmessageWS;
    Socket.onerror = onerrorWS;
  }
  {

  }
}
/**打开WS之后发送心跳 */
export function onopenWS() {


}
/**连接失败重连 */
export function onerrorWS() {

  // clearInterval(setIntervalWesocketPush)
  Socket.close();
  createSocket(JSON.parse(localStorage.getItem('user'))); //重连
}
/**WS数据接收统一处理 */
export function onmessageWS(e) {
  window.dispatchEvent(
    new CustomEvent('onmessageWS', {
      detail: {
        data: e,
      },
    })
  );
}
/**发送数据
 * @param eventType
 */
export function sendWSPush(eventTypeArr) {
  // const obj = {
  //   appId: 'airShip',
  //   cover: 0,
  //   event: eventTypeArr
  // }
  
  if (Socket !== null && Socket.readyState === 3) {
    Socket.close();
    createSocket(); //重连
  } else if (Socket.readyState === 1) {
    Socket.send(JSON.stringify(eventTypeArr));
  } else if (Socket.readyState === 0) {
    setTimeout(() => {
      Socket.send(JSON.stringify(eventTypeArr));
    }, 3000);
  }
}
/**关闭WS */
export function closeWS() {
  // clearInterval(setIntervalWesocketPush)
  Socket.close();
  // createSocket(JSON.parse(sessionStorage.getItem('user')))
}
// 获取权限
export async function getRoleDataList(paramss) {
  const { data: res } = await Axios.get('menu/getMenus', {
    params: paramss,
  });
  sessionStorage.resData = res.data;
}
/**发送心跳 */
export function sendPing() {
  Socket.send('ping');
  setIntervalWesocketPush = setInterval(() => {
    Socket.send('ping');
  }, 5000);
}
