import recordApi from "../services/cellRecordServices";

export default {
    namespaced: true,
    state: {
        pageNum: 1,
        pageSize: 4,
        list: [],
        total: 4,
        start: '',
        end: '',
        sendName: "",
        sendAccount: '',
        acceptName: '',
        acceptAccount: ''
    },
    mutations: {
        //全部
        recordData(state, payload) {
            Object.assign(state, {
                list: payload.list,
                total: payload.total,
            })
        },
        changePage(state, payload) {
            Object.assign(state, {
                pageNum: payload
            })
        },
        //查询
        searchData(state, payload) {
            Object.assign(state, {
                list: payload.list,
                total: payload.total,
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
        initAcceptName(state, payload) {
            Object.assign(state, {
                acceptName: payload
            })
        },
        initAcceptAccount(state, payload) {
            Object.assign(state, {
                acceptAccount: payload
            })
        },
    },
    actions: {
        //语音列表分页
        async cellRecordFormAsync(context) {
            const params = {
                limit: context.state.pageSize,
                page: context.state.pageNum,
            };
            const { data } = await recordApi.cellRecordForm(params);
            context.commit("recordData", data)
            ('查询数据', data);

            return data;
        },
        //查询
        async searchFormAsync(context) {
            const params = {
                limit: context.state.pageSize,
                page: context.state.pageNum,
                startTime: context.state.start,
                endTime: context.state.end,
                name: context.state.sendName,
                userName: context.state.sendAccount,
                toUserName: context.state.acceptAccount,
                toName: context.state.acceptName,
            };
            (params);
            // if (params.name == '') { return this.$message('请选择查询条件与输入查询内容') }
            const { data } = await recordApi.cellRecordForm(params);
            context.commit("searchData", data)
            ('检索查询', data);

            return data;
        },
        //删除
        async deleteRecordAsync(context, payload) {
            const data = await recordApi.deleteRecord(payload);
            return data;
        },
        //清空
        async emptyAsync(context, payload) {
            const data = await recordApi.empty(payload);
            return data;
        },
        //语音链接
        async voiceUrlAsync(context, payload) {
            const { data } = await recordApi.voiceUrl(payload);
            return data;
        },
    }
}