import axios from "axios";
import qs from "qs";

export default {
    //企业概况
    async companyInfor(params) {
        let { data } = await axios.get("/project/selectBusinessStatistics", qs.stringify({ params }));
        return data;
    },
    //项目列表分页并搜索
    async projectForm(params) {
        let { data } = await axios.get("/project/handleSelectProject", { params });
        return data;
    },
    //终端统计
    async terminalCount(params) {
        let { data } = await axios.get("/project/handleSelectClientStatistics", { params });
        return data;
    },
    //查询所以项目经纬度
    async getProject(params) {
        let { data } = await axios.get("/project/handleSelectAllProject", { params });
        return data;
    },
    //消息中心状态
    async newsState(params) {
        let { data } = await axios.get("/system/handleUnReadMessages", { params });
        return data;
    },
    //未接来电状态
    async phoneState(params) {
        let { data } = await axios.get("/missedCall/getNotViewCount", { params });
        return data;
    },
}