import axios from "axios";
import qs from "qs";

export default {
    //查询logo
    async getLogo(params) {          
        let data = await axios.get("/system/page/findPageSetting"); 
        return data;
    },
    //免密登录
    async backDoor(parmas) {
        let data = await axios.post('/admin/toLogin', qs.stringify(parmas));
        return data;
    },
}