import axios from "axios";
import qs from "qs";

export default {
    //获取项目列表
    async getProject(params) {
        let data = await axios.get("/alarmRange/getProjectList", { params });
        ('项目列表', data);

        return data;
    },
    //获取巡检报告记录列表
    async getReport(params) {
        let data = await axios.get("/patrolRecord/list", { params });
        return data;
    },
    //删除
    async deleteReport(params) {
        let { data } = await axios.post("/patrolRecord/delete", qs.stringify(params));
        return data;
    },
    //清空
    async empty(params) {
        let { data } = await axios.post("/patrolRecord/deleteAll", qs.stringify(params));
        return data;
    },
    //详情
    async details(params) {
        let { data } = await axios.get("/patrolRecord/detail/" + params);
        return data;
    },
}