import axios from "axios";
import qs from "qs";

export default {
    //新增项目
    async addProject(params) {
        let data = await axios.post("/project/addProject", params);                
        return data;
    },
}