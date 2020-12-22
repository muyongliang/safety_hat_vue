import axios from "axios";
import qs from "qs";

export default {
    //添加广播记录
    async addRecord() {
        let {
            data
        } = await axios.post("/broadcastRecord/addRecord");
        return data;
    },
    //查询广播记录明细
    async detail(params) {
        let {
            data
        } = await axios.get("/broadcastRecord/detail/" + params);
        return data;
    },
    //删除广播记录
    async delete(params) {
        let {
            data
        } = await axios.post("/broadcastRecord/delete", qs.stringify({
           ids: params
        }));
        return data;
    },
    //清空记录
    async deleteAll(params) {
        ('清空传递数据', params);

        let {
            data
        } = await axios.post("/broadcastRecord/deleteAll");
        return data;
    },
    //广播记录
    async list(params) {
        ('查询数据', params);

        let { data } = await axios.get("/broadcastRecord/list", { params });
        return data;
    },
    //导出excel
    async exportExcel(params) {
        let data = await axios.get("/broadcastRecord/exportExcel", params, {
            responseType: 'blob'
        });
        return data;
    },
}