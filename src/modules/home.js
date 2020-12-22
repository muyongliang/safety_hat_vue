import homeApi from "../services/homeService";

export default {
    namespaced: true,
    state: {
        pageNum: 1,
        pageSize: 3,
        status: "",
        list: [],
        total: 4,
        projectName: ""
    },
    mutations: {
        //全部
        allData(state, payload) {
            Object.assign(state, {
                list: payload.project.list,
                total: payload.count,
            })
        },
        changePage(state, payload) {
            Object.assign(state, {
                pageNum: payload
            })
        },
        initStatus(state, payload) {
            Object.assign(state, {
                pageNum: 1,
                status: payload
            })
        },
        initSearch(state, payload) {
            Object.assign(state, {
                projectName: payload
            })
        },
    },
    actions: {
        //添加项目
        async companyInforAsync(context, payload) {
            const { data } = await homeApi.companyInfor(payload);
            return data;
        },
        //项目列表分页并搜索
        async projectFormAsync(context) {
            const params = {
                pageSize: context.state.pageSize,
                pageNum: context.state.pageNum,
                status: context.state.status,
                projectName: context.state.projectName
            };
            const { data } = await homeApi.projectForm(params);
            context.commit("allData", data)
            return data;
        },
        //终端统计
        async terminalCountAsync(context, payload) {
            const { data } = await homeApi.terminalCount(payload);
            return data;
        },
        //查询所以项目经纬度
        async getProjectAsync(context, payload) {
            const { data } = await homeApi.getProject(payload);
            return data;
        },
        //消息中心状态
        async newsStateAsync(context, payload) {
            const { data } = await homeApi.newsState(payload);
            return data;
        },
        //未接来电状态
        async phoneStateAsync(context, payload) {
            const { data } = await homeApi.phoneState(payload);
            return data;
        },
    }
}