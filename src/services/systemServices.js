import axios from "axios";
import qs from "qs";

export default {
    //消息中心数据获取
    async newsForm(params) {    
        let {data} = await axios.get("/system/handleSelectAllMessages", {params}); 
        return data;
    },
    //消息状态获取
    async newsState(params) {          
        let {data} = await axios.get("/system/handleUnReadMessages", {params}); 
        return data;
    },
    //消息查看
    async newsCheck(params) {
        let data = await axios.post("/system/handleUpdateFlag", qs.stringify(params));                
        return data;
    },
    //服务状态
    async serveStatus(params) {    
        let {data} = await axios.get("/system/serviceStatus", {params}); 
        return data;
    },
    //终端app更新---页面刷新查询
    async appTerminal(params) {    
        let {data} = await axios.get("/system/handleSelectAppSet", {params}); 
        return data;
    },
    //终端app更新--更新版本设置
    async updateApp(params) {
        let {data} = await axios.post("/system/handleUpdateAppVersionSet", qs.stringify(params));                
        return data;
    },
    //手动更新
    async updateByHand(params) {    
        let {data} = await axios.get("/system/handleUpdateManuallyApp", {params}); 
        return data;
    },
}