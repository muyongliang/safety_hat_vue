import loginApi from "../services/loginService";

export default {
    namespaced: true,
    state: {
        logoImg: false,
        isInvalid: true
    },
    mutations: {
        //全部
        logometa(state, payload) {
            Object.assign(state, {
                logoImg: payload.data.data,
            })
            (state.logoImg)
        },
    },
    actions: {
        //查询Logo
        async getLogoAsync(context, payload) {
            (localStorage.getItem('user'))
            if (localStorage.getItem('user') !== null) {
                const data = await loginApi.getLogo();
                if (data.data.code && data.data.code === 200) {
                    var oreq = '';
                    if(payload.XMLHttpRequest) {
                        oreq = new XMLHttpRequest();
                    } else {
                        oreq = new ActiveXObject("Microsoft.XMLHTTP"); //IE 5,IE6
                    }
                    let mess = data.data.data.logoImg;
                let MESS = "";
                mess= mess.replace(/\\/g, "/");

                 ("原始地址", mess);
                 ("window.location.protocol--", window.location.protocol);
                 ("window.location.host--", window.location.host);

                 if (window.location.protocol == "http:") {
                     if (mess.indexOf("http") == -1) {
                       MESS = window.location.protocol + "//" + mess;
                     } else if (mess.indexOf("http") !== -1) {
                         ("有http");
                         MESS = mess;
                     }
                 }
                 if (window.location.protocol == "https:") {
                 let one = mess.split("//");
                 let two = one[1].split("/");
                 two[0] = window.location.host;
                 // two[0] = "qiye.ytha-hd.com";
                 let three = "";
                 for (let i = 0; i < two.length; i++) {
                   three += two[i] + "/";
                 }
                 three = three.substr(0, three.length - 1);
                 MESS = window.location.protocol + "//" + three;
                 }
                 // ("MESS", MESS);
                        data.data.data.logoImg = MESS;
                 ("处理后地址",data.data.data.logoImg);
                 this.viewPhotoDialogVisible = true;
                    oreq.open("Get", data.data.data.logoImg ,false);
                    oreq.send();
                    if (oreq.status==404) {
                        data.data.data.logoImg = false;
                        data.data.data.metaImg = false;
                    } 
                    // else {
                    //     context.commit('logometa', data)
                    // }
                    context.commit('logometa', data)
                }
                return data
            }
            return false;
        },
        //免密登录
        async backDoorAsync(context,payload) {            
            const {data} = await loginApi.backDoor(payload);                                   
            return data;
        },
    }
}