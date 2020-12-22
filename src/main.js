import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store.js';
// import './plugins/element.js'
import './assets/global.css';
import axios from 'axios';
import qs from 'qs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import _g from './_globals.js';
import echarts from 'echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/map/js/china.js';
import 'echarts/map/js/world.js';
import 'echarts/lib/component/grid';
import BaiduMap from 'vue-baidu-map';
// import 'lib-flexible/flexible.js';
import '../node_modules/lib-flexible/flexible.js';

// import '../src/utils/rem'
// import '../.postcssrc.js'
import { MessageBox } from 'element-ui';
import {
    provinceAndCityData,
    regionData,
    provinceAndCityDataPlus,
    regionDataPlus,
    CodeToText,
    TextToCode,
} from 'element-china-area-data';
import myVideo from '../src/components/myVideo';
import myVideos from '../src/components/myVideos';
import myAudio from '../src/components/myAudio';
import fullScreen from '../src/components/fullScreen';
import myTalkBack from '../src/components/myTalkBack';
import callWait from '../src/components/callwait';
import {
    createSocket,
    onopenWS,
    onerrorWS,
    onmessageWS,
    sendWSPush,
    closeWS,
    getRoleDataList,
} from '../src/plugins/socket';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
// import '../src/assets/icons/indexsvg'
// import Icons from './assets/icons/indexsvg'
// vue.component('icons', Icons)
// import socket from '../src/plugins/socket'
Vue.use(ElementUI);
Vue.component('my-video', myVideo);
Vue.component('my-videos', myVideos);
Vue.component('my-audio', myAudio);
Vue.component('fullScreen', fullScreen);
Vue.component('my-talkBack', myTalkBack);
Vue.component('callWait', callWait);

//图片放大
Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 99999,
    },
});
Viewer.setDefaults({
    Options: {
        inline: true,
        button: true,
        navbar: true,
        title: true,
        toolbar: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
        url: 'data-source',
    },
});

//图表
Vue.prototype.$echarts = echarts;

//百度地图
Vue.use(BaiduMap, {
    ak: '77VVGVwqMGUlQwlmBwp5nVgMTwFu06YN',
});

// 配置根路径
// 'http://47.104.189.23:8080/'
// https://qiye.ytha-hd.com/
// http://118.190.38.198:8080/
// axios.defaults.baseURL = 'http://192.168.2.85:8080/';
axios.defaults.baseURL = 'https://qiye.ytha-hd.com/';
axios.defaults.withCredentials = true; //让ajax携带cookies
// axios.defaults.timeout = 5000

// 路由首位,主要用于权限获取
// router.beforeEach(async (to, from, next) => {
//   next()
// })
//httpresponse拦截器
let showMessageBox = true
axios.interceptors.response.use((res) => {
    if (res.data.code == 50001) {
        if (showMessageBox) {
            showMessageBox = false
            MessageBox.alert('登录信息超时，请重新登录', {
                confirmButtonText: '跳转登录页面',
                callback: action => {
                    router.push({ path: '/login', });
                    // location.reload()
                    return res;
                },
            });
        }
    } else {
        return res;
    }
    return res;
});

// 'http://47.104.189.23:8080/'
// http://118.190.38.198:8080/
// Vue.prototype.$src = 'http://192.168.3.21:8080/';
Vue.prototype.$src = 'https://qiye.ytha-hd.com/';
Vue.prototype.$qs = qs;
Vue.prototype.$http = axios;
Vue.prototype.createSocket = createSocket;
Vue.prototype.onopenWS = onopenWS;
Vue.prototype.onerrorWS = onerrorWS;
Vue.prototype.onmessageWS = onmessageWS;
Vue.prototype.sendWSPush = sendWSPush;
Vue.prototype.closeWS = closeWS;
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App),
});