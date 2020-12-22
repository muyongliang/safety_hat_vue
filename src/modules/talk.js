import talkApi from "../services/talkServices";

export default {
    namespaced: true,
    state: {
        talkList: '',
        pid: '',
        groupIdList: [],
        detailList: [],
        GroupList:[]
    },
    mutations: {
        setData(state, payload) {
            state.talkList = payload.data.data;
        },
        setPid(state, payload) {
            state.pid = payload.data.data;
        },
        setGroupId(state, payload) {
            state.groudId = payload.data.list;
            // ('123',state.groudId);
        },
        setDetailList(state, payload) {
            state.detailList = [];
            state.detailList.push(payload.data.data);
        },
        setGroupList(state, payload){
            state.GroupList = payload
        }
    },
    actions: {
        //   查询 添加对讲记录
        async getTalkListAsync(context, payload) {
            // ('查询上传数据', payload);
            let data = await talkApi.getTalkList(payload)
            context.commit('setData', data)
            // ('查询数据', data);

            return data;
        },
        // 查询项目ID
        async getPidAsync(context, payload) {
            let data = await talkApi.getPid(payload)
            context.commit('setPid', data)
            return data;
        },
        // 查询对讲组ID
        async getGroupIdAsync(context, payload) {
            let data = await talkApi.getGroupId(payload)
            if (data.code === 200) {
                context.commit('setGroupList', data.data.list)
            }
            return data.data.list;
        },
        // 查看详情
        async getIdTalkListAsync(context, payload) {
            let data = await talkApi.getIdTalkList(payload)
            if (data.data.code === 200) {
                context.commit('setDetailList', data)
            }
            return data;
        },
        // 根据ID删除对讲记录
        async deleteTalkAsync(context, payload) {
            let data = await talkApi.deleteTalk(payload);
            return data;
        },
        // 查看详情
        // async detailAsync(context, payload) {
        //     let data = await talkApi.detail(payload);
        //     if (data.code === 200) {
        //         context.commit('setDetailList', data)
        //     }
        //     return data;
        // },
    }
}