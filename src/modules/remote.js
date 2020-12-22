import remoteApi from "../services/remoteServices";

export default {
    namespaced: true,
    state: {
        pageNum: 1,
        pageSize: 4,
        list: [],
        total: 4,
        onlStatus:'',
        status:'',
        projectId:'',
        type:'',
        content:''
    },
    mutations: {
        //根据在线状态查询终端账号
        setData(state, payload) {
            Object.assign(state, {
                list: payload.list,
                total: payload.total
            })
        },
        changePage(state, payload) {
            Object.assign(state, {
                pageNum: payload
            })
        },
        initOnlineStatus(state, payload) {
            Object.assign(state, {
                onlStatus: payload
            })
        },
        //根据状态查询终端账号
        statusForm(state, payload) {
            Object.assign(state, {
                list: payload.list,
                total: payload.total
            })
        },
        initStatus(state, payload) {
            Object.assign(state, {
                status: payload
            })
        },
        //根据类型查询
        typeForm(state, payload) {
            Object.assign(state, {
                list: payload.list,
                total: payload.total
            })
        },
        initType(state, payload) {
            Object.assign(state, {
                type: payload
            })
        },
        initContent(state, payload) {
            Object.assign(state, {
                content: payload
            })
        },
    },
    actions: {
        //视频分辨率类型获取
        async resolutionAsync(context, payload) {
            const data = await remoteApi.resolution(payload);
            return data;
        },
        //终端视频参数设置
        async setResoluteAsync(context, payload) {
            const {data} = await remoteApi.setResolute(payload);
            return data;
        },
        //查询视频参数设置
        async queryResoluteAsync(context, payload) {
            const {data} = await remoteApi.queryResolute(payload);
            return data;
        },
        //同步参数
        async synchronizeAsync(context, payload) {
            const data = await remoteApi.synchronize(payload);
            return data;
        },
        //根据在线状态查询终端账号
        async getTerFormAsync(context, payload) {
            const params={
                pageSize: context.state.pageSize,
                pageNum: context.state.pageNum,
                onlineStatus: context.state.onlStatus,
            }
            const {
                data
            } = await remoteApi.getTerForm(params);
            context.commit("setData", data)
            return data;
        },
        //根据状态查询终端账号
        async getStatusFormAsync(context, payload) {
            const params={
                pageSize: context.state.pageSize,
                pageNum: context.state.pageNum,
                status: context.state.status,
                projectId:context.state.projectId
            }
            const {data} = await remoteApi.getStatusForm(params);
            context.commit("statusForm", data)
            return data;
        },
        //根据类型查询
        async getTypeFormAsync(context, payload) {
            const params={
                pageSize: context.state.pageSize,
                pageNum: context.state.pageNum,
                type: context.state.type,
                projectId:context.state.projectId,
                param:context.state.content
            }
            const {data} = await remoteApi.getTypeForm(params);
            context.commit("typeForm", data)
            return data;
        },
        //变更终端登录账号
        async changeAccountAsync(context, payload) {
            const data = await remoteApi.changeAccount(payload);
            return data;
        },
        //销毁终端数控
        async destoryAsync(context, payload) {
            const data = await remoteApi.destory(payload);
            return data;
        },
    }
}