import axios from "axios";
import qs from "qs";

export default {
    //查询轨迹
    async gettrack(params) {
        axios.defaults.baseURL = "";
        let {data} = await axios.get("/api/v3/track/gettrack", {params}); 
        axios.defaults.baseURL = "http://118.190.38.198:8080/";
        return data;
    },
    //实时轨迹
    async getlatestpoint (params) {
        axios.defaults.baseURL = "";
        let {data} = await axios.get("/api/v3/track/getlatestpoint", {params}); 
        axios.defaults.baseURL = "http://118.190.38.198:8080/";
        return data;
    },
}