import axios from "axios";
import qs from "qs";

export default {
    //查询对讲记录
    async getTalkList(parmas) {
        (parmas);

        let data = await axios.get("/talkBackRecord/list", {
            params: parmas
        });
        ('查询请求到数据', data)
        return data;
    },
    // 查询项目
    async getPid(parmas) {
        let data = await axios.get("/project/findByStatus", parmas);
        return data;
    },
    // 查询项目下的所有对讲组
    async getGroupId(parmas) {
        let parmasObj = {
            pageSize: 9999,
            pageNum: 1,
            projectId: parmas
        }
        let {
            data
        } = await axios.get(
            "/talkBack/findTalkBack", {params: parmasObj}
        );
        return data;
    },
    // 查看详情
    async getIdTalkList(parmas) {
        (parmas)
        // let lData = {
        //     pid: parmas.pid,
        //     groupId: parmas.groupId
        // };
        // ('最终上传数据', lData);

        let data = await axios.get('/talkBackRecord/detail/' + parmas);
        ('获取查询数据', data)
        return data;
    },
    // 根据ID删除对讲记录
    async deleteTalk(parmas) {
        let data = await axios.post('/talkBackRecord/delete', qs.stringify(parmas));
        return data;
    },
    // 查看详情
    // async detail(parmas) {
    //     let data = await axios.post('/talkBackRecord/listDetail', qs.stringify(parmas));
    //     return data;
    // },
}