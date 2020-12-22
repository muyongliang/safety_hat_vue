import axios from "axios";
import qs from "qs";

export default {
    //按通话类型分页查询
    async byType(params) {        
        let data = await axios.post("/missedCall/findMissedCalls", qs.stringify(params));        
        return data;
    },
    //按时间段查询分页
    async byTime(params) {        
        let data = await axios.post("/missedCall/findMissedCallsByTime", qs.stringify(params));        
        return data;
    },
    //删除
    async deleteItem(params) {        
        let data = await axios.post("/missedCall/delete", qs.stringify(params));        
        return data;
    },
    //清空
    async emptyItem(params) {        
        let data = await axios.get("/missedCall/clear", {params});        
        return data;
    },
    //获取状态
    async getStatus(params) {        
        let {data} = await axios.get("/missedCall/getNotViewCount", {params});        
        return data;
    },
    //改变已读状态
    async changeStatus(params) {        
        let data = await axios.post("/missedCall/changeStatus", qs.stringify(params));        
        return data;
    },
}