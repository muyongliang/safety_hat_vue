import axios from "axios";
import qs from "qs";

export default {
    //获取项目列表
    async getProject(params) {
        let data = await axios.get("/alarmRange/getProjectList", {params});                
        return data;
    },
    //按账号类型分页查询
    async byType(params) {        
        let data = await axios.post("/file/getListByType", qs.stringify(params));        
        return data;
    },
    //按时间段类型分页查询
    async byTime(params) {        
        let data = await axios.post("/file/getListByUploadTime", qs.stringify(params));        
        return data;
    },
    //按文件名称查询照片或视频
    async byName(params) {        
        let data = await axios.post("/file/getListByFileName", qs.stringify(params));        
        return data;
    },
    //按上传人姓名查询
    async byUpload(params) {        
        let data = await axios.post("/file/getListByName", qs.stringify(params));        
        return data;
    },
    //按账号查询
    async byAccount(params) {        
        let data = await axios.post("/file/getListByAccount", qs.stringify(params));        
        return data;
    },
    //修改名称
    async updateName(params) {        
        let data = await axios.post("/file/editFileName", qs.stringify(params));        
        return data;
    },
    //删除
    async deleteItem(params) {        
        let data = await axios.post("/file/deleteFile", qs.stringify(params));        
        return data;
    },
    //查看
    async checkDetail(params) {
        let data = await axios.get("/file/detail/"+params);                
        return data;
    },
    //定位
    async getLocation(params) {
        let user = {
            userName:params
        }
        let data = await axios.get("/file/getGps",{params:user});                
        return data;
    },
}