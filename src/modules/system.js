import systemApi from "../services/systemServices";

export default {
    namespaced: true,
    state: {
        pageNum: 1,
        pageSize: 10,
        list: [],
        total: 4,
    },
    mutations: {
        //全部
        newsData(state, payload) {            
            Object.assign(state, {
                list: payload.data.list,
                total:payload.data.total,
            })
        },
        changePage(state, payload) {
            Object.assign(state, {
                pageNum: payload
            })
        },

    },
    actions: {
        //消息中心数据获取
        async newsFormAsync(context) {
            const params = {
                pageSize: context.state.pageSize,
                pageNum: context.state.pageNum,
            };
            const {data} = await systemApi.newsForm(params);                       
            context.commit("newsData", data)
            return data;
        },
        //消息中心数据分页
        async changePageAsync(context,payload){
            context.commit("changePage",payload);
            const params = {
                pageSize: context.state.pageSize,
                pageNum: context.state.pageNum,
            };
            const {data} = await systemApi.newsForm(params);
            context.commit("newsData",data);
        },
        //消息中心获取状态
        async newsStateAsync(context, payload) {
            const {data} = await systemApi.newsState(payload);
            return data;
        },
        //消息中心改变状态
        async newsCheckAsync(context, payload) {
            const data = await systemApi.newsCheck(payload);
            return data;
        },
        //服务状态
        async serveStatusAsync(context, payload) {
            const data = await systemApi.serveStatus(payload);
            return data;
        },
        //终端app更新---页面刷新查询
        async appTerminalAsync(context, payload) {
            const {data} = await systemApi.appTerminal(payload);
            return data;
        },
        //终端app更新--更新版本设置
        async updateAppAsync(context, payload) {
            const data = await systemApi.updateApp(payload);
            return data;
        },
        //手动更新
        async updateByHandAsync(context, payload) {
            const data = await systemApi.updateByHand(payload);
            return data;
        },
    }
}