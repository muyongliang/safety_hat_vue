import axios from "axios";
import qs from "qs";

export default {
    //电话录音记录
    async cellRecordForm(params) {    
        let {data} = await axios.get("/phoneRecord/list", {params}); 
        return data;
    },
    //删除选定记录
    async deleteRecord(params) {    
        let {data} = await axios.post("/phoneRecord/delete", qs.stringify(params)); 
        return data;
    },
    //清空
    async empty(params) {    
        let {data} = await axios.post("/patrolRecord/deleteAll", qs.stringify(params)); 
        return data;
    },
    //语音链接
    async voiceUrl(params) {    
        let {data} = await axios.get("/phoneRecord/detail/"+params); 
        return data;
    },
}