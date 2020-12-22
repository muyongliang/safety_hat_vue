import axios from "axios";
import qs from "qs";

export default {
    //根据类型获取警报列表
    async warnForm(params) {
        let {
            data
        } = await axios.get("/alarmRecord/list", {
            params
        });
        return data;
    },
    //详情
    async details(parmas) {
        let data = await axios.post('/contact/findContactDetail', qs.stringify(parmas));
        return data;
    },
    //查询报警状态id
    async warnState(params) {
        let {
            data
        } = await axios.get("/alarmRecord/handleUnreadAlarmRecordStatus", {
            params
        });
        return data;
    },
    //改变报警状态
    async changeState(parmas) {
        let data = await axios.post('/alarmRecord/handleUpdateAlarmRecordType', qs.stringify(parmas));
        return data;
    },
}