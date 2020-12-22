import axios from "axios";
import qs from "qs";

export default {
    //视频分辨率类型获取
    async resolution(params) {    
        let {data} = await axios.get("/system/video/getResolutionType", {params}); 
        return data;
    },
    //终端视频参数设置
    async setResolute(params) {
        let data = await axios.post("/system/video/addVideoParamSetting", qs.stringify(params));                
        return data;
    },
    //查询视频参数设置
    async queryResolute(params) {    
        let {data} = await axios.get("/system/video/findVideoParamSetting", {params}); 
        return data;
    },
    //同步参数
    async synchronize(params) {    
        let {data} = await axios.get("/system/controller/synchronizeVideoParam", {params}); 
        return data;
    },
    //根据在线状态查询终端账号
    async getTerForm(params) {    
        let {data} = await axios.get("/client/findByOnlineStatus", {params}); 
        return data;
    },
    //根据状态查询终端账号
    async getStatusForm(params) {    
        let {data} = await axios.get("/client/findByStatus", {params}); 
        return data;
    },
    //根据类型查询
    async getTypeForm(params) {    
        let {data} = await axios.get("/client/findByParam", {params}); 
        return data;
    },
    //变更终端登录账号
    async changeAccount(params) {
        let {data} = await axios.post("/system/controller/changeClientAccount", qs.stringify(params));                
        return data;
    },
    //销毁终端数控
    async destory(params) {
        let {data} = await axios.post("/system/controller/destroyClientData", qs.stringify(params));                
        return data;
    },
}