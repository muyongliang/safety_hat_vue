import project from "./modules/project.js";
import home from "./modules/home.js";
import electronics from './modules/electronics.js';
import datum from './modules/datum.js';
import phone from './modules/phone.js';
import system from './modules/system.js';
import remote from './modules/remote.js';
import cellRecord from './modules/cellRecord.js';
import patrolReport from './modules/patrolReport.js';
import radio from './modules/radio.js';
import login from './modules/login.js';
import talk from './modules/talk.js';
import track from './modules/track.js';
import warning from './modules/warning.js';

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// export default {
//     state: {
//         permissionList: []
//     },
//     mutations: {
//         updatePermissionList: (state, payload) => {
//             state.permissionList = payload
//         }
//     },
//     actions: {
//         getPermissionList: async ({
//             state,
//             commit
//         }) => {
//             // 这里是为了防止重复获取
//             if (state.permissionList.length) return
//             // 发送请求方法省略
//             const list = await api.getPermissionList()
//             commit('updatePermissionList', list)
//         }
//     }
// }


export default new Vuex.Store({
    strict: true,
    modules: {
        project,
        home,
        electronics,
        datum,
        phone,
        system,
        remote,
        cellRecord,
        patrolReport,
        radio,
        login,
        talk,
        track,
        warning
    }
});