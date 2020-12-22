import phoneApi from "../services/phoneServices.js";

export default {
    namespaced: true,
    state: {
        pageNum: 1,
        pageSize: 5,
        list: [],
        total: 0,
        type: 0,
        startTime: "",
        endTime: ""
    },
    mutations: {
        phoneForm(state, payload) {
            Object.assign(state, {
                list: payload.data.list,
                total: payload.data.total
            })
        },
        initType(state, payload) {
            Object.assign(state, {
                type: payload
            })
        },
        initStart(state, payload) {
            Object.assign(state, {
                startTime: payload
            })
        },
        initEnd(state, payload) {
            Object.assign(state, {
                endTime: payload
            })
        },
        changePage(state, payload) {
            Object.assign(state, {
                pageNum: payload
            })
        },
        timeForm(state, payload) {
            Object.assign(state, {
                list: payload.data.list,
                total: payload.data.total
            })
        }
    },
    actions: {
        //按类型查询
        async byTypeAsync(context) {
            const params = {
                pageSize: context.state.pageSize,
                pageNum: context.state.pageNum,
                type: context.state.type,
            };
            ('类型查询数据', params);
            const { data } = await phoneApi.byType(params);//按通话类型分页查询  
            ('类型查询data', data);
            context.commit("phoneForm", data)
            return data;
        },
        //按时间段查询
        async byTimeAsync(context) {
            const params = {
                pageSize: context.state.pageSize,
                pageNum: context.state.pageNum,
                beginTime: context.state.startTime,
                endTime: context.state.endTime,
            };
            const { data } = await phoneApi.byTime(params);
            context.commit("timeForm", data)
            return data;
        },
        //刪除
        async deleteItemAsync(context, payload) {
            const { data } = await phoneApi.deleteItem(payload);
            return data;
        },
        //清空
        async emptyItemAsync(context, payload) {
            const { data } = await phoneApi.emptyItem(payload);
            return data;
        },
        //获取状态
        async getStatusAsync(context, payload) {
            const { data } = await phoneApi.getStatus(payload);
            return data;
        },
        //改变已读状态
        async changeStatusAsync(context, payload) {
            const { data } = await phoneApi.changeStatus(payload);
            return data;
        },
    }
}