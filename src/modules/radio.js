import radioApi from "../services/radioServices";

export default {
    namespaced: true,
    state: {
        tableList: [],
        detailList: '',
        AllDataList: {}
    },
    mutations: {
        setData(state, payload) {
            payload.data.list.forEach(el => {
                if (el.type === 1) {
                    el.type = '文字';
                } else if (el.type === 2) {
                    el.type = '语音';
                }
            });
            state.tableList = payload.data.list;
        },
        setDetail(state, payload) {
            state.detailList = payload;
            (state.detailList);
            sessionStorage.detailListMess = state.detailList.message
        },
        AllData(state, payload) {
            // ('查询记录', payload);

            state.AllDataList = payload.data
        }
    },
    actions: {
        //添加广播记录
        // async addRecordAsync(payload) {        
        //     let {data} = await radioApi.addRecord()    
        //     return data;
        // },
        //查询广播记录明细
        async detailAsync(context, payload) {
            // ('查询详细', payload)
            let {
                data
            } = await radioApi.detail(payload);
            ('明细', data)
            context.commit('setDetail', data);
            return data;
        },
        //删除广播记录
        async deleteAsync(context, payload) {
            let data = await radioApi.delete(payload)
            return data;
        },
        //清空记录
        async deleteAllAsync() {
            let data = await radioApi.deleteAll()
            return data;
        },
        //广播记录
        async listAsync(context, payload) {
            ('传递查询数据21123', payload);
            let data = await radioApi.list(payload)
            context.commit('setData', data);
            context.commit('AllData', data)
            ('查询记录', data);
            return data;
        },
        //导出excel
        async exportExcelAsync(context, payload) {
            let data = await radioApi.exportExcel(payload);
            return data;
        },
    }
}