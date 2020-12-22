import patrolApi from "../services/patrolReportServices";

export default {
    namespaced: true,
    state: {
        projectId: '',
        pageNum: 1,
        pageSize: 5,
        list: [],
        total: 0,
        start: '',
        end: '',
        sendName: '',
        sendAccount: ''
    },
    mutations: {
        dataForm(state, payload) {
            Object.assign(state, {
                list: payload.data.list,
                total: payload.data.total
            })
        },
        initPid(state, payload) {
            Object.assign(state, {
                projectId: payload
            })
        },
        initStart(state, payload) {
            Object.assign(state, {
                start: payload
            })
        },
        initEnd(state, payload) {
            Object.assign(state, {
                end: payload
            })
        },
        initSendName(state, payload) {
            Object.assign(state, {
                sendName: payload
            })
        },
        initSendAccount(state, payload) {
            Object.assign(state, {
                sendAccount: payload
            })
        },
        changePage(state, payload) {
            Object.assign(state, {
                pageNum: payload
            })
        },
    },
    actions: {
        //获取项目
        async getProjectAsync(context, payload) {
            const { data } = await patrolApi.getProject(payload);
            return data;
        },
        //获取该项目下数据
        async getReportAsync(context) {
            const params = {
                limit: context.state.pageSize,
                page: context.state.pageNum,
                projectId: context.state.projectId,
                startTime: context.state.start,
                endTime: context.state.end,
                name: context.state.sendName,
                userName: context.state.sendAccount,
            };
            ('查询上传数据', params);

            const { data } = await patrolApi.getReport(params);
            context.commit("dataForm", data)
            ('查询项目数据', data);
            // if (data.data.list.length == 0){
                
            // }
                return data;
        },
        //删除
        async deleteReportAsync(context, payload) {
            const data = await patrolApi.deleteReport(payload);
            return data;
        },
        //清空
        async emptyAsync(context, payload) {
            const data = await patrolApi.empty(payload);
            return data;
        },
        //详情
        async detailsAsync(context, payload) {
            const data = await patrolApi.details(payload);
            return data;
        },
    }
}